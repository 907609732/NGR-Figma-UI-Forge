import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

const title = "NGR Figma UI 锻造台 - 游戏 UI 资源整理与交付插件";
const description =
  "NGR Figma UI 锻造台把节点命名、中文翻译、属性方案、画板整理、模板与变体组织成一条可复用的 UI 交付流程。";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") ?? "localhost:3001";
  const protocol = host.startsWith("localhost") ? "http" : "https";
  const metadataBase = new URL(`${protocol}://${host}`);
  const socialImage = new URL("/og.png", metadataBase).toString();

  return {
    metadataBase,
    title,
    description,
    openGraph: {
      title: "NGR Figma UI 锻造台",
      description: "从 Figma 设计稿到游戏 UI 交付的团队工作台。",
      images: [socialImage],
    },
    twitter: {
      card: "summary_large_image",
      title: "NGR Figma UI 锻造台",
      description: "从 Figma 设计稿到游戏 UI 交付的团工作台。",
      images: [socialImage],
    },
    icons: {
      icon: "/brand-logo.png",
      shortcut: "/brand-logo.png",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
