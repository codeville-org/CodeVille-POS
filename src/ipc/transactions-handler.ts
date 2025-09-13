import {
  addNewTransactionItemController,
  deleteTransactionController,
  initializeTransactionController,
  updateTransactionController
} from "@/controllers/transactions.controller";
import { createHandler } from "./create-handler";

const handler = createHandler("transactions");

export const transactionsHandler = {
  register() {
    handler.handle("initialize", initializeTransactionController);
    handler.handle("update", updateTransactionController);
    handler.handle("addItems", addNewTransactionItemController);
    handler.handle("delete", deleteTransactionController);
  }
};
