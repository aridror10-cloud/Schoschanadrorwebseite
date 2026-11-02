// Nur auf dem Server benutzen (API-Routen): hier liegen die geheimen Schluessel.
import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * PayPlus: zweite Kasse neben SUMIT (02.11.26). Die SUMIT-Kasse bleibt
 * unveraendert; diese hier ist nur aktiv, wenn die Schluessel gesetzt sind
 * und NEXT_PUBLIC_CHECKOUT=payplus steht (siehe lib/checkout.ts).
 *
 * Umgebungsvariablen (nur in Vercel, nie im Code):
 *   PAYPLUS_API_KEY, PAYPLUS_SECRET_KEY, PAYPLUS_PAGE_UID
 *   PAYPLUS_ENV = "staging" fuer die Testumgebung, sonst Produktion
 *
 * Doku: https://docs.payplus.co.il/reference/post_paymentpages-generatelink
 */

const BASE = {
  production: "https://restapi.payplus.co.il/api/v1.0",
  staging: "https://restapidev.payplus.co.il/api/v1.0",
} as const;

export function payplusConfig() {
  const apiKey = process.env.PAYPLUS_API_KEY;
  const secretKey = process.env.PAYPLUS_SECRET_KEY;
  const pageUid = process.env.PAYPLUS_PAGE_UID;
  if (!apiKey || !secretKey || !pageUid) return null;
  const base = process.env.PAYPLUS_ENV === "staging" ? BASE.staging : BASE.production;
  return { apiKey, secretKey, pageUid, base };
}

export interface PayPlusItem {
  name: string;
  quantity: number;
  price: number;
  /** 0 = inkl. MwSt, 1 = zzgl. MwSt, 2 = befreit (עוסק פטור) */
  vat_type: 0 | 1 | 2;
  shipping?: boolean;
}

export interface LinkRequest {
  amount: number;
  items: PayPlusItem[];
  language: "he" | "en";
  successUrl: string;
  failureUrl: string;
  cancelUrl: string;
  callbackUrl: string;
  /** frei: wir legen hier den Empfehlungscode ab */
  moreInfo?: string;
  /** frei: kurze Korb-Zusammenfassung fuer Shoshana */
  moreInfo2?: string;
}

/** Erzeugt eine PayPlus-Zahlseite und liefert deren Adresse. */
export async function generatePaymentLink(req: LinkRequest): Promise<string> {
  const cfg = payplusConfig();
  if (!cfg) throw new Error("payplus_unconfigured");
  const res = await fetch(`${cfg.base}/PaymentPages/generateLink`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": cfg.apiKey,
      "secret-key": cfg.secretKey,
    },
    body: JSON.stringify({
      payment_page_uid: cfg.pageUid,
      charge_method: 1,
      amount: req.amount,
      currency_code: "ILS",
      language_code: req.language,
      sendEmailApproval: true,
      sendEmailFailure: false,
      refURL_success: req.successUrl,
      refURL_failure: req.failureUrl,
      refURL_cancel: req.cancelUrl,
      refURL_callback: req.callbackUrl,
      more_info: req.moreInfo ?? "",
      more_info_2: req.moreInfo2 ?? "",
      items: req.items,
    }),
  });
  const data = (await res.json().catch(() => null)) as {
    results?: { status?: string; code?: number; description?: string };
    data?: { payment_page_link?: string };
  } | null;
  const link = data?.data?.payment_page_link;
  if (!res.ok || data?.results?.code !== 0 || !link) {
    throw new Error(`payplus_${res.status}_${data?.results?.description ?? "unknown"}`);
  }
  return link;
}

/**
 * Prueft, ob eine Rueckmeldung wirklich von PayPlus kommt: Kopfzeile
 * "hash" = Base64 von HMAC-SHA256(Rohtext, Secret Key), user-agent "PayPlus".
 */
export function verifyCallback(rawBody: string, hash: string | null, userAgent: string | null): boolean {
  const cfg = payplusConfig();
  if (!cfg || !hash || userAgent !== "PayPlus") return false;
  const expected = createHmac("sha256", cfg.secretKey).update(rawBody).digest("base64");
  const a = Buffer.from(expected);
  const b = Buffer.from(hash);
  return a.length === b.length && timingSafeEqual(a, b);
}
