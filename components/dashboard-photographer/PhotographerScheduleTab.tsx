"use client";

import React, { useState, useMemo } from "react";

export interface PhotographerScheduleSlot {
  date: string; // "2026-10-28"
  status: "available" | "busy" | "off"; // 可預約、已約滿、休假
  note?: string; // 備註
}

interface PhotographerScheduleTabProps {
  scheduleData: Record<string, { status: "available" | "busy" | "off"; note?: string }>;
  onUpdateSchedule: (dateKey: string, status: "available" | "busy" | "off", note?: string) => void;
}

export default function PhotographerScheduleTab({
  scheduleData,
  onUpdateSchedule,
}: PhotographerScheduleTabProps) {
  const [viewYear, setViewYear] = useState(2026);
  const [viewMonth, setViewMonth] = useState(10);

  // 選中某個日期來編輯備註或切換狀態
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState<"available" | "busy" | "off">("available");
  const [editNote, setEditNote] = useState("");

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
    setSelectedDate(key);
    const current = scheduleData[key] || { status: "available", note: "" };
    setEditStatus(current.status);
    setEditNote(current.note || "");
  };

  const handleSaveDaySetting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) return;
    onUpdateSchedule(selectedDate, editStatus, editNote.trim());
    setSelectedDate(null);
    alert(`✅ 已成功更新 ${selectedDate} 的檔期狀態！`);
  };

  return (
    <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-stone-200 pb-4 gap-3">
        <div>
          <h3 className="text-sm font-bold text-stone-800 flex items-center gap-2">
            <span>📅</span>
            <span>攝影師檔期管理日曆</span>
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            點擊任一日曆格子可快速切換「🟢 可預約」、「🔴 已滿檔」或「⚪ 休假休息」，方便模特線上查詢。
          </p>
        </div>

        {/* 月份切換控制器 */}
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

      {/* 圖示說明列 */}
      <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-stone-600 bg-white p-3 rounded-xl border border-stone-200">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
          <span>開放預約 (Available)</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-rose-500 inline-block"></span>
          <span>已滿檔 / 約拍中 (Busy)</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-stone-300 inline-block"></span>
          <span>休假休息 (Off)</span>
        </span>
      </div>

      {/* 月曆網格 */}
      <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="grid grid-cols-7 bg-stone-100 border-b border-stone-200 text-center text-xs font-bold text-stone-600 py-2.5">
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
            <div key={`empty_${index}`} className="h-24 bg-stone-50/40 border-b border-r border-stone-200"></div>
          ))}

          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1;
            const key = `${viewYear}-${String(viewMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const slotInfo = scheduleData[key] || { status: "available", note: "" };

            let statusBg = "bg-emerald-50/60 hover:bg-emerald-100/60 border-emerald-200 text-emerald-900";
            let dotColor = "bg-emerald-500";
            let statusText = "可預約";

            if (slotInfo.status === "busy") {
              statusBg = "bg-rose-50/60 hover:bg-rose-100/60 border-rose-200 text-rose-900";
              dotColor = "bg-rose-500";
              statusText = "已滿檔";
            } else if (slotInfo.status === "off") {
              statusBg = "bg-stone-100 hover:bg-stone-200 border-stone-300 text-stone-500";
              dotColor = "bg-stone-400";
              statusText = "休假";
            }

            return (
              <div
                key={key}
                onClick={() => handleDayClick(day)}
                className={`h-24 border-b border-r border-stone-200 p-2 flex flex-col justify-between transition cursor-pointer ${statusBg}`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold font-mono text-xs">{day}</span>
                  <span className={`w-2 h-2 rounded-full ${dotColor}`} title={statusText}></span>
                </div>

                <div className="space-y-1 overflow-hidden">
                  <span className="text-[10px] font-bold block truncate opacity-80">{statusText}</span>
                  {slotInfo.note && (
                    <p className="text-[10px] bg-white/80 p-1 rounded border border-black/5 truncate text-stone-700">
                      📝 {slotInfo.note}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 編輯特定日期的彈窗 */}
      {selectedDate && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveDaySetting}
            className="bg-[#fbfaf8] border border-stone-200 rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-xs"
          >
            <div className="flex justify-between items-center border-b border-stone-200 pb-2">
              <h4 className="font-bold text-stone-900 flex items-center gap-1.5">
                <span>📅</span>
                <span>設定日期檔期：{selectedDate}</span>
              </h4>
              <button
                type="button"
                onClick={() => setSelectedDate(null)}
                className="text-stone-400 hover:text-stone-600 text-base font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-bold text-stone-700 mb-1">檔期狀態選擇</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setEditStatus("available")}
                    className={`py-2 rounded-lg font-bold border transition cursor-pointer ${
                      editStatus === "available"
                        ? "bg-emerald-600 text-white border-emerald-700 shadow-xs"
                        : "bg-white text-stone-700 border-stone-300"
                    }`}
                  >
                    🟢 可預約
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditStatus("busy")}
                    className={`py-2 rounded-lg font-bold border transition cursor-pointer ${
                      editStatus === "busy"
                        ? "bg-rose-600 text-white border-rose-700 shadow-xs"
                        : "bg-white text-stone-700 border-stone-300"
                    }`}
                  >
                    🔴 已滿檔
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditStatus("off")}
                    className={`py-2 rounded-lg font-bold border transition cursor-pointer ${
                      editStatus === "off"
                        ? "bg-stone-700 text-white border-stone-800 shadow-xs"
                        : "bg-white text-stone-700 border-stone-300"
                    }`}
                  >
                    ⚪ 休假
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">備註說明 (選填)</label>
                <input
                  type="text"
                  value={editNote}
                  onChange={(e) => setEditNote(e.target.value)}
                  placeholder="例：大稻埕外拍專案 / 預計午後有空"
                  className="w-full bg-white text-stone-800 border border-stone-300 rounded-lg p-2.5 outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setSelectedDate(null)}
                className="px-3.5 py-1.5 bg-stone-200 text-stone-700 rounded-xl font-bold hover:bg-stone-300 cursor-pointer"
              >
                取消
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-bold transition shadow-xs cursor-pointer"
              >
                儲存設定
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}