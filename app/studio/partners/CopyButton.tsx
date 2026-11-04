"use client";

import { useState } from "react";

/** Link kopieren, mit kurzer Bestaetigung */
export function CopyButton({ text, small }: { text: string; small?: boolean }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className={`pt-btn pt-btn-ghost${small ? " pt-btn-small" : ""}`}
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
      {done ? "הועתק ✓" : small ? "העתקה" : "העתקת הקישור"}
    </button>
  );
}
