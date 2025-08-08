// packages/postgres/src/queries/projects.ts

import { eq } from "drizzle-orm";
import { db } from "../db";
import type { NewProject, Project } from "../schema";
import { projects } from "../schema";

export async function createProject(projectData: NewProject): Promise<Project> {
  const result = await db.insert(projects).values(projectData).returning();
  const project = result[0];
  if (!project) {
    throw new Error("Failed to create project");
  }
  return project;
}

export async function getProjectById(id: number): Promise<Project | null> {
  const result = await db.select().from(projects).where(eq(projects.id, id));
  return result[0] || null;
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const result = await db
    .select()
    .from(projects)
    .where(eq(projects.slug, slug));
  return result[0] || null;
}

export async function getProjectsByUserId(userId: number): Promise<Project[]> {
  return await db.select().from(projects).where(eq(projects.ownerId, userId));
}

export async function getAllProjects(): Promise<Project[]> {
  return await db.select().from(projects);
}

export async function updateProject(
  id: number,
  updates: Partial<NewProject>,
): Promise<Project | null> {
  const result = await db
    .update(projects)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(projects.id, id))
    .returning();
  return result[0] || null;
}

export async function deleteProject(id: number): Promise<boolean> {
  const result = await db.delete(projects).where(eq(projects.id, id));
  return result.rowCount > 0;
}
