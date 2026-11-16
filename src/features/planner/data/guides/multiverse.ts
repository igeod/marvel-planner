import {
  essential,
  external,
  guide,
  localized as l,
  optional,
  recommended,
  type TitleGuide,
} from "./types";

const SAME_SERIES = l(
  "The story continues directly from the previous season.",
  "La storia continua direttamente dalla stagione precedente.",
  "L'histoire continue directement depuis la saison précédente.",
  "La historia continúa directamente desde la temporada anterior.",
  "Die Geschichte setzt direkt an die vorherige Staffel an.",
);

export const MULTIVERSE_GUIDES: Record<string, TitleGuide> = {
  "i-wandavision": guide([
    essential(
      "i-avengers-age-of-ultron",
      l(
        "How Wanda and Vision met.",
        "Come si sono conosciuti Wanda e Visione.",
        "Comment Wanda et Vision se sont rencontrés.",
        "Cómo se conocieron Wanda y Visión.",
        "Wie sich Wanda und Vision kennenlernten.",
      ),
    ),
    essential(
      "i-avengers-infinity-war",
      l(
        "Vision's death and Wanda's loss.",
        "La morte di Visione e la perdita di Wanda.",
        "La mort de Vision et la perte de Wanda.",
        "La muerte de Visión y la pérdida de Wanda.",
        "Visions Tod und Wandas Verlust.",
      ),
    ),
    essential(
      "i-avengers-endgame",
      l(
        "The series takes place right after the film.",
        "La serie si svolge subito dopo il film.",
        "La série se déroule juste après le film.",
        "La serie transcurre justo después de la película.",
        "Die Serie spielt direkt nach dem Film.",
      ),
    ),
    recommended(
      "i-captain-marvel",
      l(
        "Monica Rambeau's mother was Carol's friend.",
        "La madre di Monica Rambeau era un'amica di Carol.",
        "La mère de Monica Rambeau était l'amie de Carol.",
        "La madre de Monica Rambeau era amiga de Carol.",
        "Monica Rambeaus Mutter war Carols Freundin.",
      ),
    ),
  ]),

  "i-the-falcon-and-the-winter-soldier": guide([
    essential(
      "i-avengers-endgame",
      l(
        "Steve gives his shield to Sam.",
        "Steve consegna lo scudo a Sam.",
        "Steve donne son bouclier à Sam.",
        "Steve entrega su escudo a Sam.",
        "Steve übergibt Sam seinen Schild.",
      ),
    ),
    essential(
      "i-captain-america-civil-war",
      l(
        "Sam and Bucky's conflict with Steve, and Zemo.",
        "Il conflitto di Sam e Bucky con Steve, e Zemo.",
        "Le conflit de Sam et Bucky avec Steve, et Zemo.",
        "El conflicto de Sam y Bucky con Steve, y Zemo.",
        "Der Konflikt von Sam und Bucky mit Steve, und Zemo.",
      ),
    ),
    essential(
      "i-captain-america-the-winter-soldier",
      l(
        "Where Sam, Bucky and Sharon Carter first appear.",
        "Dove compaiono per la prima volta Sam, Bucky e Sharon Carter.",
        "Où apparaissent pour la première fois Sam, Bucky et Sharon Carter.",
        "Donde aparecen por primera vez Sam, Bucky y Sharon Carter.",
        "Wo Sam, Bucky und Sharon Carter zum ersten Mal auftreten.",
      ),
    ),
    recommended(
      "i-captain-america-the-first-avenger",
      l(
        "Steve and Bucky's shared past.",
        "Il passato in comune di Steve e Bucky.",
        "Le passé commun de Steve et Bucky.",
        "El pasado compartido de Steve y Bucky.",
        "Die gemeinsame Vergangenheit von Steve und Bucky.",
      ),
    ),
    optional(
      "i-black-panther",
      l(
        "Bucky's treatment in Wakanda and the Dora Milaje.",
        "La cura di Bucky in Wakanda e le Dora Milaje.",
        "Le traitement de Bucky au Wakanda et les Dora Milaje.",
        "El tratamiento de Bucky en Wakanda y las Dora Milaje.",
        "Buckys Behandlung in Wakanda und die Dora Milaje.",
      ),
    ),
  ]),

  "i-loki-stagione-1": guide([
    essential(
      "i-the-avengers",
      l(
        "Loki's story with the Tesseract begins there.",
        "La storia di Loki con il Tesseract comincia lì.",
        "L'histoire de Loki avec le Tesseract commence là.",
        "La historia de Loki con el Teseracto empieza allí.",
        "Lokis Geschichte mit dem Tesserakt beginnt dort.",
      ),
    ),
    essential(
      "i-avengers-endgame",
      l(
        "The time heist creates the Loki of the series.",
        "Il furto temporale crea il Loki della serie.",
        "Le casse temporel crée le Loki de la série.",
        "El atraco temporal crea al Loki de la serie.",
        "Der Zeitraub erschafft den Loki der Serie.",
      ),
    ),
    recommended(
      "i-thor-the-dark-world",
      l(
        "Loki's bond with Thor and Frigga.",
        "Il legame di Loki con Thor e Frigga.",
        "Le lien de Loki avec Thor et Frigga.",
        "El vínculo de Loki con Thor y Frigga.",
        "Lokis Bindung zu Thor und Frigga.",
      ),
    ),
    recommended(
      "i-thor-ragnarok",
      l(
        "Loki's most recent story before the Blip.",
        "L'ultima storia di Loki prima dello Schiocco.",
        "La dernière histoire de Loki avant le Blip.",
        "La última historia de Loki antes del Chasquido.",
        "Lokis jüngste Geschichte vor dem Blip.",
      ),
    ),
  ]),

  "i-black-widow": guide([
    essential(
      "i-captain-america-civil-war",
      l(
        "Natasha's situation right before the film.",
        "La situazione di Natasha subito prima del film.",
        "La situation de Natasha juste avant le film.",
        "La situación de Natasha justo antes de la película.",
        "Natashas Lage direkt vor dem Film.",
      ),
    ),
    recommended(
      "i-the-avengers",
      l(
        "Natasha's role in the team.",
        "Il ruolo di Natasha nella squadra.",
        "Le rôle de Natasha dans l'équipe.",
        "El papel de Natasha en el equipo.",
        "Natashas Rolle im Team.",
      ),
    ),
    recommended(
      "i-avengers-endgame",
      l(
        "The final scene is set after Natasha's fate.",
        "La scena finale è ambientata dopo il destino di Natasha.",
        "La scène finale se situe après le destin de Natasha.",
        "La escena final transcurre después del destino de Natasha.",
        "Die Schlussszene spielt nach Natashas Schicksal.",
      ),
    ),
  ]),

  "i-what-if-stagione-1": guide([
    recommended(
      "i-captain-america-the-first-avenger",
      l(
        "Several episodes retell its events in an alternate version.",
        "Diversi episodi rielaborano i suoi eventi in una versione alternativa.",
        "Plusieurs épisodes réinventent ses événements dans une version alternative.",
        "Varios episodios reinterpretan sus hechos en una versión alternativa.",
        "Mehrere Folgen erzählen seine Ereignisse in einer alternativen Version.",
      ),
    ),
    recommended(
      "i-the-avengers",
      l(
        "The team and the Tesseract, retold from another angle.",
        "La squadra e il Tesseract, raccontati da un'altra prospettiva.",
        "L'équipe et le Tesseract, racontés sous un autre angle.",
        "El equipo y el Teseracto, contados desde otro ángulo.",
        "Das Team und der Tesserakt, aus einem anderen Blickwinkel erzählt.",
      ),
    ),
    recommended(
      "i-doctor-strange",
      l(
        "Strange's alternate story depends on his original one.",
        "La storia alternativa di Strange dipende da quella originale.",
        "L'histoire alternative de Strange dépend de l'originale.",
        "La historia alternativa de Strange depende de la original.",
        "Stranges alternative Geschichte hängt von der ursprünglichen ab.",
      ),
    ),
    recommended(
      "i-avengers-infinity-war",
      l(
        "Thanos and the Infinity Stones.",
        "Thanos e le Gemme dell'Infinito.",
        "Thanos et les Pierres d'Infinité.",
        "Thanos y las Gemas del Infinito.",
        "Thanos und die Infinity-Steine.",
      ),
    ),
    recommended(
      "i-avengers-endgame",
      l(
        "The finale plays with the ending of the saga.",
        "Il finale gioca con la conclusione della saga.",
        "Le final joue avec la conclusion de la saga.",
        "El final juega con la conclusión de la saga.",
        "Das Finale spielt mit dem Ende der Saga.",
      ),
    ),
    optional(
      "i-black-panther",
      l(
        "T'Challa stars in one of the first episodes.",
        "T'Challa è il protagonista di uno dei primi episodi.",
        "T'Challa est le héros d'un des premiers épisodes.",
        "T'Challa es el protagonista de uno de los primeros episodios.",
        "T'Challa ist der Held einer der ersten Folgen.",
      ),
    ),
    optional(
      "i-thor",
      l(
        "Thor's alternate version has a central role.",
        "La versione alternativa di Thor ha un ruolo centrale.",
        "La version alternative de Thor joue un rôle central.",
        "La versión alternativa de Thor tiene un papel central.",
        "Die alternative Version von Thor spielt eine zentrale Rolle.",
      ),
    ),
  ]),

  "i-shang-chi-and-the-legend-of-the-ten-rings": guide([
    recommended(
      "i-iron-man",
      l(
        "The Ten Rings organization was introduced there.",
        "L'organizzazione dei Dieci Anelli è stata introdotta lì.",
        "L'organisation des Dix Anneaux y a été présentée.",
        "La organización de los Diez Anillos se presentó allí.",
        "Die Organisation der Zehn Ringe wurde dort eingeführt.",
      ),
    ),
    recommended(
      "i-avengers-endgame",
      l(
        "The Blip and the world after it.",
        "Lo Schiocco e il mondo che ne è seguito.",
        "Le Blip et le monde qui en a découlé.",
        "El Chasquido y el mundo que dejó.",
        "Der Blip und die Welt danach.",
      ),
    ),
    recommended(
      "i-doctor-strange",
      l(
        "Wong, who appears here, is introduced there.",
        "Wong, che compare qui, è presentato lì.",
        "Wong, qui apparaît ici, y est présenté.",
        "Wong, que aparece aquí, se presenta allí.",
        "Wong, der hier auftritt, wird dort vorgestellt.",
      ),
    ),
    optional(
      "i-the-incredible-hulk",
      l(
        "The Abomination (Emil Blonsky) comes back.",
        "L'Abominio (Emil Blonsky) ritorna.",
        "L'Abomination (Emil Blonsky) revient.",
        "La Abominación (Emil Blonsky) regresa.",
        "Die Abomination (Emil Blonsky) kehrt zurück.",
      ),
    ),
  ]),

  "i-eternals": guide([
    essential(
      "i-avengers-endgame",
      l(
        "The Blip changes the Eternals' story.",
        "Lo Schiocco cambia la storia degli Eterni.",
        "Le Blip change l'histoire des Éternels.",
        "El Chasquido cambia la historia de los Eternos.",
        "Der Blip verändert die Geschichte der Eternals.",
      ),
    ),
    recommended(
      "i-avengers-infinity-war",
      l(
        "Thanos and the Snap are central to the Eternals' mission.",
        "Thanos e lo Schiocco sono centrali per la missione degli Eterni.",
        "Thanos et le Snap sont centraux dans la mission des Éternels.",
        "Thanos y el Chasquido son centrales en la misión de los Eternos.",
        "Thanos und der Snap sind zentral für die Mission der Eternals.",
      ),
    ),
  ]),

  "i-hawkeye": guide([
    essential(
      "i-avengers-endgame",
      l(
        "Clint's losses during the Blip and with Natasha.",
        "Le perdite di Clint durante lo Schiocco e con Natasha.",
        "Les pertes de Clint pendant le Blip et avec Natasha.",
        "Las pérdidas de Clint durante el Chasquido y con Natasha.",
        "Clints Verluste während des Blips und mit Natasha.",
      ),
    ),
    recommended(
      "i-the-avengers",
      l(
        "Clint's history with the Avengers.",
        "La storia di Clint con i Vendicatori.",
        "L'histoire de Clint avec les Avengers.",
        "La historia de Clint con los Vengadores.",
        "Clints Geschichte mit den Avengers.",
      ),
    ),
    recommended(
      "i-black-widow",
      l(
        "Introduces Yelena, who has a major role.",
        "Introduce Yelena, che ha un ruolo importante.",
        "Présente Yelena, qui a un rôle important.",
        "Presenta a Yelena, que tiene un papel importante.",
        "Führt Yelena ein, die eine wichtige Rolle spielt.",
      ),
    ),
    optional(
      "i-avengers-age-of-ultron",
      l(
        "Shows Clint's family and the farm.",
        "Mostra la famiglia di Clint e la fattoria.",
        "Montre la famille de Clint et la ferme.",
        "Muestra a la familia de Clint y la granja.",
        "Zeigt Clints Familie und die Farm.",
      ),
    ),
  ]),

  "i-spider-man-no-way-home": guide(
    [
      essential(
        "i-spider-man-far-from-home",
        l(
          "Mysterio reveals Peter's identity.",
          "Mysterio rivela l'identità di Peter.",
          "Mysterio révèle l'identité de Peter.",
          "Mysterio revela la identidad de Peter.",
          "Mysterio enthüllt Peters Identität.",
        ),
      ),
      essential(
        "i-doctor-strange",
        l(
          "Strange's magic triggers the multiverse crisis.",
          "La magia di Strange scatena la crisi del multiverso.",
          "La magie de Strange déclenche la crise du multivers.",
          "La magia de Strange desencadena la crisis del multiverso.",
          "Stranges Magie löst die Multiversum-Krise aus.",
        ),
      ),
      recommended(
        "i-spider-man-homecoming",
        l(
          "Peter's journey, and his friends.",
          "Il percorso di Peter, e i suoi amici.",
          "Le parcours de Peter, et ses amis.",
          "El recorrido de Peter, y sus amigos.",
          "Peters Weg und seine Freunde.",
        ),
      ),
      recommended(
        "i-avengers-endgame",
        l(
          "Tony's absence weighs on Peter.",
          "L'assenza di Tony pesa su Peter.",
          "L'absence de Tony pèse sur Peter.",
          "La ausencia de Tony pesa sobre Peter.",
          "Tonys Abwesenheit lastet auf Peter.",
        ),
      ),
    ],
    [
      external(
        "recommended",
        "Spider-Man trilogy (2002–2007)",
        l(
          "Many of its villains and cameos come from these films.",
          "Molti suoi nemici e cameo vengono da questi film.",
          "Beaucoup de ses méchants et caméos viennent de ces films.",
          "Muchos de sus villanos y cameos proceden de estas películas.",
          "Viele seiner Schurken und Gastauftritte stammen aus diesen Filmen.",
        ),
      ),
      external(
        "recommended",
        "The Amazing Spider-Man (2012–2014)",
        l(
          "Many of its villains and cameos come from these films.",
          "Molti suoi nemici e cameo vengono da questi film.",
          "Beaucoup de ses méchants et caméos viennent de ces films.",
          "Muchos de sus villanos y cameos proceden de estas películas.",
          "Viele seiner Schurken und Gastauftritte stammen aus diesen Filmen.",
        ),
      ),
    ],
  ),

  "i-moon-knight": guide([]),

  "i-doctor-strange-in-the-multiverse-of-madness": guide([
    essential(
      "i-wandavision",
      l(
        "Wanda's story continues here.",
        "La storia di Wanda continua qui.",
        "L'histoire de Wanda continue ici.",
        "La historia de Wanda continúa aquí.",
        "Wandas Geschichte geht hier weiter.",
      ),
    ),
    essential(
      "i-doctor-strange",
      l(
        "Strange's origin and his friends.",
        "L'origine di Strange e i suoi amici.",
        "L'origine de Strange et ses amis.",
        "El origen de Strange y sus amigos.",
        "Stranges Ursprung und seine Freunde.",
      ),
    ),
    recommended(
      "i-spider-man-no-way-home",
      l(
        "The multiverse opens and Strange's role in it.",
        "Il multiverso si apre e il ruolo di Strange.",
        "Le multivers s'ouvre et le rôle de Strange.",
        "El multiverso se abre y el papel de Strange.",
        "Das Multiversum öffnet sich und Stranges Rolle darin.",
      ),
    ),
    recommended(
      "i-what-if-stagione-1",
      l(
        "Introduces an alternate Strange and the idea of parallel worlds.",
        "Introduce uno Strange alternativo e l'idea dei mondi paralleli.",
        "Présente un Strange alternatif et l'idée des mondes parallèles.",
        "Presenta a un Strange alternativo y la idea de mundos paralelos.",
        "Führt einen alternativen Strange und die Idee paralleler Welten ein.",
      ),
    ),
    recommended(
      "i-loki-stagione-1",
      l(
        "The multiverse is explained for the first time there.",
        "Il multiverso viene spiegato per la prima volta lì.",
        "Le multivers y est expliqué pour la première fois.",
        "El multiverso se explica por primera vez allí.",
        "Das Multiversum wird dort zum ersten Mal erklärt.",
      ),
    ),
  ]),

  "i-ms-marvel": guide([
    recommended(
      "i-captain-marvel",
      l(
        "Kamala idolizes Carol Danvers.",
        "Kamala ammira Carol Danvers.",
        "Kamala admire Carol Danvers.",
        "Kamala admira a Carol Danvers.",
        "Kamala bewundert Carol Danvers.",
      ),
    ),
    recommended(
      "i-avengers-endgame",
      l(
        "The world of the Avengers after the Blip.",
        "Il mondo dei Vendicatori dopo lo Schiocco.",
        "Le monde des Avengers après le Blip.",
        "El mundo de los Vengadores tras el Chasquido.",
        "Die Welt der Avengers nach dem Blip.",
      ),
    ),
  ]),

  "i-thor-love-and-thunder": guide([
    essential(
      "i-thor-ragnarok",
      l(
        "Thor's direction and Valkyrie's role.",
        "La direzione di Thor e il ruolo di Valchiria.",
        "L'orientation de Thor et le rôle de Valkyrie.",
        "El rumbo de Thor y el papel de Valquiria.",
        "Thors Richtung und Walkyries Rolle.",
      ),
    ),
    essential(
      "i-avengers-endgame",
      l(
        "Thor's journey with the Guardians and his state of mind.",
        "Il viaggio di Thor con i Guardiani e il suo stato d'animo.",
        "Le voyage de Thor avec les Gardiens et son état d'esprit.",
        "El viaje de Thor con los Guardianes y su estado de ánimo.",
        "Thors Reise mit den Guardians und seine Verfassung.",
      ),
    ),
    recommended(
      "i-thor-the-dark-world",
      l(
        "Jane Foster's story with Thor.",
        "La storia di Jane Foster con Thor.",
        "L'histoire de Jane Foster avec Thor.",
        "La historia de Jane Foster con Thor.",
        "Jane Fosters Geschichte mit Thor.",
      ),
    ),
    recommended(
      "i-guardians-of-the-galaxy",
      l(
        "The Guardians appear in the film.",
        "I Guardiani compaiono nel film.",
        "Les Gardiens apparaissent dans le film.",
        "Los Guardianes aparecen en la película.",
        "Die Guardians treten im Film auf.",
      ),
    ),
    optional(
      "i-thor",
      l(
        "Thor's origin and Mjolnir.",
        "L'origine di Thor e Mjolnir.",
        "L'origine de Thor et Mjolnir.",
        "El origen de Thor y Mjolnir.",
        "Thors Ursprung und Mjolnir.",
      ),
    ),
  ]),

  "i-i-am-groot-stagione-1": guide([
    recommended(
      "i-guardians-of-the-galaxy-vol-2",
      l(
        "Baby Groot appears for the first time there.",
        "Baby Groot compare lì per la prima volta.",
        "Bébé Groot y apparaît pour la première fois.",
        "Baby Groot aparece allí por primera vez.",
        "Baby Groot tritt dort zum ersten Mal auf.",
      ),
    ),
  ]),

  "i-she-hulk-attorney-at-law": guide([
    essential(
      "i-avengers-endgame",
      l(
        "Bruce's evolution as Smart Hulk and the origin of Jen's powers.",
        "L'evoluzione di Bruce come Smart Hulk e l'origine dei poteri di Jen.",
        "L'évolution de Bruce en Smart Hulk et l'origine des pouvoirs de Jen.",
        "La evolución de Bruce como Smart Hulk y el origen de los poderes de Jen.",
        "Bruces Entwicklung zum Smart Hulk und der Ursprung von Jens Kräften.",
      ),
    ),
    recommended(
      "i-the-incredible-hulk",
      l(
        "The Abomination returns.",
        "L'Abominio ritorna.",
        "L'Abomination revient.",
        "La Abominación regresa.",
        "Die Abomination kehrt zurück.",
      ),
    ),
    recommended(
      "i-thor-ragnarok",
      l(
        "Hulk's earlier adventure and his acceptance of himself.",
        "L'avventura precedente di Hulk e la sua accettazione di sé.",
        "L'aventure précédente de Hulk et son acceptation de lui-même.",
        "La aventura anterior de Hulk y su aceptación de sí mismo.",
        "Hulks frühere Abenteuer und seine Selbstannahme.",
      ),
    ),
    optional(
      "i-shang-chi-and-the-legend-of-the-ten-rings",
      l(
        "Wong and the Abomination's recent appearance.",
        "Wong e la recente apparizione dell'Abominio.",
        "Wong et la récente apparition de l'Abomination.",
        "Wong y la reciente aparición de la Abominación.",
        "Wong und der jüngste Auftritt der Abomination.",
      ),
    ),
  ]),

  "i-werewolf-by-night": guide([]),

  "i-black-panther-wakanda-forever": guide([
    essential(
      "i-black-panther",
      l(
        "T'Challa, Shuri and Wakanda.",
        "T'Challa, Shuri e il Wakanda.",
        "T'Challa, Shuri et le Wakanda.",
        "T'Challa, Shuri y Wakanda.",
        "T'Challa, Shuri und Wakanda.",
      ),
    ),
    recommended(
      "i-avengers-infinity-war",
      l(
        "The Battle of Wakanda.",
        "La battaglia del Wakanda.",
        "La bataille du Wakanda.",
        "La batalla de Wakanda.",
        "Die Schlacht um Wakanda.",
      ),
    ),
    recommended(
      "i-avengers-endgame",
      l(
        "The Blip and how the world recovered.",
        "Lo Schiocco e come si è ripreso il mondo.",
        "Le Blip et la façon dont le monde s'est remis.",
        "El Chasquido y cómo se recuperó el mundo.",
        "Der Blip und wie sich die Welt erholt hat.",
      ),
    ),
    optional(
      "i-captain-america-civil-war",
      l(
        "T'Challa's first appearance.",
        "La prima apparizione di T'Challa.",
        "La première apparition de T'Challa.",
        "La primera aparición de T'Challa.",
        "T'Challas erster Auftritt.",
      ),
    ),
  ]),

  "i-the-guardians-of-the-galaxy-holiday-special": guide([
    recommended(
      "i-guardians-of-the-galaxy",
      l(
        "The team and its characters.",
        "La squadra e i suoi personaggi.",
        "L'équipe et ses personnages.",
        "El equipo y sus personajes.",
        "Das Team und seine Figuren.",
      ),
    ),
    recommended(
      "i-guardians-of-the-galaxy-vol-2",
      l(
        "Mantis and Drax's story and their bond.",
        "La storia di Mantis e Drax e il loro legame.",
        "L'histoire de Mantis et Drax et leur lien.",
        "La historia de Mantis y Drax y su vínculo.",
        "Die Geschichte von Mantis und Drax und ihre Bindung.",
      ),
    ),
    recommended(
      "i-thor-love-and-thunder",
      l(
        "The Guardians' most recent appearance before the special.",
        "L'ultima apparizione dei Guardiani prima dello speciale.",
        "La dernière apparition des Gardiens avant le spécial.",
        "La última aparición de los Guardianes antes del especial.",
        "Der jüngste Auftritt der Guardians vor dem Special.",
      ),
    ),
  ]),

  "i-ant-man-and-the-wasp-quantumania": guide([
    essential(
      "i-ant-man-and-the-wasp",
      l(
        "The Quantum Realm plans and the Pym family.",
        "I piani sul Regno Quantico e la famiglia Pym.",
        "Les plans sur le Royaume quantique et la famille Pym.",
        "Los planes sobre el Reino Cuántico y la familia Pym.",
        "Die Pläne zum Quantenreich und die Familie Pym.",
      ),
    ),
    recommended(
      "i-loki-stagione-1",
      l(
        "Kang the Conqueror is introduced there.",
        "Kang il Conquistatore viene introdotto lì.",
        "Kang le Conquérant y est présenté.",
        "Kang el Conquistador se presenta allí.",
        "Kang der Eroberer wird dort eingeführt.",
      ),
    ),
    recommended(
      "i-avengers-endgame",
      l(
        "Scott's life after the Blip.",
        "La vita di Scott dopo lo Schiocco.",
        "La vie de Scott après le Blip.",
        "La vida de Scott tras el Chasquido.",
        "Scotts Leben nach dem Blip.",
      ),
    ),
    optional(
      "i-ant-man",
      l(
        "Scott Lang's origin.",
        "L'origine di Scott Lang.",
        "L'origine de Scott Lang.",
        "El origen de Scott Lang.",
        "Scott Langs Ursprung.",
      ),
    ),
  ]),

  "i-guardians-of-the-galaxy-vol-3": guide([
    essential(
      "i-guardians-of-the-galaxy",
      l(
        "The team and its first mission.",
        "La squadra e la sua prima missione.",
        "L'équipe et sa première mission.",
        "El equipo y su primera misión.",
        "Das Team und seine erste Mission.",
      ),
    ),
    essential(
      "i-guardians-of-the-galaxy-vol-2",
      l(
        "Rocket, Yondu and Nebula's growth.",
        "Rocket, Yondu e la crescita di Nebula.",
        "Rocket, Yondu et l'évolution de Nebula.",
        "Rocket, Yondu y el crecimiento de Nebula.",
        "Rocket, Yondu und Nebulas Entwicklung.",
      ),
    ),
    essential(
      "i-avengers-endgame",
      l(
        "An alternate Gamora from the time heist arrives here.",
        "Una Gamora alternativa dal furto temporale arriva qui.",
        "Une Gamora alternative issue du casse temporel arrive ici.",
        "Una Gamora alternativa del atraco temporal llega aquí.",
        "Eine alternative Gamora aus dem Zeitraub kommt hier an.",
      ),
    ),
    recommended(
      "i-avengers-infinity-war",
      l(
        "Gamora's fate and Peter's grief.",
        "Il destino di Gamora e il dolore di Peter.",
        "Le sort de Gamora et le chagrin de Peter.",
        "El destino de Gamora y el dolor de Peter.",
        "Gamoras Schicksal und Peters Trauer.",
      ),
    ),
    recommended(
      "i-the-guardians-of-the-galaxy-holiday-special",
      l(
        "Mantis and Quill's relationship.",
        "Il rapporto tra Mantis e Quill.",
        "La relation entre Mantis et Quill.",
        "La relación entre Mantis y Quill.",
        "Die Beziehung zwischen Mantis und Quill.",
      ),
    ),
    optional(
      "i-thor-love-and-thunder",
      l(
        "The Guardians' latest team-up with Thor.",
        "L'ultima collaborazione dei Guardiani con Thor.",
        "La dernière collaboration des Gardiens avec Thor.",
        "La última colaboración de los Guardianes con Thor.",
        "Die jüngste Zusammenarbeit der Guardians mit Thor.",
      ),
    ),
  ]),

  "i-secret-invasion": guide([
    essential(
      "i-captain-marvel",
      l(
        "Introduces the Skrulls and Talos.",
        "Introduce gli Skrull e Talos.",
        "Présente les Skrulls et Talos.",
        "Presenta a los Skrulls y a Talos.",
        "Führt die Skrulls und Talos ein.",
      ),
    ),
    essential(
      "i-avengers-endgame",
      l(
        "Fury's situation after the Blip.",
        "La situazione di Fury dopo lo Schiocco.",
        "La situation de Fury après le Blip.",
        "La situación de Fury tras el Chasquido.",
        "Furys Lage nach dem Blip.",
      ),
    ),
    recommended(
      "i-spider-man-far-from-home",
      l(
        "Talos appears there disguised as Fury.",
        "Talos compare lì travestito da Fury.",
        "Talos y apparaît déguisé en Fury.",
        "Talos aparece allí disfrazado de Fury.",
        "Talos tritt dort als Fury verkleidet auf.",
      ),
    ),
    recommended(
      "i-captain-america-the-winter-soldier",
      l(
        "Fury's past with S.H.I.E.L.D.",
        "Il passato di Fury nello S.H.I.E.L.D.",
        "Le passé de Fury au S.H.I.E.L.D.",
        "El pasado de Fury en S.H.I.E.L.D.",
        "Furys Vergangenheit bei S.H.I.E.L.D.",
      ),
    ),
  ]),

  "i-loki-stagione-2": guide([
    essential("i-loki-stagione-1", SAME_SERIES),
    recommended(
      "i-ant-man-and-the-wasp-quantumania",
      l(
        "Kang's role in the multiverse.",
        "Il ruolo di Kang nel multiverso.",
        "Le rôle de Kang dans le multivers.",
        "El papel de Kang en el multiverso.",
        "Kangs Rolle im Multiversum.",
      ),
    ),
  ]),

  "i-the-marvels": guide([
    essential(
      "i-captain-marvel",
      l(
        "Carol Danvers' story and powers.",
        "La storia e i poteri di Carol Danvers.",
        "L'histoire et les pouvoirs de Carol Danvers.",
        "La historia y los poderes de Carol Danvers.",
        "Carol Danvers' Geschichte und Kräfte.",
      ),
    ),
    essential(
      "i-wandavision",
      l(
        "Monica Rambeau's powers originate there.",
        "I poteri di Monica Rambeau nascono lì.",
        "Les pouvoirs de Monica Rambeau y naissent.",
        "Los poderes de Monica Rambeau nacen allí.",
        "Monica Rambeaus Kräfte entstehen dort.",
      ),
    ),
    essential(
      "i-ms-marvel",
      l(
        "Kamala Khan's powers and background.",
        "I poteri e la storia di Kamala Khan.",
        "Les pouvoirs et l'histoire de Kamala Khan.",
        "Los poderes y la historia de Kamala Khan.",
        "Kamala Khans Kräfte und Hintergrund.",
      ),
    ),
    recommended(
      "i-secret-invasion",
      l(
        "Fury and the Skrulls' recent story.",
        "La storia recente di Fury e degli Skrull.",
        "L'histoire récente de Fury et des Skrulls.",
        "La historia reciente de Fury y los Skrulls.",
        "Die jüngste Geschichte von Fury und den Skrulls.",
      ),
    ),
  ]),

  "i-what-if-stagione-2": guide([
    essential(
      "i-what-if-stagione-1",
      l(
        "Same format, with the Watcher and recurring characters.",
        "Stesso formato, con l'Osservatore e i personaggi ricorrenti.",
        "Même format, avec l'Observateur et des personnages récurrents.",
        "Mismo formato, con el Vigilante y personajes recurrentes.",
        "Gleiches Format, mit dem Beobachter und wiederkehrenden Figuren.",
      ),
    ),
  ]),

  "i-i-am-groot-stagione-2": guide([
    recommended(
      "i-i-am-groot-stagione-1",
      l(
        "Same characters and tone.",
        "Stessi personaggi e stesso tono.",
        "Mêmes personnages et même ton.",
        "Mismos personajes y mismo tono.",
        "Gleiche Figuren und gleicher Ton.",
      ),
    ),
  ]),

  "i-echo": guide(
    [
      essential(
        "i-hawkeye",
        l(
          "Maya Lopez and Kingpin first appear there.",
          "Maya Lopez e Kingpin compaiono lì per la prima volta.",
          "Maya Lopez et Kingpin y apparaissent pour la première fois.",
          "Maya Lopez y Kingpin aparecen allí por primera vez.",
          "Maya Lopez und Kingpin treten dort zum ersten Mal auf.",
        ),
      ),
    ],
    [
      external(
        "optional",
        "Daredevil (Netflix, 2015–2018)",
        l(
          "It shows Kingpin’s past.",
          "Mostra il passato di Kingpin.",
          "Elle montre le passé de Kingpin.",
          "Muestra el pasado de Kingpin.",
          "Sie zeigt Kingpins Vergangenheit.",
        ),
      ),
    ],
  ),

  "i-x-men-97-stagione-1": guide(
    [],
    [
      external(
        "recommended",
        "X-Men: The Animated Series (1992–1997)",
        l(
          "This series continues it directly.",
          "Questa serie ne è il seguito diretto.",
          "Cette série en est la suite directe.",
          "Esta serie es su continuación directa.",
          "Diese Serie setzt sie direkt fort.",
        ),
      ),
    ],
  ),

  "i-deadpool-wolverine": guide(
    [
      recommended(
        "i-loki-stagione-1",
        l(
          "The TVA and its rules.",
          "La TVA e le sue regole.",
          "La TVA et ses règles.",
          "La TVA y sus reglas.",
          "Die TVA und ihre Regeln.",
        ),
      ),
      recommended(
        "i-loki-stagione-2",
        l(
          "The TVA after the multiverse event.",
          "La TVA dopo l'evento del multiverso.",
          "La TVA après l'événement du multivers.",
          "La TVA tras el evento del multiverso.",
          "Die TVA nach dem Multiversum-Ereignis.",
        ),
      ),
    ],
    [
      external(
        "recommended",
        "Deadpool (2016)",
        l(
          "The character’s story and relationships.",
          "La storia del personaggio e le sue relazioni.",
          "L’histoire du personnage et ses relations.",
          "La historia del personaje y sus relaciones.",
          "Die Geschichte der Figur und ihre Beziehungen.",
        ),
      ),
      external(
        "recommended",
        "Deadpool 2 (2018)",
        l(
          "Its time-travel ideas lead straight into this film.",
          "Le sue idee sui viaggi nel tempo portano dritte a questo film.",
          "Ses idées de voyage dans le temps mènent droit à ce film.",
          "Sus ideas de viajes en el tiempo llevan directas a esta película.",
          "Seine Zeitreise-Ideen führen direkt zu diesem Film.",
        ),
      ),
      external(
        "recommended",
        "Logan (2017)",
        l(
          "This film plays with its ending.",
          "Questo film gioca con il suo finale.",
          "Ce film joue avec sa fin.",
          "Esta película juega con su final.",
          "Dieser Film spielt mit seinem Ende.",
        ),
      ),
      external(
        "recommended",
        "X-Men Origins: Wolverine (2009)",
        l(
          "Where this version of Deadpool first appeared.",
          "Dove compare per la prima volta questa versione di Deadpool.",
          "Là où cette version de Deadpool apparaît pour la première fois.",
          "Donde aparece por primera vez esta versión de Deadpool.",
          "Dort tritt diese Version von Deadpool zum ersten Mal auf.",
        ),
      ),
      external(
        "optional",
        "X-Men films (2000–2014)",
        l(
          "The film pokes fun at them.",
          "Il film li prende in giro.",
          "Le film s’en moque.",
          "La película se burla de ellos.",
          "Der Film macht sich darüber lustig.",
        ),
      ),
    ],
  ),

  "i-agatha-all-along": guide([
    essential(
      "i-wandavision",
      l(
        "Agatha Harkness' story and what happened to her.",
        "La storia di Agatha Harkness e ciò che le è accaduto.",
        "L'histoire d'Agatha Harkness et ce qui lui est arrivé.",
        "La historia de Agatha Harkness y lo que le ocurrió.",
        "Agatha Harkness' Geschichte und was mit ihr geschah.",
      ),
    ),
    optional(
      "i-doctor-strange-in-the-multiverse-of-madness",
      l(
        "Wanda's choices after the series.",
        "Le scelte di Wanda dopo la serie.",
        "Les choix de Wanda après la série.",
        "Las decisiones de Wanda tras la serie.",
        "Wandas Entscheidungen nach der Serie.",
      ),
    ),
  ]),

  "i-what-if-stagione-3": guide([
    essential("i-what-if-stagione-1", SAME_SERIES),
    recommended(
      "i-what-if-stagione-2",
      l(
        "Continues the story of the previous season.",
        "Prosegue la storia della stagione precedente.",
        "Poursuit l'histoire de la saison précédente.",
        "Continúa la historia de la temporada anterior.",
        "Setzt die Geschichte der vorherigen Staffel fort.",
      ),
    ),
  ]),

  "i-your-friendly-neighborhood-spider-man-stagione-1": guide([]),

  "i-captain-america-brave-new-world": guide([
    essential(
      "i-the-falcon-and-the-winter-soldier",
      l(
        "Sam Wilson becomes Captain America.",
        "Sam Wilson diventa Captain America.",
        "Sam Wilson devient Captain America.",
        "Sam Wilson se convierte en Capitán América.",
        "Sam Wilson wird zu Captain America.",
      ),
    ),
    recommended(
      "i-the-incredible-hulk",
      l(
        "Thaddeus Ross and Samuel Sterns' origins.",
        "Le origini di Thaddeus Ross e Samuel Sterns.",
        "Les origines de Thaddeus Ross et Samuel Sterns.",
        "Los orígenes de Thaddeus Ross y Samuel Sterns.",
        "Der Ursprung von Thaddeus Ross und Samuel Sterns.",
      ),
    ),
    recommended(
      "i-captain-america-civil-war",
      l(
        "Ross and the Sokovia Accords.",
        "Ross e gli Accordi di Sokovia.",
        "Ross et les accords de Sokovie.",
        "Ross y los Acuerdos de Sokovia.",
        "Ross und das Sokovia-Abkommen.",
      ),
    ),
    recommended(
      "i-eternals",
      l(
        "The Celestial Island that appears in the film.",
        "L'Isola dei Celestiali che compare nel film.",
        "L'île des Célestes qui apparaît dans le film.",
        "La Isla Celestial que aparece en la película.",
        "Die Himmlische Insel, die im Film auftaucht.",
      ),
    ),
  ]),

  "i-daredevil-born-again-stagione-1": guide(
    [
      recommended(
        "i-hawkeye",
        l(
          "Introduces Kingpin in the MCU.",
          "Introduce Kingpin nel MCU.",
          "Présente Kingpin dans le MCU.",
          "Presenta a Kingpin en el MCU.",
          "Führt Kingpin im MCU ein.",
        ),
      ),
      recommended(
        "i-echo",
        l(
          "Kingpin and Maya Lopez's story.",
          "La storia di Kingpin e Maya Lopez.",
          "L'histoire de Kingpin et Maya Lopez.",
          "La historia de Kingpin y Maya Lopez.",
          "Die Geschichte von Kingpin und Maya Lopez.",
        ),
      ),
      optional(
        "i-she-hulk-attorney-at-law",
        l(
          "Matt Murdock's first appearance in the MCU.",
          "La prima apparizione di Matt Murdock nel MCU.",
          "La première apparition de Matt Murdock dans le MCU.",
          "La primera aparición de Matt Murdock en el MCU.",
          "Matt Murdocks erster Auftritt im MCU.",
        ),
      ),
    ],
    [
      external(
        "recommended",
        "Daredevil (Netflix, 2015–2018)",
        l(
          "It continues the story of Matt Murdock and Kingpin.",
          "Continua la storia di Matt Murdock e Kingpin.",
          "Elle continue l’histoire de Matt Murdock et Kingpin.",
          "Continúa la historia de Matt Murdock y Kingpin.",
          "Sie setzt die Geschichte von Matt Murdock und Kingpin fort.",
        ),
      ),
    ],
  ),

  "i-thunderbolts": guide([
    essential(
      "i-black-widow",
      l(
        "Yelena's origin and the Red Room.",
        "L'origine di Yelena e la Red Room.",
        "L'origine de Yelena et la Red Room.",
        "El origen de Yelena y la Red Room.",
        "Yelenas Ursprung und der Red Room.",
      ),
    ),
    essential(
      "i-the-falcon-and-the-winter-soldier",
      l(
        "John Walker and Valentina de Fontaine appear there.",
        "John Walker e Valentina de Fontaine compaiono lì.",
        "John Walker et Valentina de Fontaine y apparaissent.",
        "John Walker y Valentina de Fontaine aparecen allí.",
        "John Walker und Valentina de Fontaine treten dort auf.",
      ),
    ),
    recommended(
      "i-hawkeye",
      l(
        "Yelena's and Valentina's recent mission.",
        "La recente missione di Yelena e Valentina.",
        "La récente mission de Yelena et Valentina.",
        "La reciente misión de Yelena y Valentina.",
        "Yelenas und Valentinas jüngste Mission.",
      ),
    ),
    recommended(
      "i-ant-man-and-the-wasp",
      l(
        "Introduces Ghost and her story.",
        "Introduce Ghost e la sua storia.",
        "Présente Ghost et son histoire.",
        "Presenta a Ghost y su historia.",
        "Führt Ghost und ihre Geschichte ein.",
      ),
    ),
    recommended(
      "i-captain-america-brave-new-world",
      l(
        "Ross' transformation and political role.",
        "La trasformazione di Ross e il suo ruolo politico.",
        "La transformation de Ross et son rôle politique.",
        "La transformación de Ross y su papel político.",
        "Ross' Verwandlung und politische Rolle.",
      ),
    ),
  ]),

  "i-ironheart": guide([
    essential(
      "i-black-panther-wakanda-forever",
      l(
        "Riri Williams is introduced there.",
        "Riri Williams viene introdotta lì.",
        "Riri Williams y est présentée.",
        "Riri Williams se presenta allí.",
        "Riri Williams wird dort eingeführt.",
      ),
    ),
  ]),

  "i-the-fantastic-four-first-steps": guide(
    [],
    [
      external(
        "optional",
        "Fantastic Four (2005, 2007, 2015)",
        l(
          "Other versions of the characters.",
          "Altre versioni dei personaggi.",
          "D’autres versions des personnages.",
          "Otras versiones de los personajes.",
          "Andere Versionen der Figuren.",
        ),
      ),
    ],
  ),

  "i-eyes-of-wakanda": guide([
    recommended(
      "i-black-panther",
      l(
        "Wakanda's history and Vibranium.",
        "La storia del Wakanda e il Vibranio.",
        "L'histoire du Wakanda et le Vibranium.",
        "La historia de Wakanda y el Vibranio.",
        "Wakandas Geschichte und das Vibranium.",
      ),
    ),
    optional(
      "i-black-panther-wakanda-forever",
      l(
        "Wakanda's present after T'Challa.",
        "Il presente del Wakanda dopo T'Challa.",
        "Le présent du Wakanda après T'Challa.",
        "El presente de Wakanda tras T'Challa.",
        "Wakandas Gegenwart nach T'Challa.",
      ),
    ),
  ]),

  "i-marvel-zombies": guide([
    recommended(
      "i-what-if-stagione-1",
      l(
        "The zombie world comes from an episode of that series.",
        "Il mondo degli zombie nasce da un episodio di quella serie.",
        "Le monde des zombies naît d'un épisode de cette série.",
        "El mundo zombi nace de un episodio de esa serie.",
        "Die Zombie-Welt stammt aus einer Folge jener Serie.",
      ),
    ),
  ]),

  "i-wonder-man": guide([
    recommended(
      "i-iron-man-3",
      l(
        "Trevor Slattery is introduced there.",
        "Trevor Slattery viene introdotto lì.",
        "Trevor Slattery y est présenté.",
        "Trevor Slattery se presenta allí.",
        "Trevor Slattery wird dort eingeführt.",
      ),
    ),
    recommended(
      "i-shang-chi-and-the-legend-of-the-ten-rings",
      l(
        "Trevor Slattery's later story.",
        "La storia successiva di Trevor Slattery.",
        "La suite de l'histoire de Trevor Slattery.",
        "La historia posterior de Trevor Slattery.",
        "Trevor Slatterys spätere Geschichte.",
      ),
    ),
  ]),

  "i-daredevil-born-again-stagione-2": guide([
    essential("i-daredevil-born-again-stagione-1", SAME_SERIES),
  ]),

  "i-the-punisher-one-last-kill": guide(
    [
      recommended(
        "i-daredevil-born-again-stagione-1",
        l(
          "Frank Castle's place in the MCU.",
          "Il posto di Frank Castle nel MCU.",
          "La place de Frank Castle dans le MCU.",
          "El lugar de Frank Castle en el MCU.",
          "Frank Castles Platz im MCU.",
        ),
      ),
    ],
    [
      external(
        "recommended",
        "The Punisher (Netflix, 2017–2019)",
        l(
          "It continues Frank Castle’s story.",
          "Continua la storia di Frank Castle.",
          "Elle continue l’histoire de Frank Castle.",
          "Continúa la historia de Frank Castle.",
          "Sie setzt Frank Castles Geschichte fort.",
        ),
      ),
    ],
  ),

  "i-x-men-97-stagione-2": guide([essential("i-x-men-97-stagione-1", SAME_SERIES)]),

  "i-visionquest": guide([
    essential(
      "i-wandavision",
      l(
        "Vision's journey continues from there.",
        "Il percorso di Visione continua da lì.",
        "Le parcours de Vision continue depuis là.",
        "El recorrido de Visión continúa desde allí.",
        "Visions Weg geht von dort weiter.",
      ),
    ),
    essential(
      "i-avengers-age-of-ultron",
      l(
        "Vision's origin.",
        "L'origine di Visione.",
        "L'origine de Vision.",
        "El origen de Visión.",
        "Visions Ursprung.",
      ),
    ),
    recommended(
      "i-avengers-infinity-war",
      l(
        "Vision's death and the Mind Stone.",
        "La morte di Visione e la Gemma della Mente.",
        "La mort de Vision et la Pierre de l'Esprit.",
        "La muerte de Visión y la Gema de la Mente.",
        "Visions Tod und der Gedankenstein.",
      ),
    ),
  ]),

  "i-spider-man-brand-new-day": guide(
    [
      essential(
        "i-spider-man-no-way-home",
        l(
          "It continues directly from the ending of that film.",
          "Continua direttamente dal finale di quel film.",
          "Il continue directement depuis la fin de ce film.",
          "Continúa directamente desde el final de esa película.",
          "Er setzt direkt am Ende jenes Films an.",
        ),
      ),
      recommended(
        "i-spider-man-homecoming",
        l(
          "Peter's friends and his first steps as Spider-Man.",
          "Gli amici di Peter e i suoi primi passi come Spider-Man.",
          "Les amis de Peter et ses premiers pas en Spider-Man.",
          "Los amigos de Peter y sus primeros pasos como Spider-Man.",
          "Peters Freunde und seine ersten Schritte als Spider-Man.",
        ),
      ),
      recommended(
        "i-spider-man-far-from-home",
        l(
          "Peter's life after the Blip.",
          "La vita di Peter dopo lo Schiocco.",
          "La vie de Peter après le Blip.",
          "La vida de Peter tras el Chasquido.",
          "Peters Leben nach dem Blip.",
        ),
      ),
      optional(
        "i-daredevil-born-again-stagione-1",
        l(
          "Matt Murdock is part of the same corner of the MCU.",
          "Matt Murdock fa parte dello stesso angolo del MCU.",
          "Matt Murdock fait partie du même coin du MCU.",
          "Matt Murdock forma parte del mismo rincón del MCU.",
          "Matt Murdock gehört zur selben Ecke des MCU.",
        ),
      ),
    ],
    [
      external(
        "optional",
        "Daredevil (Netflix, 2015–2018)",
        l(
          "The street-level corner of the MCU.",
          "L’angolo del MCU a livello di strada.",
          "Le coin du MCU à hauteur de rue.",
          "El rincón del MCU a pie de calle.",
          "Die bodenständige Ecke des MCU.",
        ),
      ),
      external(
        "optional",
        "The Punisher (Netflix, 2017–2019)",
        l(
          "The street-level corner of the MCU.",
          "L’angolo del MCU a livello di strada.",
          "Le coin du MCU à hauteur de rue.",
          "El rincón del MCU a pie de calle.",
          "Die bodenständige Ecke des MCU.",
        ),
      ),
    ],
  ),

  "i-your-friendly-neighborhood-spider-man-stagione-2": guide([
    essential("i-your-friendly-neighborhood-spider-man-stagione-1", SAME_SERIES),
  ]),

  "i-avengers-doomsday": guide(
    [
      essential(
        "i-avengers-endgame",
        l(
          "The end of the saga with the original Avengers.",
          "La conclusione della saga con i Vendicatori originali.",
          "La fin de la saga avec les Avengers d'origine.",
          "El final de la saga con los Vengadores originales.",
          "Das Ende der Saga mit den ursprünglichen Avengers.",
        ),
      ),
      recommended(
        "i-thunderbolts",
        l(
          "A recent team that may matter in this film.",
          "Una squadra recente che potrebbe contare in questo film.",
          "Une équipe récente qui pourrait compter dans ce film.",
          "Un equipo reciente que podría importar en esta película.",
          "Ein junges Team, das in diesem Film eine Rolle spielen könnte.",
        ),
      ),
      recommended(
        "i-the-fantastic-four-first-steps",
        l(
          "A new team from another world of the multiverse.",
          "Una nuova squadra proveniente da un altro mondo del multiverso.",
          "Une nouvelle équipe venue d'un autre monde du multivers.",
          "Un nuevo equipo de otro mundo del multiverso.",
          "Ein neues Team aus einer anderen Welt des Multiversums.",
        ),
      ),
      recommended(
        "i-deadpool-wolverine",
        l(
          "Shows how worlds of the multiverse can collide.",
          "Mostra come i mondi del multiverso possano scontrarsi.",
          "Montre comment les mondes du multivers peuvent entrer en collision.",
          "Muestra cómo pueden chocar los mundos del multiverso.",
          "Zeigt, wie Welten des Multiversums aufeinanderprallen können.",
        ),
      ),
      recommended(
        "i-loki-stagione-2",
        l(
          "The multiverse story that leads to this film.",
          "La storia del multiverso che porta a questo film.",
          "L'histoire du multivers qui mène à ce film.",
          "La historia del multiverso que lleva a esta película.",
          "Die Multiversum-Geschichte, die zu diesem Film führt.",
        ),
      ),
    ],
    [
      external(
        "recommended",
        "X-Men (2000)",
        l(
          "Disney’s list includes it: the Fox X-Men return in this film.",
          "È nella lista di Disney: gli X-Men della Fox tornano in questo film.",
          "Elle figure sur la liste de Disney : les X-Men de la Fox reviennent dans ce film.",
          "Está en la lista de Disney: los X-Men de Fox vuelven en esta película.",
          "Steht auf Disneys Liste: die X-Men von Fox kehren in diesem Film zurück.",
        ),
      ),
      external(
        "recommended",
        "X2 (2003)",
        l(
          "Disney’s list includes it: the Fox X-Men return in this film.",
          "È nella lista di Disney: gli X-Men della Fox tornano in questo film.",
          "Elle figure sur la liste de Disney : les X-Men de la Fox reviennent dans ce film.",
          "Está en la lista de Disney: los X-Men de Fox vuelven en esta película.",
          "Steht auf Disneys Liste: die X-Men von Fox kehren in diesem Film zurück.",
        ),
      ),
      external(
        "optional",
        "X-Men: Days of Future Past (2014)",
        l(
          "It changed the end of the original trilogy.",
          "Ha cambiato il finale della trilogia originale.",
          "Il a changé la fin de la trilogie originale.",
          "Cambió el final de la trilogía original.",
          "Er hat das Ende der ursprünglichen Trilogie verändert.",
        ),
      ),
      external(
        "optional",
        "Logan (2017)",
        l(
          "More context on the last stories of the Fox X-Men.",
          "Più contesto sulle ultime storie degli X-Men della Fox.",
          "Plus de contexte sur les dernières histoires des X-Men de la Fox.",
          "Más contexto sobre las últimas historias de los X-Men de Fox.",
          "Mehr Kontext zu den letzten Geschichten der Fox-X-Men.",
        ),
      ),
      external(
        "optional",
        "Fantastic Four (2005, 2007)",
        l(
          "Other versions of the characters.",
          "Altre versioni dei personaggi.",
          "D’autres versions des personnages.",
          "Otras versiones de los personajes.",
          "Andere Versionen der Figuren.",
        ),
      ),
    ],
  ),

  "i-daredevil-born-again-stagione-3": guide([
    essential("i-daredevil-born-again-stagione-2", SAME_SERIES),
    recommended("i-daredevil-born-again-stagione-1", SAME_SERIES),
  ]),

  "i-avengers-secret-wars": guide([
    essential(
      "i-avengers-doomsday",
      l(
        "It continues directly from that film.",
        "Continua direttamente da quel film.",
        "Il continue directement depuis ce film.",
        "Continúa directamente desde esa película.",
        "Er setzt direkt an jenen Film an.",
      ),
    ),
  ]),
};
