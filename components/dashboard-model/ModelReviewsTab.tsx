"use client";

import React, { useState } from "react";
import Link from "next/link";

export interface ModelReceivedReview {
  id: string;
  authorName: string;
  authorRole: "photographer" | "client";
  date: string;
  caseNumber: string;
  projectTitle: string;
  rating: number;
  punctualityRating: number;
  professionalismRating: number;
  communicationRating: number;
  tags: string[];
  content: string;
  status: "published" | "under_review" | "hidden";
  disputeReason?: string;
  disputeCreatedAt?: string;
}

const DEFAULT_MODEL_REVIEWS: ModelReceivedReview[] = [
  {
    id: "mr_1",
    authorName: "陳攝影 (Alan Chen)",
    authorRole: "photographer",
    date: "2026-10-18",
    caseNumber: "INV-20261015-001",
    projectTitle: "大稻埕復古街拍與旗袍專案",
    rating: 5.0,
    punctualityRating: 5.0,
    professionalismRating: 5.0,
    communicationRating: 5.0,
    tags: ["提早抵達現場", "自備底妝完整", "肢體引導配合度高", "高度敬業"],
    content: "羽晴非常準時且專業，完全遵守事前溝通的服裝風格，走位神情一次到位，大幅縮短拍攝時間，極度推薦的好合作夥伴！",
    status: "published",
  },
  {
    id: "mr_2",
    authorName: "風格服飾品牌 (Flora Studio)",
    authorRole: "client",
    date: "2026-10-14",
    caseNumber: "COM-20261015-003",
    projectTitle: "2026 冬季韓系針織新品型錄",
    rating: 4.9,
    punctualityRating: 5.0,
    professionalismRating: 4.8,
    communicationRating: 5.0,
    tags: ["服裝演繹精準", "愛惜樣品服飾", "親切好溝通"],
    content: "非常棒的商案模特！換裝迅速且十分愛惜樣品服飾，眼神情緒與品牌調性高度契合，期待下一季新品再次合作！",
    status: "published",
  },
];

