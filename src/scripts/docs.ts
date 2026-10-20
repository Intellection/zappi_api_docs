const root = document.documentElement;

function store(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Storage can be unavailable (private mode); the choice just won't persist
  }
}

async function copy(text: string, button: HTMLElement, label?: HTMLElement) {
  await navigator.clipboard.writeText(text);
  const previous = label?.textContent;
  button.dataset.copied = "";
  if (label) label.textContent = "Copied";
  setTimeout(() => {
    delete button.dataset.copied;
    if (label && previous) label.textContent = previous;
  }, 1500);
}

// Language choice: one dropdown changes every code sample on the page

function setLanguage(lang: string) {
  root.dataset.lang = lang;
  store("zappi-docs-lang", lang);
  document.querySelectorAll<HTMLSelectElement>("[data-lang-select]").forEach((select) => (select.value = lang));
}

document.querySelectorAll<HTMLSelectElement>("[data-lang-select]").forEach((select) => {
  select.value = root.dataset.lang ?? "curl";
  select.addEventListener("change", () => {
    // Keep the panel the reader is using in the same place while the others change height
    const top = select.getBoundingClientRect().top;
    setLanguage(select.value);
    window.scrollBy(0, select.getBoundingClientRect().top - top);
  });
});

// Copy buttons

document.querySelectorAll<HTMLButtonElement>("[data-copy-code]").forEach((button) => {
  button.addEventListener("click", () => {
    const panel = button.closest(".code-panel")!;
    const blocks = [...panel.querySelectorAll<HTMLElement>(".code-block")];
    const visible = blocks.find((block) => block.offsetParent !== null) ?? blocks[0];
    const lines = [...visible.querySelectorAll<HTMLElement>(".line")].map((line) => line.textContent);
    copy(lines.length ? lines.join("\n") : (visible.textContent ?? ""), button);
  });
});

document.querySelectorAll<HTMLButtonElement>("[data-copy-markdown]").forEach((button) => {
  button.addEventListener("click", () => {
    const template = button.parentElement!.querySelector<HTMLTemplateElement>("template[data-markdown]")!;
    copy(template.content.textContent ?? "", button, button.querySelector("[data-label]")!);
  });
});

// Theme

document.querySelector("[data-theme-toggle]")?.addEventListener("click", () => {
  const theme = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = theme;
  store("zappi-docs-theme", theme);
});

// Mobile navigation

const closeNav = () => delete root.dataset.navOpen;

document.querySelector("[data-nav-toggle]")?.addEventListener("click", () => {
  if ("navOpen" in root.dataset) closeNav();
  else root.dataset.navOpen = "";
});
document.querySelectorAll("#sidebar a").forEach((link) => link.addEventListener("click", closeNav));
document.querySelector(".main")?.addEventListener("click", closeNav);

// Highlight the section being read in the sidebar, and keep the URL pointing at it

const navLinks = new Map<string, HTMLAnchorElement>();
document.querySelectorAll<HTMLAnchorElement>("#sidebar [data-nav]").forEach((link) => {
  navLinks.set(link.dataset.nav!, link);
});

let current: string | undefined;

function activate(id: string) {
  if (id === current) return;
  current = id;
  navLinks.forEach((link) => link.removeAttribute("aria-current"));
  const link = navLinks.get(id);
  if (!link) return;
  link.setAttribute("aria-current", "true");
  const group = link.closest<HTMLDetailsElement>("details");
  if (group && !group.open) group.open = true;
  const scroller = document.querySelector(".sidebar-scroll")!;
  const linkBox = link.getBoundingClientRect();
  const box = scroller.getBoundingClientRect();
  if (linkBox.top < box.top || linkBox.bottom > box.bottom) link.scrollIntoView({ block: "nearest" });
  if (location.hash !== `#${id}`) history.replaceState(null, "", `#${id}`);
}

const sections = [...document.querySelectorAll<HTMLElement>("[data-spy]")];

function onScroll() {
  // The active section is the last one whose top has passed a line under the top bar
  const line = 120;
  let active = sections[0];
  for (const section of sections) {
    if (section.getBoundingClientRect().top <= line) active = section;
    else break;
  }
  // The last sections are too short to reach the line, so the bottom of the page activates the last one
  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) active = sections.at(-1)!;
  if (active) activate(active.dataset.spy!);
}

