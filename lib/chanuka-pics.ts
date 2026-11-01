/**
 * Fotos der Chanukkia "Simcha" in Shoshanas Reihenfolge (01.11.26):
 * 1 brennend mit goldenem Oel (Hauptbild), 2 leere Becher auf dunklem
 * Grund, 3 ohne Becher auf hellem Grund, 4 buntes Oel.
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
];
