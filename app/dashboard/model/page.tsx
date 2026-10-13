"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import ProfileTab from "../../../components/dashboard-model/ProfileTab";
import TemplateTab from "../../../components/dashboard-model/TemplateTab";
import ScheduleTab, { CustomScheduleStatus, TimedReleaseTask } from "../../../components/dashboard-model/ScheduleTab";
import BlacklistTab, { BlacklistedItem } from "../../../components/dashboard-model/BlacklistTab";
import RateCardTab, { RateCardRequest } from "../../../components/dashboard-model/RateCardTab";
import CollaborationTab, { CollaborationProject } from "../../../components/dashboard-model/CollaborationTab";

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
  const [activeTab, setActiveTab] = useState<
    "profile" | "collaboration" | "rate_card" | "schedule" | "contract_templates" | "blacklist"
  >("profile");

  // ==================== 0. 合約模板與商案定金狀態 ====================
  const [depositPolicy, setDepositPolicy] = useState("商案需預付 30% 定金保留檔期，拍攝結束當日結清尾款。");

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
2. 模特放鳥未到：全額退還預付款並補償攝影師已預付棚費（憑發票實報實銷上限 NT$ 3,000 元），平台扣信用分 30 分。`
  );

  const [commercialContractBody, setCommercialContractBody] = useState(
    `【商業合作存證條款與定金交付規範】
