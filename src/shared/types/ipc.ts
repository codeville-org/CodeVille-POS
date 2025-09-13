import {
  ProductsQueryParamsSchema,
  QueryParamsSchema
} from "@/lib/zod/helpers";

// Categories Imports
import {
  CreateCategoryResponse,
  DeleteCategoryResponse,
  GetAllCategoriesResponse,
  GetCategoryByIDResponse,
  InsertCategorySchema,
  UpdateCategoryResponse,
  UpdateCategorySchema
} from "@/lib/zod/categories.zod";

// Products Imports
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

import type {
  AddNewTransactionItemsResponse,
  CreateTransactionSchema,
  DeleteTransactionResponse,
  InitializeTransactionResponse,
  UninitializedTransactionItem,
  UpdateTransactionResponse,
  UpdateTransactionSchema
} from "@/lib/zod/transactions.zod";

// Customers Imports
import {
  CreateCustomerResponseSchema,
  CreateCustomerSchema,
  DeleteCustomerResponseSchema,
  GetAllCustomersResponseSchema,
  GetCustomerByIdResponseSchema,
  UpdateCustomerResponseSchema,
  UpdateCustomerSchema
} from "@/lib/zod/customers.zod";

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
  getAll: (query: ProductsQueryParamsSchema) => Promise<GetAllProductsResponse>;
  getById: (id: string) => Promise<GetProductByIDResponse>;
  getByBarcode: (barcode: string) => Promise<GetProductByBarcodeResponse>;
  create: (payload: InsertProductSchema) => Promise<CreateProductResponse>;
  update: (
    id: string,
    payload: UpdateProductSchema
  ) => Promise<UpdateProductResponse>;
  delete: (id: string) => Promise<DeleteProductResponse>;
}

export interface ImagesActions {
  getImagesDirectory: () => string;
  saveImageFromBase64: (base64Data: string) => Promise<string>;
  saveImageFromPath: (sourceImagePath: string) => Promise<string>;
  getImageAsBase64: (filename: string) => Promise<string | null>;
  deleteImage: (filename: string) => Promise<boolean>;
}

export interface CustomersActions {
  getAll: (query: QueryParamsSchema) => Promise<GetAllCustomersResponseSchema>;
  getById: (id: string) => Promise<GetCustomerByIdResponseSchema>;
  create: (
    payload: CreateCustomerSchema
  ) => Promise<CreateCustomerResponseSchema>;
  update: (
    id: string,
    payload: UpdateCustomerSchema
  ) => Promise<UpdateCustomerResponseSchema>;
  delete: (id: string) => Promise<DeleteCustomerResponseSchema>;
}

export interface TransactionsActions {
  initialize: (
    body: CreateTransactionSchema
  ) => Promise<InitializeTransactionResponse>;
  update: (
    id: string,
    body: UpdateTransactionSchema
  ) => Promise<UpdateTransactionResponse>;
  addItems: (
    transactionId: string,
    items: UninitializedTransactionItem[]
  ) => Promise<AddNewTransactionItemsResponse>;
  delete: (id: string) => Promise<DeleteTransactionResponse>;
}

// Main IPC API interface
export interface ElectronAPI {
  window: WindowActions;
  categories: CategoriesActions;
  products: ProductsActions;
  images: ImagesActions;
  customers: CustomersActions;
  transactions: TransactionsActions;
}
