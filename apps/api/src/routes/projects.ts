import {
  createProject,
  getAllProjects,
  getProjectById,
  getProjectBySlug,
  getProjectsByUserId,
  projectInsertSchema,
} from "@ecco/postgres";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

const projectsRouter = new Hono();

// GET /projects - List all projects (with optional user filter)
projectsRouter.get("/", async (c) => {
  const userId = c.req.query("userId");

  try {
    if (userId) {
      const userIdNum = parseInt(userId);
      if (Number.isNaN(userIdNum)) {
        return c.json({ error: "Invalid userId parameter" }, 400);
      }

      const userProjects = await getProjectsByUserId(userIdNum);
      return c.json({ projects: userProjects });
    }

    const allProjects = await getAllProjects();
    return c.json({ projects: allProjects });
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return c.json({ error: "Failed to fetch projects" }, 500);
  }
});

// GET /projects/:id - Get project by ID
projectsRouter.get("/:id", async (c) => {
  const id = parseInt(c.req.param("id"));

  if (Number.isNaN(id)) {
    return c.json({ error: "Invalid project ID" }, 400);
  }

  try {
    const project = await getProjectById(id);

    if (!project) {
      return c.json({ error: "Project not found" }, 404);
    }

    return c.json({ project });
  } catch (error) {
    console.error("Failed to fetch project:", error);
    return c.json({ error: "Failed to fetch project" }, 500);
  }
});

// GET /projects/by-slug/:slug - Get project by slug
projectsRouter.get("/by-slug/:slug", async (c) => {
  const slug = c.req.param("slug");

  try {
    const project = await getProjectBySlug(slug);

    if (!project) {
      return c.json({ error: "Project not found" }, 404);
    }

    return c.json({ project });
  } catch (error) {
    console.error("Failed to fetch project:", error);
    return c.json({ error: "Failed to fetch project" }, 500);
  }
});

// POST /projects - Create new project
projectsRouter.post("/", zValidator("json", projectInsertSchema), async (c) => {
  const projectData = c.req.valid("json");

  try {
    const project = await createProject(projectData);
    return c.json({ project }, 201);
  } catch (error) {
    console.error("Failed to create project:", error);
    return c.json({ error: "Failed to create project" }, 500);
  }
});

export { projectsRouter };
