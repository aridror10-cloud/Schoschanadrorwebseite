# Schoschana Dror – Webseite

Persönliche Webseite, gebaut mit [Next.js](https://nextjs.org) (App Router) und TypeScript.
Ohne Tracking, ohne Cookies, ohne externe Schriftarten.

## Schnellstart

```bash
npm install
npm run dev
```

Die Seite läuft dann unter http://localhost:3000

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
  layout.tsx          Grundgerüst, Metadaten, Kopf- und Fußzeile
  page.tsx            Startseite
  not-found.tsx       404-Seite
  globals.css         Design-Tokens und alle Stile
  icon.svg            Favicon
  robots.ts           erzeugt /robots.txt
  sitemap.ts          erzeugt /sitemap.xml
  impressum/          Pflichtangaben nach § 5 DDG
  datenschutz/        Datenschutzerklärung
components/
  SiteHeader.tsx      Kopfzeile mit Navigation (Client)
  SiteFooter.tsx      Fußzeile
  ThemeToggle.tsx     Umschalter hell/dunkel
  ThemeScript.tsx     verhindert das Aufblitzen des falschen Farbschemas
lib/
  site.ts             zentrale Konfiguration – hier zuerst anpassen
```

## Vor dem Livegang

Alle Platzhalter sind im Browser orange als `TODO` markiert und im Code mit
`TODO` kommentiert. Diese Punkte müssen erledigt sein:

- [ ] `lib/site.ts`: Name, Beschreibung und **echte E-Mail-Adresse** eintragen
- [ ] `NEXT_PUBLIC_SITE_URL` auf die echte Domain setzen (siehe `.env.example`)
- [ ] `app/impressum/page.tsx`: vollständige Anschrift ergänzen — **rechtlich verpflichtend**
- [ ] `app/datenschutz/page.tsx`: Hosting-Anbieter eintragen
- [ ] `app/page.tsx`: Platzhaltertexte durch echte Inhalte ersetzen
- [ ] `app/icon.svg`: Monogramm anpassen oder ersetzen

> Impressum und Datenschutzerklärung sind Vorlagen und **keine Rechtsberatung**.
> Ein unvollständiges Impressum ist in Deutschland abmahnfähig.

## Was bereits gelöst ist

**Recht:** Impressum- und Datenschutz-Seite angelegt. Keine Google Fonts – die
würden bei jedem Aufruf die IP-Adresse an Google übertragen (LG München,
Az. 3 O 17493/20).

**SEO:** Titel-Template, Beschreibung, Open Graph, Twitter Cards, canonical-URLs,
`robots.txt`, `sitemap.xml` und JSON-LD nach schema.org.

**Barrierefreiheit:** Sprungmarke zum Inhalt, semantische Landmarken
(`header`/`nav`/`main`/`footer`), sichtbarer Tastaturfokus über `:focus-visible`,
`aria-label` an allen Symbol-Schaltflächen, Escape schließt das Menü.

**Darstellung:** helles und dunkles Farbschema mit gespeicherter Auswahl,
`100dvh` statt `100vh` gegen abgeschnittene Inhalte auf dem Handy, fließende
Schriftgrößen per `clamp()`, `prefers-reduced-motion`, eigene Druckansicht.

**Sicherheit:** Sicherheits-Kopfzeilen in `next.config.ts`
(HSTS, `nosniff`, Referrer-Policy, Permissions-Policy, Clickjacking-Schutz),
`X-Powered-By` abgeschaltet.

## Veröffentlichen

**Vercel** (empfohlen, Standardfall): Repository verbinden, `NEXT_PUBLIC_SITE_URL`
als Umgebungsvariable setzen, fertig.

**Statischer Export** (z. B. GitHub Pages, klassisches Webhosting): in
`next.config.ts` `output: "export"` ergänzen, dann erzeugt `npm run build` den
Ordner `out/`. Achtung: Die Sicherheits-Kopfzeilen aus `next.config.ts` greifen
dann nicht mehr und müssen beim Hoster konfiguriert werden.
