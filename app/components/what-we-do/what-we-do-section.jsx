"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const label = "WHAT WE DO";
const lineImages = {
  historic: {
    src: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=320",
    alt: "Historic brick apartment building",
  },
  spaces: {
    src: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=320",
    alt: "Warm, welcoming living space",
  },
  thrive: {
    src: "https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=320",
    alt: "New Yorker enjoying the city",
  },
};

function ItalicWord({ children }) {
  return (
    <span
      aria-label={children}
      className="font-(family-name:--font-playfair) font-medium italic"
    >
      {Array.from(children).map((letter, index) => (
        <span
          key={`${letter}-${index}`}
          aria-hidden="true"
          data-what-italic
          className="inline-block"
        >
          {letter}
        </span>
      ))}
    </span>
  );
}

function InlineImage({ image }) {
  return (
    <span
      role="img"
      aria-label={image.alt}
      data-what-solid
      className="mx-[0.12em] inline-block h-[0.68em] w-[1.05em] shrink-0 bg-cover bg-center align-[0.02em] sm:h-[0.72em] sm:w-[1.15em]"
      style={{ backgroundImage: `url("${image.src}")` }}
    />
  );
}

export default function WhatWeDoSection() {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    const labelLetters = Array.from(
      section.querySelectorAll("[data-what-label-letter]"),
    );
    const lines = Array.from(section.querySelectorAll("[data-what-line]"));
    const context = gsap.context(() => {
      gsap.set(labelLetters, {
        autoAlpha: 0,
        scale: 0.65,
        y: 12,
        transformOrigin: "50% 50%",
      });

      ScrollTrigger.create({
        trigger: section,
        start: "top 75%",
        once: true,
        onEnter: () => {
          gsap.to(labelLetters, {
            autoAlpha: 1,
            scale: 1,
            y: 0,
            duration: 1.4,
            stagger: { each: 0.12, from: "center" },
            ease: "power3.out",
          });
        },
      });

      lines.forEach((line) => {
        const solidItems = Array.from(
          line.querySelectorAll("[data-what-solid]"),
        );
        const italicLetters = Array.from(
          line.querySelectorAll("[data-what-italic]"),
        );

        gsap.set([...solidItems, ...italicLetters], {
          autoAlpha: 0,
          y: 28,
        });

        ScrollTrigger.create({
          trigger: line,
          start: "top 82%",
          once: true,
          onEnter: () => {
            gsap.to(solidItems, {
              autoAlpha: 1,
              y: 0,
              duration: 1.64,
              ease: "power3.out",
            });
            gsap.to(italicLetters, {
              autoAlpha: 1,
              y: 0,
              duration: 1.4,
              stagger: 0.1,
              ease: "power3.out",
            });
          },
        });
      });
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="what-we-do"
      aria-labelledby="what-we-do-title"
      className="relative min-h-screen"
    >
      <div className="flex h-screen items-center overflow-hidden bg-white px-4 text-[#191716] sm:px-8 lg:px-12">
        <div className="mx-auto w-full max-w-[20rem] translate-y-6 md:max-w-220 md:translate-y-8">
          <p
            id="what-we-do-title"
            className="mb-8 text-center text-xs font-medium tracking-wide sm:mb-10 sm:text-sm"
          >
            {Array.from(label).map((letter, index) => (
              <span
                key={`${letter}-${index}`}
                data-what-label-letter
                className="inline-block"
              >
                {letter === " " ? "\u00a0" : letter}
              </span>
            ))}
          </p>

          <h2 className="text-center text-[clamp(2.0rem,5.25vw,5rem)] leading-[1.14] font-medium tracking-[-0.065em] [word-spacing:0.08em] sm:text-[clamp(2.5rem,5.25vw,5rem)]">
            <span data-what-line className="block">
              <span data-what-solid className="inline-block">From</span>{" "}
              <ItalicWord>historic</ItalicWord>
              {" "}
              <span data-what-solid className="inline-block">blocks</span>
              <InlineImage image={lineImages.historic} />
            </span>
            <span data-what-line className="block">
              <span data-what-solid className="inline-block">to</span>{" "}
              <ItalicWord>new</ItalicWord>
              {" "}
              <span data-what-solid className="inline-block">
                developments, we
              </span>
            </span>
            <span data-what-line className="block">
              <span data-what-solid className="inline-block">create the</span>{" "}
              <ItalicWord>spaces</ItalicWord>
              <span className="ml-[0.3em] inline-block">
                <InlineImage image={lineImages.spaces} />
              </span>
            </span>
            <span data-what-line className="block ">
              <span data-what-solid className="inline-block">
                where New Yorkers live,
              </span>
            </span>
            <span data-what-line className="block">
              <span data-what-solid className="inline-block">work</span>
              <InlineImage image={lineImages.thrive} />
              <span data-what-solid className="inline-block">
                &amp; thrive
              </span>
            </span>
          </h2>
        </div>
      </div>
    </section>
  );
}
