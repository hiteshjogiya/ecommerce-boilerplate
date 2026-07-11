"use client";

import { X } from "lucide-react";
import { useState } from "react";

export function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="border-b border-slate-200 bg-slate-900 px-4 py-3 text-center text-sm font-medium text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-3">
        <span>Free shipping on orders over $100 • New season arrivals now live</span>
        <button
          type="button"
          onClick={() => setIsVisible(false)}
          className="rounded-full p-1 text-white/80 transition hover:bg-white/10 hover:text-white"
          aria-label="Dismiss announcement"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
