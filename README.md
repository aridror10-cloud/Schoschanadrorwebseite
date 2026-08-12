# Schoschana Dror – Webseite

Landingpage der **Carlebach-Kollektion** (Metall-Porträtserie von Rabbi Schlomo
Carlebach), gebaut mit [Next.js](https://nextjs.org) (App Router) und TypeScript.

Zweisprachig nach der Design-Vorlage `carlebach-landing-v3_16`:

| Route | Sprache | Richtung |
| --- | --- | --- |
| `/` | Hebräisch | RTL |
| `/en` | Englisch | LTR |

Ohne Tracking, ohne Cookies. Die Schriften (Heebo, Frank Ruhl Libre) werden
beim Build von `next/font` heruntergeladen und von der eigenen Domain
ausgeliefert – zur Laufzeit geht keine Anfrage an Google.

## Schnellstart

```bash
npm install
npm run dev
```

Die Seite läuft dann unter http://localhost:3000 (Englisch: /en)

## Befehle

| Befehl | Zweck |
| --- | --- |
| `npm run dev` | Entwicklungsserver mit Hot Reload |
| `npm run build` | Produktions-Build erzeugen |
| `npm run start` | Produktions-Build lokal ausliefern |
| `npm run typecheck` | TypeScript prüfen, ohne zu bauen |

## Projektstruktur

```
app/
  layout.tsx          Grundgerüst (he/RTL), Schriften, Metadaten, hreflang
  page.tsx            Startseite Hebräisch
  en/page.tsx         Englische Seite (stellt lang/dir auf en/ltr um)
  not-found.tsx       404-Seite
  globals.css         1:1-Port der Vorlagen-Stile (mit logischen
                      CSS-Eigenschaften, damit RTL und LTR beide stimmen)
  icon.svg            Favicon
  robots.ts           erzeugt /robots.txt
  sitemap.ts          erzeugt /sitemap.xml (/ und /en)
components/
  Landing.tsx         die komplette Landingpage, sprachneutral aufgebaut
lib/
  content.ts          sämtliche Texte in he + en – Inhalte hier pflegen
  site.ts             Basis-URL (NEXT_PUBLIC_SITE_URL)
public/carlebach/     alle Bilder der Vorlage (aus den Base64-Daten extrahiert)
```

## Inhalte ändern

Alle Texte beider Sprachen liegen zentral in `lib/content.ts` – unverändert
übernommen aus den finalen Vorlagen (`carlebach-landing-he-final.html` /
`carlebach-landing-en-final.html`). Kauf- und Kontakt-Buttons öffnen WhatsApp
(053-314-2341) mit vorbefüllter Nachricht; dazu gibt es eine Kontakt-Sektion
mit E-Mail (ssdror@gmail.com), Telefon und WhatsApp.

## Vor dem Livegang

- [ ] `NEXT_PUBLIC_SITE_URL` auf die echte Domain setzen (siehe `.env.example`)

## Veröffentlichen

**Vercel** (empfohlen): Repository verbinden, `NEXT_PUBLIC_SITE_URL` als
Umgebungsvariable setzen, fertig.

**Statischer Export**: in `next.config.ts` `output: "export"` ergänzen, dann
erzeugt `npm run build` den Ordner `out/`. Die Sicherheits-Kopfzeilen aus
`next.config.ts` greifen dann nicht mehr und müssen beim Hoster gesetzt werden.
