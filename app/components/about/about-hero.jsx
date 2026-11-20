"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

const heroVideo = "/assets/about-hero-2.mp4";
const introCompleteEvent = "stellar:intro-complete";
const pageTransitionCompleteEvent = "stellar:page-transition-complete";

export default function AboutHero() {
  const heroRef = useRef(null);

  useLayoutEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const normalText = hero.querySelectorAll("[data-hero-normal]");
    const italicLetters = hero.querySelectorAll("[data-hero-letter]");
    const subText = hero.querySelector("[data-hero-sub]");

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion) return;

    let timeline = null;
    let context = null;

    function revealAboutHero() {
      timeline?.kill();
      timeline = gsap.timeline({ delay: 0.2 });

      // 1. Heading normal text lines slide up
      timeline.fromTo(
        normalText,
        { autoAlpha: 0, yPercent: 110 },
        {
          autoAlpha: 1,
          yPercent: 0,
          duration: 0.85,
          stagger: 0.16,
          ease: "power3.out",
        }
      );

      // 2. "built" italic letters slide up with stagger
      if (italicLetters.length) {
        timeline.fromTo(
          italicLetters,
          { autoAlpha: 0, yPercent: 110 },
          {
            autoAlpha: 1,
            yPercent: 0,
            duration: 0.85,
            stagger: 0.06,
            ease: "power3.out",
          },
          "-=0.6"
        );
      }

      // 3. Right paragraph slides up
      if (subText) {
        timeline.fromTo(
          subText,
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.85,
            ease: "power3.out",
          },
          "-=0.5"
        );
      }
    }

    context = gsap.context(() => {
      gsap.set([...normalText, ...italicLetters], {
        autoAlpha: 0,
        yPercent: 110,
      });
      if (subText) {
        gsap.set(subText, { autoAlpha: 0, y: 22 });
      }

      if (typeof window !== "undefined") {
        if (!window.__stellarIntroFinished) {
          // 1. Initial site load / reload: wait for intro wordmark overlay to finish
          window.addEventListener(introCompleteEvent, revealAboutHero, {
            once: true,
          });
        } else {
          // 2. Client navigation: wait for sheet to fully land flat!
          window.addEventListener(pageTransitionCompleteEvent, revealAboutHero, {
            once: true,
          });
        }
      }
    }, hero);

    return () => {
      window.removeEventListener(introCompleteEvent, revealAboutHero);
      window.removeEventListener(pageTransitionCompleteEvent, revealAboutHero);
      timeline?.kill();
      context?.revert();
    };
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative flex h-[93vh] md:h-screen flex-col overflow-hidden bg-[#272421] text-white"
    >
      {/* Background Autoplaying Loop Video */}
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

      {/* Subtle overlay for text clarity */}
      <div className="absolute inset-0 bg-black/25 pointer-events-none" />

      {/* Bottom Content Area */}
      <div
        id="about-hero"
        className="relative z-1 flex flex-1 flex-col justify-end px-4 pt-32 pb-6 sm:px-10 sm:pb-10 lg:px-10 xl:px-[2.5vw]"
      >
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          {/* Left Heading */}
          <div className="max-w-260 pb-2 lg:pb-0">
            <h1
              aria-label="Rooted in New York City, built for New Yorkers"
              className="text-[clamp(3.625rem,10vw,5.325rem)] font-medium leading-[0.93] tracking-[-0.035em] sm:text-[clamp(3.125rem,6.9vw,5.325rem)]"
            >
              {/* Line 1: Rooted in New */}
              <span className="sm:mb-2 block overflow-hidden pb-1 -mb-1">
                <span data-hero-normal className="block">
                  Rooted in New
                </span>
              </span>

              {/* Line 2: York City, built */}
              <span className="mb-1.5 sm:mb-2 block">
                <span className="inline-block overflow-hidden align-baseline pb-1 -mb-1">
                  <span data-hero-normal className="inline-block mr-2 sm:mr-2.5">
                    York City,
                  </span>
                </span>
                <span
                  aria-label="built"
                  className="mr-[-0.12em] inline-block overflow-hidden pr-[0.12em] align-baseline font-serif italic font-medium"
                >
                  {"built".split("").map((letter, index) => (
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

              {/* Line 3: for New Yorkers */}
              <span className="block overflow-hidden pb-2.5 -mb-2.5">
                <span data-hero-normal className="block">
                  for New Yorkers
                </span>
              </span>
            </h1>
          </div>

          {/* Right Descriptive Paragraph */}
          <div className="max-w-92.5 pb-1 lg:pb-2">
            <p
              data-hero-sub
              className="text-[15px] leading-[1.38] font-normal text-white sm:text-[18px] sm:leading-[1.42]"
            >
              We&rsquo;re the pulse of NYC, shaping its skyline and
              neighborhoods with the same energy and character that defines the
              city itself.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
