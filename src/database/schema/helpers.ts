import { sql } from "drizzle-orm";
import { integer } from "drizzle-orm/sqlite-core";

// Helper function for timestamps
export const timestamps = {
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`)
    .$onUpdate(() => new Date())
};
