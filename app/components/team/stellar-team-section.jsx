"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function StellarTeamSection() {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const image = section?.querySelector("[data-team-image]");
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
        },
      );
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Meet the Stellar team"
      className="relative h-svh max-h-[20vh] md:max-h-[200vh] min-h-[18rem] md:min-h-[32rem] w-full overflow-hidden"
    >
      <Image
        src="/assets/stellar-team.png"
        alt="A member of the Stellar team"
        fill
        priority={false}
        sizes="100vw"
        data-team-image
        className="object-cover object-center"
      />
    </section>
  );
}
