import { ARCS, DROP } from "./Ornaments";
import { STAGE_VIEW } from "./goldParticles";

/**
 * Die Menora des Fragenwegs (04.11.26, zweite Fassung "hochwertiger").
 * Arme = Shoshanas Zeichen und sein Spiegelbild. Metall: radialer Verlauf um
 * den Mittelpunkt der Boegen (0, 64), so bekommt jeder Ring einen hellen
 * Grat und dunklere Kanten wie gegossenes Messing; dazu Licht von oben.
 * Teile: Oelschalen auf jedem Arm, Schamasch auf dem Mittelstab, schlanker
 * Schaft mit Knauf, geschwungener Fuss.
 *
 * Ablauf: grown (0..7) laesst Arme wachsen (Faechermaske), die siebte
 * Antwort Stab, Schaft und Fuss. lit: fluessiges Gold steigt vom Fuss in
 * alle Arme (wachsender Kreis als Maske, mit leuchtender Kante), ein
 * Lichtreflex gleitet einmal darueber, Funken und Flammen zuenden von der
 * Mitte aus, dahinter ein warmer Schein. Mit Maus flackern die Flammen ganz
 * leise (nur CSS), sonst stehen sie still.
 */

/** Reihenfolge der wachsenden Arme: rechts aussen, links aussen, ... */
export const ARM_ORDER: [side: "r" | "l", arc: number][] = [
  ["r", 0],
  ["l", 0],
  ["r", 1],
  ["l", 1],
  ["r", 2],
  ["l", 2],
];

/** Oelschalen: Mitte und Breite je Bogen (aussen, Mitte, innen) */
const CUPS = [
  { x: 221, w: 54 },
  { x: 129, w: 52 },
  { x: 28, w: 44 },
] as const;
const cupPath = (cx: number, w: number, top = 52) =>
  `M${cx - w / 2} ${top} H${cx + w / 2} L${cx + w / 2 - 6} ${top + 9} Q${cx} ${top + 15} ${cx - w / 2 + 6} ${top + 9} Z`;

/** Flammen: auf den Schalen und auf dem Schamasch in der Mitte */
const FLAMES = [
  { x: -221, top: 52, d: 3 },
  { x: -129, top: 52, d: 2 },
  { x: -28, top: 52, d: 1 },
  { x: 0, top: -8, d: 0 },
  { x: 28, top: 52, d: 1 },
  { x: 129, top: 52, d: 2 },
  { x: 221, top: 52, d: 3 },
];

const ROD = "M-3.5 5 H3.5 V304 H-3.5 Z";
const STEM = "M-8 300 H8 L12.5 350 H-12.5 Z";
const FOOT = "M-78 382 C-44 380 -16 372 -12.5 350 H12.5 C16 372 44 380 78 382 Z";
const PLINTH = "M-86 381 H86 Q90 381 90 385 Q90 389 86 389 H-86 Q-90 389 -90 385 Q-90 381 -86 381 Z";
const KNOB = { cx: 0, cy: 314, rx: 15, ry: 5.5 };
const SHAMASH_CUP = cupPath(0, 40, -8);
/** innerer, hellerer Flammenkern: Tropfen verkleinert um seinen Boden */
const CORE = "translate(223.7 45.8) scale(0.48 0.56) translate(-223.7 -45.8)";

const SIDES = ["r", "l"] as const;
const sideT = (side: "r" | "l") => (side === "r" ? "translate(-1 0)" : "translate(1 0) scale(-1 1)");
const cupT = (side: "r" | "l") => (side === "r" ? undefined : "scale(-1 1)");

