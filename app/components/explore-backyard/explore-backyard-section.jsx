"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FiArrowUpRight } from "react-icons/fi";
import RollingTextLink from "../rolling-text-link/rolling-text-link";

const neighborhoods = [
  {
    name: "Manhattan",
    image: "/assets/backyard-image-1.jpg",
  },
  {
    name: "Brooklyn",
    image: "/assets/backyard-image-2.jpg",
  },
  {
    name: "Queens",
    image: "/assets/backyard-image-3.jpg",
  },
  {
    name: "Bronx",
    image: "/assets/backyard-image-4.jpg",
  },
  {
    name: "Westchester",
    image: "/assets/backyard-image-5.jpg",
  },
];

function NeighborhoodImageLayer({ layer, onComplete }) {
  const layerRef = useRef(null);

  useLayoutEffect(() => {
    if (layer.initial) return;

    const animation = gsap.fromTo(
      layerRef.current,
      {
        autoAlpha: 1,
        clipPath: "inset(100% 100% 0 0)",
        scale: 1.04,
        transformOrigin: "left bottom",
      },
      {
        autoAlpha: 1,
        clipPath: "inset(0% 0% 0% 0%)",
        scale: 1,
        duration: 1.5,
        ease: "power3.inOut",
        onComplete: () => onComplete(layer.id),
      },
    );

    return () => animation.kill();
  }, [layer.id, layer.index, layer.initial, onComplete]);

  return (
    <div
      ref={layerRef}
      aria-hidden="true"
      className="absolute inset-0 bg-cover bg-center"
      style={{ backgroundImage: `url("${neighborhoods[layer.index].image}")` }}
    />
  );
}

