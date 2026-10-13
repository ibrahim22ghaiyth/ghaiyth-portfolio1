import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense, useEffect } from "react";
import { getGetAdminMeQueryKey, useGetAdminMe } from "@workspace/api-client-react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import NotFound from "@/pages/not-found";

import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { ServicesSection } from "@/components/ServicesSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { ProductsSection } from "@/components/ProductsSection";
import { AboutSection } from "@/components/AboutSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { useLanguage } from "@/contexts/LanguageContext";
const BlogPage = lazy(() => import("@/pages/BlogPage").then((module) => ({ default: module.BlogPage })));
const BlogPostPage = lazy(() => import("@/pages/BlogPostPage").then((module) => ({ default: module.BlogPostPage })));
const ProductsPage = lazy(() => import("@/pages/ProductsPage").then((module) => ({ default: module.ProductsPage })));
const ProductDetailPage = lazy(() => import("@/pages/ProductDetailPage").then((module) => ({ default: module.ProductDetailPage })));
const ProjectsPage = lazy(() => import("@/pages/ProjectsPage").then((module) => ({ default: module.ProjectsPage })));

const AdminLogin = lazy(() => import("@/pages/admin/AdminLogin").then((module) => ({ default: module.AdminLogin })));
const AdminLayout = lazy(() => import("@/pages/admin/AdminLayout").then((module) => ({ default: module.AdminLayout })));
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard").then((module) => ({ default: module.AdminDashboard })));
const AdminServices = lazy(() => import("@/pages/admin/AdminServices").then((module) => ({ default: module.AdminServices })));
const AdminSkills = lazy(() => import("@/pages/admin/AdminSkills").then((module) => ({ default: module.AdminSkills })));
const AdminProjects = lazy(() => import("@/pages/admin/AdminProjects").then((module) => ({ default: module.AdminProjects })));
const AdminMessages = lazy(() => import("@/pages/admin/AdminMessages").then((module) => ({ default: module.AdminMessages })));
const AdminContent = lazy(() => import("@/pages/admin/AdminContent").then((module) => ({ default: module.AdminContent })));
const AdminBlog = lazy(() => import("@/pages/admin/AdminBlog").then((module) => ({ default: module.AdminBlog })));
const AdminProducts = lazy(() => import("@/pages/admin/AdminProducts").then((module) => ({ default: module.AdminProducts })));
const AdminTestimonials = lazy(() => import("@/pages/admin/AdminTestimonials").then((module) => ({ default: module.AdminTestimonials })));

const queryClient = new QueryClient();
const routerBase = import.meta.env.BASE_URL.replace(/\/$/, "") || "/";

function PageLoader() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/25 border-t-primary" />
    </div>
  );
}

function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main>
        <HeroSection />
        <ServicesSection />
        <ProjectsSection />
        <ProductsSection />
        <AboutSection />
        <TestimonialsSection />
        <ContactSection />
        <Footer />
      </main>
    </div>
  );
}

function AdminGate({ children }: { children: React.ReactNode }) {
  const { t } = useLanguage();
  const token = localStorage.getItem("admin_token");
  const me = useGetAdminMe({
    query: {
      queryKey: getGetAdminMeQueryKey(),
      enabled: Boolean(token),
      retry: false,
    },
  });

  useEffect(() => {
    if (!me.isError) {
      return;
    }
    const status = "status" in me.error ? Number((me.error as { status: unknown }).status) : NaN;
    if (status === 401) {
      localStorage.removeItem("admin_token");
    }
  }, [me.isError, me.error]);

  if (!token) {
    return <Redirect to="/admin/login" />;
  }

  if (me.isPending || me.isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground dark flex items-center justify-center">
        <div className="text-sm text-muted-foreground font-mono">
          {t.admin.checkingSession}
        </div>
      </div>
    );
  }

  if (me.isError) {
    const status = "status" in me.error ? Number((me.error as { status: unknown }).status) : NaN;

    if (status !== 401) {
      return (
        <div className="min-h-screen bg-background text-foreground dark flex flex-col items-center justify-center gap-4 px-6 text-center">
          <p className="text-sm text-muted-foreground font-mono">{t.admin.apiConnectionError}</p>
          <button
            type="button"
            onClick={() => void me.refetch()}
            className="min-h-11 rounded-md border border-primary/35 px-4 py-2 text-sm font-bold text-primary transition hover:bg-primary hover:text-primary-foreground"
          >
            {t.admin.retry}
          </button>
        </div>
      );
    }

    return <Redirect to="/admin/login" />;
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <AdminLayout>{children}</AdminLayout>
    </Suspense>
  );
}

function AdminRoutes() {
  return (
    <AdminGate>
      <Switch>
        <Route path="/admin/services" component={AdminServices} />
        <Route path="/admin/skills" component={AdminSkills} />
        <Route path="/admin/projects" component={AdminProjects} />
        <Route path="/admin/messages" component={AdminMessages} />
        <Route path="/admin/blog" component={AdminBlog} />
        <Route path="/admin/products" component={AdminProducts} />
        <Route path="/admin/testimonials" component={AdminTestimonials} />
        <Route path="/admin/content" component={AdminContent} />
        <Route path="/admin" component={AdminDashboard} />
      </Switch>
    </AdminGate>
  );
}

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path="/admin/login" component={AdminLogin} />
        <Route path="/admin" component={AdminRoutes} />
        <Route path="/admin/:rest*" component={AdminRoutes} />
        <Route path="/en/blog/:slug" component={BlogPostPage} />
        <Route path="/en/blog" component={BlogPage} />
        <Route path="/en/products/:slug" component={ProductDetailPage} />
        <Route path="/en/products" component={ProductsPage} />
        <Route path="/en/projects" component={ProjectsPage} />
        <Route path="/en" component={Home} />
        <Route path="/blog/:slug" component={BlogPostPage} />
        <Route path="/blog" component={BlogPage} />
        <Route path="/products/:slug" component={ProductDetailPage} />
        <Route path="/products" component={ProductsPage} />
        <Route path="/projects" component={ProjectsPage} />
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <ThemeProvider>
          <TooltipProvider>
            <WouterRouter base={routerBase}>
              <Router />
            </WouterRouter>
            <FloatingWhatsApp />
            <Toaster />
          </TooltipProvider>
        </ThemeProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