export function MenorahStage({ grown, lit }: { grown: number; lit: boolean }) {
  const armOn = (side: "r" | "l", arc: number) => ARM_ORDER.findIndex(([s, a]) => s === side && a === arc) < grown;
  const stemOn = grown >= 7;

  /** Stab, Schaft, Knauf, Fuss, Schamasch-Schale */
  const body = (
    <>
      <path d={ROD} fill="url(#yz-stemg)" />
      <path d={STEM} fill="url(#yz-stemg)" />
      <ellipse {...KNOB} fill="url(#yz-stemg)" />
      <path d={FOOT} fill="url(#yz-footg)" />
      <path d={PLINTH} fill="url(#yz-footg)" />
      <path d={SHAMASH_CUP} fill="url(#yz-cupg)" />
    </>
  );

  return (
    <svg
      className={`yz-menorah${lit ? " is-lit" : ""}`}
      viewBox={`${STAGE_VIEW.x} ${STAGE_VIEW.y} ${STAGE_VIEW.w} ${STAGE_VIEW.h}`}
      aria-hidden="true"
    >
      <defs>
        <filter id="yz-feather" filterUnits="userSpaceOnUse" x="-500" y="-500" width="1000" height="1100">
          <feGaussianBlur stdDeviation="7" />
        </filter>
        <filter id="yz-soft" filterUnits="userSpaceOnUse" x="-700" y="-700" width="1400" height="1400">
          <feGaussianBlur stdDeviation="5" />
        </filter>
        {/* Messing: je Ring heller Grat, dunklere Kanten */}
        <radialGradient id="yz-bevel" gradientUnits="userSpaceOnUse" cx="0" cy="64" r="250">
          <stop offset="0" stopColor="#f3d993" />
          <stop offset="0.1" stopColor="#dcb867" />
          <stop offset="0.2" stopColor="#a8843a" />
          <stop offset="0.222" stopColor="#8a6a27" />
          <stop offset="0.43" stopColor="#8a6a27" />
          <stop offset="0.452" stopColor="#b38f42" />
          <stop offset="0.515" stopColor="#f4dd9e" />
          <stop offset="0.58" stopColor="#b38f42" />
          <stop offset="0.6" stopColor="#8a6a27" />
          <stop offset="0.79" stopColor="#8a6a27" />
          <stop offset="0.812" stopColor="#b38f42" />
          <stop offset="0.885" stopColor="#f5e0a2" />
          <stop offset="0.95" stopColor="#ae8a3e" />
          <stop offset="0.97" stopColor="#846424" />
          <stop offset="1" stopColor="#846424" />
        </radialGradient>
        <linearGradient id="yz-toplight" gradientUnits="userSpaceOnUse" x1="0" y1="20" x2="0" y2="330">
          <stop offset="0" stopColor="#fffaf0" stopOpacity="0.38" />
          <stop offset="0.45" stopColor="#fffaf0" stopOpacity="0.05" />
          <stop offset="1" stopColor="#3a2a08" stopOpacity="0.16" />
        </linearGradient>
        <linearGradient id="yz-stemg" gradientUnits="userSpaceOnUse" x1="-14" y1="0" x2="14" y2="0">
          <stop offset="0" stopColor="#7f6022" />
          <stop offset="0.42" stopColor="#f0d38c" />
          <stop offset="0.62" stopColor="#b8913f" />
          <stop offset="1" stopColor="#755820" />
        </linearGradient>
        <linearGradient id="yz-footg" gradientUnits="userSpaceOnUse" x1="0" y1="350" x2="0" y2="390">
          <stop offset="0" stopColor="#f3d993" />
          <stop offset="0.55" stopColor="#ad893c" />
          <stop offset="1" stopColor="#6f531c" />
        </linearGradient>
        <linearGradient id="yz-cupg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f7e3a8" />
          <stop offset="1" stopColor="#9c7a33" />
        </linearGradient>
        <linearGradient id="yz-glint" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fffaf0" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fffaf0" stopOpacity="0.8" />
          <stop offset="1" stopColor="#fffaf0" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="yz-flamefill" cx="0.5" cy="0.78" r="0.8">
          <stop offset="0" stopColor="#fff6d6" />
          <stop offset="0.38" stopColor="#ffdf8a" />
          <stop offset="0.72" stopColor="#f2b54a" />
          <stop offset="1" stopColor="#d98a2b" />
        </radialGradient>
        <radialGradient id="yz-glow">
          <stop offset="0" stopColor="#ffd36e" stopOpacity="0.55" />
          <stop offset="0.4" stopColor="#ffcf6b" stopOpacity="0.16" />
          <stop offset="1" stopColor="#ffcf6b" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="yz-aura" gradientUnits="userSpaceOnUse" cx="0" cy="120" r="330">
          <stop offset="0" stopColor="#f7e2a6" stopOpacity="0.34" />
          <stop offset="0.3" stopColor="#f7e2a6" stopOpacity="0.2" />
          <stop offset="0.6" stopColor="#f7e2a6" stopOpacity="0.07" />
          <stop offset="1" stopColor="#f7e2a6" stopOpacity="0" />
        </radialGradient>
        {ARM_ORDER.map(([side, arc], order) => (
          <mask key={`${side}${arc}`} id={`yz-m-${side}${arc}`} maskUnits="userSpaceOnUse" x="-80" y="-80" width="420" height="480">
            <circle
              className={`yz-sweep${order < grown ? " is-on" : ""}`}
              cx="0"
              cy="64"
              r="160"
              fill="none"
              stroke="#fff"
              strokeWidth="340"
              transform="rotate(-25 0 64)"
              filter="url(#yz-feather)"
            />
          </mask>
        ))}
        {/* fluessiges Gold steigt vom Fuss auf */}
        <mask id="yz-pour" maskUnits="userSpaceOnUse" x="-300" y="-140" width="600" height="560">
          <circle className="yz-pour-c" cx="0" cy="390" r="490" fill="#fff" filter="url(#yz-soft)" />
        </mask>
        <clipPath id="yz-shape">
          {SIDES.flatMap((side) => ARCS.map((d, arc) => <path key={`${side}${arc}`} d={d} transform={sideT(side)} />))}
          {SIDES.flatMap((side) => CUPS.map((c, arc) => <path key={`c${side}${arc}`} d={cupPath(c.x, c.w)} transform={cupT(side)} />))}
          <path d={ROD} />
          <path d={STEM} />
          <ellipse {...KNOB} />
          <path d={FOOT} />
          <path d={PLINTH} />
          <path d={SHAMASH_CUP} />
        </clipPath>
      </defs>

      {/* warmer Schein hinter der brennenden Menora */}
      <ellipse className="yz-aura" cx="0" cy="130" rx="330" ry="300" fill="url(#yz-aura)" />

      {/* zarte Vorahnung, je Teil ausgeblendet sobald es gewachsen ist */}
      <g className="yz-ghost">
        {SIDES.map((side) => (
          <g key={side} transform={sideT(side)}>
            {ARCS.map((d, arc) => (
              <path key={arc} d={d} className={armOn(side, arc) ? "is-off" : ""} />
            ))}
          </g>
        ))}
        <g className={stemOn ? "is-off" : ""}>
          <path d={STEM} />
          <path d={FOOT} />
          <path d={PLINTH} />
        </g>
      </g>

      {/* waehrend der Fragen: mattes Messing, Teil fuer Teil */}
      <g className="yz-pale">
        <g className={`yz-stem${stemOn ? " is-on" : ""}`}>{body}</g>
        {SIDES.map((side) => (
          <g key={side} transform={sideT(side)}>
            {ARCS.map((d, arc) => (
              <g key={arc} mask={`url(#yz-m-${side}${arc})`}>
                <path d={d} fill="url(#yz-bevel)" />
              </g>
            ))}
          </g>
        ))}
        {SIDES.map((side) =>
          CUPS.map((c, arc) => (
            <g key={`c${side}${arc}`} transform={cupT(side)}>
              <path d={cupPath(c.x, c.w)} fill="url(#yz-cupg)" className={`yz-cup${armOn(side, arc) ? " is-on" : ""}`} />
            </g>
          )),
        )}
      </g>

      {/* das volle Gold, steigt beim Anzuenden vom Fuss auf */}
      <g className="yz-gold" mask="url(#yz-pour)">
        {body}
        {SIDES.map((side) => (
          <g key={side} transform={sideT(side)}>
            {ARCS.map((d, arc) => (
              <path key={arc} d={d} fill="url(#yz-bevel)" />
            ))}
          </g>
        ))}
        {SIDES.map((side) =>
          CUPS.map((c, arc) => <path key={`g${side}${arc}`} d={cupPath(c.x, c.w)} fill="url(#yz-cupg)" transform={cupT(side)} />),
        )}
        <g clipPath="url(#yz-shape)">
          <rect x="-262" y="-100" width="524" height="500" fill="url(#yz-toplight)" />
          <g transform="rotate(16 0 140)">
            <rect className="yz-glint" x="-460" y="-180" width="130" height="680" fill="url(#yz-glint)" />
          </g>
        </g>
      </g>
      {/* leuchtende Kante des steigenden Goldes */}
      <g clipPath="url(#yz-shape)" className="yz-front-wrap">
        <circle className="yz-pour-front" cx="0" cy="390" r="490" fill="none" stroke="#fff4cf" strokeWidth="16" filter="url(#yz-soft)" />
      </g>

      {/* Funken und Flammen */}
      {FLAMES.map((f, i) => (
        <g key={i} className="yz-flame" style={{ "--fd": f.d } as React.CSSProperties}>
          <circle cx={f.x} cy={f.top - 16} r="54" fill="url(#yz-glow)" className="yz-flame-glow" />
          <circle cx={f.x} cy={f.top - 3} r="3" fill="#fff6d8" className="yz-spark" />
          <g transform={`translate(${f.x - 223.7} ${f.top - 43})`}>
            <g className="yz-flame-ignite">
              <g className="yz-flame-flick">
                <path d={DROP} fill="url(#yz-flamefill)" />
                <path d={DROP} fill="#fffdf4" opacity="0.85" transform={CORE} />
              </g>
            </g>
          </g>
        </g>
      ))}
    </svg>
  );
}
