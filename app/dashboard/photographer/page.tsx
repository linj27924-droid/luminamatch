"use client";

import React, { useState, useEffect } from "react";
import PhotographerProfileTab from "../../../components/dashboard-photographer/PhotographerProfileTab";
import ProposalTemplateTab from "../../../components/dashboard-photographer/ProposalTemplateTab";
import PhotographerReviewsTab, { PhotographerReceivedReview } from "../../../components/dashboard-photographer/PhotographerReviewsTab";

export default function PhotographerDashboardPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "template" | "reviews">("profile");

  const [photographerProfile, setPhotographerProfile] = useState({
    name: "陳攝影 (Alan Chen)",
    city: "台北 / 新北",
    experienceYears: "5",
    deliveryDays: 14,
    safePromise: "零接觸肢體引導 / 備女性助理",
    bio: "熱愛日系膠卷復古與自然光人像，守時守信，嚴格遵守拍攝界線存證合約。",
    coopMode: "互惠/商案皆可",
  });

  const [styles, setStyles] = useState(["日系膠卷清新", "俐落時裝街拍", "自然光人像"]);
  const [newStyleInput, setNewStyleInput] = useState("");

  const [proposalTemplate, setProposalTemplate] = useState({
    defaultStyle: "日系膠卷清新街拍",
    defaultLocation: "台北市大稻埕 / 迪化街周邊街拍",
    defaultCoopType: "互惠創作 (TFCD)",
    defaultProposalLetter: "您好！非常欣賞您的作品風格與表現力，希望能邀約合作一組日系膠卷人像！拍攝當天會自備反光板與定焦鏡頭，預計於拍攝後 14 日內交付 15 張高畫質精修調色成品，全程無任何肢體碰觸要求，期待您的回覆！",
  });

  const [reviews, setReviews] = useState<PhotographerReceivedReview[]>([
    {
      id: "pr_p_1",
      authorName: "模特 羽晴 (Hane)（已官方驗證）",
      date: "2026-10-01",
      tags: ["安全尊重", "守時不拖拉", "依約交圖"],
      content: "合作過程非常舒服！完全透過口頭動作走位引導，現場有女性助理協助整理髮絲，交圖迅速且色調非常棒！",
      safetyRating: 5.0,
    },
  ]);

  useEffect(() => {
    const saved = localStorage.getItem("lumina_photographer_profile_data");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.photographerProfile) setPhotographerProfile(parsed.photographerProfile);
        if (parsed.styles) setStyles(parsed.styles);
        if (parsed.proposalTemplate) setProposalTemplate(parsed.proposalTemplate);
      } catch (e) {
        console.error(e);
      }
    }

    const savedReviews = localStorage.getItem("lumina_peer_reviews");
    if (savedReviews) {
      try {
        const parsedR = JSON.parse(savedReviews);
        const filtered = parsedR.filter(
          (r: any) => r.targetType === "photographer" && r.targetId.includes("Alan Chen")
        );
        if (filtered.length > 0) {
          setReviews(filtered);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleAddStyle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStyleInput.trim()) return;
    if (!styles.includes(newStyleInput.trim())) setStyles([...styles, newStyleInput.trim()]);
    setNewStyleInput("");
  };

  const handleRemoveStyle = (tag: string) => setStyles(styles.filter((s) => s !== tag));

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSave = { photographerProfile, styles, proposalTemplate };
    localStorage.setItem("lumina_photographer_profile_data", JSON.stringify(dataToSave));

    const savedUser = localStorage.getItem("lumina_mock_user");
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        if (u.role === "photographer") {
          u.name = photographerProfile.name;
          localStorage.setItem("lumina_mock_user", JSON.stringify(u));
        }
      } catch (err) {
        console.error(err);
      }
    }

    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new Event("lumina_user_updated"));
    alert("✅ 攝影師基本資料已成功儲存！");
  };

  const handleSaveProposalTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSave = { photographerProfile, styles, proposalTemplate };
    localStorage.setItem("lumina_photographer_profile_data", JSON.stringify(dataToSave));
    alert("✅ 預設約拍提案範本已儲存！造訪模特個人主頁將自動帶入。");
  };

  return (
    <main className="min-h-[calc(100vh-65px)] bg-stone-100/70 px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* 後台標頭與分頁按鈕 (靠右對齊) */}
        <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-stone-800">攝影工作室後台</h2>
            <p className="text-xs text-stone-500 mt-1">
              管理交稿承諾、約拍提案範本與同業信譽紀錄
            </p>
          </div>

          <div className="flex flex-wrap bg-[#edeae3]/80 p-1 rounded-xl border border-stone-300">
            <button
              onClick={() => setActiveTab("profile")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === "profile"
                  ? "bg-white text-indigo-700 shadow-xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              📷 攝影師檔案
            </button>
            <button
              onClick={() => setActiveTab("template")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === "template"
                  ? "bg-white text-indigo-700 shadow-xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              📝 預設提案範本
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === "reviews"
                  ? "bg-white text-indigo-700 shadow-xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              🛡️ 模特評價手札
            </button>
          </div>
        </div>

        {/* 依分頁載入零件 */}
        {activeTab === "profile" && (
          <PhotographerProfileTab
            photographerProfile={photographerProfile}
            setPhotographerProfile={setPhotographerProfile}
            styles={styles}
            newStyleInput={newStyleInput}
            setNewStyleInput={setNewStyleInput}
            handleAddStyle={handleAddStyle}
            handleRemoveStyle={handleRemoveStyle}
            handleSaveProfile={handleSaveProfile}
          />
        )}

        {activeTab === "template" && (
          <ProposalTemplateTab
            proposalTemplate={proposalTemplate}
            setProposalTemplate={setProposalTemplate}
            handleSaveProposalTemplate={handleSaveProposalTemplate}
          />
        )}

        {activeTab === "reviews" && (
          <PhotographerReviewsTab reviews={reviews} />
        )}
      </div>
    </main>
  );
}