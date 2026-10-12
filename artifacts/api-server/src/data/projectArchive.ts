export type ArchiveProject = {
  title: string;
  description: string;
  titleAr: string;
  descriptionAr: string;
  techStack: string[];
  liveUrl: string | null;
  githubUrl: string;
  imageUrl: string;
  featured: boolean;
  order: number;
  active: boolean;
  status: string;
  imageAltEn: string | null;
  imageAltAr: string | null;
  audienceEn: string | null;
  audienceAr: string | null;
  roleEn: string | null;
  roleAr: string | null;
  problemEn: string | null;
  problemAr: string | null;
  solutionEn: string | null;
  solutionAr: string | null;
  stackDescEn: string | null;
  stackDescAr: string | null;
  outcomeEn: string | null;
  outcomeAr: string | null;
};

export const projectArchive: ArchiveProject[] = [
  {
    "title": "Academic Accountant",
    "description": "A professional bilingual website for financial and accounting consultation with service sections, courses, FAQ, contact flow, and a refined business identity.",
    "titleAr": "المحاسب الأكاديمي",
    "descriptionAr": "موقع احترافي ثنائي اللغة لخدمات الاستشارات المالية والمحاسبية، مع أقسام للخدمات والكورسات والأسئلة الشائعة والتواصل وهوية أعمال واضحة.",
    "techStack": ["2026", "PHP", "MySQL", "CMS", "CSP", "CSRF", "RBAC", "RTL/LTR"],
    "liveUrl": "https://academic-accountant.org/",
    "githubUrl": "",
    "imageUrl": "/project-screenshots/webp/academic-accountant.webp",
    "featured": true,
    "order": 0,
    "active": true,
    "status": "live",
    "imageAltEn": "Academic Accountant platform interface",
    "imageAltAr": "واجهة منصة المحاسب الأكاديمي",
    "audienceEn": "An accounting and financial training firm that needed a public site for its services and courses, with self-service content management.",
    "audienceAr": "شركة تدريب ومحاسبة مالية تحتاج موقعاً يعرض خدماتها ودوراتها ويتيح لها إدارة المحتوى.",
    "roleEn": "I built the full platform: interfaces, admin panel, database, and the security layer (CSP, CSRF, role-based admin access, rate limiting).",
    "roleAr": "بنيت المنصة كاملة: الواجهات، ولوحة الإدارة، وقاعدة البيانات، وطبقة الحماية (CSP وCSRF وصلاحيات الإدارة وتحديد المعدل).",
    "problemEn": "The business needed a professional bilingual website to present services and courses while letting the team manage content without touching code.",
    "problemAr": "احتاج المشروع إلى موقع احترافي يعرض الخدمات والدورات ويتيح إدارة المحتوى دون تعديل الكود، مع دعم عربي وإنكليزي وحماية مناسبة لموقع أعمال حقيقي.",
    "solutionEn": "I built a PHP/MySQL platform with a CMS dashboard, RTL/LTR switching, managed pages and messages, plus CSP, CSRF protection, rate limiting, and role-based access.",
    "solutionAr": "بنيت منصة PHP/MySQL كاملة مع لوحة إدارة، تبديل RTL/LTR، إدارة صفحات وخدمات ورسائل، وطبقة حماية تشمل CSP وCSRF وتحديد المعدل وصلاحيات الإدارة.",
    "stackDescEn": "PHP, MySQL, HTML, CSS, JavaScript, CMS, security middleware.",
    "stackDescAr": "PHP, MySQL, HTML, CSS, JavaScript, CMS, security middleware.",
    "outcomeEn": "A live platform the team can update themselves, with clear Arabic and English experiences and a working contact pipeline.",
    "outcomeAr": "منصة منشورة على الويب يمكن لفريق الشركة تحديث محتواها واستقبال الرسائل عبر لوحة إدارة، بتجربة عربية وإنكليزية واضحة."
  },
  {
    "title": "DijlaTaste Restaurant",
    "description": "A complete bilingual restaurant menu and ordering system with a real SQLite database, local payment methods, cart flow, and admin dashboard.",
    "titleAr": "DijlaTaste Restaurant",
    "descriptionAr": "نظام مطعم ثنائي اللغة لإدارة القائمة والطلبات، مع قاعدة SQLite حقيقية، طرق دفع محلية، سلة مشتريات، ولوحة إدارة.",
    "techStack": ["2023", "Node.js", "SQLite", "Admin Dashboard", "Bilingual"],
    "liveUrl": null,
    "githubUrl": "https://github.com/ibrahim22ghaiyth/DijlaTaste-Restaurant",
    "imageUrl": "/project-screenshots/dijlataste-restaurant.png",
    "featured": true,
    "order": 1,
    "active": true,
    "status": "prototype",
    "imageAltEn": null,
    "imageAltAr": null,
    "audienceEn": null,
    "audienceAr": null,
    "roleEn": null,
    "roleAr": null,
    "problemEn": null,
    "problemAr": null,
    "solutionEn": null,
    "solutionAr": null,
    "stackDescEn": null,
    "stackDescAr": null,
    "outcomeEn": null,
    "outcomeAr": null
  },
  {
    "title": "TaskNest",
    "description": "A full-stack task and project management app with React, TypeScript, Express, SQLite, JWT authentication, projects, tasks, and dashboard analytics.",
    "titleAr": "TaskNest",
    "descriptionAr": "تطبيق متكامل لإدارة المهام والمشاريع باستخدام React وTypeScript وExpress وSQLite، مع JWT وتحليلات لوحة تحكم.",
    "techStack": ["2024", "React", "TypeScript", "Express", "JWT", "SQLite"],
    "liveUrl": null,
    "githubUrl": "https://github.com/ibrahim22ghaiyth/TaskNest",
    "imageUrl": "/project-screenshots/tasknest.png",
    "featured": true,
    "order": 2,
    "active": true,
    "status": "prototype",
    "imageAltEn": null, "imageAltAr": null,
    "audienceEn": null, "audienceAr": null,
    "roleEn": null, "roleAr": null,
    "problemEn": null, "problemAr": null,
    "solutionEn": null, "solutionAr": null,
    "stackDescEn": null, "stackDescAr": null,
    "outcomeEn": null, "outcomeAr": null
  },
  {
    "title": "SentinelDesk",
    "description": "A cybersecurity client portal with FastAPI/Python, protected assets, incidents, advisories, compliance modules, audit log, and a real SQLite-backed workflow.",
    "titleAr": "SentinelDesk",
    "descriptionAr": "بوابة عملاء للأمن السيبراني باستخدام FastAPI وPython، تشمل الأصول والحوادث والتنبيهات والامتثال وسجل تدقيق وقاعدة SQLite.",
    "techStack": ["2024", "Python", "FastAPI", "SQLite", "Security Portal"],
    "liveUrl": null,
    "githubUrl": "https://github.com/ibrahim22ghaiyth/SentinelDesk",
    "imageUrl": "/project-screenshots/sentineldesk.png",
    "featured": true,
    "order": 3,
    "active": true,
    "status": "prototype",
    "imageAltEn": null, "imageAltAr": null,
    "audienceEn": null, "audienceAr": null,
    "roleEn": null, "roleAr": null,
    "problemEn": null, "problemAr": null,
    "solutionEn": null, "solutionAr": null,
    "stackDescEn": null, "stackDescAr": null,
    "outcomeEn": null, "outcomeAr": null
  },
  {
    "title": "Architect Maamar",
    "description": "A bilingual planning studio for websites, apps, and digital systems with React, Express, dark/light mode, export-ready planning output, and Groq AI support.",
    "titleAr": "مِعمار",
    "descriptionAr": "تطبيق تخطيط مشاريع ثنائي اللغة يعتمد على الذكاء الاصطناعي ومعالج من 12 خطوة مع تقييم جاهزية.",
    "techStack": ["2025", "React", "Vite", "AI API", "Serverless", "Wizard UX"],
    "liveUrl": null,
    "githubUrl": "https://github.com/ibrahim22ghaiyth/Architect-Maamar",
    "imageUrl": "/project-screenshots/webp/architect-maamar.webp",
    "featured": true,
    "order": 4,
    "active": true,
    "status": "development",
    "imageAltEn": "Architect project planning interface",
    "imageAltAr": "واجهة مِعمار لتخطيط المشاريع",
    "audienceEn": "Project owners and their teams, before design or development starts, to structure ideas and requirements.",
    "audienceAr": "أصحاب المشاريع وفريقهم قبل البدء بالتصميم أو التطوير، لتنظيم الفكرة والمتطلبات.",
    "roleEn": "I built the app: the 12-step wizard, the AI API integration, the readiness scoring logic, and the bilingual interface.",
    "roleAr": "بنيت التطبيق: معالج الـ12 خطوة، وتكامل API للذكاء الاصطناعي، ونظام تقييم الجاهزية، والواجهة ثنائية اللغة.",
    "problemEn": "Project owners often start with a loose idea but no structured plan, making scope, content, and execution decisions unclear.",
    "problemAr": "أصحاب المشاريع يحتاجون طريقة منظمة لتحويل الفكرة الخام إلى خطة تنفيذ واضحة قبل بدء التطوير أو التصميم.",
    "solutionEn": "I built a React/Vite planning app with Arabic and English flows, a 12-step wizard, serverless AI API integration, and readiness scoring.",
    "solutionAr": "بنيت تطبيق React/Vite بواجهة عربية وإنكليزية، معالج موجه من 12 خطوة، تكامل API للذكاء الاصطناعي، ونظام تقييم جاهزية.",
    "stackDescEn": "React, Vite, serverless API integration, AI prompt workflow, scoring logic.",
    "stackDescAr": "React, Vite, serverless API integration, AI prompt workflow, scoring logic.",
    "outcomeEn": "In active development — the core works; the public link will be added when it is ready to ship.",
    "outcomeAr": "التطبيق قيد التطوير — النواة تعمل، والرابط العام سيُضاف عند جاهزيته للنشر."
  },
  {
    "title": "RafidainSuite",
    "description": "A large enterprise ERP suite with 21 modules across finance, inventory, HR, CRM, projects, audit logging, token authentication, and executive reporting.",
    "titleAr": "RafidainSuite",
    "descriptionAr": "منظومة ERP مؤسسية تضم 21 وحدة للمالية والمخزون والموارد البشرية وCRM والمشاريع وسجل التدقيق والتقارير التنفيذية.",
    "techStack": ["2025", "Node.js", "SQLite", "ERP", "21 Modules"],
    "liveUrl": null,
    "githubUrl": "https://github.com/ibrahim22ghaiyth/RafidainSuite",
    "imageUrl": "/project-screenshots/rafidainsuite.png",
    "featured": true,
    "order": 5,
    "active": true,
    "status": "prototype",
    "imageAltEn": null, "imageAltAr": null,
    "audienceEn": null, "audienceAr": null,
    "roleEn": null, "roleAr": null,
    "problemEn": null, "problemAr": null,
    "solutionEn": null, "solutionAr": null,
    "stackDescEn": null, "stackDescAr": null,
    "outcomeEn": null, "outcomeAr": null
  },
  {
    "title": "Qassitha",
    "description": "An Iraqi Dinar debt and installment tracker with automatic schedules, local payment records, two-way ledgers, overdue alerts, and bilingual interface.",
    "titleAr": "قسّطها",
    "descriptionAr": "نظام لتتبع الديون والأقساط بالدينار العراقي، مع جداول تلقائية وسجلات دفع محلية ودفاتر طرفين وتنبيهات تأخير وواجهة ثنائية اللغة.",
    "techStack": ["2026", "React", "TypeScript", "Iraqi Dinar", "Bilingual UI", "Dashboard"],
    "liveUrl": null,
    "githubUrl": "https://github.com/ibrahim22ghaiyth/Qassitha",
    "imageUrl": "/project-screenshots/webp/qassitha.webp",
    "featured": true,
    "order": 6,
    "active": true,
    "status": "prototype",
    "imageAltEn": "Qassitha installment tracking interface",
    "imageAltAr": "واجهة قسّطها لتتبع الأقساط",
    "audienceEn": "Small-business owners and teams tracking local debt and installments in Iraqi Dinar.",
    "audienceAr": "أصحاب الأعمال الصغيرة والفرق التي تتابع الديون والأقساط محلياً بالدينار العراقي.",
    "roleEn": "I designed and built the tracking interface and workflow: payment states, Dinar amounts, and quick review — structured to grow into a full admin system.",
    "roleAr": "صمّمت وبنيت الواجهة وتجربة التتبع: حالات الدفع، المبالغ بالدينار، والمراجعة السريعة — ببنية قابلة للتوسع إلى لوحة تحكم كاملة.",
    "problemEn": "Local installment tracking often depends on scattered sheets and unclear debt status, making follow-up difficult for small teams.",
    "problemAr": "إدارة الديون والأقساط محلياً تحتاج واجهة بسيطة تحفظ المبالغ والحالات وتعرض الصورة المالية بوضوح دون جداول مشتتة.",
    "solutionEn": "I designed a focused tracker for Iraqi Dinar amounts, payment states, follow-up views, and a structure that can grow into a full admin system.",
    "solutionAr": "صممت وبنيت تجربة تتبع أقساط تركز على الدينار العراقي، حالات الدفع، المدفوعات، والمراجعة السريعة مع قابلية التوسع إلى لوحة إدارة كاملة.",
    "stackDescEn": "React, TypeScript, responsive UI, bilingual content structure.",
    "stackDescAr": "React, TypeScript, responsive UI, bilingual content structure.",
    "outcomeEn": "A working prototype that demonstrates the installment workflow — not yet published publicly.",
    "outcomeAr": "نموذج أولي يعمل يوضّح طريقة إدارة الأقساط ومتابعة الحالات المالية — لم يُنشر للعموم بعد."
  },
  {
    "title": "ISM27",
    "description": "A smart educational PWA for ICT college students — organizing lectures, notes, exams, and study progress offline-first, deployed on Cloudflare Pages.",
    "titleAr": "ISM27",
    "descriptionAr": "منصة تعليمية ذكية لطلبة كلية المعلومات وتقنية الاتصال — تنظيم المحاضرات والمذكرات والاختبارات وتقدم المذاكرة، تعمل بدون إنترنت.",
    "techStack": ["2026", "React", "Vite", "PWA", "Offline-first", "Tailwind CSS", "Cloudflare Pages"],
    "liveUrl": "https://ism27.pages.dev/",
    "githubUrl": "",
    "imageUrl": "/project-covers/ism27.png",
    "featured": true,
    "order": 7,
    "active": true,
    "status": "live",
    "imageAltEn": "ISM27 educational platform interface",
    "imageAltAr": "واجهة منصة ISM27 التعليمية",
    "audienceEn": "University of Baghdad students — College of Information and Communication Technology (Management Information Systems).",
    "audienceAr": "طلبة جامعة بغداد — كلية المعلومات وتقنية الاتصال (قسم إدارة المعلومات).",
    "roleEn": "Full design and development: interface, content organization, offline mode, and exam/lecture tracking system.",
    "roleAr": "تصميم وتطوير المنصة بالكامل: الواجهة، نظام التنظيم، وضع عدم الاتصال، ونظام الاختبارات والمحاضرات.",
    "problemEn": "Students scatter lecture files, notes, and exam materials across different places, making review and quick access difficult, especially without internet.",
    "problemAr": "الطلبة يوزعون ملفات المحاضرات والمذكرات والاختبارات في أماكن متفرقة، مما يصعب المراجعة والوصول السريع خاصة بدون إنترنت.",
    "solutionEn": "I built a PWA that works offline, organizes lectures, notes, and exams, with study progress tracking and schedule notifications.",
    "solutionAr": "بنيت منصة PWA تعمل بدون إنترنت، تنظم المحاضرات والمذكرات والاختبارات، مع عرض تقدم المذاكرة وإشعارات بالمواعيد.",
    "stackDescEn": "React, Vite, Progressive Web App, offline storage, Tailwind CSS, deployed on Cloudflare Pages.",
    "stackDescAr": "React, Vite, Progressive Web App, offline storage, Tailwind CSS, deployed on Cloudflare Pages.",
    "outcomeEn": "Published and live — serving department students with offline access and full educational content organization.",
    "outcomeAr": "المنصة منشورة وتعمل — تخدم طلبة القسم مع دعم الوصول بدون إنترنت وتنظيم كامل للمحتوى التعليمي."
  }
];

export const legacyArchiveTitles = [
  "Campus Notes Archive",
  "Local Shop Landing Page",
  "Clinic Appointment UI",
  "Restaurant Menu Website",
  "Freelancer Portfolio v1",
  "Real Estate Listings",
  "Event Registration Portal",
  "Inventory Control Panel",
  "Online Course Hub",
  "Agency Services Website",
  "Support Ticket Dashboard",
  "Booking & Payments Mockup",
  "Bilingual Portfolio Platform",
  "Client CRM Mini Suite",
  "Analytics Admin Console",
  "Service Provider Portal",
  "SaaS Billing Dashboard",
  "Business Intelligence Cards",
  "Enterprise Operations Hub",
  "IG Portfolio Admin System",
];


