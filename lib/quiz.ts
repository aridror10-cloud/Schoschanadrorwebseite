import type { Lang } from "@/lib/content";
import type { ModelKey, Version } from "@/lib/cart";

/**
 * Quiz "Welches Portraet passt zu Ihnen?" (02.11.26). Vier Fragen, jede
 * Antwort gibt Punkte fuer ein Werk. Texte als Entwurf, Shoshana liest sie
 * noch gegen. Ergebnis wird anonym gezaehlt (quiz_result, siehe /studio).
 */

export type QuizResult = Exclude<ModelKey, "sukkot" | "sukkotSet">;
type Score = Partial<Record<QuizResult, number>>;

export interface QuizAnswer {
  label: string;
  score: Score;
  /** Antwort legt die Fassung fest (mit/ohne Pasuk) */
  version?: Version;
  gift?: boolean;
}
export interface QuizQuestion {
  q: string;
  answers: QuizAnswer[];
}
export interface QuizText {
  kicker: string;
  title: string;
  lead: string;
  start: string;
  step: (i: number, n: number) => string;
  back: string;
  again: string;
  resultKicker: string;
  giftNote: string;
  versionNote: Record<Version, string>;
  seeAll: string;
  questions: QuizQuestion[];
  results: Record<QuizResult, { title: string; why: string; img: string; price: string; anchor: string }>;
}

