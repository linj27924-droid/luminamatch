"use client";

import React, { useState, useEffect } from "react";
import PhotographerProfileTab, { PhotographerSocialLinks } from "../../../components/dashboard-photographer/PhotographerProfileTab";
import ProposalTemplateTab from "../../../components/dashboard-photographer/ProposalTemplateTab";
import PhotographerReviewsTab, { PhotographerReceivedReview } from "../../../components/dashboard-photographer/PhotographerReviewsTab";
import PhotographerRateCardTab, { RateCardRequestItem, ModelRateCardResponseItem } from "../../../components/dashboard-photographer/PhotographerRateCardTab";

export default function PhotographerDashboardPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "rate_card" | "template" | "reviews">("profile");

  const [photographerProfile, setPhotographerProfile] = useState({
    name: "陳攝影 (Alan Chen)",
    city: "台北 / 新北",
    experienceYears: "5",
    deliveryDays: 14,
    deliveryMethod: "Google Drive 雲端連結",
    rawDeliveryPolicy: "all_jpg",
    coopModes: ["tfcd", "paid_model"],
    equipment: "Sony A7 系列 / 神牛外拍閃燈 / 柔光罩",
    safePromise: "零接觸肢體引導 / 備女性助理 / 歡迎親友陪同",
    bio: "熱愛日系膠卷復古與自然光人像，守時守信，嚴格遵守拍攝界線存證合約。",
    portfolioImages: [
      "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    ],
    coopMode: "互惠/商案皆可",
  });

  // 5 組公開社群連結狀態（直接對齊前台主頁）
  const [socialLinks, setSocialLinks] = useState<PhotographerSocialLinks>({
    instagram: "https://instagram.com/alan_photostudio",
    facebook: "https://facebook.com/alan.chen.visual",
    threads: "https://threads.net/@alan_photostudio",
    custom1Name: "個人作品官網",
    custom1Url: "https://alan-chen-photo.com",
    custom2Name: "Flickr 高畫質圖庫",
    custom2Url: "https://flickr.com/people/alan_chen",
  });

  const [styles, setStyles] = useState(["日系膠卷清新", "俐落時裝街拍", "自然光人像"]);
  const [newStyleInput, setNewStyleInput] = useState("");

  // 攝影師報價單圖片與設定
  const [rateCardImages, setRateCardImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1554415707-9e4466bfe03b?auto=format&fit=crop&w=800&q=80",
  ]);
  const [rateCardAccessMode, setRateCardAccessMode] = useState<"auto" | "require_approval">("require_approval");

  // 收到的索取清單
  const [incomingRequests, setIncomingRequests] = useState<RateCardRequestItem[]>([
    {
      id: "req_m1",
      applicantId: "hane",
      applicantName: "模特 羽晴 (Hane)",
      applicantRole: "model",
      requestTime: "2026-10-14 16:30",
      status: "pending",
    },
    {
      id: "req_c1",
      applicantName: "風格服飾品牌 (Flora Studio)",
      applicantRole: "client",
      requestTime: "2026-10-12 11:20",
      status: "approved",
      expiresLabel: "有效至 11/12",
    },
  ]);

  // 我向模特申請過的回應清單
  const [outgoingRequests, setOutgoingRequests] = useState<ModelRateCardResponseItem[]>([
    {
      id: "out_1",
      modelId: "hane",
      modelName: "羽晴 (Hane)",
      requestTime: "2026-10-13 14:00",
      status: "approved",
      expiresLabel: "剩餘 6 天",
    },
    {
      id: "out_2",
      modelId: "mina",
      modelName: "米娜 (Mina)",
      requestTime: "2026-10-14 09:15",
      status: "pending",
    },
  ]);

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
        if (parsed.photographerProfile) {
          setPhotographerProfile((prev) => ({
            ...prev,
            ...parsed.photographerProfile,
          }));
        }
        if (parsed.socialLinks) setSocialLinks(parsed.socialLinks);
        if (parsed.styles) setStyles(parsed.styles);
        if (parsed.proposalTemplate) setProposalTemplate(parsed.proposalTemplate);
        if (parsed.rateCardImages) setRateCardImages(parsed.rateCardImages);
        if (parsed.rateCardAccessMode) setRateCardAccessMode(parsed.rateCardAccessMode);
        if (parsed.incomingRequests) setIncomingRequests(parsed.incomingRequests);
        if (parsed.outgoingRequests) setOutgoingRequests(parsed.outgoingRequests);
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

  const saveAllData = (partial: any = {}) => {
    const dataToSave = {
      photographerProfile,
      socialLinks,
      styles,
      proposalTemplate,
      rateCardImages,
      rateCardAccessMode,
      incomingRequests,
      outgoingRequests,
      ...partial,
    };
    localStorage.setItem("lumina_photographer_profile_data", JSON.stringify(dataToSave));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    saveAllData({ photographerProfile, socialLinks });
    alert("✅ 攝影師檔案（含社群連結與代表作）已成功儲存！");
  };

  const handleSaveRateCardConfig = (e: React.FormEvent) => {
    e.preventDefault();
    saveAllData({});
    alert("✅ 攝影報價單與權限設定已成功儲存！");
  };

  const handleApproveRequest = (id: string, durationHours: number = 168) => {
    const days = Math.round(durationHours / 24);
    const updated = incomingRequests.map((r) =>
      r.id === id ? { ...r, status: "approved" as const, expiresLabel: `開放 ${days} 天` } : r
    );
    setIncomingRequests(updated);
    saveAllData({ incomingRequests: updated });
    alert(`✅ 已核准該索取請求（查閱時效：${days} 天）！`);
  };

  const handleDeclineRequest = (id: string) => {
    const updated = incomingRequests.map((r) =>
      r.id === id ? { ...r, status: "declined" as const } : r
    );
    setIncomingRequests(updated);
    saveAllData({ incomingRequests: updated });
  };

  const handleRevokeRequest = (id: string) => {
    const target = incomingRequests.find((r) => r.id === id);
    const confirmRevoke = window.confirm(`確定要收回「${target?.applicantName}」的報價單查閱授權嗎？對方將立即無法再查看。`);
    if (!confirmRevoke) return;

    const updated = incomingRequests.map((r) =>
      r.id === id ? { ...r, status: "declined" as const, expiresLabel: "授權已收回" } : r
    );
    setIncomingRequests(updated);
    saveAllData({ incomingRequests: updated });
    alert("🔒 已成功收回報價單查閱權限！");
  };

  const handleDeleteIncomingRequest = (id: string) => {
    const updated = incomingRequests.filter((r) => r.id !== id);
    setIncomingRequests(updated);
    saveAllData({ incomingRequests: updated });
  };

  const handleSaveProposalTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    saveAllData({});
    alert("✅ 預設約拍提案範本已儲存！");
  };

  const pendingIncomingCount = incomingRequests.filter((r) => r.status === "pending").length;

  return (
    <main className="min-h-[calc(100vh-65px)] bg-stone-100/70 px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* 後台標頭與分頁按鈕 */}
        <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-stone-800">攝影工作室後台</h2>
            <p className="text-xs text-stone-500 mt-1">
              管理個人檔案、商案報價單、約拍提案範本與同業信譽紀錄
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
              onClick={() => setActiveTab("rate_card")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === "rate_card"
                  ? "bg-white text-indigo-700 shadow-xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <span>💳 報價單管理</span>
              {pendingIncomingCount > 0 && (
                <span className="w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] flex items-center justify-center font-bold">
                  {pendingIncomingCount}
                </span>
              )}
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
            socialLinks={socialLinks}
            setSocialLinks={setSocialLinks}
            styles={styles}
            newStyleInput={newStyleInput}
            setNewStyleInput={setNewStyleInput}
            handleAddStyle={handleAddStyle}
            handleRemoveStyle={handleRemoveStyle}
            handleSaveProfile={handleSaveProfile}
          />
        )}

        {activeTab === "rate_card" && (
          <PhotographerRateCardTab
            rateCardImages={rateCardImages}
            setRateCardImages={setRateCardImages}
            accessMode={rateCardAccessMode}
            setAccessMode={setRateCardAccessMode}
            incomingRequests={incomingRequests}
            handleApproveRequest={handleApproveRequest}
            handleDeclineRequest={handleDeclineRequest}
            handleRevokeRequest={handleRevokeRequest}
            handleDeleteIncomingRequest={handleDeleteIncomingRequest}
            outgoingRequests={outgoingRequests}
            handleSaveRateCardConfig={handleSaveRateCardConfig}
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