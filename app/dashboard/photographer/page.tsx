"use client";

import React, { useState, useEffect, useMemo } from "react";
import PhotographerProfileTab, { PhotographerSocialLinks } from "../../../components/dashboard-photographer/PhotographerProfileTab";
import ProposalTemplateTab from "../../../components/dashboard-photographer/ProposalTemplateTab";
import PhotographerReviewsTab, { PhotographerReceivedReview } from "../../../components/dashboard-photographer/PhotographerReviewsTab";
import PhotographerRateCardTab, { RateCardRequestItem, ModelRateCardResponseItem } from "../../../components/dashboard-photographer/PhotographerRateCardTab";
import CommercialContractTab, { DEFAULT_COMMERCIAL_CONTRACT } from "../../../components/dashboard-photographer/CommercialContractTab";
import PhotographerCollaborationTab, { CollaborationProject } from "../../../components/dashboard-photographer/PhotographerCollaborationTab";
import PhotographerScheduleTab from "../../../components/dashboard-photographer/PhotographerScheduleTab";
import ReviewsManagerTab from "../../../components/reviews/ReviewsManagerTab";
import PhotographerInvitationTrackerTab from "../../../components/dashboard-photographer/PhotographerInvitationTrackerTab";
import { CollaborationInvite } from "../../../types/invitation";

const DEFAULT_PROJECTS: CollaborationProject[] = [
  {
    id: "collab_1",
    caseNumber: "INV-20261015-001",
    title: "大稻埕復古街拍與旗袍專案",
    category: "invite",
    modelName: "羽晴 (Hane)",
    shootDate: "2026-10-18",
    exactTime: "2026/10/18 (日) 13:50 集合",
    exactLocation: "大稻埕碼頭 5 號水門貨櫃市集入口",
    coordinates: "25.0569, 121.5074",
    coopType: "邀約拍攝 (自費聘請)",
    remuneration: "NT$ 6,000",
    deliveryDays: 14,
    bankInfo: {
      bankCode: "822",
      bankName: "中國信託",
      accountNumber: "1234-5678-9012",
      accountName: "陳*晴",
    },
    outfits: [
      {
        id: "outfit_1",
        title: "酒紅色刺繡旗袍",
        description: "復古珍珠耳環、自備黑色摺扇與低跟鞋",
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80",
        modelConfirmed: true,
        photographerConfirmed: true,
        status: "confirmed",
      },
    ],
    checkInStatus: {
      modelCheckedIn: true,
      modelCheckInTime: "13:50",
      photographerCheckedIn: false,
    },
    paymentStatus: "deposit_paid",
    status: "confirmed",
    paymentNotice: {
      bankName: "國泰世華 (013)",
      lastFiveDigits: "88621",
      amount: 3000,
      noticeTime: "10-14 15:30",
      isModelConfirmed: true,
    },
    messages: [
      {
        id: "m_1",
        sender: "model",
        senderName: "羽晴 (Hane)",
        text: "陳攝影您好！已上傳這次挑選的旗袍參考照，再麻煩您確認光線與色調是否合適！",
        timestamp: "14:20",
      },
      {
        id: "m_2",
        sender: "photographer",
        senderName: "陳攝影 (Alan Chen)",
        text: "看過照片了，暗紅絲絨質感非常符合當天迪化街老街景，當天我會自備暖色柔光罩！",
        timestamp: "14:35",
      },
    ],
  },
  {
    id: "collab_2",
    caseNumber: "TFC-20261015-002",
    title: "秋季自然光時裝外拍",
    category: "tfcd",
    modelName: "米娜 (Mina)",
    shootDate: "2026-10-24",
    exactTime: "2026/10/24 (六) 09:50 集合",
    exactLocation: "台北市立美術館正門戶外廣場",
    coordinates: "25.0722, 121.5248",
    coopType: "互惠拍攝 (TFCD)",
    remuneration: "互惠免支付",
    deliveryDays: 14,
    bankInfo: {
      bankCode: "822",
      bankName: "中國信託",
      accountNumber: "1234-5678-9012",
      accountName: "陳*晴",
    },
    outfits: [
      {
        id: "outfit_2",
        title: "秋季長版風衣套裝",
        description: "米白色大衣 + 棕色短靴，微風自然飄逸感",
        modelConfirmed: true,
        photographerConfirmed: false,
        status: "pending",
      },
    ],
    checkInStatus: {
      modelCheckedIn: false,
      photographerCheckedIn: false,
    },
    paymentStatus: "unpaid",
    status: "confirmed",
    revisionNotice: {
      requestCount: 1,
      notes: "已將初剪毛片上傳雲端，精選 15 張調色為日系微光風，待確認後交付高畫質檔。",
      noticeTime: "10-14 10:00",
    },
    messages: [],
  },
  {
    id: "collab_3",
    caseNumber: "COM-20261015-003",
    title: "韓系時裝品牌型錄委託案",
    category: "commercial",
    modelName: "晴晴 (Ching)",
    shootDate: "2026-10-30",
    exactTime: "2026/10/30 (五) 12:45 集合",
    exactLocation: "松山文創園區 2 號倉庫前廣場",
    coordinates: "25.0441, 121.5606",
    coopType: "商案拍攝 (商業受託)",
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
        id: "outfit_3",
        title: "韓系秋季針織新品共 6 套",
        description: "品牌方自備服飾與搭配鞋帽",
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
    invoiceNotice: {
      invoiceType: "deposit",
      amount: 5400,
      noticeTime: "10-13 11:20",
    },
    messages: [],
  },
];

