import { createId } from "@paralleldrive/cuid2";
import { index, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { timestamps } from "./helpers";

// Categories Table
export const categories = sqliteTable(
  "categories",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    name: text("name").notNull().unique(),
    ...timestamps
  },
  (table) => [index("categories_name_idx").on(table.name)]
);
