/**
 * Saemtliche Texte der Landingpage in beiden Sprachen.
 * he = Hebraeisch (RTL, Startseite "/"), en = Englisch (LTR, "/en").
 *
 * Quelle: carlebach-landing-he-updated.html / carlebach-landing-en-updated.html
 * (Stand 25.08.2026). Bestellung laeuft ausschliesslich per E-Mail - die
 * frueheren WhatsApp-Links sind entfallen. Die Nachbesserungen, die in den
 * Vorlagen per Inline-Skript nachtraeglich gesetzt wurden (Betreff/Text der
 * Sonderanfrage, Text der Bestell-Baender, Entfernen von WhatsApp-Button und
 * Kuenstlerinnen-Foto), sind hier direkt eingearbeitet.
 */

export type Lang = "he" | "en";

export const EMAIL = "ssdror@gmail.com";

/**
 * Zahlseiten bei SUMIT. Alle Produkte liegen seit 27.08.26 im gemeinsamen
 * Katalog "sidrat Carlebach" (122fbi4): die Direktlinks laden ein Produkt
 * vor (und ERSETZEN einen bestehenden Warenkorb), auf der Katalogseite
 * lassen sich mehrere Modelle in einen Warenkorb legen und in einer
 * Zahlung kaufen. Versandart, Kartenzahlung und Kabala macht SUMIT.
 */
export const PAY = {
  simcha: "https://pay.sumit.co.il/11yegzt/122fbi4/11yj467/payment/",
  regesh: "https://pay.sumit.co.il/11yegzt/122fbi4/11yjc2r/payment/",
  shrika: "https://pay.sumit.co.il/11yegzt/122fbi4/11yj83b/payment/",
  set: "https://pay.sumit.co.il/11yegzt/122fbi4/11yhltr/payment/",
  /** Katalogseite mit allen Modellen - fuer Bestellungen mehrerer Designs */
  catalog: "https://pay.sumit.co.il/11yegzt/122fbi4/",
} as const;

/*
 * Fuer die Fassung ohne Pasuk gibt es bewusst keine eigenen Kurzadressen:
 * sie laeuft ueber /api/cart, denselben geprueften Weg wie der Korb.
 * Welche Werke sie ueberhaupt anbieten, steht in lib/cart.ts (HAS_PLAIN).
 */

