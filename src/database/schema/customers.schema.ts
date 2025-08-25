import { createId } from "@paralleldrive/cuid2";
import {
  index,
  integer,
  real,
  sqliteTable,
  text
} from "drizzle-orm/sqlite-core";

import { timestamps } from "./helpers";

export const customers = sqliteTable(
  "customers",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    name: text("name").notNull(),
    phone: text("phone"),
    address: text("address"),
    totalCreditLimit: real("total_credit_limit").default(0),
    currentBalance: real("current_balance").notNull().default(0),
    notes: text("notes"),
    isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
    ...timestamps
  },
  (table) => [
    index("customers_name_idx").on(table.name),
    index("customers_phone_idx").on(table.phone),
    index("customers_balance_idx").on(table.currentBalance),
    index("customers_active_idx").on(table.isActive)
  ]
);
