# 🏢 RafidainSuite — Enterprise ERP

نظام تخطيط موارد مؤسسات (ERP) متكامل بـ ٢١ موديولاً يغطي المالية، سلسلة التوريد، الموارد البشرية، إدارة العملاء، والمشاريع — مع باكند API حقيقي، نظام صلاحيات، سجل تدقيق، ولوحة معلومات تنفيذية. أكبر مشروع في مجموعة أعمالي.

A full-stack Enterprise Resource Planning suite spanning **21 modules** across finance, supply chain, HR, CRM, and projects — with a real backend API, token auth, an audit log, and an executive dashboard.

> **Designed & developed by Ibrahim Ghaiyth · 2025**

---

## ✨ المميزات · Features

- 🧩 **٢١ موديولاً مترابطاً** — عملاء، CRM، موردون، مخازن، مخزون، حركات مخزنية، أوامر بيع، فواتير، أوامر شراء، دليل حسابات، قيود يومية، موظفون، حضور، رواتب، مشاريع، مهام، موافقات، وثائق، أصول، تذاكر دعم.
- 📊 **لوحة معلومات تنفيذية** — مؤشرات مالية (إيرادات، مقبوضات، ذمم، رواتب، قيمة المخزون)، مبيعات شهرية، وتنبيهات نقص المخزون.
- 📈 **مركز تقارير** — أعلى العملاء، المخزون حسب المستودع، صحة المشاريع، وأعمار الفواتير.
- 🔐 **مصادقة بـ JWT** (HMAC-SHA256) مع تجزئة كلمات مرور بالـ salt.
- 📝 **سجل تدقيق** يسجّل كل عملية إنشاء/تعديل/حذف ومن نفّذها.
- 🔍 **بحث وفلترة** لكل موديول، مع إنشاء/تعديل/حذف كامل (CRUD).
- 🗄️ **قاعدة SQLite حقيقية** (٢٤ جدولاً) عبر `better-sqlite3`.

---

## 🛠️ التقنيات · Tech Stack

| الطبقة | التقنية |
|--------|---------|
| Backend | Node.js (HTTP server خام، بدون إطار) |
| Database | SQLite عبر `better-sqlite3` |
| Auth | JWT يدوي (HMAC-SHA256) + salted hashing |
| Frontend | HTML + CSS + JavaScript خام (SPA) |
| API | REST JSON موحّد لكل الموديولات |

اعتماد خارجي **واحد فقط** (`better-sqlite3`) — مشروع ضخم بمتطلبات تشغيل بسيطة.

---

## 🚀 التشغيل · Getting Started

**المتطلب:** Node.js 16 أو أحدث.

```bash
npm install         # تثبيت الاعتماد الوحيد
npm run reset-db    # بناء القاعدة من seed.sql (أول مرة)
npm start           # تشغيل الخادم
```

ثم افتح **http://localhost:3000**

> عند أول تشغيل تُبنى القاعدة تلقائياً من `server/data/seed.sql` إن لم تكن موجودة.

### بيانات الدخول · Login
```txt
Username: admin
Password: admin2025
```

---

## 📂 بنية المشروع · Project Structure

```txt
RafidainSuite/
├── server/
│   ├── server.js        # الخادم + REST API لكل الموديولات
│   ├── reset-db.js      # إعادة بناء القاعدة من seed.sql
│   ├── self-test.js     # اختبار آلي للمسارات
│   └── data/
│       └── seed.sql     # المخطط + البيانات (مصدر إعادة البناء)
├── public/
│   ├── index.html       # واجهة الـ SPA
│   └── assets/          # CSS, JS, logo
└── docs/
    ├── API.md
    └── DATABASE.md
```

---

## 🔌 أهم مسارات الـ API

| الطريقة | المسار | الوصف |
|---------|--------|-------|
| POST | `/api/auth/login` | تسجيل الدخول |
| GET | `/api/me` | المستخدم + الشركة + الموديولات |
| GET | `/api/dashboard` | مؤشرات ولوحة المعلومات |
| GET | `/api/reports` | التقارير التحليلية |
| GET/POST | `/api/modules/{module}` | عرض/إنشاء سجلات أي موديول |
| PUT/DELETE | `/api/modules/{module}/{id}` | تعديل/حذف سجل |

التوثيق الكامل في `docs/API.md` و `docs/DATABASE.md`.

---

## 📝 الترخيص · License

MIT © Ibrahim Ghaiyth · 2025
