"use client";

import { useEffect, useState } from "react";
import { EMAIL, content, type Lang } from "@/lib/content";

/**
 * Bestellkarte ("כרטיס ההזמנה").
 *
 * Gestaltung folgt dem Laserschnitt-Motiv der Prozess-Sektion: Felder sind
 * Linien statt Kaesten, beim Fokus laeuft eine Goldspur die Linie entlang,
 * die Modellwahl zeichnet einen Rahmen um die Kachel. Nach dem Absenden
 * wird die Karte selbst gerahmt - dieselbe Geste wie beim Set-Foto.
 *
 * Rolle seit Anbindung der Zahlseiten: Kaufen laeuft ueber SUMIT, dieses
 * Formular ist nur noch fuer Sonderwuensche (andere Groesse, Menge,
 * Geschenk) und Fragen. Lieferart und Adresse entfallen deshalb - die
 * klaert Shoshana im Angebot, nicht vorab.
 */

/** Bilder der Modell-Kacheln, in der Reihenfolge von form.modelOptions */
const TILE_IMAGES: Record<string, string> = {
  simcha: "/carlebach/simcha.webp",
  regesh: "/carlebach/regesh.webp",
  shrika: "/carlebach/shrika.webp",
  set: "/carlebach/set.webp",
};

type Status = "idle" | "sending" | "sent" | "error";

