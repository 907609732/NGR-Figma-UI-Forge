import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

const CM_CONTAINER_KEY = "CMPropertyDataContainer";
let nodeSequence = 0;

function detach(node) {
  if (!node.parent || !Array.isArray(node.parent.children)) return;
  const index = node.parent.children.indexOf(node);
  if (index >= 0) node.parent.children.splice(index, 1);
}

function makeNode(type, name, width = 120, height = 48) {
  const pluginData = new Map();
  const node = {
    id: `node-${++nodeSequence}`,
    type,
    name,
    parent: null,
    removed: false,
    x: 0,
    y: 0,
    width,
    height,
    visible: true,
    opacity: 1,
    locked: false,
    fills: [],
    strokes: [],
    clipsContent: false,
    constraints: { horizontal: "MIN", vertical: "MIN" },
    layoutMode: "NONE",
    getPluginData(key) { return pluginData.get(key) || ""; },
    setPluginData(key, value) { pluginData.set(key, value); },
    resize(nextWidth, nextHeight) { this.width = nextWidth; this.height = nextHeight; },
    remove() { detach(this); this.removed = true; this.parent = null; },
  };
  if (["PAGE", "FRAME", "COMPONENT", "COMPONENT_SET"].includes(type)) {
    node.children = [];
    node.appendChild = function(child) {
      detach(child);
      this.children.push(child);
      child.parent = this;
    };
    node.insertChild = function(index, child) {
      detach(child);
      this.children.splice(Math.max(0, Math.min(index, this.children.length)), 0, child);
      child.parent = this;
    };
    node.findAll = function(predicate) {
      const result = [];
      const visit = (parent) => {
        for (const child of parent.children || []) {
          if (predicate(child)) result.push(child);
          if (child.children) visit(child);
        }
      };
      visit(this);
      return result;
    };
  }
  if (type === "COMPONENT") {
    node.clone = function() { return cloneNode(this); };
    node.variantProperties = null;
  }
  if (type === "COMPONENT_SET") node.componentPropertyDefinitions = {};
  return node;
}

function cloneNode(source) {
  const copy = makeNode(source.type, source.name, source.width, source.height);
  for (const key of ["x", "y", "visible", "opacity", "locked", "clipsContent", "layoutMode"]) copy[key] = source[key];
  copy.fills = structuredClone(source.fills);
  copy.strokes = structuredClone(source.strokes);
  copy.constraints = structuredClone(source.constraints);
  const raw = source.getPluginData(CM_CONTAINER_KEY);
  if (raw) copy.setPluginData(CM_CONTAINER_KEY, raw);
  for (const child of source.children || []) copy.appendChild(cloneNode(child));
  return copy;
}

async function loadVariantPlugin(component) {
  const page = makeNode("PAGE", "Page");
  page.loadAsync = async () => {};
  page.appendChild(component);
  page.selection = [component];
  const messages = [];
  const figma = {
    mixed: Symbol("mixed"),
    showUI() {},
    on() {},
    notify() {},
    clientStorage: { async getAsync() {}, async setAsync() {} },
    currentPage: page,
    viewport: { scrollAndZoomIntoView() {}, center: { x: 0, y: 0 } },
    ui: { onmessage: undefined, postMessage(message) { messages.push(message); }, resize() {} },
    createFrame() { return makeNode("FRAME", "Frame"); },
    combineAsVariants(components, parent, index) {
      const set = makeNode("COMPONENT_SET", "Component Set");
      parent.insertChild(index, set);
      for (const child of components) set.appendChild(child);
      return set;
    },
  };
  const bundle = await readFile(new URL("../dist/code.js", import.meta.url), "utf8");
  vm.runInNewContext(bundle, { figma, __html__: "", console, setTimeout, clearTimeout });
  await new Promise((resolve) => setImmediate(resolve));
  return { figma, messages };
}

