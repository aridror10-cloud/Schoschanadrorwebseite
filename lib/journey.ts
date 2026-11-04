/**
 * Fragenweg "יצירה משלכם" (/yetzira, 04.11.26). Sieben Fragen, jede Antwort
 * laesst einen Teil der Menora wachsen (sieben Lichter). Danach entsteht ein
 * persoenliches Projektprofil, dann Kontakt und Versand an Shoshana.
 *
 * Grundsaetze (aus den Konzept-Agenten):
 * - keine Preise, keine erfundenen Zeiten, keine Machbarkeitsversprechen
 * - Shoshana entwirft und bereitet die Fertigung vor, gefertigt wird oft beim
 *   Partner; das darf nirgends anders klingen
 * - Hebraeisch in der Mehrzahl (אתם), keine Gedankenstriche
 * - Texte als Entwurf, Shoshana liest sie gegen
 */

export type Path = "private" | "org" | "maker" | "space";

export interface Option {
  id: string;
  label: string;
  /** kleine Zeile unter der Karte */
  sub?: string;
  /** Satzstueck fuer den Schlusssatz */
  frag?: string;
  /** Foto fuer Bildkarten */
  img?: string;
}

export interface Question {
  id: "who" | "occasion" | "content" | "material" | "size" | "timing" | "idea";
  title: string;
  hint?: string;
  kind: "single" | "multi" | "text";
  /** Antworten, je nach Weg verschieden */
  options: (path: Path) => Option[];
  optional?: boolean;
}

const WHO: Option[] = [
  { id: "private", label: "לי או לאדם יקר", sub: "יצירה אישית, מתנה, אירוע משפחתי", frag: "" },
  { id: "org", label: "למוסד, לקהילה או לעסק", sub: "מתנת הוקרה, אירוע, מתנה לקהל", frag: "" },
  { id: "maker", label: "למוצר או למותג שלי", sub: "מוצר חדש, שדרוג, ערכה, קבצים לייצור", frag: "" },
  { id: "space", label: "למרחב: בית כנסת, בניין או פרויקט", sub: "מעקות, ריהוט, עיטור אדריכלי", frag: "" },
];

const OCCASION: Record<Path, Option[]> = {
  private: [
    { id: "wedding", label: "חתונה או כתובה", frag: "יצירה לחתונה" },
    { id: "woman", label: "מתנה לאישה או לאמא", frag: "מתנה אישית לאישה יקרה" },
    { id: "home", label: "בית חדש, עיצוב לבית", frag: "יצירה לבית" },
    { id: "holiday", label: "חג, למשל חנוכה", frag: "יצירה לחג" },
    { id: "rav", label: "הוקרה לרב או למורה", frag: "מתנת הוקרה אישית" },
    { id: "just", label: "בלי סיבה מיוחדת", frag: "יצירה משלכם" },
  ],
  org: [
    { id: "retire", label: "הוקרה לפורש או לפורשת", frag: "מתנת הוקרה לפרישה" },
    { id: "jubilee", label: "יובל או אירוע מיוחד", frag: "יצירה לאירוע של המוסד" },
    { id: "donors", label: "מתנה לתורמים או לקהל", frag: "מתנה לקהל שלכם" },
    { id: "synagogue", label: "ריהוט או עיטור לבית כנסת", frag: "עיטור לבית הכנסת" },
    { id: "team", label: "מתנת חג לצוות", frag: "מתנת חג לצוות" },
  ],
  maker: [
    { id: "new", label: "מוצר חדש מרעיון", frag: "מוצר חדש" },
    { id: "upgrade", label: "שדרוג מוצר קיים", frag: "מוצר קיים בגרסה משודרגת" },
    { id: "collection", label: "הרחבת קולקציה", frag: "הרחבה לקולקציה" },
    { id: "kit", label: "ערכת יצירה", frag: "ערכת יצירה" },
    { id: "files", label: "הכנת קבצים לייצור", frag: "עיצוב מוכן לייצור" },
  ],
  space: [
    { id: "railing", label: "מעקה או גדר מעוצבים", frag: "מעקה מעוצב" },
    { id: "furniture", label: "ריהוט לבית כנסת", frag: "ריהוט לבית הכנסת" },
    { id: "ceiling", label: "תקרה, ויטראז׳ או קיר", frag: "עיטור לתקרה או לקיר" },
    { id: "other", label: "אלמנט אחר במרחב", frag: "אלמנט מעוצב למרחב" },
  ],
};

