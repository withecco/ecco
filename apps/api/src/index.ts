// apps/api/src/index.ts
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { env } from "./config/env";
import { projectsRouter } from "./routes/projects";
import { usersRouter } from "./routes/users";

const app = new Hono();

// Middleware
app.use("*", logger());
app.use(
  "*",
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:5173",
    ], // Add common dev ports
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  }),
);

// Health check routes
app.get("/", (c) =>
  c.json({
    message: "Ecco MCP Platform API",
    status: "healthy",
    version: "0.3.0",
    timestamp: new Date().toISOString(),
  }),
);

app.get("/health", (c) =>
  c.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
    database: "connected", // TODO: Add actual DB health check
  }),
);

// API routes
app.route("/api/users", usersRouter);
app.route("/api/projects", projectsRouter);

// 404 handler
app.notFound((c) => {
  return c.json(
    {
      error: "Not found",
      path: c.req.path,
      method: c.req.method,
    },
    404,
  );
});

// Global error handler
app.onError((err, c) => {
  console.error("API Error:", {
    error: err.message,
    stack: err.stack,
    path: c.req.path,
    method: c.req.method,
    timestamp: new Date().toISOString(),
  });

  return c.json(
    {
      error: "Internal server error",
      ...(env.NODE_ENV === "development" && {
        details: err.message,
        stack: err.stack,
      }),
    },
    500,
  );
});

// Log startup info
console.log(`🚀 Ecco API starting on port ${env.PORT}`);
console.log(`📊 Environment: ${env.NODE_ENV}`);
console.log(
  `🗄  Database: ${env.DATABASE_URL ? "Connected" : "Not configured"}`,
);

export default {
  port: env.PORT,
  fetch: app.fetch,
};
