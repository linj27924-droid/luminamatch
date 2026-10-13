"use client";

import React from "react";

interface ProfileTabProps {
  coverPhoto: string;
  coverFocusY: number;
  setCoverFocusY: (v: number) => void;
  handleCoverUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  modelProfile: {
    name: string;
    city: string;
    height: string;
    weight: string;
    hideWeight: boolean;
    companionPolicy: string;
    measurements: string;
    experienceYears: string;
    bio: string;
    coopModes: string;
  };
  setModelProfile: React.Dispatch<React.SetStateAction<any>>;
  selectedCoopModes: string[];
  toggleCoopMode: (mode: string) => void;
  customCoop1: string;
  setCustomCoop1: (v: string) => void;
  customCoop2: string;
  setCustomCoop2: (v: string) => void;
  styles: string[];
  newStyleInput: string;
  setNewStyleInput: (v: string) => void;
  handleAddStyle: (e: React.FormEvent) => void;
  handleRemoveStyle: (tag: string) => void;
  boundaries: string[];
  newBoundaryInput: string;
  setNewBoundaryInput: (v: string) => void;
  handleAddBoundary: (e: React.FormEvent) => void;
  handleRemoveBoundary: (tag: string) => void;
  socialLinks: {
    instagram: string;
    facebook: string;
    threads: string;
    custom1Name: string;
    custom1Url: string;
    custom2Name: string;
    custom2Url: string;
  };
  setSocialLinks: React.Dispatch<React.SetStateAction<any>>;
  handleSaveProfile: (e: React.FormEvent) => void;
}

