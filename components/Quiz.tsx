"use client";

import { useState } from "react";
import { PieceControls } from "@/components/PieceControls";
import { trackEvent } from "@/lib/analytics";
import { QUIZ, scoreQuiz } from "@/lib/quiz";
import type { Lang } from "@/lib/content";

/**
 * Quiz auf der Carlebach-Seite: vier Fragen, dann ein Werk mit Korb-Knopf.
 * Jeder Schritt zaehlt anonym fuer /studio (quiz_start/answer/result).
 */
export function Quiz({ lang }: { lang: Lang }) {
  const t = QUIZ[lang];
  const n = t.questions.length;
  const [step, setStep] = useState(-1); // -1 = Start, 0..n-1 Fragen, n = Ergebnis
  const [picks, setPicks] = useState<number[]>([]);

  function start() {
    setPicks([]);
    setStep(0);
    trackEvent("quiz_start");
  }

  function choose(i: number) {
    const next = [...picks.slice(0, step), i];
    setPicks(next);
    trackEvent("quiz_answer", { q: step + 1, a: i + 1 });
    if (step + 1 < n) setStep(step + 1);
    else {
      const r = scoreQuiz(lang, next);
      trackEvent("quiz_result", { result: r.result, version: r.version, gift: r.gift });
      setStep(n);
    }
  }

  const res = step === n ? scoreQuiz(lang, picks) : null;
  const card = res ? t.results[res.result] : null;
  const q = step >= 0 && step < n ? t.questions[step] : null;

  return (
    <div className="quiz-card" data-reveal>
      {step === -1 && (
        <div className="quiz-intro">
          <div className="quiz-kicker">{t.kicker}</div>
          <h2>{t.title}</h2>
          <p>{t.lead}</p>
          <button type="button" className="quiz-start" onClick={start}>
            {t.start}
          </button>
        </div>
      )}

      {q && (
        <div className="quiz-q" key={step}>
          <div className="quiz-progress" aria-hidden="true">
            {t.questions.map((_, i) => (
              <span key={i} className={i <= step ? "on" : ""} />
            ))}
          </div>
          <div className="quiz-step">{t.step(step + 1, n)}</div>
          <h3>{q.q}</h3>
          <div className="quiz-answers">
            {q.answers.map((a, i) => (
              <button key={a.label} type="button" className={picks[step] === i ? "sel" : ""} onClick={() => choose(i)}>
                {a.label}
              </button>
            ))}
          </div>
          {step > 0 && (
            <button type="button" className="quiz-back" onClick={() => setStep(step - 1)}>
              {t.back}
            </button>
          )}
        </div>
      )}

      {res && card && (
        <div className="quiz-result">
          <div className="quiz-result-img">
            <img
              src={res.version === "without" && res.result !== "chanuka" ? card.img.replace(".webp", "-plain.webp") : card.img}
              alt=""
              loading="lazy"
            />
          </div>
          <div className="quiz-result-text">
            <div className="quiz-kicker">{t.resultKicker}</div>
            <h3>{card.title}</h3>
            <p>{card.why}</p>
            {res.gift && <p className="quiz-gift">{t.giftNote}</p>}
            <div className="quiz-price">{card.price}</div>
            {res.result !== "chanuka" && <p className="quiz-note">{t.versionNote[res.version]}</p>}
            <PieceControls model={res.result} lang={lang} initialVersion={res.version} key={`${res.result}-${res.version}`} />
            <div className="quiz-links">
              <a href={card.anchor}>{t.seeAll}</a>
              <button type="button" className="quiz-back" onClick={start}>
                {t.again}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
