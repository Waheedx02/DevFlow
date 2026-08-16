"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, X } from "lucide-react";

export function Toast({
  message,
  onDismiss,
  duration = 4000,
}: {
  message: string;
  onDismiss: () => void;
  duration?: number;
}) {
  const [visible, setVisible] = useState(false);

  // Mount animation
  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  // Auto-dismiss
  useEffect(() => {
    const timeout = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 200); // let the exit transition finish first
    }, duration);
    return () => clearTimeout(timeout);
  }, [duration, onDismiss]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onDismiss, 200);
  };

  return createPortal(
    <div className="fixed top-4 inset-x-0 z-[200] flex justify-center px-4 pointer-events-none">
      <div
        className={`pointer-events-auto flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-[#0f1e17] shadow-2xl px-4 py-3 max-w-md w-full sm:w-auto transition-all duration-200 ${
          visible ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"
        }`}
        role="status"
      >
        <span className="text-emerald-400 shrink-0">
          <CheckCircle2 size={20} />
        </span>
        <span className="text-sm font-medium text-slate-100 flex-1">{message}</span>
        <button
          onClick={handleClose}
          className="text-slate-500 hover:text-white transition shrink-0"
          aria-label="Dismiss"
        >
          <X size={15} />
        </button>
      </div>
    </div>,
    document.body
  );
}