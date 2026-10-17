"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CollaborationInvite, InvitationStatus } from "../../types/invitation";

export interface BookingRequestItem {
  id: string;
  photographerName: string;
  photographerRating: number;
  photographerHistoryCount: number;
  completionRate: string;
  noShowCount: number;
  date: string;
  timeSlot: string;
  location: string;
  style: string;
  coopType: "互惠創作 (TFCD)" | "商業有酬";
  remuneration?: string;
  notes: string;
  status: "pending" | "accepted" | "declined" | "completed";
  customContractText?: string;
  modelReplyMessage?: string;
  hasReviewed?: boolean;
}

interface ModelInvitationTrackerTabProps {
  currentModelId: string;
  currentModelName: string;
  invitations: CollaborationInvite[];
  bookingRequests: BookingRequestItem[];
  onAcceptBooking: (req: BookingRequestItem, contractText: string, replyMessage: string) => void;
  onDeclineBooking: (reqId: string, reason: string) => void;
  onSubmitReview: (reqId: string, score: number, content: string) => void;
  onCancelSentInvite: (inviteId: string) => void;
  commercialContractBody: string;
  templateContractBody: string;
  templateAcceptMessage: string;
  templateDeclineMessage: string;
}

const STATUS_BADGES: Record<InvitationStatus, { label: string; bg: string; text: string }> = {
  pending: { label: "⏳ 等待回覆中", bg: "bg-amber-50 border-amber-300", text: "text-amber-800" },
  accepted: { label: "✅ 對方已同意", bg: "bg-emerald-50 border-emerald-300", text: "text-emerald-800" },
  declined: { label: "✕ 已婉拒", bg: "bg-stone-100 border-stone-300", text: "text-stone-600" },
  expired: { label: "⏱️ 已逾期失效", bg: "bg-stone-100 border-stone-200", text: "text-stone-400" },
};

