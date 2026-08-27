const http = require("http");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");
const Database = require("better-sqlite3");

const PORT = Number(process.env.PORT || 3000);
const ROOT = path.resolve(__dirname, "..");
const PUBLIC = path.join(ROOT, "public");
const DATA_DIR = path.join(__dirname, "data");
const DB_PATH = path.join(DATA_DIR, "qassitha.sqlite");
const SEED_SQL = path.join(DATA_DIR, "seed.sql");

// First run: build the database from seed.sql if missing.
if (!fs.existsSync(DB_PATH) && fs.existsSync(SEED_SQL)) {
  const tmp = new Database(DB_PATH);
  tmp.exec(fs.readFileSync(SEED_SQL, "utf8"));
  tmp.close();
  console.log("Database created from seed.sql");
}

const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".json": "application/json; charset=utf-8"
};

function send(res, status, payload, headers = {}) {
  const text = typeof payload === "string";
  res.writeHead(status, {
    "Content-Type": text ? "text/plain; charset=utf-8" : "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    ...headers
  });
  res.end(text ? payload : JSON.stringify(payload));
}
const ok = (res, data = {}, message = "OK") => send(res, 200, { success: true, message, data });
const created = (res, data = {}, message = "Created") => send(res, 201, { success: true, message, data });
const fail = (res, status, error) => send(res, status, { success: false, error });

function body(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (c) => {
      raw += c;
      if (raw.length > 1_000_000) {
        reject(new Error("Payload too large"));
        req.destroy();
      }
    });
    req.on("end", () => {
      if (!raw) return resolve({});
      try { resolve(JSON.parse(raw)); } catch { reject(new Error("Invalid JSON body")); }
    });
  });
}

const all = (sql, params = []) => db.prepare(sql).all(...params);
const get = (sql, params = []) => db.prepare(sql).get(...params);
const run = (sql, params = []) => db.prepare(sql).run(...params);

const intval = (v) => Math.max(0, Math.round(Number(v) || 0));

// ----- helpers -----
function addMonths(dateStr, months) {
  const d = new Date(dateStr + "T00:00:00");
  d.setMonth(d.getMonth() + months);
  return d.toISOString().slice(0, 10);
}

// Recomputes a debt's status from its installments.
function refreshDebtStatus(debtId) {
  const inst = all("SELECT amount, paid_amount, due_date, status FROM installments WHERE debt_id = ?", [debtId]);
  const totalDue = inst.reduce((s, i) => s + i.amount, 0);
  const totalPaid = inst.reduce((s, i) => s + i.paid_amount, 0);
  const today = new Date().toISOString().slice(0, 10);
  let status = "active";
  if (totalPaid >= totalDue && totalDue > 0) {
    status = "settled";
  } else if (inst.some((i) => i.status !== "paid" && i.due_date < today)) {
    status = "overdue";
  }
  run("UPDATE debts SET status = ?, updated_at = datetime('now') WHERE id = ?", [status, debtId]);
  return status;
}

function debtSummary(debt) {
  const inst = all("SELECT * FROM installments WHERE debt_id = ? ORDER BY seq", [debt.id]);
  const paid = inst.reduce((s, i) => s + i.paid_amount, 0);
  const remaining = debt.total_amount - paid;
  const contact = get("SELECT name, phone FROM contacts WHERE id = ?", [debt.contact_id]);
  return { ...debt, contact_name: contact ? contact.name : "", contact_phone: contact ? contact.phone : "", paid, remaining, installments: inst };
}

