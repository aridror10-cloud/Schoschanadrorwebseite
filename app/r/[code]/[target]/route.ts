import { refRedirect } from "@/lib/ref-redirect";

/** Kurzer Direktlink /r/<name>/chanuka, /r/<name>/en ... (Ziele in lib/ref-redirect.ts) */
export async function GET(request: Request, { params }: { params: Promise<{ code: string; target: string }> }) {
  const { code, target } = await params;
  return refRedirect(request, code, target);
}
