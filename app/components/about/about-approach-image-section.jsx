"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function AboutApproachImageSection() {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const image = section?.querySelector("[data-approach-image]");
    if (
      !section ||
      !image ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      gsap.fromTo(
        image,
        { scale: 1 },
        {
          scale: 1.18,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        }
      );
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Our approach - New York City skyline"
      className="relative w-full h-[50vh] sm:h-[65vh] lg:h-[85vh] xl:h-[90vh] min-h-80 sm:min-h-112 lg:min-h-152 overflow-hidden bg-[#181513]"
    >
      <Image
        src="/assets/Our approach.jpg"
        alt="Aerial cityscape of New York City representing Our Approach"
        fill
        priority={false}
        sizes="100vw"
        data-approach-image
        className="object-cover object-center will-change-transform"
      />
    </section>
  );
}
