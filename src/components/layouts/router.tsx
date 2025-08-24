import { Navigate, Route, Routes } from "react-router-dom";
import { DashboardPage } from "../pages/dashboard";

type Props = {};

export function AppRouter({}: Props) {
  return (
    <Routes location={"/"}>
      <Route path="/" element={<DashboardPage />} />
      {/* <Route path="/pos" element={<POS />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/customers/:id" element={<CustomerDetail />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} /> */}

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
