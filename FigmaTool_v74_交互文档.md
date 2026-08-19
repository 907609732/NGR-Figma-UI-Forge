# FigmaTool v74 交互文档

生成时间：2026-06-20  
分析对象：`/Users/chenyuecai/Downloads/FigmaTool_v74`

## 1. 产品定位

`FigmaTool_v74` 不是单一的“自动命名插件”，而是一套面向游戏 UI 生产链路的 Figma 自研插件。它把 Figma 设计稿、ArtHub 资源、本地工程配置、P4/Perforce、UE/引擎预览、DSL 导入和 AutoUI 智能生成串在一起。

插件名称为 `TimiL2GameUI`，入口由 Figma 插件 `Plugin/manifest.json` 指向：

- 主线程：`Plugin/dist/code.js`
- UI 面板：`Plugin/dist/ui.html`
- 本地服务：`Server/server.exe`
- 本地服务地址：`http://localhost:31700`

## 2. 启动与前置条件

### 2.1 启动流程

用户在 Figma 中打开插件后，插件会：

1. 初始化事件系统、网络服务、资源管理器和项目配置。
2. 监听 Figma 事件：选区变化、文档变化、拖拽、样式变化、页面切换。
3. 打开一个宽 `350px`、高 `1300px` 的插件 UI 面板。
4. 检查本地服务是否启动。
5. 检查当前项目配置是否有效。
6. 如果项目启用 P4，则检查 Perforce 连接和 workspace。
7. 进入 ArtHub 登录/鉴权。
8. 加载当前 Figma 文件所属模块的资源、组件库资源、扩展模块资源，并更新样式表。

### 2.2 异常分支

- 本地服务未启动：显示“服务器未启动，请先启动服务器，再打开插件。”
- 项目配置无效：进入项目配置页。
- P4 未连接：进入 Perforce 配置页。
- ArtHub token 失效：进入 REST OAuth 页面。
- 当前文件不属于工程：弹窗提示当前工程路径下无法使用插件功能。

## 3. 主界面结构

主界面分为顶部功能入口和主工作区。

### 3.1 顶部入口

- 返回主页
- 配置界面
- 导入 DSL
- ICON 管理
- 资源替换
- 组件引用
- 发布公告
- AutoUI
- 用户信息面板

### 3.2 主页折叠面板

主页包含四个核心折叠区：

- 操作面板
- 引擎预览
- 数据面板
- 资源面板

如果项目配置开启 `ShowBenchMark`，还会显示测试面板。

## 4. 操作面板

操作面板负责导出、检查、预览、样式和资源分析。

### 4.1 导出设置

当项目配置开启 `ShowExportSetting` 时，面板显示以下开关：

- 导入引擎：导出后通知引擎侧处理。
- Widget 自动保存 P4：导出 Widget 后自动提交/checkout。
- 打包图集：导出时触发图集打包。
- 资源自动保存 P4：资源导出后进入源控流程。

### 4.2 操作按钮

- 自动重命名：项目开启 `ShowAutoRename` 时出现，触发 `ExecRenameCommander`。
- 导出：对当前选中的 UI/Widget/组件导出 XML/FXML。
- 预览：导出运行时预览数据，并启动本地预览工程。
- 生成还原代码：导出页面数据后调用本地服务生成还原代码。
- 错误检查：运行文档/选区规范检查。
- 资源替换：查找并进入资源替换流程。
- Style 导出：导出 Figma color style 到引擎。
- Style 染色：根据自定义属性重新渲染所有带颜色的节点。
- 资源分析：分析设计稿中的资源引用和本地组件资源。
- 重启服务按钮：用于本地服务异常后的恢复入口。

### 4.3 导出模式

配置中可选择：

- `XD`：使用旧 XD XML 导出链路。
- `Figma`：使用 FXML/Figma 导出链路。

导出前默认会执行检查；如果项目配置开启 `IgnoreCheckOnExport`，则跳过检查。

## 5. 引擎预览

引擎预览用于把当前 Figma 选区与本地 UE 预览工程联动。

### 5.1 绑定

初始状态提示用户先选中主组件或画板。点击“绑定”后，插件记录当前节点路径：

- 画板显示为“画板”
- 主组件显示为“组件”

### 5.2 调试模式

绑定后可选择：

- 实时同步：文档变化时自动导出预览。
- 手动同步：用户点击“手动导出”才同步。

### 5.3 分辨率

当绑定对象是画板时，可选择：

- 移动端：`2340 x 1080`
- PC 端：`1920 x 1080`
- 自定义：手动输入宽高

### 5.4 组件嵌套深度