const CONTENT: Option[] = [
  { id: "verse", label: "פסוק או ברכה" },
  { id: "names", label: "שמות או ראשי תיבות" },
  { id: "portrait", label: "דמות או דיוקן" },
  { id: "place", label: "מבנה או מקום, למשל ירושלים" },
  { id: "logo", label: "לוגו או סמל" },
  { id: "symbols", label: "רימונים, יונים, עצים" },
  { id: "open", label: "עוד לא יודעים" },
];

const STAGE: Option[] = [
  { id: "idea", label: "רק רעיון" },
  { id: "sketch", label: "סקיצה או השראה" },
  { id: "design", label: "עיצוב קיים" },
  { id: "product", label: "מוצר קיים" },
];

const MATERIAL: Option[] = [
  { id: "gold", label: "זהב עדין", sub: "פליז בציפוי זהב", frag: "בגימור זהב עדין", img: "/studio/crown-jerusalem.webp" },
  { id: "metal", label: "מתכת עם נוכחות", sub: "חיתוך בלייזר", frag: "במתכת בחיתוך לייזר", img: "/studio/sandovski-achdut.webp" },
  { id: "paper", label: "נייר בשכבות", sub: "מגזרת נייר", frag: "במגזרת נייר בשכבות", img: "/studio/paper-ketuba.webp" },
  { id: "acrylic", label: "אקריליק והדפסה", sub: "שקוף, צבע, זהב", frag: "באקריליק עם הדפסה", img: "/studio/schoenfeld-1.webp" },
  { id: "wood", label: "עץ ועיטור", sub: "CNC וחיתוך עץ", frag: "בעבודת עץ", img: "/studio/dosa-2.webp" },
  { id: "surprise", label: "אשמח להצעה", sub: "שושנה תציע", frag: "" },
];

const SIZE: Record<Path, Option[]> = {
  private: [
    { id: "jewel", label: "קטן, כמו תכשיט" },
    { id: "table", label: "על שולחן או מדף" },
    { id: "wall", label: "על הקיר" },
    { id: "big", label: "גדול, במרחב" },
  ],
  org: [
    { id: "1", label: "יחידה אחת" },
    { id: "dozens", label: "עשרות" },
    { id: "hundreds", label: "מאות ומעלה" },
  ],
  maker: [
    { id: "1", label: "אב טיפוס" },
    { id: "dozens", label: "עשרות" },
    { id: "hundreds", label: "מאות ומעלה" },
    { id: "series", label: "סדרה לייצור שוטף" },
  ],
  space: [
    { id: "one", label: "אלמנט אחד" },
    { id: "several", label: "כמה אלמנטים" },
    { id: "whole", label: "חלל שלם" },
  ],
};

const TIMING: Option[] = [
  { id: "date", label: "יש תאריך מסוים", frag: "עם תאריך יעד" },
  { id: "soon", label: "בתוך חודש או חודשיים", frag: "למועד קרוב" },
  { id: "open", label: "אין לחץ", frag: "בלי לחץ של זמן" },
];

export const QUESTIONS: Question[] = [
  { id: "who", title: "תמיד רציתם יצירה משלכם? למי היא מיועדת?", kind: "single", options: () => WHO },
  { id: "occasion", title: "לאיזו מטרה או לאיזה אירוע?", kind: "single", options: (p) => OCCASION[p] },
  {
    id: "content",
    title: "מה תרצו שיופיע ביצירה?",
    hint: "אפשר לבחור כמה",
    kind: "multi",
    options: (p) => (p === "maker" || p === "space" ? STAGE : CONTENT),
  },
  { id: "material", title: "איזה חומר מדבר אליכם?", kind: "single", options: () => MATERIAL },
  { id: "size", title: "באיזה היקף?", kind: "single", options: (p) => SIZE[p] },
  { id: "timing", title: "מתי זה צריך להיות מוכן?", kind: "single", options: () => TIMING },
  { id: "idea", title: "ספרו במשפט אחד על הרעיון", hint: "לא חובה, אבל זה עוזר להבין מה אתם מדמיינים", kind: "text", options: () => [], optional: true },
];

/** maker und space fragen im 3. Schritt nach dem Stand, nicht nach dem Inhalt */
export const contentTitle = (p: Path) => (p === "maker" || p === "space" ? "איפה הרעיון עומד היום?" : "מה תרצו שיופיע ביצירה?");
export const contentKind = (p: Path): "single" | "multi" => (p === "maker" || p === "space" ? "single" : "multi");

export type Answers = Partial<Record<Question["id"], string | string[]>> & { date?: string };

