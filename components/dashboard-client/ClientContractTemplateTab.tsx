"use client";

import React, { useState } from "react";

export interface ClientTemplateConfig {
  contractTitle: string;
  commercialContractBody: string;
  defaultAcceptMessage: string;
  defaultDeclineMessage: string;
  usageRightsSummary: string;
  depositNoticeNote: string;
}

interface ClientContractTemplateTabProps {
  config: ClientTemplateConfig;
  onSave: (newConfig: ClientTemplateConfig) => void;
}

export default function ClientContractTemplateTab({
  config: initialConfig,
  onSave,
}: ClientContractTemplateTabProps) {
  const [config, setConfig] = useState<ClientTemplateConfig>(initialConfig);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(config);
    alert("✅ 商業合約範本與預設回覆詞已成功儲存！");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-xs">
      <div className="bg-white border border-stone-300 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <span>📜</span>
            <span>商案合約範本與快速回覆設定</span>
          </h3>
          <p className="text-stone-600 text-xs mt-1 font-medium">
            預先設定品牌專屬的商業授權合約與回覆辭令，在錄用創作者或婉拒提案時將自動帶入。
          </p>
        </div>
        <button
          type="submit"
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition shadow-xs cursor-pointer text-xs shrink-0"
        >
          儲存範本設定
        </button>
      </div>

      {/* 商業合約條款與授權範圍 */}
      <div className="bg-white border border-stone-300 rounded-2xl p-6 shadow-sm space-y-4">
        <h4 className="font-bold text-stone-900 text-sm border-b border-stone-200 pb-2 flex items-center gap-2">
          <span>⚖️</span>
          <span>品牌標準商業存證合約範本</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-stone-800 mb-1">合約標題</label>
            <input
              type="text"
              value={config.contractTitle}
              onChange={(e) => setConfig({ ...config, contractTitle: e.target.value })}
              className="w-full bg-white text-stone-900 border border-stone-300 rounded-xl p-2.5 outline-none font-semibold focus:border-indigo-600"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-800 mb-1">商用肖像授權簡要註記</label>
            <input
              type="text"
              value={config.usageRightsSummary}
              onChange={(e) => setConfig({ ...config, usageRightsSummary: e.target.value })}
              className="w-full bg-white text-stone-900 border border-stone-300 rounded-xl p-2.5 outline-none font-semibold focus:border-indigo-600"
              placeholder="例：官網、電商平台及官方社群廣告 1 年授權"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-bold text-stone-800 mb-1">
              商業存證合約完整條款 (創作者受錄用時將自動確立並存證)
            </label>
            <textarea
              rows={8}
              value={config.commercialContractBody}
              onChange={(e) => setConfig({ ...config, commercialContractBody: e.target.value })}
              className="w-full bg-stone-50 font-mono text-[11px] text-stone-900 border border-stone-300 rounded-xl p-3 outline-none focus:border-indigo-600 leading-relaxed"
            />
          </div>
        </div>
      </div>

      {/* 快速回覆語句設定 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 錄用歡迎回覆詞 */}
        <div className="bg-white border border-stone-300 rounded-2xl p-5 shadow-sm space-y-3">
          <h4 className="font-bold text-emerald-800 text-xs flex items-center gap-1.5">
            <span>🎉</span>
            <span>錄用 / 同意提案時的預設留言</span>
          </h4>
          <p className="text-stone-500 text-[11px]">錄用應徵創作者或接受客製商業提案時自動發送：</p>
          <textarea
            rows={4}
            value={config.defaultAcceptMessage}
            onChange={(e) => setConfig({ ...config, defaultAcceptMessage: e.target.value })}
            className="w-full bg-white text-stone-900 border border-stone-300 rounded-xl p-2.5 outline-none focus:border-indigo-600 leading-relaxed font-medium"
          />
        </div>

        {/* 婉拒禮貌回覆詞 */}
        <div className="bg-white border border-stone-300 rounded-2xl p-5 shadow-sm space-y-3">
          <h4 className="font-bold text-stone-700 text-xs flex items-center gap-1.5">
            <span>✉️</span>
            <span>婉拒提案時的預設禮貌留言</span>
          </h4>
          <p className="text-stone-500 text-[11px]">婉拒創作者主動商業提案時自動帶入：</p>
          <textarea
            rows={4}
            value={config.defaultDeclineMessage}
            onChange={(e) => setConfig({ ...config, defaultDeclineMessage: e.target.value })}
            className="w-full bg-white text-stone-900 border border-stone-300 rounded-xl p-2.5 outline-none focus:border-indigo-600 leading-relaxed font-medium"
          />
        </div>
      </div>
    </form>
  );
}