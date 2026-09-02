"use client";

import { useEffect, useRef, useState } from "react";
import { EMAIL, content, type Lang } from "@/lib/content";

/**
 * Karte fuer Sonderwuensche ("התאמה אישית").
 *
 * Gestaltung folgt dem Laserschnitt-Motiv: Felder sind Linien statt
 * Kaesten, beim Fokus laeuft eine Goldspur die Linie entlang, die
 * Modellwahl zeichnet einen Rahmen um die Kachel.
 *
 * Rolle: Kaufen laeuft ueber den Korb und SUMIT. Dieses Formular ist
 * ausschliesslich fuer Anpassungen (andere Groesse, Kiddush, Menge,
 * Geschenk) und Fragen - deshalb kein Preis, keine Lieferart, keine
 * Adresse. Nach Shoshanas Rueckmeldung vom 01.09.26 ist bewusst kein
 * Modell vorausgewaehlt: wer nicht aufpasst, soll nicht versehentlich
 * eine Anfrage fuer das ganze Set abschicken.
 */

/** Bilder der Modell-Kacheln, in der Reihenfolge von form.modelOptions */
const TILE_IMAGES: Record<string, string> = {
  simcha: "/carlebach/simcha.webp",
  regesh: "/carlebach/regesh.webp",
  shrika: "/carlebach/shrika.webp",
  set: "/carlebach/set.webp",
};

/** Anhang: gross genug fuer ein Foto, klein genug fuer die Mail */
const MAX_FILE = 2.5 * 1024 * 1024;
const FILE_TYPES = "image/*,.pdf";

type Status = "idle" | "sending" | "sent" | "error";

export function OrderForm({ lang }: { lang: Lang }) {
  const t = content[lang];
  const f = t.form;

  const [model, setModel] = useState("");
  // Bewusst leer: die Fassung soll eine bewusste Wahl sein, keine Vorgabe
  const [version, setVersion] = useState<"with" | "without" | "">("");
  const [qty, setQty] = useState("1");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<{ name: string; type: string; data: string } | null>(null);
  const [fileError, setFileError] = useState("");
  const [company, setComapny] = useState(""); // Honigtopf, bleibt fuer Menschen unsichtbar
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");
  const doneRef = useRef<HTMLDivElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  /*
   * Nach dem Absenden wechselt der Karteninhalt komplett. Ohne den Fokus
   * mitzunehmen steht er im Nichts - Tastatur- und Vorlesenutzung
   * bemerkten den Erfolg sonst gar nicht.
   */
  useEffect(() => {
    if (status === "sent") doneRef.current?.focus();
  }, [status]);

  /*
   * Sonderanfrage-Links auf der Seite zeigen auf #order und koennen per
   * data-model ein Modell vorschlagen. Der Browser scrollt selbst, wir
   * uebernehmen nur die Vorauswahl.
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

  function pickFile(list: FileList | null) {
    const chosen = list?.[0];
    setFileError("");
    if (!chosen) return setFile(null);
    if (chosen.size > MAX_FILE) {
      setFileError(f.file.tooBig);
      if (fileInput.current) fileInput.current.value = "";
      return setFile(null);
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result);
      setFile({ name: chosen.name, type: chosen.type, data: result.split(",")[1] ?? "" });
    };
    reader.readAsDataURL(chosen);
  }

  function clearFile() {
    setFile(null);
    setFileError("");
    if (fileInput.current) fileInput.current.value = "";
  }

  function validate() {
    const next: Record<string, string> = {};
    if (!model) next.model = f.errorModel;
    if (!version) next.version = f.errorVersion;
    if (!name.trim()) next.name = f.errorRequired;
    if (!email.trim()) next.email = f.errorRequired;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) next.email = f.errorEmail;
    if (!notes.trim()) next.notes = f.errorRequired;
    setErrors(next);
    const first = Object.keys(next)[0];
    if (first) {
      // Zum ersten beanstandeten Feld springen, statt es nur rot zu faerben.
      // Bewusst setTimeout statt requestAnimationFrame: der Sprung soll auch
      // dann stattfinden, wenn der Browser gerade keine Bilder zeichnet.
      setTimeout(() => {
        const ziel =
          first === "model"
            ? document.querySelector<HTMLElement>(".of-tiles button")
            : first === "version"
              ? document.querySelector<HTMLElement>(".of-opts button")
              : document.getElementById(`of-${first}`);
        ziel?.focus();
      }, 0);
      return false;
    }
    return true;
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
          file,
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
    opts: { type?: string; area?: boolean; optional?: boolean; rows?: number; big?: boolean } = {},
  ) => (
    <div className={`of-group${opts.big ? " of-group-big" : ""}`}>
      <label className="of-label" htmlFor={`of-${key}`}>
        {label}
        {opts.optional && <span className="of-optional"> ({f.optional})</span>}
      </label>
      <div className="of-field">
        {opts.area ? (
          <textarea
            id={`of-${key}`}
            rows={opts.rows ?? 3}
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
              <div className="of-done" role="status" tabIndex={-1} ref={doneRef}>
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
                        className={`of-tile${o.value === "set" ? " of-tile-wide" : ""}${
                          model === o.value ? " sel" : ""
                        }`}
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
                  {errors.model && (
                    <p className="of-error" role="alert">
                      {errors.model}
                    </p>
                  )}
                  {/* Ohne diesen Satz liest sich "שמחה — ₪590" wie ein
                      Festpreis, der die Sonderanfertigung einschliesst */}
                  <p className="of-note">{f.modelNote}</p>
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
                  {errors.version && (
                    <p className="of-error" role="alert">
                      {errors.version}
                    </p>
                  )}
                  {model === "set" && <p className="of-note">{f.versionSetNote}</p>}
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

                {/* Das Herz des Formulars: mehr Raum und mehr Gewicht als
                    die uebrigen Felder */}
                {field("notes", f.labels.notes, notes, setNotes, f.placeholders.notes, {
                  area: true,
                  rows: 5,
                  big: true,
                })}

                <div className="of-group of-file">
                  <label className="of-label" htmlFor="of-file">
                    {f.file.label}
                    <span className="of-optional"> ({f.optional})</span>
                  </label>
                  <input
                    id="of-file"
                    ref={fileInput}
                    type="file"
                    accept={FILE_TYPES}
                    onChange={(ev) => pickFile(ev.target.files)}
                  />
                  {file ? (
                    <p className="of-file-picked">
                      <span>{file.name}</span>
                      <button type="button" onClick={clearFile}>
                        {f.file.remove}
                      </button>
                    </p>
                  ) : (
                    <p className="of-note">{f.file.hint}</p>
                  )}
                  {fileError && (
                    <p className="of-error" role="alert">
                      {fileError}
                    </p>
                  )}
                </div>

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
