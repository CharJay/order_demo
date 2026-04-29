import { Trash2Icon } from "lucide-react";
import type { IOrderLineItem } from "@shared/types";

interface IOrderLineItemProps {
  item: IOrderLineItem;
  index: number;
  onUpdate: (id: string, updates: Partial<IOrderLineItem>) => void;
  onDelete: (id: string) => void;
  canDelete: boolean;
}

export default function OrderLineItem({ item, index, onUpdate, onDelete, canDelete }: IOrderLineItemProps) {
  const subtotal = item.quantity * item.unitPrice;

  return (
    <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-4 p-4 bg-slate-50 rounded-xl border border-border">
      {/* Index */}
      <div className="hidden sm:flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-xs font-bold shrink-0">
        {index + 1}
      </div>

      {/* Product Name */}
      <div className="flex-1 min-w-0">
        <label className="block text-xs font-medium text-muted-foreground mb-1.5">商品名称</label>
        <input
          type="text"
          value={item.productName}
          onChange={(e) => onUpdate(item.id, { productName: e.target.value })}
          placeholder="请输入商品名称"
          className="w-full bg-white border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
        />
      </div>

      {/* Quantity */}
      <div className="w-full sm:w-24">
        <label className="block text-xs font-medium text-muted-foreground mb-1.5">数量</label>
        <input
          type="number"
          min={1}
          value={item.quantity}
          onChange={(e) => onUpdate(item.id, { quantity: Math.max(1, parseInt(e.target.value) || 1) })}
          className="w-full bg-white border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
        />
      </div>

      {/* Unit Price */}
      <div className="w-full sm:w-28">
        <label className="block text-xs font-medium text-muted-foreground mb-1.5">单价（元）</label>
        <input
          type="number"
          min={0}
          step={0.01}
          value={item.unitPrice}
          onChange={(e) => onUpdate(item.id, { unitPrice: Math.max(0, parseFloat(e.target.value) || 0) })}
          className="w-full bg-white border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
        />
      </div>

      {/* Subtotal */}
      <div className="w-full sm:w-28">
        <label className="block text-xs font-medium text-muted-foreground mb-1.5">小计</label>
        <div className="bg-white border border-border rounded-xl px-3 py-2 text-sm font-semibold text-primary">
          ¥{subtotal.toFixed(2)}
        </div>
      </div>

      {/* Delete Button */}
      <div className="flex sm:shrink-0">
        {canDelete && (
          <button
            type="button"
            onClick={() => onDelete(item.id)}
            className="inline-flex items-center justify-center w-10 h-10 rounded-xl text-muted-foreground hover:bg-red-50 hover:text-red-500 transition-colors"
            title="删除此行"
          >
            <Trash2Icon className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
