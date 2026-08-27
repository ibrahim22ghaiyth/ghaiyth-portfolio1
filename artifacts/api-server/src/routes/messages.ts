import { Router } from "express";
import { db, messagesTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireAdmin } from "../middlewares/auth";

const router = Router();

router.post("/messages", async (req, res) => {
  const { name, email, subject, message } = req.body as {
    name?: string;
    email?: string;
    subject?: string;
    message?: string;
  };
  if (!name || !email || !subject || !message) {
    res.status(400).json({ error: "name, email, subject, message are required" });
    return;
  }
  const [msg] = await db
    .insert(messagesTable)
    .values({ name, email, subject, message, status: "unread" })
    .returning();
  res.status(201).json(msg);
});

router.get("/admin/messages", requireAdmin, async (req, res) => {
  const msgs = await db
    .select()
    .from(messagesTable)
    .orderBy(desc(messagesTable.createdAt));
  res.json(msgs);
});

router.get("/admin/messages/:id", requireAdmin, async (req, res) => {
  const id = parseInt(String(req.params.id), 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const [msg] = await db.select().from(messagesTable).where(eq(messagesTable.id, id));
  if (!msg) { res.status(404).json({ error: "Message not found" }); return; }
  res.json(msg);
});

router.patch("/admin/messages/:id", requireAdmin, async (req, res) => {
  const id = parseInt(String(req.params.id), 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const { status } = req.body as { status?: string };
  const validStatuses = ["unread", "read", "replied", "archived"];
  if (status && !validStatuses.includes(status)) {
    res.status(400).json({ error: "Invalid status" });
    return;
  }
  const updateData: Record<string, string> = {};
  if (status) updateData.status = status;
  const [msg] = await db
    .update(messagesTable)
    .set(updateData)
    .where(eq(messagesTable.id, id))
    .returning();
  if (!msg) { res.status(404).json({ error: "Message not found" }); return; }
  res.json(msg);
});

router.delete("/admin/messages/:id", requireAdmin, async (req, res) => {
  const id = parseInt(String(req.params.id), 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(messagesTable).where(eq(messagesTable.id, id));
  res.status(204).send();
});

export default router;
