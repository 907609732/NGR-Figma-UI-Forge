import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const ui = await readFile(new URL("../src/ui.html", import.meta.url), "utf8");
const shared = await readFile(new URL("../src/shared.ts", import.meta.url), "utf8");
const code = await readFile(new URL("../src/code.ts", import.meta.url), "utf8");

test("plugin opens with the compact tall default size", () => {
  assert.match(code, /figma\.showUI\(__html__, \{ width: 420, height: 820, themeColors: true \}\)/);
});

test("naming UI preferences have backwards-compatible defaults", () => {
  assert.match(shared, /namingTranslateExpanded: boolean/);
  assert.match(shared, /namingWorkspaceMode: "terms" \| "preset"/);
  assert.match(shared, /namingTranslateExpanded: false/);
  assert.match(shared, /namingWorkspaceMode: "terms"/);
  assert.match(code, /partial\.namingTranslateExpanded \?\? false/);
  assert.match(code, /partial\.namingWorkspaceMode === "preset" \? "preset" : "terms"/);
});

test("naming panes are mutually exclusive and persisted", () => {
  assert.match(ui, /id="translateNamingPanel"/);
  assert.match(ui, /data-naming-workspace-mode="terms"/);
  assert.match(ui, /data-naming-workspace-mode="preset"/);
  assert.match(ui, /namingTermsPane"\)\.hidden = mode !== "terms"/);
  assert.match(ui, /namingPresetPane"\)\.hidden = mode !== "preset"/);
  assert.match(ui, /config\.namingTranslateExpanded = event\.currentTarget\.open/);
  assert.match(ui, /config\.namingWorkspaceMode = btn\.dataset\.namingWorkspaceMode/);
});

test("property application toggle lives in the preset editor summary", () => {
  assert.match(ui, /preset-edit-summary.*id="applyPropertiesOnRename".*命名时应用/);
  assert.equal((ui.match(/id="applyPropertiesOnRename"/g) || []).length, 1);
  assert.match(ui, /summary-check"\)\.onclick = function\(event\) \{ event\.stopPropagation\(\); \}/);
});

test("selection summary uses a compact single-line presentation", () => {
  assert.match(ui, /selection-panel-compact \.selection-item \{ display: flex/);
  assert.match(ui, /class="selection-item" title="/);
  assert.match(ui, /子节点 ' \+ n\.childCount/);
});

test("term list stretches to fill the available vertical space", () => {
  assert.match(ui, /#lexicon\.active \{ display: flex; flex-direction: column; overflow: hidden; \}/);
  assert.match(ui, /#namingTermsPane \{ display: flex; flex: 1; min-height: 0; flex-direction: column; \}/);
  assert.match(ui, /\.term-list-scroll \{ flex: 1; min-height: 190px; overflow: auto;/);
  assert.doesNotMatch(ui, /\.term-list-scroll \{ height: auto; max-height: 360px; \}/);
});

test("translation and quick properties stay compact", () => {
  assert.match(ui, /translate-actions \{ display: grid; grid-template-columns: minmax\(140px, 1fr\)/);
  assert.doesNotMatch(ui, /编辑当前词条/);
  assert.doesNotMatch(ui, /data-quick-font/);
  assert.doesNotMatch(ui, /data-quick-color/);
  assert.doesNotMatch(ui, /id="termWord"/);
  assert.match(ui, /id="positionZeroBtn"/);
  assert.match(ui, /id="constraintsCenterBtn"/);
});

test("removed term management leaves safe fixed rename options", () => {
  assert.doesNotMatch(ui, /作用范围与词库管理/);
  assert.doesNotMatch(ui, /id="scope"/);
  assert.doesNotMatch(ui, /id="addTermBtn"/);
  assert.doesNotMatch(ui, /id="duplicateTermBtn"/);
  assert.doesNotMatch(ui, /id="deleteTermBtn"/);
  assert.match(ui, /scope: "selection", skipLocked: true, skipHidden: true/);
});

test("search enter adds terms and term cards expose a delete context menu", () => {
  assert.match(ui, /termSearchInput"\)\.onkeydown/);
  assert.match(ui, /if \(event\.key !== "Enter"\) return/);
  assert.match(ui, /function addTermFromSearch\(\)/);
  assert.match(ui, /entry\.kind === kind && entry\.word\.toLowerCase\(\) === word\.toLowerCase\(\)/);
  assert.match(ui, /btn\.oncontextmenu = function\(event\)/);
  assert.match(ui, /id="termContextMenu"/);
  assert.match(ui, /id="confirmDeleteTermModal"/);
  assert.match(ui, /function deleteContextTerm\(\)/);
});

test("variant button structure option is documented, persisted, and sent only for eligible selections", () => {
  assert.match(shared, /variantButtonStructureEnabled: boolean/);
  assert.match(shared, /variantButtonStructureEnabled: false/);
  assert.match(code, /partial\.variantButtonStructureEnabled \?\? false/);
  assert.match(ui, /id="variantButtonStructureEnabled"[^>]*>生成标准按钮结构/);
  assert.match(ui, /config\.variantButtonStructureEnabled = checked\("variantButtonStructureEnabled"\)/);
  assert.match(ui, /applyButtonStructure: variantStateLayersEligible\(\) && !!config\.variantButtonStructureEnabled/);
  assert.match(ui, /HotZone 自动设为透明、无描边、横纵 Stretch，并添加程序控制和按钮属性/);
});
