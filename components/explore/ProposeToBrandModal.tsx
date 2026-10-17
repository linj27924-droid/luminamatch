"use client";

import React, { useState } from "react";
import { BrandItem } from "./BrandCard";
import { CollaborationInvite } from "../../types/invitation";

interface ProposeToBrandModalProps {
  brand: BrandItem;
  currentUser: {
    id: string;
    name: string;
    role: "model" | "photographer";
  };
  onClose: () => void;
  onSubmitSuccess: (newInvite: CollaborationInvite) => void;
}

export default function ProposeToBrandModal({
  brand,
  currentUser,
  onClose,
  onSubmitSuccess,
}: ProposeToBrandModalProps) {
  const isModel = currentUser.role === "model";

  const [projectTitle, setProjectTitle] = useState(
    isModel
      ? "2026 冬季新品穿搭開箱與社群形象代言提案"
      : "品牌 Lookbook 形象視覺企劃與棚拍提案"
  );
  const [proposedDate, setProposedDate] = useState("2026-11-15");
  const [proposedBudget, setProposedBudget] = useState(isModel ? "NT$ 12,000" : "NT$ 20,000");
  const [proposalPitch, setProposalPitch] = useState(
    isModel
      ? "林總監您好！非常喜愛貴品牌的風格與剪裁，我的個人風格以日系微光清新為主，期待能由貴品牌提供新品服裝，自備攝影師拍攝 6 組高畫質形象照與 1 則社群短影音宣傳！"
      : "林總監您好！看過貴品牌的新品形象，我擅長商業棚燈打光與自然光氛圍調色，可自備定焦鏡與大稻埕復古棚景，保證於拍攝後 14 日內依約完成精修交件！"
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newInvite: CollaborationInvite = {
      id: `inv_prop_${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      recipientId: brand.id,
      recipientName: brand.name,
      recipientRole: "client",
      projectTitle,
      proposedDate,
      proposedBudget,
      message: proposalPitch,
      status: "pending",
      createdAt: new Date().toISOString().slice(5, 16).replace("T", " "),
      updatedAt: new Date().toISOString().slice(5, 16).replace("T", " "),
    };

    // 寫入本地存證與品牌端邀約庫
    try {
      const savedClientInvites = localStorage.getItem("lumina_client_invitations");
      const list = savedClientInvites ? JSON.parse(savedClientInvites) : [];
      localStorage.setItem("lumina_client_invitations", JSON.stringify([newInvite, ...list]));
    } catch (err) {
      console.error(err);
    }

    onSubmitSuccess(newInvite);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-[#fbfaf8] border border-stone-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-xs"
      >
        <div className="flex justify-between items-center border-b border-stone-200 pb-2.5">
          <div>
            <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
              <span>💼</span>
              <span>向【{brand.name}】提出客製商業合作提案</span>
            </h4>
            <p className="text-[11px] text-stone-500 mt-0.5">
              提案創作者：<strong>{currentUser.name}</strong> ({isModel ? "👩‍🦰 模特" : "📸 攝影師"})
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 text-base font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block font-bold text-stone-700 mb-1">
              專案主題 / 企劃名稱 <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              required
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              className="w-full bg-white text-stone-900 border border-stone-300 rounded-xl p-2.5 outline-none font-semibold focus:border-indigo-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-700 mb-1">
                提議預算 (NT$) <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                required
                value={proposedBudget}
                onChange={(e) => setProposedBudget(e.target.value)}
                className="w-full bg-white text-stone-900 border border-stone-300 rounded-xl p-2.5 outline-none font-bold font-mono focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">
                提議拍攝日期 <span className="text-rose-600">*</span>
              </label>
              <input
                type="date"
                required
                value={proposedDate}
                onChange={(e) => setProposedDate(e.target.value)}
                className="w-full bg-white text-stone-900 border border-stone-300 rounded-xl p-2.5 outline-none font-bold font-mono focus:border-indigo-600"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">
              提案企劃構想與可交付內容 <span className="text-rose-600">*</span>
            </label>
            <textarea
              rows={4}
              required
              value={proposalPitch}
              onChange={(e) => setProposalPitch(e.target.value)}
              placeholder="說明您規劃的風格、場景、交件張數或社群導流優勢..."
              className="w-full bg-white text-stone-900 border border-stone-300 rounded-xl p-2.5 outline-none focus:border-indigo-600 leading-relaxed font-medium"
            />
          </div>

          <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-200 text-indigo-900 text-[11px] leading-relaxed">
            💡 送出後，此提案將直接進入該品牌的<strong>「📫 邀約進度 ➔ 創作者商業提案」</strong>審核牆，雙方同意後將自動成立存證協作室。
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-stone-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-stone-200 text-stone-700 rounded-xl font-bold hover:bg-stone-300 cursor-pointer"
          >
            取消
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition shadow-xs cursor-pointer"
          >
            確認送出商業提案
          </button>
        </div>
      </form>
    </div>
  );
}