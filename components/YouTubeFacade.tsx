"use client";

import { useState } from "react";

/**
 * YouTube-Video mit Vorschaubild. Das eigentliche Video (youtube-nocookie)
 * laedt erst nach dem Klick: die Seite bleibt schnell, und ohne Klick
 * gehen keine Daten an YouTube.
 */
export function YouTubeFacade({ id, title, playLabel }: { id: string; title: string; playLabel: string }) {
  const [on, setOn] = useState(false);
  return (
    <div className="yt">
      {on ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button type="button" className="yt-poster" onClick={() => setOn(true)} aria-label={`${playLabel}: ${title}`}>
          <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" loading="lazy" width={480} height={360} />
          <span className="yt-play" aria-hidden="true">
            <svg viewBox="0 0 68 48" width="68" height="48">
              <path d="M66.5 7.7c-.8-2.9-3-5.2-5.9-6C55.3.3 34 .3 34 .3S12.7.3 7.4 1.7c-2.9.8-5.1 3.1-5.9 6C.1 13 .1 24 .1 24s0 11 1.4 16.3c.8 2.9 3 5.2 5.9 6C12.7 47.7 34 47.7 34 47.7s21.3 0 26.6-1.4c2.9-.8 5.1-3.1 5.9-6C67.9 35 67.9 24 67.9 24s0-11-1.4-16.3z" />
              <path d="M45 24 27 14v20" fill="#fff" />
            </svg>
          </span>
          <span className="yt-caption">{title}</span>
        </button>
      )}
    </div>
  );
}
