/**
 * Saemtliche Texte der Landingpage in beiden Sprachen.
 * he = Hebraeisch (RTL, Startseite "/"), en = Englisch (LTR, "/en").
 * Quelle: die finalen Design-Vorlagen carlebach-landing-he-final.html /
 * carlebach-landing-en-final.html - Texte und WhatsApp-Links unveraendert
 * uebernommen.
 */

export type Lang = "he" | "en";

export interface Piece {
  img: string;
  alt: string;
  name: string;
  desc: string;
  size: string;
  price: string;
  /** Nur EN: Zweitzeile "≈ $185 USD" */
  usd?: string;
  href: string;
  cta: string;
}

export interface ProcessStep {
  label: string;
  img?: string;
  alt?: string;
  /** Schritt ohne Foto (Laserschnitt) traegt stattdessen eine Fussnote */
  note?: string;
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

export interface LandingContent {
  dir: "rtl" | "ltr";
  meta: {
    title: string;
    description: string;
    ogDescription: string;
    ogLocale: string;
  };
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
    toggle: {
      intro: string;
      options: [string, string];
      note: string;
    };
    pieces: Piece[];
    setAlt: string;
    setCaption: string;
    bundle: {
      price: string;
      usd?: string;
      save: string;
      href: string;
      cta: string;
    };
  };
  process: {
    title: string;
    sub: string;
    steps: ProcessStep[];
  };
  get: {
    title: string;
    items: string[];
  };
  whofor: {
    imgAlt: string;
    kicker: string;
    title: string;
    lead: string;
    list: string[];
  };
  about: {
    imgAlt: string;
    kicker: string;
    title: string;
    paras: string[];
    signature: string;
  };
  charity: {
    before: string;
    strong: string;
    after: string;
  };
  pricing: {
    kicker: string;
    title: string;
    /** Nur EN: Hinweis zum Umrechnungskurs oberhalb der Preiskarten */
    currNote?: string;
    single: { name: string; price: string; usd?: string; desc: string; href: string; cta: string };
    set: { badge: string; name: string; price: string; usd?: string; desc: string; href: string; cta: string };
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
    email: string;
    phoneLabel: string;
    phoneHref: string;
    waLabel: string;
    waHref: string;
  };
  finale: {
    imgAlt: string;
    title: string;
    p1Lines: [string, string];
    p2: string;
    href: string;
    cta: string;
    note: string;
  };
  footer: {
    logoAlt: string;
    copy: string;
  };
}

