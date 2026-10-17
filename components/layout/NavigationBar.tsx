"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

interface MockUser {
  username: string;
  role: "model" | "photographer" | "client";
  name: string;
  id: string;
}

export default function NavigationBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<MockUser | null>(null);

  const syncUser = () => {
    const savedUser = localStorage.getItem("lumina_mock_user");
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        if (u && (u.role === "model" || u.role === "photographer" || u.role === "client")) {
          if (u.role === "model") {
            const savedModelProfile = localStorage.getItem("lumina_model_profile_data");
            if (savedModelProfile) {
              try {
                const parsedModel = JSON.parse(savedModelProfile);
                if (parsedModel.modelProfile?.name) {
                  u.name = parsedModel.modelProfile.name;
                }
              } catch (e) {
                console.error(e);
              }
            }
          }
          setCurrentUser(u);
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }
    setCurrentUser(null);
  };

  useEffect(() => {
    syncUser();
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("lumina_mock_user");
    setCurrentUser(null);
    alert("已成功登出系統！");
    router.push("/");
  };

  const modelProfileId = currentUser?.id || "hane";
  const photographerProfileId = currentUser?.name || currentUser?.id || "Alan Chen";

  return (
    <header className="h-[65px] bg-stone-900/90 backdrop-blur-md border-b border-stone-800/80 sticky top-0 z-40 px-4 sm:px-8 flex items-center justify-between transition-colors">
      {/* 左側：LOGO 與探索大廳、商案大廳 */}
      <div className="flex items-center gap-6">
        <Link href="/" className="font-bold text-base tracking-tight text-stone-100 flex items-center gap-2 group">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500/90 shadow-[0_0_8px_rgba(99,102,241,0.5)] group-hover:scale-110 transition-transform"></span>
          <span className="tracking-wide">LuminaMatch</span>
        </Link>

        <nav className="flex items-center gap-1 text-xs font-medium">
          <Link
            href="/"
            className={`px-3 py-1.5 rounded-xl transition ${
              pathname === "/"
                ? "bg-stone-800/90 text-stone-100 font-semibold shadow-xs"
                : "text-stone-400 hover:text-stone-200 hover:bg-stone-800/50"
            }`}
          >
            探索大廳
          </Link>

          {/* ★ 新增：商案發案大廳入口 ★ */}
          <Link
            href="/jobs"
            className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
              pathname.startsWith("/jobs")
                ? "bg-stone-800/90 text-indigo-300 font-semibold shadow-xs border border-indigo-900/40"
                : "text-stone-400 hover:text-stone-200 hover:bg-stone-800/50"
            }`}
          >
            <span>💼</span>
            <span>商案大廳</span>
          </Link>
        </nav>
      </div>

      {/* 右側：預覽主頁 + 後台入口 + 登入/身分狀態 + 登出 */}
      <div className="flex items-center gap-2.5">
        {currentUser ? (
          <div className="flex items-center gap-2">
            {/* 模特專屬：個人主頁與後台 */}
            {currentUser.role === "model" && (
              <>
                <Link
                  href={`/model/${modelProfileId}`}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition border flex items-center gap-1.5 ${
                    pathname === `/model/${modelProfileId}`
                      ? "bg-emerald-950/70 border-emerald-700/80 text-emerald-200 font-semibold shadow-xs"
                      : "bg-stone-850/80 hover:bg-emerald-950/40 text-stone-300 hover:text-emerald-300 border-stone-750 hover:border-emerald-800/60"
                  }`}
                  title="檢視訪客在大廳與個人主頁看到的實際效果"
                >
                  <span className="text-[13px] opacity-80">👁️</span>
                  <span>個人主頁</span>
                </Link>

                <Link
                  href="/dashboard/model"
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition border flex items-center gap-1.5 ${
                    pathname.startsWith("/dashboard/model")
                      ? "bg-stone-800 border-stone-700 text-stone-100 font-semibold shadow-xs"
                      : "bg-stone-850/80 hover:bg-stone-800 text-stone-300 hover:text-stone-100 border-stone-750"
                  }`}
                >
                  <span>📅</span>
                  <span>模特後台</span>
                </Link>
              </>
            )}

            {/* 攝影師專屬：個人主頁與後台 */}
            {currentUser.role === "photographer" && (
              <>
                <Link
                  href={`/photographer/${encodeURIComponent(photographerProfileId)}`}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition border flex items-center gap-1.5 ${
                    pathname.startsWith("/photographer")
                      ? "bg-emerald-950/70 border-emerald-700/80 text-emerald-200 font-semibold shadow-xs"
                      : "bg-stone-850/80 hover:bg-emerald-950/40 text-stone-300 hover:text-emerald-300 border-stone-750 hover:border-emerald-800/60"
                  }`}
                  title="檢視訪客在大廳與個人主頁看到的實際效果"
                >
                  <span className="text-[13px] opacity-80">👁️</span>
                  <span>個人主頁</span>
                </Link>

                <Link
                  href="/dashboard/photographer"
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition border flex items-center gap-1.5 ${
                    pathname.startsWith("/dashboard/photographer")
                      ? "bg-stone-800 border-stone-700 text-stone-100 font-semibold shadow-xs"
                      : "bg-stone-850/80 hover:bg-stone-800 text-stone-300 hover:text-stone-100 border-stone-750"
                  }`}
                >
                  <span>📷</span>
                  <span>攝影後台</span>
                </Link>
              </>
            )}

            {/* ★ 業主/品牌方專屬：企業後台 ★ */}
            {currentUser.role === "client" && (
              <Link
                href="/dashboard/client"
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition border flex items-center gap-1.5 ${
                  pathname.startsWith("/dashboard/client")
                    ? "bg-indigo-950/70 border-indigo-700/80 text-indigo-200 font-semibold shadow-xs"
                    : "bg-stone-850/80 hover:bg-indigo-950/40 text-stone-300 hover:text-indigo-300 border-stone-750 hover:border-indigo-800/60"
                }`}
              >
                <span>🏢</span>
                <span>企業後台</span>
              </Link>
            )}

            {/* 登入身分標籤 */}
            <div className="px-3 py-1.5 bg-stone-950/60 border border-stone-800 rounded-xl text-xs font-medium text-stone-300 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span className="text-stone-200 font-semibold">{currentUser.name}</span>
              <span className="text-[10px] text-stone-400 bg-stone-800/80 px-1.5 py-0.5 rounded border border-stone-700/60">
                {currentUser.role === "model" ? "模特" : currentUser.role === "photographer" ? "攝影" : "業主"}
              </span>
            </div>

            {/* 登出按鈕 */}
            <button
              type="button"
              onClick={handleLogout}
              className="px-2.5 py-1.5 text-stone-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-xl text-xs transition cursor-pointer border border-transparent hover:border-rose-900/40"
              title="登出帳號"
            >
              登出
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="px-4 py-1.5 bg-stone-100 hover:bg-white text-stone-900 rounded-xl text-xs font-bold transition shadow-xs"
          >
            登入 / 註冊
          </Link>
        )}
      </div>
    </header>
  );
}