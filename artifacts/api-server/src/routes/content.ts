import { Router } from "express";
import { db, contentTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAdmin } from "../middlewares/auth";

const router = Router();

router.get("/content", async (req, res) => {
  const items = await db.select().from(contentTable);
  res.json(items);
});

router.put("/content/:key", requireAdmin, async (req, res) => {
  const key = String(req.params.key);
  const { value } = req.body as { value: string };
  if (!value) {
    res.status(400).json({ error: "value is required" });
    return;
  }
  const existing = await db.select().from(contentTable).where(eq(contentTable.key, key));
  let item;
  if (existing.length > 0) {
    [item] = await db
      .update(contentTable)
      .set({ value })
      .where(eq(contentTable.key, key))
      .returning();
  } else {
    [item] = await db
      .insert(contentTable)
      .values({ key, value, type: "text" })
      .returning();
  }
  res.json(item);
});

export default router;
