"use client";

import React, { useState } from "react";

export interface HistoryProject {
  id: string;
  caseNumber: string;
  category: "invite" | "tfcd" | "commercial";
  title: string;
  partnerName: string;
  partnerRole: "model" | "photographer";
  shootDate: string;
  exactTime: string;
  exactLocation: string;
  payAmount: number;
  completedAt?: string;
  messagesCount?: number;
  outfitsCount?: number;
}

interface HistoryProjectsTabProps {
  projects: any[];
  userRole: "model" | "photographer";
}

export default function HistoryProjectsTab({
  projects,
  userRole,
}: HistoryProjectsTabProps) {
  const [selectedCategory, setSelectedCategory] = useState<"all" | "invite" | "tfcd" | "commercial">("all");
  const [copiedCaseNum, setCopiedCaseNum] = useState<string | null>(null);

  // 僅篩選已完成 (completed) 的專案
  const completedProjects = projects.filter((p) => p.status === "completed");

  const filtered = completedProjects.filter((p) => {
    if (selectedCategory === "all") return true;
    return p.category === selectedCategory;
  });

  const handleCopy = (caseNum: string) => {
    navigator.clipboard.writeText(caseNum).then(() => {
      setCopiedCaseNum(caseNum);
      setTimeout(() => setCopiedCaseNum(null), 1800);
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-stone-200 pb-3">
          <div>
            <h3 className="text-sm font-bold text-stone-800 flex items-center gap-2">
              <span>📜</span>
              <span>歷史邀約履約紀錄存證庫</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              收納所有已圓滿結案之約拍專案，完整留存金流、時間戳與合約履約佐證。
            </p>
          </div>

          <div className="flex bg-[#edeae3] p-1 rounded-xl border border-stone-300 text-xs font-bold">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                selectedCategory === "all" ? "bg-white text-indigo-700 shadow-2xs" : "text-stone-600 hover:text-stone-900"
              }`}
            >
              全部 ({completedProjects.length})
            </button>
            <button
              onClick={() => setSelectedCategory("invite")}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                selectedCategory === "invite" ? "bg-white text-indigo-700 shadow-2xs" : "text-stone-600 hover:text-stone-900"
              }`}
            >
              🎟️ 邀約
            </button>
            <button
              onClick={() => setSelectedCategory("tfcd")}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                selectedCategory === "tfcd" ? "bg-white text-indigo-700 shadow-2xs" : "text-stone-600 hover:text-stone-900"
              }`}
            >
              🤝 互惠
            </button>
            <button
              onClick={() => setSelectedCategory("commercial")}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                selectedCategory === "commercial" ? "bg-white text-indigo-700 shadow-2xs" : "text-stone-600 hover:text-stone-900"
              }`}
            >
              💼 商案
            </button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="p-12 text-center bg-[#f5f3ef] rounded-xl border border-dashed border-stone-300 space-y-2">
            <span className="text-3xl">📁</span>
            <p className="text-xs text-stone-500 font-medium">目前尚無已結案之歷史邀約專案。</p>
            <p className="text-[11px] text-stone-400">當進行中的協作專案於底部點擊「正式結案」後，將自動歸檔至此處。</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-3 hover:border-stone-300 transition"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2.5 border-b border-stone-100">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopy(item.caseNumber)}
                      className="px-2 py-0.5 bg-stone-900 text-amber-300 rounded text-[11px] font-mono font-bold flex items-center gap-1 cursor-pointer"
                      title="複製流水號"
                    >
                      <span>#{item.caseNumber}</span>
                      <span className="text-[10px] text-stone-300 ml-0.5">
                        {copiedCaseNum === item.caseNumber ? "✓" : "📋"}
                      </span>
                    </button>

                    <span className="text-sm font-bold text-stone-900">{item.title}</span>

                    <span className="px-2 py-0.5 bg-stone-100 text-stone-600 rounded text-[10px] font-bold">
                      合作對象：{userRole === "model" ? item.photographerName : item.modelName}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold">
                      ✓ 已圓滿結案
                    </span>
                    <span className="text-xs font-mono font-bold text-stone-800">
                      {item.category === "tfcd" ? "互惠合作" : `NT$ ${item.payAmount?.toLocaleString()}`}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-stone-600 bg-[#fbfaf8] p-3 rounded-xl border border-stone-200/80">
                  <div>
                    <span className="text-stone-400 block text-[10px]">約定拍攝時程</span>
                    <span className="font-medium text-stone-800">{item.exactTime}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">集合履約地點</span>
                    <span className="font-medium text-stone-800">{item.exactLocation}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">履約簽到核銷</span>
                    <span className="text-emerald-700 font-bold">
                      雙方均完成現場簽到存證
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}