"use client";

import React, { useState, useEffect } from "react";

export type CollabCategory = "invite" | "tfcd" | "commercial";

export interface CollaborationProject {
  id: string;
  caseNumber: string;
  title?: string;
  bookingId?: string;
  category: CollabCategory;
  photographerName: string;
  shootDate: string;
  exactTime: string;
  exactLocation: string;
  coordinates?: string;
  locationGuide?: string;
  coopType: string;
  remuneration?: string;
  deliveryDays?: number;
  bankInfo: {
    bankCode: string;
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
  outfits: {
    id: string;
    title: string;
    description: string;
    image?: string;
    modelConfirmed?: boolean;
    photographerConfirmed?: boolean;
    status?: "pending" | "confirmed";
  }[];
  checkInStatus: {
    modelCheckedIn: boolean;
    modelCheckInTime?: string;
    photographerCheckedIn: boolean;
    photographerCheckInTime?: string;
  };
  paymentStatus: "unpaid" | "reminded" | "deposit_paid" | "paid";
  messages: {
    id: string;
    sender: "model" | "photographer";
    senderName: string;
    text: string;
    timestamp: string;
  }[];
  paymentNotice?: {
    bankName: string;
    lastFiveDigits: string;
    amount: number;
    noticeTime: string;
    isModelConfirmed: boolean;
  };
  revisionNotice?: {
    requestCount: number;
    notes: string;
    noticeTime: string;
  };
  invoiceNotice?: {
    invoiceType: "deposit" | "final";
    amount: number;
    noticeTime: string;
  };
  status?: "confirmed" | "completed" | "cancelled";
}

const DEFAULT_PROJECTS: CollaborationProject[] = [
  {
    id: "collab_1",
    caseNumber: "INV-20261015-001",
    title: "大稻埕復古街拍與旗袍專案",
    category: "invite",
    photographerName: "陳攝影 (Alan Chen)",
    shootDate: "2026-10-18",
    exactTime: "2026/10/18 (日) 13:50 集合",
    exactLocation: "大稻埕碼頭 5 號水門貨櫃市集入口",
    coordinates: "25.0569, 121.5074",
    coopType: "邀約拍攝 (自費聘請)",
    remuneration: "NT$ 6,000",
    bankInfo: {
      bankCode: "822",
      bankName: "中國信託",
      accountNumber: "1234-5678-9012",
      accountName: "陳*晴",
    },
    outfits: [
      {
        id: "outfit_1",
        title: "酒紅色刺繡旗袍",
        description: "復古珍珠耳環、自備黑色摺扇與低跟鞋",
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80",
        modelConfirmed: true,
        photographerConfirmed: true,
        status: "confirmed",
      },
    ],
    checkInStatus: {
      modelCheckedIn: true,
      modelCheckInTime: "13:50",
      photographerCheckedIn: false,
    },
    paymentStatus: "deposit_paid",
    status: "confirmed",
    paymentNotice: {
      bankName: "國泰世華 (013)",
      lastFiveDigits: "88621",
      amount: 3000,
      noticeTime: "10-14 15:30",
      isModelConfirmed: true,
    },
    messages: [
      {
        id: "m_1",
        sender: "model",
        senderName: "羽晴 (Hane)",
        text: "陳攝影您好！已上傳這次挑選的旗袍參考照，再麻煩您確認光線與色調是否合適！",
        timestamp: "14:20",
      },
      {
        id: "m_2",
        sender: "photographer",
        senderName: "陳攝影 (Alan Chen)",
        text: "看過照片了，暗紅絲絨質感非常符合當天迪化街老街景，當天我會自備暖色柔光罩！",
        timestamp: "14:35",
      },
    ],
  },
  {
    id: "collab_2",
    caseNumber: "TFC-20261015-002",
    title: "秋季自然光時裝外拍",
    category: "tfcd",
    photographerName: "陳攝影 (Alan Chen)",
    shootDate: "2026-10-24",
    exactTime: "2026/10/24 (六) 09:50 集合",
    exactLocation: "台北市立美術館正門戶外廣場",
    coordinates: "25.0722, 121.5248",
    coopType: "互惠拍攝 (TFCD)",
    remuneration: "互惠免支付",
    bankInfo: {
      bankCode: "822",
      bankName: "中國信託",
      accountNumber: "1234-5678-9012",
      accountName: "陳*晴",
    },
    outfits: [
      {
        id: "outfit_2",
        title: "秋季長版風衣套裝",
        description: "米白色大衣 + 棕色短靴，微風自然飄逸感",
        modelConfirmed: true,
        photographerConfirmed: false,
        status: "pending",
      },
    ],
    checkInStatus: {
      modelCheckedIn: false,
      photographerCheckedIn: false,
    },
    paymentStatus: "unpaid",
    status: "confirmed",
    revisionNotice: {
      requestCount: 1,
      notes: "已將初剪毛片上傳雲端，精選 15 張調色為日系微光風，待確認後交付高畫質檔。",
      noticeTime: "10-14 10:00",
    },
    messages: [],
  },
  {
    id: "collab_3",
    caseNumber: "COM-20261015-003",
    title: "韓系時裝品牌型錄委託案",
    category: "commercial",
    photographerName: "陳攝影 (Alan Chen)",
    shootDate: "2026-10-30",
    exactTime: "2026/10/30 (五) 12:45 集合",
    exactLocation: "松山文創園區 2 號倉庫前廣場",
    coordinates: "25.0441, 121.5606",
    coopType: "商案拍攝 (商業受託)",
    remuneration: "NT$ 18,000",
    bankInfo: {
      bankCode: "822",
      bankName: "中國信託",
      accountNumber: "1234-5678-9012",
      accountName: "陳*晴",
    },
    outfits: [
      {
        id: "outfit_3",
        title: "韓系秋季針織新品共 6 套",
        description: "品牌方自備服飾與搭配鞋帽",
        image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80",
        modelConfirmed: true,
        photographerConfirmed: true,
        status: "confirmed",
      },
    ],
    checkInStatus: {
      modelCheckedIn: false,
      photographerCheckedIn: false,
    },
    paymentStatus: "deposit_paid",
    status: "confirmed",
    invoiceNotice: {
      invoiceType: "deposit",
      amount: 5400,
      noticeTime: "10-13 11:20",
    },
    messages: [],
  },
];

interface CollaborationTabProps {
  currentModelName?: string;
  events?: CollaborationProject[];
  collaborations?: any;
  setCollaborations?: any;
}

export default function CollaborationTab({
  currentModelName = "羽晴 (Hane)",
  events,
}: CollaborationTabProps) {
  const [collabList, setCollabList] = useState<CollaborationProject[]>(events || DEFAULT_PROJECTS);
  const [innerTab, setInnerTab] = useState<"active" | "history">("active");
  const [selectedCategory, setSelectedCategory] = useState<"all" | CollabCategory>("all");
  const [activeCollabId, setActiveCollabId] = useState<string>("");
  const [newMessage, setNewMessage] = useState("");
  const [newOutfitTitle, setNewOutfitTitle] = useState("");
  const [newOutfitDesc, setNewOutfitDesc] = useState("");
  const [newOutfitImage, setNewOutfitImage] = useState<string>("");
  const [copiedCaseNum, setCopiedCaseNum] = useState<string | null>(null);

  const loadData = () => {
    if (events && events.length > 0) {
      setCollabList(events);
      return;
    }
    const saved = localStorage.getItem("lumina_collaboration_events");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCollabList(parsed);
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }
    localStorage.setItem("lumina_collaboration_events", JSON.stringify(DEFAULT_PROJECTS));
  };