export function OrderForm({ lang }: { lang: Lang }) {
  const t = content[lang];
  const f = t.form;

  const [model, setModel] = useState("set");
  const [version, setVersion] = useState<"with" | "without">("with");
  const [qty, setQty] = useState("1");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [company, setComapny] = useState(""); // Honigtopf, bleibt fuer Menschen unsichtbar
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");

  /*
   * Die Kauf-Buttons auf der Seite verlinken auf #order und tragen
   * data-model. Der Browser scrollt selbst, wir uebernehmen nur die
   * Vorauswahl - so bleibt die Verlinkung ohne JavaScript funktionsfaehig.
   */
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement | null)?.closest("[data-model]");
      const picked = target?.getAttribute("data-model");
      if (picked) setModel(picked);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const tiles = f.modelOptions.filter((o) => TILE_IMAGES[o.value]);
  const extra = f.modelOptions.filter((o) => !TILE_IMAGES[o.value]);

  function validate() {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = f.errorRequired;
    if (!email.trim()) next.email = f.errorRequired;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) next.email = f.errorEmail;
    if (!notes.trim()) next.notes = f.errorRequired;
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "sending") return;
    if (!validate()) return;

    setStatus("sending");
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lang,
          model: f.modelOptions.find((o) => o.value === model)?.label ?? model,
          version: version === "with" ? f.labels.versionWith : f.labels.versionWithout,
          qty,
          name,
          phone,
          email,
          notes,
          company,
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  const field = (
    key: string,
    label: string,
    value: string,
    onChange: (v: string) => void,
    placeholder: string,
    opts: { type?: string; area?: boolean; optional?: boolean } = {},
  ) => (
    <div className="of-group">
      <label className="of-label" htmlFor={`of-${key}`}>
        {label}
        {opts.optional && <span className="of-optional"> · {f.optional}</span>}
      </label>
      <div className="of-field">
        {opts.area ? (
          <textarea
            id={`of-${key}`}
            rows={3}
            value={value}
            placeholder={placeholder}
            onChange={(ev) => onChange(ev.target.value)}
            aria-invalid={!!errors[key]}
          />
        ) : (
          <input
            id={`of-${key}`}
            type={opts.type ?? "text"}
            value={value}
            placeholder={placeholder}
            onChange={(ev) => onChange(ev.target.value)}
            aria-invalid={!!errors[key]}
          />
        )}
        <span className="of-base" />
        <span className="of-cut" />
      </div>
      {errors[key] && (
        <p className="of-error" role="alert">
          {errors[key]}
        </p>
      )}
    </div>
  );

  return (
    <section className="orderform" id="order">
      <div className="wrap">
        <div className={`of-card${status === "sent" ? " is-done" : ""}`} data-reveal>
          <div className="of-inner">
            {status === "sent" ? (
              <div className="of-done">
                <svg className="of-check" width="58" height="58" viewBox="0 0 58 58" aria-hidden="true">
                  <circle cx="29" cy="29" r="27" />
                  <path d="M18 30l8 8 15-17" />
                </svg>
                <h2>{f.successTitle}</h2>
                <p>{f.successText}</p>
              </div>
            ) : (
              <form onSubmit={submit} noValidate>
                <div className="section-head of-head">
                  <div className="kicker">{f.kicker}</div>
                  <h2>{f.title}</h2>
                  <p className="of-lead">{f.lead}</p>
                </div>

                <fieldset className="of-fieldset">
                  <legend className="of-label">{f.labels.model}</legend>
                  <div className="of-tiles">
                    {tiles.map((o) => (
                      <button
                        type="button"
                        key={o.value}
                        className={`of-tile${model === o.value ? " sel" : ""}`}
                        onClick={() => setModel(o.value)}
                        aria-pressed={model === o.value}
                      >
                        <svg aria-hidden="true">
                          <rect x="1" y="1" width="98%" height="97%" rx="2" pathLength={1} />
                        </svg>
                        <span className="of-thumb">
                          <img src={TILE_IMAGES[o.value]} alt="" loading="lazy" />
                        </span>
                        <span className="of-tile-name">{o.label}</span>
                      </button>
                    ))}
                  </div>
                  {extra.map((o) => (
                    <button
                      type="button"
                      key={o.value}
                      className={`of-opt of-opt-wide${model === o.value ? " sel" : ""}`}
                      onClick={() => setModel(o.value)}
                      aria-pressed={model === o.value}
                    >
                      <span className="of-dot" />
                      {o.label}
                    </button>
                  ))}
                </fieldset>

                <fieldset className="of-fieldset">
                  <legend className="of-label">{f.labels.version}</legend>
                  <div className="of-opts">
                    {(["with", "without"] as const).map((v) => (
                      <button
                        type="button"
                        key={v}
                        className={`of-opt${version === v ? " sel" : ""}`}
                        onClick={() => setVersion(v)}
                        aria-pressed={version === v}
                      >
                        <span className="of-dot" />
                        {v === "with" ? f.labels.versionWith : f.labels.versionWithout}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <div className="of-row">
                  {field("name", f.labels.name, name, setName, f.placeholders.name)}
                  {field("qty", f.labels.qty, qty, setQty, "1")}
                </div>

                <div className="of-row">
                  {field("phone", f.labels.phone, phone, setPhone, f.placeholders.phone, {
                    type: "tel",
                    optional: true,
                  })}
                  {field("email", f.labels.email, email, setEmail, f.placeholders.email, {
                    type: "email",
                  })}
                </div>

                {field("notes", f.labels.notes, notes, setNotes, f.placeholders.notes, {
                  area: true,
                })}

                {/* Honigtopf gegen Spam-Roboter: fuer Menschen unsichtbar */}
                <div className="of-hp" aria-hidden="true">
                  <label htmlFor="of-company">Company</label>
                  <input
                    id="of-company"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={company}
                    onChange={(ev) => setComapny(ev.target.value)}
                  />
                </div>

                <button type="submit" className={`of-submit${status === "sending" ? " go" : ""}`}>
                  {status === "sending" ? f.sending : f.submit}
                </button>

                {status === "error" && (
                  <p className="of-error of-error-send" role="alert">
                    {f.errorSend} <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
                  </p>
                )}

                <p className="of-alt">
                  {f.mailAltLead}{" "}
                  <a href={t.orderHref}>{f.mailAltLink}</a>
                </p>
                <p className="of-privacy">{f.privacyNote}</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
