import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "使用教程 | NGR Figma UI 锻造台",
  description:
    "NGR Figma UI 锻造台安装、词库命名、中文翻译、属性方案、画板整理、模板和一键变体完整教程。",
  openGraph: {
    title: "NGR Figma UI 锻造台使用教程",
    description: "从安装到一键变体，按真实 Figma UI 交付流程逐步上手。",
    images: ["/og-v0.1.55.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "NGR Figma UI 锻造台使用教程",
    description: "从安装到一键变体，按真实 Figma UI 交付流程逐步上手。",
    images: ["/og-v0.1.55.png"],
  },
};

export default function TutorialLayout({ children }: { children: React.ReactNode }) {
  return children;
}
