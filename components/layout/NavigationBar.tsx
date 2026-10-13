"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

interface MockUser {
  username: string;
  role: "model" | "photographer";
  name: string;
  id: string;
}

export default function NavigationBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<MockUser | null>(null);

  // 晝夜主題狀態 (light / dark)
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // 自動依時間偵測主題 (晚上 18:00 後為暗色，早上 08:00 後為明亮)
  useEffect(() => {
    const applyAutoTheme = () => {
      const savedTheme = localStorage.getItem("lumina_theme_mode");
      if (savedTheme === "dark" || savedTheme === "light") {
        setTheme(savedTheme);
        if (savedTheme === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
        return;
      }

      const currentHour = new Date().getHours();
      // 18:00 ~ 07:59 預設暗黑夜間模式；08:00 ~ 17:59 預設白色明亮模式
      const isNight = currentHour >= 18 || currentHour < 8;
      if (isNight) {
        setTheme("dark");
        document.documentElement.classList.add("dark");
      } else {
        setTheme("light");
        document.documentElement.classList.remove("dark");
      }
    };

    applyAutoTheme();
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("lumina_theme_mode", nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const syncUser = () => {
    const savedUser = localStorage.getItem("lumina_mock_user");
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        if (u && (u.role === "model" || u.role === "photographer")) {
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
    window.addEventListener("storage", syncUser);
    window.addEventListener("lumina_user_updated", syncUser);
    const interval = setInterval(syncUser, 500);
    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("lumina_user_updated", syncUser);
      clearInterval(interval);
    };
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("lumina_mock_user");
    setCurrentUser(null);
    alert("已成功登出系統！");
    router.push("/");
  };

  const modelProfileId = currentUser?.id || "hane";

  return (
    <header className="h-[65px] bg-[#fbfaf8] dark:bg-stone-900 border-b border-stone-200/90 dark:border-stone-800 sticky top-0 z-40 px-4 sm:px-8 flex items-center justify-between transition-colors duration-200">
      {/* 左側：LOGO 與探索大廳 */}
      <div className="flex items-center gap-6">
        <Link href="/" className="font-extrabold text-base tracking-tight text-stone-900 dark:text-white flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block"></span>
          <span>LuminaMatch</span>
        </Link>

        <nav className="flex items-center gap-1 text-xs font-bold">
          <Link
            href="/"
            className={`px-3 py-1.5 rounded-lg transition ${
              pathname === "/"
                ? "bg-stone-200/80 dark:bg-stone-800 text-stone-900 dark:text-white"
                : "text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800"
            }`}
          >
            探索大廳
          </Link>
        </nav>
      </div>

      {/* 右側：主題切換 + 預覽主頁 + 後台入口 + 名稱 + 登出 */}
      <div className="flex items-center gap-2.5">
        {/* ★ 晝夜自動與手動切換按鈕 ★ */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-[#f5f3ef] dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-amber-300 transition text-xs font-bold flex items-center gap-1 shadow-2xs cursor-pointer"
          title={`目前為：${theme === "dark" ? "夜間模式 (18:00~08:00)" : "白晝模式 (08:00~18:00)"}，點擊手動切換`}
        >
          <span>{theme === "dark" ? "🌙" : "☀️"}</span>
          <span className="hidden sm:inline text-[11px]">
            {theme === "dark" ? "夜間護眼" : "白晝明亮"}
          </span>
        </button>

        {currentUser ? (
          <div className="flex items-center gap-2">
            {currentUser.role === "model" && (
              <Link
                href={`/model/${modelProfileId}`}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border flex items-center gap-1 ${
                  pathname === `/model/${modelProfileId}`
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-2xs"
                    : "bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                }`}
                title="檢視訪客在大廳與個人主頁看到的實際效果"
              >
                <span>👁️</span>
                <span>預覽我的主頁</span>
              </Link>
            )}

            {currentUser.role === "model" && (
              <Link
                href="/dashboard/model"
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                  pathname.startsWith("/dashboard/model")
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-2xs"
                    : "bg-[#f5f3ef] dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 border-stone-300 dark:border-stone-700"
                }`}
              >
                📅 模特排程後台
              </Link>
            )}

            {currentUser.role === "photographer" && (
              <Link
                href="/dashboard/photographer"
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                  pathname.startsWith("/dashboard/photographer")
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-2xs"
                    : "bg-[#f5f3ef] dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 border-stone-300 dark:border-stone-700"
                }`}
              >
                📷 攝影工作室後台
              </Link>
            )}

            <div className="px-3 py-1.5 bg-[#f5f3ef] dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
              <span>
                {currentUser.name} ({currentUser.role === "model" ? "模特" : "攝影師"})
              </span>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="px-3 py-1.5 bg-stone-200 dark:bg-stone-800 hover:bg-rose-100 hover:text-rose-700 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-bold transition cursor-pointer"
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