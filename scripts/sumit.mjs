#!/usr/bin/env node
/**
 * Kleines Werkzeug fuer die SUMIT-API (Betrieb shoshanajudaica).
 * Liest SUMIT_COMPANY_ID und SUMIT_API_KEY aus .env.local (nie hochgeladen).
 *
 *   node scripts/sumit.mjs test                      Verbindung pruefen
 *   node scripts/sumit.mjs list                      alle Produkte (Income Items)
 *   node scripts/sumit.mjs find <text>               Produkte, deren Name <text> enthaelt
 *   node scripts/sumit.mjs create "<Name>" <Preis> ["Beschreibung"] [SKU]
 *
 * Doku: https://app.sumit.co.il/developers/api/
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function loadEnv() {
  const env = { ...process.env };
  try {
    for (const line of readFileSync(join(root, ".env.local"), "utf8").split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
      if (m && !env[m[1]]) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  } catch {
    /* keine .env.local */
  }
  return env;
}

const env = loadEnv();
const companyId = Number(env.SUMIT_COMPANY_ID);
const apiKey = env.SUMIT_API_KEY;
if (!companyId || !apiKey) {
  console.error("SUMIT_COMPANY_ID oder SUMIT_API_KEY fehlt in .env.local");
  process.exit(1);
}

const ok = (s) => s === 0 || s === "Success" || s === "Success (0)";

async function call(path, body = {}) {
  const res = await fetch(`https://api.sumit.co.il${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ Credentials: { CompanyID: companyId, APIKey: apiKey }, ...body }),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok || !data || !ok(data.Status)) {
    const msg = data?.UserErrorMessage || data?.TechnicalErrorDetails || `HTTP ${res.status}`;
    throw new Error(`SUMIT ${path}: ${msg}`);
  }
  return data.Data;
}

async function listAll() {
  const items = [];
  for (let start = 0; ; start += 1000) {
    const d = await call("/accounting/incomeitems/list/", { Paging: { StartIndex: start, PageSize: 1000 } });
    items.push(...(d?.IncomeItems ?? []));
    if (!d?.HasNextPage) break;
  }
  return items;
}

const print = (items) =>
  items.forEach((i) => console.log(`${String(i.ID).padEnd(12)} ${String(i.Price ?? "").padStart(7)} ₪  ${i.Name}${i.SKU ? `  [${i.SKU}]` : ""}`));

const [cmd, ...args] = process.argv.slice(2);
try {
  if (cmd === "test") {
    const items = await listAll();
    console.log(`Verbindung ok. Betrieb ${companyId}, ${items.length} Produkte.`);
  } else if (cmd === "list") {
    print(await listAll());
  } else if (cmd === "find") {
    const q = (args.join(" ") || "").toLowerCase();
    print((await listAll()).filter((i) => (i.Name ?? "").toLowerCase().includes(q)));
  } else if (cmd === "create") {
    const [name, price, description, sku] = args;
    const p = Number(price);
    if (!name || !(p > 0)) throw new Error('Aufruf: create "<Name>" <Preis> ["Beschreibung"] [SKU]');
    const existing = (await listAll()).filter((i) => i.Name === name);
    if (existing.length) {
      console.log(`Gibt es schon, nichts angelegt:`);
      print(existing);
    } else {
      const d = await call("/accounting/incomeitems/create/", {
        IncomeItem: { Name: name, Price: p, Description: description || null, SKU: sku || null },
      });
      console.log(`Angelegt: ${d.EntityID}  ${p} ₪  ${name}`);
    }
  } else {
    console.log("Befehle: test | list | find <text> | create \"<Name>\" <Preis> [\"Beschreibung\"] [SKU]");
  }
} catch (e) {
  console.error(e.message);
  process.exit(1);
}
