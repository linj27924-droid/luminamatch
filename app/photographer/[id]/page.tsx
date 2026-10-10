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
          setPhotographerInfo({
            name: parsed.photographerProfile.name || photographerId,
            city: parsed.photographerProfile.city || "台北 / 新北",
            experienceYears: parsed.photographerProfile.experienceYears || "5",
            bio: parsed.photographerProfile.bio || "",
            deliveryCommitment: parsed.photographerProfile.deliveryCommitment || "14 天內保證交付精修成品",
            styles: parsed.photographerProfile.styles || ["日系膠卷清新", "俐落時裝街拍"],
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
    <main className="min-h-[calc(100vh-65px)] bg-stone-100/70 px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <button
          onClick={() => router.back()}
          className="text-xs font-bold text-stone-700 hover:text-stone-900 flex items-center gap-1 cursor-pointer"
        >
          ← 返回上一頁
        </button>

        {/* ==================== 1. 攝影師個人頭部與信譽卡片 ==================== */}
        <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* 1:1 封面照片 (套用對焦點) */}
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden relative border-2 border-stone-300 bg-stone-900 shadow-md flex-shrink-0">
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

            {/* 資料與信譽數據 */}
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
                <div className="bg-[#f5f3ef] px-3.5 py-1.5 rounded-xl border border-stone-300 text-center">
                  <div className="text-sm font-bold text-stone-900">★ 4.9</div>
                  <div className="text-[10px] text-stone-500 font-medium">同業評分</div>
                </div>
                <div className="bg-[#f5f3ef] px-3.5 py-1.5 rounded-xl border border-stone-300 text-center">
                  <div className="text-sm font-bold text-emerald-700">98%</div>
                  <div className="text-[10px] text-stone-500 font-medium">履約率</div>
                </div>
                <div className="bg-[#f5f3ef] px-3.5 py-1.5 rounded-xl border border-stone-300 text-center">
                  <div className="text-sm font-bold text-stone-900">26 次</div>
                  <div className="text-[10px] text-stone-500 font-medium">核銷完成</div>
                </div>
                <div className="bg-[#f5f3ef] px-3.5 py-1.5 rounded-xl border border-stone-300 text-center">
                  <div className="text-sm font-bold text-stone-900">0 次</div>
                  <div className="text-[10px] text-stone-500 font-medium">放鳥紀錄</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ==================== 2. 攝影師自介、風格與 5 組公開社群連結 ==================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 左側：攝影師自介與風格承諾 */}
          <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-stone-900 border-b border-stone-200 pb-2">
              攝影風格與履約承諾
            </h3>
            
            <div className="space-y-3 text-xs">
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
                <span className="font-bold text-stone-800 block mb-1">成品質感與交稿承諾：</span>
                <p className="text-emerald-800 font-bold bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl">
                  ✓ {photographerInfo.deliveryCommitment}
                </p>
              </div>

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

          {/* 右側：5 組公開社群與外站作品集連結 */}
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
                  <span className="text-indigo-600 group-hover:translate-x-0.5 transition">➔</span>
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
                  <span className="text-indigo-600 group-hover:translate-x-0.5 transition">➔</span>
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
                  <span className="text-indigo-600 group-hover:translate-x-0.5 transition">➔</span>
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
                  <span className="text-indigo-600 group-hover:translate-x-0.5 transition">➔</span>
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
                  <span className="text-indigo-600 group-hover:translate-x-0.5 transition">➔</span>
                </a>
              ) : null}
            </div>
          </div>
        </div>

        {/* ==================== 3. 模特同行專屬封閉備忘區 (限模特可讀) ==================== */}
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
        <main className="min-h-[calc(100vh-65px)] bg-stone-100/70 px-4 py-8 flex items-center justify-center">
          <div className="text-xs font-bold text-stone-500 animate-pulse">載入攝影師檔案中...</div>
        </main>
      }
    >
      <PhotographerProfileContent {...props} />
    </Suspense>
  );
}