// Blocco della pagina Planner: ordine cronologico (voce 22). Scritto a mano nel canvas.
// `node add_cronologico.js` lo inserisce in canvas/Planner.dc.html (una volta sola; con --force lo sostituisce).
// Non dipende da lib2. Una rigenerazione di p_planner.py lo cancella. Numeri e titoli: dati di prova.
const fs = require("fs");
const path = require("path");
const P = path.resolve(__dirname, "../../canvas/Planner.dc.html");
const raw = fs.readFileSync(P, "utf8");
const un = (s) => s.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#x27;/g, "'").replace(/&amp;/g, "&");
const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const flat = un(raw);

// --- modelli presi dal canvas ---------------------------------------------------------------
const lis = flat.match(/<li class="title-row">[\s\S]*?<\/li>/g);
const tplOff = lis.find((l) => !l.includes('checked="checked"'));
const tplOn = lis.find((l) => l.includes('checked="checked"'));
function details(src, startMarker) {
  const s = src.indexOf(startMarker);
  let depth = 0, i = s;
  const re = /<details\b|<\/details>/g;
  re.lastIndex = s;
  let m;
  while ((m = re.exec(src))) {
    depth += m[0] === "</details>" ? -1 : 1;
    if (depth === 0) return src.slice(s, m.index + 10);
  }
}
const closedPhase = details(flat, '<details class="phase card">');

const rs = flat.indexOf('<div class="planner__rail">');
let RAIL = flat.slice(rs, flat.indexOf('<div class="planner__list', rs)).replace(/<div class="compact-progress-wrap"[\s\S]*?<\/section><\/div><\/div>/, "").replace("Mostrati 34 di 34", "Mostrati 71 di 71");
const BTN = /<button type="button" class="btn btn--surface btn--lg"[\s\S]*?<\/button>/;
const railRelease = RAIL;
const railChrono = RAIL.replace(BTN, "").replace(/(<legend>Ordine di visione<\/legend>[\s\S]*?)<\/fieldset>/, (m) => m.replace(' checked="checked"', "").replace(/(<input class="choice__input" type="radio")(\/>|>)(<span class="choice__face">Cronologico)/, '$1 checked="checked"$2$3'));
const row = (name, meta, on) => {
  const t = on ? tplOn : tplOff;
  return t
    .replace(/(<span lang="en" class="title-row__name">)[\s\S]*?(<\/span><span class="title-row__meta">)[\s\S]*?(<\/span><\/span>)/, (_, a, b, c) => a + (on ? `<s>${name}</s>` : name) + b + meta + c)
    .replace(/aria-label="[^"]*"/, `aria-label="Segna “${name}” come visto"`);
};
const ph = (n) => `, Fase ${n}`; // virgola come «Film, 2011»: niente punto di mezzo
const ROWS = [
  ["Captain America: The First Avenger", "Film, 2011", 1, 0],
  ["Captain Marvel", "Film, 2019", 3, 0],
  ["Iron Man", "Film, 2008", 1, 1],
  ["Iron Man 2", "Film, 2010", 1, 1],
  ["The Incredible Hulk", "Film, 2008", 1, 1],
  ["Thor", "Film, 2011", 1, 1],
];
const UNPLACED = [
  ["Werewolf by Night", "Speciale TV, 2022", 4, 0, 0],
  ["Avengers: Doomsday", "Film, 2026", 6, 0, 1],
  ["Avengers: Secret Wars", "Film, 2027", 6, 0, 1],
];
const rowsHtml = (list, withPhase) =>
  '<ol class="title-list">' +
  list.map(([n, m, p, w, up]) => {
    let meta = m + (withPhase ? ph(p) : "");
    if (up) meta += ', <span class="title-row__status">In arrivo</span>';
    return row(n, meta, w);
  }).join("") + "</ol>";

