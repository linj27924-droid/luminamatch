"use client";

import React, { useState } from "react";

export type CollabCategory = "invite" | "tfcd" | "commercial";

export interface CollaborationProject {
  id: string;
  caseNumber: string;
  title: string;
  bookingId?: string;
  category: CollabCategory;
  modelName: string;
  shootDate: string;
  exactTime: string;
  exactLocation: string;
  coordinates?: string;
  locationGuide?: string;
  coopType: string;
  remuneration?: string;
  deliveryDays?: number; // 約定交件天數 (預設 14)
  deliveryProof?: {
    cloudUrl: string;
    accessPassword?: string;
    notes?: string;
    deliveredAt: string; // 交付時間戳
    isModelAccepted?: boolean; // 模特是否驗收確認
    acceptedAt?: string;
  };
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

interface PhotographerCollaborationTabProps {
  events: CollaborationProject[];
  handleToggleOutfitApproval: (eventId: string, outfitId: string) => void;
  handleAddOutfit: (eventId: string, title: string, desc: string, img?: string) => void;
  handleDeleteOutfit: (eventId: string, outfitId: string) => void;
  handlePhotographerCheckIn: (eventId: string) => void;
  handleSendMessage: (eventId: string, text: string) => void;
  handleSendPaymentNotice: (eventId: string, bank: string, lastFive: string, amount: number) => void;
  handleSendRevisionNotice: (eventId: string, notes: string) => void;
  handleSendInvoiceNotice: (eventId: string, type: "deposit" | "final", amount: number) => void;
  handleFinalizeProject: (eventId: string) => void;
  handleDeliverPhotos: (eventId: string, cloudUrl: string, password?: string, notes?: string) => void; // ★ 新增交件函式
}

export default function PhotographerCollaborationTab({
  events,
  handleToggleOutfitApproval,
  handleAddOutfit,
  handleDeleteOutfit,
  handlePhotographerCheckIn,
  handleSendMessage,
  handleSendPaymentNotice,
  handleSendRevisionNotice,
  handleSendInvoiceNotice,
  handleFinalizeProject,
  handleDeliverPhotos,
}: PhotographerCollaborationTabProps) {
  const [innerTab, setInnerTab] = useState<"active" | "history">("active");
  const [selectedCategory, setSelectedCategory] = useState<"all" | CollabCategory>("all");
  const [activeCollabId, setActiveCollabId] = useState<string>("");
  const [newMessage, setNewMessage] = useState("");
  const [newOutfitTitle, setNewOutfitTitle] = useState("");
  const [newOutfitDesc, setNewOutfitDesc] = useState("");
  const [newOutfitImage, setNewOutfitImage] = useState<string>("");
  const [copiedCaseNum, setCopiedCaseNum] = useState<string | null>(null);

  // 交付彈窗狀態
  const [deliverModalOpen, setDeliverModalOpen] = useState(false);
  const [cloudUrlInput, setCloudUrlInput] = useState("");
  const [accessPasswordInput, setAccessPasswordInput] = useState("");
  const [deliveryNotesInput, setDeliveryNotesInput] = useState("");

  const [payModalOpen, setPayModalOpen] = useState(false);
  const [bankName, setBankName] = useState("國泰世華 (013)");
  const [lastFive, setLastFive] = useState("");
  const [payAmountInput, setPayAmountInput] = useState<number>(3000);

  const [revModalOpen, setRevModalOpen] = useState(false);
  const [revNotes, setRevNotes] = useState("");

  const [invModalOpen, setInvModalOpen] = useState(false);
  const [invType, setInvType] = useState<"deposit" | "final">("deposit");
  const [invAmount, setInvAmount] = useState<number>(5000);

  const activeEvents = events.filter((e) => e.status !== "completed");
  const completedEvents = events.filter((e) => e.status === "completed");

  const filteredCollabs = activeEvents.filter((c) => {
    if (selectedCategory === "all") return true;
    return c.category === selectedCategory;
  });

  const activeProject =
    filteredCollabs.find((c) => c.id === activeCollabId) || filteredCollabs[0] || activeEvents[0];

  const handleCopyCaseNumber = (caseNum?: string) => {
    if (!caseNum) return;
    navigator.clipboard.writeText(caseNum).then(() => {
      setCopiedCaseNum(caseNum);
      setTimeout(() => setCopiedCaseNum(null), 1800);
    });
  };

  const handleCopyCoordinates = () => {
    const coords = activeProject?.coordinates || "";
    if (!coords.trim()) {
      alert("尚未設定經緯度座標！");
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

  // 計算交付天數倒數
  const getDeliveryCountdown = (shootDateStr: string, limitDays: number = 14) => {
    try {
      const shootDate = new Date(shootDateStr);
      const dueDate = new Date(shootDate);
      dueDate.setDate(dueDate.getDate() + limitDays);

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      dueDate.setHours(0, 0, 0, 0);

      const diffTime = dueDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return {
        dueDateStr: dueDate.toISOString().slice(0, 10),
        remainingDays: diffDays,
        isOverdue: diffDays < 0,
      };
    } catch {
      return { dueDateStr: "約定 14 天內", remainingDays: 14, isOverdue: false };
    }
  };

  const submitSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeProject) return;
    handleSendMessage(activeProject.id, newMessage.trim());
    setNewMessage("");
  };

  const submitAddOutfit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOutfitTitle.trim() || !activeProject) return;
    handleAddOutfit(activeProject.id, newOutfitTitle.trim(), newOutfitDesc.trim(), newOutfitImage || undefined);
    setNewOutfitTitle("");
    setNewOutfitDesc("");
    setNewOutfitImage("");
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