  useEffect(() => {
    loadData();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "lumina_collaboration_events" && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setCollabList(parsed);
          }
        } catch (err) {
          console.error(err);
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [events]);

  const saveToStorage = (updated: CollaborationProject[]) => {
    setCollabList(updated);
    localStorage.setItem("lumina_collaboration_events", JSON.stringify(updated));
  };

  const activeCollabs = (collabList || []).filter((c) => c.status !== "completed");
  const completedCollabs = (collabList || []).filter((c) => c.status === "completed");

  const filteredCollabs = activeCollabs.filter((c) => {
    if (selectedCategory === "all") return true;
    return c.category === selectedCategory;
  });

  const activeProject =
    filteredCollabs.find((c) => c.id === activeCollabId) || filteredCollabs[0] || activeCollabs[0];

  const handleCopyCaseNumber = (caseNum?: string) => {
    if (!caseNum) return;
    navigator.clipboard.writeText(caseNum).then(() => {
      setCopiedCaseNum(caseNum);
      setTimeout(() => setCopiedCaseNum(null), 1800);
    });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeProject) return;

    const msg = {
      id: `msg_${Date.now()}`,
      sender: "model" as const,
      senderName: currentModelName,
      text: newMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const updated = collabList.map((c) =>
      c.id === activeProject.id ? { ...c, messages: [...(c.messages || []), msg] } : c
    );
    saveToStorage(updated);
    setNewMessage("");
  };

