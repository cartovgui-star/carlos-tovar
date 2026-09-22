/* ============================================================
   site.js — reads the JSON files in /data and builds the pages.
   You normally never need to touch this. To change CONTENT,
   edit the files in docs/data/. This just renders them.
   ============================================================ */

// small helper: safely get text
const esc = (s) => (s == null ? "" : String(s));

// which page are we on? set via <body data-page="...">
const PAGE = document.body.dataset.page;

// read ?id=... from the URL (used by the detail pages)
const params = new URLSearchParams(location.search);
const CURRENT_ID = params.get("id");

async function loadJSON(path) {
  try {
    const res = await fetch(path, { cache: "no-store" });
    if (!res.ok) throw new Error(res.status);
    return await res.json();
  } catch (e) {
    console.error("Could not load", path, e);
    return null;
  }
}

/* ---------- render helpers ---------- */

function tagList(techs, light) {
  if (!techs || !techs.length) return "";
  const cls = light ? "tags tags-light" : "tags";
  return `<div class="${cls}">${techs.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>`;
}

/* ---------- EXPERIENCE list (index.html) ---------- */
async function renderExperienceList() {
  const mount = document.getElementById("cards");
  const data = await loadJSON("data/experience.json");
  if (!data || !data.length) { mount.innerHTML = `<p class="empty">No experience entries yet.</p>`; return; }
  mount.innerHTML = data.map((item) => `
    <a class="card" href="experience-detail.html?id=${encodeURIComponent(item.id)}">
      <div class="eyebrow">${esc(item.company)}</div>
      <h3>${esc(item.title)}</h3>
      <div class="role">${esc(item.date)}</div>
      <div class="summary">${esc(item.summary)}</div>
      ${tagList(item.technologies)}
      <span class="more">Read more details</span>
    </a>`).join("");
}

/* ---------- BUILT list (built.html) ---------- */
async function renderBuiltList() {
  const mount = document.getElementById("cards");
  const data = await loadJSON("data/built.json");
  if (!data || !data.length) { mount.innerHTML = `<p class="empty">No projects yet.</p>`; return; }
  mount.innerHTML = data.map((item) => {
    const thumb = (item.images && item.images.length)
      ? `<img class="thumb" src="${esc(item.images[0])}" alt="${esc(item.name)}">` : "";
    return `
    <a class="card" href="built-detail.html?id=${encodeURIComponent(item.id)}">
      ${thumb}
      <div class="eyebrow">Project</div>
      <h3>${esc(item.name)}</h3>
      <div class="role">${esc(item.date)}</div>
      <div class="summary">${esc(item.summary)}</div>
      ${tagList(item.technologies)}
      <span class="more">Read more details</span>
    </a>`;
  }).join("");
}

/* ---------- shared detail renderer ---------- */
function renderDetail(item, opts) {
  const mount = document.getElementById("detail");
  if (!item) { mount.innerHTML = `<p class="empty">Entry not found. <a href="${opts.backHref}">Go back</a>.</p>`; return; }

  const paras = (item.fullDescription || []).map((p) => `<p>${esc(p)}</p>`).join("");
  const resp = (item.responsibilities && item.responsibilities.length)
    ? `<h2>${opts.listHeading}</h2><ul>${item.responsibilities.map((r) => `<li>${esc(r)}</li>`).join("")}</ul>` : "";
  const gallery = (item.images && item.images.length)
    ? `<div class="gallery">${item.images.map((src) => `<img src="${esc(src)}" alt="${esc(item.name || item.company)}">`).join("")}</div>` : "";
  const link = (item.link)
    ? `<p><a class="btn" href="${esc(item.link)}" target="_blank" rel="noopener">View it →</a></p>` : "";

  document.title = `${esc(item.name || item.company)} — Portfolio`;

  mount.innerHTML = `
    <a class="back" href="${opts.backHref}">← Back to ${opts.backLabel}</a>
    <div class="eyebrow">${esc(opts.eyebrow)}</div>
    <h1>${esc(item.name || item.company)}</h1>
    <div class="meta">${esc(item.title ? item.title + " · " : "")}${esc(item.date)}</div>
    ${paras}
    ${resp}
    ${tagList(item.technologies, true)}
    ${gallery}
    ${link}
  `;
}

async function renderExperienceDetail() {
  const data = await loadJSON("data/experience.json");
  const item = data ? data.find((x) => x.id === CURRENT_ID) : null;
  renderDetail(item, { backHref: "index.html", backLabel: "Experience",
    listHeading: "What I do here", eyebrow: item ? item.company : "" });
}

async function renderBuiltDetail() {
  const data = await loadJSON("data/built.json");
  const item = data ? data.find((x) => x.id === CURRENT_ID) : null;
  renderDetail(item, { backHref: "built.html", backLabel: "Things I've Built",
    listHeading: "Highlights", eyebrow: "Project" });
}

/* ---------- CONTACT (contact.html) ---------- */
async function renderContact() {
  const mount = document.getElementById("contact");
  const c = await loadJSON("data/contact.json");
  if (!c) { mount.innerHTML = `<p class="empty">Contact info unavailable.</p>`; return; }
  const rows = [
    c.email    ? { label: "Email",    href: `mailto:${c.email}`, text: c.email } : null,
    c.linkedin ? { label: "LinkedIn", href: c.linkedin, text: c.linkedin.replace(/^https?:\/\//, "") } : null,
    c.github   ? { label: "GitHub",   href: c.github,   text: c.github.replace(/^https?:\/\//, "") } : null,
    c.resume   ? { label: "Résumé",   href: c.resume,   text: "Download / view" } : null,
  ].filter(Boolean);
  mount.innerHTML = `<ul class="contact-list">${rows.map((r) => `
    <li><a href="${esc(r.href)}" ${r.href.startsWith("http") ? 'target="_blank" rel="noopener"' : ""}>
      <span><span class="label">${esc(r.label)}</span><br>${esc(r.text)}</span>
      <span class="arrow">→</span>
    </a></li>`).join("")}</ul>`;
}

/* ---------- router ---------- */
document.addEventListener("DOMContentLoaded", () => {
  if (PAGE === "experience") renderExperienceList();
  else if (PAGE === "built") renderBuiltList();
  else if (PAGE === "experience-detail") renderExperienceDetail();
  else if (PAGE === "built-detail") renderBuiltDetail();
  else if (PAGE === "contact") renderContact();
});