/** Baut einen mailto-Link mit vorbefuelltem Betreff und Text. */
const mail = (subject: string, body: string) =>
  `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

export interface Piece {
  img: string;
  /** Dasselbe Werk ohne Pasuk - die Karte wechselt bei der Fassungswahl */
  imgPlain?: string;
  /** Zahlseite dieses Modells bei SUMIT */
  payHref: string;
  alt: string;
  name: string;
  desc: string;
  size: string;
  price: string;
  /** Nur EN: Zweitzeile "~$195 USD" */
  usd?: string;
}

export interface DeliveryItem {
  icon: string;
  title: string;
  sub: string;
}

export interface FaqItem {
  q: string;
  a: string;
  open?: boolean;
}

export interface FormContent {
  kicker: string;
  title: string;
  lead: string;
  labels: {
    model: string;
    version: string;
    versionWith: string;
    versionWithout: string;
    qty: string;
    name: string;
    phone: string;
    email: string;
    delivery: string;
    deliveryShip: string;
    deliveryPickup: string;
    address: string;
    notes: string;
  };
  placeholders: { name: string; phone: string; email: string; address: string; notes: string };
  /** Auswahl im Modell-Feld; value landet auch in der Mail */
  modelOptions: { value: string; label: string }[];
  /** Preishinweis unter der Modellwahl: Sonderwuensche kosten extra */
  modelNote: string;
  /** Hinweis, dass die Fassung beim Set fuer alle drei Werke gilt */
  versionSetNote: string;
  /** Anhang: Bild oder Datei zur Veranschaulichung */
  file: { label: string; hint: string; tooBig: string; remove: string };
  optional: string;
  submit: string;
  sending: string;
  successTitle: string;
  successText: string;
  errorRequired: string;
  errorModel: string;
  errorVersion: string;
  errorEmail: string;
  errorSend: string;
  /** Alternative fuer alle, die lieber selbst schreiben */
  mailAltLead: string;
  mailAltLink: string;
  privacyNote: string;
}

export interface LandingContent {
  dir: "rtl" | "ltr";
  meta: {
    title: string;
    description: string;
    ogDescription: string;
    ogLocale: string;
  };
  /** Bestell-Mail: vorbefuellte Vorlage fuer eine regulaere Bestellung */
  orderHref: string;
  /** Sonderanfrage-Mail: andere Groesse, Menge oder Sonderanfertigung */
  customHref: string;
  /** Allgemeine Anfrage aus der Kontakt-Sektion, ohne Bestell-Betreff */
  contactHref: string;
  /** Text des kleinen Sonderanfrage-Links unter den Kauf-Buttons */
  customLinkLabel: string;
  nav: {
    logoAlt: string;
    cta: string;
    switchLabel: string;
    switchHref: string;
    switchLang: Lang;
    switchDir: "rtl" | "ltr";
  };
  hero: {
    imgAlt: string;
    badge: string;
    kicker: string;
    titleLines: [string, string];
    sub: string;
    cta: string;
    scroll: string;
  };
  meet: {
    imgAlt: string;
    kicker: string;
    titleLines: [string, string];
    paras: string[];
  };
  choose: {
    kicker: string;
    title: string;
    pieces: Piece[];
    setAlt: string;
    /** Ueberschrift ueber dem Set-Foto, statt eines eigenen Kauf-Knopfes */
    bundleHeading: string;
    bundle: {
      price: string;
      usd?: string;
      save: string;
      payHref: string;
    };
  };
  /**
   * Sammel-Bestellung direkt auf der Website: an jeder Werkkarte die Wahl
   * der Fassung (mit/ohne Pasuk) und der Stueckzahl, dazu die Korb-Leiste.
   * Beim Bezahlen baut /api/cart den SUMIT-Warenkorb und leitet zur
   * Zahlseite weiter.
   */
  cart: {
    versionLabel: string;
    versionWith: string;
    versionWithout: string;
    qtyLabel: string;
    less: string;
    more: string;
    add: string;
    added: string;
    names: Record<"simcha" | "regesh" | "shrika" | "set", string>;
    title: string;
    remove: string;
    checkout: string;
    clear: string;
    sending: string;
    error: string;
  };
  /**
   * "Die Details, die den Unterschied machen" - ersetzt auf Anweisung des
   * Unternehmensberaters (Mail 27.08.26) die Sektionen Prozess, "Was
   * erhalten Sie" und "Fuer wen". Kurz, visuell, nutzenorientiert:
   * ein Hauptbild (Pasuk-Nahaufnahme) und zwei Nebenkarten.
   */
  details: {
    title: string;
    mainAlt: string;
    mainHeading: string;
    mainText: string;
    cards: { img: string; alt: string; heading: string; text: string }[];
  };
  /** Bestell-Band, erscheint zweimal: nach den Details und nach "Ueber mich" */
  orderBand: {
    title: string;
    textLines: [string, string];
    cta: string;
    customCta: string;
  };
  about: {
    kicker: string;
    title: string;
    paras: string[];
    signature: string;
  };
  charity: {
    before: string;
    strong: string;
    after: string;
    /** Grosse Zahl als Blickfang, plus Bild im dunklen Band */
    figureLabel: string;
    photoAlt: string;
  };
  pricing: {
    kicker: string;
    title: string;
    /** Nur EN: Hinweis zum Umrechnungskurs oberhalb der Preiskarten */
    currNote?: string;
    single: { name: string; price: string; usd?: string; desc: string; cta: string };
    set: { badge: string; name: string; price: string; usd?: string; desc: string; cta: string };
    delivery: DeliveryItem[];
    disclaimer: string;
  };
  faq: {
    kicker: string;
    title: string;
    items: FaqItem[];
  };
  contact: {
    kicker: string;
    title: string;
    lead: string;
    label: string;
  };
  /** Bestellformular auf der Seite */
  form: FormContent;
  finale: {
    imgAlt: string;
    title: string;
    p1Lines: [string, string];
    p2: string;
    cta: string;
    note: string;
  };
  footer: {
    logoAlt: string;
    copy: string;
  };
}

export const content: Record<Lang, LandingContent> = {
  /* ================= HEBRAEISCH ================= */
  he: {
    dir: "rtl",
    meta: {
      title: "סדרת דיוקנאות המתכת של רבי שלמה קרליבך | שושנה דרור",
      description:
        "סדרת דיוקנאות קיר ממתכת בחיתוך לייזר, בהשראת רבי שלמה קרליבך. עיצוב מקורי מאת שושנה דרור.",
      ogDescription:
        "יצירות קיר המבקשות לשמר את השמחה, הרגש והנוכחות של רבי שלמה קרליבך. עיצוב מקורי, חיתוך לייזר מדויק.",
      ogLocale: "he_IL",
    },

    orderHref: mail(
      "הזמנה – סדרת דיוקנאות רבי שלמה קרליבך",
      `שלום שושנה,
