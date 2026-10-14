"use client";

import React, { useState, useEffect, use, Suspense } from "react";
import { useRouter } from "next/navigation";

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

function PhotographerProfileContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const photographerId = decodeURIComponent(resolvedParams.id);

  // 當前登入者身分
  const [currentUserRole, setCurrentUserRole] = useState<"model" | "photographer" | "guest">("model");

  // ==================== 1. 攝影師封面、基本資料與 5 組社群連結 ====================
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
  });

  // 5 組公開社群與作品集連結
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

  // 跨頁讀取已儲存之攝影師資料與同行評價
  useEffect(() => {
    const savedUser = localStorage.getItem("lumina_mock_user");
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        setCurrentUserRole(u.role || "model");
      } catch (e) {
        console.error(e);
      }
    }

    // 讀取攝影師後台儲存的資料
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
          });
        }
        if (parsed.socialLinks) setSocialLinks(parsed.socialLinks);
      } catch (e) {
        console.error("載入攝影師設定失敗", e);
      }
    }

    if (!photographerId) return;

    // 讀取並去重同行評價
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

  return (
    <main className="min-h-[calc(100vh-65px)] bg-[#f8f6f2] px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <button
          onClick={() => router.back()}
          className="text-xs font-bold text-[#706458] hover:text-[#2e2620] flex items-center gap-1 cursor-pointer transition"
        >
          ← 返回上一頁
        </button>

        {/* ==================== 1. 攝影師個人頭部與信譽卡片 ==================== */}
        <div className="bg-white border border-[#e8e2d8] rounded-2xl p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* 1:1 封面照片 (套用對焦點) */}
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden relative border border-[#ded7ca] bg-stone-900 shadow-2xs flex-shrink-0">
              <img
                src={coverPhoto}
                alt={photographerInfo.name}
                style={{ objectPosition: `center ${coverFocusY}%` }}
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-1 right-1 bg-[#2e2620]/80 backdrop-blur-md text-[#f7f5f0] text-[9px] px-1.5 py-0.5 rounded font-mono">
                1:1 形象
              </span>
            </div>

            {/* 資料與信譽數據 */}
            <div className="space-y-3 text-center sm:text-left flex-1">
              <div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h2 className="text-xl font-bold text-[#2e2620]">{photographerInfo.name}</h2>
                  <span className="px-2.5 py-0.5 bg-[#eee8de] border border-[#ded7ca] text-[#4a3f35] text-xs font-bold rounded-full">
                    已實名認證攝影師
                  </span>
                </div>
                <p className="text-xs text-[#706458] font-medium mt-1">
                  主場地區：{photographerInfo.city} ｜ 攝影年資：{photographerInfo.experienceYears} 年
                </p>
              </div>

              {/* 核心信譽指標 */}
              <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                <div className="bg-[#faf8f5] px-3.5 py-1.5 rounded-xl border border-[#e8e2d8] text-center shadow-2xs">
                  <div className="text-sm font-bold text-[#2e2620]">★ 4.9</div>
                  <div className="text-[10px] text-[#706458] font-medium">同業評分</div>
                </div>
                <div className="bg-[#faf8f5] px-3.5 py-1.5 rounded-xl border border-[#e8e2d8] text-center shadow-2xs">
                  <div className="text-sm font-bold text-[#4a6b42]">98%</div>
                  <div className="text-[10px] text-[#706458] font-medium">履約率</div>
                </div>
                <div className="bg-[#faf8f5] px-3.5 py-1.5 rounded-xl border border-[#e8e2d8] text-center shadow-2xs">
                  <div className="text-sm font-bold text-[#2e2620]">26 次</div>
                  <div className="text-[10px] text-[#706458] font-medium">核銷完成</div>
                </div>
                <div className="bg-[#faf8f5] px-3.5 py-1.5 rounded-xl border border-[#e8e2d8] text-center shadow-2xs">
                  <div className="text-sm font-bold text-[#2e2620]">0 次</div>
                  <div className="text-[10px] text-[#706458] font-medium">放鳥紀錄</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ==================== 2. 攝影師自介、風格、機材設備與 5 組社群連結 ==================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 左側：攝影風格、合作模式、機材與交稿承諾 */}
          <div className="bg-white border border-[#e8e2d8] rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#2e2620] border-b border-[#eee8de] pb-2">
              攝影風格與合作規範
            </h3>
            
            <div className="space-y-3.5 text-xs">
              {/* 可接受合作模式 */}
              {photographerInfo.coopModes && photographerInfo.coopModes.length > 0 && (
                <div>
                  <span className="font-bold text-[#4a3f35] block mb-1">可接受合作型態：</span>
                  <div className="flex flex-wrap gap-1.5">
                    {photographerInfo.coopModes.map((mode) => (
                      <span
                        key={mode}
                        className="px-2.5 py-1 bg-[#f5f0e6] text-[#4a3f35] rounded-lg text-xs font-bold border border-[#ded7ca]"
                      >
                        {COOP_MODE_LABELS[mode] || mode}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 擅長風格 */}
              <div>
                <span className="font-bold text-[#4a3f35] block mb-1">擅長拍攝風格：</span>
                <div className="flex flex-wrap gap-1.5">
                  {photographerInfo.styles.map((s) => (
                    <span
                      key={s}
                      className="px-2.5 py-1 bg-[#ede8df] text-[#2e2620] rounded-lg text-xs font-bold border border-[#ded7ca]"
                    >
                      #{s}
                    </span>
                  ))}
                </div>
              </div>

              {/* 交稿承諾與毛片政策 */}
              <div>
                <span className="font-bold text-[#4a3f35] block mb-1">成品交付與毛片政策：</span>
                <div className="bg-[#faf8f5] border border-[#e8e2d8] p-3 rounded-xl space-y-1.5">
                  <p className="text-[#3a5833] font-bold">
                    ✓ {photographerInfo.deliveryCommitment}
                  </p>
                  <div className="text-[11px] text-[#706458] flex flex-wrap gap-x-3 gap-y-1 pt-1 border-t border-[#eee8de]">
                    <span>毛片政策：<strong>{RAW_POLICY_LABELS[photographerInfo.rawDeliveryPolicy] || photographerInfo.rawDeliveryPolicy}</strong></span>
                    <span>交件方式：<strong>{photographerInfo.deliveryMethod}</strong></span>
                  </div>
                </div>
              </div>

              {/* 機材設備 */}
              {photographerInfo.equipment && (
                <div>
                  <span className="font-bold text-[#4a3f35] block mb-1">常用機材與燈光設備：</span>
                  <p className="text-[#2e2620] bg-[#faf8f5] p-2.5 rounded-xl border border-[#e8e2d8] font-mono">
                    📷 {photographerInfo.equipment}
                  </p>
                </div>
              )}

              {/* 安全承諾 */}
              {photographerInfo.safePromise && (
                <div>
                  <span className="font-bold text-[#4a3f35] block mb-1">人身安全與合作承諾：</span>
                  <p className="text-[#2e2620] bg-[#edf4eb] text-[#3a5833] p-2.5 rounded-xl border border-[#cbe0c5] font-semibold">
                    🛡️ {photographerInfo.safePromise}
                  </p>
                </div>
              )}

              {/* 關於攝影師 (Bio) */}
              {photographerInfo.bio && (
                <div>
                  <span className="font-bold text-[#4a3f35] block mb-1">關於攝影師 (Bio)：</span>
                  <p className="text-[#4a3f35] leading-relaxed bg-[#faf8f5] p-3 rounded-xl border border-[#e8e2d8] font-medium">
                    {photographerInfo.bio}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 右側：5 組公開社群與外站作品集連結 */}
          <div className="bg-white border border-[#e8e2d8] rounded-2xl p-6 shadow-xs space-y-4">
            <div className="border-b border-[#eee8de] pb-2 flex justify-between items-center">
              <h3 className="text-sm font-bold text-[#2e2620]">
                公開社群與外站作品集
              </h3>
              <span className="text-[10px] text-[#706458] font-bold">點擊開新視窗</span>
            </div>

            <div className="space-y-2 text-xs">
              {socialLinks.instagram ? (
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-[#faf8f5] hover:bg-[#f2ede4] text-[#2e2620] transition font-bold border border-[#e8e2d8] shadow-2xs group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">📸</span>
                    <span>Instagram 作品專頁</span>
                  </div>
                  <span className="text-[#9c7c64] group-hover:translate-x-0.5 transition font-bold">➔</span>
                </a>
              ) : null}

              {socialLinks.facebook ? (
                <a
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-[#faf8f5] hover:bg-[#f2ede4] text-[#2e2620] transition font-bold border border-[#e8e2d8] shadow-2xs group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">📘</span>
                    <span>Facebook 粉絲專頁 / 個人</span>
                  </div>
                  <span className="text-[#9c7c64] group-hover:translate-x-0.5 transition font-bold">➔</span>
                </a>
              ) : null}

              {socialLinks.threads ? (
                <a
                  href={socialLinks.threads}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-[#faf8f5] hover:bg-[#f2ede4] text-[#2e2620] transition font-bold border border-[#e8e2d8] shadow-2xs group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">🧵</span>
                    <span>Threads (脆) 攝影日常</span>
                  </div>
                  <span className="text-[#9c7c64] group-hover:translate-x-0.5 transition font-bold">➔</span>
                </a>
              ) : null}

              {socialLinks.custom1Url ? (
                <a
                  href={socialLinks.custom1Url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-[#faf8f5] hover:bg-[#f2ede4] text-[#2e2620] transition font-bold border border-[#e8e2d8] shadow-2xs group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">🔗</span>
                    <span>{socialLinks.custom1Name || "外站作品集 1"}</span>
                  </div>
                  <span className="text-[#9c7c64] group-hover:translate-x-0.5 transition font-bold">➔</span>
                </a>
              ) : null}

              {socialLinks.custom2Url ? (
                <a
                  href={socialLinks.custom2Url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-[#faf8f5] hover:bg-[#f2ede4] text-[#2e2620] transition font-bold border border-[#e8e2d8] shadow-2xs group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">🔗</span>
                    <span>{socialLinks.custom2Name || "外站作品集 2"}</span>
                  </div>
                  <span className="text-[#9c7c64] group-hover:translate-x-0.5 transition font-bold">➔</span>
                </a>
              ) : null}
            </div>
          </div>
        </div>

        {/* ==================== 3. 模特同行專屬封閉備忘區 (限模特可讀) ==================== */}
        <div className="bg-white border border-[#e8e2d8] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-[#eee8de] pb-2">
            <div>
              <h3 className="text-sm font-bold text-[#2e2620] flex items-center gap-1.5">
                <span>👩‍🦰 模特同行封閉備忘手札</span>
                <span className="px-2 py-0.5 bg-[#fae8e8] text-[#a84d4d] border border-[#f0caca] rounded text-[10px] font-bold">
                  限核驗模特瀏覽
                </span>
              </h3>
              <p className="text-[11px] text-[#706458] mt-0.5 font-medium">
                為防止報復與維護人身安全，此區僅對完成實名接案之模特公開，供接案前評估避坑。
              </p>
            </div>
            <span className="text-xs font-mono text-[#706458] font-bold">共 {reviews.length} 則評價</span>
          </div>

          {currentUserRole !== "model" ? (
            <div className="p-8 text-center bg-[#faf8f5] rounded-xl border border-dashed border-[#ded7ca] space-y-2">
              <div className="text-2xl">🔒</div>
              <h4 className="text-xs font-bold text-[#2e2620]">同行封閉內容加密保護中</h4>
              <p className="text-[11px] text-[#706458] leading-relaxed max-w-sm mx-auto font-medium">
                本區塊為保護接案模特之內部同行手札，僅對已登入且核驗身分為<strong>【模特】</strong>之會員開放。<br />
                當前登入身分：<strong>{currentUserRole === "photographer" ? "攝影師" : "訪客"}</strong>。
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {reviews.map((r, idx) => (
                <div key={`${r.id}-${idx}`} className="p-4 bg-[#faf8f5] border border-[#e8e2d8] rounded-xl space-y-2 text-xs shadow-2xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[#2e2620]">{r.authorName}</span>
                    <span className="text-[10px] text-[#706458] font-medium">{r.date}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {r.tags.map((t) => (
                      <span key={t} className="px-2 py-0.5 bg-[#ede8df] text-[#2e2620] rounded text-[10px] font-bold border border-[#ded7ca]">
                        #{t}
                      </span>
                    ))}
                  </div>
                  <p className="text-[#4a3f35] leading-relaxed bg-white p-2.5 rounded-lg border border-[#e8e2d8] font-medium">
                    {r.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function PhotographerProfilePage(props: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <main className="min-h-[calc(100vh-65px)] bg-[#f8f6f2] px-4 py-8 flex items-center justify-center">
          <div className="text-xs font-bold text-[#706458] animate-pulse">載入攝影師檔案中...</div>
        </main>
      }
    >
      <PhotographerProfileContent {...props} />
    </Suspense>
  );
}