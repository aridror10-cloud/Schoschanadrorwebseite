"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { track } from "@/lib/pixel";
import { readRef } from "@/lib/ref";
import {
  QUESTIONS,
  YETZIRA,
  answerRows,
  buildProfile,
  contentKind,
  contentTitle,
  type Answers,
  type Option,
  type Path,
  type RelatedWork,
} from "@/lib/journey";
import { ARCS, DROP } from "./Ornaments";
import { STAGE_VIEW, runGoldParticles } from "./goldParticles";

/**
 * Fragenweg "יצירה משלכם" (04.11.26). Sieben Fragen bauen die Menora:
 * Antworten 1 bis 6 lassen je einen Arm wachsen (rechts, links, von aussen
 * nach innen), Antwort 7 den Schaft. Beim Auswerten fliegt auf dem Desktop
 * Goldstaub auf die Arme, die Menora wird golden, sieben Flammen zuenden von
 * der Mitte aus. Dann Profil, Kontakt, Versand: der Knopf wird zum Tropfen.
 * Zustand liegt in sessionStorage (ohne Kontaktdaten), jeder Schritt als
 * ?q=n, damit der Zurueck-Knopf des Browsers einen Schritt zurueck geht.
 */

type Phase = "ask" | "calc" | "profile" | "sending" | "sent";
const KEY = "sj_yetzira";
const TOTAL = QUESTIONS.length;

/** Reihenfolge der wachsenden Arme: rechts aussen, links aussen, ... */
const ARM_ORDER: [side: "r" | "l", arc: number][] = [
  ["r", 0],
  ["l", 0],
  ["r", 1],
  ["l", 1],
  ["r", 2],
  ["l", 2],
];
/** Flammen: Spitzen der Boegen und die Mitte (hoeher, wie der Schamasch) */
const FLAMES = [
  { x: -221, y: 12, d: 3 },
  { x: -129, y: 12, d: 2 },
  { x: -28, y: 12, d: 1 },
  { x: 0, y: -36, d: 0 },
  { x: 28, y: 12, d: 1 },
  { x: 129, y: 12, d: 2 },
  { x: 221, y: 12, d: 3 },
];

/** Index der ersten unbeantworteten Pflichtfrage, TOTAL - 1 wenn alles da ist */
function firstMissing(a: Answers) {
  for (let i = 0; i < TOTAL - 1; i++) {
    const v = a[QUESTIONS[i]!.id];
    if (Array.isArray(v) ? v.length === 0 : !v) return i;
  }
  return TOTAL - 1;
}

/** Holt den Fragenweg wieder ins Bild, wenn die neue Frage ausserhalb liegt */
function bringIntoView(head: HTMLElement | null, force = false) {
  if (typeof window === "undefined") return;
  const box = document.querySelector(".yz");
  if (!box) return;
  const top = head?.getBoundingClientRect().top ?? 0;
  if (!force && top >= 74 && top <= window.innerHeight * 0.6) return;
  const y = box.getBoundingClientRect().top + window.scrollY - 74;
  window.scrollTo({ top: Math.max(0, y), behavior: reduced() ? "auto" : "smooth" });
}

