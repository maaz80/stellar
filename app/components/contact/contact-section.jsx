"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import RollingTextLink from "../rolling-text-link/rolling-text-link";

export default function ContactSection() {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const imgLeft  = section.querySelector("[data-contact-img-left]");
    const headingLines = section.querySelectorAll("[data-contact-line]");
    const sub = section.querySelector("[data-contact-sub]");
    const btn = section.querySelector("[data-contact-btn]");

    const context = gsap.context(() => {
      if (!reducedMotion) {
        // ── Parallax: images start lower, move up slower than scroll ──
        // "top bottom" = section top enters viewport bottom
        // "bottom top" = section bottom exits viewport top
        // Images travel 40% of their height total — giving the
        // "they were always there, just slowly drifting up" feeling.
        gsap.fromTo(
          imgLeft,
          { yPercent: 8 },
          {
            yPercent: -8,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );

        // ── Content animations (once) ──
        gsap.fromTo(
          headingLines,
          { autoAlpha: 0, yPercent: 110 },
          {
            autoAlpha: 1,
            yPercent: 0,
            duration: 1.6,
            stagger: 0.22,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 70%",
              once: true,
            },
          }
        );

        gsap.fromTo(
          sub,
          { autoAlpha: 0, y: 22 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1.4,
            delay: 0.3,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 70%",
              once: true,
            },
          }
        );

        gsap.fromTo(
          btn,
          { autoAlpha: 0, y: 28, scale: 0.94 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 1.2,
            delay: 0.52,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 70%",
              once: true,
            },
          }
        );
      }
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      aria-labelledby="contact-title"
      className="relative flex h-[70vh] md:h-screen flex-col overflow-hidden bg-[#dce6f5]"
    >
      {/* Desktop BG — hidden on mobile */}
      <div
        data-contact-img-left
        aria-hidden="true"
        className="pointer-events-none absolute left-0 right-0 hidden w-full will-change-transform sm:block"
        style={{
          backgroundImage: "url('/assets/Contact BG.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          top: "-10%",
          bottom: "-10%",
        }}
      />

      {/* Mobile BG — hidden on desktop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 right-0 w-full sm:hidden"
        style={{
          backgroundImage: "url('/assets/contact mobile bg.jpg')",
          backgroundSize: "contain",
          backgroundPosition: "center",
          top: "-10%",
          bottom: "-10%",
        }}
      />

      {/* Centre content */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-6 pt-30">
        <div className="flex flex-col items-center text-center">
        <h2
          id="contact-title"
          className="text-[clamp(3rem,7vw,6.5rem)] font-medium leading-[0.96] tracking-[-0.055em] text-[#191716]"
        >
          <span className="block overflow-hidden">
            <span data-contact-line className="block">
              Let&rsquo;s&nbsp;
              <span className="font-(family-name:--font-playfair) font-normal italic">
                talk
              </span>
            </span>
          </span>

          <span className="block overflow-hidden">
            <span data-contact-line className="block">
              Real Estate
            </span>
          </span>
        </h2>

        <p
          data-contact-sub
          className="mt-7 max-w-47.5 md:max-w-sm text-[15px] leading-relaxed text-[#191716]/70 sm:mt-9 sm:text-base font-medium"
        >
          Whether you&rsquo;re looking for a new home, office space, or
          strategic investment, our team is here to help.
        </p>

        <RollingTextLink
          href="/contact"
          label="Contact us"
          data-contact-btn
          className="mt-10 inline-flex h-13 items-center justify-center rounded-bl-xl rounded-tr-xl bg-[#081a4d] px-8 text-sm font-medium text-white sm:mt-12"
        />
        </div>
      </div>

      {/* 120px bottom breathing room — doesn't affect flex centering */}
      <div className="h-30 shrink-0" />
    </section>
  );
}