export default function ModelReviewsTab({ currentModelName }: { currentModelName: string }) {
  const [reviews, setReviews] = useState<ModelReceivedReview[]>(() => {
    try {
      const saved = localStorage.getItem("lumina_model_received_reviews");
      return saved ? JSON.parse(saved) : DEFAULT_MODEL_REVIEWS;
    } catch {
      return DEFAULT_MODEL_REVIEWS;
    }
  });

  const [selectedReview, setSelectedReview] = useState<ModelReceivedReview | null>(null);
  const [disputeInput, setDisputeInput] = useState("");

  const saveReviews = (newList: ModelReceivedReview[]) => {
    setReviews(newList);
    localStorage.setItem("lumina_model_received_reviews", JSON.stringify(newList));
  };

  const validReviews = reviews.filter((r) => r.status === "published");
  const underReviewCount = reviews.filter((r) => r.status === "under_review").length;

  const avgRating = validReviews.length
    ? (validReviews.reduce((sum, r) => sum + r.rating, 0) / validReviews.length).toFixed(1)
    : "5.0";

  const handleConfirmDispute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReview || !disputeInput.trim()) return;

    const updated = reviews.map((r) =>
      r.id === selectedReview.id
        ? {
            ...r,
            status: "under_review" as const,
            disputeReason: disputeInput.trim(),
            disputeCreatedAt: new Date().toISOString().slice(0, 16).replace("T", " "),
          }
        : r
    );

    saveReviews(updated);
    setSelectedReview(null);
    setDisputeInput("");
    alert("🛡️ 申訴已成功提交存證！在官方審查期間，此筆評價已即時隔離，不納入個人星級計算！");
  };

  return (
    <div className="space-y-6 text-xs">
      <div className="bg-white border border-stone-300 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <span>🛡️</span>
            <span>{currentModelName} 的同業評價手札</span>
          </h3>
          <p className="text-stone-600 text-xs font-medium mt-1">
            由合作過的攝影師與品牌方留下之真實履約評價。爭議審查中項目強制隔離不計入評分。
          </p>
        </div>

        <div className="flex items-center gap-4 bg-stone-50 border border-stone-200 px-5 py-3 rounded-xl">
          <div className="text-2xl font-black text-indigo-700">★ {avgRating}</div>
          <div className="text-stone-500 font-bold text-[11px]">
            整體履約信任分 ({validReviews.length} 則有效)
          </div>
        </div>
      </div>

      {underReviewCount > 0 && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 text-amber-900 flex items-center justify-between">
          <span>⚠️ 目前有 {underReviewCount} 筆評價處於爭議申訴審查中，已強制隔離不納入星級評分。</span>
          <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded border border-amber-300">
            審理中
          </span>
        </div>
      )}

      <div className="space-y-3">
        {reviews.map((r) => {
          const isUnderReview = r.status === "under_review";
          const profileLink =
            r.authorRole === "photographer"
              ? `/photographer/${encodeURIComponent(r.authorName)}`
              : `/client/${encodeURIComponent(r.authorName)}`;

          return (
            <div
              key={r.id}
              className={`p-5 bg-white border rounded-2xl space-y-3 ${
                isUnderReview ? "border-amber-400 bg-amber-50/30" : "border-stone-300"
              }`}
            >
              <div className="flex justify-between items-center border-b border-stone-200 pb-2">
                <div className="flex items-center gap-2">
                  <Link href={profileLink} className="font-bold text-stone-900 hover:text-indigo-600 text-sm">
                    {r.authorName} ➔
                  </Link>
                  <span className="text-[10px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded font-bold border border-stone-300">
                    {r.authorRole === "photographer" ? "📸 攝影師" : "🏢 品牌方"}
                  </span>
                  {isUnderReview && (
                    <span className="text-[10px] text-amber-800 bg-amber-100 px-2 py-0.5 rounded font-bold border border-amber-300">
                      申訴隔離中
                    </span>
                  )}
                </div>
                <span className="text-amber-500 font-bold text-sm">★ {r.rating.toFixed(1)}</span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {r.tags.map((t, idx) => (
                  <span key={idx} className="bg-stone-100 text-stone-600 px-2 py-0.5 rounded text-[10px] font-bold">
                    #{t}
                  </span>
                ))}
              </div>

              <p className="bg-[#fbfaf8] p-3 rounded-xl border border-stone-200 text-stone-700 text-xs leading-relaxed font-medium">
                「{r.content}」
              </p>

              <div className="flex justify-between items-center pt-1 text-[11px]">
                <span className="text-stone-400">專案：{r.projectTitle} ｜ {r.date}</span>
                {!isUnderReview && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedReview(r);
                      setDisputeInput("");
                    }}
                    className="text-stone-500 hover:text-rose-600 font-bold cursor-pointer"
                  >
                    🚩 檢舉不實評價 / 申訴隔離
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selectedReview && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleConfirmDispute}
            className="bg-white border border-stone-300 max-w-md w-full p-6 rounded-2xl shadow-2xl space-y-4"
          >
            <h4 className="font-bold text-stone-900 text-sm">提出不實評價申訴</h4>
            <p className="text-stone-500 text-xs">申訴對象：{selectedReview.authorName}</p>
            <textarea
              rows={4}
              required
              value={disputeInput}
              onChange={(e) => setDisputeInput(e.target.value)}
              placeholder="說明申訴事由（如：惡意抹黑、無故給予不實低分）..."
              className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs outline-none"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedReview(null)}
                className="px-4 py-2 bg-stone-200 text-stone-700 rounded-xl font-bold cursor-pointer"
              >
                取消
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-rose-600 text-white rounded-xl font-bold cursor-pointer"
              >
                確認送出並隔離
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}