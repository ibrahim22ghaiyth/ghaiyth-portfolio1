export type CaseStudy = {
  id: string;
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
  todo: string[];
  ar: {
    name: string;
    summary: string;
    problem: string;
    solution: string;
    stack: string;
    outcome: string;
  };
  en: {
    name: string;
    summary: string;
    problem: string;
    solution: string;
    stack: string;
    outcome: string;
  };
};

export const caseStudies: CaseStudy[] = [
  {
    id: "academic-accountant",
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
    todo: [
      "TODO: Ibrahim add the public GitHub repository link if this project can be shared.",
      "TODO: Ibrahim add approved launch metrics, traffic results, or client outcome numbers.",
      "TODO: Ibrahim replace the screenshot if a newer final dashboard screen should be shown.",
    ],
    ar: {
      name: "المحاسب الأكاديمي",
      summary: "منصة ثنائية اللغة لشركة تدريب ومحاسبة مالية مع لوحة إدارة كاملة وطبقة حماية قوية.",
      problem: "احتاج المشروع إلى موقع احترافي يعرض الخدمات والدورات ويتيح إدارة المحتوى دون تعديل الكود، مع دعم عربي وإنكليزي وحماية مناسبة لموقع أعمال حقيقي.",
      solution: "بنيت منصة PHP/MySQL كاملة مع لوحة إدارة، تبديل RTL/LTR، إدارة صفحات وخدمات ورسائل، وطبقة حماية تشمل CSP وCSRF وتحديد المعدل وصلاحيات الإدارة.",
      stack: "PHP, MySQL, HTML, CSS, JavaScript, CMS, security middleware.",
      outcome: "منصة قابلة للإدارة والنشر العام مع تجربة عربية وإنكليزية واضحة.",
    },
    en: {
      name: "Academic Accountant",
      summary: "A bilingual PHP/MySQL platform for an accounting and financial training firm with a full CMS and hardened security.",
      problem: "The business needed a professional bilingual website to present services and courses while letting the team manage content without touching code.",
      solution: "I built a PHP/MySQL platform with a CMS dashboard, RTL/LTR switching, managed pages and messages, plus CSP, CSRF protection, rate limiting, and role-based access.",
      stack: "PHP, MySQL, HTML, CSS, JavaScript, CMS, security middleware.",
      outcome: "The result is a manageable public platform with clear Arabic and English experiences.",
    },
  },
  {
    id: "qassitha",
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
    todo: [
      "TODO: Ibrahim add the final live demo URL when Qassitha is published.",
      "TODO: Ibrahim add the GitHub repository link if it can be public.",
      "TODO: Ibrahim add final usage results or approved client notes.",
    ],
    ar: {
      name: "قسّطها",
      summary: "نظام لتتبع الديون والأقساط بالدينار العراقي مع واجهة عربية وإنكليزية منظمة.",
      problem: "إدارة الديون والأقساط محلياً تحتاج واجهة بسيطة تحفظ المبالغ والحالات وتعرض الصورة المالية بوضوح دون جداول مشتتة.",
      solution: "صممت وبنيت تجربة تتبع أقساط تركز على الدينار العراقي، حالات الدفع، المدفوعات، والمراجعة السريعة مع قابلية التوسع إلى لوحة إدارة كاملة.",
      stack: "React, TypeScript, responsive UI, bilingual content structure.",
      outcome: "نموذج عملي واضح لإدارة الأقساط ومتابعة الحالات المالية.",
    },
    en: {
      name: "Qassitha",
      summary: "A bilingual debt and installment tracker designed around Iraqi Dinar workflows.",
      problem: "Local installment tracking often depends on scattered sheets and unclear debt status, making follow-up difficult for small teams.",
      solution: "I designed a focused tracker for Iraqi Dinar amounts, payment states, follow-up views, and a structure that can grow into a full admin system.",
      stack: "React, TypeScript, responsive UI, bilingual content structure.",
      outcome: "A practical installment-management prototype with a clear local workflow.",
    },
  },
  {
    id: "architect-maamar",
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
    todo: [
      "TODO: Ibrahim add the public demo URL when Architect is ready.",
      "TODO: Ibrahim add the GitHub repository link if it can be public.",
      "TODO: Ibrahim add final readiness-score examples or approved project outcome notes.",
    ],
    ar: {
      name: "مِعمار",
      summary: "تطبيق تخطيط مشاريع ثنائي اللغة يعتمد على الذكاء الاصطناعي ومعالج من 12 خطوة مع تقييم جاهزية.",
      problem: "أصحاب المشاريع يحتاجون طريقة منظمة لتحويل الفكرة الخام إلى خطة تنفيذ واضحة قبل بدء التطوير أو التصميم.",
      solution: "بنيت تطبيق React/Vite بواجهة عربية وإنكليزية، معالج موجه من 12 خطوة، تكامل API للذكاء الاصطناعي، ونظام تقييم جاهزية.",
      stack: "React, Vite, serverless API integration, AI prompt workflow, scoring logic.",
      outcome: "أداة تساعد على تحويل الأفكار إلى خطة قابلة للتنفيذ.",
    },
    en: {
      name: "Architect",
      summary: "An AI-powered bilingual project-planning web app with a 12-step guided wizard and readiness scoring.",
      problem: "Project owners often start with a loose idea but no structured plan, making scope, content, and execution decisions unclear.",
      solution: "I built a React/Vite planning app with Arabic and English flows, a 12-step wizard, serverless AI API integration, and readiness scoring.",
      stack: "React, Vite, serverless API integration, AI prompt workflow, scoring logic.",
      outcome: "The app turns early ideas into a practical project plan.",
    },
  },
];

export const futureCaseStudySlots = [
  "TODO: Ibrahim add restaurant platform case study when screenshots, stack, and outcome are ready.",
  "TODO: Ibrahim add task management system case study when screenshots, stack, and outcome are ready.",
  "TODO: Ibrahim add support-desk system case study when screenshots, stack, and outcome are ready.",
];

export const projectTodoItems = [
  ...caseStudies.flatMap((project) => project.todo.map((item) => `${project.id}: ${item}`)),
  ...futureCaseStudySlots,
];
