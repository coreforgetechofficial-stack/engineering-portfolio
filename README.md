# ⚡ Your Name — Engineering Portfolio

A fast, dark-themed portfolio for a 14-year-old builder (coding, motors, gaming + more).
A **multi-page site** — every section lives on its own page, switched from the top nav.

## 📁 What's in the folder

| File | What it is |
|------|-----------|
| `index.html` | Home — hero + badges + explore page-switcher grid |
| `about.html` | About me + skills |
| `projects.html` | Projects (grey placeholder covers for now) |
| `competitions.html` | **FRC & FTC** — FIRST robotics explainer + my team placeholders |
| `beyond.html` | **Beyond Tech** — gaming + hobby placeholders (life outside code) |
| `journey.html` | Timeline of milestones |
| `contact.html` | Contact / email |
| `school.html` | **My School** — Harmony Science Academy + live Google Map |
| `css/style.css` | All colors and styling (edit `.project-cover` to swap grey covers for images) |
| `js/main.js` | Directional scroll animations, tilt, parallax, menu, map loading |
| `render.yaml` | Optional: auto-config for Render |
| `README.md` | This file |

## ✏️ How to edit your content

Search each page for the `EDIT ME` comments — they mark exactly where to change: your
name, your about text, project descriptions, your FRC/FTC team numbers, your gaming
favorites, and your contact email. There are also `EDIT ME` hints in
`competitions.html`, `beyond.html`, and `contact.html`.
The project images are grey "COMING SOON" covers on purpose —
when you have real photos, replace the emoji inside a `.project-cover` div with an
`<img>` tag (an example is in `css/style.css` under the `.project-cover` comment).

## 🚀 How to put it on Render (free)

1. Put this folder in a GitHub repository and push it.
   (VS Code → Source Control → Publish to GitHub.)
2. Go to https://render.com and sign up with GitHub.
3. Click **New + → Static Site**.
4. Connect your repo.
5. Important settings:
   - **Build Command:** *(leave empty)*
   - **Publish Directory:** `.`  (a dot — the project root)
6. Click **Create Static Site**.
7. Render gives you a free URL like `https://your-site.onrender.com`. Done!

> Every time you push to GitHub, Render rebuilds and updates your live site automatically.

Without GitHub, use the Render **Manual Deploy** feature: you can drag-and-drop
[this folder zipped as a `.zip`](https://render.com/docs/static-sites) if you prefer.

## ⚡ Performance ideas (already partly done)

- **No build step** — plain HTML/CSS/JS is the fastest thing to serve.
- **Scroll animations are reusable** — every section animates in when you scroll
  down, uses a *different* animation when you scroll back up, and re-runs each time.
  No jank: they run on the browser's native IntersectionObserver + `requestAnimationFrame`.
- **Parallax + tilts + floating shapes** — hero layers move at their own speed,
  project covers tilt in 3D under your mouse, and glowing shapes float in the background.
- **Map + images lazy-load** — the map only starts loading when you scroll near it.
- **Small favicons** — an SVG data-URI, no extra download.
- **No frameworks, no fonts, no CDNs** — zero third-party requests.

Easy wins you can add later (ask me if you want these):

1. **Real project images, compressed** — resize photos to ~800px wide and save as
   `.webp` or `.jpg` (tools like Squoosh.app make this free and easy).
2. **Cache headers on Render** — already set in `render.yaml`
   (`Cache-Control: max-age=60`).
3. **A `robots.txt` and custom `<title>` per page** for better Google search results.
4. **`<meta>` social preview image** so links to your site show a nice thumbnail.
5. **Keep animations buttery** — everything animates with `transform`/`opacity` only
   (no layout thrash), and `prefers-reduced-motion` is respected for accessibility.
6. **Off-screen sections skip rendering** — `content-visibility: auto` means the
   browser doesn't lay out sections until you scroll near them.
7. **Page switching is pre-loaded** — each page `prefetch`es the pages you're most
   likely to click next, so navigation feels instant.

### 🚀 Optimization ideas for later (ask me to do any of these)

1. **Compress project photos** — resize to ~800px and save as `.webp` (Squoosh.app is
   free) before putting them on covers.
2. **Minify CSS/JS** — strip comments and spaces when you deploy (I can wire this up).
3. **Longer cache headers** — assets could be cached for a month; HTML stays short-lived.
4. **`robots.txt` + sitemap** — help Google find and rank the site.
5. **Social preview image** — a thumbnail that shows when you share the link.
6. **Service worker (PWA)** — makes the site work offline and load even faster on
   repeat visits (slightly more advanced).