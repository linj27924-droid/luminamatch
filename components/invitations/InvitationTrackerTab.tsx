"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CollaborationInvite, InvitationStatus } from "../../types/invitation";

interface InvitationTrackerTabProps {
  currentUserId: string;
  currentUserRole: "model" | "photographer" | "client";
  invitations: CollaborationInvite[];
  onAcceptInvite: (inviteId: string) => void;
  onDeclineInvite: (inviteId: string) => void;
  onCancelInvite: (inviteId: string) => void;
}

const STATUS_BADGES: Record<InvitationStatus, { label: string; bg: string; text: string }> = {
  pending: { label: "⏳ 等待回覆中", bg: "bg-amber-50 border-amber-300", text: "text-amber-800" },
  accepted: { label: "✅ 對方已同意", bg: "bg-emerald-50 border-emerald-300", text: "text-emerald-800" },
  declined: { label: "✕ 已婉拒", bg: "bg-stone-100 border-stone-300", text: "text-stone-600" },
  expired: { label: "⏱️ 已逾期失效", bg: "bg-stone-100 border-stone-200", text: "text-stone-400" },
};

export default function InvitationTrackerTab({
  currentUserId,
  currentUserRole,
  invitations,
  onAcceptInvite,
  onDeclineInvite,
  onCancelInvite,
}: InvitationTrackerTabProps) {
  const [subTab, setSubTab] = useState<"sent" | "received">("sent");

  const sentInvites = invitations.filter((i) => i.senderId === currentUserId);
  const receivedInvites = invitations.filter((i) => i.recipientId === currentUserId);
  const currentList = subTab === "sent" ? sentInvites : receivedInvites;

  return (
    <div className="space-y-4 text-xs">
      {/* 頂部切換鈕：我發出的邀約 vs 我收到的邀約 */}
      <div className="bg-white border border-stone-300 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
            <span>📫</span>
            <span>合作邀約進度追蹤</span>
          </h3>
          <p className="text-stone-600 text-[11px] mt-0.5">
            即時追蹤主動邀約的對象與進度，避免重覆發案或遺漏未回覆的請求。
          </p>
        </div>

        <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-300">
          <button
            type="button"
            onClick={() => setSubTab("sent")}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              subTab === "sent" ? "bg-white text-stone-900 shadow-2xs" : "text-stone-600 hover:text-stone-900"
            }`}
          >
            📤 我發出的 ({sentInvites.length})
          </button>
          <button
            type="button"
            onClick={() => setSubTab("received")}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              subTab === "received" ? "bg-white text-stone-900 shadow-2xs" : "text-stone-600 hover:text-stone-900"
            }`}
          >
            📥 我收到的 ({receivedInvites.length})
          </button>
        </div>
      </div>

      {/* 列表內容 */}
      {currentList.length === 0 ? (
        <div className="p-12 text-center bg-white border border-dashed border-stone-300 rounded-2xl text-stone-500 font-medium">
          {subTab === "sent"
            ? "目前沒有主動發出的邀約紀錄。至探索大廳或個人主頁發出邀約後，進度將即時更新於此！"
            : "目前尚未收到任何合作邀約。"}
        </div>
      ) : (
        <div className="space-y-3">
          {currentList.map((item) => {
            const badge = STATUS_BADGES[item.status];
            const isSent = subTab === "sent";
            const targetName = isSent ? item.recipientName : item.senderName;
            const targetRoleLabel = isSent
              ? item.recipientRole === "model" ? "模特" : item.recipientRole === "photographer" ? "攝影師" : "品牌業主"
              : item.senderRole === "model" ? "模特" : item.senderRole === "photographer" ? "攝影師" : "品牌業主";

            return (
              <div
                key={item.id}
                className="bg-white border border-stone-300 rounded-2xl p-4 shadow-2xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-stone-200 pb-2.5">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-stone-900 text-sm">
                        {isSent ? `邀約對象：${targetName}` : `來自：${targetName}`}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-stone-100 text-stone-700 border border-stone-300">
                        {targetRoleLabel}
                      </span>
                    </div>
                    <p className="text-stone-500 text-[11px]">
                      發起時間：{item.createdAt} ｜ 專案主題：<strong>{item.projectTitle}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${badge.bg} ${badge.text}`}>
                      {badge.label}
                    </span>
                  </div>
                </div>

                {/* 邀約核心條件 */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-stone-50 p-2.5 rounded-xl border border-stone-200 text-stone-700">
                  <div>📅 提議日期：<strong className="text-stone-900 font-mono">{item.proposedDate}</strong></div>
                  <div>💰 提議預算：<strong className="text-indigo-700 font-bold font-mono">{item.proposedBudget}</strong></div>
                  <div className="sm:col-span-3 text-[11px] text-stone-600 pt-1 border-t border-stone-200">
                    💬 <strong>邀約內容：</strong>「{item.message}」
                  </div>
                </div>

                {/* 操作動作 */}
                <div className="flex justify-end items-center gap-2 pt-1">
                  {isSent && item.status === "pending" && (
                    <button
                      type="button"
                      onClick={() => onCancelInvite(item.id)}
                      className="px-3 py-1.5 bg-stone-100 hover:bg-rose-50 hover:text-rose-700 text-stone-600 rounded-lg font-bold transition cursor-pointer border border-stone-300"
                    >
                      撤回邀約
                    </button>
                  )}

                  {!isSent && item.status === "pending" && (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => onAcceptInvite(item.id)}
                        className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold transition cursor-pointer shadow-2xs"
                      >
                        ✓ 接受邀約並開啟協作室
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeclineInvite(item.id)}
                        className="px-3 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-lg font-bold transition cursor-pointer"
                      >
                        婉拒
                      </button>
                    </div>
                  )}

                  {item.status === "accepted" && (
                    <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                      <span>🤝</span>
                      <span>已進入履約協作室流程</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}