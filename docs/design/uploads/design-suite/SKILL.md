---
name: design-suite
description: All-in-one UI/UX design toolkit. Use whenever designing, building, redesigning, reviewing, auditing, polishing or fixing any web/mobile UI - landing pages, dashboards, app screens, components, error/empty states, design systems, typography, color, motion, accessibility (WCAG), React/Next.js/React Native code quality, or when a design looks generic or "AI-made". Routes to bundled expert modules (frontend-design, design-taste, taste-skill, ui-ux-pro-max, Bencium UX, Vercel guidelines, AccessLint).
---

# Design Suite

One skill that bundles several design skills as **modules**. Each module lives in `modules/<name>/` and has a `GUIDE.md` (its former SKILL.md) plus its own references, data and scripts. `<SKILL_DIR>` below means the folder that contains this file.

## How to use

1. Identify the task, pick the module(s) from the table, and **read the module's `GUIDE.md` before working**. Paths inside a guide are relative to that module's folder.
2. Do not load every module. Use one **direction** module + optional **review** modules.
3. If two modules disagree, follow the project's own design system or DESIGN.md first, then the direction module, then the others.
4. Reply in the user's language.

## Module map

| Task | Read |
|---|---|
| Choose a bold aesthetic direction, avoid templated look | `modules/frontend-design/GUIDE.md` |
| Polish, critique, anti-"AI slop", motion, component states | `modules/design-taste/GUIDE.md` (+ `reference/`) |
| Art direction for landing/marketing sites and app screens, screenshot look-and-fix loop | `modules/taste-skill/GUIDE.md` |
| Pick style / palette / font pairing / UX rules / chart type / stack guidance (searchable data, Python) | `modules/ui-ux-pro-max/GUIDE.md` (scripts: `<SKILL_DIR>/modules/ui-ux-pro-max/scripts/search.py`) |
| Accessible, unique UI; colors, type, layout decisions | `modules/bencium-controlled-ux/GUIDE.md` |
| Original visual language, brand/campaign/product systems | `modules/bencium-innovative-ux/GUIDE.md` |
| Typography system | `modules/bencium-typography/GUIDE.md` |
| Design audit of an existing UI | `modules/bencium-design-audit/GUIDE.md` |
| Review UI code against Web Interface Guidelines (rules bundled) | `modules/vercel/web-design-guidelines/GUIDE.md` |
| React / Next.js performance | `modules/vercel/react-best-practices/GUIDE.md` |
| React component architecture, composition | `modules/vercel/composition-patterns/GUIDE.md` |
| React Native / mobile UI | `modules/vercel/react-native-skills/GUIDE.md` |
| WCAG 2.2 accessibility: scan, inspect, audit, fix, diff | `modules/accesslint/accessibility-*/GUIDE.md` (shared rules in `modules/accesslint/shared/methodology.md`) |

## Suggested combos

- **New UI / redesign**: frontend-design -> (taste-skill or design-taste) -> ui-ux-pro-max for palette/fonts -> accessibility-scan.
- **"Fix everything" pass**: bencium-design-audit -> design-taste -> web-design-guidelines -> accessibility-audit -> accessibility-fix.
- **Error / empty / loading pages**: design-taste (component states, motion) + frontend-design (personality).
- **React code review**: web-design-guidelines + react-best-practices + composition-patterns.

## Notes and limits

- `bencium-controlled-ux` is written to **ask before making design decisions**. In autonomous runs, prefer `frontend-design` / `design-taste` for direction and use Bencium for review only.
- `taste-skill` and `ui-ux-pro-max` use scripts (Node/Python, a browser inspector). If code execution or a browser is unavailable, apply their written rules without running the scripts.
- AccessLint guides mention AccessLint MCP tools. Without them, apply the methodology and WCAG checks manually.
- Original licenses are kept inside each module (MIT / Apache-2.0 / others). Check them before redistributing.
