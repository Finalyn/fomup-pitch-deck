import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Building2, CalendarHeart, Martini, Music2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

import espresso from "@/assets/fomup-espresso-transparent.png";
import matcha from "@/assets/fomup-matcha-transparent.png";
import blueberry from "@/assets/fomup-blueberry-transparent.png";
import pinacolada from "@/assets/fomup-pinacolada-transparent.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FOMUP, Investor Presentation" },
      {
        name: "description",
        content: "FOMUP is Swiss-made drinkable cocktail foam, launching in the United States.",
      },
      { property: "og:title", content: "FOMUP, Investor Presentation" },
      {
        property: "og:description",
        content: "Meet FOMUP: a sensorial, shareable and unforgettable drink format.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: InvestorDeck,
});

const TOTAL_SLIDES = 14;
const DARK_SLIDES = new Set([5, 7]);

function Slide({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section className={`deck-slide ${className}`}>
      <div className="slide-inner">{children}</div>
    </section>
  );
}

function ProductImage({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div className={`product-frame ${className}`}>
      <img src={src} alt={alt} draggable={false} />
    </div>
  );
}

const serveSteps = [
  { number: "01", title: "Order", note: "Container delivered to the venue" },
  { number: "02", title: "Load", note: "Straight into the siphon" },
  { number: "03", title: "Chill", note: "Four hours in the fridge" },
  { number: "04", title: "Serve", note: "Ready to pour" },
] as const;

const flavors = [
  {
    key: "espresso",
    name: "Espresso Martini",
    category: "The alcoholic one",
    note: "Rich coffee, smooth, gently sweet",
    src: espresso,
  },
  {
    key: "pinacolada",
    name: "Piña Colada",
    category: "The mocktail",
    note: "Tropical, creamy, refreshing",
    src: pinacolada,
  },
  {
    key: "blueberry",
    name: "Blueberry",
    category: "The fruity one",
    note: "Sweet, playful, easy to love",
    src: blueberry,
  },
  {
    key: "matcha",
    name: "Matcha Coconut",
    category: "The healthy one",
    note: "Earthy, creamy, tropical",
    src: matcha,
  },
] as const;

const keywords = [
  "SENSORIAL",
  "TEXTURAL",
  "SHAREABLE",
  "UNFORGETTABLE",
  "HEALTHY",
  "EXPERIENCE",
  "PLAYFUL",
  "IMMERSIVE",
  "SURPRISING",
  "IRRESISTIBLE",
  "PREMIUM",
  "ICONIC",
  "VIRAL",
  "BOLD",
  "READY TO SERVE",
  "BAR-READY",
] as const;

const audiences = [
  { label: "Cocktail bars", note: "A signature serve with zero extra prep", Icon: Martini },
  { label: "Nightclubs", note: "Fast service, high visual impact", Icon: Music2 },
  { label: "Festivals", note: "Volume service from a single container", Icon: Building2 },
  { label: "Private events", note: "A format guests photograph and remember", Icon: CalendarHeart },
] as const;

const trends = [
  {
    stat: "[ +XX% ]",
    title: "Better-for-you drinks are rising",
    note: "Low sugar, low alcohol and functional drinks are the fastest growing part of the category.",
  },
  {
    stat: "[ -XX% ]",
    title: "Young people are drinking less alcohol",
    note: "Gen Z drinks measurably less than the generation before it, and orders alcohol-free far more often.",
  },
];

const collaborations = [
  { kind: "Spirits & drinks brands", note: "Co-branded flavours, shared distribution" },
  { kind: "Festivals & music", note: "Exclusive serves, branded bars" },
  { kind: "Hotel & restaurant groups", note: "House signature across every venue" },
  { kind: "Fashion & lifestyle", note: "Limited editions, pop-up activations" },
  { kind: "Creators & athletes", note: "Reach the 16 to 35 audience directly" },
];