let ticking = false;
window.addEventListener(
  "scroll",
  () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      onScroll();
      ticking = false;
    });
  },
  { passive: true },
);
onScroll();
// The browser scrolls to the URL's anchor after this script runs
window.addEventListener("load", onScroll);
window.addEventListener("hashchange", () => requestAnimationFrame(onScroll));

// Search (Pagefind index, built after `astro build`)

type PagefindSubResult = { title: string; url: string; excerpt: string };
type PagefindResult = { data: () => Promise<{ sub_results: PagefindSubResult[] }> };
type Pagefind = { search: (query: string) => Promise<{ results: PagefindResult[] }> };

const dialog = document.querySelector<HTMLDialogElement>("[data-search]")!;
const input = dialog.querySelector<HTMLInputElement>("[data-search-input]")!;
const list = dialog.querySelector<HTMLUListElement>("[data-search-results]")!;
let pagefind: Promise<Pagefind | undefined> | undefined;
let selected = 0;

function loadPagefind() {
  const path = "/pagefind/pagefind.js";
  pagefind ??= import(/* @vite-ignore */ path).catch(() => undefined);
  return pagefind;
}

function openSearch() {
  loadPagefind();
  dialog.showModal();
  input.select();
}

function select(index: number) {
  const links = [...list.querySelectorAll<HTMLAnchorElement>("a")];
  if (!links.length) return;
  selected = (index + links.length) % links.length;
  links.forEach((link, i) => link.setAttribute("aria-selected", String(i === selected)));
  links[selected].scrollIntoView({ block: "nearest" });
}

let latest = 0;
input.addEventListener("input", async () => {
  const query = input.value.trim();
  const run = ++latest;
  if (!query) {
    list.replaceChildren();
    return;
  }
  const engine = await loadPagefind();
  if (run !== latest) return;
  if (!engine) {
    list.innerHTML = '<li class="search-empty">Search is available in the built site.</li>';
    return;
  }
  const { results } = await engine.search(query);
  const pages = await Promise.all(results.slice(0, 5).map((result) => result.data()));
  if (run !== latest) return;
  // The site is one page, so rank its sections: title matches first, then by number of hits
  const terms = query.toLowerCase().split(/\s+/);
  const score = (hit: PagefindSubResult) =>
    terms.filter((term) => hit.title.toLowerCase().includes(term)).length * 10 +
    (hit.excerpt.match(/<mark>/g)?.length ?? 0);
  const hits = pages
    .flatMap((page) => page.sub_results)
    .sort((a, b) => score(b) - score(a))
    .slice(0, 12);
  list.innerHTML = hits.length
    ? hits
        .map(
          (hit) =>
            `<li class="search-result"><a href="${hit.url.replace(/^[^#]*/, "")}"><span class="search-result-title">${hit.title}</span><span class="search-result-excerpt">${hit.excerpt}</span></a></li>`,
        )
        .join("")
    : `<li class="search-empty">No results for “${query.replace(/[<>&"]/g, "")}”</li>`;
  select(0);
});

input.addEventListener("keydown", (event) => {
  if (event.key === "ArrowDown") select(selected + 1);
  else if (event.key === "ArrowUp") select(selected - 1);
  else if (event.key === "Enter") list.querySelectorAll<HTMLAnchorElement>("a")[selected]?.click();
  // A search input clears itself on Escape instead of letting the dialog close
  else if (event.key === "Escape") dialog.close();
  else return;
  event.preventDefault();
});

list.addEventListener("click", (event) => {
  if ((event.target as HTMLElement).closest("a")) dialog.close();
});

dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});

document.querySelector("[data-search-open]")?.addEventListener("click", openSearch);

document.addEventListener("keydown", (event) => {
  const typing = (event.target as HTMLElement).closest("input, textarea, select");
  if ((event.key === "k" && (event.metaKey || event.ctrlKey)) || (event.key === "/" && !typing)) {
    event.preventDefault();
    openSearch();
  }
});
