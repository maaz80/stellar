"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import capabilities from "./capabilities-data";

export default function CapabilitiesMenu({ menuOpen, onLinkClick }) {
  const carouselRef = useRef(null);
  const moveToRef = useRef(null);
  const [progress, setProgress] = useState(0);

  const updateProgress = useCallback(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const maxScroll = carousel.scrollWidth - carousel.clientWidth;
    setProgress(maxScroll > 0 ? carousel.scrollLeft / maxScroll : 0);
  }, []);

  useLayoutEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const moveTo = gsap.quickTo(carousel, "scrollLeft", {
      duration: 1.2,
      ease: "power3.out",
      onUpdate: updateProgress,
    });
    moveToRef.current = moveTo;

    return () => {
      moveTo.tween.kill();
      gsap.killTweensOf(carousel);
      moveToRef.current = null;
    };
  }, [updateProgress]);

  useLayoutEffect(() => {
    const carousel = carouselRef.current;
    if (
      !menuOpen ||
      !carousel ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const cards = carousel.querySelectorAll("[data-capability-card]");
    const animation = gsap.fromTo(
      cards,
      { autoAlpha: 0, x: 48 },
      {
        autoAlpha: 1,
        x: 0,
        duration: 0.85,
        stagger: { each: 0.08, from: "end" },
        ease: "power3.out",
        clearProps: "transform,opacity,visibility",
      },
    );

    return () => animation.kill();
  }, [menuOpen]);

  function scrollCarousel(direction) {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const card = carousel.querySelector("a");
    const distance = card
      ? card.getBoundingClientRect().width + 12
      : carousel.clientWidth;
    const target = gsap.utils.clamp(
      0,
      carousel.scrollWidth - carousel.clientWidth,
      carousel.scrollLeft + direction * distance,
    );

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      moveToRef.current?.tween.kill();
      carousel.scrollLeft = target;
      updateProgress();
      return;
    }

    moveToRef.current?.(target);
  }

  return (
    <div className="absolute inset-0 hidden flex-col gap-10 md:flex">
      <div
        ref={carouselRef}
        aria-label="Capabilities"
        className="flex gap-3 overflow-x-auto px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:px-10 lg:px-14 xl:px-[2.5vw]"
        onScroll={updateProgress}
      >
        {capabilities.map((capability) => (
          <a
            key={capability.name}
            href={capability.href}
            onClick={onLinkClick}
            data-capability-card
            className="group relative h-[min(60vh,27rem)] min-h-72 w-[20vw] min-w-60 shrink-0 overflow-hidden bg-[#18284c]"
          >
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform group-hover:scale-110"
              style={{ backgroundImage: `url("${capability.image}")` }}
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"
            />
            <span className="absolute inset-x-4 bottom-4 z-10 text-left text-sm font-medium leading-tight tracking-tight text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] sm:inset-x-5 sm:bottom-5 sm:text-base">
              {capability.name}
            </span>
          </a>
        ))}
      </div>

      <div className="relative px-6 sm:px-10 lg:px-14 xl:px-[2.5vw]">
        <div
          className="h-[3px] w-full bg-white/15"
          role="progressbar"
          aria-label="Capabilities carousel position"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress * 100)}
        >
          <div
            className="h-full origin-left bg-white will-change-transform"
            style={{ transform: `scaleX(${progress})` }}
          />
        </div>
        <div className="absolute right-6 top-1/2 z-10 flex -translate-y-1/2 items-center gap-2 bg-[#081a4d] pl-3 sm:right-10 lg:right-14 xl:right-[2.5vw]">
          <button
            type="button"
            aria-label="Previous capabilities"
            onClick={() => scrollCarousel(-1)}
            className="cursor-pointer p-1 text-white/70 transition-colors hover:text-white"
          >
            <FiArrowLeft size={22} />
          </button>
          <button
            type="button"
            aria-label="Next capabilities"
            onClick={() => scrollCarousel(1)}
            className="cursor-pointer p-1 text-white/70 transition-colors hover:text-white"
          >
            <FiArrowRight size={22} />
          </button>
        </div>
      </div>
    </div>
  );
}
