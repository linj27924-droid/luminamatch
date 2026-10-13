"use client";

import React from "react";

interface ExploreHeaderProps {
  activeTab: "models" | "photographers";
  setActiveTab: (tab: "models" | "photographers") => void;
  modelsCount: number;
  photographersCount: number;
}

export default function ExploreHeader({
  activeTab,
  setActiveTab,
  modelsCount,
  photographersCount,
}: ExploreHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h2 className="text-2xl font-bold text-stone-800 tracking-tight">探索接案人才大廳</h2>
        <p className="text-xs text-stone-500 mt-1">
          即時檢視 1:1 封面對焦作品、收費模式、安全守則與履約存證
        </p>
      </div>

      <div className="flex bg-[#edeae3]/80 p-1 rounded-xl border border-stone-300">
        <button
          type="button"
          onClick={() => setActiveTab("models")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
            activeTab === "models"
              ? "bg-white text-indigo-700 shadow-xs"
              : "text-stone-600 hover:text-stone-900"
          }`}
        >
          <span>👩‍🦰 尋找模特</span>
          <span className="text-[10px] bg-stone-200/80 text-stone-700 px-1.5 py-0.2 rounded-full">
            {modelsCount}
          </span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("photographers")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
            activeTab === "photographers"
              ? "bg-white text-indigo-700 shadow-xs"
              : "text-stone-600 hover:text-stone-900"
          }`}
        >
          <span>📸 尋找攝影師</span>
          <span className="text-[10px] bg-stone-200/80 text-stone-700 px-1.5 py-0.2 rounded-full">
            {photographersCount}
          </span>
        </button>
      </div>
    </div>
  );
}