function reduced() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function CreationFunnel({ related }: { related: Record<string, RelatedWork> }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [phase, setPhase] = useState<Phase>("ask");
  const [dir, setDir] = useState<1 | -1>(1);
  const [calcLine, setCalcLine] = useState(0);
  const [resumed, setResumed] = useState(false);
  const [contact, setContact] = useState({ name: "", phone: "", email: "", website: "" });
  const [errors, setErrors] = useState<{ name?: string; reach?: string; email?: string; send?: string }>({});
  const [lit, setLit] = useState(false);
  const headRef = useRef<HTMLHeadingElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerRef = useRef(false);
  const advanceTimer = useRef(0);
  const answersRef = useRef<Answers>({});
  const phaseRef = useRef<Phase>("ask");
  const calcToken = useRef(0);
  const sendingRef = useRef(false);
  const mounted = useRef(false);
  const ptitleRef = useRef<HTMLHeadingElement>(null);
  const sentRef = useRef<HTMLHeadingElement>(null);

  const path = (answers.who as Path) || "private";
  const q = (QUESTIONS[step] ?? QUESTIONS[0])!;
  const qTitle = q.id === "who" ? "למי היא מיועדת?" : q.id === "content" ? contentTitle(path) : q.title;
  const qKind = q.id === "content" ? contentKind(path) : q.kind;
  const options: Option[] = q.options(path);
  const answered = QUESTIONS.filter((x) => {
    const v = answers[x.id];
    return x.kind === "text" ? v !== undefined : Array.isArray(v) ? v.length > 0 : Boolean(v);
  }).length;
  const grown = phase === "ask" ? Math.min(answered, TOTAL) : TOTAL;
  const profile = useMemo(() => buildProfile(answers, contact.name.trim().split(" ")[0] ?? ""), [answers, contact.name]);
  answersRef.current = answers;
  phaseRef.current = phase;

  // ----- Speichern und Wiederherstellen (ohne Kontaktdaten) -----
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(KEY);
      if (raw) {
        const saved = JSON.parse(raw) as { step: number; answers: Answers; phase?: Phase };
        if (saved?.answers && Object.keys(saved.answers).length) {
          setAnswers(saved.answers);
          const missing = firstMissing(saved.answers);
          setStep(Math.min(Math.max(0, saved.step ?? 0), missing));
          if (saved.phase === "profile" && missing === TOTAL - 1) {
            setPhase("profile");
            setLit(true);
          }
          setResumed(true);
        }
      }
    } catch {
      /* ohne Speicher geht es auch */
    }
    trackEvent("cta_click", { label: "yetzira_start" });
  }, []);
  useEffect(() => {
    if (phase === "sent") return;
    try {
      sessionStorage.setItem(KEY, JSON.stringify({ step, answers, phase: phase === "profile" ? "profile" : "ask" }));
    } catch {
      /* egal */
    }
  }, [step, answers, phase]);

  // ----- Browser-Zurueck = ein Schritt zurueck -----
  useEffect(() => {
    const onPop = (e: PopStateEvent) => {
      window.clearTimeout(advanceTimer.current);
      calcToken.current++; // laufendes Auswerten abbrechen
      if (phaseRef.current === "sent") {
        location.replace(location.pathname);
        return;
      }
      const st = e.state as { yz?: number } | null;
      if (st && typeof st.yz === "number") {
        setDir(-1);
        setPhase("ask");
        setLit(false);
        setStep(Math.max(0, Math.min(st.yz, firstMissing(answersRef.current))));
      }
    };
    window.addEventListener("popstate", onPop);
    history.replaceState({ yz: step }, "", step > 0 ? `?q=${step + 1}` : location.pathname);
    return () => window.removeEventListener("popstate", onPop);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fokus auf die Frage nach jedem Wechsel
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (phase === "ask") {
      bringIntoView(headRef.current);
      headRef.current?.focus({ preventScroll: true });
    }
    if (phase === "profile") ptitleRef.current?.focus({ preventScroll: true });
    if (phase === "sent") {
      bringIntoView(sentRef.current, true);
      sentRef.current?.focus({ preventScroll: true });
    }
  }, [step, phase]);

  const goto = useCallback((n: number, d: 1 | -1) => {
    window.clearTimeout(advanceTimer.current);
    pointerRef.current = false;
    setDir(d);
    setStep(n);
    if (d === 1) history.pushState({ yz: n }, "", `?q=${n + 1}`);
    else history.replaceState({ yz: n }, "", n > 0 ? `?q=${n + 1}` : location.pathname);
  }, []);

  const startCalc = useCallback(async () => {
    window.clearTimeout(advanceTimer.current);
    const missing = firstMissing(answersRef.current);
    if (missing < TOTAL - 1) {
      setDir(-1);
      setStep(missing);
      return;
    }
    const token = ++calcToken.current;
    if (window.matchMedia("(max-width: 960px)").matches) bringIntoView(null, true);
    setPhase("calc");
    setDir(1);
    trackEvent("cta_click", { label: "yetzira_result", result: buildProfile(answers).title });
    history.pushState({ yz: TOTAL - 1 }, "", "?q=profil");
    const fast = reduced();
    let i = 0;
    const lines = window.setInterval(() => setCalcLine((i = (i + 1) % YETZIRA.calc.length)), 900);
    const desktop = window.matchMedia("(hover: hover) and (pointer: fine)").matches && !fast;
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
    const alive = () => token === calcToken.current;
    if (desktop && canvasRef.current) {
      const dust = runGoldParticles(canvasRef.current);
      await wait(900);
      if (alive()) setLit(true);
      await dust;
      await wait(700);
    } else {
      await wait(fast ? 500 : 1100);
      if (alive()) setLit(true);
      await wait(fast ? 300 : 1500);
    }
    window.clearInterval(lines);
    if (alive()) setPhase("profile");
  }, [answers]);

  const next = useCallback(() => {
    if (step < TOTAL - 1) goto(step + 1, 1);
    else void startCalc();
  }, [step, goto, startCalc]);

  const choose = (id: string) => {
    const viaPointer = pointerRef.current;
    pointerRef.current = false;
    if (qKind === "multi") {
      const cur = Array.isArray(answers[q.id]) ? (answers[q.id] as string[]) : [];
      let nxt = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
      if (id === "open") nxt = cur.includes("open") ? [] : ["open"];
      else nxt = nxt.filter((x) => x !== "open");
      setAnswers((a) => ({ ...a, [q.id]: nxt }));
      return;
    }
    const changedPath = q.id === "who" && answers.who !== id;
    setAnswers((a) => {
      const base: Answers = changedPath ? { who: id } : { ...a, [q.id]: id };
      if (q.id === "timing" && id !== "date") delete base.date;
      return base;
    });
    trackEvent("cta_click", { label: `yetzira_q${step + 1}`, a: id });
    // Bei Zeiger-Eingabe automatisch weiter, nicht bei Tastatur und nicht beim Datum
    if (viaPointer && !(q.id === "timing" && id === "date")) {
      window.clearTimeout(advanceTimer.current);
      advanceTimer.current = window.setTimeout(() => next(), reduced() ? 120 : 560);
    }
  };

  const value = answers[q.id];
  const canNext = qKind === "multi" ? Array.isArray(value) && value.length > 0 : q.kind === "text" ? true : Boolean(value);

  // ----- Versand -----
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = contact.name.trim();
    const phone = contact.phone.trim();
    const email = contact.email.trim();
    const err: typeof errors = {};
    if (!name) err.name = YETZIRA.errName;
    if (!phone && !email) err.reach = YETZIRA.errReach;
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) err.email = YETZIRA.errEmail;
    setErrors(err);
    if (Object.keys(err).length) {
      const first = err.name ? "yz-f-name" : err.reach ? "yz-f-phone" : "yz-f-email";
      document.getElementById(first)?.focus();
      return;
    }
    if (sendingRef.current) return;
    sendingRef.current = true;
    setPhase("sending");
    const p = buildProfile(answers, name.split(" ")[0]);
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "creation",
          name,
          phone,
          email,
          website: contact.website,
          ref: readRef() || "",
          lang: "he",
          answers: answerRows(answers),
          profileTitle: p.title,
          technique: p.technique.name,
          sentence: p.sentence.join(" "),
          priority: p.priority,
        }),
      });
      if (!res.ok) {
        setErrors({ send: res.status === 429 ? YETZIRA.errRate : YETZIRA.errSend });
        setPhase("profile");
        sendingRef.current = false;
        return;
      }
      await new Promise((r) => setTimeout(r, reduced() ? 0 : 900));
      track("Lead", { content_category: "creation" });
      try {
        sessionStorage.removeItem(KEY);
      } catch {
        /* egal */
      }
      history.replaceState({ yz: -1 }, "", "?q=toda");
      setPhase("sent");
    } catch {
      setErrors({ send: YETZIRA.errSend });
      setPhase("profile");
      sendingRef.current = false;
    }
  };

  const restart = () => {
    calcToken.current++;
    sendingRef.current = false;
    setAnswers({});
    setStep(0);
    setPhase("ask");
    setLit(false);
    setResumed(false);
    try {
      sessionStorage.removeItem(KEY);
    } catch {
      /* egal */
    }
    history.replaceState({ yz: 0 }, "", location.pathname);
  };

  const rel = related[profile.related];
  const done = phase === "sent";

  return (
    <div className={`yz yz-phase-${phase}${lit ? " is-lit" : ""}`} style={{ "--dir": dir } as React.CSSProperties}>
      {/* ===== Buehne: die Menora waechst mit jeder Antwort ===== */}
      <div className="yz-stage" aria-hidden="true">
        <ol className="yz-progress">
          {QUESTIONS.map((x, i) => (
            <li key={x.id} className={i < grown ? "is-done" : i === step && phase === "ask" ? "is-now" : ""}>
              <svg viewBox="207.5 -1 32.5 47.7">
                <path d={DROP} />
              </svg>
            </li>
          ))}
        </ol>
        <div className="yz-menorah-box">
          <svg className="yz-menorah" viewBox={`${STAGE_VIEW.x} ${STAGE_VIEW.y} ${STAGE_VIEW.w} ${STAGE_VIEW.h}`}>
            <defs>
              <filter id="yz-feather" filterUnits="userSpaceOnUse" x="-500" y="-500" width="1000" height="1100">
                <feGaussianBlur stdDeviation="7" />
              </filter>
              <linearGradient id="yz-gold" gradientUnits="userSpaceOnUse" x1="0" y1="40" x2="0" y2="370">
                <stop offset="0" stopColor="#e6cb82" />
                <stop offset="0.35" stopColor="#c9a24f" />
                <stop offset="0.7" stopColor="#ad8a3c" />
                <stop offset="1" stopColor="#8f7228" />
              </linearGradient>
              <linearGradient id="yz-sheen" gradientUnits="userSpaceOnUse" x1="-260" y1="0" x2="260" y2="0">
                <stop offset="0" stopColor="#fff3cf" stopOpacity="0" />
                <stop offset="0.3" stopColor="#fff3cf" stopOpacity="0.28" />
                <stop offset="0.5" stopColor="#fff3cf" stopOpacity="0" />
                <stop offset="0.7" stopColor="#fff3cf" stopOpacity="0.28" />
                <stop offset="1" stopColor="#fff3cf" stopOpacity="0" />
              </linearGradient>
              <radialGradient id="yz-glow">
                <stop offset="0" stopColor="#f3d27a" stopOpacity="0.75" />
                <stop offset="0.4" stopColor="#e9c46a" stopOpacity="0.22" />
                <stop offset="1" stopColor="#e9c46a" stopOpacity="0" />
              </radialGradient>
              {ARM_ORDER.map(([side, arc], order) => (
                <mask key={`${side}${arc}`} id={`yz-m-${side}${arc}`} maskUnits="userSpaceOnUse" x="-80" y="-80" width="420" height="480">
                  <circle
                    className={`yz-sweep${order < grown ? " is-on" : ""}`}
                    cx="0"
                    cy="64"
                    r="160"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="340"
                    transform="rotate(-25 0 64)"
                    filter="url(#yz-feather)"
                  />
                </mask>
              ))}
            </defs>
            {/* zarte Vorahnung der ganzen Menora, damit man sieht, was entsteht */}
            <g className="yz-ghost">
              {(["r", "l"] as const).map((side) => (
                <g key={side} transform={side === "r" ? "translate(-1 0)" : "translate(1 0) scale(-1 1)"}>
                  {ARCS.map((d, arc) => {
                    const order = ARM_ORDER.findIndex(([s, a]) => s === side && a === arc);
                    return <path key={arc} d={d} className={order < grown ? "is-off" : ""} />;
                  })}
                </g>
              ))}
              <g className={grown >= TOTAL ? "is-off" : ""}>
                <rect x="-11" y="300" width="22" height="52" rx="2" />
                <path d="M-84 352 H84 L68 368 H-68 Z" />
              </g>
            </g>
            {/* Arme: rechts die Haelfte des Zeichens, links das Spiegelbild */}
            {(["r", "l"] as const).map((side) => (
              <g key={side} transform={side === "r" ? "translate(-1 0)" : "translate(1 0) scale(-1 1)"}>
                {ARCS.map((d, arc) => {
                  const order = ARM_ORDER.findIndex(([s, a]) => s === side && a === arc);
                  return (
                    <g key={arc} className={`yz-arm${order < grown ? " is-on" : ""}`} mask={`url(#yz-m-${side}${arc})`}>
                      <path className="yz-arm-base" d={d} />
                      <path className="yz-arm-gold" d={d} fill="url(#yz-gold)" />
                    </g>
                  );
                })}
              </g>
            ))}
            {/* Schaft und Fuss: siebte Antwort */}
            <g className={`yz-stem${grown >= TOTAL ? " is-on" : ""}`}>
              <rect x="-11" y="300" width="22" height="52" rx="2" className="yz-arm-base" />
              <path d="M-84 352 H84 L68 368 H-68 Z" className="yz-arm-base" />
              <rect x="-11" y="300" width="22" height="52" rx="2" className="yz-arm-gold" fill="url(#yz-gold)" />
              <path d="M-84 352 H84 L68 368 H-68 Z" className="yz-arm-gold" fill="url(#yz-gold)" />
            </g>
            {/* zarter Glanz ueber dem Gold, spiegelgleich */}
            <g className="yz-sheen-layer">
              <g transform="translate(-1 0)">
                {ARCS.map((d, i) => (
                  <path key={i} d={d} fill="url(#yz-sheen)" />
                ))}
              </g>
              <g transform="translate(1 0) scale(-1 1)">
                {ARCS.map((d, i) => (
                  <path key={i} d={d} fill="url(#yz-sheen)" />
                ))}
              </g>
            </g>
            {/* Flammen */}
            {FLAMES.map((f, i) => (
              <g key={i} className="yz-flame" style={{ "--fd": f.d } as React.CSSProperties}>
                <circle cx={f.x} cy={f.y + 22} r="46" fill="url(#yz-glow)" className="yz-flame-glow" />
                <g transform={`translate(${f.x - 223.7} ${f.y})`}>
                  <path d={DROP} className="yz-flame-drop" />
                </g>
              </g>
            ))}
          </svg>
          <canvas ref={canvasRef} className="yz-dust" />
        </div>
        {lit || done ? <p className="yz-slogan">{YETZIRA.slogan}</p> : <p className="yz-stage-note">{YETZIRA.stageNote}</p>}
      </div>

      {/* ===== Fragen, Profil, Dank ===== */}
      <div className="yz-panel">
        <div aria-live="polite" className="yz-sr">
          {phase === "ask" ? YETZIRA.step(step + 1, TOTAL) : phase === "calc" ? YETZIRA.calc[calcLine] : phase === "profile" ? YETZIRA.profileKicker : ""}
        </div>

        {phase === "ask" && (
          <div className="yz-ask" key={step}>
            {step === 0 && (
              <header className="yz-hero">
                <p className="yz-kicker">{YETZIRA.kicker}</p>
                <h1 className="yz-h1">תמיד רציתם יצירה משלכם?</h1>
                <p className="yz-lead">{YETZIRA.lead}</p>
                <p className="yz-small">{YETZIRA.small}</p>
              </header>
            )}
            {resumed && step > 0 && (
              <p className="yz-resume">
                {YETZIRA.resume} · <button type="button" onClick={restart}>{YETZIRA.restart}</button>
              </p>
            )}
            <p className="yz-count">{YETZIRA.step(step + 1, TOTAL)}</p>
            <h2 className="yz-q" ref={headRef} tabIndex={-1} id="yz-q">
              {qTitle}
            </h2>
            {q.hint && (qKind === "multi" || q.kind === "text") && (
              <p className="yz-hint" id="yz-hint">
                {q.hint}
              </p>
            )}

            {q.kind === "text" ? (
              <div className="yz-text">
                <textarea
                  rows={3}
                  maxLength={400}
                  value={typeof value === "string" ? value : ""}
                  onChange={(e) => setAnswers((a) => ({ ...a, idea: e.target.value }))}
                  aria-labelledby="yz-q"
                  placeholder="למשל: חנוכיה עם שמות הילדים, לבית החדש"
                />
              </div>
            ) : (
              <div
                className={`yz-cards${q.id === "material" ? " is-photo" : ""}`}
                role={qKind === "multi" ? "group" : "radiogroup"}
                aria-labelledby="yz-q"
                aria-describedby={qKind === "multi" ? "yz-hint" : undefined}
                onKeyDown={() => (pointerRef.current = false)}
              >
                {options.map((o, i) => {
                  const on = Array.isArray(value) ? value.includes(o.id) : value === o.id;
                  return (
                    <label key={o.id} className={`yz-card${on ? " is-on" : ""}`} style={{ "--i": i } as React.CSSProperties} onPointerDown={() => (pointerRef.current = true)}>
                      <input
                        type={qKind === "multi" ? "checkbox" : "radio"}
                        name={`yz-${q.id}`}
                        checked={on}
                        onChange={() => choose(o.id)}
                        onClick={(e) => {
                          // erneutes Antippen der schon gewaehlten Antwort geht ebenfalls weiter
                          if (qKind !== "multi" && on && pointerRef.current) {
                            e.preventDefault();
                            pointerRef.current = false;
                            next();
                          }
                        }}
                      />
                      {o.img ? (
                        <span className="yz-card-img">
                          <img src={o.img} alt="" loading="lazy" />
                        </span>
                      ) : q.id === "material" ? (
                        <span className="yz-card-mark" aria-hidden="true">
                          <svg viewBox="207.5 -1 32.5 47.7">
                            <path d={DROP} />
                          </svg>
                        </span>
                      ) : null}
                      <span className="yz-card-text">
                        <span className="yz-card-label">{o.label}</span>
                        {o.sub && <span className="yz-card-sub">{o.sub}</span>}
                      </span>
                      <span className="yz-card-drop" aria-hidden="true">
                        <svg viewBox="207.5 -1 32.5 47.7">
                          <path d={DROP} />
                        </svg>
                      </span>
                    </label>
                  );
                })}
              </div>
            )}

            {q.id === "timing" && answers.timing === "date" && (
              <label className="yz-date">
                <span>{YETZIRA.dateLabel}</span>
                <input type="date" dir="ltr" value={answers.date ?? ""} onChange={(e) => setAnswers((a) => ({ ...a, date: e.target.value }))} />
              </label>
            )}

            <div className="yz-nav">
              {step > 0 && (
                <button type="button" className="yz-back" onClick={() => goto(step - 1, -1)}>
                  {YETZIRA.back}
                </button>
              )}
              {(qKind === "multi" || q.kind === "text" || (q.id === "timing" && answers.timing === "date") || canNext) && (
                <button type="button" className="sj-btn yz-next" disabled={!canNext} onClick={next}>
                  {YETZIRA.next}
                </button>
              )}
              {q.optional && !value && (
                <button type="button" className="yz-skip" onClick={next}>
                  {YETZIRA.skip}
                </button>
              )}
            </div>
          </div>
        )}

        {phase === "calc" && (
          <div className="yz-calc">
            <p className="yz-calc-line" key={calcLine}>
              {YETZIRA.calc[calcLine]}
            </p>
          </div>
        )}

        {(phase === "profile" || phase === "sending") && (
          <div className="yz-profile">
            <p className="yz-kicker">{YETZIRA.profileKicker}</p>
            <h2 className="yz-ptitle" ref={ptitleRef} tabIndex={-1}>
              {profile.title}
            </h2>
            <div className="yz-sentence">
              {profile.sentence.map((line, i) => (
                <p key={line} style={{ "--i": i } as React.CSSProperties}>
                  {line}
                </p>
              ))}
            </div>

            <a href="#yz-form" className="yz-jump">
              {YETZIRA.jump}
            </a>

            <div className="yz-grid">
              <section className="yz-box">
                <h3>{YETZIRA.techHead}</h3>
                <p className="yz-tech">{profile.technique.name}</p>
                <p>{profile.technique.why}</p>
                <p className="yz-special">{profile.special}</p>
              </section>
              <section className="yz-box">
                <h3>{YETZIRA.stepsHead}</h3>
                <ol className="yz-steps">
                  {profile.steps.map((s) => (
                    <li key={s.name}>
                      <strong>{s.name}</strong> {s.text}
                    </li>
                  ))}
                </ol>
              </section>
            </div>

            <div className="yz-axes" aria-hidden="true">
              {[
                ["יצירה יחידה", "סדרה", profile.axes.series],
                ["נקי", "עשיר בפרטים", profile.axes.detail],
                ["משמעות אישית", "זהות ממותגת", profile.axes.meaning],
                ["זמן להבשיל", "תאריך יעד", profile.axes.timing],
              ].map(([a, b, v]) => (
                <div key={String(a)} className="yz-axis">
                  <span>{a}</span>
                  <span className="yz-axis-line">
                    <span className="yz-axis-dot" style={{ insetInlineStart: `${(1 - Number(v)) * 100}%` }} />
                  </span>
                  <span>{b}</span>
                </div>
              ))}
            </div>

            {rel && (
              <Link href={rel.href} className="yz-related" target="_blank">
                <img src={rel.img} alt="" loading="lazy" />
                <span>
                  <small>{YETZIRA.relatedHead}</small>
                  <strong>{rel.title}</strong>
                  <em>{rel.sub}</em>
                </span>
              </Link>
            )}
            <p className="yz-note">{YETZIRA.firstDirection}</p>

            <form id="yz-form" className={`yz-form${phase === "sending" ? " is-sending" : ""}`} onSubmit={submit} noValidate>
              <h3>{YETZIRA.contactHead}</h3>
              <p className="yz-calm">{YETZIRA.contactCalm}</p>
              <div className="yz-fields">
                <label>
                  <span>{YETZIRA.name}</span>
                  <input
                    id="yz-f-name"
                    autoComplete="name"
                    value={contact.name}
                    onChange={(e) => setContact((c) => ({ ...c, name: e.target.value }))}
                    placeholder={YETZIRA.namePh}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? "yz-e-name" : undefined}
                    maxLength={120}
                  />
                  {errors.name && <em id="yz-e-name">{errors.name}</em>}
                </label>
                <label>
                  <span>{YETZIRA.phone}</span>
                  <input
                    id="yz-f-phone"
                    dir="ltr"
                    inputMode="tel"
                    autoComplete="tel"
                    value={contact.phone}
                    onChange={(e) => setContact((c) => ({ ...c, phone: e.target.value }))}
                    placeholder="050-0000000"
                    maxLength={60}
                    aria-invalid={Boolean(errors.reach)}
                    aria-describedby={errors.reach ? "yz-e-reach" : undefined}
                  />
                </label>
                <label>
                  <span>{YETZIRA.email}</span>
                  <input
                    id="yz-f-email"
                    dir="ltr"
                    type="email"
                    autoComplete="email"
                    value={contact.email}
                    onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))}
                    placeholder="name@example.com"
                    aria-invalid={Boolean(errors.email || errors.reach)}
                    aria-describedby={errors.email ? "yz-e-email" : errors.reach ? "yz-e-reach" : undefined}
                    maxLength={160}
                  />
                  {errors.email && <em id="yz-e-email">{errors.email}</em>}
                </label>
                <label className="yz-hp" aria-hidden="true">
                  website
                  <input tabIndex={-1} autoComplete="off" value={contact.website} onChange={(e) => setContact((c) => ({ ...c, website: e.target.value }))} />
                </label>
              </div>
              <p className="yz-either">
                {errors.reach ? (
                  <em role="alert" id="yz-e-reach">
                    {errors.reach}
                  </em>
                ) : (
                  YETZIRA.either
                )}
              </p>
              {errors.send && (
                <p className="yz-err" role="alert">
                  {errors.send}
                </p>
              )}
              <div className="yz-send-row">
                <button type="submit" className="sj-btn yz-send" disabled={phase === "sending"}>
                  <span>{phase === "sending" ? YETZIRA.sending : YETZIRA.send}</span>
                </button>
                <Link href="/privacy" className="yz-privacy">
                  {YETZIRA.privacy}
                </Link>
              </div>
            </form>
            <button type="button" className="yz-restart" onClick={restart}>
              {YETZIRA.restart}
            </button>
          </div>
        )}

        {phase === "sent" && (
          <div className="yz-sent">
            <h2 className="yz-ptitle" tabIndex={-1} ref={sentRef}>
              {YETZIRA.thanksTitle}
            </h2>
            <p className="yz-lead">{YETZIRA.thanksText}</p>
            <div className="yz-sentence is-small">
              {profile.sentence.slice(0, 1).map((l) => (
                <p key={l}>{l}</p>
              ))}
            </div>
            <div className="yz-links">
              <Link href="/works" className="sj-btn">
                {YETZIRA.linkWorks}
              </Link>
              <Link href="/design#projects" className="sj-btn sj-btn-ghost">
                {YETZIRA.linkProjects}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
