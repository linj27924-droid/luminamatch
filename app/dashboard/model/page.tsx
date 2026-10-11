"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";

// 自訂排程狀態定義
interface CustomScheduleStatus {
  id: string;
  name: string;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  isBookable: boolean;
}

// 邀約項目介面
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

// 黑名單項目介面
interface BlacklistedItem {
  id: string;
  name: string;
  reason: string;
  dateAdded: string;
}

export default function ModelDashboardPage() {
  // 分頁切換：簡介設定 vs 合約回覆模板 vs 檔期日曆 vs 隱形黑名單
  const [activeTab, setActiveTab] = useState<"profile" | "schedule" | "contract_templates" | "blacklist">("profile");

  // ==================== 0. 合約與回覆預設全域模板狀態 ====================
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
    const templates = {
      templateAcceptMessage,
      templateContractBody,
      templateDeclineMessage,
    };
    localStorage.setItem("lumina_model_contract_templates", JSON.stringify(templates));
    alert("✅ 預設合約內容、同意回覆文章與謝絕理由已成功儲存！審核邀約時將自動全數帶入。");
  };

  // ==================== 1. 隱形黑名單管理狀態 (方案 A + 方案 B) ====================
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

  const buildFullContract = (req: BookingRequest) => {
    return `【LuminaMatch 攝影合作電子存證協議書】
合約編號：${req.id}
甲方 (邀約攝影)：${req.photographerName}
乙方 (受約模特)：羽晴 (Hane)
約定時段：${req.date} ${req.timeSlot}
拍攝地點：${req.location}
合作性質：${req.coopType}
預定風格：${req.style}

${templateContractBody}`;
  };

  const [selectedReqForContract, setSelectedReqForContract] = useState<BookingRequest | null>(null);
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [editableContractText, setEditableContractText] = useState("");
  const [acceptanceMessage, setAcceptanceMessage] = useState("");
  const [isAgreedTerms, setIsAgreedTerms] = useState(false);

  const [selectedReqForDecline, setSelectedReqForDecline] = useState<BookingRequest | null>(null);
  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);
  const [declineReasonText, setDeclineReasonText] = useState("");

  // 評價攝影師彈窗狀態 (同行專屬)
  const [isReviewPhotographerModalOpen, setIsReviewPhotographerModalOpen] = useState(false);
  const [reviewingBookingReq, setReviewingBookingReq] = useState<BookingRequest | null>(null);
  const [photographerReviewContent, setPhotographerReviewContent] = useState("");

  // ==================== 3. 封面相片與 1:1 對焦平移設定 ====================
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

  // 新增：接案合作模式選項狀態
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

  // ==================== 4. 自訂排程標籤管理 ====================
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

  useEffect(() => {
    const saved = localStorage.getItem("lumina_model_profile_data");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.coverPhoto) setCoverPhoto(parsed.coverPhoto);
        if (parsed.coverFocusY !== undefined) setCoverFocusY(parsed.coverFocusY);
        if (parsed.modelProfile) {
          setModelProfile(parsed.modelProfile);
          if (parsed.modelProfile.selectedCoopModes) {
            setSelectedCoopModes(parsed.modelProfile.selectedCoopModes);
          }
          if (parsed.modelProfile.customCoop1 !== undefined) {
            setCustomCoop1(parsed.modelProfile.customCoop1);
          }
          if (parsed.modelProfile.customCoop2 !== undefined) {
            setCustomCoop2(parsed.modelProfile.customCoop2);
          }
        }
        if (parsed.socialLinks) setSocialLinks(parsed.socialLinks);
        if (parsed.styles) setStyles(parsed.styles);
        if (parsed.boundaries) setBoundaries(parsed.boundaries);
        if (parsed.customStatusList) setCustomStatusList(parsed.customStatusList);
        if (parsed.scheduleData) setScheduleData(parsed.scheduleData);
      } catch (e) {
        console.error("載入失敗", e);
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
        console.error("載入模板失敗", e);
      }
    }

    const savedBlacklist = localStorage.getItem("lumina_model_blacklist");
    if (savedBlacklist) {
      try {
        setBlacklist(JSON.parse(savedBlacklist));
      } catch (e) {
        console.error("載入黑名單失敗", e);
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

  // 儲存所有個人設定（同步更新頂部 Navbar 名稱與大廳標籤）
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();

    // 整合所有接案標籤（主流 + 2 個自訂）供大廳直接顯示
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
    };

    // 1. 存入模特個人檔案庫
    localStorage.setItem("lumina_model_profile_data", JSON.stringify(dataToSave));

    // 2. 同步更新當前登入者名稱快取 (讓頂部 Navbar 立即變更)
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

    // 3. 派發事件讓頂部 Navbar 重新渲染
    window.dispatchEvent(new Event("storage"));

    alert("✅ 個人簡介、封面位置、接案選項、風格標籤與排程設定已成功儲存！頂部名稱與大廳標籤已同步更新。");
  };

  // ==================== 5. 檔期排程日曆狀態 ====================
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
    setScheduleData((prev) => ({
      ...prev,
      [dateKey]: "private_booked",
    }));

    setIsContractModalOpen(false);
    setSelectedReqForContract(null);
    setIsAgreedTerms(false);
    alert(`🎉 成功同意邀約！\n合約與回覆留言已生效存證，已自動鎖定 ${dateKey} 檔期！`);
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
      `確定要謝絕並「靜默封鎖」【${req.photographerName}】嗎？\n\n系統將自動執行：\n1. 向對方送出禮貌婉拒\n2. 對方未來造訪您的主頁時，日曆將偽裝全滿（灰色不可點）\n3. 對方若強行送出約拍將自動被幽靈過濾，不干擾您的正常接案！`
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
      authorName: `模特 ${modelProfile.name.split(" ")[0]}（已官方驗證）`,
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
    alert("🎉 評價已成功發布！該評價僅對【模特同行】公開，攝影師端完全無法查閱，感謝您的安全守護手札！");
  };

  const pendingCount = bookingRequests.filter((r) => r.status === "pending").length;

  return (
    <main className="min-h-[calc(100vh-65px)] bg-stone-100/70 px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* 後台標頭與分頁切換 */}
        <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-6 shadow-sm flex flex-wrap justify-between items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-stone-800">模特個人工作室後台</h2>
            <p className="text-xs text-stone-500 mt-1">
              管理大廳 1:1 封面顯示對焦、合約回覆模板、排程日曆與隱形安全防護
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="px-3.5 py-2 bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
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
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeTab === "profile"
                    ? "bg-white text-indigo-700 shadow-xs"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                📝 封面與簡介
              </button>
              <button
                onClick={() => setActiveTab("contract_templates")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeTab === "contract_templates"
                    ? "bg-white text-indigo-700 shadow-xs"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                ⚙️ 合約回覆模板
              </button>
              <button
                onClick={() => setActiveTab("schedule")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeTab === "schedule"
                    ? "bg-white text-indigo-700 shadow-xs"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                📅 檔期日曆標籤
              </button>
              <button
                onClick={() => setActiveTab("blacklist")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
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

        {/* ==================== 分頁 1：個人簡介與 1:1 封面平移對焦 ==================== */}
        {activeTab === "profile" && (
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="border-b border-stone-200 pb-2 flex justify-between items-center">
                <h3 className="text-sm font-bold text-stone-800">
                  大廳 1:1 正方形封面與位置微調
                </h3>
                <span className="text-[11px] text-indigo-700 font-semibold bg-indigo-50 px-2 py-0.5 rounded">
                  ✦ 方框提示已啟用，避免切到頭部
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
                      大廳 1:1 實際呈現效果
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-2 text-center">
                    ↑ 此方框即為訪客在大廳第一眼看到的 1:1 完整範圍
                  </p>
                </div>

                <div className="space-y-5 bg-[#f5f3ef] p-5 rounded-2xl border border-stone-300/80">
                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1">
                      上下平移對焦點 (垂直位置)：{coverFocusY}%
                    </label>
                    <p className="text-[11px] text-stone-500 mb-3">
                      滑動滑桿將視覺中心定在臉部或上半身，防止頭部被切掉：
                    </p>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={coverFocusY}
                      onChange={(e) => setCoverFocusY(Number(e.target.value))}
                      className="w-full accent-indigo-600 cursor-pointer h-2 bg-stone-300 rounded-lg"
                    />
                    <div className="flex justify-between text-[10px] text-stone-500 mt-1 font-semibold">
                      <span>頂部 (頭頂/臉部 0%)</span>
                      <span>中間 (50%)</span>
                      <span>底部 (腳部 100%)</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-stone-300">
                    <label className="inline-block cursor-pointer px-4 py-2.5 bg-stone-800 hover:bg-stone-900 text-white text-xs font-bold rounded-xl transition shadow-xs">
                      📁 更換封面照片檔案
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverUpload}
                        className="hidden"
                      />
                    </label>
                    <p className="text-[11px] text-stone-400 mt-2">
                      支援上傳直式全身照或橫式大景，上傳後即可使用上方滑桿自由調整。
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-6 shadow-sm space-y-5">
              <h3 className="text-sm font-bold text-stone-800 border-b border-stone-200 pb-2">
                基本資料與安全隱私
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">藝名 / 稱呼</label>
                  <input
                    type="text"
                    value={modelProfile.name}
                    onChange={(e) => setModelProfile({ ...modelProfile, name: e.target.value })}
                    className="w-full text-sm bg-[#f5f3ef] text-stone-800 placeholder:text-stone-400 font-medium border border-stone-300 rounded-lg p-2.5 outline-none focus:border-indigo-500 focus:bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">主要接案城市</label>
                  <input
                    type="text"
                    value={modelProfile.city}
                    onChange={(e) => setModelProfile({ ...modelProfile, city: e.target.value })}
                    className="w-full text-sm bg-[#f5f3ef] text-stone-800 placeholder:text-stone-400 font-medium border border-stone-300 rounded-lg p-2.5 outline-none focus:border-indigo-500 focus:bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">接案年資 (年)</label>
                  <input
                    type="text"
                    value={modelProfile.experienceYears}
                    onChange={(e) => setModelProfile({ ...modelProfile, experienceYears: e.target.value })}
                    className="w-full text-sm bg-[#f5f3ef] text-stone-800 placeholder:text-stone-400 font-medium border border-stone-300 rounded-lg p-2.5 outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">身高 (cm)</label>
                  <input
                    type="text"
                    value={modelProfile.height}
                    onChange={(e) => setModelProfile({ ...modelProfile, height: e.target.value })}
                    className="w-full text-sm bg-[#f5f3ef] text-stone-800 placeholder:text-stone-400 font-medium border border-stone-300 rounded-lg p-2.5 outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-stone-700">體重 (kg)</label>
                    <label className="flex items-center gap-1 text-[11px] font-semibold text-stone-500 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={modelProfile.hideWeight}
                        onChange={(e) => setModelProfile({ ...modelProfile, hideWeight: e.target.checked })}
                        className="rounded accent-indigo-600"
                      />
                      公開頁面隱藏
                    </label>
                  </div>
                  <input
                    type="text"
                    value={modelProfile.weight}
                    disabled={modelProfile.hideWeight}
                    onChange={(e) => setModelProfile({ ...modelProfile, weight: e.target.value })}
                    className={`w-full text-sm font-medium border border-stone-300 rounded-lg p-2.5 outline-none ${
                      modelProfile.hideWeight
                        ? "bg-stone-200/50 text-stone-400 cursor-not-allowed"
                        : "bg-[#f5f3ef] text-stone-800 focus:border-indigo-500 focus:bg-white"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">三圍尺寸</label>
                  <input
                    type="text"
                    value={modelProfile.measurements}
                    onChange={(e) => setModelProfile({ ...modelProfile, measurements: e.target.value })}
                    className="w-full text-sm bg-[#f5f3ef] text-stone-800 placeholder:text-stone-400 font-medium border border-stone-300 rounded-lg p-2.5 outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* ==================== 新增：接案合作模式選項 (主流 4 項 + 自訂 2 項空白) ==================== */}
              <div className="pt-3 border-t border-stone-200 space-y-3">
                <div>
                  <label className="block text-xs font-bold text-stone-800">
                    💰 接案合作模式 (會同步顯示於大廳下方標籤)
                  </label>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    勾選您接受的合作形式，或於下方自訂新增專屬合作條款：
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { id: "商業有酬", label: "商業有酬 (有預算商案優先)" },
                    { id: "互惠創作 (TFCD)", label: "互惠創作 (TFCD 雙向互免)" },
                    { id: "車馬費補貼", label: "車馬費 / 梳化治裝補貼" },
                    { id: "棚費平攤", label: "租棚費 / 場地門票雙方平攤" },
                  ].map((item) => {
                    const isChecked = selectedCoopModes.includes(item.id);
                    return (
                      <label
                        key={item.id}
                        onClick={() => toggleCoopMode(item.id)}
                        className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition ${
                          isChecked
                            ? "bg-amber-50 border-amber-300 text-amber-900 font-bold"
                            : "bg-[#f5f3ef] border-stone-300 text-stone-700 hover:bg-[#eae7e1] font-medium"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="w-3.5 h-3.5 text-amber-600 rounded"
                        />
                        <span className="text-xs">{item.label}</span>
                      </label>
                    );
                  })}
                </div>

                <div className="space-y-2 pt-1">
                  <span className="text-[11px] font-bold text-stone-700 block">
                    ✦ 自訂接案模式（開放 2 組空白自填）：
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={customCoop1}
                      onChange={(e) => setCustomCoop1(e.target.value)}
                      placeholder="自訂模式 1 (例：品牌贊助置換、分潤合作)"
                      className="w-full text-xs bg-[#f5f3ef] text-stone-800 placeholder:text-stone-400 font-medium border border-stone-300 rounded-lg p-2.5 outline-none focus:border-indigo-500 focus:bg-white"
                    />
                    <input
                      type="text"
                      value={customCoop2}
                      onChange={(e) => setCustomCoop2(e.target.value)}
                      placeholder="自訂模式 2 (例：需提前支付 30% 定金)"
                      className="w-full text-xs bg-[#f5f3ef] text-stone-800 placeholder:text-stone-400 font-medium border border-stone-300 rounded-lg p-2.5 outline-none focus:border-indigo-500 focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  外拍安全守則：是否攜伴 (親友同行)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { val: "必攜伴 (親友全程陪同)", desc: "外景或首次約拍全程由親友陪同" },
                    { val: "可攜伴 (親友同行)", desc: "視外景地點或個人當日狀況決定" },
                    { val: "可單獨前往", desc: "信任熟識攝影師或公開場合可單獨作業" },
                  ].map((item) => (
                    <button
                      key={item.val}
                      type="button"
                      onClick={() => setModelProfile({ ...modelProfile, companionPolicy: item.val })}
                      className={`p-3 text-left rounded-xl border transition ${
                        modelProfile.companionPolicy === item.val
                          ? "bg-indigo-50/90 border-indigo-500 text-indigo-900 shadow-xs"
                          : "bg-[#f5f3ef] border-stone-300 text-stone-700 hover:bg-[#eae7e1]"
                      }`}
                    >
                      <div className="text-xs font-bold">{item.val}</div>
                      <div className="text-[10px] text-stone-500 mt-0.5">{item.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">個人主頁詳細介紹 (Bio)</label>
                <textarea
                  rows={4}
                  value={modelProfile.bio}
                  onChange={(e) => setModelProfile({ ...modelProfile, bio: e.target.value })}
                  className="w-full text-sm bg-[#f5f3ef] text-stone-800 placeholder:text-stone-400 font-medium border border-stone-300 rounded-lg p-2.5 outline-none focus:border-indigo-500 focus:bg-white leading-relaxed"
                />
              </div>
            </div>

            {/* 風格標籤與接案邊界 */}
            <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-6 shadow-sm space-y-5">
              <h3 className="text-sm font-bold text-stone-800 border-b border-stone-200 pb-2">
                風格標籤與接案邊界 (防騷擾機制)
              </h3>

              <div>
                <label className="block text-xs font-bold text-emerald-800 mb-2">
                  🟢 可接拍攝風格標籤
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {styles.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-semibold flex items-center gap-1.5"
                    >
                      ✓ {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveStyle(tag)}
                        className="text-emerald-600 hover:text-emerald-900 font-bold ml-1"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2 max-w-sm">
                  <input
                    type="text"
                    value={newStyleInput}
                    onChange={(e) => setNewStyleInput(e.target.value)}
                    placeholder="新增風格 (例：古風漢服)"
                    className="flex-1 text-xs bg-[#f5f3ef] text-stone-800 placeholder:text-stone-400 font-medium border border-stone-300 rounded-lg p-2 outline-none focus:border-indigo-500 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddStyle}
                    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition"
                  >
                    新增標籤
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-200">
                <label className="block text-xs font-bold text-rose-800 mb-2">
                  🔴 拍攝禁忌與拒絕尺度 (醒目標註)
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {boundaries.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-rose-50 text-rose-800 border border-rose-300 rounded-lg text-xs font-semibold flex items-center gap-1.5"
                    >
                      ✕ {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveBoundary(tag)}
                        className="text-rose-600 hover:text-rose-900 font-bold ml-1"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2 max-w-sm">
                  <input
                    type="text"
                    value={newBoundaryInput}
                    onChange={(e) => setNewBoundaryInput(e.target.value)}
                    placeholder="新增禁忌 (例：不拍內衣/睡衣)"
                    className="flex-1 text-xs bg-[#f5f3ef] text-stone-800 placeholder:text-stone-400 font-medium border border-stone-300 rounded-lg p-2 outline-none focus:border-indigo-500 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddBoundary}
                    className="px-3 py-1.5 bg-rose-700 hover:bg-rose-800 text-white rounded-lg text-xs font-bold transition"
                  >
                    新增禁忌
                  </button>
                </div>
              </div>
            </div>

            {/* 5 組社群連結 */}
            <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-stone-800 border-b border-stone-200 pb-2">
                公開社群與作品連結 (最多 5 組)
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
                儲存所有個人簡介、封面位置與設定
              </button>
            </div>
          </form>
        )}

        {/* ==================== 分頁 2：全域合約範本與回覆模板設定 ==================== */}
        {activeTab === "contract_templates" && (
          <form onSubmit={handleSaveGlobalTemplates} className="space-y-6">
            <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="border-b border-stone-200 pb-2">
                <h3 className="text-sm font-bold text-stone-800">
                  ⚙️ 預設合約存證內容與回覆範本設定
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  在此設定您的常規合約條款與預設文字，審核邀約時將自動全數帶入，無需每次重複手打。
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-stone-800">
                  💬 預設「同意邀請」回覆文章 (發給攝影師)：
                </label>
                <textarea
                  rows={3}
                  value={templateAcceptMessage}
                  onChange={(e) => setTemplateAcceptMessage(e.target.value)}
                  className="w-full text-xs bg-[#f5f3ef] text-stone-800 border border-stone-300 rounded-xl p-3 outline-none focus:border-indigo-500 focus:bg-white leading-relaxed font-medium"
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-stone-200">
                <label className="block text-xs font-bold text-stone-800">
                  📜 預設「存證合約」條款規範本文 (包含交圖、界線、No-Show 補償)：
                </label>
                <textarea
                  rows={11}
                  value={templateContractBody}
                  onChange={(e) => setTemplateContractBody(e.target.value)}
                  className="w-full text-xs font-mono bg-[#f5f3ef] text-stone-800 border border-stone-300 rounded-xl p-3 outline-none focus:border-indigo-500 focus:bg-white leading-relaxed"
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-stone-200">
                <label className="block text-xs font-bold text-stone-800">
                  🚫 預設「婉拒邀請」理由回覆文章：
                </label>
                <textarea
                  rows={3}
                  value={templateDeclineMessage}
                  onChange={(e) => setTemplateDeclineMessage(e.target.value)}
                  className="w-full text-xs bg-[#f5f3ef] text-stone-800 border border-stone-300 rounded-xl p-3 outline-none focus:border-indigo-500 focus:bg-white leading-relaxed font-medium"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-xs transition"
              >
                儲存合約與回覆預設模板
              </button>
            </div>
          </form>
        )}

        {/* ==================== 分頁 3：檔期日曆與自訂標籤管理 ==================== */}
        {activeTab === "schedule" && (
          <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="bg-[#f5f3ef] p-4 rounded-2xl border border-stone-300 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-stone-800">
                  🎨 目前排程筆刷標籤 (點選下方標籤後，再點日曆格子套用)：
                </span>
                <span className="text-[11px] text-stone-500">
                  套用中：<strong>{customStatusList.find((s) => s.id === activeBrushId)?.name}</strong>
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {customStatusList.map((status) => {
                  const isSelected = activeBrushId === status.id;
                  return (
                    <button
                      key={status.id}
                      type="button"
                      onClick={() => setActiveBrushId(status.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 ${
                        status.bgColor
                      } ${status.borderColor} ${status.textColor} ${
                        isSelected ? "ring-2 ring-indigo-600 shadow-xs" : "opacity-75 hover:opacity-100"
                      }`}
                    >
                      <span>●</span>
                      {status.name}
                      {isSelected && <span className="text-[10px]">（選用中）</span>}
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-stone-300/70 flex gap-2 max-w-md">
                <input
                  type="text"
                  value={newStatusName}
                  onChange={(e) => setNewStatusName(e.target.value)}
                  placeholder="自訂新標籤 (例：已排邀約、私下約拍、出國取材)"
                  className="flex-1 text-xs bg-white text-stone-800 border border-stone-300 rounded-lg p-2 outline-none focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={handleAddCustomStatus}
                  className="px-3.5 py-1.5 bg-stone-800 hover:bg-stone-900 text-white text-xs font-bold rounded-lg transition"
                >
                  新增標籤
                </button>
              </div>
            </div>

            <div className="flex flex-wrap justify-between items-center gap-4 pb-4 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-stone-700">選擇月份：</label>
                <select
                  value={`${viewYear}-${viewMonth}`}
                  onChange={(e) => {
                    const [y, m] = e.target.value.split("-").map(Number);
                    setViewYear(y);
                    setViewMonth(m);
                  }}
                  className="bg-[#f5f3ef] text-stone-800 border border-stone-300 font-bold text-sm rounded-xl px-3 py-1.5 outline-none focus:border-indigo-500"
                >
                  {availableMonthsList.map(({ year, month }) => {
                    const isVis = monthlyVisibility[`${year}-${month}`] ?? true;
                    return (
                      <option key={`${year}-${month}`} value={`${year}-${month}`}>
                        {year} 年 {month} 月 {year === 2027 ? "(隔年)" : ""} - {isVis ? "[公開中]" : "[已隱藏]"}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="flex items-center gap-3 bg-[#edeae3]/70 px-4 py-2 rounded-xl border border-stone-300">
                <div className="text-right">
                  <span className="block text-xs font-bold text-stone-800">
                    公開本月檔期給攝影師查看
                  </span>
                  <span className="block text-[10px] text-stone-500">
                    {isCurrentMonthVisible ? "前台可見並接受預約" : "前台已完全隱藏此月份"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleToggleMonthVisibility}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                    isCurrentMonthVisible ? "bg-emerald-600" : "bg-stone-300"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      isCurrentMonthVisible ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className={`relative transition duration-200 ${!isCurrentMonthVisible ? "opacity-40 select-none pointer-events-none" : ""}`}>
              <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-stone-500 mb-2">
                <div className="text-rose-600">週日</div>
                <div>週一</div>
                <div>週二</div>
                <div>週三</div>
                <div>週四</div>
                <div>週五</div>
                <div className="text-rose-600">週六</div>
              </div>

              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`empty-${i}`} className="h-16 border border-transparent rounded-xl" />
                ))}

                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const dateKey = `${viewYear}-${String(viewMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                  const statusId = scheduleData[dateKey] || "available";
                  const statusObj = customStatusList.find((s) => s.id === statusId) || customStatusList[0];

                  return (
                    <button
                      key={dateKey}
                      type="button"
                      onClick={() => handleDateClick(day)}
                      className={`h-16 rounded-xl border flex flex-col items-center justify-center transition cursor-pointer p-1 shadow-2xs ${
                        statusObj.bgColor
                      } ${statusObj.borderColor} ${statusObj.textColor} hover:brightness-95`}
                    >
                      <span className="text-sm font-bold">{day}</span>
                      <span className="text-[10px] font-semibold mt-0.5 truncate max-w-full px-1">
                        {statusObj.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleSaveProfile}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
              >
                儲存檔期排程標籤變更
              </button>
            </div>
          </div>
        )}

        {/* ==================== 分頁 4：隱形黑名單管理 ==================== */}
        {activeTab === "blacklist" && (
          <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="border-b border-stone-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">🛡️</span>
                <h3 className="text-sm font-bold text-stone-800">
                  模特專屬：雙重隱形黑名單防護
                </h3>
              </div>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                保護模特不受越界打擾，同時不打草驚蛇。將對象加入此名單後，系統將自動啟動兩大靜默防護機制：
              </p>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-[#f5f3ef] p-3.5 rounded-xl border border-stone-300/80 text-stone-700">
                <div>
                  <strong className="text-indigo-800">✦ 方案 A（日曆偽裝全滿）：</strong>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    被封鎖者瀏覽您的個人主頁時，日曆所有日期將自動呈現灰色的「滿」或「休」，無任何可約空檔，讓對方知難而退。
                  </p>
                </div>
                <div>
                  <strong className="text-indigo-800">✦ 方案 B（幽靈過濾送出）：</strong>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    若對方透過舊連結或暫存強行送出約拍，系統會對其顯示「已送出」，但邀約會無聲無息沉入過濾夾，完全不騷擾您的後台。
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleAddBlacklist} className="bg-[#f5f3ef] p-4 rounded-xl border border-stone-300 space-y-3">
              <span className="text-xs font-bold text-stone-800 block">手動加入防護名單：</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  value={newBlacklistName}
                  onChange={(e) => setNewBlacklistName(e.target.value)}
                  placeholder="攝影師姓名 / 帳號稱呼"
                  className="text-xs bg-white text-stone-800 border border-stone-300 rounded-lg p-2.5 outline-none focus:border-indigo-500"
                />
                <input
                  type="text"
                  value={newBlacklistReason}
                  onChange={(e) => setNewBlacklistReason(e.target.value)}
                  placeholder="封鎖原因備註 (僅自己可見，例：言語越界、態度不佳)"
                  className="text-xs bg-white text-stone-800 border border-stone-300 rounded-lg p-2.5 outline-none focus:border-indigo-500"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold rounded-lg transition shadow-2xs"
                >
                  🔒 啟動隱形封鎖
                </button>
              </div>
            </form>

            <div className="space-y-2">
              <span className="text-xs font-bold text-stone-700 block">目前防護對象清單 ({blacklist.length})：</span>
              {blacklist.length === 0 ? (
                <p className="text-xs text-stone-400 py-3 text-center">目前無任何黑名單對象，接案環境安全無虞。</p>
              ) : (
                blacklist.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 bg-white border border-stone-200 rounded-xl flex justify-between items-center text-xs shadow-2xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-800 text-sm">{item.name}</span>
                        <span className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded text-[10px] font-bold">
                          已靜默遮蔽
                        </span>
                        <span className="text-stone-400 text-[10px]">加入日期：{item.dateAdded}</span>
                      </div>
                      <p className="text-stone-500 mt-1 text-[11px]">原因備註：{item.reason}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveBlacklist(item.id)}
                      className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-lg text-xs font-bold transition"
                    >
                      解除防護
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* ==================== 抽屜組件：邀約審核抽屜 ==================== */}
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
                  className="w-8 h-8 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-700 flex items-center justify-center font-bold text-sm"
                >
                  ✕
                </button>
              </div>

              <div className="p-5 overflow-y-auto space-y-4 flex-1">
                {bookingRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs space-y-3"
                  >
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
                          <span className="px-2.5 py-0.5 bg-amber-50 text-amber-800 border border-amber-300 text-[11px] font-bold rounded-full">
                            待回覆
                          </span>
                        )}
                        {req.status === "accepted" && (
                          <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-300 text-[11px] font-bold rounded-full">
                            ✓ 已接受
                          </span>
                        )}
                        {req.status === "declined" && (
                          <span className="px-2.5 py-0.5 bg-stone-100 text-stone-500 border border-stone-300 text-[11px] font-bold rounded-full">
                            ✕ 已謝絕
                          </span>
                        )}
                        {req.status === "completed" && (
                          <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-800 border border-indigo-300 text-[11px] font-bold rounded-full">
                            ★ 接案完成
                          </span>
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
                            className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition shadow-xs"
                          >
                            📜 帶入合約並同意
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenDeclineModal(req)}
                            className="px-3.5 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-lg text-xs font-bold transition"
                          >
                            謝絕
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeclineAndQuietBlock(req)}
                          className="w-full py-1.5 bg-stone-100 hover:bg-rose-50 text-stone-500 hover:text-rose-700 border border-stone-200 rounded-lg text-[11px] font-semibold transition flex items-center justify-center gap-1"
                        >
                          <span>🚫 謝絕並啟動「隱形封鎖」</span>
                          <span className="text-[10px] text-stone-400">(對方日曆全滿+幽靈過濾)</span>
                        </button>
                      </div>
                    ) : req.status === "completed" ? (
                      <div className="pt-1 flex justify-between items-center">
                        <span className="text-[11px] text-emerald-700 font-semibold">
                          ✓ 現場已雙向核銷履約完畢
                        </span>
                        <button
                          type="button"
                          disabled={req.hasReviewed}
                          onClick={() => {
                            setReviewingBookingReq(req);
                            setIsReviewPhotographerModalOpen(true);
                          }}
                          className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 disabled:bg-stone-300 text-white font-bold rounded-lg text-xs transition"
                        >
                          {req.hasReviewed ? "✓ 已送出同行手札" : "✍️ 填寫同行評價 (僅模特可見)"}
                        </button>
                      </div>
                    ) : req.status === "accepted" ? (
                      <div className="space-y-1">
                        <p className="text-[11px] text-emerald-700 font-semibold">
                          ✓ 雙向電子存證已生效，檔期已鎖定。
                        </p>
                        {req.modelReplyMessage && (
                          <p className="text-[11px] text-stone-500 italic bg-stone-50 p-2 rounded">
                            回覆留言：「{req.modelReplyMessage}」
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <p className="text-[11px] text-stone-400">已向對方發送謝絕回覆。</p>
                        {req.modelReplyMessage && (
                          <p className="text-[11px] text-stone-400 italic bg-stone-50 p-2 rounded">
                            婉拒理由：「{req.modelReplyMessage}」
                          </p>
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

      {/* ==================== 彈窗 1：同意邀約並簽署合約 ==================== */}
      {isContractModalOpen && selectedReqForContract && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#fbfaf8] rounded-2xl max-w-2xl w-full p-6 shadow-xl border border-stone-200 max-h-[92vh] flex flex-col">
            <div className="flex justify-between items-center pb-3 border-b border-stone-200">
              <div>
                <h3 className="font-bold text-stone-900 text-base">
                  📜 同意邀約與合約存證 (已自動帶入模板)
                </h3>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  邀約編號：{selectedReqForContract.id} ｜ 攝影師：{selectedReqForContract.photographerName}
                </p>
              </div>
              <button
                onClick={() => setIsContractModalOpen(false)}
                className="text-stone-400 hover:text-stone-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto space-y-4 my-4 pr-1 flex-1">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  💬 給攝影師的同意回覆留言 (已帶入預設文章，可微調)：
                </label>
                <textarea
                  rows={2}
                  value={acceptanceMessage}
                  onChange={(e) => setAcceptanceMessage(e.target.value)}
                  className="w-full text-xs bg-white text-stone-800 border border-stone-300 rounded-xl p-2.5 outline-none focus:border-indigo-500 leading-relaxed font-medium"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-stone-800">
                    📜 合作合約條款 (已帶入預設條款，可手動修改)：
                  </label>
                  <button
                    type="button"
                    onClick={() => setEditableContractText(buildFullContract(selectedReqForContract))}
                    className="text-[11px] text-indigo-600 hover:underline font-bold"
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
                  className="accent-indigo-600 w-4 h-4 rounded"
                />
                <span>本人已確認上述條款與回覆留言，同意正式簽署並鎖定檔期。</span>
              </label>

              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={!isAgreedTerms}
                  onClick={handleConfirmAcceptWithContract}
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-stone-300 text-white font-bold rounded-xl text-xs transition shadow-xs"
                >
                  ✍️ 電子簽章確認 ➔ 送出同意並鎖定檔期
                </button>
                <button
                  type="button"
                  onClick={() => setIsContractModalOpen(false)}
                  className="px-4 py-3 bg-stone-200 text-stone-700 font-bold rounded-xl text-xs"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 彈窗 2：婉拒邀約彈窗 ==================== */}
      {isDeclineModalOpen && selectedReqForDecline && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#fbfaf8] rounded-2xl max-w-md w-full p-6 shadow-xl border border-stone-200">
            <h3 className="font-bold text-stone-900 text-base mb-1">
              婉拒約拍邀約
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              向攝影師【{selectedReqForDecline.photographerName}】發送謝絕通知：
            </p>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-stone-800">
                  謝絕回覆文章 (已自動帶入預設模板，可微調)：
                </label>
                <button
                  type="button"
                  onClick={() => setDeclineReasonText(templateDeclineMessage)}
                  className="text-[11px] text-indigo-600 hover:underline font-bold"
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
                className="flex-1 py-2.5 bg-rose-700 hover:bg-rose-800 text-white font-bold rounded-xl text-xs transition"
              >
                確認並送出謝絕通知
              </button>
              <button
                type="button"
                onClick={() => setIsDeclineModalOpen(false)}
                className="px-4 py-2.5 bg-stone-200 text-stone-700 font-bold rounded-xl text-xs"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 彈窗 3：評價攝影師彈窗 (限模特同行可讀) ==================== */}
      {isReviewPhotographerModalOpen && reviewingBookingReq && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#fbfaf8] rounded-2xl max-w-md w-full p-6 shadow-xl border border-stone-200">
            <div className="flex justify-between items-center pb-2 border-b border-stone-200 mb-3">
              <h3 className="font-bold text-stone-900 text-base">
                ✍️ 撰寫模特同行備忘手札 (評價攝影師)
              </h3>
              <button onClick={() => setIsReviewPhotographerModalOpen(false)} className="text-stone-400 font-bold">✕</button>
            </div>
            <p className="text-xs text-stone-500 mb-3">
              受評攝影師：<strong>{reviewingBookingReq.photographerName}</strong>（此評價僅對<strong>【模特同行】</strong>解鎖，攝影師完全無法查閱）
            </p>

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
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition"
                >
                  確認發布同行手札
                </button>
                <button
                  type="button"
                  onClick={() => setIsReviewPhotographerModalOpen(false)}
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