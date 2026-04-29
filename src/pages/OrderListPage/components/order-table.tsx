import { useState } from "react";
import { Link } from "react-router-dom";
import { EyeIcon, PencilIcon, Trash2Icon, ArrowRightIcon } from "lucide-react";
import type { IOrder, OrderStatus } from "@shared/types";
import { ORDER_STATUS_LABELS, STATUS_TRANSITIONS } from "@shared/types";
import StatusBadge from "@/components/status-badge";

interface IOrderTableProps {
  orders: IOrder[];
  onDelete: (order: IOrder) => void;
  onStatusChange: (id: string, newStatus: OrderStatus) => void;
}

export default function OrderTable({ orders, onDelete, onStatusChange }: IOrderTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (orders.length === 0) {
    return (
      <div className="bg-card border border-border rounded-2xl shadow-sm py-16 text-center">
        <p className="text-muted-foreground text-sm">暂无订单数据</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-slate-50/50">
              <th className="text-left px-6 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">订单编号</th>
              <th className="text-left px-6 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">客户姓名</th>
              <th className="text-center px-6 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">商品总数</th>
              <th className="text-right px-6 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">总金额</th>
              <th className="text-center px-6 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">状态</th>
              <th className="text-left px-6 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">下单时间</th>
              <th className="text-right px-6 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => (
              <tr
                key={order.id}
                className={`border-b border-border last:border-b-0 hover:bg-slate-50/50 transition-colors ${
                  idx % 2 === 0 ? "bg-white" : "bg-slate-50/30"
                }`}
              >
                <td className="px-6 py-4">
                  <span className="font-mono text-sm font-semibold text-foreground">{order.orderNo}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-foreground">{order.customerName}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-sm text-foreground">{order.totalItems}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-sm font-semibold text-foreground">¥{order.totalAmount.toFixed(2)}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <StatusBadge status={order.status} />
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-1">
                    {/* Status change dropdown */}
                    {STATUS_TRANSITIONS[order.status].length > 0 && (
                      <div className="relative group">
                        <button className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors" title="变更状态">
                          <ArrowRightIcon className="w-4 h-4" />
                        </button>
                        <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-xl shadow-lg py-1 z-20 min-w-32 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150">
                          {STATUS_TRANSITIONS[order.status].map((nextStatus) => (
                            <button
                              key={nextStatus}
                              onClick={() => onStatusChange(order.id, nextStatus)}
                              className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-slate-50 transition-colors"
                            >
                              转为{ORDER_STATUS_LABELS[nextStatus]}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    <Link
                      to={`/order/${order.id}`}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      title="查看详情"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </Link>
                    <Link
                      to={`/order/${order.id}/edit`}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-amber-600 hover:bg-amber-50 transition-colors"
                      title="编辑"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => onDelete(order)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="删除"
                    >
                      <Trash2Icon className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-card border border-border rounded-2xl shadow-sm p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm font-semibold text-foreground">{order.orderNo}</span>
              <StatusBadge status={order.status} />
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground text-xs">客户</span>
                <p className="text-foreground font-medium">{order.customerName}</p>
              </div>
              <div className="text-right">
                <span className="text-muted-foreground text-xs">总金额</span>
                <p className="text-foreground font-semibold">¥{order.totalAmount.toFixed(2)}</p>
              </div>
              <div>
                <span className="text-muted-foreground text-xs">商品数</span>
                <p className="text-foreground">{order.totalItems} 件</p>
              </div>
              <div className="text-right">
                <span className="text-muted-foreground text-xs">下单时间</span>
                <p className="text-foreground">{formatDate(order.createdAt)}</p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <div className="flex items-center gap-1">
                {STATUS_TRANSITIONS[order.status].length > 0 && (
                  <button
                    onClick={() => {
                      if (expandedId === order.id) {
                        setExpandedId(null);
                      } else {
                        setExpandedId(order.id);
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                  >
                    变更状态
                  </button>
                )}
                <Link
                  to={`/order/${order.id}`}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  详情
                </Link>
                <Link
                  to={`/order/${order.id}/edit`}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-amber-600 hover:bg-amber-50 transition-colors"
                >
                  编辑
                </Link>
              </div>
              <button
                onClick={() => onDelete(order)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors"
              >
                删除
              </button>
            </div>
            {/* Mobile status change options */}
            {expandedId === order.id && STATUS_TRANSITIONS[order.status].length > 0 && (
              <div className="flex gap-2 pt-1">
                {STATUS_TRANSITIONS[order.status].map((nextStatus) => (
                  <button
                    key={nextStatus}
                    onClick={() => {
                      onStatusChange(order.id, nextStatus);
                      setExpandedId(null);
                    }}
                    className="flex-1 px-3 py-2 rounded-xl text-xs font-medium bg-slate-50 text-foreground hover:bg-primary/10 hover:text-primary transition-colors border border-border"
                  >
                    {ORDER_STATUS_LABELS[nextStatus]}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const mins = String(d.getMinutes()).padStart(2, "0");
  return `${month}-${day} ${hours}:${mins}`;
}
