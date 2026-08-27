const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { URL } = require("url");
const Database = require("better-sqlite3");

const PORT = Number(process.env.PORT || 3000);
const ROOT = path.resolve(__dirname, "..");
const PUBLIC = path.join(ROOT, "public");
const DATA_DIR = path.join(__dirname, "data");
const DB_PATH = path.join(DATA_DIR, "enterprise_erp.sqlite");
const SEED_SQL = path.join(DATA_DIR, "seed.sql");
const SECRET = process.env.JWT_SECRET || "rafidain-suite-enterprise-erp-2025-secret";

// First run: build the database from seed.sql if it does not exist yet.
if (!fs.existsSync(DB_PATH) && fs.existsSync(SEED_SQL)) {
  const tmp = new Database(DB_PATH);
  tmp.exec(fs.readFileSync(SEED_SQL, "utf8"));
  tmp.close();
  console.log("Database created from seed.sql");
}

const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

const MIME = { ".html":"text/html; charset=utf-8", ".css":"text/css; charset=utf-8", ".js":"application/javascript; charset=utf-8", ".svg":"image/svg+xml", ".json":"application/json; charset=utf-8" };

function send(res,status,payload,headers={}){const text=typeof payload==="string";res.writeHead(status,{"Content-Type":text?"text/plain; charset=utf-8":"application/json; charset=utf-8","Cache-Control":"no-store",...headers});res.end(text?payload:JSON.stringify(payload));}
const ok=(res,data={},message="OK")=>send(res,200,{success:true,message,data});
const created=(res,data={},message="Created")=>send(res,201,{success:true,message,data});
const fail=(res,status,error,details=null)=>send(res,status,{success:false,error,details});
function body(req){return new Promise((resolve,reject)=>{let raw="";req.on("data",c=>{raw+=c;if(raw.length>3000000){reject(new Error("Payload too large"));req.destroy();}});req.on("end",()=>{if(!raw)return resolve({});try{resolve(JSON.parse(raw));}catch{reject(new Error("Invalid JSON body"));}});});}
const all=(sql,params=[])=>db.prepare(sql).all(...params);
const get=(sql,params=[])=>db.prepare(sql).get(...params);
const run=(sql,params=[])=>db.prepare(sql).run(...params);
function hashPassword(password,salt){return crypto.createHash("sha256").update(`${salt}:${password}`).digest("hex");}
function signToken(payload){const h=Buffer.from(JSON.stringify({alg:"HS256",typ:"JWT"})).toString("base64url");const b=Buffer.from(JSON.stringify({...payload,exp:Date.now()+8*60*60*1000})).toString("base64url");const s=crypto.createHmac("sha256",SECRET).update(`${h}.${b}`).digest("base64url");return `${h}.${b}.${s}`;}
function verifyToken(token){try{const [h,b,s]=String(token||"").split(".");if(!h||!b||!s)return null;const e=crypto.createHmac("sha256",SECRET).update(`${h}.${b}`).digest("base64url");if(!crypto.timingSafeEqual(Buffer.from(s),Buffer.from(e)))return null;const p=JSON.parse(Buffer.from(b,"base64url").toString("utf8"));return p.exp>Date.now()?p:null;}catch{return null;}}
function user(req){const a=req.headers.authorization||"";return verifyToken(a.startsWith("Bearer ")?a.slice(7):"");}
function requireUser(req,res){const u=user(req);if(!u){fail(res,401,"Unauthorized");return null;}return u;}
function log(actor,action,module,record_id=null,metadata=""){run("INSERT INTO audit_log(actor,action,module,record_id,metadata) VALUES (?,?,?,?,?)",[actor,action,module,record_id,metadata]);}

