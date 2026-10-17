"use client";

import React, { useState } from "react";
import Link from "next/link";

export interface ClientReviewItem {
  id: string;
  authorName: string;
  authorRole: "model" | "photographer";
  date: string;
  caseNumber: string;
  projectTitle: string;
  rating: number; // 綜合評分 1-5
  paymentPromptnessRating: number; // 款項準時度
  respectRating: number; // 現場與界線尊重
  communicationRating: number; // 溝通清晰度
  tags: string[];
  content: string;
  status: "published" | "under_review" | "hidden"; // under_review 代表申訴隔離中
  disputeReason?: string;
  disputeCreatedAt?: string;
}

interface ClientReviewsTabProps {
  companyName: string;
}

const DEFAULT_REVIEWS: ClientReviewItem[] = [
  {
    id: "cr_1",
    authorName: "羽晴 (Hane)",
    authorRole: "model",
    date: "2026-10-15",
    caseNumber: "COM-20261015-003",
    projectTitle: "2026 冬季韓系針織新品型錄 (松山文創)",
    rating: 5.0,
    paymentPromptnessRating: 5.0,
    respectRating: 5.0,
    communicationRating: 5.0,
    tags: ["款項光速入帳", "尊重創作者專業", "現場備有更衣遮蔽", "通告時間精準"],
    content: "合作非常愉快！品牌現場有貼心安排女性助理協助整燙更衣，完全無非必要碰觸，尾款結案當天即入帳，非常值得信賴的優質品牌雇主！",
    status: "published",
  },
  {
    id: "cr_2",
    authorName: "陳攝影 (Alan Chen)",
    authorRole: "photographer",
    date: "2026-10-10",
    caseNumber: "COM-20261008-001",
    projectTitle: "品牌秋季 Lookbook 形象棚拍",
    rating: 4.8,
    paymentPromptnessRating: 5.0,
    respectRating: 4.5,
    communicationRating: 5.0,
    tags: ["需求明確不隨意改稿", "款項準時付清", "好溝通"],
    content: "行銷總監的需求腳本很清晰，當天棚拍進度完全照排程走，定金與尾款都走系統合約代管，合作體驗極佳！",
    status: "published",
  },
  {
    id: "cr_3",
    authorName: "某匿名應徵者",
    authorRole: "photographer",
    date: "2026-10-05",
    caseNumber: "COM-20261001-099",
    projectTitle: "快閃商品商業攝影",
    rating: 1.0,
    paymentPromptnessRating: 1.0,
    respectRating: 1.0,
    communicationRating: 1.0,
    tags: ["溝通不順"],
    content: "這家品牌根本沒有錄用我就隨意關閉職缺，浪費我的提案時間，惡質品牌！",
    status: "under_review",
    disputeReason: "此應徵者未曾進入正式簽約錄用階段，其內容屬無實質合作之惡意情緒謾罵，已附上後台應徵紀錄供官方仲裁。",
    disputeCreatedAt: "2026-10-06 09:30",
  },
];

