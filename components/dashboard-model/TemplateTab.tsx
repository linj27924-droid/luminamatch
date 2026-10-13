"use client";

import React from "react";

interface TemplateTabProps {
  templateAcceptMessage: string;
  setTemplateAcceptMessage: (v: string) => void;
  templateContractBody: string;
  setTemplateContractBody: (v: string) => void;
  commercialContractBody: string;
  setCommercialContractBody: (v: string) => void;
  templateDeclineMessage: string;
  setTemplateDeclineMessage: (v: string) => void;
  depositPolicy: string;
  setDepositPolicy: (v: string) => void;
  handleSaveGlobalTemplates: (e: React.FormEvent) => void;
}

export default function TemplateTab({
  templateAcceptMessage,
  setTemplateAcceptMessage,
  templateContractBody,
  setTemplateContractBody,
  commercialContractBody,
  setCommercialContractBody,
  templateDeclineMessage,
  setTemplateDeclineMessage,
  depositPolicy,
  setDepositPolicy,
  handleSaveGlobalTemplates,
}: TemplateTabProps) {
  return (
    <form onSubmit={handleSaveGlobalTemplates} className="space-y-6">
      <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-6 shadow-sm space-y-5">
        <div className="border-b border-stone-200 pb-2">
          <h3 className="text-sm font-bold text-stone-800 flex items-center gap-1.5">
            <span>⚙️</span>
            <span>合約規範與商案定金規則設定</span>
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            在此分別維護「互惠/常規合約」與「商業有酬合約」，系統於審核不同案件時將智慧自動帶入。
          </p>
        </div>

        {/* 商案預收定金政策 */}
        <div className="bg-[#f5f3ef] p-4 rounded-xl border border-stone-300 space-y-2">
          <label className="block text-xs font-bold text-stone-800">
            💰 商業有酬案件：預收定金意向規範：
          </label>
          <input
            type="text"
            value={depositPolicy}
            onChange={(e) => setDepositPolicy(e.target.value)}
            placeholder="例：商案需預付 30% 訂金保留檔期，拍攝結束當日結清尾款"
            className="w-full text-xs font-semibold bg-white text-stone-800 border border-stone-300 rounded-lg p-2.5 outline-none focus:border-indigo-500"
          />
        </div>

        {/* 1. 商業有酬合約模板 */}
        <div className="space-y-2 pt-2 border-t border-stone-200">
          <div className="flex justify-between items-center">
            <label className="block text-xs font-bold text-indigo-900">
              💼 專屬「商業有酬」存證合約模板 (含定金、尾款時限、商用授權)：
            </label>
            <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded border border-indigo-200">
              商案自動套用
            </span>
          </div>
          <textarea
            rows={10}
            value={commercialContractBody}
            onChange={(e) => setCommercialContractBody(e.target.value)}
            className="w-full text-xs font-mono bg-[#f5f3ef] text-stone-800 border border-stone-300 rounded-xl p-3 outline-none focus:border-indigo-500 focus:bg-white leading-relaxed"
          />
        </div>

        {/* 2. 一般/互惠存證合約模板 */}
        <div className="space-y-2 pt-2 border-t border-stone-200">
          <div className="flex justify-between items-center">
            <label className="block text-xs font-bold text-stone-800">
              📜 常規 / 互惠創作 (TFCD) 存證合約條款規範本文：
            </label>
            <span className="text-[10px] bg-stone-100 text-stone-600 font-bold px-2 py-0.5 rounded border border-stone-200">
              互惠案件自動套用
            </span>
          </div>
          <textarea
            rows={8}
            value={templateContractBody}
            onChange={(e) => setTemplateContractBody(e.target.value)}
            className="w-full text-xs font-mono bg-[#f5f3ef] text-stone-800 border border-stone-300 rounded-xl p-3 outline-none focus:border-indigo-500 focus:bg-white leading-relaxed"
          />
        </div>

        {/* 3. 同意與婉拒回覆文章 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-200">
          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1">
              💬 預設「同意邀請」留言：
            </label>
            <textarea
              rows={3}
              value={templateAcceptMessage}
              onChange={(e) => setTemplateAcceptMessage(e.target.value)}
              className="w-full text-xs bg-[#f5f3ef] text-stone-800 border border-stone-300 rounded-xl p-2.5 outline-none focus:border-indigo-500 focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1">
              🚫 預設「婉拒邀請」留言：
            </label>
            <textarea
              rows={3}
              value={templateDeclineMessage}
              onChange={(e) => setTemplateDeclineMessage(e.target.value)}
              className="w-full text-xs bg-[#f5f3ef] text-stone-800 border border-stone-300 rounded-xl p-2.5 outline-none focus:border-indigo-500 focus:bg-white"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-xs transition cursor-pointer"
        >
          儲存所有合約模板與定金設定
        </button>
      </div>
    </form>
  );
}