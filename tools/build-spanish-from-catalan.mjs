import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const root = join(process.cwd(), "site");

const pages = [
  {
    ca: "index.html",
    es: "es/elementor-1816/index.html",
    caPath: "/",
    esPath: "/es/elementor-1816/",
    title: "Floreix | Psicóloga | Terapia familiar | Mindfulness",
  },
  {
    ca: "about/index.html",
    es: "es/sobre-nosotros/index.html",
    caPath: "/about/",
    esPath: "/es/sobre-nosotros/",
    title: "Floreix | Psicología holística para empresas y grupos",
  },
  {
    ca: "metodologia/index.html",
    es: "es/metodologia-2/index.html",
    caPath: "/metodologia/",
    esPath: "/es/metodologia-2/",
    title: "Floreix | Terapia holística en plena naturaleza en Sant Cugat",
  },
  {
    ca: "contact/index.html",
    es: "es/contacto/index.html",
    caPath: "/contact/",
    esPath: "/es/contacto/",
    title: "Floreix | Contacta con psicóloga en Sant Cugat",
  },
  {
    ca: "privacy-policy/index.html",
    es: "es/terminos-y-condiciones/index.html",
    caPath: "/privacy-policy/",
    esPath: "/es/terminos-y-condiciones/",
    title: "Términos y Condiciones - Floreix",
  },
  {
    ca: "psicoterapia/index.html",
    es: "es/psicoterapia-2/index.html",
    caPath: "/psicoterapia/",
    esPath: "/es/psicoterapia-2/",
    title: "Psicoterapia - Floreix",
  },
  {
    ca: "terapia-a-la-natura/index.html",
    es: "es/terapia-en-la-naturaleza/index.html",
    caPath: "/terapia-a-la-natura/",
    esPath: "/es/terapia-en-la-naturaleza/",
    title: "Terapia en la naturaleza - Floreix",
  },
  {
    ca: "terapia-a-la-natura/index.html",
    es: "es/2084-2/index.html",
    caPath: "/terapia-a-la-natura/",
    esPath: "/es/2084-2/",
    title: "Terapia en la naturaleza - Floreix",
  },
];

const routeMap = [
  ["/psicoterapia/", "/es/psicoterapia-2/"],
  ["/terapia-a-la-natura/", "/es/terapia-en-la-naturaleza/"],
  ["/about/", "/es/sobre-nosotros/"],
  ["/metodologia/", "/es/metodologia-2/"],
  ["/contact/", "/es/contacto/"],
  ["/privacy-policy/", "/es/terminos-y-condiciones/"],
];

