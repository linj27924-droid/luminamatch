import React, { Suspense } from "react";
import NavigationBar from "../components/layout/NavigationBar";
import "./globals.css";

export const metadata = {
  title: "LuminaMatch - 模特與攝影師約拍存證媒合平台",
  description: "專業人像外拍媒合、雙向電子存證與檔期管理平台",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <head>
        <meta charSet="utf-8" />
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        <Suspense fallback={<div className="h-[65px] bg-[#fbfaf8]" />}>
          <NavigationBar />
        </Suspense>
        <div className="flex-1">{children}</div>
      </body>
    </html>
  );
}