"use client";

import React, { useState, useEffect } from "react";
import ClientProfileTab, { ClientProfile } from "../../../components/dashboard-client/ClientProfileTab";
import JobPostingTab from "../../../components/dashboard-client/JobPostingTab";
import ApplicantReviewTab from "../../../components/dashboard-client/ApplicantReviewTab";
import ClientCollaborationTab from "../../../components/dashboard-client/ClientCollaborationTab";
import { CollaborationProject } from "../../../components/dashboard-photographer/PhotographerCollaborationTab";
import { JobPosting, JobApplicant } from "../../../types/job";

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
    applicants: [
      {
        id: "app_1",
        applicantId: "Alan Chen",
        applicantName: "陳攝影 (Alan Chen)",
        applicantRole: "photographer",
        avatar: "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?auto=format&fit=crop&w=200&q=80",
        pitchNote: "擅長日系微光與俐落時裝街拍，已自備定焦鏡頭與柔光罩，可依合約 14 天內交付高畫質精修！",
        proposedPrice: "NT$ 18,000",
        appliedAt: "2026-10-13 11:20",
        status: "pending",
      },
    ],
  },
];

const DEFAULT_COLLABS: CollaborationProject[] = [
  {
    id: "collab_client_1",
    caseNumber: "COM-20261015-003",
    title: "2026 冬季韓系針織新品型錄 (松山文創)",
    category: "commercial",
    modelName: "羽晴 (Hane) & 陳攝影",
    shootDate: "2026-10-30",
    exactTime: "2026/10/30 (五) 12:45 集合",
    exactLocation: "松山文創園區 2 號倉庫前廣場",
    coordinates: "25.0441, 121.5606",
    coopType: "商業品牌發案",
    remuneration: "NT$ 18,000",
    deliveryDays: 14,
    bankInfo: {
      bankCode: "822",
      bankName: "中國信託",
      accountNumber: "1234-5678-9012",
      accountName: "陳*晴",
    },
    outfits: [
      {
        id: "outfit_c1",
        title: "韓系秋季針織長版毛衣共 6 套",
        description: "品牌方自備服飾與鞋帽，現場由助理整燙",
        image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80",
        modelConfirmed: true,
        photographerConfirmed: true,
        status: "confirmed",
      },
    ],
    checkInStatus: {
      modelCheckedIn: false,
      photographerCheckedIn: false,
    },
    paymentStatus: "deposit_paid",
    status: "confirmed",
    messages: [
      {
        id: "m_c1",
        sender: "photographer",
        senderName: "風格服飾 (Flora Studio)",
        text: "陳攝影、羽晴兩位好！感謝接下本次冬季新品型錄，服裝與當天通告表已上傳，再麻煩確認！",
        timestamp: "10-14 14:00",
      },
    ],
  },
];

