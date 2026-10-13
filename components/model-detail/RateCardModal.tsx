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

  const canViewImages = accessMode === "auto" || isApproved;
  const watermarkText = `僅供【${currentUserName || "授權攝影師"}】專屬審閱 · LuminaMatch 存證`;

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#fbfaf8] border border-stone-200 rounded-2xl max-w-xl w-full p-6 shadow-2xl max-h-[92vh] flex flex-col">
        <div className="flex justify-between items-center pb-3 border-b border-stone-200">
          <div>
            <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <span>📄</span>
              <span>{modelName} 的商業報價單</span>
            </h3>
            <p className="text-[11px] text-stone-500 mt-0.5">
              已啟用防偽浮水印存證保護，嚴禁外流轉傳
            </p>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600 text-lg font-bold cursor-pointer">✕</button>
        </div>

        <div className="overflow-y-auto space-y-4 my-4 flex-1 pr-1">
          {canViewImages ? (
            <div className="space-y-4">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-medium">
                ✓ 報價單已成功授權解鎖！上下滾動查閱長條價目表：
              </div>

              {rateCardImages.length === 0 ? (
                <div className="p-8 text-center bg-[#f5f3ef] rounded-xl border border-dashed border-stone-300 text-xs text-stone-400">
                  模特尚未上傳報價單圖片檔案，歡迎直接發起約拍或私訊詢問！
                </div>
              ) : (
                <div className="space-y-4">
                  {rateCardImages.map((img, idx) => (
                    <div key={idx} className="rounded-2xl overflow-hidden border border-stone-300 shadow-xs bg-white relative">
                      <div className="bg-stone-100 px-3 py-1.5 border-b border-stone-200 text-[11px] font-bold text-stone-600 flex justify-between items-center">
                        <span>長條報價單項目 {idx + 1}</span>
                        <span className="text-[10px] text-indigo-700 font-mono">🔒 浮水印保護中</span>
                      </div>
                      <div className="p-2 bg-stone-50 flex justify-center relative">
                        <img
                          src={img}
                          alt={`報價單 ${idx + 1}`}
                          className="w-full h-auto object-contain rounded-lg shadow-2xs select-none"
                        />
                        {/* ★ 半透明防偽浮水印 ★ */}
                        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                          <span className="text-stone-900/25 font-bold text-sm tracking-widest transform -rotate-12 select-none border border-stone-900/10 px-4 py-2 rounded-xl">
                            {watermarkText}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : isPending ? (
            <div className="p-8 text-center bg-amber-50 border border-amber-300 rounded-xl space-y-2">
              <div className="text-3xl">⏳</div>
              <h4 className="text-sm font-bold text-amber-900">索取申請已送達模特後台！</h4>
              <p className="text-xs text-amber-800 leading-relaxed max-w-sm mx-auto font-medium">
                模特設定了隱私保護審核機制。我們已向【{modelName}】發送時效索取通知，待模特於後台確認同意後即可查閱。
              </p>
            </div>
          ) : (
            <form onSubmit={handleSendRequest} className="space-y-4 bg-[#f5f3ef] p-5 rounded-xl border border-stone-300">
              <div>
                <span className="text-xs font-bold text-stone-800 block">
                  🔒 本報價單受模特隱私保護，需索取後由模特授權查閱
                </span>
                <p className="text-[11px] text-stone-500 mt-1">
                  請確認您的攝影師稱呼，送出後將立即通知模特進行時效授權：
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