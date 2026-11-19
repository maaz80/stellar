"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FiArrowUpRight } from "react-icons/fi";
import RollingTextLink from "../rolling-text-link/rolling-text-link";

function AnimatedHeadingWord({ text, className = "" }) {
  return (
    <span aria-label={text} className={`inline-block ${className}`}>
      {Array.from(text).map((letter, index) => (
        <span
          key={`${letter}-${index}`}
          data-news-heading-letter
          className="inline-block"
        >
          {letter === " " ? "\u00a0" : letter}
        </span>
      ))}
    </span>
  );
}

function AnimatedTitleWords({ text, className = "" }) {
  const words = text.split(" ");

  return (
    <span className={className}>
      {words.map((word, index) => (
        <span key={`${word}-${index}`} className="inline-block">
          <span data-news-title-word className="inline-block">
            {word}
          </span>
          {index < words.length - 1 ? "\u00a0" : ""}
        </span>
      ))}
    </span>
  );
}

const stories = [
  {
    source: "COMMERCIAL OBSERVER",
    title: "Stellar Management Names Matthew Lembo, Ryan Jackson as Co-CEOs",
    excerpt:
      "Lembo and Jackson will start in their new roles immediately and succeed former CEO Laurence \u201cLarry\u201d Gluck, who founded the firm in 1985 and had led the company for almost 40 years.",
    readTime: "2 min read",
    href: "#news",
    portraits: [
      {
        src: "/assets/matthew-lembo.jpg",
        alt: "Matthew Lembo",
      },
      {
        src: "/assets/ryan-jackson.jpg",
        alt: "Ryan Jackson",
      },
    ],
  },
  {
    source: "NEWS 12 BROOKLYN",
    title:
      "New agreement cements Park Slope building to be affordable for all tenants",
    excerpt:
      "The building on 341 10th St. in Park Slope will also undergo major renovations to improve quality of life for older residents.",
    readTime: "1 min read",
    href: "#news",
    image: {
      src: "/assets/news 2.png",
      alt: "News 12 Brooklyn affordable housing segment",
    },
  },
];