// ----- API -----
async function api(req, res, pathname, search) {
  if (req.method === "GET" && pathname === "/api/health") {
    return ok(res, { status: "running", database: "SQLite", app: "Qassitha" });
  }

  // settings
  if (req.method === "GET" && pathname === "/api/settings") {
    return ok(res, get("SELECT * FROM settings WHERE id = 1"));
  }
  if (req.method === "PUT" && pathname === "/api/settings") {
    const d = await body(req);
    run("UPDATE settings SET owner_name=?, business_name=?, phone=?, currency=?, updated_at=datetime('now') WHERE id=1",
      [String(d.owner_name || "حسابي"), String(d.business_name || ""), String(d.phone || ""), String(d.currency || "IQD")]);
    return ok(res, get("SELECT * FROM settings WHERE id = 1"), "تم حفظ الإعدادات");
  }

  // dashboard
  if (req.method === "GET" && pathname === "/api/dashboard") {
    const today = new Date().toISOString().slice(0, 10);
    const monthStart = today.slice(0, 8) + "01";
    const monthEnd = addMonths(monthStart, 1);

    const owedToMe = get(`SELECT COALESCE(SUM(i.amount - i.paid_amount),0) v
      FROM installments i JOIN debts d ON d.id = i.debt_id
      WHERE d.direction='owed_to_me' AND d.status != 'settled'`).v;
    const iOwe = get(`SELECT COALESCE(SUM(i.amount - i.paid_amount),0) v
      FROM installments i JOIN debts d ON d.id = i.debt_id
      WHERE d.direction='i_owe' AND d.status != 'settled'`).v;
    const overdue = all(`SELECT i.*, d.title, d.contact_id, d.direction, c.name contact_name
      FROM installments i JOIN debts d ON d.id = i.debt_id JOIN contacts c ON c.id = d.contact_id
      WHERE i.status != 'paid' AND i.due_date < ? ORDER BY i.due_date ASC LIMIT 20`, [today]);
    const dueThisMonth = all(`SELECT i.*, d.title, d.direction, c.name contact_name
      FROM installments i JOIN debts d ON d.id = i.debt_id JOIN contacts c ON c.id = d.contact_id
      WHERE i.status != 'paid' AND i.due_date >= ? AND i.due_date < ? ORDER BY i.due_date ASC LIMIT 20`, [today, monthEnd]);

    return ok(res, {
      kpis: {
        owedToMe, iOwe, net: owedToMe - iOwe,
        overdueCount: overdue.length,
        activeDebts: get("SELECT COUNT(*) v FROM debts WHERE status != 'settled'").v,
        contacts: get("SELECT COUNT(*) v FROM contacts").v
      },
      overdue, dueThisMonth
    });
  }

  // contacts
  if (req.method === "GET" && pathname === "/api/contacts") {
    const q = String(search.get("q") || "").trim().toLowerCase();
    const rows = q
      ? all("SELECT * FROM contacts WHERE LOWER(name) LIKE ? OR phone LIKE ? ORDER BY name", [`%${q}%`, `%${q}%`])
      : all("SELECT * FROM contacts ORDER BY name");
    return ok(res, rows);
  }
  if (req.method === "POST" && pathname === "/api/contacts") {
    const d = await body(req);
    const name = String(d.name || "").trim();
    if (!name) return fail(res, 400, "الاسم مطلوب");
    const r = run("INSERT INTO contacts (name, phone, note) VALUES (?,?,?)",
      [name, String(d.phone || ""), String(d.note || "")]);
    return created(res, get("SELECT * FROM contacts WHERE id = ?", [Number(r.lastInsertRowid)]));
  }

  // debts list
  if (req.method === "GET" && pathname === "/api/debts") {
    const dir = search.get("direction");
    const where = dir === "owed_to_me" || dir === "i_owe" ? " WHERE direction = ?" : "";
    const rows = all(`SELECT * FROM debts${where} ORDER BY id DESC`, where ? [dir] : []);
    return ok(res, rows.map(debtSummary));
  }

  // single debt
  const debtMatch = pathname.match(/^\/api\/debts\/(\d+)$/);
  if (debtMatch && req.method === "GET") {
    const debt = get("SELECT * FROM debts WHERE id = ?", [Number(debtMatch[1])]);
    return debt ? ok(res, debtSummary(debt)) : fail(res, 404, "الدين غير موجود");
  }
  if (debtMatch && req.method === "DELETE") {
    run("DELETE FROM debts WHERE id = ?", [Number(debtMatch[1])]);
    return ok(res, { id: Number(debtMatch[1]) }, "تم حذف الدين");
  }

  // create debt + auto-schedule installments
  if (req.method === "POST" && pathname === "/api/debts") {
    const d = await body(req);
    const contactId = Number(d.contact_id);
    const title = String(d.title || "").trim();
    const total = intval(d.total_amount);
    const count = Math.max(1, Math.min(60, Math.round(Number(d.installments_count) || 1)));
    const direction = d.direction === "i_owe" ? "i_owe" : "owed_to_me";
    const startDate = String(d.start_date || new Date().toISOString().slice(0, 10));

    if (!contactId || !get("SELECT id FROM contacts WHERE id = ?", [contactId])) return fail(res, 400, "اختر جهة صحيحة");
    if (!title) return fail(res, 400, "عنوان الدين مطلوب");
    if (total <= 0) return fail(res, 400, "المبلغ لازم يكون أكبر من صفر");

    const createDebt = db.transaction(() => {
      const r = run(`INSERT INTO debts (contact_id, title, direction, total_amount, installments_count, start_date, note)
        VALUES (?,?,?,?,?,?,?)`, [contactId, title, direction, total, count, startDate, String(d.note || "")]);
      const debtId = Number(r.lastInsertRowid);

      // قسّم المبلغ بالتساوي مع تصحيح آخر قسط للكسور
      const base = Math.floor(total / count);
      const stmt = db.prepare("INSERT INTO installments (debt_id, seq, due_date, amount) VALUES (?,?,?,?)");
      for (let s = 1; s <= count; s++) {
        const amount = s === count ? total - base * (count - 1) : base;
        stmt.run(debtId, s, addMonths(startDate, s - 1), amount);
      }
      return debtId;
    });
    const debtId = createDebt();
    refreshDebtStatus(debtId);
    return created(res, debtSummary(get("SELECT * FROM debts WHERE id = ?", [debtId])), "تم إنشاء الدين وجدولة الأقساط");
  }

  // record a payment against an installment
  if (req.method === "POST" && pathname === "/api/payments") {
    const d = await body(req);
    const instId = Number(d.installment_id);
    const amount = intval(d.amount);
    const inst = get("SELECT * FROM installments WHERE id = ?", [instId]);
    if (!inst) return fail(res, 404, "القسط غير موجود");
    if (amount <= 0) return fail(res, 400, "مبلغ الدفعة لازم يكون أكبر من صفر");

    const remaining = inst.amount - inst.paid_amount;
    if (amount > remaining) return fail(res, 400, `الدفعة أكبر من المتبقّي على القسط (${remaining})`);

    const method = ["cash", "zaincash", "asiahawala", "transfer"].includes(d.method) ? d.method : "cash";
    const payDate = String(d.pay_date || new Date().toISOString().slice(0, 10));

    const pay = db.transaction(() => {
      run("INSERT INTO payments (debt_id, installment_id, amount, pay_date, method, note) VALUES (?,?,?,?,?,?)",
        [inst.debt_id, instId, amount, payDate, method, String(d.note || "")]);
      const newPaid = inst.paid_amount + amount;
      const status = newPaid >= inst.amount ? "paid" : "partial";
      run("UPDATE installments SET paid_amount = ?, status = ?, paid_at = ? WHERE id = ?",
        [newPaid, status, status === "paid" ? payDate : null, instId]);
    });
    pay();
    refreshDebtStatus(inst.debt_id);
    return created(res, debtSummary(get("SELECT * FROM debts WHERE id = ?", [inst.debt_id])), "تم تسجيل الدفعة");
  }

  return fail(res, 404, "المسار غير موجود");
}

function serve(req, res, pathname) {
  let file = pathname === "/" ? path.join(PUBLIC, "index.html") : path.join(PUBLIC, pathname);
  file = path.normalize(file);
  if (!file.startsWith(PUBLIC)) return send(res, 403, "Forbidden");
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) file = path.join(PUBLIC, "index.html");
  const ext = path.extname(file);
  res.writeHead(200, {
    "Content-Type": MIME[ext] || "application/octet-stream",
    "Cache-Control": ext === ".html" ? "no-store" : "public, max-age=3600"
  });
  fs.createReadStream(file).pipe(res);
}

http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    if (url.pathname.startsWith("/api/")) return await api(req, res, url.pathname, url.searchParams);
    return serve(req, res, decodeURIComponent(url.pathname));
  } catch (err) {
    console.error(err);
    return fail(res, 500, err.message || "Server error");
  }
}).listen(PORT, () => {
  console.log(`قسّطها · Qassitha running at http://localhost:${PORT}`);
});
