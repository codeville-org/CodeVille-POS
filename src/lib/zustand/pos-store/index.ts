import { create } from "zustand";

import type { UninitializedTransactionItem } from "@/lib/zod/transactions.zod";
import type { PosStoreInterface } from "./types";

export const usePosStore = create<PosStoreInterface>()((set, get) => ({
  searchMode: "barcode",
  setSearchMode: (mode) => set({ searchMode: mode }),

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

      let updatedItem: UninitializedTransactionItem = {
        ...existingItem,
        quantity: existingItem.quantity + 1
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
