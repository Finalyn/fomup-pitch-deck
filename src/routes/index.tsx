import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Building2, CalendarHeart, Martini, Music2 } from "lucide-react";
import { Fragment, useCallback, useEffect, useRef, useState, type ReactNode } from "react";

import espresso from "@/assets/fomup-espresso-transparent.png";
import matcha from "@/assets/fomup-matcha-transparent.png";
import blueberry from "@/assets/fomup-blueberry-transparent.png";
import pinacolada from "@/assets/fomup-pinacolada-transparent.png";
import lineup from "@/assets/fomup-lineup.png";

// Social scrapers do not resolve relative paths, so the share image needs an
// absolute URL. Update this if the deck moves to another domain.
const SITE_URL = "https://finalyn.github.io/fomup-pitch-deck/";
const SHARE_IMAGE = `${SITE_URL}og-image.jpg`;
const SHARE_DESCRIPTION =
  "Swiss-made drinkable cocktail foam. Four flavours, served straight from the can.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FOMUP, Pitch Deck" },
      { name: "description", content: SHARE_DESCRIPTION },
      { property: "og:site_name", content: "FOMUP" },
      { property: "og:title", content: "FOMUP, Drink the Foam" },
      { property: "og:description", content: SHARE_DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE_URL },
      { property: "og:image", content: SHARE_IMAGE },
      { property: "og:image:type", content: "image/jpeg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "675" },
      {
        property: "og:image:alt",
        content: "The four FOMUP flavours beside four glasses of foam",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "FOMUP, Drink the Foam" },
      { name: "twitter:description", content: SHARE_DESCRIPTION },
      { name: "twitter:image", content: SHARE_IMAGE },
    ],
  }),
  component: PitchDeck,
});

const TOTAL_SLIDES = 16;
const DARK_SLIDES = new Set([7, 9]);
const IDEA_SLIDE = 1;

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

const routes = [
  {
    number: "01",
    name: "Public",
    line: "Sold direct to people, served from the can.",
    points: [
      "Retail shelves and e-commerce",
      "The can dispenses on its own, nothing else to buy",
      "Parties, gifting, everyday treat",
    ],
  },
  {
    number: "02",
    name: "Business",
    line: "Sold to venues, served by professionals.",
    points: [
      "Bars, nightclubs, festivals, private events",
      "One container, no prep, no waste",
      "Repeat orders on a service contract",
    ],
  },
] as const;

const homeSteps = [
  { number: "01", title: "Own it", note: "One can, four flavours" },
  { number: "02", title: "Chill it", note: "Four hours in the fridge" },
  { number: "03", title: "Shake it", note: "A few seconds in the hand" },
  { number: "04", title: "Drink it", note: "Foam straight from the can" },
] as const;

const serveSteps = [
  { number: "01", title: "Order it", note: "Container delivered to the venue" },
  { number: "02", title: "Load it", note: "Straight into the siphon" },
  { number: "03", title: "Chill it", note: "Four hours in the fridge" },
  { number: "04", title: "Serve it", note: "Foam on tap all night" },
] as const;

