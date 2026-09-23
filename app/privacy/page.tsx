import type { Metadata } from "next";
import Link from "next/link";

/**
 * Datenschutzhinweis, zweisprachig (hebraeisch zuerst, wie die Dankesseite).
 *
 * Noetig, seit der Meta Pixel laeuft (Tikkun 13 zum israelischen
 * Datenschutzgesetz, in Kraft seit 14.08.2025): wer Besucherdaten an
 * Dritte weitergibt, muss das offenlegen. Bewusst kurz und in normaler
 * Sprache - keine Juristenprosa, die ohnehin niemand liest.
 */

export const metadata: Metadata = {
  title: "מדיניות פרטיות | שושנה דרור",
  description: "אילו נתונים נאספים באתר ולמה",
  robots: { index: false, follow: true },
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="page" lang="he" dir="rtl">
      <main className="toda legal">
        <div className="toda-card legal-card">
          <div className="kicker">קולקציית קרליבך</div>
          <h1>מדיניות פרטיות</h1>
          <p>
            האתר shoshanajudaica.co.il מופעל על ידי שושנה דרור. הנה, בקצרה ובשפה פשוטה, מה נאסף כאן ולמה.
          </p>
          <h2>מה נאסף</h2>
          <p>
            <strong>טופס הפנייה:</strong> השם, המייל, הטלפון והפרטים שאתם כותבים נשלחים אליי במייל, כדי שאוכל לחזור אליכם. הם לא נשמרים באתר.
          </p>
          <p>
            <strong>תשלום:</strong> התשלום מתבצע בדף מאובטח של סאמיט (SUMIT), שירות סליקה ישראלי מורשה. פרטי האשראי לא עוברים דרך האתר הזה ולא נשמרים בו.
          </p>
          <p>
            <strong>מדידה ופרסום:</strong> האתר משתמש בפיקסל של מטא (פייסבוק). הוא מדווח למטא על פעולות באתר, כמו צפייה בדף, הוספה לסל ומעבר לתשלום, כדי למדוד את יעילות הפרסום ולהציג פרסומות רלוונטיות בפייסבוק ובאינסטגרם. מטא עשויה לקשר את המידע לחשבון שלכם אצלה. לא נשלחים אליה פרטי תשלום.
          </p>
          <h2>מה לא נעשה</h2>
          <p>
            הפרטים שלכם לא נמכרים ולא מועברים לאף גורם מלבד השירותים שצוינו כאן, ורק לצורך שלשמו נמסרו.
          </p>
          <h2>איך לבטל את המדידה</h2>
          <p>
            אפשר לחסום את הפיקסל בעזרת תוסף חוסם מעקב בדפדפן, או להגביל את השימוש במידע בהגדרות הפרסום בחשבון הפייסבוק שלכם. האתר עובד גם בלי זה.
          </p>
          <h2>שאלות</h2>
          <p>
            לכל שאלה או בקשה למחיקת פרטים: <a href="mailto:ssdror@gmail.com">ssdror@gmail.com</a>
          </p>
          <Link href="/" className="toda-back">
            חזרה לאתר
          </Link>

          <div className="toda-en" lang="en" dir="ltr">
            <h2 className="legal-title">Privacy policy</h2>
            <p>
              shoshanajudaica.co.il is run by Shoshana Dror. In short and in plain language, here is what is collected and why.
            </p>
            <h3>What is collected</h3>
            <p>
              <strong>Enquiry form:</strong> the name, email, phone and details you enter are sent to me by email so that I can reply. They are not stored on this site.
            </p>
            <p>
              <strong>Payment:</strong> payment takes place on a secure page of SUMIT, a licensed Israeli payment provider. Card details never pass through this site and are not stored here.
            </p>
            <p>
              <strong>Measurement and advertising:</strong> this site uses the Meta (Facebook) Pixel. It reports actions on the site to Meta, such as viewing a page, adding to the basket and proceeding to checkout, to measure advertising and show relevant ads on Facebook and Instagram. Meta may link this to your Meta account. No payment details are sent.
            </p>
            <h3>What is not done</h3>
            <p>
              Your details are not sold or passed on to anyone beyond the services named here, and only for the purpose you gave them.
            </p>
            <h3>How to opt out</h3>
            <p>
              You can block the pixel with a tracking blocker in your browser, or limit the use of the data in the ad settings of your Facebook account. The site works without it.
            </p>
            <h3>Questions</h3>
            <p>
              For any question or a request to delete your details: <a href="mailto:ssdror@gmail.com">ssdror@gmail.com</a>
            </p>
            <Link href="/en" className="toda-back">
              Back to the site
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
