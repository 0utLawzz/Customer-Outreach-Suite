import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { contactsTable } from "@workspace/db";
import { sql } from "drizzle-orm";

const router: IRouter = Router();

// GET /stats
router.get("/stats", async (_req, res) => {
  const rows = await db
    .select({
      status: contactsTable.status,
      count: sql<number>`count(*)::int`,
    })
    .from(contactsTable)
    .groupBy(contactsTable.status);

  const map: Record<string, number> = {};
  for (const row of rows) {
    map[row.status] = row.count;
  }

  const sent = map["sent"] ?? 0;
  const pending = map["pending"] ?? 0;
  const failed = map["failed"] ?? 0;
  const skipped = map["skipped"] ?? 0;
  const total = sent + pending + failed + skipped;

  res.json({ total, sent, pending, failed, skipped });
});

export default router;