1. 定金規範：甲方須於合約簽署後 48 小時內給付 30% 定金，乙方確認入帳後正式鎖定專屬檔期。
2. 尾款支付：拍攝工作完成當日，甲方應結清剩餘 70% 尾款（支援轉帳或現場付現）。
3. 版權商用授權：本案包含甲方商品型錄／社群廣告使用權限，未經書面同意不得轉賣予第三方品牌。
4. 爽約扣減：若甲方非天災因素 48 小時內臨時取消，定金不予退還；乙方爽約則雙倍返還定金。`
  );

  const [templateDeclineMessage, setTemplateDeclineMessage] = useState(
    "感謝您的約拍邀請！因該日期已有私人行程或近期作品風格規劃調整，本次暫無法配合，期待未來有機會再合作！"
  );

  const handleSaveGlobalTemplates = (e: React.FormEvent) => {
    e.preventDefault();
    const templates = {
      templateAcceptMessage,
      templateContractBody,
      commercialContractBody,
      templateDeclineMessage,
      depositPolicy,
    };
    localStorage.setItem("lumina_model_contract_templates", JSON.stringify(templates));
    alert("✅ 商業合約、定金意向與常規模板已成功儲存！");
  };

  // ==================== 1. 邀約審核抽屜與彈窗狀態 (復原核心) ====================
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedReq, setSelectedReq] = useState<BookingRequest | null>(null);
  const [actionType, setActionType] = useState<"accept" | "decline" | "review" | null>(null);

  // 審核彈窗內的編輯文字
  const [contractText, setContractText] = useState("");
  const [replyMessage, setReplyMessage] = useState("");
  const [declineReason, setDeclineReason] = useState("");

  // 評價彈窗狀態
  const [reviewScore, setReviewScore] = useState(5.0);
  const [reviewTags, setReviewTags] = useState<string[]>(["極度守時", "尊重邊界"]);
  const [reviewContent, setReviewContent] = useState("");

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
      coopType: "商業有酬",
      remuneration: "NT$ 4,500",
      notes: "已自備反光板與定焦鏡頭，預計交稿 15 張精修調色，無肢體接觸要求。",
      status: "pending",
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
      location: "松山文創園區戶外",
      style: "韓系俐落型錄",
      coopType: "互惠創作 (TFCD)",
      notes: "希望合作一組秋季俐落風格形象照，棚費自負。",
      status: "pending",
    },
  ]);

  // 開啟同意合約彈窗
  const openAcceptModal = (req: BookingRequest) => {
    setSelectedReq(req);
    setActionType("accept");
    // 依合作性質自動套用對應合約
    if (req.coopType === "商業有酬") {
      setContractText(commercialContractBody);
    } else {
      setContractText(templateContractBody);
    }
    setReplyMessage(templateAcceptMessage);
  };

  // 開啟婉拒彈窗
  const openDeclineModal = (req: BookingRequest) => {
    setSelectedReq(req);
    setActionType("decline");
    setDeclineReason(templateDeclineMessage);
  };

  // 開啟同業評價彈窗
  const openReviewModal = (req: BookingRequest) => {
    setSelectedReq(req);
    setActionType("review");
    setReviewScore(5.0);
    setReviewTags(["極度守時", "完全零肢體觸碰", "溝通尊重專業"]);
    setReviewContent("合作非常順利且尊重個人邊界，動作口頭引導精準，非常推薦！");
  };

  // 確認同意約拍
  const confirmAccept = () => {
    if (!selectedReq) return;
    setBookingRequests((prev) =>
      prev.map((r) =>
        r.id === selectedReq.id
          ? {
              ...r,
              status: "accepted" as const,
              customContractText: contractText,
              modelReplyMessage: replyMessage,
            }
          : r
      )
    );

    // 同步新增至合作協作室
    const newCollab: CollaborationProject = {
      id: `collab_${Date.now()}`,
      bookingId: selectedReq.id,
      photographerName: selectedReq.photographerName,
      shootDate: selectedReq.date,
      exactTime: `${selectedReq.timeSlot.split(" ")[0]} 準時集合`,
      exactLocation: selectedReq.location,
      locationGuide: "請於約定地碰頭",
      coopType: selectedReq.coopType,
      remuneration: selectedReq.remuneration || "依約定",
      bankInfo: {
        bankCode: "822",
        bankName: "中國信託",
        accountNumber: "1234-5678-9012",
        accountName: "陳羽晴",
      },
      outfits: [
        { id: `o_${Date.now()}`, title: "自備約定風格服裝", description: selectedReq.style, status: "confirmed" },
      ],
      checkInStatus: { modelCheckedIn: false, photographerCheckedIn: false },
      paymentStatus: "unpaid",
      messages: [
        { id: `m_${Date.now()}`, sender: "model", senderName: "羽晴 (Hane)", text: replyMessage, timestamp: "剛剛" },
      ],
    };
    setCollaborations((prev) => [newCollab, ...prev]);

    setActionType(null);
    setSelectedReq(null);
    alert(`🎉 已正式同意【${selectedReq.photographerName}】的約拍！\n合約電子存證已確立，專案已同步加入「🤝 合作協作室」！`);
  };

  // 確認婉拒約拍
  const confirmDecline = () => {
    if (!selectedReq) return;
    setBookingRequests((prev) =>
      prev.map((r) =>
        r.id === selectedReq.id ? { ...r, status: "declined" as const } : r
      )
    );
    setActionType(null);
    setSelectedReq(null);
    alert(`已禮貌婉拒該約拍邀請，系統已將訊息發送給攝影師。`);
  };

  // 確認送出評價
  const confirmReview = () => {
    if (!selectedReq) return;
    setBookingRequests((prev) =>
      prev.map((r) =>
        r.id === selectedReq.id ? { ...r, hasReviewed: true } : r
      )
    );
    setActionType(null);
    setSelectedReq(null);
    alert(`⭐ 已成功為【${selectedReq.photographerName}】留下同行評價紀錄！`);
  };

  // ==================== 2. 合作專案協作室狀態 ====================
  const [collaborations, setCollaborations] = useState<CollaborationProject[]>([
    {
      id: "collab_1",
      bookingId: "REQ-20261028-01",
      photographerName: "陳攝影 (Alan Chen)",
      shootDate: "2026-10-28",
      exactTime: "13:50 於捷運站出口集合",
      exactLocation: "台北市大稻埕迪化街周邊街拍",
      locationGuide: "大稻埕碼頭 5 號水門貨櫃市集",
      coopType: "商業有酬",
      remuneration: "NT$ 4,500",
      bankInfo: {
        bankCode: "822",
        bankName: "中國信託",
        accountNumber: "1234-5678-9012",
        accountName: "陳羽晴",
      },
      outfits: [
        { id: "o1", title: "日系膠卷碎花長洋裝", description: "搭配草帽、復古小包", status: "confirmed" },
        { id: "o2", title: "白色俐落短版襯衫 + 牛仔寬褲", description: "適合街頭走動特寫", status: "confirmed" },
      ],
      checkInStatus: {
        modelCheckedIn: true,
        modelCheckInTime: "13:48",
        photographerCheckedIn: true,
      },
      paymentStatus: "unpaid",
      messages: [
        { id: "m1", sender: "photographer", senderName: "陳攝影 (Alan Chen)", text: "羽晴您好！當天我會自備 35mm 與 50mm 定焦鏡頭，期待合作！", timestamp: "10:15" },
        { id: "m2", sender: "model", senderName: "羽晴 (Hane)", text: "好的！我會提早 10 分鐘到 5 號水門碰頭～", timestamp: "10:20" },
      ],
    },
  ]);

  // ==================== 3. 報價單模組狀態 ====================
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
    const config = { images: rateCardImages, accessMode: rateCardAccessMode, requests: rateCardRequests };
    localStorage.setItem("lumina_model_rate_card_config", JSON.stringify(config));
    alert("✅ 報價單圖片與顯示模式已成功儲存！");
  };

  const handleApproveRequest = (id: string, durationHours: number = 24) => {
    const updated = rateCardRequests.map((r) => {
      if (r.id === id) {
        return {
          ...r,
          status: "approved" as const,
          expiresLabel: `有效 ${durationHours} 小時`,
        };
      }
      return r;
    });
    setRateCardRequests(updated);
    const config = { images: rateCardImages, accessMode: rateCardAccessMode, requests: updated };
    localStorage.setItem("lumina_model_rate_card_config", JSON.stringify(config));
    alert(`✓ 已授權該攝影師查閱報價單 (${durationHours} 小時時效)！`);
  };

  const handleDeclineRequest = (id: string) => {
    const updated = rateCardRequests.map((r) =>
      r.id === id ? { ...r, status: "declined" as const } : r
    );
    setRateCardRequests(updated);
    const config = { images: rateCardImages, accessMode: rateCardAccessMode, requests: updated };
    localStorage.setItem("lumina_model_rate_card_config", JSON.stringify(config));
  };

  const handleDeleteRequests = (ids: string[]) => {
    const updated = rateCardRequests.filter((r) => !ids.includes(r.id));
    setRateCardRequests(updated);
    const config = { images: rateCardImages, accessMode: rateCardAccessMode, requests: updated };
    localStorage.setItem("lumina_model_rate_card_config", JSON.stringify(config));
  };

  // ==================== 4. 隱形黑名單狀態 ====================
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
  };

  // ==================== 5. 封面與簡介狀態 ====================
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
    portfolioImages: [] as string[],
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

  // ==================== 6. 排程日曆與定時開放 ====================
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

    const savedTemplates = localStorage.getItem("lumina_model_contract_templates");
    if (savedTemplates) {
      try {
        const parsedT = JSON.parse(savedTemplates);
        if (parsedT.templateAcceptMessage) setTemplateAcceptMessage(parsedT.templateAcceptMessage);
        if (parsedT.templateContractBody) setTemplateContractBody(parsedT.templateContractBody);
        if (parsedT.commercialContractBody) setCommercialContractBody(parsedT.commercialContractBody);
        if (parsedT.templateDeclineMessage) setTemplateDeclineMessage(parsedT.templateDeclineMessage);
        if (parsedT.depositPolicy) setDepositPolicy(parsedT.depositPolicy);
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

  const pendingRateCardCount = useMemo(() => {
    return rateCardRequests.filter((r) => r.status === "pending").length;
  }, [rateCardRequests]);

  const pendingBookingsCount = useMemo(() => {
    return bookingRequests.filter((r) => r.status === "pending").length;
  }, [bookingRequests]);

  return (
    <main className="min-h-[calc(100vh-65px)] bg-stone-100/70 dark:bg-stone-950 px-4 py-8 text-stone-800 dark:text-stone-200 transition-colors duration-200">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* 後台標頭與右側分頁按鈕 */}
        <div className="bg-[#fbfaf8] dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100">模特個人工作室後台</h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              管理履約協作室、時效報價單、商案合約與排程日曆
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3 w-full md:w-auto">
            {/* ★ 邀約審核按鈕 (含未讀提示徽章) ★ */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="px-3.5 py-2 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <span>📥 邀約審核</span>
              {pendingBookingsCount > 0 && (
                <span className="w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] flex items-center justify-center font-bold">
                  {pendingBookingsCount}
                </span>
              )}
            </button>

            <div className="flex flex-wrap bg-[#edeae3]/80 dark:bg-stone-800 p-1 rounded-xl border border-stone-300 dark:border-stone-700">
              <button
                onClick={() => setActiveTab("profile")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeTab === "profile"
                    ? "bg-white dark:bg-stone-900 text-indigo-700 dark:text-indigo-400 shadow-xs"
                    : "text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white"
                }`}
              >
                📝 封面與簡介
              </button>

              <button
                onClick={() => setActiveTab("collaboration")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "collaboration"
                    ? "bg-white dark:bg-stone-900 text-indigo-700 dark:text-indigo-400 shadow-xs"
                    : "text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white"
                }`}
              >
                <span>🤝 合作協作室</span>
                <span className="w-4 h-4 bg-indigo-600 text-white rounded-full text-[10px] flex items-center justify-center font-bold">
                  {collaborations.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab("rate_card")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "rate_card"
                    ? "bg-white dark:bg-stone-900 text-indigo-700 dark:text-indigo-400 shadow-xs"
                    : "text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white"
                }`}
              >
                <span>💰 商業報價單</span>
                {pendingRateCardCount > 0 && (
                  <span className="w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] flex items-center justify-center font-bold shadow-2xs animate-pulse">
                    {pendingRateCardCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab("contract_templates")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeTab === "contract_templates"
                    ? "bg-white dark:bg-stone-900 text-indigo-700 dark:text-indigo-400 shadow-xs"
                    : "text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white"
                }`}
              >
                ⚙️ 合約模板
              </button>
              <button
                onClick={() => setActiveTab("schedule")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeTab === "schedule"
                    ? "bg-white dark:bg-stone-900 text-indigo-700 dark:text-indigo-400 shadow-xs"
                    : "text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white"
                }`}
              >
                📅 檔期標籤
              </button>
              <button
                onClick={() => setActiveTab("blacklist")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeTab === "blacklist"
                    ? "bg-white dark:bg-stone-900 text-rose-700 dark:text-rose-400 shadow-xs"
                    : "text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white"
                }`}
              >
                🚫 隱形黑名單
              </button>
            </div>
          </div>
        </div>

        {/* 各分頁零件渲染 */}
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

        {activeTab === "collaboration" && (
          <CollaborationTab
            collaborations={collaborations}
            setCollaborations={setCollaborations}
            currentModelName={modelProfile.name}
          />
        )}

        {activeTab === "rate_card" && (
          <RateCardTab
            rateCardImages={rateCardImages}
            setRateCardImages={setRateCardImages}
            accessMode={rateCardAccessMode}
            setAccessMode={setRateCardAccessMode}
            rateCardRequests={rateCardRequests}
            handleApproveRequest={handleApproveRequest}
            handleDeclineRequest={handleDeclineRequest}
            handleDeleteRequests={handleDeleteRequests}
            handleSaveRateCardConfig={handleSaveRateCardConfig}
          />
        )}

        {activeTab === "contract_templates" && (
          <TemplateTab
            templateAcceptMessage={templateAcceptMessage}
            setTemplateAcceptMessage={setTemplateAcceptMessage}
            templateContractBody={templateContractBody}
            setTemplateContractBody={setTemplateContractBody}
            commercialContractBody={commercialContractBody}
            setCommercialContractBody={setCommercialContractBody}
            templateDeclineMessage={templateDeclineMessage}
            setTemplateDeclineMessage={setTemplateDeclineMessage}
            depositPolicy={depositPolicy}
            setDepositPolicy={setDepositPolicy}
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

      {/* ★ 復原：📥 邀約審核右側滑出抽屜 (Drawer) ★ */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-xl bg-[#fbfaf8] dark:bg-stone-900 border-l border-stone-200 dark:border-stone-800 h-full p-6 overflow-y-auto space-y-6 shadow-2xl flex flex-col justify-between">
            <div className="space-y-5">
              <div className="flex justify-between items-center border-b border-stone-200 dark:border-stone-800 pb-3">
                <div>
                  <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                    <span>📥</span>
                    <span>約拍邀請審核抽屜 ({bookingRequests.length})</span>
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                    審核攝影師提案、確認履約條款或發表同業評價
                  </p>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 text-xl font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* 邀約卡片列表 */}
              <div className="space-y-4">
                {bookingRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-5 bg-white dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 rounded-2xl space-y-3 shadow-xs"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/photographer/${encodeURIComponent(req.photographerName)}`}
                            className="font-bold text-stone-900 dark:text-stone-100 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm"
                          >
                            {req.photographerName} ➔
                          </Link>
                          <span className="text-[10px] bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
                            ★ {req.photographerRating.toFixed(1)} (履約率 {req.completionRate})
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                          📅 {req.date} · ⏰ {req.timeSlot}
                        </p>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                          req.status === "accepted"
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-300"
                            : req.status === "declined"
                            ? "bg-rose-50 text-rose-800 border border-rose-300"
                            : "bg-amber-50 text-amber-800 border border-amber-300"
                        }`}
                      >
                        {req.status === "accepted" ? "✓ 已同意" : req.status === "declined" ? "✕ 已婉拒" : "⏳ 待審核"}
                      </span>
                    </div>

                    <div className="bg-[#f5f3ef] dark:bg-stone-900 p-3 rounded-xl border border-stone-200 dark:border-stone-700 text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-stone-500 dark:text-stone-400">合作性質：</span>
                        <strong className="text-stone-800 dark:text-stone-200">{req.coopType} {req.remuneration && `(${req.remuneration})`}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500 dark:text-stone-400">約定地點：</span>
                        <strong className="text-stone-800 dark:text-stone-200">{req.location}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500 dark:text-stone-400">風格：</span>
                        <strong className="text-stone-800 dark:text-stone-200">{req.style}</strong>
                      </div>
                      <p className="text-stone-600 dark:text-stone-300 pt-1 border-t border-stone-200 dark:border-stone-800 text-[11px] leading-relaxed">
                        提案信：{req.notes}
                      </p>
                    </div>

                    {/* 操作按鈕群 */}
                    <div className="flex justify-end gap-2 pt-1">
                      {req.status === "pending" && (
                        <>
                          <button
                            type="button"
                            onClick={() => openAcceptModal(req)}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                          >
                            ✓ 同意約拍 (簽署存證合約)
                          </button>
                          <button
                            type="button"
                            onClick={() => openDeclineModal(req)}
                            className="px-3.5 py-2 bg-stone-200 dark:bg-stone-700 hover:bg-rose-100 hover:text-rose-700 text-stone-700 dark:text-stone-200 rounded-xl text-xs font-bold transition cursor-pointer"
                          >
                            婉拒
                          </button>
                        </>
                      )}

                      {req.status === "accepted" && !req.hasReviewed && (
                        <button
                          type="button"
                          onClick={() => openReviewModal(req)}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                        >
                          ⭐ 填寫同業評價 (存證手札)
                        </button>
                      )}

                      {req.status === "accepted" && req.hasReviewed && (
                        <span className="text-xs text-emerald-600 font-bold py-1.5">
                          ✓ 已完成同行評價
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex justify-end">
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="px-5 py-2 bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-bold cursor-pointer hover:bg-stone-300"
              >
                關閉抽屜
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ★ 同意約拍彈窗 ★ */}
      {actionType === "accept" && selectedReq && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#fbfaf8] dark:bg-stone-900 border border-stone-200 dark:border-stone-800 max-w-xl w-full p-6 rounded-2xl space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
              確認同意與【{selectedReq.photographerName}】的約拍協議
            </h3>
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                存證合約條款 (已自動依【{selectedReq.coopType}】帶入模板)：
              </label>
              <textarea
                rows={8}
                value={contractText}
                onChange={(e) => setContractText(e.target.value)}
                className="w-full text-xs font-mono bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-700 rounded-xl p-3 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                回覆給攝影師的留言 (自動帶入預設)：
              </label>
              <textarea
                rows={3}
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                className="w-full text-xs bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-700 rounded-xl p-3 outline-none"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActionType(null)}
                className="px-4 py-2 bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-bold"
              >
                取消
              </button>
              <button
                type="button"
                onClick={confirmAccept}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold"
              >
                正式簽署並發送同意
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ★ 婉拒約拍彈窗 ★ */}
      {actionType === "decline" && selectedReq && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#fbfaf8] dark:bg-stone-900 border border-stone-200 dark:border-stone-800 max-w-md w-full p-6 rounded-2xl space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
              婉拒【{selectedReq.photographerName}】的約拍邀請
            </h3>
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                禮貌婉拒理由：
              </label>
              <textarea
                rows={4}
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                className="w-full text-xs bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-700 rounded-xl p-3 outline-none"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActionType(null)}
                className="px-4 py-2 bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-bold"
              >
                取消
              </button>
              <button
                type="button"
                onClick={confirmDecline}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold"
              >
                確認婉拒
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ★ 填寫同行評價彈窗 ★ */}
      {actionType === "review" && selectedReq && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#fbfaf8] dark:bg-stone-900 border border-stone-200 dark:border-stone-800 max-w-lg w-full p-6 rounded-2xl space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
              為【{selectedReq.photographerName}】留下同業存證評價
            </h3>
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                守時與安全評分：{reviewScore} 星
              </label>
              <input
                type="range"
                min="1"
                max="5"
                step="0.5"
                value={reviewScore}
                onChange={(e) => setReviewScore(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                詳細評價手札 (給模特同業參考)：
              </label>
              <textarea
                rows={4}
                value={reviewContent}
                onChange={(e) => setReviewContent(e.target.value)}
                className="w-full text-xs bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-700 rounded-xl p-3 outline-none"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActionType(null)}
                className="px-4 py-2 bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-bold"
              >
                取消
              </button>
              <button
                type="button"
                onClick={confirmReview}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold"
              >
                送出同業手札評價
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}