const one = (a: Answers, k: Question["id"]) => (typeof a[k] === "string" ? (a[k] as string) : "");
const many = (a: Answers, k: Question["id"]) => (Array.isArray(a[k]) ? (a[k] as string[]) : one(a, k) ? [one(a, k)] : []);

export function optionOf(q: Question, path: Path, id: string) {
  return q.options(path).find((o) => o.id === id);
}

/** Verwandtes echtes Werk je Anlass (nur Adressen, die es gibt) */
export const RELATED: Record<string, string> = {
  // privat
  wedding: "/works/paper-cuts",
  woman: "/works/paper-cuts",
  home: "/works/paper-cuts",
  holiday: "/carlebach",
  rav: "/design/seminar-rav-meir",
  just: "/works",
  // Institution
  retire: "/design/seminar-rav-meir",
  jubilee: "/design/nevel-shel-hodaya",
  donors: "/design/yerushalayim-shel-zahav",
  synagogue: "/design/beit-knesset",
  team: "/design/peirot-shel-nachat",
  // Hersteller
  new: "/design/smart-move",
  upgrade: "/design/haesh-sheli",
  collection: "/design/haesh-sheli",
  kit: "/design/ahavat-olam",
  files: "/design/nevel-shel-hodaya",
  // Raum
  railing: "/design/railings",
  furniture: "/design/beit-knesset",
  ceiling: "/design/vitraj-breuner",
  other: "/design/railings",
};

export interface RelatedWork {
  href: string;
  title: string;
  sub: string;
  img: string;
}

export interface Profile {
  title: string;
  sentence: string[];
  technique: { name: string; why: string };
  special: string;
  steps: { name: string; text: string }[];
  related: string;
  /** 0..1, treibt die Darstellung, wird nicht als Zahl gezeigt */
  axes: { series: number; detail: number; meaning: number; timing: number };
  priority: string[];
  formKind: "business" | "order";
}

type Tech = { name: string; why: string };
const TECH = {
  gold: { name: "צריבה פוטוכימית", why: "מתאימה לפרטים עדינים, לטקסט צפוף ולגימור מוזהב בפליז, כמו בנזר ׳ירושלים של זהב׳." },
  metal: { name: "חיתוך בלייזר במתכת", why: "מתאים לצורות נועזות וברורות, כמו בדיוקנאות קרליבך." },
  wood: { name: "CNC וחיתוך עץ", why: "חיתוך מדויק בעץ מאפשר עיטורים עדינים, כמו בריהוט בית הכנסת דוסא." },
  paper: { name: "מגזרת נייר בשכבות", why: "שכבות נייר יוצרות עומק ומשחקי אור, ואפשר לשלב הדפסה צבעונית, כמו בכתובה ׳יונים בשער׳." },
  acrylic: { name: "אקריליק והדפסה", why: "אקריליק משתלב יפה עם טקסט מוזהב, כמו בקולקציית ׳האש שלי׳." },
} satisfies Record<string, Tech>;
const techOf = (id: string): Tech | undefined => (TECH as Record<string, Tech | undefined>)[id];

