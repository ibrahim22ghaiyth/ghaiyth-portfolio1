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
  const { loadState, saveState, nextId } = await import("../lib/file-store");
  const state = loadState();

  if (state.services.length === 0) {
    state.services = [
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
    state.nextIds.service = 5;
  }

  if (state.skills.length === 0) {
    state.skills = [
      { id: 1, name: "React / TypeScript", nameAr: "React / TypeScript", percentage: 92, category: "Frontend", order: 1, active: true },
      { id: 2, name: "Node.js / Express", nameAr: "Node.js / Express", percentage: 88, category: "Backend", order: 2, active: true },
      { id: 3, name: "PostgreSQL / Drizzle", nameAr: "PostgreSQL / Drizzle", percentage: 82, category: "Database", order: 3, active: true },
      { id: 4, name: "Tailwind CSS", nameAr: "Tailwind CSS", percentage: 90, category: "Frontend", order: 4, active: true },
      { id: 5, name: "Deployment", nameAr: "النشر والاستضافة", percentage: 78, category: "Ops", order: 5, active: true },
    ];
    state.nextIds.skill = 6;
  }

  if (state.projects.length === 0) {
    state.projects = projectArchive.map((project, index) => ({
      id: index + 1,
      ...project,
    }));
    state.nextIds.project = projectArchive.length + 1;
  } else {
    const existingTitles = new Set(state.projects.map((p: { title: string }) => p.title));
    const missing = projectArchive.filter((p) => !existingTitles.has(p.title));
    if (missing.length) {
      let nextId = state.nextIds.project || state.projects.length + 1;
      for (const project of missing) {
        state.projects.push({ id: nextId++, ...project });
      }
      state.nextIds.project = nextId;
      state.projects.sort((a: { order: number; id: number }, b: { order: number; id: number }) => a.order - b.order || a.id - b.id);
    }
  }

  if (state.products.length === 0) {
    state.products = defaultProducts.map((product, index) => ({
      id: index + 1,
      ...product,
      tags: [...product.tags],
    }));
    state.nextIds.product = defaultProducts.length + 1;
  }

  if (state.content.length === 0) {
    state.content = [
      { key: "preview_notice", value: "Running in local preview mode without DATABASE_URL. Changes are saved to a local file.", type: "text" },
    ];
  }

  saveState(state);

  router.get("/services", (_req, res) => {
    res.json(state.services);
  });

  router.get("/skills", (_req, res) => {
    res.json(state.skills);
  });

  router.get("/projects", (_req, res) => {
    res.json(state.projects);
  });

  router.get("/products", (_req, res) => {
    res.json([...state.products].sort((a, b) => a.order - b.order || a.id - b.id));
  });

  router.get("/products/:slugOrId", (req, res) => {
    const raw = String(req.params.slugOrId || "");
    const product = state.products.find((item) => item.active && (item.slug === raw || String(item.id) === raw));
    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    res.json(product);
  });

  router.get("/testimonials", (_req, res) => {
    res.json(state.testimonials.filter((item) => item.active).sort((a, b) => a.order - b.order || a.id - b.id));
  });

  router.get("/admin/testimonials", requireAdmin, (_req, res) => {
    res.json([...state.testimonials].sort((a, b) => a.order - b.order || a.id - b.id));
  });

  router.post("/admin/testimonials", requireAdmin, (req, res) => {
    const body = req.body as any;
    if (!body.clientName || !body.company || !body.feedback) {
      res.status(400).json({ error: "clientName, company, and feedback are required" });
      return;
    }
    const testimonial = {
      id: nextId(state, "testimonial"),
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
    state.testimonials.push(testimonial);
    saveState(state);
    res.status(201).json(testimonial);
  });

  router.put("/admin/testimonials/:id", requireAdmin, (req, res) => {
    const id = Number(req.params.id);
    const testimonial = state.testimonials.find((item) => item.id === id);
    if (!testimonial) {
      res.status(404).json({ error: "Testimonial not found" });
      return;
    }
    Object.assign(testimonial, req.body);
    saveState(state);
    res.json(testimonial);
  });

  router.delete("/admin/testimonials/:id", requireAdmin, (req, res) => {
    const id = Number(req.params.id);
    const index = state.testimonials.findIndex((item) => item.id === id);
    if (index >= 0) {
      state.testimonials.splice(index, 1);
    }
    saveState(state);
    res.status(204).send();
  });

  router.post("/products", requireAdmin, (req, res) => {
    const body = req.body as any;
    if (!body.title || !body.description) {
      res.status(400).json({ error: "title and description are required" });
      return;
    }
    const product = {
      id: nextId(state, "product"),
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
    state.products.push(product);
    saveState(state);
    res.status(201).json(product);
  });

  router.put("/products/:id", requireAdmin, (req, res) => {
    const id = Number(req.params.id);
    const product = state.products.find((item) => item.id === id);
    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    Object.assign(product, {
      ...req.body,
      tags: Array.isArray(req.body.tags) ? req.body.tags : product.tags,
    });
    saveState(state);
    res.json(product);
  });

  router.delete("/products/:id", requireAdmin, (req, res) => {
    const id = Number(req.params.id);
    const index = state.products.findIndex((item) => item.id === id);
    if (index >= 0) {
      state.products.splice(index, 1);
    }
    saveState(state);
    res.status(204).send();
  });

  router.post("/projects", requireAdmin, (req, res) => {
    const body = req.body as any;
    const { title, description, titleAr, descriptionAr, techStack, liveUrl, githubUrl, imageUrl, featured, order, active } = body;
    if (!title || !description) {
      res.status(400).json({ error: "title and description are required" });
      return;
    }
    const project = {
      id: nextId(state, "project"),
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
      status: body.status || "live",
      imageAltEn: body.imageAltEn || null,
      imageAltAr: body.imageAltAr || null,
      audienceEn: body.audienceEn || null,
      audienceAr: body.audienceAr || null,
      roleEn: body.roleEn || null,
      roleAr: body.roleAr || null,
      problemEn: body.problemEn || null,
      problemAr: body.problemAr || null,
      solutionEn: body.solutionEn || null,
      solutionAr: body.solutionAr || null,
      stackDescEn: body.stackDescEn || null,
      stackDescAr: body.stackDescAr || null,
      outcomeEn: body.outcomeEn || null,
      outcomeAr: body.outcomeAr || null,
    };
    state.projects.push(project);
    state.projects.sort((a, b) => a.order - b.order || a.id - b.id);
    saveState(state);
    res.status(201).json(project);
  });

  router.put("/projects/:id", requireAdmin, (req, res) => {
    const id = parseInt(String(req.params.id), 10);
    const project = state.projects.find((item) => item.id === id);
    if (!project) {
      res.status(404).json({ error: "Project not found" });
      return;
    }
    const body = req.body as any;
    Object.assign(project, {
      title: body.title,
      description: body.description,
      titleAr: body.titleAr || null,
      descriptionAr: body.descriptionAr || null,
      techStack: Array.isArray(body.techStack) ? body.techStack : [],
      liveUrl: body.liveUrl || null,
      githubUrl: body.githubUrl || null,
      imageUrl: body.imageUrl || null,
      featured: Boolean(body.featured),
      order: Number(body.order) || 0,
      active: body.active ?? true,
      status: body.status || "live",
      imageAltEn: body.imageAltEn || null,
      imageAltAr: body.imageAltAr || null,
      audienceEn: body.audienceEn || null,
      audienceAr: body.audienceAr || null,
      roleEn: body.roleEn || null,
      roleAr: body.roleAr || null,
      problemEn: body.problemEn || null,
      problemAr: body.problemAr || null,
      solutionEn: body.solutionEn || null,
      solutionAr: body.solutionAr || null,
      stackDescEn: body.stackDescEn || null,
      stackDescAr: body.stackDescAr || null,
      outcomeEn: body.outcomeEn || null,
      outcomeAr: body.outcomeAr || null,
    });
    state.projects.sort((a, b) => a.order - b.order || a.id - b.id);
    saveState(state);
    res.json(project);
  });

  router.delete("/projects/:id", requireAdmin, (req, res) => {
    const id = parseInt(String(req.params.id), 10);
    const index = state.projects.findIndex((item) => item.id === id);
    if (index >= 0) {
      state.projects.splice(index, 1);
    }
    saveState(state);
    res.status(204).send();
  });

  router.get("/content", (_req, res) => {
    res.json(state.content);
  });

  router.get("/blog-posts", (_req, res) => {
    res.json(state.blogPosts.filter((post) => post.active).sort((a, b) => a.order - b.order || b.id - a.id));
  });

  router.get("/blog-posts/:slug", (req, res) => {
    const post = state.blogPosts.find((item) => item.active && item.slug === String(req.params.slug));
    if (!post) {
      res.status(404).json({ error: "Post not found" });
      return;
    }
    res.json(post);
  });

  router.get("/admin/blog-posts", requireAdmin, (_req, res) => {
    res.json([...state.blogPosts].sort((a, b) => a.order - b.order || b.id - a.id));
  });

  router.post("/admin/blog-posts", requireAdmin, (req, res) => {
    const body = req.body as any;
    const title = body.title || body.titleAr || "";
    const excerpt = body.excerpt || body.excerptAr || "";
    if (!title || !excerpt) {
      res.status(400).json({ error: "title and excerpt are required" });
      return;
    }
    const now = new Date().toISOString();
    const post = {
      id: nextId(state, "blogPost"),
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
    state.blogPosts.push(post);
    saveState(state);
    res.status(201).json(post);
  });

  router.put("/admin/blog-posts/:id", requireAdmin, (req, res) => {
    const id = Number(req.params.id);
    const post = state.blogPosts.find((item) => item.id === id);
    if (!post) {
      res.status(404).json({ error: "Post not found" });
      return;
    }
    Object.assign(post, {
      ...req.body,
      tags: Array.isArray(req.body.tags) ? req.body.tags : post.tags,
      updatedAt: new Date().toISOString(),
    });
    saveState(state);
    res.json(post);
  });

  router.delete("/admin/blog-posts/:id", requireAdmin, (req, res) => {
    const id = Number(req.params.id);
    const index = state.blogPosts.findIndex((item) => item.id === id);
    if (index >= 0) {
      state.blogPosts.splice(index, 1);
    }
    saveState(state);
    res.status(204).send();
  });

  router.get("/admin/messages", requireAdmin, (_req, res) => {
    res.json([...state.messages].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)));
  });

  router.get("/admin/messages/:id", requireAdmin, (req, res) => {
    const id = parseInt(String(req.params.id), 10);
    const message = state.messages.find((item) => item.id === id);
    if (!message) {
      res.status(404).json({ error: "Message not found" });
      return;
    }
    res.json(message);
  });

  router.patch("/admin/messages/:id", requireAdmin, (req, res) => {
    const id = parseInt(String(req.params.id), 10);
    const message = state.messages.find((item) => item.id === id);
    const { status } = req.body as { status?: string };
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
    saveState(state);
    res.json(message);
  });

  router.delete("/admin/messages/:id", requireAdmin, (req, res) => {
    const id = parseInt(String(req.params.id), 10);
    const index = state.messages.findIndex((item) => item.id === id);
    if (index >= 0) {
      state.messages.splice(index, 1);
    }
    saveState(state);
    res.status(204).send();
  });

  router.post("/messages", (req, res) => {
    const parsed = messageInputSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.issues[0]?.message || "Invalid message payload" });
      return;
    }
    const { name, email, subject, message } = parsed.data;
    const previewMessage = {
      id: nextId(state, "message"),
      name,
      email,
      subject,
      message,
      status: "unread",
      createdAt: new Date().toISOString(),
    };
    state.messages.unshift(previewMessage);
    saveState(state);
    res.status(201).json(previewMessage);
  });

  router.use(["/services", "/skills", "/content/:key"], (_req, res) => {
    res.status(503).json({
      error: "Database is not configured. Set DATABASE_URL and run db:push.",
    });
  });
}

export default router;
