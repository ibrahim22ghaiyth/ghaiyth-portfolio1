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
};

export const projectArchive: ArchiveProject[] = [
  {
    "title": "Academic Accountant",
    "description": "A professional bilingual website for financial and accounting consultation with service sections, courses, FAQ, contact flow, and a refined business identity.",
    "titleAr": "Academic Accountant",
    "descriptionAr": "موقع احترافي ثنائي اللغة لخدمات الاستشارات المالية والمحاسبية، مع أقسام للخدمات والكورسات والأسئلة الشائعة والتواصل وهوية أعمال واضحة.",
    "techStack": [
      "2026",
      "React",
      "Bilingual",
      "Business Website",
      "Consultation"
    ],
    "liveUrl": "https://academic-accountant.org/",
    "githubUrl": "",
    "imageUrl": "/project-screenshots/webp/academic-accountant.webp",
    "featured": true,
    "order": 0,
    "active": true
  },
  {
    "title": "DijlaTaste Restaurant",
    "description": "A complete bilingual restaurant menu and ordering system with a real SQLite database, local payment methods, cart flow, and admin dashboard.",
    "titleAr": "DijlaTaste Restaurant",
    "descriptionAr": "نظام مطعم ثنائي اللغة لإدارة القائمة والطلبات، مع قاعدة SQLite حقيقية، طرق دفع محلية، سلة مشتريات، ولوحة إدارة.",
    "techStack": [
      "2023",
      "Node.js",
      "SQLite",
      "Admin Dashboard",
      "Bilingual"
    ],
    "liveUrl": null,
    "githubUrl": "https://github.com/ibrahim22ghaiyth/DijlaTaste-Restaurant",
    "imageUrl": "/project-screenshots/dijlataste-restaurant.png",
    "featured": true,
    "order": 1,
    "active": true
  },
  {
    "title": "TaskNest",
    "description": "A full-stack task and project management app with React, TypeScript, Express, SQLite, JWT authentication, projects, tasks, and dashboard analytics.",
    "titleAr": "TaskNest",
    "descriptionAr": "تطبيق متكامل لإدارة المهام والمشاريع باستخدام React وTypeScript وExpress وSQLite، مع JWT وتحليلات لوحة تحكم.",
    "techStack": [
      "2024",
      "React",
      "TypeScript",
      "Express",
      "JWT",
      "SQLite"
    ],
    "liveUrl": null,
    "githubUrl": "https://github.com/ibrahim22ghaiyth/TaskNest",
    "imageUrl": "/project-screenshots/tasknest.png",
    "featured": true,
    "order": 2,
    "active": true
  },
  {
    "title": "SentinelDesk",
    "description": "A cybersecurity client portal with FastAPI/Python, protected assets, incidents, advisories, compliance modules, audit log, and a real SQLite-backed workflow.",
    "titleAr": "SentinelDesk",
    "descriptionAr": "بوابة عملاء للأمن السيبراني باستخدام FastAPI وPython، تشمل الأصول والحوادث والتنبيهات والامتثال وسجل تدقيق وقاعدة SQLite.",
    "techStack": [
      "2024",
      "Python",
      "FastAPI",
      "SQLite",
      "Security Portal"
    ],
    "liveUrl": null,
    "githubUrl": "https://github.com/ibrahim22ghaiyth/SentinelDesk",
    "imageUrl": "/project-screenshots/sentineldesk.png",
    "featured": true,
    "order": 3,
    "active": true
  },
  {
    "title": "Architect Maamar",
    "description": "A bilingual planning studio for websites, apps, and digital systems with React, Express, dark/light mode, export-ready planning output, and Groq AI support.",
    "titleAr": "Architect Maamar",
    "descriptionAr": "استوديو تخطيط ثنائي اللغة للمواقع والتطبيقات والأنظمة الرقمية، مع React وExpress ووضعين للثيم وتصدير خطط ودعم Groq AI.",
    "techStack": [
      "2025",
      "React",
      "Express",
      "Groq AI",
      "Bilingual"
    ],
    "liveUrl": null,
    "githubUrl": "https://github.com/ibrahim22ghaiyth/Architect-Maamar",
    "imageUrl": "/project-screenshots/webp/architect-maamar.webp",
    "featured": true,
    "order": 4,
    "active": true
  },
  {
    "title": "RafidainSuite",
    "description": "A large enterprise ERP suite with 21 modules across finance, inventory, HR, CRM, projects, audit logging, token authentication, and executive reporting.",
    "titleAr": "RafidainSuite",
    "descriptionAr": "منظومة ERP مؤسسية تضم 21 وحدة للمالية والمخزون والموارد البشرية وCRM والمشاريع وسجل التدقيق والتقارير التنفيذية.",
    "techStack": [
      "2025",
      "Node.js",
      "SQLite",
      "ERP",
      "21 Modules"
    ],
    "liveUrl": null,
    "githubUrl": "https://github.com/ibrahim22ghaiyth/RafidainSuite",
    "imageUrl": "/project-screenshots/rafidainsuite.png",
    "featured": true,
    "order": 5,
    "active": true
  },
  {
    "title": "Qassitha",
    "description": "An Iraqi Dinar debt and installment tracker with automatic schedules, local payment records, two-way ledgers, overdue alerts, and bilingual interface.",
    "titleAr": "Qassitha",
    "descriptionAr": "نظام لتتبع الديون والأقساط بالدينار العراقي، مع جداول تلقائية وسجلات دفع محلية ودفاتر طرفين وتنبيهات تأخير وواجهة ثنائية اللغة.",
    "techStack": [
      "2026",
      "Node.js",
      "SQLite",
      "Finance",
      "RTL"
    ],
    "liveUrl": null,
    "githubUrl": "https://github.com/ibrahim22ghaiyth/Qassitha",
    "imageUrl": "/project-screenshots/webp/qassitha.webp",
    "featured": true,
    "order": 6,
    "active": true
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


