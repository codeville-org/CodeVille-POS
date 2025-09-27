import { loginController } from "@/controllers/security.controller";
import { createHandler } from "./create-handler";

const handler = createHandler("security");

export const securityHandler = {
  register() {
    handler.handle("login", loginController);
  }
};