- `0`：完整预览。
- 大于 `0`：按指定嵌套深度导出依赖组件。

### 5.5 操作

- 开始调试
- 停止调试
- 手动导出
- 取消绑定
- 重新绑定

预览成功后会调用本地服务 `/run_preview_project` 启动 `Server/previewProject/NGRUIPreview.exe`。

## 6. 数据面板

数据面板根据 Figma 当前选区显示可编辑的自定义属性。用户可以通过“添加控件属性”下拉菜单给节点挂载不同 UI 控件数据。

### 6.1 可添加属性类型

- 程序控制 `ControlVariable`
- 材质图片 `Image`
- 网络图片 `RemoteImage`
- 图标 `Icon`
- 界面 `Page`
- 节点 `Node`
- 组件 `Component`
- 自动加载 `AutoLoad`
- 文本 `Text`
- 富文本 `RichText`
- 切页 `Tab`
- 切页控制器 `TabControl`
- 按钮 `Button`
- 全屏按钮 `PanelButton`
- 异形按钮 `PolygonButton`
- 输入框 `Input`
- 多行输入框 `MultiInput`
- Slider
- 重复网格 `Grid`
- 边缘模糊 `BlurredEdges`
- ProgressBar
- 缩放 `Scale`
- 背包网格 `BagGrid`
- TouchButton
- VideoPlayer
- Tip
- RollingNumber
- 光标最短路径 `CursorLayer`
- 多语言

### 6.2 属性显示规则

插件会根据选区类型、已有属性和项目黑名单动态决定可添加项。例如：

- 矩形节点可添加图片、网络图片、图标。
- 页面级 Frame 可添加 Page。
- Component 可添加 Component。
- Instance 可添加 AutoLoad。
- Text 节点可添加 Text 或 RichText。
- 同类互斥属性不会重复出现。

### 6.3 常见属性面板

- 节点：安全区、固定宽高比、防止点击穿透。
- 组件：安全区、防止点击穿透。
- 图片：材质、材质参数、SizeToContent、九宫格 Slice。
- 网络图片：URL。
- 图标：图标材质、材质参数、颜色/数值/布尔/选项参数。
- 文本/富文本：强制换行、完整单词换行、自动缩字、最大行数、默认颜色、默认字体。
- 输入框：内容类型、字数限制、提示文本颜色。
- 重复网格：间距、CellSize、行列数、起始轴、缩放、反向排列。
- Slider：背景、进度、滑块、方向、滑块有效区裁剪。
- ProgressBar：填充类型、裁剪类型、前景节点。
- Tab：选中/未选中状态及对应文本节点。
- Tip：弹出方向、对齐方式、间距。

## 7. 资源面板

资源面板用于查看、搜索、刷新和操作 ArtHub/本地工程资源。

### 7.1 顶部操作

- 刷新资源：检查并拉取资源更新。
- 刷新自定义信息：拉取资源的自定义标记信息。
- 清理缓存：清理已删除资源缓存。
- 导出 L10N：导出国际化资源。

### 7.2 搜索与筛选

- 输入资源名搜索。
- 切换显示方式。
- 切换结构类型。
- 切换排序方式。
- 展示 Libraries、当前模块、扩展模块资源树。

### 7.3 资源项交互

资源项支持拖拽到 Figma 画布，拖拽数据为资源 `resKey`。

右键菜单包含：

- 跳转到 ArtHub
- 更新自定义信息
- 资源替换
- 设置类型：大图、强制图集、自动图集、拼接图
- 设置分支
- 删除标记

资源项角标含义：

- 大图：不进图集。
- 图元：进图集。
- 额外图集：拼接图/二级图集。
- 刷新：云端有新版本。
- 替换：当前文档引用了旧资源。
- 删除：云端资源已删除。
- 待删除：资源被标记待删除。

## 8. 配置界面

配置界面负责切换项目路径、导出模式、P4 工作区和辅助工具。

### 8.1 项目配置

- 输入工程配置路径。
- 点击确认后调用本地服务切换项目目录。
- 展示 Engine、ArtHubRootID、IconID、LibrariesID、ModulesID、ProjectName、分辨率等项目配置。

### 8.2 P4 配置

当项目启用 P4 时显示：

- username
- port
- workspace
- isConnected

可从本地服务拉取 workspace 列表并切换对应工程目录。

### 8.3 用户开关

- 导入引擎
- Widget 自动保存 P4
- 打包图集
- 资源自动保存 P4
- 显示 XD 布局
- 开启 BenchMark 面板
- 关闭 P4 WorkSpace 拉取

### 8.4 工具按钮

- 生成 AssetID
- 生成组件引用
- 生成库组件引用