export default function ExploreBackyardSection() {
  const sectionRef = useRef(null);
  const nextImageLayerIdRef = useRef(1);
  const [imageLayers, setImageLayers] = useState([]);
  const activeNeighborhood =
    imageLayers[imageLayers.length - 1]?.index ?? 0;

  function selectNeighborhood(index) {
    if (index === activeNeighborhood) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = nextImageLayerIdRef.current++;
      setImageLayers([{ id, index, initial: true, complete: true }]);
      return;
    }

    setImageLayers((layers) => {
      if ((layers[layers.length - 1]?.index ?? 0) === index) return layers;
      return [
        ...layers,
        { id: nextImageLayerIdRef.current++, index, initial: false, complete: false },
      ];
    });
  }

  const finishImageTransition = useCallback((id) => {
    setImageLayers((layers) => {
      const completedLayers = layers.map((layer) =>
        layer.id === id ? { ...layer, complete: true } : layer,
      );
      const latestId = completedLayers[completedLayers.length - 1].id;
      return completedLayers.filter(
        (layer) => layer.id === latestId || !layer.complete,
      );
    });
  }, []);

  useEffect(() => {
    neighborhoods.forEach(({ image }) => {
      const preload = new Image();
      preload.src = image;
    });
  }, []);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const shell = document.querySelector("#backyard-transition-shell");
    const nextSection = document.querySelector("#next-section");
    if (!section || !shell || !nextSection) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const heading = section.querySelector("#backyard-title");
    const description = section.querySelector("[data-backyard-description]");
    const neighborhoodLinks = section.querySelectorAll(
      "[data-backyard-item] a",
    );
    const neighborhoodsButton = section.querySelector(
      "[data-backyard-button]",
    );

    const context = gsap.context(() => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: nextSection,
            start: "top bottom",
            toggleActions: "play none none reverse",
          },
        })
        .to(
          shell,
          {
            backgroundColor: "#081a4d",
            duration: reducedMotion ? 0 : 1,
            ease: "power2.inOut",
          },
          0,
        )
        .to(
          nextSection,
          {
            backgroundColor: "#081a4d",
            duration: reducedMotion ? 0 : 1,
            ease: "power2.inOut",
          },
          0,
        )
        .to(
          [heading, description, ...neighborhoodLinks],
          {
            color: "#ffffff",
            borderColor: "rgba(255,255,255,0.2)",
            duration: reducedMotion ? 0 : 1,
            ease: "power2.inOut",
          },
          0,
        )
        .to(
          neighborhoodsButton,
          {
            color: "#ffffff",
            borderColor: "#ffffff",
            duration: reducedMotion ? 0 : 1,
            ease: "power2.inOut",
          },
          0,
        );
    }, section);

    return () => context.revert();
  }, []);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    const headingLines = section.querySelectorAll("[data-backyard-heading]");
    const italicLetters = section.querySelectorAll(
      "[data-backyard-italic-letter]",
    );
    const neighborhoodItems = Array.from(
      section.querySelectorAll("[data-backyard-item]"),
    );
    const description = section.querySelector("[data-backyard-description]");
    const button = section.querySelector("[data-backyard-button]");
    const image = section.querySelector("[data-backyard-image]");

    const context = gsap.context(() => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: section,
            start: () =>
              window.matchMedia("(min-width: 1024px)").matches
                ? "top 65%"
                : "top 72%",
            once: true,
          },
        })
        .fromTo(
          headingLines,
          { autoAlpha: 0, yPercent: 110 },
          {
            autoAlpha: 1,
            yPercent: 0,
            duration: 2.2,
            stagger: 0.4,
            ease: "power3.out",
          },
        )
        .fromTo(
          italicLetters,
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.045,
            ease: "power3.out",
          },
          "-=1",
        );

      neighborhoodItems.forEach((item) => {
        gsap.fromTo(
          item,
          { autoAlpha: 0, x: -36 },
          {
            autoAlpha: 1,
            x: 0,
            duration: 1.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 90%",
              once: true,
            },
          },
        );
      });

      gsap.fromTo(
        description,
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: description,
            start: "top 90%",
            once: true,
          },
        },
      );

      gsap.fromTo(
        button,
        { autoAlpha: 0, y: 28 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: button,
            start: "top 90%",
            once: true,
          },
        },
      );

      gsap.fromTo(
        image,
        { autoAlpha: 0, x: 48, scale: 0.98 },
        {
          autoAlpha: 1,
          x: 0,
          scale: 1,
          duration: 2.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: image,
            start: "top 78%",
            once: true,
          },
        },
      );
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="explore-backyard"
      aria-labelledby="backyard-title"
      className="overflow-hidden bg-transparent px-3.5 py-10 text-[#191716] sm:px-10 sm:py-20 lg:min-h-screen lg:px-[2.5vw] lg:pt-16 lg:pb-10"
    >
      <div className="mx-auto grid min-h-full max-w-[100rem] gap-8 lg:min-h-[calc(100vh-6.5rem)] lg:grid-cols-[minmax(20rem,1.2fr)_minmax(0,1.15fr)] lg:items-stretch lg:gap-[7vw]">
        <div className="flex flex-col">
          <h2
            id="backyard-title"
            className="mb-5 text-[28px] leading-[0.98] font-medium tracking-[-0.065em] sm:mb-14 sm:text-[clamp(2.8rem,5vw,3.5rem)]"
          >
            <span className="block overflow-hidden">
              <span data-backyard-heading className="block">
                Explore our
              </span>
            </span>
            <span
              data-backyard-italic-line
              aria-label="backyard"
              className="block overflow-hidden pb-[0.14em] font-(family-name:--font-playfair) italic"
            >
              {Array.from("backyard").map((letter, index) => (
                <span
                  key={`${letter}-${index}`}
                  aria-hidden="true"
                  data-backyard-italic-letter
                  className="inline-block"
                >
                  {letter}
                </span>
              ))}
            </span>
          </h2>

          <p
            data-backyard-description
            className="order-2 mb-7 max-w-76 text-xs leading-normal text-black/60 sm:text-base sm:leading-[1.65] lg:order-3 lg:mt-auto lg:mb-0 lg:pt-14"
          >
            From quiet corners to bustling avenues, see what’s available across
            our New York portfolio.
          </p>

          <ul
            id="neighborhoods"
            data-backyard-list
            className="order-3 w-full max-w-88 lg:order-2"
          >
            {neighborhoods.map((neighborhood, index) => (
              <li key={neighborhood.name} data-backyard-item>
                <a
                  href={`#${neighborhood.name.toLowerCase()}`}
                  onMouseEnter={() => selectNeighborhood(index)}
                  onFocus={() => selectNeighborhood(index)}
                  className="group relative flex min-h-20.5 items-center justify-between border-t border-black/15 py-3 text-xl font-medium transition-colors hover:text-[#17377c] sm:min-h-0 sm:py-6 sm:text-[22px] lg:border-t-0 lg:border-b"
                >
                  <span className="flex items-center gap-1">
                    {neighborhood.name}
                    <FiArrowUpRight
                      aria-hidden="true"
                      className="text-base transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 lg:hidden"
                    />
                  </span>
                  <FiArrowUpRight
                    aria-hidden="true"
                    className="absolute right-0 hidden text-2xl transition-transform duration-300 group-hover:translate-x-1 lg:top-1/2 lg:block lg:-translate-y-1/2"
                  />
                  <span
                    aria-hidden="true"
                    className="h-14 w-20 shrink-0 bg-cover bg-center sm:h-16 sm:w-24 lg:hidden"
                    style={{
                      backgroundImage: `url("${neighborhood.image}")`,
                    }}
                  />
                </a>
              </li>
            ))}
          </ul>

          <RollingTextLink
            href="#neighborhoods"
            label="View all neighborhoods"
            data-backyard-button
            className="order-4 mt-7 inline-flex min-h-12 w-fit items-center justify-center rounded-bl-xl rounded-tr-xl border border-black/30 px-6 text-sm font-medium transition-colors lg:mt-8"
          />
        </div>

        <div
          role="img"
          aria-label={`${neighborhoods[activeNeighborhood].name} neighborhood`}
          data-backyard-image
          className="relative hidden min-h-88 overflow-hidden sm:min-h-120 lg:block lg:min-h-0"
        >
              <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  backgroundImage: `url("${neighborhoods[0].image}")`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                }}
              />
              {imageLayers.map((layer) => (
                <NeighborhoodImageLayer
                  key={layer.id}
                  layer={layer}
                  onComplete={finishImageTransition}
                />
              ))}
        </div>
      </div>
    </section>
  );
}
