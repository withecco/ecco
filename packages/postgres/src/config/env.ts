import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NODE_ENV: z.enum(["development", "production", "test"]),
});

const parseEnv = () => {
  try {
    console.log(process.env.NODE_ENV, process.env.DATABASE_URL);
    return envSchema.parse(process.env);
  } catch (error) {
    console.error("❌ Invalid environment variables:");
    if (error instanceof z.ZodError) {
      console.error(error);
    }
    process.exit(1);
  }
};

export const env = parseEnv();
