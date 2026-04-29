import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import type { IOrder } from "@shared/types";
import { STORAGE_KEYS } from "@shared/types";
import OrderDetailView from "./components/order-detail-view";

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (stored) {
        const orders: IOrder[] = JSON.parse(stored);
        const found = orders.find((o) => o.id === id);
        setOrder(found || null);
      }
    } catch {
      setOrder(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-card border border-border rounded-2xl shadow-sm py-16 text-center">
          <p className="text-muted-foreground text-sm">加载中...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-card border border-border rounded-2xl shadow-sm py-16 text-center">
          <p className="text-muted-foreground text-sm">订单不存在</p>
        </div>
      </div>
    );
  }

  return (
    <OrderDetailView />
  );
}
