"use client";

import React, { useState } from "react";
import Link from "next/link";

export interface WatchlistNoteItem {
  id: string;
  targetName: string;
  targetRole: "model" | "photographer" | "client";
  caseNumber: string;
  date: string;
  authorRole: "model" | "photographer" | "client";
  authorName: string;
  riskLevel: "caution" | "warning" | "danger"; // 提醒、注意、高風險
  tags: string[];
  content: string;
  isDisputed?: boolean;
  disputeReason?: string;
}

const DEFAULT_WATCHLIST: WatchlistNoteItem[] = [
  {
    id: "wl_1",
    targetName: "某個人工作室攝影",
    targetRole: "photographer",
    caseNumber: "INV-20260918-091",
    date: "2026-09-20",
    authorRole: "model",
    authorName: "同行模特匿名備註",
    riskLevel: "warning",
    tags: ["臨時要求非約定尺度", "動作引導含肢體碰觸", "無女性助理"],
    content: "行前約好是日系便服時裝，現場臨時多次詢問能否換穿私密透膚洋裝，並試圖用手調整衣領。提醒同行接案務必攜伴或要求合約明定尺度限制！",
    isDisputed: false,
  },
  {
    id: "wl_2",
    targetName: "某爽約模特",
    targetRole: "model",
    caseNumber: "TFC-20260812-005",
    date: "2026-08-15",
    authorRole: "photographer",
    authorName: "資深人像攝影師",
    riskLevel: "danger",
    tags: ["拍攝當日放鳥", "訊息已讀不回", "棚費自負損失"],
    content: "拍攝當天約定 13:00 集合，12:50 聯繫皆未接聽，直到 14:00 仍未現身且訊息已讀不回。造成攝影棚與助理費用全額損失，請同行排程時務必先收保證金或確認通告！",
    isDisputed: false,
  },
  {
    id: "wl_3",
    targetName: "某潮牌服飾行銷",
    targetRole: "client",
    caseNumber: "COM-20260710-012",
    date: "2026-07-15",
    authorRole: "photographer",
    authorName: "商業攝影總監",
    riskLevel: "warning",
    tags: ["驗收拖延", "尾款拖欠超過30天", "隨意追加套數"],
    content: "現場原定拍攝 4 套商品，開拍後臨時塞入另外 6 套，交件驗收後財務以請款流程為由拖延尾款整整一個月。同行報價時建議加註超時費與尾款逾期滯納約定！",
    isDisputed: false,
  },
];

const RISK_BADGES: Record<WatchlistNoteItem["riskLevel"], { label: string; bg: string; border: string; text: string }> = {
  caution: { label: "⚠️ 風格提醒", bg: "bg-amber-50", border: "border-amber-300", text: "text-amber-800" },
  warning: { label: "⚡ 避坑注意", bg: "bg-orange-50", border: "border-orange-300", text: "text-orange-800" },
  danger: { label: "⛔ 嚴重高風險", bg: "bg-rose-50", border: "border-rose-300", text: "text-rose-800" },
};

interface IndustryWatchlistTabProps {
  currentUserRole: "model" | "photographer" | "client";
  currentUserName: string;
}

