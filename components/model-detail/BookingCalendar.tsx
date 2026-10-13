"use client";

import React from "react";

interface TimedReleaseTask {
  id: string;
  targetMonthKey: string;
  targetMonthLabel: string;
  releaseDateTime: string;
  isExecuted: boolean;
}

interface BookingCalendarProps {
  modelName: string;
  viewYear: number;
  viewMonth: number;
  setViewYear: (y: number) => void;
  setViewMonth: (m: number) => void;
  isMonthOpen: boolean;
  upcomingTimedTask?: TimedReleaseTask;
  firstDay: number;
  daysInMonth: number;
  modelScheduleData: Record<string, string>;
  customStatusList: { id: string; name: string; isBookable: boolean }[];
  isQuietBlocked: boolean;
  selectedDate: string | null;
  setSelectedDate: (date: string) => void;
}

export default function BookingCalendar({
  modelName,
  viewYear,
  viewMonth,
  setViewYear,
  setViewMonth,
  isMonthOpen,
  upcomingTimedTask,
  firstDay,
  daysInMonth,
  modelScheduleData,
  customStatusList,
  isQuietBlocked,
  selectedDate,
  setSelectedDate,
}: BookingCalendarProps) {
  return (
    <div className="bg-[#fbfaf8] p-6 rounded-2xl border border-stone-200/90 space-y-4 shadow-sm">
      <div className="flex flex-wrap justify-between items-center gap-2 pb-2 border-b border-stone-200">
        <div>
          <h3 className="font-bold text-stone-900 text-sm">{modelName} 的檔期行事曆</h3>
          <p className="text-[11px] text-stone-600 font-medium">
            綠色為模特開放預約空檔；灰色為已排定約拍或休假
          </p>
        </div>

        <select
          value={`${viewYear}-${viewMonth}`}
          onChange={(e) => {
            const [y, m] = e.target.value.split("-").map(Number);
            setViewYear(y);
            setViewMonth(m);
          }}
          className="text-xs border border-stone-400 rounded-lg p-1.5 bg-white text-stone-900 font-bold outline-none cursor-pointer"
        >
          <option value="2026-10">2026 年 10 月</option>
          <option value="2026-11">2026 年 11 月</option>
          <option value="2026-12">2026 年 12 月</option>
          <option value="2027-1">2027 年 1 月 (隔年)</option>
          <option value="2027-2">2027 年 2 月 (隔年)</option>
        </select>
      </div>

      {/* 定時開放倒數醒目提示 */}
      {!isMonthOpen && upcomingTimedTask ? (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl text-center space-y-1">
          <div className="text-base">⏳</div>
          <h4 className="text-xs font-bold text-amber-900">本月份檔期尚未對外解鎖</h4>
          <p className="text-[11px] text-amber-800 font-medium">
            模特已設定定時開放，預計於{" "}
            <strong>{upcomingTimedTask.releaseDateTime.replace("T", " ")}</strong>{" "}
            準時對外開放預約，敬請準時搶約！
          </p>
        </div>
      ) : !isMonthOpen ? (
        <div className="p-4 bg-stone-200/70 border border-stone-300 rounded-xl text-center text-xs text-stone-600 font-bold">
          🔒 模特目前尚未開放本月份之檔期預約。
        </div>
      ) : (
        /* 日曆網格 */
        <div className="grid grid-cols-7 gap-1.5 text-center text-xs">
          {["週日", "週一", "週二", "週三", "週四", "週五", "週六"].map((d) => (
            <div key={d} className="font-bold text-stone-600 py-1">
              {d}
            </div>
          ))}

          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="h-14 border border-transparent rounded-lg" />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateKey = `${viewYear}-${String(viewMonth).padStart(2, "0")}-${String(
              day
            ).padStart(2, "0")}`;

            const statusId = modelScheduleData[dateKey] || "available";
            const statusDef = customStatusList.find((s) => s.id === statusId) || {
              id: statusId,
              name: statusId === "off" ? "休假" : "不可約",
              isBookable: false,
            };

            const isAvailable = !isQuietBlocked && statusDef.isBookable;
            const isSelected = selectedDate === dateKey;

            return (
              <button
                key={day}
                type="button"
                disabled={!isAvailable}
                onClick={() => isAvailable && setSelectedDate(dateKey)}
                className={`h-14 rounded-xl border flex flex-col items-center justify-center transition p-1 ${
                  isSelected
                    ? "bg-indigo-700 text-white border-indigo-700 shadow-md ring-2 ring-indigo-400"
                    : isAvailable
                    ? "bg-emerald-50 text-emerald-900 border-emerald-400 hover:bg-emerald-100 cursor-pointer font-bold"
                    : "bg-stone-200/60 text-stone-400 border-stone-300 cursor-not-allowed"
                }`}
              >
                <span className="text-xs font-bold">{day}</span>
                <span className="text-[10px] font-semibold mt-0.5 truncate max-w-full">
                  {isQuietBlocked ? "滿檔" : statusDef.name}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {isQuietBlocked && (
        <div className="p-2.5 bg-stone-200 rounded-xl text-center text-xs text-stone-700 font-bold">
          🔒 該模特目前檔期全滿，暫停對外接受預約。
        </div>
      )}
    </div>
  );
}