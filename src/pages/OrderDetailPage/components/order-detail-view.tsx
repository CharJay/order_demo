import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeftIcon, EditIcon, PackageIcon, UserIcon, PhoneIcon, MapPinIcon, MessageSquareIcon, CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import type { IOrder, IOrderLineItem } from "@shared/types";
import { ORDER_STATUS_LABELS, STORAGE_KEYS } from "@shared/types";
import StatusBadge from "@/components/status-badge";

function loadOrders(): IOrder[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function formatCurrency(amount: number): string {
  return `¥${amount.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function OrderDetailView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<IOrder | null>(null);

  useEffect(() => {
    const orders = loadOrders();
    const found = orders.find((o) => o.id === id);
    setOrder(found || null);
  }, [id]);

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <PackageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">订单不存在</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 text-primary hover:underline text-sm font-medium"
          >
            返回列表
          </button>
        </div>
      </div>
    );
  }

  const canTransition = ORDER_STATUS_LABELS[order.status] && order.status !== "completed" && order.status !== "cancelled";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="p-2 rounded-xl text-muted-foreground hover:bg-slate-100 hover:text-foreground transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">{order.orderNo}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              <CalendarIcon className="w-3.5 h-3.5 inline mr-1 -mt-0.5" />
              下单时间：{formatDate(order.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={order.status} />
          {order.status !== "completed" && order.status !== "cancelled" && (
            <button
              onClick={() => navigate(`/order/${order.id}/edit`)}
              className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 hover:text-primary-foreground transition-colors"
            >
              <EditIcon className="w-4 h-4" />
              编辑
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Info Card */}
          <div className="bg-card border border-border rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-foreground tracking-tight mb-4">订单信息</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-slate-50 mt-0.5">
                  <UserIcon className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">客户姓名</p>
                  <p className="text-sm font-semibold text-foreground mt-0.5">{order.customerName || "—"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-slate-50 mt-0.5">
                  <PhoneIcon className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">联系电话</p>
                  <p className="text-sm font-semibold text-foreground mt-0.5">{order.phone || "—"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 sm:col-span-2">
                <div className="p-2 rounded-lg bg-slate-50 mt-0.5">
                  <MapPinIcon className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">收货地址</p>
                  <p className="text-sm font-semibold text-foreground mt-0.5">{order.address || "—"}</p>
                </div>
              </div>
              {order.remark && (
                <div className="flex items-start gap-3 sm:col-span-2">
                  <div className="p-2 rounded-lg bg-slate-50 mt-0.5">
                    <MessageSquareIcon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">备注</p>
                    <p className="text-sm text-foreground mt-0.5">{order.remark}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Line Items Card */}
          <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 pb-4">
              <h2 className="text-lg font-bold text-foreground tracking-tight">商品明细</h2>
            </div>

            {/* Desktop Table */}
            <div className="hidden sm:block">
              <table className="w-full">
                <thead>
                  <tr className="border-t border-border">
                    <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">商品名称</th>
                    <th className="text-center text-xs font-medium text-muted-foreground px-4 py-3">数量</th>
                    <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">单价</th>
                    <th className="text-right text-xs font-medium text-muted-foreground px-6 py-3">小计</th>
                  </tr>
                </thead>
                <tbody>
                  {order.lineItems.map((item: IOrderLineItem) => (
                    <tr key={item.id} className="border-t border-border hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-foreground">{item.productName}</td>
                      <td className="px-4 py-4 text-sm text-foreground text-center">{item.quantity}</td>
                      <td className="px-4 py-4 text-sm text-foreground text-right">{formatCurrency(item.unitPrice)}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-foreground text-right">{formatCurrency(item.subtotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="sm:hidden px-4 pb-4 space-y-3">
              {order.lineItems.map((item: IOrderLineItem) => (
                <div key={item.id} className="border border-border rounded-xl p-4 bg-slate-50/50">
                  <p className="text-sm font-semibold text-foreground">{item.productName}</p>
                  <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                    <span>{item.quantity} × {formatCurrency(item.unitPrice)}</span>
                    <span className="font-semibold text-foreground">{formatCurrency(item.subtotal)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="border-t border-border px-6 py-4 bg-slate-50/50">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">商品总数</span>
                <span className="text-sm font-semibold text-foreground">{order.totalItems} 件</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-base font-bold text-foreground">合计金额</span>
                <span className="text-xl font-bold text-primary">{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Summary */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl shadow-sm p-6">
            <h3 className="text-sm font-bold text-foreground tracking-tight mb-4">订单摘要</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">订单编号</span>
                <span className="font-medium text-foreground text-xs">{order.orderNo}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">订单状态</span>
                <StatusBadge status={order.status} />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">商品总数</span>
                <span className="font-medium text-foreground">{order.totalItems} 件</span>
              </div>
              <div className="border-t border-border pt-3 mt-3">
                <div className="flex justify-between">
                  <span className="text-sm font-semibold text-foreground">总金额</span>
                  <span className="text-lg font-bold text-primary">{formatCurrency(order.totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl shadow-sm p-6">
            <h3 className="text-sm font-bold text-foreground tracking-tight mb-4">时间记录</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">下单时间</p>
                <p className="text-sm font-medium text-foreground mt-0.5">{formatDate(order.createdAt)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">最后更新</p>
                <p className="text-sm font-medium text-foreground mt-0.5">{formatDate(order.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
