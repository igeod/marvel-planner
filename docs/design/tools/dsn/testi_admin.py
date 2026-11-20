"""Testi nuovi o cambiati dell'Admin (voce 30), scritti con la skill scrittura-ux. `python testi_admin.py` scrive docs/design/TESTI_ADMIN.md.
Registro: it «tu», fr «vous» (come i file di oggi), es «tú», de «du». Pulsanti e etichette corti (fr e de più lunghi)."""
import os
L = ['it', 'en', 'fr', 'es', 'de']
T = {}


def add(key, nota, it, en, fr, es, de):
    T[key] = dict(nota=nota, **dict(zip(L, (it, en, fr, es, de))))


add('admin.summary.heading', 'nuova: titolo della scheda in testa', 'Da fare', 'To do', 'À faire', 'Pendiente', 'Zu erledigen')
add('admin.summary.candidates', 'nuova: riga di «Da fare» (il titolo lungo «Nuovi titoli su TMDB da valutare» resta nella coda)', 'Nuovi titoli da valutare', 'New titles to review', 'Nouveaux titres à évaluer', 'Títulos nuevos por valorar', 'Neue Titel zu prüfen')
add('admin.summary.dates', 'nuova: riga di «Da fare»', 'Date da controllare', 'Dates to check', 'Dates à vérifier', 'Fechas por revisar', 'Daten zu prüfen')
add('admin.summary.suggestions', 'nuova: riga di «Da fare»', 'Suggerimenti da leggere', 'Suggestions to read', 'Suggestions à lire', 'Sugerencias por leer', 'Vorschläge zu lesen')
add('admin.summary.none', 'nuova: testo per i lettori di schermo quando il numero è zero (visivamente c\'è la spunta)', 'Niente da fare', 'Nothing to do', 'Rien à faire', 'Nada pendiente', 'Nichts zu tun')
add('admin.todo.intro', 'riscritta: «Qui non si scrivono testi: copia il modello e compilalo nel codice» era oscura',
    'I contenuti si scrivono nel codice. Qui vedi cosa manca e copi il modello da compilare.',
    'Content is written in the code. Here you see what is missing and copy the template to fill in.',
    "Les contenus s'écrivent dans le code. Ici, vous voyez ce qui manque et copiez le modèle à compléter.",
    'Los contenidos se escriben en el código. Aquí ves qué falta y copias la plantilla para rellenar.',
    'Die Inhalte werden im Code geschrieben. Hier siehst du, was fehlt, und kopierst die Vorlage zum Ausfüllen.')
add('admin.candidates.unreliable.noToken', 'accorciata: il token mancante si dice una volta sola, nello Stato del sito',
    'Ricerca ferma: vedi lo Stato del sito.', 'Search stopped: see the site status.', "Recherche à l'arrêt : voir l'état du site.",
    'Búsqueda detenida: mira el estado del sitio.', 'Suche gestoppt: siehe Status der Website.')
add('footer.version', 'nuova (voce 29, piè di pagina)', 'Versione {version}', 'Version {version}', 'Version {version}', 'Versión {version}', 'Version {version}')


def run():
    md = ['# Testi nuovi o cambiati: Admin (voce 30) e piè di pagina (voce 29)', '',
          'Scritti da Design con la skill `scrittura-ux` (regole del progetto, glossario). Registro: it «tu», fr «vous» (come i file di oggi), es «tú», de «du». Etichette corte in tutte le lingue (fr e de più lunghi: il layout li regge). I testi dell\'Admin non sono legali: la regola 8 non vale; resta la rilettura del committente. **Copiali nei cinque file di lingua, non riscriverli.**', '']
    for k, v in T.items():
        md += [f'## `{k}`', '', f'*{v["nota"]}*', ''] + [f'- **{l}**: {v[l]}' for l in L] + ['']
    open(os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'TESTI_ADMIN.md')), 'w', encoding='utf-8').write('\n'.join(md))
    print('ok', len(T))


if __name__ == '__main__':
    run()
