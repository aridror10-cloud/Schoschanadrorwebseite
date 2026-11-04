/**
 * Fotos der Chanukkia "Simcha" in Shoshanas Reihenfolge (01.11.26):
 * 1 brennend mit goldenem Oel (Hauptbild), 2 leere Becher auf dunklem
 * Grund, 3 ohne Becher auf hellem Grund, 4 buntes Oel, 5 schwarz,
 * 6 mit Massen 22 x 27 cm (Shoshana, 04.11.26).
 * 04.11.26 abends: weiss und gold dazu (Mail "מעוניינת להוסיף גוונים לבחירה"),
 * eingereiht hinter schwarz, die Masse bleiben am Schluss.
 * Ist die Liste leer, zeigt der Abschnitt die neun Lichter.
 */
export type ChanukaPic = { src: string; w: number; h: number; alt: { he: string; en: string } };

export const CHANUKA_PICS: ChanukaPic[] = [
  {
    src: "/carlebach/chanuka-1.webp",
    w: 1448,
    h: 1086,
    alt: {
      he: "חנוכיה קרליבך, דגם שמחה, דולקת עם שמן זהוב",
      en: "The Carlebach Menorah, Joy design, lit with golden oil",
    },
  },
  {
    src: "/carlebach/chanuka-2.webp",
    w: 1448,
    h: 1086,
    alt: {
      he: "החנוכיה עם כוסיות ריקות על רקע כהה, רואים את החיתוכים במתכת",
      en: "The menorah with empty cups on a dark background, showing the metal cutwork",
    },
  },
  {
    src: "/carlebach/chanuka-3.webp",
    w: 1448,
    h: 1086,
    alt: {
      he: "החנוכיה בלי כוסיות על רקע בהיר, רואים את מבנה החנוכיה",
      en: "The menorah without cups on a light background, showing its structure",
    },
  },
  {
    src: "/carlebach/chanuka-4.webp",
    w: 1448,
    h: 1086,
    alt: {
      he: "החנוכיה דולקת עם שמן צבעוני",
      en: "The menorah lit with colorful oil",
    },
  },
  {
    src: "/carlebach/chanuka-5.webp",
    w: 1448,
    h: 1086,
    alt: {
      he: "חנוכיה קרליבך, דגם שמחה, בגוון שחור",
      en: "The Carlebach Menorah, Joy design, in black",
    },
  },
  {
    src: "/carlebach/chanuka-7.webp",
    w: 1448,
    h: 1086,
    alt: {
      he: "חנוכיה קרליבך, דגם שמחה, בגוון לבן",
      en: "The Carlebach Menorah, Joy design, in white",
    },
  },
  {
    src: "/carlebach/chanuka-8.webp",
    w: 1448,
    h: 1086,
    alt: {
      he: "חנוכיה קרליבך, דגם שמחה, בגוון זהב",
      en: "The Carlebach Menorah, Joy design, in gold",
    },
  },
  {
    src: "/carlebach/chanuka-6.webp",
    w: 1448,
    h: 1086,
    alt: {
      he: "מידות החנוכיה: גובה 22 ס״מ, רוחב 27 ס״מ",
      en: "Menorah dimensions: 22 cm high, 27 cm wide",
    },
  },
];

/**
 * Gewuenschte Gwanim (Shoshana, 04.11.26), alle 290 ₪ (Bernard). Jede Farbe
 * ist bei SUMIT ein eigenes Produkt, damit die Farbe auf der Bestellung
 * steht. pic = Foto in CHANUKA_PICS, das beim Waehlen gross erscheint
 * (alle vier frontal auf hellem Grund, damit man vergleichen kann).
 */
export const CHANUKA_COLORS = [
  { model: "chanuka", pic: 2, swatch: "linear-gradient(135deg, #e4e6e8, #9ea3a8 55%, #d4d7da)", he: "כסוף טבעי", en: "Natural silver" },
  { model: "chanukaBlack", pic: 4, swatch: "linear-gradient(135deg, #4a4a4c, #121213 60%, #2c2c2e)", he: "שחור", en: "Black" },
  { model: "chanukaWhite", pic: 5, swatch: "linear-gradient(135deg, #ffffff, #e9e7e1 60%, #f7f6f2)", he: "לבן", en: "White" },
  { model: "chanukaGold", pic: 6, swatch: "linear-gradient(135deg, #f1d68a, #b88f2e 55%, #e3c36e)", he: "זהב", en: "Gold" },
] as const;
export type ChanukaModel = (typeof CHANUKA_COLORS)[number]["model"];
