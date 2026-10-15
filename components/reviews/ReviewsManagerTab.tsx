"use client";

import React, { useState, useEffect } from "react";

export interface ReviewItem {
  id: string;
  caseNumber: string;
  authorName: string;
  authorRole: "model" | "photographer";
  targetName: string;
  targetRole: "model" | "photographer";
  rating: number;
  publicTags: string[];
  publicComment: string;
  submittedAt: string;
  disputeStatus?: "none" | "under_review" | "resolved" | "dismissed";
  disputeReason?: string;
  disputeDetails?: string;
}

const DEFAULT_REVIEWS: ReviewItem[] = [
  {
    id: "rev_1",
    caseNumber: "INV-20261015-001",
    authorName: "羽晴 (Hane)",
    authorRole: "model",
    targetName: "陳攝影 (Alan Chen)",
    targetRole: "photographer",
    rating: 5,
    publicTags: ["極度守時", "尊重安全邊界", "動作引導精準"],
    publicComment: "陳攝影引導動作非常尊重且專業，完全沒有非必要碰觸，大稻埕外拍成品的色調與光影氛圍極佳！",
    submittedAt: "2026-10-18 16:30",
    disputeStatus: "none",
  },
  {
    id: "rev_2",
    caseNumber: "TFC-20261015-002",
    authorName: "陳攝影 (Alan Chen)",
    authorRole: "photographer",
    targetName: "米娜 (Mina)",
    targetRole: "model",
    rating: 5,
    publicTags: ["極度守時", "妝造配合度高"],
    publicComment: "米娜非常敬業，秋季時裝造型準備得十分完整，肢體動作自然流暢，期待下次再合作！",
    submittedAt: "2026-10-24 17:10",
    disputeStatus: "none",
  },
];

interface ReviewsManagerTabProps {
  currentUserName: string;
  currentUserRole: "model" | "photographer";
}

