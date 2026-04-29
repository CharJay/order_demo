import { Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout";
import NotFoundPage from "@/pages/NotFoundPage/NotFoundPage";
import OrderListPage from "@/pages/OrderListPage/OrderListPage";
import OrderFormPage from "@/pages/OrderFormPage/OrderFormPage";
import OrderDetailPage from "@/pages/OrderDetailPage/OrderDetailPage";
import EditOrderPage from "@/pages/OrderFormPage/EditOrderPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<OrderListPage />} />
        <Route path="create" element={<OrderFormPage />} />
        <Route path="order/:id" element={<OrderDetailPage />} />
        <Route path="order/:id/edit" element={<EditOrderPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
