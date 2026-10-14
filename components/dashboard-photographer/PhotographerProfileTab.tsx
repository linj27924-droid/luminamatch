"use client";

import React from "react";

export interface PhotographerProfile {
  name: string;
  city: string;
  experienceYears: string;
  deliveryDays: number;
  deliveryMethod?: string; // 交件管道 (例如：Google Drive / 雲端硬碟 / NAS)
  rawDeliveryPolicy?: string; // 毛片交付政策
  coopModes?: string[]; // 接受的合作模式複選 (互惠/付費模特/商案)
  equipment?: string; // 慣用相機機身與燈光設備
  instagram?: string; // Instagram 或作品集網站連結
  safePromise: string;
  bio: string;
  coopMode?: string; // 保留相容舊有欄位
}

interface PhotographerProfileTabProps {
  photographerProfile: PhotographerProfile;
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
  // 切換合作模式複選標籤
  const handleToggleCoopMode = (modeId: string) => {
    const current = photographerProfile.coopModes || [];
    const updated = current.includes(modeId)
      ? current.filter((m) => m !== modeId)
      : [...current, modeId];
    setPhotographerProfile({ ...photographerProfile, coopModes: updated });
  };

  return (
    <form onSubmit={handleSaveProfile} className="space-y-6">
      {/* 1. 基本資料與社群連結 */}
      <div className="bg-[#fbfaf8] border border-[#e8e2d8] rounded-2xl p-6 shadow-xs space-y-5">
        <h3 className="text-sm font-bold text-[#2e2620] border-b border-[#eee8de] pb-2 flex items-center gap-2">
          <span>👤</span>
          <span>攝影師基本資料與社群作品</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#4a3f35] mb-1">攝影師姓名 / 帳號稱呼</label>
            <input
              type="text"
              required
              value={photographerProfile.name || ""}
              onChange={(e) => setPhotographerProfile({ ...photographerProfile, name: e.target.value })}
              className="w-full text-sm bg-white text-[#2e2620] font-medium border border-[#ded7ca] rounded-lg p-2.5 outline-none focus:border-[#9c7c64]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#4a3f35] mb-1">主要接案城市</label>
            <input
              type="text"
              required
              value={photographerProfile.city || ""}
              onChange={(e) => setPhotographerProfile({ ...photographerProfile, city: e.target.value })}
              className="w-full text-sm bg-white text-[#2e2620] font-medium border border-[#ded7ca] rounded-lg p-2.5 outline-none focus:border-[#9c7c64]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#4a3f35] mb-1">接案年資 (年)</label>
            <input
              type="text"
              value={photographerProfile.experienceYears || ""}
              onChange={(e) => setPhotographerProfile({ ...photographerProfile, experienceYears: e.target.value })}
              className="w-full text-sm bg-white text-[#2e2620] font-medium border border-[#ded7ca] rounded-lg p-2.5 outline-none focus:border-[#9c7c64]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#4a3f35] mb-1">Instagram / 作品集連結</label>
            <input
              type="text"
              value={photographerProfile.instagram || ""}
              onChange={(e) => setPhotographerProfile({ ...photographerProfile, instagram: e.target.value })}
              placeholder="@username 或作品集網址"
              className="w-full text-sm bg-white text-[#2e2620] font-medium border border-[#ded7ca] rounded-lg p-2.5 outline-none focus:border-[#9c7c64]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#4a3f35] mb-1">攝影簡介與作品風格說明 (Bio)</label>
          <textarea
            rows={3}
            value={photographerProfile.bio || ""}
            onChange={(e) => setPhotographerProfile({ ...photographerProfile, bio: e.target.value })}
            placeholder="請分享您的拍攝理念、慣用美學風格（例如：日系空氣感、膠卷復古、歐美俐落風格）與合作注意事項..."
            className="w-full text-sm bg-white text-[#2e2620] font-medium border border-[#ded7ca] rounded-lg p-2.5 outline-none focus:border-[#9c7c64] leading-relaxed"
          />
        </div>
      </div>

      {/* 2. 成品交付條款、合作模式與安全承諾 */}
      <div className="bg-[#fbfaf8] border border-[#e8e2d8] rounded-2xl p-6 shadow-xs space-y-5">
        <h3 className="text-sm font-bold text-[#2e2620] border-b border-[#eee8de] pb-2 flex items-center gap-2">
          <span>📦</span>
          <span>成品交付條款、合作型態與人身安全承諾</span>
        </h3>

        {/* 合作模式複選 */}
        <div>
          <label className="block text-xs font-bold text-[#4a3f35] mb-2">可接受的合作型態 (複選)：</label>
          <div className="flex flex-wrap gap-2.5">
            {[
              { id: "tfcd", label: "🤝 互惠創作 (TFCD)" },
              { id: "paid_model", label: "💵 付費聘請模特" },
              { id: "commercial", label: "💼 商業 / 品牌委託案" },
              { id: "studio_share", label: "🏛️ 攝影棚 / 門票費用平分" },
            ].map((item) => {
              const active = (photographerProfile.coopModes || []).includes(item.id);
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => handleToggleCoopMode(item.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                    active
                      ? "bg-[#2e2620] text-[#f7f5f0] border-[#2e2620] shadow-2xs"
                      : "bg-white text-[#706458] border-[#ded7ca] hover:bg-[#ede8df]"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#4a3f35] mb-1">
              ⏳ 成品精修承諾交稿天數
            </label>
            <select
              value={photographerProfile.deliveryDays || 14}
              onChange={(e) => setPhotographerProfile({ ...photographerProfile, deliveryDays: Number(e.target.value) })}
              className="w-full text-sm bg-white text-[#2e2620] font-bold border border-[#ded7ca] rounded-lg p-2.5 outline-none focus:border-[#9c7c64] cursor-pointer"
            >
              <option value={7}>7 天內（急速精修）</option>
              <option value={14}>14 天內（業界標準）</option>
              <option value={21}>21 天內</option>
              <option value={30}>30 天內</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4a3f35] mb-1">
              📷 毛片交付政策
            </label>
            <select
              value={photographerProfile.rawDeliveryPolicy || "all_jpg"}
              onChange={(e) => setPhotographerProfile({ ...photographerProfile, rawDeliveryPolicy: e.target.value })}
              className="w-full text-sm bg-white text-[#2e2620] font-medium border border-[#ded7ca] rounded-lg p-2.5 outline-none focus:border-[#9c7c64] cursor-pointer"
            >
              <option value="all_jpg">全數交付過濾後毛片 (JPG)</option>
              <option value="select_only">僅供線上挑選，不全給毛片</option>
              <option value="no_raw">僅給予約定精修張數 (毛片不外流)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4a3f35] mb-1">
              ☁️ 交件管道
            </label>
            <input
              type="text"
              value={photographerProfile.deliveryMethod || ""}
              onChange={(e) => setPhotographerProfile({ ...photographerProfile, deliveryMethod: e.target.value })}
              placeholder="例：Google Drive 雲端連結 / 專屬 NAS"
              className="w-full text-sm bg-white text-[#2e2620] font-medium border border-[#ded7ca] rounded-lg p-2.5 outline-none focus:border-[#9c7c64]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#4a3f35] mb-1">
              📷 慣用相機機身與燈光設備 (Equipment)
            </label>
            <input
              type="text"
              value={photographerProfile.equipment || ""}
              onChange={(e) => setPhotographerProfile({ ...photographerProfile, equipment: e.target.value })}
              placeholder="例：Sony A7 系列 / 神牛 AD 外拍閃燈 / 柔光罩"
              className="w-full text-sm bg-white text-[#2e2620] font-medium border border-[#ded7ca] rounded-lg p-2.5 outline-none focus:border-[#9c7c64]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4a3f35] mb-1">
              🛡️ 人身安全與現場規範承諾
            </label>
            <input
              type="text"
              value={photographerProfile.safePromise || ""}
              onChange={(e) => setPhotographerProfile({ ...photographerProfile, safePromise: e.target.value })}
              placeholder="例：零肢體接觸口頭引導 / 歡迎親友同行 / 女性助理隨行"
              className="w-full text-sm bg-white text-[#2e2620] font-medium border border-[#ded7ca] rounded-lg p-2.5 outline-none focus:border-[#9c7c64]"
            />
          </div>
        </div>
      </div>

      {/* 3. 擅長拍攝風格標籤管理 */}
      <div className="bg-[#fbfaf8] border border-[#e8e2d8] rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-[#2e2620] border-b border-[#eee8de] pb-2 flex items-center gap-2">
          <span>🏷️</span>
          <span>擅長拍攝風格標籤</span>
        </h3>
        <div className="flex flex-wrap gap-2 mb-3">
          {styles.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-[#ede8df] text-[#2e2620] border border-[#ded7ca] rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs"
            >
              ✓ {tag}
              <button
                type="button"
                onClick={() => handleRemoveStyle(tag)}
                className="text-[#8c7d6e] hover:text-[#a84d4d] font-bold ml-1 cursor-pointer"
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
            placeholder="新增風格 (例：日系清透 / 街頭膠卷)"
            className="flex-1 text-xs bg-white text-[#2e2620] font-medium border border-[#ded7ca] rounded-lg p-2 outline-none focus:border-[#9c7c64]"
          />
          <button
            type="button"
            onClick={handleAddStyle}
            className="px-3.5 py-1.5 bg-[#2e2620] hover:bg-[#453a32] text-[#f8f6f2] rounded-lg text-xs font-bold transition cursor-pointer"
          >
            新增標籤
          </button>
        </div>
      </div>

      {/* 底部儲存按鈕 */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-6 py-2.5 bg-[#2e2620] hover:bg-[#453a32] text-[#f8f6f2] text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
        >
          儲存攝影師資料設定
        </button>
      </div>
    </form>
  );
}