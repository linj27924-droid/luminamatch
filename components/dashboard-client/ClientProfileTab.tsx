"use client";

import React from "react";

export interface ClientProfile {
  companyName: string;
  taxId: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  brandWebsite: string;
  brandInstagram: string;
  invoiceTitle: string;
}

interface ClientProfileTabProps {
  profile: ClientProfile;
  setProfile: React.Dispatch<React.SetStateAction<ClientProfile>>;
  onSave: (e: React.FormEvent) => void;
}

export default function ClientProfileTab({ profile, setProfile, onSave }: ClientProfileTabProps) {
  const handleChange = (field: keyof ClientProfile, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={onSave} className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-6 shadow-sm space-y-5 text-xs">
      <div className="border-b border-stone-200 pb-3">
        <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
          <span>🏢</span>
          <span>品牌與企業資料設定</span>
        </h3>
        <p className="text-stone-500 text-[11px] mt-0.5">完善品牌驗證資訊能大幅提升攝影師與模特的應徵意願。</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-bold text-stone-700 mb-1">品牌 / 企業名稱</label>
          <input
            type="text"
            required
            value={profile.companyName}
            onChange={(e) => handleChange("companyName", e.target.value)}
            className="w-full bg-white text-stone-900 border border-stone-300 rounded-xl p-2.5 outline-none focus:border-indigo-600"
          />
        </div>

        <div>
          <label className="block font-bold text-stone-700 mb-1">統一編號 (統編/選填)</label>
          <input
            type="text"
            value={profile.taxId}
            onChange={(e) => handleChange("taxId", e.target.value)}
            placeholder="若需開立三聯式發票請填寫"
            className="w-full bg-white text-stone-900 border border-stone-300 rounded-xl p-2.5 outline-none focus:border-indigo-600 font-mono"
          />
        </div>

        <div>
          <label className="block font-bold text-stone-700 mb-1">窗口聯絡人姓名</label>
          <input
            type="text"
            required
            value={profile.contactPerson}
            onChange={(e) => handleChange("contactPerson", e.target.value)}
            className="w-full bg-white text-stone-900 border border-stone-300 rounded-xl p-2.5 outline-none focus:border-indigo-600"
          />
        </div>

        <div>
          <label className="block font-bold text-stone-700 mb-1">公務聯絡信箱</label>
          <input
            type="email"
            required
            value={profile.contactEmail}
            onChange={(e) => handleChange("contactEmail", e.target.value)}
            className="w-full bg-white text-stone-900 border border-stone-300 rounded-xl p-2.5 outline-none focus:border-indigo-600 font-mono"
          />
        </div>

        <div>
          <label className="block font-bold text-stone-700 mb-1">品牌官方網站</label>
          <input
            type="url"
            value={profile.brandWebsite}
            onChange={(e) => handleChange("brandWebsite", e.target.value)}
            placeholder="https://..."
            className="w-full bg-white text-stone-900 border border-stone-300 rounded-xl p-2.5 outline-none focus:border-indigo-600 font-mono"
          />
        </div>

        <div>
          <label className="block font-bold text-stone-700 mb-1">品牌 Instagram 帳號</label>
          <input
            type="text"
            value={profile.brandInstagram}
            onChange={(e) => handleChange("brandInstagram", e.target.value)}
            placeholder="@yourbrand"
            className="w-full bg-white text-stone-900 border border-stone-300 rounded-xl p-2.5 outline-none focus:border-indigo-600 font-mono"
          />
        </div>
      </div>

      <div className="flex justify-end pt-3 border-t border-stone-200">
        <button
          type="submit"
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition shadow-2xs cursor-pointer"
        >
          儲存企業品牌資料
        </button>
      </div>
    </form>
  );
}