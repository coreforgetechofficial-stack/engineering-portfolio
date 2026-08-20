/* ==========================================================
   Engineering Portfolio — interactions v2
   - REUSABLE scroll reveals: animate in scrolling down,
     a different animation scrolling up, and re-run every time
   - Parallax layers (hero moves at its own speed)
   - 3D mouse tilt on project covers / skill icons / map
   - Scroll progress bar + nav + back-to-top + mobile menu
   ========================================================== */

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- 1. Scroll direction tracking ---------- */
let lastY = window.scrollY;
let direction = "down"; // "down" or "up"

/* ---------- 2. Reusable directional reveal ----------
   Two observers:
   - enter:  element 15% visible  -> animate it in (direction-aware)
   - exit:   element fully hidden -> send it back to its hidden spot
     so it can animate in again the next time you scroll to it
------------------------------------------------------------- */
const revealEls = document.querySelectorAll(".reveal");

function applyReveal(el, dir) {
  // put the element at its hidden position (from below when scrolling down,
  // from above when scrolling up)…
  el.classList.remove("visible", "hidden-up", "hidden-down");
  el.classList.add(dir === "up" ? "hidden-up" : "hidden-down");
  void el.offsetWidth; // force the browser to see that position…
  el.classList.add("visible"); // …then animate to the shown state
}

function hideReveal(el, dir) {
  el.classList.remove("visible");
  // next time it enters, it comes from the opposite side
  el.classList.add(dir === "down" ? "hidden-up" : "hidden-down");
}

if (!("IntersectionObserver" in window) || reducedMotion) {
  // fallback (old browsers / reduced motion): show everything
  revealEls.forEach((el) => el.classList.add("visible"));
} else {
  const enterObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) applyReveal(entry.target, direction);
      }
    },
    { threshold: 0.15 }
  );

  const exitObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting && entry.target.classList.contains("visible")) {
          hideReveal(entry.target, direction);
        }
      }
    },
    { threshold: 0 }
  );

  revealEls.forEach((el) => {
    enterObserver.observe(el);
    exitObserver.observe(el);
  });
}

/* ---------- 3. Parallax ---------- */
const parallaxEls = document.querySelectorAll("[data-parallax]");

function updateParallax() {
  const vh = window.innerHeight;
  for (const el of parallaxEls) {
    const r = el.getBoundingClientRect();
    const offset = (r.top + r.height / 2 - vh / 2) * parseFloat(el.dataset.parallax);
    el.style.transform = "translate3d(0, " + offset.toFixed(1) + "px, 0)";
  }
}

/* ---------- 4. Scroll-driven frame updates (rAF = smooth) ---------- */
const progressBar = document.getElementById("progressBar");
const nav = document.querySelector(".nav");
const toTop = document.getElementById("toTop");

let tickQueued = false;

function onScroll() {
  if (!tickQueued) {
    tickQueued = true;
    requestAnimationFrame(tick);
  }
}

function tick() {
  tickQueued = false;
  const y = window.scrollY;

  // which way is the user scrolling? (reveals read this when they fire)
  direction = y > lastY ? "down" : "up";
  lastY = y;

  // progress bar
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (progressBar) progressBar.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";

  // nav shadow + back-to-top
  if (nav) nav.classList.toggle("scrolled", y > 10);
  if (toTop) toTop.classList.toggle("show", y > 400);

  // parallax
  if (!reducedMotion) updateParallax();
}

window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", onScroll, { passive: true });
tick(); // set the initial state

/* ---------- 5. 3D mouse tilt (pointer devices only) ---------- */
if (!reducedMotion && window.matchMedia("(pointer: fine)").matches) {
  const tiltEls = document.querySelectorAll(".tilt");
  tiltEls.forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.setProperty("--rx", (y * -14).toFixed(2) + "deg");
      el.style.setProperty("--ry", (x * 16).toFixed(2) + "deg");
      // where the mouse is, in % — used by the cover glare
      el.style.setProperty("--gx", (x * 100 + 50).toFixed(1) + "%");
      el.style.setProperty("--gy", (y * 100 + 50).toFixed(1) + "%");
    });
    el.addEventListener("pointerleave", () => {
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
    });
  });
}

/* ---------- 6. Page switch transition (soft fade) ---------- */
if (!reducedMotion) {
  document.addEventListener("click", (e) => {
    const link = e.target.closest('a[href$=".html"]');
    // ignore new-tab clicks and links that already did something
    if (!link || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    document.body.classList.add("page-exit");
    setTimeout(() => {
      window.location.href = link.getAttribute("href");
    }, 220);
  });
}

/* ---------- 7. Mobile menu toggle ---------- */
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    navToggle.textContent = open ? "✕" : "☰";
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });

  // close the menu when a link is tapped
  navLinks.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      navLinks.classList.remove("open");
      navToggle.textContent = "☰";
    })
  );
}

/* ---------- 7. Active nav link (home page) ---------- */
const sections = document.querySelectorAll("section[id]");
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

if (sections.length && navAnchors.length && "IntersectionObserver" in window) {
  const spy = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          navAnchors.forEach((a) => {
            a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id);
          });
        }
      }
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );
  sections.forEach((s) => spy.observe(s));
}

/* ---------- 8. Copy email button (works even without a mail app) ---------- */
const copyBtn = document.getElementById("copyEmail");
const emailValue = "igulum.bjk@gmail.com";

if (copyBtn) {
  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(emailValue);
    } catch (err) {
      // older-browser fallback: secretly select a text field and copy
      const tmp = document.createElement("textarea");
      tmp.value = emailValue;
      tmp.style.position = "fixed";
      tmp.style.opacity = "0";
      document.body.appendChild(tmp);
      tmp.select();
      document.execCommand("copy");
      document.body.removeChild(tmp);
    }
    copyBtn.textContent = "✅ Copied!";
    setTimeout(() => { copyBtn.textContent = "📋 Copy email"; }, 2500);
  });
}

/* ---------- 9. Map placeholder -> real map ---------- */
const mapFrame = document.getElementById("schoolMap");
const mapPlaceholder = document.getElementById("mapPlaceholder");

if (mapFrame && mapPlaceholder) {
  mapFrame.addEventListener("load", () => {
    mapPlaceholder.classList.add("hidden");
  });
  // safety: never leave the placeholder covering the map
  setTimeout(() => mapPlaceholder.classList.add("hidden"), 6000);
}

/* ---------- 10. Show current year in the footer ---------- */
document.querySelectorAll("[data-year]").forEach((el) => {
  el.textContent = new Date().getFullYear();
});