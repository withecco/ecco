import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "@/config/env";
// import { sql } from "drizzle-orm";

export const db = drizzle(env.DATABASE_URL);

// export type Database = typeof db;

// // Test connection function
// export async function testConnection() {
//   try {
//     await sql`SELECT 1`;
//     console.log("✅ Database connection successful");
//     return true;
//   } catch (error) {
//     console.error("❌ Database connection failed:", error);
//     return false;
//   }
// }
//
// // Graceful shutdown
// export async function closeConnection() {
//   await sql.end();
// }
