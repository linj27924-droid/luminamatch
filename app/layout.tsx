import React, { Suspense } from "react";
import NavigationBar from "../components/layout/NavigationBar";
import "./globals.css";

export const metadata = {
  title: "LuminaMatch - 模特與攝影師約拍存證媒合平台",
  description: "專業人像外拍媒合、無痛電子合約與通訊存證管理平台",
};

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