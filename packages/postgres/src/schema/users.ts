import { pgTable, varchar, integer } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const users = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  // age: integer().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
});

export const userInsertSchema = createInsertSchema(users);
export const userSelectSchema = createSelectSchema(users);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

// const rows = await db.select().from(users).limit(1);
// const parsed: { id: number; name: string; age: number } = userSelectSchema.parse(rows[0]); // Will parse successfully
