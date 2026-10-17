"use client";

import React from "react";
import { JobPosting } from "../../types/job";

interface JobCardProps {
  job: JobPosting;
  onApply: (job: JobPosting) => void;
  currentUserRole: "model" | "photographer" | "client" | "guest";
}

const CATEGORY_LABELS: Record<string, string> = {
  apparel: "👗 服飾電商 / 型錄",
  commercial: "💼 商業形象 / 形象廣告",
  lookbook: "📖 品牌 Lookbook",
  short_video: "🎬 社群短影音動態",
};

export default function JobCard({ job, onApply, currentUserRole }: JobCardProps) {
  const isEligibleToApply = currentUserRole === "model" || currentUserRole === "photographer";

  return (
    <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-2xs hover:shadow-md transition space-y-4">
      {/* 標題與標籤 */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-stone-900 text-sm">{job.title}</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              {job.targetRole === "both" ? "攝影 + 模特" : job.targetRole === "model" ? "僅徵模特" : "僅徵攝影"}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-stone-100 text-stone-600 border border-stone-200">
              {CATEGORY_LABELS[job.category] || job.category}
            </span>
          </div>
          <p className="text-stone-500 text-[11px]">
            刊登時間：{job.createdAt} ｜ 目前應徵：<strong>{job.applicants.length} 人</strong>
          </p>
        </div>

        <div className="text-right sm:self-center">
          <span className="text-xs text-stone-500 block">專案總預算</span>
          <span className="text-sm font-black text-indigo-600 font-mono">{job.budget}</span>
        </div>
      </div>

      {/* 拍攝重點詳情 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-[#fbfaf8] p-3 rounded-xl border border-stone-200 text-xs">
        <div>📅 預計拍攝：<strong className="text-stone-800 font-mono">{job.shootDate}</strong></div>
        <div>📍 拍攝地點：<strong className="text-stone-800">{job.location}</strong></div>
        <div className="sm:col-span-2 text-stone-600 text-[11px] pt-1 border-t border-stone-200 leading-relaxed">
          {job.description}
        </div>
      </div>

      {/* 底部按鈕 */}
      <div className="flex justify-between items-center pt-1">
        <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
          <span>✓</span> 平台履約存證合約保障
        </span>

        {isEligibleToApply ? (
          <button
            type="button"
            onClick={() => onApply(job)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-2xs cursor-pointer flex items-center gap-1.5"
          >
            <span>🙋</span>
            <span>投遞提案應徵</span>
          </button>
        ) : (
          <span className="text-[11px] text-stone-400">
            {currentUserRole === "client" ? "業主身分不可投遞" : "請先以模特/攝影身分登入應徵"}
          </span>
        )}
      </div>
    </div>
  );
}