export default function LatestNewsSection() {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (
      !section ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    const headingLetters = section.querySelectorAll("[data-news-heading-letter]");
    const button = section.querySelector("[data-news-button]");
    const articles = section.querySelectorAll("[data-news-article]");

    const context = gsap.context(() => {
      // Heading letters animate up — trigger at 20% of viewport
      gsap.fromTo(
        headingLetters,
        { autoAlpha: 0, yPercent: 120, rotateX: 28 },
        {
          autoAlpha: 1,
          yPercent: 0,
          rotateX: 0,
          duration: 1.1,
          stagger: 0.04,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 20%",
            once: true,
          },
        },
      );

      gsap.fromTo(
        button,
        { autoAlpha: 0, y: 22 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: button,
            start: "top 94%",
            once: true,
          },
        },
      );

      articles.forEach((article) => {
        // Image comes in from left (off-screen left), trigger at 20%
        const image = article.querySelector("[data-news-portrait-wrap], [data-news-image]");
        const copy = article.querySelector("[data-news-copy]");
        const sourceLetters = article.querySelectorAll("[data-news-source-letter]");
        const titleWords = article.querySelectorAll("[data-news-title-word]");

        if (image) {
          gsap.fromTo(
            image,
            { autoAlpha: 0, x: -80, scale: 0.98 },
            {
              autoAlpha: 1,
              x: 0,
              scale: 1,
              duration: 1.8,
              ease: "power3.out",
              scrollTrigger: {
                trigger: article,
                start: "top 80%",
                once: true,
              },
            },
          );
        }

        if (sourceLetters.length) {
          gsap.fromTo(
            sourceLetters,
            { autoAlpha: 0, y: 16 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.04,
              ease: "power3.out",
              scrollTrigger: {
                trigger: article,
                start: "top 88%",
                once: true,
              },
            },
          );
        }

        if (titleWords.length) {
          gsap.fromTo(
            titleWords,
            { autoAlpha: 0, y: 26 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 1.2,
              stagger: 0.08,
              ease: "power3.out",
              scrollTrigger: {
                trigger: article,
                start: "top 82%",
                once: true,
              },
            },
          );
        }

        if (copy) {
          gsap.fromTo(
            copy,
            { autoAlpha: 0, y: 26 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 1.5,
              delay: 0.08,
              ease: "power3.out",
              scrollTrigger: {
                trigger: article,
                start: "top 82%",
                once: true,
              },
            },
          );
        }
      });
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="news"
      aria-labelledby="latest-news-title"
      className="bg-white px-5 py-16 text-[#191716] sm:px-8 sm:py-20 lg:px-[2.5vw] lg:pt-8 lg:pb-54"
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <h2
          id="latest-news-title"
          className="flex flex-wrap items-end gap-x-[0.18em] text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.98] font-medium tracking-[-0.065em]"
        >
          <span className="align-bottom">
            <AnimatedHeadingWord text="Latest" className="mr-[0.14em]" />
          </span>
          <span className="align-bottom font-(family-name:--font-playfair) font-normal italic">
            <AnimatedHeadingWord text="news" />
          </span>
        </h2>

        <RollingTextLink
          href="#news"
          label="View all news"
          data-news-button
          className="hidden sm:inline-flex h-12 w-fit items-center justify-center rounded-bl-xl rounded-tr-xl border border-black/20 px-6 text-sm font-medium text-[#191716]"
        />
      </div>

      <div className="mt-8 border-t border-black/10 pt-10 sm:mt-10 sm:pt-12 lg:mt-12 lg:pt-14 space-y-0 divide-y divide-black/10">
        {/* Story 1 — dual portrait */}
        {(() => {
          const story = stories[0];
          return (
            <a
              href={story.href}
              data-news-article
              className="group grid items-center gap-8 pb-14 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)] lg:gap-[7vw]"
            >
              <div
                data-news-portrait-wrap
                className="grid grid-cols-2 gap-1 overflow-hidden"
              >
                {story.portraits.map((portrait) => (
                  <div
                    key={portrait.alt}
                    className="relative aspect-4/5 overflow-hidden bg-[#ececec] sm:aspect-5/6"
                  >
                    <Image
                      src={portrait.src}
                      alt={portrait.alt}
                      fill
                      sizes="(min-width: 1024px) 22vw, 50vw"
                      className="object-cover object-[center_20%] transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-105"
                    />
                  </div>
                ))}
              </div>

              <div
                data-news-copy
                className="flex min-h-full flex-col justify-center lg:max-w-136 lg:py-6 lg:pl-4"
              >
                <p className="text-[14px] text-lg font-semibold tracking-[0.16em] text-[#616161] uppercase">
                  {Array.from(story.source).map((letter, index) => (
                    <span
                      key={`${letter}-${index}`}
                      data-news-source-letter
                      className="inline-block"
                    >
                      {letter === " " ? "\u00a0" : letter}
                    </span>
                  ))}
                </p>
                <h3 className="mt-5 text-[clamp(1.5rem,2.4vw,2.15rem)] leading-[1.15] font-medium tracking-[-0.045em]">
                  <AnimatedTitleWords text={story.title} />
                </h3>

                <p className="mt-5 max-w-lg text-sm leading-[1.65] font-medium text-[#777] sm:text-[18px]">
                  {story.excerpt}
                </p>
                <div className="mt-10 flex items-end justify-between gap-4 sm:mt-14">
                  <p className="text-base text-[#5a5a5a]">{stories[0].readTime}</p>
                  {/* Dual-arrow: exits top-right, enters from bottom-left */}
                  <div className="relative size-8 overflow-hidden" aria-hidden="true">
                    <FiArrowUpRight className="absolute inset-0 m-auto text-2xl transition-transform duration-300 ease-in-out group-hover:translate-x-full group-hover:-translate-y-full" />
                    <FiArrowUpRight className="absolute inset-0 m-auto text-2xl -translate-x-full translate-y-full transition-transform duration-300 ease-in-out group-hover:translate-x-0 group-hover:translate-y-0" />
                  </div>
                </div>
              </div>
            </a>
          );
        })()}

        {/* Story 2 — single image */}
        {(() => {
          const story = stories[1];
          return (
            <a
              href={story.href}
              data-news-article
              className="group grid items-center gap-8 pt-14 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)] lg:gap-[7vw]"
            >
              <div
                data-news-image
                className="relative aspect-4/3 overflow-hidden bg-[#ececec] sm:aspect-video"
              >
                <Image
                  src={story.image.src}
                  alt={story.image.alt}
                  fill
                  sizes="(min-width: 1024px) 44vw, 100vw"
                  className="object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-105"
                />
              </div>

              <div
                data-news-copy
                className="flex min-h-full flex-col justify-center lg:max-w-136 lg:py-6 lg:pl-4"
              >
                <p className="text-[14px] text-lg font-semibold tracking-[0.16em] text-[#616161] uppercase">
                  {Array.from(story.source).map((letter, index) => (
                    <span
                      key={`${letter}-${index}`}
                      data-news-source-letter
                      className="inline-block"
                    >
                      {letter === " " ? "\u00a0" : letter}
                    </span>
                  ))}
                </p>
                <h3 className="mt-5 text-[clamp(1.5rem,2.4vw,2.15rem)] leading-[1.15] font-medium tracking-[-0.045em]">
                  <AnimatedTitleWords text={story.title} />
                </h3>

                <p className="mt-5 max-w-lg text-sm leading-[1.65] font-medium text-[#777] sm:text-[18px]">
                  {story.excerpt}
                </p>
                <div className="mt-10 flex items-end justify-between gap-4 sm:mt-14">
                  <p className="text-base text-[#5a5a5a]">{stories[1].readTime}</p>
                  {/* Dual-arrow: exits top-right, enters from bottom-left */}
                  <div className="relative size-8 overflow-hidden" aria-hidden="true">
                    <FiArrowUpRight className="absolute inset-0 m-auto text-2xl transition-transform duration-300 ease-in-out group-hover:translate-x-full group-hover:-translate-y-full" />
                    <FiArrowUpRight className="absolute inset-0 m-auto text-2xl -translate-x-full translate-y-full transition-transform duration-300 ease-in-out group-hover:translate-x-0 group-hover:translate-y-0" />
                  </div>
                </div>
              </div>
            </a>
          );
        })()}
      </div>

      {/* Mobile-only button — below cards */}
      <div className="mt-10 flex justify-center sm:hidden">
        <RollingTextLink
          href="#news"
          label="View all news"
          className="inline-flex h-12 w-fit items-center justify-center rounded-bl-xl rounded-tr-xl border border-black/20 px-6 text-sm font-medium text-[#191716]"
        />
      </div>
    </section>
  );
}
