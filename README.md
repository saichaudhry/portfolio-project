# saichaudhry.github.io

Personal portfolio site for Sai Chaudhry. Live at **https://saichaudhry.github.io**.

Built for CMU 15-113 (Effective Coding with AI), Project 1, and maintained as a
running showcase of coursework and side projects through the semester.

## Stack

Plain HTML, CSS, and JavaScript. No frameworks, no build step. Hosted on GitHub Pages.

```
index.html      page structure and content
css/style.css   design tokens (dark + light themes), layout, components, responsive rules
js/main.js      theme toggle, mobile nav, scroll reveal, project filter, contact-form validation
assets/         images (photo and project screenshots go here)
PROMPT_LOG.md   AI prompt log required by the course
```

## Run locally

Open `index.html` in a browser, or serve the folder so fonts and paths behave like production:

```
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy

Push to `main`. GitHub Pages serves the repo root at https://saichaudhry.github.io
(Settings → Pages → Source: Deploy from a branch → `main` / root).

## AI usage

Code was drafted with Claude Code (Anthropic) from my written specifications and then
reviewed and edited by me. Each file carries an "AI USAGE NOTE" comment at the top
describing what was AI-drafted and what I changed. The full conversation is in
`PROMPT_LOG.md`.

## Credits

- Fonts: [Inter](https://rsms.me/inter/) and [JetBrains Mono](https://www.jetbrains.com/lp/mono/) via Google Fonts (SIL Open Font License)
- Icons: hand-drawn inline SVG
