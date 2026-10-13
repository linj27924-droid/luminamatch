"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import ProfileTab from "../../../components/dashboard-model/ProfileTab";
import TemplateTab from "../../../components/dashboard-model/TemplateTab";
import ScheduleTab, { CustomScheduleStatus, TimedReleaseTask } from "../../../components/dashboard-model/ScheduleTab";
import BlacklistTab, { BlacklistedItem } from "../../../components/dashboard-model/BlacklistTab";
import RateCardTab, { RateCardRequest } from "../../../components/dashboard-model/RateCardTab";

interface BookingRequest {
  id: string;
  photographerName: string;
  photographerRating: number;
  photographerHistoryCount: number;
  completionRate: string;
  noShowCount: number;
  date: string;
  timeSlot: string;
  location: string;
  style: string;
  coopType: "互惠創作 (TFCD)" | "商業有酬";
  remuneration?: string;
  notes: string;
  status: "pending" | "accepted" | "declined" | "completed";
  customContractText?: string;
  modelReplyMessage?: string;
  hasReviewed?: boolean;
}

export default function ModelDashboardPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "rate_card" | "schedule" | "contract_templates" | "blacklist">("profile");

  // ==================== 0. 合約模板狀態 ====================
  const [templateAcceptMessage, setTemplateAcceptMessage] = useState(
    "非常高興能與您合作！拍攝當天我會提早 10 分鐘抵達現場並自備好基礎底妝，請雙方共同遵守上述存證合約約定！"
  );
  const [templateContractBody, setTemplateContractBody] = useState(
    `【第一條：作品交付與肖像著作權】
1. 甲方應於拍攝結束後 14 日內交付至少 10 張精修高畫質成品予乙方。
2. 本次拍攝照片僅供雙方非商業個人作品集展示，未經書面同意不得轉售圖庫或商業廣告使用。

【第二條：人身安全界線與現場規範】
1. 雙方應嚴格遵守約定之風格，現場嚴禁要求非約定尺度或暴露服裝。
2. 拍攝過程嚴禁非必要肢體接觸，動作引導應以口頭或示範為主。

【第三條：放鳥 (No-Show) 與爽約賠償規範】
1. 攝影師放鳥未到：須補償模特車馬妝造損失 NT$ 1,500 元（棚費全額由攝影自負），平台扣信用分 30 分。
2. 模特放鳥未到：全額退還預付款並補償攝影師已預付棚費（憑發票實報實銷上限 NT$ 3,000 元），平台扣信用分 30 分。
3. 臨時取消：72 小時前免責取消；24 小時內臨時取消依賠償標準 50% 計算。`
  );
  const [templateDeclineMessage, setTemplateDeclineMessage] = useState(
    "感謝您的約拍邀請！因該日期已有私人行程或近期作品風格規劃調整，本次暫無法配合，期待未來有機會再合作！"
  );

  const handleSaveGlobalTemplates = (e: React.FormEvent) => {
    e.preventDefault();
    const templates = { templateAcceptMessage, templateContractBody, templateDeclineMessage };
    localStorage.setItem("lumina_model_contract_templates", JSON.stringify(templates));
    alert("✅ 預設合約內容、同意回覆文章與謝絕理由已成功儲存！審核邀約時將自動全數帶入。");
  };

  // ==================== 1. 報價單模組狀態 ====================
  const [rateCardImages, setRateCardImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1554415707-9e4466bfe03b?auto=format&fit=crop&w=800&q=80",
  ]);
  const [rateCardAccessMode, setRateCardAccessMode] = useState<"auto" | "require_approval">("require_approval");
  const [rateCardRequests, setRateCardRequests] = useState<RateCardRequest[]>([
    {
      id: "rc_req_1",
      photographerName: "陳攝影 (Alan Chen)",
      requestTime: "2026-10-12 14:30",
      status: "pending",
    },
  ]);

  const handleSaveRateCardConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const config = {
      images: rateCardImages,
      accessMode: rateCardAccessMode,
      requests: rateCardRequests,
    };
    localStorage.setItem("lumina_model_rate_card_config", JSON.stringify(config));
    alert("✅ 報價單圖片與顯示模式已成功儲存！前台將即時生效。");
  };

  const handleApproveRequest = (id: string) => {
    const updated = rateCardRequests.map((r) =>
      r.id === id ? { ...r, status: "approved" as const } : r
    );
    setRateCardRequests(updated);
    const config = {
      images: rateCardImages,
      accessMode: rateCardAccessMode,
      requests: updated,
    };
    localStorage.setItem("lumina_model_rate_card_config", JSON.stringify(config));
    alert("✓ 已同意該攝影師查閱您的商業報價單！");
  };

  const handleDeclineRequest = (id: string) => {
    const updated = rateCardRequests.map((r) =>
      r.id === id ? { ...r, status: "declined" as const } : r
    );
    setRateCardRequests(updated);
    const config = {
      images: rateCardImages,
      accessMode: rateCardAccessMode,
      requests: updated,
    };
    localStorage.setItem("lumina_model_rate_card_config", JSON.stringify(config));
    alert("已婉拒 / 收回該攝影師之報價單查閱權限。");
  };

  // ==================== 2. 隱形黑名單狀態 ====================
  const [blacklist, setBlacklist] = useState<BlacklistedItem[]>([
    {
      id: "bl_m1",
      name: "林光影視覺 (Ray Studio)",
      reason: "私訊過度探詢私人行程，多次要求非約定尺度",
      dateAdded: "2026-09-10",
    },
  ]);
  const [newBlacklistName, setNewBlacklistName] = useState("");
  const [newBlacklistReason, setNewBlacklistReason] = useState("");

  const handleAddBlacklist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlacklistName.trim()) return;
    const item: BlacklistedItem = {
      id: `bl_${Date.now()}`,
      name: newBlacklistName.trim(),
      reason: newBlacklistReason.trim() || "個人安全防護封鎖",
      dateAdded: new Date().toISOString().split("T")[0],
    };
    const updated = [...blacklist, item];
    setBlacklist(updated);
    setNewBlacklistName("");
    setNewBlacklistReason("");
    localStorage.setItem("lumina_model_blacklist", JSON.stringify(updated));
    alert(`🔒 已將【${item.name}】加入隱形黑名單！`);
  };

  const handleRemoveBlacklist = (id: string) => {
    const updated = blacklist.filter((b) => b.id !== id);
    setBlacklist(updated);
    localStorage.setItem("lumina_model_blacklist", JSON.stringify(updated));
    alert("已解除該對象之隱形黑名單。");
  };

  // ==================== 3. 邀約審核抽屜狀態 ====================
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>([
    {
      id: "REQ-20261028-01",
      photographerName: "陳攝影 (Alan Chen)",
      photographerRating: 4.9,
      photographerHistoryCount: 26,
      completionRate: "98%",
      noShowCount: 0,
      date: "2026-10-28",
      timeSlot: "14:00 - 17:00 (3小時)",
      location: "台北市大稻埕迪化街周邊街拍",
      style: "日系膠卷復古時裝",
      coopType: "互惠創作 (TFCD)",
      notes: "已自備反光板與定焦鏡頭，預計交稿 15 張精修調色，無肢體接觸要求。",
      status: "completed",
    },
  ]);

  // ==================== 4. 封面與簡介狀態 ====================
  const [coverPhoto, setCoverPhoto] = useState<string>(
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
  );
  const [coverFocusY, setCoverFocusY] = useState<number>(20);

  const [modelProfile, setModelProfile] = useState({
    name: "羽晴 (Hane)",
    city: "台北 / 新北",
    height: "165",
    weight: "48",
    hideWeight: false,
    companionPolicy: "可攜伴 (親友同行)",
    measurements: "32B / 24 / 34",
    hideMeasurements: false,
    experienceYears: "3",
    bio: "熱愛日系清新自然光與韓系俐落時裝。注重拍攝氛圍與情緒表達，合作守時且積極配合動作引導。現場備有私密更衣防護配備，謝絕任何未經溝通的肢體接觸。",
    coopModes: "互惠創作為主、商業案件可議",
  });

  const [selectedCoopModes, setSelectedCoopModes] = useState<string[]>([
    "商業有酬",
    "互惠創作 (TFCD)",
  ]);
  const [customCoop1, setCustomCoop1] = useState("");
  const [customCoop2, setCustomCoop2] = useState("");

  const toggleCoopMode = (mode: string) => {
    setSelectedCoopModes((prev) =>
      prev.includes(mode) ? prev.filter((m) => m !== mode) : [...prev, mode]
    );
  };

  const [socialLinks, setSocialLinks] = useState({
    instagram: "https://instagram.com/hane_model",
    facebook: "https://facebook.com/hane.official",
    threads: "https://threads.net/@hane_model",
    custom1Name: "個人作品官網",
    custom1Url: "https://hane-portfolio.me",
    custom2Name: "Flickr 相簿",
    custom2Url: "",
  });

  const [styles, setStyles] = useState(["日系清新", "韓系時裝", "街頭膠卷", "商業型錄"]);
  const [newStyleInput, setNewStyleInput] = useState("");
  const [boundaries, setBoundaries] = useState(["不接私房微醺", "謝絕比基尼泳裝", "禁未經同意肢體接觸"]);
  const [newBoundaryInput, setNewBoundaryInput] = useState("");

  // ==================== 5. 排程日曆與定時開放 ====================
  const [customStatusList, setCustomStatusList] = useState<CustomScheduleStatus[]>([
    { id: "available", name: "開放預約", color: "emerald", bgColor: "bg-emerald-50", borderColor: "border-emerald-300", textColor: "text-emerald-800", isBookable: true },
    { id: "off", name: "休假休息", color: "rose", bgColor: "bg-rose-50", borderColor: "border-rose-300", textColor: "text-rose-800", isBookable: false },
    { id: "private_booked", name: "私人約拍", color: "amber", bgColor: "bg-amber-50", borderColor: "border-amber-300", textColor: "text-amber-800", isBookable: false },
    { id: "studio_shoot", name: "商案棚拍", color: "indigo", bgColor: "bg-indigo-50", borderColor: "border-indigo-300", textColor: "text-indigo-800", isBookable: false },
  ]);
  const [activeBrushId, setActiveBrushId] = useState<string>("private_booked");
  const [newStatusName, setNewStatusName] = useState("");

  const handleAddCustomStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStatusName.trim()) return;
    const newId = `custom_${Date.now()}`;
    const newStatus: CustomScheduleStatus = {
      id: newId,
      name: newStatusName.trim(),
      color: "purple",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-300",
      textColor: "text-purple-800",
      isBookable: false,
    };
    setCustomStatusList([...customStatusList, newStatus]);
    setActiveBrushId(newId);
    setNewStatusName("");
  };

  const [viewYear, setViewYear] = useState(2026);
  const [viewMonth, setViewMonth] = useState(10);
  const [monthlyVisibility, setMonthlyVisibility] = useState<Record<string, boolean>>({
    "2026-10": true,
    "2026-11": true,
    "2026-12": true,
  });

  const [scheduleData, setScheduleData] = useState<Record<string, string>>({
    "2026-10-15": "off",
    "2026-10-20": "private_booked",
    "2026-10-25": "studio_shoot",
  });

  const [timedReleaseTasks, setTimedReleaseTasks] = useState<TimedReleaseTask[]>([]);
  const [targetReleaseMonth, setTargetReleaseMonth] = useState("2026-11");
  const [targetReleaseDateTime, setTargetReleaseDateTime] = useState("2026-10-20T20:00");

  const currentMonthKey = `${viewYear}-${viewMonth}`;
  const isCurrentMonthVisible = monthlyVisibility[currentMonthKey] ?? true;

  const handleToggleMonthVisibility = () => {
    setMonthlyVisibility((prev) => ({
      ...prev,
      [currentMonthKey]: !isCurrentMonthVisible,
    }));
  };

  const availableMonthsList = useMemo(() => {
    const list = [];
    const startYear = 2026;
    const startMonth = 10;
    for (let i = 0; i <= 12; i++) {
      let m = startMonth + i;
      let y = startYear;
      if (m > 12) {
        y += Math.floor((m - 1) / 12);
        m = ((m - 1) % 12) + 1;
      }
      list.push({ year: y, month: m });
    }
    return list;
  }, []);

  const handleAddTimedRelease = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetReleaseDateTime) return;
    const [y, m] = targetReleaseMonth.split("-").map(Number);
    const newTask: TimedReleaseTask = {
      id: `task_${Date.now()}`,
      targetMonthKey: targetReleaseMonth,
      targetMonthLabel: `${y} 年 ${m} 月`,
      releaseDateTime: targetReleaseDateTime,
      isExecuted: false,
      createdAt: new Date().toISOString(),
    };
    setMonthlyVisibility((prev) => ({ ...prev, [targetReleaseMonth]: false }));
    const updatedTasks = [...timedReleaseTasks, newTask];
    setTimedReleaseTasks(updatedTasks);
    localStorage.setItem("lumina_timed_release_tasks", JSON.stringify(updatedTasks));
    alert(`⏰ 定時開放設定成功！`);
  };

  const handleCancelTimedTask = (taskId: string) => {
    const updated = timedReleaseTasks.filter((t) => t.id !== taskId);
    setTimedReleaseTasks(updated);
    localStorage.setItem("lumina_timed_release_tasks", JSON.stringify(updated));
  };

  const handleExecuteNow = (task: TimedReleaseTask) => {
    setMonthlyVisibility((prev) => ({ ...prev, [task.targetMonthKey]: true }));
    const updated = timedReleaseTasks.map((t) => (t.id === task.id ? { ...t, isExecuted: true } : t));
    setTimedReleaseTasks(updated);
    localStorage.setItem("lumina_timed_release_tasks", JSON.stringify(updated));
  };

  useEffect(() => {
    const saved = localStorage.getItem("lumina_model_profile_data");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.coverPhoto) setCoverPhoto(parsed.coverPhoto);
        if (parsed.coverFocusY !== undefined) setCoverFocusY(parsed.coverFocusY);
        if (parsed.modelProfile) {
          setModelProfile(parsed.modelProfile);
          if (parsed.modelProfile.selectedCoopModes) setSelectedCoopModes(parsed.modelProfile.selectedCoopModes);
          if (parsed.modelProfile.customCoop1 !== undefined) setCustomCoop1(parsed.modelProfile.customCoop1);
          if (parsed.modelProfile.customCoop2 !== undefined) setCustomCoop2(parsed.modelProfile.customCoop2);
        }
        if (parsed.socialLinks) setSocialLinks(parsed.socialLinks);
        if (parsed.styles) setStyles(parsed.styles);
        if (parsed.boundaries) setBoundaries(parsed.boundaries);
        if (parsed.customStatusList) setCustomStatusList(parsed.customStatusList);
        if (parsed.scheduleData) setScheduleData(parsed.scheduleData);
        if (parsed.monthlyVisibility) setMonthlyVisibility(parsed.monthlyVisibility);
      } catch (e) {
        console.error(e);
      }
    }

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
  }, []);

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPhoto(reader.result as string);
        setCoverFocusY(20);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddStyle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStyleInput.trim()) return;
    if (!styles.includes(newStyleInput.trim())) setStyles([...styles, newStyleInput.trim()]);
    setNewStyleInput("");
  };

  const handleRemoveStyle = (tag: string) => setStyles(styles.filter((s) => s !== tag));

  const handleAddBoundary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBoundaryInput.trim()) return;
    if (!boundaries.includes(newBoundaryInput.trim())) setBoundaries([...boundaries, newBoundaryInput.trim()]);
    setNewBoundaryInput("");
  };

  const handleRemoveBoundary = (tag: string) => setBoundaries(boundaries.filter((b) => b !== tag));

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const allCoopModes = [...selectedCoopModes];
    if (customCoop1.trim()) allCoopModes.push(customCoop1.trim());
    if (customCoop2.trim()) allCoopModes.push(customCoop2.trim());

    const updatedProfile = {
      ...modelProfile,
      selectedCoopModes,
      customCoop1,
      customCoop2,
      allCoopModes,
    };

    const dataToSave = {
      coverPhoto,
      coverFocusY,
      modelProfile: updatedProfile,
      socialLinks,
      styles,
      boundaries,
      customStatusList,
      scheduleData,
      monthlyVisibility,
    };

    localStorage.setItem("lumina_model_profile_data", JSON.stringify(dataToSave));

    const savedUser = localStorage.getItem("lumina_mock_user");
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        if (u.role === "model") {
          u.name = modelProfile.name;
          localStorage.setItem("lumina_mock_user", JSON.stringify(u));
        }
      } catch (err) {
        console.error(err);
      }
    }

    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new Event("lumina_user_updated"));
    alert("✅ 基本資料與接案設定已成功儲存！");
  };

  const daysInMonth = useMemo(() => new Date(viewYear, viewMonth, 0).getDate(), [viewYear, viewMonth]);
  const firstDay = useMemo(() => new Date(viewYear, viewMonth - 1, 1).getDay(), [viewYear, viewMonth]);

  const handleDateClick = (day: number) => {
    if (!isCurrentMonthVisible) return;
    const key = `${viewYear}-${String(viewMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setScheduleData((prev) => {
      const current = prev[key] || "available";
      const nextStatus = current === activeBrushId ? "available" : activeBrushId;
      return { ...prev, [key]: nextStatus };
    });
  };

  return (
    <main className="min-h-[calc(100vh-65px)] bg-stone-100/70 px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* 後台標頭與右側分頁按鈕 */}
        <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-stone-800">模特個人工作室後台</h2>
            <p className="text-xs text-stone-500 mt-1">
              管理封面對焦、商業報價單、排程日曆與隱形安全防護
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3 w-full md:w-auto">
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="px-3.5 py-2 bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <span>📥 邀約審核</span>
            </button>

            <div className="flex flex-wrap bg-[#edeae3]/80 p-1 rounded-xl border border-stone-300">
              <button
                onClick={() => setActiveTab("profile")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeTab === "profile"
                    ? "bg-white text-indigo-700 shadow-xs"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                📝 封面與簡介
              </button>
              {/* 新增：商業報價單分頁 */}
              <button
                onClick={() => setActiveTab("rate_card")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeTab === "rate_card"
                    ? "bg-white text-indigo-700 shadow-xs"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                💰 商業報價單
              </button>
              <button
                onClick={() => setActiveTab("contract_templates")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeTab === "contract_templates"
                    ? "bg-white text-indigo-700 shadow-xs"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                ⚙️ 合約模板
              </button>
              <button
                onClick={() => setActiveTab("schedule")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeTab === "schedule"
                    ? "bg-white text-indigo-700 shadow-xs"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                📅 檔期標籤
              </button>
              <button
                onClick={() => setActiveTab("blacklist")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeTab === "blacklist"
                    ? "bg-white text-rose-700 shadow-xs"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                🚫 隱形黑名單
              </button>
            </div>
          </div>
        </div>

        {/* 依分頁切換各零件 */}
        {activeTab === "profile" && (
          <ProfileTab
            coverPhoto={coverPhoto}
            coverFocusY={coverFocusY}
            setCoverFocusY={setCoverFocusY}
            handleCoverUpload={handleCoverUpload}
            modelProfile={modelProfile}
            setModelProfile={setModelProfile}
            selectedCoopModes={selectedCoopModes}
            toggleCoopMode={toggleCoopMode}
            customCoop1={customCoop1}
            setCustomCoop1={setCustomCoop1}
            customCoop2={customCoop2}
            setCustomCoop2={setCustomCoop2}
            styles={styles}
            newStyleInput={newStyleInput}
            setNewStyleInput={setNewStyleInput}
            handleAddStyle={handleAddStyle}
            handleRemoveStyle={handleRemoveStyle}
            boundaries={boundaries}
            newBoundaryInput={newBoundaryInput}
            setNewBoundaryInput={setNewBoundaryInput}
            handleAddBoundary={handleAddBoundary}
            handleRemoveBoundary={handleRemoveBoundary}
            socialLinks={socialLinks}
            setSocialLinks={setSocialLinks}
            handleSaveProfile={handleSaveProfile}
          />
        )}

        {/* 新增：報價單管理零件 */}
        {activeTab === "rate_card" && (
          <RateCardTab
            rateCardImages={rateCardImages}
            setRateCardImages={setRateCardImages}
            accessMode={rateCardAccessMode}
            setAccessMode={setRateCardAccessMode}
            rateCardRequests={rateCardRequests}
            handleApproveRequest={handleApproveRequest}
            handleDeclineRequest={handleDeclineRequest}
            handleSaveRateCardConfig={handleSaveRateCardConfig}
          />
        )}

        {activeTab === "contract_templates" && (
          <TemplateTab
            templateAcceptMessage={templateAcceptMessage}
            setTemplateAcceptMessage={setTemplateAcceptMessage}
            templateContractBody={templateContractBody}
            setTemplateContractBody={setTemplateContractBody}
            templateDeclineMessage={templateDeclineMessage}
            setTemplateDeclineMessage={setTemplateDeclineMessage}
            handleSaveGlobalTemplates={handleSaveGlobalTemplates}
          />
        )}

        {activeTab === "schedule" && (
          <ScheduleTab
            targetReleaseMonth={targetReleaseMonth}
            setTargetReleaseMonth={setTargetReleaseMonth}
            targetReleaseDateTime={targetReleaseDateTime}
            setTargetReleaseDateTime={setTargetReleaseDateTime}
            availableMonthsList={availableMonthsList}
            handleAddTimedRelease={handleAddTimedRelease}
            timedReleaseTasks={timedReleaseTasks}
            handleExecuteNow={handleExecuteNow}
            handleCancelTimedTask={handleCancelTimedTask}
            customStatusList={customStatusList}
            activeBrushId={activeBrushId}
            setActiveBrushId={setActiveBrushId}
            newStatusName={newStatusName}
            setNewStatusName={setNewStatusName}
            handleAddCustomStatus={handleAddCustomStatus}
            viewYear={viewYear}
            setViewYear={setViewYear}
            viewMonth={viewMonth}
            setViewMonth={setViewMonth}
            monthlyVisibility={monthlyVisibility}
            isCurrentMonthVisible={isCurrentMonthVisible}
            handleToggleMonthVisibility={handleToggleMonthVisibility}
            firstDay={firstDay}
            daysInMonth={daysInMonth}
            scheduleData={scheduleData}
            handleDateClick={handleDateClick}
            handleSaveProfile={handleSaveProfile}
          />
        )}

        {activeTab === "blacklist" && (
          <BlacklistTab
            blacklist={blacklist}
            newBlacklistName={newBlacklistName}
            setNewBlacklistName={setNewBlacklistName}
            newBlacklistReason={newBlacklistReason}
            setNewBlacklistReason={setNewBlacklistReason}
            handleAddBlacklist={handleAddBlacklist}
            handleRemoveBlacklist={handleRemoveBlacklist}
          />
        )}
      </div>
    </main>
  );
}