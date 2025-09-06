import {
  createNewCustomerController,
  deleteCustomerController,
  getAllCustomersController,
  getCustomerByIdController,
  updateCustomerController
} from "@/controllers/customers.controller";
import { createHandler } from "./create-handler";

const handler = createHandler("customers");

export const customersHandler = {
  register() {
    handler.handle("getAll", getAllCustomersController);
    handler.handle("getById", getCustomerByIdController);
    handler.handle("create", createNewCustomerController);
    handler.handle("update", updateCustomerController);
    handler.handle("delete", deleteCustomerController);
  }
};
