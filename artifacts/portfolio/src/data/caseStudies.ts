export type CaseStudy = {
  id: string;
  status: "live" | "prototype" | "development";
  image: {
    src: string;
    width: number;
    height: number;
    alt: {
      ar: string;
      en: string;
    };
  };
  stack: string[];
  links?: {
    live?: string;
    github?: string;
  };
  ar: {
    name: string;
    summary: string;
    audience: string;
    role: string;
    problem: string;
    solution: string;
    stack: string;
    outcome: string;
  };
  en: {
    name: string;
    summary: string;
    audience: string;
    role: string;
    problem: string;
    solution: string;
    stack: string;
    outcome: string;
  };
};

export const caseStudies: CaseStudy[] = [
  {
    id: "academic-accountant",
    status: "live",
    image: {
      src: "/project-screenshots/webp/academic-accountant.webp",
      width: 960,
      height: 600,
      alt: {
        ar: "واجهة منصة المحاسب الأكاديمي",
        en: "Academic Accountant platform interface",
      },
    },
    stack: ["PHP", "MySQL", "CMS", "CSP", "CSRF", "RBAC", "RTL/LTR"],
    links: {
      live: "https://academic-accountant.org/",
    },
    ar: {
      name: "المحاسب الأكاديمي",
      summary: "منصة ثنائية اللغة لشركة تدريب ومحاسبة مالية مع لوحة إدارة كاملة وطبقة حماية قوية.",
      audience: "شركة تدريب ومحاسبة مالية تحتاج موقعاً يعرض خدماتها ودوراتها ويتيح لها إدارة المحتوى.",
      role: "بنيت المنصة كاملة: الواجهات، ولوحة الإدارة، وقاعدة البيانات، وطبقة الحماية (CSP وCSRF وصلاحيات الإدارة وتحديد المعدل).",
      problem: "احتاج المشروع إلى موقع احترافي يعرض الخدمات والدورات ويتيح إدارة المحتوى دون تعديل الكود، مع دعم عربي وإنكليزي وحماية مناسبة لموقع أعمال حقيقي.",
      solution: "بنيت منصة PHP/MySQL كاملة مع لوحة إدارة، تبديل RTL/LTR، إدارة صفحات وخدمات ورسائل، وطبقة حماية تشمل CSP وCSRF وتحديد المعدل وصلاحيات الإدارة.",
      stack: "PHP, MySQL, HTML, CSS, JavaScript, CMS, security middleware.",
      outcome: "منصة منشورة على الويب يمكن لفريق الشركة تحديث محتواها واستقبال الرسائل عبر لوحة إدارة، بتجربة عربية وإنكليزية واضحة.",
    },
    en: {
      name: "Academic Accountant",
      summary: "A bilingual PHP/MySQL platform for an accounting and financial training firm with a full CMS and hardened security.",
      audience: "An accounting and financial training firm that needed a public site for its services and courses, with self-service content management.",
      role: "I built the full platform: interfaces, admin panel, database, and the security layer (CSP, CSRF, role-based admin access, rate limiting).",
      problem: "The business needed a professional bilingual website to present services and courses while letting the team manage content without touching code.",
      solution: "I built a PHP/MySQL platform with a CMS dashboard, RTL/LTR switching, managed pages and messages, plus CSP, CSRF protection, rate limiting, and role-based access.",
      stack: "PHP, MySQL, HTML, CSS, JavaScript, CMS, security middleware.",
      outcome: "A live platform the team can update themselves, with clear Arabic and English experiences and a working contact pipeline.",
    },
  },
  {
    id: "qassitha",
    status: "prototype",
    image: {
      src: "/project-screenshots/webp/qassitha.webp",
      width: 960,
      height: 600,
      alt: {
        ar: "واجهة قسّطها لتتبع الأقساط",
        en: "Qassitha installment tracking interface",
      },
    },
    stack: ["React", "TypeScript", "Iraqi Dinar", "Bilingual UI", "Dashboard"],
    ar: {
      name: "قسّطها",
      summary: "نظام لتتبع الديون والأقساط بالدينار العراقي مع واجهة عربية وإنكليزية منظمة.",
      audience: "أصحاب الأعمال الصغيرة والفرق التي تتابع الديون والأقساط محلياً بالدينار العراقي.",
      role: "صمّمت وبنيت الواجهة وتجربة التتبع: حالات الدفع، المبالغ بالدينار، والمراجعة السريعة — ببنية قابلة للتوسع إلى لوحة تحكم كاملة.",
      problem: "إدارة الديون والأقساط محلياً تحتاج واجهة بسيطة تحفظ المبالغ والحالات وتعرض الصورة المالية بوضوح دون جداول مشتتة.",
      solution: "صممت وبنيت تجربة تتبع أقساط تركز على الدينار العراقي، حالات الدفع، المدفوعات، والمراجعة السريعة مع قابلية التوسع إلى لوحة إدارة كاملة.",
      stack: "React, TypeScript, responsive UI, bilingual content structure.",
      outcome: "نموذج أولي يعمل يوضّح طريقة إدارة الأقساط ومتابعة الحالات المالية — لم يُنشر للعموم بعد.",
    },
    en: {
      name: "Qassitha",
      summary: "A bilingual debt and installment tracker designed around Iraqi Dinar workflows.",
      audience: "Small-business owners and teams tracking local debt and installments in Iraqi Dinar.",
      role: "I designed and built the tracking interface and workflow: payment states, Dinar amounts, and quick review — structured to grow into a full admin system.",
      problem: "Local installment tracking often depends on scattered sheets and unclear debt status, making follow-up difficult for small teams.",
      solution: "I designed a focused tracker for Iraqi Dinar amounts, payment states, follow-up views, and a structure that can grow into a full admin system.",
      stack: "React, TypeScript, responsive UI, bilingual content structure.",
      outcome: "A working prototype that demonstrates the installment workflow — not yet published publicly.",
    },
  },
  {
    id: "architect-maamar",
    status: "development",
    image: {
      src: "/project-screenshots/webp/architect-maamar.webp",
      width: 960,
      height: 600,
      alt: {
        ar: "واجهة مِعمار لتخطيط المشاريع",
        en: "Architect project planning interface",
      },
    },
    stack: ["React", "Vite", "AI API", "Serverless", "Wizard UX", "Readiness scoring"],
    ar: {
      name: "مِعمار",
      summary: "تطبيق تخطيط مشاريع ثنائي اللغة يعتمد على الذكاء الاصطناعي ومعالج من 12 خطوة مع تقييم جاهزية.",
      audience: "أصحاب المشاريع وفريقهم قبل البدء بالتصميم أو التطوير، لتنظيم الفكرة والمتطلبات.",
      role: "بنيت التطبيق: معالج الـ12 خطوة، وتكامل API للذكاء الاصطناعي، ونظام تقييم الجاهزية، والواجهة ثنائية اللغة.",
      problem: "أصحاب المشاريع يحتاجون طريقة منظمة لتحويل الفكرة الخام إلى خطة تنفيذ واضحة قبل بدء التطوير أو التصميم.",
      solution: "بنيت تطبيق React/Vite بواجهة عربية وإنكليزية، معالج موجه من 12 خطوة، تكامل API للذكاء الاصطناعي، ونظام تقييم جاهزية.",
      stack: "React, Vite, serverless API integration, AI prompt workflow, scoring logic.",
      outcome: "التطبيق قيد التطوير — النواة تعمل، والرابط العام سيُضاف عند جاهزيته للنشر.",
    },
    en: {
      name: "Architect",
      summary: "An AI-powered bilingual project-planning web app with a 12-step guided wizard and readiness scoring.",
      audience: "Project owners and their teams, before design or development starts, to structure ideas and requirements.",
      role: "I built the app: the 12-step wizard, the AI API integration, the readiness scoring logic, and the bilingual interface.",
      problem: "Project owners often start with a loose idea but no structured plan, making scope, content, and execution decisions unclear.",
      solution: "I built a React/Vite planning app with Arabic and English flows, a 12-step wizard, serverless AI API integration, and readiness scoring.",
      stack: "React, Vite, serverless API integration, AI prompt workflow, scoring logic.",
      outcome: "In active development — the core works; the public link will be added when it is ready to ship.",
    },
  },
];
