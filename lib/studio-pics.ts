import type { Pic } from "@/lib/studio";

/**
 * Seitenbilder der Website "שושנה יודאיקה" (ohne Projekt- und Werkbilder,
 * die stehen direkt bei ihren Eintraegen in lib/studio.ts).
 *
 * Nur echte Fotos ihrer Arbeiten, keine KI-Nachbildungen (die erfinden
 * Schrift). Stand 18.10.26: alle Projekt- und Werkfotos von Shoshana.
 */

/** Fotos aus Shoshanas Mails vom 18.10.26 */
const tree: Pic = {
  src: "/studio/peirot-1.webp",
  alt: "מעמד העלונים פירות של נחת: עץ רימונים מוזהב עשיר בענפים ועלים, על בסיס עץ מעוצב",
  w: 1300,
  h: 1225,
};

const aron: Pic = {
  src: "/studio/dosa-2.webp",
  alt: "ארון הקודש בבית הכנסת דוסא עם התאורה דולקת ועמודי עיטור מוארים",
  w: 755,
  h: 784,
};

/** Reserve, falls ein Hochformat gebraucht wird */
export const harp: Pic = {
  src: "/studio/nevel-1.webp",
  alt: "נבל של הודיה: נבל מוזהב שגופו בנוי מאותיות, על רקע קטיפה כהה",
  w: 1050,
  h: 1400,
};

const set: Pic = {
  src: "/carlebach/set.webp",
  alt: "שלושת דיוקנאות קרליבך: שמחה, רגש ושריקה, תלויים יחד על קיר",
  w: 1600,
  h: 893,
};

/** Illustration aus ihrem Material: sie entwirft am Bildschirm den Carlebach-Dioken */
const atWork: Pic = {
  src: "/studio/about-studio.webp",
  alt: "סטודיו חמים לעיצוב: מעצבת מול מסך עם עיצוב הכיתוב לחיים, ולידה קופסת עץ חרוטה, כתובה ממוסגרת ויצירות נוספות",
  w: 1600,
  h: 901,
};

export const HOME_PICS = {
  doorDesign: tree,
  doorWorks: set,
  ideas: aron,
};

const dosaRoom: Pic = {
  src: "/studio/dosa-1.webp",
  alt: "ריהוט בית הכנסת דוסא לאחר ההתקנה: ארון הקודש, התיבה ועמוד התפילה בעץ עם עיטורי מגזרות",
  w: 1600,
  h: 1200,
};

export const DESIGN_PICS = {
  hero: dosaRoom,
};

export const ABOUT_PICS = {
  hero: atWork,
};
