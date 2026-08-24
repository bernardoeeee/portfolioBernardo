# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Existing: plain static HTML, CSS, and vanilla JavaScript (`index.html`, `style.css`, `script.js`), deployed on GitHub Pages at `https://bernardoeeee.github.io/portfolioBernardo/`. The user has explicitly authorized changing anything, including the stack; any replacement must still deploy as a static site on GitHub Pages.

## Users

Primary: people evaluating Bernardo Varisco Fleck professionally — recruiters and hiring contacts at tech companies (Rio Grande do Sul, Brazil), plus potential freelance clients and peers who arrive from a GitHub, LinkedIn, or Instagram link. They arrive cold, know nothing about him, and are deciding in under a minute whether he is worth contacting. Audience is bilingual: Brazilian Portuguese speakers and English speakers.

## Product Purpose

A personal portfolio that does three things: show his built work, show the projects behind it in enough depth to be credible, and tell enough of his personal story that a stranger understands who he is. Success is any real contact: a WhatsApp message, a GitHub or LinkedIn follow-through, or an interview invitation. All three count equally — the user confirmed "all of them."

## Positioning

An 18-year-old systems developer in training with a real shipped record, not coursework screenshots: four team-built applications (three of them hackathon/collaborative projects) with working CRUD, real databases, and public GitHub repositories, plus a live internship at BEG Support building web solutions in Oracle APEX, PL/SQL and JavaScript for clients across several industries. The Técnico em Programação at Senac RS is completed, not in progress. The differentiator is verifiable output — and paid enterprise work — at an age when most peers have none.

## Operating Context

- Single-page scrolling site: chart/hero → the observer (bio) → the four systems → contact.
- Language switch between PT-BR and English; all copy exists in both languages.
- The four systems are laid out as a 2x2 grid above 1000px (one per row below that); each card carries the description, the stack chips two per line, the repo link and the system's brand mark.
- Contact is a name + message form that composes a `wa.me` deep link and opens WhatsApp.
- Visitors arrive from social profile links; mobile traffic is expected to be significant.

## Capabilities and Constraints

- Static site only — no backend, no build server. Any framework must output static files.
- Full PT-BR / EN parity is a hard requirement; every new string needs both languages.
- i18n is key-based: every translatable node carries `data-i18n`, PT is harvested from the DOM at load, EN lives in the `EN` map in `script.js`, and the choice persists in `localStorage` under `folha-edicao`. Any new string needs a `data-i18n` key plus an `EN` entry.
- WhatsApp number: `+55 51 99707-6102`. No email address is currently published; undecided whether to add one.
- No external CDN dependency; the sheet's terrain, contours and profile curve are drawn in vanilla JS on canvas and SVG.
- Undecided: whether the site keeps a single page or gains per-project detail pages.

## Brand Commitments

- Name: Bernardo Varisco Fleck.
- Social identities that must remain linked: GitHub `bernardoeeee`, LinkedIn `bernardo-varisco-fleck-aaa5b5272`, Instagram `bvfleck`.
- No binding visual constraint. The user explicitly released the existing look, including the rocket icon and flag-button language toggle: "if you want, you can change all."

## Evidence on Hand

Real, verifiable:
- **Hackaton + Saúde / Hackathon + Health** — CRUD app helping hospitals locate surgical and cleaning tools. HTML, CSS, JavaScript, MySQL. Repo: `bernardoeeee/hackathon2024`. Screenshot: `assets/RastriMed.jpg`.
- **SmartFlow** — school class administration platform: teachers, students, attendance, academic performance, role-based access. HTML, CSS, JavaScript, MySQL. Repo: `bernardoeeee/SmartFlow`. Screenshot: `assets/SmartFlow.jpg`.
- **FoodMind** — client-server web app for nutrition tracking, dietary habits, reminders and events, with messaging and profile customization. HTML, CSS, JavaScript, MySQL, Socket.io. Repo: `bernardoeeee/FoodMind`. Screenshot: `assets/FoodMind.jpg`.
- **DevFeira** — help-exchange platform for programming, design, and projects, with auth and three posting areas. HTML, CSS, JavaScript, MySQL. Repo: `bernardoeeee/Hackathon-3B-FeiraTrocaDigital`. Screenshot: `assets/DevFeira.jpg`.
- Biography facts: 18 years old, from Rio Grande do Sul, lives in Portão, completed the Técnico em Programação at Senac RS (front-end plus relational database modelling), interning at BEG Support on Oracle APEX, PL/SQL and JavaScript for client web solutions.
- Current stack, as published on the site: Oracle APEX, PL/SQL, SQL, JavaScript, HTML5, CSS3, Git. MySQL and Socket.io remain true of the four catalogued systems but are no longer claimed as present-day tools.
- This portfolio itself counts as built work: bilingual by construction and integrated with WhatsApp.
- Media: `assets/eu.jpg` (portrait) and one brand mark per system (`RastriMed.jpg`, `SmartFlow.jpg`, `FoodMind.jpg`, `DevFeira.jpg`). These are marks, not application screenshots — no section yet shows a system running.

Absences that must not be fabricated: no testimonials, no client names, no metrics or benchmarks, no awards or placements, no employment history beyond the BEG Support internship, no pricing or availability claims, no live demo URLs (GitHub repos only).

## Product Principles

1. Work first, words second — the four real projects are the argument; nothing invented can outrank them.
2. Credible over impressive — depth a recruiter can verify on GitHub beats superlatives.
3. Bilingual by construction — Portuguese and English are equal, never an afterthought.
4. Make contact trivially easy — every path (WhatsApp, GitHub, LinkedIn) is a valid success.
5. Honest about stage — an 18-year-old student with a shipped record is the story; do not dress it up as an agency.

## Accessibility & Inclusion

No standard formally required by the user. Known product-specific need: the language toggle currently uses flag images as the only affordance and the icon-only social links carry no accessible names — both need text labels for screen readers and keyboard users.
