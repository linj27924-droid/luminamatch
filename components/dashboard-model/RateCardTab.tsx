"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";

export interface RateCardRequest {
  id: string;
  photographerName: string;
  requestTime: string;
  status: "pending" | "approved" | "declined";
  expiresAt?: string; // 授權時效
  expiresLabel?: string;
  note?: string;
}

interface RateCardTabProps {
  rateCardImages: string[];
  setRateCardImages: React.Dispatch<React.SetStateAction<string[]>>;
  accessMode: "auto" | "require_approval";
  setAccessMode: (mode: "auto" | "require_approval") => void;
  rateCardRequests: RateCardRequest[];
  handleApproveRequest: (id: string, durationHours?: number) => void;
  handleDeclineRequest: (id: string) => void;
  handleDeleteRequests: (ids: string[]) => void;
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
  handleDeleteRequests,
  handleSaveRateCardConfig,
}: RateCardTabProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved" | "declined">("all");
  const [searchKeyword, setSearchKeyword] = useState("");

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

  const filteredRequests = useMemo(() => {
    return rateCardRequests.filter((req) => {
      if (filterStatus !== "all" && req.status !== filterStatus) return false;
      if (searchKeyword.trim() && !req.photographerName.toLowerCase().includes(searchKeyword.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [rateCardRequests, filterStatus, searchKeyword]);

  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredRequests.length && filteredRequests.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredRequests.map((r) => r.id));
    }
  };

  const handleToggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBatchApprove = (durationHours: number) => {
    if (selectedIds.length === 0) return;
    selectedIds.forEach((id) => handleApproveRequest(id, durationHours));
    setSelectedIds([]);
    alert(`✓ 已批量授權 ${selectedIds.length} 位攝影師查閱報價單！`);
  };

  const handleBatchDecline = () => {
    if (selectedIds.length === 0) return;
    selectedIds.forEach((id) => handleDeclineRequest(id));
    setSelectedIds([]);
    alert(`已批量收回 / 隱藏 ${selectedIds.length} 位攝影師的查閱權限。`);
  };

  const handleBatchDelete = () => {
    if (selectedIds.length === 0) return;
    const confirmDelete = window.confirm(`確定要刪除選取的 ${selectedIds.length} 筆索取紀錄嗎？`);
    if (!confirmDelete) return;

    handleDeleteRequests(selectedIds);
    setSelectedIds([]);
  };

  const handleDeleteSingle = (id: string) => {
    const confirmDelete = window.confirm("確定要刪除這筆索取紀錄嗎？");
    if (!confirmDelete) return;

    handleDeleteRequests([id]);
    setSelectedIds((prev) => prev.filter((item) => item !== id));
  };

  const pendingCount = rateCardRequests.filter((r) => r.status === "pending").length;

  return (
    <div className="space-y-6">
      {/* 報價單上傳 */}
      <form onSubmit={handleSaveRateCardConfig} className="space-y-6">
        <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="border-b border-stone-200 pb-2">
            <h3 className="text-sm font-bold text-stone-800 flex items-center gap-2">
              <span>💰</span>
              <span>商業報價單管理模組 (含時效授權與防偽浮水印)</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              可上傳最多 2 張長條直式報價單，並可限制攝影師查閱時效（如 24 小時），逾期自動關閉保護商案報價。
            </p>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-stone-700">
                直式長條報價單圖片 ({rateCardImages.length} / 2 張)：
              </label>
              {rateCardImages.length < 2 && (
                <label className="cursor-pointer px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold rounded-lg transition">
                  + 新增直式長條報價單
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
                <p className="text-xs text-stone-500">目前尚未上傳報價單圖片，支援上傳長條價目表（最多 2 張）。</p>
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
                      <img src={img} alt={`報價單第 ${idx + 1} 張`} className="w-full h-auto object-contain rounded-lg shadow-2xs" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

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
                  攝影師點擊索取後直接解鎖展示報價單（附防偽浮水印）。
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
                  <span className="text-xs font-bold">📩 通知模特，審核時效後才顯示</span>
                </div>
                <p className="text-[11px] text-stone-500 pl-5">
                  發起索取後，由您在下方選擇給予「24小時」或「3天」時效，保障報價不外流。
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

      {/* 審核管理控制台 */}
      <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-stone-200 pb-3">
          <div>
            <h4 className="text-sm font-bold text-stone-800 flex items-center gap-2">
              <span>📋</span>
              <span>索取報價單名單管理中心</span>
              <span className="text-xs font-normal text-stone-500">
                (共 {rateCardRequests.length} 筆紀錄)
              </span>
            </h4>
          </div>

          <div className="flex bg-[#edeae3]/80 p-1 rounded-xl border border-stone-300 text-xs font-bold">
            <button
              type="button"
              onClick={() => { setFilterStatus("all"); setSelectedIds([]); }}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                filterStatus === "all" ? "bg-white text-stone-900 shadow-xs" : "text-stone-600"
              }`}
            >
              全部 ({rateCardRequests.length})
            </button>
            <button
              type="button"
              onClick={() => { setFilterStatus("pending"); setSelectedIds([]); }}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                filterStatus === "pending" ? "bg-white text-amber-900 shadow-xs" : "text-stone-600"
              }`}
            >
              <span>待決定</span>
              {pendingCount > 0 && (
                <span className="w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] flex items-center justify-center font-bold">
                  {pendingCount}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => { setFilterStatus("approved"); setSelectedIds([]); }}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                filterStatus === "approved" ? "bg-white text-emerald-800 shadow-xs" : "text-stone-600"
              }`}
            >
              已授權
            </button>
            <button
              type="button"
              onClick={() => { setFilterStatus("declined"); setSelectedIds([]); }}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                filterStatus === "declined" ? "bg-white text-rose-800 shadow-xs" : "text-stone-600"
              }`}
            >
              已婉拒/隱藏
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 bg-[#f5f3ef] p-3 rounded-xl border border-stone-300">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <label className="flex items-center gap-1.5 text-xs font-bold text-stone-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={filteredRequests.length > 0 && selectedIds.length === filteredRequests.length}
                onChange={handleToggleSelectAll}
                className="w-4 h-4 accent-indigo-600 rounded"
              />
              <span>全選目前名單</span>
            </label>
            {selectedIds.length > 0 && (
              <span className="text-xs text-indigo-700 font-bold bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                已勾選 {selectedIds.length} 位
              </span>
            )}
          </div>

          <div className="w-full sm:w-56">
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="🔍 搜尋攝影師名稱..."
              className="w-full text-xs bg-white text-stone-800 border border-stone-300 rounded-lg p-1.5 outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {selectedIds.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-indigo-50 border border-indigo-200 rounded-xl shadow-xs">
            <span className="text-xs font-bold text-indigo-950">
              ⚡ 批量時效授權：
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleBatchApprove(24)}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition cursor-pointer"
              >
                ✓ 授權 24 小時
              </button>
              <button
                type="button"
                onClick={() => handleBatchApprove(72)}
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition cursor-pointer"
              >
                ✓ 授權 3 天
              </button>
              <button
                type="button"
                onClick={handleBatchDecline}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition cursor-pointer"
              >
                ✕ 一鍵收回
              </button>
              <button
                type="button"
                onClick={handleBatchDelete}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition cursor-pointer"
              >
                🗑️ 刪除紀錄
              </button>
            </div>
          </div>
        )}

        {filteredRequests.length === 0 ? (
          <p className="text-xs text-stone-400 py-8 text-center bg-[#f5f3ef]/60 rounded-xl border border-dashed border-stone-300">
            目前此分類無任何索取紀錄。
          </p>
        ) : (
          <div className="space-y-2.5">
            {filteredRequests.map((req) => {
              const isChecked = selectedIds.includes(req.id);
              return (
                <div
                  key={req.id}
                  className={`p-3.5 rounded-xl border flex flex-wrap justify-between items-center gap-3 text-xs transition shadow-2xs ${
                    isChecked
                      ? "bg-indigo-50/60 border-indigo-300 ring-1 ring-indigo-200"
                      : "bg-white border-stone-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleSelectOne(req.id)}
                      className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                    />

                    <div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/photographer/${encodeURIComponent(req.photographerName)}`}
                          className="text-stone-900 text-sm font-bold hover:text-indigo-600 hover:underline flex items-center gap-1 group"
                        >
                          <span>{req.photographerName}</span>
                          <span className="text-[11px] text-indigo-500 group-hover:translate-x-0.5 transition">➔</span>
                        </Link>

                        {req.status === "approved" ? (
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[10px] font-bold">
                            ✓ {req.expiresLabel || "已授權可見"}
                          </span>
                        ) : req.status === "declined" ? (
                          <span className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded text-[10px] font-bold">
                            ✕ 已婉拒/隱藏
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-300 rounded text-[10px] font-bold">
                            ⏳ 待決定審核
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-stone-400 mt-0.5">索取時間：{req.requestTime}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {req.status === "pending" && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleApproveRequest(req.id, 24)}
                          className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition cursor-pointer"
                        >
                          ✓ 授權24小時
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApproveRequest(req.id, 72)}
                          className="px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition cursor-pointer"
                        >
                          ✓ 授權3天
                        </button>
                      </>
                    )}

                    {req.status === "approved" ? (
                      <button
                        type="button"
                        onClick={() => handleDeclineRequest(req.id)}
                        className="px-2.5 py-1.5 bg-stone-100 hover:bg-amber-50 hover:text-amber-800 text-stone-600 rounded-lg text-xs font-semibold transition cursor-pointer border border-stone-200"
                      >
                        隱藏/收回
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleDeclineRequest(req.id)}
                        className="px-2.5 py-1.5 bg-stone-100 hover:bg-rose-50 hover:text-rose-700 text-stone-600 rounded-lg text-xs font-semibold transition cursor-pointer"
                      >
                        婉拒
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDeleteSingle(req.id)}
                      className="px-2 py-1.5 text-stone-400 hover:text-rose-600 rounded-lg text-xs transition cursor-pointer"
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
    </div>
  );
}