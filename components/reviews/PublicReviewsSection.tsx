"use client";

import React, { useState, useEffect } from "react";
import { ReviewItem } from "./ReviewsManagerTab";

interface PublicReviewsSectionProps {
  targetName: string;
}

export default function PublicReviewsSection({ targetName }: PublicReviewsSectionProps) {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("lumina_all_platform_reviews");
      if (saved) {
        const parsed: ReviewItem[] = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // 篩選屬於該對象的評價
          const matched = parsed.filter(
            (r) => r.targetName.includes(targetName) || targetName.includes(r.targetName)
          );
          setReviews(matched);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, [targetName]);

  const validReviews = reviews.filter((r) => r.disputeStatus !== "under_review");
  const averageRating =
    validReviews.length > 0
      ? (validReviews.reduce((sum, r) => sum + r.rating, 0) / validReviews.length).toFixed(1)
      : "5.0";

  return (
    <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-6 shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-stone-200 pb-3 gap-2">
        <div>
          <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
            <span>⭐</span>
            <span>外拍履約公開評價 ({reviews.length})</span>
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            所有評價均源自平台合約結案存證，杜絕匿名洗評與刷單。
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-stone-200 shadow-2xs">
          <span className="text-base text-amber-500 font-bold font-mono">★ {averageRating}</span>
          <span className="text-[11px] text-stone-500 font-medium">/ 5.0 總評分</span>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="p-10 text-center bg-[#f5f3ef] rounded-xl border border-dashed border-stone-300 text-xs text-stone-400">
          目前尚無履約評價，歡迎預約約拍成為第一位評價者！
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => {
            const isDisputed = r.disputeStatus === "under_review";

            return (
              <div
                key={r.id}
                className="p-4 bg-white border border-stone-200 rounded-xl space-y-2 text-xs shadow-2xs"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900">{r.authorName}</span>
                    <span className="font-mono text-[10px] bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded border border-stone-200">
                      已核銷履約
                    </span>
                    {!isDisputed && (
                      <span className="text-amber-500 font-bold font-mono">
                        {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-stone-400 font-mono">{r.submittedAt}</span>
                </div>

                {isDisputed ? (
                  <div className="p-3 bg-stone-100 border border-stone-300 rounded-lg text-stone-500 text-[11px] flex items-center gap-2 font-medium">
                    <span>⚠️</span>
                    <span>該評論涉爭議處理中，暫停計分與公開展示。</span>
                  </div>
                ) : (
                  <>
                    {r.publicTags && r.publicTags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {r.publicTags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-[10px] font-bold border border-indigo-200"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="text-stone-700 bg-[#fdfbf7] p-2.5 rounded-lg border border-stone-200 leading-relaxed font-medium">
                      {r.publicComment}
                    </p>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}