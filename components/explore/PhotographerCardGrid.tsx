"use client";

import React from "react";
import Link from "next/link";

export interface PhotographerCard {
  id: string;
  name: string;
  city: string;
  coopMode: string;
  deliveryCommitmentDays: number;
  styles: string[];
  avatar: string;
  focusY: number;
  completionRate: string;
  completedCount: number;
  rating: number;
  safePromise: string;
}

interface PhotographerCardGridProps {
  photographers: PhotographerCard[];
}

export default function PhotographerCardGrid({
  photographers,
}: PhotographerCardGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {photographers.map((photo) => (
        <Link
          key={photo.id}
          href={`/photographer/${encodeURIComponent(photo.name)}`}
          className="group bg-[#fbfaf8] rounded-2xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col"
        >
          <div className="w-full aspect-square overflow-hidden relative bg-stone-200">
            <img
              src={photo.avatar}
              alt={photo.name}
              style={{ objectPosition: `center ${photo.focusY}%` }}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            />
            <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/65 backdrop-blur-md text-white rounded-md text-[10px] font-medium shadow-xs">
              🛡️ {photo.safePromise}
            </span>
            <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/65 backdrop-blur-md text-white rounded-md text-[10px] font-medium shadow-xs">
              履約率 {photo.completionRate}
            </span>
          </div>

          <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-stone-800 text-base">{photo.name}</h3>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                  ⏳ 承諾 {photo.deliveryCommitmentDays} 天交圖
                </span>
              </div>

              <p className="text-xs text-stone-400 mt-0.5">{photo.city}</p>

              <div className="mt-2.5 flex items-center gap-1.5">
                <span className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded text-[10px] font-bold">
                  💰 {photo.coopMode}
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-2">
                {photo.styles.map((s) => (
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
              <span className="text-amber-500 font-bold">★ {photo.rating.toFixed(1)}</span>
              <span className="text-indigo-600 font-bold group-hover:translate-x-0.5 transition flex items-center gap-1">
                檢視檔案與評價 ➔
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}