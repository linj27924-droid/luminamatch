"use client";

import React from "react";
import Link from "next/link";

export interface RateCardRequestItem {
  id: string;
  applicantId?: string;
  applicantName: string;
  applicantRole: "model" | "client";
  requestTime: string;
  status: "pending" | "approved" | "declined";
  expiresLabel?: string;
}

export interface ModelRateCardResponseItem {
  id: string;
  modelId: string;
  modelName: string;
  requestTime: string;
  status: "pending" | "approved" | "declined";
  expiresLabel?: string;
  hasViewed?: boolean;
}

interface PhotographerRateCardTabProps {
  rateCardImages: string[];
  setRateCardImages: React.Dispatch<React.SetStateAction<string[]>>;
  accessMode: "auto" | "require_approval";
  setAccessMode: (mode: "auto" | "require_approval") => void;
  incomingRequests: RateCardRequestItem[];
  handleApproveRequest: (id: string, durationHours?: number) => void;
  handleDeclineRequest: (id: string) => void;
  handleRevokeRequest: (id: string) => void;
  handleDeleteIncomingRequest: (id: string) => void;
  outgoingRequests: ModelRateCardResponseItem[];
  handleSaveRateCardConfig: (e: React.FormEvent) => void;
}

export default function PhotographerRateCardTab({
  rateCardImages,
  setRateCardImages,
  accessMode,
  setAccessMode,
  incomingRequests,
  handleApproveRequest,
  handleDeclineRequest,
  handleRevokeRequest,
  handleDeleteIncomingRequest,
  outgoingRequests,
  handleSaveRateCardConfig,
}: PhotographerRateCardTabProps) {
  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (rateCardImages.length >= 2) {
      alert("最多僅能上傳 2 張報價單圖片，若需替換請先刪除既有圖片。");
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
      {/* 1. 攝影師個人報價單圖片與權限設定 */}
      <form onSubmit={handleSaveRateCardConfig} className="space-y-6">
        <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="border-b border-stone-200 pb-2">
            <h3 className="text-sm font-bold text-stone-800 flex items-center gap-2">
              <span>💳</span>
              <span>攝影收費與專案報價單管理</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              可上傳最多 2 張長條直式報價單，並設定查閱權限（自動公開或模特/客戶需先索取並審核）。
            </p>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-stone-700">
                目前長條報價單圖檔 ({rateCardImages.length} / 2 張)：
              </label>
              {rateCardImages.length < 2 && (
                <label className="cursor-pointer px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold rounded-lg transition">
                  + 上傳長條報價單圖
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
                <span className="text-2xl">📑</span>
                <p className="text-xs text-stone-500">目前尚未上傳報價單圖檔，最多可上傳 2 張清晰長圖。</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {rateCardImages.map((img, idx) => (
                  <div key={idx} className="relative rounded-2xl overflow-hidden border border-stone-300 bg-stone-100 shadow-xs flex flex-col group">
                    <div className="bg-stone-200/80 px-3 py-1.5 border-b border-stone-300 flex justify-between items-center">
                      <span className="text-[11px] font-bold text-stone-700">第 {idx + 1} 頁長條報價單</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="text-rose-600 hover:text-rose-800 text-xs font-bold cursor-pointer"
                      >
                        ✕ 刪除
                      </button>
                    </div>

                    <div className="w-full max-h-[460px] overflow-y-auto bg-stone-50 p-2 flex justify-center">
                      <img src={img} alt={`攝影報價單第 ${idx + 1} 張`} className="w-full h-auto object-contain rounded-lg shadow-2xs" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-stone-200 space-y-3">
            <label className="block text-xs font-bold text-stone-800">
              🔒 外部索取查閱權限模式：
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
                    name="photoAccessMode"
                    checked={accessMode === "auto"}
                    onChange={() => setAccessMode("auto")}
                    className="accent-emerald-600"
                  />
                  <span className="text-xs font-bold">🌐 點擊索取即自動公開</span>
                </div>
                <p className="text-[11px] text-stone-500 pl-5">
                  模特或合作廠商點擊「索取報價單」即可直接查閱完整報價圖檔。
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
                    name="photoAccessMode"
                    checked={accessMode === "require_approval"}
                    onChange={() => setAccessMode("require_approval")}
                    className="accent-indigo-600"
                  />
                  <span className="text-xs font-bold">🛡️ 需經我手動審核通過</span>
                </div>
                <p className="text-[11px] text-stone-500 pl-5">
                  對象提出索取後，需在後台審核給予（7天/30天/3個月）查看時效。
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
            儲存攝影報價單設定
          </button>
        </div>
      </form>

      {/* 2. 外部向我詢價 / 索取報價單的審核清單 */}
      <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-stone-200 pb-2">
          <div>
            <h4 className="text-sm font-bold text-stone-800 flex items-center gap-2">
              <span>📥</span>
              <span>收到的報價單索取請求 ({incomingRequests.length})</span>
            </h4>
            <p className="text-xs text-stone-500 mt-0.5">
              點擊申請人姓名可直達其個人頁面；可隨時核准或「收回」報價單查閱權限。
            </p>
          </div>
        </div>

        {incomingRequests.length === 0 ? (
          <p className="text-xs text-stone-400 py-6 text-center bg-[#f5f3ef]/60 rounded-xl border border-dashed border-stone-300">
            目前尚無收到任何報價單索取請求。
          </p>
        ) : (
          <div className="space-y-2.5">
            {incomingRequests.map((req) => {
              const targetUrl = req.applicantRole === "model"
                ? `/model/${encodeURIComponent(req.applicantId || req.applicantName.replace(/模特\s*/, "").split(" ")[0])}`
                : "#";

              return (
                <div
                  key={req.id}
                  className="p-3.5 bg-white border border-stone-200 rounded-xl flex flex-wrap justify-between items-center gap-3 text-xs shadow-2xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      {req.applicantRole === "model" ? (
                        <Link
                          href={targetUrl}
                          className="font-bold text-stone-900 hover:text-indigo-600 hover:underline text-sm flex items-center gap-1 group"
                          title="點擊前往該模特個人頁面"
                        >
                          <span>{req.applicantName}</span>
                          <span className="text-[10px] text-indigo-500 group-hover:translate-x-0.5 transition">➔</span>
                        </Link>
                      ) : (
                        <span className="font-bold text-stone-900 text-sm">{req.applicantName}</span>
                      )}

                      <span className="px-2 py-0.5 bg-stone-100 text-stone-600 rounded text-[10px] font-bold">
                        {req.applicantRole === "model" ? "模特" : "業主/經紀"}
                      </span>

                      {req.status === "approved" ? (
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[10px] font-bold">
                          ✓ {req.expiresLabel || "已核准查閱"}
                        </span>
                      ) : req.status === "declined" ? (
                        <span className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded text-[10px] font-bold">
                          ✕ 已婉拒 / 授權已收回
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-300 rounded text-[10px] font-bold">
                          ⏳ 待審核
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-stone-400 mt-0.5">申請時間：{req.requestTime}</p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {req.status === "pending" && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleApproveRequest(req.id, 168)}
                          className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition cursor-pointer"
                        >
                          ✓ 開放 7 天
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApproveRequest(req.id, 720)}
                          className="px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition cursor-pointer"
                        >
                          ✓ 開放 30 天
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeclineRequest(req.id)}
                          className="px-2.5 py-1.5 bg-stone-100 hover:bg-rose-50 hover:text-rose-700 text-stone-600 rounded-lg text-xs font-semibold transition cursor-pointer"
                        >
                          婉拒
                        </button>
                      </>
                    )}

                    {req.status === "approved" && (
                      <button
                        type="button"
                        onClick={() => handleRevokeRequest(req.id)}
                        className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1"
                        title="立即終止該對象的報價單查閱權限"
                      >
                        <span>🔒</span>
                        <span>收回查閱授權</span>
                      </button>
                    )}

                    {req.status === "declined" && (
                      <button
                        type="button"
                        onClick={() => handleApproveRequest(req.id, 168)}
                        className="px-2.5 py-1.5 bg-stone-100 hover:bg-emerald-50 hover:text-emerald-700 text-stone-600 rounded-lg text-xs font-medium transition cursor-pointer border border-stone-200"
                      >
                        重新開放 7 天
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDeleteIncomingRequest(req.id)}
                      className="px-2 py-1.5 text-stone-400 hover:text-rose-600 rounded-lg text-xs transition cursor-pointer"
                      title="刪除此筆索取紀錄"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. 我向模特申請報價的回應追蹤 */}
      <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-stone-200 pb-2">
          <div>
            <h4 className="text-sm font-bold text-stone-800 flex items-center gap-2">
              <span>📤</span>
              <span>我索取的模特報價單與回應進度 ({outgoingRequests.length})</span>
            </h4>
            <p className="text-xs text-stone-500 mt-0.5">
              點擊模特名稱可前往其首頁；模特核准後即可隨時點擊開啟查閱該模特之商業報價單。
            </p>
          </div>
        </div>

        {outgoingRequests.length === 0 ? (
          <p className="text-xs text-stone-400 py-6 text-center bg-[#f5f3ef]/60 rounded-xl border border-dashed border-stone-300">
            目前尚未向任何模特索取報價單。前往「探索大廳」逛模特主頁可直接點擊索取。
          </p>
        ) : (
          <div className="space-y-2.5">
            {outgoingRequests.map((outReq) => (
              <div
                key={outReq.id}
                className="p-3.5 bg-white border border-stone-200 rounded-xl flex flex-wrap justify-between items-center gap-3 text-xs shadow-2xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/model/${encodeURIComponent(outReq.modelId)}`}
                      className="font-bold text-stone-900 hover:text-indigo-600 hover:underline text-sm flex items-center gap-1 group"
                    >
                      <span>{outReq.modelName}</span>
                      <span className="text-[10px] text-indigo-500 group-hover:translate-x-0.5 transition">➔</span>
                    </Link>

                    {outReq.status === "approved" ? (
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[10px] font-bold">
                        ✓ 模特已核准 ({outReq.expiresLabel || "有效開放中"})
                      </span>
                    ) : outReq.status === "declined" ? (
                      <span className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded text-[10px] font-bold">
                        ✕ 模特暫未開放 / 授權已收回
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-300 rounded text-[10px] font-bold">
                        ⏳ 模特審核中
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-stone-400 mt-0.5">提出時間：{outReq.requestTime}</p>
                </div>

                <div>
                  {outReq.status === "approved" ? (
                    <Link
                      href={`/model/${encodeURIComponent(outReq.modelId)}`}
                      className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-2xs"
                    >
                      <span>👁️</span>
                      <span>查閱模特報價單</span>
                    </Link>
                  ) : (
                    <Link
                      href={`/model/${encodeURIComponent(outReq.modelId)}`}
                      className="px-3.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-medium transition"
                    >
                      查看模特主頁
                    </Link>
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