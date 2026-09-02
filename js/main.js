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

  // Validate as the visitor leaves each field, so feedback is immediate.
  form.querySelectorAll("input, textarea").forEach((input) => {
    input.addEventListener("blur", () => showError(input, validateField(input)));
    input.addEventListener("input", () => {
      if (input.closest(".field").classList.contains("has-error")) {
        showError(input, validateField(input));
      }
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();                 // stop the browser's default submit
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
  document.getElementById("year").textContent = new Date().getFullYear();
});
