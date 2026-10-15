"use client";

import React, { useState } from "react";

export interface OutfitItem {
  id: string;
  title: string;
  description: string;
  image?: string;
  modelConfirmed?: boolean;
  photographerConfirmed?: boolean;
  status?: "pending" | "confirmed";
}

interface CollabOutfitsSectionProps {
  outfits: OutfitItem[];
  userRole: "model" | "photographer";
  onToggleConfirm: (outfitId: string) => void;
  onAddOutfit: (title: string, desc: string, img?: string) => void;
  onDeleteOutfit: (outfitId: string) => void;
}

export default function CollabOutfitsSection({
  outfits,
  userRole,
  onToggleConfirm,
  onAddOutfit,
  onDeleteOutfit,
}: CollabOutfitsSectionProps) {
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newImage, setNewImage] = useState("");
  const [previewImage, setPreviewImage] = useState<{ src: string; title: string } | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) setNewImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddOutfit(newTitle.trim(), newDesc.trim(), newImage || undefined);
    setNewTitle("");
    setNewDesc("");
    setNewImage("");
  };

  return (
    <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-6 shadow-sm space-y-4">
      <div className="border-b border-stone-200 pb-2">
        <h3 className="text-sm font-bold text-stone-800 flex items-center gap-1.5">
          <span>👗</span>
          <span>約定服裝挑選與雙方確認清單</span>
        </h3>
        <p className="text-[11px] text-stone-400 mt-0.5">點擊縮圖可放大檢視服裝細節與花紋</p>
      </div>

      <div className="space-y-2.5">
        {(!outfits || outfits.length === 0) ? (
          <div className="text-center py-6 text-xs text-stone-400 bg-white rounded-xl border border-dashed border-stone-300">
            尚未新增任何拍攝服裝，請在下方填寫並上傳款式圖片！
          </div>
        ) : (
          outfits.map((outfit) => {
            const isModelOk = outfit.modelConfirmed ?? (outfit.status === "confirmed");
            const isPhotographerOk = outfit.photographerConfirmed ?? (outfit.status === "confirmed");

            return (
              <div
                key={outfit.id}
                className="p-3.5 bg-white border border-stone-200 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  {outfit.image ? (
                    <div
                      className="relative group cursor-pointer"
                      onClick={() => setPreviewImage({ src: outfit.image!, title: outfit.title })}
                    >
                      <img
                        src={outfit.image}
                        alt={outfit.title}
                        className="w-16 h-16 object-cover rounded-lg border border-stone-200 shrink-0 group-hover:opacity-85 transition"
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 rounded-lg flex items-center justify-center text-white text-[10px] font-bold transition">
                        🔍 放大
                      </div>
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-stone-100 border border-stone-200 flex items-center justify-center text-lg text-stone-400 shrink-0">
                      👗
                    </div>
                  )}
                  <div>
                    <span className="font-bold text-stone-800 text-sm block">{outfit.title}</span>
                    <p className="text-[11px] text-stone-500 mt-0.5">{outfit.description}</p>
                    {outfit.image && (
                      <button
                        type="button"
                        onClick={() => setPreviewImage({ src: outfit.image!, title: outfit.title })}
                        className="text-[10px] text-indigo-600 hover:underline mt-1 inline-flex items-center gap-0.5 cursor-pointer"
                      >
                        🔍 點擊查看大圖
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto">
                  {userRole === "model" ? (
                    <button
                      type="button"
                      onClick={() => onToggleConfirm(outfit.id)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition cursor-pointer ${
                        isModelOk
                          ? "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
                          : "bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100"
                      }`}
                    >
                      {isModelOk ? "✓ 模特：已確認" : "⏳ 模特：待確認 (點擊確認)"}
                    </button>
                  ) : (
                    <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border ${isModelOk ? "bg-emerald-50 text-emerald-800 border-emerald-300" : "bg-amber-50 text-amber-800 border-amber-300"}`}>
                      {isModelOk ? "✓ 模特：已確認" : "⏳ 模特：待確認"}
                    </span>
                  )}

                  {userRole === "photographer" ? (
                    <button
                      type="button"
                      onClick={() => onToggleConfirm(outfit.id)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition cursor-pointer ${
                        isPhotographerOk
                          ? "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
                          : "bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700 shadow-2xs"
                      }`}
                    >
                      {isPhotographerOk ? "✓ 攝影：已確認" : "點擊確認此服裝"}
                    </button>
                  ) : (
                    <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border ${isPhotographerOk ? "bg-emerald-50 text-emerald-800 border-emerald-300" : "bg-stone-100 text-stone-600 border-stone-300"}`}>
                      {isPhotographerOk ? "✓ 攝影：已確認" : "⏳ 攝影：待確認"}
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => onDeleteOutfit(outfit.id)}
                    className="text-stone-400 hover:text-rose-600 p-1 cursor-pointer transition text-xs"
                  >
                    ✕
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-3.5 bg-stone-50 border border-stone-200 rounded-xl space-y-3">
        <span className="text-xs font-bold text-stone-700 block">+ 新增約定服裝款式與參考圖</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="套裝名稱 (例: 白色細肩碎花洋裝)"
            className="text-xs bg-white text-stone-800 border border-stone-300 rounded-lg p-2 outline-none focus:border-indigo-500"
          />
          <input
            type="text"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            placeholder="備註 / 配件需求 (例: 自備草帽與低跟鞋)"
            className="text-xs bg-white text-stone-800 border border-stone-300 rounded-lg p-2 outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-2">
            <label className="cursor-pointer px-3 py-1.5 bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 text-xs font-semibold rounded-lg transition flex items-center gap-1 shadow-2xs">
              <span>📷</span>
              <span>{newImage ? "更換款式圖" : "上傳款式圖"}</span>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
            {newImage && (
              <div className="flex items-center gap-1.5">
                <img
                  src={newImage}
                  alt="款式圖"
                  className="w-7 h-7 object-cover rounded border border-stone-300 cursor-pointer"
                  onClick={() => setPreviewImage({ src: newImage, title: "款式預覽" })}
                />
                <button type="button" onClick={() => setNewImage("")} className="text-[11px] text-rose-600 hover:underline cursor-pointer">
                  移除
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white rounded-lg text-xs font-bold transition shrink-0 cursor-pointer shadow-xs"
          >
            + 加入服裝清單
          </button>
        </div>
      </form>

      {/* 圖片點擊放大 Lightbox */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-2xl max-h-[90vh] bg-stone-900 border border-stone-700 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-3.5 bg-stone-900/90 border-b border-stone-800 text-white">
              <span className="text-xs font-bold truncate pr-4">{previewImage.title}</span>
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="w-7 h-7 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white flex items-center justify-center text-sm font-bold transition cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="p-2 flex items-center justify-center bg-black/40 overflow-auto">
              <img src={previewImage.src} alt={previewImage.title} className="max-h-[75vh] w-auto max-w-full object-contain rounded-lg" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}