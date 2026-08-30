import { useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from '@/components/ui/image';
import { cn } from '@/lib/utils';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const safeImages = images.length > 0 ? images : ['/placeholder.png'];
  const total = safeImages.length;

  const goPrev = useCallback(() => {
    setActiveIndex(i => (i - 1 + total) % total);
  }, [total]);

  const goNext = useCallback(() => {
    setActiveIndex(i => (i + 1) % total);
  }, [total]);

  return (
    <div className="space-y-3">
      {/* 主图 */}
      <div className="relative aspect-square rounded-xl overflow-hidden bg-muted border border-border/50 group">
        <Image
          src={safeImages[activeIndex]}
          alt={`${productName} - ${activeIndex + 1}`}
          className="w-full h-full object-contain p-4 transition-opacity duration-300"
          sizes="(max-width: 768px) 100vw, 50vw"
        />

        {total > 1 && (
          <>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              onClick={goPrev}
              className="!absolute left-3 top-1/2 -translate-y-1/2 z-20 h-9 w-9 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Previous image"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              onClick={goNext}
              className="!absolute right-3 top-1/2 -translate-y-1/2 z-20 h-9 w-9 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Next image"
            >
              <ChevronRight className="size-4" />
            </Button>

            {/* 图片计数 */}
            <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/60 text-white text-xs font-medium backdrop-blur-sm">
              {activeIndex + 1} / {total}
            </div>
          </>
        )}
      </div>

      {/* 缩略图 */}
      {total > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-0.5 px-0.5">
          {safeImages.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={cn(
                'shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all bg-muted',
                activeIndex === i
                  ? 'border-primary ring-2 ring-primary/20'
                  : 'border-transparent hover:border-border'
              )}
              aria-label={`View image ${i + 1}`}
            >
              <Image
                src={img}
                alt={`${productName} thumbnail ${i + 1}`}
                className="w-full h-full object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
