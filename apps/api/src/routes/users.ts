import {
  createUser,
  getAllUsers,
  getUserById,
  userInsertSchema,
} from "@ecco/postgres";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

const usersRouter = new Hono();

// GET /users - List all users
usersRouter.get("/", async (c) => {
  try {
    const allUsers = await getAllUsers();
    return c.json({ users: allUsers });
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return c.json({ error: "Failed to fetch users" }, 500);
  }
});

// GET /users/:id - Get user by ID
usersRouter.get("/:id", async (c) => {
  const id = parseInt(c.req.param("id"));

  if (Number.isNaN(id)) {
    return c.json({ error: "Invalid user ID" }, 400);
  }

  try {
    const user = await getUserById(id);

    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json({ user });
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return c.json({ error: "Failed to fetch user" }, 500);
  }
});

// POST /users - Create new user
usersRouter.post("/", zValidator("json", userInsertSchema), async (c) => {
  const userData = c.req.valid("json");

  try {
    const user = await createUser(userData);
    return c.json({ user }, 201);
  } catch (error) {
    console.error("Failed to create user:", error);
    return c.json({ error: "Failed to create user" }, 500);
  }
});

export { usersRouter };
