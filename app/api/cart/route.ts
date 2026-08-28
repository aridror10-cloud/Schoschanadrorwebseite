import { NextResponse } from "next/server";
import { isCartKey } from "@/lib/cart";

/**
 * Baut einen SUMIT-Warenkorb fuer die gewaehlten Modelle und liefert die
 * Adresse der fertigen Zahlseite zurueck.
 *
 * SUMIT fuehrt Warenkoerbe serverseitig unter einer frei waehlbaren
 * Kart-Kennung (dieselbe Mechanik, die die Katalogseite selbst nutzt).
 * Wir legen pro Bestellung eine frische Kennung an, melden jeden Artikel
 * einzeln an und schicken die Kundschaft dann auf die Zahlseite - dort
 * uebernehmen Versandwahl, Pflichtfelder und Kartenzahlung wie gehabt.
 */

const SUMIT_COMPANY = "11yegzt";
const SUMIT_CATALOG = "122fbi4";

/** SUMIT-Produktnummern im Katalog "sidrat Carlebach" */
const SUMIT_ITEMS: Record<string, number> = {
  simcha: 2295247327,
  regesh: 2295257571,
  shrika: 2295252407,
  set: 2295176895,
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

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unbekannt";
  if (limited(ip)) {
    return NextResponse.json({ error: "rate" }, { status: 429 });
  }

  let items: string[];
  try {
    const body = (await req.json()) as { items?: unknown };
    items = Array.isArray(body.items)
      ? [...new Set(body.items.filter((k): k is string => typeof k === "string" && isCartKey(k)))]
      : [];
  } catch {
    return NextResponse.json({ error: "bad" }, { status: 400 });
  }
  if (items.length === 0 || items.length > 4) {
    return NextResponse.json({ error: "bad" }, { status: 400 });
  }

  const cartId = crypto.randomUUID();
  for (const key of items) {
    const form = new URLSearchParams({
      CompanyIdentifier: SUMIT_COMPANY,
      CatalogIdentifier: SUMIT_CATALOG,
      CustomerID: "",
      CustomerKey: "",
      ItemID: String(SUMIT_ITEMS[key]),
      Quantity: "1",
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