export function buildProfile(a: Answers, name = ""): Profile {
  const path = (one(a, "who") || "private") as Path;
  const occ = one(a, "occasion");
  const content = many(a, "content");
  const material = one(a, "material");
  const size = one(a, "size");
  const timing = one(a, "timing");
  const idea = one(a, "idea");
  const big = ["dozens", "hundreds", "series", "whole"].includes(size);
  const huge = ["hundreds", "series"].includes(size);

  // (a) Titel
  let title = "יצירה אישית בהזמנה";
  if (path === "maker") title = occ === "files" ? "הכנת עיצוב לייצור" : occ === "kit" ? "פיתוח ערכת יצירה" : "פיתוח מוצר לייצור";
  else if (path === "space") title = "אלמנט מעוצב למרחב";
  else if (path === "org") title = occ === "synagogue" ? "עיטור לבית הכנסת" : big ? "מתנה ממותגת לקהל שלכם" : "מתנת הוקרה בהזמנה";
  else if (occ === "wedding") title = "יצירה לחתונה";
  else if (occ === "woman") title = "מתנה אישית בעיצוב מקורי";
  else if (occ === "home") title = "יצירה לבית";
  else if (occ === "holiday") title = "יצירה לחג";
  else if (occ === "rav") title = "מתנת הוקרה אישית";
  if (material === "surprise" && content.includes("open") && !idea) title = "רעיון שמחפש צורה";

  // (b) Technik
  const pickTechnique = (): Tech => {
    const t = techOf(material);
    if (t) return t;
    if (occ === "retire" || occ === "donors" || occ === "rav") return TECH.gold;
    if (occ === "wedding" || occ === "woman" || occ === "home") return TECH.paper;
    if (path === "space") return TECH.metal;
    return { name: "בחירה משותפת", why: "שושנה תציע את החומר והטכנולוגיה המתאימים אחרי שיחת האפיון." };
  };
  let technique = pickTechnique();
  if (huge) technique = { ...technique, why: `${technique.why} בכמות כזו התכנון מביא בחשבון גם את יעילות הייצור, למשל סידור יחידות רבות בכל פלטת חומר.` };

  // (c) Schritte nach Shoshanas Ablauf
  const audience = path === "org" || path === "maker" ? "על הקהל" : "על מי שיקבל את היצירה";
  const design =
    content.includes("verse") && content.includes("names")
      ? "שילוב הטקסט והשמות בקומפוזיציה טיפוגרפית קריאה."
      : content.includes("verse")
        ? "שילוב הטקסט בקומפוזיציה טיפוגרפית קריאה."
        : content.includes("names")
          ? "שילוב השמות בקומפוזיציה טיפוגרפית קריאה."
          : content.includes("logo")
        ? "שילוב הסמל בשפה העיצובית."
        : "גיבוש השפה העיצובית.";
  const steps = [
    { name: "אפיון", text: `שיחה על המטרה, ${audience} ועל התקציב.` },
    { name: "עיצוב", text: design },
    {
      name: "התאמה טכנולוגית",
      text: techOf(material) ? `התאמת העיצוב לטכניקה: ${techOf(material)!.name}.` : "בחירה משותפת של חומר וטכנולוגיה.",
    },
    {
      name: "הכנה לייצור",
      text: `קבצים מקצועיים לייצור, תיקונים וליווי מול בית המלאכה לפי הצורך.${timing === "date" ? " את לוח הזמנים נתכנן לפי התאריך שלכם." : ""}`,
    },
  ];

  // (d) Was die Idee besonders macht
  const parts: Record<string, string> = {
    verse: "פסוק או טקסט אישי",
    names: "שמות שנשארים לדורות",
    portrait: "דמות שמספרת סיפור",
    place: "מקום בעל משמעות",
    logo: "סמל שמחבר לזהות שלכם",
    symbols: "סמלים מהמסורת",
    // Stand (Hersteller, Raum)
    idea: "רעיון שמחכה לצורה",
    sketch: "סקיצה שאפשר לצאת ממנה לדרך",
    design: "עיצוב קיים שאפשר להכין לייצור",
    product: "מוצר קיים שאפשר לשדרג",
  };
  const chosen = content.map((c) => parts[c]).filter(Boolean);
  const special = chosen.length
    ? `מה שמייחד את הרעיון שלכם: ${chosen.length > 1 ? `${chosen.slice(0, -1).join(", ")} ו${chosen[chosen.length - 1]}` : chosen[0]}.`
    : "הרעיון עוד פתוח, וזה מקום טוב להתחיל ממנו.";

  // Satz aus den Antworten
  const q = (id: Question["id"]) => QUESTIONS.find((x) => x.id === id)!;
  const occFrag = optionOf(q("occasion"), path, occ)?.frag ?? "יצירה משלכם";
  const matFrag = optionOf(q("material"), path, material)?.frag ?? "";
  const timeFrag = optionOf(q("timing"), path, timing)?.frag ?? "";
  const first = `${name ? `${name}, הרעיון שלכם: ` : "אתם מדמיינים "}${occFrag}${matFrag ? ` ${matFrag}` : ""}${timeFrag ? `, ${timeFrag}` : ""}.`;
  const sentence = [first];
  if (idea) sentence.push(`ובמילים שלכם: ״${idea.slice(0, 140)}״`);
  sentence.push("מכאן מתחילה הדרך מהרעיון לצורה.");

  // (e) Achsen
  const series = { "1": 0, jewel: 0, table: 0, wall: 0.1, big: 0.2, one: 0.2, several: 0.5, dozens: 0.55, whole: 0.7, hundreds: 0.85, series: 1 }[size] ?? 0.3;
  const detail = Math.max(0, Math.min(1, 0.45 + 0.15 * (content.includes("verse") ? 1 : 0) + 0.1 * (content.includes("names") ? 1 : 0) + 0.15 * (content.includes("symbols") || content.includes("place") ? 1 : 0)));
  const meaning = path === "org" || path === "maker" || content.includes("logo") ? 1 : content.includes("names") || content.includes("verse") || occ === "wedding" ? 0 : 0.5;
  const timingAxis = { open: 0.15, soon: 0.6, date: 1 }[timing] ?? 0.4;

  // (f) Prioritaet
  const priority: string[] = [];
  if (timing === "date") priority.push("תאריך יעד");
  if (huge) priority.push("כמות גדולה");
  if (timing === "soon" && big) priority.push("זמן קצר לכמות");
  if (path === "org" || path === "maker" || path === "space") priority.push("פנייה עסקית");

  return {
    title,
    sentence,
    technique,
    special,
    steps,
    related: RELATED[occ] ?? "/works",
    axes: { series, detail, meaning, timing: timingAxis },
    priority,
    formKind: path === "private" ? "order" : "business",
  };
}

