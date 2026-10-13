"use client";

import React, { useState } from "react";

export interface CollaborationProject {
  id: string;
  bookingId: string;
  photographerName: string;
  shootDate: string;
  exactTime: string;
  exactLocation: string;
  locationGuide: string;
  coopType: string;
  remuneration?: string;
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
    status: "pending" | "confirmed";
  }[];
  checkInStatus: {
    modelCheckedIn: boolean;
    modelCheckInTime?: string;
    photographerCheckedIn: boolean;
  };
  paymentStatus: "unpaid" | "reminded" | "paid";
  messages: {
    id: string;
    sender: "model" | "photographer";
    senderName: string;
    text: string;
    timestamp: string;
  }[];
}

interface CollaborationTabProps {
  collaborations: CollaborationProject[];
  setCollaborations: React.Dispatch<React.SetStateAction<CollaborationProject[]>>;
  currentModelName: string;
}

export default function CollaborationTab({
  collaborations,
  setCollaborations,
  currentModelName,
}: CollaborationTabProps) {
  const [activeCollabId, setActiveCollabId] = useState<string>(
    collaborations[0]?.id || ""
  );
  const [newMessage, setNewMessage] = useState("");
  const [newOutfitTitle, setNewOutfitTitle] = useState("");
  const [newOutfitDesc, setNewOutfitDesc] = useState("");

  const activeProject = collaborations.find((c) => c.id === activeCollabId) || collaborations[0];

  if (!activeProject) {
    return (
      <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-12 text-center space-y-3">
        <span className="text-3xl">🤝</span>
        <h3 className="text-sm font-bold text-stone-800">目前尚無已確認的履約中專案</h3>
        <p className="text-xs text-stone-500 max-w-sm mx-auto">
          當您在「📥 邀約審核抽屜」點選同意邀約後，該案件將自動建立專屬的「合作協作室」，供雙方確認服裝、收款資訊與即時留言！
        </p>
      </div>
    );
  }

  // 發送即時留言
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msg = {
      id: `msg_${Date.now()}`,
      sender: "model" as const,
      senderName: currentModelName,
      text: newMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setCollaborations((prev) =>
      prev.map((c) =>
        c.id === activeProject.id
          ? { ...c, messages: [...c.messages, msg] }
          : c
      )
    );
    setNewMessage("");
  };

  // 新增準備服裝
  const handleAddOutfit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOutfitTitle.trim()) return;

    const outfit = {
      id: `outfit_${Date.now()}`,
      title: newOutfitTitle.trim(),
      description: newOutfitDesc.trim() || "自備服裝搭配",
      status: "pending" as const,
    };

    setCollaborations((prev) =>
      prev.map((c) =>
        c.id === activeProject.id
          ? { ...c, outfits: [...c.outfits, outfit] }
          : c
      )
    );
    setNewOutfitTitle("");
    setNewOutfitDesc("");
  };

  // 更新收款帳號
  const handleUpdateBank = (field: string, val: string) => {
    setCollaborations((prev) =>
      prev.map((c) =>
        c.id === activeProject.id
          ? { ...c, bankInfo: { ...c.bankInfo, [field]: val } }
          : c
      )
    );
  };

  // 現場安全簽到
  const handleModelCheckIn = () => {
    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setCollaborations((prev) =>
      prev.map((c) =>
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
      )
    );
    alert(`📍 簽到成功！您已於 ${timeStr} 完成現場安全抵達簽到，系統已留存存證紀錄。`);
  };

  // 發送提醒轉帳通知
  const handleSendPaymentReminder = () => {
    setCollaborations((prev) =>
      prev.map((c) =>
        c.id === activeProject.id
          ? { ...c, paymentStatus: "reminded" as const }
          : c
      )
    );
    alert(`📢 轉帳提醒已正式送出！\n已通知攝影師【${activeProject.photographerName}】撥款轉帳至您的戶頭：\n銀行代碼：${activeProject.bankInfo.bankCode}\n帳號：${activeProject.bankInfo.accountNumber}`);
  };

  return (
    <div className="space-y-6">
      {/* 專案選擇分籤列 */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {collaborations.map((collab) => (
          <button
            key={collab.id}
            type="button"
            onClick={() => setActiveCollabId(collab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition shrink-0 cursor-pointer flex items-center gap-2 ${
              activeCollabId === collab.id
                ? "bg-stone-900 text-white border-stone-900 shadow-xs"
                : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50"
            }`}
          >
            <span>📷 {collab.photographerName}</span>
            <span className="text-[10px] opacity-75 font-mono">({collab.shootDate})</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左側兩欄：案件履約重要細節 (收款帳號、時間地點、現場簽到、服裝) */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. 當日現場履約與催款控制板 */}
          <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-stone-200 pb-2">
              <h3 className="text-sm font-bold text-stone-800 flex items-center gap-1.5">
                <span>📍</span>
                <span>當日現場履約與核銷狀態</span>
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                合作性質：{activeProject.coopType}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 安全抵達簽到 */}
              <div className="p-4 bg-white border border-stone-200 rounded-xl space-y-2.5">
                <span className="text-xs font-bold text-stone-800 block">
                  🛡️ 抵達拍攝地安全簽到
                </span>
                <p className="text-[11px] text-stone-500">
                  碰頭後請點擊簽到，作為防止放鳥（No-Show）爭議客觀存證依據。
                </p>
                {activeProject.checkInStatus.modelCheckedIn ? (
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

              {/* 拍攝結束提醒催款 */}
              <div className="p-4 bg-white border border-stone-200 rounded-xl space-y-2.5">
                <span className="text-xs font-bold text-stone-800 block">
                  💸 拍攝完成提醒攝影師轉帳
                </span>
                <p className="text-[11px] text-stone-500">
                  拍攝結束若攝影師忘記付現或轉帳，可一鍵發送禮貌提醒通知。
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSendPaymentReminder}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition shadow-xs cursor-pointer ${
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
          </div>

          {/* 2. 精確時間、地點與模特收款帳號 */}
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
                  value={activeProject.exactTime}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCollaborations((prev) =>
                      prev.map((c) => (c.id === activeProject.id ? { ...c, exactTime: val } : c))
                    );
                  }}
                  placeholder="例：2026/10/28 (三) 13:50 集合"
                  className="w-full text-xs bg-white text-stone-800 border border-stone-300 rounded-lg p-2.5 outline-none focus:border-indigo-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">準確約拍集合地點</label>
                <input
                  type="text"
                  value={activeProject.exactLocation}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCollaborations((prev) =>
                      prev.map((c) => (c.id === activeProject.id ? { ...c, exactLocation: val } : c))
                    );
                  }}
                  placeholder="例：大稻埕碼頭 5 號水門貨櫃市集入口"
                  className="w-full text-xs bg-white text-stone-800 border border-stone-300 rounded-lg p-2.5 outline-none focus:border-indigo-500 font-bold"
                />
              </div>
            </div>

            {/* 收款帳號設定（提供攝影師匯款） */}
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
                  value={activeProject.bankInfo.bankCode}
                  onChange={(e) => handleUpdateBank("bankCode", e.target.value)}
                  placeholder="銀行代碼 (例: 822)"
                  className="text-xs bg-white text-stone-800 border border-stone-300 rounded-lg p-2 outline-none focus:border-indigo-500"
                />
                <input
                  type="text"
                  value={activeProject.bankInfo.bankName}
                  onChange={(e) => handleUpdateBank("bankName", e.target.value)}
                  placeholder="銀行名稱 (例: 中國信託)"
                  className="text-xs bg-white text-stone-800 border border-stone-300 rounded-lg p-2 outline-none focus:border-indigo-500"
                />
                <input
                  type="text"
                  value={activeProject.bankInfo.accountName}
                  onChange={(e) => handleUpdateBank("accountName", e.target.value)}
                  placeholder="戶名 (例: 陳*晴)"
                  className="text-xs bg-white text-stone-800 border border-stone-300 rounded-lg p-2 outline-none focus:border-indigo-500"
                />
              </div>

              <input
                type="text"
                value={activeProject.bankInfo.accountNumber}
                onChange={(e) => handleUpdateBank("accountNumber", e.target.value)}
                placeholder="銀行帳號 (例: 1234-5678-9012)"
                className="w-full text-xs font-mono bg-white text-stone-800 border border-stone-300 rounded-lg p-2 outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* 3. 拍攝服裝挑選與確認清單 */}
          <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-stone-800 border-b border-stone-200 pb-2 flex items-center gap-1.5">
              <span>👗</span>
              <span>約定服裝挑選與確認清單</span>
            </h3>

            <div className="space-y-2">
              {activeProject.outfits.map((outfit) => (
                <div
                  key={outfit.id}
                  className="p-3 bg-white border border-stone-200 rounded-xl flex justify-between items-center text-xs shadow-2xs"
                >
                  <div>
                    <span className="font-bold text-stone-800">{outfit.title}</span>
                    <p className="text-[11px] text-stone-500">{outfit.description}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    ✓ 雙方已確認套裝
                  </span>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddOutfit} className="flex gap-2 pt-1">
              <input
                type="text"
                value={newOutfitTitle}
                onChange={(e) => setNewOutfitTitle(e.target.value)}
                placeholder="套裝名稱 (例: 白色細肩碎花洋裝)"
                className="flex-1 text-xs bg-white border border-stone-300 rounded-lg p-2 outline-none focus:border-indigo-500"
              />
              <input
                type="text"
                value={newOutfitDesc}
                onChange={(e) => setNewOutfitDesc(e.target.value)}
                placeholder="備註 (例: 自備草帽與低跟鞋)"
                className="flex-1 text-xs bg-white border border-stone-300 rounded-lg p-2 outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="px-3.5 py-2 bg-stone-800 hover:bg-stone-900 text-white rounded-lg text-xs font-bold transition shrink-0 cursor-pointer"
              >
                + 新增服裝
              </button>
            </form>
          </div>
        </div>

        {/* 右側一欄：與該攝影師的即時留言溝通板 */}
        <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-5 shadow-sm flex flex-col h-[640px]">
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

          {/* 訊息流視窗 */}
          <div className="flex-1 overflow-y-auto space-y-3 py-3 pr-1">
            {activeProject.messages.map((m) => {
              const isMe = m.sender === "model";
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                >
                  <span className="text-[10px] text-stone-400 mb-0.5">{m.senderName} · {m.timestamp}</span>
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
            })}
          </div>

          {/* 留言發送列 */}
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
    </div>
  );
}