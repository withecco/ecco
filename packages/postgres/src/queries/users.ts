// packages/postgres/src/queries/users.ts

import { eq } from "drizzle-orm";
import { db } from "../db";
import type { NewUser, User } from "../schema";
import { users } from "../schema";

export async function createUser(userData: NewUser): Promise<User> {
  const result = await db.insert(users).values(userData).returning();
  const user = result[0];
  if (!user) {
    throw new Error("Failed to create user");
  }
  return user;
}

export async function getUserById(id: number): Promise<User | null> {
  const result = await db.select().from(users).where(eq(users.id, id));
  return result[0] || null;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const result = await db.select().from(users).where(eq(users.email, email));
  return result[0] || null;
}

export async function getAllUsers(): Promise<User[]> {
  return await db.select().from(users);
}

export async function updateUser(
  id: number,
  updates: Partial<NewUser>,
): Promise<User | null> {
  const result = await db
    .update(users)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(users.id, id))
    .returning();
  return result[0] || null;
}

export async function deleteUser(id: number): Promise<boolean> {
  const result = await db.delete(users).where(eq(users.id, id));
  return result.rowCount > 0;
}
