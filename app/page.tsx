"use client";

import React, { useState } from "react";
import Link from "next/link";

// 僅保留一位標準測試模特
const MOCK_MODELS = [
  {
    id: "hane",
    name: "羽晴 (Hane)",
    city: "台北 / 新北",
    styles: ["日系清透", "時裝街拍", "復古底片"],
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    rating: 4.9,
    dealsCount: 38,
    coopType: "互惠 / 商案皆可",
    bio: "熱愛自然光與膠卷感人像，具備 3 年外拍接案經驗，準時守約。",
  },
];

// 僅保留一位標準測試攝影師
const MOCK_PHOTOGRAPHERS = [
  {
    id: "陳攝影 (Alan Chen)",
    name: "陳攝影 (Alan Chen)",
    city: "台北 / 新北",
    styles: ["日系膠卷清新", "俐落時裝街拍", "自然光寫真"],
    avatar: "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?auto=format&fit=crop&w=600&q=80",
    rating: 4.9,
    dealsCount: 26,
    coopType: "互惠 / 商案皆可",
    bio: "專注於日系膠卷微光感與韓系時裝人像，零接觸肢體引導，守約守時。",
  },
];

export default function HomePage() {
  const [activeRoleFilter, setActiveRoleFilter] = useState<"all" | "model" | "photographer">("all");

  return (
    <main className="min-h-[calc(100vh-65px)] bg-stone-100/70 px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* 測試環境導引橫幅 */}
        <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg">🧪</span>
              <h2 className="text-base font-bold text-stone-900">雙向功能測試沙盒（1 模特 ＋ 1 攝影）</h2>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              已收斂為單一模特【羽晴】與單一攝影師【陳攝影】，便於快速測試報價單審核、協作室與留言互通。
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              href="/dashboard/model"
              className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition shadow-2xs"
            >
              👩‍🦰 進入模特後台
            </Link>
            <Link
              href="/dashboard/photographer"
              className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition shadow-2xs"
            >
              📷 進入攝影後台
            </Link>
          </div>
        </div>

        {/* 探索分類過濾標籤 */}
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold text-stone-800 flex items-center gap-2">
            <span>🔍</span>
            <span>尋找合作夥伴</span>
          </h3>

          <div className="flex bg-[#edeae3] p-1 rounded-xl border border-stone-300 text-xs font-bold">
            <button
              onClick={() => setActiveRoleFilter("all")}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                activeRoleFilter === "all" ? "bg-white text-indigo-700 shadow-2xs" : "text-stone-600 hover:text-stone-900"
              }`}
            >
              全部 (2)
            </button>
            <button
              onClick={() => setActiveRoleFilter("model")}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                activeRoleFilter === "model" ? "bg-white text-indigo-700 shadow-2xs" : "text-stone-600 hover:text-stone-900"
              }`}
            >
              模特 (1)
            </button>
            <button
              onClick={() => setActiveRoleFilter("photographer")}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                activeRoleFilter === "photographer" ? "bg-white text-indigo-700 shadow-2xs" : "text-stone-600 hover:text-stone-900"
              }`}
            >
              攝影師 (1)
            </button>
          </div>
        </div>

        {/* 探索卡片網格 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* 1. 唯一模特卡片 */}
          {(activeRoleFilter === "all" || activeRoleFilter === "model") && (
            <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-5 shadow-sm space-y-4 hover:border-stone-300 transition">
              <div className="flex items-center gap-4">
                <img
                  src={MOCK_MODELS[0].avatar}
                  alt={MOCK_MODELS[0].name}
                  className="w-16 h-16 rounded-2xl object-cover border border-stone-300 shadow-2xs"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-stone-900">{MOCK_MODELS[0].name}</h4>
                    <span className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded text-[10px] font-bold">
                      認證模特
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">{MOCK_MODELS[0].city} ‧ ★ {MOCK_MODELS[0].rating}</p>
                </div>
              </div>

              <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                {MOCK_MODELS[0].bio}
              </p>

              <div className="flex flex-wrap gap-1.5">
                {MOCK_MODELS[0].styles.map((s) => (
                  <span key={s} className="px-2 py-0.5 bg-stone-100 text-stone-600 rounded text-[10px] font-bold">
                    #{s}
                  </span>
                ))}
              </div>

              <div className="pt-2 border-t border-stone-200 flex justify-between items-center">
                <span className="text-[11px] text-stone-500 font-bold">{MOCK_MODELS[0].coopType}</span>
                <Link
                  href={`/model/${encodeURIComponent(MOCK_MODELS[0].id)}`}
                  className="px-4 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition shadow-2xs"
                >
                  查看模特主頁 ➔
                </Link>
              </div>
            </div>
          )}

          {/* 2. 唯一攝影師卡片 */}
          {(activeRoleFilter === "all" || activeRoleFilter === "photographer") && (
            <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-5 shadow-sm space-y-4 hover:border-stone-300 transition">
              <div className="flex items-center gap-4">
                <img
                  src={MOCK_PHOTOGRAPHERS[0].avatar}
                  alt={MOCK_PHOTOGRAPHERS[0].name}
                  className="w-16 h-16 rounded-2xl object-cover border border-stone-300 shadow-2xs"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-stone-900">{MOCK_PHOTOGRAPHERS[0].name}</h4>
                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded text-[10px] font-bold">
                      認證攝影師
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">{MOCK_PHOTOGRAPHERS[0].city} ‧ ★ {MOCK_PHOTOGRAPHERS[0].rating}</p>
                </div>
              </div>

              <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                {MOCK_PHOTOGRAPHERS[0].bio}
              </p>

              <div className="flex flex-wrap gap-1.5">
                {MOCK_PHOTOGRAPHERS[0].styles.map((s) => (
                  <span key={s} className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-[10px] font-bold">
                    #{s}
                  </span>
                ))}
              </div>

              <div className="pt-2 border-t border-stone-200 flex justify-between items-center">
                <span className="text-[11px] text-stone-500 font-bold">{MOCK_PHOTOGRAPHERS[0].coopType}</span>
                <Link
                  href={`/photographer/${encodeURIComponent(MOCK_PHOTOGRAPHERS[0].id)}`}
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-2xs"
                >
                  查看攝影主頁 ➔
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}