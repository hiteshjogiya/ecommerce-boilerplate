'use client';

import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

const sizeMap = { sm: 'h-3 w-3', md: 'h-4 w-4', lg: 'h-5 w-5' };

export function StarRating({ rating, maxStars = 5, size = 'md', showValue = false, interactive = false, onChange }: StarRatingProps) {
  const stars = Array.from({ length: maxStars }, (_, i) => i + 1);
  const cls = sizeMap[size];

  return (
    <div className="flex items-center gap-0.5" role={interactive ? 'group' : undefined} aria-label={`Rating: ${rating} out of ${maxStars}`}>
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => onChange?.(star)}
          className={interactive ? 'cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded' : 'cursor-default'}
          aria-label={interactive ? `Rate ${star} star${star > 1 ? 's' : ''}` : undefined}
        >
          <Star
            className={`${cls} ${star <= rating ? 'fill-amber-400 text-amber-400' : 'fill-none text-gray-300'} ${interactive ? 'hover:text-amber-400 hover:fill-amber-400 transition-colors' : ''}`}
          />
        </button>
      ))}
      {showValue && <span className="ml-1 text-sm text-slate-600">{rating.toFixed(1)}</span>}
    </div>
  );
}
