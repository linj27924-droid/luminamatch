"use client";

import React, { useState } from "react";

interface PortfolioSectionProps {
  portfolioImages: string[];
  modelName: string;
}

export default function PortfolioSection({
  portfolioImages,
  modelName,
}: PortfolioSectionProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const defaultPortfolio = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80",
  ];

  const photos = portfolioImages && portfolioImages.length > 0 ? portfolioImages : defaultPortfolio;

  return (
    <div className="bg-[#fbfaf8] dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 rounded-2xl p-6 shadow-sm space-y-4">
      <div className="flex justify-between items-center border-b border-stone-200 dark:border-stone-800 pb-3">
        <div>
          <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <span>📸</span>
            <span>{modelName} 的精選外拍作品相簿</span>
            <span className="text-[11px] font-normal text-stone-500 dark:text-stone-400">
              (共 {photos.length} / 9 張精選代表作)
            </span>
          </h3>
          <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
            點擊圖片可直接開啟全螢幕高解析度檢視，展示不同色調與風格表現力
          </p>
        </div>
        <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
          點擊可放大預覽
        </span>
      </div>

      {/* 九宮格瀑布流圖片網格 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {photos.slice(0, 9).map((img, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setSelectedPhoto(img)}
            className="group relative aspect-square rounded-xl overflow-hidden border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-800 shadow-2xs hover:shadow-md transition cursor-pointer"
          >
            <img
              src={img}
              alt={`${modelName} 作品 ${idx + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
              <span className="text-white text-xs font-bold bg-black/60 px-2.5 py-1 rounded-lg backdrop-blur-xs">
                🔍 檢視大圖
              </span>
            </div>
            <span className="absolute bottom-1.5 left-1.5 bg-black/60 text-white text-[9px] font-mono px-1.5 py-0.5 rounded">
              #{idx + 1}
            </span>
          </button>
        ))}
      </div>

      {/* 點擊放大檢視彈窗 */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xs flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="max-w-3xl max-h-[90vh] relative">
            <img
              src={selectedPhoto}
              alt="作品放大"
              className="w-full h-auto max-h-[90vh] object-contain rounded-2xl shadow-2xl"
            />
            <span className="absolute bottom-4 right-4 bg-black/70 text-white text-xs px-3 py-1.5 rounded-full font-medium">
              ✕ 點擊任意處關閉
            </span>
          </div>
        </div>
      )}
    </div>
  );
}