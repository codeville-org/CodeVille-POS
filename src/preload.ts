// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge } from "electron";
import type { ElectronAPI } from "./shared/types/ipc";
import { createInvoker } from "./shared/utils/ipc-invoker";

const windowInvoker = createInvoker("window");
const categoriesInvoker = createInvoker("categories");
const productsInvoker = createInvoker("products");
const imagesInvoker = createInvoker("images");
const customersInvoker = createInvoker("customers");

const electronAPI: ElectronAPI = {
  window: {
    close: windowInvoker("close"),
    minimize: windowInvoker("minimize")
  },
  categories: {
    getAll: categoriesInvoker("getAll"),
    getById: categoriesInvoker("getById"),
    create: categoriesInvoker("create"),
    update: categoriesInvoker("update"),
    delete: categoriesInvoker("delete")
  },
  products: {
    getAll: productsInvoker("getAll"),
    getById: productsInvoker("getById"),
    getByBarcode: productsInvoker("getByBarcode"),
    create: productsInvoker("create"),
    update: productsInvoker("update"),
    delete: productsInvoker("delete")
  },
  images: {
    getImagesDirectory: imagesInvoker("getImagesDirectory"),
    getImageAsBase64: imagesInvoker("getImageAsBase64"),
    saveImageFromBase64: imagesInvoker("saveImageFromBase64"),
    saveImageFromPath: imagesInvoker("saveImageFromPath"),
    deleteImage: imagesInvoker("deleteImage")
  },
  customers: {
    getAll: customersInvoker("getAll"),
    getById: customersInvoker("getById"),
    create: customersInvoker("create"),
    update: customersInvoker("update"),
    delete: customersInvoker("delete")
  }
};

contextBridge.exposeInMainWorld("electronAPI", electronAPI);
