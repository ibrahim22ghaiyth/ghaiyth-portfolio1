# 🗂️ TaskNest — Full-Stack Task & Project Manager

تطبيق إدارة مهام ومشاريع متكامل للفرق الصغيرة والعاملين المستقلين (Freelancers). نظام مصادقة آمن، مشاريع، مهام بأولويات وحالات، ولوحة إحصائيات — مبني بمعمارية نظيفة تفصل بين الواجهة والخادم.

A complete full-stack task & project management app for small teams and freelancers: secure authentication, projects, prioritized tasks, status tracking, and a dashboard — built with a clean client/server architecture.

> **Developed by Ibrahim Ghaiyth**

---

## ✨ المميزات · Features

- 🔐 **مصادقة آمنة** — تسجيل ودخول بـ JWT، وكلمات مرور مشفّرة بـ bcrypt.
- 🔒 **عزل بيانات كامل** — كل مستخدم يرى مشاريعه ومهامه فقط (مفروض على مستوى كل استعلام).
- 📁 **إدارة مشاريع** — إنشاء وتعديل وحذف، مع ألوان وحالات.
- ✅ **إدارة مهام** — أولويات (high/medium/low)، حالات (todo/in progress/done)، وتواريخ استحقاق.
- 📊 **لوحة إحصائيات** — ملخّص المهام والمشاريع حسب الحالة والأولوية.
- 🛡️ **تحقق صارم من المدخلات** — عبر Zod على كل المسارات.
- 🧱 **استعلامات مُجهّزة (Prepared statements)** — حماية من حقن SQL.

---

## 🛠️ التقنيات · Tech Stack

| | |
|---|---|
| **Frontend** | React · TypeScript · Vite · React Router · Zustand · Axios · Tailwind CSS |
| **Backend** | Node.js · Express · better-sqlite3 |
| **Auth & Security** | JWT · bcryptjs · Zod |
| **API** | REST JSON |

**المعمارية:** فصل واضح بين `src/` (الواجهة) و`server/` (الخادم)، والخادم مقسّم إلى `routes / middleware / db / utils`.

---

## 🚀 التشغيل · Getting Started

**المتطلب:** Node.js 16 أو أحدث.

```bash
# 1) تثبيت الحزم
npm install

# 2) إعداد متغيرات البيئة
cp .env.example .env
#    ثم غيّر JWT_SECRET إلى قيمة سرية خاصة بك

# 3) تهيئة قاعدة البيانات (تُنشئ الجداول + بيانات تجريبية)
npm run db:init

# 4) تشغيل الواجهة والخادم معاً
npm run dev
```

- الواجهة · Frontend → http://localhost:5173
- الخادم · API → http://localhost:5000

> القاعدة تُهيّأ تلقائياً عند أول إقلاع للخادم أيضاً، فلو نسيت الخطوة 3 لن يتعطل التطبيق.

### بيانات الدخول التجريبية · Demo login
```txt
Email:    ibrahim@example.com
Password: password123
```

---

## 📂 بنية المشروع · Project Structure

```txt
tasknest/
├── src/                      # الواجهة (React + TypeScript)
│   ├── app/                  # جذر التطبيق والتوجيه
│   ├── features/             # auth, dashboard, projects, tasks, settings
│   ├── layouts/              # تخطيط التطبيق
│   ├── store/                # حالة المصادقة (Zustand)
│   ├── lib/                  # عميل API (Axios)
│   └── types/                # أنواع TypeScript
└── server/                   # الخادم (Express)
    └── src/
        ├── index.js          # نقطة الدخول
        ├── routes/           # auth, projects, tasks, dashboard
        ├── middleware/       # حماية JWT
        ├── db/               # الاتصال + المخطط + التهيئة
        └── utils/            # أدوات مساعدة
```

---

## 🔌 أهم مسارات الـ API

| الطريقة | المسار | الحماية | الوصف |
|---------|--------|:-------:|-------|
| POST | `/api/auth/register` | — | إنشاء حساب |
| POST | `/api/auth/login` | — | تسجيل دخول |
| GET | `/api/auth/me` | 🔒 | بيانات المستخدم الحالي |
| GET/POST/PUT/DELETE | `/api/projects` | 🔒 | إدارة المشاريع |
| GET/POST/PUT/DELETE | `/api/tasks` | 🔒 | إدارة المهام (بفلاتر status/priority/project) |
| GET | `/api/dashboard` | 🔒 | إحصائيات |

التوثيق الكامل في `docs/API.md` و `docs/DATABASE.md`.

---

## 📝 الترخيص · License

MIT © Ibrahim Ghaiyth
