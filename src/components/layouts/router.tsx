import { Navigate, Route, Routes } from "react-router-dom";

import { CategoriesPage } from "../pages/categories";
import { CustomersPage } from "../pages/customers";
import { DashboardPage } from "../pages/dashboard";
import { DiagnosticsPage } from "../pages/diagnostics";
import { PosPage } from "../pages/pos";
import { ProductsInventoryPage } from "../pages/products";
import { NewProductPage } from "../pages/products/new-product";
import { SingleProductPage } from "../pages/products/single-product";

type Props = {};

export function AppRouter({}: Props) {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/dashboard" element={<Navigate to="/" replace />} />
      <Route path="/pos" element={<PosPage />} />
      <Route path="/products" element={<ProductsInventoryPage />} />
      <Route path="/products/new" element={<NewProductPage />} />
      <Route path="/products/:id" element={<SingleProductPage />} />
      <Route path="/products/categories" element={<CategoriesPage />} />
      <Route path="/customers" element={<CustomersPage />} />
      <Route path="/diagnostics" element={<DiagnosticsPage />} />
      {/* <Route path="/customers/:id" element={<CustomerDetail />} /> */}
      {/* <Route path="/reports" element={<Reports />} /> */}
      {/* <Route path="/settings" element={<Settings />} /> */}

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
