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
      <span data-founder-word className="inline-block">
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
          data-founder-italic-letter
          className="inline-block"
        >
          {letter === " " ? "\u00a0" : letter}
        </span>
      ))}
    </span>
  );
}

export default function AboutFounderTributeSection() {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const badge = section.querySelector("[data-founder-badge]");
    const titleLines = Array.from(
      section.querySelectorAll("[data-founder-title-line]")
    ).filter((el) => el.offsetParent !== null);
    const description = section.querySelector("[data-founder-description]");
    const button = section.querySelector("[data-founder-button]");
    const image = section.querySelector("[data-founder-image]");

    const context = gsap.context(() => {
      // Initial GSAP states
      if (badge) {
        gsap.set(badge, { autoAlpha: 0, scale: 0.8, y: 16 });
      }
      titleLines.forEach((line) => {
        gsap.set(
          line.querySelectorAll("[data-founder-word], [data-founder-italic-letter]"),
          { autoAlpha: 0, y: 24 }
        );
      });
      if (description) {
        gsap.set(description, { autoAlpha: 0, y: 24 });
      }
      if (button) {
        gsap.set(button, { autoAlpha: 0, y: 20 });
      }

      // Badge animation
      if (badge) {
        ScrollTrigger.create({
          trigger: badge,
          start: "top 90%",
          once: true,
          onEnter: () =>
            gsap.to(badge, {
              autoAlpha: 1,
              scale: 1,
              y: 0,
              duration: 0.9,
              ease: "power3.out",
            }),
        });
      }

      // Title lines stagger animation
      titleLines.forEach((line) => {
        const words = line.querySelectorAll("[data-founder-word]");
        const italicLetters = line.querySelectorAll("[data-founder-italic-letter]");

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

      // Description animation
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

      // Button animation
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

      // Founder image parallax scrub
      if (image) {
        gsap.fromTo(
          image,
          { scale: 1 },
          {
            scale: 1.08,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          }
        );
      }
    }, section);

    ScrollTrigger.refresh();

    return () => context.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="tribute-founder"
      aria-labelledby="founder-title"
      className="relative w-full bg-white text-[#181513] overflow-hidden py-20 md:py-60"
    >
      <div className="flex flex-col-reverse lg:flex-row items-stretch w-full min-h-145 lg:min-h-170 xl:min-h-181.5">
        {/* ========================================================= */}
        {/* LEFT COLUMN: Content (Centered)                           */}
        {/* ========================================================= */}
        <div className="w-full lg:flex-1 flex flex-col items-center justify-center text-center px-6 sm:px-10 lg:px-12 xl:px-16 py-16 sm:py-20 lg:py-24">
          {/* Serif 'S' Badge */}
          <div
            data-founder-badge
            className="w-9 h-9 border border-[#e0e0e0] rounded-sm flex items-center justify-center mb-7 sm:mb-8 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] text-[#181513]"
          >
            <svg
              viewBox="0 0 125 125"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-4.5 h-4.5 text-[#181513]"
              aria-hidden="true"
            >
              <path
                d="M61.3594 4C67.1766 4 72.6229 4.4946 77.8213 5.42285C82.9576 6.3511 88.4034 7.89799 94.0967 10.002L94.9014 39.335H93.4775C90.4452 32.2186 86.794 26.3397 82.5859 21.8223C78.316 17.243 73.7368 13.9012 68.7861 11.9209C63.8353 9.81685 58.4507 8.76465 52.6953 8.76465C46.5069 8.76469 41.6797 10.0646 38.3379 12.7256C35.0584 15.2627 33.4493 18.7898 33.4492 23.4307C33.4493 27.6386 34.7492 31.29 37.4102 34.3223C40.133 37.3545 43.5366 39.9536 47.4971 42.0576C51.5196 44.1616 56.9035 46.6378 63.5869 49.4844C72.0033 52.9499 78.7496 56.1055 83.8242 58.9521C88.8987 61.7988 93.2304 65.5742 96.7578 70.2773C100.471 74.9804 102.266 80.8593 102.266 87.79C102.266 95.0922 100.471 101.653 96.9434 107.47C93.3542 113.163 90.198 117.433 83.3291 119.908C80.0492 121.084 76.0881 121.641 74.0459 121.641C74.0459 121.641 76.2741 121.331 79.8633 119.228C82.091 117.99 85.0618 115.205 86.6709 112.668C88.3417 110.131 89.2079 107.098 89.208 103.509C89.208 98.2487 87.7842 93.8549 84.9375 90.2656C82.0908 86.6146 78.6257 83.5817 74.4795 81.292C70.4569 78.8785 64.9485 76.2175 57.8936 73.2471C49.9726 69.9055 43.7223 66.8116 39.0811 64.0889C34.5636 61.3661 30.6646 57.7146 27.3848 53.1973C24.2287 48.6798 22.6192 43.1097 22.6191 36.4883C22.6192 30.3001 24.167 24.7308 27.1992 19.7803C30.3553 14.8296 34.8108 10.9924 40.6279 8.26953C46.507 5.42292 53.4381 4.00002 61.3594 4ZM36.4814 91.3799C44.4027 91.3799 50.9003 97.8774 50.9004 105.86C50.9002 113.843 44.4029 120.341 36.4199 120.341C28.4987 120.279 22.0002 113.843 22 105.86C22 97.8774 28.4983 91.3799 36.4814 91.3799Z"
                fill="currentColor"
              />
            </svg>
          </div>

          {/* Main Heading */}
          <h2
            id="founder-title"
            className="text-4xl sm:text-5xl lg:text-[2.85rem] xl:text-[4.05rem] font-medium leading-[1.1] tracking-[-0.035em] text-[#181513]"
          >
            <span data-founder-title-line className="block">
              <StraightWords text="Tribute to" />
            </span>
            <span data-founder-title-line className="block">
              <StraightWords text="our" />{" "}
              <ItalicLetters text="founder" className="ml-[0.14em]" />
            </span>
          </h2>

          {/* Description Paragraph */}
          <p
            data-founder-description
            className="mt-5 sm:mt-6 max-w-100 text-center text-sm sm:text-[18px] leading-[1.68] font-medium text-[#5f5e5e]"
          >
            Laurence Gluck, the visionary behind Stellar, dedicated his career to
            shaping the landscape of New York City real estate.
          </p>

          {/* Discover button */}
          <div className="mt-7 sm:mt-8">
            <RollingTextLink
              href="#founder"
              label="About our founder"
              data-founder-button
              className="inline-flex h-11 sm:h-12 items-center justify-center rounded-bl-xl rounded-tr-xl bg-[#06184f] px-7 text-sm font-medium text-white transition-[border-radius,background-color] duration-300 ease-out hover:rounded-bl-3xl hover:rounded-tr-3xl hover:bg-[#0b2373]"
            />
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: Founder Photo (Right-aligned, 30px gap)     */}
        {/* ========================================================= */}
        <div className="w-full lg:w-140 xl:w-153 shrink-0 relative min-h-95 sm:min-h-150 lg:min-h-full overflow-hidden bg-white mr-0 lg:mr-7.5">
          <Image
            src="/assets/founder.png"
            alt="Laurence Gluck, the visionary behind Stellar"
            fill
            priority={false}
            sizes="(max-width: 1024px) 100vw, 642px"
            data-founder-image
            className="object-contain object-top sm:object-center will-change-transform"
          />
        </div>
      </div>
    </section>
  );
}
