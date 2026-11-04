import { ARCS } from "./Ornaments";

/**
 * Grosses Zeichen neben "מרעיון למוצר" auf der Startseite (04.11.26,
 * Wunsch Bernard): nur die drei Boegen, ohne Tropfen, nach unten geoeffnet.
 * Sobald man hinscrollt, oeffnen sich die Boegen wie ein Faecher (wie oben
 * im Kopf der Startseite), innen zuerst, weich und lang auslaufend; dabei
 * leuchten sie kurz sattes Gold und klingen zu zartem Champagner ab.
 * Steht danach still. Ohne JavaScript oder bei "Bewegung reduzieren" sofort
 * fertig.
 */
const ORDER = [2, 1, 0];

export function PourMark({ id }: { id: string }) {
  return (
    <div className="sj-pour-mark" data-reveal aria-hidden="true">
      <svg viewBox="-4 58 252 256" focusable="false">
        <defs>
          <filter id={`${id}-feather`} filterUnits="userSpaceOnUse" x="-420" y="-420" width="900" height="980">
            <feGaussianBlur stdDeviation="9" />
          </filter>
          <radialGradient id={`${id}-gold`} gradientUnits="userSpaceOnUse" cx="0" cy="64" r="250">
            <stop offset="0" stopColor="#f3d993" />
            <stop offset="0.2" stopColor="#a8843a" />
            <stop offset="0.43" stopColor="#8a6a27" />
            <stop offset="0.515" stopColor="#f4dd9e" />
            <stop offset="0.6" stopColor="#8a6a27" />
            <stop offset="0.79" stopColor="#8a6a27" />
            <stop offset="0.885" stopColor="#f5e0a2" />
            <stop offset="1" stopColor="#846424" />
          </radialGradient>
          {ARCS.map((_, arc) => (
            <mask key={arc} id={`${id}-m${arc}`} maskUnits="userSpaceOnUse" x="-60" y="-60" width="380" height="440">
              <circle
                className="sj-pour-sweep"
                style={{ "--del": `${ORDER.indexOf(arc) * 0.32}s` } as React.CSSProperties}
                cx="0"
                cy="64"
                r="160"
                fill="none"
                stroke="#fff"
                strokeWidth="340"
                transform="rotate(-25 0 64)"
                filter={`url(#${id}-feather)`}
              />
            </mask>
          ))}
        </defs>
        {/* gespiegelt an der Waagrechten: die Boegen oeffnen sich nach unten */}
        <g transform="matrix(1 0 0 -1 0 371)">
          {ARCS.map((d, arc) => (
            <g key={arc} mask={`url(#${id}-m${arc})`}>
              <path d={d} className="sj-pour-rest" fill={`url(#${id}-gold)`} />
              <path
                d={d}
                className="sj-pour-warm"
                fill={`url(#${id}-gold)`}
                style={{ "--del": `${ORDER.indexOf(arc) * 0.32}s` } as React.CSSProperties}
              />
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
