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
  const bundle = await readFile(process.env.NGR_VARIANT_TEST_BUNDLE || new URL("../dist/code.js", import.meta.url), "utf8");
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

test("controls exact Normal, Pressed, and Checked descendants independently", async () => {
  const component = makeNode("COMPONENT", "SelectButton");
  const nested = makeNode("FRAME", "Nested");
  const normal = makeNode("RECTANGLE", " Normal ");
  const hover = makeNode("RECTANGLE", "Hover");
  const pressed = makeNode("RECTANGLE", "Pressed");
  const checkedA = makeNode("RECTANGLE", "Checked");
  const checkedB = makeNode("FRAME", " checked ");
  const disabled = makeNode("RECTANGLE", "Disabled");
  const nonExact = makeNode("RECTANGLE", "Icon_Checked");
  const nonExactNormal = makeNode("RECTANGLE", "Icon_Normal");
  checkedA.visible = false;
  checkedB.visible = false;
  nested.appendChild(checkedA);
  nested.appendChild(hover);
  component.appendChild(nested);
  component.appendChild(normal);
  component.appendChild(pressed);
  component.appendChild(checkedB);
  component.appendChild(disabled);
  component.appendChild(nonExact);
  component.appendChild(nonExactNormal);
  const { figma, messages } = await loadVariantPlugin(component);

  await figma.ui.onmessage({ type: "CREATE_VARIANTS", baseMode: "six", styleMode: "none", applyStateLayerVisibility: true });

  const variants = figma.currentPage.selection[0].children;
  assert.equal(variants.length, 6);
  for (const variant of variants) {
    const nodes = variant.findAll(() => true);
    const exactChecked = nodes.filter((node) => node.name.trim().toLowerCase() === "checked");
    const state = variant.name.match(/State=([^,]+)/)?.[1];
    const isChecked = variant.name.includes("Checked=Checked");
    assert.equal(exactChecked.length, 2);
    assert.ok(exactChecked.every((node) => node.visible === isChecked), variant.name);
    assert.equal(nodes.find((node) => node.name === "Icon_Checked").visible, true, variant.name);
    assert.equal(nodes.find((node) => node.name === "Icon_Normal").visible, true, variant.name);
    assert.equal(nodes.find((node) => node.name.trim() === "Normal").visible, true, variant.name);
    assert.equal(nodes.find((node) => node.name === "Hover").visible, state === "Hover" || state === "Pressed", variant.name);
    assert.equal(nodes.find((node) => node.name === "Pressed").visible, state === "Pressed", variant.name);
    assert.equal(nodes.find((node) => node.name === "Disabled").visible, false, variant.name);
  }
  const pressedChecked = variants.find((variant) => variant.name === "State=Pressed, Checked=Checked");
  assert.equal(pressedChecked.findAll((node) => node.name === "Pressed")[0].visible, true);
  assert.equal(pressedChecked.findAll((node) => node.name === "Checked")[0].visible, true);
  const pressedUnchecked = variants.find((variant) => variant.name === "State=Pressed, Checked=Unchecked");
  assert.equal(pressedUnchecked.findAll((node) => node.name === "Pressed")[0].visible, true);
  assert.equal(pressedUnchecked.findAll((node) => node.name === "Checked")[0].visible, false);
  const result = messages.findLast((message) => message.type === "APPLY_RESULT");
  assert.match(result.message, /状态层匹配 36 个/);
});

test("combines Disabled and Checked without opening Pressed", async () => {
  const component = makeNode("COMPONENT", "DisabledSelectButton");
  component.appendChild(makeNode("RECTANGLE", "Pressed"));
  component.appendChild(makeNode("RECTANGLE", "Disabled"));
  component.appendChild(makeNode("RECTANGLE", "Checked"));
  component.appendChild(makeNode("RECTANGLE", "Normal"));
  const { figma } = await loadVariantPlugin(component);

  await figma.ui.onmessage({ type: "CREATE_VARIANTS", baseMode: "eight", styleMode: "none", applyStateLayerVisibility: true });

  const variant = figma.currentPage.selection[0].children.find((item) => item.name === "State=Disabled, Checked=Checked");
  assert.equal(variant.findAll((node) => node.name === "Pressed")[0].visible, false);
  assert.equal(variant.findAll((node) => node.name === "Disabled")[0].visible, true);
  assert.equal(variant.findAll((node) => node.name === "Checked")[0].visible, true);
  assert.equal(variant.findAll((node) => node.name === "Normal")[0].visible, true);
});

