"use client";

import React from "react";

interface TemplateTabProps {
  templateAcceptMessage: string;
  setTemplateAcceptMessage: (v: string) => void;
  templateContractBody: string;
  setTemplateContractBody: (v: string) => void;
  templateDeclineMessage: string;
  setTemplateDeclineMessage: (v: string) => void;
  handleSaveGlobalTemplates: (e: React.FormEvent) => void;
}

export default function TemplateTab({
  templateAcceptMessage,
  setTemplateAcceptMessage,
  templateContractBody,
  setTemplateContractBody,
  templateDeclineMessage,
  setTemplateDeclineMessage,
  handleSaveGlobalTemplates,
}: TemplateTabProps) {
  return (
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
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-xs transition cursor-pointer"
        >
          儲存合約與回覆預設模板
        </button>
      </div>
    </form>
  );
}