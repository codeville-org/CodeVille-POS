import { create } from "zustand";

import type { UninitializedTransactionItem } from "@/lib/zod/transactions.zod";
import { PaymentMethod } from "@/lib/zod/transactions.zod";
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

  // Customer Selection
  selectedCustomer: null,
  setSelectedCustomer: (customer) => set({ selectedCustomer: customer }),

  // Payment
  paymentMethod: PaymentMethod.CASH,
  setPaymentMethod: (method) => set({ paymentMethod: method }),
  cashReceived: 0,
  setCashReceived: (amount) => set({ cashReceived: amount }),

  // Discount & Tax
  discountAmount: 0,
  setDiscountAmount: (amount) => set({ discountAmount: amount }),
  taxRate: 0,
  setTaxRate: (rate) => set({ taxRate: rate }),

  /**
   * Add new Product to Active Transaction
   * @param item - Item to add active transaction
   */
  addTransactionItem: (item) => {
    const { transactionItems } = get();

    const existingArray = transactionItems.filter(
      (arrayItem) => arrayItem.productId === item.productId
    );

    if (existingArray.length > 0) {
      const existingItem = existingArray[0];

      let updatedItem: UninitializedTransactionItem = {
        ...existingItem,
        quantity: existingItem.quantity + 1,
        totalAmount: (existingItem.quantity + 1) * existingItem.unitPrice
      };

      const preparedArray = transactionItems.filter(
        (arrayItem) => arrayItem.productId !== existingItem.productId
      );
      preparedArray.push(updatedItem);

      set({ transactionItems: preparedArray });
    } else {
      const newItem = {
        ...item,
        totalAmount: item.quantity * item.unitPrice
      };
      set({ transactionItems: [...transactionItems, newItem] });
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
        ...item,
        totalAmount:
          (item.quantity || existingItem.quantity) *
          (item.unitPrice || existingItem.unitPrice)
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
  clearTransactionItems: () => set({ transactionItems: [] }),

  // Computed values
  getSubtotal: () => {
    const { transactionItems } = get();
    return transactionItems.reduce((sum, item) => sum + item.totalAmount, 0);
  },

  getTaxAmount: () => {
    const { taxRate } = get();
    const subtotal = get().getSubtotal();
    return (subtotal * taxRate) / 100;
  },

  getTotal: () => {
    const { discountAmount } = get();
    const subtotal = get().getSubtotal();
    const taxAmount = get().getTaxAmount();
    return subtotal + taxAmount - discountAmount;
  },

  getChangeAmount: () => {
    const { cashReceived, paymentMethod } = get();
    // Only calculate change for cash payments
    if (paymentMethod !== PaymentMethod.CASH) return 0;
    const total = get().getTotal();
    return Math.max(0, cashReceived - total);
  },

  // Transaction operations
  initializeNewTransaction: () => {
    set({
      activeTransaction: null,
      transactionItems: [],
      selectedCustomer: null,
      paymentMethod: PaymentMethod.CASH,
      cashReceived: 0,
      discountAmount: 0,
      taxRate: 0
    });
  },

  resetTransaction: () => {
    set({
      activeTransaction: null,
      transactionItems: [],
      selectedCustomer: null,
      paymentMethod: PaymentMethod.CASH,
      cashReceived: 0,
      discountAmount: 0,
      taxRate: 0
    });
  }
}));
