const http = require("http");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");
const Database = require("better-sqlite3");

const PORT = Number(process.env.PORT || 3000);
const ROOT = path.resolve(__dirname, "..");
const PUBLIC_DIR = path.join(ROOT, "public");
const DATA_DIR = path.join(__dirname, "data");
const DB_PATH = path.join(DATA_DIR, "restaurant.sqlite");
const SEED_SQL = path.join(DATA_DIR, "seed.sql");

// First run: if there is no database yet, build one from seed.sql automatically.
if (!fs.existsSync(DB_PATH) && fs.existsSync(SEED_SQL)) {
  const tmp = new Database(DB_PATH);
  tmp.exec(fs.readFileSync(SEED_SQL, "utf8"));
  tmp.close();
  console.log("Database created from seed.sql");
}

const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon"
};

function send(res, status, payload, headers = {}) {
  const body = typeof payload === "string" ? payload : JSON.stringify(payload);
  res.writeHead(status, {
    "Content-Type": typeof payload === "string" ? "text/plain; charset=utf-8" : "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    ...headers
  });
  res.end(body);
}

function ok(res, data = {}, message = "OK") {
  send(res, 200, { success: true, message, data });
}

function created(res, data = {}, message = "Created") {
  send(res, 201, { success: true, message, data });
}

function fail(res, status, error, details = null) {
  send(res, status, { success: false, error, details });
}

function body(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", chunk => {
      raw += chunk;
      if (raw.length > 2_000_000) {
        reject(new Error("Payload too large"));
        req.destroy();
      }
    });
    req.on("end", () => {
      if (!raw) return resolve({});
      try { resolve(JSON.parse(raw)); }
      catch { reject(new Error("Invalid JSON")); }
    });
  });
}

function bool(v) { return v === true || v === 1 || v === "1" || v === "true" ? 1 : 0; }
function rowToBool(row) {
  for (const key of ["active", "available", "featured", "vegetarian", "accepting_orders"]) {
    if (key in row) row[key] = Boolean(row[key]);
  }
  return row;
}
function all(sql, params = []) { return db.prepare(sql).all(...params).map(rowToBool); }
function get(sql, params = []) { const row = db.prepare(sql).get(...params); return row ? rowToBool(row) : null; }
function run(sql, params = []) { return db.prepare(sql).run(...params); }
function now() { return new Date().toISOString(); }

function settings() {
  return get("SELECT * FROM settings WHERE id = 1");
}

function categories(includeHidden = false) {
  return all(`SELECT * FROM categories ${includeHidden ? "" : "WHERE active = 1"} ORDER BY sort_order ASC, id ASC`);
}

function products(query = {}) {
  const where = [];
  const params = [];
  if (query.category_id) { where.push("category_id = ?"); params.push(Number(query.category_id)); }
  if (query.q) {
    where.push("(LOWER(name_ar) LIKE ? OR LOWER(name_en) LIKE ? OR LOWER(description_ar) LIKE ? OR LOWER(description_en) LIKE ?)");
    const q = `%${String(query.q).toLowerCase()}%`;
    params.push(q, q, q, q);
  }
  if (!query.admin) where.push("available = 1");
  return all(`SELECT * FROM products ${where.length ? "WHERE " + where.join(" AND ") : ""} ORDER BY featured DESC, sort_order ASC, id ASC`, params);
}

function orderDetails(order) {
  if (!order) return null;
  order.items = all("SELECT * FROM order_items WHERE order_id = ? ORDER BY id ASC", [order.id]);
  return order;
}

