import Link from "next/link";
import { content, type Lang } from "@/lib/content";

/* Icons der "Was erhalten Sie"-Sektion, 1:1 aus der Design-Vorlage */
const getIcons = [
  <svg key="laser" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v4M12 18v4M2 12h4M18 12h4" /></svg>,
  <svg key="metal" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l9 5-9 5-9-5 9-5z" /><path d="M3 13l9 5 9-5" /></svg>,
  <svg key="oven" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2c1.6 3-1.8 4.7-1.8 8.2a3.8 3.8 0 007.6 0c0-2-1-3.7-2-5.2.3 2-1 3-1.9 2-1-1.1.2-3-1.9-5z" /></svg>,
  <svg key="hang" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v5" /><path d="M9.2 8a2.8 2.8 0 005.6 0" /><rect x="6.5" y="14" width="11" height="7" rx="1" /></svg>,
  <svg key="size" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="8" y="2.5" width="8" height="19" rx="1" /><path d="M8 7h2.5M8 11h2.5M8 15h2.5M8 19h2.5" /></svg>,
  <svg key="design" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.83 2.83 0 014 4L7.5 20.5 2 22l1.5-5.5L17 3z" /></svg>,
];

const laserIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3l8 8" />
    <path d="M15.5 8.3l1.8-1.8M17.6 12.4l2.3.4M13.3 15.9l.4 2.3M9.6 13.6l-1.8 1.8" />
    <circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none" />
    <path d="M2 20h20" strokeWidth="1.1" opacity=".5" />
  </svg>
);

const charityIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.5 12.5c0 4-8.5 8-8.5 8s-8.5-4-8.5-8a4.5 4.5 0 018-2.8 4.5 4.5 0 018 2.8z" opacity=".55" />
    <path d="M9 12h2l1-2 2 4 1-2h2" strokeWidth="1.3" />
  </svg>
);

const mailIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 7l9 6 9-6" />
  </svg>
);

const phoneIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h4l2 5-2.5 1.5a11 11 0 005 5L14 13l5 2v4a2 2 0 01-2 2C9.5 21 3 14.5 3 6a2 2 0 011-2z" />
  </svg>
);

const whatsappIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.5 14.4c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5C10 9 9.5 7.8 9.3 7.3c-.2-.5-.4-.4-.5-.4h-.5c-.2 0-.5.1-.7.3-.2.3-1 1-1 2.4s1 2.8 1.1 3c.1.2 2 3 4.8 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 2-1.4.2-.6.2-1.2.2-1.3-.1-.1-.3-.2-.6-.4z" />
    <path d="M12 2a10 10 0 00-8.5 15.2L2 22l4.9-1.5A10 10 0 1012 2z" />
  </svg>
);

