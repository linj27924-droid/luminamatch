"use client";

import React, { useState, useEffect, useMemo } from "react";

// 載入 4 個獨立零件 (同時提供別名與相對路徑確保編譯絕對成功)
import ExploreHeader from "../components/explore/ExploreHeader";
import ExploreFilterBar from "../components/explore/ExploreFilterBar";
import ModelCardGrid, { ModelCard } from "../components/explore/ModelCardGrid";
import PhotographerCardGrid, { PhotographerCard } from "../components/explore/PhotographerCardGrid";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"models" | "photographers">("models");
  const [searchTerm, setSearchTerm] = useState("");

  const [modelHeightFilter, setModelHeightFilter] = useState<string>("all");
  const [modelCoopFilter, setModelCoopFilter] = useState<string>("all");

  const [photoCoopFilter, setPhotoCoopFilter] = useState<string>("all");
  const [photoDeliveryFilter, setPhotoDeliveryFilter] = useState<string>("all");

  // 1. 模特資料庫
  const [models, setModels] = useState<ModelCard[]>([
    {
      id: "hane",
      name: "羽晴 (Hane)",
      city: "台北 / 新北",
      height: 165,
      weight: "48",
      hideWeight: false,
      experienceYears: "3",
      coopMode: "互惠/商案皆可",
      coopBadges: ["商業有酬", "互惠創作 (TFCD)"],
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
      experienceYears: "4",
      coopMode: "商業有酬",
      coopBadges: ["商業有酬", "車馬費補貼"],
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
      experienceYears: "2",
      coopMode: "互惠創作 (TFCD)",
      coopBadges: ["互惠創作 (TFCD)", "棚費平攤"],
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
      experienceYears: "5",
      coopMode: "商業有酬",
      coopBadges: ["商業有酬"],
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
      experienceYears: "1",
      coopMode: "互惠創作 (TFCD)",
      coopBadges: ["互惠創作 (TFCD)"],
      styles: ["日系JK", "膠卷日常", "戶外踏青"],
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
      focusY: 20,
      completionRate: "96%",
      completedCount: 11,
      rating: 4.7,
      companionPolicy: "可單獨前往",
    },
  ]);

  // 2. 攝影師資料庫
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
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
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
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
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

  // 跨頁即時同步讀取模特後台最新資料
  useEffect(() => {
    const syncModelData = () => {
      const savedModel = localStorage.getItem("lumina_model_profile_data");
      if (savedModel) {
        try {
          const parsed = JSON.parse(savedModel);
          setModels((prev) =>
            prev.map((m) => {
              if (m.id === "hane") {
                const h = parsed.modelProfile?.height ? Number(parsed.modelProfile.height) : m.height;

                let badges: string[] = [];
                if (parsed.modelProfile?.allCoopModes && parsed.modelProfile.allCoopModes.length > 0) {
                  badges = parsed.modelProfile.allCoopModes;
                } else if (parsed.modelProfile?.selectedCoopModes) {
                  badges = [...parsed.modelProfile.selectedCoopModes];
                  if (parsed.modelProfile.customCoop1) badges.push(parsed.modelProfile.customCoop1);
                  if (parsed.modelProfile.customCoop2) badges.push(parsed.modelProfile.customCoop2);
                } else {
                  badges = m.coopBadges;
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
                  experienceYears: parsed.modelProfile?.experienceYears || m.experienceYears || "3",
                  coopBadges: badges,
                };
              }
              return m;
            })
          );
        } catch (e) {
          console.error(e);
        }
      }
    };

    syncModelData();
    window.addEventListener("storage", syncModelData);
    return () => window.removeEventListener("storage", syncModelData);
  }, []);

  // 模特篩選計算
  const filteredModels = useMemo(() => {
    return models.filter((model) => {
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchesName = model.name.toLowerCase().includes(term);
        const matchesCity = model.city.toLowerCase().includes(term);
        const matchesStyle = model.styles.some((s) => s.toLowerCase().includes(term));
        const matchesCoop = model.coopBadges.some((b) => b.toLowerCase().includes(term));
        if (!matchesName && !matchesCity && !matchesStyle && !matchesCoop) return false;
      }
      if (modelHeightFilter !== "all") {
        if (modelHeightFilter === "under_160" && model.height >= 160) return false;
        if (modelHeightFilter === "160_165" && (model.height < 160 || model.height > 165)) return false;
        if (modelHeightFilter === "166_170" && (model.height < 166 || model.height > 170)) return false;
        if (modelHeightFilter === "above_170" && model.height <= 170) return false;
      }
      if (modelCoopFilter !== "all") {
        if (modelCoopFilter === "tfcd" && !model.coopBadges.some((b) => b.includes("互惠"))) return false;
        if (modelCoopFilter === "commercial" && !model.coopBadges.some((b) => b.includes("商業"))) return false;
      }
      return true;
    });
  }, [models, searchTerm, modelHeightFilter, modelCoopFilter]);

  // 攝影師篩選計算
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
        if (photoCoopFilter === "tfcd" && !photo.coopMode.includes("互惠")) return false;
        if (photoCoopFilter === "commercial" && !photo.coopMode.includes("商業")) return false;
      }
      if (photoDeliveryFilter !== "all") {
        if (photoDeliveryFilter === "fast_7" && photo.deliveryCommitmentDays > 7) return false;
        if (photoDeliveryFilter === "standard_14" && photo.deliveryCommitmentDays > 14) return false;
      }
      return true;
    });
  }, [photographers, searchTerm, photoCoopFilter, photoDeliveryFilter]);

  const currentResultCount =
    activeTab === "models" ? filteredModels.length : filteredPhotographers.length;

  return (
    <main className="min-h-[calc(100vh-65px)] bg-stone-100/70 px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* 零件 1：探索大廳頂部標題與身分切換按鈕 */}
        <ExploreHeader
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          modelsCount={models.length}
          photographersCount={photographers.length}
        />

        {/* 零件 2：搜尋列與各條件篩選按鈕 */}
        <ExploreFilterBar
          activeTab={activeTab}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          modelHeightFilter={modelHeightFilter}
          setModelHeightFilter={setModelHeightFilter}
          modelCoopFilter={modelCoopFilter}
          setModelCoopFilter={setModelCoopFilter}
          photoCoopFilter={photoCoopFilter}
          setPhotoCoopFilter={setPhotoCoopFilter}
          photoDeliveryFilter={photoDeliveryFilter}
          setPhotoDeliveryFilter={setPhotoDeliveryFilter}
          resultCount={currentResultCount}
        />

        {/* 零件 3：模特卡片網格 */}
        {activeTab === "models" && <ModelCardGrid models={filteredModels} />}

        {/* 零件 4：攝影師卡片網格 */}
        {activeTab === "photographers" && (
          <PhotographerCardGrid photographers={filteredPhotographers} />
        )}
      </div>
    </main>
  );
}