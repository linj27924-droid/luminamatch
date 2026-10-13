"use client";

import React from "react";

export interface RateCardRequest {
  id: string;
  photographerName: string;
  requestTime: string;
  status: "pending" | "approved" | "declined";
  note?: string;
}

interface RateCardTabProps {
  rateCardImages: string[];
  setRateCardImages: React.Dispatch<React.SetStateAction<string[]>>;
  accessMode: "auto" | "require_approval";
  setAccessMode: (mode: "auto" | "require_approval") => void;
  rateCardRequests: RateCardRequest[];
  handleApproveRequest: (id: string) => void;
  handleDeclineRequest: (id: string) => void;
  handleSaveRateCardConfig: (e: React.FormEvent) => void;
}

export default function RateCardTab({
  rateCardImages,
  setRateCardImages,
  accessMode,
  setAccessMode,
  rateCardRequests,
  handleApproveRequest,
  handleDeclineRequest,
  handleSaveRateCardConfig,
}: RateCardTabProps) {
  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (rateCardImages.length >= 2) {
      alert("最多僅能上傳 2 張報價單圖片！若需更換請先刪除既有圖片。");
      return;
    }

    const file = files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setRateCardImages((prev) => [...prev, reader.result as string].slice(0, 2));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (index: number) => {
    setRateCardImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* 報價單圖片與顯示模式設定表單 */}
      <form onSubmit={handleSaveRateCardConfig} className="space-y-6">
        <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="border-b border-stone-200 pb-2">
            <h3 className="text-sm font-bold text-stone-800 flex items-center gap-2">
              <span>💰</span>
              <span>商業報價單管理模組</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              可上傳最多 2 張詳細報價單圖片，並彈性設定攝影師是「直接閱讀」或「須經您審核同意後才顯示」。
            </p>
          </div>

          {/* 圖片上傳區域 (最多 2 張) */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-stone-700">
                報價單圖片上傳 ({rateCardImages.length} / 2 張)：
              </label>
              {rateCardImages.length < 2 && (
                <label className="cursor-pointer px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold rounded-lg transition">
                  + 新增報價單圖片
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUploadImage}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {rateCardImages.length === 0 ? (
              <div className="p-8 text-center bg-[#f5f3ef] border border-dashed border-stone-300 rounded-xl space-y-2">
                <span className="text-2xl">📄</span>
                <p className="text-xs text-stone-500">目前尚未上傳報價單圖片，請點擊上方按鈕上傳（最多 2 張）。</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {rateCardImages.map((img, idx) => (
                  <div key={idx} className="relative rounded-xl overflow-hidden border border-stone-300 bg-stone-900 shadow-xs group">
                    <img src={img} alt={`報價單第 ${idx + 1} 張`} className="w-full h-56 object-contain bg-stone-100" />
                    <div className="absolute top-2 left-2 bg-black/75 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      第 {idx + 1} 頁報價單
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-2 right-2 bg-rose-600 hover:bg-rose-700 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition shadow-xs cursor-pointer"
                      title="刪除這張圖片"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 索取開放機制設定 (二選一) */}
          <div className="pt-3 border-t border-stone-200 space-y-3">
            <label className="block text-xs font-bold text-stone-800">
              🔒 攝影師索取時的顯示與審核機制：
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                onClick={() => setAccessMode("auto")}
                className={`p-3.5 rounded-xl border flex flex-col gap-1 cursor-pointer transition ${
                  accessMode === "auto"
                    ? "bg-emerald-50 border-emerald-400 text-emerald-950 shadow-xs"
                    : "bg-[#f5f3ef] border-stone-300 text-stone-700 hover:bg-[#edeae3]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="accessMode"
                    checked={accessMode === "auto"}
                    onChange={() => setAccessMode("auto")}
                    className="accent-emerald-600"
                  />
                  <span className="text-xs font-bold">⚡ 索取後自動立即顯示</span>
                </div>
                <p className="text-[11px] text-stone-500 pl-5">
                  攝影師點擊索取後，系統將直接在網頁解鎖並完整展示您的報價單圖片。
                </p>
              </label>

              <label
                onClick={() => setAccessMode("require_approval")}
                className={`p-3.5 rounded-xl border flex flex-col gap-1 cursor-pointer transition ${
                  accessMode === "require_approval"
                    ? "bg-indigo-50 border-indigo-400 text-indigo-950 shadow-xs"
                    : "bg-[#f5f3ef] border-stone-300 text-stone-700 hover:bg-[#edeae3]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="accessMode"
                    checked={accessMode === "require_approval"}
                    onChange={() => setAccessMode("require_approval")}
                    className="accent-indigo-600"
                  />
                  <span className="text-xs font-bold">📩 通知模特，審核後才顯示</span>
                </div>
                <p className="text-[11px] text-stone-500 pl-5">
                  攝影師發起索取後，系統會在此清單列出，待您點擊「同意」後對方才可查看，保護商案報價隱私。
                </p>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
          >
            儲存報價單圖片與顯示模式
          </button>
        </div>
      </form>

      {/* 索取報價單的攝影師審核清單 */}
      <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="border-b border-stone-200 pb-2 flex justify-between items-center">
          <div>
            <h4 className="text-xs font-bold text-stone-800">
              📋 攝影師索取報價單審核紀錄 ({rateCardRequests.length})
            </h4>
            <p className="text-[11px] text-stone-500 mt-0.5">
              若設定為「審核後才顯示」，請於下方確認並決定是否開放給該攝影師查看。
            </p>
          </div>
        </div>

        {rateCardRequests.length === 0 ? (
          <p className="text-xs text-stone-400 py-6 text-center bg-[#f5f3ef]/60 rounded-xl border border-dashed border-stone-300">
            目前尚無攝影師發送報價單索取請求。
          </p>
        ) : (
          <div className="space-y-2.5">
            {rateCardRequests.map((req) => (
              <div
                key={req.id}
                className="p-3.5 bg-white border border-stone-200 rounded-xl flex flex-wrap justify-between items-center gap-3 text-xs shadow-2xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-stone-900 text-sm">{req.photographerName}</strong>
                    {req.status === "approved" ? (
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[10px] font-bold">
                        ✓ 已授權查看
                      </span>
                    ) : req.status === "declined" ? (
                      <span className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded text-[10px] font-bold">
                        ✕ 已拒絕查看
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-300 rounded text-[10px] font-bold">
                        ⏳ 待審核決定
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-stone-400 mt-0.5">索取時間：{req.requestTime}</p>
                </div>

                <div className="flex items-center gap-2">
                  {req.status === "pending" && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleApproveRequest(req.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition cursor-pointer"
                      >
                        ✓ 同意顯示報價單
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeclineRequest(req.id)}
                        className="px-3 py-1.5 bg-stone-100 hover:bg-rose-50 hover:text-rose-700 text-stone-600 rounded-lg text-xs font-bold transition cursor-pointer"
                      >
                        婉拒
                      </button>
                    </>
                  )}
                  {req.status === "approved" && (
                    <button
                      type="button"
                      onClick={() => handleDeclineRequest(req.id)}
                      className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-lg text-xs font-semibold transition cursor-pointer"
                    >
                      收回查看權限
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}