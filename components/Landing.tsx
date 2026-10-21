import Link from "next/link";
import { CartBar } from "@/components/CartBar";
import { OrderForm } from "@/components/OrderForm";
import { PieceControls } from "@/components/PieceControls";
import { ScrollFx } from "@/components/ScrollFx";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { CHANUKA_PICS } from "@/lib/chanuka-pics";
import { visibleNav } from "@/components/site/SiteShell";
import { SiteHeader } from "@/components/site/SiteHeader";
import { ORDERABLE, type ModelKey } from "@/lib/cart";
import { content, type Lang } from "@/lib/content";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/site";

/* Telefonhoerer, Linienstil wie das Mail-Symbol. Kein WhatsApp-Zeichen:
   Shoshana hat kein WhatsApp, das Zeichen wuerde etwas versprechen,
   das es nicht gibt (Shoshana, 24.09.26). */
const phoneIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
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

  /** /carlebach/simcha.webp -> "simcha", fuer Korb und Formular-Vorauswahl */
  const modelOf = (img: string) => img.split("/").pop()!.replace(/\.\w+$/, "") as ModelKey;

  /*
   * Sonderanfrage-Knopf, steht an mehreren Stellen. Er fuehrt zum Formular
   * am Seitenende und nicht mehr ins Mailprogramm: das oeffnete sich bei
   * Shoshana gar nicht, und so geht es jedem ohne eingerichtete Mail-App.
   * Wer lieber schreibt, findet den Mail-Weg im Formular selbst.
   */
  const customLink = (
    <div className="custom-order-link">
      <a href="#order">{t.customLinkLabel}</a>
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
          <a href="#order" className="custom-order-button">{t.orderBand.customCta}</a>
        </div>
      </div>
    </section>
  );

  return (
    <div className="page" lang={lang} dir={t.dir}>
      <ScrollFx lang={lang} dir={t.dir} />
      <CartBar lang={lang} />
      {/* Hebraeisch: Kopf der ganzen Website mit Klappmenue, damit man
          von der Verkaufsseite zu den anderen Bereichen findet. Englisch
          gibt es nur diese eine Seite, dort bleibt der schlanke Kopf. */}
      {lang === "he" ? (
        <SiteHeader
          items={visibleNav()}
          collapsed
          actions={
            <>
              <Link href={t.nav.switchHref} className="lang-switch" lang={t.nav.switchLang} dir={t.nav.switchDir}>
                {t.nav.switchLabel}
              </Link>
              <a href="#choose" className="nav-cta">{t.nav.cta}</a>
            </>
          }
        />
      ) : (
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
      )}

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
              <a href="#chanuka" className="hero-sukkot">
                {t.hero.chanuka.lead} <span className="hero-sukkot-gold">✦</span> {t.hero.chanuka.body}{" "}
                <span className="hero-sukkot-gold">{t.hero.chanuka.cta}</span>
              </a>
              <a href="#meet" className="scroll-link">{t.hero.scroll}</a>
            </div>
          </div>
        </section>

        {/* ===== SCREEN 2 — WHEN ART MEETS MEMORY ===== */}
        <section className="meet" id="meet">
          <div className="wrap meet-grid">
            <div className="ph" data-reveal>
              <img src="/carlebach/angle.webp" alt={t.meet.imgAlt} loading="lazy" />
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
              {t.meet.blocks.map((block) => (
                <div className="meet-block" key={block.title}>
                  <h3 className="meet-sub">{block.title}</h3>
                  {block.paras.map((p) => (
                    <p key={p.slice(0, 20)}>{p}</p>
                  ))}
                </div>
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

            <div className="pieces" data-reveal-group>
              {t.choose.pieces.map((piece) => (
                <div className="piece" key={piece.img}>
                  <div className="ph">
                    <img
                      src={piece.img}
                      alt={piece.alt}
                      loading="lazy"
                      data-piece-img={modelOf(piece.img)}
                    />
                  </div>
                  <div className="piece-body">
                    <div className="piece-name">{piece.name}</div>
                    <p className="piece-desc">{piece.desc}</p>
                    <span className="piece-size">{piece.size}</span>
                    <div className="mini-price">{piece.price}</div>
                    {piece.usd && <div className="mini-price-usd">{piece.usd}</div>}
                    <PieceControls
                      model={modelOf(piece.img)}
                      lang={lang}
                      plainImg={piece.imgPlain}
                    />
                  </div>
                </div>
              ))}
            </div>

            <h3 className="bundle-heading" data-reveal>{t.choose.bundleHeading}</h3>
            <div className="ph set-photo" data-reveal>
              <img
                src="/carlebach/set.webp"
                alt={t.choose.setAlt}
                loading="lazy"
                data-piece-img="set"
              />
            </div>
            <div className="buy-all" data-reveal>
              <div className="bundle-price">{t.choose.bundle.price}</div>
              {t.choose.bundle.usd && <div className="mini-price-usd">{t.choose.bundle.usd}</div>}
              {t.choose.bundle.note && <div className="price-note">{t.choose.bundle.note}</div>}
              <div className="bundle-save">{t.choose.bundle.save}</div>
              <PieceControls model="set" lang={lang} plainImg="/carlebach/set-plain.webp" />
              {customLink}
            </div>
          </div>
        </section>

        {/* ===== CHANUKKA-HINWEIS =====
            Ersetzt seit 19.10.26 den Sukkot-Bereich (Shoshana). Die
            Chanukkia ist noch in Produktion: nur Ankuendigung und Weg zum
            Hinterlassen der Kontaktdaten. Der leere Anker "sukkot" haelt alte
            Links (/carlebach#sukkot) am richtigen Ort. */}
        <section className="chanuka" id="chanuka" aria-labelledby="chanuka-title">
          <span id="sukkot" aria-hidden="true" />
          <div className="chanuka-glow" aria-hidden="true" />
          <div className="wrap">
            {/* Kopf: Geschichte des Niggun (Shoshana, 21.10.26) */}
            <header className="chanuka-head" data-reveal>
              <div className="chanuka-kicker">{t.chanuka.kicker}</div>
              <h2 id="chanuka-title">{t.chanuka.title}</h2>
              <p className="chanuka-verse" lang="he" dir="rtl">{t.chanuka.verse}</p>
              {t.chanuka.verseGloss && <p className="chanuka-gloss">{t.chanuka.verseGloss}</p>}
              {t.chanuka.story.map((p) => (
                <p key={p.slice(0, 20)} className="chanuka-story">{p}</p>
              ))}
              <a href={t.chanuka.listen.href} className="chanuka-listen" target="_blank" rel="noopener">
                <span aria-hidden="true">♪</span> {t.chanuka.listen.label}
              </a>
            </header>

            {/* Produkt: Foto (sobald vorhanden, sonst die neun Lichter), Text, Preis, Bestellung */}
            <div className="chanuka-product" data-reveal>
              <div className="chanuka-media">
                {CHANUKA_PICS[0] ? (
                  <img
                    src={CHANUKA_PICS[0].src}
                    alt={t.chanuka.product.imgAlt}
                    width={CHANUKA_PICS[0].w}
                    height={CHANUKA_PICS[0].h}
                    loading="lazy"
                  />
                ) : (
                  <div className="chanuka-lights" aria-hidden="true">
                    <span className="chanuka-light" style={{ animationDelay: "0.00s" }} />
                    <span className="chanuka-light" style={{ animationDelay: "0.37s" }} />
                    <span className="chanuka-light" style={{ animationDelay: "0.74s" }} />
                    <span className="chanuka-light" style={{ animationDelay: "1.11s" }} />
                    <span className="chanuka-light is-shamash" style={{ animationDelay: "1.48s" }} />
                    <span className="chanuka-light" style={{ animationDelay: "1.85s" }} />
                    <span className="chanuka-light" style={{ animationDelay: "0.32s" }} />
                    <span className="chanuka-light" style={{ animationDelay: "0.69s" }} />
                    <span className="chanuka-light" style={{ animationDelay: "1.06s" }} />
                  </div>
                )}
                {CHANUKA_PICS.length > 1 && (
                  <div className="chanuka-thumbs">
                    {CHANUKA_PICS.slice(1, 4).map((p) => (
                      <img key={p.src} src={p.src} alt="" width={p.w} height={p.h} loading="lazy" />
                    ))}
                  </div>
                )}
              </div>
              <div className="chanuka-buy">
                <h3>{t.chanuka.product.title}</h3>
                {t.chanuka.product.text.map((p) => (
                  <p key={p.slice(0, 20)}>{p}</p>
                ))}
                <div className="chanuka-price">{t.chanuka.product.price}</div>
                {t.chanuka.product.usd && <div className="chanuka-usd">{t.chanuka.product.usd}</div>}
                {ORDERABLE.chanuka ? (
                  <PieceControls model="chanuka" lang={lang} />
                ) : lang === "he" ? (
                  <div className="chanuka-form">
                    <p className="chanuka-form-title">{t.chanuka.formTitle}</p>
                    {t.chanuka.formNote && <p className="chanuka-form-note">{t.chanuka.formNote}</p>}
                    <EnquiryForm
                      kinds={["order"]}
                      anchor="chanuka-form"
                      defaultPiece="חנוכיית קרליבך, דגם שמחה (290 ₪)"
                      compact
                      submitLabel={t.chanuka.cta}
                    />
                  </div>
                ) : (
                  <a href="#order" className="chanuka-btn">{t.chanuka.cta}</a>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ===== SCREEN 4 — DETAILS THAT MAKE THE DIFFERENCE ===== */}
        <section className="details">
          <div className="wrap">
            <h2 data-reveal>{t.details.title}</h2>
            <div className="details-main" data-reveal data-cut>
              <div className="d-shot d-shot-main">
                <img src="/carlebach/detail-verse.webp" alt={t.details.mainAlt} loading="lazy" />
                <span className="verse-edge" />
              </div>
              <div className="d-main-text">
                <h3>{t.details.mainHeading}</h3>
                <p>{t.details.mainText}</p>
              </div>
            </div>
            <div className="details-minor" data-reveal-group>
              {t.details.cards.map((card) => (
                <div className="d-card" key={card.img}>
                  <div className="d-shot">
                    <img src={card.img} alt={card.alt} loading="lazy" />
                  </div>
                  <h3>{card.heading}</h3>
                  <p>{card.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {orderBand}

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
              </div>
              <div className="price-card featured">
                <div className="price-badge">{t.pricing.set.badge}</div>
                <div className="price-name">{t.pricing.set.name}</div>
                <div className="price-value">{t.pricing.set.price}</div>
                {t.pricing.set.usd && <div className="price-usd">{t.pricing.set.usd}</div>}
                {t.pricing.set.note && <div className="price-note">{t.pricing.set.note}</div>}
                <p className="price-desc">{t.pricing.set.desc}</p>
                <a href={t.choose.bundle.payHref} className="btn-price btn-price-lg">{t.pricing.set.cta}</a>
              </div>
            </div>
            {/* Ein gemeinsamer Sonderanfrage-Knopf unter beiden Karten,
                statt zweimal derselbe Satz nebeneinander */}
            {customLink}

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
              <a href="#order" className="contact-link">
                {mailIcon}
                <span>{t.contact.label}</span>
              </a>
              <a href={`tel:${PHONE_TEL}`} className="contact-link" aria-label={t.contact.phoneLabel}>
                {phoneIcon}
                <span dir="ltr">{PHONE_DISPLAY}</span>
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
            {lang === "he" ? (
              <Link href="/" aria-label="שושנה יודאיקה, לעמוד הבית">
                <img src="/carlebach/footer-logo.png" alt={t.footer.logoAlt} className="footer-logo" />
              </Link>
            ) : (
              <img src="/carlebach/footer-logo.png" alt={t.footer.logoAlt} className="footer-logo" />
            )}
          </div>
          <div className="footer-text">
            <span>{t.footer.copy}</span>
            <a href={`tel:${PHONE_TEL}`} className="footer-link" dir="ltr" aria-label={t.contact.phoneLabel}>
              {PHONE_DISPLAY}
            </a>
            <a href="/privacy" className="footer-link">{t.footer.privacy}</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
