# NGR Figma UI 锻造台工作区

本目录同时保存插件源码、官网源码、产品文档和可直接交付测试的正式版软件。日常开发使用整个工作区；需要带到其他电脑测试时，只压缩 `正式版软件` 中对应的版本目录。

## 目录说明

### `正式版软件/`

存放可独立复制、压缩和测试的正式版 Figma 插件。

- 每个版本使用独立目录，避免新旧版本互相覆盖。
- 正式版目录只包含运行文件、Figma 清单和测试说明。
- 不包含源码、`node_modules`、缓存、构建配置、API 密钥或本机设置。
- 当前版本：`NGR-Figma-UI-Forge-v0.1.54/`。

### `docs/`

存放产品和软件文档。

- `软件交互文档.md`：当前插件页面、按钮、状态和异常提示的正式交互说明。

### `system/`

Figma 插件开发工程。

- `src/`：插件主线程、共享类型和 UI 源码。
- `scripts/`：构建脚本。
- `dist/`：工作区开发清单使用的已构建插件文件；需要提交到版本库。
- `package.json`、`package-lock.json`：Node.js 依赖与锁定版本。
- `tsconfig.json`：TypeScript 配置。

开发依赖不随仓库保存。需要重新开发或构建时，在 `system` 中执行：

```powershell
npm.cmd ci
npm.cmd run typecheck
npm.cmd run build
```

### `website/`

软件官网与教程网站工程。

- `app/`：官网首页、教程页、布局和样式。
- `public/`：官网图片、图标和分享图。
- `tests/`：网页渲染与链接测试。
- `worker/`、`build/`：Sites/Cloudflare 运行与构建适配代码。
- `db/`、`drizzle/`、`examples/`：网站数据库模板和示例。
- `package.json`、`package-lock.json`：网站依赖与锁定版本。

网站的 `node_modules`、`.next`、`.wrangler` 和 `dist` 都是可重新生成的临时内容，不应放进正式版软件目录。

### `assets/`

存放工作区共用的品牌源文件，目前包含可编辑的 SVG 标志。

### 隐藏目录

- `.git/`：Git 版本历史和分支信息。
- `.plastic/`：Plastic SCM 工作区元数据。

这两个目录都不是正式版软件的一部分，不要复制到测试包中。

## 根目录文件

- `README.md`：本工作区说明。
- `manifest.json`：开发工作区的 Figma 插件入口，指向 `system/dist`。
- `hidden_changes.conf`：Plastic SCM 的待处理更改隐藏规则。
- `.gitignore`：Git 忽略规则。

## 正式版跨电脑测试

1. 打开 `正式版软件/`。
2. 只压缩需要测试的版本目录，例如 `NGR-Figma-UI-Forge-v0.1.54`。
3. 在另一台电脑解压。
4. 打开 Figma Desktop，进入“插件 → 开发 → 从 manifest 导入插件”。
5. 选择解压目录中的 `manifest.json`。

正式版测试不需要安装 Node.js，也不需要携带工作区的其他目录。
