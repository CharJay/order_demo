import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PlusIcon, Trash2Icon, ArrowLeftIcon, SaveIcon } from "lucide-react";
import type { IOrder, IOrderLineItem, IOrderFormData } from "@shared/types";
import { STORAGE_KEYS, ORDER_STATUS_LABELS } from "@shared/types";
import OrderLineItem from "./order-line-item";

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function generateOrderNo(): string {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, "");
  const seq = String(Math.floor(Math.random() * 9999) + 1).padStart(4, "0");
  return `ORD-${date}-${seq}`;
}

function loadOrders(): IOrder[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveOrders(orders: IOrder[]) {
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
}

function createEmptyLineItem(): IOrderLineItem {
  return {
    id: generateId(),
    productName: "",
    quantity: 1,
    unitPrice: 0,
    subtotal: 0,
  };
}

export default function OrderForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

  const [formData, setFormData] = useState<IOrderFormData>({
    customerName: "",
    phone: "",
    address: "",
    remark: "",
    lineItems: [createEmptyLineItem()],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEdit && id) {
      const orders = loadOrders();
      const order = orders.find((o) => o.id === id);
      if (order) {
        setFormData({
          customerName: order.customerName,
          phone: order.phone,
          address: order.address,
          remark: order.remark,
          lineItems: order.lineItems.length > 0 ? order.lineItems : [createEmptyLineItem()],
        });
      }
    }
  }, [id, isEdit]);

  const totalAmount = formData.lineItems.reduce((sum, item) => sum + item.subtotal, 0);
  const totalItems = formData.lineItems.reduce((sum, item) => sum + item.quantity, 0);

  const updateField = useCallback((field: keyof IOrderFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const updateLineItem = useCallback((itemId: string, updates: Partial<IOrderLineItem>) => {
    setFormData((prev) => ({
      ...prev,
      lineItems: prev.lineItems.map((item) => {
        if (item.id !== itemId) return item;
        const updated = { ...item, ...updates };
        updated.subtotal = updated.quantity * updated.unitPrice;
        return updated;
      }),
    }));
  }, []);

  const addLineItem = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      lineItems: [...prev.lineItems, createEmptyLineItem()],
    }));
  }, []);

  const removeLineItem = useCallback((itemId: string) => {
    setFormData((prev) => ({
      ...prev,
      lineItems: prev.lineItems.filter((item) => item.id !== itemId),
    }));
  }, []);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.customerName.trim()) {
      newErrors.customerName = "客户姓名不能为空";
    }
    if (formData.lineItems.length === 0) {
      newErrors.lineItems = "请至少添加一条商品明细";
    }
    for (let i = 0; i < formData.lineItems.length; i++) {
      const item = formData.lineItems[i];
      if (!item.productName.trim()) {
        newErrors[`line_${i}_name`] = "商品名称不能为空";
      }
      if (item.quantity < 1) {
        newErrors[`line_${i}_qty`] = "数量必须≥1";
      }
      if (item.unitPrice < 0) {
        newErrors[`line_${i}_price`] = "单价不能为负";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);

    const now = new Date().toISOString();
    const validItems = formData.lineItems.filter((item) => item.productName.trim());

    if (isEdit && id) {
      const orders = loadOrders();
      const idx = orders.findIndex((o) => o.id === id);
      if (idx !== -1) {
        orders[idx] = {
          ...orders[idx],
          customerName: formData.customerName.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          remark: formData.remark.trim(),
          lineItems: validItems,
          totalItems: validItems.reduce((s, i) => s + i.quantity, 0),
          totalAmount: validItems.reduce((s, i) => s + i.subtotal, 0),
          updatedAt: now,
        };
        saveOrders(orders);
      }
    } else {
      const newOrder: IOrder = {
        id: generateId(),
        orderNo: generateOrderNo(),
        customerName: formData.customerName.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        remark: formData.remark.trim(),
        status: "pending",
        lineItems: validItems,
        totalItems: validItems.reduce((s, i) => s + i.quantity, 0),
        totalAmount: validItems.reduce((s, i) => s + i.subtotal, 0),
        createdAt: now,
        updatedAt: now,
      };
      const orders = loadOrders();
      orders.unshift(newOrder);
      saveOrders(orders);
    }

    setTimeout(() => {
      setSaving(false);
      navigate("/");
    }, 300);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl text-muted-foreground hover:bg-slate-100 hover:text-foreground transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-black tracking-tight text-foreground">
            {isEdit ? "编辑订单" : "创建订单"}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Order Header Section */}
          <div className="bg-card rounded-2xl border border-border shadow-sm p-6 space-y-5">
            <h2 className="text-lg font-bold text-foreground">订单信息</h2>

            {/* Customer Name */}
            <div>
              <label className="text-sm font-semibold text-foreground mb-1.5 block">
                客户姓名 <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={formData.customerName}
                onChange={(e) => updateField("customerName", e.target.value)}
                placeholder="请输入客户姓名"
                className={`w-full bg-white border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
                  errors.customerName ? "border-destructive" : "border-border"
                }`}
              />
              {errors.customerName && (
                <p className="text-xs text-destructive mt-1">{errors.customerName}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="text-sm font-semibold text-foreground mb-1.5 block">联系电话</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                placeholder="请输入联系电话"
                className="w-full bg-white border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>

            {/* Address */}
            <div>
              <label className="text-sm font-semibold text-foreground mb-1.5 block">收货地址</label>
              <textarea
                value={formData.address}
                onChange={(e) => updateField("address", e.target.value)}
                placeholder="请输入收货地址"
                rows={2}
                className="w-full bg-white border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
              />
            </div>

            {/* Remark */}
            <div>
              <label className="text-sm font-semibold text-foreground mb-1.5 block">备注</label>
              <textarea
                value={formData.remark}
                onChange={(e) => updateField("remark", e.target.value)}
                placeholder="订单备注信息（选填）"
                rows={2}
                className="w-full bg-white border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
              />
            </div>
          </div>

          {/* Line Items Section */}
          <div className="bg-card rounded-2xl border border-border shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">商品明细</h2>
              <button
                type="button"
                onClick={addLineItem}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-indigo-700 transition-colors"
              >
                <PlusIcon className="w-4 h-4" />
                添加商品
              </button>
            </div>

            {errors.lineItems && (
              <p className="text-xs text-destructive">{errors.lineItems}</p>
            )}

            <div className="space-y-3">
              {/* Table Header - Desktop */}
              <div className="hidden sm:grid sm:grid-cols-12 gap-3 text-xs font-semibold text-muted-foreground px-1">
                <div className="col-span-5">商品名称</div>
                <div className="col-span-2">数量</div>
                <div className="col-span-2">单价（元）</div>
                <div className="col-span-2">小计（元）</div>
                <div className="col-span-1" />
              </div>

              {formData.lineItems.map((item, index) => (
                <OrderLineItem
                  key={item.id}
                  item={item}
                  index={index}
                  onUpdate={updateLineItem}
                  onDelete={() => removeLineItem(item.id)}
                  canDelete={formData.lineItems.length > 1}
                />
              ))}
            </div>
          </div>

          {/* Total Summary */}
          <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  商品总数：<span className="font-semibold text-foreground">{totalItems}</span> 件
                </p>
                <p className="text-xs text-muted-foreground">
                  共 {formData.lineItems.filter((i) => i.productName.trim()).length} 种商品
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground mb-1">订单总金额</p>
                <p className="text-3xl font-black tracking-tight text-primary">
                  ¥{totalAmount.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2.5 rounded-xl text-sm font-medium text-foreground bg-white border border-border hover:bg-slate-50 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium text-primary-foreground bg-primary hover:bg-indigo-700 hover:text-primary-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <SaveIcon className="w-4 h-4" />
              {saving ? "保存中..." : isEdit ? "保存修改" : "创建订单"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
