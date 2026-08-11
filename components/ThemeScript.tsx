/**
 * Setzt das Farbschema, bevor der Browser das erste Mal zeichnet.
 *
 * Ohne dieses blockierende Skript blitzt beim Laden kurz das helle Layout auf,
 * bevor React die gespeicherte Auswahl anwenden kann ("Flash of wrong theme").
 * Das Attribut wird immer gesetzt - auch wenn nichts gespeichert ist -,
 * damit CSS und Umschalter sich auf einen definierten Zustand verlassen koennen.
 */
const script = `
(function () {
  try {
    var stored = localStorage.getItem('theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = stored === 'light' || stored === 'dark' ? stored : (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'light');
  }
})();
`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