export default function ModelInvitationTrackerTab({
  currentModelId,
  currentModelName,
  invitations,
  bookingRequests,
  onAcceptBooking,
  onDeclineBooking,
  onSubmitReview,
  onCancelSentInvite,
  commercialContractBody,
  templateContractBody,
  templateAcceptMessage,
  templateDeclineMessage,
}: ModelInvitationTrackerTabProps) {
  // 子分頁：被動邀約審核 (received) vs 我主動發出 (sent)
  const [subTab, setSubTab] = useState<"received" | "sent">("received");

  // 彈窗狀態
  const [selectedReq, setSelectedReq] = useState<BookingRequestItem | null>(null);
  const [modalType, setModalType] = useState<"accept" | "decline" | "review" | null>(null);

  const [contractText, setContractText] = useState("");
  const [replyMessage, setReplyMessage] = useState("");
  const [declineReason, setDeclineReason] = useState("");

  const [reviewScore, setReviewScore] = useState(5.0);
  const [reviewContent, setReviewContent] = useState("");

  // 待處理統計
  const pendingReceivedCount = bookingRequests.filter((r) => r.status === "pending").length;
  const pendingSentCount = invitations.filter((i) => i.senderRole === "model" && i.status === "pending").length;

  // 我主動發出的邀約清單
  const sentInvites = invitations.filter((i) => i.senderRole === "model");

  const openAcceptModal = (req: BookingRequestItem) => {
    setSelectedReq(req);
    setModalType("accept");
    setContractText(req.coopType === "商業有酬" ? commercialContractBody : templateContractBody);
    setReplyMessage(templateAcceptMessage);
  };

  const openDeclineModal = (req: BookingRequestItem) => {
    setSelectedReq(req);
    setModalType("decline");
    setDeclineReason(templateDeclineMessage);
  };

  const openReviewModal = (req: BookingRequestItem) => {
    setSelectedReq(req);
    setModalType("review");
    setReviewScore(5.0);
    setReviewContent("合作非常順利且尊重個人邊界，動作口頭引導精準，非常推薦！");
  };

  const handleConfirmAccept = () => {
    if (!selectedReq) return;
    onAcceptBooking(selectedReq, contractText, replyMessage);
    setModalType(null);
    setSelectedReq(null);
  };

  const handleConfirmDecline = () => {
    if (!selectedReq) return;
    onDeclineBooking(selectedReq.id, declineReason);
    setModalType(null);
    setSelectedReq(null);
  };

  const handleConfirmReview = () => {
    if (!selectedReq) return;
    onSubmitReview(selectedReq.id, reviewScore, reviewContent);
    setModalType(null);
    setSelectedReq(null);
  };

  return (
    <div className="space-y-4 text-xs">
      {/* 頂部切換面板與統計總覽 */}
      <div className="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <span>📫</span>
            <span>合作邀約進度與審核看板</span>
          </h3>
          <p className="text-stone-600 dark:text-stone-400 text-[11px] mt-0.5">
            在此集中處理所有攝影師/品牌方的約拍提案，並追蹤自己主動發出的合作進度。
          </p>
        </div>

        {/* 切換標籤（附紅點統計） */}
        <div className="flex bg-stone-100 dark:bg-stone-800 p-1 rounded-xl border border-stone-300 dark:border-stone-700">
          <button
            type="button"
            onClick={() => setSubTab("received")}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
              subTab === "received"
                ? "bg-white dark:bg-stone-900 text-indigo-700 dark:text-indigo-400 shadow-2xs"
                : "text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white"
            }`}
          >
            <span>📥 收到的約拍審核</span>
            {pendingReceivedCount > 0 && (
              <span className="px-1.5 py-0.2 bg-rose-500 text-white rounded-full text-[10px] font-bold animate-pulse">
                {pendingReceivedCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setSubTab("sent")}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
              subTab === "sent"
                ? "bg-white dark:bg-stone-900 text-indigo-700 dark:text-indigo-400 shadow-2xs"
                : "text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white"
            }`}
          >
            <span>📤 我主動發出的邀約</span>
            {pendingSentCount > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-500 text-white rounded-full text-[10px] font-bold">
                {pendingSentCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ==================== 1. 收到的約拍審核 (received) ==================== */}
      {subTab === "received" && (
        <div className="space-y-3">
          {bookingRequests.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-stone-900 border border-dashed border-stone-300 dark:border-stone-800 rounded-2xl text-stone-500 font-medium">
              目前尚無待審核的約拍邀請。
            </div>
          ) : (
            bookingRequests.map((req) => (
              <div
                key={req.id}
                className="p-5 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-2xl space-y-3 shadow-2xs"
              >
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/photographer/${encodeURIComponent(req.photographerName)}`}
                        className="font-bold text-stone-900 dark:text-stone-100 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm"
                      >
                        {req.photographerName} ➔
                      </Link>
                      <span className="text-[10px] bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
                        ★ {req.photographerRating.toFixed(1)} (履約率 {req.completionRate})
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                      📅 預定日期：{req.date} ｜ ⏰ 時段：{req.timeSlot}
                    </p>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full border self-start sm:self-auto ${
                      req.status === "accepted"
                        ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                        : req.status === "declined"
                        ? "bg-rose-50 text-rose-800 border-rose-300"
                        : "bg-amber-50 text-amber-800 border-amber-300 animate-pulse"
                    }`}
                  >
                    {req.status === "accepted" ? "✓ 已同意並簽約" : req.status === "declined" ? "✕ 已婉拒" : "⏳ 待您審核"}
                  </span>
                </div>

                {/* 提案內容明細 */}
                <div className="bg-[#fbfaf8] dark:bg-stone-800/60 p-3.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs space-y-1.5 text-stone-700 dark:text-stone-300">
                  <div className="flex justify-between">
                    <span className="text-stone-500 dark:text-stone-400">合作性質：</span>
                    <strong className="text-stone-900 dark:text-stone-100">{req.coopType} {req.remuneration && `(${req.remuneration})`}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500 dark:text-stone-400">拍攝地點：</span>
                    <strong className="text-stone-900 dark:text-stone-100">{req.location}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500 dark:text-stone-400">風格設定：</span>
                    <strong className="text-stone-900 dark:text-stone-100">{req.style}</strong>
                  </div>
                  <p className="text-stone-600 dark:text-stone-400 pt-1.5 border-t border-stone-200 dark:border-stone-700 text-[11px] leading-relaxed">
                    💬 <strong>提案信：</strong>「{req.notes}」
                  </p>
                </div>

                {/* 操作動作按鈕 */}
                <div className="flex justify-end gap-2 pt-1">
                  {req.status === "pending" && (
                    <>
                      <button
                        type="button"
                        onClick={() => openAcceptModal(req)}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-2xs"
                      >
                        ✓ 同意約拍 (簽署存證合約)
                      </button>
                      <button
                        type="button"
                        onClick={() => openDeclineModal(req)}
                        className="px-3.5 py-2 bg-stone-200 dark:bg-stone-800 hover:bg-rose-100 hover:text-rose-700 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-bold transition cursor-pointer"
                      >
                        婉拒
                      </button>
                    </>
                  )}

                  {req.status === "accepted" && !req.hasReviewed && (
                    <button
                      type="button"
                      onClick={() => openReviewModal(req)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      ⭐ 填寫同行評價 (存證手札)
                    </button>
                  )}

                  {req.status === "accepted" && req.hasReviewed && (
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold py-1.5 flex items-center gap-1">
                      <span>✓</span> 已完成同行評價
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ==================== 2. 我主動發出的邀約 (sent) ==================== */}
      {subTab === "sent" && (
        <div className="space-y-3">
          {sentInvites.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-stone-900 border border-dashed border-stone-300 dark:border-stone-800 rounded-2xl text-stone-500 font-medium">
              目前沒有向外發出的合作邀約紀錄。至探索大廳尋找心儀的攝影師或品牌發出邀約後，進度將呈現在此！
            </div>
          ) : (
            sentInvites.map((item) => {
              const badge = STATUS_BADGES[item.status];
              const targetRoleLabel = item.recipientRole === "photographer" ? "📸 攝影師" : "🏢 品牌業主";

              return (
                <div
                  key={item.id}
                  className="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-2xl p-5 shadow-2xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                          邀約對象：{item.recipientName}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-300 dark:border-stone-700">
                          {targetRoleLabel}
                        </span>
                      </div>
                      <p className="text-stone-500 dark:text-stone-400 text-[11px] mt-0.5">
                        發起時間：{item.createdAt} ｜ 專案主題：<strong>{item.projectTitle}</strong>
                      </p>
                    </div>

                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${badge.bg} ${badge.text}`}>
                      {badge.label}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-[#fbfaf8] dark:bg-stone-800/60 p-3 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300">
                    <div>📅 提議日期：<strong className="text-stone-900 dark:text-stone-100 font-mono">{item.proposedDate}</strong></div>
                    <div>💰 提議預算：<strong className="text-indigo-600 dark:text-indigo-400 font-bold font-mono">{item.proposedBudget}</strong></div>
                    <div className="sm:col-span-2 text-[11px] text-stone-600 dark:text-stone-400 pt-1.5 border-t border-stone-200 dark:border-stone-700">
                      💬 <strong>邀約內容備註：</strong>「{item.message}」
                    </div>
                  </div>

                  <div className="flex justify-end items-center gap-2 pt-1">
                    {item.status === "pending" && (
                      <button
                        type="button"
                        onClick={() => onCancelSentInvite(item.id)}
                        className="px-3 py-1.5 bg-stone-100 hover:bg-rose-50 hover:text-rose-700 text-stone-600 dark:bg-stone-800 dark:text-stone-300 rounded-lg font-bold transition cursor-pointer border border-stone-300 dark:border-stone-700 text-xs"
                      >
                        撤回邀約
                      </button>
                    )}
                    {item.status === "accepted" && (
                      <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                        <span>🤝</span>
                        <span>對方已同意，專案已同步至「合作協作室」</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ==================== 彈窗區塊 (同意、婉拒、評價) ==================== */}
      {modalType === "accept" && selectedReq && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#fbfaf8] dark:bg-stone-900 border border-stone-200 dark:border-stone-800 max-w-xl w-full p-6 rounded-2xl space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
              確認同意與【{selectedReq.photographerName}】的約拍協議
            </h3>
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                存證合約條款 (已自動依【{selectedReq.coopType}】帶入模板)：
              </label>
              <textarea
                rows={8}
                value={contractText}
                onChange={(e) => setContractText(e.target.value)}
                className="w-full text-xs font-mono bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-700 rounded-xl p-3 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                回覆給攝影師的留言：
              </label>
              <textarea
                rows={3}
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                className="w-full text-xs bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-700 rounded-xl p-3 outline-none"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setModalType(null)}
                className="px-4 py-2 bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-bold cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirmAccept}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                正式簽署並發送同意
              </button>
            </div>
          </div>
        </div>
      )}

      {modalType === "decline" && selectedReq && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#fbfaf8] dark:bg-stone-900 border border-stone-200 dark:border-stone-800 max-w-md w-full p-6 rounded-2xl space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
              婉拒【{selectedReq.photographerName}】的約拍邀請
            </h3>
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                禮貌婉拒理由：
              </label>
              <textarea
                rows={4}
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                className="w-full text-xs bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-700 rounded-xl p-3 outline-none"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setModalType(null)}
                className="px-4 py-2 bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-bold cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirmDecline}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                確認婉拒
              </button>
            </div>
          </div>
        </div>
      )}

      {modalType === "review" && selectedReq && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#fbfaf8] dark:bg-stone-900 border border-stone-200 dark:border-stone-800 max-w-lg w-full p-6 rounded-2xl space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
              為【{selectedReq.photographerName}】留下同業存證評價
            </h3>
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                守時與安全評分：{reviewScore} 星
              </label>
              <input
                type="range"
                min="1"
                max="5"
                step="0.5"
                value={reviewScore}
                onChange={(e) => setReviewScore(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                詳細評價手札 (給模特同業參考)：
              </label>
              <textarea
                rows={4}
                value={reviewContent}
                onChange={(e) => setReviewContent(e.target.value)}
                className="w-full text-xs bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-700 rounded-xl p-3 outline-none"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setModalType(null)}
                className="px-4 py-2 bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-bold cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirmReview}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                送出同業手札評價
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}