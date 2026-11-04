import QRCode from "qrcode";
import { REF_TARGETS } from "@/lib/ref-redirect";

/**
 * QR-Code eines Partner-Links als PNG zum Herunterladen (03.11.26), z.B.
 * /api/qr?code=miriam. Gross genug fuer Druck (1200 px). Der Code ist der
 * oeffentliche Link, deshalb ohne Anmeldung. Mit &t=chanuka fuer den
 * Direktlink /r/<name>/chanuka (04.11.26).
 */
export async function GET(req: Request) {
  const q = new URL(req.url).searchParams;
  const code = q.get("code") ?? "";
  const t = q.get("t") ?? "";
  if (!/^[a-z0-9-]{2,40}$/.test(code)) return new Response("bad code", { status: 400 });
  if (t && !REF_TARGETS[t]) return new Response("bad target", { status: 400 });
  const png = await QRCode.toBuffer(`https://shoshanajudaica.co.il/r/${code}${t ? `/${t}` : ""}`, {
    width: 1200,
    margin: 2,
    errorCorrectionLevel: "M",
    color: { dark: "#2e2e2e", light: "#ffffff" },
  });
  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Content-Disposition": `attachment; filename="qr-${code}${t ? `-${t}` : ""}.png"`,
      "Cache-Control": "public, max-age=86400",
    },
  });
}