const dictionary = [
  ["Vés al contingut", "Ir al contenido"],
  ["Inici", "Inicio"],
  ["Serveis", "Servicios"],
  ["Psicoteràpia", "Psicoterapia"],
  ["Teràpia a la natura i Mindfulness", "Terapia en la naturaleza y Mindfulness"],
  ["Teràpia a la natura", "Terapia en la naturaleza"],
  ["Sobre nosaltres", "Sobre nosotros"],
  ["Metodologia", "Metodología"],
  ["Català", "Catalán"],
  ["Contactar", "Contactar"],
  ["Contacta", "Contacta"],
  ["Contacte", "Contacto"],
  ["Termes i Condicions", "Términos y Condiciones"],
  ["Teràpia amb mirada sistèmica i arrelament natural", "Terapia con mirada sistémica y arraigo natural"],
  ["Teràpia amb una mirada sistèmica", "Terapia con una mirada sistémica"],
  ["Cos i ment en unió", "Cuerpo y mente en unión"],
  ["Teràpia Relacional Sistèmica  l  Mindfulness  l  Natura", "Terapia Relacional Sistémica  l  Mindfulness  l  Naturaleza"],
  ["Teràpia Relacional Sistèmica  l  Natura  l  Mindfulness", "Terapia Relacional Sistémica  l  Naturaleza  l  Mindfulness"],
  ["Un espai de comprensió", "Un espacio de comprensión"],
  ["La psicoteràpia ajuda a entendre el malestar dins del sistema de relacions en què vivim. El treball pot incloure la persona, la parella o la família per afavorir nous equilibris i maneres més saludables de relacionar-se.", "La psicoterapia ayuda a comprender el malestar dentro del sistema de relaciones en el que vivimos. El trabajo puede incluir a la persona, la pareja o la familia para favorecer nuevos equilibrios y formas más saludables de relacionarse."],
  ["Cultivar l’atenció conscient", "Cultivar la atención consciente"],
  ["A través del mindfulness aprenem a observar el que vivim amb calma i sense judici. Aquesta pràctica afavoreix la regulació emocional i una relació més amable amb un mateix i amb els altres.", "A través del mindfulness aprendemos a observar lo que vivimos con calma y sin juicio. Esta práctica favorece la regulación emocional y una relación más amable con uno mismo y con los demás."],
  ["Reconnectar amb el ritme intern", "Reconectar con el ritmo interno"],
  ["Els entorns naturals ofereixen un espai privilegiat per aturar-se, escoltar-se i recuperar la calma. El contacte amb la natura facilita processos de consciència, introspecció i benestar emocional.", "Los entornos naturales ofrecen un espacio privilegiado para detenerse, escucharse y recuperar la calma. El contacto con la naturaleza facilita procesos de conciencia, introspección y bienestar emocional."],
  ["Com a psicòloga, al llarg de la meva trajectòria professional he", "Como psicóloga, a lo largo de mi trayectoria profesional he"],
  ["Sóc psicòloga i, al llarg de la meva trajectòria professional, m’he dedicat a", "Soy psicóloga y, a lo largo de mi trayectoria profesional, me he dedicado a"],
  ["acompanyat persones i organitzacions", "acompañado a personas y organizaciones"],
  ["acompanyar persones i organitzacions", "acompañar a personas y organizaciones"],
  ["en processos de creixement, canvis i transformació.", "en procesos de crecimiento, cambios y transformación."],
  ["en els seus processos de creixement i transformació.", "en sus procesos de crecimiento y transformación."],
  ["La formació contínua i l’experiència clínica han anat configurant una mirada sistèmica i integradora, que entén el malestar no com un fet aïllat, sinó dins del context vital i relacional de cada persona.", "La formación continua y la experiencia clínica han ido configurando una mirada sistémica e integradora, que entiende el malestar no como un hecho aislado, sino dentro del contexto vital y relacional de cada persona."],
  ["La formació contínua i el treball directe amb persones han anat de la mà, consolidant una mirada sistèmica i integradora.", "La formación continua y el trabajo directo con personas han ido de la mano, consolidando una mirada sistémica e integradora."],
  ["Ofereixo un espai d’acompanyament empàtic, rigorós i genuí, on poder comprendre les emocions, revisar patrons relacionals i transitar moments de canvi amb més consciència.", "Ofrezco un espacio de acompañamiento empático, riguroso y genuino, donde poder comprender las emociones, revisar patrones relacionales y transitar momentos de cambio con más conciencia."],
  ["treballem des d’una mirada sistèmica, propera i respectuosa, posant el focus en l’autoconeixement i el benestar emocional.", "trabajamos desde una mirada sistémica, cercana y respetuosa, poniendo el foco en el autoconocimiento y el bienestar emocional."],
  ["Un lloc per reconnectar amb tu, amb els teus vincles i amb la natura.", "Un lugar para reconectar contigo, con tus vínculos y con la naturaleza."],
  ["“Altament recomanat per a tothom que busqui una experiència terapèutica enriquidora i genuïna.”", "“Altamente recomendable para cualquier persona que busque una experiencia terapéutica enriquecedora y genuina.”"],
  ["Vols més informació o reservar una primera sessió?", "¿Quieres más información o reservar una primera sesión?"],
  ["Entenc cada procés dins el seu context vital i relacional,", "Entiendo cada proceso dentro de su contexto vital y relacional,"],
  ["oferint un acompanyament empàtic, rigorós i genuí,", "ofreciendo un acompañamiento empático, riguroso y genuino,"],
  ["inspirat també en la natura, la música i la pràctica de la presència.", "inspirado también en la naturaleza, la música y la práctica de la presencia."],
  ["Missió", "Misión"],
  ["Aprofitar els beneficis de la natura sobre les persones, com a eina clau en els processos terapèutics.", "Aprovechar los beneficios de la naturaleza sobre las personas como herramienta clave en los procesos terapéuticos."],
  ["Visió", "Visión"],
  ["Oferir suport psicològics amb els recursos dels boscos de proximitat, tant per a infants com a adults, de manera individual o grupal, per aprofundir en l’autoconeixement; en la unió cos i ment.", "Ofrecer apoyo psicológico con los recursos de los bosques de proximidad, tanto para niños como para adultos, de forma individual o grupal, para profundizar en el autoconocimiento y en la unión cuerpo y mente."],
  ["Valors", "Valores"],
  ["Integritat, honestedat i il·lusió", "Integridad, honestidad e ilusión"],
  ["Per què floreix?", "¿Por qué Floreix?"],
  ["La passió per les flors, com a manifestació de fragilitat, elegància i subtilesa de les seves formes. Les flors com expressió de bellesa, d’arribar a la plenitud, del brollar de l’energia més pura. Unes flors que també són l’inici d’un cicle vital, del que en un futur serà la seva llavor.", "La pasión por las flores, como manifestación de fragilidad, elegancia y sutileza de sus formas. Las flores como expresión de belleza, de llegar a la plenitud, del brotar de la energía más pura. Unas flores que también son el inicio de un ciclo vital, de lo que en un futuro será su semilla."],
  ["La llavor que cadascun de nosaltres portem dins i, de vegades, les diferents capes que anem afegint al llarg de la vida, ens la deixen oculta.", "La semilla que cada uno de nosotros lleva dentro y, a veces, las distintas capas que vamos añadiendo a lo largo de la vida nos la dejan oculta."],
  ["Col·laboradors", "Colaboradores"],
  ["La col.laboració de l’especialista en mediació i pedagoga Gemma Garcia, facilita un tracte més personalitzat en les sessions grupals.", "La colaboración de la especialista en mediación y pedagoga Gemma Garcia facilita un trato más personalizado en las sesiones grupales."],
  ["La seva aportació harmònica, ajuda en les diferents sinèrgies que es generen dins del grup, aconseguint així un creixement individual alhora que grupal.", "Su aportación armónica ayuda en las distintas sinergias que se generan dentro del grupo, logrando así un crecimiento individual y grupal."],
  ["Després del", "Después del"],
  ["primer contacte online", "primer contacto online"],
  ["i haver pogut fer l’anamnesi, la segona visita tindrà lloc en un espai natural, on poder sentir el cos en moviment.", "y de haber podido realizar la anamnesis, la segunda visita tendrá lugar en un espacio natural, donde poder sentir el cuerpo en movimiento."],
  ["S’establirà un punt de trobada, ben connectat amb transport públic o privat,", "Se establecerá un punto de encuentro, bien conectado con transporte público o privado,"],
  ["facilitant-te la ubicació via WhatsApp", "facilitándote la ubicación por WhatsApp"],
  ["El Parc de la Serra de Collserola és el recurs natural més proper que permetrà sortir de la rigidesa de les rutines diàries.", "El Parque de la Serra de Collserola es el recurso natural más cercano que permitirá salir de la rigidez de las rutinas diarias."],
  ["Ens endinsarem mitjançant l’obertura dels sentits en l’entorn natural, guiant cap a la consciència plena, propiciant la connexió de cos i ment. El balanceig dels peus pels camins de muntanya, contribuiran a deixar enrere els condicionaments,", "Nos adentraremos mediante la apertura de los sentidos en el entorno natural, guiando hacia la conciencia plena y propiciando la conexión de cuerpo y mente. El balanceo de los pies por los caminos de montaña contribuirá a dejar atrás los condicionamientos,"],
  ["iniciant una conversa terapèutica", "iniciando una conversación terapéutica"],
  [", amb atenció holística. Podràs gaudir de primera mà de la connexió amb els arbres i de les olors de la varietat de plantes i flors, proporcionant la relaxació necessària per a poder reconnectar.", ", con atención holística. Podrás disfrutar de primera mano de la conexión con los árboles y de los olores de la variedad de plantas y flores, proporcionando la relajación necesaria para poder reconectar."],
  ["Trencar les rutines de les estructures quotidianes, mitjançant la", "Romper las rutinas de las estructuras cotidianas, mediante la"],
  ["connexió amb el bosc", "conexión con el bosque"],
  [", proporcionarà la relaxació necessària per a poder-nos focalitzar en la ment rumiant.", ", proporcionará la relajación necesaria para poder focalizarnos en la mente rumiativa."],
  ["S’exercitarà el sentiment de contacte", "Se ejercitará el sentimiento de contacto"],
  ["del cos amb la natura, de la ment amb el cos, de la ment amb la natura.", "del cuerpo con la naturaleza, de la mente con el cuerpo, de la mente con la naturaleza."],
  ["Viure i abandonar moments complicats, possibilita un renéixer amb més força", "Vivir y dejar atrás momentos complicados posibilita renacer con más fuerza"],
  ["“La combinació única de teràpia tradicional i connexió amb la natura ha proporcionat un espai segur i revitalitzant per explorar i treballar en els meus reptes personals.”", "“La combinación única de terapia tradicional y conexión con la naturaleza ha proporcionado un espacio seguro y revitalizante para explorar y trabajar mis retos personales.”"],
  ["Contacta amb nosaltres", "Contacta con nosotros"],
  ["Em podeu contactar a:", "Puedes contactar conmigo en:"],
  ["Correu electrònic", "Correo electrónico"],
  ["Telèfon", "Teléfono"],
  ["Envia un correu electrònic:", "Envía un correo electrónico:"],
  ["Activeu el JavaScript al navegador per a poder completar el formulari.", "Activa JavaScript en el navegador para poder completar el formulario."],
  ["Nom", "Nombre"],
  ["Missatge", "Mensaje"],
  ["Enviar", "Enviar"],
  ["Consulta a Barcelona i Valldoreix:", "Consulta en Barcelona y Valldoreix:"],
  ["Benvingut al lloc web de Floreix", "Bienvenido al sitio web de Floreix"],
  ["Aquesta pàgina estableix els Términos y Condiciones que regeixen l&#8217;ús d&#8217;aquest lloc web i la política de privacitat aplicable a les dades personals recopilades. Si utilitzeu aquest lloc web, accepteu complir amb aquests termes i condicions. Si no esteu d&#8217;acord amb aquests termes, us recomanem que no continueu utilitzant el lloc web.", "Esta página establece los Términos y Condiciones que rigen el uso de este sitio web y la política de privacidad aplicable a los datos personales recopilados. Si utilizas este sitio web, aceptas cumplir estos términos y condiciones. Si no estás de acuerdo con estos términos, te recomendamos que no continúes utilizando el sitio web."],
  ["Aquesta pàgina estableix els Termes i Condicions que regeixen l'ús d'aquest lloc web i la política de privacitat aplicable a les dades personals recopilades. Si utilitzeu aquest lloc web, accepteu complir amb aquests termes i condicions. Si no esteu d'acord amb aquests termes, us recomanem que no continueu utilitzant el lloc web.", "Esta página establece los Términos y Condiciones que rigen el uso de este sitio web y la política de privacidad aplicable a los datos personales recopilados. Si utilizas este sitio web, aceptas cumplir estos términos y condiciones. Si no estás de acuerdo con estos términos, te recomendamos que no continúes utilizando el sitio web."],
  ["Política de Privacitat", "Política de Privacidad"],
  ["La vostra privadesa és important per a nosaltres. Per comprendre millor com recopilem, utilitzem, compartim i protegim les vostres dades personals, us recomanem llegir la nostra Política de Privacidad, que forma part integral d&#8217;aquests Términos y Condiciones.", "Tu privacidad es importante para nosotros. Para comprender mejor cómo recopilamos, utilizamos, compartimos y protegemos tus datos personales, te recomendamos leer nuestra Política de Privacidad, que forma parte integral de estos Términos y Condiciones."],
  ["La vostra privadesa és important per a nosaltres. Per comprendre millor com recopilem, utilitzem, compartim i protegim les vostres dades personals, us recomanem llegir la nostra Política de Privacitat, que forma part integral d'aquests Termes i Condicions.", "Tu privacidad es importante para nosotros. Para comprender mejor cómo recopilamos, utilizamos, compartimos y protegemos tus datos personales, te recomendamos leer nuestra Política de Privacidad, que forma parte integral de estos Términos y Condiciones."],
  ["Propietat Intel·lectual", "Propiedad Intelectual"],
  ["Tots els drets de propietat intel·lectual del contingut d&#8217;aquest lloc web, incloent-hi textos, gràfics, logotips, imatges, vídeos, música i altres materials, pertanyen a Floreix o als seus llicenciants. Aquest contingut està protegit per les lleis de propietat intel·lectual aplicables. No esteu autoritzats a reproduir, distribuir, modificar o utilitzar aquest contingut sense el consentiment exprés per escrit de Floreix.", "Todos los derechos de propiedad intelectual del contenido de este sitio web, incluidos textos, gráficos, logotipos, imágenes, vídeos, música y otros materiales, pertenecen a Floreix o a sus licenciantes. Este contenido está protegido por las leyes de propiedad intelectual aplicables. No estás autorizado a reproducir, distribuir, modificar o utilizar este contenido sin el consentimiento expreso por escrito de Floreix."],
  ["Tots els drets de propietat intel·lectual del contingut d'aquest lloc web, incloent-hi textos, gràfics, logotips, imatges, vídeos, música i altres materials, pertanyen a Floreix o als seus llicenciants. Aquest contingut està protegit per les lleis de propietat intel·lectual aplicables. No esteu autoritzats a reproduir, distribuir, modificar o utilitzar aquest contingut sense el consentiment exprés per escrit de Floreix.", "Todos los derechos de propiedad intelectual del contenido de este sitio web, incluidos textos, gráficos, logotipos, imágenes, vídeos, música y otros materiales, pertenecen a Floreix o a sus licenciantes. Este contenido está protegido por las leyes de propiedad intelectual aplicables. No estás autorizado a reproducir, distribuir, modificar o utilizar este contenido sin el consentimiento expreso por escrito de Floreix."],
  ["Limitació de Responsabilitat", "Limitación de Responsabilidad"],
  ["Utilitzeu aquest lloc web sota la vostra pròpia responsabilitat. No ens fem responsables de cap dany directe, indirecte, especial, conseqüent o exemplar que pugui sorgir de l&#8217;ús d&#8217;aquest lloc web o de la informació continguda en aquest. Tot i que ens esforcem per proporcionar informació precisa i actualitzada, no garantim la seva integritat ni exactitud.", "Utiliza este sitio web bajo tu propia responsabilidad. No nos hacemos responsables de ningún daño directo, indirecto, especial, consecuente o ejemplar que pueda surgir del uso de este sitio web o de la información contenida en él. Aunque nos esforzamos por proporcionar información precisa y actualizada, no garantizamos su integridad ni exactitud."],
  ["Utilitzeu aquest lloc web sota la vostra pròpia responsabilitat. No ens fem responsables de cap dany directe, indirecte, especial, conseqüent o exemplar que pugui sorgir de l'ús d'aquest lloc web o de la informació continguda en aquest. Tot i que ens esforcem per proporcionar informació precisa i actualitzada, no garantim la seva integritat ni exactitud.", "Utiliza este sitio web bajo tu propia responsabilidad. No nos hacemos responsables de ningún daño directo, indirecto, especial, consecuente o ejemplar que pueda surgir del uso de este sitio web o de la información contenida en él. Aunque nos esforzamos por proporcionar información precisa y actualizada, no garantizamos su integridad ni exactitud."],
  ["Enllaços a Tercers", "Enlaces a Terceros"],
  ["Aquest lloc web pot contenir enllaços a altres llocs web de tercers que no estan sota el nostre control. No tenim control ni assumeix cap responsabilitat pel contingut, les polítiques de privacitat o les pràctiques dels llocs web de tercers. Us recomanem llegir les polítiques de privacitat i els termes i condicions de tots els llocs web que visiteu.", "Este sitio web puede contener enlaces a otros sitios web de terceros que no están bajo nuestro control. No tenemos control ni asumimos responsabilidad por el contenido, las políticas de privacidad o las prácticas de los sitios web de terceros. Te recomendamos leer las políticas de privacidad y los términos y condiciones de todos los sitios web que visites."],
  ["Canvis en els Termes i Condicions", "Cambios en los Términos y Condiciones"],
  ["Ens reservem el dret de modificar aquests Términos y Condiciones en qualsevol moment. Les modificacions entraran en vigor en el moment de la seva publicació en aquest lloc web. Es recomana revisar periòdicament aquesta pàgina per conèixer els canvis més recents.", "Nos reservamos el derecho de modificar estos Términos y Condiciones en cualquier momento. Las modificaciones entrarán en vigor en el momento de su publicación en este sitio web. Se recomienda revisar periódicamente esta página para conocer los cambios más recientes."],
  ["Ens reservem el dret de modificar aquests Termes i Condicions en qualsevol moment. Les modificacions entraran en vigor en el moment de la seva publicació en aquest lloc web. Es recomana revisar periòdicament aquesta pàgina per conèixer els canvis més recents.", "Nos reservamos el derecho de modificar estos Términos y Condiciones en cualquier momento. Las modificaciones entrarán en vigor en el momento de su publicación en este sitio web. Se recomienda revisar periódicamente esta página para conocer los cambios más recientes."],
  ["Si teniu alguna pregunta o inquietud sobre aquests Términos y Condiciones, si us plau, poseu-vos en contacte amb nosaltres a través de les vies indicades a la nostra pàgina de contacte.", "Si tienes alguna pregunta o inquietud sobre estos Términos y Condiciones, por favor ponte en contacto con nosotros a través de las vías indicadas en nuestra página de contacto."],
  ["Si teniu alguna pregunta o inquietud sobre aquests Termes i Condicions, si us plau, poseu-vos en contacte amb nosaltres a través de les vies indicades a la nostra pàgina de contacte.", "Si tienes alguna pregunta o inquietud sobre estos Términos y Condiciones, por favor ponte en contacto con nosotros a través de las vías indicadas en nuestra página de contacto."],
  ["Des de la perspectiva sistèmica, entenem que les persones formem part de sistemes de relació; família, parella, entorn.", "Desde la perspectiva sistémica, entendemos que las personas formamos parte de sistemas de relación: familia, pareja, entorno."],
  ["El malestar no s’explica només des de l’individu, sinó també des dels vincles i les dinàmiques que ens envolten. Per això, la intervenció pot adaptar-se a diferents formats:", "El malestar no se explica solo desde el individuo, sino también desde los vínculos y las dinámicas que nos rodean. Por eso, la intervención puede adaptarse a diferentes formatos:"],
  ["Teràpia individual", "Terapia individual"],
  ["Un espai per cuidar el teu benestar emocional", "Un espacio para cuidar tu bienestar emocional"],
  ["Un lloc d’acollida i reflexió per comprendre les emocions, els patrons relacionals i els moments de crisi vital. Treballem l’autoconeixement, la regulació emocional i la manera com et relaciones amb els altres, sempre tenint present el sistema del qual formes part.", "Un lugar de acogida y reflexión para comprender las emociones, los patrones relacionales y los momentos de crisis vital. Trabajamos el autoconocimiento, la regulación emocional y la forma en que te relacionas con los demás, siempre teniendo presente el sistema del que formas parte."],
  ["Teràpia de parella", "Terapia de pareja"],
  ["Revisar la relació per trobar noves maneres de connectar", "Revisar la relación para encontrar nuevas formas de conectar"],
  ["El vostre espai per revisar la comunicació, els conflictes i les expectatives dins la relació. L’objectiu és comprendre les dinàmiques que s’han establert, restaurar el diàleg i construir una relació més conscient i equilibrada..", "Vuestro espacio para revisar la comunicación, los conflictos y las expectativas dentro de la relación. El objetivo es comprender las dinámicas que se han establecido, restaurar el diálogo y construir una relación más consciente y equilibrada."],
  ["Teràpia familiar", "Terapia familiar"],
  ["Comprendre el sistema familiar per recuperar l’equilibri", "Comprender el sistema familiar para recuperar el equilibrio"],
  ["Des d’una mirada sistèmica i en un ambient proper i acollidor, abordem les dificultats que afecten el sistema familiar: conflictes, etapes de canvi, adolescència o desajustos en els rols. Entenem que el malestar pren sentit dins les relacions. L’objectiu és enfortir els vincles familiars i construir noves maneres de relacionar-vos amb més consciència, respecte i benestar compartit.", "Desde una mirada sistémica y en un ambiente cercano y acogedor, abordamos las dificultades que afectan al sistema familiar: conflictos, etapas de cambio, adolescencia o desajustes en los roles. Entendemos que el malestar cobra sentido dentro de las relaciones. El objetivo es fortalecer los vínculos familiares y construir nuevas formas de relacionaros con más conciencia, respeto y bienestar compartido."],
  ["Sessió individual", "Sesión individual"],
  ["Proporcionar una atenció personalitzada amb un enfocament holístic, orientat a l’escolta del cos (Shapiro D, 2002) i la fusió amb la natura, com a teràpia per a promoure la salut mental (International Nature and Forest Therapy Alliance, INFTA).", "Proporcionar una atención personalizada con un enfoque holístico, orientado a la escucha del cuerpo (Shapiro D, 2002) y la fusión con la naturaleza, como terapia para promover la salud mental (International Nature and Forest Therapy Alliance, INFTA)."],
  ["Sessió en grup", "Sesión en grupo"],
  ["Aprofitar la relaxació que proporciona un entorn natural obert per a cohesionar grups, generar empatia, reduir els prejudicis i fomentar la comunicació, l’entesa i acceptació vers la diversitat.", "Aprovechar la relajación que proporciona un entorno natural abierto para cohesionar grupos, generar empatía, reducir prejuicios y fomentar la comunicación, el entendimiento y la aceptación de la diversidad."],
  ["Sessió per a nens", "Sesión para niños"],
  ["Mitjançant activitats lúdiques, fomentar la comunicació interpersonal, la identificació de les emocions i el maneig dels sentiments, per a crear un clima de respecte i cohesió.", "Mediante actividades lúdicas, fomentar la comunicación interpersonal, la identificación de las emociones y la gestión de los sentimientos, para crear un clima de respeto y cohesión."],
  ["Mindfulness:", "Mindfulness:"],
  ["un moment per parar, respirar i observar", "un momento para parar, respirar y observar"],
  ["Oferim espais de", "Ofrecemos espacios de"],
  ["pràctica de mindfulness", "práctica de mindfulness"],
  ["orientats a cultivar l’atenció al moment present i afavorir el benestar emocional. Mitjançant exercicis senzills de respiració, consciència corporal i observació dels pensaments, el mindfulness ajuda a", "orientados a cultivar la atención al momento presente y favorecer el bienestar emocional. Mediante ejercicios sencillos de respiración, conciencia corporal y observación de los pensamientos, el mindfulness ayuda a"],
  ["reduir l’estrès, millorar la regulació emocional i desenvolupar una relació més conscient amb un mateix.", "reducir el estrés, mejorar la regulación emocional y desarrollar una relación más consciente con uno mismo."],
  ["reduir l’estrès, millorar la regulació emocional i desenvolupar una relació més conscient amb un mateix.", "reducir el estrés, mejorar la regulación emocional y desarrollar una relación más consciente con uno mismo."],
  ["reduir l’estrès, millorar la regulació emocional i desenvolupar una relació més conscient amb un mateix i amb els altres.", "reducir el estrés, mejorar la regulación emocional y desarrollar una relación más consciente con uno mismo y con los demás."],
  ["Aquestes sessions conviden a cultivar una presència plena que permeti no quedar atrapats en el flux constant de pensaments. T’acompanyo a través d’exercicis pràctics amb l’objectiu d’oferir eines que es puguin integrar en la vida quotidiana, afavorint una", "Estas sesiones invitan a cultivar una presencia plena que permita no quedar atrapados en el flujo constante de pensamientos. Te acompaño a través de ejercicios prácticos con el objetivo de ofrecer herramientas que se puedan integrar en la vida cotidiana, favoreciendo una"],
  ["major calma, claredat mental i equilibri personal.", "mayor calma, claridad mental y equilibrio personal."],
  ["L’objectiu és que cada persona pugui connectar amb els seus propis recursos i cuidar la seva llavor interior, creant espais de silenci i consciència enmig del ritme del dia a dia.", "El objetivo es que cada persona pueda conectar con sus propios recursos y cuidar su semilla interior, creando espacios de silencio y conciencia en medio del ritmo del día a día."],
  ["Un canvi és possible, quan ets conscient d'allò que vols transformar.", "Un cambio es posible cuando eres consciente de aquello que quieres transformar."],
  ["Mitjançant la", "Mediante la"],
  ["teràpia a la natura", "terapia en la naturaleza"],
  [", es buscarà la connexió de cos i ment, cercant aprofundir en l’autoconeixement amb l’atenció plena o mindfulness. Es facilitarà el recolzament per", ", se buscará la conexión de cuerpo y mente, procurando profundizar en el autoconocimiento con la atención plena o mindfulness. Se facilitará el apoyo para"],
  ["afrontar els pensaments, emocions, sensacions físiques", "afrontar los pensamientos, emociones, sensaciones físicas"],
  [", comportaments o situacions que interfereixen en el funcionament quotidià. L’objectiu es", ", comportamientos o situaciones que interfieren en el funcionamiento cotidiano. El objetivo es"],
  ["reduir l’ansietat i millorar l’estat d’ànim", "reducir la ansiedad y mejorar el estado de ánimo"],
  [", augmentar la concentració i fomentar l’ús de la natura com a recurs terapèutic", ", aumentar la concentración y fomentar el uso de la naturaleza como recurso terapéutico"],
  ["Descobreix la teràpia holística en plena natura. Mindfulness, relaxació guiada i autoconeixement amb sessions terapèutiques personalitzades a Sant Cugat", "Descubre la terapia holística en plena naturaleza. Mindfulness, relajación guiada y autoconocimiento con sesiones terapéuticas personalizadas en Sant Cugat"],
  ["Teràpia a la natura: Cos i ment en unió", "Terapia en la naturaleza: Cuerpo y mente en unión"],
];

