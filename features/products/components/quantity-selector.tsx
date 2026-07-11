"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface QuantitySelectorProps {
  maxQuantity: number;
  value?: number;
  onChange?: (quantity: number) => void;
  showSelectedLabel?: boolean;
  disabled?: boolean;
}

function clampQuantity(value: number, maxQuantity: number) {
  return Math.min(Math.max(value, 1), maxQuantity);
}

export function QuantitySelector({ maxQuantity, value, onChange, showSelectedLabel = true, disabled = false }: QuantitySelectorProps) {
  const [internalQuantity, setInternalQuantity] = useState(1);
  const quantity = value ?? internalQuantity;
  const setQuantity = (nextQuantity: number) => {
    if (onChange) {
      onChange(nextQuantity);
      return;
    }

    setInternalQuantity(nextQuantity);
  };

  const handleDecrease = () => {
    setQuantity(clampQuantity(quantity - 1, maxQuantity));
  };

  const handleIncrease = () => {
    setQuantity(clampQuantity(quantity + 1, maxQuantity));
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center rounded-full border border-slate-200 bg-white">
        <button
          type="button"
          onClick={handleDecrease}
          disabled={disabled}
          className="h-11 w-11 rounded-full text-lg font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Decrease quantity"
        >
          -
        </button>
        <input
          type="number"
          min={1}
          max={maxQuantity}
          value={quantity}
          onChange={(event) => {
            const nextValue = Number.parseInt(event.target.value, 10);
            if (Number.isNaN(nextValue)) {
              setQuantity(1);
              return;
            }
            setQuantity(clampQuantity(nextValue, maxQuantity));
          }}
          onBlur={() => setQuantity(clampQuantity(quantity, maxQuantity))}
          disabled={disabled}
          className="h-11 w-16 border-x border-slate-200 bg-transparent text-center text-sm font-medium outline-none"
          aria-label="Quantity"
        />
        <button
          type="button"
          onClick={handleIncrease}
          disabled={disabled}
          className="h-11 w-11 rounded-full text-lg font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
      {showSelectedLabel ? (
        <Button type="button" variant="ghost" className="border border-slate-200" disabled>
          {quantity} selected
        </Button>
      ) : null}
    </div>
  );
}
