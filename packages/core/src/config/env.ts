import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

const parseEnv = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    console.error("❌ Invalid environment variables in @ecco/core:");
    if (error instanceof z.ZodError) {
      console.error(error);
    }
    process.exit(1);
  }
};

export const env = parseEnv();
