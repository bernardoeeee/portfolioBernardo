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

An 18-year-old programming student with a real shipped record, not coursework screenshots: four team-built applications (three of them hackathon/collaborative projects) with working CRUD, real databases, and public GitHub repositories, plus an active internship at BEG Support. The differentiator is verifiable output at an age when most peers have none.

## Operating Context

- Single-page scrolling site: intro → about me → projects → contact.
- Language switch between PT-BR and English via flag buttons; all copy exists in both languages.
- Project cards open a modal with a longer description and the tech stack used.
- Contact is a name + message form that composes a `wa.me` deep link and opens WhatsApp.
- Visitors arrive from social profile links; mobile traffic is expected to be significant.

## Capabilities and Constraints

- Static site only — no backend, no build server. Any framework must output static files.
- Full PT-BR / EN parity is a hard requirement; every new string needs both languages.
- Current i18n is index-position-based (`querySelectorAll('h1')[n]`), which is fragile and breaks whenever markup order changes. Undecided: whether to keep it or move to a key-based approach.
- WhatsApp number: `+55 51 99707-6102`. No email address is currently published; undecided whether to add one.
- External dependency: Font Awesome kit via CDN.
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
- Biography facts: 18 years old, from Rio Grande do Sul, lives in Portão, studying Técnico em Programação at Senac RS, self-study via Alura and Udemy, interning at BEG Support.
- Media: `assets/eu.jpg` (portrait), `assets/video4.mp4`, `assets/header.png`, `assets/rocket.png`, flag icons.

Absences that must not be fabricated: no testimonials, no client names, no metrics or benchmarks, no awards or placements, no employment history beyond the BEG Support internship, no pricing or availability claims, no live demo URLs (GitHub repos only).

## Product Principles

1. Work first, words second — the four real projects are the argument; nothing invented can outrank them.
2. Credible over impressive — depth a recruiter can verify on GitHub beats superlatives.
3. Bilingual by construction — Portuguese and English are equal, never an afterthought.
4. Make contact trivially easy — every path (WhatsApp, GitHub, LinkedIn) is a valid success.
5. Honest about stage — an 18-year-old student with a shipped record is the story; do not dress it up as an agency.

## Accessibility & Inclusion

No standard formally required by the user. Known product-specific need: the language toggle currently uses flag images as the only affordance and the icon-only social links carry no accessible names — both need text labels for screen readers and keyboard users.