对应本地服务会生成 `ComponentReferenceList.csv`、`LibComponentReferenceList.csv`、`LibNoUsedComponentList.csv` 等文件。

## 9. DSL 导入

导入 DSL 页面用于从 `.uxdsl` 文件夹批量导入 UI 结构。

交互流程：

1. 输入或选择 Import Folder。
2. 点击 Refresh 拉取可导入文件列表。
3. 插件会对比当前 Figma 文档已有组件，标记新组件或已导入组件。
4. 支持按组件名搜索。
5. 单项导入时调用 DSL importer，并尝试读取同名 `.xdddc` 修饰文件，把 DSL 与控件属性一起写回 Figma。

## 10. ICON 管理

ICON 管理页用于按类别查看和同步图标资源。

功能包括：

- 刷新类别
- 导出 L10N
- 搜索类别
- 展开类别查看图标
- 从本地/ArtHub 拉取 icon 列表

## 11. 资源替换

资源替换页用于定位设计稿中引用旧资源、低版本资源或指定资源的节点。

交互包括：

- 显示方式切换。
- 搜索资源名。
- 重置图片大小开关。
- 查看每个资源的引用节点。
- 选中引用节点后同步 Figma 当前选区。
- 执行替换时可按资源维度或引用节点维度处理。

## 12. 组件引用

组件引用页用于查找某个组件在当前设计稿和本地工程中的引用关系。

使用方式：

1. 选中组件或实例，或在输入框填组件名。
2. 点击“查找引用”。
3. 插件显示引用列表。
4. 可对引用项执行导出更新，成功后通知引擎执行 `UpdateWidget`。

## 13. 发布公告

发布公告页读取 `Server/Notice/version*.html` 中的版本公告。当前包内包含 `version12.html` 至 `version73.html` 等历史公告文件，用于展示插件更新内容或提示用户有新版本。

## 14. AutoUI

AutoUI 是插件内嵌的智能生成/智能匹配工具。主面板中的 AutoUI 按钮会隐藏原主控制器，切换到 AutoUI React 应用。

### 14.1 智能生成

入口文案：`AutoUI 智能生成`

交互：

1. 点击 UI 圆形按钮，选择 UI 参考节点。
2. 点击 UX 圆形按钮，选择 UX 目标节点。
3. 两者都选择后自动初始化项目。
4. 调用 AutoUI 服务生成结果。
5. 如果配置开启生成后自动匹配，会自动进入还原/批量应用流程。

默认内部模型：`Qwen3V`。

### 14.2 智能匹配

入口文案：`AutoUI 智能匹配`

交互：

1. 选择 UI。
2. 选择 UX。
3. 初始化 Merge 项目。
4. 根据配置决定是否自动还原。

### 14.3 Advanced

Advanced 面板用于：

- 权限验证
- 环境切换
- LLM 模型设置
- 自动匹配、自动合并、增强匹配、快速应用等配置项
- 打开/刷新内嵌 iframe

## 15. 错误检查能力

错误检查会在导出前或用户点击“错误检查”时运行。主要检查项包括：

- 图层名重复。
- 图层名或资源名包含中文、空格、特殊字符。
- 控件引用的图层不存在。
- ProgressBar 缺少 foreground。
- Tab 缺少 ActiveLayer。
- 主组件名重复。
- 组件名与画板名重复。
- 不支持的图层类型、渐变、边框、阴影。
- 使用了资源库中没有的资源。
- 实例主组件丢失。
- 使用了非工程规定字体。
- 切页索引不规范。
- 命名含大写字母，要求小写加下划线。
- Artboard 必须开启响应式调整大小。
- 不能以 `E` 开头命名 artboard、组件和资源。
- 贴图边长必须满足 2 的 N 次幂或 4 的倍数。
- 使用了已标记删除的资源。
- 九宫格资源不能是纯色图。
- 文本规范问题。
- 导出根节点必须以 `UI` 或 `Widget` 开头。
- Grid 配置大小与实际大小不匹配。
- Mask 图需要锁定。
- 贴图单边大于 `1022` 无法正确打入图集。
- 资源未完成加载。
- ListView 滚动组小于重复网格。

## 16. 本地服务接口

插件大量依赖 `Server/server.exe`，通过 `http://localhost:31700` 访问本地接口。已识别的重要接口包括：

