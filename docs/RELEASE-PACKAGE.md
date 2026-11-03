# NGR Figma UI 锻造台 v0.1.61

发布日期：2026-11-03。

## 更新内容

- “生成标准按钮结构”每次打开插件默认关闭，需要时手动勾选。
- 包含此前本地版本的 Normal / Checked 状态层控制和 Style 同名节点显隐修复。
- 软件信息提供第一集“下载安装”和第二集“一键变体”的 B 站视频教程入口。

## 安装

将 ZIP 解压到固定目录，在 Figma Desktop 中选择“插件 → 开发 → 从 manifest 导入插件”，选择解压目录中的 manifest.json，再启动插件。更新后重新打开插件。

包内只有 manifest.json、code.js、ui.html 和 README.md，不含测试配置或 API 密钥。

## 验证范围

发布流程运行插件自动化测试和 TypeScript 类型检查，并构建生产包。本次发布未执行 Figma Desktop 内的交互验收。

官网：https://figma.lttlt.top/

视频教程：https://www.bilibili.com/video/BV1kmn865Eio/ 、https://www.bilibili.com/video/BV1jxHK6KEs4/
