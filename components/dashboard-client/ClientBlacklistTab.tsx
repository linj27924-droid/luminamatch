"use client";

import React, { useState } from "react";

export interface ClientBlacklistEntity {
  id: string;
  name: string;
  role: "model" | "photographer";
  reason: string;
  dateAdded: string;
}

const DEFAULT_CLIENT_BLACKLIST: ClientBlacklistEntity[] = [
  {
    id: "bl_c1",
    name: "某惡意投遞應徵者",
    role: "photographer",
    reason: "多次以非約定預算洗版投遞，並於私訊發表不當言論",
    dateAdded: "2026-10-02",
  },
];

export default function ClientBlacklistTab() {
  const [blacklist, setBlacklist] = useState<ClientBlacklistEntity[]>(() => {
    try {
      const saved = localStorage.getItem("lumina_client_blacklist");
      return saved ? JSON.parse(saved) : DEFAULT_CLIENT_BLACKLIST;
    } catch {
      return DEFAULT_CLIENT_BLACKLIST;
    }
  });

  const [name, setName] = useState("");
  const [role, setRole] = useState<"model" | "photographer">("model");
  const [reason, setReason] = useState("");

  const saveList = (list: ClientBlacklistEntity[]) => {
    setBlacklist(list);
    localStorage.setItem("lumina_client_blacklist", JSON.stringify(list));
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newItem: ClientBlacklistEntity = {
      id: `bl_${Date.now()}`,
      name: name.trim(),
      role,
      reason: reason.trim() || "企業商業防護封鎖",
      dateAdded: new Date().toISOString().slice(0, 10),
    };

    saveList([newItem, ...blacklist]);
    setName("");
    setReason("");
    alert(`🔒 已成功將【${newItem.name}】加入企業隱形黑名單！`);
  };

  const handleRemove = (id: string) => {
    saveList(blacklist.filter((b) => b.id !== id));
  };

  return (
    <div className="space-y-6 text-xs">
      <div className="bg-white border border-stone-300 rounded-2xl p-6 shadow-sm">
        <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
          <span>🚫</span>
          <span>企業品牌隱形防護黑名單</span>
        </h3>
        <p className="text-stone-600 text-xs font-medium mt-1">
          被列入黑名單的創作者將無法應徵貴品牌的任何招募案件，亦無法發送主動商業提案（隱形封鎖，無通知）。
        </p>

        <form onSubmit={handleAdd} className="mt-4 grid grid-cols-1 sm:grid-cols-4 gap-3">
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="創作者姓名"
            className="bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs outline-none"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as any)}
            className="bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs outline-none"
          >
            <option value="model">👩‍🦰 模特</option>
            <option value="photographer">📸 攝影師</option>
          </select>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="封鎖事由 (如：履約爽約、態度不佳)"
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
                  {item.role === "model" ? "模特" : "攝影師"}
                </span>
                <span className="text-stone-400 text-[10px]">封鎖於 {item.dateAdded}</span>
              </div>
              <p className="text-stone-600 text-xs mt-1">事由：{item.reason}</p>
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