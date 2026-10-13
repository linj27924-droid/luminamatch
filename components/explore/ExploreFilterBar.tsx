"use client";

import React from "react";

interface ExploreFilterBarProps {
  activeTab: "models" | "photographers";
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  modelHeightFilter: string;
  setModelHeightFilter: (v: string) => void;
  modelCoopFilter: string;
  setModelCoopFilter: (v: string) => void;
  photoCoopFilter: string;
  setPhotoCoopFilter: (v: string) => void;
  photoDeliveryFilter: string;
  setPhotoDeliveryFilter: (v: string) => void;
  resultCount: number;
}

export default function ExploreFilterBar({
  activeTab,
  searchTerm,
  setSearchTerm,
  modelHeightFilter,
  setModelHeightFilter,
  modelCoopFilter,
  setModelCoopFilter,
  photoCoopFilter,
  setPhotoCoopFilter,
  photoDeliveryFilter,
  setPhotoDeliveryFilter,
  resultCount,
}: ExploreFilterBarProps) {
  return (
    <div className="space-y-4">
      {/* 搜尋與篩選列容器 */}
      <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="relative">
          <span className="absolute inset-y-0 left-3 flex items-center text-stone-400 text-sm pointer-events-none">
            🔍
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={
              activeTab === "models"
                ? "搜尋模特姓名、接案城市、合作標籤 (例如：商業有酬、車馬費補貼) 或拍攝風格..."
                : "搜尋攝影師姓名、接案城市或擅長風格 (例如：底片、時裝、古風)..."
            }
            className="w-full pl-9 pr-4 py-2.5 bg-[#f5f3ef] text-stone-800 placeholder:text-stone-400 text-xs font-medium border border-stone-300 rounded-xl outline-none focus:border-indigo-500 focus:bg-white transition"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute inset-y-0 right-3 flex items-center text-xs font-bold text-stone-400 hover:text-stone-600 cursor-pointer"
            >
              ✕ 清除
            </button>
          )}
        </div>

        {/* 模特專屬條件篩選 */}
        {activeTab === "models" && (
          <div className="flex flex-wrap items-center gap-6 pt-1 border-t border-stone-200/70 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-stone-700">📏 身高區間：</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: "all", label: "全部身高" },
                  { id: "under_160", label: "160cm 以下" },
                  { id: "160_165", label: "160 ~ 165cm" },
                  { id: "166_170", label: "166 ~ 170cm" },
                  { id: "above_170", label: "170cm 以上" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setModelHeightFilter(item.id)}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition border cursor-pointer ${
                      modelHeightFilter === item.id
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-2xs"
                        : "bg-[#f5f3ef] text-stone-600 border-stone-300 hover:bg-[#edeae3]"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-stone-700">💰 合作模式：</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: "all", label: "全部模式" },
                  { id: "tfcd", label: "接受互惠 (TFCD)" },
                  { id: "commercial", label: "商業有酬" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setModelCoopFilter(item.id)}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition border cursor-pointer ${
                      modelCoopFilter === item.id
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-2xs"
                        : "bg-[#f5f3ef] text-stone-600 border-stone-300 hover:bg-[#edeae3]"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 攝影師專屬條件篩選 */}
        {activeTab === "photographers" && (
          <div className="flex flex-wrap items-center gap-6 pt-1 border-t border-stone-200/70 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-stone-700">💰 接案性質：</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: "all", label: "全部模式" },
                  { id: "tfcd", label: "接受互惠 (TFCD)" },
                  { id: "commercial", label: "商業接案" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPhotoCoopFilter(item.id)}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition border cursor-pointer ${
                      photoCoopFilter === item.id
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-2xs"
                        : "bg-[#f5f3ef] text-stone-600 border-stone-300 hover:bg-[#edeae3]"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-stone-700">⏳ 成品交圖承諾：</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: "all", label: "不限天數" },
                  { id: "fast_7", label: "7 天內急速交件" },
                  { id: "standard_14", label: "14 天內標準交件" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPhotoDeliveryFilter(item.id)}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition border cursor-pointer ${
                      photoDeliveryFilter === item.id
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-2xs"
                        : "bg-[#f5f3ef] text-stone-600 border-stone-300 hover:bg-[#edeae3]"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 搜尋結果筆數提示 */}
      <div className="flex justify-between items-center text-xs text-stone-500 px-1">
        <span>
          共找到 <strong>{resultCount}</strong> 位
          {activeTab === "models" ? "模特" : "攝影師"}
        </span>
        <span className="text-[11px] text-stone-400">
          ✦ 卡片圖片嚴格依照自訂 1:1 對焦點完整呈現
        </span>
      </div>
    </div>
  );
}