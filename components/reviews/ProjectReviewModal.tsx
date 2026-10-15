"use client";

import React, { useState } from "react";

export interface ReviewSubmitData {
  caseNumber: string;
  targetName: string;
  rating: number;
  publicTags: string[];
  publicComment: string;
  isPeerNoteEnabled: boolean;
  peerNoteContent: string;
  isReportEnabled: boolean;
  reportReason: string;
  reportDetails: string;
  submittedAt: string;
}

interface ProjectReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseNumber: string;
  targetName: string; // 被評價對象（例如模特姓名）
  targetRole?: "model" | "photographer";
  onSubmitReview?: (data: ReviewSubmitData) => void;
}

const PRESET_TAGS = [
  "極度守時",
  "動作引導精準",
  "尊重安全邊界",
  "溝通順暢",
  "神態與表現力極佳",
  "妝造配合度高",
  "誠信履約無爭議",
];

const REPORT_REASONS = [
  "現場放鳥未到 (No-Show)",
  "提出非約定尺度或暴露要求",
  "發生非必要肢體碰觸或界線違規",
  "未依約履行款項或成品交付",
  "言語騷擾或私訊騷擾",
  "其他嚴重違規事項",
];

export default function ProjectReviewModal({
  isOpen,
  onClose,
  caseNumber,
  targetName,
  targetRole = "model",
  onSubmitReview,
}: ProjectReviewModalProps) {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [selectedTags, setSelectedTags] = useState<string[]>(["極度守時", "尊重安全邊界"]);
  const [publicComment, setPublicComment] = useState("");

  // 同業手札（同行限定防踩雷）
  const [isPeerNoteEnabled, setIsPeerNoteEnabled] = useState(false);
  const [peerNoteContent, setPeerNoteContent] = useState("");

  // 履約違規檢舉
  const [isReportEnabled, setIsReportEnabled] = useState(false);
  const [reportReason, setReportReason] = useState(REPORT_REASONS[0]);
  const [reportDetails, setReportDetails] = useState("");

  if (!isOpen) return null;

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data: ReviewSubmitData = {
      caseNumber,
      targetName,
      rating,
      publicTags: selectedTags,
      publicComment: publicComment.trim(),
      isPeerNoteEnabled,
      peerNoteContent: peerNoteContent.trim(),
      isReportEnabled,
      reportReason: isReportEnabled ? reportReason : "",
      reportDetails: isReportEnabled ? reportDetails.trim() : "",
      submittedAt: new Date().toISOString(),
    };

    // 儲存至 LocalStorage 存證
    try {
      const savedReviews = localStorage.getItem("lumina_project_reviews");
      const list = savedReviews ? JSON.parse(savedReviews) : [];
      localStorage.setItem("lumina_project_reviews", JSON.stringify([data, ...list]));
    } catch (err) {
      console.error(err);
    }

    if (onSubmitReview) onSubmitReview(data);

    alert(`✅ 已成功提交案件【#${caseNumber}】的履約存證評價！${isReportEnabled ? "\n🚨 違規檢舉存證已同步通報管理處列管！" : ""}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#fbfaf8] border border-stone-200 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* 標題欄 */}
        <div className="p-5 border-b border-stone-200 flex justify-between items-center bg-white rounded-t-2xl sticky top-0 z-10">
          <div>
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
              <span>⭐</span>
              <span>外拍履約存證評價與同業手札</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              案件號：<strong className="font-mono text-stone-800">#{caseNumber}</strong> ｜ 對象：<strong>{targetName}</strong>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 flex items-center justify-center font-bold text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 text-xs">
          {/* 1. 星級評分 */}
          <div className="bg-white p-4 rounded-xl border border-stone-200 text-center space-y-2">
            <span className="block text-xs font-bold text-stone-700">本次整體合作體驗評分</span>
            <div className="flex justify-center items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="text-2xl transition cursor-pointer p-1"
                >
                  <span className={(hoverRating || rating) >= star ? "text-amber-400" : "text-stone-300"}>
                    ★
                  </span>
                </button>
              ))}
            </div>
            <span className="text-[11px] font-bold text-stone-600 block">
              {rating === 5 && "5.0 - 極度滿意，專業且完全符合期待"}
              {rating === 4 && "4.0 - 良好，合作愉快順利"}
              {rating === 3 && "3.0 - 普通，有部分待磨合細節"}
              {rating <= 2 && "體驗不佳，建議參考細部說明"}
            </span>
          </div>

          {/* 2. 快捷標籤 */}
          <div className="space-y-2">
            <label className="block font-bold text-stone-800">
              🏷️ 合作特質標籤（公開展示）
            </label>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition cursor-pointer ${
                      isSelected
                        ? "bg-indigo-50 text-indigo-700 border-indigo-300 font-bold"
                        : "bg-white text-stone-600 border-stone-300 hover:bg-stone-50"
                    }`}
                  >
                    {isSelected ? `✓ ${tag}` : `+ ${tag}`}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. 公開短評 */}
          <div className="space-y-1.5">
            <label className="block font-bold text-stone-800">
              💬 公開短評（展示於對象公開頁作品區）
            </label>
            <textarea
              rows={3}
              value={publicComment}
              onChange={(e) => setPublicComment(e.target.value)}
              placeholder="留下對本次約拍合作的評價與感謝..."
              className="w-full bg-white text-stone-800 border border-stone-300 rounded-xl p-3 outline-none focus:border-indigo-500 leading-relaxed"
            />
          </div>

          {/* 4. 軌道二：同業存證手札（同業限定防踩雷，被評者不可見） */}
          <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-3">
            <div className="flex justify-between items-center">
              <label className="font-bold text-amber-950 flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPeerNoteEnabled}
                  onChange={(e) => setIsPeerNoteEnabled(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                <span>📜 撰寫同業限定手札（防踩雷備忘）</span>
              </label>
              <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-bold">
                僅同業認證可見
              </span>
            </div>
            <p className="text-[11px] text-amber-800/80 leading-relaxed">
              此備忘<strong>被評價者完全不可見</strong>，僅供平台通過履約認證之同業攝影師查閱，可誠實記錄守時程度、臨時變動等真實狀況，避免人情壓力。
            </p>

            {isPeerNoteEnabled && (
              <textarea
                rows={3}
                value={peerNoteContent}
                onChange={(e) => setPeerNoteContent(e.target.value)}
                placeholder="寫下給同行的真實提醒（例如：對方時間觀念、動作習慣、溝通細節等）..."
                className="w-full bg-white text-stone-800 border border-amber-300 rounded-lg p-2.5 outline-none focus:border-amber-500 text-xs"
              />
            )}
          </div>

          {/* 5. 軌道三：違規檢舉存證 */}
          <div className="p-4 bg-rose-50/60 border border-rose-200 rounded-xl space-y-3">
            <label className="font-bold text-rose-950 flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={isReportEnabled}
                onChange={(e) => setIsReportEnabled(e.target.checked)}
                className="rounded text-rose-600 focus:ring-rose-500"
              />
              <span>🚨 提出違規存證檢舉（通報平台管理處列管）</span>
            </label>

            {isReportEnabled && (
              <div className="space-y-2.5 pt-1">
                <div>
                  <span className="block text-[11px] font-bold text-rose-900 mb-1">違規事項類別</span>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full bg-white text-stone-800 border border-rose-300 rounded-lg p-2 outline-none focus:border-rose-500 text-xs"
                  >
                    {REPORT_REASONS.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <span className="block text-[11px] font-bold text-rose-900 mb-1">違規事證補充</span>
                  <textarea
                    rows={2}
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    placeholder="請簡述違規情事，案件簽到時間與對話記錄將自動作為附件送審..."
                    className="w-full bg-white text-stone-800 border border-rose-300 rounded-lg p-2 outline-none focus:border-rose-500 text-xs"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 底部按鈕 */}
          <div className="flex justify-end gap-2 pt-2 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-stone-200 text-stone-700 rounded-xl text-xs font-bold hover:bg-stone-300 transition cursor-pointer"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <span>🔒 送出存證評價</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}