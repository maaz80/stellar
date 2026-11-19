"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import RollingTextLink from "../rolling-text-link/rolling-text-link";

function StraightWords({ text }) {
  const words = text.split(" ");

  return words.map((word, index) => (
    <span key={`${word}-${index}`}>
      <span data-vision-word className="inline-block">
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
      className={`font-serif font-medium italic inline-block ${className}`}
    >
      {text.split("").map((letter, index) => (
        <span
          key={`${letter}-${index}`}
          aria-hidden="true"
          data-vision-italic-letter
          className="inline-block"
        >
          {letter === " " ? "\u00a0" : letter}
        </span>
      ))}
    </span>
  );
}

export default function AboutVisionSection() {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const titleLines = Array.from(
      section.querySelectorAll("[data-vision-title-line]")
    ).filter((el) => el.offsetParent !== null);
    const rows = section.querySelectorAll("[data-vision-row]");
    const divider = section.querySelector("[data-vision-divider]");
    const button = section.querySelector("[data-vision-button]");

    const context = gsap.context(() => {
      // Initial GSAP states matching global setup
      titleLines.forEach((line) => {
        gsap.set(
          line.querySelectorAll("[data-vision-word], [data-vision-italic-letter]"),
          { autoAlpha: 0, y: 24 }
        );
      });
      rows.forEach((row) => {
        gsap.set(row, { autoAlpha: 0, y: 30 });
      });
      if (divider) {
        gsap.set(divider, { scaleX: 0, transformOrigin: "left" });
      }
      if (button) {
        gsap.set(button, { autoAlpha: 0, y: 24 });
      }

      // Title lines stagger animation (matching about-story and home about-us)
      titleLines.forEach((line) => {
        const words = line.querySelectorAll("[data-vision-word]");
        const italicLetters = line.querySelectorAll("[data-vision-italic-letter]");

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

      // Vision and Approach rows animation
      rows.forEach((row) => {
        ScrollTrigger.create({
          trigger: row,
          start: "top 88%",
          once: true,
          onEnter: () =>
            gsap.to(row, {
              autoAlpha: 1,
              y: 0,
              duration: 1.1,
              ease: "power3.out",
            }),
        });
      });

      // Divider line expansion animation
      if (divider) {
        ScrollTrigger.create({
          trigger: divider,
          start: "top 90%",
          once: true,
          onEnter: () =>
            gsap.to(divider, {
              scaleX: 1,
              duration: 1.2,
              ease: "power3.out",
            }),
        });
      }

      // Discover more button entrance
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
    }, section);

    ScrollTrigger.refresh();

    return () => context.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="vision-approach"
      aria-labelledby="vision-title"
      className="relative w-full bg-white text-[#181513] py-20 sm:py-28 lg:py-36 xl:py-44 overflow-hidden border-t border-neutral-100"
    >
      <div className="mx-auto max-w-380 px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-12 sm:gap-14 lg:gap-16 xl:gap-24">
          
          {/* ========================================================= */}
          {/* LEFT COLUMN: Main Heading                                 */}
          {/* ========================================================= */}
          <div className="w-full lg:w-105 xl:w-115 shrink-0">
            <h2
              id="vision-title"
              className="text-4xl sm:text-5xl lg:text-[3.25rem] xl:text-[3.65rem] font-medium leading-[1.08] tracking-[-0.035em] text-[#181513]"
            >
              <span data-vision-title-line className="block">
                <StraightWords text="Building for" />
              </span>
              <span data-vision-title-line className="block">
                <StraightWords text="today, investing" />
              </span>
              <span data-vision-title-line className="block">
                <StraightWords text="in" />{" "}
                <ItalicLetters text="tomorrow" className="ml-[0.14em]" />
              </span>
            </h2>
          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: Vision, Divider, Approach & Button           */}
          {/* ========================================================= */}
          <div className="w-full lg:max-w-190 xl:max-w-205 flex-1">
            
            {/* ROW 1: Our Vision */}
            <div
              data-vision-row
              className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-10 lg:gap-14 xl:gap-20"
            >
              <h3 className="w-full sm:w-37.5 lg:w-42.5 shrink-0 text-xl sm:text-[24px] font-medium leading-[1.3] text-[#181513]">
                Our vision
              </h3>
              <p className="flex-1 max-w-125 text-[14.5px] sm:text-[18px] leading-[1.68] font-medium text-[#727272]">
                For over 40 years, we have created spaces that serve the people
                and communities of NYC. Our properties are more than just
                addresses — they are homes and workplaces that contribute to the
                city’s vitality.
              </p>
            </div>

            {/* HORIZONTAL DIVIDER LINE */}
            <div
              data-vision-divider
              className="my-10 sm:my-12 lg:my-14 border-t border-[#e5e5e5]"
            />

            {/* ROW 2: Our Approach */}
            <div
              data-vision-row
              className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-10 lg:gap-14 xl:gap-20"
            >
              <h3 className="w-full sm:w-37.5 lg:w-42.5 shrink-0 text-xl sm:text-[24px] font-medium leading-[1.3] text-[#181513]">
                Our approach
              </h3>
              <div className="flex-1 max-w-125 flex flex-col items-start">
                <p className="text-[14.5px] sm:text-[18px] leading-[1.68] font-medium text-[#727272]">
                  We integrate thoughtful amenities and civic-minded planning to
                  ensuring lasting impact. From acquisition to management, we
                  reinvest in our portfolio to keep it vibrant, sustainable, and
                  built to endure for generations.
                </p>
                <div className="mt-8 sm:mt-10">
                  <RollingTextLink
                    href="#approach"
                    label="Discover more"
                    data-vision-button
                    className="inline-flex h-11 sm:h-12 items-center justify-center rounded-bl-xl rounded-tr-xl bg-[#06184f] px-7 text-sm font-medium text-white transition-[border-radius,background-color] duration-300 ease-out hover:rounded-bl-3xl hover:rounded-tr-3xl hover:bg-[#0b2373]"
                  />
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