  const submitPaymentNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProject || !lastFive.trim()) return;
    handleSendPaymentNotice(activeProject.id, bankName, lastFive.trim(), Number(payAmountInput));
    setPayModalOpen(false);
    setLastFive("");
  };

  const submitRevisionNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProject || !revNotes.trim()) return;
    handleSendRevisionNotice(activeProject.id, revNotes.trim());
    setRevModalOpen(false);
    setRevNotes("");
  };

  const submitInvoiceNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProject) return;
    handleSendInvoiceNotice(activeProject.id, invType, Number(invAmount));
    setInvModalOpen(false);
  };

  // 送出雲端交件
  const submitDeliverPhotos = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProject || !cloudUrlInput.trim()) return;
    handleDeliverPhotos(
      activeProject.id,
      cloudUrlInput.trim(),
      accessPasswordInput.trim() || undefined,
      deliveryNotesInput.trim() || undefined
    );
    setDeliverModalOpen(false);
    setCloudUrlInput("");
    setAccessPasswordInput("");
    setDeliveryNotesInput("");
  };

  const bothCheckedIn =
    activeProject?.checkInStatus?.modelCheckedIn &&
    activeProject?.checkInStatus?.photographerCheckedIn;

  const countdown = activeProject
    ? getDeliveryCountdown(activeProject.shootDate, activeProject.deliveryDays || 14)
    : null;

  return (
    <div className="space-y-6">
      {/* 履約協作 vs 歷史邀約 切換列 */}
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
            {completedEvents.length}
          </span>
        </button>
      </div>

      {innerTab === "history" ? (
        <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="border-b border-stone-200 pb-2">
            <h3 className="text-sm font-bold text-stone-800 flex items-center gap-2">
              <span>📜</span>
              <span>歷史邀約履約紀錄存證庫 ({completedEvents.length})</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              已結案之約拍專案，完整留存金流、時間戳與合約履約佐證。
            </p>
          </div>

          {completedEvents.length === 0 ? (
            <div className="p-12 text-center bg-[#f5f3ef] rounded-xl border border-dashed border-stone-300 text-xs text-stone-400">
              目前尚無已結案之專案。進行中案件點擊「正式結案」後將收納至此處。
            </div>
          ) : (
            <div className="space-y-3">
              {completedEvents.map((item) => (
                <div key={item.id} className="p-4 bg-white border border-stone-200 rounded-xl space-y-2 text-xs shadow-2xs">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] bg-stone-900 text-amber-300 px-1.5 py-0.5 rounded font-bold">
                        #{item.caseNumber}
                      </span>
                      <span className="font-bold text-stone-900 text-sm">{item.title}</span>
                      <span className="text-stone-500">模特：{item.modelName}</span>
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
                全部 ({activeEvents.length})
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
                    <span>👩‍🦰 {collab.modelName}</span>
                    <span className="text-[10px] opacity-75 font-mono">({collab.shootDate})</span>
                  </button>
                ))}
              </div>

              {activeProject && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    {/* ★ 核心功能 1：成品交付連結與倒數存證區塊 */}
                    <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-6 shadow-sm space-y-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-stone-200 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-base">📦</span>
                          <h3 className="text-sm font-bold text-stone-900">
                            精修照片成品交付存證（約定 {activeProject.deliveryDays || 14} 天內交付）
                          </h3>
                        </div>

                        {/* 倒數標籤 */}
                        {countdown && (
                          <div className="flex items-center gap-1.5">
                            {activeProject.deliveryProof ? (
                              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-bold">
                                ✓ 成品已正式交付
                              </span>
                            ) : countdown.isOverdue ? (
                              <span className="px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-300 rounded-lg text-xs font-bold animate-pulse">
                                ⚠️ 已逾期 {Math.abs(countdown.remainingDays)} 天 (期限: {countdown.dueDateStr})
                              </span>
                            ) : countdown.remainingDays === 0 ? (
                              <span className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-300 rounded-lg text-xs font-bold animate-pulse">
                                ⏳ 今日為交件截止日 ({countdown.dueDateStr})
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-bold">
                                ⏳ 交稿倒數剩餘 {countdown.remainingDays} 天 (期限: {countdown.dueDateStr})
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* 交付內容展示或填寫按鈕 */}
                      {activeProject.deliveryProof ? (
                        <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-3">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs text-stone-800">🔗 雲端下載載點：</span>
                              <a
                                href={activeProject.deliveryProof.cloudUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs font-bold text-indigo-600 hover:underline max-w-sm truncate block"
                              >
                                {activeProject.deliveryProof.cloudUrl}
                              </a>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                setCloudUrlInput(activeProject.deliveryProof?.cloudUrl || "");
                                setAccessPasswordInput(activeProject.deliveryProof?.accessPassword || "");
                                setDeliveryNotesInput(activeProject.deliveryProof?.notes || "");
                                setDeliverModalOpen(true);
                              }}
                              className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-[11px] font-bold cursor-pointer"
                            >
                              ✏️ 修改載點
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-stone-600 bg-[#fbfaf8] p-2.5 rounded-lg border border-stone-150">
                            <div>解壓/取件密碼：<strong>{activeProject.deliveryProof.accessPassword || "無密碼"}</strong></div>
                            <div>交付時間：<span className="font-mono">{activeProject.deliveryProof.deliveredAt}</span></div>
                            <div>
                              模特驗收狀態：
                              {activeProject.deliveryProof.isModelAccepted ? (
                                <strong className="text-emerald-700 ml-1">✓ 已驗收確認</strong>
                              ) : (
                                <span className="text-amber-700 ml-1">⏳ 模特查驗中</span>
                              )}
                            </div>
                          </div>

                          {activeProject.deliveryProof.notes && (
                            <p className="text-[11px] text-stone-500 bg-[#f5f3ef] p-2 rounded">
                              備註說明：{activeProject.deliveryProof.notes}
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="bg-white p-4 rounded-xl border border-stone-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                          <div>
                            <span className="font-bold text-xs text-stone-800 block">尚未正式交付成品雲端載點</span>
                            <p className="text-[11px] text-stone-500 mt-0.5">
                              調色或精修完成後，請上傳 Google Drive、Dropbox 或雲端並在此填寫載點以留存存證。
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => setDeliverModalOpen(true)}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-2xs shrink-0 cursor-pointer"
                          >
                            📤 正式交付成品雲端連結
                          </button>
                        </div>
                      )}
                    </div>

                    {/* 2. 當日現場履約與核銷狀態 */}
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
                              🎟️ 邀約拍攝 (自費聘請)
                            </span>
                          )}
                          {activeProject.category === "tfcd" && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                              🤝 互惠拍攝 (不收錢)
                            </span>
                          )}
                          {activeProject.category === "commercial" && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-300">
                              💼 商案拍攝 (受託出勤)
                            </span>
                          )}
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-600 border border-stone-200">
                            {activeProject.remuneration || "互惠"}
                          </span>
                        </div>
                      </div>

                      {/* 邀約拍攝：匯款通報按鈕 */}
                      {activeProject.category === "invite" && (
                        <div className="p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                              <span>💳</span>
                              <span>匯款核帳通報模組（付費予模特）</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setPayModalOpen(true);
                                setPayAmountInput(6000);
                              }}
                              className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition cursor-pointer shadow-2xs"
                            >
                              📢 通知模特我已匯款（末五碼）
                            </button>
                          </div>

                          {activeProject.paymentNotice ? (
                            <div className="bg-white p-3 rounded-lg border border-indigo-150 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
                              <div>
                                <span className="font-bold text-stone-800">
                                  已通報匯款：{activeProject.paymentNotice.bankName} ｜ 末五碼：
                                  <span className="font-mono text-indigo-700 font-bold bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200">
                                    {activeProject.paymentNotice.lastFiveDigits}
                                  </span>
                                </span>
                                <span className="text-stone-500 ml-2">
                                  (NT$ {activeProject.paymentNotice.amount.toLocaleString()} ‧ {activeProject.paymentNotice.noticeTime})
                                </span>
                              </div>
                              <div>
                                {activeProject.paymentNotice.isModelConfirmed ? (
                                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[11px] font-bold">
                                    ✓ 模特已核對入帳
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-300 rounded text-[11px] font-bold">
                                    ⏳ 等待模特核對款項
                                  </span>
                                )}
                              </div>
                            </div>
                          ) : (
                            <p className="text-[11px] text-indigo-700/80">
                              尚未發送匯款通知。匯出款項後，請點擊上方按鈕通報末五碼以利模特對帳。
                            </p>
                          )}
                        </div>
                      )}

                      {/* 互惠拍攝：修圖備忘 */}
                      {activeProject.category === "tfcd" && (
                        <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                              <span>🎨</span>
                              <span>作品成品交付與修改溝通</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => setRevModalOpen(true)}
                              className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition cursor-pointer shadow-2xs"
                            >
                              📢 通知照片調色／修改進度
                            </button>
                          </div>

                          {activeProject.revisionNotice ? (
                            <div className="bg-white p-3 rounded-lg border border-emerald-150 text-xs space-y-1">
                              <div className="flex justify-between items-center">
                                <span className="font-bold text-emerald-900">
                                  最新後製修改紀錄（累計提出 {activeProject.revisionNotice.requestCount} 次）：
                                </span>
                                <span className="text-[10px] text-stone-400 font-mono">{activeProject.revisionNotice.noticeTime}</span>
                              </div>
                              <p className="text-stone-700 bg-[#f5f3ef] p-2 rounded border border-stone-200 font-medium">
                                {activeProject.revisionNotice.notes}
                              </p>
                            </div>
                          ) : (
                            <p className="text-[11px] text-emerald-800/80">
                              互惠專案成品交付中。毛片挑選或調色更新時，可發送進度備忘留存存證。
                            </p>
                          )}
                        </div>
                      )}

                      {/* 商案拍攝：請款通報 */}
                      {activeProject.category === "commercial" && (
                        <div className="p-3.5 bg-amber-50/70 border border-amber-300 rounded-xl space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                              <span>💼</span>
                              <span>商案款項請款與催收通知</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => setInvModalOpen(true)}
                              className="px-3 py-1 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-bold transition cursor-pointer shadow-2xs"
                            >
                              📢 發送請款通知（定金／尾款）
                            </button>
                          </div>

                          {activeProject.invoiceNotice ? (
                            <div className="bg-white p-3 rounded-lg border border-amber-200 flex justify-between items-center text-xs">
                              <div>
                                <span className="font-bold text-stone-900">
                                  已於 {activeProject.invoiceNotice.noticeTime} 發送
                                  <span className="text-amber-800 font-bold ml-1">
                                    【{activeProject.invoiceNotice.invoiceType === "deposit" ? "30% 簽約定金" : "結案尾款"}】
                                  </span>
                                  請款通報
                                </span>
                                <span className="text-stone-500 ml-2">
                                  (應付金額：NT$ {activeProject.invoiceNotice.amount.toLocaleString()})
                                </span>
                              </div>
                              <span className="text-[10px] text-stone-400 font-mono">{activeProject.invoiceNotice.noticeTime}</span>
                            </div>
                          ) : (
                            <p className="text-[11px] text-amber-900/80">
                              商案依合約規定需預收定金。點擊上方按鈕可正式發送請款提醒。
                            </p>
                          )}
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

                          {activeProject.checkInStatus?.photographerCheckedIn ? (
                            <div className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 p-2.5 rounded-lg flex items-center gap-1.5">
                              <span>✓ 您已於 {activeProject.checkInStatus.photographerCheckInTime} 抵達簽到</span>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handlePhotographerCheckIn(activeProject.id)}
                              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
                            >
                              📍 我已抵達現場（點擊簽到）
                            </button>
                          )}
                        </div>

                        <div className="p-4 bg-white border border-stone-200 rounded-xl space-y-2.5">
                          <span className="text-xs font-bold text-stone-800 block">
                            💵 專案款項狀態
                          </span>
                          <p className="text-[11px] text-stone-500">
                            即時顯示款項收取進度，邀約拍攝由攝影師自費聘請模特。
                          </p>
                          <div className="text-xs font-bold text-stone-700 bg-[#f5f3ef] p-2.5 rounded-lg border border-stone-200">
                            狀態：
                            <span className="text-indigo-700 ml-1">
                              {activeProject.category === "tfcd"
                                ? "互惠免支付"
                                : activeProject.paymentStatus === "paid"
                                ? "尾款已結清"
                                : activeProject.paymentStatus === "deposit_paid"
                                ? "定金已收"
                                : "尚未付款"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 3. 精確時間地點、座標與收款帳號 */}
                    <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-6 shadow-sm space-y-5">
                      <h3 className="text-sm font-bold text-stone-800 border-b border-stone-200 pb-2 flex items-center gap-1.5">
                        <span>💳</span>
                        <span>集合時間、地點與模特收款帳號（供匯款）</span>
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div className="p-3 bg-white rounded-xl border border-stone-200">
                          <span className="font-bold text-stone-500 block mb-1">約定集合時間：</span>
                          <span className="font-bold text-stone-800 text-sm">{activeProject.exactTime}</span>
                        </div>
                        <div className="p-3 bg-white rounded-xl border border-stone-200">
                          <span className="font-bold text-stone-500 block mb-1">約定集合地點：</span>
                          <span className="font-bold text-stone-800 text-sm">{activeProject.exactLocation}</span>
                        </div>
                      </div>

                      <div className="p-3.5 bg-white border border-stone-200 rounded-xl space-y-2">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                          <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                            <span>🗺️</span>
                            <span>精確 GPS 經緯度座標：</span>
                          </label>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={handleCopyCoordinates}
                              className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1"
                            >
                              <span>📋 複製座標</span>
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
                        <p className="text-xs font-mono text-stone-700 bg-[#fdfbf7] p-2 rounded border border-stone-300">
                          {activeProject.coordinates || "尚未填寫座標"}
                        </p>
                      </div>

                      <div className="bg-[#f5f3ef] p-4 rounded-xl border border-stone-300 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-stone-800">
                            🏦 模特【{activeProject.modelName}】收款帳號（供匯款轉帳）：
                          </span>
                          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                            存證保護中
                          </span>
                        </div>

                        <div className="p-3 bg-white rounded-lg border border-stone-200 text-xs space-y-1">
                          <div className="flex gap-4">
                            <span>銀行代碼：<strong>{activeProject.bankInfo?.bankCode}</strong></span>
                            <span>銀行名稱：<strong>{activeProject.bankInfo?.bankName}</strong></span>
                            <span>戶名：<strong>{activeProject.bankInfo?.accountName}</strong></span>
                          </div>
                          <div className="pt-1 font-mono text-sm font-bold text-indigo-700">
                            帳號：{activeProject.bankInfo?.accountNumber}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 4. 拍攝服裝挑選 */}
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
                                  <span
                                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border ${
                                      isModelOk
                                        ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                                        : "bg-amber-50 text-amber-800 border-amber-300"
                                    }`}
                                  >
                                    {isModelOk ? "✓ 模特：已確認" : "⏳ 模特：待確認"}
                                  </span>

                                  <button
                                    type="button"
                                    onClick={() => handleToggleOutfitApproval(activeProject.id, outfit.id)}
                                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition cursor-pointer flex items-center gap-1 ${
                                      isPhotographerOk
                                        ? "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
                                        : "bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700 shadow-2xs"
                                    }`}
                                    title="點擊確認本套服裝造型"
                                  >
                                    <span>{isPhotographerOk ? "✓ 攝影：已確認" : "點擊確認此服裝"}</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleDeleteOutfit(activeProject.id, outfit.id)}
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

                      <form onSubmit={submitAddOutfit} className="p-3.5 bg-stone-50 border border-stone-200 rounded-xl space-y-3">
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

                    {/* 5. 結案確認與歸檔模組 */}
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
                          <span className={activeProject.deliveryProof?.isModelAccepted ? "text-emerald-600 font-bold" : "text-stone-700"}>
                            {activeProject.deliveryProof?.isModelAccepted
                              ? "✓ 成品已交付驗收"
                              : activeProject.deliveryProof
                              ? "⏳ 成品待模特查驗"
                              : "⏳ 成品尚未交付"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={activeProject.paymentStatus === "paid" ? "text-emerald-600 font-bold" : "text-stone-700"}>
                            {activeProject.category === "tfcd"
                              ? "✓ 互惠專案免付款"
                              : activeProject.paymentStatus === "paid"
                              ? "✓ 專案款項已結清"
                              : "⏳ 款項等待結清"}
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
                  <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-5 shadow-sm flex flex-col h-[860px]">
                    <div className="pb-3 border-b border-stone-200 flex justify-between items-center">
                      <div>
                        <h4 className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                          <span>💬</span>
                          <span>案件即時留言溝通</span>
                        </h4>
                        <p className="text-[10px] text-stone-400 mt-0.5">
                          對象：<strong>{activeProject.modelName}</strong>
                        </p>
                      </div>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3 py-3 pr-1">
                      {(!activeProject.messages || activeProject.messages.length === 0) ? (
                        <div className="text-center py-16 text-xs text-stone-400">
                          尚無留言紀錄，可在此與模特溝通當日細節。
                        </div>
                      ) : (
                        activeProject.messages.map((m) => {
                          const isMe = m.sender === "photographer";
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

                    <form onSubmit={submitSendChat} className="pt-2 border-t border-stone-200 flex gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="輸入訊息..."
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

      {/* ★ 彈窗 0：交付成品雲端載點 */}
      {deliverModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={submitDeliverPhotos} className="bg-[#fbfaf8] border border-stone-200 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-stone-200 pb-2">
              <h4 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                <span>📤</span>
                <span>正式交付成品雲端載點（合約存證）</span>
              </h4>
              <button type="button" onClick={() => setDeliverModalOpen(false)} className="text-stone-400 hover:text-stone-600 text-base font-bold cursor-pointer">✕</button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">雲端下載網址 (Google Drive / Dropbox / OneDrive 等)</label>
                <input
                  type="url"
                  required
                  value={cloudUrlInput}
                  onChange={(e) => setCloudUrlInput(e.target.value)}
                  placeholder="https://drive.google.com/drive/folders/..."
                  className="w-full bg-white text-stone-800 border border-stone-300 rounded-lg p-2.5 outline-none focus:border-indigo-500 font-mono text-xs"
                />
              </div>
              <div>
                <label className="block font-bold text-stone-700 mb-1">下載密碼 / 解壓密碼 (若無可留空)</label>
                <input
                  type="text"
                  value={accessPasswordInput}
                  onChange={(e) => setAccessPasswordInput(e.target.value)}
                  placeholder="例：2026hane"
                  className="w-full bg-white text-stone-800 border border-stone-300 rounded-lg p-2.5 outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block font-bold text-stone-700 mb-1">交稿說明 / 挑選精修張數備忘</label>
                <textarea
                  rows={3}
                  value={deliveryNotesInput}
                  onChange={(e) => setDeliveryNotesInput(e.target.value)}
                  placeholder="例：包含 15 張高畫質精修 JPG + 全數調色毛片，請於 7 日內下載保存。"
                  className="w-full bg-white text-stone-800 border border-stone-300 rounded-lg p-2.5 outline-none focus:border-indigo-500"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-stone-200">
              <button type="button" onClick={() => setDeliverModalOpen(false)} className="px-3.5 py-1.5 bg-stone-200 text-stone-700 rounded-xl text-xs font-bold hover:bg-stone-300 cursor-pointer">取消</button>
              <button type="submit" className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer">確認交付並發送通報</button>
            </div>
          </form>
        </div>
      )}

      {/* 彈窗 1：邀約拍攝 - 匯款通知 */}
      {payModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={submitPaymentNotice} className="bg-[#fbfaf8] border border-stone-200 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-stone-200 pb-2">
              <h4 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                <span>💳</span>
                <span>通知模特我已完成匯款</span>
              </h4>
              <button type="button" onClick={() => setPayModalOpen(false)} className="text-stone-400 hover:text-stone-600 text-base font-bold cursor-pointer">✕</button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">轉出銀行名稱／代碼</label>
                <input type="text" required value={bankName} onChange={(e) => setBankName(e.target.value)} className="w-full bg-white text-stone-800 border border-stone-300 rounded-lg p-2.5 outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="block font-bold text-stone-700 mb-1">轉出帳號【末五碼】</label>
                <input type="text" required maxLength={5} value={lastFive} onChange={(e) => setLastFive(e.target.value)} placeholder="5 位數字" className="w-full bg-white text-stone-800 font-mono text-sm border border-stone-300 rounded-lg p-2.5 outline-none focus:border-indigo-500 font-bold" />
              </div>
              <div>
                <label className="block font-bold text-stone-700 mb-1">本次匯款金額 (NT$)</label>
                <input type="number" required value={payAmountInput} onChange={(e) => setPayAmountInput(Number(e.target.value))} className="w-full bg-white text-stone-800 font-bold border border-stone-300 rounded-lg p-2.5 outline-none focus:border-indigo-500" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-stone-200">
              <button type="button" onClick={() => setPayModalOpen(false)} className="px-3.5 py-1.5 bg-stone-200 text-stone-700 rounded-xl text-xs font-bold hover:bg-stone-300">取消</button>
              <button type="submit" className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer">確認送出匯款通知</button>
            </div>
          </form>
        </div>
      )}

      {/* 彈窗 2：互惠修圖通知 */}
      {revModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={submitRevisionNotice} className="bg-[#fbfaf8] border border-stone-200 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-stone-200 pb-2">
              <h4 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                <span>🎨</span>
                <span>互惠拍攝 - 照片調色與修改通知</span>
              </h4>
              <button type="button" onClick={() => setRevModalOpen(false)} className="text-stone-400 hover:text-stone-600 text-base font-bold cursor-pointer">✕</button>
            </div>
            <div className="text-xs">
              <label className="block font-bold text-stone-700 mb-1">修改說明／交付進度內容</label>
              <textarea rows={4} required value={revNotes} onChange={(e) => setRevNotes(e.target.value)} placeholder="例：已將精修色溫微調，雲端連結已更新！" className="w-full bg-white text-stone-800 border border-stone-300 rounded-lg p-2.5 outline-none focus:border-indigo-500 leading-relaxed" />
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-stone-200">
              <button type="button" onClick={() => setRevModalOpen(false)} className="px-3.5 py-1.5 bg-stone-200 text-stone-700 rounded-xl text-xs font-bold hover:bg-stone-300">取消</button>
              <button type="submit" className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer">送出修改備忘</button>
            </div>
          </form>
        </div>
      )}

      {/* 彈窗 3：商案請款通知 */}
      {invModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={submitInvoiceNotice} className="bg-[#fbfaf8] border border-stone-200 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-stone-200 pb-2">
              <h4 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                <span>💼</span>
                <span>商案拍攝 - 發送請款通知</span>
              </h4>
              <button type="button" onClick={() => setInvModalOpen(false)} className="text-stone-400 hover:text-stone-600 text-base font-bold cursor-pointer">✕</button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">請款階段類別</label>
                <div className="flex gap-2">
                  <label onClick={() => setInvType("deposit")} className={`flex-1 p-2 rounded-lg border text-center font-bold cursor-pointer ${invType === "deposit" ? "bg-amber-100 border-amber-400 text-amber-900" : "bg-white border-stone-300 text-stone-600"}`}>30% 簽約定金</label>
                  <label onClick={() => setInvType("final")} className={`flex-1 p-2 rounded-lg border text-center font-bold cursor-pointer ${invType === "final" ? "bg-amber-100 border-amber-400 text-amber-900" : "bg-white border-stone-300 text-stone-600"}`}>70% 結案尾款</label>
                </div>
              </div>
              <div>
                <label className="block font-bold text-stone-700 mb-1">應付請款金額 (NT$)</label>
                <input type="number" required value={invAmount} onChange={(e) => setInvAmount(Number(e.target.value))} className="w-full bg-white text-stone-800 font-bold border border-stone-300 rounded-lg p-2.5 outline-none focus:border-indigo-500" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-stone-200">
              <button type="button" onClick={() => setInvModalOpen(false)} className="px-3.5 py-1.5 bg-stone-200 text-stone-700 rounded-xl text-xs font-bold hover:bg-stone-300">取消</button>
              <button type="submit" className="px-4 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer">發送請款通知</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}