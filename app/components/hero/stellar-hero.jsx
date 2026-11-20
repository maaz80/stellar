"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { FiArrowUpRight } from "react-icons/fi";
import RollingTextLink from "../rolling-text-link/rolling-text-link";

const introCompleteEvent = "stellar:intro-complete";
const pageTransitionCompleteEvent = "stellar:page-transition-complete";
const heroVideo = "/assets/first-main.mp4";
const featureSlides = [
  {
    label: "Affordable Housing",
    title: "We Build Housing That Supports All New Yorkers",
    image:
      "https://images.pexels.com/videos/7415436/pexels-photo-7415436.jpeg?auto=compress&cs=tinysrgb&w=900",
    imageAlt: "Family spending time together",
    href: "#affordable-housing",
  },
  {
    label: "Thoughtful Development",
    title: "Creating Places Where New Yorkers Can Thrive",
    image:
      "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=900",
    imageAlt: "Residential building in the city",
    href: "#development",
  },
  {
    label: "Find Your Place",
    title: "Discover a Home That Feels Like Yours",
    image:
      "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=900",
    imageAlt: "Modern residential architecture",
    href: "#rentals",
  },
];

export default function StellarHero() {
  const heroRef = useRef(null);
  const featureContentRef = useRef(null);
  const hasRotatedFeatureRef = useRef(false);
  const [featureIndex, setFeatureIndex] = useState(0);
  const [carouselReady, setCarouselReady] = useState(false);

  useLayoutEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const normalText = hero.querySelectorAll("[data-hero-normal]");
    const italicLetters = hero.querySelectorAll("[data-hero-letter]");
    const featureCard = hero.querySelector("[data-hero-feature]");
    const rentButton = hero.querySelector("[data-hero-cta]");
    const animatedElements = [
      ...normalText,
      ...italicLetters,
      featureCard,
      rentButton,
    ];
    let timeline;

    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set([...normalText, ...italicLetters], {
        autoAlpha: 0,
        yPercent: 110,
      });
      gsap.set(featureCard, { autoAlpha: 0, y: 30 });
      gsap.set(rentButton, { autoAlpha: 0, y: 24 });
    }

    function revealHero() {
      setCarouselReady(true);

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(animatedElements, {
          autoAlpha: 1,
          clearProps: "transform",
        });
        return;
      }

      timeline?.kill();
      timeline = gsap
        .timeline({ delay: 0.2 })
        .fromTo(
          normalText,
          { autoAlpha: 0, yPercent: 110 },
          {
            autoAlpha: 1,
            yPercent: 0,
            duration: 0.72,
            stagger: 0.16,
            ease: "power3.out",
          },
        )
        .fromTo(
          italicLetters,
          { autoAlpha: 0, yPercent: 110 },
          {
            autoAlpha: 1,
            yPercent: 0,
            duration: 0.58,
            stagger: 0.1,
            ease: "power3.out",
            clearProps: "transform,opacity,visibility",
          },
          ">-0.05",
        )
        .fromTo(
          featureCard,
          { autoAlpha: 0, y: 30 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            clearProps: "transform,opacity,visibility",
          },
          0,
        )
        .fromTo(
          rentButton,
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
            clearProps: "transform,opacity,visibility",
          },
          ">-0.2",
        );
    }

    if (typeof window !== "undefined") {
      if (!window.__stellarIntroFinished) {
        // 1. Initial site load / reload: wait for intro wordmark overlay to finish
        window.addEventListener(introCompleteEvent, revealHero, { once: true });
      } else {
        // 2. Client navigation: wait for sheet to fully land flat!
        window.addEventListener(pageTransitionCompleteEvent, revealHero, { once: true });
      }
    }
    return () => {
      window.removeEventListener(introCompleteEvent, revealHero);
      window.removeEventListener(pageTransitionCompleteEvent, revealHero);
      timeline?.kill();
      gsap.set(animatedElements, {
        clearProps: "opacity,visibility,transform",
      });
    };
  }, []);

  useLayoutEffect(() => {
    const content = featureContentRef.current;
    if (!content || !carouselReady) return;
    if (featureIndex === 0 && !hasRotatedFeatureRef.current) return;

    hasRotatedFeatureRef.current = true;
    const animation = gsap.fromTo(
      content,
      { autoAlpha: 0, y: 24, scale: 0.97 },
      {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.65,
        ease: "power3.out",
        clearProps: "transform,opacity,visibility",
      },
    );

    return () => animation.kill();
  }, [carouselReady, featureIndex]);

  useEffect(() => {
    if (
      !carouselReady ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let exitTween;
    const timeout = window.setTimeout(() => {
      const content = featureContentRef.current;
      if (!content) return;

      exitTween = gsap.to(content, {
        autoAlpha: 0,
        y: -18,
        scale: 0.97,
        duration: 0.55,
        ease: "power2.in",
        onComplete: () => {
          setFeatureIndex((index) => (index + 1) % featureSlides.length);
        },
      });
    }, 4500);

    return () => {
      window.clearTimeout(timeout);
      exitTween?.kill();
    };
  }, [carouselReady, featureIndex]);

  useEffect(() => {
    const hero = heroRef.current;
    const video = hero?.querySelector("video");
    if (!hero || !video) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reducedMotion) return;

    let frame = 0;
    function updateVideoScale() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const viewportHeight = window.innerHeight || 1;
        const scrollProgress = gsap.utils.clamp(
          0,
          1,
          window.scrollY / viewportHeight,
        );
        gsap.set(video, { scale: 1 + scrollProgress * 0.28 });
      });
    }

    updateVideoScale();
    window.addEventListener("scroll", updateVideoScale, { passive: true });
    window.addEventListener("resize", updateVideoScale);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateVideoScale);
      window.removeEventListener("resize", updateVideoScale);
      gsap.set(video, { clearProps: "transform" });
    };
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative flex min-h-[91vh] md:min-h-screen flex-col overflow-hidden bg-[#272421] text-white"
    >
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      >
        <source src={heroVideo} type="video/mp4" />
      </video>
      {/* <div className="absolute inset-0 bg-black/35" />
      <div className="absolute inset-0 bg-linear-to-r from-black/60 via-black/20 to-black/20" /> */}

      <div
        id="home"
        className="relative z-1 flex flex-1 flex-col justify-end px-4 pt-32 pb-4 sm:px-10 sm:pb-10 lg:px-10 xl:px-[2.5vw]"
      >
        <div className="max-w-248 pb-2 lg:pb-0">
          <h1
            aria-label="We help New Yorkers find home"
            className="text-[clamp(3.5rem,10vw,5.2rem)] leading-[0.86] font-medium tracking-[-0.075em] sm:text-[clamp(3rem,6.8vw,5.2rem)]"
          >
            <span className="mb-1 block overflow-hidden">
              <span data-hero-normal className="block">
                We help
              </span>
            </span>
            <span className="mb-1 block overflow-hidden">
              <span data-hero-normal className="block">
                New Yorkers
              </span>
            </span>
            <span className="block">
              <span className="inline-block overflow-hidden align-baseline">
                <span data-hero-normal className="inline-block">
                  find
                </span>
              </span>{" "}
              <span
                aria-label="home"
                className="mr-[-0.18em] inline-block overflow-hidden pr-[0.18em] align-baseline font-(family-name:--font-playfair) font-medium italic"
              >
                {"home".split("").map((letter, index) => (
                  <span
                    key={`${letter}-${index}`}
                    data-hero-letter
                    aria-hidden="true"
                    className="inline-block"
                  >
                    {letter}
                  </span>
                ))}
              </span>
            </span>
          </h1>
          <p className="mt-7 hidden max-w-100 text-base leading-7 font-medium text-white/90 sm:block sm:text-lg">
            <span className="mb-1 block overflow-hidden">
              <span data-hero-normal className="block">
                Since 1985, creating, investing,
              </span>
            </span>
            <span className="block overflow-hidden">
              <span data-hero-normal className="block">
                developing &amp; living NYC real estate.
              </span>
            </span>
          </p>
        </div>

        <aside className="mt-8 w-full max-w-none self-stretch lg:absolute lg:right-[2.5vw] lg:bottom-10 lg:mt-0 sm:max-w-58 sm:self-end">
          <a
            data-hero-feature
            href={featureSlides[featureIndex].href}
            className="block overflow-hidden p-3 text-white backdrop-blur-sm sm:p-4"
          >
            <span
              ref={featureContentRef}
              className="grid grid-cols-[minmax(0,1fr)_44%] items-center gap-3 sm:block"
            >
              <span className="min-w-0">
                <span className="block text-xs font-medium text-white/65">
                  {featureSlides[featureIndex].label}
                </span>
                <span className="mt-2 line-clamp-3 block text-sm leading-5 font-semibold">
                  {featureSlides[featureIndex].title}
                </span>
              </span>
              <span className="group relative block h-24 overflow-hidden sm:mt-4 sm:aspect-[1.48] sm:h-auto">
                <span
                  role="img"
                  aria-label={featureSlides[featureIndex].imageAlt}
                  className="block h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{
                    backgroundImage: `url("${featureSlides[featureIndex].image}")`,
                  }}
                />
                <span className="absolute inset-0 bg-black/10" />
                <FiArrowUpRight
                  aria-hidden="true"
                  className="absolute right-2 bottom-2 text-lg"
                />
              </span>
            </span>
          </a>
          <RollingTextLink
            data-hero-cta
            href="#rentals"
            label="Rent now"
            className="mt-1 flex h-11.5 items-center justify-center rounded-bl-xl rounded-tr-xl bg-white px-6 text-base font-sans font-medium text-[#171717] transition-colors sm:mt-3 sm:h-13.5"
          />
        </aside>
      </div>
    </section>
  );
}
