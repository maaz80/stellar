"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import RollingTextLink from "../rolling-text-link/rolling-text-link";

function StraightWords({ text }) {
  const words = text.split(" ");

  return words.map((word, index) => (
    <span key={`${word}-${index}`}>
      <span data-purpose-word className="inline-block">
        {word}
      </span>
      {index < words.length - 1 ? " " : ""}
    </span>
  ));
}

function ItalicLetters({ text, className = "" }) {
  return (
    <span
      aria-label={text}
      className={`font-serif font-normal italic inline-block ${className}`}
    >
      {text.split("").map((letter, index) => (
        <span
          key={`${letter}-${index}`}
          aria-hidden="true"
          data-purpose-italic-letter
          className="inline-block"
        >
          {letter === " " ? "\u00a0" : letter}
        </span>
      ))}
    </span>
  );
}

const CAROUSEL_ITEMS = [
  {
    src: "/assets/building-1.jpg",
    alt: "Stellar architectural property 1",
    tall: true,
  },
  {
    src: "/assets/building-2.jpg",
    alt: "Stellar architectural property 2",
    tall: false,
  },
  {
    src: "/assets/building-3.jpg",
    alt: "Stellar architectural property 3",
    tall: true,
  },
  {
    src: "/assets/building-4.jpg",
    alt: "Stellar architectural property 4",
    tall: false,
  },
  {
    src: "/assets/building-5.jpg",
    alt: "Stellar architectural property 5",
    tall: true,
  },
  {
    src: "/assets/building-2.jpg",
    alt: "Stellar architectural property 6",
    tall: false,
  },
];

// Base speed for auto movement (higher = faster)
const AUTO_MOVE_SPEED = 3.0;

