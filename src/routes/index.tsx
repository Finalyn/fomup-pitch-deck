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
  "A Swiss-born innovation creating an entirely new foam-drink category, with alcoholic, alcohol-free and wellness collections.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FOMUP, Pitch Deck" },
      { name: "description", content: SHARE_DESCRIPTION },
      { property: "og:site_name", content: "FOMUP" },
      { property: "og:title", content: "FOMUP, Foam. Reimagined." },
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
      { name: "twitter:title", content: "FOMUP, Foam. Reimagined." },
      { name: "twitter:description", content: SHARE_DESCRIPTION },
      { name: "twitter:image", content: SHARE_IMAGE },
    ],
  }),
  component: PitchDeck,
});

const TOTAL_SLIDES = 18;
const DARK_SLIDES = new Set([7, 9, 12]);
// The range photo carries its own FOMUP lockup, so the fixed one is dropped
// there on phones, where the two would otherwise sit on top of each other.
const BARE_SLIDES = new Set([11]);
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
    name: "Consumer",
    line: "A new drinking experience, ready whenever you are.",
    points: [
      "Retail stores and e-commerce",
      "Alcoholic and alcohol-free varieties",
      "Designed for parties, gifting and social moments",
    ],
  },
  {
    number: "02",
    name: "Hospitality",
    line: "Instant wow, served effortlessly.",
    points: [
      "Bars, hotels, clubs, festivals and private events",
      "Fast, consistent service with no special equipment",
      "Custom flavors and private-label opportunities",
    ],
  },
] as const;

const homeSteps = [
  { number: "01", title: "Choose it", note: "Pick your flavor" },
  { number: "02", title: "Chill it", note: "Keep refrigerated" },
  { number: "03", title: "Shake it", note: "Shake for a few seconds" },
  { number: "04", title: "Press & serve", note: "Create instant foam in your glass" },
] as const;

const serveSteps = [
  { number: "01", title: "Stock it", note: "Choose your flavors" },
  { number: "02", title: "Chill it", note: "Keep bottles refrigerated" },
  { number: "03", title: "Shake it", note: "Ready in seconds" },
  { number: "04", title: "Press & serve", note: "Create the wow effect every time" },
] as const;

