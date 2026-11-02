repo: igeod/marvel-planner
branch: main

## Last sync
date: 2026-11-02T21:10:49Z
commit: 8a4c146 (short sha, as reported by the repo listing; full sha not known)

### Updated in this project
- Fourth round: widths in rem/ch, Planner progress card with container query, accordion close sequence, Modal/Mark watched/why-toggle compared, tokens --hit and --soft-press added, --bar-h-lg removed
- Compared Buttons, Textfield, Profile Popup, Pagina Film and Progress against the applied code (8a4c146); design aligned where the code was right, remaining differences listed in CHANGES_FOR_CODE.md (third round)
- Text sizes and control heights converted to rem in tokens.css and the pages; breakpoints proposed in em
- New page Splash.dc.html (Apertura del sito); Progress, Navigation, Textfield, Badges, Buttons extended

## Screen map
| Screen | Repo files |
| --- | --- |
| Select.dc.html | src/components/ui/SelectField/SelectField.tsx, SelectField.less, position.ts, src/styles/motion.less |
| Title row.dc.html | src/features/planner/components/TitleItem/TitleItem.tsx, TitleItem.less, src/styles/motion.less |
| Planner.dc.html | src/features/planner/components/Planner, PhaseSection, PlannerFilters, PlannerSummary, NextToWatch, PhaseStrip, PlannerSearch |
| Navigation.dc.html | src/components/layout/AppHeader/AppHeader.less, HeaderMenu, LanguageSwitcher, src/features/auth/components/AccountMenu |
| Popup.dc.html | src/components/ui/Modal/Modal.tsx, Modal.less, ConfirmDialog, src/features/planner/components/FiltersSheet |
| Tooltip.dc.html | src/components/ui/Tooltip/Tooltip.tsx, Tooltip.less, InfoTip |
| Spoiler box.dc.html | src/components/ui/SpoilerBox/SpoilerBox.tsx, SpoilerBox.less |
| Progress.dc.html | src/components/ui/ProgressMeter, src/styles/base.less (progress), CompactProgress, FloatingProgress |
| Buttons.dc.html | src/components/ui/Button/Button.less, ChoiceGroup, Switch |
| Textfield.dc.html | src/components/ui/Field/Field.less, src/styles/base.less, PlannerSearch |
| Pagina Film.dc.html | src/features/planner/components/TitleDetailsPanel/TitleDetailsPanel.less |
| Profile Popup.dc.html | src/features/account/components/AccountSettings/AccountSettings.less, ProfileSection.less |
| Splash.dc.html | src/app/splash.ts, index.html, src/styles/motion.less |
| tokens.css | src/styles/tokens.less |

## Sync history
- 2026-11-02T12:00:00Z: first restructure to 26 pages (no commit recorded)
