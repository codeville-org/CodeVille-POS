import { Navigate, Route, Routes } from "react-router-dom";

import { CategoriesPage } from "../pages/categories";
import { DashboardPage } from "../pages/dashboard";
import { PosPage } from "../pages/pos";
import { ProductsPage } from "../pages/products";

type Props = {};

export function AppRouter({}: Props) {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/dashboard" element={<Navigate to="/" replace />} />
      <Route path="/pos" element={<PosPage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/products/categories" element={<CategoriesPage />} />
      {/* <Route path="/products/:id" element={<ProductDetail />} /> */}
      {/* <Route path="/customers" element={<Customers />} /> */}
      {/* <Route path="/customers/:id" element={<CustomerDetail />} /> */}
      {/* <Route path="/reports" element={<Reports />} /> */}
      {/* <Route path="/settings" element={<Settings />} /> */}

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
