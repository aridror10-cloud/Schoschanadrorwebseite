"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { track } from "@/lib/pixel";
import { CONTACT, brand, type EnquiryKind } from "@/lib/studio";

/**
 * Anfrageformular mit den drei Arten aus dem Konzept: geschaeftliche
 * Anfrage, Bestellanfrage, Interesse bekunden.
 *
 * - `kinds` bestimmt, welche Arten waehlbar sind. Bei nur einer Art
 *   entfaellt die Auswahl (z. B. auf einer Galerie, die nicht verkauft).
 * - Knoepfe irgendwo auf der Seite mit `data-piece` (und optional
 *   `data-kind`) tragen beim Klick das Werk ins Formular ein; der Link
 *   selbst springt per #anker hierher.
 * - /contact?type=interest&piece=… belegt die Felder ebenfalls vor.
 */

const MAX_FILE = 2.5 * 1024 * 1024;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Status = "idle" | "sending" | "sent" | "error" | "rate";

export function EnquiryForm({
  kinds,
  defaultKind,
  anchor = "enquiry",
  showCarlebachHint = false,
}: {
  kinds: EnquiryKind[];
  defaultKind?: EnquiryKind;
  anchor?: string;
  showCarlebachHint?: boolean;
}) {
  const c = CONTACT;
  const uid = useId();
  const [kind, setKind] = useState<EnquiryKind>(defaultKind ?? kinds[0] ?? "business");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [piece, setPiece] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<{ name: string; type: string; data: string } | null>(null);
  const [website, setWebsite] = useState(""); // Honigtopf
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");
  const doneRef = useRef<HTMLDivElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  // Vorbelegung aus der Adresszeile (?type=…&piece=…)
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const t = q.get("type") as EnquiryKind | null;
    if (t && kinds.includes(t)) setKind(t);
    const p = q.get("piece");
    if (p) setPiece(p.slice(0, 200));
  }, [kinds]);

  // Werk-Knoepfe auf der Seite tragen ihr Werk ein
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-piece]");
      if (!el) return;
      setPiece(el.dataset.piece ?? "");
      const k = el.dataset.kind as EnquiryKind | undefined;
      if (k && kinds.includes(k)) setKind(k);
      setStatus((s) => (s === "sent" ? "idle" : s));
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [kinds]);

  useEffect(() => {
    if (status === "sent") doneRef.current?.focus();
  }, [status]);

  function validate() {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = c.errors.name;
    if (email.trim() && !EMAIL_RE.test(email.trim())) e.email = c.errors.email;
    if (!phone.trim() && !email.trim()) e.phone = c.errors.contact;
    if (kind !== "business" && !piece.trim()) e.piece = c.errors.piece;
    if (kind === "business" && !message.trim()) e.message = c.errors.idea;
    return e;
  }

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (status === "sending") return;
    const e = validate();
    setErrors(e);
    const first = Object.keys(e)[0];
    if (first) {
      // Fokus auf das erste fehlerhafte Feld, damit niemand suchen muss
      setTimeout(() => document.getElementById(`${uid}-${first}`)?.focus(), 0);
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind,
          name,
          company: kind === "business" ? company : "",
          phone,
          email,
          piece: kind === "business" ? "" : piece,
          message,
          file: kind === "business" ? file : null,
          website,
        }),
      });
      if (res.status === 429) {
        setStatus("rate");
        return;
      }
      if (!res.ok) throw new Error(String(res.status));
      track("Lead", { content_category: kind });
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  function pickFile(list: FileList | null) {
    const f = list?.[0];
    setErrors((e) => ({ ...e, file: "" }));
    if (!f) return;
    const okType = f.type.startsWith("image/") || f.type === "application/pdf";
    if (!okType || f.size > MAX_FILE) {
      setFile(null);
      setErrors((e) => ({ ...e, file: c.errors.file }));
      if (fileInput.current) fileInput.current.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const data = String(reader.result).split(",")[1] ?? "";
      setFile({ name: f.name, type: f.type, data });
    };
    reader.readAsDataURL(f);
  }

  function reset() {
    setName("");
    setCompany("");
    setPhone("");
    setEmail("");
    setPiece("");
    setMessage("");
    setFile(null);
    setErrors({});
    setStatus("idle");
  }

  const field = (
    key: string,
    label: string,
    input: React.ReactNode,
    opts: { optional?: boolean; hint?: string } = {},
  ) => (
    <div className={`eq-field${errors[key] ? " has-error" : ""}`}>
      <label htmlFor={`${uid}-${key}`}>
        {label}
        {opts.optional && <span className="eq-optional"> ({c.fields.optional})</span>}
      </label>
      {input}
      {opts.hint && <p className="eq-hint">{opts.hint}</p>}
      {errors[key] && (
        <p className="eq-error" id={`${uid}-${key}-err`} role="alert">
          {errors[key]}
        </p>
      )}
    </div>
  );

  const aria = (key: string) => ({
    id: `${uid}-${key}`,
    "aria-invalid": errors[key] ? true : undefined,
    "aria-describedby": errors[key] ? `${uid}-${key}-err` : undefined,
  });

  if (status === "sent") {
    return (
      <div className="eq-card eq-done" id={anchor} ref={doneRef} tabIndex={-1} role="status">
        <svg className="eq-check" width="56" height="56" viewBox="0 0 58 58" aria-hidden="true">
          <circle cx="29" cy="29" r="27" />
          <path d="M18 30l8 8 15-17" />
        </svg>
        <h3>{c.done.title}</h3>
        <p>{c.done.text}</p>
        {kind === "interest" && <p className="eq-note">{c.interestNote}</p>}
        <button type="button" className="eq-again" onClick={reset}>
          {c.done.again}
        </button>
      </div>
    );
  }

  return (
    <form className="eq-card" id={anchor} onSubmit={onSubmit} noValidate>
      {kinds.length > 1 && (
        <fieldset className="eq-kinds">
          <legend>{c.chooseLabel}</legend>
          <div className="eq-kind-grid">
            {kinds.map((k) => (
              <label key={k} className={`eq-kind${kind === k ? " is-on" : ""}`}>
                <input
                  type="radio"
                  name={`${uid}-kind`}
                  value={k}
                  checked={kind === k}
                  onChange={() => setKind(k)}
                />
                <span className="eq-kind-title">{c.kinds[k].label}</span>
                <span className="eq-kind-desc">{c.kinds[k].desc}</span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      {kinds.length === 1 && <p className="eq-kind-single">{c.kinds[kind].desc}</p>}

      {showCarlebachHint && kind !== "business" && (
        <p className="eq-carlebach">
          {c.carlebachHint} <Link href="/carlebach">{c.carlebachLink}</Link>
        </p>
      )}

      <div className="eq-grid">
        {field(
          "name",
          c.fields.name,
          <input {...aria("name")} type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />,
        )}
        {kind === "business" &&
          field(
            "company",
            c.fields.company,
            <input
              {...aria("company")}
              type="text"
              autoComplete="organization"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />,
            { optional: true },
          )}
        {field(
          "phone",
          c.fields.phone,
          <input
            {...aria("phone")}
            type="tel"
            dir="ltr"
            autoComplete="tel"
            inputMode="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />,
        )}
        {field(
          "email",
          c.fields.email,
          <input
            {...aria("email")}
            type="email"
            dir="ltr"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />,
          { hint: "אפשר למלא טלפון, אימייל או את שניהם" },
        )}
        {kind !== "business" &&
          field(
            "piece",
            kind === "order" ? c.fields.pieceOrder : c.fields.piece,
            <input {...aria("piece")} type="text" value={piece} onChange={(e) => setPiece(e.target.value)} />,
          )}
        <div className="eq-wide">
          {field(
            "message",
            kind === "business" ? c.fields.idea : kind === "order" ? c.fields.details : c.fields.note,
            <textarea {...aria("message")} rows={kind === "business" ? 5 : 3} value={message} onChange={(e) => setMessage(e.target.value)} />,
            { optional: kind !== "business" },
          )}
        </div>
        {kind === "business" && (
          <div className="eq-wide">
            {field(
              "file",
              c.fields.file,
              <div className="eq-file">
                <input
                  {...aria("file")}
                  ref={fileInput}
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => pickFile(e.target.files)}
                />
                <label htmlFor={`${uid}-file`} className="eq-file-btn">
                  בחירת קובץ
                </label>
                <span className="eq-file-name">{file ? file.name : "לא נבחר קובץ"}</span>
                {file && (
                  <button
                    type="button"
                    className="eq-file-remove"
                    onClick={() => {
                      setFile(null);
                      if (fileInput.current) fileInput.current.value = "";
                    }}
                  >
                    {c.fields.fileRemove}
                  </button>
                )}
              </div>,
              { optional: true, hint: c.fields.fileHint },
            )}
          </div>
        )}
      </div>

      {/* Honigtopf: fuer Menschen unsichtbar, Roboter fuellen ihn aus */}
      <div className="eq-hp" aria-hidden="true">
        <label>
          אתר
          <input type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
        </label>
      </div>

      {kind === "interest" && <p className="eq-note">{c.interestNote}</p>}

      <div className="eq-actions">
        <button type="submit" className="eq-submit" disabled={status === "sending"}>
          {status === "sending" ? c.sending : c.submit[kind]}
        </button>
      </div>

      {(status === "error" || status === "rate") && (
        <p className="eq-error eq-send-error" role="alert">
          {status === "rate" ? c.errors.rate : c.errors.send}
          <a href={`mailto:${brand.email}`} dir="ltr">
            {brand.email}
          </a>
        </p>
      )}
    </form>
  );
}
