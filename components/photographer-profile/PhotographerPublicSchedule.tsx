"use client";

import React, { useState, useMemo } from "react";

interface PhotographerPublicScheduleProps {
  scheduleData: Record<string, { status: "available" | "busy" | "off"; note?: string }>;
  onSelectDate?: (dateKey: string) => void;
}

export default function PhotographerPublicSchedule({
  scheduleData,
  onSelectDate,
}: PhotographerPublicScheduleProps) {
  const [viewYear, setViewYear] = useState(2026);
  const [viewMonth, setViewMonth] = useState(10);
  const [selectedDayKey, setSelectedDayKey] = useState<string | null>(null);

  const daysInMonth = useMemo(() => new Date(viewYear, viewMonth, 0).getDate(), [viewYear, viewMonth]);
  const firstDay = useMemo(() => new Date(viewYear, viewMonth - 1, 1).getDay(), [viewYear, viewMonth]);

  const handlePrevMonth = () => {
    if (viewMonth === 1) {
      setViewYear(viewYear - 1);
      setViewMonth(12);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 12) {
      setViewYear(viewYear + 1);
      setViewMonth(1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const handleDayClick = (day: number) => {
    const key = `${viewYear}-${String(viewMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const info = scheduleData[key] || { status: "available" };
    if (info.status === "available") {
      setSelectedDayKey(key);
      if (onSelectDate) onSelectDate(key);
    }
  };

  return (
    <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-6 shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-stone-200 pb-3 gap-3">
        <div>
          <h3 className="text-sm font-bold text-stone-800 flex items-center gap-2">
            <span>📅</span>
            <span>攝影師開放檔期與預約日曆</span>
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            點選綠色日期可直接帶入約拍預約單；已滿檔或休假日恕暫不開放邀約。
          </p>
        </div>

        {/* 月份切換 */}
        <div className="flex items-center gap-3 bg-white border border-stone-300 px-3 py-1.5 rounded-xl shadow-2xs">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="text-stone-500 hover:text-stone-900 font-bold px-1.5 py-0.5 text-xs cursor-pointer"
          >
            ◀ 上個月
          </button>
          <span className="text-xs font-bold font-mono text-stone-800">
            {viewYear} 年 {viewMonth} 月
          </span>
          <button
            type="button"
            onClick={handleNextMonth}
            className="text-stone-500 hover:text-stone-900 font-bold px-1.5 py-0.5 text-xs cursor-pointer"
          >
            下個月 ▶
          </button>
        </div>
      </div>

      {/* 狀態標籤指示 */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4 text-stone-600 font-semibold">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>可預約 (點選帶入)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span>已滿檔 (約拍中)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-stone-300"></span>
            <span>公休休息</span>
          </span>
        </div>

        {selectedDayKey && (
          <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-lg">
            ✓ 已選擇日期：{selectedDayKey}
          </span>
        )}
      </div>

      {/* 月曆網格 */}
      <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="grid grid-cols-7 bg-stone-100 border-b border-stone-200 text-center text-xs font-bold text-stone-600 py-2">
          <span className="text-rose-600">日</span>
          <span>一</span>
          <span>二</span>
          <span>三</span>
          <span>四</span>
          <span>五</span>
          <span className="text-indigo-600">六</span>
        </div>

        <div className="grid grid-cols-7 text-xs">
          {Array.from({ length: firstDay }).map((_, index) => (
            <div key={`empty_${index}`} className="h-20 bg-stone-50/50 border-b border-r border-stone-200"></div>
          ))}

          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1;
            const key = `${viewYear}-${String(viewMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const slotInfo = scheduleData[key] || { status: "available", note: "" };

            const isAvailable = slotInfo.status === "available";
            const isBusy = slotInfo.status === "busy";
            const isOff = slotInfo.status === "off";
            const isSelected = selectedDayKey === key;

            let cellClass = "bg-white hover:bg-emerald-50/70 cursor-pointer border-stone-200";
            let dotClass = "bg-emerald-500";
            let badgeText = "可約";

            if (isSelected) {
              cellClass = "bg-indigo-50/90 border-indigo-500 ring-2 ring-indigo-400 cursor-pointer";
              badgeText = "已選取";
            } else if (isBusy) {
              cellClass = "bg-rose-50/40 opacity-70 cursor-not-allowed border-stone-200";
              dotClass = "bg-rose-500";
              badgeText = "已滿";
            } else if (isOff) {
              cellClass = "bg-stone-100/70 opacity-60 cursor-not-allowed border-stone-200";
              dotClass = "bg-stone-400";
              badgeText = "休假";
            }

            return (
              <div
                key={key}
                onClick={() => handleDayClick(day)}
                className={`h-20 border-b border-r p-2 flex flex-col justify-between transition ${cellClass}`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold font-mono text-xs text-stone-800">{day}</span>
                  <span className={`w-2 h-2 rounded-full ${dotClass}`}></span>
                </div>

                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      isSelected
                        ? "bg-indigo-600 text-white"
                        : isAvailable
                        ? "bg-emerald-100 text-emerald-800"
                        : isBusy
                        ? "bg-rose-100 text-rose-800"
                        : "bg-stone-200 text-stone-600"
                    }`}
                  >
                    {badgeText}
                  </span>
                  {slotInfo.note && (
                    <span className="text-[10px] text-stone-400 truncate max-w-[45px]" title={slotInfo.note}>
                      {slotInfo.note}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}