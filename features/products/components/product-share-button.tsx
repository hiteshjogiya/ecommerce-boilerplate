'use client';

import { useState } from 'react';
import { Share2, Link2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductShareButtonProps {
  title: string;
  slug: string;
}

export function ProductShareButton({ title, slug }: ProductShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const url = typeof window !== 'undefined' ? `${window.location.origin}/products/${slug}` : `/products/${slug}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const nativeShare = async () => {
    if (navigator.share) {
      await navigator.share({ title, url });
    } else {
      setOpen(true);
    }
  };

  return (
    <div className="relative">
      <Button variant="ghost" size="sm" onClick={nativeShare} aria-label="Share product" className="gap-2">
        <Share2 className="h-4 w-4" />
        Share
      </Button>

      {open && (
        <div className="absolute right-0 top-full mt-2 z-50 bg-white rounded-xl border border-slate-200 shadow-lg p-4 min-w-52 space-y-3">
          <p className="text-sm font-medium text-slate-900">Share this product</p>
          <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg text-xs text-slate-500 truncate">
            <Link2 className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{url}</span>
          </div>
          <Button size="sm" onClick={copyLink} className="w-full gap-2">
            {copied ? <><Check className="h-3.5 w-3.5" /> Copied!</> : <><Link2 className="h-3.5 w-3.5" /> Copy Link</>}
          </Button>
          <div className="flex gap-2">
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center text-xs py-1.5 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-slate-600"
            >
              Twitter/X
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center text-xs py-1.5 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-slate-600"
            >
              Facebook
            </a>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="w-full text-xs text-slate-400 hover:text-slate-600 transition-colors"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
