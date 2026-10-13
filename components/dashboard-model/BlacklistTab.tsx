"use client";

import React from "react";

export interface BlacklistedItem {
  id: string;
  name: string;
  reason: string;
  dateAdded: string;
}

interface BlacklistTabProps {
  blacklist: BlacklistedItem[];
  newBlacklistName: string;
  setNewBlacklistName: (v: string) => void;
  newBlacklistReason: string;
  setNewBlacklistReason: (v: string) => void;
  handleAddBlacklist: (e: React.FormEvent) => void;
  handleRemoveBlacklist: (id: string) => void;
}

export default function BlacklistTab({
  blacklist,
  newBlacklistName,
  setNewBlacklistName,
  newBlacklistReason,
  setNewBlacklistReason,
  handleAddBlacklist,
  handleRemoveBlacklist,
}: BlacklistTabProps) {
  return (
    <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-6 shadow-sm space-y-6">
      <div className="border-b border-stone-200 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">🛡️</span>
          <h3 className="text-sm font-bold text-stone-800">
            模特專屬：雙重隱形黑名單防護
          </h3>
        </div>
        <p className="text-xs text-stone-500 mt-1 leading-relaxed">
          保護模特不受越界打擾，同時不打草驚蛇。將對象加入此名單後，系統將自動啟動兩大靜默防護機制：
        </p>
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-[#f5f3ef] p-3.5 rounded-xl border border-stone-300/80 text-stone-700">
          <div>
            <strong className="text-indigo-800">✦ 方案 A（日曆偽裝全滿）：</strong>
            <p className="text-[11px] text-stone-500 mt-0.5">
              被封鎖者瀏覽您的個人主頁時，日曆所有日期將自動呈現灰色的「滿」或「休」，無任何可約空檔，讓對方知難而退。
            </p>
          </div>
          <div>
            <strong className="text-indigo-800">✦ 方案 B（幽靈過濾送出）：</strong>
            <p className="text-[11px] text-stone-500 mt-0.5">
              若對方透過舊連結或暫存強行送出約拍，系統會對其顯示「已送出」，但邀約會無聲無息沉入過濾夾，完全不騷擾您的後台。
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleAddBlacklist} className="bg-[#f5f3ef] p-4 rounded-xl border border-stone-300 space-y-3">
        <span className="text-xs font-bold text-stone-800 block">手動加入防護名單：</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            required
            value={newBlacklistName}
            onChange={(e) => setNewBlacklistName(e.target.value)}
            placeholder="攝影師姓名 / 帳號稱呼"
            className="text-xs bg-white text-stone-800 border border-stone-300 rounded-lg p-2.5 outline-none focus:border-indigo-500"
          />
          <input
            type="text"
            value={newBlacklistReason}
            onChange={(e) => setNewBlacklistReason(e.target.value)}
            placeholder="封鎖原因備註 (僅自己可見，例：言語越界、態度不佳)"
            className="text-xs bg-white text-stone-800 border border-stone-300 rounded-lg p-2.5 outline-none focus:border-indigo-500"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold rounded-lg transition shadow-2xs cursor-pointer"
          >
            🔒 啟動隱形封鎖
          </button>
        </div>
      </form>

      <div className="space-y-2">
        <span className="text-xs font-bold text-stone-700 block">目前防護對象清單 ({blacklist.length})：</span>
        {blacklist.length === 0 ? (
          <p className="text-xs text-stone-400 py-3 text-center">目前無任何黑名單對象，接案環境安全無虞。</p>
        ) : (
          blacklist.map((item) => (
            <div
              key={item.id}
              className="p-3.5 bg-white border border-stone-200 rounded-xl flex justify-between items-center text-xs shadow-2xs"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-stone-800 text-sm">{item.name}</span>
                  <span className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded text-[10px] font-bold">
                    已靜默遮蔽
                  </span>
                  <span className="text-stone-400 text-[10px]">加入日期：{item.dateAdded}</span>
                </div>
                <p className="text-stone-500 mt-1 text-[11px]">原因備註：{item.reason}</p>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveBlacklist(item.id)}
                className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-lg text-xs font-bold transition cursor-pointer"
              >
                解除防護
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}