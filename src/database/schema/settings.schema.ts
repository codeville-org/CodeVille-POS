import { createId } from "@paralleldrive/cuid2";
import { index, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

import { timestamps } from "./helpers";

export const settings = sqliteTable(
  "settings",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    key: text("key").notNull().unique(),
    value: text("value").notNull(),
    description: text("description"),
    category: text("category").notNull().default("general"),
    ...timestamps
  },
  (table) => [
    uniqueIndex("settings_key_idx").on(table.key),
    index("settings_category_idx").on(table.category)
  ]
);
