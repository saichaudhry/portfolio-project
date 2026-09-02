# Prompt Log — 15-113 Project 1 (Portfolio Website)

Tool used: **Claude Code** (Anthropic), running in the terminal, model Opus.
This log contains the conversational text only, per the assignment instructions.
Generated files are in the repo itself; long tool output is omitted.

---

## Session 1 — 2026-09-01

**Me:** *(pasted a terminal transcript showing `code mag-trading-work` failing with
"command not found", then:)* to fully build this, ask me questions as you go about
preferences, /model = opus

**Claude:** The pasted transcript has no build spec in it, so I have to stop here and
ask. The `code` command failed because the VS Code shell command isn't on your PATH.
Model switching is done by typing `/model opus` yourself. *(Asked what I wanted built.)*

**Me:** *(pasted the full 15-113 Project 1 assignment page: Personal Portfolio Website,
due Sept 5 2026, requirements for about / projects / contact, responsive design, GitHub
Pages deployment, AI-usage comments, prompt log, at least one JS feature.)*

**Claude:** Got it: CMU 15-113 Project 1, a personal portfolio site deployed on GitHub
Pages. This is a separate project from the trading repo, so I'll build it in its own
folder and GitHub repo. A few preference questions before I lay down any code:
1. Where should the site live (user site `saichaudhry.github.io` vs a project repo)?
2. Visual direction (clean minimal light / dark technical / bold colorful / warm editorial)?
3. Which interactive features (dark mode toggle / scroll reveal / contact form validation / project filter tags)?
4. Which projects on day one (this site / Kalshi trading bot / 15-122 work / placeholders)?

**Me:** saichaudhry.github.io. Dark, technical. All four interactive features. Projects:
this portfolio, the Kalshi trading bot, placeholder cards for future 15-113 projects, and
can add some MAG/Novig work.

**Claude:** *(Asked four more questions: how to be introduced, which contact links, photo,
and how much the Novig card should say.)*

**Me:** Stat/ML student at Carnegie Mellon, GTM engineer @ Novig. Contact: GitHub
(saichaudhry), LinkedIn, X/Twitter, email saichaud@andrew.cmu.edu. Photo: leave space,
will give later once needed. Novig card: high level, no numbers.

**Claude:** I have enough to build. LinkedIn and X handles weren't given, so I'll put
clearly marked placeholders in for those. Setting up the folder and checking how we'll
get the repo onto GitHub, since the `gh` CLI isn't installed.
*(Wrote index.html, css/style.css, js/main.js, README.md, and this log. Each file has an
AI USAGE NOTE comment at the top.)*

---

**Claude:** *(Rendered desktop, mobile, and light-mode screenshots with headless Chrome
to check the layout; all three looked right. Committed the site locally. Asked me to
create the GitHub repo, and asked for my LinkedIn/X handles and whether to review the copy.)*

**Me:** Created https://github.com/saichaudhry/portfolio-project. LinkedIn is
linkedin.com/in/saichaudhry, ignore X. Access my resume on the Desktop (most recent one)
but keep me as class of '29. Added a photo to the Desktop.

**Claude:** The repo name changed to portfolio-project, so the live URL will be
https://saichaudhry.github.io/portfolio-project/. Retargeted the remote and links,
wired in LinkedIn, removed X. macOS blocked terminal access to the Desktop, so I asked
Sai to copy the resume and photo into the project folder.

**Me:** photo not working, remove the "this is my 15-113 site" paragraph, also can we do
something cool with my mouse: instead of the mouse, can it be the same green shade but it
lights up where the mouse is on the whole page?

**Claude:** Three changes. The assets folder is still empty, so the photo file never landed;
I made the hero try assets/photo.jpg then assets/photo.png and fall back to the monogram if
neither exists. Removed the 15-113 paragraph from About. Added a custom cursor: a green dot
replaces the OS cursor on mouse devices, and a spotlight lights up the page grid in the
accent color around the pointer. Implemented with two fixed layers positioned by CSS
variables (--mx, --my) that a mousemove listener updates; masked with a radial gradient.
Touch devices are unaffected. Verified with a screenshot, committed, pushed.

**Me:** can you do the photo thing again? ... added it to documents

**Claude:** Found the screenshot in ~/Documents, resized it to a 1200px JPEG at
assets/photo.jpg, and biased the square crop toward the face. Verified the hero
with a screenshot, committed, pushed.

<!-- Keep appending sessions below. Copy-paste your prompts and the replies. -->
