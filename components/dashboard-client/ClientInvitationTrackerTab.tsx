"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CollaborationInvite, InvitationStatus } from "../../types/invitation";

interface ClientInvitationTrackerTabProps {
  clientCompanyName: string;
  invitations: CollaborationInvite[];
  onAcceptInvite: (invite: CollaborationInvite) => void;
  onDeclineInvite: (inviteId: string) => void;
  onCancelSentInvite: (inviteId: string) => void;
}

const STATUS_BADGES: Record<InvitationStatus, { label: string; bg: string; text: string }> = {
  pending: { label: "⏳ 等待回覆中", bg: "bg-amber-50 border-amber-300", text: "text-amber-800" },
  accepted: { label: "✅ 對方已同意", bg: "bg-emerald-50 border-emerald-300", text: "text-emerald-800" },
  declined: { label: "✕ 已婉拒", bg: "bg-stone-100 border-stone-300", text: "text-stone-600" },
  expired: { label: "⏱️ 已逾期失效", bg: "bg-stone-100 border-stone-200", text: "text-stone-400" },
};

export default function ClientInvitationTrackerTab({
  clientCompanyName,
  invitations,
  onAcceptInvite,
  onDeclineInvite,
  onCancelSentInvite,
}: ClientInvitationTrackerTabProps) {
  const [subTab, setSubTab] = useState<"sent" | "received">("sent");

  const sentInvites = invitations.filter((i) => i.senderRole === "client");
  const receivedInvites = invitations.filter((i) => i.recipientRole === "client");

  const pendingSentCount = sentInvites.filter((i) => i.status === "pending").length;
  const pendingReceivedCount = receivedInvites.filter((i) => i.status === "pending").length;

  const currentList = subTab === "sent" ? sentInvites : receivedInvites;

  return (
    <div className="space-y-4 text-xs">
      {/* 頂部切換面板與統計總覽 */}
      <div className="bg-white border border-stone-300 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
            <span>📫</span>
            <span>品牌專屬合作邀約追蹤看板</span>
          </h3>
          <p className="text-stone-600 text-[11px] mt-0.5 font-medium">
            追蹤品牌主動向指定模特/攝影師發出的定向邀約進度，並審核創作者主動寄送的品牌商案提案。點選人名可直達個人專屬檔案！
          </p>
        </div>

        <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-300">
          <button
            type="button"
            onClick={() => setSubTab("sent")}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
              subTab === "sent"
                ? "bg-white text-indigo-700 shadow-2xs"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <span>📤 品牌定向邀約</span>
            {pendingSentCount > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-500 text-white rounded-full text-[10px] font-bold">
                {pendingSentCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setSubTab("received")}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
              subTab === "received"
                ? "bg-white text-indigo-700 shadow-2xs"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <span>📥 創作者商業提案</span>
            {pendingReceivedCount > 0 && (
              <span className="px-1.5 py-0.2 bg-rose-500 text-white rounded-full text-[10px] font-bold animate-pulse">
                {pendingReceivedCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* 列表內容 */}
      {currentList.length === 0 ? (
        <div className="p-12 text-center bg-white border border-dashed border-stone-300 rounded-2xl text-stone-500 font-medium">
          {subTab === "sent"
            ? "目前沒有品牌主動定向發出的邀約。至探索大廳尋找模特或攝影師發出商案邀請後，進度將呈現在此！"
            : "目前暫無創作者主動投遞的商業專案提案。"}
        </div>
      ) : (
        <div className="space-y-3">
          {currentList.map((item) => {
            const badge = STATUS_BADGES[item.status];
            const isSent = subTab === "sent";
            const targetName = isSent ? item.recipientName : item.senderName;
            const targetRole = isSent ? item.recipientRole : item.senderRole;
            const targetRoleLabel = targetRole === "model" ? "👩‍🦰 模特" : "📸 攝影師";
            const profileLink = targetRole === "model"
              ? `/model/${encodeURIComponent(targetName)}`
              : `/photographer/${encodeURIComponent(targetName)}`;

            return (
              <div
                key={item.id}
                className="bg-white border border-stone-300 rounded-2xl p-5 shadow-2xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-stone-200 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-stone-500 text-xs">
                        {isSent ? "定向邀請對象：" : "提案創作者："}
                      </span>
                      {/* ★ 人名超連結，點擊直接連到模特或攝影主頁 ★ */}
                      <Link
                        href={profileLink}
                        className="font-bold text-stone-950 hover:text-indigo-600 hover:underline text-sm flex items-center gap-1 group transition"
                      >
                        <span>{targetName}</span>
                        <span className="text-[10px] text-indigo-500 group-hover:translate-x-0.5 transition-transform">➔</span>
                      </Link>
                      <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-stone-100 text-stone-700 border border-stone-300">
                        {targetRoleLabel}
                      </span>
                    </div>
                    <p className="text-stone-500 text-[11px] mt-0.5">
                      發起時間：{item.createdAt} ｜ 專案主題：<strong className="text-stone-800">{item.projectTitle}</strong>
                    </p>
                  </div>

                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${badge.bg} ${badge.text}`}>
                    {badge.label}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-[#fbfaf8] p-3 rounded-xl border border-stone-200 text-stone-700">
                  <div>📅 預計拍攝日期：<strong className="text-stone-900 font-mono">{item.proposedDate}</strong></div>
                  <div>💰 專案預算：<strong className="text-indigo-700 font-bold font-mono">{item.proposedBudget}</strong></div>
                  <div className="sm:col-span-2 text-[11px] text-stone-600 pt-1.5 border-t border-stone-200">
                    💬 <strong>邀約內容備註：</strong>「{item.message}」
                  </div>
                </div>

                <div className="flex justify-end items-center gap-2 pt-1">
                  {isSent && item.status === "pending" && (
                    <button
                      type="button"
                      onClick={() => onCancelSentInvite(item.id)}
                      className="px-3 py-1.5 bg-stone-100 hover:bg-rose-50 hover:text-rose-700 text-stone-600 rounded-lg font-bold transition cursor-pointer border border-stone-300 text-xs"
                    >
                      撤回邀約
                    </button>
                  )}

                  {!isSent && item.status === "pending" && (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => onAcceptInvite(item)}
                        className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold transition cursor-pointer shadow-2xs text-xs"
                      >
                        ✓ 接受提案並建立商案協作室
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeclineInvite(item.id)}
                        className="px-3 py-1.5 bg-stone-200 hover:bg-rose-100 hover:text-rose-700 text-stone-700 rounded-lg font-bold transition cursor-pointer text-xs"
                      >
                        婉拒提案
                      </button>
                    </div>
                  )}

                  {item.status === "accepted" && (
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                      <span>🤝</span>
                      <span>雙方已達成共識，專案已同步至「履約協作室」</span>
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