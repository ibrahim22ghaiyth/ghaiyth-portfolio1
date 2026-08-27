# 🍽️ Dijla & Tanoor — Restaurant Ordering System

نظام طلبات مطعم متكامل ثنائي اللغة (عربي/إنجليزي) مبني بقاعدة بيانات SQLite حقيقية ولوحة تحكم إدارية — مصمّم خصيصاً للسوق العراقي.

A complete bilingual (Arabic / English) restaurant menu & ordering system with a real SQLite database and an admin dashboard. Built with zero front-end frameworks and a dependency-light Node.js backend.

> **Developed by Ibrahim Ghaiyth**

---

## ✨ المميزات · Features

- 🛒 **طلب مباشر** — سلة مشتريات، توصيل أو استلام، وحساب تلقائي للمجموع والتوصيل والضريبة.
- 💳 **دفع محلي عراقي** — نقد عند الاستلام، زين كاش، أو آسيا حوالة.
- 🌐 **ثنائي اللغة بالكامل** — تبديل فوري بين العربية والإنجليزية مع دعم RTL/LTR.
- 📊 **لوحة تحكم إدارية** — إدارة الأصناف والمنتجات والطلبات والإعدادات، مع إحصائيات مباشرة وتصدير JSON.
- 🗄️ **قاعدة بيانات SQLite حقيقية** — بمعاملات (transactions) آمنة ومفاتيح أجنبية.
- 🔒 **باكند محكم** — تحقق من المدخلات، حماية من path-traversal، وحدّ لحجم الطلب.

---

## 🛠️ التقنيات · Tech Stack

| الطبقة | التقنية |
|--------|---------|
| Backend | Node.js (HTTP server خام، بدون إطار) |
| Database | SQLite عبر `better-sqlite3` |
| Frontend | HTML + CSS + JavaScript خام (بدون أطر) |
| API | REST JSON |

اختيار الأدوات مقصود: **اعتماد خارجي واحد فقط** (`better-sqlite3`)، مما يجعل المشروع خفيفاً وسهل التشغيل والصيانة.

---

## 🚀 التشغيل · Getting Started

**المتطلب:** Node.js 16 أو أحدث.

```bash
# 1) تثبيت الاعتماد الوحيد
npm install

# 2) بناء قاعدة البيانات من ملف seed (أول مرة فقط)
npm run reset-db

# 3) تشغيل الخادم
npm start
```

ثم افتح:

- المنيو · Menu → http://localhost:3000
- لوحة الإدارة · Admin → http://localhost:3000/admin.html

> عند أول تشغيل، إذا لم تُنفّذ reset-db، يبني الخادم قاعدة البيانات تلقائياً من server/data/seed.sql.

---

## 📂 بنية المشروع · Project Structure

```txt
DijlaTaste-Restaurant/
├── server/
│   ├── server.js           # الخادم و REST API بالكامل
│   ├── reset-db.js         # إعادة بناء القاعدة من seed.sql
│   ├── self-test.js        # اختبار آلي لمسارات الـ API
│   └── data/
│       └── seed.sql        # المصدر الوحيد للبنية + البيانات الأولية
├── public/
│   ├── index.html          # واجهة الزبون (المنيو + الطلب)
│   ├── admin.html          # واجهة لوحة الإدارة
│   └── assets/             # CSS, JS, logo
└── docs/
    ├── API.md              # توثيق مسارات الـ API
    └── DATABASE.md         # توثيق مخطط قاعدة البيانات
```

---

## 🔌 أهم مسارات الـ API

| الطريقة | المسار | الوصف |
|---------|--------|-------|
| GET | /api/public/bootstrap | الإعدادات + الأصناف + المنتجات دفعة واحدة |
| POST | /api/public/orders | إنشاء طلب جديد |
| GET | /api/admin/dashboard | إحصائيات لوحة التحكم |
| ALL | /api/admin/products | إدارة المنتجات (CRUD) |
| ALL | /api/admin/categories | إدارة الأصناف (CRUD) |
| GET/PUT | /api/admin/orders | عرض وتحديث حالة الطلبات |

التوثيق الكامل في docs/API.md.

---

## 🧪 الاختبار · Testing

```bash
npm start            # في نافذة
npm run test:api     # في نافذة أخرى — يفحص المسارات الرئيسية
```

---

## 📝 الترخيص · License

MIT © Ibrahim Ghaiyth
