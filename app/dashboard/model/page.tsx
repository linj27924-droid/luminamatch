"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import ProfileTab from "@/components/dashboard-model/ProfileTab";
import TemplateTab from "@/components/dashboard-model/TemplateTab";
import ScheduleTab, { CustomScheduleStatus, TimedReleaseTask } from "@/components/dashboard-model/ScheduleTab";
import BlacklistTab, { BlacklistedItem } from "@/components/dashboard-model/BlacklistTab";

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
  const [activeTab, setActiveTab] = useState<"profile" | "schedule" | "contract_templates" | "blacklist">("profile");

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

  // ==================== 1. 隱形黑名單狀態 ====================
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
    alert(`🔒 已將【${item.name}】加入隱形黑名單！\n• 對方造訪您的主頁時，日曆將呈現「全月滿檔」無法點選。\n• 對方若強行送出邀約將自動無聲沉入過濾夾，不打草驚蛇。`);
  };

  const handleRemoveBlacklist = (id: string) => {
    const updated = blacklist.filter((b) => b.id !== id);
    setBlacklist(updated);
    localStorage.setItem("lumina_model_blacklist", JSON.stringify(updated));
    alert("已解除該對象之隱形黑名單。");
  };

  // ==================== 2. 邀約審核抽屜與合約狀態 ====================
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
    {
      id: "REQ-20261105-02",
      photographerName: "林光影視覺 (Ray Studio)",
      photographerRating: 5.0,
      photographerHistoryCount: 42,
      completionRate: "100%",
      noShowCount: 0,
      date: "2026-11-05",
      timeSlot: "10:00 - 13:00 (3小時)",
      location: "新北市板橋區自然光攝影棚 (棚費攝影負擔)",
      style: "韓系簡約俐落型錄",
      coopType: "商業有酬",
      remuneration: "NT$ 4,500 (時薪 1500)",
      notes: "純服裝商品型錄，現場有女性助理全程陪同梳化。",
      status: "pending",
    },
  ]);

  const [selectedReqForContract, setSelectedReqForContract] = useState<BookingRequest | null>(null);
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [editableContractText, setEditableContractText] = useState("");
  const [acceptanceMessage, setAcceptanceMessage] = useState("");
  const [isAgreedTerms, setIsAgreedTerms] = useState(false);

  const [selectedReqForDecline, setSelectedReqForDecline] = useState<BookingRequest | null>(null);
  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);
  const [declineReasonText, setDeclineReasonText] = useState("");

  const [isReviewPhotographerModalOpen, setIsReviewPhotographerModalOpen] = useState(false);
  const [reviewingBookingReq, setReviewingBookingReq] = useState<BookingRequest | null>(null);
  const [photographerReviewContent, setPhotographerReviewContent] = useState("");

  // ==================== 3. 封面與簡介狀態 ====================
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

  // ==================== 4. 檔期排程與定時開放 ====================
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
    "2027-1": true,
    "2027-2": false,
    "2027-3": true,
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
    if (!targetReleaseDateTime) {
      alert("請選擇開放預約的精確日期與時間！");
      return;
    }
    const [y, m] = targetReleaseMonth.split("-").map(Number);
    const monthLabel = `${y} 年 ${m} 月`;

    const newTask: TimedReleaseTask = {
      id: `task_${Date.now()}`,
      targetMonthKey: targetReleaseMonth,
      targetMonthLabel: monthLabel,
      releaseDateTime: targetReleaseDateTime,
      isExecuted: false,
      createdAt: new Date().toISOString(),
    };

    setMonthlyVisibility((prev) => ({ ...prev, [targetReleaseMonth]: false }));
    const updatedTasks = [...timedReleaseTasks, newTask];
    setTimedReleaseTasks(updatedTasks);
    localStorage.setItem("lumina_timed_release_tasks", JSON.stringify(updatedTasks));

    alert(`⏰ 定時開放設定成功！\n目標月份：【${monthLabel}】\n預定自動開放時間：【${targetReleaseDateTime.replace("T", " ")}】`);
  };

  const handleCancelTimedTask = (taskId: string) => {
    const updated = timedReleaseTasks.filter((t) => t.id !== taskId);
    setTimedReleaseTasks(updated);
    localStorage.setItem("lumina_timed_release_tasks", JSON.stringify(updated));
    alert("已取消該定時開放任務。");
  };

  const handleExecuteNow = (task: TimedReleaseTask) => {
    setMonthlyVisibility((prev) => ({ ...prev, [task.targetMonthKey]: true }));
    const updated = timedReleaseTasks.map((t) => (t.id === task.id ? { ...t, isExecuted: true } : t));
    setTimedReleaseTasks(updated);
    localStorage.setItem("lumina_timed_release_tasks", JSON.stringify(updated));
    alert(`🎉 已立即提前開放【${task.targetMonthLabel}】！`);
  };

  // 定時檢查
  useEffect(() => {
    const checkTimer = () => {
      const now = new Date();
      let hasChanges = false;
      const updatedTasks = timedReleaseTasks.map((task) => {
        if (!task.isExecuted) {
          const taskTime = new Date(task.releaseDateTime);
          if (now >= taskTime) {
            setMonthlyVisibility((prev) => ({ ...prev, [task.targetMonthKey]: true }));
            hasChanges = true;
            return { ...task, isExecuted: true };
          }
        }
        return task;
      });

      if (hasChanges) {
        setTimedReleaseTasks(updatedTasks);
        localStorage.setItem("lumina_timed_release_tasks", JSON.stringify(updatedTasks));
      }
    };

    checkTimer();
    const interval = setInterval(checkTimer, 3000);
    return () => clearInterval(interval);
  }, [timedReleaseTasks]);

  // 讀取既有設定
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

    const savedTasks = localStorage.getItem("lumina_timed_release_tasks");
    if (savedTasks) {
      try {
        setTimedReleaseTasks(JSON.parse(savedTasks));
      } catch (e) {
        console.error(e);
      }
    }

    const savedTemplates = localStorage.getItem("lumina_model_contract_templates");
    if (savedTemplates) {
      try {
        const parsedT = JSON.parse(savedTemplates);
        if (parsedT.templateAcceptMessage) setTemplateAcceptMessage(parsedT.templateAcceptMessage);
        if (parsedT.templateContractBody) setTemplateContractBody(parsedT.templateContractBody);
        if (parsedT.templateDeclineMessage) setTemplateDeclineMessage(parsedT.templateDeclineMessage);
      } catch (e) {
        console.error(e);
      }
    }

    const savedBlacklist = localStorage.getItem("lumina_model_blacklist");
    if (savedBlacklist) {
      try {
        setBlacklist(JSON.parse(savedBlacklist));
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
    alert("✅ 設定已成功儲存！頂部名稱、大廳標籤與排程已同步更新。");
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

  const buildFullContract = (req: BookingRequest) => {
    return `【LuminaMatch 攝影合作電子存證協議書】
合約編號：${req.id}
甲方 (邀約攝影)：${req.photographerName}
乙方 (受約模特)：${modelProfile.name}
約定時段：${req.date} ${req.timeSlot}
拍攝地點：${req.location}
合作性質：${req.coopType}
預定風格：${req.style}

${templateContractBody}`;
  };

  const handleOpenContractModal = (req: BookingRequest) => {
    setSelectedReqForContract(req);
    setEditableContractText(req.customContractText || buildFullContract(req));
    setAcceptanceMessage(req.modelReplyMessage || templateAcceptMessage);
    setIsAgreedTerms(false);
    setIsContractModalOpen(true);
  };

  const handleConfirmAcceptWithContract = () => {
    if (!selectedReqForContract) return;
    if (!isAgreedTerms) {
      alert("請勾選確認已同意您自訂/編輯後的合約條款與 No-Show 約定！");
      return;
    }
    setBookingRequests((prev) =>
      prev.map((r) =>
        r.id === selectedReqForContract.id
          ? {
              ...r,
              status: "accepted",
              customContractText: editableContractText,
              modelReplyMessage: acceptanceMessage,
            }
          : r
      )
    );
    const dateKey = selectedReqForContract.date;
    setScheduleData((prev) => ({ ...prev, [dateKey]: "private_booked" }));
    setIsContractModalOpen(false);
    setSelectedReqForContract(null);
    setIsAgreedTerms(false);
    alert(`🎉 成功同意邀約！檔期已鎖定 ${dateKey}。`);
  };

  const handleOpenDeclineModal = (req: BookingRequest) => {
    setSelectedReqForDecline(req);
    setDeclineReasonText(templateDeclineMessage);
    setIsDeclineModalOpen(true);
  };

  const handleConfirmDecline = () => {
    if (!selectedReqForDecline) return;
    setBookingRequests((prev) =>
      prev.map((r) =>
        r.id === selectedReqForDecline.id
          ? { ...r, status: "declined", modelReplyMessage: declineReasonText }
          : r
      )
    );
    setIsDeclineModalOpen(false);
    alert(`已向攝影師送出婉拒回覆文章。`);
    setSelectedReqForDecline(null);
  };

  const handleDeclineAndQuietBlock = (req: BookingRequest) => {
    const isConfirm = window.confirm(
      `確定要謝絕並「靜默封鎖」【${req.photographerName}】嗎？`
    );
    if (!isConfirm) return;
    setBookingRequests((prev) =>
      prev.map((r) =>
        r.id === req.id
          ? { ...r, status: "declined", modelReplyMessage: "檔期已滿，暫無合適時間，謝謝詢問！" }
          : r
      )
    );
    const exists = blacklist.some((b) => b.name === req.photographerName);
    if (!exists) {
      const item: BlacklistedItem = {
        id: `bl_${Date.now()}`,
        name: req.photographerName,
        reason: "從邀約審核抽屜執行靜默封鎖",
        dateAdded: new Date().toISOString().split("T")[0],
      };
      const updated = [...blacklist, item];
      setBlacklist(updated);
      localStorage.setItem("lumina_model_blacklist", JSON.stringify(updated));
    }
    alert(`🛡️ 已成功執行！已禮貌謝絕並將【${req.photographerName}】移入隱形防護名單。`);
  };

  const handleSubmitPhotographerReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewingBookingReq || !photographerReviewContent.trim()) return;
    const newPeerReview = {
      id: `review_m_${Date.now()}`,
      targetId: reviewingBookingReq.photographerName,
      targetType: "photographer",
      authorRole: "model",
      authorName: `模特 ${modelProfile.name}（已官方驗證）`,
      date: new Date().toISOString().split("T")[0],
      tags: ["安全尊重", "守時不拖拉", "依約交圖"],
      content: photographerReviewContent.trim(),
      safetyRating: 5.0,
    };
    const existing = localStorage.getItem("lumina_peer_reviews");
    const arr = existing ? JSON.parse(existing) : [];
    arr.push(newPeerReview);
    localStorage.setItem("lumina_peer_reviews", JSON.stringify(arr));
    setBookingRequests((prev) =>
      prev.map((b) => (b.id === reviewingBookingReq.id ? { ...b, hasReviewed: true } : b))
    );
    setIsReviewPhotographerModalOpen(false);
    setPhotographerReviewContent("");
    alert("🎉 評價已成功發布！該評價僅對【模特同行】公開！");
  };

  const pendingCount = bookingRequests.filter((r) => r.status === "pending").length;

  return (
    <main className="min-h-[calc(100vh-65px)] bg-stone-100/70 px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* 後台標頭：左側標題，右側對齊所有按鈕群 */}
        <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-stone-800">模特個人工作室後台</h2>
            <p className="text-xs text-stone-500 mt-1">
              管理大廳 1:1 封面顯示對焦、合約回覆模板、排程日曆與隱形安全防護
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3 w-full md:w-auto">
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="px-3.5 py-2 bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <span>📥 邀約審核</span>
              {pendingCount > 0 && (
                <span className="w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] flex items-center justify-center font-bold">
                  {pendingCount}
                </span>
              )}
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
              <button
                onClick={() => setActiveTab("contract_templates")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeTab === "contract_templates"
                    ? "bg-white text-indigo-700 shadow-xs"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                ⚙️ 合約回覆模板
              </button>
              <button
                onClick={() => setActiveTab("schedule")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeTab === "schedule"
                    ? "bg-white text-indigo-700 shadow-xs"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                📅 檔期日曆標籤
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

        {/* 依分頁載入對應獨立零件 */}
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

      {/* 抽屜組件：邀約審核 */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-stone-900/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsDrawerOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-lg bg-[#fbfaf8] border-l border-stone-200 shadow-2xl flex flex-col">
              <div className="p-5 border-b border-stone-200 flex justify-between items-center bg-[#f5f3ef]">
                <div>
                  <h3 className="font-bold text-stone-800 text-base flex items-center gap-2">
                    📥 約拍邀約審核抽屜
                    {pendingCount > 0 && (
                      <span className="px-2 py-0.5 bg-rose-500 text-white text-[10px] font-bold rounded-full">
                        {pendingCount} 則待回覆
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    點擊攝影師姓名可檢視主頁，審核自動帶入您的預設合約模板
                  </p>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="w-8 h-8 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-700 flex items-center justify-center font-bold text-sm cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="p-5 overflow-y-auto space-y-4 flex-1">
                {bookingRequests.map((req) => (
                  <div key={req.id} className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-bold rounded">
                            {req.coopType}
                          </span>
                          <span className="text-[10px] text-stone-400 font-mono">{req.id}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/photographer/${encodeURIComponent(req.photographerName)}`}
                            className="font-bold text-stone-900 text-sm hover:text-indigo-600 hover:underline flex items-center gap-1 group"
                          >
                            <span>{req.photographerName}</span>
                            <span className="text-[11px] text-indigo-500 group-hover:translate-x-0.5 transition">➔</span>
                          </Link>
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                          <span className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded text-[10px] font-bold">
                            ★ {req.photographerRating} 評分
                          </span>
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-[10px] font-bold">
                            {req.completionRate} 完成率
                          </span>
                          <span className="px-2 py-0.5 bg-stone-100 text-stone-700 border border-stone-200 rounded text-[10px] font-medium">
                            {req.photographerHistoryCount} 次合作
                          </span>
                          <span className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded text-[10px] font-medium">
                            {req.noShowCount} 次放鳥
                          </span>
                        </div>
                      </div>
                      <div>
                        {req.status === "pending" && (
                          <span className="px-2.5 py-0.5 bg-amber-50 text-amber-800 border border-amber-300 text-[11px] font-bold rounded-full">待回覆</span>
                        )}
                        {req.status === "accepted" && (
                          <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-300 text-[11px] font-bold rounded-full">✓ 已接受</span>
                        )}
                        {req.status === "declined" && (
                          <span className="px-2.5 py-0.5 bg-stone-100 text-stone-500 border border-stone-300 text-[11px] font-bold rounded-full">✕ 已謝絕</span>
                        )}
                        {req.status === "completed" && (
                          <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-800 border border-indigo-300 text-[11px] font-bold rounded-full">★ 接案完成</span>
                        )}
                      </div>
                    </div>

                    <div className="text-xs bg-[#f5f3ef] p-3 rounded-lg space-y-1 text-stone-700">
                      <p><strong>時段：</strong>{req.date} {req.timeSlot}</p>
                      <p><strong>地點：</strong>{req.location}</p>
                      <p><strong>風格：</strong>{req.style}</p>
                      {req.remuneration && (
                        <p className="text-indigo-700 font-bold"><strong>酬勞：</strong>{req.remuneration}</p>
                      )}
                      <p className="text-stone-500"><strong>備註：</strong>{req.notes}</p>
                    </div>

                    {req.status === "pending" ? (
                      <div className="space-y-2 pt-1">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenContractModal(req)}
                            className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
                          >
                            📜 帶入合約並同意
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenDeclineModal(req)}
                            className="px-3.5 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-lg text-xs font-bold transition cursor-pointer"
                          >
                            謝絕
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeclineAndQuietBlock(req)}
                          className="w-full py-1.5 bg-stone-100 hover:bg-rose-50 text-stone-500 hover:text-rose-700 border border-stone-200 rounded-lg text-[11px] font-semibold transition flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <span>🚫 謝絕並啟動「隱形封鎖」</span>
                          <span className="text-[10px] text-stone-400">(對方日曆全滿+幽靈過濾)</span>
                        </button>
                      </div>
                    ) : req.status === "completed" ? (
                      <div className="pt-1 flex justify-between items-center">
                        <span className="text-[11px] text-emerald-700 font-semibold">✓ 現場已雙向核銷履約完畢</span>
                        <button
                          type="button"
                          disabled={req.hasReviewed}
                          onClick={() => {
                            setReviewingBookingReq(req);
                            setIsReviewPhotographerModalOpen(true);
                          }}
                          className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 disabled:bg-stone-300 text-white font-bold rounded-lg text-xs transition cursor-pointer"
                        >
                          {req.hasReviewed ? "✓ 已送出同行手札" : "✍️ 填寫同行評價 (僅模特可見)"}
                        </button>
                      </div>
                    ) : req.status === "accepted" ? (
                      <div className="space-y-1">
                        <p className="text-[11px] text-emerald-700 font-semibold">✓ 雙向電子存證已生效，檔期已鎖定。</p>
                        {req.modelReplyMessage && (
                          <p className="text-[11px] text-stone-500 italic bg-stone-50 p-2 rounded">回覆留言：「{req.modelReplyMessage}」</p>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <p className="text-[11px] text-stone-400">已向對方發送謝絕回覆。</p>
                        {req.modelReplyMessage && (
                          <p className="text-[11px] text-stone-400 italic bg-stone-50 p-2 rounded">婉拒理由：「{req.modelReplyMessage}」</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 彈窗 1：同意邀約與合約存證 */}
      {isContractModalOpen && selectedReqForContract && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#fbfaf8] rounded-2xl max-w-2xl w-full p-6 shadow-xl border border-stone-200 max-h-[92vh] flex flex-col">
            <div className="flex justify-between items-center pb-3 border-b border-stone-200">
              <div>
                <h3 className="font-bold text-stone-900 text-base">📜 同意邀約與合約存證 (已自動帶入模板)</h3>
                <p className="text-[11px] text-stone-400 mt-0.5">邀約編號：{selectedReqForContract.id} ｜ 攝影師：{selectedReqForContract.photographerName}</p>
              </div>
              <button onClick={() => setIsContractModalOpen(false)} className="text-stone-400 hover:text-stone-600 text-lg font-bold cursor-pointer">✕</button>
            </div>
            <div className="overflow-y-auto space-y-4 my-4 pr-1 flex-1">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">💬 給攝影師的同意回覆留言 (已帶入預設文章，可微調)：</label>
                <textarea
                  rows={2}
                  value={acceptanceMessage}
                  onChange={(e) => setAcceptanceMessage(e.target.value)}
                  className="w-full text-xs bg-white text-stone-800 border border-stone-300 rounded-xl p-2.5 outline-none focus:border-indigo-500 leading-relaxed font-medium"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-stone-800">📜 合作合約條款 (已帶入預設條款，可手動修改)：</label>
                  <button
                    type="button"
                    onClick={() => setEditableContractText(buildFullContract(selectedReqForContract))}
                    className="text-[11px] text-indigo-600 hover:underline font-bold cursor-pointer"
                  >
                    ↺ 重新套用最新預設模板
                  </button>
                </div>
                <textarea
                  rows={12}
                  value={editableContractText}
                  onChange={(e) => setEditableContractText(e.target.value)}
                  className="w-full text-xs font-mono bg-white text-stone-800 border border-stone-300 rounded-xl p-3 outline-none focus:border-indigo-500 leading-relaxed"
                />
              </div>
            </div>
            <div className="pt-3 border-t border-stone-200 space-y-3">
              <label className="flex items-center gap-2 text-xs font-bold text-stone-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAgreedTerms}
                  onChange={(e) => setIsAgreedTerms(e.target.checked)}
                  className="accent-indigo-600 w-4 h-4 rounded cursor-pointer"
                />
                <span>本人已確認上述條款與回覆留言，同意正式簽署並鎖定檔期。</span>
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={!isAgreedTerms}
                  onClick={handleConfirmAcceptWithContract}
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-stone-300 text-white font-bold rounded-xl text-xs transition shadow-xs cursor-pointer"
                >
                  ✍️ 電子簽章確認 ➔ 送出同意並鎖定檔期
                </button>
                <button
                  type="button"
                  onClick={() => setIsContractModalOpen(false)}
                  className="px-4 py-3 bg-stone-200 text-stone-700 font-bold rounded-xl text-xs cursor-pointer"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 彈窗 2：婉拒邀約 */}
      {isDeclineModalOpen && selectedReqForDecline && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#fbfaf8] rounded-2xl max-w-md w-full p-6 shadow-xl border border-stone-200">
            <h3 className="font-bold text-stone-900 text-base mb-1">婉拒約拍邀約</h3>
            <p className="text-xs text-stone-500 mb-4">向攝影師【{selectedReqForDecline.photographerName}】發送謝絕通知：</p>
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-stone-800">謝絕回覆文章 (已自動帶入預設模板，可微調)：</label>
                <button
                  type="button"
                  onClick={() => setDeclineReasonText(templateDeclineMessage)}
                  className="text-[11px] text-indigo-600 hover:underline font-bold cursor-pointer"
                >
                  ↺ 套用預設
                </button>
              </div>
              <textarea
                rows={4}
                value={declineReasonText}
                onChange={(e) => setDeclineReasonText(e.target.value)}
                className="w-full text-xs bg-white text-stone-800 border border-stone-300 rounded-xl p-2.5 outline-none focus:border-indigo-500 leading-relaxed font-medium"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleConfirmDecline}
                className="flex-1 py-2.5 bg-rose-700 hover:bg-rose-800 text-white font-bold rounded-xl text-xs transition cursor-pointer"
              >
                確認並送出謝絕通知
              </button>
              <button
                type="button"
                onClick={() => setIsDeclineModalOpen(false)}
                className="px-4 py-2.5 bg-stone-200 text-stone-700 font-bold rounded-xl text-xs cursor-pointer"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 彈窗 3：評價攝影師 */}
      {isReviewPhotographerModalOpen && reviewingBookingReq && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#fbfaf8] rounded-2xl max-w-md w-full p-6 shadow-xl border border-stone-200">
            <div className="flex justify-between items-center pb-2 border-b border-stone-200 mb-3">
              <h3 className="font-bold text-stone-900 text-base">✍️ 撰寫模特同行備忘手札 (評價攝影師)</h3>
              <button onClick={() => setIsReviewPhotographerModalOpen(false)} className="text-stone-400 font-bold cursor-pointer">✕</button>
            </div>
            <p className="text-xs text-stone-500 mb-3">受評攝影師：<strong>{reviewingBookingReq.photographerName}</strong>（此評價僅對<strong>【模特同行】</strong>解鎖，攝影師完全無法查閱）</p>
            <form onSubmit={handleSubmitPhotographerReview} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">同行專屬避坑手札心得：</label>
                <textarea
                  rows={4}
                  required
                  value={photographerReviewContent}
                  onChange={(e) => setPhotographerReviewContent(e.target.value)}
                  placeholder="客觀描述現場是否嚴守人身界線、有無非必要肢體碰觸、是否依約準時交圖、溝通態度..."
                  className="w-full text-xs bg-white text-stone-800 border border-stone-300 rounded-xl p-2.5 outline-none focus:border-indigo-500"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition cursor-pointer"
                >
                  確認發布同行手札
                </button>
                <button
                  type="button"
                  onClick={() => setIsReviewPhotographerModalOpen(false)}
                  className="px-4 py-2.5 bg-stone-200 text-stone-700 font-bold rounded-xl text-xs cursor-pointer"
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