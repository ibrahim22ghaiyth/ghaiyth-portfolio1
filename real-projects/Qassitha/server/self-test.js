// Basic API smoke test. Run the server first (npm start), then: npm run test:api
const BASE = process.env.BASE || "http://localhost:3000";

async function call(method, path, body) {
  const r = await fetch(BASE + path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined
  });
  const j = await r.json();
  if (!j.success) throw new Error(`${method} ${path} → ${j.error}`);
  return j.data;
}

(async () => {
  try {
    await call("GET", "/api/health");
    console.log("✓ health");

    const contact = await call("POST", "/api/contacts", { name: "Test Contact", phone: "0770" });
    console.log("✓ created contact", contact.id);

    const debt = await call("POST", "/api/debts", {
      contact_id: contact.id, title: "Test debt", total_amount: 300000,
      installments_count: 3, direction: "owed_to_me", start_date: "2026-06-01"
    });
    console.log("✓ created debt with", debt.installments.length, "installments");

    const firstInst = debt.installments[0];
    await call("POST", "/api/payments", { installment_id: firstInst.id, amount: firstInst.amount });
    console.log("✓ recorded a payment");

    const dash = await call("GET", "/api/dashboard");
    console.log("✓ dashboard — owed to me:", dash.kpis.owedToMe);

    console.log("\nAll API smoke tests passed.");
  } catch (e) {
    console.error("✗ Test failed:", e.message);
    process.exit(1);
  }
})();
