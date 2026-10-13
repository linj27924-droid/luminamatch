"use client";

import React from "react";
import Link from "next/link";

export interface ModelCard {
  id: string;
  name: string;
  city: string;
  height: number;
  weight?: string;
  hideWeight?: boolean;
  experienceYears?: string;
  coopMode: string;
  coopBadges: string[];
  styles: string[];
  avatar: string;
  focusY: number;
  completionRate: string;
  completedCount: number;
  rating: number;
  companionPolicy?: string;
}

interface ModelCardGridProps {
  models: ModelCard[];
}

export default function ModelCardGrid({ models }: ModelCardGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {models.map((model) => (
        <Link
          key={model.id}
          href={`/model/${model.id}`}
          className="group bg-[#fbfaf8] rounded-2xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col"
        >
          {/* 1:1 封面容器 */}
          <div className="w-full aspect-square overflow-hidden relative bg-stone-200">
            <img
              src={model.avatar}
              alt={model.name}
              style={{ objectPosition: `center ${model.focusY}%` }}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            />
            {/* 左上角：攜伴政策 */}
            <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/65 backdrop-blur-md text-white rounded-md text-[10px] font-medium shadow-xs">
              {model.companionPolicy || "可攜伴"}
            </span>

            {/* 右上角：接案年資標籤 */}
            <span className="absolute top-2 right-2 px-2 py-0.5 bg-indigo-600/85 backdrop-blur-md text-white rounded-md text-[10px] font-bold shadow-xs">
              資歷 {model.experienceYears || "3"} 年
            </span>

            {/* 右下角：履約率 */}
            <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/65 backdrop-blur-md text-white rounded-md text-[10px] font-medium shadow-xs">
              履約率 {model.completionRate}
            </span>
          </div>

          <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-stone-800 text-base">{model.name}</h3>
                <div className="text-right text-[11px] text-stone-500 font-medium">
                  <span className="font-bold text-stone-700">{model.height} cm</span>
                  <span className="mx-1">/</span>
                  <span>{model.hideWeight ? "🔒 保密" : `${model.weight} kg`}</span>
                </div>
              </div>

              <p className="text-xs text-stone-400 mt-0.5">{model.city}</p>

              {/* 接案合作模式標籤（含自訂標籤） */}
              <div className="mt-2.5 flex flex-wrap gap-1">
                {model.coopBadges.map((badge) => (
                  <span
                    key={badge}
                    className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded text-[10px] font-bold"
                  >
                    💰 {badge}
                  </span>
                ))}
              </div>

              {/* 風格標籤 */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {model.styles.map((s) => (
                  <span
                    key={s}
                    className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-[10px] font-semibold border border-indigo-100"
                  >
                    #{s}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-stone-200 flex justify-between items-center text-xs text-stone-500">
              <span className="text-amber-500 font-bold">★ {model.rating.toFixed(1)}</span>
              <span className="text-indigo-600 font-bold group-hover:translate-x-0.5 transition flex items-center gap-1">
                查看日曆與約拍 ➔
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}