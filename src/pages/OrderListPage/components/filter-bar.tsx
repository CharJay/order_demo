import { SearchIcon, FilterIcon, PlusCircleIcon } from "lucide-react";
import { NavLink } from "react-router-dom";
import type { OrderStatus } from "@shared/types";
import { ORDER_STATUS_LABELS } from "@shared/types";

interface IFilterBarProps {
  searchKeyword: string;
  onSearchChange: (value: string) => void;
  statusFilter: OrderStatus | "all";
  onStatusChange: (status: OrderStatus | "all") => void;
}

const statusOptions: { value: OrderStatus | "all"; label: string }[] = [
  { value: "all", label: "全部状态" },
  { value: "pending", label: ORDER_STATUS_LABELS.pending },
  { value: "processing", label: ORDER_STATUS_LABELS.processing },
  { value: "completed", label: ORDER_STATUS_LABELS.completed },
  { value: "cancelled", label: ORDER_STATUS_LABELS.cancelled },
];

export default function FilterBar({
  searchKeyword,
  onSearchChange,
  statusFilter,
  onStatusChange,
}: IFilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
      {/* Search Input */}
      <div className="relative flex-1">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="搜索订单编号或客户姓名..."
          value={searchKeyword}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
        />
      </div>

      {/* Status Filter */}
      <div className="relative">
        <FilterIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value as OrderStatus | "all")}
          className="appearance-none pl-10 pr-8 py-2.5 bg-card border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Create Button */}
      <NavLink
        to="/create"
        className="inline-flex items-center justify-center gap-1.5 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 hover:text-primary-foreground transition-colors whitespace-nowrap"
      >
        <PlusCircleIcon className="w-4 h-4" />
        创建订单
      </NavLink>
    </div>
  );
}
