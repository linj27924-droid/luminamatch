"use client";

import React from "react";

interface PhotographerProfileTabProps {
  photographerProfile: {
    name: string;
    city: string;
    experienceYears: string;
    deliveryDays: number;
    safePromise: string;
    bio: string;
    coopMode: string;
  };
  setPhotographerProfile: React.Dispatch<React.SetStateAction<any>>;
  styles: string[];
  newStyleInput: string;
  setNewStyleInput: (v: string) => void;
  handleAddStyle: (e: React.FormEvent) => void;
  handleRemoveStyle: (tag: string) => void;
  handleSaveProfile: (e: React.FormEvent) => void;
}

export default function PhotographerProfileTab({
  photographerProfile,
  setPhotographerProfile,
  styles,
  newStyleInput,
  setNewStyleInput,
  handleAddStyle,
  handleRemoveStyle,
  handleSaveProfile,
}: PhotographerProfileTabProps) {
  return (
    <form onSubmit={handleSaveProfile} className="space-y-6">
      <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-6 shadow-sm space-y-5">
        <h3 className="text-sm font-bold text-stone-800 border-b border-stone-200 pb-2">
          基本資料與交件承諾
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">攝影師姓名 / 帳號稱呼</label>
            <input
              type="text"
              required
              value={photographerProfile.name}
              onChange={(e) => setPhotographerProfile({ ...photographerProfile, name: e.target.value })}
              className="w-full text-sm bg-[#f5f3ef] text-stone-800 font-medium border border-stone-300 rounded-lg p-2.5 outline-none focus:border-indigo-500 focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">主要接案城市</label>
            <input
              type="text"
              required
              value={photographerProfile.city}
              onChange={(e) => setPhotographerProfile({ ...photographerProfile, city: e.target.value })}
              className="w-full text-sm bg-[#f5f3ef] text-stone-800 font-medium border border-stone-300 rounded-lg p-2.5 outline-none focus:border-indigo-500 focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">接案年資 (年)</label>
            <input
              type="text"
              value={photographerProfile.experienceYears}
              onChange={(e) => setPhotographerProfile({ ...photographerProfile, experienceYears: e.target.value })}
              className="w-full text-sm bg-[#f5f3ef] text-stone-800 font-medium border border-stone-300 rounded-lg p-2.5 outline-none focus:border-indigo-500 focus:bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              ⏳ 成品精修承諾交稿天數
            </label>
            <select
              value={photographerProfile.deliveryDays}
              onChange={(e) => setPhotographerProfile({ ...photographerProfile, deliveryDays: Number(e.target.value) })}
              className="w-full text-sm bg-[#f5f3ef] text-stone-800 font-bold border border-stone-300 rounded-lg p-2.5 outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value={7}>7 天內（急速精修）</option>
              <option value={14}>14 天內（業界標準）</option>
              <option value={21}>21 天內</option>
              <option value={30}>30 天內</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              🛡️ 人身安全與現場規範承諾
            </label>
            <input
              type="text"
              value={photographerProfile.safePromise}
              onChange={(e) => setPhotographerProfile({ ...photographerProfile, safePromise: e.target.value })}
              placeholder="例：零肢體碰觸口頭引導 / 備女性助理同行"
              className="w-full text-sm bg-[#f5f3ef] text-stone-800 font-medium border border-stone-300 rounded-lg p-2.5 outline-none focus:border-indigo-500 focus:bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">攝影簡介與作品風格說明 (Bio)</label>
          <textarea
            rows={3}
            value={photographerProfile.bio}
            onChange={(e) => setPhotographerProfile({ ...photographerProfile, bio: e.target.value })}
            className="w-full text-sm bg-[#f5f3ef] text-stone-800 font-medium border border-stone-300 rounded-lg p-2.5 outline-none focus:border-indigo-500 focus:bg-white leading-relaxed"
          />
        </div>
      </div>

      {/* 拍攝風格標籤管理 */}
      <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-stone-800 border-b border-stone-200 pb-2">
          擅長拍攝風格標籤
        </h3>
        <div className="flex flex-wrap gap-2 mb-3">
          {styles.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-bold flex items-center gap-1.5"
            >
              ✓ {tag}
              <button
                type="button"
                onClick={() => handleRemoveStyle(tag)}
                className="text-indigo-500 hover:text-indigo-800 font-bold ml-1 cursor-pointer"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2 max-w-sm">
          <input
            type="text"
            value={newStyleInput}
            onChange={(e) => setNewStyleInput(e.target.value)}
            placeholder="新增風格 (例：棚拍微光)"
            className="flex-1 text-xs bg-[#f5f3ef] text-stone-800 font-medium border border-stone-300 rounded-lg p-2 outline-none focus:border-indigo-500 focus:bg-white"
          />
          <button
            type="button"
            onClick={handleAddStyle}
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition cursor-pointer"
          >
            新增標籤
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-xs transition cursor-pointer"
        >
          儲存攝影師資料設定
        </button>
      </div>
    </form>
  );
}