"use client";

import React from "react";
import Link from "next/link";
import { JobPosting, JobApplicant } from "@/types/job";

interface ApplicantReviewTabProps {
  jobs: JobPosting[];
  onUpdateApplicantStatus: (jobId: string, applicantId: string, status: "hired" | "declined") => void;
}

export default function ApplicantReviewTab({ jobs, onUpdateApplicantStatus }: ApplicantReviewTabProps) {
  const allApplicantsWithJob = jobs.flatMap((j) =>
    j.applicants.map((app) => ({ ...app, jobTitle: j.title, jobId: j.id }))
  );

  return (
    <div className="bg-white border border-stone-300 rounded-2xl p-6 shadow-sm space-y-5 text-xs">
      <div className="border-b border-stone-200 pb-3 flex justify-between items-center">
        <div>
          <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
            <span>📥</span>
            <span>應徵者審查牆 ({allApplicantsWithJob.length})</span>
          </h3>
          <p className="text-stone-600 text-[11px] mt-0.5 font-medium">
            即時檢視前來應徵的模特與攝影師，點擊名字可直接查閱個人主頁與作品手札。
          </p>
        </div>
      </div>

      {allApplicantsWithJob.length === 0 ? (
        <div className="p-12 text-center bg-[#fbfaf8] border border-dashed border-stone-300 rounded-xl text-stone-500 font-medium">
          目前尚無應徵投遞。當模特或攝影師在商案大廳應徵您的專案時，名單會即時呈現於此。
        </div>
      ) : (
        <div className="space-y-3">
          {allApplicantsWithJob.map((app) => {
            const isHired = app.status === "hired";
            const isDeclined = app.status === "declined";
            const profileLink =
              app.applicantRole === "model"
                ? `/model/${encodeURIComponent(app.applicantName)}`
                : `/photographer/${encodeURIComponent(app.applicantName)}`;

            return (
              <div
                key={app.id}
                className="p-5 bg-white border border-stone-300 rounded-2xl space-y-3 shadow-2xs hover:border-stone-400 transition"
              >
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={app.avatar}
                      alt={app.applicantName}
                      className="w-10 h-10 rounded-full object-cover border border-stone-300 shadow-2xs shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* 名字點擊超連結 */}
                        <Link
                          href={profileLink}
                          target="_blank"
                          className="font-bold text-stone-950 hover:text-indigo-600 text-sm flex items-center gap-1 group transition"
                        >
                          <span>{app.applicantName}</span>
                          <span className="text-[10px] text-indigo-500 group-hover:translate-x-0.5 transition-transform">➔</span>
                        </Link>

                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            app.applicantRole === "model"
                              ? "bg-rose-50 text-rose-700 border-rose-200"
                              : "bg-indigo-50 text-indigo-700 border-indigo-200"
                          }`}
                        >
                          {app.applicantRole === "model" ? "👩‍🦰 模特" : "📸 攝影師"}
                        </span>
                      </div>

                      <div className="text-[11px] text-stone-600 mt-0.5">
                        應徵案件：<strong className="text-stone-800">{app.jobTitle}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 self-end sm:self-auto">
                    <span className="font-mono text-indigo-800 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-lg font-bold text-xs">
                      提案報價：{app.proposedPrice}
                    </span>

                    {isHired ? (
                      <span className="px-3 py-1.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg font-bold text-xs">
                        ✓ 已錄用並開闢協作室
                      </span>
                    ) : isDeclined ? (
                      <span className="px-3 py-1.5 bg-stone-100 text-stone-600 border border-stone-300 rounded-lg font-bold text-xs">
                        ✕ 已婉拒
                      </span>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => onUpdateApplicantStatus(app.jobId, app.id, "hired")}
                          className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold transition cursor-pointer shadow-2xs text-xs"
                        >
                          錄用並簽約
                        </button>
                        <button
                          type="button"
                          onClick={() => onUpdateApplicantStatus(app.jobId, app.id, "declined")}
                          className="px-3 py-1.5 bg-stone-100 hover:bg-rose-50 hover:text-rose-700 text-stone-700 border border-stone-300 rounded-lg font-bold transition cursor-pointer text-xs"
                        >
                          婉拒
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-[#fbfaf8] p-3 rounded-xl border border-stone-200 text-stone-700 leading-relaxed text-[11px]">
                  💬 <strong>應徵自薦信：</strong>「{app.pitchNote}」
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}