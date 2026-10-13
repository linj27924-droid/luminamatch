"use client";

import React from "react";

export interface CustomScheduleStatus {
  id: string;
  name: string;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  isBookable: boolean;
}

export interface TimedReleaseTask {
  id: string;
  targetMonthKey: string;
  targetMonthLabel: string;
  releaseDateTime: string;
  isExecuted: boolean;
  createdAt: string;
}

interface ScheduleTabProps {
  targetReleaseMonth: string;
  setTargetReleaseMonth: (v: string) => void;
  targetReleaseDateTime: string;
  setTargetReleaseDateTime: (v: string) => void;
  availableMonthsList: { year: number; month: number }[];
  handleAddTimedRelease: (e: React.FormEvent) => void;
  timedReleaseTasks: TimedReleaseTask[];
  handleExecuteNow: (task: TimedReleaseTask) => void;
  handleCancelTimedTask: (id: string) => void;
  customStatusList: CustomScheduleStatus[];
  activeBrushId: string;
  setActiveBrushId: (v: string) => void;
  newStatusName: string;
  setNewStatusName: (v: string) => void;
  handleAddCustomStatus: (e: React.FormEvent) => void;
  viewYear: number;
  setViewYear: (v: number) => void;
  viewMonth: number;
  setViewMonth: (v: number) => void;
  monthlyVisibility: Record<string, boolean>;
  isCurrentMonthVisible: boolean;
  handleToggleMonthVisibility: () => void;
  firstDay: number;
  daysInMonth: number;
  scheduleData: Record<string, string>;
  handleDateClick: (day: number) => void;
  handleSaveProfile: (e: React.FormEvent) => void;
}

