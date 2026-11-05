import type { Pic } from "@/lib/studio";

/**
 * Artikel fuer "מאמרים ותהליכי יצירה" (Abschnitt 7 des Konzepts).
 *
 * Jeder Artikel hat Titel, Titelbild, Text mit eingestreuten Bildern,
 * verwandte Artikel und einen Weg zum Angebot oder zum Kontakt. Ein neuer
 * Artikel ist ein neuer Eintrag in dieser Liste; Uebersicht, Menuepunkt,
 * Startseiten-Abschnitt und Sitemap erscheinen dann von selbst.
 *
 * Solange die Liste leer ist, bleiben Menuepunkt und Startseiten-Abschnitt
 * verborgen (siehe components/site/SiteShell.tsx).
 */

export type Block =
  | { type: "p"; text: string }
  | { type: "h"; text: string }
  | { type: "quote"; text: string }
  | { type: "img"; pic: Pic; caption?: string }
  | { type: "list"; items: string[] }
  /** Knoepfe, z. B. Download der Vorlage oder Link nach aussen */
  | { type: "links"; items: { label: string; href: string; download?: boolean; external?: boolean; track?: string; ghost?: boolean }[] };

/* In "p" und "list" steht *so* fett, wie in Shoshanas Mails. */

export interface Article {
  slug: string;
  title: string;
  /** ISO-Datum, z. B. "2026-10-20" */
  date: string;
  /** Ein bis zwei Saetze fuer Uebersicht und Vorschau */
  excerpt: string;
  cover: Pic;
  body: Block[];
  /** Slugs verwandter Artikel */
  related?: string[];
  /** Wohin der Artikel am Ende fuehrt */
  cta?: "design" | "contact";
}