const wa = "https://wa.me/972533142341?text=";

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
    nav: {
      logoAlt: "שושנה דרור | יודאיקה",
      cta: "לרכישה",
      switchLabel: "EN",
      switchHref: "/en",
      switchLang: "en",
      switchDir: "ltr",
    },
    hero: {
      imgAlt: "שלושת דיוקנאות רבי שלמה קרליבך תלויים על קיר בהיר",
      badge: "✦ מבצע השקה: 10% מהרווחים לתרומה לצדקה, עד ערב סוכות (25.9.26)",
      kicker: "קולקציית קרליבך",
      titleLines: ["סדרת דיוקנאות המתכת", "של רבי שלמה קרליבך"],
      sub: "יצירות קיר המבקשות לשמר את השמחה, הרגש והנוכחות של רבי שלמה קרליבך.",
      cta: "רכשו את הסדרה",
      scroll: "גללו להכיר את היצירות ↓",
    },
    meet: {
      imgAlt: "תקריב על דיוקן קרליבך בחיתוך לייזר",
      kicker: "הרעיון",
      titleLines: ["כשהאמנות פוגשת", "את הזיכרון"],
      paras: [
        "יש דמויות שהשפעתן ממשיכה להאיר גם שנים רבות לאחר לכתן.",
        "מתוך רצון להעניק לדמותו של רבי שלמה קרליבך ביטוי אמנותי מכובד ועל־זמני, נוצרה סדרת דיוקנאות קיר ממתכת, המעוצבת מתוך תצלומי מקור ומיוצרת בחיתוך לייזר מדויק.",
        "כל יצירה נועדה לשמר לא רק את מראהו, אלא גם את אופייה הייחודי של הדמות.",
      ],
    },
    choose: {
      kicker: "שלושה דגמים",
      title: "בחרו את הדיוקן המתאים לכם",
      toggle: {
        intro: "כל אחד מן הדיוקנאות זמין בשתי גרסאות לבחירתכם:",
        options: [
          "דיוקן עם הפסוק המשולב בעיצוב (כמוצג בתמונות)",
          "דיוקן ללא הפסוק — למראה נקי ומינימליסטי",
        ],
        note: "בחרו את הגרסה המועדפת עליכם בעת ההזמנה",
      },
      pieces: [
        {
          img: "/carlebach/simcha.webp",
          alt: "דגם שמחה - דיוקן רבי שלמה קרליבך מנגן בגיטרה",
          name: "שמחה",
          desc: "רגע של שמחה מרוממת והארת פנים.",
          size: "גובה כ־60 ס״מ",
          price: "₪550",
          href: `${wa}%D7%A9%D7%9C%D7%95%D7%9D%2C%20%D7%90%D7%A0%D7%99%20%D7%9E%D7%A2%D7%95%D7%A0%D7%99%D7%99%D7%A0%D7%AA%20%D7%91%D7%93%D7%99%D7%95%D7%A7%D7%9F%20%D7%A9%D7%9E%D7%97%D7%94%20%28%E2%82%AA550%29.`,
          cta: "רכישת דגם זה",
        },
        {
          img: "/carlebach/regesh.webp",
          alt: "דגם רגש - דיוקן רבי שלמה קרליבך שר עם פסוק משולב בעיצוב",
          name: "רגש",
          desc: "רגע של התבוננות ועומק.",
          size: "גובה כ־60 ס״מ",
          price: "₪550",
          href: `${wa}%D7%A9%D7%9C%D7%95%D7%9D%2C%20%D7%90%D7%A0%D7%99%20%D7%9E%D7%A2%D7%95%D7%A0%D7%99%D7%99%D7%A0%D7%AA%20%D7%91%D7%93%D7%99%D7%95%D7%A7%D7%9F%20%D7%A8%D7%92%D7%A9%20%28%E2%82%AA550%29.`,
          cta: "רכישת דגם זה",
        },
        {
          img: "/carlebach/shrika.webp",
          alt: "דגם שריקה - דיוקן פרופיל של רבי שלמה קרליבך",
          name: "שריקה",
          desc: "רגע של התכנסות פנימית.",
          size: "גובה כ־60 ס״מ",
          price: "₪550",
          href: `${wa}%D7%A9%D7%9C%D7%95%D7%9D%2C%20%D7%90%D7%A0%D7%99%20%D7%9E%D7%A2%D7%95%D7%A0%D7%99%D7%99%D7%A0%D7%AA%20%D7%91%D7%93%D7%99%D7%95%D7%A7%D7%9F%20%D7%A9%D7%A8%D7%99%D7%A7%D7%94%20%28%E2%82%AA550%29.`,
          cta: "רכישת דגם זה",
        },
      ],
      setAlt: "שלושת דגמי הקולקציה יחד על קיר",
      setCaption: "כך זה ייראה אצלכם בבית",
      bundle: {
        price: "₪1300",
        save: "חיסכון של 350 ₪ לעומת רכישה נפרדת",
        href: `${wa}%D7%A9%D7%9C%D7%95%D7%9D%2C%20%D7%90%D7%A0%D7%99%20%D7%9E%D7%A2%D7%95%D7%A0%D7%99%D7%99%D7%A0%D7%AA%20%D7%91%D7%A8%D7%9B%D7%99%D7%A9%D7%AA%20%D7%94%D7%A1%D7%93%D7%A8%D7%94%20%D7%94%D7%9E%D7%9C%D7%90%D7%94%20-%20%D7%A9%D7%9C%D7%95%D7%A9%D7%AA%20%D7%94%D7%93%D7%99%D7%95%D7%A7%D7%A0%D7%90%D7%95%D7%AA%20%28%E2%82%AA1300%29.`,
        cta: "רכישת הסדרה המלאה",
      },
    },
    process: {
      title: "כך נוצרת כל יצירה",
      sub: "התמונות מתעדות דיוקן שיצרתי לזכר אבי ז״ל, באותה שיטת עבודה בדיוק — משלב הרעיון ועד הקיר.",
      steps: [
        { label: "צילום המקור", img: "/carlebach/process-1.webp", alt: "תצלום המקור" },
        { label: "עיצוב במחשב", img: "/carlebach/process-2.webp", alt: "עיצוב וקטורי במחשב" },
        { label: "תכנון החיתוך", img: "/carlebach/process-3.webp", alt: "תכנון נקודות החיתוך" },
        { label: "חיתוך הלייזר", note: "* לא תועד בזמן אמת" },
        { label: "צביעה", img: "/carlebach/process-5.webp", alt: "צביעת אבקה בתנור" },
        { label: "תלייה על הקיר", img: "/carlebach/process-6.webp", alt: "הדיוקן תלוי על הקיר" },
      ],
    },
    get: {
      title: "מה תקבלו",
      items: [
        "חיתוך לייזר מדויק",
        "מתכת איכותית",
        "צביעה בתנור",
        "מוכן לתלייה",
        "גובה כ־60 ס״מ",
        "עיצוב מקורי",
      ],
    },
    whofor: {
      imgAlt: "דיוקנאות קרליבך תלויים בסלון אמיתי מעל ספה",
      kicker: "התאמה",
      title: "למי מיועדת הסדרה",
      lead: "לבתים המבקשים לשלב אמנות יהודית בעלת משמעות. מתאימה במיוחד ל:",
      list: [
        "סלון",
        "חדר עבודה",
        "ספרייה",
        "סטודיו",
        "אולפן הקלטות",
        "מוסד חינוכי",
        "מתנה מכובדת לתורמים",
        "לכל מי שחש חיבור לדמותו של רבי שלמה קרליבך",
      ],
    },
    about: {
      imgAlt: "שושנה בתהליך העיצוב של דיוקן קרליבך",
      kicker: "מי מאחורי היצירה",
      title: "על היוצרת",
      paras: [
        "שמי שושנה דרור.",
        "במשך שנים רבות אני עוסקת בתכנון מוצרי יודאיקה לייצור תעשייתי.",
        "אני מאמינה שמוצר יהודי אינו רק חפץ שימושי או פריט נוי. הוא יכול לשאת רעיון, זיכרון וערך.",
        "בכל יצירה אני שואפת לשלב דיוק הנדסי, שפה אמנותית וכבוד לתוכן שאותו היא מבטאת.",
        "סדרת קרליבך היא הראשונה בסדרת דיוקנאות מתכת המתוכננת להתרחב לדמויות נוספות בעתיד.",
      ],
      signature: "שושנה דרור",
    },
    charity: {
      before:
        "לרגל השקת הקולקציה, ובתוקף עד ערב חג הסוכות (י״ד בתשרי תשפ״ז, 25 בספטמבר 2026), ",
      strong: "10% מהרווחים יוקדשו לתרומה למוסדות צדקה",
      after:
        " — ברוח דרכו של רבי שלמה קרליבך, שפעל רבות לעזרת נזקקים ולמען הזולת.",
    },
    pricing: {
      kicker: "רכישה",
      title: "מחירים",
      single: {
        name: "דיוקן בודד",
        price: "₪550",
        desc: "בחירת דגם אחד מתוך שמחה, רגש או שריקה — עם או בלי הפסוק המשולב.",
        href: `${wa}%D7%A9%D7%9C%D7%95%D7%9D%2C%20%D7%90%D7%A0%D7%99%20%D7%9E%D7%A2%D7%95%D7%A0%D7%99%D7%99%D7%A0%D7%AA%20%D7%91%D7%A8%D7%9B%D7%99%D7%A9%D7%AA%20%D7%93%D7%99%D7%95%D7%A7%D7%9F%20%D7%91%D7%95%D7%93%D7%93%20%28%E2%82%AA550%29.%20%D7%90%D7%A9%D7%9E%D7%97%20%D7%9C%D7%A4%D7%A8%D7%98%D7%99%D7%9D%20%D7%9C%D7%92%D7%91%D7%99%20%D7%91%D7%97%D7%99%D7%A8%D7%AA%20%D7%94%D7%93%D7%92%D7%9D.`,
        cta: "רכשו עכשיו",
      },
      set: {
        badge: "הכי משתלם",
        name: "סט שלושת הדיוקנאות",
        price: "₪1300",
        desc: "הסדרה המלאה — שמחה, רגש ושריקה יחד, לקיר אחד שמספר סיפור שלם.",
        href: `${wa}%D7%A9%D7%9C%D7%95%D7%9D%2C%20%D7%90%D7%A0%D7%99%20%D7%9E%D7%A2%D7%95%D7%A0%D7%99%D7%99%D7%A0%D7%AA%20%D7%91%D7%A8%D7%9B%D7%99%D7%A9%D7%AA%20%D7%94%D7%A1%D7%93%D7%A8%D7%94%20%D7%94%D7%9E%D7%9C%D7%90%D7%94%20-%20%D7%A9%D7%9C%D7%95%D7%A9%D7%AA%20%D7%94%D7%93%D7%99%D7%95%D7%A7%D7%A0%D7%90%D7%95%D7%AA%20%28%E2%82%AA1300%29.`,
        cta: "רכשו עכשיו",
      },
      delivery: [
        { icon: "1", title: "איסוף עצמי ממודיעין עילית", sub: "ללא עלות, בתיאום מראש." },
        { icon: "2", title: "משלוח עד הבית", sub: "בעלות של 50 ₪, לכל רחבי הארץ." },
        { icon: "✓", title: "הזמינו עד י׳ באלול", sub: "קבלה מובטחת לפני ראש השנה." },
        { icon: "✓", title: "הזמינו עד י״ז באלול", sub: "קבלה מובטחת לפני סוכות." },
        {
          icon: "○",
          title: "הזמנות עד ערב סוכות (25.9.26)",
          sub: "נהנות מ-10% התרומה לצדקה, ותסופקנה במהלך חודש חשוון.",
        },
      ],
      disclaimer: "* במקרים של עומס קיצוני יתכן עיכוב של עד 30 ימי עסקים באספקה.",
    },
    faq: {
      kicker: "שאלות ותשובות",
      title: "שאלות נפוצות",
      items: [
        { q: "מאיזה חומר עשוי הדיוקן?", a: "מתכת איכותית בחיתוך לייזר, בצביעת אבקה בתנור.", open: true },
        { q: "האם הוא מגיע מוכן לתלייה?", a: "כן." },
        {
          q: "תוך כמה זמן מתקבלת ההזמנה?",
          a: "עד 20 ימי עסקים. במקרים של עומס קיצוני יתכן עיכוב של עד 30 ימי עסקים.",
        },
        { q: "אפשר להזמין מידה אחרת?", a: "כן, בתיאום מראש." },
        { q: "בעתיד יהיו דמויות נוספות?", a: "כן. הסדרה צפויה להתרחב." },
      ],
    },
    contact: {
      kicker: "יצירת קשר",
      title: "יש לכם שאלה?",
      lead: "אולי תרצו לברר על מחיר להזמנה בכמות גדולה, גודל אחר מ-60 ס״מ, או כל שאלה אחרת שיש לכם - אשמח ליצירת קשר.",
      email: "ssdror@gmail.com",
      phoneLabel: "053-314-2341",
      phoneHref: "tel:+972533142341",
      waLabel: "וואטסאפ",
      waHref: `${wa}%D7%A9%D7%9C%D7%95%D7%9D%2C%20%D7%99%D7%A9%20%D7%9C%D7%99%20%D7%A9%D7%90%D7%9C%D7%94%20%D7%9C%D7%92%D7%91%D7%99%20%D7%A1%D7%93%D7%A8%D7%AA%20%D7%93%D7%99%D7%95%D7%A7%D7%A0%D7%90%D7%95%D7%AA%20%D7%A7%D7%A8%D7%9C%D7%99%D7%91%D7%9A.`,
    },
    finale: {
      imgAlt: "שלושת הדיוקנאות יחד על הקיר, צילום אווירה",
      title: "יצירה שנשארת",
      p1Lines: ["יש יצירות שמוסיפות יופי לחלל.", "ויש יצירות המוסיפות גם זיכרון, השראה ונוכחות."],
      p2: "אם דמותו של רבי שלמה קרליבך יקרה ללבכם, נשמח להעניק לה מקום של כבוד בביתכם, בסטודיו או במוסד הקרוב ללבכם.",
      href: `${wa}%D7%A9%D7%9C%D7%95%D7%9D%2C%20%D7%90%D7%A0%D7%99%20%D7%9E%D7%A2%D7%95%D7%A0%D7%99%D7%99%D7%A0%D7%AA%20%D7%91%D7%A8%D7%9B%D7%99%D7%A9%D7%AA%20%D7%A1%D7%93%D7%A8%D7%AA%20%D7%94%D7%93%D7%99%D7%95%D7%A7%D7%A0%D7%90%D7%95%D7%AA%20%D7%A9%D7%9C%20%D7%A8%D7%91%D7%99%20%D7%A9%D7%9C%D7%9E%D7%94%20%D7%A7%D7%A8%D7%9C%D7%99%D7%91%D7%9A.%20%D7%90%D7%A9%D7%9E%D7%97%20%D7%9C%D7%A4%D7%A8%D7%98%D7%99%D7%9D%20%D7%A0%D7%95%D7%A1%D7%A4%D7%99%D7%9D.`,
      cta: "רכישת הסדרה",
      note: "משלוח לכל רחבי הארץ · מיוצר לפי הזמנה · תשלום מאובטח",
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
        "Wall art crafted to preserve the joy, the feeling, and the presence of Rabbi Shlomo Carlebach. Original design, precision laser-cut.",
      ogLocale: "en_US",
    },
    nav: {
      logoAlt: "Shoshana Dror | Judaica",
      cta: "Shop Now",
      switchLabel: "עברית",
      switchHref: "/",
      switchLang: "he",
      switchDir: "rtl",
    },
    hero: {
      imgAlt: "Three Rabbi Shlomo Carlebach portraits hanging on a bright wall",
      badge: "✦ Launch Special: 10% of Proceeds to Charity, Through the Eve of Sukkot (Sept 25, 2026)",
      kicker: "The Carlebach Collection",
      titleLines: ["The Metal Portrait Series", "of Rabbi Shlomo Carlebach"],
      sub: "Wall art crafted to preserve the joy, the feeling, and the presence of Rabbi Shlomo Carlebach.",
      cta: "Shop the Collection",
      scroll: "Scroll to explore the collection ↓",
    },
    meet: {
      imgAlt: "Close-up of a laser-cut Carlebach portrait",
      kicker: "The Idea",
      titleLines: ["Where Art Meets", "Memory"],
      paras: [
        "Some figures keep shining long after they are gone.",
        "Out of a desire to give Rabbi Shlomo Carlebach a dignified, timeless artistic tribute, this series of metal wall portraits was created — designed from original photographs and produced with precision laser cutting.",
        "Each piece is designed to preserve not only his likeness, but the unique character behind it.",
      ],
    },
    choose: {
      kicker: "Three Designs",
      title: "Choose the Portrait That’s Right for You",
      toggle: {
        intro: "Each portrait is available in two versions:",
        options: [
          "Portrait with the verse integrated into the design (as shown)",
          "Portrait without the verse — for a clean, minimalist look",
        ],
        note: "Choose your preferred version when ordering",
      },
      pieces: [
        {
          img: "/carlebach/simcha.webp",
          alt: "Joy design - Rabbi Shlomo Carlebach portrait playing guitar",
          name: "Joy",
          desc: "A moment of uplifting joy and radiant warmth.",
          size: "Height approx. 60 cm (24 in)",
          price: "₪550",
          usd: "≈ $185 USD",
          href: `${wa}Hi%2C%20I%27m%20interested%20in%20the%20Joy%20portrait%20%28%E2%82%AA550%29.`,
          cta: "Buy This Piece",
        },
        {
          img: "/carlebach/regesh.webp",
          alt: "Feeling design - Rabbi Shlomo Carlebach portrait singing, with verse integrated into the design",
          name: "Feeling",
          desc: "A moment of reflection and depth.",
          size: "Height approx. 60 cm (24 in)",
          price: "₪550",
          usd: "≈ $185 USD",
          href: `${wa}Hi%2C%20I%27m%20interested%20in%20the%20Feeling%20portrait%20%28%E2%82%AA550%29.`,
          cta: "Buy This Piece",
        },
        {
          img: "/carlebach/shrika.webp",
          alt: "The Whistle design - profile portrait of Rabbi Shlomo Carlebach",
          name: "The Whistle",
          desc: "A moment of quiet, inward stillness.",
          size: "Height approx. 60 cm (24 in)",
          price: "₪550",
          usd: "≈ $185 USD",
          href: `${wa}Hi%2C%20I%27m%20interested%20in%20the%20Whistle%20portrait%20%28%E2%82%AA550%29.`,
          cta: "Buy This Piece",
        },
      ],
      setAlt: "All three collection designs together on a wall",
      setCaption: "How it will look in your home",
      bundle: {
        price: "₪1300",
        usd: "≈ $435 USD",
        save: "Save ₪350 compared to buying separately",
        href: `${wa}Hi%2C%20I%27m%20interested%20in%20the%20full%20collection%20-%20all%20three%20portraits%20%28%E2%82%AA1300%29.`,
        cta: "Buy the Full Collection",
      },
    },
    process: {
      title: "How Each Piece Is Made",
      sub: "These photos document a portrait I created in memory of my late father, using the exact same process — from concept to wall.",
      steps: [
        { label: "Source Photo", img: "/carlebach/process-1.webp", alt: "Source photograph" },
        { label: "Digital Design", img: "/carlebach/process-2.webp", alt: "Vector design on computer" },
        { label: "Cut Planning", img: "/carlebach/process-3.webp", alt: "Planning the cut points" },
        { label: "Laser Cutting", note: "* Not documented in real time" },
        { label: "Powder Coating", img: "/carlebach/process-5.webp", alt: "Oven-baked powder coating" },
        { label: "On the Wall", img: "/carlebach/process-6.webp", alt: "The portrait hanging on the wall" },
      ],
    },
    get: {
      title: "What You’ll Receive",
      items: [
        "Precision laser cutting",
        "Premium-grade metal",
        "Oven-baked coating",
        "Ready to hang",
        "Approx. 60 cm (24 in) tall",
        "Original design",
      ],
    },
    whofor: {
      imgAlt: "Carlebach portraits hanging above a sofa in a real living room",
      kicker: "A Perfect Fit",
      title: "Who This Collection Is For",
      lead: "For homes seeking to bring in meaningful Jewish art. Especially well suited to:",
      list: [
        "Living room",
        "Home office",
        "Library",
        "Studio",
        "Educational institution",
        "A distinguished gift for donors",
        "Anyone who feels a connection to Rabbi Shlomo Carlebach",
      ],
    },
    about: {
      imgAlt: "Shoshana at work designing a Carlebach portrait",
      kicker: "The Person Behind the Work",
      title: "About the Artist",
      paras: [
        "My name is Shoshana Dror.",
        "For many years, I have worked designing Judaica products for industrial production.",
        "I believe a Jewish object is never just something functional or decorative. It can carry an idea, a memory, a value.",
        "In every piece, I strive to combine engineering precision, artistic language, and respect for the content it expresses.",
        "The Carlebach series is the first in a line of metal portraits, planned to expand to additional figures in the future.",
      ],
      signature: "Shoshana Dror",
    },
    charity: {
      before:
        "In honor of the collection’s launch, running through the eve of Sukkot (14 Tishrei 5787 / September 25, 2026), ",
      strong: "10% of proceeds will be donated to charitable organizations",
      after:
        " — in the spirit of Rabbi Shlomo Carlebach, who dedicated so much of his life to helping those in need.",
    },
    pricing: {
      kicker: "Purchase",
      title: "Pricing",
      currNote:
        "Prices shown in USD are approximate (~$1 = ₪3.00) and may vary slightly by the time of checkout — you will be charged in ILS.",
      single: {
        name: "Single Portrait",
        price: "₪550",
        usd: "≈ $185 USD",
        desc: "Choose one design — Joy, Feeling, or The Whistle — with or without the integrated verse.",
        href: `${wa}Hi%2C%20I%27m%20interested%20in%20a%20single%20portrait%20%28%E2%82%AA550%29.%20I%27d%20love%20details%20on%20choosing%20a%20design.`,
        cta: "Buy Now",
      },
      set: {
        badge: "Best Value",
        name: "Full Set of Three Portraits",
        price: "₪1300",
        usd: "≈ $435 USD",
        desc: "The complete collection — Joy, Feeling, and The Whistle together, for one wall that tells a whole story.",
        href: `${wa}Hi%2C%20I%27m%20interested%20in%20the%20full%20collection%20-%20all%20three%20portraits%20%28%E2%82%AA1300%29.`,
        cta: "Buy Now",
      },
      delivery: [
        { icon: "1", title: "Self-pickup from Modi'in Illit", sub: "Free of charge, by prior arrangement." },
        { icon: "2", title: "Home delivery", sub: "₪50, nationwide." },
        { icon: "✓", title: "Order by the 10th of Elul", sub: "Guaranteed delivery before Rosh Hashanah." },
        { icon: "✓", title: "Order by the 17th of Elul", sub: "Guaranteed delivery before Sukkot." },
        {
          icon: "○",
          title: "Orders through the eve of Sukkot (Sept 25, 2026)",
          sub: "Still benefit from the 10% charity donation, delivered during the month of Cheshvan.",
        },
      ],
      disclaimer: "* In cases of extreme demand, delivery may be delayed by up to 30 business days.",
    },
    faq: {
      kicker: "Q&A",
      title: "Frequently Asked Questions",
      items: [
        {
          q: "What material is the portrait made of?",
          a: "Premium laser-cut metal with oven-baked powder coating.",
          open: true,
        },
        { q: "Does it arrive ready to hang?", a: "Yes." },
        {
          q: "How long until my order arrives?",
          a: "Up to 20 business days. In cases of extreme demand, this may extend to up to 30 business days.",
        },
        { q: "Can I order a different size?", a: "Yes, by prior arrangement." },
        { q: "Will there be more figures in the future?", a: "Yes — the series is expected to grow." },
      ],
    },
    contact: {
      kicker: "Get in Touch",
      title: "Have a Question?",
      lead: "Wondering about bulk-order pricing, a size other than 60 cm, or anything else? I'd be happy to hear from you.",
      email: "ssdror@gmail.com",
      phoneLabel: "+972 53-314-2341",
      phoneHref: "tel:+972533142341",
      waLabel: "WhatsApp",
      waHref: `${wa}Hi%2C%20I%20have%20a%20question%20about%20the%20Carlebach%20portrait%20series.`,
    },
    finale: {
      imgAlt: "All three portraits together on the wall, mood photograph",
      title: "A Piece That Stays",
      p1Lines: [
        "Some pieces add beauty to a space.",
        "Others also add memory, inspiration, and presence.",
      ],
      p2: "If Rabbi Shlomo Carlebach’s memory is dear to your heart, we would be honored to give it a place of respect in your home, studio, or the institution closest to your heart.",
      href: `${wa}Hi%2C%20I%27m%20interested%20in%20the%20Rabbi%20Shlomo%20Carlebach%20portrait%20series.%20I%27d%20love%20more%20details.`,
      cta: "Shop the Collection",
      note: "Nationwide shipping · Made to order · Secure payment",
    },
    footer: {
      logoAlt: "Shoshana Dror — Where Meaning Takes Form",
      copy: "The Carlebach Collection © 2026",
    },
  },
};
