// src/components/shared/ImageGallery.tsx
"use client";

import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface ImageGalleryProps {
  images: string[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (!images || images.length === 0) {
    return null;
  }

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setSelectedIndex(null);
    document.body.style.overflow = "auto";
  };

  const goToPrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + images.length) % images.length);
    }
  };

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % images.length);
    }
  };

  return (
    <>
      {/* 이미지 그리드 */}
      <div className="my-6">
        <h3 className="text-lg font-bold text-text-light dark:text-text-dark mb-4">
          첨부 이미지 ({images.length})
        </h3>
        <div
          className={`grid gap-3 ${
            images.length === 1
              ? "grid-cols-1"
              : images.length === 2
              ? "grid-cols-2"
              : "grid-cols-2 sm:grid-cols-3"
          }`}
        >
          {images.map((imageUrl, index) => (
            <button
              key={index}
              onClick={() => openLightbox(index)}
              className="relative aspect-square rounded-lg overflow-hidden border border-border-light dark:border-border-dark hover:opacity-90 transition-opacity group cursor-pointer"
            >
              <img
                src={imageUrl}
                alt={`첨부 이미지 ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 px-3 py-1 rounded-full text-sm">
                  확대
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 라이트박스 모달 */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          {/* 닫기 버튼 */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-colors z-10"
            aria-label="닫기"
          >
            <X className="w-6 h-6" />
          </button>

          {/* 이전 버튼 */}
          {images.length > 1 && (
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-colors z-10"
              aria-label="이전 이미지"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* 이미지 */}
          <div
            className="relative max-w-4xl max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[selectedIndex]}
              alt={`첨부 이미지 ${selectedIndex + 1}`}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
            {/* 이미지 카운터 */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm">
              {selectedIndex + 1} / {images.length}
            </div>
          </div>

          {/* 다음 버튼 */}
          {images.length > 1 && (
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-colors z-10"
              aria-label="다음 이미지"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>
      )}
    </>
  );
}
