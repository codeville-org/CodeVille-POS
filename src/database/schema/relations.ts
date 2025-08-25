import { relations } from "drizzle-orm";

import { categories } from "./categories.schema";
import { customers } from "./customers.schema";
import { products } from "./products.schema";
import { transactionItems, transactions } from "./transaction.schema";

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products)
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id]
  }),
  transactionItems: many(transactionItems)
}));

export const customersRelations = relations(customers, ({ many }) => ({
  transactions: many(transactions)
}));

export const transactionsRelations = relations(
  transactions,
  ({ one, many }) => ({
    customer: one(customers, {
      fields: [transactions.customerId],
      references: [customers.id]
    }),
    items: many(transactionItems)
  })
);
