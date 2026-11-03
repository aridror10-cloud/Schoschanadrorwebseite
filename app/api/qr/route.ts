import QRCode from "qrcode";

/**
 * QR-Code eines Partner-Links als PNG zum Herunterladen (03.11.26), z.B.
 * /api/qr?code=miriam. Gross genug fuer Druck (1200 px). Der Code ist der
 * oeffentliche Link, deshalb ohne Anmeldung.
 */
export async function GET(req: Request) {
  const code = new URL(req.url).searchParams.get("code") ?? "";
  if (!/^[a-z0-9-]{2,40}$/.test(code)) return new Response("bad code", { status: 400 });
  const png = await QRCode.toBuffer(`https://shoshanajudaica.co.il/r/${code}`, {
    width: 1200,
    margin: 2,
    errorCorrectionLevel: "M",
    color: { dark: "#2e2e2e", light: "#ffffff" },
  });
  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Content-Disposition": `attachment; filename="qr-${code}.png"`,
      "Cache-Control": "public, max-age=86400",
    },
  });
}
