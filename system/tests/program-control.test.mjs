import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

const CM_CONTAINER_KEY = "CMPropertyDataContainer";

function createNode({ id, type = "FRAME", data = "", children = [] }) {
  const pluginData = new Map();
  if (data) pluginData.set(CM_CONTAINER_KEY, data);
  return {
    id,
    type,
    name: id,
    parent: { type: "PAGE" },
    children,
    characters: type === "TEXT" ? id : undefined,
    getPluginData(key) { return pluginData.get(key) || ""; },
    setPluginData(key, value) { pluginData.set(key, value); },
  };
}

async function loadPlugin(selection) {
  const messages = [];
  const notifications = [];
  const figma = {
    showUI() {},
    on() {},
    notify(message) { notifications.push(message); },
    clientStorage: {
      async getAsync() { return undefined; },
      async setAsync() {},
    },
    currentPage: {
      selection,
      async loadAsync() {},
    },
    ui: {
      onmessage: undefined,
      postMessage(message) { messages.push(message); },
      resize() {},
    },
  };
  const bundle = await readFile(new URL("../dist/code.js", import.meta.url), "utf8");
  vm.runInNewContext(bundle, { figma, __html__: "", console, setTimeout, clearTimeout });
  await new Promise((resolve) => setImmediate(resolve));
  return { figma, messages, notifications };
}

test("adds only CMVarPropertyData to explicitly selected nodes", async () => {
  const child = createNode({ id: "unselected-child" });
  const frame = createNode({ id: "frame", children: [child] });
  const text = createNode({
    id: "text",
    type: "TEXT",
    data: JSON.stringify({ PropertyDatas: { CMTextPropertyData: { Localize: true }, CustomData: { keep: true } }, TopLevelData: "keep" }),
  });
  const existingRaw = JSON.stringify({ PropertyDatas: { CMVarPropertyData: {}, CMImagePropertyData: { keep: true } } });
  const existing = createNode({ id: "existing", data: existingRaw });
  const malformed = createNode({ id: "malformed", data: "not-json" });
  const selection = [frame, text, existing, malformed];
  const { figma, messages } = await loadPlugin(selection);

  await figma.ui.onmessage({ type: "ADD_PROGRAM_CONTROL_TO_SELECTION" });

  const frameData = JSON.parse(frame.getPluginData(CM_CONTAINER_KEY));
  const textData = JSON.parse(text.getPluginData(CM_CONTAINER_KEY));
  assert.deepEqual(frameData.PropertyDatas.CMVarPropertyData, {});
  assert.deepEqual(textData.PropertyDatas.CMVarPropertyData, {});
  assert.deepEqual(textData.PropertyDatas.CMTextPropertyData, { Localize: true });
  assert.deepEqual(textData.PropertyDatas.CustomData, { keep: true });
  assert.equal(textData.TopLevelData, "keep");
  assert.equal(existing.getPluginData(CM_CONTAINER_KEY), existingRaw);
  assert.equal(child.getPluginData(CM_CONTAINER_KEY), "");
  assert.equal(malformed.getPluginData(CM_CONTAINER_KEY), "not-json");
  assert.deepEqual(Array.from(figma.currentPage.selection, (node) => node.id), selection.map((node) => node.id));

  const result = messages.findLast((message) => message.type === "APPLY_RESULT");
  assert.match(result.message, /已选 4 个节点，新增 2 个，已存在 1 个，失败 1 个/);
});

test("reports an error when the authoritative Figma selection is empty", async () => {
  const { figma, messages } = await loadPlugin([]);
  await figma.ui.onmessage({ type: "ADD_PROGRAM_CONTROL_TO_SELECTION" });
  const error = messages.findLast((message) => message.type === "ERROR");
  assert.match(error.message, /选择一个或多个节点/);
});
