"use client";

import React, { useState } from "react";
import { JobPosting } from "@/types/job";

interface JobPostingTabProps {
  jobs: JobPosting[];
  onAddJob: (job: JobPosting) => void;
  onDeleteJob: (id: string) => void;
}

export default function JobPostingTab({ jobs, onAddJob, onDeleteJob }: JobPostingTabProps) {
  const [isPostingFormOpen, setIsPostingFormOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<JobPosting["category"]>("apparel");
  const [targetRole, setTargetRole] = useState<JobPosting["targetRole"]>("both");
  const [budget, setBudget] = useState("NT$ 12,000");
  const [shootDate, setShootDate] = useState("2026-11-10");
  const [location, setLocation] = useState("台北市信義區攝影棚");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newJob: JobPosting = {
      id: `job_${Date.now()}`,
      title,
      category,
      targetRole,
      budget,
      shootDate,
      location,
      description,
      moodboardImages: [
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80",
      ],
      status: "open",
      createdAt: new Date().toISOString().slice(0, 10),
      applicants: [],
    };
    onAddJob(newJob);
    setIsPostingFormOpen(false);
    setTitle("");
    setDescription("");
  };

  return (
    <div className="space-y-6 text-xs">
      <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-6 shadow-sm flex justify-between items-center">
        <div>
          <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
            <span>📢</span>
            <span>商案招募刊登中心</span>
          </h3>
          <p className="text-stone-500 text-[11px] mt-0.5">發布專案招募資訊，模特與攝影師即可於商案大廳直接投遞報價與作品。</p>
        </div>
        <button
          type="button"
          onClick={() => setIsPostingFormOpen(!isPostingFormOpen)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition cursor-pointer shadow-2xs"
        >
          {isPostingFormOpen ? "收合表單" : "＋ 發布新商案需求"}
        </button>
      </div>

      {isPostingFormOpen && (
        <form onSubmit={handleSubmit} className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h4 className="font-bold text-stone-900 text-sm border-b border-stone-200 pb-2">填寫專案招募內容</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block font-bold text-stone-700 mb-1">專案主題 / 招募標題</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="例：2026 冬季針織服飾電商棚拍 (急徵模特與商品攝影)"
                className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 outline-none focus:border-indigo-600 text-stone-900 font-medium"
              />
            </div>
            <div>
              <label className="block font-bold text-stone-700 mb-1">專案類別</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 outline-none focus:border-indigo-600"
              >
                <option value="apparel">👗 服飾電商 / 型錄</option>
                <option value="commercial">💼 商業形象 / 形象廣告</option>
                <option value="lookbook">📖 品牌 Lookbook</option>
                <option value="short_video">🎬 社群短影音動態</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-stone-700 mb-1">招募對象需求</label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value as any)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 outline-none focus:border-indigo-600"
              >
                <option value="both">👥 攝影師 + 模特 (整組徵求)</option>
                <option value="model">👩‍🦰 僅徵求模特</option>
                <option value="photographer">📸 僅徵求攝影師</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-stone-700 mb-1">專案預算 (NT$)</label>
              <input
                type="text"
                required
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="例：NT$ 15,000 或 時薪 NT$ 2,500"
                className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 outline-none focus:border-indigo-600 font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-stone-700 mb-1">預計拍攝日期</label>
              <input
                type="date"
                required
                value={shootDate}
                onChange={(e) => setShootDate(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 outline-none focus:border-indigo-600 font-bold font-mono"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block font-bold text-stone-700 mb-1">拍攝地點</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="例：台北市中山區指定攝影棚 (棚費品牌方負擔)"
                className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 outline-none focus:border-indigo-600"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block font-bold text-stone-700 mb-1">需求說明與風格備註</label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="說明預計拍攝套數、交付張數、風格偏好及權利授權範圍..."
                className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 outline-none focus:border-indigo-600 leading-relaxed"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-stone-200">
            <button
              type="button"
              onClick={() => setIsPostingFormOpen(false)}
              className="px-4 py-2 bg-stone-200 text-stone-700 rounded-xl font-bold cursor-pointer hover:bg-stone-300"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition shadow-xs cursor-pointer"
            >
              確認發布至發案大廳
            </button>
          </div>
        </form>
      )}

      {/* 已發布案件列表 */}
      <div className="space-y-3">
        {jobs.length === 0 ? (
          <div className="p-12 text-center bg-[#fbfaf8] border border-dashed border-stone-300 rounded-2xl text-stone-400">
            目前尚未刊登任何專案，點擊右上角立即發布您的第一個商案需求！
          </div>
        ) : (
          jobs.map((job) => (
            <div key={job.id} className="p-4 bg-white border border-stone-200 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-2xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-stone-900 text-sm">{job.title}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {job.targetRole === "both" ? "攝影+模特" : job.targetRole === "model" ? "徵模特" : "徵攝影"}
                  </span>
                </div>
                <p className="text-stone-500 text-[11px]">
                  📅 日期：{job.shootDate} ｜ 📍 地點：{job.location} ｜ 💰 預算：<strong className="text-stone-800">{job.budget}</strong>
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg">
                  {job.applicants.length} 位應徵中
                </span>
                <button
                  type="button"
                  onClick={() => onDeleteJob(job.id)}
                  className="text-stone-400 hover:text-rose-600 text-xs px-2 py-1 transition cursor-pointer"
                >
                  下架刪除
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}