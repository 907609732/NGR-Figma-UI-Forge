import Image from "next/image";
import Link from "next/link";

const capabilities = [
  {
    index: "01",
    title: "词库命名",
    tag: "NAMING",
    body: "自动识别节点类型，按当前选区推荐词条。一次点击即可完成规范命名，也可同步应用属性方案。",
    meta: "TEXT / IMAGE / FRAME / COMPONENT / SHAPE",
  },
  {
    index: "02",
    title: "中文翻译",
    tag: "TRANSLATE",
    body: "把中文设计语义转换成规范英文节点名，支持选区自动带入和翻译后挂载文本属性。",
    meta: "BAIDU TRANSLATE / AUTO FILL",
  },
  {
    index: "03",
    title: "属性方案",
    tag: "PRESET",
    body: "统一管理字号、行高、颜色、透明度、圆角、Constraints 与 Auto Layout，让团队规范可复用。",
    meta: "STYLE / LAYOUT / CONSTRAINTS",
  },
  {
    index: "04",
    title: "画板整理",
    tag: "FRAME",
    body: "按工程名、画板语义与平台后缀生成最终命名，并按规则清理隐藏层、Group 和 Mask。",
    meta: "PC / IOS / ITEM",
  },
  {
    index: "05",
    title: "程序属性",
    tag: "METADATA",
    body: "为文本和图片节点写入下游工具可读的控制数据，遇到富文本或滚动数字配置时自动避让。",
    meta: "CM PROPERTY DATA",
  },
  {
    index: "06",
    title: "模板、一键变体与状态层",
    tag: "COMPONENT",
    body: "导入 Library 或内置画板模板，批量生成 State、Checked 和 Style 组合；还可按节点名自动切换 Hover、Pressed、Disabled 状态层。",
    meta: "TEMPLATE / VARIANT SET / STATE LAYERS",
  },
];

const workflow = [
  { title: "读取选区", body: "识别节点类型、当前名称与子节点数量。" },
  { title: "匹配规范", body: "从团队词库、翻译结果和属性方案中选择。" },
  { title: "批量锻造", body: "完成命名、整理、挂属性、模板或变体生成。" },
  { title: "交付复用", body: "将配置、组件和元数据沉淀为下一个项目的起点。" },
];

const releaseFeatures = [
  {
    label: "NORMAL",
    title: "关闭全部状态层",
    body: "生成 Normal 变体时，关闭精确命名为 Hover、Pressed、Disabled 的节点。",
  },
  {
    label: "HOVER",
    title: "只打开 Hover",
    body: "生成 Hover 变体时，仅打开 Hover；重复或嵌套的精确同名节点会一起处理。",
  },
  {
    label: "PRESSED",
    title: "同时打开 Hover 与 Pressed",
    body: "Pressed 会保留悬停反馈，并在存在 Pressed 节点时同步打开按下层。",
  },
  {
    label: "DISABLED",
    title: "只打开 Disabled",
    body: "生成 Disabled 变体时仅打开 Disabled；缺少对应节点会跳过，不中断生成。",
  },
];

const faqs = [
  {
    q: "它适合什么团队？",
    a: "适合需要高频整理 UI 资源的设计师、游戏 UI 团队、组件库维护者，以及需要把 Figma 节点交给工程工具继续处理的团队。",
  },
  {
    q: "会覆盖已有属性吗？",
    a: "属性应用由勾选项控制。文本元数据遇到富文本或滚动数字冲突时会自动跳过，降低误操作风险。",
  },
  {
    q: "没有 Library 模板还能用吗？",
    a: "可以。插件包含 PC 和 IOS 内置画板骨架，未配置 Component Key 时仍然可以创建基础结构。",
  },
  {
    q: "规范能否在不同项目复用？",
    a: "可以。词库、属性方案和插件配置支持导入导出，适合在项目、设备和团队成员之间复用。",
  },
  {
    q: "一键变体会自动修改状态层吗？",
    a: "这是默认关闭的可选功能，只用于 Frame 或独立 Component 新建变体。开启后会递归精确匹配 Hover、Pressed、Disabled；Pressed 会同时打开 Hover 和已有的 Pressed。",
  },
];