export const QUIZ: Record<Lang, QuizText> = {
  he: {
    kicker: "שאלון קצר",
    title: "איזה דיוקן מתאים לכם?",
    lead: "ארבע שאלות קצרות, ותקבלו המלצה אישית מתוך הסדרה.",
    start: "להתחלת השאלון",
    step: (i, n) => `שאלה ${i} מתוך ${n}`,
    back: "חזרה",
    again: "לענות שוב",
    resultKicker: "ההמלצה שלנו בשבילכם",
    giftNote: "מתנה שנשארת על הקיר שנים, ומזכירה כל יום את הניגון.",
    versionNote: {
      with: "בחרנו בשבילכם את הגרסה עם הפסוק.",
      without: "בחרנו בשבילכם את הגרסה בלי פסוק.",
    },
    seeAll: "לכל הדגמים",
    questions: [
      {
        q: "בשביל מי הדיוקן?",
        answers: [
          { label: "לבית שלנו", score: {} },
          { label: "מתנה למישהו יקר", score: { simcha: 1 }, gift: true },
          { label: "לבית כנסת, ישיבה או מוסד", score: { set: 2 } },
        ],
      },
      {
        q: "איזה רגע של ר׳ שלמה הכי מדבר אליכם?",
        answers: [
          { label: "השמחה והניגון", score: { simcha: 3 } },
          { label: "הרגש והעומק של השירה", score: { regesh: 3 } },
          { label: "ההתכנסות הפנימית והשקט", score: { shrika: 3 } },
          { label: "כולם יחד", score: { set: 4 } },
        ],
      },
      {
        q: "איפה הוא יעמוד?",
        answers: [
          { label: "בסלון או בפינת האוכל", score: { simcha: 1, set: 1 } },
          { label: "בפינת מוזיקה או בחדר עבודה", score: { regesh: 1 } },
          { label: "בפינה שקטה או במסדרון", score: { shrika: 1 } },
          { label: "על קיר גדול ומרכזי", score: { set: 2 } },
        ],
      },
      {
        q: "ועוד דבר אחד:",
        answers: [
          { label: "שהפסוק יהיה חלק מהעיצוב", score: {}, version: "with" },
          { label: "עיצוב נקי, בלי פסוק", score: {}, version: "without" },
          { label: "אני מחפש משהו לחנוכה", score: { chanuka: 6 } },
        ],
      },
    ],
    results: {
      simcha: {
        title: "דגם „שמחה”",
        why: "ר׳ שלמה מנגן בגיטרה, ברגע של שמחה מרוממת. מביא לבית אור וניגון.",
        img: "/carlebach/simcha.webp",
        price: "₪590",
        anchor: "#model-simcha",
      },
      regesh: {
        title: "דגם „רגש”",
        why: "ר׳ שלמה שר מכל הלב. לאוהבי העומק והכוונה שבניגון.",
        img: "/carlebach/regesh.webp",
        price: "₪590",
        anchor: "#model-regesh",
      },
      shrika: {
        title: "דגם „שריקה”",
        why: "דיוקן פרופיל שקט ומופנם. מתאים לפינה של מחשבה ושקט.",
        img: "/carlebach/shrika.webp",
        price: "₪590",
        anchor: "#model-shrika",
      },
      set: {
        title: "הסדרה המלאה",
        why: "שלושת הרגעים יחד על קיר אחד: שמחה, רגש והתכנסות. משלוח עד הבית ללא עלות.",
        img: "/carlebach/set.webp",
        price: "₪1490",
        anchor: "#model-set",
      },
      chanuka: {
        title: "חנוכיה קרליבך, דגם „שמחה”",
        why: "חנוכיה ממתכת עם דיוקנו של ר׳ שלמה ומילות הפסוק ״אורך ימים״.",
        img: "/carlebach/chanuka-1.webp",
        price: "290 ₪",
        anchor: "#chanuka",
      },
    },
  },
  en: {
    kicker: "A short quiz",
    title: "Which portrait is right for you?",
    lead: "Four quick questions, and you get a personal recommendation from the collection.",
    start: "Start the quiz",
    step: (i, n) => `Question ${i} of ${n}`,
    back: "Back",
    again: "Answer again",
    resultKicker: "Our recommendation for you",
    giftNote: "A gift that stays on the wall for years and brings back the melody every day.",
    versionNote: {
      with: "We picked the version with the verse for you.",
      without: "We picked the version without the verse for you.",
    },
    seeAll: "See all designs",
    questions: [
      {
        q: "Who is the portrait for?",
        answers: [
          { label: "For our home", score: {} },
          { label: "A gift for someone dear", score: { simcha: 1 }, gift: true },
          { label: "For a synagogue, yeshiva or institution", score: { set: 2 } },
        ],
      },
      {
        q: "Which moment of Reb Shlomo speaks to you most?",
        answers: [
          { label: "The joy and the melody", score: { simcha: 3 } },
          { label: "The feeling and depth of the song", score: { regesh: 3 } },
          { label: "The inner calm and quiet", score: { shrika: 3 } },
          { label: "All of them together", score: { set: 4 } },
        ],
      },
      {
        q: "Where will it hang?",
        answers: [
          { label: "In the living room or dining area", score: { simcha: 1, set: 1 } },
          { label: "In a music corner or study", score: { regesh: 1 } },
          { label: "In a quiet corner or hallway", score: { shrika: 1 } },
          { label: "On a large central wall", score: { set: 2 } },
        ],
      },
      {
        q: "One more thing:",
        answers: [
          { label: "The verse should be part of the design", score: {}, version: "with" },
          { label: "A clean design without the verse", score: {}, version: "without" },
          { label: "I'm looking for something for Chanukah", score: { chanuka: 6 } },
        ],
      },
    ],
    results: {
      simcha: {
        title: "The “Joy” design",
        why: "Reb Shlomo playing the guitar in a moment of uplifting joy. It brings light and melody into the home.",
        img: "/carlebach/simcha.webp",
        price: "₪590",
        anchor: "#model-simcha",
      },
      regesh: {
        title: "The “Soul” design",
        why: "Reb Shlomo singing with all his heart. For those who love the depth and intention of the melody.",
        img: "/carlebach/regesh.webp",
        price: "₪590",
        anchor: "#model-regesh",
      },
      shrika: {
        title: "The “Whistling” design",
        why: "A quiet, inward profile portrait. Right for a corner of thought and calm.",
        img: "/carlebach/shrika.webp",
        price: "₪590",
        anchor: "#model-shrika",
      },
      set: {
        title: "The full set",
        why: "All three moments together on one wall: joy, feeling and inner calm. Free home delivery in Israel.",
        img: "/carlebach/set.webp",
        price: "₪1490",
        anchor: "#model-set",
      },
      chanuka: {
        title: "The Carlebach Menorah, “Joy” design",
        why: "A metal menorah with the portrait of Reb Shlomo and the words of the verse Orech Yamim.",
        img: "/carlebach/chanuka-1.webp",
        price: "₪290",
        anchor: "#chanuka",
      },
    },
  },
};

const ORDER: QuizResult[] = ["simcha", "regesh", "shrika", "set", "chanuka"];

export function scoreQuiz(lang: Lang, picks: number[]): { result: QuizResult; version: Version; gift: boolean } {
  const qs = QUIZ[lang].questions;
  const total: Record<QuizResult, number> = { simcha: 0, regesh: 0, shrika: 0, set: 0, chanuka: 0 };
  let version: Version = "with";
  let gift = false;
  picks.forEach((p, i) => {
    const a = qs[i]?.answers[p];
    if (!a) return;
    for (const [k, v] of Object.entries(a.score)) total[k as QuizResult] += v ?? 0;
    if (a.version) version = a.version;
    if (a.gift) gift = true;
  });
  const result = ORDER.reduce((best, k) => (total[k] > total[best] ? k : best), "simcha" as QuizResult);
  return { result, version, gift };
}
