/**
 * Verzierungen aus Shoshanas eigener Formsprache: Laserschnitt-Linien,
 * der Davidstern als Grundform (wie in ihrer Papierarbeit "שמע ישראל"),
 * Gold als Akzent. Alles als feine Linie, nie als Flaeche, damit die
 * Werke im Vordergrund bleiben (Abschnitt 9 ihres Konzepts).
 */

const R = 100; // Koordinatensystem der Rosette: -R .. R

function polar(r: number, deg: number) {
  const a = ((deg - 90) * Math.PI) / 180;
  return [+(r * Math.cos(a)).toFixed(2), +(r * Math.sin(a)).toFixed(2)] as const;
}

/** Sechszackiger Stern als Pfad (zwei Dreiecke). */
function hexagram(r: number) {
  const t = (o: number) =>
    [0, 120, 240].map((d, i) => `${i ? "L" : "M"}${polar(r, d + o).join(" ")}`).join(" ") + " Z";
  return `${t(0)} ${t(60)}`;
}

/** Zwoelf Blattboegen um die Mitte, wie eine Schnittrosette. */
function petals(rIn: number, rOut: number) {
  let d = "";
  for (let i = 0; i < 12; i++) {
    const a = i * 30;
    const [x1, y1] = polar(rIn, a - 15);
    const [x2, y2] = polar(rIn, a + 15);
    const [cx, cy] = polar(rOut, a);
    d += `M${x1} ${y1} Q${cx} ${cy} ${x2} ${y2} `;
  }
  return d;
}

/** Grosse Rosette, zeichnet sich beim Laden einmal ein. */
export function Rosette({ className = "" }: { className?: string }) {
  const paths = [
    { d: `M0 ${-R + 4} A${R - 4} ${R - 4} 0 1 1 -0.01 ${-R + 4}`, w: 0.6 },
    { d: `M0 ${-R + 12} A${R - 12} ${R - 12} 0 1 1 -0.01 ${-R + 12}`, w: 0.35 },
    { d: petals(58, 92), w: 0.5 },
    { d: hexagram(62), w: 0.55 },
    { d: hexagram(36), w: 0.45 },
    { d: `M0 -22 A22 22 0 1 1 -0.01 -22`, w: 0.45 },
    { d: petals(10, 30), w: 0.4 },
  ];
  return (
    <svg className={`sj-rosette ${className}`} viewBox={`${-R} ${-R} ${2 * R} ${2 * R}`} aria-hidden="true" focusable="false">
      {paths.map((p, i) => (
        <path
          key={i}
          d={p.d}
          pathLength={1}
          strokeWidth={p.w}
          style={{ animationDelay: `${0.15 + i * 0.18}s` }}
        />
      ))}
    </svg>
  );
}

/** Trenner: Goldlinie, kleiner Stern, Goldlinie. */
export function Divider({ className = "" }: { className?: string }) {
  return (
    <div className={`sj-divider ${className}`} aria-hidden="true">
      <span className="sj-divider-line" />
      <svg viewBox="-12 -12 24 24" width="22" height="22" focusable="false">
        <path d={hexagramSmall} />
        <circle r="2.2" />
      </svg>
      <span className="sj-divider-line" />
    </div>
  );
}

const hexagramSmall = (() => {
  const p = (r: number, deg: number) => {
    const a = ((deg - 90) * Math.PI) / 180;
    return `${(r * Math.cos(a)).toFixed(2)} ${(r * Math.sin(a)).toFixed(2)}`;
  };
  const t = (o: number) => [0, 120, 240].map((d, i) => `${i ? "L" : "M"}${p(9, d + o)}`).join(" ") + " Z";
  return `${t(0)} ${t(60)}`;
})();
