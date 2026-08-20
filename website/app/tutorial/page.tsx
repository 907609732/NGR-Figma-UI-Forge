import Image from "next/image";
import Link from "next/link";

const downloadUrl = "https://github.com/907609732/NGR-Figma-UI-Forge/releases/download/v0.1.55/NGR-Figma-UI-Forge-v0.1.55.zip";

const chapters = [
  { href: "#install", label: "01 下载与安装" },
  { href: "#workspace", label: "02 界面与选区" },
  { href: "#naming", label: "03 词库命名" },
  { href: "#translation", label: "04 中文翻译" },
  { href: "#presets", label: "05 属性方案" },
  { href: "#organize", label: "06 画板与程序属性" },
  { href: "#variants", label: "07 一键变体" },
  { href: "#templates", label: "08 模板" },
  { href: "#settings", label: "09 AI 与设置" },
  { href: "#config", label: "10 配置复用" },
  { href: "#troubleshooting", label: "11 常见问题" },
];

const stateRows = [
  { state: "Normal", hover: "关闭", pressed: "关闭", disabled: "关闭" },
  { state: "Hover", hover: "打开", pressed: "关闭", disabled: "关闭" },
  { state: "Pressed", hover: "打开", pressed: "有则打开", disabled: "关闭" },
  { state: "Disabled", hover: "关闭", pressed: "关闭", disabled: "有则打开" },
];

function StepList({ items }: { items: string[] }) {
  return (
    <ol className="docSteps">
      {items.map((item, index) => (
        <li key={item}><span>{String(index + 1).padStart(2, "0")}</span><p>{item}</p></li>
      ))}
    </ol>
  );
}

