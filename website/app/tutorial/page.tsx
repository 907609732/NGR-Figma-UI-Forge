import Image from "next/image";
import Link from "next/link";

const chapters = [
  { href: "#install", label: "01 安装插件" },
  { href: "#naming", label: "02 词库命名" },
  { href: "#translation", label: "03 中文翻译" },
  { href: "#presets", label: "04 属性方案" },
  { href: "#organize", label: "05 画板整理" },
  { href: "#variants", label: "06 一键变体" },
  { href: "#templates", label: "07 模板" },
  { href: "#config", label: "08 配置复用" },
  { href: "#troubleshooting", label: "09 常见问题" },
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
        <li key={item}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <p>{item}</p>
        </li>
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
          <a href="#variants">一键变体</a>
          <a href="#troubleshooting">常见问题</a>
        </nav>
      </header>

      <section className="tutorialHero">
        <div>
          <p className="eyebrow">PRODUCT DOCUMENTATION / V0.1.54</p>
          <h1>把重复操作，整理成一条稳定工作流。</h1>
          <p>
            这份教程从安装开始，依次介绍词库命名、中文翻译、属性方案、画板整理、模板和一键变体。
            建议第一次使用时按章节顺序完成一次。
          </p>
          <div className="heroActions">
            <a className="primaryAction" href="#install">开始上手</a>
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
          <nav>
            {chapters.map((chapter) => (
              <a key={chapter.href} href={chapter.href}>{chapter.label}</a>
            ))}
          </nav>
          <Link className="tocBack" href="/">← 返回产品首页</Link>
        </aside>

        <article className="tutorialDocument">
          <section id="install" className="docSection">
            <p className="docKicker">01 / INSTALLATION</p>
            <h2>安装开发版插件</h2>
            <p className="docLead">插件从本地 manifest 载入，适合内部团队直接使用和持续更新。</p>
            <StepList items={[
              "下载或同步完整工程，确认项目根目录中存在 manifest.json。",
              "在 Figma Desktop 打开 Plugins → Development → Import plugin from manifest。",
              "选择项目根目录的 manifest.json，之后从 Development 插件列表启动锻造台。",
            ]} />
            <div className="docCallout"><strong>更新插件</strong><p>代码更新并重新生成 dist 后，关闭再打开插件即可载入新版本，无需重复导入 manifest。</p></div>
          </section>

          <section id="naming" className="docSection">
            <p className="docKicker">02 / NAMING</p>
            <h2>用词库完成规范命名</h2>
            <p className="docLead">日常命名只需要选择节点、选择词条、决定是否套用属性方案。</p>
            <StepList items={[
              "选中一个或多个 Figma 节点，插件会根据 TEXT、IMAGE、FRAME、COMPONENT、SHAPE 等类型筛选词条。",
              "搜索或直接点击推荐词条，插件会更新选中节点名称。",
              "需要同步字体、颜色、约束等属性时，开启“点击任意词条时同步套用当前方案”。",
            ]} />
            <div className="docGrid">
              <div><strong>批量命名</strong><p>多选节点时按同一词条生成带序号的名称。</p></div>
              <div><strong>维护词库</strong><p>在“作用范围与词库管理”中增删词条并调整适用节点类型。</p></div>
            </div>
          </section>

          <section id="translation" className="docSection">
            <p className="docKicker">03 / TRANSLATION</p>
            <h2>把中文语义转换成英文节点名</h2>
            <p className="docLead">中文翻译使用百度翻译配置，结果会整理成适合作为节点名称的英文格式。</p>
            <StepList items={[
              "在设置页填写百度翻译 App ID、密钥，并保持常用的 From=zh、To=en。",
              "回到命名页输入中文；也可以开启“选中节点时自动带入输入框”。",
              "点击“翻译命名”；若还要给文本写入程序属性，使用“翻译并挂属性”。",
            ]} />
            <div className="docCallout warning"><strong>密钥只保存在当前设备</strong><p>不要把个人 App ID、密钥或测试口令提交到公开仓库。</p></div>
          </section>

          <section id="presets" className="docSection">
            <p className="docKicker">04 / PROPERTY PRESETS</p>
            <h2>复用属性方案</h2>
            <p className="docLead">属性方案与单个词条分离，可以让同一套字体、颜色和布局规范复用于不同命名。</p>
            <div className="docGrid three">
              <div><strong>视觉属性</strong><p>字体、字重、字号、行高、填充色、透明度、圆角。</p></div>
              <div><strong>布局属性</strong><p>Position、Constraints、Auto Layout 间距和内边距。</p></div>
              <div><strong>按需应用</strong><p>每个字段都有独立勾选框，未勾选字段保持原样。</p></div>
            </div>
          </section>

          <section id="organize" className="docSection">
            <p className="docKicker">05 / FRAME ORGANIZE</p>
            <h2>一键整理并命名画板</h2>
            <p className="docLead">该功能按工程名、画板语义和平台生成主画板名称，并递归整理内部节点。</p>
            <StepList items={[
              "在“整理规则设置”中决定是否删除隐藏节点、删除 Mask、解散 Group，以及是否挂文本或图片属性。",
              "选中一个主画板，点击“一键整理并命名画板”。",
              "插件先执行清理规则，再判断 IOS、PC 或 Item，最后生成“工程名_英文画板名_平台”名称。",
            ]} />
          </section>

          <section id="variants" className="docSection docSectionAccent">
            <p className="docKicker">06 / ONE-CLICK VARIANTS</p>
            <h2>生成 State、Checked 与 Style 变体</h2>
            <p className="docLead">
              选择 Frame 或独立 Component 后，可生成跳转按钮 4 状态、选择按钮 6/8 状态，或附加 Style 组合。
            </p>
            <div className="variantModeGrid">
              <div><span>4</span><strong>跳转按钮</strong><p>Normal / Hover / Pressed / Disabled</p></div>
              <div><span>6</span><strong>选择按钮</strong><p>Checked × Normal / Hover / Pressed</p></div>
              <div><span>8</span><strong>选择按钮</strong><p>在 6 状态基础上增加两个 Disabled</p></div>
            </div>
            <h3>可选：按节点名切换状态层</h3>
            <p>
              开启后会递归检查每个生成组件的全部后代，去除名称首尾空格并忽略大小写，
              只精确匹配 Hover、Pressed、Disabled。同名节点全部处理，Icon_Hover 等非精确名称不受影响。
            </p>
            <div className="tableWrap">
              <table>
                <thead><tr><th>State</th><th>Hover</th><th>Pressed</th><th>Disabled</th></tr></thead>
                <tbody>
                  {stateRows.map((row) => (
                    <tr key={row.state}>
                      <th>{row.state}</th><td>{row.hover}</td><td>{row.pressed}</td><td>{row.disabled}</td>
                    </tr>
                  ))}
                </tbody>
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
            <p className="docKicker">07 / TEMPLATES</p>
            <h2>插入 Library 或内置模板</h2>
            <p className="docLead">模板页提供 PC、IOS 两类来源，可在模板设置中维护 Component Key 和插入后是否打散。</p>
            <div className="docGrid">
              <div><strong>Library 模板</strong><p>从已发布组件库导入，适合高还原度结构；使用前需要填写 Component Key。</p></div>
              <div><strong>内置模板</strong><p>没有 Component Key 时仍可创建基础画板骨架，适合快速占位和搭建。</p></div>
            </div>
          </section>

          <section id="config" className="docSection">
            <p className="docKicker">08 / CONFIGURATION</p>
            <h2>在设备和项目间复用配置</h2>
            <p className="docLead">词库、属性方案和插件设置通过现有导入导出通道保存。</p>
            <StepList items={[
              "打开词库与属性方案设置，导出 JSON 或 CSV 作为可编辑备份。",
              "在另一台设备导入对应文件，检查词条、作用范围和当前属性方案。",
              "敏感 API Key 只保存在本机，不包含在公开分享的配置或仓库文件中。",
            ]} />
          </section>

          <section id="troubleshooting" className="docSection">
            <p className="docKicker">09 / TROUBLESHOOTING</p>
            <h2>常见问题</h2>
            <div className="docFaq">
              <details><summary>为什么状态层没有切换？<span>+</span></summary><p>先确认开关已开启、当前是在 Frame/独立 Component 新建变体，并检查节点名是否精确为 Hover、Pressed 或 Disabled。</p></details>
              <details><summary>为什么选项是灰色？<span>+</span></summary><p>仅 Style 模式、选中 Component Set，或选择位于 Component Set 内的组件时不适用。</p></details>
              <details><summary>翻译失败会不会破坏画板？<span>+</span></summary><p>画板整理会尽量使用原名称继续；请到设置页检查百度翻译配置和网络权限。</p></details>
              <details><summary>如何确认自己使用的是新版本？<span>+</span></summary><p>打开插件设置页的软件信息，版本应显示 0.1.54，发布日期为 2026-08-19。</p></details>
            </div>
          </section>

          <section className="tutorialClosing">
            <p className="docKicker">READY TO FORGE</p>
            <h2>回到 Figma，把规范交给工具。</h2>
            <Link className="primaryAction" href="/">返回产品首页</Link>
          </section>
        </article>
      </div>
    </main>
  );
}
