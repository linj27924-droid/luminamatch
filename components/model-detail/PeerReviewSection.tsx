"use client";

import React from "react";

export interface PeerReview {
  id: string;
  targetId: string;
  targetType: "photographer" | "model";
  authorRole: "model" | "photographer";
  authorName: string;
  date: string;
  tags: string[];
  content: string;
  punctualityScore: number;
}

interface PeerReviewSectionProps {
  currentUserRole: "model" | "photographer" | "guest";
  photographerReviews: PeerReview[];
}

export default function PeerReviewSection({
  currentUserRole,
  photographerReviews,
}: PeerReviewSectionProps) {
  return (
    <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-6 shadow-sm space-y-4">
      <div className="flex justify-between items-center border-b border-stone-200 pb-2">
        <div>
          <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
            <span>📸 攝影同業合作手札 (模特信譽備忘)</span>
            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-800 border border-indigo-200 rounded text-[10px] font-bold">
              限核驗攝影師瀏覽
            </span>
          </h3>
          <p className="text-[11px] text-stone-500 mt-0.5">
            包含妝容自備完整度、守時紀錄與現場溝通流暢度，僅對攝影同行開放。
          </p>
        </div>
        <span className="text-xs font-mono text-stone-500 font-bold">
          共 {photographerReviews.length} 則評價
        </span>
      </div>

      {currentUserRole !== "photographer" ? (
        <div className="p-8 text-center bg-[#f5f3ef] rounded-xl border border-dashed border-stone-300 space-y-2">
          <div className="text-2xl">🔒</div>
          <h4 className="text-xs font-bold text-stone-800">攝影同行手札加密保護中</h4>
          <p className="text-[11px] text-stone-600 leading-relaxed max-w-sm mx-auto font-medium">
            本區塊為攝影同行交流與信譽存證專區，僅對已登入且核驗身分為
            <strong>【攝影師】</strong>之會員開放。<br />
            當前登入身分：
            <strong className="text-indigo-700">
              {currentUserRole === "model" ? "👩‍🦰 模特" : "訪客"}
            </strong>
            ，您無法查閱同業備忘以確保交流公正性。
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {photographerReviews.map((r, idx) => (
            <div
              key={`${r.id}-${idx}`}
              className="p-4 bg-white border border-stone-200 rounded-xl space-y-2 text-xs"
            >
              <div className="flex justify-between items-center">
                <span className="font-bold text-stone-900">{r.authorName}</span>
                <span className="text-[10px] text-stone-500 font-medium">{r.date}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {r.tags.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 bg-emerald-50 text-emerald-900 rounded text-[10px] font-bold border border-emerald-200"
                  >
                    #{t}
                  </span>
                ))}
              </div>
              <p className="text-stone-800 leading-relaxed bg-[#fbfaf8] p-2.5 rounded-lg border border-stone-200 font-medium">
                {r.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}