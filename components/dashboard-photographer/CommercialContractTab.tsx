"use client";

import React, { useState } from "react";

export const DEFAULT_COMMERCIAL_CONTRACT = `【商業攝影委託暨肖像授權合約範本】

立合約書人：
委託方／出資方（以下簡稱甲方）
受託攝影師：陳攝影 (Alan Chen)（以下簡稱乙方）

茲就甲方委託乙方執行商業影像拍攝專案，雙方議定條款如下：

第一條：專案委託內容與交付規格
1. 拍攝主題：商業型錄／商品情境人像／品牌主視覺拍攝。
2. 成品規格：高解析度 JPG 電子檔（長邊不低於 4000px，300dpi）。
3. 交付數量：依專案約定交付精修調色成品張數，所有未選毛片版權依毛片約定條款執行。
4. 交付期限：拍攝日結束後 14 個工作天內，以指定雲端連結方式交付完稿。

第二條：專案款項與定金約定
1. 簽約定金：甲方應於合約簽署後 48 小時內給付專案總金額之 30% 作為定金，確認入帳後專案時段方告確立。
2. 尾款給付：拍攝當日驗收完成或收到交付成品後 3 個工作天內，甲方應結清剩餘 70% 尾款。

第三條：肖像權授權與著作權歸屬
1. 著作權歸屬：拍攝成果之著作人格權專屬乙方所有；甲方享有於本專案約定範圍內之商業使用權。
2. 授權範圍：非經乙方書面同意，甲方不得將原始未調色檔（RAW）或精修成品轉售或授權無關之第三方進行衍生商業營利。
3. 作品展示權：乙方保有於個人作品集、社群媒體、競賽展覽中進行非排他性之藝術創作展示權限。

第四條：取消、改期與不可抗力條款
1. 改期規範：如因天候、突發不可抗力或天災，得於拍攝日前 24 小時協商順延改期，免收手續費。
2. 臨時取消：若甲方於預定拍攝前 48 小時內單方取消，定金不予退還，作為乙方檔期保留損失補償。

第五條：爭議管轄
本合約未盡事宜，雙方應本誠信原則協商解決；如有涉訟，合意以受託方所在地之地方法院為第一審管轄法院。`;

interface CommercialContractTabProps {
  contractTitle: string;
  setContractTitle: (v: string) => void;
  contractBody: string;
  setContractBody: (v: string) => void;
  depositRate: string;
  setDepositRate: (v: string) => void;
  revisionLimit: number;
  setRevisionLimit: (v: number) => void;
  handleSaveContract: (e: React.FormEvent) => void;
}

export default function CommercialContractTab({
  contractTitle,
  setContractTitle,
  contractBody,
  setContractBody,
  depositRate,
  setDepositRate,
  revisionLimit,
  setRevisionLimit,
  handleSaveContract,
}: CommercialContractTabProps) {
  const [copySuccess, setCopySuccess] = useState(false);

  const handleResetDefault = () => {
    const confirmReset = window.confirm("確定要將合約內容恢復為官方預設標準範本嗎？現有編輯內容將被取代。");
    if (!confirmReset) return;
    setContractTitle("標準商業攝影委託暨肖像授權合約");
    setContractBody(DEFAULT_COMMERCIAL_CONTRACT);
    setDepositRate("30%");
    setRevisionLimit(2);
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(contractBody).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  return (
    <form onSubmit={handleSaveContract} className="space-y-6">
      <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-6 shadow-sm space-y-5">
        <div className="border-b border-stone-200 pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h3 className="text-sm font-bold text-stone-800 flex items-center gap-2">
              <span>📜</span>
              <span>商業攝影制式合約書範本</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              預先設定供商業客戶或品牌委託使用的通用合約書，接案時系統將自動套用此版本。
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyText}
              className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-semibold transition cursor-pointer"
            >
              {copySuccess ? "✓ 已複製全文" : "📋 複製合約全文"}
            </button>
            <button
              type="button"
              onClick={handleResetDefault}
              className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-xs font-semibold transition cursor-pointer"
            >
              🔄 帶入標準範本
            </button>
          </div>
        </div>

        {/* 核心條款快速參數設定 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#f5f3ef] p-4 rounded-xl border border-stone-300">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">合約範本名稱</label>
            <input
              type="text"
              required
              value={contractTitle}
              onChange={(e) => setContractTitle(e.target.value)}
              placeholder="例：標準商案影像合約"
              className="w-full text-xs font-bold bg-white text-stone-800 border border-stone-300 rounded-lg p-2.5 outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">定金比例規範</label>
            <select
              value={depositRate}
              onChange={(e) => setDepositRate(e.target.value)}
              className="w-full text-xs font-bold bg-white text-stone-800 border border-stone-300 rounded-lg p-2.5 outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="30%">30% 簽約定金（業界通用）</option>
              <option value="50%">50% 簽約定金</option>
              <option value="全額預付">全額付清後排程</option>
              <option value="免收定金">免收定金（結案付款）</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">免費微調修圖次數</label>
            <select
              value={revisionLimit}
              onChange={(e) => setRevisionLimit(Number(e.target.value))}
              className="w-full text-xs font-bold bg-white text-stone-800 border border-stone-300 rounded-lg p-2.5 outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value={1}>1 次微調</option>
              <option value={2}>2 次微調（標準）</option>
              <option value={3}>3 次微調</option>
              <option value={0}>不提供二次修圖（一次定稿）</option>
            </select>
          </div>
        </div>

        {/* 合約內文完整編輯區 */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="block text-xs font-bold text-stone-800">
              合約完整本文條款（可自由增刪修改條文細節）：
            </label>
            <span className="text-[11px] font-mono text-stone-500">
              字數統計：{contractBody.length} 字
            </span>
          </div>

          <textarea
            rows={16}
            value={contractBody}
            onChange={(e) => setContractBody(e.target.value)}
            className="w-full text-xs font-mono bg-white text-stone-800 border border-stone-300 rounded-xl p-3.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 leading-relaxed"
            placeholder="請在此輸入制式合約條文..."
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
        >
          儲存商案合約範本設定
        </button>
      </div>
    </form>
  );
}