/**
 * Fotos der Chanukkia "Simcha" in Shoshanas Reihenfolge (01.11.26):
 * 1 brennend mit goldenem Oel (Hauptbild), 2 leere Becher auf dunklem
 * Grund, 3 ohne Becher auf hellem Grund, 4 buntes Oel, 5 schwarz,
 * 6 mit Massen 22 x 27 cm (Shoshana, 04.11.26).
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
    src: "/carlebach/chanuka-6.webp",
    w: 1448,
    h: 1086,
    alt: {
      he: "מידות החנוכיה: גובה 22 ס״מ, רוחב 27 ס״מ",
      en: "Menorah dimensions: 22 cm high, 27 cm wide",
    },
  },
];
