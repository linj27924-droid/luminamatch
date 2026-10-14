"use client";

import React from "react";

export interface PhotographerSocialLinks {
  instagram: string;
  facebook: string;
  threads: string;
  custom1Name: string;
  custom1Url: string;
  custom2Name: string;
  custom2Url: string;
}

export interface PhotographerProfile {
  name: string;
  city: string;
  experienceYears: string;
  deliveryDays: number;
  deliveryMethod?: string;
  rawDeliveryPolicy?: string;
  coopModes?: string[];
  equipment?: string;
  safePromise: string;
  bio: string;
  portfolioImages?: string[];
  coopMode?: string;
}

interface PhotographerProfileTabProps {
  photographerProfile: PhotographerProfile;
  setPhotographerProfile: React.Dispatch<React.SetStateAction<any>>;
  socialLinks: PhotographerSocialLinks;
  setSocialLinks: React.Dispatch<React.SetStateAction<PhotographerSocialLinks>>;
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
  socialLinks,
  setSocialLinks,
  styles,
  newStyleInput,
  setNewStyleInput,
  handleAddStyle,
  handleRemoveStyle,
  handleSaveProfile,
}: PhotographerProfileTabProps) {
  const portfolio = photographerProfile.portfolioImages || [];

  // 切換合作模式複選
  const handleToggleCoopMode = (modeId: string) => {
    const current = photographerProfile.coopModes || [];
    const updated = current.includes(modeId)
      ? current.filter((m) => m !== modeId)
      : [...current, modeId];
    setPhotographerProfile({ ...photographerProfile, coopModes: updated });
  };

  // 更新社群連結
  const handleSocialChange = (field: keyof PhotographerSocialLinks, value: string) => {
    setSocialLinks((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // 上傳作品集圖片（最多 9 張）
  const handleAddPortfolioImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (portfolio.length >= 9) {
      alert("最多僅能上傳 9 張作品集圖片，若需替換請先刪除既有圖片。");
      return;
    }

    const file = files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      const updated = [...portfolio, reader.result as string].slice(0, 9);
      setPhotographerProfile({ ...photographerProfile, portfolioImages: updated });
    };
    reader.readAsDataURL(file);
  };

  // 刪除作品集圖片
  const handleRemovePortfolioImage = (index: number) => {
    const updated = portfolio.filter((_, i) => i !== index);
    setPhotographerProfile({ ...photographerProfile, portfolioImages: updated });
  };

  return (
    <form onSubmit={handleSaveProfile} className="space-y-6">
      {/* 1. 基本資料 */}
      <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-6 shadow-sm space-y-5">
        <h3 className="text-sm font-bold text-stone-800 border-b border-stone-200 pb-2 flex items-center gap-2">
          <span>👤</span>
          <span>攝影師基本資料</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">攝影師姓名 / 帳號稱呼</label>
            <input
              type="text"
              required
              value={photographerProfile.name || ""}
              onChange={(e) => setPhotographerProfile({ ...photographerProfile, name: e.target.value })}
              className="w-full text-sm bg-white text-stone-800 font-medium border border-stone-300 rounded-lg p-2.5 outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">主要接案城市</label>
            <input
              type="text"
              required
              value={photographerProfile.city || ""}
              onChange={(e) => setPhotographerProfile({ ...photographerProfile, city: e.target.value })}
              className="w-full text-sm bg-white text-stone-800 font-medium border border-stone-300 rounded-lg p-2.5 outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">接案年資 (年)</label>
            <input
              type="text"
              value={photographerProfile.experienceYears || ""}
              onChange={(e) => setPhotographerProfile({ ...photographerProfile, experienceYears: e.target.value })}
              className="w-full text-sm bg-white text-stone-800 font-medium border border-stone-300 rounded-lg p-2.5 outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">攝影簡介與美學理念說明 (Bio)</label>
          <textarea
            rows={3}
            value={photographerProfile.bio || ""}
            onChange={(e) => setPhotographerProfile({ ...photographerProfile, bio: e.target.value })}
            placeholder="請分享您的拍攝理念、慣用色調風格與合作注意事項..."
            className="w-full text-sm bg-white text-stone-800 font-medium border border-stone-300 rounded-lg p-2.5 outline-none focus:border-indigo-500 leading-relaxed"
          />
        </div>
      </div>

      {/* ★ 2. 公開社群與外站作品集（5組完整編輯） */}
      <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="border-b border-stone-200 pb-2">
          <h3 className="text-sm font-bold text-stone-800 flex items-center gap-2">
            <span>🌐</span>
            <span>公開社群與外站作品集連結（共 5 組）</span>
          </h3>
          <p className="text-[11px] text-stone-500 mt-0.5">
            填寫後將直接呈現在主頁「公開社群與外站作品集」區塊，訪客點擊可開新分頁瀏覽。
          </p>
        </div>

        <div className="space-y-3 pt-1">
          {/* Instagram */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="w-36 text-xs font-bold text-stone-700 flex items-center gap-1.5 shrink-0">
              <span>📸</span>
              <span>Instagram 專頁</span>
            </span>
            <input
              type="url"
              value={socialLinks.instagram || ""}
              onChange={(e) => handleSocialChange("instagram", e.target.value)}
              placeholder="https://instagram.com/your_username"
              className="flex-1 text-xs bg-white text-stone-800 border border-stone-300 rounded-lg p-2.5 outline-none focus:border-indigo-500"
            />
          </div>

          {/* Facebook */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="w-36 text-xs font-bold text-stone-700 flex items-center gap-1.5 shrink-0">
              <span>📘</span>
              <span>Facebook 粉專 / 個人</span>
            </span>
            <input
              type="url"
              value={socialLinks.facebook || ""}
              onChange={(e) => handleSocialChange("facebook", e.target.value)}
              placeholder="https://facebook.com/your_page"
              className="flex-1 text-xs bg-white text-stone-800 border border-stone-300 rounded-lg p-2.5 outline-none focus:border-indigo-500"
            />
          </div>

          {/* Threads */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="w-36 text-xs font-bold text-stone-700 flex items-center gap-1.5 shrink-0">
              <span>🧵</span>
              <span>Threads 攝影日常</span>
            </span>
            <input
              type="url"
              value={socialLinks.threads || ""}
              onChange={(e) => handleSocialChange("threads", e.target.value)}
              placeholder="https://threads.net/@your_username"
              className="flex-1 text-xs bg-white text-stone-800 border border-stone-300 rounded-lg p-2.5 outline-none focus:border-indigo-500"
            />
          </div>

          {/* 外站作品集 1 */}
          <div className="pt-2 border-t border-stone-200">
            <span className="text-[11px] font-bold text-stone-600 block mb-1.5">🔗 自訂外站作品集 1：</span>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={socialLinks.custom1Name || ""}
                onChange={(e) => handleSocialChange("custom1Name", e.target.value)}
                placeholder="連結按鈕名稱（例：個人作品官網）"
                className="w-full sm:w-44 text-xs font-bold bg-white text-stone-800 border border-stone-300 rounded-lg p-2.5 outline-none focus:border-indigo-500"
              />
              <input
                type="url"
                value={socialLinks.custom1Url || ""}
                onChange={(e) => handleSocialChange("custom1Url", e.target.value)}
                placeholder="https://... 作品官網網址"
                className="flex-1 text-xs bg-white text-stone-800 border border-stone-300 rounded-lg p-2.5 outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* 外站作品集 2 */}
          <div>
            <span className="text-[11px] font-bold text-stone-600 block mb-1.5">🔗 自訂外站作品集 2：</span>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={socialLinks.custom2Name || ""}
                onChange={(e) => handleSocialChange("custom2Name", e.target.value)}
                placeholder="連結按鈕名稱（例：Flickr 高畫質圖庫）"
                className="w-full sm:w-44 text-xs font-bold bg-white text-stone-800 border border-stone-300 rounded-lg p-2.5 outline-none focus:border-indigo-500"
              />
              <input
                type="url"
                value={socialLinks.custom2Url || ""}
                onChange={(e) => handleSocialChange("custom2Url", e.target.value)}
                placeholder="https://... Flickr/500px 網址"
                className="flex-1 text-xs bg-white text-stone-800 border border-stone-300 rounded-lg p-2.5 outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ★ 3. 精選作品集相簿管理（最多 9 張） */}
      <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="border-b border-stone-200 pb-2 flex justify-between items-center">
          <div>
            <h3 className="text-sm font-bold text-stone-800 flex items-center gap-2">
              <span>🖼️</span>
              <span>精選作品集相簿管理 ({portfolio.length} / 9 張)</span>
            </h3>
            <p className="text-[11px] text-stone-500 mt-0.5">
              顯示於公開主頁右側作品集九宮格，訪客點擊可開啟全螢幕檢視大圖。
            </p>
          </div>
          {portfolio.length < 9 && (
            <label className="cursor-pointer px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-xs">
              + 上傳代表作
              <input
                type="file"
                accept="image/*"
                onChange={handleAddPortfolioImage}
                className="hidden"
              />
            </label>
          )}
        </div>

        {portfolio.length === 0 ? (
          <div className="p-8 text-center bg-[#f5f3ef] rounded-xl border border-dashed border-stone-300 text-xs text-stone-400">
            目前尚未上傳作品集圖片，請點擊右上角「+ 上傳代表作」新增相片（最多 9 張）。
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
            {portfolio.map((img, idx) => (
              <div
                key={idx}
                className="relative w-full aspect-square rounded-xl overflow-hidden border border-stone-300 group bg-stone-100 shadow-2xs"
              >
                <img
                  src={img}
                  alt={`作品 ${idx + 1}`}
                  className="w-full h-full object-cover block max-w-full"
                />
                <button
                  type="button"
                  onClick={() => handleRemovePortfolioImage(idx)}
                  className="absolute top-1 right-1 w-5 h-5 bg-rose-600 hover:bg-rose-700 text-white text-[10px] rounded-full flex items-center justify-center font-bold shadow-xs cursor-pointer opacity-85 group-hover:opacity-100 transition"
                  title="刪除此張作品"
                >
                  ✕
                </button>
                <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[8px] font-mono px-1 rounded">
                  #{idx + 1}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. 成品交付條款、合作型態與人身安全承諾 */}
      <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-6 shadow-sm space-y-5">
        <h3 className="text-sm font-bold text-stone-800 border-b border-stone-200 pb-2 flex items-center gap-2">
          <span>📦</span>
          <span>成品交付條款、合作型態與人身安全承諾</span>
        </h3>

        <div>
          <label className="block text-xs font-bold text-stone-700 mb-2">可接受的合作型態 (複選)：</label>
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
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-2xs"
                      : "bg-white text-stone-700 border-stone-300 hover:bg-[#edeae3]"
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
            <label className="block text-xs font-bold text-stone-700 mb-1">
              ⏳ 成品精修交稿承諾天數
            </label>
            <select
              value={photographerProfile.deliveryDays || 14}
              onChange={(e) => setPhotographerProfile({ ...photographerProfile, deliveryDays: Number(e.target.value) })}
              className="w-full text-sm bg-white text-stone-800 font-bold border border-stone-300 rounded-lg p-2.5 outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value={7}>7 天內（急速精修）</option>
              <option value={14}>14 天內（業界標準）</option>
              <option value={21}>21 天內</option>
              <option value={30}>30 天內</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              📷 毛片交付政策
            </label>
            <select
              value={photographerProfile.rawDeliveryPolicy || "all_jpg"}
              onChange={(e) => setPhotographerProfile({ ...photographerProfile, rawDeliveryPolicy: e.target.value })}
              className="w-full text-sm bg-white text-stone-800 font-medium border border-stone-300 rounded-lg p-2.5 outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="all_jpg">全數交付過濾後毛片 (JPG)</option>
              <option value="select_only">僅供線上挑選，不全給毛片</option>
              <option value="no_raw">僅給予約定精修張數 (毛片不外流)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              ☁️ 交件管道
            </label>
            <input
              type="text"
              value={photographerProfile.deliveryMethod || ""}
              onChange={(e) => setPhotographerProfile({ ...photographerProfile, deliveryMethod: e.target.value })}
              placeholder="例：Google Drive 雲端連結 / 專屬 NAS"
              className="w-full text-sm bg-white text-stone-800 font-medium border border-stone-300 rounded-lg p-2.5 outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              📷 慣用相機機身與燈光設備 (Equipment)
            </label>
            <input
              type="text"
              value={photographerProfile.equipment || ""}
              onChange={(e) => setPhotographerProfile({ ...photographerProfile, equipment: e.target.value })}
              placeholder="例：Sony A7 系列 / 神牛外拍閃燈 / 柔光罩"
              className="w-full text-sm bg-white text-stone-800 font-medium border border-stone-300 rounded-lg p-2.5 outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              🛡️ 人身安全與現場規範承諾
            </label>
            <input
              type="text"
              value={photographerProfile.safePromise || ""}
              onChange={(e) => setPhotographerProfile({ ...photographerProfile, safePromise: e.target.value })}
              placeholder="例：零肢體接觸口頭引導 / 備女性助理 / 歡迎親友同行"
              className="w-full text-sm bg-white text-stone-800 font-medium border border-stone-300 rounded-lg p-2.5 outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* 5. 擅長拍攝風格標籤管理 */}
      <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-stone-800 border-b border-stone-200 pb-2 flex items-center gap-2">
          <span>🏷️</span>
          <span>擅長拍攝風格標籤</span>
        </h3>
        <div className="flex flex-wrap gap-2 mb-3">
          {styles.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs"
            >
              ✓ {tag}
              <button
                type="button"
                onClick={() => handleRemoveStyle(tag)}
                className="text-indigo-400 hover:text-rose-600 font-bold ml-1 cursor-pointer"
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
            className="flex-1 text-xs bg-white text-stone-800 font-medium border border-stone-300 rounded-lg p-2 outline-none focus:border-indigo-500"
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

      {/* 底部儲存按鈕 */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
        >
          儲存攝影師資料設定
        </button>
      </div>
    </form>
  );
}