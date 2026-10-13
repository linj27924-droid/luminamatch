"use client";

import React from "react";

export interface PhotographerReceivedReview {
  id: string;
  authorName: string;
  date: string;
  tags: string[];
  content: string;
  safetyRating: number;
}

interface PhotographerReviewsTabProps {
  reviews: PhotographerReceivedReview[];
}

export default function PhotographerReviewsTab({
  reviews,
}: PhotographerReviewsTabProps) {
  return (
    <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-6 shadow-sm space-y-4">
      <div className="border-b border-stone-200 pb-2">
        <div className="flex items-center gap-2">
          <span className="text-base">🛡️</span>
          <h3 className="text-sm font-bold text-stone-800">模特同行對您的信譽評價手札</h3>
        </div>
        <p className="text-xs text-stone-500 mt-0.5">
          由合作完成之模特所回饋的真實履約紀錄（包含人身界線守則、交圖準時度與現場溝通）。
        </p>
      </div>

      {reviews.length === 0 ? (
        <p className="text-xs text-stone-400 py-6 text-center bg-[#f5f3ef]/60 rounded-xl border border-dashed border-stone-300">
          目前尚無合作手札記錄。完成約拍履約後，模特即可為您留存信譽評價！
        </p>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="p-4 bg-white border border-stone-200 rounded-xl space-y-2 text-xs shadow-2xs"
            >
              <div className="flex justify-between items-center">
                <span className="font-bold text-stone-900">{r.authorName}</span>
                <span className="text-[10px] text-stone-400">{r.date}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {r.tags.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-[10px] font-bold"
                  >
                    #{t}
                  </span>
                ))}
              </div>
              <p className="text-stone-700 leading-relaxed bg-[#f5f3ef] p-2.5 rounded-lg border border-stone-200 font-medium">
                {r.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}