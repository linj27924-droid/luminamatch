"use client";

import React, { useState, useEffect, useMemo, use, Suspense } from "react";
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
  punctualityScore: number;
}

const DEFAULT_MODEL_REVIEWS: PeerReview[] = [
  {
    id: "pr_m_1",
    targetId: "hane",
    targetType: "model",
    authorRole: "photographer",
    authorName: "攝影師 P***（已官方驗證）",
    date: "2026-09-12",
    tags: ["極度守時", "自備底妝完整", "情緒張力到位"],
    content: "表現力極強，眼神很有戲！約定 14:00 拍攝，提前 15 分鐘到場梳化完畢，溝通非常客氣且配合動作走位，完全不拖延時間，強烈推薦給各位同業！",
    punctualityScore: 5.0,
  },
  {
    id: "pr_m_2",
    targetId: "hane",
    targetType: "model",
    authorRole: "photographer",
    authorName: "攝影師 R***（已官方驗證）",
    date: "2026-08-30",
    tags: ["自備服裝搭配用心", "溝通效率高"],
    content: "合作非常順利，拍攝前有主動傳服裝搭配圖確認風格，現場動作自然流暢，能快速抓到構圖節奏。",
    punctualityScore: 5.0,
  },
];

function ModelDetailContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const modelId = decodeURIComponent(resolvedParams.id);

  // 修正：初始身分預設為 guest，避免預設為 photographer 造成誤解鎖
  const [currentUserRole, setCurrentUserRole] = useState<"model" | "photographer" | "guest">("guest");

  // ==================== 1. 模特資料與 5 組社群連結 ====================
  const [modelCover, setModelCover] = useState(
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
  );
  const [modelFocusY, setModelFocusY] = useState(20);
  const [modelInfo, setModelInfo] = useState({
    name: "羽晴 (Hane)",
    city: "台北 / 新北",
    height: "165",
    weight: "48",
    hideWeight: false,
    companionPolicy: "可攜伴 (親友同行)",
    bio: "熱愛日系清新自然光與韓系俐落時裝。注重拍攝氛圍與情緒表達，現場備有防護更衣裝備。",
    styles: ["日系清新", "韓系時裝"],
  });

  const [socialLinks, setSocialLinks] = useState({
    instagram: "https://instagram.com/hane_model",
    facebook: "https://facebook.com/hane.official",
    threads: "https://threads.net/@hane_model",
    custom1Name: "個人作品官網",
    custom1Url: "https://hane-portfolio.me",
    custom2Name: "Flickr 相簿",
    custom2Url: "",
  });

  // ==================== 2. 模特檔期表 ====================
  const [viewYear, setViewYear] = useState(2026);
  const [viewMonth, setViewMonth] = useState(10);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const [modelScheduleData, setModelScheduleData] = useState<Record<string, string>>({
    "2026-10-15": "off",
    "2026-10-20": "private_booked",
    "2026-10-25": "studio_shoot",
  });
  const [customStatusList, setCustomStatusList] = useState([
    { id: "available", name: "可預約", isBookable: true },
    { id: "off", name: "休假", isBookable: false },
    { id: "private_booked", name: "已排約拍", isBookable: false },
    { id: "studio_shoot", name: "商案棚拍", isBookable: false },
  ]);

  const [isQuietBlocked, setIsQuietBlocked] = useState(false);

  // ==================== 3. 約拍表單欄位狀態 ====================
  const [style, setStyle] = useState("");
  const [location, setLocation] = useState("");
  const [coopType, setCoopType] = useState("互惠創作 (TFCD)");
  const [proposalNotes, setProposalNotes] = useState("");

  const [photographerReviews, setPhotographerReviews] = useState<PeerReview[]>(DEFAULT_MODEL_REVIEWS);

  // 嚴謹讀取當前登入者身分
  useEffect(() => {
    const savedUser = localStorage.getItem("lumina_mock_user");
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        if (u.role === "model" || u.role === "photographer") {
          setCurrentUserRole(u.role);
        } else {
          setCurrentUserRole("guest");
        }
      } catch (e) {
        console.error(e);
        setCurrentUserRole("guest");
      }
    } else {
      setCurrentUserRole("guest");
    }

    // 讀取模特自訂檔案
    const savedModel = localStorage.getItem("lumina_model_profile_data");
    if (savedModel) {
      try {
        const parsed = JSON.parse(savedModel);
        if (parsed.coverPhoto) setModelCover(parsed.coverPhoto);
        if (parsed.coverFocusY !== undefined) setModelFocusY(parsed.coverFocusY);
        if (parsed.modelProfile) {
          setModelInfo({
            name: parsed.modelProfile.name || "羽晴 (Hane)",
            city: parsed.modelProfile.city || "台北 / 新北",
            height: parsed.modelProfile.height || "165",
            weight: parsed.modelProfile.weight || "48",
            hideWeight: parsed.modelProfile.hideWeight ?? false,
            companionPolicy: parsed.modelProfile.companionPolicy || "可攜伴 (親友同行)",
            bio: parsed.modelProfile.bio || "",
            styles: parsed.styles || ["日系清新", "韓系時裝"],
          });
        }
        if (parsed.socialLinks) setSocialLinks(parsed.socialLinks);
        if (parsed.scheduleData) setModelScheduleData(parsed.scheduleData);
        if (parsed.customStatusList) setCustomStatusList(parsed.customStatusList);
      } catch (e) {
        console.error("載入模特資料失敗", e);
      }
    }

    // 檢查黑名單
    const savedBlacklist = localStorage.getItem("lumina_model_blacklist");
    if (savedBlacklist) {
      try {
        const bl = JSON.parse(savedBlacklist);
        const isBlocked = bl.some((item: { name: string }) => item.name.includes("Alan Chen") || item.name.includes("陳攝影"));
        if (isBlocked) setIsQuietBlocked(true);
      } catch (e) {
        console.error(e);
      }
    }

    // 讀取攝影師預設範本
    const savedPhoto = localStorage.getItem("lumina_photographer_profile_data");
    if (savedPhoto) {
      try {
        const parsedPhoto = JSON.parse(savedPhoto);
        if (parsedPhoto.proposalTemplate) {
          const pt = parsedPhoto.proposalTemplate;
          if (pt.defaultStyle) setStyle(pt.defaultStyle);
          if (pt.defaultLocation) setLocation(pt.defaultLocation);
          if (pt.defaultCoopType) setCoopType(pt.defaultCoopType);
          if (pt.defaultProposalLetter) setProposalNotes(pt.defaultProposalLetter);
        }
      } catch (e) {
        console.error("載入攝影師預設範本失敗", e);
      }
    }

    // 讀取評價並去重
    const savedReviews = localStorage.getItem("lumina_peer_reviews");
    if (savedReviews) {
      try {
        const parsedR: PeerReview[] = JSON.parse(savedReviews);
        const filtered = parsedR.filter((r) => r.targetId === modelId && r.targetType === "model");
        setPhotographerReviews(() => {
          const map = new Map<string, PeerReview>();
          DEFAULT_MODEL_REVIEWS.forEach((r) => map.set(r.id, r));
          filtered.forEach((r) => map.set(r.id, r));
          return Array.from(map.values());
        });
      } catch (e) {
        console.error(e);
      }
    }
  }, [modelId]);

  const daysInMonth = useMemo(() => new Date(viewYear, viewMonth, 0).getDate(), [viewYear, viewMonth]);
  const firstDay = useMemo(() => new Date(viewYear, viewMonth - 1, 1).getDay(), [viewYear, viewMonth]);

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) {
      alert("請先於上方日曆選取可預約的日期！");
      return;
    }
    alert(`🎉 約拍提案已正式送出！\n\n約定日期：${selectedDate}\n預約風格：${style}\n預計地點：${location}\n\n已自動套用您的攝影提案範本，模特審核同意後將產生電子存證協議！`);
  };

  return (
    <main className="min-h-[calc(100vh-65px)] bg-stone-100/70 px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <button
            onClick={() => router.back()}
            className="text-xs font-bold text-stone-700 hover:text-stone-900 flex items-center gap-1 cursor-pointer"
          >
            ← 返回探索大廳
          </button>
          
          <span className="text-[11px] font-bold px-2.5 py-1 bg-stone-200/80 rounded-lg text-stone-700">
            當前造訪身分：<strong>{currentUserRole === "model" ? "👩‍🦰 模特" : currentUserRole === "photographer" ? "📸 攝影師" : "訪客"}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 左側：模特封面照片、個人簡介與 5 組社群 */}
          <section className="bg-[#fbfaf8] p-5 rounded-2xl border border-stone-200/90 h-fit space-y-5 shadow-sm">
            <div className="w-full aspect-square rounded-xl overflow-hidden relative border border-stone-300 bg-stone-200 shadow-xs">
              <img
                src={modelCover}
                alt={modelInfo.name}
                style={{ objectPosition: `center ${modelFocusY}%` }}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/75 backdrop-blur-md text-white rounded text-[10px] font-bold">
                {modelInfo.companionPolicy}
              </span>
            </div>

            <div>
              <div className="flex justify-between items-baseline">
                <h2 className="text-xl font-bold text-stone-900">{modelInfo.name}</h2>
                <span className="text-xs text-stone-600 font-bold">
                  {modelInfo.height} cm / {modelInfo.hideWeight ? "🔒 保密" : `${modelInfo.weight} kg`}
                </span>
              </div>
              <p className="text-xs text-stone-500 font-medium mt-0.5">{modelInfo.city}</p>

              <div className="flex flex-wrap gap-1 mt-2.5">
                {modelInfo.styles.map((s) => (
                  <span key={s} className="px-2 py-0.5 bg-indigo-50 text-indigo-800 rounded text-[10px] font-bold border border-indigo-200">
                    #{s}
                  </span>
                ))}
              </div>

              {modelInfo.bio && (
                <p className="text-xs text-stone-700 mt-3 leading-relaxed bg-[#f5f3ef] p-3 rounded-xl border border-stone-300 font-medium">
                  {modelInfo.bio}
                </p>
              )}
            </div>

            <div className="pt-3 border-t border-stone-300 space-y-2">
              <h4 className="text-xs font-bold text-stone-800">公開社群與個人作品集</h4>
              <div className="flex flex-col gap-1.5 text-xs">
                {socialLinks.instagram && (
                  <a
                    href={socialLinks.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 p-2.5 rounded-lg bg-[#f5f3ef] hover:bg-stone-200 text-stone-800 transition font-bold border border-stone-200"
                  >
                    <span>📸</span>
                    <span className="truncate">Instagram 主頁</span>
                  </a>
                )}
                {socialLinks.facebook && (
                  <a
                    href={socialLinks.facebook}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 p-2.5 rounded-lg bg-[#f5f3ef] hover:bg-stone-200 text-stone-800 transition font-bold border border-stone-200"
                  >
                    <span>📘</span>
                    <span className="truncate">Facebook 粉專/個人</span>
                  </a>
                )}
                {socialLinks.threads && (
                  <a
                    href={socialLinks.threads}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 p-2.5 rounded-lg bg-[#f5f3ef] hover:bg-stone-200 text-stone-800 transition font-bold border border-stone-200"
                  >
                    <span>🧵</span>
                    <span className="truncate">Threads (脆)</span>
                  </a>
                )}
                {socialLinks.custom1Url && (
                  <a
                    href={socialLinks.custom1Url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 p-2.5 rounded-lg bg-[#f5f3ef] hover:bg-stone-200 text-stone-800 transition font-bold border border-stone-200"
                  >
                    <span>🔗</span>
                    <span className="truncate">{socialLinks.custom1Name || "作品網站 1"}</span>
                  </a>
                )}
                {socialLinks.custom2Url && (
                  <a
                    href={socialLinks.custom2Url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 p-2.5 rounded-lg bg-[#f5f3ef] hover:bg-stone-200 text-stone-800 transition font-bold border border-stone-200"
                  >
                    <span>🔗</span>
                    <span className="truncate">{socialLinks.custom2Name || "作品網站 2"}</span>
                  </a>
                )}
              </div>
            </div>
          </section>

          {/* 右側：連動檔期日曆與高對比度約拍表單 */}
          <section className="md:col-span-2 space-y-6">
            <div className="bg-[#fbfaf8] p-6 rounded-2xl border border-stone-200/90 space-y-4 shadow-sm">
              <div className="flex flex-wrap justify-between items-center gap-2 pb-2 border-b border-stone-200">
                <div>
                  <h3 className="font-bold text-stone-900 text-sm">
                    {modelInfo.name} 的檔期行事曆
                  </h3>
                  <p className="text-[11px] text-stone-600 font-medium">
                    綠色為模特開放預約空檔；灰色為已排定約拍或休假
                  </p>
                </div>

                <select
                  value={`${viewYear}-${viewMonth}`}
                  onChange={(e) => {
                    const [y, m] = e.target.value.split("-").map(Number);
                    setViewYear(y);
                    setViewMonth(m);
                  }}
                  className="text-xs border border-stone-400 rounded-lg p-1.5 bg-white text-stone-900 font-bold outline-none"
                >
                  <option value="2026-10">2026 年 10 月</option>
                  <option value="2026-11">2026 年 11 月</option>
                  <option value="2026-12">2026 年 12 月</option>
                  <option value="2027-1">2027 年 1 月 (隔年)</option>
                  <option value="2027-2">2027 年 2 月 (隔年)</option>
                </select>
              </div>

              {/* 日曆網格 */}
              <div className="grid grid-cols-7 gap-1.5 text-center text-xs">
                {["週日","週一","週二","週三","週四","週五","週六"].map((d) => (
                  <div key={d} className="font-bold text-stone-600 py-1">{d}</div>
                ))}

                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`empty-${i}`} className="h-14 border border-transparent rounded-lg" />
                ))}

                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const dateKey = `${viewYear}-${String(viewMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                  
                  const statusId = modelScheduleData[dateKey] || "available";
                  const statusDef = customStatusList.find((s) => s.id === statusId) || {
                    id: statusId,
                    name: statusId === "off" ? "休假" : "不可約",
                    isBookable: false,
                  };

                  const isAvailable = !isQuietBlocked && statusDef.isBookable;
                  const isSelected = selectedDate === dateKey;

                  return (
                    <button
                      key={day}
                      type="button"
                      disabled={!isAvailable}
                      onClick={() => isAvailable && setSelectedDate(dateKey)}
                      className={`h-14 rounded-xl border flex flex-col items-center justify-center transition p-1 ${
                        isSelected
                          ? "bg-indigo-700 text-white border-indigo-700 shadow-md ring-2 ring-indigo-400"
                          : isAvailable
                          ? "bg-emerald-50 text-emerald-900 border-emerald-400 hover:bg-emerald-100 cursor-pointer font-bold"
                          : "bg-stone-200/60 text-stone-400 border-stone-300 cursor-not-allowed"
                      }`}
                    >
                      <span className="text-xs font-bold">{day}</span>
                      <span className="text-[10px] font-semibold mt-0.5 truncate max-w-full">
                        {isQuietBlocked ? "滿檔" : statusDef.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              {isQuietBlocked && (
                <div className="p-2.5 bg-stone-200 rounded-xl text-center text-xs text-stone-700 font-bold">
                  🔒 該模特目前檔期全滿，暫停對外接受預約。
                </div>
              )}
            </div>

            {/* 高對比度約拍表單 */}
            <form onSubmit={handleBooking} className="bg-[#fbfaf8] p-6 rounded-2xl border border-stone-300 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-stone-200 pb-2">
                <div>
                  <h4 className="font-bold text-sm text-stone-900">發起拍攝合作協議</h4>
                  <p className="text-xs font-semibold mt-0.5">
                    {selectedDate ? (
                      <span className="text-indigo-700 font-bold">✓ 已選定約定日期：{selectedDate}</span>
                    ) : (
                      <span className="text-stone-500 font-medium">請先於上方日曆點擊選擇【可預約】的綠色日期</span>
                    )}
                  </p>
                </div>
                <span className="text-[11px] text-indigo-800 bg-indigo-100 border border-indigo-300 px-2 py-0.5 rounded font-bold">
                  ✦ 已自動帶入您的預設範本
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-900 mb-1">
                    合作性質
                  </label>
                  <select
                    value={coopType}
                    onChange={(e) => setCoopType(e.target.value)}
                    className="w-full text-xs font-semibold bg-white text-stone-900 border border-stone-400 rounded-lg p-2.5 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 shadow-2xs"
                  >
                    <option value="互惠創作 (TFCD)">互惠創作 (TFCD)</option>
                    <option value="商業有酬">商業有酬</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-900 mb-1">
                    拍攝風格
                  </label>
                  <input
                    type="text"
                    required
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    placeholder="例：日系膠卷微光街拍"
                    className="w-full text-xs font-semibold bg-white text-stone-900 placeholder:text-stone-500 border border-stone-400 rounded-lg p-2.5 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 shadow-2xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-900 mb-1">
                  約定拍攝地點
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="例：台北市大稻埕 / 赤峰街商圈"
                  className="w-full text-xs font-semibold bg-white text-stone-900 placeholder:text-stone-500 border border-stone-400 rounded-lg p-2.5 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-900 mb-1">
                  💬 給模特的約拍提案信 (發送審核內容)：
                </label>
                <textarea
                  rows={4}
                  value={proposalNotes}
                  onChange={(e) => setProposalNotes(e.target.value)}
                  placeholder="請輸入您希望與模特合作的提案細節、交圖承諾或服裝討論..."
                  className="w-full text-xs font-semibold bg-white text-stone-900 placeholder:text-stone-500 border border-stone-400 rounded-xl p-3 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 leading-relaxed shadow-2xs"
                />
              </div>

              <button
                type="submit"
                disabled={!selectedDate || isQuietBlocked}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-stone-300 disabled:text-stone-500 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
              >
                {selectedDate ? "確認送出約拍邀約協議給模特" : "請先點選日曆中的綠色【可預約】日期"}
              </button>
            </form>
          </section>
        </div>

        {/* ==================== 底部：攝影同業合作手札 (權限隔離檢查) ==================== */}
        <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-stone-200 pb-2">
            <div>
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                <span>📸 攝影同業合作手札 (模特信譽備忘)</span>
                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-800 border border-indigo-200 rounded text-[10px] font-bold">
                  限核驗攝影師瀏覽
                </span>
              </h3>
              <p className="text-[11px] text-stone-500 mt-0.5">
                包含妝容自備完整度、守時紀錄與現場溝通流暢度，僅對攝影同行開放。
              </p>
            </div>
            <span className="text-xs font-mono text-stone-500 font-bold">共 {photographerReviews.length} 則評價</span>
          </div>

          {/* 只有攝影師 (role === 'photographer') 才能看到！模特 (role === 'model') 看到的是鎖定畫面 */}
          {currentUserRole !== "photographer" ? (
            <div className="p-8 text-center bg-[#f5f3ef] rounded-xl border border-dashed border-stone-300 space-y-2">
              <div className="text-2xl">🔒</div>
              <h4 className="text-xs font-bold text-stone-800">攝影同行手札加密保護中</h4>
              <p className="text-[11px] text-stone-600 leading-relaxed max-w-sm mx-auto font-medium">
                本區塊為攝影同行交流與信譽存證專區，僅對已登入且核驗身分為<strong>【攝影師】</strong>之會員開放。<br />
                當前登入身分：<strong className="text-indigo-700">{currentUserRole === "model" ? "👩‍🦰 模特" : "訪客"}</strong>，您無法查閱同業備忘以確保交流公正性。
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {photographerReviews.map((r, idx) => (
                <div key={`${r.id}-${idx}`} className="p-4 bg-white border border-stone-200 rounded-xl space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-stone-900">{r.authorName}</span>
                    <span className="text-[10px] text-stone-500 font-medium">{r.date}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {r.tags.map((t) => (
                      <span key={t} className="px-2 py-0.5 bg-emerald-50 text-emerald-900 rounded text-[10px] font-bold border border-emerald-200">
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

export default function ModelDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <main className="min-h-[calc(100vh-65px)] bg-stone-100/70 px-4 py-8 flex items-center justify-center">
          <div className="text-xs font-bold text-stone-500 animate-pulse">載入模特檔案中...</div>
        </main>
      }
    >
      <ModelDetailContent {...props} />
    </Suspense>
  );
}