/** Lesbare Antworten fuer Mail und /studio */
export function answerRows(a: Answers): { q: string; a: string }[] {
  const path = (one(a, "who") || "private") as Path;
  const rows: { q: string; a: string }[] = [];
  for (const q of QUESTIONS) {
    const v = a[q.id];
    if (!v || (Array.isArray(v) && !v.length)) continue;
    const title = q.id === "content" ? contentTitle(path) : q.title;
    const text =
      q.kind === "text"
        ? String(v)
        : (Array.isArray(v) ? v : [v]).map((id) => (q.id === "content" ? [...CONTENT, ...STAGE] : q.options(path)).find((o) => o.id === id)?.label ?? id).join(", ");
    rows.push({ q: title, a: q.id === "timing" && a.date ? `${text} (${a.date})` : text });
  }
  return rows;
}

export const YETZIRA = {
  metaTitle: "יצירה משלכם",
  metaDescription: "כמה שאלות קצרות על הרעיון, החומר והמועד, ופרופיל פרויקט אישי ליצירה או למוצר בעיצוב שושנה דרור. ללא התחייבות.",
  kicker: "יצירה משלכם",
  lead: "כמה שאלות קצרות יעזרו לגבש את הרעיון לתמונה ברורה. משם נמשיך יחד, מהמחשבה ועד ליצירה.",
  small: "כשתי דקות, ללא התחייבות",
  back: "חזרה",
  next: "המשך",
  skip: "דילוג על השאלה",
  step: (n: number, total: number) => `שאלה ${n} מתוך ${total}`,
  resume: "נמשיך מהמקום שבו עצרתם",
  restart: "התחלה מחדש",
  dateLabel: "התאריך (לא חובה)",
  calc: ["מסדרים את התשובות שלכם", "מחברים בין הרעיון לחומר", "בונים את פרופיל הפרויקט"],
  profileKicker: "פרופיל הפרויקט שלכם",
  techHead: "הדרך המומלצת",
  stepsHead: "כך נמשיך יחד",
  relatedHead: "יצירה קרובה לרעיון שלכם",
  firstDirection: "זהו כיוון ראשוני. שושנה תבחן אותו איתכם.",
  contactHead: "לאן לשלוח את התשובה?",
  jump: "לשליחת הפרופיל לשושנה",
  contactCalm: "הפרטים ישמשו רק למענה על הפנייה הזו. בלי רשימות תפוצה ובלי פרסומות.",
  name: "שם מלא",
  namePh: "השם שלכם",
  phone: "טלפון",
  email: "אימייל",
  either: "מספיק אחד מהשניים: טלפון או אימייל",
  errName: "נא למלא שם",
  errReach: "נא למלא טלפון או אימייל",
  errEmail: "כתובת האימייל אינה תקינה",
  send: "שליחת הפרופיל לשושנה",
  sending: "הפנייה נשלחת",
  errSend: "השליחה לא הצליחה. התשובות שלכם נשמרו. אפשר לנסות שוב או לכתוב ישירות ל־ssdror@gmail.com",
  errRate: "נשלחו כבר כמה פניות מהמכשיר הזה. אפשר לנסות שוב בעוד שעה או לכתוב ישירות ל־ssdror@gmail.com",
  thanksTitle: "תודה, הרעיון שלכם אצלי",
  thanksText: "אעבור על התשובות בתשומת לב ואחזור אליכם בהקדם.",
  slogan: "כשמשמעות לובשת צורה",
  stageNote: "עם כל תשובה, הרעיון שלכם לובש צורה",
  linkWorks: "לגלריית היצירות",
  linkProjects: "לצפייה בפרויקטים",
  privacy: "מדיניות פרטיות",
};
