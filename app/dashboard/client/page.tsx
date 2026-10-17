"use client";

import React, { useState, useEffect, useMemo } from "react";
import ClientProfileTab, { ClientProfile } from "../../../components/dashboard-client/ClientProfileTab";
import JobPostingTab from "../../../components/dashboard-client/JobPostingTab";
import ApplicantReviewTab from "../../../components/dashboard-client/ApplicantReviewTab";
import ClientCollaborationTab from "../../../components/dashboard-client/ClientCollaborationTab";
import ClientInvitationTrackerTab from "../../../components/dashboard-client/ClientInvitationTrackerTab";
import ClientContractTemplateTab, { ClientTemplateConfig } from "../../../components/dashboard-client/ClientContractTemplateTab";
import ClientReviewsTab from "../../../components/dashboard-client/ClientReviewsTab";
import IndustryWatchlistTab from "../../../components/reviews/IndustryWatchlistTab";
import ClientBlacklistTab from "../../../components/dashboard-client/ClientBlacklistTab";
import { CollaborationProject } from "../../../components/dashboard-photographer/PhotographerCollaborationTab";
import { JobPosting, JobApplicant } from "../../../types/job";
import { CollaborationInvite } from "../../../types/invitation";

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

const DEFAULT_CLIENT_TEMPLATE: ClientTemplateConfig = {
  contractTitle: "風格品牌商業攝影委託暨肖像授權合約",
  commercialContractBody: `【第一條：商業委託授權與使用範圍】
1. 乙方授權甲方將本次拍攝成品用於品牌官方網站、電商賣場、社群廣告等行銷宣傳，授權期間自結案日起算 1 年。
2. 未經雙方書面同意，甲方不得將照片轉售授權予第三方品牌；乙方個人作品集展示時應標註甲方品牌識別。

【第二條：交件規範與驗收】
1. 攝影師應於拍攝結束後 14 日內上傳雲端毛片，並提供 15 張高畫質精修成品。
2. 品牌方享有 2 次免費局部微調修圖權限。

【第三條：款項給付與放鳥違約規範】
1. 甲方於簽約後 48 小時內給付 30% 定金；拍攝當日完成現場驗收後，於 3 日內結清 70% 尾款。
2. 任一方無正當天災因素於 48 小時內臨時取消，應賠償對方棚費與通告損失 NT$ 3,000 元整。`,
  defaultAcceptMessage: "您好！非常高興能與您合作本次拍攝！通告時間、服裝套數與商案存證合約已確立，請確認通告細節，拍攝當天請提早 10 分鐘抵達現場！",
  defaultDeclineMessage: "感謝您的主動投遞與提案！您的作品風格非常優秀，但由於本期新品風格已有特定人選，本次暫無法配合，期待未來有其他專案時能再次與您合作！",
  usageRightsSummary: "品牌官方網站、電商商城、社群廣告 1 年使用授權",
  depositNoticeNote: "合約確立後 48 小時內由品牌方匯出 30% 定金至受託方專案帳戶",
};

