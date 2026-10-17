"use client";

import React, { useState } from "react";
import { JobPosting, JobApplicant } from "../../types/job";

interface ApplyJobModalProps {
  job: JobPosting;
  currentUser: {
    id: string;
    name: string;
    role: "model" | "photographer";
  };
  onClose: () => void;
  onSubmitApplication: (jobId: string, applicant: JobApplicant) => void;
}

export default function ApplyJobModal({
  job,
  currentUser,
  onClose,
  onSubmitApplication,
}: ApplyJobModalProps) {
  const [pitchNote, setPitchNote] = useState(
    currentUser.role === "photographer"
      ? "您好！我們團隊擅長自然光人像與商業時裝型錄，可自備棚燈器材並保證於 14 日內依約完成精修交件。"
      : "您好！本人身高體重符合型錄需求，有豐富服飾電商拍攝經驗，動作流暢守時敬業，期待能與品牌方合作！"
  );
  const [proposedPrice, setProposedPrice] = useState(job.budget);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newApplicant: JobApplicant = {
      id: `app_${Date.now()}`,
      applicantId: currentUser.id,
      applicantName: currentUser.name,
      applicantRole: currentUser.role,
      avatar:
        currentUser.role === "photographer"
          ? "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?auto=format&fit=crop&w=200&q=80"
          : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      pitchNote,
      proposedPrice,
      appliedAt: new Date().toISOString().slice(5, 16).replace("T", " "),
      status: "pending",
    };

    onSubmitApplication(job.id, newApplicant);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-[#fbfaf8] border border-stone-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-xs"
      >
        <div className="flex justify-between items-center border-b border-stone-200 pb-2">
          <div>
            <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
              <span>🙋</span>
              <span>應徵商案：{job.title}</span>
            </h4>
            <p className="text-[11px] text-stone-500 mt-0.5">
              應徵身分：<strong>{currentUser.name}</strong> ({currentUser.role === "model" ? "模特" : "攝影師"})
            </p>
          </div>
          <button type="button" onClick={onClose} className="text-stone-400 hover:text-stone-600 text-base font-bold cursor-pointer">
            ✕
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block font-bold text-stone-700 mb-1">提案報價 (NT$)</label>
            <input
              type="text"
              required
              value={proposedPrice}
              onChange={(e) => setProposedPrice(e.target.value)}
              className="w-full bg-white text-stone-900 border border-stone-300 rounded-xl p-2.5 outline-none font-bold font-mono focus:border-indigo-600"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">自薦備註與履約優勢</label>
            <textarea
              rows={4}
              required
              value={pitchNote}
              onChange={(e) => setPitchNote(e.target.value)}
              placeholder="說明您的拍攝經驗、交付天數與風格配合度..."
              className="w-full bg-white text-stone-900 border border-stone-300 rounded-xl p-2.5 outline-none focus:border-indigo-600 leading-relaxed"
            />
          </div>

          <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-200 text-indigo-900 text-[11px] leading-relaxed">
            💡 系統將自動向品牌方同步附上您的<strong>「公開作品集、報價單與雙向履約信用評分」</strong>，提升媒合成功率。
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
            確認送出應徵
          </button>
        </div>
      </form>
    </div>
  );
}