"use client";

import { useState } from "react";

/** Link kopieren, mit kurzer Bestaetigung */
export function CopyButton({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className="pt-btn pt-btn-ghost"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
        } catch {
          const t = document.createElement("textarea");
          t.value = text;
          document.body.appendChild(t);
          t.select();
          document.execCommand("copy");
          t.remove();
        }
        setDone(true);
        window.setTimeout(() => setDone(false), 1800);
      }}
    >
      {done ? "הועתק ✓" : "העתקת הקישור"}
    </button>
  );
}
