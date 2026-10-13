"use client";

import React, { useState, useEffect, useMemo, use, Suspense } from "react";
import { useRouter } from "next/navigation";

// 載入 4 個獨立零件 (同時提供別名與相對路徑確保編譯絕對成功)
import ModelSidebar from "../../../components/model-detail/ModelSidebar";
import BookingCalendar from "../../../components/model-detail/BookingCalendar";
import BookingForm from "../../../components/model-detail/BookingForm";
import PeerReviewSection, { PeerReview } from "../../../components/model-detail/PeerReviewSection";

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

  const [currentUserRole, setCurrentUserRole] = useState<"model" | "photographer" | "guest">("guest");

  // 1. 模特基本名片資料
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
    experienceYears: "3",
    bio: "熱愛日系清新自然光與韓系俐落時裝。注重拍攝氛圍與情緒表達，現場備有防護更衣裝備。",
    styles: ["日系清新", "韓系時裝", "復古底片"],
    boundaries: ["不接私房微醺", "謝絕比基尼泳裝", "禁未經同意肢體接觸"],
    companionPolicy: "可攜伴同行 (親友可全程在場陪同)",
    coopModes: "互惠創作 (TFCD) / 商業有酬皆可",
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

  // 2. 檔期日曆狀態
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

  // 3. 約拍表單欄位
  const [style, setStyle] = useState("");
  const [location, setLocation] = useState("");
  const [coopType, setCoopType] = useState("互惠創作 (TFCD)");
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
        } else {
          setCurrentUserRole("guest");
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

        const activeStyles = parsed.styles || parsed.modelProfile?.styles || [
          "日系清新",
          "韓系時裝",
        ];

        const activeBoundaries =
          parsed.boundaries ||
          parsed.modelProfile?.boundaries || [
            "不接私房微醺",
            "謝絕比基尼泳裝",
            "禁未經同意肢體接觸",
          ];

        setModelInfo((prev) => ({
          ...prev,
          name: parsed.modelProfile?.name || prev.name,
          city: parsed.modelProfile?.city || prev.city,
          height: parsed.modelProfile?.height || prev.height,
          weight: parsed.modelProfile?.weight || prev.weight,
          hideWeight: parsed.modelProfile?.hideWeight ?? prev.hideWeight,
          experienceYears: parsed.modelProfile?.experienceYears || prev.experienceYears,
          bio: parsed.modelProfile?.bio || prev.bio,
          styles: Array.isArray(activeStyles) ? activeStyles : [activeStyles],
          boundaries: Array.isArray(activeBoundaries) ? activeBoundaries : [activeBoundaries],
          companionPolicy:
            parsed.modelProfile?.companionPolicy ||
            parsed.companionPolicy ||
            prev.companionPolicy,
          coopModes:
            parsed.modelProfile?.coopModes ||
            parsed.coopModes ||
            prev.coopModes,
        }));

        if (parsed.socialLinks) setSocialLinks(parsed.socialLinks);
        if (parsed.scheduleData) setModelScheduleData(parsed.scheduleData);
        if (parsed.customStatusList) setCustomStatusList(parsed.customStatusList);
        if (parsed.monthlyVisibility) setMonthlyVisibility(parsed.monthlyVisibility);
      } catch (e) {
        console.error("載入模特設定失敗", e);
      }
    }

    const savedTasks = localStorage.getItem("lumina_timed_release_tasks");
    if (savedTasks) {
      try {
        setTimedReleaseTasks(JSON.parse(savedTasks));
      } catch (e) {
        console.error(e);
      }
    }

    const savedBlacklist = localStorage.getItem("lumina_model_blacklist");
    if (savedBlacklist) {
      try {
        const bl = JSON.parse(savedBlacklist);
        const isBlocked = bl.some(
          (item: { name: string }) =>
            item.name.includes("Alan Chen") || item.name.includes("陳攝影")
        );
        if (isBlocked) setIsQuietBlocked(true);
      } catch (e) {
        console.error(e);
      }
    }

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

    const savedReviews = localStorage.getItem("lumina_peer_reviews");
    if (savedReviews) {
      try {
        const parsedR: PeerReview[] = JSON.parse(savedReviews);
        const filtered = parsedR.filter(
          (r) => r.targetId === modelId && r.targetType === "model"
        );
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

  // 定時解鎖檢查
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      timedReleaseTasks.forEach((task) => {
        if (!task.isExecuted && now >= new Date(task.releaseDateTime)) {
          setMonthlyVisibility((prev) => ({
            ...prev,
            [task.targetMonthKey]: true,
          }));
        }
      });
    }, 3000);
    return () => clearInterval(timer);
  }, [timedReleaseTasks]);

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
      `🎉 約拍提案已正式送出！\n\n約定日期：${selectedDate}\n預約風格：${style}\n預計地點：${location}\n\n已自動套用您的攝影提案範本，模特審核同意後將產生電子存證協議！`
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
          {/* 零件 1：左側欄位 (封面、名片、年資、風格、邊界、社群) */}
          <ModelSidebar
            modelCover={modelCover}
            modelFocusY={modelFocusY}
            modelInfo={modelInfo}
            socialLinks={socialLinks}
          />

          {/* 右側欄位：日曆 + 約拍表單 */}
          <section className="md:col-span-2 space-y-6">
            {/* 零件 2：檔期行事曆與定時鎖定提示 */}
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

            {/* 零件 3：約拍提案表單 */}
            <BookingForm
              selectedDate={selectedDate}
              isQuietBlocked={isQuietBlocked}
              isMonthOpen={isMonthOpen}
              coopType={coopType}
              setCoopType={setCoopType}
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

        {/* 零件 4：底部攝影同業合作手札 */}
        <PeerReviewSection
          currentUserRole={currentUserRole}
          photographerReviews={photographerReviews}
        />
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