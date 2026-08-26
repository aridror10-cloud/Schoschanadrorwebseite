import Link from "next/link";
import { OrderForm } from "@/components/OrderForm";
import { ScrollFx } from "@/components/ScrollFx";
import { content, type Lang } from "@/lib/content";

/* 3D-Gold-Icons der "Was erhalten Sie"-Sektion (Reihenfolge = get.items) */
const getImages = [
  "/carlebach/get-laser.webp",
  "/carlebach/get-metal.webp",
  "/carlebach/get-oven.webp",
  "/carlebach/get-hang.webp",
  "/carlebach/get-size.webp",
  "/carlebach/get-design.webp",
];

const laserIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3l8 8" />
    <path d="M15.5 8.3l1.8-1.8M17.6 12.4l2.3.4M13.3 15.9l.4 2.3M9.6 13.6l-1.8 1.8" />
    <circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none" />
    <path d="M2 20h20" strokeWidth="1.1" opacity=".5" />
  </svg>
);


const mailIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 7l9 6 9-6" />
  </svg>
);

export function Landing({ lang }: { lang: Lang }) {
  const t = content[lang];

  /** /carlebach/simcha.webp -> "simcha", fuer die Vorauswahl im Formular */
  const modelOf = (img: string) => img.split("/").pop()!.replace(/\.\w+$/, "");

  /* Kleiner Sonderanfrage-Link, steht unter mehreren Kauf-Buttons */
  const customLink = (
    <div className="custom-order-link">
      <a href={t.customHref}>{t.customLinkLabel}</a>
    </div>
  );


  /* Bestell-Band, erscheint zweimal auf der Seite */
  const orderBand = (
    <section className="order-band">
      <div className="wrap order-band-inner" data-reveal>
        <h2>{t.orderBand.title}</h2>
        <p>
          {t.orderBand.textLines[0]}
          <br />
          {t.orderBand.textLines[1]}
        </p>
        <div className="order-band-actions">
          <a href="#choose" className="btn-wide">{t.orderBand.cta}</a>
          <a href={t.customHref} className="custom-order-button">{t.orderBand.customCta}</a>
        </div>
      </div>
    </section>
  );

  return (
    <div className="page" lang={lang} dir={t.dir}>
      <ScrollFx lang={lang} dir={t.dir} />
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
            <div className="ph" data-reveal>
              <img src="/carlebach/closeup.webp" alt={t.meet.imgAlt} loading="lazy" />
            </div>
            <div className="meet-text" data-reveal>
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
            <div className="section-head" data-reveal>
              <div className="kicker">{t.choose.kicker}</div>
              <h2>{t.choose.title}</h2>
            </div>

            <div className="verse-block" data-reveal data-cut>
              <p className="verse-caption">{t.choose.verseCaption}</p>
              <div className="verse-body">
                <div className="verse-col">
                  <div className="verse-shot">
                    <img src="/carlebach/verse-detail.webp" alt={t.choose.verseAlt} loading="lazy" />
                    <span className="verse-edge" />
                  </div>
                  <span className="verse-tag">{t.choose.verseTag}</span>
                </div>
              <div className="verse-text">
                <p className="verse-intro">{t.choose.toggle.intro}</p>
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
              </div>
            </div>

            <div className="pieces" data-reveal-group>
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
                    <a href={piece.payHref} className="btn-outline">{piece.cta}</a>
                  </div>
                </div>
              ))}
            </div>

            <div className="ph set-photo" data-reveal>
              <img src="/carlebach/set.webp" alt={t.choose.setAlt} loading="lazy" />
            </div>
            <div className="buy-all" data-reveal>
              <div className="bundle-price">{t.choose.bundle.price}</div>
              {t.choose.bundle.usd && <div className="mini-price-usd">{t.choose.bundle.usd}</div>}
              <div className="bundle-save">{t.choose.bundle.save}</div>
              <a href={t.choose.bundle.payHref} className="btn-wide">{t.choose.bundle.cta}</a>
              {customLink}
            </div>
          </div>
        </section>

        {/* ===== SCREEN 4 — PROCESS ===== */}
        <section className="process">
          <div className="wrap">
            <h2 data-reveal>{t.process.title}</h2>
            <p className="process-sub" data-reveal>{t.process.sub}</p>
            <div className="process-grid" data-reveal-group>
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

        {orderBand}

        {/* ===== SCREEN 5 — WHAT YOU GET ===== */}
        <section className="getgrid">
          <div className="wrap">
            <h2 data-reveal>{t.get.title}</h2>
            <div className="get-icons" data-reveal-group>
              {t.get.items.map((item, i) => (
                <div className="get-item" key={item}>
                  <img
                    src={getImages[i]}
                    alt=""
                    className="get-photo"
                    width={110}
                    height={110}
                    loading="lazy"
                  />
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== SCREEN 6 — WHO IT'S FOR ===== */}
        <section className="whofor">
          <div className="wrap whofor-grid">
            <div className="ph" data-reveal>
              <img src="/carlebach/livingroom.webp" alt={t.whofor.imgAlt} loading="lazy" />
            </div>
            <div data-reveal>
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
          <div className="wrap about-solo" data-reveal>
            <div className="kicker">{t.about.kicker}</div>
            <h2>{t.about.title}</h2>
            {t.about.paras.map((p) => (
              <p key={p.slice(0, 20)}>{p}</p>
            ))}
            <div className="signature">{t.about.signature}</div>
          </div>
        </section>

        {orderBand}

        {/* ===== CHARITY BANNER ===== */}
        <section className="charity">
          <div className="wrap charity-inner" data-reveal>
            <div className="charity-figure">
              <svg viewBox="0 0 160 160" aria-hidden="true">
                <circle cx="80" cy="80" r="76" />
              </svg>
              <span className="charity-num">
                <span data-count-to="10">10</span>
                <span className="charity-pct">%</span>
              </span>
              <span className="charity-fig-label">{t.charity.figureLabel}</span>
            </div>
            <div className="charity-text">
              <p>
                {t.charity.before}
                <strong>{t.charity.strong}</strong>
                {t.charity.after}
              </p>
            </div>
            <div className="charity-photo">
              <img src="/carlebach/charity-portrait.webp" alt={t.charity.photoAlt} loading="lazy" />
              <span className="charity-photo-frame" />
            </div>
          </div>
        </section>

        {/* ===== SCREEN 8 — PRICING ===== */}
        <section className="pricing">
          <div className="wrap">
            <div className="section-head" data-reveal>
              <div className="kicker">{t.pricing.kicker}</div>
              <h2>{t.pricing.title}</h2>
            </div>
            {t.pricing.currNote && <p className="curr-note">{t.pricing.currNote}</p>}
            <div className="price-cards" data-reveal-group>
              <div className="price-card">
                <div className="price-name">{t.pricing.single.name}</div>
                <div className="price-value">{t.pricing.single.price}</div>
                {t.pricing.single.usd && <div className="price-usd">{t.pricing.single.usd}</div>}
                <p className="price-desc">{t.pricing.single.desc}</p>
                <a href="#choose" className="btn-price">{t.pricing.single.cta}</a>
                {customLink}
              </div>
              <div className="price-card featured">
                <div className="price-badge">{t.pricing.set.badge}</div>
                <div className="price-name">{t.pricing.set.name}</div>
                <div className="price-value">{t.pricing.set.price}</div>
                {t.pricing.set.usd && <div className="price-usd">{t.pricing.set.usd}</div>}
                <p className="price-desc">{t.pricing.set.desc}</p>
                <a href={t.choose.bundle.payHref} className="btn-price btn-price-lg">{t.pricing.set.cta}</a>
                {customLink}
              </div>
            </div>

            <div className="delivery-note" data-reveal-group>
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
            <div className="section-head" data-reveal>
              <div className="kicker">{t.faq.kicker}</div>
              <h2>{t.faq.title}</h2>
            </div>
            <div className="faq-list" data-reveal-group>
              {t.faq.items.map((item) => (
                <details className="faq-item" key={item.q} open={item.open}>
                  <summary>{item.q}</summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <OrderForm lang={lang} />

        {/* ===== CONTACT ===== */}
        <section className="contact-cta">
          <div className="wrap">
            <div className="section-head" data-reveal>
              <div className="kicker">{t.contact.kicker}</div>
              <h2>{t.contact.title}</h2>
              <p className="contact-lead">{t.contact.lead}</p>
            </div>
            <div className="contact-links" data-reveal-group>
              <a href={t.contactHref} className="contact-link">
                {mailIcon}
                <span>{t.contact.label}</span>
              </a>
            </div>
          </div>
        </section>

        {/* ===== SCREEN 10 — FINAL ATMOSPHERE + CTA ===== */}
        <section className="finale" id="contact">
          <div className="ph">
            <img src="/carlebach/finale.webp" alt={t.finale.imgAlt} loading="lazy" />
          </div>
          <div className="finale-content" data-reveal>
            <h2>{t.finale.title}</h2>
            <p>
              {t.finale.p1Lines[0]}
              <br />
              {t.finale.p1Lines[1]}
            </p>
            <p>{t.finale.p2}</p>
            <a href="#choose" className="btn-primary-lg btn-inline">{t.finale.cta}</a>
            {customLink}
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
