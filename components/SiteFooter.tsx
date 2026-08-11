import Link from "next/link";
import { legalNavigation, site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <p>
          &copy; {new Date().getFullYear()} {site.name}
        </p>

        <ul className="site-footer__links">
          {legalNavigation.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>{item.label}</Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