const modules = {
  customers:{table:"customers",label:"Customers",fields:["code","name","segment","contact_person","phone","email","city","credit_limit","receivable_balance","status"],required:["code","name"],search:["code","name","segment","contact_person","city"]},
  crm:{table:"crm_leads",label:"CRM Leads",fields:["lead_no","company_name","contact_person","phone","source","stage","expected_value","probability","next_followup","owner","status"],required:["lead_no","company_name"],search:["lead_no","company_name","contact_person","source","stage","owner"]},
  vendors:{table:"vendors",label:"Vendors",fields:["code","name","category","contact_person","phone","email","city","payable_balance","status"],required:["code","name"],search:["code","name","category","contact_person","city"]},
  warehouses:{table:"warehouses",label:"Warehouses",fields:["code","name","location","manager","capacity","utilization","status"],required:["code","name"],search:["code","name","location","manager"]},
  inventory:{table:"inventory_items",label:"Inventory",fields:["sku","name","category","warehouse_id","unit","qty_on_hand","reorder_point","cost_price","sale_price","status"],required:["sku","name"],search:["sku","name","category","unit","status"]},
  stock:{table:"stock_movements",label:"Stock Movements",fields:["movement_no","item_id","warehouse_id","movement_type","qty","reference","movement_date","notes"],required:["movement_no","item_id","movement_type"],search:["movement_no","movement_type","reference","notes"]},
  sales:{table:"sales_orders",label:"Sales Orders",fields:["order_no","customer_id","order_date","due_date","status","subtotal","tax","total","owner","notes"],required:["order_no","customer_id"],search:["order_no","status","owner","notes"]},
  invoices:{table:"invoices",label:"Invoices",fields:["invoice_no","customer_id","invoice_date","due_date","status","subtotal","tax","total","paid_amount","balance_due"],required:["invoice_no","customer_id"],search:["invoice_no","status"]},
  purchases:{table:"purchase_orders",label:"Purchase Orders",fields:["po_no","vendor_id","po_date","expected_date","status","subtotal","tax","total","buyer","notes"],required:["po_no","vendor_id"],search:["po_no","status","buyer","notes"]},
  accounts:{table:"accounts",label:"Chart of Accounts",fields:["account_no","account_name","type","parent_account","opening_balance","current_balance","status"],required:["account_no","account_name"],search:["account_no","account_name","type"]},
  journals:{table:"journal_entries",label:"Journal Entries",fields:["entry_no","entry_date","account_id","description","debit","credit","reference","status"],required:["entry_no","account_id"],search:["entry_no","description","reference","status"]},
  employees:{table:"employees",label:"Employees",fields:["employee_no","full_name","job_title","department","manager","phone","email","hire_date","salary","status"],required:["employee_no","full_name"],search:["employee_no","full_name","job_title","department","manager"]},
  attendance:{table:"attendance",label:"Attendance",fields:["attendance_no","employee_id","work_date","check_in","check_out","hours","status","notes"],required:["attendance_no","employee_id","work_date"],search:["attendance_no","work_date","status","notes"]},
  payroll:{table:"payroll",label:"Payroll",fields:["payroll_no","employee_id","period","base_salary","allowance","deduction","net_pay","status","paid_date"],required:["payroll_no","employee_id","period"],search:["payroll_no","period","status"]},
  projects:{table:"projects",label:"Projects",fields:["project_no","name","client_name","project_manager","start_date","end_date","budget","actual_cost","progress","status"],required:["project_no","name"],search:["project_no","name","client_name","project_manager","status"]},
  tasks:{table:"tasks",label:"Tasks",fields:["task_no","project_id","title","assignee","priority","status","due_date","progress"],required:["task_no","title"],search:["task_no","title","assignee","priority","status"]},
  approvals:{table:"approvals",label:"Approvals",fields:["approval_no","request_type","requester","amount","status","approver","requested_at","decided_at","notes"],required:["approval_no","request_type"],search:["approval_no","request_type","requester","status","approver"]},
  documents:{table:"documents",label:"Documents",fields:["doc_no","title","category","owner","file_url","version","status"],required:["doc_no","title"],search:["doc_no","title","category","owner","status"]},
  assets:{table:"assets",label:"Assets",fields:["asset_no","name","category","location","custodian","purchase_date","purchase_value","book_value","status"],required:["asset_no","name"],search:["asset_no","name","category","location","custodian"]},
  tickets:{table:"support_tickets",label:"Support Tickets",fields:["ticket_no","title","module","requester","priority","status","assigned_to","due_date"],required:["ticket_no","title"],search:["ticket_no","title","module","requester","priority","status"]}
};

