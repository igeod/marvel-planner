# Strumenti del canvas di design

Qui sta tutto quello che genera `docs/design/canvas/` e i due documenti `HANDOFF.md` e `CHANGELOG.md`. Non fa parte dell'app.

- `dsn/` Python che scrive le 27 pagine `.dc.html` in `dsn/out/`. `lib2.py` (costanti e `write`), `comp.py`/`parts.py` (componenti comuni), `p_*.py` (una pagina ciascuno), `add_*.py` e `addlib.py` (blocchi aggiunti alle pagine, con le note "implementata · main …"). `buildcss.py` compila `tokens.css` e `app.css` dal codice con `lessc`. `loc.js` estrae i testi in `locales.json`. `remap.py` ricalcola i numeri di riga `File r.N` da un commit vecchio a quello nuovo.
- `dsn/out/` le pagine generate. **`Colors.dc.html` e `Progress.dc.html` si modificano a mano qui: non rigenerare `p_colors.py` e `p_progress.py`.** Anche `p_scorciatoie.py`, `p_fascia.py`, `p_guida.py` sono avanzi: non lanciarli.
- `qa/` script Playwright: `sec.js '[["Planner","Titolo sezione",1280]]'` fotografa una sezione, `geo.js` misura barra/toast/fasi negli iframe, `ovf*.js` cerca overflow.

Si parte con `bash docs/design/tools/setup.sh` (crea `tools/work/`, ignorata da git, installa `less` e `lucide-static`, imposta i percorsi). Mai committare con i percorsi impostati: `setup.sh --reset`.
Le pagine generate vanno poi copiate in `docs/design/canvas/`, insieme a `tokens.css`/`app.css`.
