"use client";

import React from "react";

interface BookingFormProps {
  selectedDate: string | null;
  isQuietBlocked: boolean;
  isMonthOpen: boolean;
  coopType: string;
  setCoopType: (v: string) => void;
  coopOptions?: string[]; // 新增：連動模特後台的合作模式選項
  style: string;
  setStyle: (v: string) => void;
  location: string;
  setLocation: (v: string) => void;
  proposalNotes: string;
  setProposalNotes: (v: string) => void;
  handleBooking: (e: React.FormEvent) => void;
}

export default function BookingForm({
  selectedDate,
  isQuietBlocked,
  isMonthOpen,
  coopType,
  setCoopType,
  coopOptions = ["商業有酬", "互惠創作 (TFCD)"],
  style,
  setStyle,
  location,
  setLocation,
  proposalNotes,
  setProposalNotes,
  handleBooking,
}: BookingFormProps) {
  // 若傳入的選項是空的，提供保護預設值
  const availableOptions =
    coopOptions && coopOptions.length > 0
      ? coopOptions
      : ["商業有酬", "互惠創作 (TFCD)"];

  return (
    <form
      onSubmit={handleBooking}
      className="bg-[#fbfaf8] p-6 rounded-2xl border border-stone-300 shadow-sm space-y-4"
    >
      <div className="flex justify-between items-center border-b border-stone-200 pb-2">
        <div>
          <h4 className="font-bold text-sm text-stone-900">發起拍攝合作協議</h4>
          <p className="text-xs font-semibold mt-0.5">
            {selectedDate ? (
              <span className="text-indigo-700 font-bold">
                ✓ 已選定約定日期：${selectedDate}
              </span>
            ) : (
              <span className="text-stone-500 font-medium">
                請先於上方日曆點擊選擇【可預約】的綠色日期
              </span>
            )}
          </p>
        </div>
        <span className="text-[11px] text-indigo-800 bg-indigo-100 border border-indigo-300 px-2 py-0.5 rounded font-bold">
          ✦ 合作性質已連動模特自訂規則
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-bold text-stone-900">
              合作性質 (連動模特接案設定)
            </label>
            <span className="text-[10px] text-stone-500 font-medium">
              共 {availableOptions.length} 種模式可選
            </span>
          </div>
          {/* 連動模特後台設定的下拉選單 */}
          <select
            value={coopType}
            onChange={(e) => setCoopType(e.target.value)}
            className="w-full text-xs font-bold bg-white text-stone-900 border border-stone-400 rounded-lg p-2.5 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 shadow-2xs cursor-pointer"
          >
            {availableOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-900 mb-1">
            拍攝風格
          </label>
          <input
            type="text"
            required
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            placeholder="例：日系膠卷微光街拍"
            className="w-full text-xs font-semibold bg-white text-stone-900 placeholder:text-stone-500 border border-stone-400 rounded-lg p-2.5 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 shadow-2xs"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-stone-900 mb-1">
          約定拍攝地點
        </label>
        <input
          type="text"
          required
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="例：台北市大稻埕 / 赤峰街商圈"
          className="w-full text-xs font-semibold bg-white text-stone-900 placeholder:text-stone-500 border border-stone-400 rounded-lg p-2.5 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 shadow-2xs"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-stone-900 mb-1">
          💬 給模特的約拍提案信 (發送審核內容)：
        </label>
        <textarea
          rows={4}
          value={proposalNotes}
          onChange={(e) => setProposalNotes(e.target.value)}
          placeholder="請輸入您希望與模特合作的提案細節、交圖承諾或服裝討論..."
          className="w-full text-xs font-semibold bg-white text-stone-900 placeholder:text-stone-500 border border-stone-400 rounded-xl p-3 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 leading-relaxed shadow-2xs"
        />
      </div>

      <button
        type="submit"
        disabled={!selectedDate || isQuietBlocked || !isMonthOpen}
        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-stone-300 disabled:text-stone-500 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
      >
        {!isMonthOpen
          ? "該月份尚未開放預約"
          : selectedDate
          ? "確認送出約拍邀約協議給模特"
          : "請先點選日曆中的綠色【可預約】日期"}
      </button>
    </form>
  );
}