function replaceAll(text, from, to) {
  return text.split(from).join(to);
}

function localize(html, page) {
  let out = html;
  out = out.replace(/<html lang="ca"/, '<html lang="es"');
  out = out.replace(/<title>[\s\S]*?<\/title>/, `<title>${page.title}</title>`);
  out = out.replace(/content="ca_ES"/g, 'content="es_ES"');
  out = out.replace(/content="ca"/g, 'content="es"');
  out = out.replace(/"inLanguage":"ca"/g, '"inLanguage":"es"');
  out = out.replace(/pll_language=ca/g, "pll_language=es");
  out = out.replace(/"lang":"ca"/g, '"lang":"es"');
  out = out.replace(/"locale":"ca"/g, '"locale":"es"');
  out = out.replace(/"post":\{"id":\d+/g, '"post":{"id":1816');
  out = out.replace(/(<link rel="alternate" href=")[^"]+(" hreflang="ca" \/>)/, `$1${page.caPath}$2`);
  out = out.replace(/(<link rel="alternate" href=")[^"]+(" hreflang="es" \/>)/, `$1${page.esPath}$2`);
  out = out.replace(/(<link rel="canonical" href=")[^"]+(" \/>)/, `$1${page.esPath}$2`);

  for (const [ca, es] of routeMap) out = replaceAll(out, `href="${ca}"`, `href="${es}"`);
  for (const [ca, es] of routeMap) out = replaceAll(out, `href='${ca}'`, `href='${es}'`);
  out = replaceAll(out, 'href="/"', 'href="/es/elementor-1816/"');
  out = replaceAll(out, "href='/'", "href='/es/elementor-1816/'");

  out = replaceAll(out, `href="${page.esPath}" hreflang="ca"`, `href="${page.caPath}" hreflang="ca"`);
  out = replaceAll(out, `href="${page.caPath}" hreflang="es"`, `href="${page.esPath}" hreflang="es"`);

  for (const [ca, es] of dictionary) out = replaceAll(out, ca, es);
  out = replaceAll(out, "Metodología-floreix", "Metodologia-floreix");
  out = replaceAll(out, "Comparteix", "Comparte");
  out = replaceAll(out, "Baixa", "Descargar");
  out = replaceAll(out, "Pantalla completa", "Pantalla completa");
  out = replaceAll(out, "Escalada", "Zoom");
  out = replaceAll(out, "Reprodueix vídeo", "Reproducir vídeo");
  out = replaceAll(out, "Anterior", "Anterior");
  out = replaceAll(out, "Següent", "Siguiente");
  out = replaceAll(out, "Tanca", "Cerrar");
  return out;
}

for (const page of pages) {
  const source = await readFile(join(root, page.ca), "utf8");
  const output = localize(source, page);
  const target = join(root, page.es);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, output, "utf8");
  console.log(`${page.ca} -> ${page.es}`);
}

for (const page of pages.filter((item, index, all) => all.findIndex((other) => other.ca === item.ca) === index)) {
  const target = join(root, page.ca);
  let html = await readFile(target, "utf8");
  html = html.replace(/href="\/es\/elementor-1816\/" hreflang="es-ES"/g, `href="${page.esPath}" hreflang="es-ES"`);
  html = html.replace(/href="\/es\/elementor-1816\/" hreflang="es"/g, `href="${page.esPath}" hreflang="es"`);
  html = html.replace(/<link rel="alternate" href="[^"]+" hreflang="es" \/>/, `<link rel="alternate" href="${page.esPath}" hreflang="es" />`);
  await writeFile(target, html, "utf8");
}
