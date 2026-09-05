/* =====================================================================
   main.js — Sai Chaudhry portfolio

   AI USAGE NOTE (15-113): Claude Code drafted these four features after I
   chose them from a list. I asked for plain JavaScript (no libraries) and
   for each feature to be its own small function so I could explain them
   one at a time. Changes I made: the theme respects the visitor's OS
   setting on first visit, the filter shows an "empty" message, and the
   contact form uses mailto: because GitHub Pages has no server.

   Features:
     1. Theme toggle (dark / light) saved in localStorage
     2. Mobile navigation menu (hamburger)
     3. Scroll-reveal animations via IntersectionObserver
     4. Project filtering by tag
     5. Contact form validation
     6. Hero photo with monogram fallback
     7. Custom cursor: green dot + spotlight that lights the page grid
     8. Resume overlay: previews the PDF on top of the page, with download
     9. Command palette (Cmd+K / Ctrl+K): fuzzy-searchable list of every
        action on the page - jump to a section, toggle theme, resume, copy
        email, open links, filter projects
   ===================================================================== */

"use strict";


/* ---------- 1. Theme toggle ----------------------------------------- */
function setupThemeToggle() {
  const root = document.documentElement;          // the <html> element
  const button = document.getElementById("theme-toggle");
  const STORAGE_KEY = "theme";

  // Decide the starting theme:
  //   1. a choice the visitor saved earlier, else
  //   2. their operating-system preference, else
  //   3. dark (the site's default look)
  let saved = null;
  try { saved = localStorage.getItem(STORAGE_KEY); } catch (_) { /* storage blocked; ignore */ }

  const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
  const initial = saved || (prefersLight ? "light" : "dark");
  root.setAttribute("data-theme", initial);

  button.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem(STORAGE_KEY, next); } catch (_) { /* ignore */ }
  });
}


/* ---------- 2. Mobile nav ------------------------------------------- */
function setupMobileNav() {
  const toggle = document.getElementById("nav-toggle");
  const links = document.getElementById("nav-links");

  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });

  // Close the menu after a link is tapped so it doesn't cover the section
  links.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      links.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}


/* ---------- 3. Scroll reveal ---------------------------------------- */
function setupScrollReveal() {
  const targets = document.querySelectorAll(".reveal");

  // Old browsers without IntersectionObserver: just show everything.
  if (!("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  // The observer calls this whenever a watched element crosses the
  // threshold (10% visible). We add the class once and stop watching it.
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  targets.forEach((el) => observer.observe(el));
}


/* ---------- 4. Project filter --------------------------------------- */
function setupProjectFilter() {
  const buttons = document.querySelectorAll(".filter-button");
  const cards = document.querySelectorAll(".project-card");
  const emptyState = document.getElementById("empty-state");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;   // reads data-filter="..."

      // Highlight the active button
      buttons.forEach((b) => b.classList.toggle("is-active", b === button));

      // Show cards whose data-tags list contains the filter (or all)
      let shown = 0;
      cards.forEach((card) => {
        const tags = card.dataset.tags.split(" ");
        const match = filter === "all" || tags.includes(filter);
        card.classList.toggle("is-hidden", !match);
        if (match) {
          shown += 1;
          card.classList.add("is-visible"); // cards revealed by filter shouldn't stay faded
        }
      });

      emptyState.hidden = shown > 0;
    });
  });
}


