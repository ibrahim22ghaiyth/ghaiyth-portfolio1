-- RafidainSuite ERP — full schema + seed data (auto-generated)
PRAGMA foreign_keys = OFF;
BEGIN TRANSACTION;

DROP TABLE IF EXISTS company;
CREATE TABLE company (
  id INTEGER PRIMARY KEY CHECK(id=1),
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  legal_name TEXT NOT NULL,
  industry TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  website TEXT NOT NULL,
  fiscal_year TEXT NOT NULL,
  currency TEXT NOT NULL,
  tax_percent REAL NOT NULL DEFAULT 0,
  brand_color TEXT DEFAULT '#2A6DF4',
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name TEXT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  role TEXT NOT NULL,
  department TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS roles;
CREATE TABLE roles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  role_key TEXT NOT NULL UNIQUE,
  role_name TEXT NOT NULL,
  permissions TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS customers;
CREATE TABLE customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  segment TEXT,
  contact_person TEXT,
  phone TEXT,
  email TEXT,
  city TEXT,
  credit_limit INTEGER DEFAULT 0,
  receivable_balance INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS crm_leads;
CREATE TABLE crm_leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lead_no TEXT NOT NULL UNIQUE,
  company_name TEXT NOT NULL,
  contact_person TEXT,
  phone TEXT,
  source TEXT,
  stage TEXT,
  expected_value INTEGER DEFAULT 0,
  probability INTEGER DEFAULT 0,
  next_followup TEXT,
  owner TEXT,
  status TEXT DEFAULT 'open',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS vendors;
CREATE TABLE vendors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category TEXT,
  contact_person TEXT,
  phone TEXT,
  email TEXT,
  city TEXT,
  payable_balance INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS warehouses;
CREATE TABLE warehouses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  location TEXT,
  manager TEXT,
  capacity INTEGER DEFAULT 0,
  utilization INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS inventory_items;
CREATE TABLE inventory_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sku TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  warehouse_id INTEGER,
  unit TEXT NOT NULL,
  qty_on_hand INTEGER DEFAULT 0,
  reorder_point INTEGER DEFAULT 0,
  cost_price INTEGER DEFAULT 0,
  sale_price INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(warehouse_id) REFERENCES warehouses(id) ON DELETE SET NULL
);

DROP TABLE IF EXISTS stock_movements;
CREATE TABLE stock_movements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  movement_no TEXT NOT NULL UNIQUE,
  item_id INTEGER NOT NULL,
  warehouse_id INTEGER,
  movement_type TEXT NOT NULL,
  qty INTEGER NOT NULL,
  reference TEXT,
  movement_date TEXT NOT NULL,
  notes TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(item_id) REFERENCES inventory_items(id) ON DELETE RESTRICT,
  FOREIGN KEY(warehouse_id) REFERENCES warehouses(id) ON DELETE SET NULL
);

DROP TABLE IF EXISTS sales_orders;
CREATE TABLE sales_orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_no TEXT NOT NULL UNIQUE,
  customer_id INTEGER NOT NULL,
  order_date TEXT NOT NULL,
  due_date TEXT,
  status TEXT DEFAULT 'draft',
  subtotal INTEGER DEFAULT 0,
  tax INTEGER DEFAULT 0,
  total INTEGER DEFAULT 0,
  owner TEXT,
  notes TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(customer_id) REFERENCES customers(id) ON DELETE RESTRICT
);

DROP TABLE IF EXISTS invoices;
CREATE TABLE invoices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  invoice_no TEXT NOT NULL UNIQUE,
  customer_id INTEGER NOT NULL,
  invoice_date TEXT NOT NULL,
  due_date TEXT,
  status TEXT DEFAULT 'sent',
  subtotal INTEGER DEFAULT 0,
  tax INTEGER DEFAULT 0,
  total INTEGER DEFAULT 0,
  paid_amount INTEGER DEFAULT 0,
  balance_due INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(customer_id) REFERENCES customers(id) ON DELETE RESTRICT
);

DROP TABLE IF EXISTS purchase_orders;
CREATE TABLE purchase_orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  po_no TEXT NOT NULL UNIQUE,
  vendor_id INTEGER NOT NULL,
  po_date TEXT NOT NULL,
  expected_date TEXT,
  status TEXT DEFAULT 'open',
  subtotal INTEGER DEFAULT 0,
  tax INTEGER DEFAULT 0,
  total INTEGER DEFAULT 0,
  buyer TEXT,
  notes TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(vendor_id) REFERENCES vendors(id) ON DELETE RESTRICT
);

DROP TABLE IF EXISTS accounts;
CREATE TABLE accounts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  account_no TEXT NOT NULL UNIQUE,
  account_name TEXT NOT NULL,
  type TEXT NOT NULL,
  parent_account TEXT,
  opening_balance INTEGER DEFAULT 0,
  current_balance INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS journal_entries;
CREATE TABLE journal_entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  entry_no TEXT NOT NULL UNIQUE,
  entry_date TEXT NOT NULL,
  account_id INTEGER NOT NULL,
  description TEXT,
  debit INTEGER DEFAULT 0,
  credit INTEGER DEFAULT 0,
  reference TEXT,
  status TEXT DEFAULT 'posted',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(account_id) REFERENCES accounts(id) ON DELETE RESTRICT
);