export default function PhotographerDashboardPage() {
  const [activeTab, setActiveTab] = useState<
    "profile" | "invitations" | "rate_card" | "collab" | "schedule" | "contract" | "template" | "reviews_manager" | "reviews"
  >("profile");

  const [photographerProfile, setPhotographerProfile] = useState({
    name: "陳攝影 (Alan Chen)",
    city: "台北 / 新北",
    experienceYears: "5",
    deliveryDays: 14,
    deliveryMethod: "Google Drive 雲端連結",
    rawDeliveryPolicy: "all_jpg",
    coopModes: ["tfcd", "paid_model"],
    equipment: "Sony A7 系列 / 神牛外拍閃燈 / 柔光罩",
    safePromise: "零接觸肢體引導 / 備女性助理 / 歡迎親友陪同",
    bio: "熱愛日系膠卷復古與自然光人像，守時守信，嚴格遵守拍攝界線存證合約。",
    portfolioImages: [
      "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    ],
    coopMode: "互惠/商案皆可",
  });

  const [socialLinks, setSocialLinks] = useState<PhotographerSocialLinks>({
    instagram: "https://instagram.com/alan_photostudio",
    facebook: "https://facebook.com/alan.chen.visual",
    threads: "https://threads.net/@alan_photostudio",
    custom1Name: "個人作品官網",
    custom1Url: "https://alan-chen-photo.com",
    custom2Name: "Flickr 高畫質圖庫",
    custom2Url: "https://flickr.com/people/alan_chen",
  });

  const [styles, setStyles] = useState(["日系膠卷清新", "俐落時裝街拍", "自然光人像"]);
  const [newStyleInput, setNewStyleInput] = useState("");

  const [rateCardImages, setRateCardImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1554415707-9e4466bfe03b?auto=format&fit=crop&w=800&q=80",
  ]);
  const [rateCardAccessMode, setRateCardAccessMode] = useState<"auto" | "require_approval">("require_approval");

  const [incomingRequests, setIncomingRequests] = useState<RateCardRequestItem[]>([
    {
      id: "req_m1",
      applicantId: "hane",
      applicantName: "模特 羽晴 (Hane)",
      applicantRole: "model",
      requestTime: "2026-10-14 16:30",
      status: "pending",
    },
    {
      id: "req_c1",
      applicantName: "風格服飾品牌 (Flora Studio)",
      applicantRole: "client",
      requestTime: "2026-10-12 11:20",
      status: "approved",
      expiresLabel: "有效至 11/12",
    },
  ]);

  const [outgoingRequests, setOutgoingRequests] = useState<ModelRateCardResponseItem[]>([
    {
      id: "out_1",
      modelId: "hane",
      modelName: "羽晴 (Hane)",
      requestTime: "2026-10-13 14:00",
      status: "approved",
      expiresLabel: "剩餘 6 天",
    },
    {
      id: "out_2",
      modelId: "mina",
      modelName: "米娜 (Mina)",
      requestTime: "2026-10-14 09:15",
      status: "pending",
    },
  ]);

  // ==================== ★ 新增：邀約進度資料 ★ ====================
  const [invitations, setInvitations] = useState<CollaborationInvite[]>([
    {
      id: "inv_p1",
      senderId: "Alan Chen",
      senderName: "陳攝影 (Alan Chen)",
      senderRole: "photographer",
      recipientId: "mina",
      recipientName: "米娜 (Mina)",
      recipientRole: "model",
      projectTitle: "北美館秋季極簡時裝創作",
      proposedDate: "2026-11-08",
      proposedBudget: "互惠創作 (TFCD)",
      message: "米娜您好！欣賞您極簡俐落的肢體表現，希望邀約一組北美館戶外秋季大衣創作，棚燈自備。",
      status: "pending",
      createdAt: "2026-10-16 11:00",
      updatedAt: "2026-10-16 11:00",
    },
    {
      id: "inv_p2",
      senderId: "flora_studio",
      senderName: "風格服飾品牌 (Flora Studio)",
      senderRole: "client",
      recipientId: "Alan Chen",
      recipientName: "陳攝影 (Alan Chen)",
      recipientRole: "photographer",
      projectTitle: "電商新品白底商品棚拍",
      proposedDate: "2026-11-12",
      proposedBudget: "NT$ 12,000",
      message: "陳攝影您好，我們有批冬季飾品需要純白底去背與特寫拍攝，希望能與您配合！",
      status: "pending",
      createdAt: "2026-10-17 09:30",
      updatedAt: "2026-10-17 09:30",
    },
  ]);

  const handleAcceptInvite = (invite: CollaborationInvite) => {
    setInvitations((prev) =>
      prev.map((i) => (i.id === invite.id ? { ...i, status: "accepted" as const } : i))
    );

    const newCollab: CollaborationProject = {
      id: `collab_${Date.now()}`,
      caseNumber: `COL-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(100 + Math.random() * 900)}`,
      title: invite.projectTitle,
      category: "commercial",
      modelName: invite.senderName,
      shootDate: invite.proposedDate,
      exactTime: `${invite.proposedDate} 準時集合`,
      exactLocation: "約定集合地點",
      coopType: "商業受託合作",
      remuneration: invite.proposedBudget,
      deliveryDays: 14,
      bankInfo: {
        bankCode: "822",
        bankName: "中國信託",
        accountNumber: "1234-5678-9012",
        accountName: "陳攝影工作室",
      },
      outfits: [
        {
          id: `outfit_${Date.now()}`,
          title: "專案約定拍攝內容",
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
          id: `m_${Date.now()}`,
          sender: "photographer",
          senderName: photographerProfile.name,
          text: `您好【${invite.senderName}】！已接受您的合作邀約，歡迎在此討論專案細節！`,
          timestamp: "剛剛",
        },
      ],
    };

    const updatedCollabs = [newCollab, ...collabEvents];
    setCollabEvents(updatedCollabs);
    localStorage.setItem("lumina_collaboration_events", JSON.stringify(updatedCollabs));
    alert(`🎉 已正式接受【${invite.senderName}】的約拍！專案已同步建立至「履約協作」！`);
  };

  const handleDeclineInvite = (inviteId: string) => {
    setInvitations((prev) =>
      prev.map((i) => (i.id === inviteId ? { ...i, status: "declined" as const } : i))
    );
    alert("已婉拒該約拍委託。");
  };

  const handleCancelSentInvite = (inviteId: string) => {
    setInvitations((prev) => prev.filter((i) => i.id !== inviteId));
    alert("已成功撤回該邀約！");
  };

  const [scheduleData, setScheduleData] = useState<Record<string, { status: "available" | "busy" | "off"; note?: string }>>({
    "2026-10-18": { status: "busy", note: "大稻埕復古街拍專案" },
    "2026-10-24": { status: "busy", note: "秋季時裝外拍" },
    "2026-10-30": { status: "busy", note: "商案型錄拍攝" },
  });

  const [contractTitle, setContractTitle] = useState("標準商業攝影委託暨肖像授權合約");
  const [contractBody, setContractBody] = useState(DEFAULT_COMMERCIAL_CONTRACT);
  const [depositRate, setDepositRate] = useState("30%");
  const [revisionLimit, setRevisionLimit] = useState(2);

  const [collabEvents, setCollabEvents] = useState<CollaborationProject[]>(DEFAULT_PROJECTS);

  const [proposalTemplate, setProposalTemplate] = useState({
    defaultStyle: "日系膠卷清新街拍",
    defaultLocation: "台北市大稻埕 / 迪化街周邊街拍",
    defaultCoopType: "互惠創作 (TFCD)",
    defaultProposalLetter: "您好！非常欣賞您的作品風格與表現力，希望能邀約合作一組日系膠卷人像！拍攝當天會自備反光板與定焦鏡頭，預計於拍攝後 14 日內交付 15 張高畫質精修調色成品，全程無任何肢體碰觸要求，期待您的回覆！",
  });

  const [reviews, setReviews] = useState<PhotographerReceivedReview[]>([
    {
      id: "pr_p_1",
      authorName: "模特 羽晴 (Hane)（已官方驗證）",
      date: "2026-10-01",
      tags: ["安全尊重", "守時不拖拉", "依約交圖"],
      content: "合作過程非常舒服！完全透過口頭動作走位引導，現場有女性助理協助整理髮絲，交圖迅速且色調非常棒！",
      safetyRating: 5.0,
    },
  ]);

  const reloadCollabEvents = () => {
    const savedCollabs = localStorage.getItem("lumina_collaboration_events");
    if (savedCollabs) {
      try {
        const parsed = JSON.parse(savedCollabs);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCollabEvents(parsed);
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }
    localStorage.setItem("lumina_collaboration_events", JSON.stringify(DEFAULT_PROJECTS));
  };

  useEffect(() => {
    const saved = localStorage.getItem("lumina_photographer_profile_data");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.photographerProfile) setPhotographerProfile((prev) => ({ ...prev, ...parsed.photographerProfile }));
        if (parsed.socialLinks) setSocialLinks(parsed.socialLinks);
        if (parsed.styles) setStyles(parsed.styles);
        if (parsed.proposalTemplate) setProposalTemplate(parsed.proposalTemplate);
        if (parsed.rateCardImages) setRateCardImages(parsed.rateCardImages);
        if (parsed.rateCardAccessMode) setRateCardAccessMode(parsed.rateCardAccessMode);
        if (parsed.incomingRequests) setIncomingRequests(parsed.incomingRequests);
        if (parsed.outgoingRequests) setOutgoingRequests(parsed.outgoingRequests);
        if (parsed.contractTitle) setContractTitle(parsed.contractTitle);
        if (parsed.contractBody) setContractBody(parsed.contractBody);
        if (parsed.depositRate) setDepositRate(parsed.depositRate);
        if (parsed.revisionLimit !== undefined) setRevisionLimit(parsed.revisionLimit);
        if (parsed.scheduleData) setScheduleData(parsed.scheduleData);
      } catch (e) {
        console.error(e);
      }
    }

    reloadCollabEvents();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "lumina_collaboration_events") {
        reloadCollabEvents();
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleAddStyle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStyleInput.trim()) return;
    if (!styles.includes(newStyleInput.trim())) setStyles([...styles, newStyleInput.trim()]);
    setNewStyleInput("");
  };

  const handleRemoveStyle = (tag: string) => setStyles(styles.filter((s) => s !== tag));

  const saveAllData = (partial: any = {}) => {
    const dataToSave = {
      photographerProfile,
      socialLinks,
      styles,
      proposalTemplate,
      rateCardImages,
      rateCardAccessMode,
      incomingRequests,
      outgoingRequests,
      contractTitle,
      contractBody,
      depositRate,
      revisionLimit,
      scheduleData,
      ...partial,
    };
    localStorage.setItem("lumina_photographer_profile_data", JSON.stringify(dataToSave));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    saveAllData({ photographerProfile, socialLinks });

    const updatedEvents = collabEvents.map((evt) => {
      const updatedMessages = evt.messages?.map((m) =>
        m.sender === "photographer" ? { ...m, senderName: photographerProfile.name } : m
      );
      return { ...evt, messages: updatedMessages };
    });
    setCollabEvents(updatedEvents);
    localStorage.setItem("lumina_collaboration_events", JSON.stringify(updatedEvents));

    alert(`✅ 攝影師檔案已儲存！所有專案已同步更新為：【${photographerProfile.name}】！`);
  };

  const handleUpdateSchedule = (dateKey: string, status: "available" | "busy" | "off", note?: string) => {
    const updated = { ...scheduleData, [dateKey]: { status, note } };
    setScheduleData(updated);
    saveAllData({ scheduleData: updated });
  };

  const handleSaveRateCardConfig = (e: React.FormEvent) => {
    e.preventDefault();
    saveAllData({});
    alert("✅ 攝影報價單與權限設定已成功儲存！");
  };

  const handleSaveContract = (e: React.FormEvent) => {
    e.preventDefault();
    saveAllData({ contractTitle, contractBody, depositRate, revisionLimit });
    alert("✅ 商案制式合約書範本已成功儲存！");
  };

  const handleToggleOutfitApproval = (eventId: string, outfitId: string) => {
    const updated = collabEvents.map((evt) => {
      if (evt.id !== eventId) return evt;
      const updatedOutfits = evt.outfits.map((o) => {
        if (o.id !== outfitId) return o;
        const current = o.photographerConfirmed ?? (o.status === "confirmed");
        return { ...o, photographerConfirmed: !current };
      });
      return { ...evt, outfits: updatedOutfits };
    });
    setCollabEvents(updated);
    localStorage.setItem("lumina_collaboration_events", JSON.stringify(updated));
  };

  const handleAddOutfit = (eventId: string, title: string, desc: string, img?: string) => {
    const outfit = {
      id: `outfit_${Date.now()}`,
      title,
      description: desc || "攝影自備或建議搭配",
      image: img,
      modelConfirmed: false,
      photographerConfirmed: true,
      status: "pending" as const,
    };

    const updated = collabEvents.map((c) =>
      c.id === eventId ? { ...c, outfits: [...(c.outfits || []), outfit] } : c
    );
    setCollabEvents(updated);
    localStorage.setItem("lumina_collaboration_events", JSON.stringify(updated));
  };

  const handleDeleteOutfit = (eventId: string, outfitId: string) => {
    const updated = collabEvents.map((c) =>
      c.id === eventId ? { ...c, outfits: c.outfits.filter((o) => o.id !== outfitId) } : c
    );
    setCollabEvents(updated);
    localStorage.setItem("lumina_collaboration_events", JSON.stringify(updated));
  };

  const handlePhotographerCheckIn = (eventId: string) => {
    const nowTime = new Date().toTimeString().slice(0, 5);
    const updated = collabEvents.map((evt) =>
      evt.id === eventId
        ? {
            ...evt,
            checkInStatus: {
              ...evt.checkInStatus,
              photographerCheckedIn: true,
              photographerCheckInTime: nowTime,
            },
          }
        : evt
    );
    setCollabEvents(updated);
    localStorage.setItem("lumina_collaboration_events", JSON.stringify(updated));
    alert(`📍 簽到成功！攝影師抵達時間：${nowTime}。`);
  };

  const handleSendMessage = (eventId: string, text: string) => {
    const nowStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const newMsg = {
      id: `msg_${Date.now()}`,
      sender: "photographer" as const,
      senderName: photographerProfile.name,
      text,
      timestamp: nowStr,
    };

    const updated = collabEvents.map((evt) =>
      evt.id === eventId ? { ...evt, messages: [...(evt.messages || []), newMsg] } : evt
    );
    setCollabEvents(updated);
    localStorage.setItem("lumina_collaboration_events", JSON.stringify(updated));
  };

  const handleSendPaymentNotice = (eventId: string, bank: string, lastFive: string, amount: number) => {
    const nowTime = new Date().toISOString().slice(5, 16).replace("T", " ");
    const updated = collabEvents.map((evt) => {
      if (evt.id === eventId) {
        return {
          ...evt,
          paymentNotice: {
            bankName: bank,
            lastFiveDigits: lastFive,
            amount,
            noticeTime: nowTime,
            isModelConfirmed: false,
          },
          paymentStatus: "deposit_paid" as const,
        };
      }
      return evt;
    });
    setCollabEvents(updated);
    localStorage.setItem("lumina_collaboration_events", JSON.stringify(updated));
    alert(`✅ 匯款通知已送達模特！\n銀行：${bank}\n末五碼：${lastFive}\n金額：NT$ ${amount}`);
  };

  const handleSendRevisionNotice = (eventId: string, notes: string) => {
    const nowTime = new Date().toISOString().slice(5, 16).replace("T", " ");
    const updated = collabEvents.map((evt) => {
      if (evt.id === eventId) {
        const prevCount = evt.revisionNotice?.requestCount || 0;
        return {
          ...evt,
          revisionNotice: {
            requestCount: prevCount + 1,
            notes,
            noticeTime: nowTime,
          },
        };
      }
      return evt;
    });
    setCollabEvents(updated);
    localStorage.setItem("lumina_collaboration_events", JSON.stringify(updated));
    alert("✅ 照片調色／修改進度已通知模特！");
  };

  const handleSendInvoiceNotice = (eventId: string, type: "deposit" | "final", amount: number) => {
    const nowTime = new Date().toISOString().slice(5, 16).replace("T", " ");
    const updated = collabEvents.map((evt) => {
      if (evt.id === eventId) {
        return {
          ...evt,
          invoiceNotice: {
            invoiceType: type,
            amount,
            noticeTime: nowTime,
          },
        };
      }
      return evt;
    });
    setCollabEvents(updated);
    localStorage.setItem("lumina_collaboration_events", JSON.stringify(updated));
    alert(`✅ 已送出【${type === "deposit" ? "30% 簽約定金" : "結案尾款"}】請款通知（NT$ ${amount}）！`);
  };

  const handleDeliverPhotos = (eventId: string, cloudUrl: string, password?: string, notes?: string) => {
    const nowStr = new Date().toISOString().slice(5, 16).replace("T", " ");
    const updated = collabEvents.map((evt) => {
      if (evt.id === eventId) {
        return {
          ...evt,
          deliveryProof: {
            cloudUrl,
            accessPassword: password,
            notes,
            deliveredAt: nowStr,
            isModelAccepted: false,
          },
        };
      }
      return evt;
    });
    setCollabEvents(updated);
    localStorage.setItem("lumina_collaboration_events", JSON.stringify(updated));
    alert(`🎉 成品載點已正式交付存證！\n雲端連結：${cloudUrl}\n模特端將即刻收到驗收通知。`);
  };

  const handleFinalizeProject = (eventId: string) => {
    const target = collabEvents.find((e) => e.id === eventId);
    const projectTitle = target?.title || "本合作專案";
    const confirm = window.confirm(
      `確定要正式完成結案【${projectTitle}】嗎？\n結案後本專案將自動歸入「歷史邀約」存證庫。`
    );
    if (!confirm) return;

    const updated = collabEvents.map((c) =>
      c.id === eventId ? { ...c, status: "completed" as const } : c
    );
    setCollabEvents(updated);
    localStorage.setItem("lumina_collaboration_events", JSON.stringify(updated));
    alert("🎉 專案已順利結案並收納至「歷史邀約」模組！");
  };

  const handleApproveRequest = (id: string, durationHours: number = 168) => {
    const days = Math.round(durationHours / 24);
    const updated = incomingRequests.map((r) =>
      r.id === id ? { ...r, status: "approved" as const, expiresLabel: `開放 ${days} 天` } : r
    );
    setIncomingRequests(updated);
    saveAllData({ incomingRequests: updated });
    alert(`✅ 已核准該索取請求（查閱時效：${days} 天）！`);
  };

  const handleDeclineRequest = (id: string) => {
    const updated = incomingRequests.map((r) =>
      r.id === id ? { ...r, status: "declined" as const } : r
    );
    setIncomingRequests(updated);
    saveAllData({ incomingRequests: updated });
  };

  const handleRevokeRequest = (id: string) => {
    const target = incomingRequests.find((r) => r.id === id);
    const confirmRevoke = window.confirm(`確定要收回「${target?.applicantName}」的報價單查閱授權嗎？`);
    if (!confirmRevoke) return;

    const updated = incomingRequests.map((r) =>
      r.id === id ? { ...r, status: "declined" as const, expiresLabel: "授權已收回" } : r
    );
    setIncomingRequests(updated);
    saveAllData({ incomingRequests: updated });
    alert("🔒 已成功收回報價單查閱權限！");
  };

  const handleDeleteIncomingRequest = (id: string) => {
    const updated = incomingRequests.filter((r) => r.id !== id);
    setIncomingRequests(updated);
    saveAllData({ incomingRequests: updated });
  };

  const handleSaveProposalTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    saveAllData({});
    alert("✅ 預設約拍提案範本已儲存！");
  };

  const pendingIncomingCount = incomingRequests.filter((r) => r.status === "pending").length;

  // 未處理邀約統計（我發出的待回覆 + 收到的待處理）
  const totalPendingInvitesCount = useMemo(() => {
    const pendingSent = invitations.filter((i) => i.senderRole === "photographer" && i.status === "pending").length;
    const pendingReceived = invitations.filter((i) => i.recipientRole === "photographer" && i.status === "pending").length;
    return pendingSent + pendingReceived;
  }, [invitations]);

  return (
    <main className="min-h-[calc(100vh-65px)] bg-stone-100/70 px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-stone-800">攝影工作室後台</h2>
            <p className="text-xs text-stone-500 mt-1">
              管理合作提案進度、履約協作、檔期日曆與商案合約
            </p>
          </div>

          <div className="flex flex-wrap bg-[#edeae3]/80 p-1 rounded-xl border border-stone-300">
            <button
              onClick={() => setActiveTab("profile")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === "profile" ? "bg-white text-indigo-700 shadow-xs" : "text-stone-600 hover:text-stone-900"
              }`}
            >
              📷 攝影師檔案
            </button>

            {/* ★ 新增：邀約進度按鈕（含未處理項目數量統計） ★ */}
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
              onClick={() => setActiveTab("rate_card")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === "rate_card" ? "bg-white text-indigo-700 shadow-xs" : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <span>💳 報價單管理</span>
              {pendingIncomingCount > 0 && (
                <span className="w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] flex items-center justify-center font-bold">
                  {pendingIncomingCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("collab")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                activeTab === "collab" ? "bg-white text-indigo-700 shadow-xs" : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <span>🤝 履約協作</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            </button>

            <button
              onClick={() => setActiveTab("schedule")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === "schedule" ? "bg-white text-indigo-700 shadow-xs" : "text-stone-600 hover:text-stone-900"
              }`}
            >
              📅 檔期月曆
            </button>

            <button
              onClick={() => setActiveTab("contract")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === "contract" ? "bg-white text-indigo-700 shadow-xs" : "text-stone-600 hover:text-stone-900"
              }`}
            >
              📜 商案合約
            </button>

            <button
              onClick={() => setActiveTab("template")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === "template" ? "bg-white text-indigo-700 shadow-xs" : "text-stone-600 hover:text-stone-900"
              }`}
            >
              📝 預設提案範本
            </button>

            <button
              onClick={() => setActiveTab("reviews_manager")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === "reviews_manager" ? "bg-white text-indigo-700 shadow-xs" : "text-stone-600 hover:text-stone-900"
              }`}
            >
              ⭐ 信用評分管理
            </button>

            <button
              onClick={() => setActiveTab("reviews")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === "reviews" ? "bg-white text-indigo-700 shadow-xs" : "text-stone-600 hover:text-stone-900"
              }`}
            >
              🛡️ 模特評價手札
            </button>
          </div>
        </div>

        {activeTab === "profile" && (
          <PhotographerProfileTab
            photographerProfile={photographerProfile}
            setPhotographerProfile={setPhotographerProfile}
            socialLinks={socialLinks}
            setSocialLinks={setSocialLinks}
            styles={styles}
            newStyleInput={newStyleInput}
            setNewStyleInput={setNewStyleInput}
            handleAddStyle={handleAddStyle}
            handleRemoveStyle={handleRemoveStyle}
            handleSaveProfile={handleSaveProfile}
          />
        )}

        {/* ★ 新增：攝影端邀約進度看板渲染 ★ */}
        {activeTab === "invitations" && (
          <PhotographerInvitationTrackerTab
            currentPhotographerName={photographerProfile.name}
            invitations={invitations}
            onAcceptInvite={handleAcceptInvite}
            onDeclineInvite={handleDeclineInvite}
            onCancelSentInvite={handleCancelSentInvite}
          />
        )}

        {activeTab === "rate_card" && (
          <PhotographerRateCardTab
            rateCardImages={rateCardImages}
            setRateCardImages={setRateCardImages}
            accessMode={rateCardAccessMode}
            setAccessMode={setRateCardAccessMode}
            incomingRequests={incomingRequests}
            handleApproveRequest={handleApproveRequest}
            handleDeclineRequest={handleDeclineRequest}
            handleRevokeRequest={handleRevokeRequest}
            handleDeleteIncomingRequest={handleDeleteIncomingRequest}
            outgoingRequests={outgoingRequests}
            handleSaveRateCardConfig={handleSaveRateCardConfig}
          />
        )}

        {activeTab === "collab" && (
          <PhotographerCollaborationTab
            events={collabEvents}
            handleToggleOutfitApproval={handleToggleOutfitApproval}
            handleAddOutfit={handleAddOutfit}
            handleDeleteOutfit={handleDeleteOutfit}
            handlePhotographerCheckIn={handlePhotographerCheckIn}
            handleSendMessage={handleSendMessage}
            handleSendPaymentNotice={handleSendPaymentNotice}
            handleSendRevisionNotice={handleSendRevisionNotice}
            handleSendInvoiceNotice={handleSendInvoiceNotice}
            handleFinalizeProject={handleFinalizeProject}
            handleDeliverPhotos={handleDeliverPhotos}
          />
        )}

        {activeTab === "schedule" && (
          <PhotographerScheduleTab
            scheduleData={scheduleData}
            onUpdateSchedule={handleUpdateSchedule}
          />
        )}

        {activeTab === "contract" && (
          <CommercialContractTab
            contractTitle={contractTitle}
            setContractTitle={setContractTitle}
            contractBody={contractBody}
            setContractBody={setContractBody}
            depositRate={depositRate}
            setDepositRate={setDepositRate}
            revisionLimit={revisionLimit}
            setRevisionLimit={setRevisionLimit}
            handleSaveContract={handleSaveContract}
          />
        )}

        {activeTab === "template" && (
          <ProposalTemplateTab
            proposalTemplate={proposalTemplate}
            setProposalTemplate={setProposalTemplate}
            handleSaveProposalTemplate={handleSaveProposalTemplate}
          />
        )}

        {activeTab === "reviews_manager" && (
          <ReviewsManagerTab
            currentUserName={photographerProfile.name}
            currentUserRole="photographer"
          />
        )}

        {activeTab === "reviews" && (
          <PhotographerReviewsTab reviews={reviews} />
        )}
      </div>
    </main>
  );
}