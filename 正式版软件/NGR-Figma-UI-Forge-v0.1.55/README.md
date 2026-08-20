# NGR Figma UI 锻造台 v0.1.55

这是可直接复制到其他电脑测试的正式版 Figma 插件，打包日期为 2026-08-20。

## 文件说明

- `manifest.json`：Figma Desktop 导入入口。
- `code.js`：插件主线程运行文件。
- `ui.html`：插件界面运行文件。
- `README.md`：本测试说明。

除以上四个文件外，正式版不依赖本工作区中的其他文件。

## 导入方法

1. 将整个版本目录复制或解压到测试电脑。
2. 打开 Figma Desktop。
3. 进入“插件 → 开发 → 从 manifest 导入插件”。
4. 选择本目录的 `manifest.json`。
5. 在任意测试文件中启动“NGR Figma UI 锻造台”。

## 测试注意事项

- 百度翻译、OpenAI 和 Kimi 功能需要联网，并在插件设置中填写对应配置。
- 正式版不包含任何 API 密钥、本机缓存或测试配置。
- 官方网站：`https://figma.lttlt.top`。
