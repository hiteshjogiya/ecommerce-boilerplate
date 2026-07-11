"use client";

import Image from "next/image";
import { useState } from "react";
import { User } from "lucide-react";

interface AvatarImageProps {
  src?: string | null;
  alt: string;
  size: number;
  className?: string;
  fallbackLabel?: string;
}

export function AvatarImage({ src, alt, size, className = "", fallbackLabel }: AvatarImageProps) {
  const [hasError, setHasError] = useState(false);

  const showImage = Boolean(src && !hasError);
  const useUnoptimizedImage = typeof src === "string" && src.includes("/storage/v1/object/public/avatars/");

  return (
    <div className={`relative overflow-hidden rounded-full border border-slate-200 bg-slate-100 ${className}`}>
      {showImage ? (
        <Image
          key={src as string}
          src={src as string}
          alt={alt}
          fill
          sizes={`${size}px`}
          className="object-cover"
          unoptimized={useUnoptimizedImage}
          onError={() => setHasError(true)}
        />
      ) : fallbackLabel ? (
        <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-slate-700">
          {fallbackLabel.slice(0, 1).toUpperCase()}
        </div>
      ) : (
        <div className="flex h-full w-full items-center justify-center text-slate-500">
          <User className="h-5 w-5" />
        </div>
      )}
    </div>
  );
}
