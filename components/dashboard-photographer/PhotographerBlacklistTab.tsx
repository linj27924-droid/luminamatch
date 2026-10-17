"use client";

import React, { useState } from "react";

export interface BlacklistedEntity {
  id: string;
  name: string;
  role: "model" | "client";
  reason: string;
  dateAdded: string;
}

const DEFAULT_BLACKLIST: BlacklistedEntity[] = [
  {
    id: "bl_p1",
    name: "某爽約模特",
    role: "model",
    reason: "當日無故放鳥未到現場，造成棚費自負損失 NT$ 3,000",
    dateAdded: "2026-09-15",
  },
  {
    id: "bl_p2",
    name: "某拖欠尾款廠商",
    role: "client",
    reason: "商案成品交付後惡意拖欠 70% 尾款超過一個月",
    dateAdded: "2026-09-28",
  },
];

export default function PhotographerBlacklistTab() {
  const [blacklist, setBlacklist] = useState<BlacklistedEntity[]>(() => {
    try {
      const saved = localStorage.getItem("lumina_photographer_blacklist");
      return saved ? JSON.parse(saved) : DEFAULT_BLACKLIST;
    } catch {
      return DEFAULT_BLACKLIST;
    }
  });

  const [name, setName] = useState("");
  const [role, setRole] = useState<"model" | "client">("model");
  const [reason, setReason] = useState("");

  const saveList = (list: BlacklistedEntity[]) => {
    setBlacklist(list);
    localStorage.setItem("lumina_photographer_blacklist", JSON.stringify(list));
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newItem: BlacklistedEntity = {
      id: `bl_${Date.now()}`,
      name: name.trim(),
      role,
      reason: reason.trim() || "個人創作防護封鎖",
      dateAdded: new Date().toISOString().slice(0, 10),
    };

    saveList([newItem, ...blacklist]);
    setName("");
    setReason("");
    alert(`🔒 已成功將【${newItem.name}】加入攝影工作室隱形黑名單！`);
  };

  const handleRemove = (id: string) => {
    saveList(blacklist.filter((b) => b.id !== id));
  };

  return (
    <div className="space-y-6 text-xs">
      <div className="bg-white border border-stone-300 rounded-2xl p-6 shadow-sm">
        <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
          <span>🚫</span>
          <span>攝影工作室隱形防護黑名單</span>
        </h3>
        <p className="text-stone-600 text-xs font-medium mt-1">
          被加入黑名單之對象將無法向您發出約拍提案或索取報價單，且系統完全不會通知對方（隱形封鎖保護）。
        </p>

        <form onSubmit={handleAdd} className="mt-4 grid grid-cols-1 sm:grid-cols-4 gap-3">
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="對象姓名或品牌名稱"
            className="bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs outline-none"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as any)}
            className="bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs outline-none"
          >
            <option value="model">👩‍🦰 模特</option>
            <option value="client">🏢 品牌方</option>
          </select>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="封鎖原因備註 (如：放鳥爽約、拖欠款項)"
            className="bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs outline-none"
          />
          <button
            type="submit"
            className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold cursor-pointer py-2.5 text-xs"
          >
            加入黑名單
          </button>
        </form>
      </div>

      <div className="space-y-3">
        <h4 className="font-bold text-stone-900 text-sm">已封鎖對象 ({blacklist.length})</h4>
        {blacklist.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-stone-300 rounded-xl p-4 flex justify-between items-center shadow-2xs"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-stone-900 text-sm">{item.name}</span>
                <span className="text-[10px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded font-bold border border-stone-200">
                  {item.role === "model" ? "模特" : "品牌方"}
                </span>
                <span className="text-stone-400 text-[10px]">封鎖於 {item.dateAdded}</span>
              </div>
              <p className="text-stone-600 text-xs mt-1">理由：{item.reason}</p>
            </div>
            <button
              type="button"
              onClick={() => handleRemove(item.id)}
              className="text-stone-400 hover:text-stone-700 font-bold text-xs cursor-pointer"
            >
              解除封鎖
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}