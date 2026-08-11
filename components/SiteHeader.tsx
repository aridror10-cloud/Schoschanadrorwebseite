"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { navigation, site } from "@/lib/site";
import { ThemeToggle } from "./ThemeToggle";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Escape schliesst das Menue - erwartetes Verhalten fuer Tastaturnutzung.
  useEffect(() => {
    if (!menuOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link href="/" className="brand">
          {site.name}
        </Link>

        <nav className="nav" id="hauptnavigation" data-open={menuOpen} aria-label="Hauptnavigation">
          <ul className="nav__list">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link className="nav__link" href={item.href} onClick={() => setMenuOpen(false)}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-tools">
          <ThemeToggle />

          <button
            type="button"
            className="icon-button nav-toggle"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="hauptnavigation"
            aria-label={menuOpen ? "Menue schliessen" : "Menue oeffnen"}
          >
            <svg
              className="icon-menu"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
            <svg
              className="icon-close"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