function whereSearch(config,q){q=String(q||"").trim().toLowerCase();if(!q)return {sql:"",params:[]};return {sql:" WHERE "+config.search.map(f=>`LOWER(${f}) LIKE ?`).join(" OR "),params:config.search.map(()=>`%${q}%`)};}
function listModule(key,q){const c=modules[key];const w=whereSearch(c,q);return all(`SELECT * FROM ${c.table}${w.sql} ORDER BY id DESC LIMIT 500`,w.params);}
function validate(c,data){for(const f of c.required){if(!String(data[f]??"").trim())throw new Error(`${f} is required`);}}
function createModule(key,data){const c=modules[key];validate(c,data);const result=run(`INSERT INTO ${c.table}(${c.fields.join(",")}) VALUES (${c.fields.map(()=>"?").join(",")})`,c.fields.map(f=>data[f]??""));return get(`SELECT * FROM ${c.table} WHERE id=?`,[Number(result.lastInsertRowid)]);}
function updateModule(key,id,data){const c=modules[key];validate(c,data);run(`UPDATE ${c.table} SET ${c.fields.map(f=>`${f}=?`).join(",")}, updated_at=CURRENT_TIMESTAMP WHERE id=?`,[...c.fields.map(f=>data[f]??""),id]);return get(`SELECT * FROM ${c.table} WHERE id=?`,[id]);}

