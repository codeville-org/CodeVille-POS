import {
  CreateCategoryResponse,
  DeleteCategoryResponse,
  GetAllCategoriesResponse,
  GetCategoryByIDResponse,
  InsertCategorySchema,
  UpdateCategoryResponse,
  UpdateCategorySchema
} from "@/lib/zod/categories.zod";
import { QueryParamsSchema } from "@/lib/zod/helpers";

// Window management types
export interface WindowActions {
  minimize: () => Promise<void>;
  close: () => Promise<void>;
}

export interface CategoriesActions {
  getAll: (query: QueryParamsSchema) => Promise<GetAllCategoriesResponse>;
  getById: (id: string) => Promise<GetCategoryByIDResponse>;
  create: (payload: InsertCategorySchema) => Promise<CreateCategoryResponse>;
  update: (
    id: string,
    payload: UpdateCategorySchema
  ) => Promise<UpdateCategoryResponse>;
  delete: (id: string) => Promise<DeleteCategoryResponse>;
}

// Main IPC API interface
export interface ElectronAPI {
  window: WindowActions;
  categories: CategoriesActions;
}
