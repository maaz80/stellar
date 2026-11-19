"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import RollingTextLink from "../rolling-text-link/rolling-text-link";

function StraightWords({ text }) {
  const words = text.split(" ");

  return words.map((word, index) => (
    <span key={`${word}-${index}`}>
      <span data-about-word className="inline-block">
        {word}
      </span>
      {index < words.length - 1 ? " " : ""}
    </span>
  ));
}

function ItalicLetters({ text }) {
  return (
    <span
      aria-label={text}
      className="font-(family-name:--font-playfair) font-normal italic"
    >
      {text.split("").map((letter, index) => (
        <span
          key={`${letter}-${index}`}
          aria-hidden="true"
          data-about-italic-letter
          className="inline-block"
        >
          {letter === " " ? "\u00a0" : letter}
        </span>
      ))}
    </span>
  );
}

export default function AboutUsSection() {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    const labelLetters = section.querySelectorAll("[data-about-label-letter]");
    const titleLines = section.querySelectorAll("[data-about-title-line]");
    const description = section.querySelector("[data-about-description]");
    const button = section.querySelector("[data-about-button]");

    const context = gsap.context(() => {
      gsap.set(labelLetters, { autoAlpha: 0, y: 12, scale: 0.8 });
      titleLines.forEach((line) => {
        gsap.set(
          line.querySelectorAll("[data-about-word], [data-about-italic-letter]"),
          { autoAlpha: 0, y: 24 },
        );
      });
      gsap.set([description, button], { autoAlpha: 0, y: 28 });

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

      titleLines.forEach((line) => {
        const words = line.querySelectorAll("[data-about-word]");
        const italicLetters = line.querySelectorAll(
          "[data-about-italic-letter]",
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
                duration: 0.8,
                stagger: 0.045,
                ease: "power3.out",
              });
            }
          },
        });
      });

      [description, button].forEach((element) => {
        ScrollTrigger.create({
          trigger: element,
          start: "top 90%",
          once: true,
          onEnter: () =>
            gsap.to(element, {
              autoAlpha: 1,
              y: 0,
              duration: 1.1,
              ease: "power3.out",
            }),
        });
      });
    }, section);

    return () => context.revert();
  }, []);

  const label = "ABOUT US";

  return (
    <section
      ref={sectionRef}
      id="about-us"
      aria-labelledby="about-us-title"
      className="flex min-h-[40vh] md:min-h-[min(100svh,48rem)] flex-col items-center bg-white px-5 pt-18 pb-10 text-center text-[#171717] sm:px-8 sm:pt-38"
    >
      <p className="text-sm font-medium">
        {Array.from(label).map((letter, index) => (
          <span
            key={`${letter}-${index}`}
            data-about-label-letter
            className="inline-block"
          >
            {letter === " " ? "\u00a0" : letter}
          </span>
        ))}
      </p>

      <h2
        id="about-us-title"
        className="mt-8 max-w-328 text-[clamp(2rem,4vw,3.7rem)] leading-[1.06] font-medium tracking-[-0.055em]"
      >
        <span data-about-title-line className="block">
          <span>
            <StraightWords text="We don’t just invest in properties – we" />
          </span>
        </span>
        <span data-about-title-line className="block">
          <span>
            <StraightWords text="invest in people, communities, and the" />
          </span>
        </span>
        <span data-about-title-line className="block">
          <span>
            <StraightWords text="future of" />{" "}
            <ItalicLetters text="New York City" />
          </span>
        </span>
      </h2>

      <p
        data-about-description
        className="mt-8 max-w-136 text-base leading-[1.6] font-medium text-[#777777] sm:mt-9 sm:text-lg"
      >
        We take a hands-on approach to every asset – unlocking intrinsic value
        to ensure our properties thrive while enhancing the communities we
        serve.
      </p>

      <RollingTextLink
        href="#company"
        label="Learn more"
        data-about-button
        className="mt-11 inline-flex h-12 items-center justify-center rounded-bl-xl rounded-tr-xl bg-[#081a4d] px-6 text-sm font-medium text-white sm:mt-12"
      />
    </section>
  );
}