export default function ProfileTab({
  coverPhoto,
  coverFocusY,
  setCoverFocusY,
  handleCoverUpload,
  modelProfile,
  setModelProfile,
  selectedCoopModes,
  toggleCoopMode,
  customCoop1,
  setCustomCoop1,
  customCoop2,
  setCustomCoop2,
  styles,
  newStyleInput,
  setNewStyleInput,
  handleAddStyle,
  handleRemoveStyle,
  boundaries,
  newBoundaryInput,
  setNewBoundaryInput,
  handleAddBoundary,
  handleRemoveBoundary,
  socialLinks,
  setSocialLinks,
  handleSaveProfile,
}: ProfileTabProps) {
  return (
    <form onSubmit={handleSaveProfile} className="space-y-6">
      {/* 1:1 封面對焦微調 */}
      <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="border-b border-stone-200 pb-2 flex justify-between items-center">
          <h3 className="text-sm font-bold text-stone-800">
            大廳 1:1 正方形封面與位置微調
          </h3>
          <span className="text-[11px] text-indigo-700 font-semibold bg-indigo-50 px-2 py-0.5 rounded">
            ✦ 方框提示已啟用，避免切到頭部
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 items-center">
          <div className="flex flex-col items-center">
            <div className="relative w-64 h-64 rounded-2xl overflow-hidden border-4 border-indigo-500/80 shadow-md bg-stone-900">
              <img
                src={coverPhoto}
                alt="封面預覽"
                style={{ objectPosition: `center ${coverFocusY}%` }}
                className="w-full h-full object-cover transition-all duration-75"
              />
              <div className="absolute inset-0 pointer-events-none border border-white/40 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-white/70 rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>
              </div>
              <span className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-md text-white text-[10px] px-2 py-0.5 rounded font-mono">
                大廳 1:1 實際呈現效果
              </span>
            </div>
            <p className="text-[11px] text-stone-500 mt-2 text-center">
              ↑ 此方框即為訪客在大廳第一眼看到的 1:1 完整範圍
            </p>
          </div>

          <div className="space-y-5 bg-[#f5f3ef] p-5 rounded-2xl border border-stone-300/80">
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                上下平移對焦點 (垂直位置)：{coverFocusY}%
              </label>
              <p className="text-[11px] text-stone-500 mb-3">
                滑動滑桿將視覺中心定在臉部或上半身，防止頭部被切掉：
              </p>
              <input
                type="range"
                min="0"
                max="100"
                value={coverFocusY}
                onChange={(e) => setCoverFocusY(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer h-2 bg-stone-300 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-stone-500 mt-1 font-semibold">
                <span>頂部 (頭頂/臉部 0%)</span>
                <span>中間 (50%)</span>
                <span>底部 (腳部 100%)</span>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-300">
              <label className="inline-block cursor-pointer px-4 py-2.5 bg-stone-800 hover:bg-stone-900 text-white text-xs font-bold rounded-xl transition shadow-xs">
                📁 更換封面照片檔案
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverUpload}
                  className="hidden"
                />
              </label>
              <p className="text-[11px] text-stone-400 mt-2">
                支援上傳直式全身照或橫式大景，上傳後即可使用上方滑桿自由調整。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 基本資料與安全隱私 */}
      <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-6 shadow-sm space-y-5">
        <h3 className="text-sm font-bold text-stone-800 border-b border-stone-200 pb-2">
          基本資料與安全隱私
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">藝名 / 稱呼</label>
            <input
              type="text"
              value={modelProfile.name}
              onChange={(e) => setModelProfile({ ...modelProfile, name: e.target.value })}
              className="w-full text-sm bg-[#f5f3ef] text-stone-800 placeholder:text-stone-400 font-medium border border-stone-300 rounded-lg p-2.5 outline-none focus:border-indigo-500 focus:bg-white"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">主要接案城市</label>
            <input
              type="text"
              value={modelProfile.city}
              onChange={(e) => setModelProfile({ ...modelProfile, city: e.target.value })}
              className="w-full text-sm bg-[#f5f3ef] text-stone-800 placeholder:text-stone-400 font-medium border border-stone-300 rounded-lg p-2.5 outline-none focus:border-indigo-500 focus:bg-white"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">接案年資 (年)</label>
            <input
              type="text"
              value={modelProfile.experienceYears}
              onChange={(e) => setModelProfile({ ...modelProfile, experienceYears: e.target.value })}
              className="w-full text-sm bg-[#f5f3ef] text-stone-800 placeholder:text-stone-400 font-medium border border-stone-300 rounded-lg p-2.5 outline-none focus:border-indigo-500 focus:bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">身高 (cm)</label>
            <input
              type="text"
              value={modelProfile.height}
              onChange={(e) => setModelProfile({ ...modelProfile, height: e.target.value })}
              className="w-full text-sm bg-[#f5f3ef] text-stone-800 placeholder:text-stone-400 font-medium border border-stone-300 rounded-lg p-2.5 outline-none focus:border-indigo-500 focus:bg-white"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-stone-700">體重 (kg)</label>
              <label className="flex items-center gap-1 text-[11px] font-semibold text-stone-500 cursor-pointer">
                <input
                  type="checkbox"
                  checked={modelProfile.hideWeight}
                  onChange={(e) => setModelProfile({ ...modelProfile, hideWeight: e.target.checked })}
                  className="rounded accent-indigo-600"
                />
                公開頁面隱藏
              </label>
            </div>
            <input
              type="text"
              value={modelProfile.weight}
              disabled={modelProfile.hideWeight}
              onChange={(e) => setModelProfile({ ...modelProfile, weight: e.target.value })}
              className={`w-full text-sm font-medium border border-stone-300 rounded-lg p-2.5 outline-none ${
                modelProfile.hideWeight
                  ? "bg-stone-200/50 text-stone-400 cursor-not-allowed"
                  : "bg-[#f5f3ef] text-stone-800 focus:border-indigo-500 focus:bg-white"
              }`}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">三圍尺寸</label>
            <input
              type="text"
              value={modelProfile.measurements}
              onChange={(e) => setModelProfile({ ...modelProfile, measurements: e.target.value })}
              className="w-full text-sm bg-[#f5f3ef] text-stone-800 placeholder:text-stone-400 font-medium border border-stone-300 rounded-lg p-2.5 outline-none focus:border-indigo-500 focus:bg-white"
            />
          </div>
        </div>

        {/* 接案合作模式選項 */}
        <div className="pt-3 border-t border-stone-200 space-y-3">
          <div>
            <label className="block text-xs font-bold text-stone-800">
              💰 接案合作模式 (會同步顯示於大廳下方標籤)
            </label>
            <p className="text-[11px] text-stone-500 mt-0.5">
              勾選您接受的合作形式，或於下方自訂新增專屬合作條款：
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { id: "商業有酬", label: "商業有酬 (有預算商案優先)" },
              { id: "互惠創作 (TFCD)", label: "互惠創作 (TFCD 雙向互免)" },
              { id: "車馬費補貼", label: "車馬費 / 梳化治裝補貼" },
              { id: "棚費平攤", label: "租棚費 / 場地門票雙方平攤" },
            ].map((item) => {
              const isChecked = selectedCoopModes.includes(item.id);
              return (
                <label
                  key={item.id}
                  onClick={() => toggleCoopMode(item.id)}
                  className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition ${
                    isChecked
                      ? "bg-amber-50 border-amber-300 text-amber-900 font-bold"
                      : "bg-[#f5f3ef] border-stone-300 text-stone-700 hover:bg-[#eae7e1] font-medium"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}}
                    className="w-3.5 h-3.5 text-amber-600 rounded"
                  />
                  <span className="text-xs">{item.label}</span>
                </label>
              );
            })}
          </div>

          <div className="space-y-2 pt-1">
            <span className="text-[11px] font-bold text-stone-700 block">
              ✦ 自訂接案模式（開放 2 組空白自填）：
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                value={customCoop1}
                onChange={(e) => setCustomCoop1(e.target.value)}
                placeholder="自訂模式 1 (例：品牌贊助置換、分潤合作)"
                className="w-full text-xs bg-[#f5f3ef] text-stone-800 placeholder:text-stone-400 font-medium border border-stone-300 rounded-lg p-2.5 outline-none focus:border-indigo-500 focus:bg-white"
              />
              <input
                type="text"
                value={customCoop2}
                onChange={(e) => setCustomCoop2(e.target.value)}
                placeholder="自訂模式 2 (例：需提前支付 30% 定金)"
                className="w-full text-xs bg-[#f5f3ef] text-stone-800 placeholder:text-stone-400 font-medium border border-stone-300 rounded-lg p-2.5 outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1.5">
            外拍安全守則：是否攜伴 (親友同行)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { val: "必攜伴 (親友全程陪同)", desc: "外景或首次約拍全程由親友陪同" },
              { val: "可攜伴 (親友同行)", desc: "視外景地點或個人當日狀況決定" },
              { val: "可單獨前往", desc: "信任熟識攝影師或公開場合可單獨作業" },
            ].map((item) => (
              <button
                key={item.val}
                type="button"
                onClick={() => setModelProfile({ ...modelProfile, companionPolicy: item.val })}
                className={`p-3 text-left rounded-xl border transition cursor-pointer ${
                  modelProfile.companionPolicy === item.val
                    ? "bg-indigo-50/90 border-indigo-500 text-indigo-900 shadow-xs"
                    : "bg-[#f5f3ef] border-stone-300 text-stone-700 hover:bg-[#eae7e1]"
                }`}
              >
                <div className="text-xs font-bold">{item.val}</div>
                <div className="text-[10px] text-stone-500 mt-0.5">{item.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">個人主頁詳細介紹 (Bio)</label>
          <textarea
            rows={4}
            value={modelProfile.bio}
            onChange={(e) => setModelProfile({ ...modelProfile, bio: e.target.value })}
            className="w-full text-sm bg-[#f5f3ef] text-stone-800 placeholder:text-stone-400 font-medium border border-stone-300 rounded-lg p-2.5 outline-none focus:border-indigo-500 focus:bg-white leading-relaxed"
          />
        </div>
      </div>

      {/* 風格標籤與接案邊界 */}
      <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-6 shadow-sm space-y-5">
        <h3 className="text-sm font-bold text-stone-800 border-b border-stone-200 pb-2">
          風格標籤與接案邊界 (防騷擾機制)
        </h3>

        <div>
          <label className="block text-xs font-bold text-emerald-800 mb-2">
            🟢 可接拍攝風格標籤
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {styles.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-semibold flex items-center gap-1.5"
              >
                ✓ {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveStyle(tag)}
                  className="text-emerald-600 hover:text-emerald-900 font-bold ml-1 cursor-pointer"
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
              placeholder="新增風格 (例：古風漢服)"
              className="flex-1 text-xs bg-[#f5f3ef] text-stone-800 placeholder:text-stone-400 font-medium border border-stone-300 rounded-lg p-2 outline-none focus:border-indigo-500 focus:bg-white"
            />
            <button
              type="button"
              onClick={handleAddStyle}
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition cursor-pointer"
            >
              新增標籤
            </button>
          </div>
        </div>

        <div className="pt-3 border-t border-stone-200">
          <label className="block text-xs font-bold text-rose-800 mb-2">
            🔴 拍攝禁忌與拒絕尺度 (醒目標註)
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {boundaries.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-rose-50 text-rose-800 border border-rose-300 rounded-lg text-xs font-semibold flex items-center gap-1.5"
              >
                ✕ {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveBoundary(tag)}
                  className="text-rose-600 hover:text-rose-900 font-bold ml-1 cursor-pointer"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2 max-w-sm">
            <input
              type="text"
              value={newBoundaryInput}
              onChange={(e) => setNewBoundaryInput(e.target.value)}
              placeholder="新增禁忌 (例：不拍內衣/睡衣)"
              className="flex-1 text-xs bg-[#f5f3ef] text-stone-800 placeholder:text-stone-400 font-medium border border-stone-300 rounded-lg p-2 outline-none focus:border-indigo-500 focus:bg-white"
            />
            <button
              type="button"
              onClick={handleAddBoundary}
              className="px-3 py-1.5 bg-rose-700 hover:bg-rose-800 text-white rounded-lg text-xs font-bold transition cursor-pointer"
            >
              新增禁忌
            </button>
          </div>
        </div>
      </div>

      {/* 5 組社群連結 */}
      <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-stone-800 border-b border-stone-200 pb-2">
          公開社群與作品連結 (最多 5 組)
        </h3>
        <div className="space-y-3 pt-1">
          <div className="flex items-center gap-3">
            <span className="w-24 text-xs font-bold text-stone-700">📸 Instagram</span>
            <input
              type="url"
              value={socialLinks.instagram}
              onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })}
              className="flex-1 text-xs bg-[#f5f3ef] text-stone-800 border border-stone-300 rounded-lg p-2 outline-none focus:border-indigo-500 focus:bg-white"
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="w-24 text-xs font-bold text-stone-700">📘 Facebook</span>
            <input
              type="url"
              value={socialLinks.facebook}
              onChange={(e) => setSocialLinks({ ...socialLinks, facebook: e.target.value })}
              className="flex-1 text-xs bg-[#f5f3ef] text-stone-800 border border-stone-300 rounded-lg p-2 outline-none focus:border-indigo-500 focus:bg-white"
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="w-24 text-xs font-bold text-stone-700">🧵 Threads (脆)</span>
            <input
              type="url"
              value={socialLinks.threads}
              onChange={(e) => setSocialLinks({ ...socialLinks, threads: e.target.value })}
              className="flex-1 text-xs bg-[#f5f3ef] text-stone-800 border border-stone-300 rounded-lg p-2 outline-none focus:border-indigo-500 focus:bg-white"
            />
          </div>
          <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
            <input
              type="text"
              value={socialLinks.custom1Name}
              onChange={(e) => setSocialLinks({ ...socialLinks, custom1Name: e.target.value })}
              placeholder="自訂標題 1"
              className="w-32 text-xs font-bold bg-[#f5f3ef] text-stone-800 border border-stone-300 rounded-lg p-2 outline-none focus:border-indigo-500"
            />
            <input
              type="url"
              value={socialLinks.custom1Url}
              onChange={(e) => setSocialLinks({ ...socialLinks, custom1Url: e.target.value })}
              placeholder="https://..."
              className="flex-1 text-xs bg-[#f5f3ef] text-stone-800 border border-stone-300 rounded-lg p-2 outline-none focus:border-indigo-500 focus:bg-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={socialLinks.custom2Name}
              onChange={(e) => setSocialLinks({ ...socialLinks, custom2Name: e.target.value })}
              placeholder="自訂標題 2"
              className="w-32 text-xs font-bold bg-[#f5f3ef] text-stone-800 border border-stone-300 rounded-lg p-2 outline-none focus:border-indigo-500"
            />
            <input
              type="url"
              value={socialLinks.custom2Url}
              onChange={(e) => setSocialLinks({ ...socialLinks, custom2Url: e.target.value })}
              placeholder="https://..."
              className="flex-1 text-xs bg-[#f5f3ef] text-stone-800 border border-stone-300 rounded-lg p-2 outline-none focus:border-indigo-500 focus:bg-white"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-xs transition cursor-pointer"
        >
          儲存所有個人簡介、封面位置與設定
        </button>
      </div>
    </form>
  );
}