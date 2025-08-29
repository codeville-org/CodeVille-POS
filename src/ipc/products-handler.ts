import {
  createNewProductController,
  deleteProductController,
  getAllProductsController,
  getProductByBarcodeController,
  getProductByIDController,
  updateProductController
} from "@/controllers/products.controller";
import { createHandler } from "./create-handler";

const handler = createHandler("products");

export const productsHandler = {
  register() {
    handler.handle("getAll", getAllProductsController);
    handler.handle("getById", getProductByIDController);
    handler.handle("getByBarcode", getProductByBarcodeController);
    handler.handle("create", createNewProductController);
    handler.handle("update", updateProductController);
    handler.handle("delete", deleteProductController);
  }
};