// --- pezzi ---------------------------------------------------------------------------------
const SVG = (d) => `<svg class="lucide" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const PLAY = SVG('<path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"/>');
const INFO = SVG('<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>');
const CHEV = '<svg class="lucide chevron" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
const infoBtn = `<button type="button" class="info-tip__trigger info-tip__trigger--info" aria-label="Informazioni sull'ordine cronologico">${INFO}</button>`;
const SRC = 'Fonte: <a href="#">Wikipedia</a>, <a href="#">licenza CC BY-SA 4.0</a>';
const legend = `<ul class="phase-strip__legend muted" aria-hidden="true"><li><span class="phase-strip__swatch phase-strip__cell--watched"></span>Visti</li><li><span class="phase-strip__swatch phase-strip__cell--next">${PLAY}</span>Prossimo</li><li><span class="phase-strip__swatch phase-strip__cell--todo"></span>Da vedere</li></ul>`;
const cells = (states) => states.map((s) => `<span class="phase-strip__cell phase-strip__cell--${s}">${s === "next" ? PLAY : ""}</span>`).join("");
const W = new Set([2, 3, 4, 5, 6, 7, 9, 10, 17, 18, 24, 25]); // posizioni viste, nell'ordine cronologico (prova)
const chronoStates = Array.from({ length: 64 }, (_, i) => (W.has(i) ? "watched" : i === 0 ? "next" : "todo"));
const releaseGroups = [[12, 0], [11, 12], [10, 23], [12, 33], [12, 45], [7, 57]]; // [dimensione, inizio]
const relStates = Array.from({ length: 64 }, (_, i) => (i < 12 ? "watched" : i === 12 ? "next" : "todo"));
const colsRelease = `<div class="phase-strip__columns">${releaseGroups.map(([n, s], k) => {
  const st = relStates.slice(s, s + n), done = st.filter((x) => x === "watched").length;
  return `<div class="phase-strip__phase phase-strip__phase--size-${n}"><div class="phase-strip__cells" aria-hidden="true">${cells(st)}</div><p class="phase-strip__label"><span class="phase-strip__name">Fase ${k + 1}</span><span class="muted">${done} di ${n}</span></p></div>`;
}).join("")}</div>`;
const colsChrono = `<div class="phase-strip__columns"><div class="phase-strip__phase phase-strip__phase--size-64"><div class="phase-strip__cells" aria-hidden="true">${cells(chronoStates)}</div></div></div>`;
const stripD = (cols) => `<section class="phase-strip card"><div class="phase-strip__header"><h2 class="section-title">Tutti i 64 titoli</h2>${legend}</div>${cols}</section>`;
const stripPhone = (cols) => `<div class="phase phase-strip-accordion card" data-open="true"><div class="phase__head"><h2 class="phase__title phase-strip__name"><button type="button" class="phase__toggle" aria-expanded="true"><span class="phase__heading">Tutti i 64 titoli</span>${CHEV}</button></h2></div><div class="phase-strip__body">${legend}${cols}</div></div>`;
const head = (title, count, tip, src) =>
  `<div class="saga__head"><div class="saga__header"><h2 class="saga__title">${title}</h2><p class="saga__count muted">${count}</p></div>${src ? `<p class="saga__source muted">${src}</p>` : ""}</div>`;
const sectionNew = (opts = {}) =>
  `<section class="saga">${head("Ordine cronologico", "12 di 63 visti", true, SRC)}${rowsHtml(ROWS, true)}</section>` +
  `<section class="saga">${head("Senza collocazione", "0 di 1 visti", false, "Questi titoli non compaiono nella linea temporale che usiamo come fonte, quindi non li collochiamo a caso.")}${rowsHtml(UNPLACED, true)}</section>`;
const sectionOld = `<section class="chrono"><h2>In ordine cronologico</h2><p>Segue la linea temporale di Disney+, riportata da Wikipedia. Non è un ordine ufficiale definitivo: per esempio Loki, What If…? e Werewolf by Night non hanno una collocazione fissa nella storia. <a href="#">Linea temporale su Wikipedia</a></p>${rowsHtml(ROWS, false)}</section><section class="chrono"><h2>Senza collocazione cronologica</h2><p>Questi titoli non compaiono nella linea temporale che usiamo come fonte, quindi non li collochiamo a caso.</p>${rowsHtml(UNPLACED, false)}</section>`;

// Il CSS del canvas è più vecchio del codice (manca la fascia ad accordion): per le cornici compilo qui
// i .less attuali di fase, fascia, saga e riga, e li metto dopo app.css.
const { execFileSync } = require("child_process");
const CODE = path.resolve(__dirname, "../../../../src");
const LESSC = path.resolve(__dirname, "../work/lessc/node_modules/.bin/lessc" + (process.platform === "win32" ? ".cmd" : ""));
const ENTRY = path.join(CODE, "__e.less");
fs.writeFileSync(ENTRY, ["PhaseSection/PhaseSection", "PhaseStrip/PhaseStrip", "SagaSection/SagaSection", "TitleItem/TitleItem", "Planner/Planner"].map((f) => `@import "features/planner/components/${f}";`).join(String.fromCharCode(10)));
let LIVE = "";
try { LIVE = execFileSync(LESSC, ["--include-path=.:styles", "__e.less"], { cwd: CODE, encoding: "utf8", shell: process.platform === "win32" }); } finally { fs.unlinkSync(ENTRY); }
// CSS della proposta (nel codice va nei .less indicati dal prompt; qui solo per disegnarla)
const CSS = `html{overflow:hidden}body{margin:0;padding:16px;background:var(--bg)}
.pg{display:flex;flex-direction:column;gap:.5rem;margin:0 auto;max-width:1120px}
.pg.pad{padding:0 16px}
.saga{display:flex;flex-direction:column;gap:.5rem}
.saga__head{display:flex;flex-direction:column}
.saga__source{font-size:var(--fs-caption)}
.saga__head .saga__header{padding-bottom:var(--sp-1)}
.is-old .saga__head{display:none}
.mk{position:absolute;font:800 11px/16px var(--font-body);background:var(--highlight);color:var(--ink-static);padding:0 5px;border-radius:var(--r-tiny)}`;
const fonts = '<link href="https://fonts.googleapis.com/css2?family=Anton&family=Hanken+Grotesk:wght@400;500;600;700;800&display=swap" rel="stylesheet">';
function doc({ theme = "light", css = "", body, script = "", lang = "it" }) {
  return `<!doctype html><html lang="${lang}" data-theme="${theme}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="tokens.css"><link rel="stylesheet" href="app.css">${fonts}<style>${LIVE}${CSS}${css}</style></head><body>${body}${script ? `<script>${script}</script>` : ""}</body></html>`;
}
function frame(label, w, h, opts) {
  const d = doc(opts).replace(/viewBox/g, "viewbox");
  return `<div class="dc-fw"><div class="dc-fl">${label}</div><iframe title="${esc(label)}" srcdoc="${esc(d)}" style="width:${w}px;height:${h}px;border:0;border-radius:var(--r-md);display:block;max-width:100%"></iframe></div>`;
}
const D = 1280, Ph = 390;
// colonna destra allineata alla prima riga: l'intestazione cronologica è più alta (riga della fonte)
const RAILFIX = '.planner__body[data-order="chronological"] .planner__rail{margin-top:calc(var(--fs-xl) * 1.05 + 12px + 8px + var(--fs-caption) * 1.5)}';
const bodyD = (list, rail, order) => `<div class="planner__body" data-order="${order}"><div class="planner__list">${list}</div>${rail}</div>`;
const pageD = (inner, extra = "") => `<div class="pg ${extra}">${inner}</div>`;
const rowF = (...f) => `<div class="dc-row">${f.join("")}</div>`;
const colF = (...r) => `<div style="display:flex;flex-direction:column;gap:var(--sp-5)">${r.join("")}</div>`;
const tag = (t, k = "") => `<span class="dc-chip ${k}">${t}</span>`;
const ul = (a) => `<ul class="dc-ul">${a.map((i) => `<li>${i}</li>`).join("")}</ul>`;
const tbl = (h, r) => `<div class="dc-scroll"><table class="dc-tbl"><thead><tr>${h.map((x) => `<th>${x}</th>`).join("")}</tr></thead><tbody>${r.map((x) => `<tr>${x.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
const sec = (t, sub, body = "") => `<div class="dc-sec"><h2 class="dc-h2">${t}</h2>${sub ? `<p class="dc-sub">${sub}</p>` : ""}${body}</div>`;

// --- frame ---------------------------------------------------------------------------------
const fOldD = frame("Oggi · desktop · chiaro (main c0fd530)", D, 1000, { css: ".chrono{display:flex;flex-direction:column;gap:.5rem;padding:.5rem;border-radius:var(--r-xl);background:var(--surface)}.chrono>h2,.chrono>p{padding:0 .75rem}.chrono>h2{padding-top:.75rem;font-size:var(--fs-h3);font-weight:800}.title-list{display:flex;flex-direction:column;gap:var(--sp-1h)}", body: pageD(stripD(colsRelease) + bodyD(sectionOld, railChrono, "chronological"), "pad") });
const fOldP = frame("Oggi · telefono 390 px · chiaro", Ph + 32, 900, { css: ".chrono{display:flex;flex-direction:column;gap:.5rem;padding:.5rem;border-radius:var(--r-xl);background:var(--surface)}.chrono>h2,.chrono>p{padding:0 .75rem}.chrono>h2{padding-top:.75rem;font-size:var(--fs-h3);font-weight:800}.title-list{display:flex;flex-direction:column;gap:var(--sp-1h)}", body: pageD(stripPhone(colsRelease) + sectionOld) });
const newD = (theme) => frame(`Proposta · desktop 1280 px · ${theme === "dark" ? "scuro" : "chiaro"}`, D, 1010, { theme, body: pageD(stripD(colsChrono) + bodyD(sectionNew(), railChrono, "chronological"), "pad"), css: RAILFIX });
const newP = (theme) => frame(`Proposta · telefono 390 px · ${theme === "dark" ? "scuro" : "chiaro"}`, Ph + 32, 1180, { theme, body: pageD(stripPhone(colsChrono) + sectionNew()) });

// B: tre posti per la fonte (schema: stessa intestazione, righe ridotte)
const mini = (inner, h = 330) => ({ body: pageD(inner, "pad"), css: "" });
const bA = frame("B1 · riga sotto l'intestazione (raccomandata)", 760, 250, mini(`<section class="saga">${head("Ordine cronologico", "12 di 63 visti", true, SRC)}${rowsHtml(ROWS.slice(0, 2), true)}</section>`));
const bB = frame("B2 · piede dell'elenco (dopo 63 righe)", 760, 340, mini(`<section class="saga">${head("Ordine cronologico", "12 di 63 visti", true, "")}${rowsHtml(ROWS.slice(0, 2), true)}<p class="muted" style="text-align:center;padding:var(--sp-3) 0">… altre 61 righe …</p><p class="saga__source muted" style="padding:var(--sp-2) 0">${SRC}</p></section>`));
const bC = frame("B3 · accanto al selettore dell'ordine (schema)", 760, 250, { css: ".sel{display:flex;flex-wrap:wrap;align-items:center;gap:var(--sp-3);padding:var(--sp-3) 0}.sel b{font-weight:700}.sel span.pill{border:1px solid var(--ink-2);border-radius:var(--r-pill);padding:2px 12px;font-size:var(--fs-label)}", body: pageD(`<div class="sel"><b>Ordine di visione</b><span class="pill">Per uscita</span><span class="pill" style="background:var(--ink);color:var(--bg)">Cronologico</span><span class="saga__source muted">${SRC}</span></div><section class="saga">${head("Ordine cronologico", "12 di 63 visti", true, "")}${rowsHtml(ROWS.slice(0, 2), true)}</section>`, "pad") });

// D: fascia
const dNow = frame("D0 · oggi: colonne per fase, ma l'elenco è cronologico", D, 230, { body: pageD(stripD(colsRelease), "pad") });
const dOne = frame("D1 · una riga nell'ordine della linea temporale (raccomandata)", D, 230, { body: pageD(stripD(colsChrono), "pad") });
const dOneDark = frame("D1 · scuro", D, 230, { theme: "dark", body: pageD(stripD(colsChrono), "pad") });
const dNone = frame("D2 · fascia nascosta", D, 200, { body: pageD(sectionNew().slice(0, 0) + `<section class="saga">${head("Ordine cronologico", "12 di 63 visti", true, SRC)}${rowsHtml(ROWS.slice(0, 1), true)}</section>`, "pad") });

// E: righe
const eA = frame("E0 · oggi: tipo e anno", 420, 330, { body: pageD(rowsHtml([ROWS[0], ROWS[1], UNPLACED[1]], false)) });
const eB = frame("E1 · con la fase (raccomandata)", 420, 330, { body: pageD(rowsHtml([ROWS[0], ROWS[1], UNPLACED[1]], true)) });
const eFr = frame("E1 · francese, telefono 390 px", 420, 330, { lang: "fr", body: pageD(`<ol class="title-list">${row("Marvel Zombies", 'Série animée, 2025, Phase 6, <span class="title-row__status">À venir</span>', 0)}${row("Captain America: Brave New World", "Film, 2025, Phase 5", 0)}</ol>`) });

const gA = frame("G · per uscita: «Comprimi tutto» in fondo alla colonna", 360, 560, { body: '<div style="width:328px">' + railRelease.replace('class="planner__rail"', 'class="planner__rail" style="margin-top:0"') + "</div>" });
const gB = frame("G · cronologico (raccomandata): il pulsante non c'è, nient'altro si sposta", 360, 560, { body: '<div style="width:328px">' + railChrono.replace('class="planner__rail"', 'class="planner__rail" style="margin-top:0"') + "</div>" });

// F: dimostrazione viva
const demoRelease = `<section class="saga"><div class="saga__header s1"><h2 class="saga__title">Saga dell'Infinito</h2><p class="saga__count muted">12 di 34 visti</p></div><div class="s2">${closedPhase}${closedPhase.replace(/Fase Uno/g, "Fase Due")}</div></section><section class="saga"><div class="saga__header s1"><h2 class="saga__title">Saga del Multiverso</h2><p class="saga__count muted">0 di 30 visti</p></div><div class="s2">${closedPhase.replace(/Fase Uno/g, "Fase Quattro")}</div></section>`;
const demoChrono = `<section class="saga"><div class="s1">${head("Ordine cronologico", "12 di 63 visti", true, SRC)}</div><div class="s2">${rowsHtml(ROWS, true)}</div></section><section class="saga"><div class="s1">${head("Senza collocazione", "0 di 1 visti", false, "Questi titoli non compaiono nella linea temporale che usiamo come fonte, quindi non li collochiamo a caso.")}</div><div class="s2">${rowsHtml(UNPLACED, true)}</div></section>`;
const DEMO_CSS = `.bar{display:flex;gap:var(--sp-4);align-items:center;margin:0 auto 12px;max-width:1120px;padding:0 16px}.bar button{border:1px solid var(--ink-2);border-radius:var(--r-pill);padding:8px 16px;font-weight:700;background:var(--surface)}.bar label{display:flex;gap:8px;align-items:center;font-size:var(--fs-label)}
/* proposta: stessa idea di :root[data-intro], su .planner[data-order-swap], un solo passo di --stagger-step */
@keyframes demo-in{from{opacity:0;transform:translateY(6px)}}
[data-swap] .s0,[data-swap] .s1,[data-swap] .s2{animation:demo-in var(--dur-enter) var(--ease-out) backwards;animation-delay:min(calc(var(--stagger-step) * var(--i)),var(--stagger-max));will-change:opacity,transform}
.s0{--i:0}.s1{--i:1}.s2{--i:2}`;
const demoBody = `<div class="bar"><button id="go" type="button">Cambia ordine</button><label><input id="slow" type="checkbox"> Rallenta ×5</label><span id="st" class="muted"></span></div><div class="pg pad" id="stage"></div>`;
const demoScript = `var S=document.getElementById('stage'),st=document.getElementById('st'),mode='release',T;
var R=${JSON.stringify('<div class="s0">' + stripD(colsRelease) + "</div>" + demoRelease)},C=${JSON.stringify('<div class="s0">' + stripD(colsChrono) + "</div>" + demoChrono)};
function draw(sw){S.innerHTML=mode==='release'?R:C;st.textContent='Ordine: '+(mode==='release'?'per uscita':'cronologico');if(sw){S.setAttribute('data-swap','');clearTimeout(T);T=setTimeout(function(){S.removeAttribute('data-swap')},document.getElementById('slow').checked?2500:600)}}
document.getElementById('go').onclick=function(){mode=mode==='release'?'chrono':'release';draw(true)};
document.getElementById('slow').onchange=function(e){var r=document.documentElement.style,k=e.target.checked?5:1;r.setProperty('--dur-enter',240*k+'ms');r.setProperty('--stagger-step',30*k+'ms');r.setProperty('--stagger-max',150*k+'ms')};
draw(false);`;
const demo = frame("Cambio di ordine · prova dal vivo (movimento normale)", D, 900, { css: DEMO_CSS, body: demoBody, script: demoScript });

// --- testi -----------------------------------------------------------------------------------
const chip = tag("proposta · non implementata", "k2");
const why = `<b>Raccomandazione.</b> Il cronologico diventa una seconda <i>vista</i> della stessa pagina, non una pagina diversa: stessa intestazione delle saghe (titolo grande, conteggio a destra), niente scheda attorno alle righe, la fonte in una riga piccola sotto il titolo, la fascia in una sola riga nell'ordine dell'elenco, e un cambio di ordine che si anima con la stessa cascata dell'apertura (fascia, intestazione, elenco), ma più corta. Tutte le misure e i valori sono token esistenti; nessun token nuovo. <b>Non verificato:</b> Safari e Firefox, i dati veri (63 titoli collocati, titoli senza collocazione e il loro conteggio sono di prova), la fascia a 1024 px.`;
const decisions = tbl(["", "Domanda", "Raccomandazione", "Alternative scartate"], [
  ["A", "Intestazione", "<b>«Ordine cronologico»</b> in <code>.saga__title</code> (stesso h2, Anton, <code>--fs-h1-sm</code> / <code>--fs-xl</code> dal desktop) e conteggio «12 di 63 visti» in <code>.saga__count</code>. La scheda <code>.chrono</code> sparisce: le righe stanno nella pagina come sotto una saga (prima c'erano un titolo da <code>--fs-h3</code> e un padding di 0,5 rem). Titolo e filtro: il filtro dice «Cronologico» (l'aggettivo, accanto a «Per uscita»), il titolo «Ordine cronologico» (nome come «Saga dell'Infinito»); non «In ordine cronologico», che è una frase.", "Tenere la scheda e solo ingrandire il titolo: due riquadri dentro due riquadri, e le righe non stanno più alla stessa distanza dal bordo che sotto le saghe."],
  ["B", "Dove va la fonte", "<b>B1: riga in piccolo sotto l'intestazione</b>: «Fonte: Wikipedia, licenza CC BY-SA 4.0», <code>--fs-caption</code>, classe <code>.muted</code> (<code>--ink-2</code>), due link sottolineati (stile base di <code>a</code>), nessuna icona; come la fonte della Trama, ma sulla pagina e non sul pannello scuro, quindi nessun <code>--highlight</code>. «Wikipedia» porta alla linea temporale (<code>CHRONOLOGY_SOURCE_URL</code>), «licenza» a <code>creativecommons.org/licenses/by-sa/4.0/</code>. <b>Nessuna icona di info</b> (scelta del committente): la nota lunga di oggi (Disney+, «non è un ordine ufficiale», Loki, What If…?, Werewolf by Night) <b>si toglie</b>; ciò che dice dei titoli senza posto lo dice già la sezione «Senza collocazione». Se si volesse tenere «non è un ordine ufficiale», la strada è una frase in più nella stessa riga, non un controllo. Distanza dall'intestazione: <code>--sp-1</code>.", "<b>B2 piede dell'elenco:</b> dopo 63 righe non è più «vicino all'elenco» e si perde. <b>B3 accanto al selettore:</b> il selettore sta nel filtro (sul telefono dentro un foglio che si chiude): la fonte sparirebbe con lui. Il vincolo legale è che resti visibile vicino all'elenco: <b>da far verificare al committente</b> se la riga fissa sotto il titolo basta (la verifica fatta riguardava la Trama, non questa pagina)."],
  ["C", "Titoli senza collocazione", "<b>Stesso stile, seconda intestazione</b>, ma <b>più corta: «Senza collocazione»</b> (la pagina già dice «cronologico»; con «Senza collocazione cronologica» a 390 px il titolo va su tre righe, misurato, e in tedesco di più), con il proprio conteggio (conta solo i titoli usciti, come ogni gruppo). La nota che oggi li spiega scende nella stessa riga piccola sotto il titolo (stessa classe della fonte). Così le due sezioni si leggono uguali e la regola dei titoli in arrivo (non contano, non hanno barretta) resta in un solo posto.", "Sezione più discreta con <code>h3</code>: crea una gerarchia che non c'è (sono titoli veri, che si segnano e contano). Tenere «Senza collocazione cronologica»: tre righe su telefono."],
  ["D", "Fascia «Tutti i N titoli»", "<b>D1: una colonna sola</b> a tutta larghezza, barrette nell'ordine dell'elenco (prima i collocati, poi quelli senza collocazione che sono usciti), titolo «Tutti i 64 titoli» e legenda uguali, <b>senza etichetta sotto le barrette</b> (scelta del committente: «Ordine cronologico» ripeteva il titolo della sezione sotto; il conteggio «12 di 64» resta solo per chi usa lo screen reader, come oggi, e «12 di 63 visti» è nell'intestazione). Il titolo in arrivo non ha barretta, come oggi. Stesse classi: cambia solo il numero di colonne, e a 1280 px è più bassa di 52 px (125 contro 177, misurato: manca la riga delle etichette; la cella è 12,8 px su una colonna di 1008 px, e una riga di 64 barrette sta in 701 px minimi).", "<b>D2 nascosta:</b> si perde il colpo d'occhio sull'avanzamento, che è la parte più amata. <b>D3 colonne per periodo storico:</b> non la propongo, perché non c'è una fonte affidabile per i periodi (principio 5, onestà sui dati)."],
  ["E", "Righe", "Aggiungere la <b>fase</b> alla riga, in coda al tipo e all'anno: «Film, 2011, Fase 1» (con «, In arrivo» dopo). L'anno c'è già; la fase serve perché nel cronologico la fascia non la mostra più. Solo virgole, come «Film, 2011»: <b>nessun punto di mezzo</b> e nessun chip. Cambia anche «In arrivo», oggi preceduto da « · »: stesso trattamento (stesso testo in grassetto, virgola al posto del punto) <b>per coerenza, da confermare</b>. Solo nel cronologico: sotto le saghe la fase è nell'intestazione sopra.", "Solo l'anno (già così): non dice a quale saga appartiene. Un chip per la fase: rumore su 63 righe."],
  ["F", "Movimento", "Vedi la prova dal vivo e la tabella sotto: <b>fascia → intestazione → elenco</b> (dall'alto in basso), <code>swap-in</code> a <code>--dur-enter</code>, ritardo <code>--stagger-step</code> × passo, tetto <code>--stagger-max</code>: totale 60 + 240 = 300 ms. Righe: l'elenco entra come blocco, senza cascata per riga (63 righe). Fascia: stessa altezza, si dissolve da colonne a riga, <b>senza</b> ripetere la batteria (i numeri non cambiano). Movimento ridotto: resta la sola dissolvenza da 85% della lista, come oggi (<code>--dur-hover</code>, 80 ms).", "<b>Ripetere la batteria:</b> riproduce un effetto d'apertura per un cambio che non cambia i numeri, e dura 300 ms in più. <b>Cascata per riga:</b> 63 righe, il tetto la rende un blocco comunque."],
  ["G", "«Comprimi/Espandi tutto»", "Resta <b>assente</b> in cronologico (non ci sono fasi): niente transizione, esce insieme al resto. Sta in fondo alla colonna destra, sotto la scheda dei filtri: essendo l'ultimo elemento, sparendo non sposta niente.", "Dissolvenza del pulsante: un movimento in più per un controllo piccolo."],
  ["H", "«Prossimo da guardare»", "<b>Non serve dirlo.</b> La scheda ha già la sua dissolvenza (<code>.next-card__swap</code>) e il titolo cambia davanti agli occhi; il selettore dell'ordine è sempre visibile. Una riga in più sulla scheda pesa più di quanto spiega.", "«Prossimo nell'ordine cronologico» come sottotitolo: da riconsiderare solo se gli utenti si confondono."],
]);
const timing = tbl(["Passo", "Elemento", "Ritardo (movimento normale)", "Durata", "Movimento ridotto"], [
  ["0", "Fascia <code>.phase-strip</code> / <code>.phase-strip-accordion</code>", "0", "<code>--dur-enter</code> 240 ms", "nessuna animazione, il contenuto cambia e basta"],
  ["1", "Intestazione di ogni sezione (<code>.saga__header</code>, e la riga della fonte che la segue)", "<code>--stagger-step</code> 30 ms", "240 ms", "nessuna"],
  ["2", "Corpo della sezione (<code>.title-list</code>, o le fasi)", "60 ms (tetto <code>--stagger-max</code> 150)", "240 ms", "dissolvenza da 85% della lista, <code>--dur-hover</code> (come oggi)"],
  ["", "<b>Fine</b>", "60 + 240 = <b>300 ms</b> (l'apertura ne dura 600)", "", "80 ms"],
]);
const codeRules = `<pre><code>// Planner.tsx: al cambio di viewOrder (non al montaggio) imposta data-order-swap su .planner
// per --dur-enter + 2 × --stagger-step (come per data-intro) e toglilo; niente classe --swap sulla lista.
// motion.less, blocco no-preference, accanto a :root[data-intro]
.planner[data-order-swap] {
  :is(.phase-strip, .phase-strip-accordion) { --i: 0; }
  .saga__header,
  .saga__head              { --i: 1; }
  .saga &gt; :not(.saga__header, .saga__head) { --i: 2; }
  :is(…tutti e tre…) {
    animation: swap-in var(--dur-enter) var(--ease-out) backwards;
    animation-delay: min(calc(var(--stagger-step) * var(--i)), var(--stagger-max));
  }
}
// blocco reduced-motion: .planner[data-order-swap] .planner__list { animation: list-swap-in var(--dur-hover) var(--ease-out); }</code></pre>`;
const files = tbl(["Cosa", "Prima", "Dopo", "File"], [
  ["Intestazione del cronologico", "scheda <code>.chrono</code> con h2 <code>--fs-h3</code>", "<code>SagaHeader</code> condiviso con <code>SagaSection</code>: h2 <code>.saga__title</code>, conteggio", "ChronologicalList.tsx/.less, SagaSection.tsx/.less"],
  ["Fonte", "nota lunga + link «Linea temporale su Wikipedia» sotto il titolo", "una riga <code>.saga__source</code> (<code>--fs-caption</code>, <code>.muted</code>); nota lunga tolta", "ChronologicalList.tsx, locale (5)"],
  ["Titoli senza collocazione", "seconda scheda con h2 <code>--fs-h3</code> e nota", "seconda intestazione, stesso stile, conteggio; nota nella riga sotto", "ChronologicalList.tsx"],
  ["Fascia", "sempre colonne per fase", "in cronologico una colonna sola, ordine dell'elenco", "PhaseStrip.tsx/.less, strip.ts, Planner.tsx"],
  ["Riga", "«Film, 2008»", "«Film, 2008 · Fase 1»", "TitleItem.tsx"],
  ["Cambio di ordine", "dissolvenza da 85% della lista", "cascata fascia → intestazione → elenco, 300 ms", "motion.less, Planner.tsx"],
]);
const block = `<div class="dc-sec" id="cronologico"><h2 class="dc-h2">Decisione · Ordine cronologico: intestazione, fonte, fascia e movimento (voce 22)</h2><div>${chip}</div>
<p class="dc-sub">Riferimento: main c0fd530. Sono quattro richieste del committente e otto decisioni (A–H): sotto, la raccomandazione e le alternative; sceglie il committente. Misurato nel browser con il CSS del canvas; titoli e numeri sono di prova. Il «Prossimo da guardare» e l'intestazione dell'app sono fuori dalle cornici.</p>
<div class="dc-box"><div class="dc-fl">Sintesi</div><p>${why}</p></div>
${sec("Decisioni A–H", "", decisions)}
${sec("Oggi", "Una scheda con un titolo piccolo, la nota lunga, un elenco piatto; la fascia mostra ancora le colonne per fase. Il cronologico sembra una pagina diversa.", colF(fOldD, fOldP))}
${sec("Proposta · desktop, chiaro e scuro", "Intestazione come una saga, fonte in riga piccola, senza icona di info, fascia a una colonna, seconda sezione con lo stesso stile.", colF(newD("light"), newD("dark")))}
${sec("Proposta · telefono 390 px", "La fascia è l'accordion aperto: 64 barrette da 24 px vanno a capo (5 righe, 13 per riga, misurato) con una sola etichetta; l'accordion aperto è 249 px (390 px di larghezza).", rowF(newP("light"), newP("dark")))}
${sec("B · dove va la fonte", "Tre posti. La riga sotto l'intestazione (B1) sta vicino all'elenco, si legge sempre e non dipende da un controllo che si chiude. B3 è uno schema del filtro, non il componente.", colF(rowF(bA, bB), bC))}
${sec("D · la fascia in cronologico", "Oggi (D0) le colonne dicono fasi che l'elenco sotto non segue. D1 è la raccomandata; D2 è l'alternativa. D3 (periodi storici) non disegnata: manca la fonte.", colF(dNow, dOne, dOneDark, dNone))}
${sec("E · la riga", "«Film, 2011, Fase 1»: un solo testo, solo virgole, senza chip. A destra il francese a 390 px (le righe più lunghe vanno a capo senza rompere la riga).", rowF(eA, eB, eFr))}
${sec("G · «Comprimi/Espandi tutto»", "Il pulsante sta in fondo alla colonna destra, sotto la scheda dei filtri: in cronologico non c'è e, essendo l'ultimo elemento, non sposta niente.", rowF(gA, gB))}
${sec("F · cambio di ordine: prova dal vivo", "Premi «Cambia ordine»; «Rallenta ×5» moltiplica durate e passi per vedere la cascata. Il pulsante, il ritardo e la prova sono del canvas: nel codice basta il blocco sotto. Le fasi della versione «per uscita» sono quelle del canvas (struttura più vecchia, solo per il confronto).", demo + timing)}
${sec("Regola per Code", "Stato di partenza: main c0fd530. Solo token esistenti. Prompt completo: <code>docs/design/PROMPT_CODE_CRONOLOGICO.md</code>.", codeRules)}
${sec("Prima, dopo, file", "", files)}
</div>`;

const NL = raw.includes("\r\n") ? "\r\n" : "\n"; // la pagina ha a-capo CRLF
const END = `${NL}</div>${NL}</x-dc>`;
if (!raw.includes(END) || raw.split(END).length !== 2) throw new Error("fine pagina non trovata");
if (raw.includes('id="cronologico"')) {
  if (!process.argv.includes("--force")) throw new Error("già inserito (usa --force)");
  const a = raw.indexOf('<div class="dc-sec" id="cronologico">');
  fs.writeFileSync(P, raw.slice(0, a).replace(/\r?\n$/, "") + NL + block + END + raw.split(END)[1], "utf8");
} else fs.writeFileSync(P, raw.replace(END, NL + block + END), "utf8");
console.log("ok", Buffer.byteLength(block));
