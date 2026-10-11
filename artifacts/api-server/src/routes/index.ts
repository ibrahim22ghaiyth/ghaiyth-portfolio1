import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import analyticsRouter from "./analytics";
import { requireAdmin } from "../middlewares/auth";
import { getDatabaseUrl } from "@workspace/db/connection-string";
import { projectArchive } from "../data/projectArchive";
import { defaultProducts } from "../data/defaultProducts";
import { messageInputSchema } from "./schemas";

const router: IRouter = Router();
const databaseUrl = getDatabaseUrl();
const isProductionRuntime = process.env.NODE_ENV === "production" || Boolean(
  process.env.RAILWAY_ENVIRONMENT_NAME ||
  process.env.RAILWAY_ENVIRONMENT ||
  process.env.RAILWAY_PROJECT_ID
);

if (!databaseUrl && isProductionRuntime) {
  throw new Error(
    "Persistent DATABASE_URL is required in production. Connect the Railway PostgreSQL service to the website service before deploying.",
  );
}

router.use(healthRouter);
router.use(authRouter);
router.use(analyticsRouter);

router.get("/admin/storage", requireAdmin, (_req, res) => {
  res.json({
    storageMode: databaseUrl ? "database" : "memory",
    databaseSignals: {
      DATABASE_URL: Boolean(process.env.DATABASE_URL),
      DATABASE_PUBLIC_URL: Boolean(process.env.DATABASE_PUBLIC_URL),
      DATABASE_PRIVATE_URL: Boolean(process.env.DATABASE_PRIVATE_URL),
      POSTGRES_URL: Boolean(process.env.POSTGRES_URL),
      PGHOST: Boolean(process.env.PGHOST),
      PGDATABASE: Boolean(process.env.PGDATABASE),
    },
    railway: {
      service: process.env.RAILWAY_SERVICE_NAME || null,
      environment: process.env.RAILWAY_ENVIRONMENT_NAME || process.env.RAILWAY_ENVIRONMENT || null,
      deployment: process.env.RAILWAY_DEPLOYMENT_ID || null,
    },
  });
});