const flavors = [
  {
    key: "espresso",
    name: "Espresso Martini",
    accent: "oklch(.35 .07 55)",
    idea: "A cocktail you have never tasted, because you have never chewed one.",
    category: "The alcoholic one",
    note: "Rich coffee, smooth, gently sweet",
    src: espresso,
  },
  {
    key: "pinacolada",
    name: "Piña Colada",
    accent: "oklch(.62 .13 78)",
    idea: "Holiday in a glass, thick enough to stand a spoon in.",
    category: "The mocktail",
    note: "Tropical, creamy, refreshing",
    src: pinacolada,
  },
  {
    key: "blueberry",
    name: "Blueberry",
    accent: "oklch(.45 .22 295)",
    idea: "Fruit, air and sugar. Gone in three spoons.",
    category: "The fruity one",
    note: "Sweet, playful, easy to love",
    src: blueberry,
  },
  {
    key: "matcha",
    name: "Matcha Coconut",
    accent: "oklch(.5 .12 140)",
    idea: "Earthy, creamy, and impossible not to film.",
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

function PitchDeck() {
  const [active, setActive] = useState(0);
  // Slide 2 cycles through the four cans before it lets the deck move on.
  const [ideaStep, setIdeaStep] = useState(0);
  const touchStart = useRef<number | null>(null);

  const goTo = useCallback((index: number) => {
    setActive(Math.max(0, Math.min(TOTAL_SLIDES - 1, index)));
    setIdeaStep(0);
  }, []);

  const previous = useCallback(() => {
    if (active === IDEA_SLIDE && ideaStep > 0) {
      setIdeaStep(ideaStep - 1);
      return;
    }
    if (active > 0) {
      const target = active - 1;
      setActive(target);
      setIdeaStep(target === IDEA_SLIDE ? flavors.length - 1 : 0);
    }
  }, [active, ideaStep]);

  const next = useCallback(() => {
    if (active === IDEA_SLIDE && ideaStep < flavors.length - 1) {
      setIdeaStep(ideaStep + 1);
      return;
    }
    if (active < TOTAL_SLIDES - 1) {
      setActive(active + 1);
      setIdeaStep(0);
    }
  }, [active, ideaStep]);

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
      aria-label="FOMUP pitch deck"
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
          <p className="corner-note">Pitch deck</p>
          <p className="corner-location">Swiss-made / USA launch</p>
        </Slide>

        <Slide className="idea-slide">
          <div className="idea-copy">
            <p className="eyebrow" style={{ color: flavors[ideaStep]?.accent }}>
              The idea
            </p>
            <h1 key={flavors[ideaStep]?.key}>
              {flavors[ideaStep]?.idea ?? "A cocktail you have never tasted."}
            </h1>
            <p className="body-copy">
              A dense, aerated mousse served straight from a pressurized can.
            </p>
          </div>
          <div className="idea-stage">
            <ProductImage
              key={flavors[ideaStep]?.key}
              src={flavors[ideaStep]?.src ?? espresso}
              alt={`FOMUP ${flavors[ideaStep]?.name ?? "Espresso Martini"} can`}
              className="idea-product"
            />
            <p className="idea-flavor" key={`name-${flavors[ideaStep]?.key}`}>
              {flavors[ideaStep]?.name}
            </p>
            <div className="idea-steps" aria-hidden="true">
              {flavors.map((flavor, index) => (
                <span key={flavor.key} className={index === ideaStep ? "active" : ""} />
              ))}
            </div>
          </div>
        </Slide>
        <Slide className="video-slide">
          <div className="video-frame">
            <video
              src={`${import.meta.env.BASE_URL}fomup-demo-video.mp4`}
              controls
              playsInline
              muted
              loop
              preload="metadata"
            />
          </div>
          <p className="video-caption">First demo</p>
        </Slide>

        <Slide className="routes-slide">
          <p className="eyebrow">Go to market</p>
          <h1 className="section-headline">Two ways to sell it.</h1>
          <div className="routes-grid">
            {routes.map(({ number, name, line, points }) => (
              <article key={number}>
                <span className="route-number">{number}</span>
                <h2>{name}</h2>
                <p className="route-line">{line}</p>
                <ul>
                  {points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </Slide>

        <Slide className="home-slide">
          <p className="eyebrow">01 / Public</p>
          <h1 className="section-headline">Own it. Shake it. Drink it.</h1>
          <p className="format-sub">
            No bar, no siphon, no skill. A can in the fridge and friends who have never seen a
            cocktail come out like this.
          </p>
          <div className="format-flow" aria-label="Four-step home flow">
            {homeSteps.map(({ number, title, note }, index) => (
              <div className="flow-item" key={number}>
                <figure className="flow-step">
                  <span className="step-number">{number}</span>
                  <strong>{title}</strong>
                  <span className="step-note">{note}</span>
                </figure>
                {index < homeSteps.length - 1 && <span className="flow-arrow" aria-hidden="true" />}
              </div>
            ))}
          </div>
          <p className="format-cta">Impress your friends.</p>
        </Slide>

        <Slide className="format-slide">
          <p className="eyebrow">02 / Business</p>
          <h1 className="section-headline">Order it. Load it. Serve it.</h1>
          <p className="format-sub">
            No prep, no shaking, no wasted stock. One container feeds a whole night of service, and
            the bar keeps its hands free.
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
            <p className="keywords-wall">
              {keywords.map((word, index) => (
                <Fragment key={word}>
                  <span>{word}</span>
                  {index < keywords.length - 1 ? " " : null}
                </Fragment>
              ))}
            </p>
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

        <Slide className="lineup-slide">
          {/* The photo has its own beige gradient background, noticeably darker than
              the deck cream. Blurring a copy of it behind the sharp image dissolves
              the seam instead of leaving a hard rectangle floating on the slide. */}
          <div
            className="lineup-backdrop"
            style={{ backgroundImage: `url(${lineup})` }}
            aria-hidden="true"
          />
          <img
            className="lineup-image"
            src={lineup}
            alt="The four FOMUP flavours, Pinacolada, Espresso Martini, Matcha Coconut and Blueberry, each beside a glass of foam"
            draggable={false}
          />
          <div className="lineup-caption">
            <p className="eyebrow">The look</p>
            <h2>Premium, and still fun.</h2>
            <p className="lineup-note">
              Visual mock-up. The cap and the dispensing head are still being reworked.
            </p>
          </div>
        </Slide>

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
        <Slide className="contact-slide">
          <p className="eyebrow">Let&apos;s talk</p>
          <h1>
            Get in
            <br />
            touch
          </h1>
          <p className="contact-line">
            Swiss-made drinkable cocktail foam, launching in the United States.
          </p>
          <div className="contact-details">
            <a className="email-link" href="mailto:fomup.drinks@gmail.com">
              fomup.drinks@gmail.com
            </a>
            <a
              className="deck-button"
              href="mailto:fomup.drinks@gmail.com?subject=FOMUP%20pitch%20deck"
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
