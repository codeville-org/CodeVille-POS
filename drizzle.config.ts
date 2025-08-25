import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/database/schema/index.ts",
  dialect: "sqlite",
  out: "./src/database/migrations",
  dbCredentials: {
    url: "./codeville-pos.db"
  },
  verbose: true,
  strict: true
});
