import type { Pic } from "@/lib/studio";

/**
 * Seitenbilder der Website "שושנה יודאיקה" (ohne Projekt- und Werkbilder,
 * die stehen direkt bei ihren Eintraegen in lib/studio.ts).
 *
 * Stand 15.10.26: nur echte Fotos ihrer Arbeiten aus ihrem Portfolio,
 * keine KI-Nachbildungen (die erfinden Schrift). Fuer die Projekte und
 * Werkgruppen fehlen noch Originalfotos, dort stehen Platzhalter.
 */

/** Fotochemisch geaetzte Scheiben, Titelbild ihres Portfolios */
const etched: Pic = {
  src: "/studio/etched-discs.webp",
  alt: "שתי דסקיות מתכת בצריבה פוטוכימית, דגם ספירלה עדין בצבעי זהב ונחושת",
  w: 1139,
  h: 578,
};

/** Lasergeschnittenes Portraet mit Handschrift (Auftragsarbeit) */
const portrait: Pic = {
  src: "/studio/laser-portrait.webp",
  alt: "דיוקן מתכת בחיתוך לייזר על קיר בהיר, ובתחתיתו שורות בכתב יד חתוכות במתכת",
  w: 1200,
  h: 1474,
};

const handwriting: Pic = {
  src: "/studio/laser-handwriting.webp",
  alt: "תקריב של כתב יד עברי שנחתך במתכת כחלק מדיוקן, והצל שהוא מטיל על הקיר",
  w: 1600,
  h: 1069,
};

const set: Pic = {
  src: "/carlebach/set.webp",
  alt: "שלושת דיוקנאות קרליבך: שמחה, רגש ושריקה, תלויים יחד על קיר",
  w: 1600,
  h: 893,
};

/** Illustration aus ihrem Material: sie entwirft am Bildschirm den Carlebach-Dioken */
const atWork: Pic = {
  src: "/carlebach/artist.webp",
  alt: "איור: מעצבת יושבת מול מסך ומשרטטת דיוקן, ומעליה הדיוקן כיצירת מתכת על הקיר",
  w: 1200,
  h: 977,
};

export const HOME_PICS = {
  doorDesign: etched,
  doorWorks: set,
  ideas: handwriting,
};

export const DESIGN_PICS = {
  hero: portrait,
};

export const ABOUT_PICS = {
  hero: atWork,
};