async function api(req,res,pathname,search){
  if(req.method==="GET"&&pathname==="/api/health")return ok(res,{status:"running",database:"SQLite",modules:Object.keys(modules).length,year:2025});
  if(req.method==="POST"&&pathname==="/api/auth/login"){const data=await body(req);const u=get("SELECT * FROM users WHERE username=? AND active=1",[data.username||""]);if(!u)return fail(res,401,"Invalid credentials");if(hashPassword(String(data.password||""),u.salt)!==u.password_hash)return fail(res,401,"Invalid credentials");const token=signToken({id:u.id,username:u.username,role:u.role,full_name:u.full_name});log(u.full_name,"Logged in","auth",u.id);return ok(res,{token,user:{id:u.id,full_name:u.full_name,username:u.username,role:u.role,department:u.department}});}
  const current=requireUser(req,res); if(!current)return;

  if(req.method==="GET"&&pathname==="/api/me")return ok(res,{user:current,company:get("SELECT * FROM company WHERE id=1"),modules:Object.fromEntries(Object.entries(modules).map(([k,v])=>[k,{label:v.label,fields:v.fields}]))});
  if(req.method==="GET"&&pathname==="/api/dashboard"){
    const revenue=get("SELECT COALESCE(SUM(total),0) value FROM invoices WHERE status IN ('paid','sent','overdue')").value;
    const collected=get("SELECT COALESCE(SUM(paid_amount),0) value FROM invoices").value;
    const receivables=get("SELECT COALESCE(SUM(balance_due),0) value FROM invoices").value;
    const payables=get("SELECT COALESCE(SUM(payable_balance),0) value FROM vendors").value;
    const payroll=get("SELECT COALESCE(SUM(net_pay),0) value FROM payroll WHERE status IN ('paid','draft')").value;
    const inventoryValue=get("SELECT COALESCE(SUM(qty_on_hand*cost_price),0) value FROM inventory_items").value;
    const salesByMonth=all("SELECT substr(invoice_date,1,7) month, SUM(total) total FROM invoices GROUP BY substr(invoice_date,1,7) ORDER BY month");
    const moduleCounts=Object.fromEntries(Object.entries(modules).map(([k,v])=>[k,get(`SELECT COUNT(*) value FROM ${v.table}`).value]));
    return ok(res,{
      kpis:{revenue,collected,receivables,payables,payroll,inventoryValue,lowStock:get("SELECT COUNT(*) value FROM inventory_items WHERE qty_on_hand <= reorder_point").value,pendingApprovals:get("SELECT COUNT(*) value FROM approvals WHERE status='pending'").value,openTasks:get("SELECT COUNT(*) value FROM tasks WHERE status NOT IN ('done','closed')").value,activeEmployees:get("SELECT COUNT(*) value FROM employees WHERE status='active'").value},
      moduleCounts,
      salesByMonth,
      lowStock:all("SELECT * FROM inventory_items WHERE qty_on_hand <= reorder_point ORDER BY qty_on_hand ASC LIMIT 8"),
      approvals:all("SELECT * FROM approvals ORDER BY id DESC LIMIT 6"),
      tasks:all("SELECT * FROM tasks ORDER BY id DESC LIMIT 8"),
      projects:all("SELECT * FROM projects ORDER BY id DESC LIMIT 6"),
      audit:all("SELECT * FROM audit_log ORDER BY id DESC LIMIT 10")
    });
  }
  if(req.method==="GET"&&pathname==="/api/reports")return ok(res,{topCustomers:all("SELECT c.name, SUM(i.total) total FROM invoices i JOIN customers c ON c.id=i.customer_id GROUP BY c.id ORDER BY total DESC LIMIT 6"),inventoryByWarehouse:all("SELECT w.name, SUM(i.qty_on_hand*i.cost_price) value FROM inventory_items i LEFT JOIN warehouses w ON w.id=i.warehouse_id GROUP BY w.id ORDER BY value DESC"),projectHealth:all("SELECT status, COUNT(*) count, SUM(budget) budget, SUM(actual_cost) cost FROM projects GROUP BY status"),aging:all("SELECT status, COUNT(*) count, SUM(balance_due) balance FROM invoices GROUP BY status")});
  if(req.method==="GET"&&pathname==="/api/company")return ok(res,get("SELECT * FROM company WHERE id=1"));
  if(req.method==="PUT"&&pathname==="/api/company"){const data=await body(req);run("UPDATE company SET name_ar=?,name_en=?,legal_name=?,industry=?,address=?,phone=?,email=?,website=?,fiscal_year=?,currency=?,tax_percent=?,brand_color=?,updated_at=CURRENT_TIMESTAMP WHERE id=1",[data.name_ar,data.name_en,data.legal_name,data.industry,data.address,data.phone,data.email,data.website,data.fiscal_year,data.currency,Number(data.tax_percent||0),data.brand_color||"#2A6DF4"]);log(current.full_name,"Updated company profile","company",1);return ok(res,get("SELECT * FROM company WHERE id=1"));}

  const m=pathname.match(/^\/api\/modules\/([a-z]+)(?:\/(\d+))?$/);
  if(m){const key=m[1],id=m[2]?Number(m[2]):null;if(!modules[key])return fail(res,404,"Module not found");try{
    if(req.method==="GET"&&!id)return ok(res,listModule(key,search.get("q")));
    if(req.method==="GET"&&id){const row=get(`SELECT * FROM ${modules[key].table} WHERE id=?`,[id]);return row?ok(res,row):fail(res,404,"Record not found");}
    if(req.method==="POST"&&!id){const row=createModule(key,await body(req));log(current.full_name,`Created ${modules[key].label}`,key,row.id);return created(res,row);}
    if(req.method==="PUT"&&id){const row=updateModule(key,id,await body(req));log(current.full_name,`Updated ${modules[key].label}`,key,id);return ok(res,row);}
    if(req.method==="DELETE"&&id){run(`DELETE FROM ${modules[key].table} WHERE id=?`,[id]);log(current.full_name,`Deleted ${modules[key].label}`,key,id);return ok(res,{id});}
  }catch(err){return fail(res,400,err.message);}}
  return fail(res,404,"API route not found");
}

function serve(req,res,pathname){let file=pathname==="/" ? path.join(PUBLIC,"index.html") : path.join(PUBLIC,pathname);file=path.normalize(file);if(!file.startsWith(PUBLIC))return send(res,403,"Forbidden");if(!fs.existsSync(file)||fs.statSync(file).isDirectory())file=path.join(PUBLIC,"index.html");const ext=path.extname(file);res.writeHead(200,{"Content-Type":MIME[ext]||"application/octet-stream","Cache-Control":ext===".html"?"no-store":"public, max-age=3600"});fs.createReadStream(file).pipe(res);}
http.createServer(async(req,res)=>{try{const url=new URL(req.url,`http://${req.headers.host}`);if(url.pathname.startsWith("/api/"))return await api(req,res,url.pathname,url.searchParams);return serve(req,res,decodeURIComponent(url.pathname));}catch(err){console.error(err);return fail(res,500,err.message||"Server error");}}).listen(PORT,()=>{console.log(`RafidainSuite Enterprise ERP running at http://localhost:${PORT}`);console.log("Login: admin / admin2025");});
