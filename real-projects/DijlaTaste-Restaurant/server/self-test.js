const http = require("http");
const base = "http://localhost:" + (process.env.PORT || 3000);

function request(method, path, data) {
  return new Promise((resolve, reject) => {
    const body = data ? JSON.stringify(data) : null;
    const req = http.request(base + path, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(body ? { "Content-Length": Buffer.byteLength(body) } : {})
      }
    }, res => {
      let raw = "";
      res.on("data", c => raw += c);
      res.on("end", () => {
        try { resolve({ status: res.statusCode, json: JSON.parse(raw) }); }
        catch { resolve({ status: res.statusCode, raw }); }
      });
    });
    req.on("error", reject);
    if (body) req.write(body);
    req.end();
  });
}

(async () => {
  const checks = [];
  checks.push(["health", await request("GET", "/api/health")]);
  checks.push(["bootstrap", await request("GET", "/api/public/bootstrap")]);
  checks.push(["admin dashboard", await request("GET", "/api/admin/dashboard")]);
  checks.push(["create order", await request("POST", "/api/public/orders", {
    customer_name: "API Test",
    phone: "07700000000",
    address: "Baghdad",
    order_type: "delivery",
    items: [{ product_id: 7, qty: 1 }, { product_id: 12, qty: 2 }]
  })]);
  for (const [name, result] of checks) {
    console.log(name, result.status, result.json.success);
    if (!result.json.success) process.exit(1);
  }
})().catch(err => {
  console.error(err);
  process.exit(1);
});
