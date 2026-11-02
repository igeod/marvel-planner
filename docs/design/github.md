repo: igeod/marvel-planner
branch: main

## Last sync
date: 2026-11-02T12:00:00Z

### Updated in this project
- Design pages restructured to 26 pages, one mother page per component; tokens.css is the single source of values
- Changes for the code listed in CHANGES_FOR_CODE.md (applied by Claude Code, second round pending)

## Screen map
| Screen | Repo files |
| --- | --- |
| Select.dc.html | src/components/ui/SelectField/SelectField.tsx, SelectField.less, position.ts, src/styles/motion.less |
| Title row.dc.html | src/features/planner/components/TitleItem/TitleItem.tsx, TitleItem.less, src/styles/motion.less |
| Planner.dc.html | src/features/planner/components/Planner/Planner.tsx, PhaseSection, PlannerFilters, PlannerSummary, NextToWatch, PhaseStrip |
| Navigation.dc.html | src/components/layout/AppHeader/AppHeader.less, HeaderMenu, LanguageSwitcher |
| Popup.dc.html | src/components/ui/Modal/Modal.tsx, Modal.less, ConfirmDialog |
| Tooltip.dc.html | src/components/ui/Tooltip/Tooltip.tsx, Tooltip.less, InfoTip |
| Spoiler box.dc.html | src/components/ui/SpoilerBox/SpoilerBox.tsx, SpoilerBox.less |
| Progress.dc.html | src/components/ui/ProgressMeter, src/features/planner/components/CompactProgress, FloatingProgress |
| Buttons.dc.html | src/components/ui/Button, ChoiceGroup, Switch |
| Textfield.dc.html | src/components/ui/Field, src/styles/base.less |
| Pagina Film.dc.html | src/features/planner/components/TitleDetailsPanel |
| Profile Popup.dc.html | src/features/account/components/AccountSettings |
| tokens.css | src/styles/tokens.less |
