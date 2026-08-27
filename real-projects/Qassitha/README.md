# 💵 قسّطها · Qassitha

أداة بسيطة لمتابعة الديون والأقساط بالدينار العراقي. تجدول الأقساط تلقائياً، تسجّل الدفعات (نقد / زين كاش / آسيا حوالة)، وتعرض بوضوح شنو إلك وشنو عليك — بديل رقمي لدفتر المحل.

A simple debt & installment tracker built for the Iraqi market. It auto-schedules installments, records local payments, and shows at a glance who owes what — a digital replacement for the shop's paper ledger.

> **صُنع في العراق · Developed by Ibrahim Ghaiyth**

---

## ✨ المميزات · Features

- 📒 **دفتر ديون باتجاهين** — «إلي» (ديون راح تجيك) و«عليّ» (ديون لازم تدفعها)، والصافي بينهم.
- 🌐 **ثنائي اللغة** — عربي (RTL) وإنجليزي (LTR)، تبديل فوري بزر واحد.
- 🗓️ **جدولة أقساط تلقائية** — تكتب المبلغ وعدد الأقساط، والتطبيق يوزّعهم شهرياً (والقسط الأخير يمتص الكسور بدون ضياع فلوس).
- 💳 **دفعات محلية** — نقد، زين كاش، آسيا حوالة، أو تحويل، مع دعم الدفع الجزئي.
- 🔴 **تنبيه المتأخرات** — يبيّن الأقساط اللي فات موعدها، والمستحقّة هذا الشهر.
- 👥 **إدارة الجهات** — زبائن، موردين، أو أشخاص، مع بحث سريع.
- 🗄️ **قاعدة SQLite حقيقية** مع منطق مالي مضبوط (المجموع محفوظ دائماً)، وتجي مع **بيانات تجريبية جاهزة** تشوفها فوراً.

---

## 🛠️ التقنيات · Tech Stack

| الطبقة | التقنية |
|--------|---------|
| Backend | Node.js (HTTP server خام، بدون إطار) |
| Database | SQLite عبر `better-sqlite3` |
| Frontend | HTML + CSS + JavaScript خام (عربي RTL) |
| API | REST JSON |

اعتماد خارجي **واحد فقط** (`better-sqlite3`).

---

## 🚀 التشغيل · Getting Started

**المتطلب:** Node.js 16 أو أحدث.

```bash
npm install         # تثبيت الاعتماد الوحيد
npm start           # تشغيل الخادم
```

ثم افتح **http://localhost:3000**

> المشروع يجي مع قاعدة بيانات جاهزة فيها بيانات تجريبية، فتشوف ديون وأقساط فوراً.
> لإعادة بناء القاعدة نظيفة من الصفر: `npm run reset-db`

---

## 📂 بنية المشروع · Project Structure

```txt
qassitha/
├── server/
│   ├── server.js        # الخادم + REST API + منطق الجدولة
│   ├── reset-db.js      # إعادة بناء القاعدة من seed.sql
│   ├── self-test.js     # اختبار آلي للمسارات
│   └── data/
│       └── seed.sql     # المخطط + بيانات تجريبية
├── public/
│   ├── index.html       # الواجهة (عربي RTL)
│   └── assets/          # CSS, JS
└── docs/
    ├── API.md
    └── DATABASE.md
```

---

## 🔌 أهم مسارات الـ API

| الطريقة | المسار | الوصف |
|---------|--------|-------|
| GET | `/api/dashboard` | الملخّص: إلي/عليّ، المتأخرات، مستحقّات الشهر |
| GET/POST | `/api/contacts` | عرض/إضافة الجهات |
| GET/POST | `/api/debts` | عرض/إنشاء الديون (مع جدولة تلقائية) |
| GET/DELETE | `/api/debts/{id}` | تفاصيل/حذف دين |
| POST | `/api/payments` | تسجيل دفعة على قسط |
| GET/PUT | `/api/settings` | الإعدادات |

التوثيق الكامل في `docs/API.md` و `docs/DATABASE.md`.

---

## 📝 الترخيص · License

MIT © Ibrahim Ghaiyth · 2026
