"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const properties = [
  {
    image: "/assets/backyard-image-1.jpg",
    name: "OTTO",
    description: "Amenity-rich luxury living in Greenpoint",
  },
  {
    image: "/assets/backyard-image-2.jpg",
    name: "THE NEIGHBORHOOD",
    description: "Room to settle into the rhythm of Brooklyn",
  },
  {
    image: "/assets/backyard-image-3.jpg",
    name: "GREENPOINT",
    description: "A place to live, connect, and feel at home",
  },
];

const propertyLineTypes = ["name", "description", "counter"];

export default function FeaturedPropertiesSection() {
  const sectionRef = useRef(null);
  const exploreButtonRef = useRef(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);
    const curtain = section.querySelector("[data-feature-curtain]");
    const card = section.querySelector("[data-feature-card]");
    const backgroundLayers = section.querySelectorAll(
      "[data-feature-background]",
    );
    const cardImageLayers = section.querySelectorAll("[data-feature-card-image]");
    const informationTracks = new Map(
      Array.from(section.querySelectorAll("[data-feature-line-track]")).map(
        (track) => [track.dataset.featureLineTrack, track],
      ),
    );
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const context = gsap.context(() => {
      gsap.set(
        [...backgroundLayers].slice(1).concat([...cardImageLayers].slice(1)),
        { "--feature-reveal": "100%" },
      );
      gsap.set(Array.from(informationTracks.values()), { y: 0 });

      if (reducedMotion) {
        gsap.set(curtain, { yPercent: -100 });
        gsap.set(card, { autoAlpha: 1, y: 0 });
        gsap.set(backgroundLayers[0], { scale: 1, yPercent: 0 });
        return;
      }

      gsap.set(curtain, { yPercent: 0 });
      gsap.set(card, { autoAlpha: 0, y: window.innerHeight });
      gsap.set(backgroundLayers[0], { scale: 1.15, yPercent: -6 });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "top -40%",
            scrub: 1.4,
          },
        })
        .to(curtain, { yPercent: -100, ease: "power1.inOut" }, 0)
        .to(
          backgroundLayers[0],
          { scale: 1, yPercent: 0, ease: "power1.inOut" },
          0,
        )
        .fromTo(
          card,
          { autoAlpha: 0, y: window.innerHeight },
          { autoAlpha: 1, y: 0, ease: "power2.out" },
          0.2,
        );

      const propertyTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top -40%",
          end: "bottom bottom",
          scrub: 1.2,
        },
      });

      properties.slice(1).forEach((_, index) => {
        const transitionStart = index * 1.05 + 0.15;
        propertyTimeline
          .fromTo(
            backgroundLayers[index + 1],
            { "--feature-reveal": "100%" },
            { "--feature-reveal": "0%", duration: 0.9, ease: "power1.inOut" },
            transitionStart,
          )
          .fromTo(
            cardImageLayers[index + 1],
            { "--feature-reveal": "100%" },
            { "--feature-reveal": "0%", duration: 0.9, ease: "power1.inOut" },
            transitionStart,
          );

        propertyLineTypes.forEach((type) => {
          const track = informationTracks.get(type);
          const row = track?.querySelector("[data-feature-line]");
          if (!track || !row) return;

          const nextOffset = -(index + 1) * row.offsetHeight;
          if (type === "counter") {
            const fadeStart = transitionStart + 0.25;
            propertyTimeline
              .to(
                track,
                { autoAlpha: 0, duration: 0.12, ease: "power1.in" },
                fadeStart,
              )
              .set(track, { y: nextOffset }, fadeStart + 0.12)
              .to(
                track,
                { autoAlpha: 1, duration: 0.12, ease: "power1.out" },
                fadeStart + 0.12,
              );
          } else {
            propertyTimeline.to(
              track,
              {
                y: nextOffset,
                duration: 0.45,
                ease: "power2.inOut",
              },
              transitionStart + 0.25,
            );
          }
        });
      });
    }, section);

    return () => context.revert();
  }, []);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const button = exploreButtonRef.current;
    const stage = section?.querySelector("[data-feature-stage]");
    if (!stage || !button) return;

    gsap.set(button, {
      x: 0,
      y: 0,
      xPercent: -50,
      yPercent: -50,
      autoAlpha: 0,
      scale: 0.8,
    });

    const moveX = gsap.quickTo(button, "x", {
      duration: 0.8,
      ease: "power3.out",
    });
    const moveY = gsap.quickTo(button, "y", {
      duration: 0.8,
      ease: "power3.out",
    });

    let isVisible = false;

    function handlePointerMove(event) {
      if (event.pointerType && event.pointerType !== "mouse") return;

      const bounds = stage.getBoundingClientRect();
      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;

      moveX(x);
      moveY(y);

      if (!isVisible) {
        isVisible = true;
        gsap.to(button, {
          autoAlpha: 1,
          scale: 1,
          duration: 0.35,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
    }

    function handlePointerLeave(event) {
      if (event.pointerType && event.pointerType !== "mouse") return;
      isVisible = false;
      gsap.to(button, {
        autoAlpha: 0,
        scale: 0.8,
        duration: 0.3,
        ease: "power2.inOut",
        overwrite: "auto",
      });
    }

    stage.addEventListener("pointermove", handlePointerMove);
    stage.addEventListener("pointerenter", handlePointerMove);
    stage.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      stage.removeEventListener("pointermove", handlePointerMove);
      stage.removeEventListener("pointerenter", handlePointerMove);
      stage.removeEventListener("pointerleave", handlePointerLeave);
      gsap.killTweensOf(button);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="featured-properties"
      aria-label="Featured properties"
      className="relative h-[320vh] lg:h-[350vh]"
    >
      <div
        data-feature-stage
        className="sticky top-0 relative flex h-screen items-center justify-center overflow-hidden bg-[#081a4d]"
      >
        {properties.map((property, index) => (
          <div
            key={property.image}
            aria-hidden="true"
            data-feature-background
            className="absolute inset-0 bg-cover bg-center will-change-transform"
            style={{
              backgroundImage: `url("${property.image}")`,
              clipPath:
                index === 0
                  ? undefined
                  : "inset(var(--feature-reveal) 0 0 0)",
            }}
          />
        ))}

        <div
          data-feature-curtain
          aria-hidden="true"
          className="absolute inset-0 z-10 bg-[#081a4d] will-change-transform"
        />

        <a
          ref={exploreButtonRef}
          href="#rentals"
          className="absolute top-0 left-0 z-30 hidden select-none rounded-bl-xl rounded-tr-xl bg-white px-5 py-3 text-sm font-medium text-[#111111] shadow-lg will-change-transform sm:inline-flex"
        >
          Explore more
        </a>

        <article
          data-feature-card
          aria-label="Featured property"
          className="relative z-20 flex h-[min(57.6svh,25.2rem)] w-[min(21rem,calc(100vw-4rem))] flex-col bg-white px-3 pt-4 pb-3 text-center text-[#111111] will-change-transform sm:h-[min(82svh,44rem)] sm:w-[min(25rem,calc(100vw-3rem))] sm:px-8 sm:pt-7 sm:pb-5"
        >
          <h2 className="shrink-0 text-[clamp(2rem,4vw,3.2rem)] leading-[0.98] tracking-[-0.06em]">
            Featured
            <span className="block font-(family-name:--font-playfair) font-normal italic">
              properties
            </span>
          </h2>

          <div className="relative mt-4 min-h-0 w-full flex-1 overflow-hidden sm:mt-6">
            {properties.map((property, index) => (
              <Image
                key={property.image}
                data-feature-card-image
                fill
                sizes="(max-width: 640px) 90vw, 440px"
                src={property.image}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                style={
                  index === 0
                    ? undefined
                    : { clipPath: "inset(var(--feature-reveal) 0 0 0)" }
                }
              />
            ))}
          </div>

          <div className="mt-4 flex h-29 shrink-0 flex-col space-y-4 sm:mt-5">
            {propertyLineTypes.map((type) => (
              <div
                key={type}
                data-feature-line-viewport={type}
                className={`relative w-full overflow-hidden ${
                  type === "description"
                    ? "h-10"
                    : type === "counter"
                      ? "h-6"
                      : "h-5"
                }`}
              >
                <div
                  data-feature-line-track={type}
                  className="flex flex-col will-change-transform"
                >
                  {properties.map((property, index) => {
                    const text =
                      type === "name"
                        ? property.name
                        : type === "description"
                          ? property.description
                          : `0${index + 1}/03`;

                    return (
                      <span
                        key={`${type}-${property.name}`}
                        data-feature-line={type}
                        className={`flex w-full shrink-0 items-center justify-center ${
                          type === "name"
                            ? "h-5 whitespace-nowrap text-lg font-medium"
                            : type === "description"
                              ? "h-10 text-lg leading-5"
                              : "h-6 whitespace-nowrap text-base font-medium leading-none text-black"
                        }`}
                      >
                        {text}
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
