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
import {
  CreateProductResponse,
  DeleteProductResponse,
  GetAllProductsResponse,
  GetProductByBarcodeResponse,
  GetProductByIDResponse,
  InsertProductSchema,
  UpdateProductResponse,
  UpdateProductSchema
} from "@/lib/zod/products.zod";

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

export interface ProductsActions {
  getAll: (query: QueryParamsSchema) => Promise<GetAllProductsResponse>;
  getById: (id: string) => Promise<GetProductByIDResponse>;
  getByBarcode: (barcode: string) => Promise<GetProductByBarcodeResponse>;
  create: (payload: InsertProductSchema) => Promise<CreateProductResponse>;
  update: (
    id: string,
    payload: UpdateProductSchema
  ) => Promise<UpdateProductResponse>;
  delete: (id: string) => Promise<DeleteProductResponse>;
}

// Main IPC API interface
export interface ElectronAPI {
  window: WindowActions;
  categories: CategoriesActions;
  products: ProductsActions;
}