export default function ScheduleTab({
  targetReleaseMonth,
  setTargetReleaseMonth,
  targetReleaseDateTime,
  setTargetReleaseDateTime,
  availableMonthsList,
  handleAddTimedRelease,
  timedReleaseTasks,
  handleExecuteNow,
  handleCancelTimedTask,
  customStatusList,
  activeBrushId,
  setActiveBrushId,
  newStatusName,
  setNewStatusName,
  handleAddCustomStatus,
  viewYear,
  setViewYear,
  viewMonth,
  setViewMonth,
  monthlyVisibility,
  isCurrentMonthVisible,
  handleToggleMonthVisibility,
  firstDay,
  daysInMonth,
  scheduleData,
  handleDateClick,
  handleSaveProfile,
}: ScheduleTabProps) {
  return (
    <div className="space-y-6">
      {/* 定時自動開放預約排程器 */}
      <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="border-b border-stone-200 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-base">⏰</span>
            <h3 className="text-sm font-bold text-stone-800">
              定時自動開放預約功能 (搶檔期設定)
            </h3>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            設定指定未來的日期與時間，系統將自動準時對外公開指定月份檔期，攝影師端方可發起預約。
          </p>
        </div>

        <form onSubmit={handleAddTimedRelease} className="bg-[#f5f3ef] p-4 rounded-xl border border-stone-300 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                1. 指定要開放的目標月份：
              </label>
              <select
                value={targetReleaseMonth}
                onChange={(e) => setTargetReleaseMonth(e.target.value)}
                className="w-full text-xs bg-white text-stone-800 font-bold border border-stone-300 rounded-lg p-2.5 outline-none focus:border-indigo-500"
              >
                {availableMonthsList.map(({ year, month }) => (
                  <option key={`target-${year}-${month}`} value={`${year}-${month}`}>
                    {year} 年 {month} 月 {year === 2027 ? "(隔年)" : ""}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                2. 設定自動開放的日期與時間 (例如：10/20 20:00)：
              </label>
              <input
                type="datetime-local"
                required
                value={targetReleaseDateTime}
                onChange={(e) => setTargetReleaseDateTime(e.target.value)}
                className="w-full text-xs bg-white text-stone-800 font-bold border border-stone-300 rounded-lg p-2.5 outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-1">
            <span className="text-[11px] text-stone-500">
              💡 提示：排程設定後，該目標月份會先處於鎖定隱藏狀態，直到設定時間自動解鎖。
            </span>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
            >
              + 設定自動開放排程
            </button>
          </div>
        </form>

        <div className="space-y-2">
          <span className="text-xs font-bold text-stone-700 block">
            目前進行中的定時開放任務 ({timedReleaseTasks.length})：
          </span>
          {timedReleaseTasks.length === 0 ? (
            <p className="text-xs text-stone-400 py-2 text-center bg-[#f5f3ef]/60 rounded-xl border border-dashed border-stone-300">
              目前無定時開放任務，所有月份依下方日曆開關手動控制。
            </p>
          ) : (
            timedReleaseTasks.map((task) => (
              <div
                key={task.id}
                className="p-3.5 bg-white border border-stone-200 rounded-xl flex flex-wrap justify-between items-center gap-2 text-xs shadow-2xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <strong className="text-stone-900 text-sm">{task.targetMonthLabel}</strong>
                    {task.isExecuted ? (
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[10px] font-bold">
                        ✓ 已準時自動開放
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-300 rounded text-[10px] font-bold">
                        ⏳ 倒數等待開放中
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-stone-500">
                    預定開放時間：<strong>{task.releaseDateTime.replace("T", " ")}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {!task.isExecuted && (
                    <button
                      type="button"
                      onClick={() => handleExecuteNow(task)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition cursor-pointer"
                    >
                      提前立即開放
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleCancelTimedTask(task.id)}
                    className="px-3 py-1.5 bg-stone-100 hover:bg-rose-50 hover:text-rose-700 text-stone-600 rounded-lg text-xs font-bold transition cursor-pointer"
                  >
                    取消任務
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 日曆筆刷與行事曆網格 */}
      <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="bg-[#f5f3ef] p-4 rounded-2xl border border-stone-300 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-stone-800">
              🎨 目前排程筆刷標籤 (點選下方標籤後，再點日曆格子套用)：
            </span>
            <span className="text-[11px] text-stone-500">
              套用中：<strong>{customStatusList.find((s) => s.id === activeBrushId)?.name}</strong>
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {customStatusList.map((status) => {
              const isSelected = activeBrushId === status.id;
              return (
                <button
                  key={status.id}
                  type="button"
                  onClick={() => setActiveBrushId(status.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center gap-1.5 ${
                    status.bgColor
                  } ${status.borderColor} ${status.textColor} ${
                    isSelected ? "ring-2 ring-indigo-600 shadow-xs" : "opacity-75 hover:opacity-100"
                  }`}
                >
                  <span>●</span>
                  {status.name}
                  {isSelected && <span className="text-[10px]">（選用中）</span>}
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-stone-300/70 flex gap-2 max-w-md">
            <input
              type="text"
              value={newStatusName}
              onChange={(e) => setNewStatusName(e.target.value)}
              placeholder="自訂新標籤 (例：已排邀約、私下約拍、出國取材)"
              className="flex-1 text-xs bg-white text-stone-800 border border-stone-300 rounded-lg p-2 outline-none focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={handleAddCustomStatus}
              className="px-3.5 py-1.5 bg-stone-800 hover:bg-stone-900 text-white text-xs font-bold rounded-lg transition cursor-pointer"
            >
              新增標籤
            </button>
          </div>
        </div>

        <div className="flex flex-wrap justify-between items-center gap-4 pb-4 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-stone-700">選擇月份：</label>
            <select
              value={`${viewYear}-${viewMonth}`}
              onChange={(e) => {
                const [y, m] = e.target.value.split("-").map(Number);
                setViewYear(y);
                setViewMonth(m);
              }}
              className="bg-[#f5f3ef] text-stone-800 border border-stone-300 font-bold text-sm rounded-xl px-3 py-1.5 outline-none focus:border-indigo-500"
            >
              {availableMonthsList.map(({ year, month }) => {
                const isVis = monthlyVisibility[`${year}-${month}`] ?? true;
                return (
                  <option key={`${year}-${month}`} value={`${year}-${month}`}>
                    {year} 年 {month} 月 {year === 2027 ? "(隔年)" : ""} - {isVis ? "[公開中]" : "[已隱藏]"}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="flex items-center gap-3 bg-[#edeae3]/70 px-4 py-2 rounded-xl border border-stone-300">
            <div className="text-right">
              <span className="block text-xs font-bold text-stone-800">
                公開本月檔期給攝影師查看
              </span>
              <span className="block text-[10px] text-stone-500">
                {isCurrentMonthVisible ? "前台可見並接受預約" : "前台已完全隱藏此月份"}
              </span>
            </div>
            <button
              type="button"
              onClick={handleToggleMonthVisibility}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                isCurrentMonthVisible ? "bg-emerald-600" : "bg-stone-300"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  isCurrentMonthVisible ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        <div className={`relative transition duration-200 ${!isCurrentMonthVisible ? "opacity-40 select-none pointer-events-none" : ""}`}>
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-stone-500 mb-2">
            <div className="text-rose-600">週日</div>
            <div>週一</div>
            <div>週二</div>
            <div>週三</div>
            <div>週四</div>
            <div>週五</div>
            <div className="text-rose-600">週六</div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="h-16 border border-transparent rounded-xl" />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateKey = `${viewYear}-${String(viewMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const statusId = scheduleData[dateKey] || "available";
              const statusObj = customStatusList.find((s) => s.id === statusId) || customStatusList[0];

              return (
                <button
                  key={dateKey}
                  type="button"
                  onClick={() => handleDateClick(day)}
                  className={`h-16 rounded-xl border flex flex-col items-center justify-center transition cursor-pointer p-1 shadow-2xs ${
                    statusObj.bgColor
                  } ${statusObj.borderColor} ${statusObj.textColor} hover:brightness-95`}
                >
                  <span className="text-sm font-bold">{day}</span>
                  <span className="text-[10px] font-semibold mt-0.5 truncate max-w-full px-1">
                    {statusObj.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={handleSaveProfile}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
          >
            儲存檔期排程與標籤變更
          </button>
        </div>
      </div>
    </div>
  );
}