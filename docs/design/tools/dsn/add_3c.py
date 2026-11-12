from addlib import *
def box(inner,style=''): return f'<div style="background:var(--surface);border-radius:var(--r-md);padding:var(--sp-3) var(--sp-4);{style}">{inner}</div>'
def kv(**k): return k
# ================= C20 episodes =================
E=[
 ('planner.episodes.label',T('Episodi visti','Episodes watched','Épisodes vus','Episodios vistos','Gesehene Folgen')),
 ('planner.episodes.progress',T('{done} di {total}','{done} of {total}','{done} sur {total}','{done} de {total}','{done} von {total}')),
 ('planner.episodes.less',T('Un episodio in meno','One episode less','Un épisode de moins','Un episodio menos','Eine Folge weniger')),
 ('planner.episodes.more',T('Un episodio in più','One episode more','Un épisode de plus','Un episodio más','Eine Folge mehr')),
 ('planner.episodes.all',T('Segna tutti gli episodi','Mark all episodes','Marquer tous les épisodes','Marcar todos los episodios','Alle Folgen markieren')),
 ('planner.episodes.chip',T('Episodio {n}','Episode {n}','Épisode {n}','Episodio {n}','Folge {n}')),
]
def stepper(done,total,lang='it'):
    lab=fill(dict(E)['planner.episodes.progress'][lang],done=done,total=total)
    return (f'<div style="display:flex;align-items:center;gap:var(--sp-3);flex-wrap:wrap"><span class="dc-fl">{esc(dict(E)["planner.episodes.label"][lang])}</span>'
            f'{btn("soft","","sm","","minus","aria-label=\""+esc(dict(E)["planner.episodes.less"][lang])+"\"")}<output style="min-width:4.5rem;text-align:center;font-weight:800">{lab}</output>{btn("soft","","sm","","plus","aria-label=\""+esc(dict(E)["planner.episodes.more"][lang])+"\"")}</div>')
def chips(done,total,lang='it'):
    out=''.join(f'<label class="choice"><input class="choice__input" type="checkbox"{" checked=\"checked\"" if i<=done else ""}/><span class="choice__face" aria-label="{fill(dict(E)["planner.episodes.chip"][lang],n=i)}">{i}</span></label>' for i in range(1,total+1))
    return f'<fieldset class="choice-group"><legend>{dict(E)["planner.episodes.label"][lang]}: {fill(dict(E)["planner.episodes.progress"][lang],done=done,total=total)}</legend><div style="display:flex;flex-wrap:wrap;gap:var(--sp-2)">{out}</div></fieldset>'
def elist(done,total):
    return '<ul style="list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:var(--sp-2)">'+''.join(f'<li style="display:flex;gap:var(--sp-3);align-items:center"><label class="title-row__check"><input type="checkbox"{" checked=\"checked\"" if i<=done else ""} aria-label="{i}"><span class="title-row__box" aria-hidden="true">{icon("check")}</span></label><span>{i}. …</span></li>' for i in range(1,total+1))+'</ul>'
add('Planner',
 block('Nuova funzione · spunta per episodio nelle serie',RIM+' '+PROP,'<b>Costo contro valore.</b> Oggi ogni stagione è un titolo con una sola spunta (“Loki: Stagione 1”). Il valore dell\'episodio è reale solo per chi vede una stagione a metà e torna dopo giorni. I costi: (1) i dati degli episodi (numero per stagione) oggi non stanno nel catalogo: o si scrivono a mano per le 14 stagioni (nessuna dipendenza), o arrivano da TMDB (una chiamata per stagione, quota, errori di rete); (2) il formato dei progressi (<code>mcu-planner-v1</code>) passa da “visto sì/no” a un numero per stagione, con migrazione e sincronizzazione sul server; (3) più stati da testare e da annunciare; (4) il rischio spoiler se si mostrano i titoli degli episodi. <b>Verdetto: sì, in forma leggera</b>: un contatore per stagione senza titoli degli episodi (variante A). Quando il contatore arriva al totale la stagione risulta vista (conta nella percentuale); sotto, la stagione resta “in corso” e non conta. La variante C (elenco con titoli) non conviene.',
  vgrid(
   vcard('A','Contatore − / +',both('400px',box(stepper(3,6)),'In corso (3 di 6)'),'Dentro il corpo dell\'accordion del titolo: “Episodi visti  −  3 di 6  +”. Al totale la stagione si spunta da sola; “Segna tutti” scorciatoia.',['Non iniziata: 0 di N, − disabilitato','In corso: 3 di 6','Completa: N di N, stagione spuntata, + disabilitato','Errore di salvataggio: toast con Riprova (come oggi)'],['Una sola cifra per stagione: dati minimi','Nessun titolo di episodio, nessuno spoiler','Pulsanti da 44px, <code>aria-label</code> chiari'],['Per tornare indietro di tre episodi servono tre clic'],True),
   vcard('B','Numeri cliccabili 1…N',both('400px',box(chips(3,6)),'In corso (3 di 6)'),'Una riga di numeri-casella: toccare il 4 segna i primi 4 (progresso lineare). Stessa data della A.',['Non iniziata: nessun numero spuntato','In corso: 1-3 spuntati','Completa: tutti spuntati, stagione spuntata'],['Salto diretto a qualsiasi episodio','Si vede il progresso a colpo d\'occhio'],['Serie con molti episodi (fino a N): la riga va a capo su mobile','Il gesto “spunta il 4” segna anche 1-3: va spiegato']),
   vcard('C','Elenco con titoli',both('400px',box(elist(3,4)),'In corso (3 di 4)'),'Un elenco di episodi con titolo e spunta, uno per riga.',['Elenco completo per stagione','Caricamento dell\'elenco (scheletro) e errore (Riprova)'],['È il modello più completo'],['Servono i titoli da TMDB (rete, errori, 5 lingue)','Spoiler nei titoli degli episodi','Pagina molto più lunga: i 14 titoli di serie diventano 14 elenchi'])
  )+why('<b>Variante A.</b> Dà il valore principale (riprendere a metà stagione) con il costo minimo: un numero per stagione, nessuna dipendenza esterna e nessuno spoiler. B è un\'alternativa se si vuole il salto diretto; C costa troppo per quello che aggiunge.')
  +'<div class="dc-fl">Stati della variante A</div><div class="dc-row">'+fr('light','400px',box(stepper(0,6).replace('aria-label','aria-disabled="true" aria-label',1)),'Non iniziata')+fr('light','400px',box(stepper(6,6)),'Completa')+'</div>'
  +'<div class="dc-fl">Testi nelle 5 lingue</div>'+txt(E,done='N',total='N',n='N')
  +pd([['Spunta della serie','una sola spunta per stagione','contatore per stagione; completa = vista','TitleItem.tsx; useWatched.ts; catalog.ts (numero episodi)']])),
)
