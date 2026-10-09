// Exercise the shipped script's event handlers against the complete site inventory.
const fs = require("node:fs"), path = require("node:path"), vm = require("node:vm"), assert = require("node:assert/strict");
const root = path.resolve(__dirname, "..");
const data = JSON.parse(fs.readFileSync(path.join(root, "_site/assets/functions.json"), "utf8"));
const nodes = new Map();
function element() {
  return {
    value: "", innerHTML: "", textContent: "", dataset: {}, attributes: {}, handlers: {}, hidden: false, open: false,
    addEventListener(key, handler) { this.handlers[key] = handler; },
    insertAdjacentHTML(_, html) { this.innerHTML += html; },
    appendChild() {}, classList: {toggle() { return true; }},
    setAttribute(key, value) { this.attributes[key] = value; },
    showModal() { this.open = true; }, close() { this.open = false; }
  };
}
function node(id) { if (!nodes.has(id)) nodes.set(id, element()); return nodes.get(id); }
const keys = ["name", "ea", "status", "area", "meaning"];
const buttons = keys.map(key => {
  const button = element(), th = element(), indicator = element();
  button.dataset = {sort: key, label: key};
  button.closest = () => th; button.querySelector = () => indicator;
  return button;
});
let intersection;
class IntersectionObserver {
  constructor(callback, options) { intersection = callback; assert.equal(options.rootMargin, "400px 0px"); }
  observe(target) { assert.equal(target, node("#scroll-sentinel")); }
}
const context = {
  document: {querySelector: node, querySelectorAll: () => buttons, createElement: element},
  window: {IntersectionObserver}, IntersectionObserver,
  fetch: async () => ({ok: true, json: async () => data}),
  location: {hash: "", pathname: "/functions.html", search: ""}, history: {replaceState() {}},
  console, encodeURIComponent, decodeURIComponent, Intl
};
vm.runInNewContext(fs.readFileSync(path.join(root, "assets/site.js"), "utf8"), context);
function shown() {
  return [...node("#function-rows").innerHTML.matchAll(/data-index="(\d+)"/g)].map(m => Number(m[1]));
}
function setFilter(id, value, event = "change") { node(id).value = value; node(id).handlers[event](); }
setImmediate(() => {
  assert.equal(shown().length, 200);
  intersection([{isIntersecting: false}]); assert.equal(shown().length, 200);
  intersection([{isIntersecting: true}]); assert.equal(shown().length, 400);
  node("#load-more").handlers.click(); assert.equal(shown().length, 600);
  const collator = new Intl.Collator("en", {numeric: true, sensitivity: "base"});
  function assertOrdered(key, ascending) {
    const values = shown().map(index => data[index][key] || "");
    const firstBlank = values.indexOf("");
    if (firstBlank >= 0) assert(values.slice(firstBlank).every(value => value === ""));
    const populated = values.filter(Boolean);
    for (let i = 1; i < populated.length; i++) {
      const comparison = key === "ea"
        ? parseInt(populated[i - 1], 16) - parseInt(populated[i], 16)
        : collator.compare(populated[i - 1], populated[i]);
      assert(ascending ? comparison <= 0 : comparison >= 0, `${key} order at row ${i}`);
    }
    // The first row must be a global extreme, not just a sort of the loaded batch.
    const allValues = data.map(row => row[key]).filter(Boolean);
    if (key === "ea") {
      const numbers = allValues.map(value => parseInt(value, 16));
      assert.equal(parseInt(populated[0], 16), ascending ? Math.min(...numbers) : Math.max(...numbers));
    } else {
      assert(allValues.every(value => ascending
        ? collator.compare(populated[0], value) <= 0
        : collator.compare(populated[0], value) >= 0));
    }
  }
  buttons.forEach((button, i) => {
    button.handlers.click();
    assert.equal(button.closest().attributes["aria-sort"], "ascending");
    assert.equal(shown().length, 200); assertOrdered(keys[i], true);
    intersection([{isIntersecting: true}]);
    assert.equal(shown().length, 400); assertOrdered(keys[i], true);
    button.handlers.click();
    assert.equal(button.closest().attributes["aria-sort"], "descending");
    assert.equal(shown().length, 200); assertOrdered(keys[i], false);
  });
  setFilter("#function-search", "sub_2087B78", "input");
  assert(shown().length > 0 && shown().length < 200);
  assert(shown().every(index => Object.values(data[index]).join(" ").toLowerCase().includes("sub_2087b78")));
  assert.equal(node("#load-more").hidden, true);
  setFilter("#function-search", "nonexistent-routine-xxxxxxxx", "input");
  assert.equal(shown().length, 0); assert.equal(node("#load-more").hidden, true);
  assert(node("#function-rows").innerHTML.includes('colspan="5"'));
  setFilter("#function-search", "", "input");
  setFilter("#status-filter", "unknown");
  const unknownCount = data.filter(row => row.status === "unknown").length;
  assert.equal(shown().length, Math.min(200, unknownCount));
  assert(shown().every(index => data[index].status === "unknown"));
  assert.equal(node("#load-more").hidden, unknownCount <= 200);
  const area = data.find(r => r.status === "unknown" && r.area)?.area;
  if (area) {
    setFilter("#area-filter", area);
    assert(shown().every(index => data[index].area === area && data[index].status === "unknown"));
    setFilter("#area-filter", "");
  }
  setFilter("#status-filter", "");
  for (let i = 0; i < Math.ceil(data.length / 200) + 2; i++) intersection([{isIntersecting: true}]);
  assert.equal(shown().length, data.length); assert.equal(new Set(shown()).size, data.length);
  assert.equal(node("#load-more").hidden, true);
  const index = shown()[0];
  node("#function-rows").handlers.click({target: {closest: () => ({dataset: {index: String(index)}})}});
  assert.equal(node("#function-detail").open, true);
  assert(node("#detail-body").innerHTML.includes(data[index].name));
  assert(node("#detail-body").innerHTML.includes(data[index].segment));
  console.log(`Explorer checks passed: five sorts in both directions, 200-row batches, filters, exhaustion, stable details (${data.length.toLocaleString()} records).`);
});
