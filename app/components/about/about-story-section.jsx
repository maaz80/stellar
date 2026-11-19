"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

function StraightWords({ text }) {
  const words = text.split(" ");

  return words.map((word, index) => (
    <span key={`${word}-${index}`}>
      <span data-story-word className="inline-block">
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
          data-story-italic-letter
          className="inline-block"
        >
          {letter === " " ? "\u00a0" : letter}
        </span>
      ))}
    </span>
  );
}

function parseRollingNumber(value) {
  const match = value.match(/^(\d+)(.*)$/);
  if (!match) return { configs: [], suffix: value };
  const rawDigits = match[1];
  const suffix = match[2];

  const configs = rawDigits.split("").map((char, i) => {
    const digit = parseInt(char, 10);
    // Initial item is empty space (idx === 0) so the digit area stays empty before animation
    let sequence = [""];
    if (digit === 0) {
      sequence = ["", 1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
    } else {
      for (let n = 1; n <= digit; n++) {
        sequence.push(n);
      }
    }
    const targetIndex = sequence.length - 1;
    // 50% slower animation (durations extended by ~60-70% for smooth, clear visibility):
    let duration = 0.85 + i * 0.28 + (digit === 0 ? 0.75 : digit * 0.16);
    if (digit === 1 && i === 0) duration = 0.85;
    const delay = 0.15 + i * 0.2;
    return {
      digit,
      sequence,
      targetIndex,
      totalItems: sequence.length,
      duration: Number(duration.toFixed(2)),
      delay: Number(delay.toFixed(2)),
    };
  });
  return { configs, suffix };
}

function RollingNumber({ value, className = "" }) {
  const { configs, suffix } = parseRollingNumber(value);

  return (
    <span
      aria-label={value}
      className={`inline-flex items-baseline overflow-hidden tabular-nums ${className}`}
    >
      {configs.map((cfg, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden h-[1.12em] leading-none align-baseline"
        >
          <span
            data-rolling-track
            data-target-index={cfg.targetIndex}
            data-total-items={cfg.totalItems}
            data-roll-duration={cfg.duration}
            data-roll-delay={cfg.delay}
            className="flex flex-col transform-gpu will-change-transform"
            style={{ transform: "translateY(0%)" }}
          >
            {cfg.sequence.map((n, idx) => {
              const isBlank = idx === 0;
              return (
                <span
                  key={idx}
                  aria-hidden="true"
                  className={
                    isBlank
                      ? "block h-[1.12em] leading-[1.12] text-center opacity-0 select-none pointer-events-none"
                      : "block h-[1.12em] leading-[1.12] text-center"
                  }
                >
                  {isBlank ? (cfg.digit === 0 ? "0" : cfg.digit) : n}
                </span>
              );
            })}
          </span>
        </span>
      ))}
      <span
        data-rolling-suffix
        aria-hidden="true"
        className="inline-block align-baseline"
      >
        {suffix}
      </span>
    </span>
  );
}

export default function AboutStorySection() {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Direct jump to targets if reduced motion is requested
      section.querySelectorAll("[data-rolling-track]").forEach((track) => {
        const targetIndex = parseFloat(track.dataset.targetIndex);
        const totalItems = parseFloat(track.dataset.totalItems);
        track.style.transform = `translateY(-${(targetIndex / totalItems) * 100}%)`;
      });
      section.querySelectorAll("[data-rolling-suffix]").forEach((s) => {
        s.style.opacity = "1";
        s.style.visibility = "visible";
      });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const labelLetters = section.querySelectorAll("[data-story-label-letter]");
    const titleLines = Array.from(section.querySelectorAll("[data-story-title-line]")).filter(
      (el) => el.offsetParent !== null
    );
    const description = section.querySelector("[data-story-description]");
    const gridItems = Array.from(section.querySelectorAll("[data-story-grid-item]")).filter(
      (el) => el.offsetParent !== null
    );
    const statCards = Array.from(section.querySelectorAll("[data-story-stat-card]")).filter(
      (el) => el.offsetParent !== null
    );

    const context = gsap.context(() => {
      // Initial GSAP sets directly matching home about-us
      gsap.set(labelLetters, { autoAlpha: 0, y: 12, scale: 0.8 });
      titleLines.forEach((line) => {
        gsap.set(
          line.querySelectorAll("[data-story-word], [data-story-italic-letter]"),
          { autoAlpha: 0, y: 24 }
        );
      });
      if (description) {
        gsap.set(description, { autoAlpha: 0, y: 28 });
      }
      gridItems.forEach((item) => {
        gsap.set(item, { autoAlpha: 0, y: 32 });
      });
      const suffixes = section.querySelectorAll("[data-rolling-suffix]");
      gsap.set(suffixes, { autoAlpha: 0 });

      // 1. Tag letters stagger animation from center
      if (labelLetters.length) {
        ScrollTrigger.create({
          trigger: labelLetters[0]?.parentElement,
          start: "top 90%",
          once: true,
          onEnter: () =>
            gsap.to(labelLetters, {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 1,
              stagger: { each: 0.07, from: "center" },
              ease: "power3.out",
            }),
        });
      }

      // 2. Title lines animation (each line triggers as it scrolls into view)
      titleLines.forEach((line) => {
        const words = line.querySelectorAll("[data-story-word]");
        const italicLetters = line.querySelectorAll("[data-story-italic-letter]");

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
                stagger: 0.09,
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

      // 4. Grid items entrance animation (slides card/image container into view)
      gridItems.forEach((item) => {
        ScrollTrigger.create({
          trigger: item,
          start: "top 90%",
          once: true,
          onEnter: () => {
            gsap.to(item, {
              autoAlpha: 1,
              y: 0,
              duration: 1,
              ease: "power3.out",
            });
          },
        });
      });

      // 5. Stat Card Rollout - triggers ONLY when that specific box is FULLY inside the screen
      statCards.forEach((card) => {
        const tracks = card.querySelectorAll("[data-rolling-track]");
        const suffix = card.querySelector("[data-rolling-suffix]");

        ScrollTrigger.create({
          trigger: card,
          start: "bottom 92%", // Fires only when the entire box is 100% inside the viewport
          once: true,
          onEnter: () => {
            if (suffix) {
              gsap.to(suffix, {
                autoAlpha: 1,
                duration: 0.8,
                ease: "power2.out",
              });
            }

            tracks.forEach((track) => {
              const targetIndex = parseFloat(track.dataset.targetIndex);
              const totalItems = parseFloat(track.dataset.totalItems);
              const duration = parseFloat(track.dataset.rollDuration) || 1.4;
              const delay = parseFloat(track.dataset.rollDelay) || 0.15;

              const targetYPercent = -(targetIndex / totalItems) * 100;

              gsap.fromTo(
                track,
                { yPercent: 0 },
                {
                  yPercent: targetYPercent,
                  duration: duration,
                  delay: delay,
                  ease: "power2.out",
                }
              );
            });
          },
        });
      });
    }, section);

    ScrollTrigger.refresh();

    return () => context.revert();
  }, []);

  const label = "ABOUT US";

  return (
    <section
      ref={sectionRef}
      id="about-us"
      aria-labelledby="about-us-title"
      className="relative w-full bg-white text-[#181513] pt-20 pb-24 sm:pt-28 sm:pb-32 lg:pt-36 lg:pb-40 overflow-hidden"
    >
      <div className="mx-auto max-w-340 px-4 sm:px-8 lg:px-12">
        {/* Category Tag */}
        <div className="flex justify-center mb-5 sm:mb-6">
          <p className="text-[11px] sm:text-xs font-semibold tracking-[0.25em] text-[#181513] uppercase">
            {Array.from(label).map((letter, index) => (
              <span
                key={`${letter}-${index}`}
                data-story-label-letter
                className="inline-block"
              >
                {letter === " " ? "\u00a0" : letter}
              </span>
            ))}
          </p>
        </div>

        {/* Main Heading */}
        <h2
          id="about-us-title"
          className="mx-auto max-w-260 text-center text-[clamp(2.1rem,4.4vw,3.65rem)] font-medium leading-[1.08] tracking-[-0.035em] text-[#181513]"
        >
          {/* Desktop Heading (exact 3 lines matching image-8) */}
          <div className="hidden sm:block">
            <span data-story-title-line className="block">
              <StraightWords text="We build, restore and manage" />{" "}
              <ItalicLetters text="properties" className="ml-[0.12em]" />
            </span>
            <span data-story-title-line className="block">
              <StraightWords text="that" />{" "}
              <ItalicLetters text="mirror" className="ml-[0.12em] mr-[0.32em]" />{" "}
              <StraightWords text="the diversity, history and" />
            </span>
            <span data-story-title-line className="block">
              <StraightWords text="powerful energy of" />{" "}
              <ItalicLetters text="New York City." className="ml-[0.12em]" />
            </span>
          </div>

          {/* Mobile Heading (matching image-10) */}
          <div className="block sm:hidden text-[23px] sm:text-[26px] leading-[1.12] tracking-[-0.035em] max-w-[320px] mx-auto">
            <span data-story-title-line className="block">
              <StraightWords text="We build, restore and" />
            </span>
            <span data-story-title-line className="block">
              <StraightWords text="manage" />{" "}
              <ItalicLetters text="properties" className="ml-[0.12em]" />
            </span>
            <span data-story-title-line className="block">
              <StraightWords text="that" />{" "}
              <ItalicLetters text="mirror" className="ml-[0.12em] mr-[0.32em]" />{" "}
              <StraightWords text="the diversity," />
            </span>
            <span data-story-title-line className="block">
              <StraightWords text="history and" />
            </span>
            <span data-story-title-line className="block">
              <StraightWords text="powerful energy of" />{" "}
              <ItalicLetters text="New York City." className="ml-[0.12em]" />
            </span>
          </div>
        </h2>

        {/* Subtitle Paragraph */}
        <p
          data-story-description
          className="mx-auto mt-6 sm:mt-7 max-w-152.5 px-2 text-center text-sm sm:text-[18px] leading-[1.62] font-normal text-[#727272]"
        >
          From walk-ups to penthouses, downtown offices to commercial towers,
          affordable housing to luxury residences, our portfolio represents every
          layer of urban life.
        </p>

        {/* ========================================================= */}
        {/* DESKTOP MASONRY GRID (Screen width >= 1024px)             */}
        {/* Matches full_reference_desktop.png exactly                */}
        {/* ========================================================= */}
        <div className="hidden lg:flex justify-center mt-16 xl:mt-20">
          <div className="w-316.5 flex gap-6 items-start">
            {/* COLUMN 1: width 406px */}
            <div className="w-101.5 shrink-0 flex flex-col">
              {/* Apartments Card (230x230, right-aligned) */}
              <div
                data-story-grid-item
                data-story-stat-card
                className="ml-auto w-57.5 h-57.5 bg-[#f5f5f5] p-6 pt-7 pb-8 flex flex-col justify-between transition-transform duration-300 ease-out hover:-translate-y-1 hover:shadow-sm"
              >
                <span className="text-sm font-normal text-[#181513]">
                  Apartments
                </span>
                <RollingNumber
                  value="13K+"
                  className="text-[3.75rem] font-light leading-none tracking-[-0.04em] text-[#181513]"
                />
              </div>

              {/* Modern Building Image (406x300) */}
              <div
                data-story-grid-item
                className="group mt-6 w-101.5 h-75 overflow-hidden bg-[#e5e5e5]"
              >
                <Image
                  src="/assets/about-modern-bldg.jpg"
                  alt="Modern commercial facade in New York City"
                  width={406}
                  height={300}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>

              {/* Employees Card (230x230, right-aligned) */}
              <div
                data-story-grid-item
                data-story-stat-card
                className="ml-auto mt-6 w-57.5 h-57.5 bg-[#f5f5f5] p-6 pt-7 pb-8 flex flex-col justify-between transition-transform duration-300 ease-out hover:-translate-y-1 hover:shadow-sm"
              >
                <span className="text-sm font-normal text-[#181513]">
                  Employees
                </span>
                <RollingNumber
                  value="500+"
                  className="text-[3.75rem] font-light leading-none tracking-[-0.04em] text-[#181513]"
                />
              </div>
            </div>

            {/* COLUMN 2 & 3 WRAPPER: width 836px (406 + 24 + 406) */}
            <div className="w-209 shrink-0 flex flex-col">
              {/* Top Row: Tall Building (left) + Red Brick & 40+ (right) */}
              <div className="flex gap-6 items-start">
                {/* Column 2: Tall Art Deco Highrise (406x578, -mt-6) */}
                <div
                  data-story-grid-item
                  className="group w-101.5 shrink-0 -mt-6 h-144.5 overflow-hidden bg-[#e5e5e5]"
                >
                  <Image
                    src="/assets/about-tall-bldg.jpg"
                    alt="Tall historic terracotta building reaching into the New York sky"
                    width={406}
                    height={578}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>

                {/* Column 3: Red Brick Building (406x300) + 40+ Card (230x230, left-aligned) */}
                <div className="w-101.5 shrink-0 flex flex-col">
                  {/* Red Brick Building Image */}
                  <div
                    data-story-grid-item
                    className="group w-101.5 h-75 overflow-hidden bg-[#e5e5e5]"
                  >
                    <Image
                      src="/assets/about-red-brick.jpg"
                      alt="Classic New York City brick apartment building with fire escapes"
                      width={406}
                      height={300}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>

                  {/* Years in Business Card */}
                  <div
                    data-story-grid-item
                    data-story-stat-card
                    className="mr-auto mt-6 w-57.5 h-57.5 bg-[#f5f5f5] p-6 pt-7 pb-8 flex flex-col justify-between transition-transform duration-300 ease-out hover:-translate-y-1 hover:shadow-sm"
                  >
                    <span className="text-sm font-normal text-[#181513]">
                      Years in business
                    </span>
                    <RollingNumber
                      value="40+"
                      className="text-[3.75rem] font-light leading-none tracking-[-0.04em] text-[#181513]"
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Row: Cafe Dining Image (width 660px, height 289px) */}
              {/* Aligns with Column 2 left edge, and ends at right edge of 40+ card */}
              <div
                data-story-grid-item
                className="group mt-6 w-165 h-72.25 overflow-hidden bg-[#e5e5e5]"
              >
                <Image
                  src="/assets/about-cafe-dining.jpg"
                  alt="Outdoor cafe street life in New York with yellow taxi and outdoor dining"
                  width={660}
                  height={289}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* MOBILE & TABLET RESPONSIVE GRID (Screen width < 1024px)   */}
        {/* Matches image-10.png exactly                              */}
        {/* ========================================================= */}
        <div className="lg:hidden mt-12 sm:mt-16 max-w-xl mx-auto">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 items-end">
            {/* Row 1: Apartments Card (Left) + Modern Building (Right) */}
            <div
              data-story-grid-item
              data-story-stat-card
              className="aspect-square bg-[#f5f5f5] p-4 sm:p-5 flex flex-col justify-between"
            >
              <span className="text-xs sm:text-sm font-normal text-[#181513]">
                Apartments
              </span>
              <RollingNumber
                value="13K+"
                className="text-6xl sm:text-7xl font-light leading-none tracking-[-0.04em] text-[#181513]"
              />
            </div>

            <div
              data-story-grid-item
              className="group aspect-square overflow-hidden bg-[#e5e5e5]"
            >
              <Image
                src="/assets/about-modern-bldg.jpg"
                alt="Modern commercial facade in New York City"
                width={300}
                height={300}
                className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
            </div>

            {/* Row 2: Wide Cafe Dining Scene (Full Width - Col Span 2) */}
            <div
              data-story-grid-item
              className="group col-span-2 aspect-[2.1/1] overflow-hidden bg-[#e5e5e5]"
            >
              <Image
                src="/assets/about-cafe-dining.jpg"
                alt="Outdoor cafe street life in New York with yellow taxi and outdoor dining"
                width={600}
                height={289}
                className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
            </div>

            {/* Row 3: Red Brick Building (Left) + Years in Business Card (Right) */}
            <div
              data-story-grid-item
              className="group aspect-square overflow-hidden bg-[#e5e5e5]"
            >
              <Image
                src="/assets/about-red-brick.jpg"
                alt="Classic New York City brick apartment building with fire escapes"
                width={300}
                height={300}
                className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
            </div>

            <div
              data-story-grid-item
              data-story-stat-card
              className="aspect-square bg-[#f5f5f5] p-4 sm:p-5 flex flex-col justify-between"
            >
              <span className="text-xs sm:text-sm font-normal text-[#181513]">
                Years in business
              </span>
              <RollingNumber
                value="40+"
                className="text-6xl sm:text-7xl font-light leading-none tracking-[-0.04em] text-[#181513]"
              />
            </div>

            {/* Row 4: Employees Card (Left) + Tall Highrise Building (Right) */}
            <div
              data-story-grid-item
              data-story-stat-card
              className="aspect-square bg-[#f5f5f5] p-4 sm:p-5 flex flex-col justify-between"
            >
              <span className="text-xs sm:text-sm font-normal text-[#181513]">
                Employees
              </span>
              <RollingNumber
                value="500+"
                className="text-6xl sm:text-7xl font-light leading-none tracking-[-0.04em] text-[#181513]"
              />
            </div>

            <div
              data-story-grid-item
              className="group aspect-square overflow-hidden bg-[#e5e5e5]"
            >
              <Image
                src="/assets/about-tall-bldg.jpg"
                alt="Tall historic terracotta building reaching into the New York sky"
                width={300}
                height={300}
                className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
