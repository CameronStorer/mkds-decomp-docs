"use strict";
const menu = document.querySelector("#menu-toggle");
menu.addEventListener("click", () => {
  const open = document.querySelector("#sidebar").classList.toggle("open");
  menu.setAttribute("aria-expanded", String(open));
});

if (document.querySelector("#function-search")) {
  const escape = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const search = document.querySelector("#function-search");
  const status = document.querySelector("#status-filter");
  const area = document.querySelector("#area-filter");
  const rows = document.querySelector("#function-rows");
  const count = document.querySelector("#function-count");
  const prev = document.querySelector("#prev-page");
  const next = document.querySelector("#next-page");
  const pageLabel = document.querySelector("#page-label");
  const dialog = document.querySelector("#function-detail");
  const pageSize = 60;
  let records = [], filtered = [], page = 0;

  function detail(index, updateHash = true) {
    const r = records[index];
    if (!r) return;
    document.querySelector("#detail-body").innerHTML = `<div class="eyebrow">${escape(r.area || "Unmapped area")}</div><h2>${escape(r.name)}</h2><span class="badge ${escape(r.status)}">${escape(r.status)}</span><p>${escape(r.meaning || "No meaning recorded yet. Further analysis is needed.")}</p><dl><dt>RAM address</dt><dd><code>${escape(r.ea)}</code></dd><dt>Segment</dt><dd><code>${escape(r.segment)}</code></dd><dt>Size</dt><dd>${escape(r.size)} bytes</dd><dt>Caller count</dt><dd>${escape(r.callers)}</dd><dt>Listed callees</dt><dd><code>${escape(r.callees || "None recorded")}</code></dd><dt>Rust references</dt><dd><code>${escape(r.our_code || "No implementation reference recorded")}</code></dd></dl><p class="caption">Segment identity matters: overlays may reuse addresses. Listed callees may be truncated by the source catalog. A meaning is not proof of complete runtime verification.</p><p><a href="docs--function_map.html#${encodeURIComponent(r.name.toLowerCase())}">Read the documented function map →</a></p>`;
    if (!dialog.open) dialog.showModal();
    if (updateHash) history.replaceState(null, "", `#${encodeURIComponent(r.segment)}:${encodeURIComponent(r.name)}`);
  }

  function render() {
    const max = Math.max(1, Math.ceil(filtered.length / pageSize));
    page = Math.min(page, max - 1);
    const subset = filtered.slice(page * pageSize, (page + 1) * pageSize);
    rows.innerHTML = subset.length ? subset.map(r => `<tr><td><button class="function-open" data-index="${r.index}">${escape(r.name)}</button><span class="address">${escape(r.ea)} · ${escape(r.segment)}</span></td><td><span class="badge ${escape(r.status)}">${escape(r.status)}</span></td><td>${escape(r.area || "—")}</td><td>${escape(r.meaning || "No meaning recorded")}</td></tr>`).join("") : '<tr><td colspan="4">No functions match these filters.</td></tr>';
    count.textContent = `${filtered.length.toLocaleString()} of ${records.length.toLocaleString()} functions`;
    pageLabel.textContent = `Page ${page + 1} of ${max}`;
    prev.disabled = page === 0; next.disabled = page + 1 >= max;
  }

  function filter() {
    const terms = search.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
    filtered = records.filter(r => (!status.value || r.status === status.value) && (!area.value || r.area === area.value) && terms.every(t => r.search.includes(t)));
    page = 0; render();
  }
  search.addEventListener("input", filter); status.addEventListener("change", filter); area.addEventListener("change", filter);
  prev.addEventListener("click", () => { page--; render(); });
  next.addEventListener("click", () => { page++; render(); });
  rows.addEventListener("click", e => { const button = e.target.closest("button[data-index]"); if (button) detail(Number(button.dataset.index)); });
  document.querySelector("#close-detail").addEventListener("click", () => dialog.close());
  dialog.addEventListener("close", () => history.replaceState(null, "", location.pathname + location.search));
  dialog.addEventListener("click", e => { if (e.target === dialog) { const b = dialog.getBoundingClientRect(); if (e.clientX < b.left || e.clientX > b.right || e.clientY < b.top || e.clientY > b.bottom) dialog.close(); }});
  fetch("assets/functions.json").then(r => { if (!r.ok) throw Error("Inventory could not be loaded"); return r.json(); }).then(data => {
    records = data.map((r, index) => ({...r, index, search: Object.values(r).join(" ").toLowerCase()}));
    [...new Set(records.map(r => r.area).filter(Boolean))].sort().forEach(a => { const o = document.createElement("option"); o.value = a; o.textContent = a; area.appendChild(o); });
    filter();
    if (location.hash) {
      const key = decodeURIComponent(location.hash.slice(1));
      const index = records.findIndex(r => `${r.segment}:${r.name}` === key);
      if (index >= 0) detail(index, false);
    }
  }).catch(e => { count.textContent = `${e.message}. The Markdown function map remains available in the sidebar.`; });
}