export default function ClientDashboardPage() {
  const [activeTab, setActiveTab] = useState<"jobs" | "applicants" | "collab" | "profile">("jobs");
  const [profile, setProfile] = useState<ClientProfile>({
    companyName: "風格服飾品牌 (Flora Studio)",
    taxId: "88776655",
    contactPerson: "林總監",
    contactEmail: "flora.fashion@studio.com",
    contactPhone: "0912-345-678",
    brandWebsite: "https://flora-fashion.com",
    brandInstagram: "@flora_studio_tw",
    invoiceTitle: "風格設計服飾股份有限公司",
  });

  const [jobs, setJobs] = useState<JobPosting[]>(DEFAULT_JOBS);
  const [collabEvents, setCollabEvents] = useState<CollaborationProject[]>(DEFAULT_COLLABS);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("lumina_client_jobs");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) setJobs(parsed);
      }
      const savedCollabs = localStorage.getItem("lumina_client_collabs");
      if (savedCollabs) {
        const parsedCollabs = JSON.parse(savedCollabs);
        if (Array.isArray(parsedCollabs) && parsedCollabs.length > 0) setCollabEvents(parsedCollabs);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const saveJobs = (updated: JobPosting[]) => {
    setJobs(updated);
    localStorage.setItem("lumina_client_jobs", JSON.stringify(updated));
  };

  const saveCollabs = (updated: CollaborationProject[]) => {
    setCollabEvents(updated);
    localStorage.setItem("lumina_client_collabs", JSON.stringify(updated));
  };

  const handleAddJob = (job: JobPosting) => {
    const updated = [job, ...jobs];
    saveJobs(updated);
    alert("🎉 專案需求刊登成功！已同步發布至前台商案發案大廳。");
  };

  const handleDeleteJob = (id: string) => {
    const updated = jobs.filter((j) => j.id !== id);
    saveJobs(updated);
  };

  // 錄用應徵者並直接開闢協作室
  const handleUpdateApplicantStatus = (jobId: string, applicantId: string, status: "hired" | "declined") => {
    const targetJob = jobs.find((j) => j.id === jobId);
    const targetApplicant = targetJob?.applicants.find((a) => a.id === applicantId);

    const updatedJobs = jobs.map((j) => {
      if (j.id !== jobId) return j;
      const updatedApplicants = j.applicants.map((a: JobApplicant) =>
        a.id === applicantId ? { ...a, status } : a
      );
      return { ...j, applicants: updatedApplicants };
    });
    saveJobs(updatedJobs);

    if (status === "hired" && targetJob && targetApplicant) {
      const newCollab: CollaborationProject = {
        id: `collab_${Date.now()}`,
        caseNumber: `COM-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(100 + Math.random() * 900)}`,
        title: targetJob.title,
        category: "commercial",
        modelName: targetApplicant.applicantName,
        shootDate: targetJob.shootDate,
        exactTime: `${targetJob.shootDate} 準時集合`,
        exactLocation: targetJob.location,
        coopType: "商業品牌發案",
        remuneration: targetApplicant.proposedPrice || targetJob.budget,
        deliveryDays: 14,
        bankInfo: {
          bankCode: "822",
          bankName: "中國信託",
          accountNumber: "待創作者提供匯款帳號",
          accountName: targetApplicant.applicantName,
        },
        outfits: [
          {
            id: `outfit_${Date.now()}`,
            title: "品牌方自備服裝與拍攝樣品",
            description: targetJob.description,
            modelConfirmed: true,
            photographerConfirmed: true,
            status: "confirmed",
          },
        ],
        checkInStatus: { modelCheckedIn: false, photographerCheckedIn: false },
        paymentStatus: "unpaid",
        status: "confirmed",
        messages: [
          {
            id: `msg_${Date.now()}`,
            sender: "photographer",
            senderName: profile.companyName,
            text: `您好【${targetApplicant.applicantName}】！我們已正式錄用您參與【${targetJob.title}】，已開闢專屬協作室，歡迎在此確認拍攝細節！`,
            timestamp: "剛剛",
          },
        ],
      };

      const updatedCollabs = [newCollab, ...collabEvents];
      saveCollabs(updatedCollabs);
      setActiveTab("collab");
      alert(`🎉 錄用成功！已自動為您與【${targetApplicant.applicantName}】開闢商案專屬協作室！`);
    }
  };

  const handleSendMessage = (eventId: string, text: string) => {
    const nowStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const updated = collabEvents.map((evt) => {
      if (evt.id !== eventId) return evt;
      const newMsg = {
        id: `msg_${Date.now()}`,
        sender: "photographer" as const,
        senderName: profile.companyName,
        text,
        timestamp: nowStr,
      };
      return { ...evt, messages: [...(evt.messages || []), newMsg] };
    });
    saveCollabs(updated);
  };

  const handleToggleOutfit = (eventId: string, outfitId: string) => {
    const updated = collabEvents.map((evt) => {
      if (evt.id !== eventId) return evt;
      const updatedOutfits = evt.outfits.map((o) =>
        o.id === outfitId ? { ...o, photographerConfirmed: !o.photographerConfirmed } : o
      );
      return { ...evt, outfits: updatedOutfits };
    });
    saveCollabs(updated);
  };

  const handleConfirmDepositPayment = (eventId: string) => {
    const updated = collabEvents.map((evt) =>
      evt.id === eventId ? { ...evt, paymentStatus: "deposit_paid" as const } : evt
    );
    saveCollabs(updated);
    alert("✅ 30% 簽約定金已完成存證！專案已正式鎖定排程。");
  };

  const handleFinalizeProject = (eventId: string) => {
    const confirm = window.confirm("確定要結清尾款並正式結案嗎？");
    if (!confirm) return;
    const updated = collabEvents.map((evt) =>
      evt.id === eventId ? { ...evt, status: "completed" as const } : evt
    );
    saveCollabs(updated);
    alert("🎉 專案已順利結案存證！");
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("lumina_client_profile", JSON.stringify(profile));
    alert("✅ 企業品牌資料已更新儲存！");
  };

  const totalApplicantsCount = jobs.reduce((sum, j) => sum + j.applicants.length, 0);

  return (
    <main className="min-h-[calc(100vh-65px)] bg-stone-100/70 px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* 頂部控制面板 */}
        <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-stone-800">企業品牌發案後台</h2>
            <p className="text-xs text-stone-500 mt-0.5">管理商案招募、審核投遞、履約即時對話與定金存證</p>
          </div>

          <div className="flex bg-[#edeae3]/80 p-1 rounded-xl border border-stone-300">
            <button
              onClick={() => setActiveTab("jobs")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === "jobs" ? "bg-white text-indigo-700 shadow-xs" : "text-stone-600 hover:text-stone-900"
              }`}
            >
              📢 刊登管理 ({jobs.length})
            </button>
            <button
              onClick={() => setActiveTab("applicants")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === "applicants" ? "bg-white text-indigo-700 shadow-xs" : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <span>📥 應徵審查</span>
              {totalApplicantsCount > 0 && (
                <span className="w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] flex items-center justify-center font-bold">
                  {totalApplicantsCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("collab")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                activeTab === "collab" ? "bg-white text-indigo-700 shadow-xs" : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <span>🤝 履約協作室</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === "profile" ? "bg-white text-indigo-700 shadow-xs" : "text-stone-600 hover:text-stone-900"
              }`}
            >
              🏢 企業設定
            </button>
          </div>
        </div>

        {/* 模組分流渲染 */}
        {activeTab === "jobs" && <JobPostingTab jobs={jobs} onAddJob={handleAddJob} onDeleteJob={handleDeleteJob} />}
        {activeTab === "applicants" && <ApplicantReviewTab jobs={jobs} onUpdateApplicantStatus={handleUpdateApplicantStatus} />}
        {activeTab === "collab" && (
          <ClientCollaborationTab
            events={collabEvents}
            clientName={profile.companyName}
            onSendMessage={handleSendMessage}
            onToggleOutfit={handleToggleOutfit}
            onConfirmDepositPayment={handleConfirmDepositPayment}
            onFinalizeProject={handleFinalizeProject}
          />
        )}
        {activeTab === "profile" && <ClientProfileTab profile={profile} setProfile={setProfile} onSave={handleSaveProfile} />}
      </div>
    </main>
  );
}