test("creates Content and topmost HotZone with program and button properties for every variant", async () => {
  const component = makeNode("COMPONENT", "GotoButton", 878, 148);
  const visual = makeNode("RECTANGLE", "Visual", 80, 20);
  visual.x = 12;
  visual.y = 16;
  component.appendChild(visual);
  const { figma, messages } = await loadVariantPlugin(component);

  await figma.ui.onmessage({ type: "CREATE_VARIANTS", baseMode: "three", styleMode: "none", applyButtonStructure: true });

  const set = figma.currentPage.selection[0];
  assert.equal(set.type, "COMPONENT_SET");
  assert.equal(set.children.length, 3);
  for (const variant of set.children) {
    assert.deepEqual(variant.children.map((child) => child.name), ["Content", "HotZone"]);
    const [content, hotZone] = variant.children;
    assert.equal(content.children.length, 1);
    assert.equal(content.children[0].name, "Visual");
    assert.equal(hotZone.width, 878);
    assert.equal(hotZone.height, 148);
    assert.equal(hotZone.constraints.horizontal, "STRETCH");
    assert.equal(hotZone.constraints.vertical, "STRETCH");
    assert.equal(hotZone.fills.length, 0);
    assert.equal(hotZone.strokes.length, 0);
    const data = JSON.parse(hotZone.getPluginData(CM_CONTAINER_KEY));
    assert.deepEqual(data.PropertyDatas.CMVarPropertyData, {});
    assert.deepEqual(data.PropertyDatas.CMButtonPropertyData, {});
  }
  const result = messages.findLast((message) => message.type === "APPLY_RESULT");
  assert.match(result.message, /按钮结构 3 个/);
  assert.match(result.message, /新增 Content 1 个、新增 HotZone 1 个，补齐属性 2 项/);
});

test("reuses root Content and HotZone, preserves custom data, and moves HotZone children into Content", async () => {
  const component = makeNode("COMPONENT", "SelectButton");
  const content = makeNode("FRAME", " content ");
  const label = makeNode("TEXT", "Label", 30, 12);
  content.appendChild(label);
  const hotZone = makeNode("FRAME", "HOTZONE");
  const misplaced = makeNode("RECTANGLE", "Misplaced", 10, 10);
  hotZone.appendChild(misplaced);
  hotZone.setPluginData(CM_CONTAINER_KEY, JSON.stringify({ PropertyDatas: { CustomData: { keep: true } }, TopLevelData: "keep" }));
  component.appendChild(hotZone);
  component.appendChild(content);
  const { figma } = await loadVariantPlugin(component);

  await figma.ui.onmessage({ type: "CREATE_VARIANTS", baseMode: "three", styleMode: "none", applyButtonStructure: true });

  const first = figma.currentPage.selection[0].children[0];
  assert.equal(first.children[0], content);
  assert.equal(first.children.at(-1), hotZone);
  assert.deepEqual(content.children.map((child) => child.name), ["Label", "Misplaced"]);
  assert.equal(hotZone.children.length, 0);
  const data = JSON.parse(hotZone.getPluginData(CM_CONTAINER_KEY));
  assert.deepEqual(data.PropertyDatas.CustomData, { keep: true });
  assert.equal(data.TopLevelData, "keep");
  assert.deepEqual(data.PropertyDatas.CMVarPropertyData, {});
  assert.deepEqual(data.PropertyDatas.CMButtonPropertyData, {});
});

test("leaves the original node structure untouched when the option is off", async () => {
  const component = makeNode("COMPONENT", "Button");
  component.appendChild(makeNode("RECTANGLE", "Visual"));
  const { figma } = await loadVariantPlugin(component);
  await figma.ui.onmessage({ type: "CREATE_VARIANTS", baseMode: "three", styleMode: "none", applyButtonStructure: false });
  for (const variant of figma.currentPage.selection[0].children) {
    assert.deepEqual(variant.children.map((child) => child.name), ["Visual"]);
  }
});

test("restores the source structure when HotZone property data is malformed", async () => {
  const component = makeNode("COMPONENT", "RollbackButton");
  const visual = makeNode("RECTANGLE", "Visual");
  const hotZone = makeNode("FRAME", "HotZone");
  hotZone.setPluginData(CM_CONTAINER_KEY, "not-json");
  component.appendChild(visual);
  component.appendChild(hotZone);
  const { figma, messages } = await loadVariantPlugin(component);

  await figma.ui.onmessage({ type: "CREATE_VARIANTS", baseMode: "three", styleMode: "none", applyButtonStructure: true });

  const error = messages.findLast((message) => message.type === "ERROR");
  assert.match(error.message, /制作变体失败/);
  assert.equal(component.name, "RollbackButton");
  assert.deepEqual(component.children.map((child) => child.name), ["Visual", "HotZone"]);
  assert.equal(visual.parent, component);
  assert.equal(hotZone.getPluginData(CM_CONTAINER_KEY), "not-json");
});
