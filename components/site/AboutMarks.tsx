import type { CSSProperties } from "react";
import { ARCS, DROP } from "./Ornaments";
import { CONSTRUCTION, R45, SKETCH } from "./aboutMarkPaths";
import { DrawOnView } from "./DrawOnView";

/**
 * Zeichen unter den Abschnittsueberschriften auf "Ueber mich" (04.11.26,
 * Wunsch Bernard): statt viermal dasselbe blasse Zeichen entsteht in jedem
 * Abschnitt das Zeichen auf eine eigene Art, passend zum Inhalt, einmal
 * beim Hinscrollen. Fertiger Zustand ist der Grundzustand (ohne JS, Handy,
 * "Bewegung reduzieren"); die Bewegung steht in app/about/about-marks.css.
 *
 * - laser: vom Bildschirm ins Material, Laserpunkt schneidet die Formen aus
 * - blueprint: technische Zeichnung, die Teile setzen sich auf die Hilfslinien
 * - sketch: lockere Bleistiftstriche ziehen sich zur klaren Form zusammen
 * - papercut: Scherenschnitt, die Teile heben sich aus dem Blatt
 */
export type AboutMarkKind = "laser" | "blueprint" | "sketch" | "papercut";

/* Zeichen: x 0..243, y 0..307; Rand fuer Hilfslinien und Blatt */
const VB = "-44 -44 332 396";
const MARK = [DROP, ...ARCS];
const S2 = Math.SQRT1_2;

/** Verzoegerung und Dauer als CSS-Variablen */
function at(d: number, t?: number): CSSProperties {
  return { "--d": `${d}s`, ...(t !== undefined ? { "--t": `${t}s` } : {}) } as CSSProperties;
}

function Gold({ id, deep = false }: { id: string; deep?: boolean }) {
  return (
    <linearGradient id={id} gradientUnits="userSpaceOnUse" x1="243" y1="0" x2="0" y2="307">
      <stop offset="0" stopColor={deep ? "#c4a45a" : "#d2b46c"} />
      <stop offset="0.5" stopColor={deep ? "#a8893f" : "#b39549"} />
      <stop offset="1" stopColor={deep ? "#b89a50" : "#c5a75f"} />
    </linearGradient>
  );
}

/* ---------- 1 Laser: Vektorpfad mit Knoten, Laserpunkt schneidet, Material bleibt ---------- */

/* Schnittfolge: Tropfen, dann die Boegen von aussen nach innen [Start, Dauer] */
const CUT: readonly (readonly [number, number])[] = [
  [0.45, 0.3],
  [0.81, 0.9],
  [1.77, 0.62],
  [2.45, 0.38],
];
/* Ankerpunkte an den Ecken der Boegen und am Tropfen */
const NODES: readonly (readonly [number, number])[] = [
  [223.4, 0.4], [223.4, 45.6],
  [242.6, 64], [199.6, 64], [0.6, 263.6], [0.6, 306.6],
  [150.2, 64], [106.6, 64], [0.6, 170.6], [0.6, 213.8],
  [55.2, 64], [0.6, 64], [0.6, 118.8],
];