  const handleOutfitImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) setNewOutfitImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAddOutfit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOutfitTitle.trim() || !activeProject) return;

    const outfit = {
      id: `outfit_${Date.now()}`,
      title: newOutfitTitle.trim(),
      description: newOutfitDesc.trim() || "自備服裝搭配",
      image: newOutfitImage || undefined,
      modelConfirmed: true,
      photographerConfirmed: false,
      status: "pending" as const,
    };

    const updated = collabList.map((c) =>
      c.id === activeProject.id ? { ...c, outfits: [...(c.outfits || []), outfit] } : c
    );
    saveToStorage(updated);
    setNewOutfitTitle("");
    setNewOutfitDesc("");
    setNewOutfitImage("");
  };

  const handleToggleModelConfirm = (outfitId: string) => {
    if (!activeProject) return;
    const updated = collabList.map((c) => {
      if (c.id !== activeProject.id) return c;
      const updatedOutfits = (c.outfits || []).map((o) => {
        if (o.id !== outfitId) return o;
        const currentStatus = o.modelConfirmed ?? (o.status === "confirmed");
        return { ...o, modelConfirmed: !currentStatus };
      });
      return { ...c, outfits: updatedOutfits };
    });
    saveToStorage(updated);
  };

  const handleDeleteOutfit = (outfitId: string) => {
    if (!activeProject) return;
    const updated = collabList.map((c) =>
      c.id === activeProject.id
        ? { ...c, outfits: (c.outfits || []).filter((o) => o.id !== outfitId) }
        : c
    );
    saveToStorage(updated);
  };

  const handleCopyCoordinates = () => {
    const coords = activeProject?.coordinates || "";
    if (!coords.trim()) {
      alert("尚未設定座標資訊！");
      return;
    }
    navigator.clipboard.writeText(coords.trim()).then(() => {
      alert(`✓ 座標已複製：${coords.trim()}\n可直接至 Google Maps 搜尋貼上！`);
    });
  };

  const handleOpenGoogleMaps = () => {
    const coords = activeProject?.coordinates?.trim() || activeProject?.exactLocation?.trim();
    if (!coords) {
      alert("尚未設定地點！");
      return;
    }
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(coords)}`, "_blank");
  };

  const handleUpdateBank = (field: string, val: string) => {
    if (!activeProject) return;
    const updated = collabList.map((c) =>
      c.id === activeProject.id
        ? { ...c, bankInfo: { ...c.bankInfo, [field]: val } }
        : c
    );
    saveToStorage(updated);
  };

  const handleModelCheckIn = () => {
    if (!activeProject) return;
    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const updated = collabList.map((c) =>
      c.id === activeProject.id
        ? {
            ...c,
            checkInStatus: {
              ...c.checkInStatus,
              modelCheckedIn: true,
              modelCheckInTime: timeStr,
            },
          }
        : c
    );
    saveToStorage(updated);
    alert(`📍 簽到成功！您已於 ${timeStr} 完成現場安全抵達簽到。`);
  };

  const handleConfirmPaymentReceived = () => {
    if (!activeProject) return;
    const updated = collabList.map((c) => {
      if (c.id === activeProject.id && c.paymentNotice) {
        return {
          ...c,
          paymentNotice: {
            ...c.paymentNotice,
            isModelConfirmed: true,
          },
          paymentStatus: "paid" as const,
        };
      }
      return c;
    });
    saveToStorage(updated);
    alert("✅ 已確認款項入帳！系統已同步回報予攝影師。");
  };

  const handleSendPaymentReminder = () => {
    if (!activeProject) return;
    const updated = collabList.map((c) =>
      c.id === activeProject.id ? { ...c, paymentStatus: "reminded" as const } : c
    );
    saveToStorage(updated);
    alert(`📢 轉帳提醒已送達攝影師【${activeProject.photographerName}】！`);
  };

  const handleFinalizeProject = (projectId: string) => {
    const target = collabList.find((c) => c.id === projectId);
    const titleText = target?.title || "本合作專案";
    const confirm = window.confirm(
      `確定要正式完成結案【${titleText}】嗎？\n結案後本專案將自動收納至「歷史邀約」存證庫。`
    );
    if (!confirm) return;

    const updated = collabList.map((c) =>
      c.id === projectId ? { ...c, status: "completed" as const } : c
    );
    saveToStorage(updated);
    alert("🎉 專案已圓滿結案並收納至「歷史邀約」模組！");
  };

  const bothCheckedIn =
    activeProject?.checkInStatus?.modelCheckedIn &&
    activeProject?.checkInStatus?.photographerCheckedIn;

  return (
    <div className="space-y-6">
      <div className="flex bg-[#edeae3]/80 p-1 rounded-2xl border border-stone-300 w-fit">
        <button
          type="button"
          onClick={() => setInnerTab("active")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
            innerTab === "active"
              ? "bg-white text-indigo-700 shadow-xs"
              : "text-stone-600 hover:text-stone-900"
          }`}
        >
          <span>🤝 進行中協作室</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
        </button>
        <button
          type="button"
          onClick={() => setInnerTab("history")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
            innerTab === "history"
              ? "bg-white text-indigo-700 shadow-xs"
              : "text-stone-600 hover:text-stone-900"
          }`}
        >
          <span>📜 歷史邀約存證</span>
          <span className="text-[10px] bg-stone-200 text-stone-700 px-1.5 rounded-full font-mono">
            {completedCollabs.length}
          </span>
        </button>
      </div>

      {innerTab === "history" ? (
        <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="border-b border-stone-200 pb-2">
            <h3 className="text-sm font-bold text-stone-800 flex items-center gap-2">
              <span>📜</span>
              <span>歷史邀約履約紀錄存證庫 ({completedCollabs.length})</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              已結案之約拍專案，完整留存金流、時間戳與合約履約佐證。
            </p>
          </div>

          {completedCollabs.length === 0 ? (
            <div className="p-12 text-center bg-[#f5f3ef] rounded-xl border border-dashed border-stone-300 text-xs text-stone-400">
              目前尚無已結案之專案。進行中案件點擊「正式結案」後將收納至此處。
            </div>
          ) : (
            <div className="space-y-3">
              {completedCollabs.map((item) => (
                <div key={item.id} className="p-4 bg-white border border-stone-200 rounded-xl space-y-2 text-xs shadow-2xs">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] bg-stone-900 text-amber-300 px-1.5 py-0.5 rounded font-bold">
                        #{item.caseNumber}
                      </span>
                      <span className="font-bold text-stone-900 text-sm">{item.title || "合作專案"}</span>
                      <span className="text-stone-500">攝影：{item.photographerName}</span>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[10px] font-bold">
                      ✓ 已結案歸檔
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-500 flex gap-4 pt-1 border-t border-stone-100">
                    <span>時程：{item.exactTime}</span>
                    <span>地點：{item.exactLocation}</span>
                    <span>酬勞：{item.remuneration || "互惠"}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="text-sm font-bold text-stone-800 flex items-center gap-2">
                <span>🤝</span>
                <span>外拍履約協作室</span>
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                三大合作性質分類管理：邀約拍攝（攝影付錢）、互惠拍攝（不收錢）、商案拍攝（專業商業行為）。
              </p>
            </div>

            <div className="flex bg-[#edeae3] p-1 rounded-xl border border-stone-300 text-xs font-bold">
              <button
                type="button"
                onClick={() => setSelectedCategory("all")}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  selectedCategory === "all" ? "bg-white text-indigo-700 shadow-2xs" : "text-stone-600 hover:text-stone-900"
                }`}
              >
                全部 ({activeCollabs.length})
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory("invite")}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  selectedCategory === "invite" ? "bg-white text-indigo-700 shadow-2xs" : "text-stone-600 hover:text-stone-900"
                }`}
              >
                🎟️ 邀約拍攝
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory("tfcd")}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  selectedCategory === "tfcd" ? "bg-white text-indigo-700 shadow-2xs" : "text-stone-600 hover:text-stone-900"
                }`}
              >
                🤝 互惠拍攝
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory("commercial")}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  selectedCategory === "commercial" ? "bg-white text-indigo-700 shadow-2xs" : "text-stone-600 hover:text-stone-900"
                }`}
              >
                💼 商案拍攝
              </button>
            </div>
          </div>

          {filteredCollabs.length === 0 ? (
            <div className="p-12 text-center bg-[#f5f3ef] rounded-xl border border-dashed border-stone-300 space-y-2">
              <span className="text-3xl">📭</span>
              <p className="text-xs text-stone-500 font-medium">該分類目前暫無進行中的約拍合作專案。</p>
            </div>
          ) : (
            <>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {filteredCollabs.map((collab) => (
                  <button
                    key={collab.id}
                    type="button"
                    onClick={() => setActiveCollabId(collab.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition shrink-0 cursor-pointer flex items-center gap-2 ${
                      activeProject?.id === collab.id
                        ? "bg-stone-900 text-white border-stone-900 shadow-xs"
                        : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50"
                    }`}
                  >
                    <span className="font-mono text-[10px] bg-stone-800 text-amber-300 px-1.5 py-0.5 rounded">
                      #{collab.caseNumber}
                    </span>
                    <span>📷 {collab.photographerName}</span>
                    <span className="text-[10px] opacity-75 font-mono">({collab.shootDate})</span>
                  </button>
                ))}
              </div>

              {activeProject && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    {/* 1. 當日現場履約與核銷狀態 */}
                    <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-6 shadow-sm space-y-4">
                      <div className="flex flex-wrap justify-between items-center border-b border-stone-200 pb-2 gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">📍</span>
                          <h3 className="text-sm font-bold text-stone-800">當日現場履約與核銷狀態</h3>
                          {activeProject.caseNumber && (
                            <button
                              type="button"
                              onClick={() => handleCopyCaseNumber(activeProject.caseNumber)}
                              className="px-2 py-0.5 bg-stone-900 hover:bg-stone-800 text-amber-300 rounded text-[11px] font-mono font-bold flex items-center gap-1 transition cursor-pointer shadow-2xs"
                              title="點擊複製案件流水號"
                            >
                              <span>#{activeProject.caseNumber}</span>
                              <span className="text-[10px] text-stone-300 ml-0.5">
                                {copiedCaseNum === activeProject.caseNumber ? "✓ 已複製" : "📋"}
                              </span>
                            </button>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          {activeProject.category === "invite" && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                              🎟️ 邀約拍攝 (攝影付錢)
                            </span>
                          )}
                          {activeProject.category === "tfcd" && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                              🤝 互惠拍攝 (不收錢)
                            </span>
                          )}
                          {activeProject.category === "commercial" && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-300">
                              💼 商案拍攝 (商業受聘)
                            </span>
                          )}
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-600 border border-stone-200">
                            {activeProject.remuneration || "互惠"}
                          </span>
                        </div>
                      </div>

                      {/* 邀約拍攝：匯款通報 */}
                      {activeProject.category === "invite" && activeProject.paymentNotice && (
                        <div className="p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-2">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-xs text-indigo-950">📢 攝影師通報匯款：</span>
                                <span className="text-xs text-stone-700">{activeProject.paymentNotice.bankName}</span>
                                <span className="font-mono text-xs bg-white px-2 py-0.5 rounded border border-indigo-200 font-bold text-indigo-700">
                                  末五碼：{activeProject.paymentNotice.lastFiveDigits}
                                </span>
                              </div>
                              <p className="text-[11px] text-stone-500 mt-0.5">
                                金額：NT$ {activeProject.paymentNotice.amount.toLocaleString()} ‧ 時間：{activeProject.paymentNotice.noticeTime}
                              </p>
                            </div>

                            <div>
                              {activeProject.paymentNotice.isModelConfirmed ? (
                                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold border border-emerald-300">
                                  ✓ 模特已確認入帳
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={handleConfirmPaymentReceived}
                                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition cursor-pointer shadow-2xs"
                                >
                                  ✓ 核帳無誤，確認入帳
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 互惠拍攝：修圖備忘 */}
                      {activeProject.category === "tfcd" && activeProject.revisionNotice && (
                        <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-emerald-900">
                              🎨 最新修圖後製進度（第 {activeProject.revisionNotice.requestCount} 次更新）：
                            </span>
                            <span className="text-[10px] text-stone-400 font-mono">{activeProject.revisionNotice.noticeTime}</span>
                          </div>
                          <p className="text-stone-700 bg-white p-2 rounded border border-emerald-150">
                            {activeProject.revisionNotice.notes}
                          </p>
                        </div>
                      )}

                      {/* 商案拍攝：請款通報 */}
                      {activeProject.category === "commercial" && activeProject.invoiceNotice && (
                        <div className="p-3 bg-amber-50/70 border border-amber-300 rounded-xl text-xs flex justify-between items-center">
                          <div>
                            <span className="font-bold text-amber-950">
                              💼 攝影師已發送【{activeProject.invoiceNotice.invoiceType === "deposit" ? "30% 簽約定金" : "結案尾款"}】請款通報
                            </span>
                            <span className="text-stone-600 ml-2">
                              (應付金額：NT$ {activeProject.invoiceNotice.amount.toLocaleString()})
                            </span>
                          </div>
                          <span className="text-[10px] text-stone-400 font-mono">{activeProject.invoiceNotice.noticeTime}</span>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 bg-white border border-stone-200 rounded-xl space-y-2.5">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-stone-800">
                              🛡️ 抵達拍攝地安全簽到
                            </span>
                            {bothCheckedIn && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                                雙方皆已抵達
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-stone-500">
                            碰頭後請點擊簽到，作為防止放鳥（No-Show）爭議客觀存證依據。
                          </p>

                          <div className="text-[11px] text-stone-500 space-y-0.5">
                            <div>模特簽到：{activeProject.checkInStatus?.modelCheckedIn ? <strong className="text-emerald-700">✓ 已簽到 ({activeProject.checkInStatus.modelCheckInTime})</strong> : "未簽到"}</div>
                            <div>攝影簽到：{activeProject.checkInStatus?.photographerCheckedIn ? <strong className="text-emerald-700">✓ 已簽到 ({activeProject.checkInStatus.photographerCheckInTime || "現場"})</strong> : "未簽到"}</div>
                          </div>

                          {activeProject.checkInStatus?.modelCheckedIn ? (
                            <div className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 p-2.5 rounded-lg flex items-center gap-1.5">
                              <span>✓ 您已於 {activeProject.checkInStatus.modelCheckInTime} 抵達簽到</span>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={handleModelCheckIn}
                              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
                            >
                              📍 我已抵達現場（點擊簽到）
                            </button>
                          )}
                        </div>

                        <div className="p-4 bg-white border border-stone-200 rounded-xl space-y-2.5">
                          <span className="text-xs font-bold text-stone-800 block">
                            💸 拍攝完成提醒攝影師轉帳
                          </span>
                          <p className="text-[11px] text-stone-500">
                            拍攝結束若攝影師忘記付現或轉帳，可一鍵發送禮貌提醒通知。
                          </p>
                          <button
                            type="button"
                            onClick={handleSendPaymentReminder}
                            className={`w-full py-2 rounded-lg text-xs font-bold transition shadow-xs cursor-pointer ${
                              activeProject.paymentStatus === "reminded"
                                ? "bg-amber-600 hover:bg-amber-700 text-white"
                                : "bg-indigo-600 hover:bg-indigo-700 text-white"
                            }`}
                          >
                            {activeProject.paymentStatus === "reminded"
                              ? "📢 已發送轉帳提醒 (可再次提醒)"
                              : "📢 發送提醒轉帳通知"}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* 2. 精確時間地點、座標與收款帳號 */}
                    <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-6 shadow-sm space-y-5">
                      <h3 className="text-sm font-bold text-stone-800 border-b border-stone-200 pb-2 flex items-center gap-1.5">
                        <span>💳</span>
                        <span>準確集合時間、地點與模特收款帳號</span>
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-stone-700 mb-1">準確約定時間點</label>
                          <input
                            type="text"
                            value={activeProject.exactTime || ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              const updated = collabList.map((c) =>
                                c.id === activeProject.id ? { ...c, exactTime: val } : c
                              );
                              saveToStorage(updated);
                            }}
                            className="w-full text-xs bg-white text-stone-800 border border-stone-300 rounded-lg p-2.5 outline-none focus:border-indigo-500 font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-stone-700 mb-1">準確約拍集合地點</label>
                          <input
                            type="text"
                            value={activeProject.exactLocation || ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              const updated = collabList.map((c) =>
                                c.id === activeProject.id ? { ...c, exactLocation: val } : c
                              );
                              saveToStorage(updated);
                            }}
                            className="w-full text-xs bg-white text-stone-800 border border-stone-300 rounded-lg p-2.5 outline-none focus:border-indigo-500 font-bold"
                          />
                        </div>
                      </div>

                      <div className="p-3.5 bg-white border border-stone-200 rounded-xl space-y-2">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                          <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                            <span>🗺️</span>
                            <span>精確 GPS 經緯度座標 (供 Google Map 精準導航防迷路)：</span>
                          </label>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={handleCopyCoordinates}
                              className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1"
                            >
                              <span>📋 一鍵複製座標</span>
                            </button>
                            <button
                              type="button"
                              onClick={handleOpenGoogleMaps}
                              className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1"
                            >
                              <span>🧭 開啟地圖</span>
                            </button>
                          </div>
                        </div>

                        <input
                          type="text"
                          value={activeProject.coordinates || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            const updated = collabList.map((c) =>
                              c.id === activeProject.id ? { ...c, coordinates: val } : c
                            );
                            saveToStorage(updated);
                          }}
                          placeholder="輸入經緯度，例：25.0569, 121.5074"
                          className="w-full text-xs font-mono bg-[#fdfbf7] text-stone-800 border border-stone-300 rounded-lg p-2 outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div className="bg-[#f5f3ef] p-4 rounded-xl border border-stone-300 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-stone-800">
                            🏦 模特收款帳號資訊 (僅此案件合作攝影師可見)：
                          </span>
                          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                            加密保護中
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <input
                            type="text"
                            value={activeProject.bankInfo?.bankCode || ""}
                            onChange={(e) => handleUpdateBank("bankCode", e.target.value)}
                            placeholder="銀行代碼 (例: 822)"
                            className="text-xs bg-white text-stone-800 border border-stone-300 rounded-lg p-2 outline-none focus:border-indigo-500"
                          />
                          <input
                            type="text"
                            value={activeProject.bankInfo?.bankName || ""}
                            onChange={(e) => handleUpdateBank("bankName", e.target.value)}
                            placeholder="銀行名稱 (例: 中國信託)"
                            className="text-xs bg-white text-stone-800 border border-stone-300 rounded-lg p-2 outline-none focus:border-indigo-500"
                          />
                          <input
                            type="text"
                            value={activeProject.bankInfo?.accountName || ""}
                            onChange={(e) => handleUpdateBank("accountName", e.target.value)}
                            placeholder="戶名 (例: 陳*晴)"
                            className="text-xs bg-white text-stone-800 border border-stone-300 rounded-lg p-2 outline-none focus:border-indigo-500"
                          />
                        </div>

                        <input
                          type="text"
                          value={activeProject.bankInfo?.accountNumber || ""}
                          onChange={(e) => handleUpdateBank("accountNumber", e.target.value)}
                          placeholder="銀行帳號 (例: 1234-5678-9012)"
                          className="w-full text-xs font-mono bg-white text-stone-800 border border-stone-300 rounded-lg p-2 outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    {/* 3. 拍攝服裝挑選 */}
                    <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-6 shadow-sm space-y-4">
                      <div className="border-b border-stone-200 pb-2">
                        <h3 className="text-sm font-bold text-stone-800 flex items-center gap-1.5">
                          <span>👗</span>
                          <span>約定服裝挑選與雙方確認清單</span>
                        </h3>
                      </div>

                      <div className="space-y-2.5">
                        {(activeProject.outfits || []).length === 0 ? (
                          <div className="text-center py-6 text-xs text-stone-400 bg-white rounded-xl border border-dashed border-stone-300">
                            尚未新增任何拍攝服裝，請在下方填寫並上傳款式圖片！
                          </div>
                        ) : (
                          activeProject.outfits.map((outfit) => {
                            const isModelOk = outfit.modelConfirmed ?? (outfit.status === "confirmed");
                            const isPhotographerOk =
                              outfit.photographerConfirmed ?? (outfit.status === "confirmed");

                            return (
                              <div
                                key={outfit.id}
                                className="p-3.5 bg-white border border-stone-200 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs shadow-2xs"
                              >
                                <div className="flex items-center gap-3">
                                  {outfit.image ? (
                                    <img
                                      src={outfit.image}
                                      alt={outfit.title}
                                      className="w-14 h-14 object-cover rounded-lg border border-stone-200 shrink-0"
                                    />
                                  ) : (
                                    <div className="w-14 h-14 rounded-lg bg-stone-100 border border-stone-200 flex items-center justify-center text-lg text-stone-400 shrink-0">
                                      👗
                                    </div>
                                  )}
                                  <div>
                                    <span className="font-bold text-stone-800 text-sm block">{outfit.title}</span>
                                    <p className="text-[11px] text-stone-500 mt-0.5">{outfit.description}</p>
                                  </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto">
                                  <button
                                    type="button"
                                    onClick={() => handleToggleModelConfirm(outfit.id)}
                                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition cursor-pointer flex items-center gap-1 ${
                                      isModelOk
                                        ? "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
                                        : "bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100"
                                    }`}
                                  >
                                    <span>{isModelOk ? "✓ 模特：已確認" : "⏳ 模特：待確認 (點擊確認)"}</span>
                                  </button>

                                  <span
                                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border ${
                                      isPhotographerOk
                                        ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                                        : "bg-stone-100 text-stone-600 border-stone-300"
                                    }`}
                                  >
                                    {isPhotographerOk ? "✓ 攝影：已確認" : "⏳ 攝影：待確認"}
                                  </span>

                                  <button
                                    type="button"
                                    onClick={() => handleDeleteOutfit(outfit.id)}
                                    className="text-stone-400 hover:text-rose-600 p-1 cursor-pointer transition text-xs"
                                  >
                                    ✕
                                  </button>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>

                      <form onSubmit={handleAddOutfit} className="p-3.5 bg-stone-50 border border-stone-200 rounded-xl space-y-3">
                        <span className="text-xs font-bold text-stone-700 block">
                          + 新增約定服裝款式與參考圖
                        </span>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={newOutfitTitle}
                            onChange={(e) => setNewOutfitTitle(e.target.value)}
                            placeholder="套裝名稱 (例: 白色細肩碎花洋裝)"
                            className="text-xs bg-white text-stone-800 border border-stone-300 rounded-lg p-2 outline-none focus:border-indigo-500"
                          />
                          <input
                            type="text"
                            value={newOutfitDesc}
                            onChange={(e) => setNewOutfitDesc(e.target.value)}
                            placeholder="備註 / 配件需求 (例: 自備草帽與低跟鞋)"
                            className="text-xs bg-white text-stone-800 border border-stone-300 rounded-lg p-2 outline-none focus:border-indigo-500"
                          />
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                          <div className="flex items-center gap-2">
                            <label className="cursor-pointer px-3 py-1.5 bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 text-xs font-semibold rounded-lg transition flex items-center gap-1 shadow-2xs">
                              <span>📷</span>
                              <span>{newOutfitImage ? "更換款式圖" : "上傳款式圖"}</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleOutfitImageUpload}
                                className="hidden"
                              />
                            </label>
                            {newOutfitImage && (
                              <div className="flex items-center gap-1.5">
                                <img src={newOutfitImage} alt="預覽款式圖" className="w-7 h-7 object-cover rounded border border-stone-300" />
                                <button
                                  type="button"
                                  onClick={() => setNewOutfitImage("")}
                                  className="text-[11px] text-rose-600 hover:underline cursor-pointer"
                                >
                                  移除
                                </button>
                              </div>
                            )}
                          </div>

                          <button
                            type="submit"
                            className="px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white rounded-lg text-xs font-bold transition shrink-0 cursor-pointer shadow-xs"
                          >
                            + 加入服裝清單
                          </button>
                        </div>
                      </form>
                    </div>

                    {/* 4. 結案確認與歸檔模組 */}
                    <div className="bg-[#fbfaf8] border-2 border-dashed border-stone-300 rounded-2xl p-6 shadow-sm space-y-4">
                      <div className="flex justify-between items-center border-b border-stone-200 pb-2">
                        <div>
                          <h4 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                            <span>🏁</span>
                            <span>外拍專案驗收與結案確認</span>
                          </h4>
                          <p className="text-xs text-stone-500 mt-0.5">
                            當拍攝已順利完成、成品交付完畢且尾款全數核對結清後，可點擊結案並移入歷史邀約存證庫。
                          </p>
                        </div>
                        <span className="px-2.5 py-1 bg-stone-100 text-stone-600 rounded-lg text-xs font-bold">
                          最終結案階段
                        </span>
                      </div>

                      <div className="bg-white p-4 rounded-xl border border-stone-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div className="flex items-center gap-2">
                          <span className={bothCheckedIn ? "text-emerald-600 font-bold" : "text-amber-600"}>
                            {bothCheckedIn ? "✓ 雙方現場簽到完成" : "⏳ 簽到紀錄查核中"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={activeProject.paymentStatus === "paid" ? "text-emerald-600 font-bold" : "text-stone-700"}>
                            {activeProject.category === "tfcd"
                              ? "✓ 互惠成品交付驗收"
                              : activeProject.paymentStatus === "paid"
                              ? "✓ 專案款項已結清"
                              : "⏳ 款項等待結清"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-600 font-bold">
                            ✓ 合約通訊存證完整
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-end pt-1">
                        <button
                          type="button"
                          onClick={() => handleFinalizeProject(activeProject.id)}
                          className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-xs cursor-pointer"
                        >
                          <span>🔒</span>
                          <span>正式結案並移入歷史邀約</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 右側一欄：案件即時留言溝通 */}
                  <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-5 shadow-sm flex flex-col h-[760px]">
                    <div className="pb-3 border-b border-stone-200 flex justify-between items-center">
                      <div>
                        <h4 className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                          <span>💬</span>
                          <span>案件即時留言溝通</span>
                        </h4>
                        <p className="text-[10px] text-stone-400 mt-0.5">
                          對象：<strong>{activeProject.photographerName}</strong>
                        </p>
                      </div>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3 py-3 pr-1">
                      {(!activeProject.messages || activeProject.messages.length === 0) ? (
                        <div className="text-center py-16 text-xs text-stone-400">
                          尚無留言紀錄，可在此與攝影師溝通當日細節。
                        </div>
                      ) : (
                        activeProject.messages.map((m) => {
                          const isMe = m.sender === "model";
                          return (
                            <div key={m.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                              <span className="text-[10px] text-stone-400 mb-0.5">
                                {m.senderName} · {m.timestamp}
                              </span>
                              <div
                                className={`p-3 rounded-2xl text-xs max-w-[85%] leading-relaxed ${
                                  isMe
                                    ? "bg-indigo-600 text-white rounded-tr-none shadow-xs"
                                    : "bg-white border border-stone-200 text-stone-800 rounded-tl-none shadow-2xs"
                                }`}
                              >
                                {m.text}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    <form onSubmit={handleSendMessage} className="pt-2 border-t border-stone-200 flex gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="輸入訊息（例：我已搭車出發）..."
                        className="flex-1 text-xs bg-white text-stone-800 border border-stone-300 rounded-xl p-2.5 outline-none focus:border-indigo-500"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                      >
                        送出
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}