export default function ReviewsManagerTab({
  currentUserName,
  currentUserRole,
}: ReviewsManagerTabProps) {
  const [reviewList, setReviewList] = useState<ReviewItem[]>([]);
  const [subTab, setSubTab] = useState<"received" | "given">("received");

  // 爭議檢舉 Modal 狀態
  const [disputeModalOpen, setDisputeModalOpen] = useState(false);
  const [targetDisputeReview, setTargetDisputeReview] = useState<ReviewItem | null>(null);
  const [disputeReason, setDisputeReason] = useState("評論內容與事實不符");
  const [disputeDetails, setDisputeDetails] = useState("");

  const loadReviews = () => {
    try {
      const saved = localStorage.getItem("lumina_all_platform_reviews");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setReviewList(parsed);
          return;
        }
      }
    } catch (e) {
      console.error(e);
    }
    setReviewList(DEFAULT_REVIEWS);
    localStorage.setItem("lumina_all_platform_reviews", JSON.stringify(DEFAULT_REVIEWS));
  };

  useEffect(() => {
    loadReviews();
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "lumina_all_platform_reviews" && e.newValue) {
        try {
          setReviewList(JSON.parse(e.newValue));
        } catch (err) {
          console.error(err);
        }
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const saveReviews = (newList: ReviewItem[]) => {
    setReviewList(newList);
    localStorage.setItem("lumina_all_platform_reviews", JSON.stringify(newList));
    window.dispatchEvent(new Event("storage"));
  };

  // 收到的評價 vs 給出的評價
  const receivedReviews = reviewList.filter(
    (r) => r.targetName.includes(currentUserName) || currentUserName.includes(r.targetName)
  );
  const givenReviews = reviewList.filter(
    (r) => r.authorName.includes(currentUserName) || currentUserName.includes(r.authorName)
  );

  // 總評分計算：僅計算「未處於爭議審核中」的收到的評價
  const validReceivedReviews = receivedReviews.filter((r) => r.disputeStatus !== "under_review");
  const averageRating =
    validReceivedReviews.length > 0
      ? (
          validReceivedReviews.reduce((sum, r) => sum + r.rating, 0) /
          validReceivedReviews.length
        ).toFixed(1)
      : "5.0";

  // 發起檢舉
  const handleOpenDispute = (review: ReviewItem) => {
    setTargetDisputeReview(review);
    setDisputeReason("評論內容與事實不符");
    setDisputeDetails("");
    setDisputeModalOpen(true);
  };

  const handleSubmitDispute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetDisputeReview) return;

    const updated = reviewList.map((r) =>
      r.id === targetDisputeReview.id
        ? {
            ...r,
            disputeStatus: "under_review" as const,
            disputeReason,
            disputeDetails: disputeDetails.trim(),
          }
        : r
    );

    saveReviews(updated);
    setDisputeModalOpen(false);
    alert("🚨 爭議檢舉已受理！該評價在審核期間已暫停公開顯示並排除於總評分之外。");
  };

  return (
    <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-6 shadow-sm space-y-6">
      {/* 頂部總評分統計看板 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-5 rounded-2xl border border-stone-200 gap-4 shadow-2xs">
        <div>
          <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
            <span>⭐</span>
            <span>履約信用評分總覽</span>
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            總評分僅採納合作夥伴給您的已結案評價；爭議審核中的評價將自動暫停計分。
          </p>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="flex items-center gap-1.5 justify-end">
              <span className="text-2xl font-black text-amber-500 font-mono">★ {averageRating}</span>
              <span className="text-xs text-stone-400 font-bold">/ 5.0</span>
            </div>
            <span className="text-[11px] text-stone-500">
              有效採計 {validReceivedReviews.length} 筆評價
            </span>
          </div>

          <div className="h-10 w-[1px] bg-stone-200"></div>

          <div className="text-center">
            <span className="text-lg font-bold text-stone-900 block font-mono">
              {receivedReviews.length}
            </span>
            <span className="text-[11px] text-stone-500">累計被評次數</span>
          </div>
        </div>
      </div>

      {/* 切換：收到的評價 vs 給出的評價 */}
      <div className="flex justify-between items-center border-b border-stone-200 pb-2">
        <div className="flex bg-[#edeae3] p-1 rounded-xl border border-stone-300 text-xs font-bold gap-1">
          <button
            type="button"
            onClick={() => setSubTab("received")}
            className={`px-4 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
              subTab === "received"
                ? "bg-white text-indigo-700 shadow-2xs"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <span>📥 收到的評價</span>
            <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 rounded-full font-mono">
              {receivedReviews.length}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setSubTab("given")}
            className={`px-4 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
              subTab === "given"
                ? "bg-white text-indigo-700 shadow-2xs"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <span>📤 給出的評價</span>
            <span className="text-[10px] bg-stone-200 text-stone-700 px-1.5 rounded-full font-mono">
              {givenReviews.length}
            </span>
          </button>
        </div>

        <span className="text-[11px] text-stone-400 font-medium">
          {subTab === "received" ? "對象給予您的履約反饋" : "您於結案時給予合作夥伴之存證"}
        </span>
      </div>

      {/* 列表渲染 */}
      <div className="space-y-3.5">
        {(subTab === "received" ? receivedReviews : givenReviews).length === 0 ? (
          <div className="p-12 text-center bg-[#f5f3ef] rounded-xl border border-dashed border-stone-300 text-xs text-stone-400">
            目前暫無{subTab === "received" ? "收到的" : "送出的"}評價紀錄。
          </div>
        ) : (
          (subTab === "received" ? receivedReviews : givenReviews).map((review) => {
            const isDisputed = review.disputeStatus === "under_review";

            return (
              <div
                key={review.id}
                className={`p-4 rounded-xl border transition text-xs space-y-2.5 ${
                  isDisputed
                    ? "bg-amber-50/60 border-amber-300"
                    : "bg-white border-stone-200 shadow-2xs"
                }`}
              >
                <div className="flex flex-wrap justify-between items-center gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] bg-stone-900 text-amber-300 px-1.5 py-0.5 rounded font-bold">
                      #{review.caseNumber}
                    </span>
                    <span className="font-bold text-stone-900">
                      {subTab === "received" ? `來自：${review.authorName}` : `給予：${review.targetName}`}
                    </span>
                    <span className="text-amber-500 font-bold font-mono">
                      {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)} ({review.rating}.0)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-stone-400 font-mono">{review.submittedAt}</span>

                    {/* 收到的評價才提供檢舉按鈕 */}
                    {subTab === "received" && (
                      <>
                        {isDisputed ? (
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-800 border border-amber-300 rounded text-[10px] font-bold">
                            ⚠️ 爭議評論處理中（公開頁已暫停顯示）
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleOpenDispute(review)}
                            className="text-stone-400 hover:text-rose-600 transition text-[11px] font-semibold cursor-pointer"
                            title="提出爭議檢舉"
                          >
                            🚨 提出爭議檢舉
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* 標籤列 */}
                {review.publicTags && review.publicTags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {review.publicTags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-stone-100 text-stone-700 border border-stone-200 rounded text-[10px] font-bold"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* 評論內文 */}
                {isDisputed ? (
                  <div className="p-3 bg-amber-100/70 border border-amber-200 rounded-lg text-amber-900 text-[11px]">
                    <span className="font-bold block">該筆評價目前處於爭議審核調查中</span>
                    <p className="mt-0.5 text-stone-600">
                      申訴事由：{review.disputeReason}。審查期間不列入公開評分與檔案頁展示。
                    </p>
                  </div>
                ) : (
                  <p className="text-stone-700 bg-[#fdfbf7] p-3 rounded-lg border border-stone-200 leading-relaxed font-medium">
                    {review.publicComment || "（合作愉快，未填寫額外備註）"}
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* 提出爭議檢舉彈窗 */}
      {disputeModalOpen && targetDisputeReview && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSubmitDispute}
            className="bg-[#fbfaf8] border border-stone-200 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs"
          >
            <div className="flex justify-between items-center border-b border-stone-200 pb-2">
              <h4 className="font-bold text-stone-900 flex items-center gap-1.5">
                <span>🚨</span>
                <span>提出評價爭議申訴檢舉</span>
              </h4>
              <button
                type="button"
                onClick={() => setDisputeModalOpen(false)}
                className="text-stone-400 hover:text-stone-600 font-bold text-base cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="bg-stone-100 p-2.5 rounded-lg border border-stone-200 text-stone-600 space-y-1">
                <div>案件號：<strong className="font-mono text-stone-800">#{targetDisputeReview.caseNumber}</strong></div>
                <div>評價人：<strong>{targetDisputeReview.authorName}</strong></div>
                <div className="truncate">評語：「{targetDisputeReview.publicComment}」</div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">申訴檢舉類別</label>
                <select
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  className="w-full bg-white text-stone-800 border border-stone-300 rounded-lg p-2.5 outline-none focus:border-indigo-500 font-medium"
                >
                  <option value="評論內容與事實不符">評論內容與履約事實不符</option>
                  <option value="涉及人身攻擊或謾罵">涉及個人隱私、不當言論或謾罵</option>
                  <option value="惡意報復性負評">惡意報復性評價 / 挾怨報復</option>
                  <option value="要求非約定事項無端扣分">提出合約外非約定事項無端扣分</option>
                  <option value="其他違反平台守則情事">其他違反平台守則情事</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">申訴事證與詳細說明</label>
                <textarea
                  rows={3}
                  required
                  value={disputeDetails}
                  onChange={(e) => setDisputeDetails(e.target.value)}
                  placeholder="請具體說明爭議經過，送出後案件將暫時自公開個人頁遮蔽..."
                  className="w-full bg-white text-stone-800 border border-stone-300 rounded-lg p-2.5 outline-none focus:border-indigo-500 leading-relaxed"
                />
              </div>

              <p className="text-[11px] text-amber-800 bg-amber-50 p-2.5 rounded-lg border border-amber-200 leading-relaxed">
                🛡️ 平台防護承諾：檢舉提出後，系統將<strong>立即在公開頁隱藏該評價並標示為爭議審核中</strong>，防止不實指控影響您的個人信譽。
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setDisputeModalOpen(false)}
                className="px-3.5 py-1.5 bg-stone-200 text-stone-700 rounded-xl font-bold hover:bg-stone-300 cursor-pointer"
              >
                取消
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold transition shadow-xs cursor-pointer"
              >
                確認送出檢舉並隱藏評價
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}