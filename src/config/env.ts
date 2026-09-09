import { z } from "zod";

const envSchema = z.object({
  VITE_API_BASE_URL: z.string().default("http://localhost:4000/api/v1"),
  VITE_WS_URL: z.string().default("http://localhost:4000"),
  VITE_USE_MOCK_API: z
    .string()
    .default("false")
    .transform((v) => v === "true"),
});

const parsed = envSchema.safeParse(import.meta.env);

if (!parsed.success) {
  // eslint-disable-next-line no-console
  console.error("Invalid frontend environment configuration", parsed.error.flatten().fieldErrors);
}

export const env = parsed.success
  ? parsed.data
  : { VITE_API_BASE_URL: "http://localhost:4000/api/v1", VITE_WS_URL: "http://localhost:4000", VITE_USE_MOCK_API: false };
