"use client";

import React from "react";

export interface BrandItem {
  id: string;
  name: string;
  industry: string;
  avatar: string;
  coverImage: string;
  bio: string;
  activeJobsCount: number;
  instagram?: string;
  website?: string;
  verifiedTaxId: boolean;
}

interface BrandCardProps {
  brand: BrandItem;
  onPropose: (brand: BrandItem) => void;
  currentUserRole: "model" | "photographer" | "client" | "guest";
}

export default function BrandCard({ brand, onPropose, currentUserRole }: BrandCardProps) {
  const isCreator = currentUserRole === "model" || currentUserRole === "photographer";

  return (
    <div className="bg-white border border-stone-200/90 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition flex flex-col justify-between">
      {/* 品牌封面與 Logo */}
      <div>
        <div className="h-28 w-full bg-stone-200 relative overflow-hidden">
          <img
            src={brand.coverImage}
            alt={brand.name}
            className="w-full h-full object-cover"
          />
          {brand.verifiedTaxId && (
            <span className="absolute top-2.5 right-2.5 bg-stone-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/20 flex items-center gap-1">
              <span>✓</span>
              <span>商工統編認證</span>
            </span>
          )}
        </div>

        <div className="p-4 space-y-3">
          <div className="flex items-center gap-3">
            <img
              src={brand.avatar}
              alt={brand.name}
              className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-2xs -mt-8 relative z-10 bg-white"
            />
            <div>
              <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                <span>{brand.name}</span>
              </h4>
              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.2 rounded">
                {brand.industry}
              </span>
            </div>
          </div>

          <p className="text-stone-600 text-xs leading-relaxed line-clamp-2">
            {brand.bio}
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-stone-500">
            {brand.instagram && (
              <a
                href={`https://instagram.com/${brand.instagram.replace("@", "")}`}
                target="_blank"
                rel="noreferrer"
                className="hover:text-indigo-600 transition"
              >
                📸 {brand.instagram}
              </a>
            )}
            {brand.activeJobsCount > 0 && (
              <span className="text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.2 rounded text-[10px]">
                📢 {brand.activeJobsCount} 件商案招募中
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 底部行動按鈕 */}
      <div className="p-4 pt-0 border-t border-stone-100 flex items-center justify-between mt-2">
        <span className="text-[11px] text-stone-400">
          {brand.activeJobsCount > 0 ? "歡迎主動洽談" : "長期接受風格自薦"}
        </span>

        {isCreator ? (
          <button
            type="button"
            onClick={() => onPropose(brand)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-2xs cursor-pointer flex items-center gap-1.5"
          >
            <span>💼</span>
            <span>向品牌主動提案</span>
          </button>
        ) : (
          <span className="text-[11px] text-stone-400">
            {currentUserRole === "client" ? "同業品牌" : "登入模特/攝影即可提案"}
          </span>
        )}
      </div>
    </div>
  );
}