DROP TABLE IF EXISTS employees;
CREATE TABLE employees (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  employee_no TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  job_title TEXT,
  department TEXT,
  manager TEXT,
  phone TEXT,
  email TEXT,
  hire_date TEXT,
  salary INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS attendance;
CREATE TABLE attendance (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  attendance_no TEXT NOT NULL UNIQUE,
  employee_id INTEGER NOT NULL,
  work_date TEXT NOT NULL,
  check_in TEXT,
  check_out TEXT,
  hours REAL DEFAULT 0,
  status TEXT DEFAULT 'present',
  notes TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS payroll;
CREATE TABLE payroll (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  payroll_no TEXT NOT NULL UNIQUE,
  employee_id INTEGER NOT NULL,
  period TEXT NOT NULL,
  base_salary INTEGER DEFAULT 0,
  allowance INTEGER DEFAULT 0,
  deduction INTEGER DEFAULT 0,
  net_pay INTEGER DEFAULT 0,
  status TEXT DEFAULT 'draft',
  paid_date TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(employee_id) REFERENCES employees(id) ON DELETE RESTRICT
);

DROP TABLE IF EXISTS projects;
CREATE TABLE projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_no TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  client_name TEXT,
  project_manager TEXT,
  start_date TEXT,
  end_date TEXT,
  budget INTEGER DEFAULT 0,
  actual_cost INTEGER DEFAULT 0,
  progress INTEGER DEFAULT 0,
  status TEXT DEFAULT 'planned',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS tasks;
CREATE TABLE tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  task_no TEXT NOT NULL UNIQUE,
  project_id INTEGER,
  title TEXT NOT NULL,
  assignee TEXT,
  priority TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'open',
  due_date TEXT,
  progress INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE SET NULL
);

DROP TABLE IF EXISTS approvals;
CREATE TABLE approvals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  approval_no TEXT NOT NULL UNIQUE,
  request_type TEXT NOT NULL,
  requester TEXT NOT NULL,
  amount INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending',
  approver TEXT,
  requested_at TEXT NOT NULL,
  decided_at TEXT,
  notes TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS documents;
CREATE TABLE documents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  doc_no TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  category TEXT,
  owner TEXT,
  file_url TEXT,
  version TEXT DEFAULT '1.0',
  status TEXT DEFAULT 'active',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS assets;
CREATE TABLE assets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  asset_no TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category TEXT,
  location TEXT,
  custodian TEXT,
  purchase_date TEXT,
  purchase_value INTEGER DEFAULT 0,
  book_value INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS support_tickets;
CREATE TABLE support_tickets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ticket_no TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  module TEXT,
  requester TEXT,
  priority TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'open',
  assigned_to TEXT,
  due_date TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS audit_log;
CREATE TABLE audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  actor TEXT NOT NULL,
  action TEXT NOT NULL,
  module TEXT NOT NULL,
  record_id INTEGER,
  metadata TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- company (1)
INSERT INTO company (id,name_ar,name_en,legal_name,industry,address,phone,email,website,fiscal_year,currency,tax_percent,brand_color,updated_at) VALUES (1,'مجموعة الرافدين الصناعية','Rafidain Industrial Group','Rafidain Industrial Group LLC','Industrial distribution, logistics, and field service operations','Baghdad Business District, Al-Jadriya, Tower B, Floor 12','+964 770 555 2025','erp-office@rafidain-group.example','www.rafidain-group.example','FY-2025','IQD',0.0,'#2A6DF4','2026-06-11 22:44:34');

-- users (3)
INSERT INTO users (id,full_name,username,email,password_hash,salt,role,department,active,created_at) VALUES (1,'Ibrahim Ghaiyth','admin','ibrahim@rafidain-group.example','44b534294207dc1ed2f1c4a9879fb5e2dab861460b05c09e9780d6bfa5fdae20','rafidain-suite-enterprise-2025','Super Admin','Technology',1,'2026-06-11 22:44:34');
INSERT INTO users (id,full_name,username,email,password_hash,salt,role,department,active,created_at) VALUES (2,'Dina Mahdi','finance','finance@rafidain-group.example','44b534294207dc1ed2f1c4a9879fb5e2dab861460b05c09e9780d6bfa5fdae20','rafidain-suite-enterprise-2025','Finance Manager','Finance',1,'2026-06-11 22:44:34');
INSERT INTO users (id,full_name,username,email,password_hash,salt,role,department,active,created_at) VALUES (3,'Layth Kareem','operations','ops@rafidain-group.example','44b534294207dc1ed2f1c4a9879fb5e2dab861460b05c09e9780d6bfa5fdae20','rafidain-suite-enterprise-2025','Operations Manager','Operations',1,'2026-06-11 22:44:34');

-- roles (5)
INSERT INTO roles (id,role_key,role_name,permissions,created_at) VALUES (1,'super_admin','Super Admin','all','2026-06-11 22:44:34');
INSERT INTO roles (id,role_key,role_name,permissions,created_at) VALUES (2,'finance_manager','Finance Manager','dashboard,finance,invoices,payroll,reports','2026-06-11 22:44:34');
INSERT INTO roles (id,role_key,role_name,permissions,created_at) VALUES (3,'warehouse_manager','Warehouse Manager','dashboard,inventory,warehouses,stock_movements,purchase_orders','2026-06-11 22:44:34');
INSERT INTO roles (id,role_key,role_name,permissions,created_at) VALUES (4,'hr_manager','HR Manager','dashboard,employees,attendance,payroll,documents','2026-06-11 22:44:34');
INSERT INTO roles (id,role_key,role_name,permissions,created_at) VALUES (5,'sales_manager','Sales Manager','dashboard,crm,customers,sales_orders,invoices','2026-06-11 22:44:34');

-- customers (6)
INSERT INTO customers (id,code,name,segment,contact_person,phone,email,city,credit_limit,receivable_balance,status,created_at,updated_at) VALUES (1,'CUS-2025-001','Basra Oil Services','Enterprise','Hassan Kareem','+9647801112025','procurement@basra-oil.example','Basra',90000000,24500000,'active','2026-06-11 22:44:34','2026-06-11 22:44:34');
INSERT INTO customers (id,code,name,segment,contact_person,phone,email,city,credit_limit,receivable_balance,status,created_at,updated_at) VALUES (2,'CUS-2025-002','Baghdad BuildTech','Construction','Noor Al-Saadi','+9647708884411','finance@buildtech.example','Baghdad',50000000,11200000,'active','2026-06-11 22:44:34','2026-06-11 22:44:34');
INSERT INTO customers (id,code,name,segment,contact_person,phone,email,city,credit_limit,receivable_balance,status,created_at,updated_at) VALUES (3,'CUS-2025-003','Nineveh Cement Group','Manufacturing','Omar Naji','+9647512229080','orders@ninevehcement.example','Mosul',65000000,0,'active','2026-06-11 22:44:34','2026-06-11 22:44:34');
INSERT INTO customers (id,code,name,segment,contact_person,phone,email,city,credit_limit,receivable_balance,status,created_at,updated_at) VALUES (4,'CUS-2025-004','Karbala Energy Works','Energy','Zainab Ali','+9647822225400','supply@k-energy.example','Karbala',45000000,7600000,'active','2026-06-11 22:44:34','2026-06-11 22:44:34');
INSERT INTO customers (id,code,name,segment,contact_person,phone,email,city,credit_limit,receivable_balance,status,created_at,updated_at) VALUES (5,'CUS-2025-005','Erbil Packaging Factory','Manufacturing','Haval Aziz','+9647504401800','ops@erbilpack.example','Erbil',30000000,3400000,'active','2026-06-11 22:44:34','2026-06-11 22:44:34');
INSERT INTO customers (id,code,name,segment,contact_person,phone,email,city,credit_limit,receivable_balance,status,created_at,updated_at) VALUES (6,'CUS-2025-006','Najaf Logistics Terminal','Logistics','Ali Alwan','+9647803309120','orders@najafterminal.example','Najaf',28000000,0,'active','2026-06-11 22:44:34','2026-06-11 22:44:34');

-- crm_leads (4)
INSERT INTO crm_leads (id,lead_no,company_name,contact_person,phone,source,stage,expected_value,probability,next_followup,owner,status,created_at,updated_at) VALUES (1,'LEAD-2025-001','Dhi Qar Water Authority','Salah Fadhil','+9647807771001','Referral','Proposal',145000000,62,'2025-06-22','Sales Team A','open','2026-06-11 22:44:34','2026-06-11 22:44:34');
INSERT INTO crm_leads (id,lead_no,company_name,contact_person,phone,source,stage,expected_value,probability,next_followup,owner,status,created_at,updated_at) VALUES (2,'LEAD-2025-002','Anbar Ready Mix','Muna Yassin','+9647706004100','Website','Qualification',52000000,38,'2025-06-18','Sajjad Abbas','open','2026-06-11 22:44:34','2026-06-11 22:44:34');
INSERT INTO crm_leads (id,lead_no,company_name,contact_person,phone,source,stage,expected_value,probability,next_followup,owner,status,created_at,updated_at) VALUES (3,'LEAD-2025-003','Maysan Power Plant','Riyadh Mahdi','+9647801100455','Expo','Negotiation',98000000,74,'2025-06-20','Layth Kareem','open','2026-06-11 22:44:34','2026-06-11 22:44:34');
INSERT INTO crm_leads (id,lead_no,company_name,contact_person,phone,source,stage,expected_value,probability,next_followup,owner,status,created_at,updated_at) VALUES (4,'LEAD-2025-004','Kirkuk Food Industries','Sara Kamal','+9647509200140','Cold Call','Discovery',31000000,22,'2025-06-25','Sales Team B','open','2026-06-11 22:44:34','2026-06-11 22:44:34');

-- vendors (5)
INSERT INTO vendors (id,code,name,category,contact_person,phone,email,city,payable_balance,status,created_at,updated_at) VALUES (1,'VEN-2025-001','Tigris Steel Supply','Raw Materials','Ahmed Jawad','+9647703001122','sales@tigris-steel.example','Baghdad',16800000,'active','2026-06-11 22:44:34','2026-06-11 22:44:34');
INSERT INTO vendors (id,code,name,category,contact_person,phone,email,city,payable_balance,status,created_at,updated_at) VALUES (2,'VEN-2025-002','Mesopotamia Logistics','Transportation','Mariam Abbas','+9647814443000','dispatch@meso-logistics.example','Basra',5200000,'active','2026-06-11 22:44:34','2026-06-11 22:44:34');
INSERT INTO vendors (id,code,name,category,contact_person,phone,email,city,payable_balance,status,created_at,updated_at) VALUES (3,'VEN-2025-003','Delta Control Systems','Automation','Ali Rahman','+9647501018000','iraq@delta-control.example','Erbil',0,'active','2026-06-11 22:44:34','2026-06-11 22:44:34');
INSERT INTO vendors (id,code,name,category,contact_person,phone,email,city,payable_balance,status,created_at,updated_at) VALUES (4,'VEN-2025-004','Baghdad Office Hub','Office Supplies','Sura Mahdi','+9647706101221','billing@officehub.example','Baghdad',880000,'active','2026-06-11 22:44:34','2026-06-11 22:44:34');
INSERT INTO vendors (id,code,name,category,contact_person,phone,email,city,payable_balance,status,created_at,updated_at) VALUES (5,'VEN-2025-005','Al-Nahrain Safety Gear','Safety','Rafal Nabeel','+9647801212000','orders@nahrain-safety.example','Najaf',2400000,'active','2026-06-11 22:44:34','2026-06-11 22:44:34');

-- warehouses (4)
INSERT INTO warehouses (id,code,name,location,manager,capacity,utilization,status,created_at,updated_at) VALUES (1,'WH-BGD-01','Baghdad Central Warehouse','Baghdad - Dora Industrial Area','Mustafa Sami',12000,74,'active','2026-06-11 22:44:34','2026-06-11 22:44:34');
INSERT INTO warehouses (id,code,name,location,manager,capacity,utilization,status,created_at,updated_at) VALUES (2,'WH-BSR-02','Basra Supply Hub','Basra - Khor Al Zubair','Hassan Jaber',9000,66,'active','2026-06-11 22:44:34','2026-06-11 22:44:34');
INSERT INTO warehouses (id,code,name,location,manager,capacity,utilization,status,created_at,updated_at) VALUES (3,'WH-MSL-03','Mosul Spare Parts Store','Mosul Industrial Zone','Omar Naji',4500,49,'active','2026-06-11 22:44:34','2026-06-11 22:44:34');
INSERT INTO warehouses (id,code,name,location,manager,capacity,utilization,status,created_at,updated_at) VALUES (4,'WH-KRB-04','Karbala Service Store','Karbala Service Park','Zainab Ali',3200,58,'active','2026-06-11 22:44:34','2026-06-11 22:44:34');

-- inventory_items (12)
INSERT INTO inventory_items (id,sku,name,category,warehouse_id,unit,qty_on_hand,reorder_point,cost_price,sale_price,status,created_at,updated_at) VALUES (1,'SKU-VAL-200','Industrial Pressure Valve 2 inch','Valves',1,'pcs',86,20,42000,65000,'active','2026-06-11 22:44:34','2026-06-11 22:44:34');
INSERT INTO inventory_items (id,sku,name,category,warehouse_id,unit,qty_on_hand,reorder_point,cost_price,sale_price,status,created_at,updated_at) VALUES (2,'SKU-PMP-150','Industrial Water Pump','Pumps',1,'pcs',24,8,820000,1100000,'active','2026-06-11 22:44:34','2026-06-11 22:44:34');
INSERT INTO inventory_items (id,sku,name,category,warehouse_id,unit,qty_on_hand,reorder_point,cost_price,sale_price,status,created_at,updated_at) VALUES (3,'SKU-SNS-880','Smart Temperature Sensor','Sensors',2,'pcs',140,35,38000,59000,'active','2026-06-11 22:44:34','2026-06-11 22:44:34');
INSERT INTO inventory_items (id,sku,name,category,warehouse_id,unit,qty_on_hand,reorder_point,cost_price,sale_price,status,created_at,updated_at) VALUES (4,'SKU-CBL-010','Control Cable 10m','Electrical',3,'roll',210,50,18000,29000,'active','2026-06-11 22:44:34','2026-06-11 22:44:34');
INSERT INTO inventory_items (id,sku,name,category,warehouse_id,unit,qty_on_hand,reorder_point,cost_price,sale_price,status,created_at,updated_at) VALUES (5,'SKU-FLT-300','Industrial Air Filter','Filters',1,'pcs',42,15,72000,105000,'active','2026-06-11 22:44:34','2026-06-11 22:44:34');
INSERT INTO inventory_items (id,sku,name,category,warehouse_id,unit,qty_on_hand,reorder_point,cost_price,sale_price,status,created_at,updated_at) VALUES (6,'SKU-PLC-700','PLC Control Unit','Automation',2,'pcs',12,5,750000,980000,'active','2026-06-11 22:44:34','2026-06-11 22:44:34');
INSERT INTO inventory_items (id,sku,name,category,warehouse_id,unit,qty_on_hand,reorder_point,cost_price,sale_price,status,created_at,updated_at) VALUES (7,'SKU-BRG-045','Industrial Bearing','Mechanical',4,'pcs',17,25,26000,41000,'low-stock','2026-06-11 22:44:34','2026-06-11 22:44:34');
INSERT INTO inventory_items (id,sku,name,category,warehouse_id,unit,qty_on_hand,reorder_point,cost_price,sale_price,status,created_at,updated_at) VALUES (8,'SKU-SFT-022','Drive Shaft','Mechanical',1,'pcs',9,10,310000,465000,'low-stock','2026-06-11 22:44:34','2026-06-11 22:44:34');
INSERT INTO inventory_items (id,sku,name,category,warehouse_id,unit,qty_on_hand,reorder_point,cost_price,sale_price,status,created_at,updated_at) VALUES (9,'SKU-HYD-510','Hydraulic Hose Kit','Hydraulics',2,'kit',34,12,115000,175000,'active','2026-06-11 22:44:34','2026-06-11 22:44:34');
INSERT INTO inventory_items (id,sku,name,category,warehouse_id,unit,qty_on_hand,reorder_point,cost_price,sale_price,status,created_at,updated_at) VALUES (10,'SKU-GEN-020','Generator Control Panel','Electrical',3,'pcs',7,4,1450000,1890000,'active','2026-06-11 22:44:34','2026-06-11 22:44:34');
INSERT INTO inventory_items (id,sku,name,category,warehouse_id,unit,qty_on_hand,reorder_point,cost_price,sale_price,status,created_at,updated_at) VALUES (11,'SKU-MTR-400','Industrial Motor 4KW','Motors',1,'pcs',15,6,690000,940000,'active','2026-06-11 22:44:34','2026-06-11 22:44:34');
INSERT INTO inventory_items (id,sku,name,category,warehouse_id,unit,qty_on_hand,reorder_point,cost_price,sale_price,status,created_at,updated_at) VALUES (12,'SKU-BLT-090','Heavy Duty Belt','Mechanical',4,'pcs',22,18,52000,84000,'active','2026-06-11 22:44:34','2026-06-11 22:44:34');

-- stock_movements (5)
INSERT INTO stock_movements (id,movement_no,item_id,warehouse_id,movement_type,qty,reference,movement_date,notes,created_at) VALUES (1,'MOV-2025-001',1,1,'IN',40,'PO-2025-4011','2025-01-12','Opening procurement','2026-06-11 22:44:34');
INSERT INTO stock_movements (id,movement_no,item_id,warehouse_id,movement_type,qty,reference,movement_date,notes,created_at) VALUES (2,'MOV-2025-002',2,1,'OUT',4,'SO-2025-2001','2025-02-05','Basra pump station','2026-06-11 22:44:34');
INSERT INTO stock_movements (id,movement_no,item_id,warehouse_id,movement_type,qty,reference,movement_date,notes,created_at) VALUES (3,'MOV-2025-003',7,4,'OUT',12,'SO-2025-2002','2025-02-19','Mechanical service job','2026-06-11 22:44:34');
INSERT INTO stock_movements (id,movement_no,item_id,warehouse_id,movement_type,qty,reference,movement_date,notes,created_at) VALUES (4,'MOV-2025-004',10,3,'IN',3,'PO-2025-4013','2025-03-03','Generator panels','2026-06-11 22:44:34');
INSERT INTO stock_movements (id,movement_no,item_id,warehouse_id,movement_type,qty,reference,movement_date,notes,created_at) VALUES (5,'MOV-2025-005',3,2,'OUT',28,'PRJ-2025-052','2025-03-15','Sensor network issue','2026-06-11 22:44:34');

-- sales_orders (5)
INSERT INTO sales_orders (id,order_no,customer_id,order_date,due_date,status,subtotal,tax,total,owner,notes,created_at,updated_at) VALUES (1,'SO-2025-2001',1,'2025-01-18','2025-02-01','approved',8400000,0,8400000,'Sajjad Abbas','Pump station spare parts','2026-06-11 22:44:34','2026-06-11 22:44:34');
INSERT INTO sales_orders (id,order_no,customer_id,order_date,due_date,status,subtotal,tax,total,owner,notes,created_at,updated_at) VALUES (2,'SO-2025-2002',2,'2025-02-09','2025-02-25','shipped',12450000,0,12450000,'Sales Team A','BuildTech monthly supply','2026-06-11 22:44:34','2026-06-11 22:44:34');
INSERT INTO sales_orders (id,order_no,customer_id,order_date,due_date,status,subtotal,tax,total,owner,notes,created_at,updated_at) VALUES (3,'SO-2025-2003',3,'2025-03-04','2025-03-22','draft',6170000,0,6170000,'Sajjad Abbas','Sensor installation batch','2026-06-11 22:44:34','2026-06-11 22:44:34');
INSERT INTO sales_orders (id,order_no,customer_id,order_date,due_date,status,subtotal,tax,total,owner,notes,created_at,updated_at) VALUES (4,'SO-2025-2004',4,'2025-04-11','2025-04-29','paid',18360000,0,18360000,'Layth Kareem','Warehouse equipment order','2026-06-11 22:44:34','2026-06-11 22:44:34');
INSERT INTO sales_orders (id,order_no,customer_id,order_date,due_date,status,subtotal,tax,total,owner,notes,created_at,updated_at) VALUES (5,'SO-2025-2005',5,'2025-05-06','2025-05-18','approved',9550000,0,9550000,'Sales Team B','Packaging factory maintenance items','2026-06-11 22:44:34','2026-06-11 22:44:34');

-- invoices (4)
INSERT INTO invoices (id,invoice_no,customer_id,invoice_date,due_date,status,subtotal,tax,total,paid_amount,balance_due,created_at,updated_at) VALUES (1,'INV-2025-5001',1,'2025-01-20','2025-02-20','paid',8400000,0,8400000,8400000,0,'2026-06-11 22:44:34','2026-06-11 22:44:34');
INSERT INTO invoices (id,invoice_no,customer_id,invoice_date,due_date,status,subtotal,tax,total,paid_amount,balance_due,created_at,updated_at) VALUES (2,'INV-2025-5002',2,'2025-02-12','2025-03-12','sent',12450000,0,12450000,6500000,5950000,'2026-06-11 22:44:34','2026-06-11 22:44:34');
INSERT INTO invoices (id,invoice_no,customer_id,invoice_date,due_date,status,subtotal,tax,total,paid_amount,balance_due,created_at,updated_at) VALUES (3,'INV-2025-5003',4,'2025-04-12','2025-05-12','overdue',18360000,0,18360000,12000000,6360000,'2026-06-11 22:44:34','2026-06-11 22:44:34');
INSERT INTO invoices (id,invoice_no,customer_id,invoice_date,due_date,status,subtotal,tax,total,paid_amount,balance_due,created_at,updated_at) VALUES (4,'INV-2025-5004',5,'2025-05-08','2025-06-08','sent',9550000,0,9550000,0,9550000,'2026-06-11 22:44:34','2026-06-11 22:44:34');

-- purchase_orders (4)
INSERT INTO purchase_orders (id,po_no,vendor_id,po_date,expected_date,status,subtotal,tax,total,buyer,notes,created_at,updated_at) VALUES (1,'PO-2025-4011',1,'2025-01-10','2025-01-24','received',38000000,0,38000000,'Procurement Team','Steel and valve replenishment','2026-06-11 22:44:34','2026-06-11 22:44:34');
INSERT INTO purchase_orders (id,po_no,vendor_id,po_date,expected_date,status,subtotal,tax,total,buyer,notes,created_at,updated_at) VALUES (2,'PO-2025-4012',2,'2025-02-12','2025-02-18','open',9200000,0,9200000,'Operations','South region logistics contracts','2026-06-11 22:44:34','2026-06-11 22:44:34');
INSERT INTO purchase_orders (id,po_no,vendor_id,po_date,expected_date,status,subtotal,tax,total,buyer,notes,created_at,updated_at) VALUES (3,'PO-2025-4013',3,'2025-03-01','2025-03-14','approved',17600000,0,17600000,'Automation Desk','Control systems','2026-06-11 22:44:34','2026-06-11 22:44:34');
INSERT INTO purchase_orders (id,po_no,vendor_id,po_date,expected_date,status,subtotal,tax,total,buyer,notes,created_at,updated_at) VALUES (4,'PO-2025-4014',5,'2025-03-22','2025-04-02','open',6400000,0,6400000,'HSE Unit','Safety stock','2026-06-11 22:44:34','2026-06-11 22:44:34');

-- accounts (8)
INSERT INTO accounts (id,account_no,account_name,type,parent_account,opening_balance,current_balance,status,created_at,updated_at) VALUES (1,'1000','Cash & Bank','Asset','',120000000,138500000,'active','2026-06-11 22:44:34','2026-06-11 22:44:34');
INSERT INTO accounts (id,account_no,account_name,type,parent_account,opening_balance,current_balance,status,created_at,updated_at) VALUES (2,'1100','Accounts Receivable','Asset','1000',0,41050000,'active','2026-06-11 22:44:34','2026-06-11 22:44:34');
INSERT INTO accounts (id,account_no,account_name,type,parent_account,opening_balance,current_balance,status,created_at,updated_at) VALUES (3,'1200','Inventory','Asset','1000',0,88260000,'active','2026-06-11 22:44:34','2026-06-11 22:44:34');
INSERT INTO accounts (id,account_no,account_name,type,parent_account,opening_balance,current_balance,status,created_at,updated_at) VALUES (4,'2000','Accounts Payable','Liability','',0,25280000,'active','2026-06-11 22:44:34','2026-06-11 22:44:34');
INSERT INTO accounts (id,account_no,account_name,type,parent_account,opening_balance,current_balance,status,created_at,updated_at) VALUES (5,'3000','Owner Equity','Equity','',200000000,200000000,'active','2026-06-11 22:44:34','2026-06-11 22:44:34');
INSERT INTO accounts (id,account_no,account_name,type,parent_account,opening_balance,current_balance,status,created_at,updated_at) VALUES (6,'4000','Sales Revenue','Revenue','',0,48760000,'active','2026-06-11 22:44:34','2026-06-11 22:44:34');
INSERT INTO accounts (id,account_no,account_name,type,parent_account,opening_balance,current_balance,status,created_at,updated_at) VALUES (7,'5000','Cost of Goods Sold','Expense','',0,22400000,'active','2026-06-11 22:44:34','2026-06-11 22:44:34');
INSERT INTO accounts (id,account_no,account_name,type,parent_account,opening_balance,current_balance,status,created_at,updated_at) VALUES (8,'5100','Operating Expenses','Expense','',0,18850000,'active','2026-06-11 22:44:34','2026-06-11 22:44:34');

-- journal_entries (4)
INSERT INTO journal_entries (id,entry_no,entry_date,account_id,description,debit,credit,reference,status,created_at) VALUES (1,'JE-2025-001','2025-01-20',1,'Invoice collection INV-2025-5001',8400000,0,'INV-2025-5001','posted','2026-06-11 22:44:34');
INSERT INTO journal_entries (id,entry_no,entry_date,account_id,description,debit,credit,reference,status,created_at) VALUES (2,'JE-2025-002','2025-01-20',6,'Sales revenue INV-2025-5001',0,8400000,'INV-2025-5001','posted','2026-06-11 22:44:34');
INSERT INTO journal_entries (id,entry_no,entry_date,account_id,description,debit,credit,reference,status,created_at) VALUES (3,'JE-2025-003','2025-02-18',8,'Logistics expense',9200000,0,'PO-2025-4012','posted','2026-06-11 22:44:34');
INSERT INTO journal_entries (id,entry_no,entry_date,account_id,description,debit,credit,reference,status,created_at) VALUES (4,'JE-2025-004','2025-03-05',2,'Receivable INV-2025-5002',5950000,0,'INV-2025-5002','posted','2026-06-11 22:44:34');

-- employees (7)
INSERT INTO employees (id,employee_no,full_name,job_title,department,manager,phone,email,hire_date,salary,status,created_at,updated_at) VALUES (1,'EMP-2025-001','Dina Mahdi','Finance Director','Finance','CEO Office','+9647700202020','dina@rafidain-group.example','2021-09-15',3600000,'active','2026-06-11 22:44:34','2026-06-11 22:44:34');
INSERT INTO employees (id,employee_no,full_name,job_title,department,manager,phone,email,hire_date,salary,status,created_at,updated_at) VALUES (2,'EMP-2025-002','Layth Kareem','Operations Manager','Operations','CEO Office','+9647700101010','layth@rafidain-group.example','2022-01-05',4200000,'active','2026-06-11 22:44:34','2026-06-11 22:44:34');
INSERT INTO employees (id,employee_no,full_name,job_title,department,manager,phone,email,hire_date,salary,status,created_at,updated_at) VALUES (3,'EMP-2025-003','Mustafa Sami','Warehouse Supervisor','Warehouse','Layth Kareem','+9647700303030','mustafa@rafidain-group.example','2023-04-18',2600000,'active','2026-06-11 22:44:34','2026-06-11 22:44:34');
INSERT INTO employees (id,employee_no,full_name,job_title,department,manager,phone,email,hire_date,salary,status,created_at,updated_at) VALUES (4,'EMP-2025-004','Rana Fadhil','HR Officer','Human Resources','Dina Mahdi','+9647700404040','rana@rafidain-group.example','2020-11-01',2300000,'active','2026-06-11 22:44:34','2026-06-11 22:44:34');
INSERT INTO employees (id,employee_no,full_name,job_title,department,manager,phone,email,hire_date,salary,status,created_at,updated_at) VALUES (5,'EMP-2025-005','Sajjad Abbas','Sales Executive','Sales','Layth Kareem','+9647700505050','sajjad@rafidain-group.example','2024-02-20',2100000,'active','2026-06-11 22:44:34','2026-06-11 22:44:34');
INSERT INTO employees (id,employee_no,full_name,job_title,department,manager,phone,email,hire_date,salary,status,created_at,updated_at) VALUES (6,'EMP-2025-006','Huda Nabeel','Project Coordinator','Projects','Layth Kareem','+9647700606060','huda@rafidain-group.example','2023-08-10',2450000,'active','2026-06-11 22:44:34','2026-06-11 22:44:34');
INSERT INTO employees (id,employee_no,full_name,job_title,department,manager,phone,email,hire_date,salary,status,created_at,updated_at) VALUES (7,'EMP-2025-007','Hassan Jaber','Basra Hub Manager','Warehouse','Mustafa Sami','+9647700707070','hassan@rafidain-group.example','2022-10-01',2550000,'active','2026-06-11 22:44:34','2026-06-11 22:44:34');

-- attendance (4)
INSERT INTO attendance (id,attendance_no,employee_id,work_date,check_in,check_out,hours,status,notes,created_at) VALUES (1,'ATT-2025-001',1,'2025-06-01','08:52','17:12',8.3,'present','','2026-06-11 22:44:34');
INSERT INTO attendance (id,attendance_no,employee_id,work_date,check_in,check_out,hours,status,notes,created_at) VALUES (2,'ATT-2025-002',2,'2025-06-01','08:45','17:25',8.7,'present','','2026-06-11 22:44:34');
INSERT INTO attendance (id,attendance_no,employee_id,work_date,check_in,check_out,hours,status,notes,created_at) VALUES (3,'ATT-2025-003',3,'2025-06-01','09:18','17:00',7.7,'late','Traffic delay','2026-06-11 22:44:34');
INSERT INTO attendance (id,attendance_no,employee_id,work_date,check_in,check_out,hours,status,notes,created_at) VALUES (4,'ATT-2025-004',4,'2025-06-01','08:59','17:05',8.1,'present','','2026-06-11 22:44:34');

-- payroll (4)
INSERT INTO payroll (id,payroll_no,employee_id,period,base_salary,allowance,deduction,net_pay,status,paid_date,created_at,updated_at) VALUES (1,'PAY-2025-05-001',1,'2025-05',3600000,350000,0,3950000,'paid','2025-05-31','2026-06-11 22:44:34','2026-06-11 22:44:34');
INSERT INTO payroll (id,payroll_no,employee_id,period,base_salary,allowance,deduction,net_pay,status,paid_date,created_at,updated_at) VALUES (2,'PAY-2025-05-002',2,'2025-05',4200000,500000,100000,4600000,'paid','2025-05-31','2026-06-11 22:44:34','2026-06-11 22:44:34');
INSERT INTO payroll (id,payroll_no,employee_id,period,base_salary,allowance,deduction,net_pay,status,paid_date,created_at,updated_at) VALUES (3,'PAY-2025-05-003',3,'2025-05',2600000,250000,50000,2800000,'paid','2025-05-31','2026-06-11 22:44:34','2026-06-11 22:44:34');
INSERT INTO payroll (id,payroll_no,employee_id,period,base_salary,allowance,deduction,net_pay,status,paid_date,created_at,updated_at) VALUES (4,'PAY-2025-06-001',4,'2025-06',2300000,200000,0,2500000,'draft','','2026-06-11 22:44:34','2026-06-11 22:44:34');

-- projects (4)
INSERT INTO projects (id,project_no,name,client_name,project_manager,start_date,end_date,budget,actual_cost,progress,status,created_at,updated_at) VALUES (1,'PRJ-2025-041','Basra Pump Station Upgrade','Basra Oil Services','Huda Nabeel','2025-02-01','2025-09-30',185000000,92000000,52,'in-progress','2026-06-11 22:44:34','2026-06-11 22:44:34');
INSERT INTO projects (id,project_no,name,client_name,project_manager,start_date,end_date,budget,actual_cost,progress,status,created_at,updated_at) VALUES (2,'PRJ-2025-052','Mosul Cement Sensor Network','Nineveh Cement Group','Layth Kareem','2025-06-15','2025-11-10',97000000,12000000,12,'planned','2026-06-11 22:44:34','2026-06-11 22:44:34');
INSERT INTO projects (id,project_no,name,client_name,project_manager,start_date,end_date,budget,actual_cost,progress,status,created_at,updated_at) VALUES (3,'PRJ-2025-063','Karbala Energy Warehouse Setup','Karbala Energy Works','Mustafa Sami','2025-03-20','2025-08-05',64000000,41000000,68,'in-progress','2026-06-11 22:44:34','2026-06-11 22:44:34');
INSERT INTO projects (id,project_no,name,client_name,project_manager,start_date,end_date,budget,actual_cost,progress,status,created_at,updated_at) VALUES (4,'PRJ-2025-077','Baghdad BuildTech ERP Rollout','Baghdad BuildTech','Dina Mahdi','2025-01-12','2025-05-30',52000000,50500000,95,'review','2026-06-11 22:44:34','2026-06-11 22:44:34');

-- tasks (4)
INSERT INTO tasks (id,task_no,project_id,title,assignee,priority,status,due_date,progress,created_at,updated_at) VALUES (1,'TSK-2025-001',1,'Finalize pump telemetry checklist','Huda Nabeel','high','open','2025-06-20',45,'2026-06-11 22:44:34','2026-06-11 22:44:34');
INSERT INTO tasks (id,task_no,project_id,title,assignee,priority,status,due_date,progress,created_at,updated_at) VALUES (2,'TSK-2025-002',2,'Confirm sensor BOM with procurement','Layth Kareem','medium','open','2025-06-18',30,'2026-06-11 22:44:34','2026-06-11 22:44:34');
INSERT INTO tasks (id,task_no,project_id,title,assignee,priority,status,due_date,progress,created_at,updated_at) VALUES (3,'TSK-2025-003',3,'Warehouse shelving acceptance test','Mustafa Sami','high','in-progress','2025-06-17',70,'2026-06-11 22:44:34','2026-06-11 22:44:34');
INSERT INTO tasks (id,task_no,project_id,title,assignee,priority,status,due_date,progress,created_at,updated_at) VALUES (4,'TSK-2025-004',4,'Client sign-off documentation','Dina Mahdi','low','review','2025-06-21',90,'2026-06-11 22:44:34','2026-06-11 22:44:34');

-- approvals (4)
INSERT INTO approvals (id,approval_no,request_type,requester,amount,status,approver,requested_at,decided_at,notes,created_at,updated_at) VALUES (1,'APR-2025-001','Purchase Order','Procurement Team',17600000,'approved','Dina Mahdi','2025-03-01','2025-03-02','Automation stock','2026-06-11 22:44:34','2026-06-11 22:44:34');
INSERT INTO approvals (id,approval_no,request_type,requester,amount,status,approver,requested_at,decided_at,notes,created_at,updated_at) VALUES (2,'APR-2025-002','Expense','Operations',4200000,'pending','Finance Director','2025-06-10','','Emergency generator maintenance','2026-06-11 22:44:34','2026-06-11 22:44:34');
INSERT INTO approvals (id,approval_no,request_type,requester,amount,status,approver,requested_at,decided_at,notes,created_at,updated_at) VALUES (3,'APR-2025-003','Discount','Sales Team A',1800000,'pending','CEO Office','2025-06-11','','Strategic client renewal','2026-06-11 22:44:34','2026-06-11 22:44:34');
INSERT INTO approvals (id,approval_no,request_type,requester,amount,status,approver,requested_at,decided_at,notes,created_at,updated_at) VALUES (4,'APR-2025-004','Payroll','HR Officer',0,'review','Dina Mahdi','2025-06-12','','June payroll draft','2026-06-11 22:44:34','2026-06-11 22:44:34');

-- documents (4)
INSERT INTO documents (id,doc_no,title,category,owner,file_url,version,status,created_at,updated_at) VALUES (1,'DOC-2025-001','Procurement Policy 2025','Policy','Finance','/docs/procurement-policy.pdf','2.1','active','2026-06-11 22:44:34','2026-06-11 22:44:34');
INSERT INTO documents (id,doc_no,title,category,owner,file_url,version,status,created_at,updated_at) VALUES (2,'DOC-2025-002','Warehouse Safety Checklist','Operations','HSE Unit','/docs/warehouse-safety.pdf','1.4','active','2026-06-11 22:44:34','2026-06-11 22:44:34');
INSERT INTO documents (id,doc_no,title,category,owner,file_url,version,status,created_at,updated_at) VALUES (3,'DOC-2025-003','Basra Pump Station Contract','Contract','Projects','/docs/basra-contract.pdf','1.0','locked','2026-06-11 22:44:34','2026-06-11 22:44:34');
INSERT INTO documents (id,doc_no,title,category,owner,file_url,version,status,created_at,updated_at) VALUES (4,'DOC-2025-004','ERP User Manual','Manual','Technology','/docs/erp-manual.pdf','1.0','active','2026-06-11 22:44:34','2026-06-11 22:44:34');

-- assets (4)
INSERT INTO assets (id,asset_no,name,category,location,custodian,purchase_date,purchase_value,book_value,status,created_at,updated_at) VALUES (1,'AST-2025-001','Toyota Hilux Service Vehicle','Vehicle','Baghdad HQ','Operations','2023-06-01',42000000,31000000,'active','2026-06-11 22:44:34','2026-06-11 22:44:34');
INSERT INTO assets (id,asset_no,name,category,location,custodian,purchase_date,purchase_value,book_value,status,created_at,updated_at) VALUES (2,'AST-2025-002','Forklift 3T','Equipment','Central Warehouse','Warehouse','2022-04-12',38000000,24000000,'active','2026-06-11 22:44:34','2026-06-11 22:44:34');
INSERT INTO assets (id,asset_no,name,category,location,custodian,purchase_date,purchase_value,book_value,status,created_at,updated_at) VALUES (3,'AST-2025-003','Dell Precision Workstation','IT','Finance Office','Finance','2024-01-20',3200000,2400000,'active','2026-06-11 22:44:34','2026-06-11 22:44:34');
INSERT INTO assets (id,asset_no,name,category,location,custodian,purchase_date,purchase_value,book_value,status,created_at,updated_at) VALUES (4,'AST-2025-004','Barcode Scanner Set','IT','Basra Hub','Warehouse','2024-09-03',1800000,1350000,'active','2026-06-11 22:44:34','2026-06-11 22:44:34');

-- support_tickets (3)
INSERT INTO support_tickets (id,ticket_no,title,module,requester,priority,status,assigned_to,due_date,created_at,updated_at) VALUES (1,'TKT-2025-001','Need invoice aging export','Finance','Dina Mahdi','medium','open','Technology','2025-06-19','2026-06-11 22:44:34','2026-06-11 22:44:34');
INSERT INTO support_tickets (id,ticket_no,title,module,requester,priority,status,assigned_to,due_date,created_at,updated_at) VALUES (2,'TKT-2025-002','Stock scanner sync delay','Inventory','Mustafa Sami','high','in-progress','Technology','2025-06-17','2026-06-11 22:44:34','2026-06-11 22:44:34');
INSERT INTO support_tickets (id,ticket_no,title,module,requester,priority,status,assigned_to,due_date,created_at,updated_at) VALUES (3,'TKT-2025-003','Add approval shortcut','Approvals','Layth Kareem','low','open','Technology','2025-06-24','2026-06-11 22:44:34','2026-06-11 22:44:34');

-- audit_log (5)
INSERT INTO audit_log (id,actor,action,module,record_id,metadata,created_at) VALUES (1,'Ibrahim Ghaiyth','Designed and developed enterprise ERP suite','system',NULL,'2025 signature applied','2026-06-11 22:44:34');
INSERT INTO audit_log (id,actor,action,module,record_id,metadata,created_at) VALUES (2,'System','Imported opening master data','database',NULL,'20+ ERP modules initialized','2026-06-11 22:44:34');
INSERT INTO audit_log (id,actor,action,module,record_id,metadata,created_at) VALUES (3,'Dina Mahdi','Approved automation purchase order','approvals',1,'','2026-06-11 22:44:34');
INSERT INTO audit_log (id,actor,action,module,record_id,metadata,created_at) VALUES (4,'Layth Kareem','Reviewed project pipeline','projects',1,'','2026-06-11 22:44:34');
INSERT INTO audit_log (id,actor,action,module,record_id,metadata,created_at) VALUES (5,'Mustafa Sami','Flagged low stock bearings','inventory',7,'','2026-06-11 22:44:34');

COMMIT;
PRAGMA foreign_keys = ON;
