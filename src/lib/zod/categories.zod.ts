// import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import {
  getBaseReturnSchema,
  getPaginatedSchema,
  messageSchema
} from "./helpers";

// export const selectCategorySchema = createSelectSchema(categories);
const baseCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const selectCategorySchema = baseCategorySchema;

export type SelectCategory = z.infer<typeof selectCategorySchema>;

export const insertCategorySchema = selectCategorySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export type InsertCategorySchema = z.infer<typeof insertCategorySchema>;

export const updateCategorySchema = selectCategorySchema
  .omit({
    id: true,
    createdAt: true
  })
  .partial();

export type UpdateCategorySchema = z.infer<typeof updateCategorySchema>;

// Ent-to-end functionalities Return schemas/Types
export const getAllCategoriesResponseSchema = getBaseReturnSchema(
  getPaginatedSchema(z.array(selectCategorySchema))
);

export type GetAllCategoriesResponse = z.infer<
  typeof getAllCategoriesResponseSchema
>;

export const getCategoryByIdResponseSchema =
  getBaseReturnSchema(selectCategorySchema);

export type GetCategoryByIDResponse = z.infer<
  typeof getCategoryByIdResponseSchema
>;

export const createCategoryResponseSchema =
  getBaseReturnSchema(selectCategorySchema);

export type CreateCategoryResponse = z.infer<
  typeof createCategoryResponseSchema
>;

export const updateCategoryResponseSchema =
  getBaseReturnSchema(selectCategorySchema);

export type UpdateCategoryResponse = z.infer<
  typeof updateCategoryResponseSchema
>;

export const deleteCategoryResponseSchema = getBaseReturnSchema(messageSchema);

export type DeleteCategoryResponse = z.infer<
  typeof deleteCategoryResponseSchema
>;
