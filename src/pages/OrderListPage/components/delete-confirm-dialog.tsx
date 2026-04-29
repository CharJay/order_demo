import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangleIcon, XIcon } from "lucide-react";

interface IDeleteConfirmDialogProps {
  open: boolean;
  orderNo: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirmDialog({
  open,
  orderNo,
  onConfirm,
  onCancel,
}: IDeleteConfirmDialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
          />

          {/* Dialog */}
          <motion.div
            className="relative bg-card rounded-2xl shadow-xl border border-border w-full max-w-md mx-4 p-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {/* Close button */}
            <button
              className="absolute top-4 right-4 p-1.5 rounded-xl text-muted-foreground hover:bg-slate-100 hover:text-foreground transition-colors"
              onClick={onCancel}
            >
              <XIcon className="w-4 h-4" />
            </button>

            {/* Icon */}
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-50 mb-4">
              <AlertTriangleIcon className="w-6 h-6 text-red-500" />
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-foreground mb-2">
              确认删除订单
            </h3>

            {/* Description */}
            <p className="text-sm text-muted-foreground mb-1">
              您即将删除订单
            </p>
            <p className="text-sm font-semibold text-foreground mb-6">
              {orderNo}
            </p>

            <p className="text-xs text-muted-foreground mb-6">
              删除后，该订单及其所有明细数据将无法恢复。
            </p>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                className="flex-1 bg-white border border-border text-foreground px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors"
                onClick={onCancel}
              >
                取消
              </button>
              <button
                className="flex-1 bg-red-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-red-600 hover:text-white transition-colors"
                onClick={onConfirm}
              >
                确认删除
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
