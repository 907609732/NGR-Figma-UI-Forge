import assert from "node:assert/strict";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the NGR Figma UI Forge homepage", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /NGR Figma UI 锻造台/);
  assert.match(html, /从设计稿到可交付资产/);
  assert.match(html, /完整能力，按真实交付场景组织/);
  assert.match(html, /生成变体时，状态层也能自动就位/);
  assert.match(html, /href="\/tutorial"/);
  assert.match(html, /Pressed 会保留悬停反馈/);
  assert.match(html, /下载正式版，解压后即可导入/);
  assert.match(html, /NGR-Figma-UI-Forge-v0\.1\.55\.zip/);
  assert.match(html, /B07B6B978880E41EF1661612C1A75B0825D49BC5ED7EE2F27BFC3EFADA28F7C6/);
  assert.doesNotMatch(html, /Your site is taking shape|react-loading-skeleton|codex-preview/i);
});

test("server-renders the complete product tutorial", async () => {
  const response = await render("/tutorial");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /NGR Figma UI 锻造台使用教程/);
  assert.match(html, /下载正式版并导入 Figma Desktop/);
  assert.match(html, /先认识 5 个工作区和当前选区/);
  assert.match(html, /用词库完成规范命名/);
  assert.match(html, /整理画板并写入程序属性/);
  assert.match(html, /配置翻译、AI 命名和帮助入口/);
  assert.match(html, /Pressed 必须同时打开 Hover/);
  assert.match(html, /Checked 与 Unchecked 使用完全相同/);
  assert.match(html, /已有 Component Set 追加 Style/);
  assert.match(html, /NGR-Figma-UI-Forge-v0\.1\.55\.zip/);
  assert.doesNotMatch(html, /Your site is taking shape|react-loading-skeleton|codex-preview/i);
});