async function api(req, res, pathname, search) {
  if (req.method === "GET" && pathname === "/api/health") {
    return ok(res, { status: "running", database: "SQLite", file: "server/data/restaurant.sqlite", time: now() });
  }

  if (req.method === "GET" && pathname === "/api/public/bootstrap") {
    return ok(res, { settings: settings(), categories: categories(false), products: products({}) });
  }

  if (req.method === "GET" && pathname === "/api/public/products") {
    return ok(res, products({ category_id: search.get("category_id"), q: search.get("q") }));
  }

  if (req.method === "POST" && pathname === "/api/public/orders") {
    const s = settings();
    if (!s.accepting_orders) return fail(res, 403, "Orders are disabled");
    const data = await body(req);
    const items = Array.isArray(data.items) ? data.items : [];
    const orderItems = [];
    for (const item of items) {
      const product = get("SELECT * FROM products WHERE id = ? AND available = 1", [Number(item.product_id)]);
      if (!product) continue;
      const qty = Math.max(1, Math.min(50, Number(item.qty || 1)));
      orderItems.push({ product, qty, line_total: Number(product.price) * qty });
    }
    if (!orderItems.length) return fail(res, 400, "Order has no valid items");

    const customer = String(data.customer_name || "").trim();
    const phone = String(data.phone || "").trim();
    const orderType = data.order_type === "pickup" ? "pickup" : "delivery";
    const allowedPayments = ["cash", "zaincash", "asiahawala"];
    const paymentMethod = allowedPayments.includes(data.payment_method) ? data.payment_method : "cash";
    const address = String(data.address || "").trim();
    if (!customer || !phone) return fail(res, 400, "Customer name and phone are required");
    if (orderType === "delivery" && !address) return fail(res, 400, "Address is required");

    const subtotal = orderItems.reduce((sum, item) => sum + item.line_total, 0);
    const deliveryFee = orderType === "delivery" ? Number(s.delivery_fee || 0) : 0;
    const tax = Math.round(subtotal * (Number(s.tax_percent || 0) / 100));
    const total = subtotal + deliveryFee + tax;

    const createOrder = db.transaction(() => {
      const result = run(`INSERT INTO orders
        (customer_name, phone, address, notes, order_type, payment_method, status, subtotal, delivery_fee, tax, total, created_at, updated_at)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,datetime('now'),datetime('now'))`,
        [customer, phone, address, String(data.notes || ""), orderType, paymentMethod, "new", subtotal, deliveryFee, tax, total]
      );
      const orderId = Number(result.lastInsertRowid);
      const itemStmt = db.prepare(`INSERT INTO order_items
        (order_id, product_id, product_name_ar, product_name_en, qty, unit_price, line_total)
        VALUES (?,?,?,?,?,?,?)`);
      for (const item of orderItems) {
        itemStmt.run(orderId, item.product.id, item.product.name_ar, item.product.name_en, item.qty, item.product.price, item.line_total);
      }
      return orderId;
    });

    const orderId = createOrder();
    return created(res, orderDetails(get("SELECT * FROM orders WHERE id = ?", [orderId])), "Order created");
  }

  // Admin is intentionally open: no login, no token, per project request.
  if (pathname.startsWith("/api/admin")) {
    if (req.method === "GET" && pathname === "/api/admin/dashboard") {
      const s = settings();
      const revenue = get("SELECT COALESCE(SUM(total),0) AS value FROM orders").value;
      const todayRevenue = get("SELECT COALESCE(SUM(total),0) AS value FROM orders WHERE date(created_at) = date('now')").value;
      return ok(res, {
        counts: {
          categories: get("SELECT COUNT(*) AS value FROM categories").value,
          products: get("SELECT COUNT(*) AS value FROM products").value,
          orders: get("SELECT COUNT(*) AS value FROM orders").value,
          new_orders: get("SELECT COUNT(*) AS value FROM orders WHERE status = 'new'").value,
          unavailable: get("SELECT COUNT(*) AS value FROM products WHERE available = 0").value
        },
        revenue,
        today_revenue: todayRevenue,
        restaurant: s.restaurant_name_en
      });
    }

    if (req.method === "GET" && pathname === "/api/admin/export") {
      return ok(res, {
        settings: settings(),
        categories: categories(true),
        products: products({ admin: true }),
        orders: all("SELECT * FROM orders ORDER BY id DESC").map(orderDetails)
      });
    }

    if (req.method === "GET" && pathname === "/api/admin/categories") return ok(res, categories(true));
    if (req.method === "POST" && pathname === "/api/admin/categories") {
      const data = await body(req);
      if (!data.name_ar || !data.name_en) return fail(res, 400, "Arabic and English category names are required");
      const result = run(`INSERT INTO categories
        (name_ar, name_en, description_ar, description_en, icon, sort_order, active, created_at, updated_at)
        VALUES (?,?,?,?,?,?,?,datetime('now'),datetime('now'))`,
        [data.name_ar, data.name_en, data.description_ar || "", data.description_en || "", data.icon || "🍽️", Number(data.sort_order || 0), bool(data.active ?? true)]
      );
      return created(res, get("SELECT * FROM categories WHERE id = ?", [Number(result.lastInsertRowid)]));
    }

    const catMatch = pathname.match(/^\/api\/admin\/categories\/(\d+)$/);
    if (catMatch) {
      const id = Number(catMatch[1]);
      if (!get("SELECT * FROM categories WHERE id = ?", [id])) return fail(res, 404, "Category not found");
      if (req.method === "PUT") {
        const data = await body(req);
        if (!data.name_ar || !data.name_en) return fail(res, 400, "Arabic and English category names are required");
        run(`UPDATE categories SET name_ar=?, name_en=?, description_ar=?, description_en=?, icon=?, sort_order=?, active=?, updated_at=datetime('now') WHERE id=?`,
          [data.name_ar, data.name_en, data.description_ar || "", data.description_en || "", data.icon || "🍽️", Number(data.sort_order || 0), bool(data.active), id]
        );
        return ok(res, get("SELECT * FROM categories WHERE id = ?", [id]));
      }
      if (req.method === "DELETE") {
        const used = get("SELECT COUNT(*) AS value FROM products WHERE category_id = ?", [id]).value;
        if (used) return fail(res, 409, "Cannot delete category while products use it");
        run("DELETE FROM categories WHERE id = ?", [id]);
        return ok(res, { id });
      }
    }

    if (req.method === "GET" && pathname === "/api/admin/products") return ok(res, products({ admin: true }));
    if (req.method === "POST" && pathname === "/api/admin/products") {
      const data = await body(req);
      if (!data.name_ar || !data.name_en || !data.category_id) return fail(res, 400, "Product names and category are required");
      const result = run(`INSERT INTO products
        (category_id, name_ar, name_en, description_ar, description_en, price, image_url, available, featured, vegetarian, spicy_level, calories, prep_time_ar, prep_time_en, sort_order, created_at, updated_at)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,datetime('now'),datetime('now'))`,
        [Number(data.category_id), data.name_ar, data.name_en, data.description_ar || "", data.description_en || "", Number(data.price || 0), data.image_url || "", bool(data.available ?? true), bool(data.featured), bool(data.vegetarian), Number(data.spicy_level || 0), Number(data.calories || 0), data.prep_time_ar || "", data.prep_time_en || "", Number(data.sort_order || 0)]
      );
      return created(res, get("SELECT * FROM products WHERE id = ?", [Number(result.lastInsertRowid)]));
    }

    const prodMatch = pathname.match(/^\/api\/admin\/products\/(\d+)$/);
    if (prodMatch) {
      const id = Number(prodMatch[1]);
      if (!get("SELECT * FROM products WHERE id = ?", [id])) return fail(res, 404, "Product not found");
      if (req.method === "PUT") {
        const data = await body(req);
        if (!data.name_ar || !data.name_en || !data.category_id) return fail(res, 400, "Product names and category are required");
        run(`UPDATE products SET category_id=?, name_ar=?, name_en=?, description_ar=?, description_en=?, price=?, image_url=?, available=?, featured=?, vegetarian=?, spicy_level=?, calories=?, prep_time_ar=?, prep_time_en=?, sort_order=?, updated_at=datetime('now') WHERE id=?`,
          [Number(data.category_id), data.name_ar, data.name_en, data.description_ar || "", data.description_en || "", Number(data.price || 0), data.image_url || "", bool(data.available), bool(data.featured), bool(data.vegetarian), Number(data.spicy_level || 0), Number(data.calories || 0), data.prep_time_ar || "", data.prep_time_en || "", Number(data.sort_order || 0), id]
        );
        return ok(res, get("SELECT * FROM products WHERE id = ?", [id]));
      }
      if (req.method === "DELETE") {
        run("DELETE FROM products WHERE id = ?", [id]);
        return ok(res, { id });
      }
    }

    if (req.method === "GET" && pathname === "/api/admin/orders") {
      return ok(res, all("SELECT * FROM orders ORDER BY id DESC").map(orderDetails));
    }

    const orderMatch = pathname.match(/^\/api\/admin\/orders\/(\d+)$/);
    if (orderMatch && req.method === "PUT") {
      const id = Number(orderMatch[1]);
      const data = await body(req);
      const allowed = ["new", "preparing", "ready", "delivered", "cancelled"];
      if (!allowed.includes(data.status)) return fail(res, 400, "Invalid status");
      run("UPDATE orders SET status=?, updated_at=datetime('now') WHERE id=?", [data.status, id]);
      return ok(res, orderDetails(get("SELECT * FROM orders WHERE id = ?", [id])));
    }

    if (req.method === "GET" && pathname === "/api/admin/settings") return ok(res, settings());
    if (req.method === "PUT" && pathname === "/api/admin/settings") {
      const data = await body(req);
      run(`UPDATE settings SET
        restaurant_name_ar=?, restaurant_name_en=?, slogan_ar=?, slogan_en=?, description_ar=?, description_en=?, logo_text=?,
        phone=?, whatsapp=?, email=?, address_ar=?, address_en=?, open_hours_ar=?, open_hours_en=?,
        currency=?, delivery_fee=?, tax_percent=?, instagram=?, facebook=?, accepting_orders=?, updated_at=datetime('now')
        WHERE id=1`,
        [data.restaurant_name_ar, data.restaurant_name_en, data.slogan_ar, data.slogan_en, data.description_ar, data.description_en, data.logo_text,
         data.phone, data.whatsapp, data.email, data.address_ar, data.address_en, data.open_hours_ar, data.open_hours_en,
         data.currency || "IQD", Number(data.delivery_fee || 0), Number(data.tax_percent || 0), data.instagram || "", data.facebook || "", bool(data.accepting_orders)]
      );
      return ok(res, settings());
    }
  }

  return fail(res, 404, "API route not found");
}

function serveStatic(req, res, pathname) {
  let filePath = pathname === "/" ? path.join(PUBLIC_DIR, "index.html") : path.join(PUBLIC_DIR, pathname);
  filePath = path.normalize(filePath);
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    return res.end("Forbidden");
  }
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = pathname.startsWith("/admin") ? path.join(PUBLIC_DIR, "admin.html") : path.join(PUBLIC_DIR, "index.html");
  }
  const ext = path.extname(filePath);
  res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream", "Cache-Control": ext === ".html" ? "no-store" : "public, max-age=3600" });
  fs.createReadStream(filePath).pipe(res);
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    if (url.pathname.startsWith("/api/")) return await api(req, res, url.pathname, url.searchParams);
    return serveStatic(req, res, decodeURIComponent(url.pathname));
  } catch (err) {
    console.error(err);
    return fail(res, 500, err.message || "Server error");
  }
});

server.listen(PORT, () => {
  console.log(`Dijla & Tanoor running at http://localhost:${PORT}`);
  console.log(`Open admin directly at http://localhost:${PORT}/admin.html`);
});
