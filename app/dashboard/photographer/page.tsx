"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface OutgoingBooking {
  id: string;
  modelId: string;
  modelName: string;
  modelAvatar: string;
  date: string;
  timeSlot: string;
  location: string;
  style: string;
  coopType: string;
  status: "pending" | "accepted" | "declined" | "completed";
  daysLeftToDeliver?: number;
  deliveryUrl?: string;
  contractSignedText?: string;
  modelReplyMessage?: string;
  hasReviewed?: boolean;
}

interface BlacklistedItem {
  id: string;
  name: string;
  reason: string;
  dateAdded: string;
}

export default function PhotographerDashboardPage() {
  const [activeTab, setActiveTab] = useState<"bookings" | "equipment" | "templates" | "blacklist">("bookings");

  // ==================== 1. 邀約追蹤列表與狀態 ====================
  const [bookings, setBookings] = useState<OutgoingBooking[]>([
    {
      id: "REQ-20261028-01",
      modelId: "hane",
      modelName: "羽晴 (Hane)",
      modelAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      date: "2026-10-28",
      timeSlot: "14:00 - 17:00",
      location: "台北市大稻埕迪化街",
      style: "日系膠卷復古時裝",
      coopType: "互惠創作 (TFCD)",
      status: "completed",
      daysLeftToDeliver: 10,
      deliveryUrl: "https://drive.google.com/drive/folders/sample",
      modelReplyMessage: "非常高興能與您合作！拍攝當天我會提早 10 分鐘抵達現場並自備基礎底妝！",
      contractSignedText: `【LuminaMatch 攝影合作電子存證協議書】
合約編號：REQ-20261028-01
甲方 (邀約攝影)：陳攝影 (Alan Chen)
乙方 (受約模特)：羽晴 (Hane)
約定時段：2026-10-28 14:00 - 17:00
拍攝地點：台北市大稻埕迪化街
合作性質：互惠創作 (TFCD)

【第一條：作品交付與肖像著作權】
1. 甲方應於拍攝結束後 14 日內交付至少 10 張精修高畫質成品予乙方。
2. 照片僅得作個人作品集展示之非商業用途，未經書面同意不得轉售或商用。

【第二條：放鳥 (No-Show) 與爽約賠償規範】
1. 攝影師未到：須補償模特車馬妝造損失 NT$ 1,500 元，扣信用分 30 分。
2. 模特未到：全額補償攝影師已預付棚費（實報實銷上限 NT$ 3,000 元），扣信用分 30 分。
3. 72 小時前免責取消；24 小時內臨時取消依賠償標準 50% 計算。`,
    },
    {
      id: "REQ-20261105-02",
      modelId: "mina",
      modelName: "米娜 (Mina)",
      modelAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
      date: "2026-11-05",
      timeSlot: "10:00 - 13:00",
      location: "新北市板橋區自然光攝影棚",
      style: "韓系簡約俐落型錄",
      coopType: "商業有酬",
      status: "pending",
    },
  ]);

  const [selectedBookingForContract, setSelectedBookingForContract] = useState<OutgoingBooking | null>(null);
  const [isCheckinModalOpen, setIsCheckinModalOpen] = useState(false);
  const [activeCheckinBooking, setActiveCheckinBooking] = useState<OutgoingBooking | null>(null);
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [activeDeliveryBooking, setActiveDeliveryBooking] = useState<OutgoingBooking | null>(null);
  const [inputDeliveryUrl, setInputDeliveryUrl] = useState("");

  // 評價模特彈窗狀態 (同行專屬)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewingBooking, setReviewingBooking] = useState<OutgoingBooking | null>(null);
  const [reviewTags, setReviewTags] = useState<string[]>(["極度守時", "自備底妝完整"]);
  const [reviewContent, setReviewContent] = useState("");

  // ==================== 2. 封面照片、個人檔案與 5 組社群連結 ====================
  const [coverPhoto, setCoverPhoto] = useState<string>(
    "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?auto=format&fit=crop&w=800&q=80"
  );
  const [coverFocusY, setCoverFocusY] = useState<number>(30);

  const [photographerProfile, setPhotographerProfile] = useState({
    name: "陳攝影 (Alan Chen)",
    city: "台北 / 新北",
    experienceYears: "5",
    cameras: "Sony A7M4、Sony A7C2 雙機身",
    lenses: "35mm F1.4 GM、85mm F1.4 GM、24-70mm F2.8",
    lightings: "Godox AD200 Pro、大型柔光罩反光板",
    deliveryCommitment: "拍攝結束後 14 日內保證交付 10~15 張風格精修調色，絕不拖件。",
    bio: "專注於日系膠卷微光感與韓系時裝人像，善於引導素人模特情緒與自然動態捕捉。現場備有女性助理梳化，拍攝過程秉持人身界線與相互尊重原則。",
    styles: ["日系膠卷清新", "俐落時裝街拍", "自然光人像寫真"],
  });

  // 5 組公開社群與外站作品連結
  const [socialLinks, setSocialLinks] = useState({
    instagram: "https://instagram.com/alan_photostudio",
    facebook: "https://facebook.com/alan.chen.visual",
    threads: "https://threads.net/@alan_photostudio",
    custom1Name: "個人作品官網",
    custom1Url: "https://alan-chen-photo.com",
    custom2Name: "Flickr 高畫質圖庫",
    custom2Url: "https://flickr.com/people/alan_chen",
  });

  // ==================== 3. 邀約預設提案範本 ====================
  const [proposalTemplate, setProposalTemplate] = useState({
    defaultCoopType: "互惠創作 (TFCD)",
    defaultStyle: "日系膠卷微光街拍",
    defaultLocation: "台北市大稻埕 / 赤峰街商圈",
    defaultProposalLetter: `您好！很欣賞您的作品風格與表現力，希望能與您預約合作拍攝！
預計拍攝風格為自然光街拍時裝，我會自備雙機身定焦鏡頭與反光板協助補光。
承諾拍攝後 14 天內提供 10~15 張風格精修調色，並嚴格遵守現場不接觸人身界線守則。歡迎隨時討論服裝搭配！`,
  });

  // ==================== 4. 雙向黑名單管理 ====================
  const [blacklist, setBlacklist] = useState<BlacklistedItem[]>([
    {
      id: "bl_1",
      name: "林** (測試對象)",
      reason: "無故壓線 2 小時前爽約，且失聯不回訊",
      dateAdded: "2026-08-14",
    },
  ]);
  const [newBlacklistName, setNewBlacklistName] = useState("");
  const [newBlacklistReason, setNewBlacklistReason] = useState("");

  // 跨頁讀取資料
  useEffect(() => {
    const saved = localStorage.getItem("lumina_photographer_profile_data");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.coverPhoto) setCoverPhoto(parsed.coverPhoto);
        if (parsed.coverFocusY !== undefined) setCoverFocusY(parsed.coverFocusY);
        if (parsed.photographerProfile) setPhotographerProfile(parsed.photographerProfile);
        if (parsed.socialLinks) setSocialLinks(parsed.socialLinks);
        if (parsed.proposalTemplate) setProposalTemplate(parsed.proposalTemplate);
        if (parsed.blacklist) setBlacklist(parsed.blacklist);
      } catch (e) {
        console.error("載入失敗", e);
      }
    }
  }, []);

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPhoto(reader.result as string);
        setCoverFocusY(30);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSave = {
      coverPhoto,
      coverFocusY,
      photographerProfile,
      socialLinks,
      proposalTemplate,
      blacklist,
    };
    localStorage.setItem("lumina_photographer_profile_data", JSON.stringify(dataToSave));
    alert("✅ 攝影師個人檔案、封面對焦點、設備資料與 5 組社群連結已成功儲存！");
  };

  const handleSaveTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSave = {
      coverPhoto,
      coverFocusY,
      photographerProfile,
      socialLinks,
      proposalTemplate,
      blacklist,
    };
    localStorage.setItem("lumina_photographer_profile_data", JSON.stringify(dataToSave));
    alert("✅ 邀約提案預設範本已儲存！日後向模特發起約拍時將自動全數帶入。");
  };

  const handleAddBlacklist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlacklistName.trim()) return;
    const item: BlacklistedItem = {
      id: `bl_${Date.now()}`,
      name: newBlacklistName.trim(),
      reason: newBlacklistReason.trim() || "多次遲到或未履約",
      dateAdded: new Date().toISOString().split("T")[0],
    };
    const updated = [...blacklist, item];
    setBlacklist(updated);
    setNewBlacklistName("");
    setNewBlacklistReason("");
    localStorage.setItem(
      "lumina_photographer_profile_data",
      JSON.stringify({ coverPhoto, coverFocusY, photographerProfile, socialLinks, proposalTemplate, blacklist: updated })
    );
    alert(`已將【${item.name}】加入黑名單。`);
  };

  const handleRemoveBlacklist = (id: string) => {
    const updated = blacklist.filter((b) => b.id !== id);
    setBlacklist(updated);
    localStorage.setItem(
      "lumina_photographer_profile_data",
      JSON.stringify({ coverPhoto, coverFocusY, photographerProfile, socialLinks, proposalTemplate, blacklist: updated })
    );
    alert("已解除該黑名單標記。");
  };

  const handleConfirmCheckin = () => {
    if (!activeCheckinBooking) return;
    setBookings((prev) =>
      prev.map((b) =>
        b.id === activeCheckinBooking.id ? { ...b, status: "completed", daysLeftToDeliver: 14 } : b
      )
    );
    setIsCheckinModalOpen(false);
    alert("🎉 現場雙向碰面核銷成功！已啟動 14 天交圖倒數計時！");
  };

  const handleSubmitDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDeliveryBooking || !inputDeliveryUrl.trim()) return;
    setBookings((prev) =>
      prev.map((b) =>
        b.id === activeDeliveryBooking.id ? { ...b, deliveryUrl: inputDeliveryUrl } : b
      )
    );
    setIsDeliveryModalOpen(false);
    setInputDeliveryUrl("");
    alert("✅ 已成功向模特提交雲端成品連結！");
  };

  const handleSubmitModelReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewingBooking || !reviewContent.trim()) return;

    const newPeerReview = {
      id: `review_${Date.now()}`,
      targetId: reviewingBooking.modelId,
      targetType: "model",
      authorRole: "photographer",
      authorName: `攝影師 ${photographerProfile.name.split(" ")[0]}（已官方驗證）`,
      date: new Date().toISOString().split("T")[0],
      tags: reviewTags,
      content: reviewContent.trim(),
      punctualityScore: 5.0,
    };

    const existing = localStorage.getItem("lumina_peer_reviews");
    const arr = existing ? JSON.parse(existing) : [];
    arr.push(newPeerReview);
    localStorage.setItem("lumina_peer_reviews", JSON.stringify(arr));

    setBookings((prev) =>
      prev.map((b) => (b.id === reviewingBooking.id ? { ...b, hasReviewed: true } : b))
    );

    setIsReviewModalOpen(false);
    setReviewContent("");
    alert("🎉 評價已成功發布！該評價僅對【攝影同業】公開，模特端完全無法查看，感謝您的信譽存證！");
  };

  return (
    <main className="min-h-[calc(100vh-65px)] bg-stone-100/70 px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* 後台標頭與分頁切換 */}
        <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-6 shadow-sm flex flex-wrap justify-between items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-stone-800">攝影師專業工作室後台</h2>
            <p className="text-xs text-stone-500 mt-1">
              管理約拍進度、調閱存證合約、封面配備、社群連結與預設邀約範本
            </p>
          </div>

          <div className="flex flex-wrap bg-[#edeae3]/80 p-1 rounded-xl border border-stone-300">
            <button
              onClick={() => setActiveTab("bookings")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === "bookings" ? "bg-white text-indigo-700 shadow-xs" : "text-stone-600 hover:text-stone-900"
              }`}
            >
              📥 約拍進度
            </button>
            <button
              onClick={() => setActiveTab("equipment")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === "equipment" ? "bg-white text-indigo-700 shadow-xs" : "text-stone-600 hover:text-stone-900"
              }`}
            >
              📷 封面配備與社群
            </button>
            <button
              onClick={() => setActiveTab("templates")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === "templates" ? "bg-white text-indigo-700 shadow-xs" : "text-stone-600 hover:text-stone-900"
              }`}
            >
              ⚙️ 邀約預設範本
            </button>
            <button
              onClick={() => setActiveTab("blacklist")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === "blacklist" ? "bg-white text-rose-700 shadow-xs" : "text-stone-600 hover:text-stone-900"
              }`}
            >
              🚫 雙向黑名單
            </button>
          </div>
        </div>

        {/* ==================== 分頁 1：約拍進度與合約存證 ==================== */}
        {activeTab === "bookings" && (
          <div className="space-y-4">
            <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-5 shadow-sm grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-stone-800">★ 4.9</div>
                <div className="text-[11px] text-stone-400">同業安全評分</div>
              </div>
              <div>
                <div className="text-lg font-bold text-emerald-700">98%</div>
                <div className="text-[11px] text-stone-400">履約完成率</div>
              </div>
              <div>
                <div className="text-lg font-bold text-stone-800">26 次</div>
                <div className="text-[11px] text-stone-400">已履約核銷</div>
              </div>
              <div>
                <div className="text-lg font-bold text-stone-800">0 次</div>
                <div className="text-[11px] text-stone-400">放鳥違約紀錄</div>
              </div>
            </div>

            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-6 shadow-sm space-y-4"
                >
                  <div className="flex flex-wrap justify-between items-start gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden border border-stone-300 bg-stone-200">
                        <img src={booking.modelAvatar} alt={booking.modelName} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/model/${booking.modelId}`}
                            className="font-bold text-stone-900 text-sm hover:text-indigo-600 hover:underline flex items-center gap-1"
                          >
                            <span>{booking.modelName}</span>
                            <span className="text-[10px] text-indigo-500">檢視主頁 ➔</span>
                          </Link>
                          <span className="text-[10px] text-stone-400 font-mono">{booking.id}</span>
                        </div>
                        <p className="text-xs text-stone-500 mt-0.5">
                          {booking.date} ｜ {booking.timeSlot} ｜ {booking.location}
                        </p>
                      </div>
                    </div>

                    <div>
                      {booking.status === "pending" && (
                        <span className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-300 text-xs font-bold rounded-full">
                          ● 等待模特審核回覆
                        </span>
                      )}
                      {booking.status === "accepted" && (
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold rounded-full">
                          ✓ 模特已同意並簽約
                        </span>
                      )}
                      {booking.status === "declined" && (
                        <span className="px-3 py-1 bg-stone-100 text-stone-500 border border-stone-300 text-xs font-bold rounded-full">
                          ✕ 模特已婉拒邀約
                        </span>
                      )}
                      {booking.status === "completed" && (
                        <span className="px-3 py-1 bg-indigo-50 text-indigo-800 border border-indigo-300 text-xs font-bold rounded-full">
                          ★ 現場已核銷 (接案完成)
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-[#f5f3ef] p-3.5 rounded-xl border border-stone-300/80 text-stone-700">
                    <p><strong>約定風格：</strong>{booking.style}</p>
                    <p><strong>合作類型：</strong>{booking.coopType}</p>
                    {booking.daysLeftToDeliver !== undefined && (
                      <p className="text-amber-800 font-bold">
                        ⏳ <strong>交圖剩餘時限：</strong>剩餘 {booking.daysLeftToDeliver} 天
                      </p>
                    )}
                    {booking.deliveryUrl && (
                      <p className="sm:col-span-2 text-indigo-700 font-bold">
                        📁 <strong>已交付成品連結：</strong>
                        <a href={booking.deliveryUrl} target="_blank" rel="noreferrer" className="underline ml-1">
                          點此開啟雲端相簿
                        </a>
                      </p>
                    )}
                  </div>

                  {booking.modelReplyMessage && (
                    <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-600">
                      <span className="font-bold text-stone-800">
                        {booking.status === "declined" ? "模特的婉拒回覆：" : "模特的回覆留言："}
                      </span>
                      <p className="mt-0.5 italic">「{booking.modelReplyMessage}」</p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 pt-1">
                    {booking.contractSignedText && (
                      <button
                        type="button"
                        onClick={() => setSelectedBookingForContract(booking)}
                        className="px-3.5 py-2 bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 rounded-xl text-xs font-bold transition"
                      >
                        📜 調閱存證合約
                      </button>
                    )}

                    {booking.status === "accepted" && (
                      <button
                        type="button"
                        onClick={() => {
                          setActiveCheckinBooking(booking);
                          setIsCheckinModalOpen(true);
                        }}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-2xs"
                      >
                        📱 現場掃碼核銷
                      </button>
                    )}

                    {(booking.status === "accepted" || booking.status === "completed") && (
                      <button
                        type="button"
                        onClick={() => {
                          setActiveDeliveryBooking(booking);
                          setIsDeliveryModalOpen(true);
                        }}
                        className="px-3.5 py-2 bg-stone-800 hover:bg-stone-900 text-white rounded-xl text-xs font-bold transition"
                      >
                        📤 回報交圖連結
                      </button>
                    )}

                    {booking.status === "completed" && (
                      <button
                        type="button"
                        disabled={booking.hasReviewed}
                        onClick={() => {
                          setReviewingBooking(booking);
                          setIsReviewModalOpen(true);
                        }}
                        className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-stone-300 text-white rounded-xl text-xs font-bold transition shadow-2xs flex items-center gap-1"
                      >
                        {booking.hasReviewed ? "✓ 已送出同行評價" : "✍️ 填寫同行評價 (僅攝影師可見)"}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== 分頁 2：封面照片、攝影配備與 5 組社群連結 ==================== */}
        {activeTab === "equipment" && (
          <form onSubmit={handleSaveProfile} className="space-y-6">
            {/* 1. 封面相片上傳與 1:1 對焦平移微調 */}
            <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="border-b border-stone-200 pb-2 flex justify-between items-center">
                <h3 className="text-sm font-bold text-stone-800">
                  攝影師個人封面照片與對焦點微調
                </h3>
                <span className="text-[11px] text-indigo-700 font-semibold bg-indigo-50 px-2 py-0.5 rounded">
                  ✦ 方框提示已啟用
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 items-center">
                <div className="flex flex-col items-center">
                  <div className="relative w-64 h-64 rounded-2xl overflow-hidden border-4 border-indigo-500/80 shadow-md bg-stone-900">
                    <img
                      src={coverPhoto}
                      alt="封面預覽"
                      style={{ objectPosition: `center ${coverFocusY}%` }}
                      className="w-full h-full object-cover transition-all duration-75"
                    />
                    <div className="absolute inset-0 pointer-events-none border border-white/40 flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-white/70 rounded-full flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                      </div>
                    </div>
                    <span className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-md text-white text-[10px] px-2 py-0.5 rounded font-mono">
                      個人主頁 1:1 呈現預覽
                    </span>
                  </div>
                </div>

                <div className="space-y-5 bg-[#f5f3ef] p-5 rounded-2xl border border-stone-300/80">
                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1">
                      上下平移對焦點 (垂直位置)：{coverFocusY}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={coverFocusY}
                      onChange={(e) => setCoverFocusY(Number(e.target.value))}
                      className="w-full accent-indigo-600 cursor-pointer h-2 bg-stone-300 rounded-lg"
                    />
                    <div className="flex justify-between text-[10px] text-stone-500 mt-1 font-semibold">
                      <span>上方 (0%)</span>
                      <span>中央 (50%)</span>
                      <span>下方 (100%)</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-stone-300">
                    <label className="inline-block cursor-pointer px-4 py-2.5 bg-stone-800 hover:bg-stone-900 text-white text-xs font-bold rounded-xl transition shadow-xs">
                      📁 更換個人形象封面照
                      <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
                    </label>
                    <p className="text-[11px] text-stone-400 mt-2">
                      支援上傳攝影個人肖像、招牌拍攝作品或工作室視覺照。
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. 基本資料與攝影設備 */}
            <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-stone-800 border-b border-stone-200 pb-2">
                個人基本資訊與設備清單
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">攝影師 / 工作室稱呼</label>
                  <input
                    type="text"
                    value={photographerProfile.name}
                    onChange={(e) => setPhotographerProfile({ ...photographerProfile, name: e.target.value })}
                    className="w-full text-sm bg-[#f5f3ef] text-stone-800 border border-stone-300 rounded-lg p-2.5 outline-none focus:border-indigo-500 focus:bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">主要接案城市</label>
                  <input
                    type="text"
                    value={photographerProfile.city}
                    onChange={(e) => setPhotographerProfile({ ...photographerProfile, city: e.target.value })}
                    className="w-full text-sm bg-[#f5f3ef] text-stone-800 border border-stone-300 rounded-lg p-2.5 outline-none focus:border-indigo-500 focus:bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">攝影年資 (年)</label>
                  <input
                    type="text"
                    value={photographerProfile.experienceYears}
                    onChange={(e) => setPhotographerProfile({ ...photographerProfile, experienceYears: e.target.value })}
                    className="w-full text-sm bg-[#f5f3ef] text-stone-800 border border-stone-300 rounded-lg p-2.5 outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">機身設備清單</label>
                  <input
                    type="text"
                    value={photographerProfile.cameras}
                    onChange={(e) => setPhotographerProfile({ ...photographerProfile, cameras: e.target.value })}
                    className="w-full text-sm bg-[#f5f3ef] text-stone-800 border border-stone-300 rounded-lg p-2.5 outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">常用鏡頭群</label>
                  <input
                    type="text"
                    value={photographerProfile.lenses}
                    onChange={(e) => setPhotographerProfile({ ...photographerProfile, lenses: e.target.value })}
                    className="w-full text-sm bg-[#f5f3ef] text-stone-800 border border-stone-300 rounded-lg p-2.5 outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">燈光與配件</label>
                  <input
                    type="text"
                    value={photographerProfile.lightings}
                    onChange={(e) => setPhotographerProfile({ ...photographerProfile, lightings: e.target.value })}
                    className="w-full text-sm bg-[#f5f3ef] text-stone-800 border border-stone-300 rounded-lg p-2.5 outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">交付成品履約承諾</label>
                  <textarea
                    rows={2}
                    value={photographerProfile.deliveryCommitment}
                    onChange={(e) => setPhotographerProfile({ ...photographerProfile, deliveryCommitment: e.target.value })}
                    className="w-full text-sm bg-[#f5f3ef] text-stone-800 border border-stone-300 rounded-lg p-2.5 outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">個人拍攝自介 (Bio)</label>
                  <textarea
                    rows={3}
                    value={photographerProfile.bio}
                    onChange={(e) => setPhotographerProfile({ ...photographerProfile, bio: e.target.value })}
                    className="w-full text-sm bg-[#f5f3ef] text-stone-800 border border-stone-300 rounded-lg p-2.5 outline-none focus:border-indigo-500 focus:bg-white leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* 3. 5 組公開社群與外站作品集連結 */}
            <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-stone-800 border-b border-stone-200 pb-2">
                公開社群與外站作品集連結 (最多 5 組)
              </h3>
              <div className="space-y-3 pt-1">
                <div className="flex items-center gap-3">
                  <span className="w-24 text-xs font-bold text-stone-700">📸 Instagram</span>
                  <input
                    type="url"
                    value={socialLinks.instagram}
                    onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })}
                    className="flex-1 text-xs bg-[#f5f3ef] text-stone-800 border border-stone-300 rounded-lg p-2 outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-24 text-xs font-bold text-stone-700">📘 Facebook</span>
                  <input
                    type="url"
                    value={socialLinks.facebook}
                    onChange={(e) => setSocialLinks({ ...socialLinks, facebook: e.target.value })}
                    className="flex-1 text-xs bg-[#f5f3ef] text-stone-800 border border-stone-300 rounded-lg p-2 outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-24 text-xs font-bold text-stone-700">🧵 Threads (脆)</span>
                  <input
                    type="url"
                    value={socialLinks.threads}
                    onChange={(e) => setSocialLinks({ ...socialLinks, threads: e.target.value })}
                    className="flex-1 text-xs bg-[#f5f3ef] text-stone-800 border border-stone-300 rounded-lg p-2 outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
                  <input
                    type="text"
                    value={socialLinks.custom1Name}
                    onChange={(e) => setSocialLinks({ ...socialLinks, custom1Name: e.target.value })}
                    placeholder="自訂標題 1"
                    className="w-32 text-xs font-bold bg-[#f5f3ef] text-stone-800 border border-stone-300 rounded-lg p-2 outline-none focus:border-indigo-500"
                  />
                  <input
                    type="url"
                    value={socialLinks.custom1Url}
                    onChange={(e) => setSocialLinks({ ...socialLinks, custom1Url: e.target.value })}
                    placeholder="https://..."
                    className="flex-1 text-xs bg-[#f5f3ef] text-stone-800 border border-stone-300 rounded-lg p-2 outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={socialLinks.custom2Name}
                    onChange={(e) => setSocialLinks({ ...socialLinks, custom2Name: e.target.value })}
                    placeholder="自訂標題 2"
                    className="w-32 text-xs font-bold bg-[#f5f3ef] text-stone-800 border border-stone-300 rounded-lg p-2 outline-none focus:border-indigo-500"
                  />
                  <input
                    type="url"
                    value={socialLinks.custom2Url}
                    onChange={(e) => setSocialLinks({ ...socialLinks, custom2Url: e.target.value })}
                    placeholder="https://..."
                    className="flex-1 text-xs bg-[#f5f3ef] text-stone-800 border border-stone-300 rounded-lg p-2 outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-xs transition"
              >
                儲存個人檔案、封面對焦與社群連結
              </button>
            </div>
          </form>
        )}

        {/* ==================== 分頁 3：發起邀約之預設範本設定 ==================== */}
        {activeTab === "templates" && (
          <form onSubmit={handleSaveTemplate} className="space-y-6">
            <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="border-b border-stone-200 pb-2">
                <h3 className="text-sm font-bold text-stone-800">
                  ⚙️ 攝影師約拍提案預設範本
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  在此設定您常用的約拍風格、地點與提案邀請信。日後向任何模特發起邀約時將自動全數帶入！
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">預設合作性質</label>
                  <select
                    value={proposalTemplate.defaultCoopType}
                    onChange={(e) => setProposalTemplate({ ...proposalTemplate, defaultCoopType: e.target.value })}
                    className="w-full text-sm bg-[#f5f3ef] text-stone-800 border border-stone-300 rounded-lg p-2.5 outline-none focus:border-indigo-500 focus:bg-white"
                  >
                    <option>互惠創作 (TFCD)</option>
                    <option>商業有酬</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">預設拍攝風格</label>
                  <input
                    type="text"
                    value={proposalTemplate.defaultStyle}
                    onChange={(e) => setProposalTemplate({ ...proposalTemplate, defaultStyle: e.target.value })}
                    className="w-full text-sm bg-[#f5f3ef] text-stone-800 border border-stone-300 rounded-lg p-2.5 outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">預設拍攝地點</label>
                  <input
                    type="text"
                    value={proposalTemplate.defaultLocation}
                    onChange={(e) => setProposalTemplate({ ...proposalTemplate, defaultLocation: e.target.value })}
                    className="w-full text-sm bg-[#f5f3ef] text-stone-800 border border-stone-300 rounded-lg p-2.5 outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  💬 預設約拍提案信內容 (發送給模特審核的文章)：
                </label>
                <textarea
                  rows={6}
                  value={proposalTemplate.defaultProposalLetter}
                  onChange={(e) => setProposalTemplate({ ...proposalTemplate, defaultProposalLetter: e.target.value })}
                  className="w-full text-xs bg-[#f5f3ef] text-stone-800 border border-stone-300 rounded-xl p-3 outline-none focus:border-indigo-500 focus:bg-white leading-relaxed font-medium"
                />
                <span className="text-[11px] text-stone-400 mt-1 block">
                  💡 建議於提案信中載明：預計交圖張數、是否自備助理/棚費承擔、人身界線尊重聲明。
                </span>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-xs transition"
              >
                儲存邀約提案預設範本
              </button>
            </div>
          </form>
        )}

        {/* ==================== 分頁 4：雙向黑名單管理 ==================== */}
        {activeTab === "blacklist" && (
          <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="border-b border-stone-200 pb-2">
              <h3 className="text-sm font-bold text-stone-800 flex items-center gap-1.5">
                🚫 攝影師個人黑名單封鎖清單
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                將慣性放鳥或嚴重遲到之模特加入個人清單，系統將在大廳中為您標註防範。
              </p>
            </div>

            <form onSubmit={handleAddBlacklist} className="bg-[#f5f3ef] p-4 rounded-xl border border-stone-300 space-y-3">
              <span className="text-xs font-bold text-stone-800 block">新增黑名單對象：</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  value={newBlacklistName}
                  onChange={(e) => setNewBlacklistName(e.target.value)}
                  placeholder="對象稱呼 / 帳號名稱"
                  className="text-xs bg-white text-stone-800 border border-stone-300 rounded-lg p-2.5 outline-none focus:border-indigo-500"
                />
                <input
                  type="text"
                  value={newBlacklistReason}
                  onChange={(e) => setNewBlacklistReason(e.target.value)}
                  placeholder="原因備註 (例：臨時爽約、未經溝通失聯)"
                  className="text-xs bg-white text-stone-800 border border-stone-300 rounded-lg p-2.5 outline-none focus:border-indigo-500"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold rounded-lg transition"
                >
                  加入黑名單
                </button>
              </div>
            </form>

            <div className="space-y-2">
              <span className="text-xs font-bold text-stone-700 block">目前已封鎖對象 ({blacklist.length})：</span>
              {blacklist.length === 0 ? (
                <p className="text-xs text-stone-400 py-3 text-center">目前無任何黑名單對象。</p>
              ) : (
                blacklist.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-white border border-stone-200 rounded-xl flex justify-between items-center text-xs"
                  >
                    <div>
                      <span className="font-bold text-stone-800">{item.name}</span>
                      <span className="text-stone-400 text-[10px] ml-2">加入日期：{item.dateAdded}</span>
                      <p className="text-rose-700 mt-0.5 text-[11px]">備註原因：{item.reason}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveBlacklist(item.id)}
                      className="px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-lg text-[11px] font-bold transition"
                    >
                      解除
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* 彈窗 1：調閱存證合約 */}
      {selectedBookingForContract && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#fbfaf8] rounded-2xl max-w-xl w-full p-6 shadow-xl border border-stone-200 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center pb-3 border-b border-stone-200">
              <div>
                <h3 className="font-bold text-stone-900 text-base">📜 電子存證合約檢視</h3>
                <p className="text-[11px] text-stone-400 mt-0.5">合約編號：{selectedBookingForContract.id}</p>
              </div>
              <button
                onClick={() => setSelectedBookingForContract(null)}
                className="text-stone-400 hover:text-stone-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>
            <div className="overflow-y-auto space-y-4 my-4 p-4 bg-white rounded-xl border border-stone-300 text-xs font-mono text-stone-800 leading-relaxed whitespace-pre-wrap">
              {selectedBookingForContract.contractSignedText}
            </div>
            <div className="pt-2 border-t border-stone-200 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedBookingForContract(null)}
                className="px-5 py-2.5 bg-stone-800 text-white rounded-xl text-xs font-bold transition"
              >
                關閉合約視窗
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 彈窗 2：現場掃碼核銷 */}
      {isCheckinModalOpen && activeCheckinBooking && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#fbfaf8] rounded-2xl max-w-sm w-full p-6 shadow-xl border border-stone-200 text-center">
            <h3 className="font-bold text-stone-900 text-base mb-1">現場實體碰面核銷</h3>
            <p className="text-xs text-stone-500 mb-4">與模特【{activeCheckinBooking.modelName}】確認已抵達現場</p>
            <div className="p-6 bg-stone-100 rounded-2xl border border-dashed border-indigo-400 mb-4 flex flex-col items-center justify-center">
              <div className="text-3xl mb-2">📸</div>
              <p className="text-xs font-bold text-indigo-700">準備啟動相機掃描</p>
              <p className="text-[10px] text-stone-400 mt-1">請掃描模特手機上出示的動態 QR Code 完成免責存證</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleConfirmCheckin}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition"
              >
                模擬掃碼成功 (碰面存證)
              </button>
              <button
                type="button"
                onClick={() => setIsCheckinModalOpen(false)}
                className="px-4 py-2.5 bg-stone-200 text-stone-700 font-bold rounded-xl text-xs"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 彈窗 3：回報雲端交圖連結 */}
      {isDeliveryModalOpen && activeDeliveryBooking && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#fbfaf8] rounded-2xl max-w-md w-full p-6 shadow-xl border border-stone-200">
            <h3 className="font-bold text-stone-900 text-base mb-1">回報成品交圖連結</h3>
            <p className="text-xs text-stone-500 mb-4">向模特【{activeDeliveryBooking.modelName}】交付精修成品相簿網址：</p>
            <form onSubmit={handleSubmitDelivery} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  雲端相簿網址 (Google Drive / Dropbox / Flickr 等)：
                </label>
                <input
                  type="url"
                  required
                  value={inputDeliveryUrl}
                  onChange={(e) => setInputDeliveryUrl(e.target.value)}
                  placeholder="https://drive.google.com/drive/folders/..."
                  className="w-full text-xs bg-white text-stone-800 border border-stone-300 rounded-xl p-2.5 outline-none focus:border-indigo-500"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition"
                >
                  確認送出交圖
                </button>
                <button
                  type="button"
                  onClick={() => setIsDeliveryModalOpen(false)}
                  className="px-4 py-2.5 bg-stone-200 text-stone-700 font-bold rounded-xl text-xs"
                >
                  取消
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 彈窗 4：評價模特 (限攝影同行可見) */}
      {isReviewModalOpen && reviewingBooking && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#fbfaf8] rounded-2xl max-w-md w-full p-6 shadow-xl border border-stone-200">
            <div className="flex justify-between items-center pb-2 border-b border-stone-200 mb-3">
              <h3 className="font-bold text-stone-900 text-base">
                ✍️ 撰寫攝影同行手札 (評價模特)
              </h3>
              <button onClick={() => setIsReviewModalOpen(false)} className="text-stone-400 font-bold">✕</button>
            </div>
            <p className="text-xs text-stone-500 mb-3">
              受評模特：<strong>{reviewingBooking.modelName}</strong>（此評價僅對<strong>【攝影同行】</strong>解鎖，模特完全無法查閱）
            </p>

            <form onSubmit={handleSubmitModelReview} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">同行專屬評價心得：</label>
                <textarea
                  rows={4}
                  required
                  value={reviewContent}
                  onChange={(e) => setReviewContent(e.target.value)}
                  placeholder="客觀描述對方的守時狀況、自備妝容完整度、表情肢體配合度或是否有溝通落差..."
                  className="w-full text-xs bg-white text-stone-800 border border-stone-300 rounded-xl p-2.5 outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition"
                >
                  確認發布同行評價
                </button>
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="px-4 py-2.5 bg-stone-200 text-stone-700 font-bold rounded-xl text-xs"
                >
                  取消
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}