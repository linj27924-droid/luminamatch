"use client";

import React from "react";
import Link from "next/link";
import { JobPosting, JobApplicant } from "../../types/job";

interface ApplicantReviewTabProps {
  jobs: JobPosting[];
  onUpdateApplicantStatus: (jobId: string, applicantId: string, status: "hired" | "declined") => void;
}

export default function ApplicantReviewTab({ jobs, onUpdateApplicantStatus }: ApplicantReviewTabProps) {
  const allApplicantsWithJob = jobs.flatMap((j) =>
    j.applicants.map((app) => ({ ...app, jobTitle: j.title, jobId: j.id }))
  );

  return (
    <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-6 shadow-sm space-y-5 text-xs">
      <div className="border-b border-stone-200 pb-3">
        <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
          <span>📥</span>
          <span>應徵者審查牆 ({allApplicantsWithJob.length})</span>
        </h3>
        <p className="text-stone-500 text-[11px] mt-0.5">即時檢視前來應徵的模特與攝影師，點擊名字可直接查閱個人主頁與履約評價。</p>
      </div>

      {allApplicantsWithJob.length === 0 ? (
        <div className="p-12 text-center bg-[#f5f3ef] border border-dashed border-stone-300 rounded-xl text-stone-400">
          目前尚無應徵投遞。當模特或攝影師在大廳應徵您的專案時，名單會即時呈現於此。
        </div>
      ) : (
        <div className="space-y-3">
          {allApplicantsWithJob.map((app) => {
            const isHired = app.status === "hired";
            const isDeclined = app.status === "declined";

            return (
              <div key={app.id} className="p-4 bg-white border border-stone-200 rounded-xl space-y-2.5 shadow-2xs">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                  <div className="flex items-center gap-2.5">
                    <img src={app.avatar} alt={app.applicantName} className="w-9 h-9 rounded-full object-cover border border-stone-300" />
                    <div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={app.applicantRole === "model" ? `/model/${encodeURIComponent(app.applicantName)}` : `/photographer/${encodeURIComponent(app.applicantName)}`}
                          target="_blank"
                          className="font-bold text-stone-900 hover:text-indigo-600 text-xs"
                        >
                          {app.applicantName} ➔
                        </Link>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${app.applicantRole === "model" ? "bg-rose-50 text-rose-700 border border-rose-200" : "bg-indigo-50 text-indigo-700 border border-indigo-200"}`}>
                          {app.applicantRole === "model" ? "模特" : "攝影師"}
                        </span>
                      </div>
                      <span className="text-[10px] text-stone-400">應徵案件：{app.jobTitle}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono text-stone-700 bg-stone-100 px-2 py-1 rounded font-bold text-[11px]">
                      提案報價：{app.proposedPrice}
                    </span>
                    {isHired ? (
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-lg font-bold text-xs">✓ 已錄用</span>
                    ) : isDeclined ? (
                      <span className="px-3 py-1 bg-stone-200 text-stone-500 rounded-lg font-bold text-xs">✕ 已婉拒</span>
                    ) : (
                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          onClick={() => onUpdateApplicantStatus(app.jobId, app.id, "hired")}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold transition cursor-pointer"
                        >
                          錄用並簽約
                        </button>
                        <button
                          type="button"
                          onClick={() => onUpdateApplicantStatus(app.jobId, app.id, "declined")}
                          className="px-2.5 py-1.5 bg-stone-200 hover:bg-rose-100 hover:text-rose-700 text-stone-700 rounded-lg font-bold transition cursor-pointer"
                        >
                          婉拒
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-[#f5f3ef] p-2.5 rounded-lg border border-stone-200 text-stone-700 leading-relaxed text-[11px]">
                  <strong>應徵自薦信：</strong>「{app.pitchNote}」
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}