if (databaseUrl) {
  const { default: servicesRouter } = await import("./services");
  const { default: skillsRouter } = await import("./skills");
  const { default: projectsRouter } = await import("./projects");
  const { default: contentRouter } = await import("./content");
  const { default: messagesRouter } = await import("./messages");
  const { default: blogRouter } = await import("./blog");
  const { default: productsRouter } = await import("./products");
  const { default: testimonialsRouter } = await import("./testimonials");

  router.use(servicesRouter);
  router.use(skillsRouter);
  router.use(projectsRouter);
  router.use(contentRouter);
  router.use(messagesRouter);
  router.use(blogRouter);
  router.use(productsRouter);
  router.use(testimonialsRouter);
} else {
  const previewServices = [
    {
      id: 1,
      title: "Web Development",
      description: "Responsive websites and dashboards built with React, Tailwind, Node.js, and clean API integrations.",
      titleAr: "تطوير مواقع الويب",
      descriptionAr: "مواقع ولوحات تحكم متجاوبة باستخدام React وTailwind وNode.js وربط API بشكل مرتب.",
      icon: "Code2",
      order: 1,
      active: true,
    },
    {
      id: 2,
      title: "Backend Systems",
      description: "Secure server APIs, authentication, database schemas, admin tools, and production-ready workflows.",
      titleAr: "أنظمة الباكند",
      descriptionAr: "واجهات API آمنة، تسجيل دخول، قواعد بيانات، أدوات إدارة، وتجهيزات مناسبة للإنتاج.",
      icon: "Server",
      order: 2,
      active: true,
    },
    {
      id: 3,
      title: "Portfolio & Business Sites",
      description: "Personal and business websites with contact flows, project showcases, multilingual content, and admin editing.",
      titleAr: "مواقع شخصية وتجارية",
      descriptionAr: "مواقع شخصية وتجارية مع نماذج تواصل، عرض مشاريع، دعم للغتين، وتعديل من لوحة الإدارة.",
      icon: "Briefcase",
      order: 3,
      active: true,
    },
    {
      id: 4,
      title: "Maintenance & Fixes",
      description: "Bug fixing, performance cleanup, deployment help, and long-term improvements for existing projects.",
      titleAr: "صيانة وإصلاح مشاكل",
      descriptionAr: "إصلاح أخطاء، تحسين أداء، مساعدة بالنشر، وتطوير مستمر للمشاريع الموجودة.",
      icon: "Wrench",
      order: 4,
      active: true,
    },
  ];

  const previewSkills = [
    { id: 1, name: "React / TypeScript", nameAr: "React / TypeScript", percentage: 92, category: "Frontend", order: 1, active: true },
    { id: 2, name: "Node.js / Express", nameAr: "Node.js / Express", percentage: 88, category: "Backend", order: 2, active: true },
    { id: 3, name: "PostgreSQL / Drizzle", nameAr: "PostgreSQL / Drizzle", percentage: 82, category: "Database", order: 3, active: true },
    { id: 4, name: "Tailwind CSS", nameAr: "Tailwind CSS", percentage: 90, category: "Frontend", order: 4, active: true },
    { id: 5, name: "Deployment", nameAr: "النشر والاستضافة", percentage: 78, category: "Ops", order: 5, active: true },
  ];

  const previewProjects = projectArchive.map((project, index) => ({
    id: index + 1,
    ...project,
  }));

  type PreviewProduct = {
    id: number;
    slug: string;
    title: string;
    description: string;
    titleAr: string | null;
    descriptionAr: string | null;
    tags: string[];
    priceLabel: string | null;
    imageUrl: string | null;
    requestUrl: string | null;
    template: string;
    purchaseLabel: string | null;
    purchaseNote: string | null;
    deliveryType: string;
    featured: boolean;
    order: number;
    active: boolean;
  };

  let nextPreviewProductId = defaultProducts.length + 1;
  const previewProducts: PreviewProduct[] = defaultProducts.map((product, index) => ({
    id: index + 1,
    ...product,
    tags: [...product.tags],
  }));

  const previewContent = [
    { key: "preview_notice", value: "Running in local preview mode without DATABASE_URL.", type: "text" },
  ];

  type PreviewBlogPost = {
    id: number;
    title: string;
    titleAr: string | null;
    excerpt: string;
    excerptAr: string | null;
    content: string;
    contentAr: string | null;
    slug: string;
    coverImageUrl: string | null;
    tags: string[];
    featured: boolean;
    order: number;
    active: boolean;
    publishedAt: string;
    createdAt: string;
    updatedAt: string;
  };

  let nextPreviewBlogPostId = 3;
  const previewBlogPosts: PreviewBlogPost[] = [
    {
      id: 1,
      title: "Why persistent data matters in portfolio systems",
      titleAr: "لماذا استمرارية البيانات مهمة في أنظمة البورتفوليو",
      excerpt: "A short beta note about keeping messages, visitors, and admin content alive after every deployment.",
      excerptAr: "ملاحظة بيتا عن الحفاظ على الرسائل والزوار ومحتوى الأدمن بعد كل تحديث.",
      content: "Production websites should never rely on temporary memory storage for business data.",
      contentAr: "المواقع الإنتاجية لا يجب أن تعتمد على الذاكرة المؤقتة لحفظ بيانات العمل.",
      slug: "persistent-data-portfolio-systems",
      coverImageUrl: "/project-covers/ig-portfolio-admin-system.svg",
      tags: ["PostgreSQL", "Admin", "Deployment"],
      featured: true,
      order: 1,
      active: true,
      publishedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 2,
      title: "Building client-ready dashboards",
      titleAr: "بناء لوحات تحكم جاهزة للعملاء",
      excerpt: "A beta archive for notes about admin panels, analytics, content editing, and secure workflows.",
      excerptAr: "أرشيف بيتا لملاحظات عن لوحات الإدارة والتحليلات وتحرير المحتوى ومسارات العمل الآمنة.",
      content: "A dashboard is useful when it makes repeated work faster and safer.",
      contentAr: "لوحة التحكم تكون مفيدة عندما تجعل العمل المتكرر أسرع وأكثر أماناً.",
      slug: "client-ready-dashboards",
      coverImageUrl: "/project-covers/analytics-admin-console.svg",
      tags: ["Dashboards", "UX", "Systems"],
      featured: false,
      order: 2,
      active: true,
      publishedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  type PreviewTestimonial = {
    id: number;
    clientName: string;
    clientNameAr: string | null;
    company: string;
    companyAr: string | null;
    feedback: string;
    feedbackAr: string | null;
    projectName: string | null;
    projectNameAr: string | null;
    rating: number;
    order: number;
    active: boolean;
  };

  let nextPreviewTestimonialId = 1;
  const previewTestimonials: PreviewTestimonial[] = [];

  type PreviewMessage = {
    id: number;
    name: string;
    email: string;
    subject: string;
    message: string;
    status: "unread" | "read" | "replied" | "archived";
    createdAt: string;
  };

  let nextPreviewMessageId = 1;
  const previewMessages: PreviewMessage[] = [
    {
      id: nextPreviewMessageId++,
      name: "Preview Client",
      email: "client@example.com",
      subject: "Example contact request",
      message: "This is a local preview message. New contact form submissions will appear here while the API server is running.",
      status: "unread",
      createdAt: new Date().toISOString(),
    },
  ];

  router.get("/services", (_req, res) => {
    res.json(previewServices);
  });

  router.get("/skills", (_req, res) => {
    res.json(previewSkills);
  });

  router.get("/projects", (_req, res) => {
    res.json(previewProjects);
  });

  router.get("/products", (_req, res) => {
    res.json([...previewProducts].sort((a, b) => a.order - b.order || a.id - b.id));
  });

  router.get("/products/:slugOrId", (req, res) => {
    const raw = String(req.params.slugOrId || "");
    const product = previewProducts.find((item) => item.active && (item.slug === raw || String(item.id) === raw));
    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    res.json(product);
  });

  router.get("/testimonials", (_req, res) => {
    res.json(previewTestimonials.filter((item) => item.active).sort((a, b) => a.order - b.order || a.id - b.id));
  });

  router.get("/admin/testimonials", requireAdmin, (_req, res) => {
    res.json([...previewTestimonials].sort((a, b) => a.order - b.order || a.id - b.id));
  });

  router.post("/admin/testimonials", requireAdmin, (req, res) => {
    const body = req.body as Partial<PreviewTestimonial>;
    if (!body.clientName || !body.company || !body.feedback) {
      res.status(400).json({ error: "clientName, company, and feedback are required" });
      return;
    }

    const testimonial: PreviewTestimonial = {
      id: nextPreviewTestimonialId++,
      clientName: body.clientName,
      clientNameAr: body.clientNameAr || null,
      company: body.company,
      companyAr: body.companyAr || null,
      feedback: body.feedback,
      feedbackAr: body.feedbackAr || null,
      projectName: body.projectName || null,
      projectNameAr: body.projectNameAr || null,
      rating: Number(body.rating) || 5,
      order: Number(body.order) || 0,
      active: body.active ?? true,
    };

    previewTestimonials.push(testimonial);
    res.status(201).json(testimonial);
  });

  router.put("/admin/testimonials/:id", requireAdmin, (req, res) => {
    const id = Number(req.params.id);
    const testimonial = previewTestimonials.find((item) => item.id === id);
    if (!testimonial) {
      res.status(404).json({ error: "Testimonial not found" });
      return;
    }

    Object.assign(testimonial, req.body);
    res.json(testimonial);
  });

  router.delete("/admin/testimonials/:id", requireAdmin, (req, res) => {
    const id = Number(req.params.id);
    const index = previewTestimonials.findIndex((item) => item.id === id);
    if (index >= 0) {
      previewTestimonials.splice(index, 1);
    }
    res.status(204).send();
  });

  router.post("/products", requireAdmin, (req, res) => {
    const body = req.body as Partial<PreviewProduct>;
    if (!body.title || !body.description) {
      res.status(400).json({ error: "title and description are required" });
      return;
    }

    const product: PreviewProduct = {
      id: nextPreviewProductId++,
      slug: body.slug || String(body.title).toLowerCase().trim().replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-+|-+$/g, "") || `product-${Date.now()}`,
      title: body.title,
      description: body.description,
      titleAr: body.titleAr || null,
      descriptionAr: body.descriptionAr || null,
      tags: Array.isArray(body.tags) ? body.tags : [],
      priceLabel: body.priceLabel || null,
      imageUrl: body.imageUrl || null,
      requestUrl: body.requestUrl || null,
      template: body.template || "standard",
      purchaseLabel: body.purchaseLabel || null,
      purchaseNote: body.purchaseNote || null,
      deliveryType: body.deliveryType || "digital",
      featured: Boolean(body.featured),
      order: Number(body.order) || 0,
      active: body.active ?? true,
    };

    previewProducts.push(product);
    res.status(201).json(product);
  });

  router.put("/products/:id", requireAdmin, (req, res) => {
    const id = Number(req.params.id);
    const product = previewProducts.find((item) => item.id === id);
    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    Object.assign(product, {
      ...req.body,
      tags: Array.isArray(req.body.tags) ? req.body.tags : product.tags,
    });
    res.json(product);
  });

  router.delete("/products/:id", requireAdmin, (req, res) => {
    const id = Number(req.params.id);
    const index = previewProducts.findIndex((item) => item.id === id);
    if (index >= 0) {
      previewProducts.splice(index, 1);
    }
    res.status(204).send();
  });

  router.post("/projects", requireAdmin, (req, res) => {
    const { title, description, titleAr, descriptionAr, techStack, liveUrl, githubUrl, imageUrl, featured, order, active } =
      req.body as any;

    if (!title || !description) {
      res.status(400).json({ error: "title and description are required" });
      return;
    }

    const project = {
      id: Math.max(0, ...previewProjects.map((item) => item.id)) + 1,
      title,
      description,
      titleAr: titleAr || null,
      descriptionAr: descriptionAr || null,
      techStack: Array.isArray(techStack) ? techStack : [],
      liveUrl: liveUrl || null,
      githubUrl: githubUrl || null,
      imageUrl: imageUrl || null,
      featured: Boolean(featured),
      order: Number(order) || 0,
      active: active ?? true,
    };

    previewProjects.push(project);
    previewProjects.sort((a, b) => a.order - b.order || a.id - b.id);
    res.status(201).json(project);
  });

  router.put("/projects/:id", requireAdmin, (req, res) => {
    const id = parseInt(String(req.params.id), 10);
    const project = previewProjects.find((item) => item.id === id);

    if (!project) {
      res.status(404).json({ error: "Project not found" });
      return;
    }

    const { title, description, titleAr, descriptionAr, techStack, liveUrl, githubUrl, imageUrl, featured, order, active } =
      req.body as any;

    Object.assign(project, {
      title,
      description,
      titleAr: titleAr || null,
      descriptionAr: descriptionAr || null,
      techStack: Array.isArray(techStack) ? techStack : [],
      liveUrl: liveUrl || null,
      githubUrl: githubUrl || null,
      imageUrl: imageUrl || null,
      featured: Boolean(featured),
      order: Number(order) || 0,
      active: active ?? true,
    });

    previewProjects.sort((a, b) => a.order - b.order || a.id - b.id);
    res.json(project);
  });

  router.delete("/projects/:id", requireAdmin, (req, res) => {
    const id = parseInt(String(req.params.id), 10);
    const index = previewProjects.findIndex((item) => item.id === id);

    if (index >= 0) {
      previewProjects.splice(index, 1);
    }

    res.status(204).send();
  });

  router.get("/content", (_req, res) => {
    res.json(previewContent);
  });

  router.get("/blog-posts", (_req, res) => {
    res.json(previewBlogPosts.filter((post) => post.active).sort((a, b) => a.order - b.order || b.id - a.id));
  });

  router.get("/blog-posts/:slug", (req, res) => {
    const post = previewBlogPosts.find((item) => item.active && item.slug === String(req.params.slug));
    if (!post) {
      res.status(404).json({ error: "Post not found" });
      return;
    }
    res.json(post);
  });

  router.get("/admin/blog-posts", requireAdmin, (_req, res) => {
    res.json([...previewBlogPosts].sort((a, b) => a.order - b.order || b.id - a.id));
  });

  router.post("/admin/blog-posts", requireAdmin, (req, res) => {
    const body = req.body as Partial<PreviewBlogPost>;
    const title = body.title || body.titleAr || "";
    const excerpt = body.excerpt || body.excerptAr || "";

    if (!title || !excerpt) {
      res.status(400).json({ error: "title and excerpt are required" });
      return;
    }

    const now = new Date().toISOString();
    const post: PreviewBlogPost = {
      id: nextPreviewBlogPostId++,
      title,
      titleAr: body.titleAr || null,
      excerpt,
      excerptAr: body.excerptAr || null,
      content: body.content || "",
      contentAr: body.contentAr || null,
      slug: body.slug || title.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-+|-+$/g, "") || `post-${Date.now()}`,
      coverImageUrl: body.coverImageUrl || null,
      tags: Array.isArray(body.tags) ? body.tags : [],
      featured: Boolean(body.featured),
      order: Number(body.order) || 0,
      active: body.active ?? true,
      publishedAt: body.publishedAt || now,
      createdAt: now,
      updatedAt: now,
    };

    previewBlogPosts.push(post);
    res.status(201).json(post);
  });

  router.put("/admin/blog-posts/:id", requireAdmin, (req, res) => {
    const id = Number(req.params.id);
    const post = previewBlogPosts.find((item) => item.id === id);

    if (!post) {
      res.status(404).json({ error: "Post not found" });
      return;
    }

    Object.assign(post, {
      ...req.body,
      tags: Array.isArray(req.body.tags) ? req.body.tags : post.tags,
      updatedAt: new Date().toISOString(),
    });
    res.json(post);
  });

  router.delete("/admin/blog-posts/:id", requireAdmin, (req, res) => {
    const id = Number(req.params.id);
    const index = previewBlogPosts.findIndex((item) => item.id === id);
    if (index >= 0) {
      previewBlogPosts.splice(index, 1);
    }
    res.status(204).send();
  });

  router.get("/admin/messages", requireAdmin, (_req, res) => {
    res.json([...previewMessages].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)));
  });

  router.get("/admin/messages/:id", requireAdmin, (req, res) => {
    const id = parseInt(String(req.params.id), 10);
    const message = previewMessages.find((item) => item.id === id);

    if (!message) {
      res.status(404).json({ error: "Message not found" });
      return;
    }

    res.json(message);
  });

  router.patch("/admin/messages/:id", requireAdmin, (req, res) => {
    const id = parseInt(String(req.params.id), 10);
    const message = previewMessages.find((item) => item.id === id);
    const { status } = req.body as { status?: PreviewMessage["status"] };
    const validStatuses = ["unread", "read", "replied", "archived"];

    if (!message) {
      res.status(404).json({ error: "Message not found" });
      return;
    }

    if (status && !validStatuses.includes(status)) {
      res.status(400).json({ error: "Invalid status" });
      return;
    }

    if (status) {
      message.status = status;
    }

    res.json(message);
  });

  router.delete("/admin/messages/:id", requireAdmin, (req, res) => {
    const id = parseInt(String(req.params.id), 10);
    const index = previewMessages.findIndex((item) => item.id === id);

    if (index >= 0) {
      previewMessages.splice(index, 1);
    }

    res.status(204).send();
  });

  router.post("/messages", (req, res) => {
    const parsed = messageInputSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.issues[0]?.message || "Invalid message payload" });
      return;
    }

    const { name, email, subject, message } = parsed.data;

    const previewMessage: PreviewMessage = {
      id: nextPreviewMessageId++,
      name,
      email,
      subject,
      message,
      status: "unread",
      createdAt: new Date().toISOString(),
    };

    previewMessages.unshift(previewMessage);
    res.status(201).json(previewMessage);
  });

  router.use(["/services", "/skills", "/content/:key"], (_req, res) => {
    res.status(503).json({
      error: "Database is not configured. Set DATABASE_URL and run db:push.",
    });
  });
}

export default router;