export default function Home() {
  return (
    <main>
      <section className="hero" aria-labelledby="hero-title">
        <Image
          className="heroProduct"
          src="/plugin-ui.png"
          alt="NGR Figma UI 锻造台插件真实界面"
          width={560}
          height={720}
          priority
        />
        <nav className="nav" aria-label="主导航">
          <a className="brand" href="#top" aria-label="NGR Figma UI 锻造台首页">
            <Image src="/brand-logo.png" alt="" width={36} height={36} priority />
            <span>NGR Figma UI 锻造台</span>
          </a>
          <div className="navLinks">
            <a href="#capabilities">功能</a>
            <a href="#workflow">工作流</a>
            <Link href="/tutorial">教程</Link>
            <a href="#install">安装</a>
            <a href="#faq">FAQ</a>
          </div>
        </nav>

        <div id="top" className="heroContent">
          <p className="eyebrow">NGR DESIGN OPERATIONS / FIGMA PLUGIN</p>
          <h1 id="hero-title">NGR Figma UI 锻造台</h1>
          <p className="heroLead">
            把节点命名、中文翻译、属性方案、画板整理、模板与变体，锻造成一条团队可复用的 UI 交付流程。
          </p>
          <div className="heroActions">
            <Link className="primaryAction" href="/tutorial">查看完整教程</Link>
            <a className="secondaryAction" href="#capabilities">浏览产品功能</a>
          </div>
          <div className="releaseLine" aria-label="当前版本">
            <span>V0.1.54</span>
            <span>UPDATED 2026.08.19</span>
            <span>INTERNAL TOOL</span>
          </div>
        </div>
      </section>

      <section className="signalBand" aria-label="核心工作区">
        <span>NAMING</span>
        <span>TRANSLATE</span>
        <span>PRESET</span>
        <span>TEMPLATE</span>
        <span>VARIANT</span>
      </section>

      <section className="positioning sectionBand">
        <div className="sectionIntro">
          <p className="eyebrow">WHY IT EXISTS</p>
          <h2>从设计稿到可交付资产，中间少一点重复劳动。</h2>
        </div>
        <div className="positioningCopy">
          <p>
            它不是只能“一键改名”的小工具，而是一座面向游戏 UI 团队的 Figma 工作台。日常操作保持三步短路径，复杂规范收进可维护的词库、属性方案和模板。
          </p>
          <dl className="factGrid">
            <div><dt>5</dt><dd>核心工作区</dd></div>
            <div><dt>3 步</dt><dd>完成常用命名</dd></div>
            <div><dt>PC / IOS</dt><dd>画板平台识别</dd></div>
          </dl>
        </div>
      </section>

      <section id="capabilities" className="capabilities sectionBand">
        <div className="sectionIntro wide">
          <p className="eyebrow">CAPABILITY MAP</p>
          <h2>完整能力，按真实交付场景组织。</h2>
          <p>从单个节点到整张画板，从命名语义到程序可读数据。</p>
        </div>
        <div className="capabilityGrid">
          {capabilities.map((item) => (
            <article className="capabilityCard" key={item.title}>
              <div className="cardTopline"><span>{item.index}</span><span>{item.tag}</span></div>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
              <small>{item.meta}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="releaseFeature sectionBand" aria-labelledby="state-layer-title">
        <div className="sectionIntro wide">
          <p className="eyebrow">NEW IN V0.1.54 / VARIANT STATE LAYERS</p>
          <h2 id="state-layer-title">生成变体时，状态层也能自动就位。</h2>
          <p>
            开启“按节点名切换状态层”后，插件会递归精确匹配 Hover、Pressed、Disabled。
            Checked 与 Unchecked 使用同一套 State 规则，Style 组合也会保持一致。
          </p>
        </div>
        <div className="releaseFeatureGrid">
          {releaseFeatures.map((item) => (
            <article key={item.label}>
              <span>{item.label}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
        <div className="releaseFeatureNote">
          <strong>精确、安全、可选</strong>
          <p>Icon_Hover 等非精确名称不会被修改；已有 Component Set 追加 Style 时该选项自动禁用。</p>
          <Link href="/tutorial#variants">查看一键变体教程 →</Link>
        </div>
      </section>

      <section id="workflow" className="workflow sectionBand">
        <div className="workflowVisual" aria-label="插件命名界面预览">
          <Image src="/plugin-ui.png" alt="词库命名、中文翻译和属性方案界面" width={560} height={720} />
        </div>
        <div className="workflowContent">
          <p className="eyebrow">THE FORGE FLOW</p>
          <h2>把规范放进工具，让每次交付都更稳定。</h2>
          <div className="workflowList">
            {workflow.map((item, index) => (
              <article key={item.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div><h3>{item.title}</h3><p>{item.body}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="install" className="install sectionBand">
        <div className="sectionIntro wide">
          <p className="eyebrow">INTERNAL INSTALLATION</p>
          <h2>三步载入开发版插件。</h2>
          <p>当前版本面向 NGR 内部工作流，通过 Figma 开发插件方式安装。</p>
        </div>
        <ol className="installSteps">
          <li><span>01</span><h3>打开开发插件入口</h3><p>在 Figma 中进入 Plugins → Development。</p></li>
          <li><span>02</span><h3>导入 Manifest</h3><p>选择 Import plugin from manifest，定位到项目根目录的 manifest.json。</p></li>
          <li><span>03</span><h3>打开锻造台</h3><p>在开发插件列表选择 NGR Figma UI 锻造台。</p></li>
        </ol>
      </section>

      <section id="faq" className="faq sectionBand">
        <div className="sectionIntro">
          <p className="eyebrow">FAQ</p>
          <h2>使用前需要了解的几件事。</h2>
        </div>
        <div className="faqList">
          {faqs.map((item) => (
            <details key={item.q}>
              <summary>{item.q}<span aria-hidden="true">+</span></summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="closing sectionBand">
        <p className="eyebrow">NGR FIGMA UI FORGE</p>
        <h2>让设计经验不只留在个人操作里。</h2>
        <Link className="primaryAction darkAction" href="/tutorial">从教程开始</Link>
      </section>

      <footer>
        <a className="brand footerBrand" href="#top">
          <Image src="/brand-logo.png" alt="" width={32} height={32} />
          <span>NGR Figma UI 锻造台</span>
        </a>
        <div className="footerLinks">
          <Link href="/tutorial">使用教程</Link>
          <a href="https://github.com/907609732/FigamTool" target="_blank" rel="noreferrer">GitHub</a>
          <span>V0.1.54 · 2026.08.19</span>
        </div>
      </footer>
    </main>
  );
}