אני מעוניין/ת לבצע הזמנה מסדרת דיוקנאות רבי שלמה קרליבך.

הדגם המבוקש:
עם פסוק / בלי פסוק:
כמות:
שם:
כתובת למשלוח / איסוף:

אשמח לקבלת המשך פרטים לביצוע ההזמנה.`,
    ),
    customHref: mail(
      "בקשה להתאמה אישית – סדרת קרליבך",
      "שלום שושנה,\n\nההתאמות שהייתי רוצה לבצע הן:\n\n",
    ),
    contactHref: mail("פנייה מהאתר – סדרת קרליבך", "שלום שושנה,\n\n"),
    customLinkLabel: "מעוניינים בגודל אחר, בכמות או בהתאמה מיוחדת? פנו במייל לקבלת הצעת מחיר",

    nav: {
      logoAlt: "שושנה דרור | יודאיקה",
      cta: "לביצוע הזמנה",
      switchLabel: "EN",
      switchHref: "/en",
      switchLang: "en",
      switchDir: "ltr",
    },
    hero: {
      imgAlt: "שלושת דיוקנאות רבי שלמה קרליבך תלויים על קיר בהיר",
      badge:
        "✦ לציון היארצייט של רבי שלמה קרליבך בט״ז בחשוון, 10% מהרווחים על הזמנות שיבוצעו עד יום זה יוקדשו לצדקה",
      kicker: "קולקציית קרליבך",
      titleLines: ["סדרת דיוקנאות המתכת", "של רבי שלמה קרליבך"],
      sub: "יצירות קיר המבקשות לשמר את השמחה, הרגש והנוכחות של רבי שלמה קרליבך.",
      cta: "לביצוע הזמנה",
      scroll: "גללו להכיר את היצירות ↓",
    },
    meet: {
      imgAlt: "תקריב על דיוקן קרליבך בחיתוך לייזר",
      kicker: "הרעיון",
      titleLines: ["כשהאמנות פוגשת", "את הזיכרון"],
      paras: [
        "יש דמויות שהשפעתן ממשיכה להאיר גם שנים רבות לאחר לכתן.",
        "מתוך רצון להעניק לדמותו של רבי שלמה קרליבך ביטוי אמנותי מכובד ועל־זמני, נוצרה סדרת דיוקנאות קיר ממתכת, המעוצבת מתוך תצלומי מקור ומיוצרת בחיתוך לייזר מדויק.",
        "כל יצירה מבקשת לשמר לא רק את מראהו, אלא גם משהו מן השמחה, הרגש והנוכחות שאפיינו אותו.",
      ],
    },
    choose: {
      kicker: "שלושה דגמים",
      title: "בחרו את הדיוקן המתאים לכם",
      pieces: [
        {
          img: "/carlebach/simcha.webp",
          imgPlain: "/carlebach/simcha-plain.webp",
          payHref: PAY.simcha,
          alt: "דגם שמחה - דיוקן רבי שלמה קרליבך מנגן בגיטרה",
          name: "שמחה",
          desc: "רגע של שמחה מרוממת והארת פנים.",
          size: "גובה כ־60 ס״מ",
          price: "₪590",
        },
        {
          img: "/carlebach/regesh.webp",
          imgPlain: "/carlebach/regesh-plain.webp",
          payHref: PAY.regesh,
          alt: "דגם רגש - דיוקן רבי שלמה קרליבך שר עם פסוק משולב בעיצוב",
          name: "רגש",
          desc: "רגע של התבוננות ועומק.",
          size: "גובה כ־60 ס״מ",
          price: "₪590",
        },
        {
          img: "/carlebach/shrika.webp",
          imgPlain: "/carlebach/shrika-plain.webp",
          payHref: PAY.shrika,
          alt: "דגם שריקה - דיוקן פרופיל של רבי שלמה קרליבך",
          name: "שריקה",
          desc: "רגע של התכנסות פנימית.",
          size: "גובה כ־60 ס״מ",
          price: "₪590",
        },
      ],
      setAlt: "שלושת דגמי הקולקציה יחד על קיר",
      bundleHeading: "הסדרה המלאה במחיר מיוחד",
      bundle: {
        payHref: PAY.set,
        price: "₪1490",
        save: "חיסכון של 280 ₪ לעומת רכישה נפרדת",
      },
    },
    cart: {
      versionLabel: "גרסה",
      versionWith: "עם פסוק",
      versionWithout: "בלי פסוק",
      qtyLabel: "כמות",
      less: "פחות אחד",
      more: "עוד אחד",
      add: "הוספה לסל",
      added: "נוסף לסל ✓",
      names: { simcha: "שמחה", regesh: "רגש", shrika: "שריקה", set: "הסט המלא" },
      title: "הסל שלכם",
      remove: "הסרה מהסל",
      checkout: "מעבר לתשלום",
      clear: "ריקון הסל",
      sending: "רגע…",
      error: "משהו השתבש — נסו שוב או השתמשו בכפתורי הרכישה.",
    },
    details: {
      title: "הפרטים שעושים את ההבדל",
      mainAlt: "תקריב הפסוק — האותיות חתוכות ממש מתוך המתכת",
      mainHeading: "חתוך במתכת. חלק מהעיצוב.",
      mainText: "הפסוק נחתך בלייזר מתוך המתכת עצמה — לא מודפס ולא מודבק.",
      cards: [
        {
          img: "/carlebach/detail-depth.webp",
          alt: "הדיוקן בזווית מהקיר — המרחק מהקיר והצל שנוצר מאחוריו",
          heading: "עומק ונוכחות",
          text: "ההרחקה מהקיר יוצרת עומק ומשחקי אור וצל.",
        },
        {
          img: "/carlebach/detail-hang.webp",
          alt: "תקריב המתלה המכופף עם חור התלייה",
          heading: "מוכן לתלייה",
          text: "מתלים מובנים בגוף המתכת לתלייה פשוטה ומדויקת.",
        },
      ],
    },
    orderBand: {
      title: "הדיוקן שמתאים לחלל שלכם",
      textLines: [
        "בחרו את הדגם שמדבר אליכם, עם הפסוק או בלעדיו.",
        "למידה אחרת או להתאמה מיוחדת ניתן לפנות לקבלת הצעת מחיר.",
      ],
      cta: "לביצוע הזמנה",
      customCta: "בקשה להתאמה אישית",
    },
    about: {
      kicker: "מי מאחורי היצירה",
      title: "על היוצרת",
      paras: [
        "שמי שושנה דרור.",
        "במשך שנים רבות אני עוסקת בתכנון מוצרי יודאיקה לייצור תעשייתי.",
        "אני מאמינה שמוצר יהודי אינו רק חפץ שימושי או פריט נוי. הוא יכול לשאת רעיון, זיכרון וערך.",
        "בכל יצירה אני שואפת לשלב דיוק הנדסי, שפה אמנותית וכבוד לתוכן שאותו היא מבטאת.",
        "סדרת קרליבך היא הראשונה בפרויקט דיוקנאות מתכת, המתוכנן להתרחב בעתיד לדמויות נוספות.",
      ],
      signature: "שושנה דרור",
    },
    charity: {
      before: "לציון היארצייט של רבי שלמה קרליבך בט״ז בחשוון, ",
      strong:
        "10% מהרווחים על הזמנות שיבוצעו עד ט״ז בחשוון תשפ״ז (27 באוקטובר 2026) יוקדשו לצדקה",
      after: " — ברוח מורשתו של אהבת ישראל, שמחה ודאגה לזולת.",
      figureLabel: "מהרווחים לצדקה",
      photoAlt: "תקריב אווירה על דיוקן המתכת של רבי שלמה קרליבך",
    },
    pricing: {
      kicker: "רכישה",
      title: "מחירים",
      single: {
        name: "דיוקן בודד",
        price: "₪590",
        desc: "בחירת דגם אחד מתוך שמחה, רגש או שריקה — עם או בלי הפסוק התואם מתוך אחד מניגוניו של רבי שלמה קרליבך.",
        cta: "לבחירת דגם",
      },
      set: {
        badge: "הכי משתלם",
        name: "סט שלושת הדיוקנאות",
        price: "₪1490",
        desc: "הסדרה המלאה — שמחה, רגש ושריקה יחד, לקיר אחד שמספר סיפור שלם.",
        cta: "לביצוע הזמנה",
      },
      delivery: [
        { icon: "1", title: "איסוף עצמי ממודיעין עילית", sub: "ללא עלות, בתיאום מראש." },
        { icon: "2", title: "משלוח עד הבית", sub: "בעלות של 50 ₪, לכל רחבי הארץ." },
        {
          icon: "○",
          title: "הזמנות עד יום היארצייט — ט״ז בחשוון (27.10.26)",
          sub: "10% מהרווחים עליהן יוקדשו לצדקה. מועד האספקה יימסר בעת ההזמנה.",
        },
      ],
      disclaimer:
        "* הייצור נעשה לפי הזמנה. זמן האספקה הרגיל הוא עד 20 ימי עסקים; בתקופות עומס ייתכן זמן אספקה ארוך יותר, שיימסר בעת ההזמנה.",
    },
    faq: {
      kicker: "שאלות ותשובות",
      title: "שאלות נפוצות",
      items: [
        {
          q: "מאיזה חומר עשוי הדיוקן?",
          a: "אלומיניום איכותי בחיתוך לייזר ובצביעת אבקה בתנור — עמיד, קל משקל ונוח לתלייה.",
          open: true,
        },
        { q: "האם הוא מגיע מוכן לתלייה?", a: "כן." },
        {
          q: "תוך כמה זמן מתקבלת ההזמנה?",
          a: "הייצור נעשה לפי הזמנה. זמן האספקה הרגיל הוא עד 20 ימי עסקים; בתקופות עומס ייתכן זמן אספקה ארוך יותר, שיימסר בעת ההזמנה.",
        },
        { q: "אפשר להזמין מידה אחרת?", a: "כן, בתיאום מראש." },
        { q: "בעתיד יהיו דמויות נוספות?", a: "כן. הסדרה צפויה להתרחב." },
      ],
    },
    contact: {
      kicker: "יצירת קשר",
      title: "יש לכם שאלה?",
      lead: "לשאלות, הזמנות בכמות, מידה שאינה 60 ס״מ או התאמה מיוחדת — השירות ניתן במייל. לחיצה על הכפתור תפתח הודעה חדשה אליי.",
      label: "שליחת מייל",
    },
    form: {
      kicker: "התאמה אישית",
      title: "משהו אחר בראש?",
      lead: "רוצים מידה אחרת, כיתוב שונה, כמות גדולה או התאמה מיוחדת? בחרו את הדגם הקרוב למה שאתם מחפשים וספרו לי מה תרצו לשנות.",
      labels: {
        model: "הדגם המבוקש",
        version: "גרסה",
        versionWith: "עם פסוק",
        versionWithout: "בלי פסוק",
        qty: "כמות",
        name: "שם מלא",
        phone: "טלפון",
        email: "אימייל",
        delivery: "אופן קבלה",
        deliveryShip: "משלוח עד הבית (₪50)",
        deliveryPickup: "איסוף עצמי ממודיעין עילית",
        address: "כתובת למשלוח",
        notes: "ספרו לי מה תרצו להתאים",
      },
      placeholders: {
        name: "שרה כהן",
        phone: "050-0000000",
        email: "name@mail.com",
        address: "רחוב ומספר, עיר, מיקוד",
        notes: "מידה אחרת, כיתוב שונה, פסוק, צבע, כמות, גימור או כל בקשה אחרת.",
      },
      modelOptions: [
        { value: "simcha", label: "שמחה — ₪590" },
        { value: "regesh", label: "רגש — ₪590" },
        { value: "shrika", label: "שריקה — ₪590" },
        { value: "set", label: "סט שלושת הדיוקנאות — ₪1490" },
        { value: "other", label: "עדיין לא החלטתי על דגם" },
      ],
      modelNote: "המחירים המוצגים הם לדגמים הסטנדרטיים. התאמות מיוחדות יתומחרו בנפרד בהתאם לבקשה.",
      versionSetNote: "הבחירה חלה על שלושת הדגמים. לשילוב אחר, פרטו בבקשה.",
      file: {
        label: "צירוף תמונה או קובץ",
        hint: "אפשר לצרף תמונה או קובץ להמחשה (עד 2.5 מ״ב).",
        tooBig: "הקובץ גדול מדי. עד 2.5 מ״ב.",
        remove: "הסרת הקובץ",
      },
      optional: "לא חובה",
      submit: "שליחת בקשה להתאמה",
      sending: "שולח…",
      successTitle: "הבקשה התקבלה, תודה!",
      successText: "אעבור על הפרטים ואחזור אליכם במייל. העתק של הבקשה נשלח גם אליכם.",
      errorRequired: "נא למלא את השדה",
      errorModel: "נא לבחור דגם",
      errorVersion: "נא לבחור גרסה",
      errorEmail: "כתובת אימייל לא תקינה",
      errorSend: "השליחה נכשלה. נסו שוב, או כתבו ישירות אל",
      mailAltLead: "מעדיפים לכתוב בעצמכם?",
      mailAltLink: "שלחו מייל ישירות",
      privacyNote: "הפרטים משמשים לטיפול בפנייה בלבד ואינם מועברים לגורם שלישי.",
    },
    finale: {
      imgAlt: "שלושת הדיוקנאות יחד על הקיר, צילום אווירה",
      title: "יצירה שנשארת",
      p1Lines: ["יש יצירות שמוסיפות יופי לחלל.", "ויש יצירות המוסיפות גם זיכרון, השראה ונוכחות."],
      p2: "אם דמותו של רבי שלמה קרליבך יקרה ללבכם, נשמח להעניק לה מקום של כבוד בביתכם, בסטודיו או במוסד הקרוב ללבכם.",
      cta: "לביצוע הזמנה",
      note: "משלוח לכל רחבי הארץ · מיוצר לפי הזמנה · הזמנה ישירה",
    },
    footer: {
      logoAlt: "שושנה דרור — Where Meaning Takes Form",
      copy: "קולקציית קרליבך © 2026",
    },
  },

  /* ================= ENGLISCH ================= */
  en: {
    dir: "ltr",
    meta: {
      title: "The Rabbi Shlomo Carlebach Metal Portrait Series | Shoshana Dror",
      description:
        "A series of laser-cut metal wall portraits inspired by Rabbi Shlomo Carlebach. Original design by Shoshana Dror.",
      ogDescription:
        "Original metal wall art inspired by the joy, soul, and enduring presence of Rabbi Shlomo Carlebach. Precision laser-cut, made to order.",
      ogLocale: "en_US",
    },

    orderHref: mail(
      "Order – Rabbi Shlomo Carlebach Portrait Collection",
      `Hello Shoshana,