/* ---------- 5. Contact form validation ------------------------------ */
function setupContactForm() {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  const TO_ADDRESS = "saichaud@andrew.cmu.edu";

  // Simple, readable email check: something@something.something
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Returns an error message for one field, or "" if it's fine.
  function validateField(input) {
    const value = input.value.trim();
    if (value === "") return "This field is required.";
    if (input.name === "email" && !EMAIL_RE.test(value)) return "Enter a valid email address.";
    if (input.name === "message" && value.length < 10) return "Please write at least 10 characters.";
    return "";
  }

  // Writes the error under the field and colors the border.
  function showError(input, message) {
    const field = input.closest(".field");
    const errorEl = field.querySelector(".field-error");
    errorEl.textContent = message;
    field.classList.toggle("has-error", message !== "");
  }

  // Errors only appear after the first "Send message" click. After that, a
  // field re-validates as the visitor types so the message clears once fixed.
  let submitted = false;
  form.querySelectorAll("input, textarea").forEach((input) => {
    input.addEventListener("input", () => {
      if (submitted) showError(input, validateField(input));
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();                 // stop the browser's default submit
    submitted = true;
    status.textContent = "";
    status.classList.remove("is-error");

    const inputs = Array.from(form.querySelectorAll("input, textarea"));
    let firstInvalid = null;

    inputs.forEach((input) => {
      const error = validateField(input);
      showError(input, error);
      if (error && !firstInvalid) firstInvalid = input;
    });

    if (firstInvalid) {
      firstInvalid.focus();
      status.textContent = "// please fix the highlighted fields";
      status.classList.add("is-error");
      return;
    }

    // All good. GitHub Pages is static, so hand the message to the visitor's
    // mail app with everything pre-filled.
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    const subject = encodeURIComponent(`Portfolio message from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);

    window.location.href = `mailto:${TO_ADDRESS}?subject=${subject}&body=${body}`;
    status.textContent = "// opening your mail app...";
    form.reset();
  });
}


/* ---------- 6. Hero photo with fallback ----------------------------- */
function setupHeroPhoto() {
  const img = document.getElementById("hero-photo");
  const fallback = document.getElementById("hero-photo-fallback");
  const candidates = ["assets/photo.jpg", "assets/photo.png"];
  let i = 0;

  img.addEventListener("load", () => {
    img.hidden = false;        // real photo exists: show it, hide the monogram
    fallback.hidden = true;
  });
  img.addEventListener("error", () => {
    i += 1;
    if (i < candidates.length) {
      img.src = candidates[i];  // try the next file name
    }
    // out of candidates: leave the monogram placeholder showing
  });
  img.src = candidates[0];
}


/* ---------- 7. Custom cursor glow ----------------------------------- */
function setupCursorGlow() {
  // Only for devices with a real mouse; touch screens keep the default.
  if (!window.matchMedia("(pointer: fine)").matches) return;

  const root = document.documentElement;
  const body = document.body;

  // On every mouse move, store the pointer position in two CSS variables.
  // The CSS for .cursor-glow and .cursor-dot reads them; no other JS needed.
  window.addEventListener("mousemove", (event) => {
    root.style.setProperty("--mx", event.clientX + "px");
    root.style.setProperty("--my", event.clientY + "px");
    body.classList.add("has-cursor");
  });

  // Hide the custom cursor when the mouse leaves the window
  document.addEventListener("mouseleave", () => body.classList.remove("has-cursor"));
}


/* ---------- 8. Resume overlay --------------------------------------- */
function setupResumeModal() {
  const modal = document.getElementById("resume-modal");
  const frame = document.getElementById("resume-frame");
  const openers = document.querySelectorAll("[data-open-resume]");
  const closers = modal.querySelectorAll("[data-close-resume]");
  let lastFocused = null;

  function open(event) {
    if (event) event.preventDefault();          // the nav link also works as a plain link if JS is off
    lastFocused = document.activeElement;
    if (!frame.src) frame.src = frame.dataset.src;   // load the PDF the first time only
    modal.hidden = false;
    document.body.classList.add("modal-open");
    modal.querySelector("[data-close-resume][aria-label]").focus();
  }

  function close() {
    modal.hidden = true;
    document.body.classList.remove("modal-open");
    if (lastFocused) lastFocused.focus();
  }

  openers.forEach((el) => el.addEventListener("click", open));
  closers.forEach((el) => el.addEventListener("click", close));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) close();
  });
}


/* ---------- 9. Command palette -------------------------------------- */
function setupCommandPalette() {
  const palette = document.getElementById("command-palette");
  const input = document.getElementById("palette-input");
  const list = document.getElementById("palette-list");
  const empty = document.getElementById("palette-empty");
  const statusEl = document.getElementById("palette-status");
  const trigger = document.getElementById("palette-toggle");
  const hint = document.getElementById("palette-hint");
  const EMAIL = "saichaud@andrew.cmu.edu";

  // Show the right shortcut for the visitor's OS in the nav pill
  const isMac = /Mac|iPhone|iPad/.test(navigator.platform || "") ||
                /Mac/.test((navigator.userAgentData && navigator.userAgentData.platform) || "");
  hint.textContent = isMac ? "⌘K" : "Ctrl K";
  trigger.title = isMac ? "Command palette (⌘K)" : "Command palette (Ctrl+K)";

  // Tiny inline icons, keyed by name, so each command can carry one
  const ICONS = {
    section: '<path d="M4 6h16M4 12h16M4 18h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    theme:   '<circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor"/>',
    file:    '<path d="M7 3h7l5 5v13H7z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M14 3v5h5" fill="none" stroke="currentColor" stroke-width="2"/>',
    copy:    '<rect x="9" y="9" width="11" height="11" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9" fill="none" stroke="currentColor" stroke-width="2"/>',
    link:    '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    filter:  '<path d="M3 5h18l-7 8v6l-4 2v-8z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>'
  };

  // Helpers used by the commands below
  const go = (id) => document.getElementById(id).scrollIntoView({ behavior: "smooth", block: "start" });
  const openUrl = (url) => window.open(url, "_blank", "noopener");
  const filterProjects = (tag) => {
    const button = document.querySelector(`.filter-button[data-filter="${tag}"]`);
    if (button) button.click();            // reuse the filter feature's own handler
    go("projects");
  };

  // The command list. `keywords` are extra words the search matches on but
  // doesn't display. `detail` is the grey text on the right of a row.
  const COMMANDS = [
    { group: "navigate", icon: "section", label: "Go to About",     keywords: "bio skills", detail: "#about",    run: () => go("about") },
    { group: "navigate", icon: "section", label: "Go to Projects",  keywords: "work experience", detail: "#projects", run: () => go("projects") },
    { group: "navigate", icon: "section", label: "Go to Contact",   keywords: "email form message", detail: "#contact", run: () => go("contact") },
    { group: "navigate", icon: "section", label: "Back to top",     keywords: "home hero", detail: "#top",      run: () => go("top") },

    { group: "actions", icon: "theme", label: "Toggle dark / light theme", keywords: "mode appearance color",
      detail: () => (document.documentElement.getAttribute("data-theme") === "dark" ? "→ light" : "→ dark"),
      run: () => document.getElementById("theme-toggle").click() },
    { group: "actions", icon: "file", label: "View resume", keywords: "cv pdf preview", detail: "overlay",
      run: () => document.querySelector("[data-open-resume]").click() },
    { group: "actions", icon: "file", label: "Download resume", keywords: "cv pdf save", detail: "pdf",
      run: () => { const a = document.createElement("a"); a.href = "assets/Sai_Chaudhry_Resume.pdf"; a.download = "Sai_Chaudhry_Resume.pdf"; a.click(); } },
    { group: "actions", icon: "copy", label: "Copy email address", keywords: "mail contact clipboard", detail: EMAIL,
      run: copyEmail, keepOpen: true },

    { group: "links", icon: "link", label: "GitHub",   keywords: "code repos source", detail: "github.com/saichaudhry",  run: () => openUrl("https://github.com/saichaudhry") },
    { group: "links", icon: "link", label: "LinkedIn", keywords: "profile",           detail: "/in/saichaudhry",        run: () => openUrl("https://www.linkedin.com/in/saichaudhry") },
    { group: "links", icon: "link", label: "Novig",    keywords: "work exchange prediction market", detail: "novig.us", run: () => openUrl("https://novig.us") },
    { group: "links", icon: "link", label: "Manhattan Athletic Group", keywords: "mag market making", detail: "manhattanathleticgroup.com", run: () => openUrl("https://manhattanathleticgroup.com/") },
    { group: "links", icon: "link", label: "TRADERS @ CMU", keywords: "club prediction markets", detail: "tradersatcmu.com", run: () => openUrl("https://tradersatcmu.com/") },
    { group: "links", icon: "link", label: "Source for this site", keywords: "repo github portfolio code", detail: "portfolio-project", run: () => openUrl("https://github.com/saichaudhry/portfolio-project") },

    { group: "filter projects", icon: "filter", label: "Show all projects", keywords: "filter reset", detail: "all",      run: () => filterProjects("all") },
    { group: "filter projects", icon: "filter", label: "Filter: Web",       keywords: "filter tag",   detail: "web",      run: () => filterProjects("web") },
    { group: "filter projects", icon: "filter", label: "Filter: Trading",   keywords: "filter tag markets", detail: "trading", run: () => filterProjects("trading") },
    { group: "filter projects", icon: "filter", label: "Filter: Work",      keywords: "filter tag jobs", detail: "work",  run: () => filterProjects("work") },
    { group: "filter projects", icon: "filter", label: "Filter: Research",  keywords: "filter tag",   detail: "research", run: () => filterProjects("research") },
    { group: "filter projects", icon: "filter", label: "Filter: 15-113",    keywords: "filter tag course cmu class", detail: "15-113", run: () => filterProjects("15-113") }
  ];

  function copyEmail() {
    const done = () => setStatus("copied " + EMAIL);
    const fail = () => setStatus("copy failed - " + EMAIL);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(EMAIL).then(done, fail);
    } else {
      // Old-browser fallback: select the text in a temporary input and copy it
      const tmp = document.createElement("input");
      tmp.value = EMAIL; document.body.appendChild(tmp); tmp.select();
      try { document.execCommand("copy") ? done() : fail(); } catch (_) { fail(); }
      tmp.remove();
    }
  }

  let statusTimer = null;
  function setStatus(text) {
    statusEl.textContent = text;
    clearTimeout(statusTimer);
    statusTimer = setTimeout(() => { statusEl.textContent = ""; }, 2200);
  }

  /* --- Fuzzy matching ---
     A command matches when every character of the query appears in order
     (a subsequence) in "label + keywords". Score favours matches that start
     at the beginning of the label and that keep matched letters close
     together, so "gpr" ranks "Go to Projects" above a scattered match.
     Returns null for no match, otherwise { score, positions } where
     positions are indexes into the label used for highlighting. */
  function fuzzyMatch(query, command) {
    const q = query.toLowerCase();
    if (!q) return { score: 0, positions: [] };

    const label = command.label.toLowerCase();
    const haystack = label + " " + (command.keywords || "") + " " + (typeof command.detail === "string" ? command.detail : "");

    // Best case: the query is a plain substring of the label
    const idx = label.indexOf(q);
    if (idx !== -1) {
      const positions = Array.from({ length: q.length }, (_, k) => idx + k);
      return { score: 1000 - idx * 10 - label.length, positions };
    }

    // Otherwise walk the haystack looking for the letters in order
    let hi = 0, score = 500, positions = [], lastPos = -2;
    for (const ch of q) {
      if (ch === " ") continue;                       // spaces don't need to match
      const found = haystack.indexOf(ch, hi);
      if (found === -1) return null;
      if (found === lastPos + 1) score += 15;         // consecutive letters are a good sign
      if (found === 0 || haystack[found - 1] === " ") score += 10;   // start of a word
      score -= (found - hi);                          // penalise big gaps
      if (found < label.length) positions.push(found);
      lastPos = found; hi = found + 1;
    }
    return { score, positions };
  }

  // Wrap the matched characters of the label in <mark>
  function highlight(label, positions) {
    const set = new Set(positions);
    let html = "", inMark = false;
    for (let i = 0; i < label.length; i++) {
      const ch = label[i].replace("&", "&amp;").replace("<", "&lt;");
      if (set.has(i) && !inMark) { html += "<mark>"; inMark = true; }
      if (!set.has(i) && inMark) { html += "</mark>"; inMark = false; }
      html += ch;
    }
    return html + (inMark ? "</mark>" : "");
  }

  /* --- Rendering --- */
  let results = [];        // commands currently shown, in order
  let selected = 0;        // index into results

  function render() {
    const query = input.value.trim();
    results = COMMANDS
      .map((c) => ({ command: c, match: fuzzyMatch(query, c) }))
      .filter((r) => r.match !== null)
      .sort((a, b) => b.match.score - a.match.score);

    if (!query) results = COMMANDS.map((c) => ({ command: c, match: { positions: [] } }));  // keep file order when idle

    selected = Math.min(selected, Math.max(results.length - 1, 0));
    list.innerHTML = "";
    empty.hidden = results.length > 0;

    let lastGroup = null;
    results.forEach((r, i) => {
      const c = r.command;
      // Group headers only when the list is unfiltered; search results are ranked instead
      if (!query && c.group !== lastGroup) {
        const h = document.createElement("li");
        h.className = "palette-group";
        h.setAttribute("role", "presentation");
        h.textContent = c.group;
        list.appendChild(h);
        lastGroup = c.group;
      }

      const li = document.createElement("li");
      li.className = "palette-item";
      li.id = "palette-item-" + i;
      li.setAttribute("role", "option");
      li.setAttribute("aria-selected", String(i === selected));
      li.dataset.index = i;
      const detail = typeof c.detail === "function" ? c.detail() : (c.detail || "");
      li.innerHTML =
        `<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">${ICONS[c.icon]}</svg>` +
        `<span class="palette-label">${highlight(c.label, r.match.positions)}</span>` +
        `<span class="palette-detail">${detail}</span>` +
        `<span class="palette-enter" aria-hidden="true">↵</span>`;
      li.addEventListener("mousemove", () => { if (selected !== i) { selected = i; updateSelection(); } });
      li.addEventListener("click", () => runSelected());
      list.appendChild(li);
    });
    updateSelection();
  }

  function updateSelection() {
    const items = list.querySelectorAll(".palette-item");
    items.forEach((el, i) => el.setAttribute("aria-selected", String(i === selected)));
    const active = items[selected];
    input.setAttribute("aria-activedescendant", active ? active.id : "");
    if (active) active.scrollIntoView({ block: "nearest" });
  }

  function runSelected() {
    const r = results[selected];
    if (!r) return;
    if (!r.command.keepOpen) close();
    r.command.run();
    if (r.command.keepOpen) render();     // refresh details (e.g. theme arrow) and keep focus
  }

  /* --- Open / close --- */
  let lastFocused = null;

  function open() {
    if (!palette.hidden) return;
    // If the resume overlay is up, close it first so the palette isn't fighting it
    const resume = document.getElementById("resume-modal");
    if (resume && !resume.hidden) document.querySelector("[data-close-resume][aria-label]").click();

    lastFocused = document.activeElement;
    input.value = "";
    selected = 0;
    render();
    palette.hidden = false;
    document.body.classList.add("modal-open");
    input.focus();
  }

  function close() {
    if (palette.hidden) return;
    palette.hidden = true;
    document.body.classList.remove("modal-open");
    statusEl.textContent = "";
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  trigger.addEventListener("click", open);
  palette.querySelectorAll("[data-close-palette]").forEach((el) => el.addEventListener("click", close));
  input.addEventListener("input", () => { selected = 0; render(); });

  // Keys inside the palette
  input.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown") { event.preventDefault(); if (results.length) { selected = (selected + 1) % results.length; updateSelection(); } }
    else if (event.key === "ArrowUp") { event.preventDefault(); if (results.length) { selected = (selected - 1 + results.length) % results.length; updateSelection(); } }
    else if (event.key === "Enter") { event.preventDefault(); runSelected(); }
    else if (event.key === "Home") { event.preventDefault(); selected = 0; updateSelection(); }
    else if (event.key === "End") { event.preventDefault(); selected = Math.max(results.length - 1, 0); updateSelection(); }
  });

  // Global shortcut: Cmd+K on Mac, Ctrl+K elsewhere (both accepted everywhere).
  // Esc closes. Ignored while typing in the contact form so we don't steal keys.
  document.addEventListener("keydown", (event) => {
    const isShortcut = (event.metaKey || event.ctrlKey) && !event.altKey && !event.shiftKey && event.key.toLowerCase() === "k";
    if (isShortcut) {
      event.preventDefault();
      palette.hidden ? open() : close();
      return;
    }
    if (event.key === "Escape" && !palette.hidden) {
      event.preventDefault();
      close();
    }
  });
}


/* ---------- Boot ---------------------------------------------------- */
// Run everything once the HTML is parsed (the script tag is at the end of
// <body>, so the elements exist, but DOMContentLoaded is the safe habit).
document.addEventListener("DOMContentLoaded", () => {
  setupThemeToggle();
  setupMobileNav();
  setupScrollReveal();
  setupProjectFilter();
  setupContactForm();
  setupHeroPhoto();
  setupCursorGlow();
  setupResumeModal();
  setupCommandPalette();
  document.getElementById("year").textContent = new Date().getFullYear();
});
