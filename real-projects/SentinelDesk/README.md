# 🛡️ SentinelDesk — Cybersecurity Client Portal

بوابة أمن سيبراني متكاملة تعرض لوحة معلومات للأحداث والحوادث والأصول المحمية، مع ١٠ موديولات تشغيلية ونظام صلاحيات وسجل تدقيق. مبنية بـ Python مع مسارين للتشغيل: نسخة FastAPI احترافية، ونسخة بدون أي تبعيات.

A full-stack cybersecurity client portal: a security operations dashboard covering events, incidents, protected assets, advisories, compliance, Zero-Trust policies, and more — across 10 operational modules, with token auth and an audit log.

> **Developed by Ibrahim Ghaiyth · 2024**

---

## ⚠️ ملاحظة عن السياق · Context Note

يستخدم هذا المشروع **Cloudflare, Inc.** كسياق شركة عام (فئات منتجات مثل WAF، DDoS، Magic Transit، Zero Trust، Bot Management، Turnstile). هو **عمل بورتفوليو مستقل**، وليس منتجاً رسمياً من Cloudflare ولا يدّعي أي انتماء أو علاقة بها.

This is an **independent portfolio build**. It is **not** an official Cloudflare product and makes no affiliation claim. See `docs/SOURCES.md` for the public references used.

---

## ✨ المميزات · Features

- 📊 **لوحة معلومات أمنية** — مؤشرات (KPIs)، أحداث حسب الخطورة، تغطية الخدمات، وأعلى الأصول خطورة.
- 🧩 **١٠ موديولات** — كتالوج الخدمات، الأصول المحمية، الأحداث، الحوادث، التنبيهات، حالات الدعم، تقارير الامتثال، سياسات Zero-Trust، جرد الـ APIs، وتقارير العملاء.
- 🔐 **مصادقة بالجلسات (Token sessions)** — مع تجزئة كلمات مرور بالـ salt.
- 📝 **سجل تدقيق (Audit log)** — يسجّل كل إنشاء/تعديل/حذف ومن نفّذه.
- 🔍 **بحث وفلاتر** على كل موديول.
- 📤 **تصدير كامل** للبيانات بصيغة JSON.

---

## 🚀 التشغيل · Getting Started

عندك **خياران** للتشغيل — اختر واحداً:

### الخيار أ — نسخة FastAPI (موصى بها)
احترافية، مع توثيق تفاعلي تلقائي على `/docs`.

```bash
pip install -r requirements.txt
python init_db.py                 # بناء القاعدة (أول مرة)
uvicorn app.main:app --reload --port 8000
```

### الخيار ب — نسخة بدون تبعيات (Zero-dependency)
تشتغل بمكتبة Python القياسية فقط — بدون أي `pip install`.

```bash
python server.py
```

ثم افتح في الحالتين: **http://localhost:8000**

> القاعدة تُبنى تلقائياً من `app/data/seed.sql` عند أول تشغيل إن لم تكن موجودة.

### بيانات الدخول · Login
```txt
Username: admin
Password: sentinel2024
```

---

## 🛠️ التقنيات · Tech Stack

| الطبقة | التقنية |
|--------|---------|
| Backend (أساسي) | Python · FastAPI · Pydantic |
| Backend (بديل) | Python standard library (بدون تبعيات) |
| Database | SQLite |
| Frontend | HTML + CSS + JavaScript خام (SPA) |
| Auth | Token sessions + salted password hashing |

---

## 📂 بنية المشروع · Project Structure

```txt
SentinelDesk/
├── app/
│   ├── main.py              # نسخة FastAPI
│   └── data/
│       └── seed.sql         # المخطط + البيانات (مصدر إعادة البناء)
├── server.py                # نسخة stdlib (بدون تبعيات)
├── init_db.py               # بناء/إعادة بناء القاعدة
├── requirements.txt         # تبعيات نسخة FastAPI
├── public/                  # الواجهة (SPA)
│   ├── index.html
│   └── assets/              # CSS, JS
└── docs/
    ├── API.md
    ├── DATABASE.md
    └── SOURCES.md           # المراجع العامة المستخدمة
```

---

## 🔌 أهم مسارات الـ API

| الطريقة | المسار | الوصف |
|---------|--------|-------|
| POST | `/api/auth/login` | تسجيل الدخول |
| GET | `/api/me` | المستخدم + ملف الشركة + الموديولات |
| GET | `/api/dashboard` | مؤشرات ولوحة المعلومات |
| GET/POST | `/api/modules/{module}` | عرض/إنشاء سجلات موديول |
| PUT/DELETE | `/api/modules/{module}/{id}` | تعديل/حذف سجل |
| GET | `/api/export` | تصدير كل البيانات JSON |

التوثيق الكامل في `docs/API.md` و `docs/DATABASE.md`.

---

## 📝 الترخيص · License

MIT © Ibrahim Ghaiyth · 2024