export default function TutorialPage() {
  return (
    <main className="tutorialPage">
      <header className="tutorialHeader">
        <Link className="brand" href="/" aria-label="返回 NGR Figma UI 锻造台官网">
          <Image src="/brand-logo.png" alt="" width={34} height={34} priority />
          <span>NGR Figma UI 锻造台</span>
        </Link>
        <nav aria-label="教程导航">
          <Link href="/">产品首页</Link>
          <a href={downloadUrl}>下载正式版</a>
          <a href="#variants">一键变体</a>
          <a href="#troubleshooting">常见问题</a>
        </nav>
      </header>

      <section className="tutorialHero">
        <div>
          <p className="eyebrow">PRODUCT DOCUMENTATION / V0.1.55</p>
          <h1>从下载安装，到完成一次稳定交付。</h1>
          <p>这份手册对应软件 v0.1.55 的真实界面，完整说明选区识别、命名、翻译、属性、画板整理、程序属性、模板、一键变体和设置迁移。</p>
          <div className="heroActions">
            <a className="primaryAction" href={downloadUrl}>下载 v0.1.55</a>
            <a className="secondaryAction" href="#variants">查看状态层规则</a>
          </div>
        </div>
        <div className="tutorialHeroVisual">
          <Image src="/plugin-ui.png" alt="NGR Figma UI 锻造台插件界面" width={560} height={720} priority />
        </div>
      </section>

      <div className="tutorialShell">
        <aside className="tutorialToc" aria-label="教程目录">
          <p>教程目录</p>
          <nav>{chapters.map((chapter) => <a key={chapter.href} href={chapter.href}>{chapter.label}</a>)}</nav>
          <Link className="tocBack" href="/">← 返回产品首页</Link>
        </aside>

        <article className="tutorialDocument">
          <section id="install" className="docSection">
            <p className="docKicker">01 / DOWNLOAD & INSTALLATION</p>
            <h2>下载正式版并导入 Figma Desktop</h2>
            <p className="docLead">正式版 ZIP 只有 manifest.json、code.js、ui.html 和 README.md，可以复制到其他电脑直接测试。</p>
            <StepList items={[
              "点击“下载 v0.1.55”，将 NGR-Figma-UI-Forge-v0.1.55.zip 保存到电脑。",
              "完整解压 ZIP 到固定目录，不要删除或单独移动其中任何一个文件。",
              "打开 Figma Desktop，进入 Plugins → Development → Import plugin from manifest。",
              "选择解压目录中的 manifest.json，再从 Development 列表启动“NGR Figma UI 锻造台”。",
            ]} />
            <div className="docCallout"><strong>更新插件</strong><p>下载新版本后，用新目录重新导入一次 manifest；确认设置页显示目标版本后，再删除旧目录。</p></div>
            <div className="docCallout warning"><strong>完整性校验</strong><p>v0.1.55 ZIP 的 SHA-256 是 B07B6B978880E41EF1661612C1A75B0825D49BC5ED7EE2F27BFC3EFADA28F7C6。</p></div>
          </section>

          <section id="workspace" className="docSection">
            <p className="docKicker">02 / WORKSPACE & SELECTION</p>
            <h2>先认识 5 个工作区和当前选区</h2>
            <p className="docLead">顶部标签依次是命名、模板、功能、变体和设置；右上角“刷新”用于重新读取当前 Figma 选区。</p>
            <div className="docGrid three">
              <div><strong>命名</strong><p>词库推荐、中文翻译、命名范围和共享属性方案。</p></div>
              <div><strong>模板</strong><p>插入 Library 或内置 PC、IOS 画板模板。</p></div>
              <div><strong>功能</strong><p>整理画板、自动命名，并挂文本程序控制属性。</p></div>
              <div><strong>变体</strong><p>生成 State、Checked、Style 和状态层组合。</p></div>
              <div><strong>设置</strong><p>软件版本、官网、百度翻译与 AI 接口配置。</p></div>
              <div><strong>当前选择</strong><p>显示节点类型、名称和数量；操作前确认这里与画布选区一致。</p></div>
            </div>
            <ul className="docBullets">
              <li>TEXT、IMAGE、FRAME、COMPONENT、SHAPE 会匹配各自的推荐词库。</li>
              <li>批量处理前确认“命名范围”和“跳过锁定/隐藏”是否符合预期。</li>
              <li>按钮不可用时先检查当前选择，再点击刷新，不要重复执行同一操作。</li>
            </ul>
          </section>

          <section id="naming" className="docSection">
            <p className="docKicker">03 / NAMING</p>
            <h2>用词库完成规范命名</h2>
            <p className="docLead">日常命名只需要选择节点、搜索词条，并决定是否同步套用当前属性方案。</p>
            <StepList items={[
              "选中一个或多个节点，确认“当前选择”正确并查看自动识别的节点类型。",
              "在推荐词条中搜索英文或中文说明，点击词条即可命名；多选时会自动生成带序号的名称。",
              "需要处理容器内部时，把范围改为“直接子级”或“全部子节点”，并决定是否跳过 Locked、Hidden。",
              "需要同步字体、颜色、约束等属性时，开启“点击任意词条时同步套用当前方案”后再点击词条。",
            ]} />
            <div className="docGrid">
              <div><strong>仅选中节点</strong><p>只改当前选择，适合日常单节点或多选命名。</p></div>
              <div><strong>直接子级</strong><p>处理容器下一层，不继续递归更深层级。</p></div>
              <div><strong>全部子节点</strong><p>递归处理整个容器；复杂画板操作前建议先小范围验证。</p></div>
              <div><strong>维护词库</strong><p>点击推荐词条右侧齿轮，可新增、复制、删除、导入或导出词库。</p></div>
            </div>
          </section>

          <section id="translation" className="docSection">
            <p className="docKicker">04 / TRANSLATION</p>
            <h2>把中文语义转换成英文节点名</h2>
            <p className="docLead">中文翻译使用百度翻译配置，结果会整理成适合作为节点名称的英文格式。</p>
            <StepList items={[
              "在设置页填写百度翻译 App ID、密钥，并保持常用的 From=zh、To=en。",
              "点击“保存百度翻译”，先用一段短中文验证接口配置。",
              "回到命名页输入中文；也可以开启“选中节点时自动带入输入框”。",
              "点击“翻译命名”；若还要给文本写入程序属性，使用“翻译并挂属性”。",
            ]} />
            <ul className="docBullets">
              <li>“翻译命名”只更新节点名；“翻译并挂属性”还会递归处理选区内文本。</li>
              <li>画板整理中的翻译失败时会尽量保留原名称继续，不会直接中断全部整理。</li>
            </ul>
            <div className="docCallout warning"><strong>密钥只保存在当前设备</strong><p>不要把个人 App ID、密钥或测试口令提交到公开仓库。</p></div>
          </section>

          <section id="presets" className="docSection">
            <p className="docKicker">05 / PROPERTY PRESETS</p>
            <h2>复用共享属性方案</h2>
            <p className="docLead">属性方案与单个词条分离，同一套字体、颜色和布局规范可以复用于不同命名。</p>
            <div className="docGrid three">
              <div><strong>视觉属性</strong><p>字体、字重、字号、行高、填充色、透明度、圆角。</p></div>
              <div><strong>布局属性</strong><p>Position、Constraints、Auto Layout 间距和内边距。</p></div>
              <div><strong>按需应用</strong><p>每个字段都有独立勾选框，未勾选字段保持原样。</p></div>
            </div>
            <StepList items={[
              "选择当前属性方案，或进入“编辑当前属性方案”新建、复制和删除方案。",
              "只勾选本次需要写入的字段；未勾选项不会覆盖节点现有属性。",
              "使用 28 / 32 / 48、常用颜色、一键归零和一键居中完成高频设置。",
              "开启词条同步开关后点击命名词条，一次完成改名和属性套用。",
            ]} />
          </section>

          <section id="organize" className="docSection">
            <p className="docKicker">06 / FRAME ORGANIZE & METADATA</p>
            <h2>整理画板并写入程序属性</h2>
            <p className="docLead">功能页包含“一键整理并命名画板”和“一键挂文本加程序控制属性”，两者可以独立使用。</p>
            <StepList items={[
              "在“整理规则设置”中决定是否删除隐藏节点、删除 Mask、解散 Group，以及是否挂文本或图片属性。",
              "选中一个主画板，确认其当前名称能表达画板语义，再点击“一键整理并命名画板”。",
              "插件先执行清理规则，再判断 IOS、PC 或 Item，最后生成“工程名_英文画板名_平台”名称。",
            ]} />
            <div className="docGrid">
              <div><strong>整理规则</strong><p>各个删除、解散和挂属性开关彼此独立，只影响本次画板整理。</p></div>
              <div><strong>画板命名</strong><p>输出结构为“Figma工程名_画板英文名_PC/IOS/Item”。</p></div>
              <div><strong>文本属性</strong><p>写入 CMVarPropertyData 与 CMTextPropertyData，供下游工具读取。</p></div>
              <div><strong>冲突保护</strong><p>已有 CMRichTextPropertyData 或 CMRollingNumberPropertyData 的文本会跳过文本属性。</p></div>
            </div>
          </section>

          <section id="variants" className="docSection docSectionAccent">
            <p className="docKicker">07 / ONE-CLICK VARIANTS</p>
            <h2>生成 State、Checked 与 Style 变体</h2>
            <p className="docLead">选择 Frame 或独立 Component 后，可生成跳转按钮 3/4 状态、选择按钮 6/8 状态，或附加 Style 组合。</p>
            <div className="variantModeGrid">
              <div><span>3/4</span><strong>跳转按钮</strong><p>Normal / Hover / Pressed，可选 Disabled</p></div>
              <div><span>6</span><strong>选择按钮</strong><p>Unchecked / Checked 各 3 个 State</p></div>
              <div><span>8</span><strong>选择按钮</strong><p>在 6 状态基础上增加两个 Disabled</p></div>
            </div>
            <h3>基础状态与附加 Style</h3>
            <ul className="docBullets">
              <li>“仅 Style”只生成 Style 维度；“不添加 Style”保持基础状态模式。</li>
              <li>“常态和完成”生成 Style=Normal / Complete；“排名”生成 Style=1st / 2nd / 3rd。</li>
              <li>已有 Component Set 只适合追加 Style；如果已经存在 Style 属性会停止，避免重复。</li>
            </ul>
            <h3>可选：按节点名切换状态层</h3>
            <p>开启后会递归检查每个生成组件的全部后代，去除名称首尾空格并忽略大小写，只精确匹配 Hover、Pressed、Disabled。同名节点全部处理，Icon_Hover 等非精确名称不受影响。</p>
            <div className="tableWrap">
              <table>
                <thead><tr><th>State</th><th>Hover</th><th>Pressed</th><th>Disabled</th></tr></thead>
                <tbody>{stateRows.map((row) => <tr key={row.state}><th>{row.state}</th><td>{row.hover}</td><td>{row.pressed}</td><td>{row.disabled}</td></tr>)}</tbody>
              </table>
            </div>
            <div className="docCallout strong"><strong>Pressed 必须同时打开 Hover</strong><p>存在 Pressed 节点时也会一并打开；缺少 Pressed 或 Disabled 节点不会报错。</p></div>
            <ul className="docBullets">
              <li>Checked 与 Unchecked 使用完全相同的 State 映射。</li>
              <li>附加 Style 时，同一 State 的不同 Style 保持相同可见性。</li>
              <li>已有 Component Set 追加 Style 时，该选项会禁用并保留原组件可见性。</li>
              <li>开关默认关闭并记住上次选择；关闭时完整保留原有可见性。</li>
            </ul>
          </section>

          <section id="templates" className="docSection">
            <p className="docKicker">08 / TEMPLATES</p>
            <h2>插入 Library 或内置模板</h2>
            <p className="docLead">模板页提供 PC、IOS 两类来源，可在模板设置中维护 Component Key 和插入后是否打散。</p>
            <div className="docGrid">
              <div><strong>Library 模板</strong><p>从已发布组件库导入，适合高还原度结构；使用前需要填写 Component Key。</p></div>
              <div><strong>内置模板</strong><p>没有 Component Key 时仍可创建基础画板骨架，适合快速占位和搭建。</p></div>
            </div>
            <StepList items={[
              "打开模板页右上角“模板设置”，选择来源、PC/IOS 平台并填写按钮名称。",
              "使用 Library 模板时，从已发布组件链接中取得 Component Key，并决定插入后是否打散。",
              "内置 PC 画板填写 Component Key 时会高保真导入；未填写时创建 2560 × 1440 基础骨架。",
              "返回模板列表点击对应按钮，插入后检查名称、层级、图片和实例属性。",
            ]} />
          </section>

          <section id="settings" className="docSection">
            <p className="docKicker">09 / AI & SETTINGS</p>
            <h2>配置翻译、AI 命名和帮助入口</h2>
            <p className="docLead">设置页顶部显示软件版本、最新官网和词库仓库，下面分别管理百度翻译与可选 AI 服务。</p>
            <div className="docGrid">
              <div><strong>OpenAI 兼容 API</strong><p>开启 AI 后填写 Base URL、API Key、模型和提示词，适合接入兼容服务。</p></div>
              <div><strong>Kimi API</strong><p>选择 Kimi 后使用对应接口地址和模型；API Key 只保存在当前设备。</p></div>
              <div><strong>问号说明</strong><p>每个设置旁的“？”会解释字段用途、推荐值和可能影响。</p></div>
              <div><strong>官网入口</strong><p>“官方网站”应打开 https://figma.lttlt.top，可从这里检查最新教程和下载。</p></div>
            </div>
            <div className="docCallout warning"><strong>先小范围测试</strong><p>配置第三方接口后，先对一个临时节点测试命名结果与配额，再用于正式画板。</p></div>
          </section>

          <section id="config" className="docSection">
            <p className="docKicker">10 / CONFIGURATION</p>
            <h2>在设备和项目间复用配置</h2>
            <p className="docLead">词库、属性方案和插件设置通过现有导入导出通道保存。</p>
            <StepList items={[
              "打开词库与属性方案设置，导出 JSON 或 CSV 作为可编辑备份。",
              "在另一台设备导入对应文件，检查词条、作用范围和当前属性方案。",
              "重新配置百度翻译或 AI 密钥；敏感密钥不会随公开词库一起迁移。",
              "在临时 Figma 文件分别测试命名、属性方案、画板整理和一键变体，再进入正式项目。",
            ]} />
          </section>

          <section id="troubleshooting" className="docSection">
            <p className="docKicker">11 / TROUBLESHOOTING</p>
            <h2>常见问题</h2>
            <div className="docFaq">
              <details><summary>下载后为什么无法导入？<span>+</span></summary><p>先完整解压 ZIP，再选择解压目录里的 manifest.json；确认 code.js 和 ui.html 与 manifest 位于同一目录。</p></details>
              <details><summary>为什么推荐词条不符合节点类型？<span>+</span></summary><p>点击右上角刷新并检查“当前选择”；插件会按 TEXT、IMAGE、FRAME、COMPONENT、SHAPE 分类推荐。</p></details>
              <details><summary>为什么状态层没有切换？<span>+</span></summary><p>先确认开关已开启、当前是在 Frame/独立 Component 新建变体，并检查节点名是否精确为 Hover、Pressed 或 Disabled。</p></details>
              <details><summary>为什么状态层选项是灰色？<span>+</span></summary><p>仅 Style 模式、选中 Component Set，或选择位于 Component Set 内的组件时不适用。</p></details>
              <details><summary>翻译失败会不会破坏画板？<span>+</span></summary><p>画板整理会尽量使用原名称继续；请到设置页检查百度翻译配置和网络权限。</p></details>
              <details><summary>为什么文本属性没有写入？<span>+</span></summary><p>节点可能已有富文本或滚动数字属性，插件会跳过冲突的文本属性；同时检查选区内是否确实包含 TEXT 节点。</p></details>
              <details><summary>为什么 Library 模板无法插入？<span>+</span></summary><p>确认组件已发布到可访问的 Figma Library、Component Key 正确，并检查当前账号是否有该 Library 权限。</p></details>
              <details><summary>如何确认自己使用的是新版本？<span>+</span></summary><p>打开插件设置页的软件信息，版本应显示 0.1.55，发布日期为 2026-08-20。</p></details>
            </div>
          </section>

          <section className="tutorialClosing">
            <p className="docKicker">READY TO FORGE</p>
            <h2>下载正式版，回到 Figma 把规范交给工具。</h2>
            <div className="heroActions closingActions">
              <a className="primaryAction" href={downloadUrl}>下载 v0.1.55</a>
              <Link className="secondaryAction" href="/">返回产品首页</Link>
            </div>
          </section>
        </article>
      </div>
    </main>
  );
}
