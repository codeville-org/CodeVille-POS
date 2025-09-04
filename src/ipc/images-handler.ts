import {
  deleteImageController,
  getImageAsBase64Controller,
  getImagesDirectory,
  saveImageFromBase64Controller,
  saveImageFromPathController
} from "@/controllers/images.controller";
import { createHandler } from "./create-handler";

const handler = createHandler("images");

export const imagesHandler = {
  register() {
    handler.handle("getImagesDirectory", getImagesDirectory);
    handler.handle("saveImageFromBase64", saveImageFromBase64Controller);
    handler.handle("saveImageFromPath", saveImageFromPathController);
    handler.handle("getImageAsBase64", getImageAsBase64Controller);
    handler.handle("deleteImage", deleteImageController);
  }
};
