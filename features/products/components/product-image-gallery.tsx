"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

interface ProductImageGalleryProps {
  images: string[];
  title: string;
}

export function ProductImageGallery({ images, title }: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const activeImage = images[activeIndex] ?? images[0] ?? "/window.svg";

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
        <div className="md:hidden">
          <div
            className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth"
            onScroll={(event) => {
              const target = event.currentTarget;
              const slideWidth = target.clientWidth || 1;
              const nextIndex = Math.round(target.scrollLeft / slideWidth);
              setActiveIndex(Math.max(0, Math.min(images.length - 1, nextIndex)));
            }}
          >
            {images.map((image, index) => (
              <div key={`${image}-${index}`} className="relative h-[420px] w-full flex-none snap-center">
                <Image src={image} alt={`${title} image ${index + 1}`} fill sizes="100vw" className="object-cover" priority={index === 0} />
              </div>
            ))}
          </div>
        </div>

        <div className="relative hidden md:block">
          <div className="group relative h-[560px] overflow-hidden">
            <Image
              src={activeImage}
              alt={title}
              fill
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover transition duration-500 group-hover:scale-110"
              priority
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/15 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
            <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-2 text-xs font-medium text-slate-700 shadow-sm backdrop-blur">
              <ZoomIn className="mr-2 inline-block h-3.5 w-3.5" />
              Hover to zoom
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {images.map((image, index) => (
          <button
            key={`${image}-${index}`}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`relative h-20 w-20 flex-none overflow-hidden rounded-2xl border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${activeIndex === index ? "border-blue-600 ring-1 ring-blue-600" : "border-slate-200"}`}
            aria-label={`View image ${index + 1}`}
            aria-pressed={activeIndex === index}
          >
            <Image src={image} alt={`${title} thumbnail ${index + 1}`} fill sizes="80px" className="object-cover" />
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between text-sm text-slate-500 md:hidden">
        <button
          type="button"
          onClick={() => setActiveIndex((current) => Math.max(0, current - 1))}
          className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-2 text-slate-700"
          aria-label="Previous image"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </button>
        <span>
          {activeIndex + 1} / {images.length}
        </span>
        <button
          type="button"
          onClick={() => setActiveIndex((current) => Math.min(images.length - 1, current + 1))}
          className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-2 text-slate-700"
          aria-label="Next image"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
