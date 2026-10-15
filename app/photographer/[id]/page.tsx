"use client";

import React, { useState, useEffect, use, Suspense } from "react";
import { useRouter } from "next/navigation";
import PhotographerPublicSchedule from "../../../components/photographer-profile/PhotographerPublicSchedule";
import PublicReviewsSection from "../../../components/reviews/PublicReviewsSection";

interface PeerReview {
  id: string;
  targetId: string;
  targetType: "photographer" | "model";
  authorRole: "model" | "photographer";
  authorName: string;
  date: string;
  tags: string[];
  content: string;
  safetyRating: number;
}

const DEFAULT_REVIEWS: PeerReview[] = [
  {
    id: "pr_1",
    targetId: "陳攝影 (Alan Chen)",
    targetType: "photographer",
    authorRole: "model",
    authorName: "模特 K***（已官方驗證）",
    date: "2026-09-20",
    tags: ["安全尊重", "守時不拖拉", "依約10天內交圖"],
    content: "這位老師引導動作非常專業，全程只用口頭示範，完全沒有任何肢體碰觸，現場還有準備飲水與女性助理，非常安心！成品交稿迅速且調色很乾淨，極力推薦給新手模特！",
    safetyRating: 5.0,
  },
  {
    id: "pr_2",
    targetId: "陳攝影 (Alan Chen)",
    targetType: "photographer",
    authorRole: "model",
    authorName: "模特 A***（已官方驗證）",
    date: "2026-08-15",
    tags: ["現場氣氛佳", "自備反光板道具"],
    content: "大稻埕外拍合作非常順利，即使人多也很注意保護模特安全隱私。14 天內精修交付 15 張，履約誠信滿分。",
    safetyRating: 5.0,
  },
];

const COOP_MODE_LABELS: Record<string, string> = {
  tfcd: "🤝 互惠創作 (TFCD)",
  paid_model: "💵 付費聘請模特",
  commercial: "💼 商業 / 品牌委託案",
  studio_share: "🏛️ 攝影棚 / 門票費用平分",
};

const RAW_POLICY_LABELS: Record<string, string> = {
  all_jpg: "全數交付過濾後毛片 (JPG)",
  select_only: "僅供線上挑選，不全給毛片",
  no_raw: "僅給予約定精修張數 (毛片不外流)",
};

const DEFAULT_PORTFOLIO = [
  "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80",
];

function PhotographerProfileContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const photographerId = decodeURIComponent(resolvedParams.id);

  const [currentUserRole, setCurrentUserRole] = useState<"model" | "photographer" | "guest">("model");
  const [currentUserName, setCurrentUserName] = useState("羽晴 (Hane)");

  const [coverPhoto, setCoverPhoto] = useState(
    "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?auto=format&fit=crop&w=800&q=80"
  );
  const [coverFocusY, setCoverFocusY] = useState(30);

  const [photographerInfo, setPhotographerInfo] = useState({
    name: photographerId,
    city: "台北 / 新北",
    experienceYears: "5",
    bio: "專注於日系膠卷微光感與韓系時裝人像，善於引導素人模特情緒與自然動態捕捉。現場備有女性助理梳化，拍攝過程秉持人身界線與相互尊重原則。",
    deliveryCommitment: "拍攝結束後 14 日內保證交付 10~15 張風格精修調色，絕不拖件。",
    deliveryDays: 14,
    deliveryMethod: "Google Drive 雲端連結",
    rawDeliveryPolicy: "all_jpg",
    coopModes: ["tfcd", "paid_model"],
    equipment: "Sony A7 系列 / 神牛外拍閃燈 / 柔光罩",
    safePromise: "零肢體接觸口頭引導 / 歡迎親友同行 / 女性助理隨行",
    styles: ["日系膠卷清新", "俐落時裝街拍", "自然光人像寫真"],
    portfolioImages: DEFAULT_PORTFOLIO,
  });

  const [scheduleData, setScheduleData] = useState<
    Record<string, { status: "available" | "busy" | "off"; note?: string }>
  >({
    "2026-10-18": { status: "busy", note: "大稻埕外拍" },
    "2026-10-24": { status: "busy", note: "秋季時裝" },
    "2026-10-30": { status: "busy", note: "商案型錄" },
  });

  const [selectedScheduleDate, setSelectedScheduleDate] = useState<string | null>(null);

  const [rateCardImages, setRateCardImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1554415707-9e4466bfe03b?auto=format&fit=crop&w=800&q=80",
  ]);
  const [rateCardAccessMode, setRateCardAccessMode] = useState<"auto" | "require_approval">("require_approval");
  const [isRateCardModalOpen, setIsRateCardModalOpen] = useState(false);
  const [incomingRequests, setIncomingRequests] = useState<any[]>([]);

  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const [socialLinks, setSocialLinks] = useState({
    instagram: "https://instagram.com/alan_photostudio",
    facebook: "https://facebook.com/alan.chen.visual",
    threads: "https://threads.net/@alan_photostudio",
    custom1Name: "個人作品官網",
    custom1Url: "https://alan-chen-photo.com",
    custom2Name: "Flickr 高畫質圖庫",
    custom2Url: "https://flickr.com/people/alan_chen",
  });

  const [reviews, setReviews] = useState<PeerReview[]>(DEFAULT_REVIEWS);

  useEffect(() => {
    const savedUser = localStorage.getItem("lumina_mock_user");
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        setCurrentUserRole(u.role || "model");
        if (u.name) setCurrentUserName(u.name);
      } catch (e) {
        console.error(e);
      }
    }

    const savedProfile = localStorage.getItem("lumina_photographer_profile_data");
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        if (parsed.coverPhoto) setCoverPhoto(parsed.coverPhoto);
        if (parsed.coverFocusY !== undefined) setCoverFocusY(parsed.coverFocusY);
        if (parsed.photographerProfile) {
          const p = parsed.photographerProfile;
          setPhotographerInfo({
            name: p.name || photographerId,
            city: p.city || "台北 / 新北",
            experienceYears: p.experienceYears || "5",
            bio: p.bio || "",
            deliveryCommitment: p.deliveryDays ? `拍攝結束後 ${p.deliveryDays} 日內保證交付精修成品` : "14 天內保證交付精修成品",
            deliveryDays: p.deliveryDays || 14,
            deliveryMethod: p.deliveryMethod || "Google Drive 雲端連結",
            rawDeliveryPolicy: p.rawDeliveryPolicy || "all_jpg",
            coopModes: p.coopModes || ["tfcd", "paid_model"],
            equipment: p.equipment || "Sony A7 系列 / 神牛外拍閃燈 / 柔光罩",
            safePromise: p.safePromise || "零肢體接觸口頭引導 / 歡迎親友同行",
            styles: p.styles || (parsed.styles ? parsed.styles : ["日系膠卷清新", "俐落時裝街拍"]),
            portfolioImages: p.portfolioImages && p.portfolioImages.length > 0 ? p.portfolioImages : DEFAULT_PORTFOLIO,
          });

          if (p.socialLinks) {
            setSocialLinks(p.socialLinks);
          }
        }
        if (parsed.socialLinks && !parsed.photographerProfile?.socialLinks) {
          setSocialLinks(parsed.socialLinks);
        }
        if (parsed.rateCardImages) setRateCardImages(parsed.rateCardImages);
        if (parsed.rateCardAccessMode) setRateCardAccessMode(parsed.rateCardAccessMode);
        if (parsed.incomingRequests) setIncomingRequests(parsed.incomingRequests);
        if (parsed.scheduleData) setScheduleData(parsed.scheduleData);
      } catch (e) {
        console.error("載入攝影師設定失敗", e);
      }
    }

    if (!photographerId) return;

    const savedReviews = localStorage.getItem("lumina_peer_reviews");
    if (savedReviews) {
      try {
        const parsed: PeerReview[] = JSON.parse(savedReviews);
        const filtered = parsed.filter(
          (r) => r.targetId === photographerId && r.targetType === "photographer"
        );

        setReviews(() => {
          const map = new Map<string, PeerReview>();
          DEFAULT_REVIEWS.forEach((r) => map.set(r.id, r));
          filtered.forEach((r) => map.set(r.id, r));
          return Array.from(map.values());
        });
      } catch (e) {
        console.error(e);
      }
    }
  }, [photographerId]);

  const currentRequest = incomingRequests.find((r) => r.applicantName.includes(currentUserName));
  const isApproved = currentRequest?.status === "approved";
  const isPending = currentRequest?.status === "pending";

  const handleRequestSubmit = () => {
    const newReq = {
      id: `req_${Date.now()}`,
      applicantId: "hane",
      applicantName: `模特 ${currentUserName}`,
      applicantRole: currentUserRole === "model" ? "model" : "client",
      requestTime: new Date().toISOString().replace("T", " ").slice(0, 16),
      status: "pending",
    };

    const updated = [newReq, ...incomingRequests];
    setIncomingRequests(updated);

    const saved = localStorage.getItem("lumina_photographer_profile_data");
    const parsed = saved ? JSON.parse(saved) : {};
    parsed.incomingRequests = updated;
    localStorage.setItem("lumina_photographer_profile_data", JSON.stringify(parsed));

    alert(`✅ 已向攝影師【${photographerInfo.name}】提出報價單索取申請！請靜候攝影師審核。`);
  };

  const handleSelectDateFromSchedule = (dateKey: string) => {
    setSelectedScheduleDate(dateKey);
  };

  const photos = photographerInfo.portfolioImages || DEFAULT_PORTFOLIO;

  return (
    <main className="min-h-[calc(100vh-65px)] bg-stone-100/70 px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <button
          onClick={() => router.back()}
          className="text-xs font-bold text-stone-600 hover:text-stone-900 flex items-center gap-1 cursor-pointer transition"
        >
          ← 返回上一頁
        </button>

        {/* 1. 攝影師個人頭部與信譽卡片 */}
        <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden relative border border-stone-300 bg-stone-900 shadow-2xs flex-shrink-0">
              <img
                src={coverPhoto}
                alt={photographerInfo.name}
                style={{ objectPosition: `center ${coverFocusY}%` }}
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-1 right-1 bg-black/75 backdrop-blur-md text-white text-[9px] px-1.5 py-0.5 rounded font-mono">
                1:1 形象
              </span>
            </div>

            <div className="space-y-3 text-center sm:text-left flex-1">
              <div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h2 className="text-xl font-bold text-stone-900">{photographerInfo.name}</h2>
                  <span className="px-2.5 py-0.5 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold rounded-full">
                    已實名認證攝影師
                  </span>
                </div>
                <p className="text-xs text-stone-500 font-medium mt-1">
                  主場地區：{photographerInfo.city} ｜ 攝影年資：{photographerInfo.experienceYears} 年
                </p>
              </div>

              {/* 核心信譽指標 */}
              <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                <div className="bg-[#f5f3ef] px-3.5 py-1.5 rounded-xl border border-stone-300 text-center shadow-2xs">
                  <div className="text-sm font-bold text-stone-900">★ 4.9</div>
                  <div className="text-[10px] text-stone-500 font-medium">同業評分</div>
                </div>
                <div className="bg-[#f5f3ef] px-3.5 py-1.5 rounded-xl border border-stone-300 text-center shadow-2xs">
                  <div className="text-sm font-bold text-emerald-700">98%</div>
                  <div className="text-[10px] text-stone-500 font-medium">履約率</div>
                </div>
                <div className="bg-[#f5f3ef] px-3.5 py-1.5 rounded-xl border border-stone-300 text-center shadow-2xs">
                  <div className="text-sm font-bold text-stone-900">26 次</div>
                  <div className="text-[10px] text-stone-500 font-medium">核銷完成</div>
                </div>
                <div className="bg-[#f5f3ef] px-3.5 py-1.5 rounded-xl border border-stone-300 text-center shadow-2xs">
                  <div className="text-sm font-bold text-stone-900">0 次</div>
                  <div className="text-[10px] text-stone-500 font-medium">放鳥紀錄</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. 攝影師專屬報價單索取按鈕卡片 */}
        <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base">💳</span>
              <h3 className="text-sm font-bold text-stone-900">攝影專案服務與收費報價單</h3>
              <span className="text-[10px] bg-stone-100 text-stone-700 border border-stone-300 px-2 py-0.5 rounded font-bold">
                {rateCardAccessMode === "auto" ? "公開查閱" : "需索取審核"}
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              包含商案人像、服飾型錄、日系寫真等收費方案、精修張數及超時加價規範。
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsRateCardModalOpen(true)}
            className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer shrink-0"
          >
            <span>👁️</span>
            <span>
              {rateCardAccessMode === "auto" || isApproved
                ? "即刻查閱攝影報價單"
                : isPending
                ? "⏳ 報價審核中..."
                : "索取攝影報價單"}
            </span>
          </button>
        </div>

        {/* 3. 兩欄式主體內容 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-stone-900 border-b border-stone-200 pb-2">
              攝影風格與合作規範
            </h3>
            
            <div className="space-y-3.5 text-xs">
              {photographerInfo.coopModes && photographerInfo.coopModes.length > 0 && (
                <div>
                  <span className="font-bold text-stone-800 block mb-1">可接受合作型態：</span>
                  <div className="flex flex-wrap gap-1.5">
                    {photographerInfo.coopModes.map((mode) => (
                      <span
                        key={mode}
                        className="px-2.5 py-1 bg-[#edeae3] text-stone-800 rounded-lg text-xs font-bold border border-stone-300"
                      >
                        {COOP_MODE_LABELS[mode] || mode}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <span className="font-bold text-stone-800 block mb-1">擅長拍攝風格：</span>
                <div className="flex flex-wrap gap-1.5">
                  {photographerInfo.styles.map((s) => (
                    <span
                      key={s}
                      className="px-2.5 py-1 bg-indigo-50 text-indigo-800 rounded-lg text-xs font-bold border border-indigo-200"
                    >
                      #{s}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-bold text-stone-800 block mb-1">成品交付與毛片政策：</span>
                <div className="bg-[#f5f3ef] border border-stone-300 p-3 rounded-xl space-y-1.5">
                  <p className="text-emerald-800 font-bold">
                    ✓ {photographerInfo.deliveryCommitment}
                  </p>
                  <div className="text-[11px] text-stone-600 flex flex-wrap gap-x-3 gap-y-1 pt-1 border-t border-stone-300">
                    <span>毛片政策：<strong>{RAW_POLICY_LABELS[photographerInfo.rawDeliveryPolicy] || photographerInfo.rawDeliveryPolicy}</strong></span>
                    <span>交件方式：<strong>{photographerInfo.deliveryMethod}</strong></span>
                  </div>
                </div>
              </div>

              {photographerInfo.equipment && (
                <div>
                  <span className="font-bold text-stone-800 block mb-1">常用機材與燈光設備：</span>
                  <p className="text-stone-800 bg-[#f5f3ef] p-2.5 rounded-xl border border-stone-300 font-mono">
                    📷 {photographerInfo.equipment}
                  </p>
                </div>
              )}

              {photographerInfo.safePromise && (
                <div>
                  <span className="font-bold text-stone-800 block mb-1">人身安全承諾：</span>
                  <p className="text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 font-semibold">
                    🛡️ {photographerInfo.safePromise}
                  </p>
                </div>
              )}

              {photographerInfo.bio && (
                <div>
                  <span className="font-bold text-stone-800 block mb-1">關於攝影師 (Bio)：</span>
                  <p className="text-stone-700 leading-relaxed bg-[#f5f3ef] p-3 rounded-xl border border-stone-300 font-medium">
                    {photographerInfo.bio}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {/* 公開社群與外站作品集 */}
            <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="border-b border-stone-200 pb-2 flex justify-between items-center">
                <h3 className="text-sm font-bold text-stone-900">
                  公開社群與外站作品集
                </h3>
                <span className="text-[10px] text-stone-500 font-bold">點擊開新視窗</span>
              </div>

              <div className="space-y-2 text-xs">
                {socialLinks.instagram ? (
                  <a
                    href={socialLinks.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl bg-white hover:bg-[#f5f3ef] text-stone-900 transition font-bold border border-stone-300 shadow-2xs group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">📸</span>
                      <span>Instagram 作品專頁</span>
                    </div>
                    <span className="text-indigo-600 group-hover:translate-x-0.5 transition font-bold">➔</span>
                  </a>
                ) : null}

                {socialLinks.facebook ? (
                  <a
                    href={socialLinks.facebook}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl bg-white hover:bg-[#f5f3ef] text-stone-900 transition font-bold border border-stone-300 shadow-2xs group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">📘</span>
                      <span>Facebook 粉絲專頁 / 個人</span>
                    </div>
                    <span className="text-indigo-600 group-hover:translate-x-0.5 transition font-bold">➔</span>
                  </a>
                ) : null}

                {socialLinks.threads ? (
                  <a
                    href={socialLinks.threads}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl bg-white hover:bg-[#f5f3ef] text-stone-900 transition font-bold border border-stone-300 shadow-2xs group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">🧵</span>
                      <span>Threads (脆) 攝影日常</span>
                    </div>
                    <span className="text-indigo-600 group-hover:translate-x-0.5 transition font-bold">➔</span>
                  </a>
                ) : null}

                {socialLinks.custom1Url ? (
                  <a
                    href={socialLinks.custom1Url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl bg-white hover:bg-[#f5f3ef] text-stone-900 transition font-bold border border-stone-300 shadow-2xs group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">🔗</span>
                      <span>{socialLinks.custom1Name || "外站作品集 1"}</span>
                    </div>
                    <span className="text-indigo-600 group-hover:translate-x-0.5 transition font-bold">➔</span>
                  </a>
                ) : null}

                {socialLinks.custom2Url ? (
                  <a
                    href={socialLinks.custom2Url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl bg-white hover:bg-[#f5f3ef] text-stone-900 transition font-bold border border-stone-300 shadow-2xs group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">🔗</span>
                      <span>{socialLinks.custom2Name || "外站作品集 2"}</span>
                    </div>
                    <span className="text-indigo-600 group-hover:translate-x-0.5 transition font-bold">➔</span>
                  </a>
                ) : null}
              </div>
            </div>

            {/* 精選作品集相簿 */}
            <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-stone-200 pb-2">
                <div>
                  <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                    <span>🖼️</span>
                    <span>代表作品集 ({photos.length} / 9 張)</span>
                  </h3>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    點擊可開啟全螢幕高解析度檢視調色細節與構圖。
                  </p>
                </div>
                <span className="text-[11px] text-indigo-600 font-bold">點擊放大</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {photos.slice(0, 9).map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedPhoto(img)}
                    className="group relative aspect-square rounded-xl overflow-hidden border border-stone-200 bg-stone-100 shadow-2xs hover:shadow-md transition cursor-pointer"
                  >
                    <img
                      src={img}
                      alt={`攝影作品 ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                      <span className="text-white text-[10px] font-bold bg-black/60 px-2 py-0.5 rounded backdrop-blur-xs">
                        放大檢視
                      </span>
                    </div>
                    <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[8px] font-mono px-1 rounded">
                      #{idx + 1}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 攝影師開放檔期與預約日曆模組 */}
        <div className="space-y-3">
          <PhotographerPublicSchedule
            scheduleData={scheduleData}
            onSelectDate={handleSelectDateFromSchedule}
          />
          {selectedScheduleDate && (
            <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shadow-2xs">
              <div className="text-xs">
                <span className="font-bold text-indigo-950 flex items-center gap-1.5">
                  <span>📅</span>
                  <span>您已選定預約日期：<strong className="font-mono text-sm text-indigo-700">{selectedScheduleDate}</strong></span>
                </span>
                <p className="text-[11px] text-indigo-800/80 mt-0.5">
                  該日目前標示為「可預約」，您可透過約拍提案向攝影師正式發起預約。
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  alert(`已將日期 ${selectedScheduleDate} 記錄，可於發起約拍時直接填寫！`);
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer shrink-0"
              >
                帶入此日期發起約拍
              </button>
            </div>
          )}
        </div>

        {/* 模特同行專屬備忘手札 */}
        <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-stone-200 pb-2">
            <div>
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                <span>👩‍🦰 模特同行封閉備忘手札</span>
                <span className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded text-[10px] font-bold">
                  限核驗模特瀏覽
                </span>
              </h3>
              <p className="text-[11px] text-stone-500 mt-0.5 font-medium">
                為防止報復與維護人身安全，此區僅對完成實名接案之模特公開，供接案前評估避坑。
              </p>
            </div>
            <span className="text-xs font-mono text-stone-500 font-bold">共 {reviews.length} 則評價</span>
          </div>

          {currentUserRole !== "model" ? (
            <div className="p-8 text-center bg-[#f5f3ef] rounded-xl border border-dashed border-stone-300 space-y-2">
              <div className="text-2xl">🔒</div>
              <h4 className="text-xs font-bold text-stone-800">同行封閉內容加密保護中</h4>
              <p className="text-[11px] text-stone-600 leading-relaxed max-w-sm mx-auto font-medium">
                本區塊為保護接案模特之內部同行手札，僅對已登入且核驗身分為<strong>【模特】</strong>之會員開放。<br />
                當前登入身分：<strong>{currentUserRole === "photographer" ? "攝影師" : "訪客"}</strong>。
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {reviews.map((r, idx) => (
                <div key={`${r.id}-${idx}`} className="p-4 bg-white border border-stone-300 rounded-xl space-y-2 text-xs shadow-2xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-stone-900">{r.authorName}</span>
                    <span className="text-[10px] text-stone-500 font-medium">{r.date}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {r.tags.map((t) => (
                      <span key={t} className="px-2 py-0.5 bg-indigo-50 text-indigo-800 rounded text-[10px] font-bold border border-indigo-200">
                        #{t}
                      </span>
                    ))}
                  </div>
                  <p className="text-stone-800 leading-relaxed bg-[#fbfaf8] p-2.5 rounded-lg border border-stone-200 font-medium">
                    {r.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 5. 全新整合：外拍履約公開評價卡片（包含爭議屏蔽狀態） */}
        <PublicReviewsSection targetName={photographerInfo.name} />
      </div>

      {/* 報價單彈窗 */}
      {isRateCardModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#fbfaf8] border border-stone-200 rounded-2xl max-w-xl w-full p-6 shadow-2xl max-h-[92vh] flex flex-col">
            <div className="flex justify-between items-center pb-3 border-b border-stone-200">
              <div>
                <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <span>💳</span>
                  <span>{photographerInfo.name} 的攝影專案報價單</span>
                </h3>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  已加入浮水印存證保護，請尊重智慧財產權與合作約定。
                </p>
              </div>
              <button
                onClick={() => setIsRateCardModalOpen(false)}
                className="text-stone-400 hover:text-stone-600 text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto space-y-4 my-4 flex-1 pr-1">
              {rateCardAccessMode === "auto" || isApproved ? (
                <div className="space-y-4">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-medium">
                    ✓ 報價單已成功授權查閱，以下為最新直式收費表：
                  </div>

                  {rateCardImages.length === 0 ? (
                    <div className="p-8 text-center bg-[#f5f3ef] rounded-xl border border-dashed border-stone-300 text-xs text-stone-400">
                      該攝影師尚未上傳直式圖檔，歡迎直接提出約拍提案討論！
                    </div>
                  ) : (
                    rateCardImages.map((img, idx) => (
                      <div key={idx} className="rounded-2xl overflow-hidden border border-stone-300 shadow-xs bg-white relative">
                        <div className="bg-stone-100 px-3 py-1.5 border-b border-stone-200 text-[11px] font-bold text-stone-600 flex justify-between items-center">
                          <span>第 {idx + 1} 頁收費標準</span>
                          <span className="text-[10px] text-indigo-700 font-mono">🔒 浮水印存證保護中</span>
                        </div>
                        <div className="p-2 bg-stone-50 flex justify-center relative">
                          <img
                            src={img}
                            alt={`報價單第 ${idx + 1} 張`}
                            className="w-full h-auto object-contain rounded-lg shadow-2xs select-none"
                          />
                          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                            <span className="text-stone-900/25 font-bold text-sm tracking-widest transform -rotate-12 select-none border border-stone-900/10 px-4 py-2 rounded-xl">
                              僅供 {currentUserName} 查閱 ‧ LuminaMatch 存證
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ) : isPending ? (
                <div className="p-8 text-center bg-amber-50 border border-amber-300 rounded-xl space-y-2">
                  <div className="text-3xl">⏳</div>
                  <h4 className="text-sm font-bold text-amber-900">索取申請已送達攝影師後台！</h4>
                  <p className="text-xs text-amber-800 leading-relaxed max-w-sm mx-auto font-medium">
                    攝影師設定了審核機制。我們已通知【{photographerInfo.name}】，待攝影師核准開放時限後，即可在此查閱完整報價單。
                  </p>
                </div>
              ) : (
                <div className="space-y-4 bg-[#f5f3ef] p-5 rounded-xl border border-stone-300 text-center">
                  <div className="text-3xl">🔒</div>
                  <div>
                    <h4 className="text-sm font-bold text-stone-900">此攝影師報價單需提出索取</h4>
                    <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                      為了保護商業價格機密，需向攝影師提出申請，審核後即可開放限時瀏覽。
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleRequestSubmit}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <span>📤</span>
                    <span>以【{currentUserName}】身分發送索取申請</span>
                  </button>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-stone-200 flex justify-end">
              <button
                type="button"
                onClick={() => setIsRateCardModalOpen(false)}
                className="px-4 py-2 bg-stone-200 text-stone-700 rounded-xl text-xs font-bold cursor-pointer hover:bg-stone-300"
              >
                關閉
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 作品集全螢幕檢視彈窗 */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xs flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="max-w-3xl max-h-[90vh] relative">
            <img
              src={selectedPhoto}
              alt="攝影作品放大檢視"
              className="w-full h-auto max-h-[90vh] object-contain rounded-2xl shadow-2xl"
            />
            <span className="absolute bottom-4 right-4 bg-black/70 text-white text-xs px-3 py-1.5 rounded-full font-medium">
              ✕ 點擊任意處關閉
            </span>
          </div>
        </div>
      )}
    </main>
  );
}

export default function PhotographerProfilePage(props: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <main className="min-h-[calc(100vh-65px)] bg-stone-100/70 px-4 py-8 flex items-center justify-center">
          <div className="text-xs font-bold text-stone-500 animate-pulse">載入攝影師檔案中...</div>
        </main>
      }
    >
      <PhotographerProfileContent {...props} />
    </Suspense>
  );
}