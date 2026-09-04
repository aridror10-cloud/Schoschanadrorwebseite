import { NextResponse } from "next/server";
import { MAX_QTY, type ModelKey, type Version, isModelKey, isVersion } from "@/lib/cart";

/**
 * Baut einen SUMIT-Warenkorb fuer die gewaehlten Werke und liefert die
 * Adresse der fertigen Zahlseite zurueck.
 *
 * SUMIT fuehrt Warenkoerbe serverseitig unter einer frei waehlbaren
 * Kart-Kennung (dieselbe Mechanik, die die Katalogseite selbst nutzt).
 * Wir legen pro Bestellung eine frische Kennung an, melden jede Zeile
 * einzeln an und schicken die Kundschaft dann auf die Zahlseite - dort
 * uebernehmen Versandwahl, Pflichtfelder und Kartenzahlung wie gehabt.
 */

const SUMIT_COMPANY = "11yegzt";
const SUMIT_CATALOG = "122fbi4";

/**
 * SUMIT-Produktnummern im Katalog "sidrat Carlebach".
 *
 * Jede Fassung ist ein eigenes Produkt: nur so steht die Wahl mit oder
 * ohne Pasuk auf der Bestellung (SUMIT nimmt keine vorbelegten Feldwerte
 * ueber die Adresszeile an und kennt keine Notiz je Zeile - geprueft am
 * 28.08.26). Solange eine Fassung ohne Pasuk bei SUMIT fehlt, steht hier
 * null; die Werkkarten blenden die Wahl dann gar nicht erst ein.
 */
const SUMIT_ITEMS: Record<ModelKey, Record<Version, number | null>> = {
  simcha: { with: 2295247327, without: 2307581655 },
  regesh: { with: 2295257571, without: 2307582551 },
  shrika: { with: 2295252407, without: 2307583493 },
  set: { with: 2295176895, without: 2307585333 },
  // Sukkot-Edition: Produkt bei SUMIT noch nicht angelegt (Stand 04.09.26)
  sukkot: { with: null, without: null },
};

/* Einfache Ratenbegrenzung je Adresse, gleiche Bauart wie /api/order */
const RECENT = new Map<string, number[]>();
const LIMIT = 30;
const WINDOW = 60 * 60 * 1000;

function limited(ip: string) {
  const now = Date.now();
  const past = (RECENT.get(ip) ?? []).filter((t) => now - t < WINDOW);
  if (past.length >= LIMIT) return true;
  past.push(now);
  if (RECENT.size > 5000) RECENT.clear();
  RECENT.set(ip, past);
  return false;
}

interface Line {
  model: ModelKey;
  version: Version;
  qty: number;
}

/** Nimmt nur an, was Hand und Fuss hat - alles andere fliegt raus. */
function parseLines(raw: unknown): Line[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  const lines: Line[] = [];
  for (const item of raw) {
    if (typeof item !== "object" || item === null) continue;
    const { model, version, qty } = item as Record<string, unknown>;
    if (typeof model !== "string" || !isModelKey(model)) continue;
    if (typeof version !== "string" || !isVersion(version)) continue;
    const n = Math.floor(Number(qty));
    if (!Number.isFinite(n) || n < 1 || n > MAX_QTY) continue;
    const id = `${model}:${version}`;
    if (seen.has(id)) continue;
    seen.add(id);
    lines.push({ model, version, qty: n });
  }
  return lines;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unbekannt";
  if (limited(ip)) {
    return NextResponse.json({ error: "rate" }, { status: 429 });
  }

  let lines: Line[];
  try {
    const body = (await req.json()) as { lines?: unknown; items?: unknown };
    lines = parseLines(body.lines);
  } catch {
    return NextResponse.json({ error: "bad" }, { status: 400 });
  }
  if (lines.length === 0 || lines.length > 8) {
    return NextResponse.json({ error: "bad" }, { status: 400 });
  }

  /* Fassung ohne Pasuk noch nicht bei SUMIT angelegt: lieber sauber
     absagen als still die falsche Fassung bestellen. */
  if (lines.some((l) => SUMIT_ITEMS[l.model][l.version] === null)) {
    return NextResponse.json({ error: "variant" }, { status: 503 });
  }

  const cartId = crypto.randomUUID();
  for (const line of lines) {
    const form = new URLSearchParams({
      CompanyIdentifier: SUMIT_COMPANY,
      CatalogIdentifier: SUMIT_CATALOG,
      CustomerID: "",
      CustomerKey: "",
      ItemID: String(SUMIT_ITEMS[line.model][line.version]),
      Quantity: String(line.qty),
      Increment: "true",
      CartID: cartId,
      Store: "true",
      RefreshPage: "false",
      ClearCart: "false",
    });
    const res = await fetch("https://pay.sumit.co.il/modifycart/", {
      method: "POST",
      body: form,
    });
    if (!res.ok) {
      return NextResponse.json({ error: "sumit" }, { status: 502 });
    }
  }

  return NextResponse.json({
    url: `https://pay.sumit.co.il/${SUMIT_COMPANY}/${SUMIT_CATALOG}/c/payment/?cartid=${cartId}`,
  });
}
