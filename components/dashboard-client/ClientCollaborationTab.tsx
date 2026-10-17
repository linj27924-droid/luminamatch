"use client";

import React, { useState } from "react";
import { CollaborationProject } from "../dashboard-photographer/PhotographerCollaborationTab";

interface ClientCollaborationTabProps {
  events: CollaborationProject[];
  clientName: string;
  onSendMessage: (eventId: string, text: string) => void;
  onToggleOutfit: (eventId: string, outfitId: string) => void;
  onConfirmDepositPayment: (eventId: string) => void;
  onFinalizeProject: (eventId: string) => void;
}

export default function ClientCollaborationTab({
  events,
  clientName,
  onSendMessage,
  onToggleOutfit,
  onConfirmDepositPayment,
  onFinalizeProject,
}: ClientCollaborationTabProps) {
  const [selectedEventId, setSelectedEventId] = useState<string>(
    events[0]?.id || ""
  );
  const [inputText, setInputText] = useState("");

  const activeEvent = events.find((e) => e.id === selectedEventId) || events[0];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeEvent) return;
    onSendMessage(activeEvent.id, inputText.trim());
    setInputText("");
  };

  if (events.length === 0) {
    return (
      <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-12 text-center text-xs text-stone-400 space-y-2">
        <div className="text-3xl">💬</div>
        <h4 className="font-bold text-stone-700">目前尚無進行中的商案溝通</h4>
        <p>在「應徵審查」分頁中審核並錄用模特或攝影師後，此處將自動開闢專屬協作室。</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 text-xs">
      {/* 專案橫向切換分頁 */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {events.map((evt) => (
          <button
            key={evt.id}
            type="button"
            onClick={() => setSelectedEventId(evt.id)}
            className={`px-4 py-2 rounded-xl border font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              activeEvent?.id === evt.id
                ? "bg-stone-900 text-white border-stone-900 shadow-2xs"
                : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50"
            }`}
          >
            <span>📁</span>
            <span>{evt.title}</span>
            <span className="text-[10px] bg-stone-700 text-stone-200 px-1.5 py-0.2 rounded font-mono">
              {evt.coopType}
            </span>
          </button>
        ))}
      </div>

      {activeEvent && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 左欄：專案資訊與履約狀態 */}
          <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="border-b border-stone-200 pb-2">
              <span className="text-[10px] font-mono text-indigo-600 font-bold block">
                {activeEvent.caseNumber}
              </span>
              <h3 className="font-bold text-stone-900 text-sm mt-0.5">{activeEvent.title}</h3>
            </div>

            <div className="space-y-2 text-stone-600 text-[11px]">
              <div>🤝 合作對象：<strong className="text-stone-900 font-bold">{activeEvent.modelName}</strong></div>
              <div>📅 集合時間：<strong>{activeEvent.exactTime}</strong></div>
              <div>📍 拍攝集合點：<strong>{activeEvent.exactLocation}</strong></div>
              <div>💰 專案報酬：<strong className="text-indigo-700 font-bold">{activeEvent.remuneration}</strong></div>
            </div>

            {/* 定金存證按鈕 */}
            <div className="p-3 bg-white border border-stone-200 rounded-xl space-y-2">
              <span className="font-bold text-stone-800 block text-[11px]">合約履約進度</span>
              <div className="flex justify-between items-center text-[11px]">
                <span>30% 定金狀態：</span>
                <span className={`font-bold ${activeEvent.paymentStatus === "deposit_paid" ? "text-emerald-700" : "text-amber-600"}`}>
                  {activeEvent.paymentStatus === "deposit_paid" ? "✓ 已付定金" : "待品牌方支付"}
                </span>
              </div>

              {activeEvent.paymentStatus !== "deposit_paid" ? (
                <button
                  type="button"
                  onClick={() => onConfirmDepositPayment(activeEvent.id)}
                  className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition shadow-2xs cursor-pointer text-[11px]"
                >
                  確認已匯出 30% 定金
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onFinalizeProject(activeEvent.id)}
                  className="w-full py-1.5 bg-stone-900 hover:bg-black text-white font-bold rounded-lg transition shadow-2xs cursor-pointer text-[11px]"
                >
                  🎉 完成驗收並結案
                </button>
              )}
            </div>

            {/* 品牌方服裝搭配確認 */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-stone-800 text-[11px]">拍攝服裝確認清單</span>
                <span className="text-[10px] text-stone-400">點擊切換確認狀態</span>
              </div>
              {activeEvent.outfits?.map((o) => (
                <div
                  key={o.id}
                  onClick={() => onToggleOutfit(activeEvent.id, o.id)}
                  className="p-2.5 bg-white border border-stone-200 rounded-xl flex items-center justify-between cursor-pointer hover:border-indigo-300 transition"
                >
                  <div>
                    <div className="font-bold text-stone-800 text-[11px]">{o.title}</div>
                    <div className="text-[10px] text-stone-500">{o.description}</div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                    o.photographerConfirmed ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-stone-100 text-stone-500"
                  }`}>
                    {o.photographerConfirmed ? "✓ 品牌已核可" : "待確認"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 右兩欄：即時溝通對話室 */}
          <div className="md:col-span-2 bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-5 shadow-sm flex flex-col justify-between h-[520px]">
            <div className="border-b border-stone-200 pb-2 flex justify-between items-center">
              <div>
                <h4 className="font-bold text-stone-900 text-xs flex items-center gap-1.5">
                  <span>💬</span>
                  <span>商案專屬對話紀錄</span>
                </h4>
                <p className="text-[10px] text-stone-400">平台將針對此對話紀錄進行履約合約存證保護</p>
              </div>
              <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-200">
                對話加密存證中
              </span>
            </div>

            {/* 訊息氣泡列表 */}
            <div className="overflow-y-auto space-y-3 my-3 flex-1 pr-1">
              {activeEvent.messages?.map((msg) => {
                const isMe = msg.sender === "photographer" || msg.senderName === clientName;

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                  >
                    <span className="text-[10px] text-stone-400 mb-0.5">
                      {msg.senderName} · {msg.timestamp}
                    </span>
                    <div
                      className={`max-w-[78%] p-3 rounded-2xl leading-relaxed text-xs ${
                        isMe
                          ? "bg-indigo-600 text-white rounded-br-none shadow-2xs font-medium"
                          : "bg-white border border-stone-200 text-stone-800 rounded-bl-none shadow-2xs"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 傳訊輸入列 */}
            <form onSubmit={handleSend} className="flex gap-2 pt-2 border-t border-stone-200">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`以【${clientName}】傳送訊息，討論集合點、妝造與腳本...`}
                className="flex-1 bg-white text-stone-900 border border-stone-300 rounded-xl px-3.5 py-2 text-xs outline-none focus:border-indigo-600"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition shadow-2xs cursor-pointer"
              >
                發送
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}