export default function IndustryWatchlistTab({ currentUserRole, currentUserName }: IndustryWatchlistTabProps) {
  const [notes, setNotes] = useState<WatchlistNoteItem[]>(() => {
    try {
      const saved = localStorage.getItem("lumina_industry_watchlist");
      return saved ? JSON.parse(saved) : DEFAULT_WATCHLIST;
    } catch {
      return DEFAULT_WATCHLIST;
    }
  });

  const [filterRole, setFilterRole] = useState<"all" | "model" | "photographer" | "client">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // 新增手札表單狀態
  const [showAddModal, setShowAddModal] = useState(false);
  const [targetName, setTargetName] = useState("");
  const [targetRole, setTargetRole] = useState<"model" | "photographer" | "client">("photographer");
  const [caseNumber, setCaseNumber] = useState("");
  const [riskLevel, setRiskLevel] = useState<WatchlistNoteItem["riskLevel"]>("warning");
  const [tagInput, setTagInput] = useState("");
  const [content, setContent] = useState("");

  // 申訴彈窗狀態
  const [disputeItem, setDisputeItem] = useState<WatchlistNoteItem | null>(null);
  const [disputeReason, setDisputeReason] = useState("");

  const saveNotes = (updated: WatchlistNoteItem[]) => {
    setNotes(updated);
    localStorage.setItem("lumina_industry_watchlist", JSON.stringify(updated));
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetName.trim() || !content.trim()) return;

    const newNote: WatchlistNoteItem = {
      id: `wl_${Date.now()}`,
      targetName: targetName.trim(),
      targetRole,
      caseNumber: caseNumber.trim() || `CASE-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString().slice(0, 10),
      authorRole: currentUserRole,
      authorName: currentUserName,
      riskLevel,
      tags: tagInput
        .split(/[,，、 ]/)
        .map((t) => t.trim())
        .filter(Boolean),
      content: content.trim(),
      isDisputed: false,
    };

    saveNotes([newNote, ...notes]);
    setShowAddModal(false);
    setTargetName("");
    setCaseNumber("");
    setTagInput("");
    setContent("");
    alert("🛡️ 防雷備註已成功刊登至同業手札！同行將可在合作前查閱避坑。");
  };

  const handleConfirmDispute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disputeItem || !disputeReason.trim()) return;

    const updated = notes.map((item) =>
      item.id === disputeItem.id
        ? {
            ...item,
            isDisputed: true,
            disputeReason: disputeReason.trim(),
          }
        : item
    );

    saveNotes(updated);
    setDisputeItem(null);
    setDisputeReason("");
    alert("⚖️ 爭議申訴已受理！在官方核實專案存證前，本則手札標註為【審理中爭議】並隔離其風險警告標籤。");
  };

  // 申訴中的備註不對公開同業計為有效風險
  const filteredNotes = notes.filter((n) => {
    const matchRole = filterRole === "all" || n.targetRole === filterRole;
    const matchQuery =
      !searchQuery ||
      n.targetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchRole && matchQuery;
  });

  return (
    <div className="space-y-6 text-xs">
      {/* 頂部說明卡片 */}
      <div className="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <span>🛡️</span>
            <span>同業防雷與避坑手札（案件後備註庫）</span>
          </h3>
          <p className="text-stone-600 dark:text-stone-400 text-xs mt-1 font-medium">
            專供模特、攝影師與品牌方在履約結案後分享「真實合作地雷與注意事項」，協助同行在接案與排程時精準避坑！
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold cursor-pointer transition shadow-xs flex items-center gap-1.5 shrink-0"
        >
          <span>✍️</span>
          <span>撰寫案件防雷備註</span>
        </button>
      </div>

      {/* 篩選與搜尋列 */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex bg-stone-200/70 dark:bg-stone-800 p-1 rounded-xl w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setFilterRole("all")}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer text-xs ${
              filterRole === "all" ? "bg-white dark:bg-stone-900 text-indigo-700 dark:text-indigo-400 shadow-xs" : "text-stone-600 dark:text-stone-300"
            }`}
          >
            全部對象 ({notes.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterRole("photographer")}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer text-xs ${
              filterRole === "photographer" ? "bg-white dark:bg-stone-900 text-indigo-700 dark:text-indigo-400 shadow-xs" : "text-stone-600 dark:text-stone-300"
            }`}
          >
            📸 攝影師
          </button>
          <button
            type="button"
            onClick={() => setFilterRole("model")}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer text-xs ${
              filterRole === "model" ? "bg-white dark:bg-stone-900 text-indigo-700 dark:text-indigo-400 shadow-xs" : "text-stone-600 dark:text-stone-300"
            }`}
          >
            👩‍🦰 模特
          </button>
          <button
            type="button"
            onClick={() => setFilterRole("client")}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer text-xs ${
              filterRole === "client" ? "bg-white dark:bg-stone-900 text-indigo-700 dark:text-indigo-400 shadow-xs" : "text-stone-600 dark:text-stone-300"
            }`}
          >
            🏢 品牌廠商
          </button>
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="🔍 搜尋對象姓名、地雷標籤或具體事由..."
          className="w-full sm:w-72 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-600"
        />
      </div>

      {/* 手札卡片列表 */}
      <div className="space-y-3">
        {filteredNotes.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-stone-900 border border-dashed border-stone-300 dark:border-stone-700 rounded-2xl text-stone-500 font-medium">
            目前未有符合條件的防雷備註。
          </div>
        ) : (
          filteredNotes.map((item) => {
            const badge = RISK_BADGES[item.riskLevel];
            const targetRoleLabel =
              item.targetRole === "model" ? "👩‍🦰 模特" : item.targetRole === "photographer" ? "📸 攝影師" : "🏢 品牌方";
            const profileLink =
              item.targetRole === "model"
                ? `/model/${encodeURIComponent(item.targetName)}`
                : item.targetRole === "photographer"
                ? `/photographer/${encodeURIComponent(item.targetName)}`
                : `/client/${encodeURIComponent(item.targetName)}`;

            return (
              <div
                key={item.id}
                className={`p-5 bg-white dark:bg-stone-900 border rounded-2xl space-y-3 shadow-2xs transition ${
                  item.isDisputed ? "border-amber-400 bg-amber-50/20" : "border-stone-300 dark:border-stone-800"
                }`}
              >
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-stone-500 text-xs">提醒對象：</span>
                      <Link
                        href={profileLink}
                        className="font-bold text-stone-950 dark:text-stone-100 hover:text-indigo-600 text-sm flex items-center gap-1 group transition"
                      >
                        <span>{item.targetName}</span>
                        <span className="text-[10px] text-indigo-500 group-hover:translate-x-0.5 transition-transform">➔</span>
                      </Link>
                      <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-300 dark:border-stone-700">
                        {targetRoleLabel}
                      </span>
                      {item.isDisputed ? (
                        <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
                          ⚖️ 申訴審查中 (暫予存證隔離)
                        </span>
                      ) : (
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${badge.bg} ${badge.border} ${badge.text}`}>
                          {badge.label}
                        </span>
                      )}
                    </div>
                    <p className="text-stone-500 text-[11px] mt-0.5">
                      結案日期：{item.date} ｜ 存證案件編號：<span className="font-mono text-stone-700 dark:text-stone-300">{item.caseNumber}</span> ｜ 刊登者：{item.authorName}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {item.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-bold px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-md"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="bg-[#fbfaf8] dark:bg-stone-950 p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 leading-relaxed font-medium">
                  💬 <strong>同行踩雷情境還原：</strong>「{item.content}」
                </div>

                <div className="flex justify-between items-center pt-1 text-[11px]">
                  <span className="text-stone-400">💡 僅提供真實履約備查，禁止人身攻擊與不實捏造。</span>
                  {!item.isDisputed && (
                    <button
                      type="button"
                      onClick={() => {
                        setDisputeItem(item);
                        setDisputeReason("");
                      }}
                      className="text-stone-500 hover:text-rose-600 font-bold cursor-pointer"
                    >
                      🚩 檢舉不實備註 / 提出申訴隔離
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 新增手札彈窗 */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleAddNote}
            className="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 max-w-lg w-full p-6 rounded-2xl shadow-2xl space-y-4 text-xs"
          >
            <div className="flex justify-between items-center border-b border-stone-200 dark:border-stone-800 pb-3">
              <h4 className="font-bold text-stone-900 dark:text-stone-100 text-sm flex items-center gap-2">
                <span>🛡️</span>
                <span>新增案件同業防雷／避坑備註</span>
              </h4>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-stone-400 hover:text-stone-600 text-base font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    提醒對象姓名 / 品牌名 <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={targetName}
                    onChange={(e) => setTargetName(e.target.value)}
                    placeholder="例：某某攝影 / 某某服飾"
                    className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl p-2.5 outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">對象身分</label>
                  <select
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value as any)}
                    className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl p-2.5 outline-none font-bold"
                  >
                    <option value="photographer">📸 攝影師</option>
                    <option value="model">👩‍🦰 模特</option>
                    <option value="client">🏢 品牌方</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">風險警示層級</label>
                  <select
                    value={riskLevel}
                    onChange={(e) => setRiskLevel(e.target.value as any)}
                    className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl p-2.5 outline-none font-bold"
                  >
                    <option value="caution">⚠️ 風格提醒 (溝通/小細節)</option>
                    <option value="warning">⚡ 避坑注意 (超時/拖延/改約)</option>
                    <option value="danger">⛔ 嚴重高風險 (放鳥/拖款/肢體界線)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">關聯案件編號 (選填)</label>
                  <input
                    type="text"
                    value={caseNumber}
                    onChange={(e) => setCaseNumber(e.target.value)}
                    placeholder="例：COM-20261015-003"
                    className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl p-2.5 outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  避坑特徵標籤 (以逗號隔開)
                </label>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="例：無故拖延尾款, 臨時追加套數, 未依約交件"
                  className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl p-2.5 outline-none font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  具體經過說明與同業注意事項 <span className="text-rose-600">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="請客觀描述履約過程中發生的具體事實，以及同行日後若與該對象合作建議注意的事項..."
                  className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl p-2.5 outline-none font-medium leading-relaxed"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-stone-200 dark:border-stone-800">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-xl font-bold cursor-pointer"
              >
                取消
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold cursor-pointer transition shadow-xs"
              >
                確認刊登手札
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 提出申訴隔離彈窗 */}
      {disputeItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleConfirmDispute}
            className="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 max-w-md w-full p-6 rounded-2xl shadow-2xl space-y-4 text-xs"
          >
            <h4 className="font-bold text-stone-900 dark:text-stone-100 text-sm">提出不實手札申訴</h4>
            <p className="text-stone-500">申訴對象手札：{disputeItem.targetName} 的備註</p>
            <textarea
              rows={4}
              required
              value={disputeReason}
              onChange={(e) => setDisputeReason(e.target.value)}
              placeholder="說明申訴事由（如：惡意捏造、非事實履約紀錄）..."
              className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl p-2.5 text-xs outline-none"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDisputeItem(null)}
                className="px-4 py-2 bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-xl font-bold cursor-pointer"
              >
                取消
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-rose-600 text-white rounded-xl font-bold cursor-pointer"
              >
                送出申訴並即時標註
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}