export default function ClientReviewsTab({ companyName }: ClientReviewsTabProps) {
  const [reviews, setReviews] = useState<ClientReviewItem[]>(() => {
    try {
      const saved = localStorage.getItem("lumina_client_reviews");
      return saved ? JSON.parse(saved) : DEFAULT_REVIEWS;
    } catch {
      return DEFAULT_REVIEWS;
    }
  });

  const [selectedReview, setSelectedReview] = useState<ClientReviewItem | null>(null);
  const [disputeInput, setDisputeInput] = useState("");

  const saveReviews = (newList: ClientReviewItem[]) => {
    setReviews(newList);
    localStorage.setItem("lumina_client_reviews", JSON.stringify(newList));
  };

  // 申訴中 (under_review) 的評價強制排除，不計入總分計算
  const validReviews = reviews.filter((r) => r.status === "published");
  const underReviewCount = reviews.filter((r) => r.status === "under_review").length;

  const avgRating = validReviews.length
    ? (validReviews.reduce((sum, r) => sum + r.rating, 0) / validReviews.length).toFixed(1)
    : "5.0";

  const avgPayment = validReviews.length
    ? (validReviews.reduce((sum, r) => sum + r.paymentPromptnessRating, 0) / validReviews.length).toFixed(1)
    : "5.0";

  const avgRespect = validReviews.length
    ? (validReviews.reduce((sum, r) => sum + r.respectRating, 0) / validReviews.length).toFixed(1)
    : "5.0";

  const avgComm = validReviews.length
    ? (validReviews.reduce((sum, r) => sum + r.communicationRating, 0) / validReviews.length).toFixed(1)
    : "5.0";

  const handleOpenDispute = (review: ClientReviewItem) => {
    setSelectedReview(review);
    setDisputeInput("");
  };

  const handleConfirmDispute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReview || !disputeInput.trim()) return;

    const updated = reviews.map((r) => {
      if (r.id === selectedReview.id) {
        return {
          ...r,
          status: "under_review" as const,
          disputeReason: disputeInput.trim(),
          disputeCreatedAt: new Date().toISOString().slice(0, 16).replace("T", " "),
        };
      }
      return r;
    });

    saveReviews(updated);
    setSelectedReview(null);
    setDisputeInput("");
    alert("🛡️ 申訴已成功提交存證！\n在平台官方審查期間，此筆評價已即時隔離，不納入星級計算亦不於前台公開顯示！");
  };

  return (
    <div className="space-y-6 text-xs">
      {/* 頂部信用看板總覽 */}
      <div className="bg-white border border-stone-300 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-stone-900">
              {companyName} 的品牌雇主商譽手札
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              官方存證保護中
            </span>
          </div>
          <p className="text-stone-600 text-xs font-medium">
            所有評價均來自協作室正式簽約完成履約之模特與攝影師。爭議或申訴審理中項目將強制隔離不列入計分。
          </p>
        </div>

        {/* 評分數字 */}
        <div className="flex items-center gap-6 shrink-0 bg-stone-50 border border-stone-200 p-4 rounded-xl">
          <div className="text-center">
            <div className="text-2xl font-black text-indigo-700 flex items-center justify-center gap-1">
              <span>★</span>
              <span>{avgRating}</span>
            </div>
            <div className="text-[11px] font-bold text-stone-500 mt-0.5">
              綜合評價 ({validReviews.length} 則有效)
            </div>
          </div>

          <div className="h-10 w-px bg-stone-300"></div>

          <div className="space-y-1 text-[11px] text-stone-700 font-semibold">
            <div>💰 款項準時度：<strong className="text-indigo-600">{avgPayment}</strong></div>
            <div>🤝 現場尊重度：<strong className="text-indigo-600">{avgRespect}</strong></div>
            <div>💬 溝通清晰度：<strong className="text-indigo-600">{avgComm}</strong></div>
          </div>
        </div>
      </div>

      {/* 申訴保護狀態通知條 */}
      {underReviewCount > 0 && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 flex items-center justify-between gap-3 text-amber-900">
          <div className="flex items-center gap-2">
            <span className="text-base">🛡️</span>
            <div>
              <span className="font-bold text-xs">申訴保護機制已啟動：</span>
              <span className="text-xs ml-1">
                目前有 <strong>{underReviewCount}</strong> 筆評價處於爭議申訴審查中，系統已自動隔離，<strong>不計入總星級亦不對外公開展示</strong>。
              </span>
            </div>
          </div>
          <span className="text-[10px] font-bold bg-white text-amber-800 border border-amber-300 px-2 py-1 rounded-md">
            審理時效：約 24-48 小時
          </span>
        </div>
      )}

      {/* 評價列表清單 */}
      <div className="space-y-4">
        <h4 className="font-bold text-stone-900 text-sm">歷次專案合作評價 ({reviews.length})</h4>

        <div className="space-y-3">
          {reviews.map((item) => {
            const isUnderReview = item.status === "under_review";
            const roleBadge = item.authorRole === "model" ? "👩‍🦰 合作模特" : "📸 合作攝影師";
            const profileLink = item.authorRole === "model"
              ? `/model/${encodeURIComponent(item.authorName)}`
              : `/photographer/${encodeURIComponent(item.authorName)}`;

            return (
              <div
                key={item.id}
                className={`bg-white border rounded-2xl p-5 shadow-2xs space-y-3 transition ${
                  isUnderReview ? "border-amber-400 bg-amber-50/30" : "border-stone-300"
                }`}
              >
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-stone-200 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={profileLink}
                        className="font-bold text-stone-900 hover:text-indigo-600 text-sm transition"
                      >
                        {item.authorName} ➔
                      </Link>
                      <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-stone-100 text-stone-700 border border-stone-300">
                        {roleBadge}
                      </span>
                      {isUnderReview && (
                        <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
                          ⚠️ 申訴審查中 (暫不列入評分)
                        </span>
                      )}
                    </div>
                    <p className="text-stone-500 text-[11px] mt-0.5">
                      評價日期：{item.date} ｜ 專案：<strong className="text-stone-800">{item.projectTitle}</strong> ({item.caseNumber})
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 self-start sm:self-auto">
                    <span className="text-amber-500 font-bold text-sm">★ {item.rating.toFixed(1)}</span>
                    <span className="text-stone-400 text-[10px]">
                      (款項 {item.paymentPromptnessRating} · 尊重 {item.respectRating} · 溝通 {item.communicationRating})
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {item.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-bold px-2 py-0.5 bg-stone-100 text-stone-700 rounded-md border border-stone-200"
                    >
                      #{t}
                    </span>
                  ))}
                </div>

                <p className="text-stone-700 text-xs leading-relaxed font-medium bg-[#fbfaf8] p-3 rounded-xl border border-stone-200">
                  「{item.content}」
                </p>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-1">
                  {isUnderReview ? (
                    <div className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200 p-2 rounded-lg w-full">
                      <strong>🚩 品牌申訴理由：</strong> {item.disputeReason} ({item.disputeCreatedAt})
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 w-full justify-end">
                      <button
                        type="button"
                        onClick={() => handleOpenDispute(item)}
                        className="px-3 py-1.5 text-stone-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg font-bold transition cursor-pointer text-xs flex items-center gap-1"
                      >
                        <span>🚩</span>
                        <span>提出申訴 / 檢舉不實評價</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 提出申訴彈窗 */}
      {selectedReview && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleConfirmDispute}
            className="bg-white border border-stone-300 max-w-lg w-full p-6 rounded-2xl shadow-2xl space-y-4 text-xs"
          >
            <div className="flex justify-between items-center border-b border-stone-200 pb-3">
              <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                <span>🛡️</span>
                <span>提出不實評價檢舉與申訴隔離申請</span>
              </h4>
              <button
                type="button"
                onClick={() => setSelectedReview(null)}
                className="text-stone-400 hover:text-stone-600 text-base font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 space-y-1">
              <div className="font-bold text-stone-800">
                申訴對象：{selectedReview.authorName} ({selectedReview.authorRole === "model" ? "模特" : "攝影師"})
              </div>
              <div className="text-[11px] text-stone-500">專案：{selectedReview.projectTitle}</div>
              <p className="text-[11px] text-stone-600 italic">「{selectedReview.content}」</p>
            </div>

            <div>
              <label className="block font-bold text-stone-800 mb-1">
                申訴事由與存證說明 <span className="text-rose-600">*</span>
              </label>
              <textarea
                rows={4}
                required
                value={disputeInput}
                onChange={(e) => setDisputeInput(e.target.value)}
                placeholder="請具體說明申訴原因（如：未曾履約、與事實不符、無故抹黑、同行惡意競爭），並附上協作室對話或匯款截圖說明..."
                className="w-full bg-white text-stone-900 border border-stone-300 rounded-xl p-3 outline-none focus:border-indigo-600 leading-relaxed font-medium"
              />
            </div>

            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3 text-indigo-900 text-[11px] leading-relaxed space-y-1">
              <div className="font-bold">⚖️ 平台存證保障規範：</div>
              <div>
                送出申訴後，系統將<strong>立即扣除該筆評分並從公開前台隱藏</strong>，由官方客服調閱「履約協作室存證紀錄」進行雙方仲裁，審核通過前絕不影響品牌雇主商譽。
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setSelectedReview(null)}
                className="px-4 py-2 bg-stone-200 text-stone-700 rounded-xl font-bold hover:bg-stone-300 cursor-pointer"
              >
                取消
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold transition cursor-pointer shadow-xs"
              >
                確認送出申訴並即時隔離
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}