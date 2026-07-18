import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { contactsTable } from "@workspace/db";
import { eq, ilike, or, and, sql } from "drizzle-orm";
import {
  ListContactsQueryParams,
  CreateContactBody,
  ImportContactsBody,
  UpdateContactParams,
  UpdateContactBody,
  DeleteContactParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

// GET /contacts
router.get("/contacts", async (req, res) => {
  const parsed = ListContactsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid query parameters" });
    return;
  }
  const { status, search } = parsed.data;

  const conditions = [];

  if (status) {
    conditions.push(eq(contactsTable.status, status));
  }
  if (search) {
    conditions.push(
      or(
        ilike(contactsTable.name, `%${search}%`),
        ilike(contactsTable.phone, `%${search}%`)
      )
    );
  }

  const contacts = await db
    .select()
    .from(contactsTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(contactsTable.createdAt);

  res.json(
    contacts.map((c) => ({
      ...c,
      createdAt: c.createdAt.toISOString(),
    }))
  );
});

// POST /contacts
router.post("/contacts", async (req, res) => {
  const parsed = CreateContactBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid contact data" });
    return;
  }

  // Assign a random variation index
  const variationIndex = Math.floor(Math.random() * 327);

  const [contact] = await db
    .insert(contactsTable)
    .values({
      name: parsed.data.name,
      phone: parsed.data.phone,
      notes: parsed.data.notes ?? null,
      variationIndex,
      status: "pending",
    })
    .returning();

  res.status(201).json({ ...contact, createdAt: contact.createdAt.toISOString() });
});

// POST /contacts/import
router.post("/contacts/import", async (req, res) => {
  const parsed = ImportContactsBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid import data" });
    return;
  }

  const { contacts } = parsed.data;
  if (contacts.length === 0) {
    res.json({ imported: 0, skipped: 0, total: 0 });
    return;
  }

  let imported = 0;
  let skipped = 0;

  // Sequential insert to assign sequential variation indices
  for (let i = 0; i < contacts.length; i++) {
    const { name, phone } = contacts[i];
    if (!name?.trim() || !phone?.trim()) {
      skipped++;
      continue;
    }
    // Count existing to assign next variation index
    const countResult = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(contactsTable);
    const existingCount = countResult[0]?.count ?? 0;
    const variationIndex = (existingCount + imported) % 327;

    await db.insert(contactsTable).values({
      name: name.trim(),
      phone: phone.trim().replace(/[\s+]/g, ""),
      status: "pending",
      variationIndex,
    });
    imported++;
  }

  res.json({ imported, skipped, total: contacts.length });
});

// PATCH /contacts/:id
router.patch("/contacts/:id", async (req, res) => {
  const paramsParsed = UpdateContactParams.safeParse({ id: Number(req.params.id) });
  if (!paramsParsed.success) {
    res.status(400).json({ error: "Invalid contact id" });
    return;
  }

  const bodyParsed = UpdateContactBody.safeParse(req.body);
  if (!bodyParsed.success) {
    res.status(400).json({ error: "Invalid update data" });
    return;
  }

  const updates: Partial<typeof contactsTable.$inferInsert> = {};
  if (bodyParsed.data.name !== undefined) updates.name = bodyParsed.data.name;
  if (bodyParsed.data.phone !== undefined) updates.phone = bodyParsed.data.phone;
  if (bodyParsed.data.status !== undefined) updates.status = bodyParsed.data.status;
  if (bodyParsed.data.notes !== undefined) updates.notes = bodyParsed.data.notes;

  const [updated] = await db
    .update(contactsTable)
    .set(updates)
    .where(eq(contactsTable.id, paramsParsed.data.id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Contact not found" });
    return;
  }

  res.json({ ...updated, createdAt: updated.createdAt.toISOString() });
});

// DELETE /contacts/:id
router.delete("/contacts/:id", async (req, res) => {
  const parsed = DeleteContactParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid contact id" });
    return;
  }

  await db.delete(contactsTable).where(eq(contactsTable.id, parsed.data.id));
  res.json({ success: true });
});

export default router;
