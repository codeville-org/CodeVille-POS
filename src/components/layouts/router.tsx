import { Navigate, Route, Routes } from "react-router-dom";

import { CategoriesPage } from "../pages/categories";
import { CustomersPage } from "../pages/customers";
import { PosPage } from "../pages/pos";
import { ProductsInventoryPage } from "../pages/products";
import { NewProductPage } from "../pages/products/new-product";
import { SingleProductPage } from "../pages/products/single-product";
import { SettingsPage } from "../pages/settings";
import { TransactionsPage } from "../pages/transactions";

type Props = {};

export function AppRouter({}: Props) {
  return (
    <Routes>
      <Route path="/" element={<PosPage />} />
      <Route path="/pos" element={<Navigate to="/" replace />} />
      <Route path="/products" element={<ProductsInventoryPage />} />
      <Route path="/products/new" element={<NewProductPage />} />
      <Route path="/products/:id" element={<SingleProductPage />} />
      <Route path="/products/categories" element={<CategoriesPage />} />
      <Route path="/customers" element={<CustomersPage />} />
      <Route path="/transactions" element={<TransactionsPage />} />
      {/* <Route path="/reports" element={<Reports />} /> */}
      <Route path="/settings" element={<SettingsPage />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