function Laser({ id }: { id: string }) {
  const r = R45[0] ?? 230;
  const hx = r * S2;
  const hy = 64 + r * S2;
  return (
    <svg viewBox={VB} focusable="false">
      <defs>
        <Gold id={`${id}-g`} />
      </defs>
      {/* Bildschirm: gestrichelter Pfad mit Ankerpunkten und einem Anfasser */}
      <g className="am-plan">
        {MARK.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
      <g className="am-nodes">
        <line x1={hx - 34 * S2} y1={hy + 34 * S2} x2={hx + 34 * S2} y2={hy - 34 * S2} />
        <circle cx={hx - 34 * S2} cy={hy + 34 * S2} r="2.6" />
        <circle cx={hx + 34 * S2} cy={hy - 34 * S2} r="2.6" />
        <rect x={hx - 3} y={hy - 3} width="6" height="6" />
        {NODES.map(([x, y], i) => (
          <rect key={i} x={x - 3} y={y - 3} width="6" height="6" />
        ))}
      </g>
      {/* Material: jedes Teil fuellt sich, sobald es ausgeschnitten ist */}
      {MARK.map((d, i) => {
        const [s, t] = CUT[i] ?? [0, 0];
        return <path key={i} className="am-fill" d={d} fill={`url(#${id}-g)`} style={at(s + t - 0.05)} />;
      })}
      <g className="am-cuts">
        {MARK.map((d, i) => {
          const [s, t] = CUT[i] ?? [0, 0];
          return <path key={i} className="am-cut" d={d} pathLength={1} style={at(s, t)} />;
        })}
      </g>
      {/* Laserpunkt: kurzes helles Stueck, das dem Schnitt vorausgeht
          (Schein aus breiten, zarten Strichen; ein Unschaerfefilter auf der
          leeren Gruppe malt in Chrome ein schwarzes Viereck) */}
      <g className="am-beam">
        {(["halo", "glow", "core"] as const).map((k) =>
          MARK.map((d, i) => {
            const [s, t] = CUT[i] ?? [0, 0];
            return <path key={`${k}${i}`} className={`am-beam-${k}`} d={d} pathLength={1} style={at(s, t)} />;
          }),
        )}
      </g>
    </svg>
  );
}

/* ---------- 2 Bauzeichnung: Achsen, Hilfslinien, Masse, dann setzen sich die Teile ---------- */

const RULER_TICKS = [55, 105.1, 148.8, 197.6];

function Blueprint({ id }: { id: string }) {
  const end = 262 * S2;
  return (
    <svg viewBox={VB} focusable="false">
      <defs>
        <Gold id={`${id}-g`} />
        {/* Mittellinien strichpunktiert: die Maske zeichnet sie von der Mitte aus */}
        <mask id={`${id}-ax`} maskUnits="userSpaceOnUse" x="-60" y="-60" width="380" height="440">
          <path className="am-draw" d="M0 64H264" pathLength={1} style={at(0.1, 1.2)} />
          <path className="am-draw" d="M0 64H-30" pathLength={1} style={at(0.1, 0.5)} />
          <path className="am-draw" d="M0 64V330" pathLength={1} style={at(0.1, 1.2)} />
          <path className="am-draw" d="M0 64V40" pathLength={1} style={at(0.1, 0.5)} />
        </mask>
      </defs>
      <g className="am-bp">
        <g mask={`url(#${id}-ax)`}>
          <path className="am-axis" d="M-30 64H264M0 40V330" />
        </g>
        <circle className="am-draw am-bp-fine" cx="0" cy="64" r="5" pathLength={1} style={at(0.2, 0.8)} />
        {CONSTRUCTION.map((d, i) => (
          <path key={i} className="am-draw" d={d} pathLength={1} style={at(0.3 + i * 0.12, 1.4)} />
        ))}
        {/* Hilfskreis und Kreuz um den Tropfen */}
        <circle className="am-draw am-bp-fine" cx="223.7" cy="23" r="31" pathLength={1} transform="rotate(-90 223.7 23)" style={at(0.55, 1.2)} />
        <path className="am-draw am-bp-fine" d="M184 23H263" pathLength={1} style={at(0.6, 0.9)} />
        <path className="am-draw am-bp-fine" d="M223.7 -16V58" pathLength={1} style={at(0.6, 0.9)} />
        {/* Masslinie unter 45 Grad */}
        <path className="am-draw am-bp-fine" d={`M0 64L${end.toFixed(1)} ${(64 + end).toFixed(1)}`} pathLength={1} style={at(0.7, 1.2)} />
        {/* Masslinie oben mit Teilstrichen */}
        <path className="am-draw am-bp-fine" d="M0 -26H242.9" pathLength={1} style={at(0.45, 1.3)} />
        <g className="am-ticks">
          <path className="am-tick" d="M0 -33V-19M242.9 -33V-19" style={at(0.5)} />
          {RULER_TICKS.map((x, i) => (
            <path key={x} className="am-tick" d={`M${x} -29.5V-22.5`} style={at(0.7 + i * 0.1)} />
          ))}
        </g>
      </g>
      {/* die Teile kommen von aussen und setzen sich auf ihre Linien */}
      {[3, 2, 1].map((k, j) => (
        <g key={k} className="am-part" style={at(1.15 + j * 0.16, 1.4)}>
          <path d={ARCS[k - 1]} fill={`url(#${id}-g)`} />
        </g>
      ))}
      <g className="am-part am-part-drop" style={at(1.75, 1.3)}>
        <path d={DROP} fill={`url(#${id}-g)`} />
      </g>
      {/* Teilstriche auf den Kanten, ueber den Teilen */}
      <g className="am-ticks">
        {R45.map((r, i) => {
          const x = r * S2;
          const y = 64 + r * S2;
          return <path key={i} className="am-tick" d={`M${(x - 4).toFixed(1)} ${(y + 4).toFixed(1)}L${(x + 4).toFixed(1)} ${(y - 4).toFixed(1)}`} style={at(1.3 + (4 - i) * 0.08)} />;
        })}
      </g>
    </svg>
  );
}

/* ---------- 3 Skizze: lockere Striche ziehen sich zusammen, Gold fliesst hinein ---------- */

function Sketch({ id }: { id: string }) {
  let n0 = 0;
  let n1 = 0;
  const pass = (p: 0 | 1) =>
    SKETCH.filter((s) => s.pass === p).map((s, i) => {
      const n = p === 0 ? n0++ : n1++;
      return <path key={i} className="am-draw" d={s.d} pathLength={1} style={p === 0 ? at(0.1 + n * 0.07, 0.6) : at(0.5 + n * 0.08, 0.55)} />;
    });
  return (
    <svg viewBox={VB} focusable="false">
      <defs>
        <Gold id={`${id}-g`} />
        <linearGradient id={`${id}-edge`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.14" stopColor="#fff" stopOpacity="1" />
        </linearGradient>
        <mask id={`${id}-wipe`} maskUnits="userSpaceOnUse" x="-60" y="-60" width="380" height="440">
          <g transform="rotate(-35 122 154)">
            <rect className="am-wipe" x="-300" y="-300" width="920" height="920" fill={`url(#${id}-edge)`} style={at(1.25, 1.7)} />
          </g>
        </mask>
      </defs>
      <g mask={`url(#${id}-wipe)`}>
        {MARK.map((d, i) => (
          <path key={i} d={d} fill={`url(#${id}-g)`} />
        ))}
      </g>
      <g className="am-sk">
        <g className="am-sk-p0" style={at(0.55, 1.9)}>
          {pass(0)}
        </g>
        <g className="am-sk-p1" style={at(0.75, 1.8)}>
          {pass(1)}
        </g>
      </g>
    </svg>
  );
}

/* ---------- 4 Scherenschnitt: Messer zieht die Linien, die Teile heben sich ab ---------- */

const KNIFE: readonly (readonly [number, number])[] = [
  [0.35, 0.55],
  [0.5, 1.05],
  [0.7, 0.85],
  [0.9, 0.6],
];
const SHEET = "M-24 -24H267V331H-24Z";
const PAPER = "#fffdf8";

function Papercut({ id }: { id: string }) {
  return (
    <svg viewBox={VB} focusable="false">
      <defs>
        <Gold id={`${id}-g`} deep />
        <filter id={`${id}-card`} filterUnits="userSpaceOnUse" x="-80" y="-80" width="420" height="500">
          <feGaussianBlur stdDeviation="7" />
        </filter>
        {/* Papierdicke: Schatten des Blatts faellt auch in die Ausschnitte */}
        <filter id={`${id}-sheet`} filterUnits="userSpaceOnUse" x="-80" y="-80" width="420" height="500">
          <feDropShadow dx="1.4" dy="2.6" stdDeviation="2" floodColor="#4a3c18" floodOpacity="0.34" />
        </filter>
        <filter id={`${id}-lift`} filterUnits="userSpaceOnUse" x="-80" y="-80" width="420" height="500">
          <feGaussianBlur stdDeviation="3.4" />
        </filter>
      </defs>
      <rect className="am-pc-card" x="-22" y="-18" width="287" height="353" rx="3" filter={`url(#${id}-card)`} />
      <g>
        {MARK.map((d, i) => (
          <path key={i} d={d} fill={`url(#${id}-g)`} />
        ))}
      </g>
      <path d={`${SHEET} ${MARK.join(" ")}`} fill={PAPER} fillRule="evenodd" filter={`url(#${id}-sheet)`} />
      <path className="am-pc-rim" d={SHEET} />
      {MARK.map((d, i) => {
        const [s, t] = KNIFE[i] ?? [0, 0];
        return (
          <g key={i} className="am-pc-piece" style={at(s + t + 0.1, 1.5)}>
            <path className="am-pc-shadow" d={d} filter={`url(#${id}-lift)`} style={at(s + t + 0.1, 1.5)} />
            <path className="am-pc-face" d={d} fill={PAPER} stroke={PAPER} />
            <path className="am-draw am-knife" d={d} pathLength={1} style={at(s, t)} />
          </g>
        );
      })}
    </svg>
  );
}

export function AboutMark({ kind, id }: { kind: AboutMarkKind; id: string }) {
  return (
    <DrawOnView className={`am am-${kind}`}>
      {kind === "laser" && <Laser id={id} />}
      {kind === "blueprint" && <Blueprint id={id} />}
      {kind === "sketch" && <Sketch id={id} />}
      {kind === "papercut" && <Papercut id={id} />}
    </DrawOnView>
  );
}
