"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import JobCard from "../../components/jobs/JobCard";
import ApplyJobModal from "../../components/jobs/ApplyJobModal";
import { JobPosting, JobApplicant } from "../../types/job";

const DEFAULT_JOBS: JobPosting[] = [
  {
    id: "job_1",
    title: "2026 冬季韓系針織新品型錄 (松山文創)",
    category: "apparel",
    targetRole: "both",
    budget: "NT$ 18,000",
    shootDate: "2026-10-30",
    location: "松山文創園區 2 號倉庫前廣場",
    description: "品牌方自備服飾共 6 套，需風格自然光人像攝影師與韓系清新模特各一位，含 15 張風格精修調色。",
    moodboardImages: ["https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80"],
    status: "open",
    createdAt: "2026-10-12",
    applicants: [],
  },
  {
    id: "job_2",
    title: "極簡極白底電商時裝飾品拍攝 (急徵攝影師)",
    category: "commercial",
    targetRole: "photographer",
    budget: "NT$ 10,000",
    shootDate: "2026-11-04",
    location: "新北市板橋區商業攝影棚",
    description: "需熟悉商業棚燈打光，拍攝純白底去背圖與細節微距特寫，需於 7 天內交付高畫質圖檔。",
    moodboardImages: ["https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80"],
    status: "open",
    createdAt: "2026-10-14",
    applicants: [],
  },
];

export default function JobsHallPage() {
  const [jobs, setJobs] = useState<JobPosting[]>(DEFAULT_JOBS);
  const [filterRole, setFilterRole] = useState<"all" | "model" | "photographer">("all");
  const [selectedJobToApply, setSelectedJobToApply] = useState<JobPosting | null>(null);

  // 當前使用者身分
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    name: string;
    role: "model" | "photographer" | "client" | "guest";
  }>({
    id: "hane",
    name: "羽晴 (Hane)",
    role: "model",
  });

  useEffect(() => {
    // 讀取當前登入者
    const savedUser = localStorage.getItem("lumina_mock_user");
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        setCurrentUser({
          id: u.id || "guest",
          name: u.name || "訪客",
          role: u.role || "guest",
        });
      } catch (e) {
        console.error(e);
      }
    }

    // 讀取業主最新刊登案件
    const savedJobs = localStorage.getItem("lumina_client_jobs");
    if (savedJobs) {
      try {
        const parsed = JSON.parse(savedJobs);
        if (Array.isArray(parsed) && parsed.length > 0) setJobs(parsed);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleApply = (job: JobPosting) => {
    setSelectedJobToApply(job);
  };

  const handleSubmitApplication = (jobId: string, applicant: JobApplicant) => {
    const updated = jobs.map((j) => {
      if (j.id !== jobId) return j;
      return { ...j, applicants: [applicant, ...j.applicants] };
    });
    setJobs(updated);
    localStorage.setItem("lumina_client_jobs", JSON.stringify(updated));
    alert("🎉 應徵提案已成功送出！品牌業主將於後台收到您的自薦與報價單。");
  };

  const filteredJobs = jobs.filter((j) => {
    if (filterRole === "all") return true;
    return j.targetRole === "both" || j.targetRole === filterRole;
  });

  return (
    <main className="min-h-[calc(100vh-65px)] bg-stone-100/70 px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* 頂部 Banner */}
        <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">💼</span>
              <h2 className="text-xl font-bold text-stone-900">商業發案與招募大廳</h2>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              由品牌業主直接發案，提供透明預算、簽署存證合約與定金保障機制。
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-500 font-medium">
              當前身分：<strong>{currentUser.name}</strong> ({currentUser.role === "model" ? "模特" : currentUser.role === "photographer" ? "攝影師" : currentUser.role === "client" ? "業主" : "訪客"})
            </span>
          </div>
        </div>

        {/* 篩選標籤 */}
        <div className="flex gap-2 text-xs font-bold">
          {(
            [
              { id: "all", label: "全部商案" },
              { id: "model", label: "👩‍🦰 徵求模特" },
              { id: "photographer", label: "📸 徵求攝影師" },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setFilterRole(t.id)}
              className={`px-3.5 py-1.5 rounded-xl border transition cursor-pointer ${
                filterRole === t.id
                  ? "bg-stone-900 text-white border-stone-900 shadow-2xs"
                  : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* 案件列表 */}
        <div className="space-y-4">
          {filteredJobs.length === 0 ? (
            <div className="p-12 text-center bg-[#fbfaf8] border border-dashed border-stone-300 rounded-2xl text-xs text-stone-400">
              目前該分類暫無招募中的商業案件。
            </div>
          ) : (
            filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onApply={handleApply}
                currentUserRole={currentUser.role}
              />
            ))
          )}
        </div>
      </div>

      {/* 應徵彈窗 */}
      {selectedJobToApply && currentUser.role !== "guest" && currentUser.role !== "client" && (
        <ApplyJobModal
          job={selectedJobToApply}
          currentUser={{
            id: currentUser.id,
            name: currentUser.name,
            role: currentUser.role,
          }}
          onClose={() => setSelectedJobToApply(null)}
          onSubmitApplication={handleSubmitApplication}
        />
      )}
    </main>
  );
}