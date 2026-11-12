import { betterAuth } from "better-auth";
import { db } from "./db";
export const auth = betterAuth({
  database: db,
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
    minPasswordLength: 12,
  },
  rateLimit: { enabled: true, storage: "database", window: 60, max: 15 },
  advanced: {
    useSecureCookies: process.env.BETTER_AUTH_URL?.startsWith("https://"),
  },
});
