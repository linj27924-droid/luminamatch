"use client";

import React, { useState } from "react";

export interface CollabMessage {
  id: string;
  sender: "model" | "photographer";
  senderName: string;
  text: string;
  timestamp: string;
}

interface CollabChatBoxProps {
  partnerName: string;
  currentUserRole: "model" | "photographer";
  messages: CollabMessage[];
  onSendMessage: (text: string) => void;
}

export default function CollabChatBox({
  partnerName,
  currentUserRole,
  messages,
  onSendMessage,
}: CollabChatBoxProps) {
  const [inputText, setInputText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText("");
  };

  return (
    <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-5 shadow-sm flex flex-col h-[760px]">
      {/* 頂部對象與在線狀態 */}
      <div className="pb-3 border-b border-stone-200 flex justify-between items-center">
        <div>
          <h4 className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
            <span>💬</span>
            <span>案件即時留言溝通</span>
          </h4>
          <p className="text-[10px] text-stone-400 mt-0.5">
            對象：<strong>{partnerName}</strong>
          </p>
        </div>
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
      </div>

      {/* 訊息滾動列表 */}
      <div className="flex-1 overflow-y-auto space-y-3 py-3 pr-1">
        {(!messages || messages.length === 0) ? (
          <div className="text-center py-16 text-xs text-stone-400">
            尚無留言紀錄，可在此與對方溝通當日細節。
          </div>
        ) : (
          messages.map((m) => {
            const isMe = m.sender === currentUserRole;
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

      {/* 輸入框表單 */}
      <form onSubmit={handleSubmit} className="pt-2 border-t border-stone-200 flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
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
  );
}