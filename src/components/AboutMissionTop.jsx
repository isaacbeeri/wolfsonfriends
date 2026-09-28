import React, { useState } from "react";
import { 
  Heart, 
  ArrowRight, 
  ArrowLeft, 
  Play, 
  ShieldCheck, 
  Users, 
  Scale, 
  HeartHandshake, 
  Cpu, 
  Activity, 
  Building2, 
  Maximize2, 
  X, 
  Sparkles,
  Layers,
  ChevronDown
} from "lucide-react";
import { NewsRoller } from "./NewsRoller.jsx";

export function AboutMissionTop({ t, onOpenDonate, dir, lang }) {
  const isRtl = dir === "rtl";
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;
  const [isDiagramOpen, setIsDiagramOpen] = useState(false);

  // Multilingual content for "OUR MISSION - A SAFETY NET FOR THE VULNERABLE"
  const missionTexts = {
    badge: {
      he: "המשימה שלנו — רשת ביטחון לחלשים בחברה",
      en: "OUR MISSION — A SAFETY NET FOR THE VULNERABLE",
      fr: "NOTRE MISSION — UN FILET DE SÉCURITÉ POUR LES PLUS VULNÉRABLES",
      de: "UNSERE MISSION — EIN SICHERHEITSNETZ FÜR DIE VERLETZLICHEN",
      ar: "مهمتنا — شبكة أمان للفئات الأكثر ضعفاً",
      ru: "НАША МИССИЯ — СЕТЬ БЕЗОПАСНОСТИ ДЛЯ УЯЗВИМЫХ",
      es: "NUESTRA MISIÓN — UNA RED DE SEGURIDAD PARA LOS VULNERABLES",
      ja: "私たちの使命 — 脆弱な人々を守るセーフティネット",
      pt: "NOSSA MISSÃO — UMA REDE DE SEGURANÇA PARA OS VULNERÁVEIS"
    },
    mainTitle: {
      he: "עמותת ידידי המרכז הרפואי וולפסון: מגשרים על הפער לצדק בריאותי ושוויון ברפואה",
      en: "Friends of Wolfson Medical Center: Bridging the Gap for Healthcare Equity",
      fr: "Les Amis du Centre Médical Wolfson : Combler l'écart pour l'équité en santé",
      de: "Freunde des Wolfson Medical Center: Überbrückung der Kluft für gesundheitliche Chancengleichheit",
      ar: "جمعية أصدقاء مركز وولفسون الطبي: سد الفجوة لتحقيق العدالة والمساواة الصحية",
      ru: "Общество друзей медицинского центра Вольфсон: Преодолевая разрыв ради равенства в медицине",
      es: "Amigos del Centro Médico Wolfson: Cerrando la brecha por la equidad en salud",
      ja: "ヴォルフソン医療センター友の会：医療格差を埋め、すべての人に公正な医療を",
      pt: "Amigos do Centro Médico Wolfson: Reduzindo a lacuna para a equidade na saúde"
    },
    whyQuestion: {
      he: "למה אנחנו עושים את מה שאנחנו עושים?",
      en: "Why Are We Doing What We Are Doing?",
      fr: "Pourquoi faisons-nous ce que nous faisons ?",
      de: "Warum tun wir, was wir tun?",
      ar: "لماذا نقوم بما نقوم به؟",
      ru: "Почему мы делаем то, что делаем?",
      es: "¿Por qué hacemos lo que hacemos?",
      ja: "なぜ私たちはこの活動を行っているのか？",
      pt: "Por que fazemos o que fazemos?"
    },
    associationIntro: {
      he: "עמותת ידידי המרכז הרפואי ע״ש אדית וולפסון היא עמותה פילנתרופית עצמאית התומכת במרכז הרפואי וולפסון — בית חולים ממשלתי ואוניברסיטאי בחולון, מדרום לתל אביב.",
      en: "The Friends of the Edith Wolfson Medical Center is an independent philanthropic association supporting the WMC, a government-owned, university-affiliated hospital in Holon, just south of Tel Aviv.",
      fr: "Les Amis du Centre Médical Edith Wolfson est une association philanthropique indépendante soutenant le WMC, un hôpital public universitaire situé à Holon, juste au sud de Tel Aviv.",
      de: "Der Förderverein des Edith Wolfson Medical Center ist eine unabhängige philanthropische Vereinigung zur Unterstützung des WMC, eines staatlichen, universitätsnahen Krankenhauses in Holon südlich von Tel Aviv.",
      ar: "جمعية أصدقاء مركز إديث وولفسون الطبي هي جمعية خيرية مستقلة تدعم مركز وولفسون الطبي — وهو مستشفى حكومي جامعي في حولون، جنوب تل أبيب.",
      ru: "Общество друзей медицинского центра имени Эдит Вольфсон — независимая филантропическая организация, поддерживающая МЦ Вольфсон, государственную университетскую больницу в Холоне, к югу от Тель-Авива.",
      es: "Los Amigos del Centro Médico Edith Wolfson es una asociación filantrópica independiente que apoya al WMC, un hospital público afiliado a la universidad en Holon, al sur de Tel Aviv.",
      ja: "エディス・ヴォルフソン医療センター友の会は、テルアビブ南部のホロンに位置する政府所有の大学提携病院であるWMCを支援する独立した慈善団体です。",
      pt: "Os Amigos do Centro Médico Edith Wolfson é uma associação filantrópica independente que apoia o WMC, um hospital público afiliado à universidade em Holon, ao sul de Tel Aviv."
    },
    missionStatement: {
      he: "אנו מחברים תורמים בינלאומיים, קרנות פילנתרופיות ומנהיגי קהילה עם בית החולים כדי לתמוך בצוותים הרפואיים, לחדש תשתיות ולשפר את הטיפול בחולים. המשימה שלנו היא לסייע בסגירת פערים בנגישות לשירותי בריאות, באמצעות הבאת טכנולוגיות רפואיות מתקדמות ואבחון מציל חיים אל הקהילות שבית החולים משרת. באמצעות שותפויות ארוכות טווח, אנו פועלים למען עתיד שבו לכל אדם יש גישה לטיפול הרפואי לו הוא זקוק — ואף אחד אינו נשאר מאחור.",
      en: "We connect international donors, foundations, and community leaders with the hospital to support clinical teams, modernize infrastructure, and improve patient care. Our mission is to help close gaps in healthcare access by bringing advanced medical technologies and life-saving diagnostics to the communities the hospital serves. Through lasting partnerships, we work toward a future in which everyone can access the care they need—and no one is left behind.",
      fr: "Nous connectons donateurs internationaux, fondations et leaders communautaires avec l'hôpital pour soutenir les équipes cliniques, moderniser les infrastructures et améliorer les soins. Notre mission est de combler les lacunes d'accès aux soins en apportant des technologies de pointe et des diagnostics vitaux aux communautés desservies. Grâce à des partenariats durables, nous œuvrons pour un avenir où chacun a accès aux soins nécessaires — et où personne n'est laissé pour compte.",
      de: "Wir verbinden internationale Spender, Stiftungen und Führungspersönlichkeiten mit dem Krankenhaus, um klinische Teams zu unterstützen, Infrastrukturen zu modernisieren und die Patientenversorgung zu verbessern. Unsere Mission ist es, Lücken in der Gesundheitsversorgung zu schließen, indem wir modernste Technologien und lebensrettende Diagnostik direkt zu den Menschen bringen. Durch dauerhafte Partnerschaften schaffen wir eine Zukunft, in der jeder Zugang zu erstklassiger Versorgung hat — und niemand zurückgelassen wird.",
      ar: "نحن نربط المانحين الدوليين والمؤسسات الخيرية وقادة المجتمع بالمستشفى لدعم الطواقم الطبية وتحديث البنية التحتية وتحسين رعاية المرضى. مهمتنا هي المساعدة في سد الفجوات في الوصول إلى الرعاية الصحية من خلال جلب التقنيات الطبية المتقدمة والتشخيص المنقذ للحياة إلى المجتمعات التي يخدمها المستشفى. من خلال شراكات دائمة، نعمل نحو مستقبل يمكن للجميع فيه الحصول على الرعاية التي يحتاجونها — دون أن يتخلف أحد عن الركب.",
      ru: "Мы объединяем международных доноров, фонды и лидеров сообществ с больницей, чтобы поддерживать медицинский персонал, модернизировать инфраструктуру и повышать качество ухода за пациентами. Наша миссия — способствовать устранению неравенства в доступе к медицине, предоставляя передовые технологии и спасительную диагностику сообществам, которым служит больница. Через долгосрочное партнерство мы стремимся к будущему, в котором каждый имеет доступ к необходимой медицинской помощи — и никто не забыт.",
      es: "Conectamos a donantes internacionales, fundaciones y líderes comunitarios con el hospital para respaldar a los equipos médicos, modernizar la infraestructura y mejorar la atención al paciente. Nuestra misión es cerrar las brechas en el acceso a la salud acercando tecnologías de vanguardia y diagnósticos vitales a las comunidades a las que sirve el hospital. A través de alianzas duraderas, trabajamos por un futuro en el que todos puedan acceder a la atención que necesitan — y nadie quede atrás.",
      ja: "私たちは国際的な支援者、財団、コミュニティリーダーを病院と結びつけ、医療チームを支援し、設備を近代化し、患者ケアを向上させています。私たちの使命は、高度な医療技術と命を救う診断を地域社会に届けることで医療アクセスの格差を解消することです。永続的なパートナーシップを通じて、誰もが必要な治療を受けられ、誰一人として取り残されない未来を目指しています。",
      pt: "Conectamos doadores internacionais, fundações e líderes comunitários ao hospital para apoiar as equipes clínicas, modernizar a infraestrutura e aprimorar o atendimento aos pacientes. Nossa missão é ajudar a reduzir as disparidades no acesso à saúde, trazendo tecnologias avançadas e diagnósticos vitais para as comunidades atendidas. Por meio de parcerias duradouras, trabalhamos por um futuro em que todos tenham acesso ao cuidado de que precisam — e ninguém seja deixado para trás."
    },
    communitySubtext: {
      he: "המרכז הרפואי וולפסון מהווה עוגן קריטי עבור כחצי מיליון תושבי חולון, בת ים ודרום תל אביב-יפו — מתוכם שיעור חסר תקדים של קשישים וניצולי שואה הנשענים כולם על הרפואה הציבורית. אנו פועלים כרשת ביטחון כדי להבטיח שאיש לא יישאר מאחור.",
      en: "Wolfson Medical Center is a critical anchor for over half a million residents of Holon, Bat Yam, and South Tel Aviv-Jaffa — including a high proportion of elderly residents and Holocaust survivors who rely entirely on public healthcare. We serve as an unwavering safety net so that no one is left behind.",
      fr: "Le Centre Médical Wolfson est une ancre vitale pour plus d'un demi-million d'habitants de Holon, Bat Yam et du sud de Tel Aviv-Jaffa — dont une proportion élevée de personnes âgées et de survivants de la Shoah dépendant de la santé publique.",
      de: "Das Wolfson Medical Center ist ein lebenswichtiger Anker für über eine halbe Million Menschen in Holon, Bat Yam und Süd-Tel Aviv-Jaffa — darunter ein hoher Anteil von älteren Menschen und Holocaust-Überlebenden, die auf öffentliche Versorgung angewiesen sind.",
      ar: "يمثل مركز وولفسون الطبي ركيزة حيوية لأكثر من نصف مليون نسمة في حولون وبات يام وجنوب تل أبيب-يافا — بما في ذلك نسبة كبيرة من المسنين والناجين من الهولوكوست الذين يعتمدون بالكامل على الطب العام.",
      ru: "МЦ Вольфсон — важнейшая опора для более чем полумиллиона жителей Холона, Бат-Яма и юга Тель-Авива-Яффо, включая высокий процент пожилых людей и переживших Катастрофу, полностью зависящих от государственной медицины.",
      es: "El Centro Médico Wolfson es un ancla crucial para más de medio millón de residentes en Holon, Bat Yam y el sur de Tel Aviv-Jaffa, con una alta proporción de ancianos y sobrevivientes que dependen de la salud pública.",
      ja: "ヴォルフソン医療センターは、公的医療に依存する高齢者やホロコースト生存者を多く含む、ホロン、バット・ヤム、南テルアビブの50万人以上の住民を支えています。",
      pt: "O Centro Médico Wolfson é uma âncora crucial para mais de meio milhão de residentes em Holon, Bat Yam e sul de Tel Aviv-Jaffa, incluindo uma grande parcela de idosos e sobreviventes que dependem da saúde pública."
    },
    // The 3 Mission Pillars from the Infographic
    pillar1Title: {
      he: "עוגן חברתי וקהילתי",
      en: "A Social and Community Anchor",
      fr: "Une ancre sociale et communautaire",
      de: "Ein sozialer und gemeinschaftlicher Anker",
      ar: "عوجن اجتماعي ومجتمعي",
      ru: "Социальный и общественный оплот",
      es: "Un ancla social y comunitaria",
      ja: "地域社会とコミュニティの命綱",
      pt: "Uma âncora social e comunitária"
    },
    pillar1Desc: {
      he: "מענה מקיף ומסור לאוכלוסייה מגוונת וייחודית בחולון, בת ים ויפו, כולל אלפי משפחות וקשישים המסתמכים באופן מלא ומוחלט על הרפואה הציבורית בישראל.",
      en: "Serving a uniquely complex demographic in Holon, Bat Yam, and Jaffa, including many who rely entirely on public medicine.",
      fr: "Au service d'une démographie particulièrement complexe à Holon, Bat Yam et Jaffa, dont beaucoup dépendent entièrement du système public.",
      de: "Fürsorge für eine vielschichtige Bevölkerung in Holon, Bat Yam und Jaffa, von denen viele vollständig auf die öffentliche Medizin angewiesen sind.",
      ar: "خدمة تركيبة سكانية فريدة ومعقدة في حولون وبات يام ويافا، بما في ذلك العديد ممن يعتمدون كلياً على منظومة الصحة العامة.",
      ru: "Всесторонняя забота о многонациональном населении Холона, Бат-Яма и Яффо, многие из которых всецело зависят от государственного здравоохранения.",
      es: "Sirviendo a una población demográficamente compleja en Holon, Bat Yam y Jaffa, que depende íntegramente de la sanidad pública.",
      ja: "ホロン、バット・ヤム、ヤッファの多様で公的医療に依存するコミュニティを支える医療拠点です。",
      pt: "Atendendo a uma população única e complexa em Holon, Bat Yam e Jaffa, que depende integralmente da rede pública."
    },
    pillar2Title: {
      he: "צדק חלוקתי ובריאותי",
      en: "Public Justice in Healthcare",
      fr: "Justice publique et équité en santé",
      de: "Soziale Gerechtigkeit in der Medizin",
      ar: "العدالة والمساواة الصحية",
      ru: "Справедливость и равенство в медицине",
      es: "Justicia pública en la salud",
      ja: "公正な医療へのアクセス権",
      pt: "Justiça pública na saúde"
    },
    pillar2Desc: {
      he: "האמונה הבלתי מתפשרת שהאוכלוסיות הפגיעות ביותר ראויות בדיוק לאותה נגישות לאבחון מתקדם, רפואה מותאמת אישית וטכנולוגיות עילית כמו במרכזים הרפואיים העשירים ביותר.",
      en: "The belief that the most vulnerable populations deserve the exact same access to advanced diagnostics as those in wealthier centers.",
      fr: "La conviction que les populations les plus vulnérables méritent exactement le même accès aux diagnostics avancés qu'au sein des centres les plus favorisés.",
      de: "Die feste Überzeugung, dass die schwächsten Bevölkerungsgruppen genau denselben Zugang zu modernster Diagnostik verdienen wie wohlhabendere Zentren.",
      ar: "الإيمان الراسخ بأن الفئات الأكثر ضعفاً تستحق تماماً نفس إمكانية الوصول إلى التشخيص المتقدم كما هو الحال في المراكز الطبية الأكثر ثراءً.",
      ru: "Непоколебимая вера в то, что наиболее уязвимые люди заслуживают точно такого же доступа к передовой диагностике, как и пациенты богатых клиник.",
      es: "La convicción de que los sectores vulnerables merecen el mismo acceso al diagnóstico de vanguardia que los centros más prósperos.",
      ja: "最も弱い立場にある人々も、富裕層向け病院と全く同じ高度な精密診断を受ける権利があるという信念です。",
      pt: "A convicção de que as populações vulneráveis merecem exatamente o mesmo acesso a diagnósticos avançados que os centros mais afluentes."
    },
    pillar3Title: {
      he: "דאגה עמוקה לניצולי שואה",
      en: "Caring for Holocaust Survivors",
      fr: "Soutien dévoué aux survivants de la Shoah",
      de: "Fürsorge für Holocaust-Überlebende",
      ar: "رعاية خاصة للناجين من الهولوكوست والمسنين",
      ru: "Забота о переживших Холокост",
      es: "Cuidado dedicado a sobrevivientes del Holocausto",
      ja: "ホロコースト生存者と高齢者への手厚いケア",
      pt: "Atenção dedicada aos sobreviventes do Holocausto"
    },
    pillar3Desc: {
      he: "מתן מעטפת רפואית ייעודית, רגישה תרבותית ומחבקת עבור תושבים קשישים וניצולי שואה הזקוקים לסביבת טיפול מוכרת, קרובה ורציפה.",
      en: "Providing specialized, culturally sensitive support for elderly residents and survivors who require a familiar, continuous care environment.",
      fr: "Offrir un soutien spécialisé et culturellement adapté aux personnes âgées et aux survivants nécessitant un cadre de soins familier et continu.",
      de: "Spezialisierte, kultursensible Betreuung für ältere Patienten und Überlebende, die eine vertraute, kontinuierliche Pflegeumgebung benötigen.",
      ar: "توفير رعاية متخصصة ومراعية للخصوصية الثقافية للمسنين والناجين الذين يحتاجون إلى بيئة علاجية مألوفة ومستمرة.",
      ru: "Специализированная медицинская помощь пожилым людям и пережившим Холокост в привычной, теплой и непрерывной среде заботы.",
      es: "Brindando atención especializada y sensible para adultos mayores y sobrevivientes que necesitan un entorno de cuidado familiar y continuo.",
      ja: "身近で安心できる環境で、高齢者や生存者一人ひとりに寄り添った継続的な医療ケアを提供します。",
      pt: "Oferecendo suporte especializado e sensível para idosos e sobreviventes que necessitam de um ambiente acolhedor e contínuo."
    },
    bridgeTitle: {
      he: "היעד האסטרטגי: שוויון טכנולוגי וסגירת הפער",
      en: "OUR STRATEGIC GOAL — TECHNOLOGICAL EQUITY",
      fr: "NOTRE OBJECTIF STRATÉGIQUE — ÉQUITÉ TECHNOLOGIQUE",
      de: "UNSER STRATEGISCHES ZIEL — TECHNOLOGISCHE CHANCENGLEICHHEIT",
      ar: "هدفنا الاستراتيجي — العدالة التكنولوجية وسد الفجوة",
      ru: "НАША СТРАТЕГИЧЕСКАЯ ЦЕЛЬ — ТЕХНОЛОГИЧЕСКОЕ РАВЕНСТВО",
      es: "NUESTRO OBJETIVO ESTRATÉGICO — EQUIDAD TECNOLÓGICA",
      ja: "戦略目標：医療技術の公平性と格差解消",
      pt: "NOSSO OBJETIVO ESTRATÉGICO — EQUIDADE TECNOLÓGICA"
    },
    bridgeDivide: {
      he: "סגירת פער תקציבי מובנה: 105 מיליון ₪",
      en: "CLOSING THE ECONOMIC DIVIDE: NIS 105 MILLION TURNOVER GAP",
      fr: "COMBLEMENT DE LA FRACTURE ÉCONOMIQUE : 105 MILLIONS NIS",
      de: "SCHLIESSUNG DER FINANZLÜCKE: 105 MILLIONEN NIS",
      ar: "سد الفجوة الاقتصادية: فجوة ميزانية قدرها 105 ملايين شيكل",
      ru: "ПРЕОДОЛЕНИЕ ЭКОНОМИЧЕСКОГО РАЗРЫВА: 105 МЛН ШЕКЕЛЕЙ",
      es: "CERRANDO LA BRECHA ECONÓMICA: 105 MILLONES DE NIS",
      ja: "経済的格差の是正：1億500万NISの年間予算ギャップ",
      pt: "SUPERANDO A LACUNA ECONÔMICA: 105 MILHÕES DE NIS"
    },
    bridgeSolution: {
      he: "פתרון ה-PET-CT הנייד: הבאת אבחון אונקולוגי מתקדם ישירות אל המטופלים במקום לטרטר חולים שבריריים למרכזים מרוחקים.",
      en: "The Mobile PET-CT Solution: Deploying mobile technology to bypass high infrastructure costs and provide immediate, life-saving cancer staging and precision diagnostics on campus.",
      fr: "La solution PET-CT mobile : Déployer la technologie mobile pour offrir un diagnostic précoce sur place, sans faire voyager les patients fragiles.",
      de: "Die mobile PET-CT-Lösung: Modernste Krebsdiagnostik direkt vor Ort, ohne geschwächten Patienten beschwerliche Fahrten zuzumuten.",
      ar: "حل الـ PET-CT المتنقل: توفير أحدث تقنيات التشخيص المتقدم للأورام داخل الحرم الطبي بدلاً من إرهاق المرضى بالسفر لمراكز أخرى.",
      ru: "Мобильный ПЭТ-КТ: Развертывание мобильной технологии для точной онкодиагностики на месте вместо направления ослабленных пациентов в другие клиники.",
      es: "La Solución Móvil PET-CT: Tecnología de punta para estadificación del cáncer directamente en el campus, evitando traslados extenuantes.",
      ja: "モバイルPET-CTソリューション：過酷な通院を強いることなく、キャンパス内で直接がん精密診断を実施します。",
      pt: "A Solução Móvil PET-CT: Tecnologia avançada para estadiamento do câncer diretamente no hospital, evitando deslocamentos difíceis."
    },
    viewDiagramBtn: {
      he: "צפו בתרשים החזון והגשר",
      en: "View Vision & Bridge Diagram",
      fr: "Voir le schéma de vision",
      de: "Vollständiges Diagramm ansehen",
      ar: "عرض مخطط الرؤية والجسر",
      ru: "Открыть схему миссии",
      es: "Ver diagrama de visión",
      ja: "ビジョン構造図を見る",
      pt: "Ver diagrama da visão"
    }
  };

  const getT = (key) => (missionTexts[key] && (missionTexts[key][lang] || missionTexts[key].en)) || "";

  return (
    <section 
      id="about" 
      aria-labelledby="about-mission-heading" 
      className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden bg-wolfson-navy text-white border-b border-sky-950/60"
    >
      {/* Background Campus Aerial with Deep Navy & Illuminated Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src="/images/hero-aerial.jpg"
          alt="Wolfson Medical Center Campus"
          className="w-full h-full object-cover object-center opacity-25 mix-blend-luminosity scale-105 transform motion-safe:animate-pulse-slow"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-wolfson-navy via-wolfson-navy/95 to-[#082038]/90"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-wolfson-navy via-transparent to-transparent"></div>
        
        {/* Soft Radial Ambient Glows echoing the Infographic */}
        <div className="absolute top-1/4 start-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 end-1/4 w-[30rem] h-[30rem] bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Badges Bar */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/20 text-rose-200 border border-rose-400/35 text-xs sm:text-sm font-bold backdrop-blur-md shadow-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-ping"></span>
            <span>{getT("badge")}</span>
          </div>

          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 text-xs font-semibold backdrop-blur-md">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
            <span>{t.hero.taxBadge}</span>
          </div>

          <button
            onClick={() => setIsDiagramOpen(true)}
            aria-label={getT("viewDiagramBtn")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-500/20 hover:bg-sky-500/30 text-sky-200 border border-sky-400/30 text-xs font-semibold backdrop-blur-md transition-colors cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5 text-sky-300" />
            <span>{getT("viewDiagramBtn")}</span>
          </button>
        </div>

        {/* Top Presentation Grid: Manifesto & News Frame */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start mb-12">
          
          {/* Main Manifesto Column: The Core "Why" */}
          <div className="lg:col-span-7 xl:col-span-7 space-y-6">
            <h1 id="about-mission-heading" className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              {getT("mainTitle")}
            </h1>

            {/* Authoritative Institutional Definition */}
            <p className="text-base sm:text-lg text-sky-100 font-medium leading-relaxed">
              {getT("associationIntro")}
            </p>

            {/* "Our Mission" Box */}
            <div className="p-6 rounded-2xl bg-white/[0.08] border border-white/20 backdrop-blur-md shadow-xl relative overflow-hidden">
              <div className="absolute top-0 start-0 w-2 h-full bg-gradient-to-b from-rose-500 via-amber-400 to-sky-400"></div>
              <div className="flex items-center gap-2 mb-3 text-rose-300 font-bold text-sm sm:text-base">
                <HeartHandshake className="w-5 h-5 text-rose-400 shrink-0" />
                <span>{getT("badge")}</span>
              </div>
              <p className="text-base sm:text-lg text-slate-100 leading-relaxed font-normal mb-3">
                {getT("missionStatement")}
              </p>
              <div className="pt-3 border-t border-white/10 text-xs sm:text-sm text-sky-200/90 leading-relaxed">
                {getT("communitySubtext")}
              </div>
            </div>

            {/* Direct Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
              <button
                onClick={() => onOpenDonate()}
                aria-label={lang === "he" ? "תרומה לרשת הביטחון הרפואית של וולפסון" : "Donate to our healthcare safety net"}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-base shadow-lg shadow-red-900/40 hover:shadow-red-700/50 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <Heart className="w-5 h-5 fill-white" />
                <span>{t.hero.ctaDonate}</span>
              </button>

              <a
                href="#projects"
                aria-label={lang === "he" ? "גלילה ליעדי הפיתוח והפרויקטים" : "Scroll to strategic projects"}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-base backdrop-blur-md transition-all"
              >
                <span>{t.hero.ctaProjects}</span>
                <ArrowIcon className="w-4 h-4" />
              </a>

              <a
                href="#video"
                aria-label={lang === "he" ? "צפייה בסרטון החזון של המרכז הרפואי" : "Watch vision video"}
                className="inline-flex items-center gap-2 px-4 py-3.5 rounded-xl text-slate-200 hover:text-white hover:bg-white/5 transition-all text-sm font-medium"
              >
                <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center">
                  <Play className="w-4 h-4 fill-white text-white ms-0.5" />
                </div>
                <span>{t.hero.ctaVideo}</span>
              </a>
            </div>
          </div>

          {/* Right Column: Square News Frame */}
          <div className="lg:col-span-5 xl:col-span-5 flex justify-center lg:justify-end">
            <NewsRoller lang={lang} dir={dir} />
          </div>
        </div>

        {/* ========================================================
            THE 3 PILLARS OF OUR MISSION (From the Infographic)
            ======================================================== */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-1 rounded-full bg-rose-500"></div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>{getT("badge")}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Pillar 1: A Social and Community Anchor */}
            <div className="group relative p-6 rounded-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.03] hover:from-white/[0.12] hover:to-white/[0.06] border border-white/15 hover:border-rose-400/50 transition-all duration-300 shadow-lg hover:shadow-rose-950/30 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center text-white mb-4 shadow-md shadow-rose-950/40 group-hover:scale-105 transition-transform">
                  <Users className="w-6 h-6" />
                </div>
                <div className="inline-block px-2.5 py-0.5 rounded-md bg-rose-500/20 text-rose-300 text-xs font-bold mb-2">
                  {lang === "he" ? "עוגן חברתי" : "Community Anchor"}
                </div>
                <h3 className="text-xl font-bold text-white mb-2.5">
                  {getT("pillar1Title")}
                </h3>
                <p className="text-sm text-slate-200 leading-relaxed font-normal">
                  {getT("pillar1Desc")}
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-rose-300 font-semibold">
                <span>{lang === "he" ? "חולון • בת ים • יפו" : "Holon • Bat Yam • Jaffa"}</span>
                <span className="text-slate-400">100% {lang === "he" ? "רפואה ציבורית" : "Public Medicine"}</span>
              </div>
            </div>

            {/* Pillar 2: Public Justice in Healthcare */}
            <div className="group relative p-6 rounded-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.03] hover:from-white/[0.12] hover:to-white/[0.06] border border-white/15 hover:border-sky-400/50 transition-all duration-300 shadow-lg hover:shadow-sky-950/30 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white mb-4 shadow-md shadow-sky-950/40 group-hover:scale-105 transition-transform">
                  <Scale className="w-6 h-6" />
                </div>
                <div className="inline-block px-2.5 py-0.5 rounded-md bg-sky-500/20 text-sky-300 text-xs font-bold mb-2">
                  {lang === "he" ? "צדק חלוקתי" : "Healthcare Justice"}
                </div>
                <h3 className="text-xl font-bold text-white mb-2.5">
                  {getT("pillar2Title")}
                </h3>
                <p className="text-sm text-slate-200 leading-relaxed font-normal">
                  {getT("pillar2Desc")}
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-sky-300 font-semibold">
                <span>{lang === "he" ? "נגישות שווה לאבחון עילית" : "Equal Advanced Access"}</span>
                <span className="text-slate-400">{lang === "he" ? "ללא אפליה גיאוגרפית" : "No Regional Bias"}</span>
              </div>
            </div>

            {/* Pillar 3: Caring for Holocaust Survivors */}
            <div className="group relative p-6 rounded-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.03] hover:from-white/[0.12] hover:to-white/[0.06] border border-white/15 hover:border-amber-400/50 transition-all duration-300 shadow-lg hover:shadow-amber-950/30 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center text-white mb-4 shadow-md shadow-amber-950/40 group-hover:scale-105 transition-transform">
                  <Heart className="w-6 h-6 fill-white" />
                </div>
                <div className="inline-block px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-xs font-bold mb-2">
                  {lang === "he" ? "חמלה ורגישות" : "Dignity & Compassion"}
                </div>
                <h3 className="text-xl font-bold text-white mb-2.5">
                  {getT("pillar3Title")}
                </h3>
                <p className="text-sm text-slate-200 leading-relaxed font-normal">
                  {getT("pillar3Desc")}
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-amber-300 font-semibold">
                <span>{lang === "he" ? "קשישים ושורדי שואה" : "Elderly & Survivors"}</span>
                <span className="text-slate-400">{lang === "he" ? "סביבה רציפה ומחבקת" : "Continuous Care"}</span>
              </div>
            </div>

          </div>
        </div>

        {/* ========================================================
            THE STRATEGIC GOAL & THE BRIDGE TO TECHNOLOGICAL EQUITY
            ======================================================== */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-sky-950/70 via-blue-900/60 to-slate-900/80 border border-sky-400/30 backdrop-blur-md mb-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 end-0 -mt-10 -me-10 w-64 h-64 bg-sky-500/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            <div className="lg:col-span-8 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-400/20 text-sky-200 text-xs font-bold">
                <Cpu className="w-3.5 h-3.5 text-sky-300" />
                <span>{getT("bridgeTitle")}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                {getT("bridgeDivide")}
              </h3>
              <p className="text-sm sm:text-base text-sky-100 leading-relaxed font-normal">
                {getT("bridgeSolution")}
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center items-stretch">
              <a
                href="#projects"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm shadow-md transition-all text-center"
              >
                <span>{lang === "he" ? "פרויקט ניידת PET-CT" : "PET-CT Mobile Project"}</span>
                <ArrowIcon className="w-4 h-4" />
              </a>
              <button
                onClick={() => setIsDiagramOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs transition-colors cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5 text-sky-300" />
                <span>{getT("viewDiagramBtn")}</span>
              </button>
            </div>

          </div>
        </div>

        {/* Dynamic Metric Stat Cards (The Scope of Our Work) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pt-6 border-t border-white/10">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-1">
              <Users className="w-5 h-5 text-sky-400" />
              <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {t.hero.stats.population}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              {t.hero.stats.populationLabel}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-1">
              <Building2 className="w-5 h-5 text-emerald-400" />
              <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {t.hero.stats.beds}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              {t.hero.stats.bedsLabel}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-1">
              <Activity className="w-5 h-5 text-amber-400" />
              <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {t.hero.stats.departments}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              {t.hero.stats.departmentsLabel}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-1">
              <Heart className="w-5 h-5 text-rose-400 fill-rose-400" />
              <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {t.hero.stats.vulnerable || "45%+"}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              {t.hero.stats.vulnerableLabel || (lang === "he" ? "קשישים ושורדי שואה הנשענים על שירותינו" : "Elderly & Vulnerable Relying on FWMC")}
            </p>
          </div>
        </div>

      </div>

      {/* ========================================================
          FULL INFOGRAPHIC DIAGRAM MODAL (LIGHTBOX)
          ======================================================== */}
      {isDiagramOpen && (
        <div 
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in"
          onClick={() => setIsDiagramOpen(false)}
        >
          <div 
            className="relative max-w-5xl w-full bg-slate-900 border border-slate-700 rounded-3xl p-4 sm:p-6 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                <h4 className="text-base sm:text-lg font-bold text-white">
                  {getT("mainTitle")}
                </h4>
              </div>
              <button
                onClick={() => setIsDiagramOpen(false)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                aria-label={lang === "he" ? "סגור חלון" : "Close"}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center max-h-[75vh]">
              <img
                src="/images/healthcare-equity-mission.jpg"
                alt="Friends of Wolfson Medical Center: Bridging the Gap for Healthcare Equity"
                className="w-full h-auto max-h-[75vh] object-contain rounded-xl"
              />
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
              <span>{getT("badge")}</span>
              <button
                onClick={() => setIsDiagramOpen(false)}
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold transition-colors cursor-pointer ms-auto"
              >
                {lang === "he" ? "סגור" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
