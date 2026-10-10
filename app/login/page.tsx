"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const acc = account.trim();
    const pwd = password.trim();

    // 驗證模特測試帳號
    if (acc === "aaa" && pwd === "123456") {
      const mockUser = {
        username: "aaa",
        role: "model",
        name: "羽晴 (Hane)",
        id: "hane",
      };
      localStorage.setItem("lumina_mock_user", JSON.stringify(mockUser));
      alert("✅ 模特測試帳號登入成功！即將前往模特工作室後台。");
      router.push("/dashboard/model");
      return;
    }

    // 驗證攝影師測試帳號
    if (acc === "sss" && pwd === "123456") {
      const mockUser = {
        username: "sss",
        role: "photographer",
        name: "陳攝影 (Alan Chen)",
        id: "Alan Chen",
      };
      localStorage.setItem("lumina_mock_user", JSON.stringify(mockUser));
      alert("✅ 攝影師測試帳號登入成功！即將前往攝影工作室後台。");
      router.push("/dashboard/photographer");
      return;
    }

    // 其他帳號阻擋
    setErrorMsg("帳號或密碼錯誤。目前為封閉測試期，僅開放官方測試帳號登入。");
  };

  // 快捷填入測試帳號輔助鍵
  const fillModelAccount = () => {
    setAccount("aaa");
    setPassword("123456");
    setErrorMsg("");
  };

  const fillPhotographerAccount = () => {
    setAccount("sss");
    setPassword("123456");
    setErrorMsg("");
  };

  return (
    <main className="min-h-[calc(100vh-65px)] bg-stone-100/70 px-4 py-12 flex items-center justify-center">
      <div className="max-w-md w-full bg-[#fbfaf8] border border-stone-300 rounded-2xl p-8 shadow-sm space-y-6">
        <div className="text-center space-y-1">
          <span className="text-2xl">✨</span>
          <h2 className="text-xl font-bold text-stone-900">LuminaMatch 封閉測試登入</h2>
          <p className="text-xs text-stone-500">
            目前僅開放受邀測試人員，暫不開放公開註冊功能
          </p>
        </div>

        {/* 測試帳號快速點選卡片 */}
        <div className="bg-[#f5f3ef] border border-stone-300 rounded-xl p-3.5 space-y-2 text-xs">
          <span className="font-bold text-stone-800 block">✦ 點擊快速帶入測試帳密：</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={fillModelAccount}
              className="p-2 bg-white hover:bg-stone-100 border border-stone-300 rounded-lg text-left transition"
            >
              <div className="font-bold text-stone-800">👩‍🦰 模特端測試帳號</div>
              <div className="text-[11px] text-stone-500 font-mono mt-0.5">aaa / 123456</div>
            </button>
            <button
              type="button"
              onClick={fillPhotographerAccount}
              className="p-2 bg-white hover:bg-stone-100 border border-stone-300 rounded-lg text-left transition"
            >
              <div className="font-bold text-stone-800">📸 攝影端測試帳號</div>
              <div className="text-[11px] text-stone-500 font-mono mt-0.5">sss / 123456</div>
            </button>
          </div>
        </div>

        {/* 登入表單 */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-900 mb-1">
              帳號 (Username)
            </label>
            <input
              type="text"
              required
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              placeholder="請輸入測試帳號"
              className="w-full text-xs font-semibold bg-white text-stone-900 border border-stone-400 rounded-xl p-3 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-900 mb-1">
              密碼 (Password)
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="請輸入密碼"
              className="w-full text-xs font-semibold bg-white text-stone-900 border border-stone-400 rounded-xl p-3 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 shadow-2xs"
            />
          </div>

          {errorMsg && (
            <div className="p-2.5 bg-rose-50 border border-rose-300 rounded-xl text-rose-700 text-xs font-medium">
              ⚠️ {errorMsg}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition shadow-xs cursor-pointer"
          >
            登入系統
          </button>
        </form>

        <div className="pt-2 border-t border-stone-200 text-center">
          <Link href="/" className="text-xs font-bold text-stone-500 hover:text-stone-800">
            ← 回到探索大廳
          </Link>
        </div>
      </div>
    </main>
  );
}