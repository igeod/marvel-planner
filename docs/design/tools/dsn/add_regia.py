from addlib import *
_p={}; exec(open(f'{S}/dsn/p_planner.py').read().split('\nS=[]')[0],_p)
phone=_p['phone']
SYN='Il miliardario Tony Stark costruisce un’armatura per fuggire dai suoi rapitori e decide di usarla per proteggere gli altri.'
CAST=''.join(f'<li><span>{n}</span><small>{c}</small></li>' for n,c in [('Robert Downey Jr.','Tony Stark'),('Gwyneth Paltrow','Pepper Potts'),('Jeff Bridges','Obadiah Stane')])
CSSN='''<style>
.film__body{margin-top:0!important;padding-top:var(--sp-4)}
.film__cast-credit{display:none}
@media (max-width:39.9375em){
 .film__credit{display:none}
 .film__cast{margin-top:0;padding-top:var(--sp-5);border-top:1px solid var(--line)}
 .film__cast-credit{display:flex;flex-wrap:wrap;align-items:baseline;gap:0 var(--sp-2);margin:0 0 var(--sp-1)}
 .film__cast-credit .muted{font-size:var(--fs-label)}
 .film__cast-credit b{font-size:var(--fs-body);font-weight:700}
}
</style>'''
def scene(theme,new,syn=True,credit='Jon Favreau',cl=None,label=''):
    s=f'<section class="synopsis"><h2 class="visually-hidden">{L("details.synopsis")}</h2><p>{SYN if syn else L("details.noSynopsis")}</p></section>'
    cl=cl or L('details.director')
    cr=(f'<section class="film__credit"><h2>{cl}</h2>'+(f'<p>{credit}</p>' if credit else f'<p class="muted film__missing">{L("details.missing.director")}</p>')+'</section>')
    cc=(f'<p class="film__cast-credit">'+(f'<span class="muted">{cl}</span><b>{credit}</b>' if credit else f'<span class="muted film__missing">{L("details.missing.director")}</span>')+'</p>') if new else ''
    inner=(CSSN if new else '<style>.film__body{margin-top:0!important;padding-top:var(--sp-4)}</style>')+f'<div class="film"><div class="film__main"><section class="film__card"><div class="film__body"><div class="film__story">{s}{cr}</div><section class="film__cast"><h2>{L("details.cast")}</h2>{cc}<ul>{CAST}</ul></section></div></section></div></div>'
    return phone(inner,theme,500,390,label)
def grid(*c): return '<div class="dc-row" style="align-items:flex-start">'+''.join(c)+'</div>'
add('Pagina Film',
 block('Regia su mobile: una riga nel Cast',PROP,
  'Su mobile la sezione “Regia” occupa un titolo da 28px, due linee e due spazi da 24px per un solo nome. Decisione del 12 novembre: sotto i 40em (stessa soglia di oggi) la regia diventa una riga dentro il Cast, sotto il titolo; da 40em in su resta com’è.',
  grid(scene('light',False,label='Prima · mobile · chiaro'),scene('light',True,label='Dopo · mobile · chiaro'),scene('dark',True,label='Dopo · mobile · scuro'))
  +grid(scene('light',True,False,label='Dopo · senza sinossi'),scene('light',True,True,'',label='Dopo · regia mancante'),scene('light',True,True,'Jeff Pope',T('Ideata da','Created by','Créé par','Creada por','Entwickelt von')['it'],'Dopo · serie (“Ideata da”)'))
  +'<div class="dc-fl">Regole</div>'
  +ul(['<b>Forma:</b> etichetta (“Regia”, “Directed by”, “Ideata da”…) attenuata e nome in grassetto, sulla stessa riga, con il corpo del testo (nessuna misura propria: la prova qui sotto usa <code>--fs-label</code> per l’etichetta, il codice no); va a capo se il nome è lungo o ce ne sono più (nomi separati da virgola, come oggi).',
      '<b>Dove:</b> subito sotto “Cast”, prima dell’elenco. Tra sinossi e Cast resta una sola linea con <code>--sp-5</code> sopra e sotto, invece dei due blocchi da <code>--sp-6</code>.',
      '<b>Etichetta:</b> si riusano le chiavi di oggi (<code>details.director</code> o <code>details.creator</code>, la stessa logica di TitleDetailsPanel.tsx r.43-46): nessuna chiave nuova. In inglese “Directed by Jon Favreau”, in italiano “Regia Jon Favreau”.',
      '<b>Regia mancante:</b> la riga mostra solo <code>details.missing.director</code> (“Regia non disponibile.”) in tono attenuato, senza ripetere l’etichetta.',
      '<b>Accessibilità:</b> su mobile la sezione “Regia” (con il suo <code>h2</code>) è <code>display: none</code>, quindi non viene letta due volte; la riga nel Cast è un <code>p</code> con etichetta e nome. Da 40em il contrario.',
      '<b>Implementazione:</b> la riga si rende sempre nel markup dentro <code>.film__cast</code> (<code>.film__cast-credit</code>, nascosta da 40em in su); <code>.film__credit</code> si nasconde sotto 40em. Nessuna logica in JavaScript.'])
  +pd([['Regia su mobile','sezione con titolo 28px, linea e padding 24px sopra e sotto','una riga “Regia Nome” dentro il Cast','TitleDetailsPanel.tsx r.43-46, r.99-112; TitleDetailsPanel.less r.193-229'],['Spazio sinossi → Cast','24px + linea + 24px per la regia, poi altri 24px + linea + 24px per il Cast','una linea con 20px sopra e sotto','TitleDetailsPanel.less r.214-221']],sub='Per ogni voce: com’è su main c520ab1 (prima), che cosa decide questa pagina (dopo), file.')))
