import { SelectCategory } from "@/lib/zod/categories.zod";
import type { UninitializedTransactionItem } from "@/lib/zod/transactions.zod";
import { BaseTransactionSchema } from "@/lib/zod/transactions.zod";

export type SearchMode = "barcode" | "manual";

export type FilterType = "featured" | "all" | SelectCategory;

export type POSListingView = "listing" | "billing";

export type AmountOverview = {
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
};

export interface PosStoreInterface {
  // Listing View
  listingView: POSListingView;
  setListingView: (view: POSListingView) => void;

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

  transactionItems: UninitializedTransactionItem[];
  addTransactionItem: (item: UninitializedTransactionItem) => void;

  changeTransactionItemQuantity: (id: string, quantity: number) => void;

  updateTransactionItem: (
    id: string,
    item: UninitializedTransactionItem
  ) => void;

  removeTransactionItem: (id: string) => void;

  clearTransactionItems: () => void;

  getTransactionAmountOverview: () => AmountOverview;
}
