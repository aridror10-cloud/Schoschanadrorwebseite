import Link from "next/link";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/site";
import { FOOTER, brand, type NavItem } from "@/lib/studio";

/** Fusszeile der Website: Marke, Menue, Kontakt, Englisch, Datenschutz. */
export function SiteFooter({ items }: { items: NavItem[] }) {
  return (
    <footer className="site-footer">
      <div className="wrap site-footer-grid">
        <div className="site-footer-brand">
          <Link href="/" aria-label={brand.name}>
            <img src="/carlebach/footer-logo.png" alt="" className="footer-logo" width={1286} height={352} />
          </Link>
          <p>{brand.slogan}</p>
        </div>

        <nav aria-label="תפריט תחתון">
          <ul className="site-footer-links">
            {items.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-footer-contact">
          <a href={`tel:${PHONE_TEL}`} dir="ltr">
            {PHONE_DISPLAY}
          </a>
          <a href={`mailto:${brand.email}`} dir="ltr">
            {brand.email}
          </a>
          <Link href="/en" lang="en" dir="ltr">
            {FOOTER.englishLink}
          </Link>
        </div>
      </div>

      <div className="wrap site-footer-base">
        <span>{FOOTER.copy}</span>
        <Link href="/privacy">{FOOTER.privacy}</Link>
      </div>
    </footer>
  );
}
