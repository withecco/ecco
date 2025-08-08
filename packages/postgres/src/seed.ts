import { db } from "@/db";
import { projects, users } from "@/schema";

async function seed() {
  try {
    console.log("🌱 Seeding database...");

    // Create test users
    console.log("👤 Creating users...");
    const insertedUsers = await db
      .insert(users)
      .values([
        {
          name: "Ecco Developer",
          email: "dev@ecco.local",
        },
        {
          name: "Demo User",
          email: "demo@ecco.local",
        },
      ])
      .returning();

    const devUser = insertedUsers[0];
    const demoUser = insertedUsers[1];

    if (!devUser || !demoUser) {
      throw new Error("Failed to create users");
    }

    console.log(
      `   ✅ Created user: ${devUser.name} (${devUser.email}) - ID: ${devUser.id}`,
    );
    console.log(
      `   ✅ Created user: ${demoUser.name} (${demoUser.email}) - ID: ${demoUser.id}`,
    );

    // Create test projects
    console.log("📁 Creating projects...");
    const insertedProjects = await db
      .insert(projects)
      .values([
        {
          name: "Weather MCP Project",
          slug: "weather-mcp",
          description: "A sample MCP project for weather data integration",
          ownerId: devUser.id,
          isPublic: false,
          githubRepo: "https://github.com/example/weather-mcp",
          githubBranch: "main",
        },
        {
          name: "Demo Project",
          slug: "demo-project",
          description: "A simple demo project for testing",
          ownerId: demoUser.id,
          isPublic: true,
          status: "active",
        },
      ])
      .returning();

    const project1 = insertedProjects[0];
    const project2 = insertedProjects[1];

    if (!project1 || !project2) {
      throw new Error("Failed to create projects");
    }

    console.log(
      `   ✅ Created project: ${project1.name} (ID: ${project1.id}, owner: ${devUser.name})`,
    );
    console.log(
      `   ✅ Created project: ${project2.name} (ID: ${project2.id}, owner: ${demoUser.name})`,
    );

    console.log("\n🎉 Database seeded successfully!");
    console.log("\nSeed data summary:");
    console.log(`- ${insertedUsers.length} users created`);
    console.log(`- ${insertedProjects.length} projects created`);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.main) {
  seed();
}
