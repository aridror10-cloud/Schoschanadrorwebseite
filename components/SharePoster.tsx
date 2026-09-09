/**
 * Plakat als ganze Seite, fuer die Teil-Links /sukkot und /en/sukkot.
 *
 * Der schwarze Balken im Plakat ist der Knopf: ein unsichtbarer Anker
 * liegt genau ueber diesem Bereich. Die Lage wird je Plakat in Prozent
 * der Bildflaeche angegeben (am Originalbild gemessen), damit sie bei
 * jeder Bildschirmbreite mitwaechst.
 *
 * Bewusst ein normaler Anker statt Router-Link: die Zielseite laedt
 * voll, und der Browser springt selbst zum Abschnitt - das klappt auch
 * in den In-App-Browsern von WhatsApp und Facebook.
 */
export interface Hotspot {
  left: string;
  top: string;
  width: string;
  height: string;
}

export function SharePoster({
  src,
  alt,
  href,
  label,
  hot,
}: {
  src: string;
  alt: string;
  href: string;
  label: string;
  hot: Hotspot;
}) {
  return (
    <main className="share">
      <div className="share-card">
        <div className="share-poster">
          <img src={src} alt={alt} width={1024} height={1536} fetchPriority="high" />
          <a href={href} className="share-hot" aria-label={label} style={hot} />
        </div>
      </div>
    </main>
  );
}
