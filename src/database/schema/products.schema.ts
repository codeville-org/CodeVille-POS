import { createId } from "@paralleldrive/cuid2";
import {
  blob,
  index,
  integer,
  real,
  sqliteTable,
  text,
  uniqueIndex
} from "drizzle-orm/sqlite-core";

import { categories } from "./categories.schema";
import { timestamps } from "./helpers";

export const products = sqliteTable(
  "products",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    name: text("name").notNull(),
    barcode: text("barcode").unique(),
    price: real("price").notNull(),
    cost: real("cost").notNull().default(0),
    categoryId: text("category_id").references(() => categories.id, {
      onDelete: "set null"
    }),
    stockQuantity: integer("stock_quantity").notNull().default(0),
    unit: text("unit").default("pcs"), // pcs, kg, liter, etc.
    description: text("description"),
    image: blob("image"), // Store small images as blob
    isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
    ...timestamps
  },
  (table) => [
    index("products_name_idx").on(table.name),
    uniqueIndex("products_barcode_idx").on(table.barcode),
    index("products_category_idx").on(table.categoryId),
    index("products_stock_idx").on(table.stockQuantity),
    index("products_active_idx").on(table.isActive)
  ]
);
