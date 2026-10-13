"use client";

import React, { useState, useEffect, useMemo, use, Suspense } from "react";
import { useRouter } from "next/navigation";

import ModelSidebar from "../../../components/model-detail/ModelSidebar";
import BookingCalendar from "../../../components/model-detail/BookingCalendar";
import BookingForm from "../../../components/model-detail/BookingForm";
import PeerReviewSection, { PeerReview } from "../../../components/model-detail/PeerReviewSection";
import RateCardModal from "../../../components/model-detail/RateCardModal";

interface TimedReleaseTask {
  id: string;
  targetMonthKey: string;
  targetMonthLabel: string;
  releaseDateTime: string;
  isExecuted: boolean;
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
];

function ModelDetailContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const modelId = decodeURIComponent(resolvedParams.id);

  const [currentUserRole, setCurrentUserRole] = useState<"model" | "photographer" | "guest">("guest");
  const [currentUserName, setCurrentUserName] = useState("陳攝影 (Alan Chen)");

  // 1. 模特基本資料
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
    measurements: "32B / 24 / 34",
    hideMeasurements: false,
    experienceYears: "3",
    bio: "熱愛日系清新自然光與韓系俐落時裝。注重拍攝氛圍與情緒表達，現場備有防護更衣裝備。",
    styles: ["日系清新", "韓系時裝", "復古底片"],
    boundaries: ["不接私房微醺", "謝絕比基尼泳裝", "禁未經同意肢體接觸"],
    companionPolicy: "可攜伴同行 (親友可全程在場陪同)",
    coopModes: "互惠創作 (TFCD) / 商業有酬皆可",
  });

  const [modelCoopOptions, setModelCoopOptions] = useState<string[]>([
    "商業有酬",
    "互惠創作 (TFCD)",
  ]);

  const [socialLinks, setSocialLinks] = useState({
    instagram: "https://instagram.com/hane_model",
    facebook: "https://facebook.com/hane.official",
    threads: "https://threads.net/@hane_model",
    custom1Name: "個人作品官網",
    custom1Url: "https://hane-portfolio.me",
    custom2Name: "Flickr 相簿",
    custom2Url: "",
  });

  // 2. 報價單模組連動狀態
  const [isRateCardModalOpen, setIsRateCardModalOpen] = useState(false);
  const [rateCardImages, setRateCardImages] = useState<string[]>([]);
  const [rateCardAccessMode, setRateCardAccessMode] = useState<"auto" | "require_approval">("require_approval");
  const [rateCardRequests, setRateCardRequests] = useState<any[]>([]);

  // 3. 檔期日曆狀態
  const [viewYear, setViewYear] = useState(2026);
  const [viewMonth, setViewMonth] = useState(10);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const [monthlyVisibility, setMonthlyVisibility] = useState<Record<string, boolean>>({
    "2026-10": true,
    "2026-11": true,
    "2026-12": true,
  });

  const [timedReleaseTasks, setTimedReleaseTasks] = useState<TimedReleaseTask[]>([]);

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

  // 4. 約拍表單欄位
  const [style, setStyle] = useState("");
  const [location, setLocation] = useState("");
  const [coopType, setCoopType] = useState("商業有酬");
  const [proposalNotes, setProposalNotes] = useState("");

  const [photographerReviews, setPhotographerReviews] = useState<PeerReview[]>(DEFAULT_MODEL_REVIEWS);

  const currentMonthKey = `${viewYear}-${viewMonth}`;
  const isMonthOpen = monthlyVisibility[currentMonthKey] ?? true;

  const upcomingTimedTask = useMemo(() => {
    return timedReleaseTasks.find(
      (t) => t.targetMonthKey === currentMonthKey && !t.isExecuted
    );
  }, [timedReleaseTasks, currentMonthKey]);

  useEffect(() => {
    const savedUser = localStorage.getItem("lumina_mock_user");
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        if (u.role === "model" || u.role === "photographer") {
          setCurrentUserRole(u.role);
          if (u.name) setCurrentUserName(u.name);
        }
      } catch (e) {
        console.error(e);
      }
    }

    const savedModel = localStorage.getItem("lumina_model_profile_data");
    if (savedModel) {
      try {
        const parsed = JSON.parse(savedModel);
        if (parsed.coverPhoto) setModelCover(parsed.coverPhoto);
        if (parsed.coverFocusY !== undefined) setModelFocusY(parsed.coverFocusY);

        let loadedCoopModes: string[] = [];
        if (parsed.modelProfile?.allCoopModes && parsed.modelProfile.allCoopModes.length > 0) {
          loadedCoopModes = parsed.modelProfile.allCoopModes;
        } else if (parsed.modelProfile?.selectedCoopModes) {
          loadedCoopModes = [...parsed.modelProfile.selectedCoopModes];
          if (parsed.modelProfile.customCoop1?.trim()) loadedCoopModes.push(parsed.modelProfile.customCoop1.trim());
          if (parsed.modelProfile.customCoop2?.trim()) loadedCoopModes.push(parsed.modelProfile.customCoop2.trim());
        }

        if (loadedCoopModes.length > 0) {
          setModelCoopOptions(loadedCoopModes);
          setCoopType((prev) => (loadedCoopModes.includes(prev) ? prev : loadedCoopModes[0]));
        }

        setModelInfo((prev) => ({
          ...prev,
          name: parsed.modelProfile?.name || prev.name,
          city: parsed.modelProfile?.city || prev.city,
          height: parsed.modelProfile?.height || prev.height,
          weight: parsed.modelProfile?.weight || prev.weight,
          hideWeight: parsed.modelProfile?.hideWeight ?? prev.hideWeight,
          measurements: parsed.modelProfile?.measurements || prev.measurements,
          hideMeasurements: parsed.modelProfile?.hideMeasurements ?? prev.hideMeasurements,
          experienceYears: parsed.modelProfile?.experienceYears || prev.experienceYears,
          bio: parsed.modelProfile?.bio || prev.bio,
          styles: parsed.styles || prev.styles,
          boundaries: parsed.boundaries || prev.boundaries,
          companionPolicy: parsed.modelProfile?.companionPolicy || prev.companionPolicy,
          coopModes: parsed.modelProfile?.coopModes || prev.coopModes,
        }));

        if (parsed.socialLinks) setSocialLinks(parsed.socialLinks);
        if (parsed.scheduleData) setModelScheduleData(parsed.scheduleData);
        if (parsed.customStatusList) setCustomStatusList(parsed.customStatusList);
        if (parsed.monthlyVisibility) setMonthlyVisibility(parsed.monthlyVisibility);
      } catch (e) {
        console.error(e);
      }
    }

    // 讀取報價單配置
    const savedRateCard = localStorage.getItem("lumina_model_rate_card_config");
    if (savedRateCard) {
      try {
        const parsedRC = JSON.parse(savedRateCard);
        if (parsedRC.images) setRateCardImages(parsedRC.images);
        if (parsedRC.accessMode) setRateCardAccessMode(parsedRC.accessMode);
        if (parsedRC.requests) setRateCardRequests(parsedRC.requests);
      } catch (e) {
        console.error(e);
      }
    }
  }, [modelId]);

  // 判斷當前攝影師是否已被核准查閱報價單
  const isCurrentPhotographerApproved = useMemo(() => {
    return rateCardRequests.some(
      (r) => r.photographerName === currentUserName && r.status === "approved"
    );
  }, [rateCardRequests, currentUserName]);

  // 判斷當前攝影師是否在審核等待中
  const isCurrentPhotographerPending = useMemo(() => {
    return rateCardRequests.some(
      (r) => r.photographerName === currentUserName && r.status === "pending"
    );
  }, [rateCardRequests, currentUserName]);

  // 攝影師發起索取申請
  const handleRateCardRequestSubmit = (applicantName: string) => {
    const newReq = {
      id: `rc_req_${Date.now()}`,
      photographerName: applicantName,
      requestTime: new Date().toISOString().replace("T", " ").slice(0, 16),
      status: "pending",
    };
    const updated = [...rateCardRequests, newReq];
    setRateCardRequests(updated);

    const saved = localStorage.getItem("lumina_model_rate_card_config");
    const parsed = saved ? JSON.parse(saved) : {};
    parsed.requests = updated;
    localStorage.setItem("lumina_model_rate_card_config", JSON.stringify(parsed));

    alert(`📩 索取申請已送出！已通知【${modelInfo.name}】後台進行查閱授權。`);
  };

  const daysInMonth = useMemo(
    () => new Date(viewYear, viewMonth, 0).getDate(),
    [viewYear, viewMonth]
  );
  const firstDay = useMemo(
    () => new Date(viewYear, viewMonth - 1, 1).getDay(),
    [viewYear, viewMonth]
  );

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) {
      alert("請先於上方日曆選取可預約的日期！");
      return;
    }
    alert(
      `🎉 約拍提案已正式送出！\n\n約定日期：${selectedDate}\n合作性質：${coopType}\n預約風格：${style}\n預計地點：${location}`
    );
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
            當前造訪身分：
            <strong>
              {currentUserRole === "model"
                ? "👩‍🦰 模特"
                : currentUserRole === "photographer"
                ? "📸 攝影師"
                : "訪客"}
            </strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 左側名片欄 + 獨立索取報價單模組按鈕 */}
          <div className="space-y-4">
            <ModelSidebar
              modelCover={modelCover}
              modelFocusY={modelFocusY}
              modelInfo={modelInfo}
              socialLinks={socialLinks}
            />

            {/* 新增：索取商業報價單專屬卡片按鈕 */}
            <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-4 shadow-sm space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                  <span>💰</span>
                  <span>商業與棚拍報價單</span>
                </span>
                <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded font-bold">
                  {rateCardAccessMode === "auto" ? "即時開放" : "需索取審核"}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                欲了解商業棚拍、活動時薪、造型服裝與精修加價細則，可直接索取詳細圖片報價。
              </p>
              <button
                type="button"
                onClick={() => setIsRateCardModalOpen(true)}
                className="w-full py-2.5 bg-stone-900 hover:bg-black text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <span>📄</span>
                <span>
                  {rateCardAccessMode === "auto" || isCurrentPhotographerApproved
                    ? "立即查閱報價單圖片"
                    : isCurrentPhotographerPending
                    ? "⏳ 報價單索取審核中..."
                    : "索取詳細合作報價單"}
                </span>
              </button>
            </div>
          </div>

          {/* 右側：日曆 + 約拍表單 */}
          <section className="md:col-span-2 space-y-6">
            <BookingCalendar
              modelName={modelInfo.name}
              viewYear={viewYear}
              viewMonth={viewMonth}
              setViewYear={setViewYear}
              setViewMonth={setViewMonth}
              isMonthOpen={isMonthOpen}
              upcomingTimedTask={upcomingTimedTask}
              firstDay={firstDay}
              daysInMonth={daysInMonth}
              modelScheduleData={modelScheduleData}
              customStatusList={customStatusList}
              isQuietBlocked={isQuietBlocked}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />

            <BookingForm
              selectedDate={selectedDate}
              isQuietBlocked={isQuietBlocked}
              isMonthOpen={isMonthOpen}
              coopType={coopType}
              setCoopType={setCoopType}
              coopOptions={modelCoopOptions}
              style={style}
              setStyle={setStyle}
              location={location}
              setLocation={setLocation}
              proposalNotes={proposalNotes}
              setProposalNotes={setProposalNotes}
              handleBooking={handleBooking}
            />
          </section>
        </div>

        {/* 底部同行手札 */}
        <PeerReviewSection
          currentUserRole={currentUserRole}
          photographerReviews={photographerReviews}
        />
      </div>

      {/* 索取商業報價單彈窗 */}
      <RateCardModal
        isOpen={isRateCardModalOpen}
        onClose={() => setIsRateCardModalOpen(false)}
        modelName={modelInfo.name}
        rateCardImages={rateCardImages}
        accessMode={rateCardAccessMode}
        isApproved={isCurrentPhotographerApproved}
        isPending={isCurrentPhotographerPending}
        onRequestSubmit={handleRateCardRequestSubmit}
        currentUserName={currentUserName}
      />
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