I'd like to place an order from the Rabbi Shlomo Carlebach portrait collection.

Requested design:
With verse / without verse:
Quantity:
Name:
Shipping address / pickup:

Please send me the next steps to complete the order.`,
    ),
    customHref: mail(
      "Custom Order Inquiry – Rabbi Shlomo Carlebach Portrait Collection",
      "Hello Shoshana,\n\nThe changes I have in mind are:\n\n",
    ),
    contactHref: mail("Website enquiry – Carlebach Collection", "Hello Shoshana,\n\n"),
    customLinkLabel: "Looking for another size or a custom variation? Tell me what you have in mind",

    nav: {
      logoAlt: "Shoshana Dror | Judaica",
      cta: "Place an Order",
      switchLabel: "עברית",
      switchHref: "/",
      switchLang: "he",
      switchDir: "rtl",
    },
    hero: {
      imgAlt: "Three Rabbi Shlomo Carlebach portraits hanging on a bright wall",
      badge:
        "✦ In honor of Rabbi Shlomo Carlebach’s yahrzeit on the 16th of Cheshvan, 10% of the profits from orders placed by that date will be given to tzedakah",
      kicker: "The Carlebach Collection",
      titleLines: ["The Metal Portrait Series", "of Rabbi Shlomo Carlebach"],
      sub: "Original metal wall art inspired by the joy, soul, and enduring presence of Rabbi Shlomo Carlebach.",
      cta: "Place an Order",
      scroll: "Scroll to explore the collection ↓",
    },
    meet: {
      imgAlt: "Close-up of a laser-cut Carlebach portrait",
      kicker: "The Story Behind the Collection",
      titleLines: ["Art That Keeps", "a Presence Alive"],
      paras: [
        "Some people continue to light up our lives long after they are gone.",
        "This collection was created as a timeless tribute to Rabbi Shlomo Carlebach — known to so many simply as Reb Shlomo. Each portrait begins with an original photograph, is carefully translated into line and form, and is precision-cut in metal.",
        "The goal is not only to capture his likeness, but to bring something of his warmth, joy, and spiritual depth into the spaces where Jewish life is lived.",
      ],
    },
    choose: {
      kicker: "Three Designs",
      title: "Find the Portrait That Speaks to You",
      pieces: [
        {
          img: "/carlebach/simcha.webp",
          imgPlain: "/carlebach/simcha-plain.webp",
          payHref: PAY.simcha,
          alt: "Joy design - Rabbi Shlomo Carlebach portrait playing guitar",
          name: "Joy",
          desc: "Music, warmth, and the joy that lifted a room.",
          size: "Height approx. 60 cm (24 in)",
          price: "₪590",
          usd: "~$195 USD",
        },
        {
          img: "/carlebach/regesh.webp",
          imgPlain: "/carlebach/regesh-plain.webp",
          payHref: PAY.regesh,
          alt: "Soul design - Rabbi Shlomo Carlebach singing, with verse woven into the design",
          name: "Soul",
          desc: "A quiet moment of prayer, feeling, and depth.",
          size: "Height approx. 60 cm (24 in)",
          price: "₪590",
          usd: "~$195 USD",
        },
        {
          img: "/carlebach/shrika.webp",
          imgPlain: "/carlebach/shrika-plain.webp",
          payHref: PAY.shrika,
          alt: "Whistling design - profile portrait of Rabbi Shlomo Carlebach",
          name: "Whistling",
          desc: "An intimate gesture, filled with focus and spirit.",
          size: "Height approx. 60 cm (24 in)",
          price: "₪590",
          usd: "~$195 USD",
        },
      ],
      setAlt: "All three collection designs together on a wall",
      bundleHeading: "The Complete Collection at a Special Price",
      bundle: {
        payHref: PAY.set,
        price: "₪1490",
        usd: "~$495 USD",
        save: "Save ₪280 with the complete collection",
      },
    },
    cart: {
      versionLabel: "Version",
      versionWith: "With verse",
      versionWithout: "Without verse",
      qtyLabel: "Quantity",
      less: "One less",
      more: "One more",
      add: "Add to basket",
      added: "Added ✓",
      names: { simcha: "Joy", regesh: "Soul", shrika: "Whistling", set: "Full set" },
      title: "Your basket",
      remove: "Remove from basket",
      checkout: "Checkout",
      clear: "Clear basket",
      sending: "One moment…",
      error: "Something went wrong — please try again or use the buy buttons.",
    },
    details: {
      title: "Details That Make the Difference",
      mainAlt: "Close-up of the verse — the letters are cut directly from the metal",
      mainHeading: "Cut into the metal. Part of the design.",
      mainText: "The verse is laser-cut directly from the metal — not printed or applied.",
      cards: [
        {
          img: "/carlebach/detail-depth.webp",
          alt: "The portrait seen at an angle — the space from the wall and the shadow behind it",
          heading: "Depth and presence",
          text: "The space from the wall creates depth and a play of light and shadow.",
        },
        {
          img: "/carlebach/detail-hang.webp",
          alt: "Close-up of the folded hanging tab with its mounting hole",
          heading: "Ready to hang",
          text: "Integrated metal tabs for simple, precise installation.",
        },
      ],
    },
    orderBand: {
      title: "Bring the Right Portrait into Your Space",
      textLines: [
        "Choose the design that speaks to you, with or without the verse.",
        "If you have another size or a custom version in mind, I would be glad to explore it with you.",
      ],
      cta: "Place an Order",
      customCta: "Ask About a Custom Version",
    },
    about: {
      kicker: "Meet the Artist",
      title: "About the Artist",
      paras: [
        "My name is Shoshana Dror.",
        "For more than two decades, I have designed Judaica for professional and industrial production.",
        "I believe Jewish art can do more than beautify a room. It can hold a memory, express a value, and make something meaningful present in everyday life.",
        "My work brings together technical precision, an original artistic language, and deep respect for the story each piece carries.",
        "The Carlebach Collection is the first in a metal portrait project, planned to grow to further figures in the future.",
      ],
      signature: "Shoshana Dror",
    },
    charity: {
      before: "To mark Rabbi Shlomo Carlebach’s yahrzeit on the 16th of Cheshvan, ",
      strong:
        "10% of the profits from orders placed by 16 Cheshvan 5787 (October 27, 2026) will be donated to tzedakah",
      after:
        " — carrying forward, in a small way, his legacy of ahavat Yisrael, joy, and care for every soul.",
      figureLabel: "of profits to tzedakah",
      photoAlt: "Atmospheric close-up of the Rabbi Shlomo Carlebach metal portrait",
    },
    pricing: {
      kicker: "Purchase",
      title: "Pricing",
      currNote:
        "Prices shown in USD are approximate (~$1 = ₪3.00) and may vary slightly by the time of checkout — you will be charged in ILS.",
      single: {
        name: "Single Portrait",
        price: "₪590",
        usd: "~$195 USD",
        desc: "Choose Joy, Soul, or Whistling — with or without its corresponding Hebrew verse set to one of Reb Shlomo’s melodies.",
        cta: "Choose your design",
      },
      set: {
        badge: "Best Value",
        name: "Full Set of Three Portraits",
        price: "₪1490",
        usd: "~$495 USD",
        desc: "Joy, Soul, and Whistling together — three portraits that bring the full spirit of the collection to one wall.",
        cta: "Place an Order",
      },
      delivery: [
        { icon: "1", title: "Self-pickup from Modi'in Illit", sub: "Free of charge, by prior arrangement." },
        { icon: "2", title: "Home delivery", sub: "₪50, nationwide." },
        {
          icon: "○",
          title: "Orders placed by the yahrzeit — October 27, 2026",
          sub: "Ten percent of the profits will be given to tzedakah. Delivery timing will be confirmed when you order.",
        },
        {
          icon: "3",
          title: "Orders outside Israel",
          sub: "Please email for availability, shipping, and fulfillment pricing.",
        },
      ],
      disclaimer:
        "* Each piece is made to order. Standard lead time is up to 20 business days; during peak periods, a longer lead time may apply and will be confirmed when you order.",
    },
    faq: {
      kicker: "Q&A",
      title: "Frequently Asked Questions",
      items: [
        {
          q: "What material is the portrait made of?",
          a: "High-quality laser-cut aluminum with an oven-baked powder coating — durable, lightweight, and easy to hang.",
          open: true,
        },
        { q: "Does it arrive ready to hang?", a: "Yes." },
        {
          q: "How long until my order arrives?",
          a: "Each piece is made to order. Standard lead time is up to 20 business days; during peak periods, a longer lead time may apply and will be confirmed when you order.",
        },
        { q: "Can I order a different size?", a: "Yes, by prior arrangement." },
        { q: "Will there be more figures in the future?", a: "Yes — the series is expected to grow." },
      ],
    },
    contact: {
      kicker: "Get in Touch",
      title: "Have a Question?",
      lead: "Have a question, need a larger quantity, or envision a different size? Send me a note and tell me what you have in mind.",
      label: "Email Me",
    },
    form: {
      kicker: "A custom piece",
      title: "Something else in mind?",
      lead: "Would you like a different size, different lettering, a larger quantity or another adaptation? Pick the design closest to what you have in mind and tell me what you would like to change.",
      labels: {
        model: "Which design",
        version: "Version",
        versionWith: "With the verse",
        versionWithout: "Without the verse",
        qty: "Quantity",
        name: "Full name",
        phone: "Phone",
        email: "Email",
        delivery: "How would you like to receive it",
        deliveryShip: "Home delivery (₪50)",
        deliveryPickup: "Self-pickup from Modi'in Illit",
        address: "Shipping address",
        notes: "Tell me what you would like to adapt",
      },
      placeholders: {
        name: "Sarah Cohen",
        phone: "+972 50-000-0000",
        email: "name@mail.com",
        address: "Street and number, city, postal code, country",
        notes: "A different size, different lettering, the verse, colour, quantity, finish, or any other request.",
      },
      modelOptions: [
        { value: "simcha", label: "Joy — ₪590" },
        { value: "regesh", label: "Soul — ₪590" },
        { value: "shrika", label: "Whistling — ₪590" },
        { value: "set", label: "Full set of three — ₪1490" },
        { value: "other", label: "Not decided on a design yet" },
      ],
      modelNote: "The prices shown are for the standard designs. Custom adaptations are quoted separately, based on your request.",
      versionSetNote: "The choice applies to all three designs. For a different mix, just say so in your request.",
      file: {
        label: "Attach an image or file",
        hint: "You can attach an image or file to illustrate what you mean (up to 2.5 MB).",
        tooBig: "That file is too large. Up to 2.5 MB, please.",
        remove: "Remove the file",
      },
      optional: "optional",
      submit: "Send custom request",
      sending: "Sending…",
      successTitle: "Thank you, your request came through!",
      successText: "I'll go through the details and get back to you by email. A copy is on its way to your inbox.",
      errorRequired: "Please fill in this field",
      errorModel: "Please choose a design",
      errorVersion: "Please choose a version",
      errorEmail: "That email address doesn't look right",
      errorSend: "Sending failed. Please try again, or write directly to",
      mailAltLead: "Prefer to write it yourself?",
      mailAltLink: "Send an email instead",
      privacyNote: "Your details are used only to handle your enquiry and are never passed to a third party.",
    },
    finale: {
      imgAlt: "All three portraits together on the wall, mood photograph",
      title: "More Than Something Beautiful",
      p1Lines: [
        "Some art transforms a wall.",
        "Some also carries memory, inspiration, and soul.",
      ],
      p2: "If Reb Shlomo’s music and message have a place in your heart, this collection offers a meaningful way to give that connection a place in your home, studio, or Jewish community.",
      cta: "Place an Order",
      note: "Israel-wide shipping · Made to order · Direct ordering",
    },
    footer: {
      logoAlt: "Shoshana Dror — Where Meaning Takes Form",
      copy: "The Carlebach Collection © 2026",
    },
  },
};
