import { refRedirect } from "@/lib/ref-redirect";

/** Empfehlungslink /r/<name>, fuehrt zur Carlebach-Seite (Logik in lib/ref-redirect.ts) */
export async function GET(request: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  return refRedirect(request, code);
}
