"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";

interface ModelCard {
  id: string;
  name: string;
  city: string;
  height: number;
  weight?: string;
  hideWeight?: boolean;
  coopMode: "互惠創作 (TFCD)" | "商業有酬" | "互惠/商案皆可";
  styles: string[];
  avatar: string;
  focusY: number;
  completionRate: string;
  completedCount: number;
  rating: number;
  companionPolicy?: string;
}

interface PhotographerCard {
  id: string;
  name: string;
  city: string;
  coopMode: "互惠創作 (TFCD)" | "商業有酬" | "互惠/商案皆可";
  deliveryCommitmentDays: number; // 約定交圖天數 (例如 7 天或 14 天)
  styles: string[];
  avatar: string;
  focusY: number;
  completionRate: string;
  completedCount: number;
  rating: number;
  safePromise: string; // 安全守則承諾 (例: 肢體零接觸/備女性助理)
}

export default function HomePage() {
  // 切換找模特 vs 找攝影師
  const [activeTab, setActiveTab] = useState<"models" | "photographers">("models");

  // 搜尋關鍵字 (共用)
  const [searchTerm, setSearchTerm] = useState("");

  // 模特專屬篩選：身高區間 & 收費模式
  const [modelHeightFilter, setModelHeightFilter] = useState<string>("all");
  const [modelCoopFilter, setModelCoopFilter] = useState<string>("all");

  // 攝影師專屬篩選：收費模式 & 交圖天數
  const [photoCoopFilter, setPhotoCoopFilter] = useState<string>("all");
  const [photoDeliveryFilter, setPhotoDeliveryFilter] = useState<string>("all"); // all, fast_7, standard_14

  // ==================== 1. 模特資料庫 ====================
  const [models, setModels] = useState<ModelCard[]>([
    {
      id: "hane",
      name: "羽晴 (Hane)",
      city: "台北 / 新北",
      height: 165,
      weight: "48",
      hideWeight: false,
      coopMode: "互惠/商案皆可",
      styles: ["日系清新", "韓系時裝"],
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
      focusY: 20,
      completionRate: "98%",
      completedCount: 14,
      rating: 5.0,
      companionPolicy: "可攜伴 (親友同行)",
    },
    {
      id: "mina",
      name: "米娜 (Mina)",
      city: "台中 / 彰化",
      height: 168,
      weight: "50",
      hideWeight: true,
      coopMode: "商業有酬",
      styles: ["歐美街拍", "復古底片"],
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
      focusY: 25,
      completionRate: "100%",
      completedCount: 22,
      rating: 4.9,
      companionPolicy: "必攜伴 (親友全程陪同)",
    },
    {
      id: "yuki",
      name: "雪奈 (Yuki)",
      city: "高雄 / 台南",
      height: 158,
      weight: "44",
      hideWeight: false,
      coopMode: "互惠創作 (TFCD)",
      styles: ["日系清新", "古風漢服"],
      avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
      focusY: 15,
      completionRate: "95%",
      completedCount: 8,
      rating: 4.8,
      companionPolicy: "可單獨前往",
    },
    {
      id: "chloe",
      name: "克洛伊 (Chloe)",
      city: "台北市",
      height: 172,
      weight: "52",
      hideWeight: true,
      coopMode: "商業有酬",
      styles: ["歐美時尚", "時裝大片", "商業型錄"],
      avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
      focusY: 30,
      completionRate: "99%",
      completedCount: 35,
      rating: 4.9,
      companionPolicy: "可攜伴 (親友同行)",
    },
    {
      id: "ann",
      name: "安安 (Ann)",
      city: "桃園 / 新竹",
      height: 162,
      weight: "46",
      hideWeight: false,
      coopMode: "互惠創作 (TFCD)",
      styles: ["日系JK", "膠卷日常", "戶外踏青"],
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
      focusY: 20,
      completionRate: "96%",
      completedCount: 11,
      rating: 4.7,
      companionPolicy: "可單獨前往",
    },
  ]);

  // ==================== 2. 攝影師資料庫 (不含相機設備與品牌) ====================
  const [photographers, setPhotographers] = useState<PhotographerCard[]>([
    {
      id: "Alan Chen",
      name: "陳攝影 (Alan Chen)",
      city: "台北 / 新北",
      coopMode: "互惠/商案皆可",
      deliveryCommitmentDays: 14,
      styles: ["日系膠卷清新", "俐落時裝街拍", "自然光人像"],
      avatar: "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?auto=format&fit=crop&w=800&q=80",
      focusY: 30,
      completionRate: "98%",
      completedCount: 26,
      rating: 4.9,
      safePromise: "零接觸肢體引導 / 備女性助理",
    },
    {
      id: "Ray Studio",
      name: "林光影視覺 (Ray Studio)",
      city: "台北 / 新北 / 基隆",
      coopMode: "商業有酬",
      deliveryCommitmentDays: 7,
      styles: ["韓系俐落型錄", "棚拍光影", "商品形象照"],
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
      focusY: 25,
      completionRate: "100%",
      completedCount: 42,
      rating: 5.0,
      safePromise: "攝影棚公證拍攝 / 簽約保障",
    },
    {
      id: "Kidd Visual",
      name: "凱德 (Kidd Visual)",
      city: "台中 / 彰化",
      coopMode: "互惠創作 (TFCD)",
      deliveryCommitmentDays: 14,
      styles: ["美式復古", "街頭底片", "情緒人像"],
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
      focusY: 20,
      completionRate: "96%",
      completedCount: 18,
      rating: 4.8,
      safePromise: "戶外公開場合拍攝 / 可攜伴同行",
    },
    {
      id: "Light & Shadow",
      name: "初光影像 (Light & Shadow)",
      city: "台南 / 高雄",
      coopMode: "互惠/商案皆可",
      deliveryCommitmentDays: 7,
      styles: ["日系清新", "古風漢服", "午後自然光"],
      avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80",
      focusY: 20,
      completionRate: "97%",
      completedCount: 29,
      rating: 4.9,
      safePromise: "尊重人身界線 / 全程口頭引導",
    },
  ]);

  // 跨頁讀取已儲存之模特即時資料
  useEffect(() => {
    const savedModel = localStorage.getItem("lumina_model_profile_data");
    if (savedModel) {
      try {
        const parsed = JSON.parse(savedModel);
        setModels((prev) =>
          prev.map((m) => {
            if (m.id === "hane") {
              const h = parsed.modelProfile?.height ? Number(parsed.modelProfile.height) : m.height;
              let coop: ModelCard["coopMode"] = m.coopMode;
              if (parsed.modelProfile?.coopModes?.includes("商業") && parsed.modelProfile?.coopModes?.includes("互惠")) {
                coop = "互惠/商案皆可";
              } else if (parsed.modelProfile?.coopModes?.includes("商業")) {
                coop = "商業有酬";
              } else if (parsed.modelProfile?.coopModes?.includes("互惠")) {
                coop = "互惠創作 (TFCD)";
              }

              return {
                ...m,
                name: parsed.modelProfile?.name || m.name,
                city: parsed.modelProfile?.city || m.city,
                height: isNaN(h) ? m.height : h,
                avatar: parsed.coverPhoto || m.avatar,
                focusY: parsed.coverFocusY !== undefined ? parsed.coverFocusY : m.focusY,
                styles: parsed.styles || m.styles,
                companionPolicy: parsed.modelProfile?.companionPolicy || m.companionPolicy,
                hideWeight: parsed.modelProfile?.hideWeight ?? m.hideWeight,
                weight: parsed.modelProfile?.weight || m.weight,
                coopMode: coop,
              };
            }
            return m;
          })
        );
      } catch (e) {
        console.error(e);
      }
    }

    // 跨頁讀取攝影師後台自訂的即時資料
    const savedPhoto = localStorage.getItem("lumina_photographer_profile_data");
    if (savedPhoto) {
      try {
        const parsedP = JSON.parse(savedPhoto);
        setPhotographers((prev) =>
          prev.map((p) => {
            if (p.name.includes("Alan Chen") || p.id === "Alan Chen") {
              return {
                ...p,
                name: parsedP.photographerProfile?.name || p.name,
                city: parsedP.photographerProfile?.city || p.city,
                avatar: parsedP.coverPhoto || p.avatar,
                focusY: parsedP.coverFocusY !== undefined ? parsedP.coverFocusY : p.focusY,
                styles: parsedP.photographerProfile?.styles || p.styles,
              };
            }
            return p;
          })
        );
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // 模特篩選計算
  const filteredModels = useMemo(() => {
    return models.filter((model) => {
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchesName = model.name.toLowerCase().includes(term);
        const matchesCity = model.city.toLowerCase().includes(term);
        const matchesStyle = model.styles.some((s) => s.toLowerCase().includes(term));
        if (!matchesName && !matchesCity && !matchesStyle) return false;
      }
      if (modelHeightFilter !== "all") {
        if (modelHeightFilter === "under_160" && model.height >= 160) return false;
        if (modelHeightFilter === "160_165" && (model.height < 160 || model.height > 165)) return false;
        if (modelHeightFilter === "166_170" && (model.height < 166 || model.height > 170)) return false;
        if (modelHeightFilter === "above_170" && model.height <= 170) return false;
      }
      if (modelCoopFilter !== "all") {
        if (modelCoopFilter === "tfcd" && model.coopMode !== "互惠創作 (TFCD)" && model.coopMode !== "互惠/商案皆可") return false;
        if (modelCoopFilter === "commercial" && model.coopMode !== "商業有酬" && model.coopMode !== "互惠/商案皆可") return false;
      }
      return true;
    });
  }, [models, searchTerm, modelHeightFilter, modelCoopFilter]);

  // 攝影師篩選計算 (無設備篩選)
  const filteredPhotographers = useMemo(() => {
    return photographers.filter((photo) => {
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchesName = photo.name.toLowerCase().includes(term);
        const matchesCity = photo.city.toLowerCase().includes(term);
        const matchesStyle = photo.styles.some((s) => s.toLowerCase().includes(term));
        if (!matchesName && !matchesCity && !matchesStyle) return false;
      }
      if (photoCoopFilter !== "all") {
        if (photoCoopFilter === "tfcd" && photo.coopMode !== "互惠創作 (TFCD)" && photo.coopMode !== "互惠/商案皆可") return false;
        if (photoCoopFilter === "commercial" && photo.coopMode !== "商業有酬" && photo.coopMode !== "互惠/商案皆可") return false;
      }
      if (photoDeliveryFilter !== "all") {
        if (photoDeliveryFilter === "fast_7" && photo.deliveryCommitmentDays > 7) return false;
        if (photoDeliveryFilter === "standard_14" && photo.deliveryCommitmentDays > 14) return false;
      }
      return true;
    });
  }, [photographers, searchTerm, photoCoopFilter, photoDeliveryFilter]);

  return (
    <main className="min-h-[calc(100vh-65px)] bg-stone-100/70 px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* 頂部身分切換標籤 */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-stone-800 tracking-tight">探索接案人才大廳</h2>
            <p className="text-xs text-stone-500 mt-1">
              即時檢視 1:1 封面對焦作品、收費模式、安全守則與履約存證
            </p>
          </div>

          {/* 模特 vs 攝影師切換按鈕 */}
          <div className="flex bg-[#edeae3]/80 p-1 rounded-xl border border-stone-300">
            <button
              onClick={() => setActiveTab("models")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === "models"
                  ? "bg-white text-indigo-700 shadow-xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <span>👩‍🦰 尋找模特</span>
              <span className="text-[10px] bg-stone-200/80 text-stone-700 px-1.5 py-0.2 rounded-full">
                {models.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("photographers")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === "photographers"
                  ? "bg-white text-indigo-700 shadow-xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <span>📸 尋找攝影師</span>
              <span className="text-[10px] bg-stone-200/80 text-stone-700 px-1.5 py-0.2 rounded-full">
                {photographers.length}
              </span>
            </button>
          </div>
        </div>

        {/* ==================== 搜尋與多重篩選工具列 ==================== */}
        <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-5 shadow-sm space-y-4">
          {/* 共用關鍵字搜尋欄位 */}
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
                  ? "搜尋模特藝名、接案城市 (例如：台北、台中) 或拍攝風格 (例如：日系、時裝)..."
                  : "搜尋攝影師姓名、接案城市或擅長風格 (例如：底片、時裝、古風)..."
              }
              className="w-full pl-9 pr-4 py-2.5 bg-[#f5f3ef] text-stone-800 placeholder:text-stone-400 text-xs font-medium border border-stone-300 rounded-xl outline-none focus:border-indigo-500 focus:bg-white transition"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-3 flex items-center text-xs font-bold text-stone-400 hover:text-stone-600"
              >
                ✕ 清除
              </button>
            )}
          </div>

          {/* 模式 A：模特專屬條件列 (身高區間 + 收費模式) */}
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
                      className={`px-3 py-1.5 rounded-lg font-semibold transition border ${
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
                <span className="font-bold text-stone-700">💰 收費模式：</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: "all", label: "全部模式" },
                    { id: "tfcd", label: "互惠創作 (TFCD)" },
                    { id: "commercial", label: "商業有酬" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setModelCoopFilter(item.id)}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition border ${
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

              {(modelHeightFilter !== "all" || modelCoopFilter !== "all" || searchTerm) && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    setModelHeightFilter("all");
                    setModelCoopFilter("all");
                  }}
                  className="text-stone-400 hover:text-rose-600 underline text-[11px] font-bold ml-auto"
                >
                  ↺ 還原篩選
                </button>
              )}
            </div>
          )}

          {/* 模式 B：攝影師專屬條件列 (收費模式 + 交圖天數承諾，無任何相機設備) */}
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
                      className={`px-3 py-1.5 rounded-lg font-semibold transition border ${
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
                      className={`px-3 py-1.5 rounded-lg font-semibold transition border ${
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

              {(photoCoopFilter !== "all" || photoDeliveryFilter !== "all" || searchTerm) && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    setPhotoCoopFilter("all");
                    setPhotoDeliveryFilter("all");
                  }}
                  className="text-stone-400 hover:text-rose-600 underline text-[11px] font-bold ml-auto"
                >
                  ↺ 還原篩選
                </button>
              )}
            </div>
          )}
        </div>

        {/* 搜尋結果數量回饋 */}
        <div className="flex justify-between items-center text-xs text-stone-500 px-1">
          <span>
            共找到{" "}
            <strong>
              {activeTab === "models" ? filteredModels.length : filteredPhotographers.length}
            </strong>{" "}
            位{activeTab === "models" ? "模特" : "攝影師"}
          </span>
          <span className="text-[11px] text-stone-400">
            ✦ 卡片圖片嚴格依照自訂 1:1 對焦點完整呈現
          </span>
        </div>

        {/* ==================== A. 模特卡片網格 ==================== */}
        {activeTab === "models" && (
          filteredModels.length === 0 ? (
            <div className="bg-[#fbfaf8] border border-dashed border-stone-300 rounded-2xl p-12 text-center text-stone-400 space-y-2">
              <div className="text-3xl">🔍</div>
              <p className="text-sm font-bold text-stone-600">查無符合條件的模特</p>
              <p className="text-xs">請嘗試放寬身高區間、收費模式或調整關鍵字搜尋詞</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredModels.map((model) => (
                <Link
                  key={model.id}
                  href={`/model/${model.id}`}
                  className="group bg-[#fbfaf8] rounded-2xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col"
                >
                  <div className="w-full aspect-square overflow-hidden relative bg-stone-200">
                    <img
                      src={model.avatar}
                      alt={model.name}
                      style={{ objectPosition: `center ${model.focusY}%` }}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/65 backdrop-blur-md text-white rounded-md text-[10px] font-medium shadow-xs">
                      {model.companionPolicy || "可攜伴"}
                    </span>
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

                      <div className="mt-2.5 flex items-center gap-1.5">
                        <span className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded text-[10px] font-bold">
                          💰 {model.coopMode}
                        </span>
                        <span className="px-2 py-0.5 bg-stone-100 text-stone-600 rounded text-[10px] font-medium">
                          完成 {model.completedCount} 場
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mt-2.5">
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
          )
        )}

        {/* ==================== B. 攝影師卡片網格 (不含相機設備標籤) ==================== */}
        {activeTab === "photographers" && (
          filteredPhotographers.length === 0 ? (
            <div className="bg-[#fbfaf8] border border-dashed border-stone-300 rounded-2xl p-12 text-center text-stone-400 space-y-2">
              <div className="text-3xl">🔍</div>
              <p className="text-sm font-bold text-stone-600">查無符合條件的攝影師</p>
              <p className="text-xs">請嘗試放寬接案性質、交圖天數或調整關鍵字搜尋詞</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredPhotographers.map((photo) => (
                <Link
                  key={photo.id}
                  href={`/photographer/${encodeURIComponent(photo.name)}`}
                  className="group bg-[#fbfaf8] rounded-2xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col"
                >
                  {/* 1:1 正方形攝影代表作封面 */}
                  <div className="w-full aspect-square overflow-hidden relative bg-stone-200">
                    <img
                      src={photo.avatar}
                      alt={photo.name}
                      style={{ objectPosition: `center ${photo.focusY}%` }}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    {/* 安全守則承諾徽章 */}
                    <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/65 backdrop-blur-md text-white rounded-md text-[10px] font-medium shadow-xs">
                      🛡️ {photo.safePromise}
                    </span>
                    {/* 履約率徽章 */}
                    <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/65 backdrop-blur-md text-white rounded-md text-[10px] font-medium shadow-xs">
                      履約率 {photo.completionRate}
                    </span>
                  </div>

                  {/* 卡片內容 */}
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
                        <span className="px-2 py-0.5 bg-stone-100 text-stone-600 rounded text-[10px] font-medium">
                          已履約 {photo.completedCount} 場
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mt-2.5">
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
          )
        )}
      </div>
    </main>
  );
}