import Script from "next/script";
import { PIXEL_ID } from "@/lib/pixel";

/**
 * Meta Pixel auf allen Seiten (wird im Root-Layout eingebunden).
 *
 * Laedt erst nach dem Sichtbarwerden der Seite (afterInteractive), damit
 * er weder Bilder noch Schriften ausbremst. PageView meldet jede Seite,
 * die uebrigen Ereignisse (AddToCart, InitiateCheckout, Purchase) kommen
 * aus den Komponenten, in denen sie passieren.
 */
export function MetaPixel() {
  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${PIXEL_ID}');
fbq('track', 'PageView');`}
      </Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          alt=""
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}
