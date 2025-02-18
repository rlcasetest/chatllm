import { z } from "zod";
import { createEnv } from "@t3-oss/env-core";

// Validates the envinroment variables of the application before running.
// Reduces time wasted trying to fix a ghost bug.
export const env = createEnv({
  clientPrefix: "VITE_",
  client: {
    VITE_API_URL: z.string().url().min(1, "Required"),
    VITE_SUPABASE_URL: z.string().url().min(1, "Required"),
    VITE_SUPABASE_KEY: z.string().min(1, "Required"),
  },
  runtimeEnv: import.meta.env,
});
