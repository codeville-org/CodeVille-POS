import { create } from "zustand";

import { getProductAmount } from "@/lib/utils";
import type { UninitializedTransactionItem } from "@/lib/zod/transactions.zod";
import type { PosStoreInterface } from "./types";

export const usePosStore = create<PosStoreInterface>()((set, get) => ({
  searchMode: "barcode",
  setSearchMode: (mode) => set({ searchMode: mode }),

  listingView: "listing",
  setListingView: (view) => set({ listingView: view }),

  searchTerm: null,
  setSearchTerm: (term) => set({ searchTerm: term }),
  resetSearch: () => set({ searchTerm: null }),

  filter: "featured",
  setFilter: (filter) => set({ filter }),

  // Transaction Related
  activeTransaction: null,
  setActiveTransaction: (transaction) =>
    set({ activeTransaction: transaction }),

  transactionItems: [],

  /**
   * Add new Product to Active Transaction
   * @param item - Item to add active transaction
   */
  addTransactionItem: (item) => {
    const { transactionItems } = get();

    const exsistingArray = transactionItems.filter(
      (arrayItem) => arrayItem.productId === item.productId
    );

    if (exsistingArray.length > 0) {
      const existingItem = exsistingArray[0];

      const newQuantity = existingItem.quantity + 1;

      const updatedItem: UninitializedTransactionItem = {
        ...existingItem,
        quantity: newQuantity,
        totalAmount: getProductAmount(existingItem, newQuantity)
      };

      const preparedArray = transactionItems.filter(
        (arrayItem) => arrayItem.productId !== existingItem.productId
      );

      preparedArray.push(updatedItem);

      set({ transactionItems: preparedArray });
    } else {
      set({ transactionItems: [...transactionItems, item] });
    }
  },

  /**
   * Handle change quantity
   * @param id - ID of item to update
   * @param quantity - New quantity
   */
  changeTransactionItemQuantity: (id: string, quantity: number) => {
    const { transactionItems, removeTransactionItem } = get();

    if (quantity <= 0) {
      removeTransactionItem(id);
      return;
    }

    const existingItemArr = transactionItems.filter(
      (arrayItem) => arrayItem.productId === id
    );

    if (existingItemArr.length > 0) {
      const existingItem = existingItemArr[0];

      const updatedItem: UninitializedTransactionItem = {
        ...existingItem,
        quantity,
        totalAmount: getProductAmount(existingItem, quantity)
      };

      const preparedArray = transactionItems.filter(
        (arrayItem) => arrayItem.productId !== existingItem.productId
      );

      preparedArray.push(updatedItem);

      set({ transactionItems: preparedArray });
    }
  },

  /**
   * Update active transaction item by id
   * @param id - ID of item to update
   * @param item - Update body
   */
  updateTransactionItem: (id, item) => {
    const { transactionItems } = get();
    const existingItemArr = transactionItems.filter(
      (arrayItem) => arrayItem.productId === id
    );

    if (existingItemArr.length > 0) {
      const existingItem = existingItemArr[0];

      const updatedItem: UninitializedTransactionItem = {
        ...existingItem,
        ...item
      };

      const preparedArray = transactionItems.filter(
        (arrayItem) => arrayItem.productId !== existingItem.productId
      );
      preparedArray.push(updatedItem);

      set({ transactionItems: preparedArray });
    }
  },

  /**
   * @param id - Product ID to delete from active transaction
   */
  removeTransactionItem: (id) => {
    const { transactionItems } = get();

    const preparedArray = transactionItems.filter(
      (arrayItem) => arrayItem.productId !== id
    );

    set({ transactionItems: preparedArray });
  },

  /**
   * This clears all items from active transaction
   */
  clearTransactionItems: () => set({ transactionItems: [] })
}));