export function Landing({ lang }: { lang: Lang }) {
  const t = content[lang];

  return (
    <div className="page" lang={lang} dir={t.dir}>
      <header className="nav">
        <div className="nav-inner">
          <div className="brand">
            <img src="/carlebach/logo.png" alt={t.nav.logoAlt} className="brand-logo" />
          </div>
          <div className="nav-right">
            <Link
              href={t.nav.switchHref}
              className="lang-switch"
              lang={t.nav.switchLang}
              dir={t.nav.switchDir}
            >
              {t.nav.switchLabel}
            </Link>
            <a href="#choose" className="nav-cta">{t.nav.cta}</a>
          </div>
        </div>
      </header>

      <main>
        {/* ===== SCREEN 1 — HERO ===== */}
        <section className="hero">
          <div className="ph">
            <img src="/carlebach/hero.webp" alt={t.hero.imgAlt} fetchPriority="high" />
          </div>
          <div className="hero-content">
            <div className="hero-badge">{t.hero.badge}</div>
            <div className="kicker">{t.hero.kicker}</div>
            <h1>
              {t.hero.titleLines[0]}
              <br />
              {t.hero.titleLines[1]}
            </h1>
            <p>{t.hero.sub}</p>
            <div className="hero-actions">
              <a href="#choose" className="btn-primary-lg">{t.hero.cta}</a>
              <a href="#meet" className="scroll-link">{t.hero.scroll}</a>
            </div>
          </div>
        </section>

        {/* ===== SCREEN 2 — WHEN ART MEETS MEMORY ===== */}
        <section className="meet" id="meet">
          <div className="wrap meet-grid">
            <div className="ph">
              <img src="/carlebach/closeup.webp" alt={t.meet.imgAlt} loading="lazy" />
            </div>
            <div className="meet-text">
              <div className="kicker">{t.meet.kicker}</div>
              <h2>
                {t.meet.titleLines[0]}
                <br />
                {t.meet.titleLines[1]}
              </h2>
              {t.meet.paras.map((p) => (
                <p key={p.slice(0, 20)}>{p}</p>
              ))}
            </div>
          </div>
        </section>

        {/* ===== SCREEN 3 — CHOOSE YOUR PORTRAIT ===== */}
        <section className="choose" id="choose">
          <div className="wrap">
            <div className="section-head">
              <div className="kicker">{t.choose.kicker}</div>
              <h2>{t.choose.title}</h2>
            </div>

            <div className="version-toggle">
              <p>{t.choose.toggle.intro}</p>
              <div className="version-options">
                {t.choose.toggle.options.map((opt) => (
                  <div className="v-opt" key={opt.slice(0, 20)}>
                    <span className="dot" />
                    {opt}
                  </div>
                ))}
              </div>
              <div className="v-note">{t.choose.toggle.note}</div>
            </div>

            <div className="pieces">
              {t.choose.pieces.map((piece) => (
                <div className="piece" key={piece.img}>
                  <div className="ph">
                    <img src={piece.img} alt={piece.alt} loading="lazy" />
                  </div>
                  <div className="piece-body">
                    <div className="piece-name">{piece.name}</div>
                    <p className="piece-desc">{piece.desc}</p>
                    <span className="piece-size">{piece.size}</span>
                    <div className="mini-price">{piece.price}</div>
                    {piece.usd && <div className="mini-price-usd">{piece.usd}</div>}
                    <a href={piece.href} target="_blank" rel="noopener" className="btn-outline">{piece.cta}</a>
                  </div>
                </div>
              ))}
            </div>

            <div className="ph set-photo">
              <img src="/carlebach/set.webp" alt={t.choose.setAlt} loading="lazy" />
            </div>
            <div className="buy-all">
              <div className="bundle-price">{t.choose.bundle.price}</div>
              {t.choose.bundle.usd && <div className="mini-price-usd">{t.choose.bundle.usd}</div>}
              <div className="bundle-save">{t.choose.bundle.save}</div>
              <a href={t.choose.bundle.href} target="_blank" rel="noopener" className="btn-wide">{t.choose.bundle.cta}</a>
            </div>
          </div>
        </section>

        {/* ===== SCREEN 4 — PROCESS ===== */}
        <section className="process">
          <div className="wrap">
            <h2>{t.process.title}</h2>
            <p className="process-sub">{t.process.sub}</p>
            <div className="process-grid">
              {t.process.steps.map((step, i) => (
                <div className="p-card" key={step.label}>
                  {step.img ? (
                    <div className="p-photo">
                      <div className="p-num">{i + 1}</div>
                      <img src={step.img} alt={step.alt} loading="lazy" />
                    </div>
                  ) : (
                    <div className="p-photo icon-only">
                      <div className="p-num">{i + 1}</div>
                      {laserIcon}
                      <span className="p-note">{step.note}</span>
                    </div>
                  )}
                  <span>{step.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== SCREEN 5 — WHAT YOU GET ===== */}
        <section className="getgrid">
          <div className="wrap">
            <h2>{t.get.title}</h2>
            <div className="get-icons">
              {t.get.items.map((item, i) => (
                <div className="get-item" key={item}>
                  <div className="icon">{getIcons[i]}</div>
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== SCREEN 6 — WHO IT'S FOR ===== */}
        <section className="whofor">
          <div className="wrap whofor-grid">
            <div className="ph">
              <img src="/carlebach/livingroom.webp" alt={t.whofor.imgAlt} loading="lazy" />
            </div>
            <div>
              <div className="kicker">{t.whofor.kicker}</div>
              <h2>{t.whofor.title}</h2>
              <p className="lead">{t.whofor.lead}</p>
              <ul className="who-list">
                {t.whofor.list.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ===== SCREEN 7 — ABOUT THE ARTIST ===== */}
        <section className="about">
          <div className="wrap about-grid">
            <div>
              <div className="kicker">{t.about.kicker}</div>
              <h2>{t.about.title}</h2>
              {t.about.paras.map((p) => (
                <p key={p.slice(0, 20)}>{p}</p>
              ))}
              <div className="signature">{t.about.signature}</div>
            </div>
            <div className="ph">
              <img src="/carlebach/artist.webp" alt={t.about.imgAlt} loading="lazy" />
            </div>
          </div>
        </section>

        {/* ===== CHARITY BANNER ===== */}
        <section className="charity">
          <div className="charity-inner">
            <div className="charity-icon">{charityIcon}</div>
            <div className="charity-text">
              <p>
                {t.charity.before}
                <strong>{t.charity.strong}</strong>
                {t.charity.after}
              </p>
            </div>
          </div>
        </section>

        {/* ===== SCREEN 8 — PRICING ===== */}
        <section className="pricing">
          <div className="wrap">
            <div className="section-head">
              <div className="kicker">{t.pricing.kicker}</div>
              <h2>{t.pricing.title}</h2>
            </div>
            {t.pricing.currNote && <p className="curr-note">{t.pricing.currNote}</p>}
            <div className="price-cards">
              <div className="price-card">
                <div className="price-name">{t.pricing.single.name}</div>
                <div className="price-value">{t.pricing.single.price}</div>
                {t.pricing.single.usd && <div className="price-usd">{t.pricing.single.usd}</div>}
                <p className="price-desc">{t.pricing.single.desc}</p>
                <a href={t.pricing.single.href} target="_blank" rel="noopener" className="btn-price">{t.pricing.single.cta}</a>
              </div>
              <div className="price-card featured">
                <div className="price-badge">{t.pricing.set.badge}</div>
                <div className="price-name">{t.pricing.set.name}</div>
                <div className="price-value">{t.pricing.set.price}</div>
                {t.pricing.set.usd && <div className="price-usd">{t.pricing.set.usd}</div>}
                <p className="price-desc">{t.pricing.set.desc}</p>
                <a href={t.pricing.set.href} target="_blank" rel="noopener" className="btn-price btn-price-lg">{t.pricing.set.cta}</a>
              </div>
            </div>

            <div className="delivery-note">
              {t.pricing.delivery.map((item) => (
                <div className="delivery-item" key={item.title}>
                  <div className="delivery-icon">{item.icon}</div>
                  <div>
                    <strong>{item.title}</strong>
                    <span>{item.sub}</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="delivery-disclaimer">{t.pricing.disclaimer}</p>
          </div>
        </section>

        {/* ===== SCREEN 9 — FAQ ===== */}
        <section className="faq">
          <div className="wrap">
            <div className="section-head">
              <div className="kicker">{t.faq.kicker}</div>
              <h2>{t.faq.title}</h2>
            </div>
            <div className="faq-list">
              {t.faq.items.map((item) => (
                <details className="faq-item" key={item.q} open={item.open}>
                  <summary>{item.q}</summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CONTACT ===== */}
        <section className="contact-cta">
          <div className="wrap">
            <div className="section-head">
              <div className="kicker">{t.contact.kicker}</div>
              <h2>{t.contact.title}</h2>
              <p className="contact-lead">{t.contact.lead}</p>
            </div>
            <div className="contact-links">
              <a href={`mailto:${t.contact.email}`} className="contact-link">
                {mailIcon}
                <span>{t.contact.email}</span>
              </a>
              <a href={t.contact.phoneHref} className="contact-link">
                {phoneIcon}
                <span>{t.contact.phoneLabel}</span>
              </a>
              <a href={t.contact.waHref} target="_blank" rel="noopener" className="contact-link">
                {whatsappIcon}
                <span>{t.contact.waLabel}</span>
              </a>
            </div>
          </div>
        </section>

        {/* ===== SCREEN 10 — FINAL ATMOSPHERE + CTA ===== */}
        <section className="finale" id="contact">
          <div className="ph">
            <img src="/carlebach/finale.webp" alt={t.finale.imgAlt} loading="lazy" />
          </div>
          <div className="finale-content">
            <h2>{t.finale.title}</h2>
            <p>
              {t.finale.p1Lines[0]}
              <br />
              {t.finale.p1Lines[1]}
            </p>
            <p>{t.finale.p2}</p>
            <a href={t.finale.href} target="_blank" rel="noopener" className="btn-primary-lg btn-inline">{t.finale.cta}</a>
            <div className="finale-note">{t.finale.note}</div>
          </div>
        </section>
      </main>

      <footer>
        <div className="wrap footer-inner">
          <div className="fb">
            <img src="/carlebach/footer-logo.png" alt={t.footer.logoAlt} className="footer-logo" />
          </div>
          <div>{t.footer.copy}</div>
        </div>
      </footer>
    </div>
  );
}
