"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import "./globals.css";

interface MockUser {
  username: string;
  role: "model" | "photographer";
  name: string;
  id: string;
}

function NavigationBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<MockUser | null>(null);

  // 同步讀取使用者身分與最新後台藝名
  const syncUser = () => {
    const savedUser = localStorage.getItem("lumina_mock_user");
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        if (u && (u.role === "model" || u.role === "photographer")) {
          // 若是模特身分，優先讀取模特後台自訂儲存的最新姓名
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
    // 監聽 storage 事件與定期同步，確保在後台改名時頂部無延遲即時更新
    window.addEventListener("storage", syncUser);
    const interval = setInterval(syncUser, 500);
    return () => {
      window.removeEventListener("storage", syncUser);
      clearInterval(interval);
    };
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("lumina_mock_user");
    setCurrentUser(null);
    alert("已成功登出系統！");
    router.push("/");
  };

  return (
    <header className="h-[65px] bg-[#fbfaf8] border-b border-stone-200/90 sticky top-0 z-40 px-4 sm:px-8 flex items-center justify-between">
      {/* 左側：LOGO 與探索大廳 (位置完全不動) */}
      <div className="flex items-center gap-6">
        <Link href="/" className="font-extrabold text-base tracking-tight text-stone-900 flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block"></span>
          <span>LuminaMatch</span>
        </Link>

        {/* 探索大廳位置不動 */}
        <nav className="flex items-center gap-1 text-xs font-bold">
          <Link
            href="/"
            className={`px-3 py-1.5 rounded-lg transition ${
              pathname === "/"
                ? "bg-stone-200/80 text-stone-900"
                : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
            }`}
          >
            探索大廳
          </Link>
        </nav>
      </div>

      {/* 右側：後台入口 (移到右邊) + 使用者名稱 (即時同步) + 登出按鈕 */}
      <div className="flex items-center gap-3">
        {currentUser ? (
          <div className="flex items-center gap-2.5">
            {/* ★ 模特排程後台：移到右邊 ★ */}
            {currentUser.role === "model" && (
              <Link
                href="/dashboard/model"
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                  pathname.startsWith("/dashboard/model")
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-2xs"
                    : "bg-[#f5f3ef] hover:bg-stone-200 text-stone-700 border-stone-300"
                }`}
              >
                📅 模特排程後台
              </Link>
            )}

            {/* 若是攝影師身分，後台同樣置於右側 */}
            {currentUser.role === "photographer" && (
              <Link
                href="/dashboard/photographer"
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                  pathname.startsWith("/dashboard/photographer")
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-2xs"
                    : "bg-[#f5f3ef] hover:bg-stone-200 text-stone-700 border-stone-300"
                }`}
              >
                📷 攝影工作室後台
              </Link>
            )}

            {/* 即時跟隨後台變更的姓名顯示 */}
            <div className="px-3 py-1.5 bg-[#f5f3ef] border border-stone-300 rounded-xl text-xs font-bold text-stone-800 flex items-center gap-1.5 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
              <span>
                {currentUser.name} ({currentUser.role === "model" ? "模特" : "攝影師"})
              </span>
            </div>

            {/* 登出按鈕 */}
            <button
              type="button"
              onClick={handleLogout}
              className="px-3 py-1.5 bg-stone-200 hover:bg-rose-100 hover:text-rose-700 text-stone-700 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              🚪 登出
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-2xs"
          >
            登入 / 註冊
          </Link>
        )}
      </div>
    </header>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body className="bg-stone-100/70 text-stone-800 antialiased min-h-screen flex flex-col">
        <Suspense
          fallback={
            <header className="h-[65px] bg-[#fbfaf8] border-b border-stone-200/90 px-4 sm:px-8 flex items-center justify-between">
              <div className="font-extrabold text-base text-stone-900">LuminaMatch</div>
            </header>
          }
        >
          <NavigationBar />
        </Suspense>

        <div className="flex-1">{children}</div>
      </body>
    </html>
  );
}