const flavors = [
  {
    key: "espresso",
    name: "Espresso Martini",
    accent: "oklch(.35 .07 55)",
    collection: "The cocktail collection",
    note: "Bold espresso. Velvety foam. An unforgettable finish.",
    tagline: "A cocktail icon, completely reimagined.",
    src: espresso,
  },
  {
    key: "pinacolada",
    name: "Piña Colada",
    accent: "oklch(.62 .13 78)",
    collection: "The wellness collection",
    note: "Juicy pineapple. Velvety coconut foam. A refreshing tropical finish.",
    tagline: "A feel-good escape, completely reimagined.",
    src: pinacolada,
  },
  {
    key: "blueberry",
    name: "Blueberry",
    accent: "oklch(.45 .22 295)",
    collection: "The fruit collection",
    note: "Juicy berries. Velvety foam. A bright, refreshing finish.",
    tagline: "Pure fruit pleasure, completely reimagined.",
    src: blueberry,
  },
  {
    key: "matcha",
    name: "Matcha Coconut",
    accent: "oklch(.5 .12 140)",
    collection: "The wellness collection",
    note: "Vibrant matcha. Velvety coconut foam. Naturally uplifting.",
    tagline: "Your daily ritual, completely reimagined.",
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
  {
    label: "Bars & restaurants",
    note: "A distinctive signature serve, ready in seconds",
    Icon: Martini,
  },
  {
    label: "Hotels & venues",
    note: "A premium experience with effortless preparation",
    Icon: Building2,
  },
  {
    label: "Nightlife & festivals",
    note: "Fast, consistent service with maximum visual impact",
    Icon: Music2,
  },
  {
    label: "Private events",
    note: "An unexpected moment guests photograph, share and remember",
    Icon: CalendarHeart,
  },
] as const;

const trends = [
  {
    title: "Less alcohol",
    note: "Consumers are moderating their alcohol intake without giving up social experiences.",
  },
  {
    title: "Better choices",
    note: "Demand is growing for lower-sugar, functional and alcohol-free alternatives.",
  },
  {
    title: "More experience",
    note: "Taste is no longer enough. Today's drinks must feel new, look exciting and be worth sharing.",
  },
];

const audienceTiers = [
  {
    rank: "Emerging audience",
    range: "Under 21",
    who: "Gen Z",
    collections: "Alcohol-free, fruit and wellness collections",
  },
  {
    rank: "Primary audience",
    range: "21 to 35",
    who: "Gen Z and young millennials",
    collections: "Alcoholic, alcohol-free and wellness collections",
  },
  {
    rank: "Secondary audience",
    range: "35 and over",
    who: "Experience-seeking consumers",
    collections: "Premium cocktails, entertaining and wellness collections",
  },
];

const collaborations = [
  {
    kind: "Spirits & beverage brands",
    note: "Co-created flavors, private-label collections and new product extensions",
  },
  {
    kind: "Hotels & restaurant groups",
    note: "Exclusive signature serves tailored to each brand or venue",
  },
  {
    kind: "Festivals & entertainment",
    note: "Branded experiences designed for high-volume service and social impact",
  },
  {
    kind: "Fashion & lifestyle brands",
    note: "Limited editions, launches and experiential activations",
  },
  {
    kind: "Creators & athletes",
    note: "Authentic collaborations connecting FOMUP with highly engaged audiences",
  },
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
      className={`deck${DARK_SLIDES.has(active) ? " deck-inverted" : ""}${BARE_SLIDES.has(active) ? " deck-bare" : ""}`}
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
            <h1>A drink you&apos;ve never experienced before.</h1>
            <p className="body-copy">
              A rich, aerated foam that transforms every flavor into an entirely new drinking
              experience.
            </p>
          </div>
          <div className="idea-stage">
            <ProductImage
              key={flavors[ideaStep]?.key}
              src={flavors[ideaStep]?.src ?? espresso}
              alt={`FOMUP ${flavors[ideaStep]?.name ?? "Espresso Martini"}`}
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
          <div className="video-copy">
            <h1 className="section-headline">Flavor you can feel.</h1>
            <p className="video-sub">
              A smooth, aerated drink that turns every sip into a completely new sensory experience.
            </p>
          </div>
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
        </Slide>

        <Slide className="routes-slide">
          <p className="eyebrow">Go to market</p>
          <h1 className="section-headline">One product. Two markets.</h1>
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
          <p className="eyebrow">01 / Consumer</p>
          <h1 className="section-headline">Chill it. Shake it. Wow.</h1>
          <p className="format-sub">
            No bartender. No equipment. Just smooth, flavorful foam and an entirely new experience
            ready in seconds.
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
          <p className="format-cta">Turn every serve into an experience.</p>
        </Slide>

        <Slide className="format-slide">
          <p className="eyebrow">02 / Hospitality</p>
          <h1 className="section-headline">Faster service. Bigger impact.</h1>
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
          <p className="format-cta">Less preparation. More experience.</p>
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
              <p className="eyebrow">{flavor.collection}</p>
            </header>
            <div className="flavor-stage">
              <img src={flavor.src} alt={`FOMUP ${flavor.name}`} draggable={false} />
            </div>
            <footer className="flavor-foot">
              <h1>{flavor.name}</h1>
              <p>{flavor.note}</p>
              <p className="flavor-tagline">{flavor.tagline}</p>
              <small>250 ml</small>
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
          <figure className="lineup-frame">
            <img
              className="lineup-image"
              src={lineup}
              alt="The four FOMUP flavours, Pinacolada, Espresso Martini, Matcha Coconut and Blueberry, each beside a glass of foam"
              draggable={false}
            />
            <figcaption className="lineup-caption">
              <p className="eyebrow">The design</p>
              <h2>Made to stand out.</h2>
              <p className="lineup-note">
                A distinctive aluminium bottle that combines premium design with playful energy,
                created to be noticed, shared and remembered.
              </p>
              <p className="lineup-note lineup-disclaimer">
                Concept visual. Bottle, cap and dispensing system currently in development.
              </p>
            </figcaption>
          </figure>
        </Slide>

        {/* The render is a VP9 WebM with an alpha channel, which Safari decodes without
            its transparency and paints on solid black. The slide is pure black behind
            the frame for that reason: where the alpha fails the fallback is invisible,
            and no glow is placed inside the video's own rectangle. */}
        <Slide className="mockup-slide">
          <div className="mockup-copy">
            <p className="eyebrow">The bottle</p>
            <h1 className="section-headline">See it from every angle.</h1>
          </div>
          <div className="mockup-stage">
            <video
              className="mockup-video"
              src={`${import.meta.env.BASE_URL}fomup-bottle-3d.webm`}
              autoPlay
              muted
              loop
              playsInline
              controls
              preload="metadata"
            />
          </div>
          <p className="mockup-note">
            Concept render. Bottle, cap and dispensing system currently in development.
          </p>
        </Slide>

        <Slide className="audience-slide">
          <p className="eyebrow">Where it is served</p>
          <h1 className="section-headline">Wherever people gather, FOMUP stands out.</h1>
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
          <p className="eyebrow">The shift</p>
          <h1 className="section-headline">
            A generation drinking differently
            <br />
            and expecting more.
          </h1>
          <div className="trend-list">
            {trends.map(({ title, note }) => (
              <article key={title}>
                <h2>{title}</h2>
                <p>{note}</p>
              </article>
            ))}
          </div>
        </Slide>

        <Slide className="tiers-slide">
          <p className="eyebrow">Who drinks it</p>
          <h1 className="section-headline">Three audiences, one product.</h1>
          <ul className="clean-list tier-list">
            {audienceTiers.map(({ rank, range, who, collections }) => (
              <li key={rank}>
                <span className="tier-rank">{rank}</span>
                <span className="list-title">{range}</span>
                <span className="list-note">
                  {who}. {collections}.
                </span>
              </li>
            ))}
          </ul>
        </Slide>

        <Slide className="collab-slide">
          <p className="eyebrow">Collaborations</p>
          <h1 className="section-headline">Built to collaborate. Designed to stand out.</h1>
          <ul className="clean-list collab-list">
            {collaborations.map(({ kind, note }) => (
              <li key={kind}>
                <span className="list-title">{kind}</span>
                <span className="list-note">{note}</span>
              </li>
            ))}
          </ul>
          <p className="format-cta">One innovation. Endless collaboration possibilities.</p>
        </Slide>
        <Slide className="contact-slide">
          <p className="eyebrow">Let&apos;s create what&apos;s next</p>
          <h1>
            Join the foam
            <br />
            revolution.
          </h1>
          <p className="contact-line">
            FOMUP is a Swiss-born innovation designed for the US and European markets, creating an
            entirely new foam-drink category with alcoholic, alcohol-free and wellness
            possibilities.
          </p>
          <p className="contact-line contact-ask">
            We are seeking strategic partners across investment, formulation, manufacturing and
            distribution.
          </p>
          <div className="contact-details">
            <a className="email-link" href="mailto:fomup.drinks@gmail.com">
              fomup.drinks@gmail.com
            </a>
            <a
              className="deck-button"
              href="mailto:fomup.drinks@gmail.com?subject=FOMUP%20pitch%20deck"
            >
              Explore the opportunity <ArrowRight />
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