export const ARTICLES: Article[] = [
  {
    /* Shoshana, Mails "מאמר לאתר" 02.11.26 (Text) und Nachtrag mit .ai-Datei.
       Text woertlich; geaendert nur Bindestriche (Doppelpunkt/Komma) und
       "בתגובות" (die Seite hat keine Kommentare, Fotos kommen per Mail). */
    slug: "chanukiya-laser-template",
    title: "אמני העכבר והמקלדת: מרחיבים את גבולות היצירה",
    date: "2026-11-05",
    excerpt: "מה דעתכם להפוך את העיצוב הגרפי שלכם לחנוכיה אמיתית, מעשה ידיכם? תבנית וקטורית להורדה, הנחיות להכנת קובץ וכל הדרך עד לחנוכיה חתוכה בלייזר.",
    cover: {
      src: "/carlebach/chanuka-4.webp",
      alt: "חנוכיה ממתכת חתוכה בלייזר בעיצובה של שושנה דרור, דולקת עם שמן צבעוני",
      w: 1448,
      h: 1086,
    },
    body: [
      { type: "p", text: "*מה דעתכם להפוך את העיצוב הגרפי שלכם לחנוכיה אמיתית, מעשה ידיכם?*" },
      { type: "p", text: "כגרפיקאים, אנחנו רגילים לראות את היצירות שלנו בדפוס ובדיגיטל. אבל מה אם נוכל לקחת את היצירתיות שלנו צעד קדימה ולהפוך אותה למוצר שימושי שאפשר להחזיק ביד?" },
      { type: "p", text: "לקראת חנוכה, אני מזמינה אתכם להתנסות בעולם המרתק של תכנון מוצרים באמצעות חיתוך לייזר במתכת." },
      { type: "p", text: "*והפעם: חנוכיה בעיצוב אישי!*" },
      { type: "h", text: "איך זה עובד?" },
      { type: "p", text: "הכנתי עבורכם תבנית וקטורית של חנוכיה, הכוללת את המבנה הבסיסי ומיקומי הנרות. לכם נשאר לעצב את גב החנוכיה כיד הדמיון הטובה עליכם: טיפוגרפיה אמנותית, עיטורים, מוטיבים יהודיים או כל רעיון מקורי אחר." },
      { type: "p", text: "*אבל שימו לב: אנחנו לא מדפיסים על המתכת, אנחנו חותכים מתוכה!*" },
      { type: "p", text: "לכן העיצוב חייב להיות מורכב מצורות וקטוריות שטוחות בלבד, ללא תמונות פיקסלים, מעברי צבע או אפקטים גרפיים. *המכונה מתרגמת את הקווים הווקטוריים למסלולי חיתוך*, וקרן הלייזר נעה לאורכם וחותכת את המתכת בהתאם." },
      { type: "p", text: "כל צורה שנחתוך תהפוך לחלל במתכת, וכל חלק שנרצה להשאיר חייב להיות מחובר לגוף החנוכיה." },
      { type: "p", text: "לנוחותכם צירפתי לתבנית גם דף הנחיות להכנת קובץ תקין לייצור, כולל כמה שיטות פשוטות לבדיקה עצמית." },
      { type: "h", text: "מהעיצוב שלכם לחנוכיה אמיתית" },
      { type: "p", text: "את הקובץ המוכן, בפורמט *DXF*, מעלים למחשבון האוטומטי באתר מפעל *זמית*, לאחר הרשמה לאתר." },
      { type: "p", text: "מגדירים את החומר, *ברזל מגולוון בעובי 1.25 מ״מ*, ושולחים לקבלת הצעת מחיר." },
      { type: "p", text: "ולמי שיש קצת סבלנות, יש אפילו כפתור לבקשת הנחה! (-; התשובה צפויה להגיע למחרת." },
      { type: "h", text: "וכמה זה עולה?" },
      { type: "p", text: "לפי המחיר ששילמתי עבור חנוכיה בודדת:" },
      {
        type: "list",
        items: ["*חיתוך בלייזר:* כ־90 ₪ + מע״מ", "*משלוח:* 50 ₪ + מע״מ", "*איסוף עצמי:* אפשרי מאריאל, ללא עלות משלוח"],
      },
      { type: "p", text: "*בסך הכול שילמתי כ־163 ₪, כולל מע״מ ומשלוח.*" },
      { type: "p", text: "המחיר עשוי להשתנות בהתאם לעיצוב ולהצעת המפעל." },
      { type: "p", text: "*ועכשיו, נסו לשחק קצת עם הכמויות במחשבון!*" },
      { type: "p", text: "בדקו כיצד המחיר ליחידה משתנה כשמזמינים כמה חנוכיות מאותו דגם. מי יודע? אולי כבר תרצו לפרגן חנוכייה בעיצוב אישי גם לבני משפחה ולמכרים..." },
      { type: "p", text: "החנוכיה מיוצרת מברזל מגולוון בגימור המתכתי הטבעי, ללא צביעה." },
      { type: "p", text: "לאחר קבלת החלק החתוך, מבצעים את הכיפופים המיועדים לכך לזווית ישרה (90°), בהתאם להוראות, והעיצוב השטוח הופך למוצר תלת־ממדי!" },
      { type: "p", text: "לפני הדלקת נרות יש לוודא שהחנוכיה יציבה ובטוחה לשימוש." },
      { type: "h", text: "אז קדימה, יוצרים!" },
      {
        type: "links",
        items: [
          {
            label: "להורדת התבנית ודף ההוראות",
            href: "/articles/chanukiya-template/Hanukkiah_Laser_Cut_Template.zip",
            download: true,
            track: "article_template_download",
          },
          { label: "לאתר מפעל זמית", href: "https://shop.zammit.co.il/dashboard", external: true, ghost: true, track: "article_zammit" },
        ],
      },
      { type: "p", text: "בקובץ: התבנית בפורמט DXF ובפורמט Illustrator ‏(AI), ודף ההוראות בפורמט PDF." },
      { type: "h", text: "יצרתם חנוכיה משלכם? שתפו אותנו!" },
      { type: "p", text: "אשמח לראות תמונות של החנוכיות שיצרתם, יהיה מרתק לראות כמה עיצובים מקוריים יכולים לצמוח מאותה תבנית!" },
      {
        type: "links",
        items: [
          {
            label: "לשליחת תמונה במייל",
            href: "mailto:ssdror@gmail.com?subject=%D7%94%D7%97%D7%A0%D7%95%D7%9B%D7%99%D7%94%20%D7%A9%D7%9C%D7%99",
            ghost: true,
            track: "article_share_photo",
          },
        ],
      },
      { type: "p", text: "ומי יודע? אולי זו רק ההתחלה של קולקציית מוצרים משלכם..." },
      { type: "p", text: "במאמרים הבאים נכיר דרכים נוספות להפוך קווים, צורות ורעיונות למוצרים של ממש." },
    ],
    cta: "design",
  },
];

export function articleBySlug(slug: string) {
  return ARTICLES.find((a) => a.slug === slug);
}

/** Datum in hebraeischer Schreibweise, z. B. "20 באוקטובר 2026" */
export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("he-IL", { day: "numeric", month: "long", year: "numeric" }).format(
    new Date(`${iso}T12:00:00`),
  );
}
