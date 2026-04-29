import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

interface IPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: IPaginationProps) {
  if (totalPages <= 1) return null;

  const pages: (number | string)[] = [];
  const delta = 1;

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
      if (pages.length > 0 && typeof pages[pages.length - 1] === "string") {
        pages.pop();
      }
      pages.push(i);
    } else if (typeof pages[pages.length - 1] !== "string") {
      pages.push("...");
    }
  }

  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <p className="text-sm text-muted-foreground">
        第 <span className="font-semibold text-foreground">{currentPage}</span> / {totalPages} 页
      </p>

      <div className="flex items-center gap-1">
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="inline-flex items-center justify-center w-9 h-9 rounded-xl text-sm font-medium transition-colors disabled:opacity-40 disabled:pointer-events-none text-muted-foreground hover:bg-slate-100 hover:text-foreground"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </button>

        {pages.map((page, idx) =>
          typeof page === "string" ? (
            <span key={`ellipsis-${idx}`} className="w-9 h-9 flex items-center justify-center text-sm text-muted-foreground">
              …
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`inline-flex items-center justify-center w-9 h-9 rounded-xl text-sm font-medium transition-colors ${
                page === currentPage
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-slate-100 hover:text-foreground"
              }`}
            >
              {page}
            </button>
          )
        )}

        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="inline-flex items-center justify-center w-9 h-9 rounded-xl text-sm font-medium transition-colors disabled:opacity-40 disabled:pointer-events-none text-muted-foreground hover:bg-slate-100 hover:text-foreground"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
