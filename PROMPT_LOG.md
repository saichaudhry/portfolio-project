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

**Me:** add mag work

**Claude:** Expanded the trading-bot card into "MAG — Prediction-Market Trading": the
operation I founded, described at a high level (recorder, consensus fair model, maker
engine, replay backtester, AWS deployment, honest scorecard) with no P&L, sizes, or
strategy parameters. Mentioned MAG by name in the About bio. Committed, pushed.

**Me:** no that is wrong, look at my resume, it is not mine, that is the market maker I
worked for.

**Claude:** Corrected. Read the resumes in Documents (the July 2026 versions). Rewrote the
About bio, skills, and work cards from them: MAG is now "Trading Systems" work for a
market-making firm, not something I founded; Novig card reflects the parlay pricing engine,
cross-venue matching, external market-maker framework, and RFQ funnel work; added TRADERS @
CMU, CMU HCI Lab, and Morgan Stanley cards and a Research filter. Kept class of 2029 and no
numbers. Committed, pushed.

**Me:** https://manhattanathleticgroup.com/ ... add mag website

**Claude:** MAG is Manhattan Athletic Group. Fetched their site (they describe themselves as
market making, proprietary trading, and research). Renamed the card, linked the site from the
card and from the bio. Committed, pushed.

**Me:** just use same bullet points from resume, don't like this, it is also wrong: this
isn't me building this, it's from my internship. *(quoted the MAG card text)*

**Claude:** Replaced every card's paragraph with the resume bullets copied verbatim
(including the numbers), with a role/location/dates line under each title. Removed the
invented MAG description; that card now shows only the firm's own self-description and link
with "Details coming soon" until Sai supplies bullets. Bio trimmed to facts. Committed, pushed.

**Claude (follow-up):** The five-bullet Novig card stretched its whole grid row, so
experience entries are now full-width rows with the thumbnail as a side panel; short items
stay as cards. Verified desktop and mobile screenshots, committed, pushed.

**Me:** for Novig I work on markets, operations, growth engineering side. Can we also have
an option to "view resume" that opens it on top of the browser, not a download, but with a
download option, kind of how on Arc you can preview a document?

**Claude:** Changed the Novig role line to "Markets, Operations & Growth Engineering".
Added a "View resume" button in the hero and a "Resume" nav link that open an overlay with
the PDF in an iframe, plus Download and Open-in-tab buttons; Esc, the X, or clicking the
backdrop closes it. The PDF only loads the first time it's opened. Copied the class-of-2029
resume to assets/Sai_Chaudhry_Resume.pdf. Committed, pushed.

**Me:** change Morgan Stanley to Applied Wealth Management Research

**Claude:** Changed the Morgan Stanley role line and the mention in the bio. Committed, pushed.

**Me:** Manhattan Athletic Group bullet points are the technical part of the Novig one

**Claude:** Moved the four technical bullets (parlay pricing engine, cross-venue matching,
external market-making framework, RFQ funnel) from the Novig entry to the MAG entry, verbatim.
Novig keeps its first, general bullet. Committed, pushed.

**Me:** don't show "this field is required" unless I press Send message and didn't fill it out

**Claude:** Removed the on-blur validation. Errors now appear only after the first Send
click; after that a field re-checks as you type so the error clears once fixed. Committed, pushed.

<!-- Keep appending sessions below. Copy-paste your prompts and the replies. -->
