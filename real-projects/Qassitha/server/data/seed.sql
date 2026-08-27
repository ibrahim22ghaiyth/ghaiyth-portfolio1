-- قسّطها · Qassitha — full schema + seed data
-- A debt & installment tracker in Iraqi Dinar.
-- Rebuild anytime via: npm run reset-db

PRAGMA foreign_keys = OFF;
BEGIN TRANSACTION;

-- إعدادات التطبيق (صف واحد)
DROP TABLE IF EXISTS settings;
CREATE TABLE settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  owner_name TEXT NOT NULL DEFAULT 'حسابي',
  business_name TEXT NOT NULL DEFAULT '',
  currency TEXT NOT NULL DEFAULT 'IQD',
  phone TEXT DEFAULT '',
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- جهات (الزبائن/الأشخاص اللي عليهم أو إلهم ديون)
DROP TABLE IF EXISTS contacts;
CREATE TABLE contacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT DEFAULT '',
  note TEXT DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- الديون/الخطط (دين واحد ممكن يكون مقسّط على دفعات)
DROP TABLE IF EXISTS debts;
CREATE TABLE debts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  contact_id INTEGER NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  direction TEXT NOT NULL DEFAULT 'owed_to_me' CHECK (direction IN ('owed_to_me','i_owe')),
  total_amount INTEGER NOT NULL DEFAULT 0,
  installments_count INTEGER NOT NULL DEFAULT 1,
  start_date TEXT NOT NULL DEFAULT (date('now')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','settled','overdue')),
  note TEXT DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- الأقساط (مجدولة تلقائياً عند إنشاء الدين)
DROP TABLE IF EXISTS installments;
CREATE TABLE installments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  debt_id INTEGER NOT NULL REFERENCES debts(id) ON DELETE CASCADE,
  seq INTEGER NOT NULL,
  due_date TEXT NOT NULL,
  amount INTEGER NOT NULL DEFAULT 0,
  paid_amount INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','paid','partial')),
  paid_at TEXT
);

-- الدفعات (سجل كل دفعة فعلية)
DROP TABLE IF EXISTS payments;
CREATE TABLE payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  debt_id INTEGER NOT NULL REFERENCES debts(id) ON DELETE CASCADE,
  installment_id INTEGER REFERENCES installments(id) ON DELETE SET NULL,
  amount INTEGER NOT NULL,
  pay_date TEXT NOT NULL DEFAULT (date('now')),
  method TEXT NOT NULL DEFAULT 'cash' CHECK (method IN ('cash','zaincash','asiahawala','transfer')),
  note TEXT DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_debts_contact ON debts(contact_id);
CREATE INDEX idx_installments_debt ON installments(debt_id);
CREATE INDEX idx_installments_due ON installments(due_date);
CREATE INDEX idx_payments_debt ON payments(debt_id);

-- ===== بيانات تجريبية واقعية =====
INSERT INTO settings (id, owner_name, business_name, currency, phone)
VALUES (1, 'إبراهيم غيث', 'محل إبراهيم للإلكترونيات', 'IQD', '07701234567');

INSERT INTO contacts (id, name, phone, note) VALUES
 (1, 'أبو علي', '07700000001', 'زبون دائم'),
 (2, 'سيف محمد', '07700000002', ''),
 (3, 'أم زينب', '07700000003', 'جارة'),
 (4, 'محل الرافدين', '07700000004', 'مورد');

-- دين 1: تلفزيون مقسّط على 4 أقساط (عليه إلي)
INSERT INTO debts (id, contact_id, title, direction, total_amount, installments_count, start_date, status, note)
VALUES (1, 1, 'تلفزيون سامسونك 55 بوصة', 'owed_to_me', 800000, 4, '2026-03-01', 'active', 'دفعة شهرية');
INSERT INTO installments (debt_id, seq, due_date, amount, paid_amount, status, paid_at) VALUES
 (1, 1, '2026-03-01', 200000, 200000, 'paid', '2026-03-02'),
 (1, 2, '2026-04-01', 200000, 200000, 'paid', '2026-04-03'),
 (1, 3, '2026-05-01', 200000, 0, 'pending', NULL),
 (1, 4, '2026-06-01', 200000, 0, 'pending', NULL);
INSERT INTO payments (debt_id, installment_id, amount, pay_date, method) VALUES
 (1, 1, 200000, '2026-03-02', 'cash'),
 (1, 2, 200000, '2026-04-03', 'zaincash');

-- دين 2: غسالة دفعة وحدة (عليه إلي)
INSERT INTO debts (id, contact_id, title, direction, total_amount, installments_count, start_date, status, note)
VALUES (2, 2, 'غسالة أوتوماتيك', 'owed_to_me', 350000, 1, '2026-05-15', 'active', '');
INSERT INTO installments (debt_id, seq, due_date, amount, paid_amount, status) VALUES
 (2, 1, '2026-05-15', 350000, 0, 'pending');

-- دين 3: سلفة لجارة (عليه إلي) — متأخّر
INSERT INTO debts (id, contact_id, title, direction, total_amount, installments_count, start_date, status, note)
VALUES (3, 3, 'سلفة', 'owed_to_me', 150000, 2, '2026-04-10', 'active', '');
INSERT INTO installments (debt_id, seq, due_date, amount, paid_amount, status) VALUES
 (3, 1, '2026-04-10', 75000, 0, 'pending'),
 (3, 2, '2026-05-10', 75000, 0, 'pending');

-- دين 4: بضاعة من مورد (آني عليّ)
INSERT INTO debts (id, contact_id, title, direction, total_amount, installments_count, start_date, status, note)
VALUES (4, 4, 'دفعة بضاعة موبايلات', 'i_owe', 1200000, 3, '2026-05-01', 'active', 'تسديد على 3 أشهر');
INSERT INTO installments (debt_id, seq, due_date, amount, paid_amount, status, paid_at) VALUES
 (4, 1, '2026-05-01', 400000, 400000, 'paid', '2026-05-01'),
 (4, 2, '2026-06-01', 400000, 0, 'pending', NULL),
 (4, 3, '2026-07-01', 400000, 0, 'pending', NULL);
INSERT INTO payments (debt_id, installment_id, amount, pay_date, method) VALUES
 (4, 1, 400000, '2026-05-01', 'transfer');

COMMIT;
PRAGMA foreign_keys = ON;
