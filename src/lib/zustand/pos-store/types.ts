import { SelectCategory } from "@/lib/zod/categories.zod";
import type { SelectCustomer } from "@/lib/zod/customers.zod";
import type {
  PaymentMethod,
  UninitializedTransactionItem
} from "@/lib/zod/transactions.zod";
import { BaseTransactionSchema } from "@/lib/zod/transactions.zod";

export type SearchMode = "barcode" | "manual";

export type FilterType = "featured" | "all" | SelectCategory;

export interface PosStoreInterface {
  // POS Product Search
  searchMode: SearchMode;
  setSearchMode: (mode: SearchMode) => void;

  searchTerm: string | null;
  setSearchTerm: (term: string) => void;
  resetSearch: () => void;

  // Products Listing
  filter: FilterType;
  setFilter: (filter: FilterType) => void;

  // Transaction State
  activeTransaction: BaseTransactionSchema | null;
  setActiveTransaction: (transaction: BaseTransactionSchema | null) => void;

  // Transaction Items
  transactionItems: UninitializedTransactionItem[];
  addTransactionItem: (item: UninitializedTransactionItem) => void;
  updateTransactionItem: (
    id: string,
    item: Partial<UninitializedTransactionItem>
  ) => void;
  removeTransactionItem: (id: string) => void;
  clearTransactionItems: () => void;

  // Customer Selection
  selectedCustomer: SelectCustomer | null;
  setSelectedCustomer: (customer: SelectCustomer | null) => void;

  // Payment
  paymentMethod: PaymentMethod;
  setPaymentMethod: (method: PaymentMethod) => void;
  cashReceived: number;
  setCashReceived: (amount: number) => void;

  // Discount & Tax
  discountAmount: number;
  setDiscountAmount: (amount: number) => void;
  taxRate: number;
  setTaxRate: (rate: number) => void;

  // Computed values
  getSubtotal: () => number;
  getTaxAmount: () => number;
  getTotal: () => number;
  getChangeAmount: () => number;

  // Transaction operations
  initializeNewTransaction: () => void;
  resetTransaction: () => void;
}
