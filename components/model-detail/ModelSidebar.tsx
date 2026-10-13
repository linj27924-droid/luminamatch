"use client";

import React from "react";

interface ModelSidebarProps {
  modelCover: string;
  modelFocusY: number;
  modelInfo: {
    name: string;
    city: string;
    height: string;
    weight: string;
    hideWeight: boolean;
    measurements?: string;
    hideMeasurements?: boolean;
    experienceYears: string;
    bio: string;
    styles: string[];
    boundaries: string[];
    companionPolicy: string;
    coopModes: string;
  };
  socialLinks: {
    instagram: string;
    facebook: string;
    threads: string;
    custom1Name: string;
    custom1Url: string;
    custom2Name: string;
    custom2Url: string;
  };
}

export default function ModelSidebar({
  modelCover,
  modelFocusY,
  modelInfo,
  socialLinks,
}: ModelSidebarProps) {
  return (
    <section className="bg-[#fbfaf8] dark:bg-stone-900 p-5 rounded-2xl border border-stone-200/90 dark:border-stone-800 h-fit space-y-5 shadow-sm transition-colors duration-200">
      {/* 1:1 封面照片 */}
      <div className="w-full aspect-square rounded-xl overflow-hidden relative border border-stone-300 dark:border-stone-700 bg-stone-200 dark:bg-stone-800 shadow-xs">
        <img
          src={modelCover}
          alt={modelInfo.name}
          style={{ objectPosition: `center ${modelFocusY}%` }}
          className="w-full h-full object-cover"
        />
        <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/75 backdrop-blur-md text-white rounded text-[10px] font-bold">
          {modelInfo.companionPolicy}
        </span>
        <span className="absolute top-2 right-2 px-2 py-0.5 bg-indigo-600/85 backdrop-blur-md text-white rounded text-[10px] font-bold">
          資歷 {modelInfo.experienceYears} 年
        </span>
      </div>

      {/* 模特基本名片 */}
      <div>
        <div className="flex justify-between items-baseline">
          <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">{modelInfo.name}</h2>
          <span className="text-xs text-stone-600 dark:text-stone-400 font-bold">
            {modelInfo.height} cm / {modelInfo.hideWeight ? "🔒 保密" : `${modelInfo.weight} kg`}
          </span>
        </div>

        <div className="flex justify-between items-center text-xs text-stone-500 dark:text-stone-400 font-medium mt-1">
          <span>{modelInfo.city}</span>
          <span className="text-indigo-700 dark:text-indigo-300 font-bold bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 px-2 py-0.5 rounded text-[11px]">
            接案年資：{modelInfo.experienceYears} 年
          </span>
        </div>

        {/* 三圍資訊 */}
        {!modelInfo.hideMeasurements && modelInfo.measurements && (
          <div className="mt-2 text-[11px] text-stone-600 dark:text-stone-300 font-medium bg-[#f5f3ef] dark:bg-stone-800 px-2.5 py-1 rounded-lg border border-stone-200 dark:border-stone-700 flex items-center justify-between">
            <span className="text-stone-500 dark:text-stone-400">三圍尺寸</span>
            <span className="font-bold text-stone-800 dark:text-stone-200">{modelInfo.measurements}</span>
          </div>
        )}

        {/* 風格標籤 */}
        <div className="mt-3">
          <span className="text-[11px] font-bold text-stone-700 dark:text-stone-300 block mb-1">
            ✨ 擅長拍攝風格標籤：
          </span>
          <div className="flex flex-wrap gap-1.5">
            {modelInfo.styles.map((s) => (
              <span
                key={s}
                className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 rounded-lg text-xs font-bold border border-indigo-200 dark:border-indigo-800 shadow-2xs"
              >
                #{s}
              </span>
            ))}
          </div>
        </div>

        {/* 個人簡介 Bio */}
        {modelInfo.bio && (
          <p className="text-xs text-stone-700 dark:text-stone-300 mt-3 leading-relaxed bg-[#f5f3ef] dark:bg-stone-800 p-3 rounded-xl border border-stone-300 dark:border-stone-700 font-medium">
            {modelInfo.bio}
          </p>
        )}
      </div>

      {/* 接案尺度與安全邊界 */}
      <div className="pt-3 border-t border-stone-300 dark:border-stone-800 space-y-3">
        <h4 className="text-xs font-bold text-stone-900 dark:text-stone-200 flex items-center gap-1">
          <span>🛡️</span>
          <span>接案尺度與安全邊界</span>
        </h4>

        <div className="bg-[#f5f3ef] dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl p-3 space-y-2.5 text-xs">
          <div>
            <span className="font-bold text-rose-900 dark:text-rose-300 block mb-1.5 flex items-center gap-1">
              <span>🔴</span>
              <span>拍攝禁忌與拒絕尺度：</span>
            </span>

            <div className="flex flex-wrap gap-1.5">
              {modelInfo.boundaries && modelInfo.boundaries.length > 0 ? (
                modelInfo.boundaries.map((boundaryTag) => (
                  <span
                    key={boundaryTag}
                    className="px-2.5 py-1 bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800 rounded-lg text-[11px] font-bold shadow-2xs flex items-center gap-1"
                  >
                    <span>✕</span>
                    <span>{boundaryTag}</span>
                  </span>
                ))
              ) : (
                <span className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">
                  尚無特殊尺度禁忌限制
                </span>
              )}
            </div>
          </div>

          <div className="pt-2 border-t border-stone-200 dark:border-stone-700">
            <span className="font-bold text-stone-800 dark:text-stone-200 block">👥 攜伴約拍政策：</span>
            <p className="text-stone-700 dark:text-stone-300 font-medium text-[11px] mt-0.5">
              {modelInfo.companionPolicy}
            </p>
          </div>
        </div>
      </div>

      {/* 公開社群與作品連結 */}
      <div className="pt-3 border-t border-stone-300 dark:border-stone-800 space-y-2">
        <h4 className="text-xs font-bold text-stone-800 dark:text-stone-200">公開社群與個人作品集</h4>
        <div className="flex flex-col gap-1.5 text-xs">
          {socialLinks.instagram && (
            <a
              href={socialLinks.instagram}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 p-2.5 rounded-lg bg-[#f5f3ef] dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 transition font-bold border border-stone-200 dark:border-stone-700"
            >
              <span>📸</span>
              <span className="truncate">Instagram 主頁</span>
            </a>
          )}
          {socialLinks.facebook && (
            <a
              href={socialLinks.facebook}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 p-2.5 rounded-lg bg-[#f5f3ef] dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 transition font-bold border border-stone-200 dark:border-stone-700"
            >
              <span>📘</span>
              <span className="truncate">Facebook 粉專/個人</span>
            </a>
          )}
          {socialLinks.threads && (
            <a
              href={socialLinks.threads}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 p-2.5 rounded-lg bg-[#f5f3ef] dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 transition font-bold border border-stone-200 dark:border-stone-700"
            >
              <span>🧵</span>
              <span className="truncate">Threads (脆)</span>
            </a>
          )}
          {socialLinks.custom1Url && (
            <a
              href={socialLinks.custom1Url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 p-2.5 rounded-lg bg-[#f5f3ef] dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 transition font-bold border border-stone-200 dark:border-stone-700"
            >
              <span>🔗</span>
              <span className="truncate">{socialLinks.custom1Name || "作品網站 1"}</span>
            </a>
          )}
          {socialLinks.custom2Url && (
            <a
              href={socialLinks.custom2Url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 p-2.5 rounded-lg bg-[#f5f3ef] dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 transition font-bold border border-stone-200 dark:border-stone-700"
            >
              <span>🔗</span>
              <span className="truncate">{socialLinks.custom2Name || "作品網站 2"}</span>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}