export default function ClientDashboardPage() {
  const [activeTab, setActiveTab] = useState<
    "jobs" | "applicants" | "invitations" | "templates" | "reviews" | "watchlist" | "blacklist" | "collab" | "profile"
  >("jobs");

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

  const [templateConfig, setTemplateConfig] = useState<ClientTemplateConfig>(DEFAULT_CLIENT_TEMPLATE);
  const [jobs, setJobs] = useState<JobPosting[]>(DEFAULT_JOBS);
  const [collabEvents, setCollabEvents] = useState<CollaborationProject[]>(DEFAULT_COLLABS);

  const [invitations, setInvitations] = useState<CollaborationInvite[]>([
    {
      id: "inv_c1",
      senderId: "flora_studio",
      senderName: "風格服飾品牌 (Flora Studio)",
      senderRole: "client",
      recipientId: "hane",
      recipientName: "羽晴 (Hane)",
      recipientRole: "model",
      projectTitle: "2026 冬季針織新品型錄 (松山文創)",
      proposedDate: "2026-10-30",
      proposedBudget: "NT$ 18,000",
      message: "羽晴您好！我們看到您的個人型錄非常契合我們的新品風格，誠摯邀請您參與拍攝！",
      status: "pending",
      createdAt: "2026-10-16 10:00",
      updatedAt: "2026-10-16 10:00",
    },
  ]);

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
      const savedTemplates = localStorage.getItem("lumina_client_contract_templates");
      if (savedTemplates) {
        const parsedT = JSON.parse(savedTemplates);
        setTemplateConfig((prev) => ({ ...prev, ...parsedT }));
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

  const handleSaveTemplates = (newConfig: ClientTemplateConfig) => {
    setTemplateConfig(newConfig);
    localStorage.setItem("lumina_client_contract_templates", JSON.stringify(newConfig));
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
            text: templateConfig.defaultAcceptMessage || `您好【${targetApplicant.applicantName}】！我們已正式錄用您參與【${targetJob.title}】，已開闢專屬協作室，歡迎在此確認拍攝細節！`,
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

  const handleAcceptInvite = (invite: CollaborationInvite) => {
    setInvitations((prev) =>
      prev.map((i) => (i.id === invite.id ? { ...i, status: "accepted" as const } : i))
    );

    const newCollab: CollaborationProject = {
      id: `collab_${Date.now()}`,
      caseNumber: `COM-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(100 + Math.random() * 900)}`,
      title: invite.projectTitle,
      category: "commercial",
      modelName: invite.senderName,
      shootDate: invite.proposedDate,
      exactTime: `${invite.proposedDate} 準時集合`,
      exactLocation: "品牌指定場地或攝影棚",
      coopType: "商業品牌發案",
      remuneration: invite.proposedBudget,
      deliveryDays: 14,
      bankInfo: {
        bankCode: "822",
        bankName: "中國信託",
        accountNumber: "待創作者提供匯款帳號",
        accountName: invite.senderName,
      },
      outfits: [
        {
          id: `outfit_${Date.now()}`,
          title: "品牌方自備服裝與產品樣品",
          description: invite.message,
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
          text: templateConfig.defaultAcceptMessage || `您好【${invite.senderName}】！我們非常欣賞您的提案，專案協作室已正式開闢，歡迎確認通告與需求細節！`,
          timestamp: "剛剛",
        },
      ],
    };

    const updatedCollabs = [newCollab, ...collabEvents];
    saveCollabs(updatedCollabs);
    setActiveTab("collab");
    alert(`🎉 已正式接受【${invite.senderName}】的專案提案！專案已同步建立至「履約協作室」！`);
  };

  const handleDeclineInvite = (inviteId: string) => {
    setInvitations((prev) =>
      prev.map((i) => (i.id === inviteId ? { ...i, status: "declined" as const } : i))
    );
    alert(`已婉拒該提案。已自動附上禮貌留言：「${templateConfig.defaultDeclineMessage}」`);
  };

  const handleCancelSentInvite = (inviteId: string) => {
    setInvitations((prev) => prev.filter((i) => i.id !== inviteId));
    alert("已成功撤回該定向邀約！");
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

  const totalPendingInvitesCount = useMemo(() => {
    const pendingSent = invitations.filter((i) => i.senderRole === "client" && i.status === "pending").length;
    const pendingReceived = invitations.filter((i) => i.recipientRole === "client" && i.status === "pending").length;
    return pendingSent + pendingReceived;
  }, [invitations]);

  return (
    <main className="min-h-[calc(100vh-65px)] bg-stone-100/70 px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-stone-800">企業品牌發案後台</h2>
            <p className="text-xs text-stone-500 mt-0.5">管理商案招募、合約範本、品牌聲譽、同業防雷手札與黑名單防護</p>
          </div>

          <div className="flex flex-wrap bg-[#edeae3]/80 p-1 rounded-xl border border-stone-300">
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
              onClick={() => setActiveTab("invitations")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === "invitations" ? "bg-white text-indigo-700 shadow-xs" : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <span>📫 邀約進度</span>
              {totalPendingInvitesCount > 0 && (
                <span className="w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] flex items-center justify-center font-bold shadow-2xs animate-pulse">
                  {totalPendingInvitesCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("templates")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === "templates" ? "bg-white text-indigo-700 shadow-xs" : "text-stone-600 hover:text-stone-900"
              }`}
            >
              📜 合約範本
            </button>

            {/* 品牌聲譽手札 */}
            <button
              onClick={() => setActiveTab("reviews")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === "reviews" ? "bg-white text-indigo-700 shadow-xs" : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <span>⭐ 品牌聲譽手札</span>
            </button>

            {/* ★ 品牌端：🛡️ 同業防雷手札 ★ */}
            <button
              onClick={() => setActiveTab("watchlist")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === "watchlist" ? "bg-white text-indigo-700 shadow-xs" : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <span>🛡️ 同業防雷手札</span>
            </button>

            {/* 品牌端：🚫 隱形黑名單 */}
            <button
              onClick={() => setActiveTab("blacklist")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === "blacklist" ? "bg-white text-rose-700 shadow-xs" : "text-stone-600 hover:text-stone-900"
              }`}
            >
              🚫 隱形黑名單
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

        {activeTab === "jobs" && <JobPostingTab jobs={jobs} onAddJob={handleAddJob} onDeleteJob={handleDeleteJob} />}
        {activeTab === "applicants" && <ApplicantReviewTab jobs={jobs} onUpdateApplicantStatus={handleUpdateApplicantStatus} />}
        {activeTab === "invitations" && (
          <ClientInvitationTrackerTab
            clientCompanyName={profile.companyName}
            invitations={invitations}
            onAcceptInvite={handleAcceptInvite}
            onDeclineInvite={handleDeclineInvite}
            onCancelSentInvite={handleCancelSentInvite}
          />
        )}
        {activeTab === "templates" && (
          <ClientContractTemplateTab
            config={templateConfig}
            onSave={handleSaveTemplates}
          />
        )}
        {activeTab === "reviews" && (
          <ClientReviewsTab companyName={profile.companyName} />
        )}
        {/* 渲染同業防雷手札 */}
        {activeTab === "watchlist" && (
          <IndustryWatchlistTab
            currentUserRole="client"
            currentUserName={profile.companyName}
          />
        )}
        {activeTab === "blacklist" && <ClientBlacklistTab />}

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