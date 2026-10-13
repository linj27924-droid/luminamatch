"use client";

import React, { useState } from "react";

interface RateCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  modelName: string;
  rateCardImages: string[];
  accessMode: "auto" | "require_approval";
  isApproved: boolean;
  isPending: boolean;
  onRequestSubmit: (photographerName: string) => void;
  currentUserName: string;
}

export default function RateCardModal({
  isOpen,
  onClose,
  modelName,
  rateCardImages,
  accessMode,
  isApproved,
  isPending,
  onRequestSubmit,
  currentUserName,
}: RateCardModalProps) {
  const [applicantName, setApplicantName] = useState(currentUserName || "陳攝影 (Alan Chen)");

  if (!isOpen) return null;

  const handleSendRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName.trim()) return;
    onRequestSubmit(applicantName.trim());
  };

  // 是否可以直接展示圖片（自動模式 或 模特已核准）
  const canViewImages = accessMode === "auto" || isApproved;

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#fbfaf8] border border-stone-200 rounded-2xl max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] flex flex-col">
        {/* 標頭 */}
        <div className="flex justify-between items-center pb-3 border-b border-stone-200">
          <div>
            <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <span>📄</span>
              <span>{modelName} 的商業合作報價單</span>
            </h3>
            <p className="text-[11px] text-stone-500 mt-0.5">
              包含外拍時薪、商案型錄、棚拍加乘與版權規範說明
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 text-lg font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* 內容區域 */}
        <div className="overflow-y-auto space-y-4 my-4 flex-1 pr-1">
          {canViewImages ? (
            /* 狀態 1：已解鎖或自動顯示 */
            <div className="space-y-4">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-medium">
                ✓ 報價單已成功解鎖！請查閱下方完整項目規範：
              </div>

              {rateCardImages.length === 0 ? (
                <div className="p-8 text-center bg-[#f5f3ef] rounded-xl border border-dashed border-stone-300 text-xs text-stone-400">
                  模特尚未上傳報價單圖片檔案，歡迎直接發起約拍或私訊詢問！
                </div>
              ) : (
                <div className="space-y-4">
                  {rateCardImages.map((img, idx) => (
                    <div key={idx} className="rounded-xl overflow-hidden border border-stone-300 shadow-sm bg-white">
                      <div className="bg-stone-100 px-3 py-1.5 border-b border-stone-200 text-[11px] font-bold text-stone-600">
                        報價單項目 {idx + 1}
                      </div>
                      <img src={img} alt={`報價單 ${idx + 1}`} className="w-full h-auto object-contain" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : isPending ? (
            /* 狀態 2：申請中等待審核 */
            <div className="p-8 text-center bg-amber-50 border border-amber-300 rounded-xl space-y-2">
              <div className="text-3xl">⏳</div>
              <h4 className="text-sm font-bold text-amber-900">索取申請已送達模特後台！</h4>
              <p className="text-xs text-amber-800 leading-relaxed max-w-sm mx-auto font-medium">
                模特設定了隱私保護審核機制。我們已向【{modelName}】發送索取通知，待模特於後台確認同意後，即可直接在此檢視報價單。
              </p>
            </div>
          ) : (
            /* 狀態 3：尚未索取，需送出申請 */
            <form onSubmit={handleSendRequest} className="space-y-4 bg-[#f5f3ef] p-5 rounded-xl border border-stone-300">
              <div>
                <span className="text-xs font-bold text-stone-800 block">
                  🔒 本報價單受模特隱私保護，需索取後由模特授權查閱
                </span>
                <p className="text-[11px] text-stone-500 mt-1">
                  請確認您的攝影師稱呼，送出後將立即通知模特進行授權：
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  索取者稱呼 / 攝影師名稱：
                </label>
                <input
                  type="text"
                  required
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  placeholder="例：陳攝影 (Alan Chen)"
                  className="w-full text-xs font-bold bg-white text-stone-800 border border-stone-300 rounded-lg p-2.5 outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  📩 送出索取報價單申請
                </button>
              </div>
            </form>
          )}
        </div>

        {/* 底部關閉按鈕 */}
        <div className="pt-2 border-t border-stone-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-stone-200 text-stone-700 rounded-xl text-xs font-bold cursor-pointer hover:bg-stone-300"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  );
}