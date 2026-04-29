import { useState, useMemo, useEffect } from "react";
import type { IOrder, OrderStatus } from "@shared/types";
import { STORAGE_KEYS } from "@shared/types";
import seedOrders from "@shared/static/data/seed-orders.json";
import FilterBar from "./components/filter-bar";
import OrderTable from "./components/order-table";
import { Pagination } from "./components/pagination";
import DeleteConfirmDialog from "./components/delete-confirm-dialog";

const ITEMS_PER_PAGE = 5;

function loadOrders(): IOrder[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (stored) return JSON.parse(stored);
  } catch {
    // ignore
  }
  return seedOrders.map((seed: any) => ({
    id: crypto.randomUUID(),
    orderNo: seed.orderNo,
    customerName: seed.customerName,
    phone: seed.phone,
    address: seed.address,
    remark: seed.remark,
    status: seed.status,
    totalItems: seed.totalItems,
    totalAmount: seed.totalAmount,
    lineItems: seed.items.map((item: any, idx: number) => ({
      id: crypto.randomUUID(),
      productName: item.productName,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      subtotal: item.subtotal,
    })),
    createdAt: seed.orderTime,
    updatedAt: seed.updatedAt,
  }));
}

function saveOrders(orders: IOrder[]) {
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
}

export default function OrderListPage() {
  const [orders, setOrders] = useState<IOrder[]>(loadOrders);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<IOrder | null>(null);

  useEffect(() => {
    saveOrders(orders);
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchStatus = statusFilter === "all" || order.status === statusFilter;
      const keyword = searchKeyword.toLowerCase();
      const matchSearch =
        !keyword ||
        order.orderNo.toLowerCase().includes(keyword) ||
        order.customerName.toLowerCase().includes(keyword);
      return matchStatus && matchSearch;
    });
  }, [orders, statusFilter, searchKeyword]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / ITEMS_PER_PAGE));
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchKeyword, statusFilter]);

  const handleDelete = (order: IOrder) => {
    setOrders((prev) => prev.filter((o) => o.id !== order.id));
    setDeleteTarget(null);
  };

  const handleStatusChange = (id: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id ? { ...o, status: newStatus, updatedAt: new Date().toISOString() } : o
      )
    );
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto space-y-6">
      <FilterBar
        searchKeyword={searchKeyword}
        onSearchChange={setSearchKeyword}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />
      <OrderTable
        orders={paginatedOrders}
        onDelete={(order) => setDeleteTarget(order)}
        onStatusChange={handleStatusChange}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
      {deleteTarget && (
        <DeleteConfirmDialog
          open={!!deleteTarget}
          orderNo={deleteTarget.orderNo}
          onConfirm={() => handleDelete(deleteTarget)}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