export default function AboutPurposeSection() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const speedRef = useRef(AUTO_MOVE_SPEED);
  const posRef = useRef(0);
  const scrollVelocityRef = useRef(0);
  const lastScrollYRef = useRef(0);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const titleLines = Array.from(
      section.querySelectorAll("[data-purpose-title-line]")
    );
    const description = section.querySelector("[data-purpose-description]");
    const button = section.querySelector("[data-purpose-button]");
    const carouselContainer = section.querySelector("[data-purpose-carousel]");

    const context = gsap.context(() => {
      // 1. Initial GSAP sets
      titleLines.forEach((line) => {
        gsap.set(
          line.querySelectorAll("[data-purpose-word], [data-purpose-italic-letter]"),
          { autoAlpha: 0, y: 24 }
        );
      });
      if (description) {
        gsap.set(description, { autoAlpha: 0, y: 24 });
      }
      if (button) {
        gsap.set(button, { autoAlpha: 0, y: 20 });
      }
      if (carouselContainer) {
        gsap.set(carouselContainer, { autoAlpha: 0, y: 35 });
      }

      // 2. Heading lines stagger animation
      titleLines.forEach((line) => {
        const words = line.querySelectorAll("[data-purpose-word]");
        const italicLetters = line.querySelectorAll(
          "[data-purpose-italic-letter]"
        );

        ScrollTrigger.create({
          trigger: line,
          start: "top 88%",
          once: true,
          onEnter: () => {
            if (words.length) {
              gsap.to(words, {
                autoAlpha: 1,
                y: 0,
                duration: 1,
                stagger: 0.12,
                ease: "power3.out",
              });
            }
            if (italicLetters.length) {
              gsap.to(italicLetters, {
                autoAlpha: 1,
                y: 0,
                duration: 0.9,
                stagger: 0.08,
                ease: "power3.out",
              });
            }
          },
        });
      });

      // 3. Description animation
      if (description) {
        ScrollTrigger.create({
          trigger: description,
          start: "top 90%",
          once: true,
          onEnter: () =>
            gsap.to(description, {
              autoAlpha: 1,
              y: 0,
              duration: 1.1,
              ease: "power3.out",
            }),
        });
      }

      // 4. Button animation
      if (button) {
        ScrollTrigger.create({
          trigger: button,
          start: "top 92%",
          once: true,
          onEnter: () =>
            gsap.to(button, {
              autoAlpha: 1,
              y: 0,
              duration: 1,
              ease: "power3.out",
            }),
        });
      }

      // 5. Carousel container entrance
      if (carouselContainer) {
        ScrollTrigger.create({
          trigger: carouselContainer,
          start: "top 92%",
          once: true,
          onEnter: () =>
            gsap.to(carouselContainer, {
              autoAlpha: 1,
              y: 0,
              duration: 1.2,
              ease: "power3.out",
            }),
        });
      }
    }, section);

    // 6. Interactive Infinite Auto-move with Scroll Acceleration/Reversal
    lastScrollYRef.current =
      typeof window !== "undefined"
        ? window.pageYOffset || window.scrollY || 0
        : 0;

    const updateMarquee = () => {
      const track = trackRef.current;
      if (!track) return;

      // Real-time per-frame scroll detection (synced with Lenis and GSAP ticker)
      const currentScrollY = window.pageYOffset || window.scrollY || 0;
      const scrollDelta = currentScrollY - lastScrollYRef.current;
      lastScrollYRef.current = currentScrollY;

      // Accumulate scroll impulse (positive = accelerate left, negative = reverse right)
      scrollVelocityRef.current += scrollDelta * 0.45;

      // Friction damping towards zero
      scrollVelocityRef.current *= 0.68;

      // Target speed = configured base speed + scroll velocity
      const targetSpeed = AUTO_MOVE_SPEED + scrollVelocityRef.current;

      // Smooth lerp towards target speed
      speedRef.current += (targetSpeed - speedRef.current) * 0.15;

      // Advance position
      posRef.current -= speedRef.current;

      // Seamless wrap around half width
      const halfWidth = track.scrollWidth / 2;
      if (halfWidth > 0) {
        while (posRef.current <= -halfWidth) {
          posRef.current += halfWidth;
        }
        while (posRef.current > 0) {
          posRef.current -= halfWidth;
        }
      }

      gsap.set(track, { x: posRef.current, force3D: true });
    };

    gsap.ticker.add(updateMarquee);

    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(updateMarquee);
      context.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="our-purpose"
      aria-labelledby="purpose-title"
      className="relative w-full bg-white text-[#181513] pt-20 pb-16 sm:pt-28 sm:pb-24 lg:pt-36 lg:pb-32 overflow-hidden"
    >
      <div className="mx-auto max-w-340 px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10 lg:gap-16">
          {/* ========================================================= */}
          {/* LEFT COLUMN: Main Heading                                 */}
          {/* ========================================================= */}
          <div className="w-full lg:max-w-135 xl:max-w-145 shrink-0">
            <h2
              id="purpose-title"
              className="text-4xl sm:text-5xl lg:text-[3.25rem] xl:text-[3.65rem] font-medium leading-[1.08] tracking-[-0.035em] text-[#181513]"
            >
              <span data-purpose-title-line className="block">
                <StraightWords text="Committed to" />
              </span>
              <span data-purpose-title-line className="block">
                <ItalicLetters text="transforming" className="mr-[0.14em]" />{" "}
                <StraightWords text="New" />
              </span>
              <span data-purpose-title-line className="block">
                <StraightWords text="York for over 4" />
              </span>
              <span data-purpose-title-line className="block">
                <StraightWords text="decades" />
              </span>
            </h2>
          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: Description Paragraph & Action Button       */}
          {/* ========================================================= */}
          <div className="w-full lg:max-w-115 xl:max-w-120 flex flex-col items-start lg:pt-2">
            <p
              data-purpose-description
              className="text-sm sm:text-[18px] leading-[1.68] font-medium text-[#5f5f5f]"
            >
              Founded in 1985, Stellar has grown from a boutique real estate
              firm to one of New York City’s most respected owners and
              developers.
            </p>

            <div className="mt-7 sm:mt-8">
              <RollingTextLink
                href="#purpose"
                label="Our Purpose"
                data-purpose-button
                className="inline-flex h-11 sm:h-12 items-center justify-center rounded-bl-xl rounded-tr-xl bg-[#06184f] px-7 text-sm font-medium text-white transition-[border-radius,background-color] duration-300 ease-out hover:rounded-bl-3xl hover:rounded-tr-3xl hover:bg-[#0b2373]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================= */}
      {/* INFINITE MARQUEE CAROUSEL (Rhythmic Tall / Short Cards)        */}
      {/* ============================================================= */}
      <div
        data-purpose-carousel
        className="w-full mt-16 sm:mt-24 lg:mt-28 overflow-hidden select-none"
      >
        <div
          ref={trackRef}
          className="flex items-center gap-5 sm:gap-6 w-max will-change-transform"
        >
          {/* Set 1 + Set 2 duplicated for seamless infinite wrapping */}
          {[...CAROUSEL_ITEMS, ...CAROUSEL_ITEMS].map((item, idx) => (
            <div
              key={idx}
              className={`shrink-0 overflow-hidden bg-[#e5e5e5] relative transition-transform duration-500 ease-out ${
                item.tall
                  ? "w-70 sm:w-[320px] lg:w-92.5 h-97.5 sm:h-115 lg:h-134.5"
                  : "w-70 sm:w-[320px] lg:w-92.5 h-75 sm:h-88.75 lg:h-103.25"
              }`}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 640px) 280px, (max-width: 1024px) 320px, 370px"
                className="object-cover object-center"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
