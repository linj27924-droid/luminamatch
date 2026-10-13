"use client";

import React from "react";

interface ProposalTemplateTabProps {
  proposalTemplate: {
    defaultStyle: string;
    defaultLocation: string;
    defaultCoopType: string;
    defaultProposalLetter: string;
  };
  setProposalTemplate: React.Dispatch<React.SetStateAction<any>>;
  handleSaveProposalTemplate: (e: React.FormEvent) => void;
}

export default function ProposalTemplateTab({
  proposalTemplate,
  setProposalTemplate,
  handleSaveProposalTemplate,
}: ProposalTemplateTabProps) {
  return (
    <form onSubmit={handleSaveProposalTemplate} className="space-y-6">
      <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="border-b border-stone-200 pb-2">
          <h3 className="text-sm font-bold text-stone-800">
            📝 預設約拍提案範本設定
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            在此設定您向模特發起約拍時的預設提案文字與習慣地點，造訪模特主頁時將自動全數帶入，無需重複手打。
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">預設合作性質</label>
            <select
              value={proposalTemplate.defaultCoopType}
              onChange={(e) => setProposalTemplate({ ...proposalTemplate, defaultCoopType: e.target.value })}
              className="w-full text-xs font-bold bg-[#f5f3ef] text-stone-800 border border-stone-300 rounded-lg p-2.5 outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="互惠創作 (TFCD)">互惠創作 (TFCD)</option>
              <option value="商業有酬">商業有酬</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">常用拍攝風格</label>
            <input
              type="text"
              value={proposalTemplate.defaultStyle}
              onChange={(e) => setProposalTemplate({ ...proposalTemplate, defaultStyle: e.target.value })}
              placeholder="例：日系膠卷清新街拍"
              className="w-full text-xs font-medium bg-[#f5f3ef] text-stone-800 border border-stone-300 rounded-lg p-2.5 outline-none focus:border-indigo-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">常用約定地點</label>
            <input
              type="text"
              value={proposalTemplate.defaultLocation}
              onChange={(e) => setProposalTemplate({ ...proposalTemplate, defaultLocation: e.target.value })}
              placeholder="例：台北大稻埕周邊"
              className="w-full text-xs font-medium bg-[#f5f3ef] text-stone-800 border border-stone-300 rounded-lg p-2.5 outline-none focus:border-indigo-500 focus:bg-white"
            />
          </div>
        </div>

        <div className="pt-2 border-t border-stone-200">
          <label className="block text-xs font-bold text-stone-800 mb-1">
            💬 預設提案信本文 (發給模特審核時自動帶入)：
          </label>
          <textarea
            rows={5}
            value={proposalTemplate.defaultProposalLetter}
            onChange={(e) => setProposalTemplate({ ...proposalTemplate, defaultProposalLetter: e.target.value })}
            className="w-full text-xs bg-[#f5f3ef] text-stone-800 font-medium border border-stone-300 rounded-xl p-3 outline-none focus:border-indigo-500 focus:bg-white leading-relaxed"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-xs transition cursor-pointer"
        >
          儲存預設約拍提案範本
        </button>
      </div>
    </form>
  );
}