function InvestorDeck() {
  const [active, setActive] = useState(0);
  const touchStart = useRef<number | null>(null);

  const goTo = useCallback((index: number) => {
    setActive(Math.max(0, Math.min(TOTAL_SLIDES - 1, index)));
  }, []);
  const previous = useCallback(() => setActive((value) => Math.max(0, value - 1)), []);
  const next = useCallback(() => setActive((value) => Math.min(TOTAL_SLIDES - 1, value + 1)), []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" || event.key === "ArrowDown" || event.key === " ") next();
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") previous();
      if (event.key === "Home") goTo(0);
      if (event.key === "End") goTo(TOTAL_SLIDES - 1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goTo, next, previous]);

  return (
    <main
      className={`deck${DARK_SLIDES.has(active) ? " deck-inverted" : ""}`}
      aria-label="FOMUP investor presentation"
      onTouchStart={(event) => {
        touchStart.current = event.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        if (touchStart.current === null) return;
        const end = event.changedTouches[0]?.clientX ?? touchStart.current;
        const distance = touchStart.current - end;
        if (Math.abs(distance) > 48) {
          if (distance > 0) next();
          else previous();
        }
        touchStart.current = null;
      }}
    >
      <div className="slide-track" style={{ transform: `translate3d(-${active * 100}vw, 0, 0)` }}>
        <Slide className="title-slide">
          <div className="title-mark" aria-label="FOMUP">
            FOMUP
          </div>
          <p className="title-tagline">Drink the foam.</p>
          <p className="corner-note">Investor presentation</p>
          <p className="corner-location">Swiss-made / USA launch</p>
        </Slide>

        <Slide className="idea-slide">
          <div className="idea-copy">
            <p className="eyebrow">The idea</p>
            <h1>A cocktail you&apos;ve never tasted, because you&apos;ve never chewed one.</h1>
            <p className="body-copy">
              A dense, aerated mousse served straight from a pressurized can.
            </p>
          </div>
          <ProductImage src={espresso} alt="FOMUP Espresso Martini can" className="idea-product" />
        </Slide>

        <Slide className="video-slide">
          <div className="video-frame">
            <video src="/fomup-demo-video.mp4" controls playsInline muted loop preload="metadata" />
          </div>
          <p className="video-caption">First demo</p>
        </Slide>

        <Slide className="format-slide">
          <p className="eyebrow">For bars & clubs</p>
          <h1 className="format-headline">Refill. Refrigerate. Serve.</h1>
          <p className="format-sub">
            FOMUP is built for on-premise venues. Bars and nightclubs order the container, we
            deliver, they load it into their siphon, chill it for 4 hours, and serve.
          </p>
          <div className="format-flow" aria-label="Four-step service flow">
            {serveSteps.map(({ number, title, note }, index) => (
              <div className="flow-item" key={number}>
                <figure className="flow-step">
                  <span className="step-number">{number}</span>
                  <strong>{title}</strong>
                  <span className="step-note">{note}</span>
                </figure>
                {index < serveSteps.length - 1 && (
                  <span className="flow-arrow" aria-hidden="true" />
                )}
              </div>
            ))}
          </div>
          <p className="format-cta">No prep. No waste. Just foam.</p>
        </Slide>

        <Slide className="keywords-slide">
          <div className="keywords" aria-label="FOMUP in keywords">
            {keywords.map((word) => (
              <span key={word}>{word}</span>
            ))}
          </div>
        </Slide>

        {flavors.map((flavor) => (
          <Slide className={`flavor-slide flavor-${flavor.key}`} key={flavor.key}>
            <header className="flavor-head">
              <p className="eyebrow">{flavor.category}</p>
            </header>
            <div className="flavor-stage">
              <img src={flavor.src} alt={`FOMUP ${flavor.name} can`} draggable={false} />
            </div>
            <footer className="flavor-foot">
              <h1>{flavor.name}</h1>
              <p>{flavor.note}</p>
              <small>8.45 fl oz / 250 ml</small>
            </footer>
          </Slide>
        ))}

        <Slide className="audience-slide">
          <p className="eyebrow">Who it&apos;s for</p>
          <h1 className="section-headline">Built for the room, not the shelf.</h1>
          <ul className="clean-list">
            {audiences.map(({ label, note, Icon }) => (
              <li key={label}>
                <Icon strokeWidth={1.5} aria-hidden="true" />
                <span className="list-title">{label}</span>
                <span className="list-note">{note}</span>
              </li>
            ))}
          </ul>
        </Slide>

        <Slide className="drinker-slide">
          <p className="eyebrow">Who drinks it</p>
          <h1 className="section-headline">
            A generation drinking less,
            <br />
            expecting more.
          </h1>
          <div className="trend-list">
            {trends.map(({ stat, title, note }) => (
              <article key={title}>
                <strong>{stat}</strong>
                <div>
                  <h2>{title}</h2>
                  <p>{note}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="age-band">
            <span className="age-edge">16</span>
            <span className="age-rule" aria-hidden="true" />
            <span className="age-edge">35</span>
            <span className="age-caption">Our core audience</span>
          </div>
          <p className="placeholder-note">
            Alcohol-free is usually the boring option. FOMUP makes it the one people photograph.
          </p>
        </Slide>

        <Slide className="collab-slide">
          <p className="eyebrow">Collaborations</p>
          <h1 className="section-headline">A format made to co-brand.</h1>
          <ul className="clean-list collab-list">
            {collaborations.map(({ kind, note }) => (
              <li key={kind}>
                <span className="list-title">{kind}</span>
                <span className="list-note">{note}</span>
              </li>
            ))}
          </ul>
          <p className="placeholder-note">
            Placeholder categories, replace with named partner targets
          </p>
        </Slide>

        <Slide className="opportunity-slide">
          <p className="eyebrow">The US opportunity</p>
          <div className="stats-list">
            <div>
              <strong>[ $XXB ]</strong>
              <span>US ready-to-drink cocktail market</span>
            </div>
            <div>
              <strong>[ XX% ]</strong>
              <span>Projected category growth</span>
            </div>
            <div>
              <strong>[ XXK ]</strong>
              <span>Target US on-premise venues</span>
            </div>
          </div>
          <p className="placeholder-note">Placeholder values, replace with validated market data</p>
        </Slide>

        <Slide className="contact-slide">
          <p className="eyebrow">Let&apos;s talk</p>
          <h1>
            Investor
            <br />
            inquiries
          </h1>
          <p className="contact-line">
            Swiss-made drinkable cocktail foam, launching in the United States.
          </p>
          <div className="contact-details">
            <a className="email-link" href="mailto:invest@fomup.com">
              invest@fomup.com
            </a>
            <a
              className="deck-button"
              href="mailto:invest@fomup.com?subject=FOMUP%20investment%20conversation"
            >
              Start a conversation <ArrowRight />
            </a>
          </div>
          <div className="contact-wordmark" aria-hidden="true">
            FOMUP
          </div>
        </Slide>
      </div>

      <div className="deck-wordmark" aria-hidden="true">
        FOMUP
      </div>

      <nav className="deck-controls" aria-label="Slide navigation">
        <button
          type="button"
          className="arrow-button previous"
          onClick={previous}
          disabled={active === 0}
          aria-label="Previous slide"
        >
          <ArrowLeft />
        </button>
        <div className="progress-dots">
          {Array.from({ length: TOTAL_SLIDES }, (_, index) => (
            <button
              type="button"
              key={index}
              onClick={() => goTo(index)}
              className={active === index ? "active" : ""}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={active === index ? "step" : undefined}
            />
          ))}
        </div>
        <button
          type="button"
          className="arrow-button next"
          onClick={next}
          disabled={active === TOTAL_SLIDES - 1}
          aria-label="Next slide"
        >
          <ArrowRight />
        </button>
      </nav>
      <div className="slide-count" aria-live="polite">
        {String(active + 1).padStart(2, "0")} / {TOTAL_SLIDES}
      </div>
    </main>
  );
}
