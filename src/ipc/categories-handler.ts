import {
  createNewCategoryController,
  deleteCategoryController,
  getAllCategoriesController,
  getCategoryByIdController,
  updateCategoryController
} from "@/controllers/categories.controller";
import { createHandler } from "./create-handler";

const handler = createHandler("categories");

export const categoriesHandler = {
  register() {
    handler.handle("getAll", getAllCategoriesController);
    handler.handle("getById", getCategoryByIdController);
    handler.handle("create", createNewCategoryController);
    handler.handle("update", updateCategoryController);
    handler.handle("delete", deleteCategoryController);
  }
};
