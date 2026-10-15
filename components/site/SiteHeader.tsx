"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode, useEffect, useId, useState } from "react";
import { brand, type NavItem } from "@/lib/studio";

/**
 * Kopfzeile der Website "שושנה יודאיקה" mit dem Hauptmenue.
 *
 * Breite Bildschirme zeigen die Menuepunkte in einer Zeile, schmale ein
 * aufklappbares Menue. `collapsed` erzwingt das Klappmenue auch breit -
 * die Carlebach-Verkaufsseite braucht den Platz fuer Sprachwahl und
 * Bestellknopf und soll den Blick nicht vom Kauf wegziehen.
 */
export function SiteHeader({
  items,
  actions,
  collapsed = false,
}: {
  items: NavItem[];
  actions?: ReactNode;
  collapsed?: boolean;
}) {
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState(false);
  const panelId = useId();

  // Beim Seitenwechsel schliessen; Escape schliesst ebenfalls
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className={`nav site-nav${collapsed ? " is-collapsed" : ""}${open ? " is-open" : ""}`}>
      <div className="nav-inner">
        <Link href="/" className="brand" aria-label={`${brand.name}, ${brand.slogan}`}>
          <img src="/carlebach/logo.png" alt="" className="brand-logo" width={775} height={360} />
        </Link>

        <nav className="site-links" aria-label="תפריט ראשי">
          <ul>
            {items.map((item) => (
              <li key={item.href}>
                <Link href={item.href} aria-current={isActive(item.href) ? "page" : undefined}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="nav-right">
          {actions}
          <button
            type="button"
            className="menu-toggle"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="menu-toggle-bars" aria-hidden="true" />
            <span className="menu-toggle-label">{open ? "סגירה" : "תפריט"}</span>
          </button>
        </div>
      </div>

      <div className="menu-panel" id={panelId} hidden={!open}>
        <nav aria-label="תפריט ראשי">
          <ul>
            {items.map((item) => (
              <li key={item.href}>
                <Link href={item.href} aria-current={isActive(item.href) ? "page" : undefined}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
