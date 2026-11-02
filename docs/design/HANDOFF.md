# Marvel Planner: handoff

Per Claude Code, in questo ordine:
1. `CHANGES_FOR_CODE.md`: checklist di modifiche (componente | file | attuale | nuovo | token).
2. `tokens.css`: unica fonte dei valori. Nessuna pagina li ripete.
3. `Index.dc.html`: indice delle 27 pagine di guida (27 più l'indice = 28 file `.dc.html`): 10 fondamenta (inclusa Apertura del sito), 14 componenti, 3 schermate di riferimento (Planner, Pagina Film, Profile Popup); Popup è anche componente.
4. `Planner.dc.html`: schermata interattiva di riferimento. `PROFILE_POPUP_SPEC.md`: spec del popup profilo.

Regole: una curva (`--ease-out`), cinque durate, uscita un gradino sotto l'entrata, nessun `--ease-in`; icone Lucide; font Anton + Hanken Grotesk; tema scuro con `data-theme="dark"`.