test("preserves Pressed and Checked visibility when state layer automation is off", async () => {
  const component = makeNode("COMPONENT", "ManualSelectButton");
  const pressed = makeNode("RECTANGLE", "Pressed");
  const checked = makeNode("RECTANGLE", "Checked");
  const normal = makeNode("RECTANGLE", "Normal");
  pressed.visible = false;
  checked.visible = false;
  normal.visible = false;
  component.appendChild(pressed);
  component.appendChild(checked);
  component.appendChild(normal);
  const { figma } = await loadVariantPlugin(component);

  await figma.ui.onmessage({ type: "CREATE_VARIANTS", baseMode: "six", styleMode: "none", applyStateLayerVisibility: false });

  for (const variant of figma.currentPage.selection[0].children) {
    assert.equal(variant.findAll((node) => node.name === "Pressed")[0].visible, false, variant.name);
    assert.equal(variant.findAll((node) => node.name === "Checked")[0].visible, false, variant.name);
    assert.equal(variant.findAll((node) => node.name === "Normal")[0].visible, false, variant.name);
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

function namedDescendant(node, name) {
  const matches = node.findAll((child) => child.name === name);
  assert.equal(matches.length, 1, `Expected one descendant named ${name}`);
  return matches[0];
}

function makeStyledButton() {
  const component = makeNode("COMPONENT", "StyledButton");
  for (const style of ["Normal", "Complete"]) {
    const branch = makeNode("FRAME", style);
    for (const state of ["Normal", "Hover", "Pressed", "Disabled", "Checked"]) {
      const visual = makeNode("RECTANGLE", state);
      visual.visible = state === "Normal";
      branch.appendChild(visual);
    }
    branch.visible = style === "Normal";
    component.appendChild(branch);
  }
  return component;
}

test("Style controls the exact Complete overlay automatically while flat Normal keeps State semantics", async () => {
  const component = makeNode("COMPONENT", "OverlayStyleButton");
  const normal = makeNode("RECTANGLE", "Normal");
  const complete = makeNode("FRAME", " Complete ");
  const hover = makeNode("RECTANGLE", "Hover");
  const pressed = makeNode("RECTANGLE", "Pressed");
  complete.visible = false;
  component.appendChild(normal);
  component.appendChild(hover);
  component.appendChild(pressed);
  component.appendChild(complete);
  component.appendChild(makeNode("RECTANGLE", "Icon_Complete"));
  component.appendChild(makeNode("RECTANGLE", "Complete extra"));
  const { figma } = await loadVariantPlugin(component);
  await figma.ui.onmessage({ type: "CREATE_VARIANTS", baseMode: "four", styleMode: "complete", applyStateLayerVisibility: true });

  const variants = figma.currentPage.selection[0].children;
  assert.equal(variants.length, 8);
  for (const variant of variants) {
    const state = variant.name.match(/State=([^,]+)/)[1];
    const isComplete = variant.name.includes("Style=Complete");
    assert.equal(namedDescendant(variant, " Complete ").visible, isComplete, variant.name);
    assert.equal(namedDescendant(variant, "Normal").visible, true, variant.name);
    assert.equal(namedDescendant(variant, "Hover").visible, state === "Hover" || state === "Pressed", variant.name);
    assert.equal(namedDescendant(variant, "Pressed").visible, state === "Pressed", variant.name);
    assert.equal(namedDescendant(variant, "Icon_Complete").visible, true, variant.name);
    assert.equal(namedDescendant(variant, "Complete extra").visible, true, variant.name);
  }
});

test("Style runs independently when optional State automation is off", async () => {
  const component = makeNode("COMPONENT", "ManualStateStyledButton");
  const normal = makeNode("RECTANGLE", "Normal");
  const hover = makeNode("RECTANGLE", "Hover");
  const complete = makeNode("RECTANGLE", "complete");
  normal.visible = false;
  hover.visible = true;
  component.appendChild(normal);
  component.appendChild(hover);
  component.appendChild(complete);
  const { figma } = await loadVariantPlugin(component);
  await figma.ui.onmessage({ type: "CREATE_VARIANTS", baseMode: "three", styleMode: "complete", applyStateLayerVisibility: false });
  for (const variant of figma.currentPage.selection[0].children) {
    assert.equal(namedDescendant(variant, "complete").visible, variant.name.includes("Style=Complete"), variant.name);
    assert.equal(namedDescendant(variant, "Normal").visible, false, variant.name);
    assert.equal(namedDescendant(variant, "Hover").visible, true, variant.name);
  }
});

test("complete design containers are mutually exclusive while their internal State and Checked layers stay independent", async () => {
  const component = makeStyledButton();
  const { figma } = await loadVariantPlugin(component);
  await figma.ui.onmessage({ type: "CREATE_VARIANTS", baseMode: "eight", styleMode: "complete", applyStateLayerVisibility: true, applyButtonStructure: true });
  const variants = figma.currentPage.selection[0].children;
  assert.equal(variants.length, 16);
  for (const variant of variants) {
    assert.deepEqual(variant.children.map((node) => node.name), ["Content", "HotZone"]);
    const content = variant.children[0];
    const state = variant.name.match(/State=([^,]+)/)[1];
    const checked = variant.name.includes("Checked=Checked");
    const style = variant.name.match(/Style=([^,]+)/)[1];
    for (const branch of content.children) {
      assert.equal(branch.visible, branch.name === style, `${variant.name} / ${branch.name}`);
      assert.equal(namedDescendant(branch, "Normal").visible, true, variant.name);
      assert.equal(namedDescendant(branch, "Hover").visible, state === "Hover" || state === "Pressed", variant.name);
      assert.equal(namedDescendant(branch, "Pressed").visible, state === "Pressed", variant.name);
      assert.equal(namedDescendant(branch, "Disabled").visible, state === "Disabled", variant.name);
      assert.equal(namedDescendant(branch, "Checked").visible, checked, variant.name);
    }
  }
});

test("only Style switches Normal and Complete containers without hiding their internal Normal content", async () => {
  const component = makeStyledButton();
  const { figma } = await loadVariantPlugin(component);
  await figma.ui.onmessage({ type: "CREATE_VARIANTS", baseMode: "style-only", styleMode: "complete", applyStateLayerVisibility: true, applyButtonStructure: true });
  const variants = figma.currentPage.selection[0].children;
  assert.equal(variants.length, 2);
  for (const variant of variants) {
    assert.deepEqual(variant.children.map((node) => node.name), ["Normal", "Complete"]);
    for (const branch of variant.children) {
      assert.equal(branch.visible, variant.name === `Style=${branch.name}`);
      assert.equal(namedDescendant(branch, "Normal").visible, true, variant.name);
      assert.equal(namedDescendant(branch, "Hover").visible, false, variant.name);
      assert.equal(namedDescendant(branch, "Pressed").visible, false, variant.name);
    }
  }
});

test("rank Style values control only exact 1st, 2nd and 3rd layers", async () => {
  const component = makeNode("COMPONENT", "RankStyles");
  for (const name of ["1st", "2nd", "3rd", "Icon_1st", "Normal"]) component.appendChild(makeNode("RECTANGLE", name));
  const { figma } = await loadVariantPlugin(component);
  await figma.ui.onmessage({ type: "CREATE_VARIANTS", baseMode: "style-only", styleMode: "rank" });
  const variants = figma.currentPage.selection[0].children;
  assert.equal(variants.length, 3);
  for (const variant of variants) {
    for (const style of ["1st", "2nd", "3rd"]) assert.equal(namedDescendant(variant, style).visible, variant.name === `Style=${style}`, variant.name);
    assert.equal(namedDescendant(variant, "Icon_1st").visible, true);
    assert.equal(namedDescendant(variant, "Normal").visible, true);
  }
});

test("appending Style to existing variants switches complete designs and preserves manually authored State visibility", async () => {
  const componentSet = makeNode("COMPONENT_SET", "ExistingStates");
  for (const state of ["Normal", "Pressed"]) {
    const component = makeStyledButton();
    component.name = `State=${state}`;
    // Existing component sets must keep user-authored State visibility intact.
    for (const branch of component.children) namedDescendant(branch, "Pressed").visible = state === "Pressed";
    componentSet.appendChild(component);
  }
  const { figma } = await loadVariantPlugin(componentSet);
  await figma.ui.onmessage({ type: "CREATE_VARIANTS", baseMode: "four", styleMode: "complete", applyStateLayerVisibility: true });
  assert.equal(figma.currentPage.selection[0], componentSet);
  assert.equal(componentSet.children.length, 4);
  for (const variant of componentSet.children) {
    const state = variant.name.match(/State=([^,]+)/)[1];
    const style = variant.name.match(/Style=([^,]+)/)[1];
    for (const branch of variant.children) {
      assert.equal(branch.visible, branch.name === style, variant.name);
      assert.equal(namedDescendant(branch, "Pressed").visible, state === "Pressed");
      assert.equal(namedDescendant(branch, "Hover").visible, false);
      assert.equal(namedDescendant(branch, "Normal").visible, true);
    }
  }
});

test("no Style mode leaves style-named layers unchanged", async () => {
  const component = makeNode("COMPONENT", "NoStyle");
  const complete = makeNode("RECTANGLE", "Complete");
  complete.visible = false;
  component.appendChild(complete);
  component.appendChild(makeNode("RECTANGLE", "1st"));
  const { figma } = await loadVariantPlugin(component);
  await figma.ui.onmessage({ type: "CREATE_VARIANTS", baseMode: "three", styleMode: "none", applyStateLayerVisibility: true });
  for (const variant of figma.currentPage.selection[0].children) {
    assert.equal(namedDescendant(variant, "Complete").visible, false);
    assert.equal(namedDescendant(variant, "1st").visible, true);
  }
});

test("failed creation restores Style and State visibility on the source", async () => {
  const component = makeStyledButton();
  component.children[0].visible = false;
  component.children[1].visible = true;
  for (const branch of component.children) namedDescendant(branch, "Normal").visible = false;
  const { figma, messages } = await loadVariantPlugin(component);
  figma.combineAsVariants = () => { throw new Error("Combine failed"); };
  await figma.ui.onmessage({ type: "CREATE_VARIANTS", baseMode: "four", styleMode: "complete", applyStateLayerVisibility: true });
  assert.match(messages.findLast((message) => message.type === "ERROR").message, /Combine failed/);
  assert.equal(component.name, "StyledButton");
  assert.equal(component.children[0].visible, false);
  assert.equal(component.children[1].visible, true);
  for (const branch of component.children) assert.equal(namedDescendant(branch, "Normal").visible, false);
  assert.deepEqual(figma.currentPage.children, [component]);
});

test("failed Style append restores original names and visibility without leaving clones", async () => {
  const componentSet = makeNode("COMPONENT_SET", "AppendRollback");
  const component = makeStyledButton();
  component.name = "State=Pressed";
  component.children[0].visible = false;
  component.children[1].visible = true;
  componentSet.appendChild(component);
  const { figma, messages } = await loadVariantPlugin(componentSet);
  componentSet.insertChild = () => { throw new Error("Layout failed"); };
  await figma.ui.onmessage({ type: "CREATE_VARIANTS", baseMode: "four", styleMode: "complete" });
  assert.match(messages.findLast((message) => message.type === "ERROR").message, /Layout failed/);
  assert.deepEqual(componentSet.children, [component]);
  assert.equal(component.name, "State=Pressed");
  assert.equal(component.children[0].visible, false);
  assert.equal(component.children[1].visible, true);
});