- `/on_heartbeat_xd`
- `/on_open_xd`
- `/project_folder`
- `/set_project_folder`
- `/project_setting`
- `/set_project_setting`
- `/user_setting`
- `/set_user_setting`
- `/localize_setting`
- `/get_module_name`
- `/get_module_branch_name`
- `/get_perforce_connect_data`
- `/get_perforce_workspaces`
- `/get_arthub_token`
- `/set_arthub_token`
- `/refresh_arthub_token`
- `/get_resource_thumbnail_image`
- `/get_import_dsl_files`
- `/get_file_content`
- `/get_decorate_text`
- `/get_local_components`
- `/get_team_components`
- `/get_remote_components_module_names`
- `/export_xdxml`
- `/export_preview_bridgeScript`
- `/export_page_code`
- `/run_preview_project`
- `/export_color_style`
- `/get_published_color_style`
- `/export_localozation_resources`
- `/full_construct_assetId`
- `/export_component_reference`
- `/export_lib_component_reference`
- `/requestArthubLink`
- `/analysis_copy_image`
- `/create_icon_sync_json`

## 17. 典型用户任务流

### 17.1 首次打开插件

1. 启动 `Server/server.exe`。
2. 在 Figma 打开插件。
3. 如果提示项目配置无效，进入配置界面填工程路径。
4. 如果启用 P4，完成 workspace 选择。
5. 完成 ArtHub 鉴权。
6. 回到主页，等待资源和样式加载完成。

### 17.2 给节点添加控件属性

1. 在 Figma 选中节点。
2. 打开数据面板。
3. 点击“添加控件属性”。
4. 选择合适类型，例如 Image、Button、Grid、Text。
5. 在对应 Inspector 中编辑字段。
6. 插件同步写入节点 plugin data。

### 17.3 导出 UI 到引擎

1. 选中符合规范的 UI 或 Widget 根节点。
2. 在操作面板确认导出设置。
3. 点击“错误检查”或直接点击“导出”。
4. 检查通过后导出 FXML/XML。
5. 如开启“导入引擎”，插件通知本地服务/引擎处理结果文件。
6. 如开启“打包图集”，继续执行图集打包。

### 17.4 预览 UI

1. 选中画板或主组件。
2. 在引擎预览中点击“绑定”。
3. 选择同步模式和分辨率。
4. 点击“开始调试”。
5. 实时或手动导出预览数据。
6. 本地预览工程启动并显示 UI。

### 17.5 替换过期资源

1. 打开资源面板刷新资源。
2. 查看带“刷新/替换/删除”标记的资源。
3. 右键资源选择“资源替换”，或点击操作面板“资源替换”。
4. 在资源替换页查看引用节点。
5. 勾选是否重置图片大小。
6. 执行替换。

### 17.6 使用 AutoUI

1. 点击顶部 `AutoUI`。
2. 在智能生成或智能匹配界面选择 UI 和 UX。
3. 等待初始化、生成或还原。
4. 如失败，进入 Advanced 处理权限、环境或模型配置。
5. 点击返回按钮回到原插件主界面。

## 18. 目录结构说明

```text
FigmaTool_v74/
  Plugin/
    manifest.json
    dist/
      code.js       # Figma 主线程逻辑
      ui.html       # 插件 UI 面板
  Server/
    server.exe      # 本地服务
    start.bat
    Notice/         # 版本公告 HTML
    images/         # 插件 UI 图标和资源缩略图
    texturepacker/  # TexturePacker 图集工具
    previewProject/ # UE/NGRUIPreview 本地预览工程
```

## 19. 交互事件概览

UI 与 Figma 主线程通过 `EventSystem` 通信。核心事件包括：

- 选区/文档：`RequestSelection`、`FigmaSelectionChanged`、`DocumentChanged`
- 属性：`InitCMProperty`、`SyncCMProperty`、`AddCMProperty`
- 导出：`ExecExportXDXMLCommander`、`ExecRuntimePreviewCommander`、`ExecExportPreviewCommander`、`ExecExportPageCodeCommander`
- 检查：`CheckError`
- 资源：`CheckResourceUpdate`、`GetResourceList`、`GetResourceImageByResKey`、`UpgradeResourceByResKey`、`ResourceReplace`
- 图标：`GetIconCategoryList`、`GetIconList`、`UpdateIconCategory`
- 样式：`GetStyleList`、`UpdateStyle`、`ExportColorStyle`
- AutoUI：`OpenAutoUITool`

## 20. 结论

该插件的核心价值是把 Figma 里的 UI 节点转成游戏工程可消费的数据，并提供从资源管理、属性标注、规范检查、导出、预览到智能生成的一整套工作台。使用者主要面向 UI 设计师、TA、客户端 UI 工程师和资源管理人员。

如果后续要继续整理，可以补充三类文档：

- 面向设计师的使用手册。
- 面向工程的接口/数据协议说明。
- 面向测试的功能用例与错误检查清单。
