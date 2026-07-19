/**
 * Sayfanın arkasındaki dekoratif "blueprint" sahnesi: teknik ızgara,
 * köşelerden gelen accent ışığı ve çok hafif bir film grain dokusu.
 *
 * Tamamen CSS + tek bir inline SVG filtresiyle çizilir; harici bağımlılık,
 * canvas ya da animasyon yoktur. Hareket içermediği için
 * `prefers-reduced-motion` tercihine ek bir müdahale gerekmez.
 *
 * Sunucu bileşeni olarak kalır (state/efekt yok) ve `aria-hidden` ile
 * ekran okuyuculardan gizlenir.
 */
export default function Backdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
      <div className="absolute inset-0 blueprint-glow" />
      <div className="absolute inset-0 blueprint-grid" />
      <svg className="absolute inset-0 h-full w-full opacity-[0.025] mix-blend-overlay">
        <filter id="backdrop-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves={3}
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#backdrop-grain)" />
      </svg>
    </div>
  );
}
