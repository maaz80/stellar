"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import capabilities from "./capabilities-data";

export default function CapabilitiesSection() {
  const sectionRef = useRef(null);
  const carouselRef = useRef(null);
  const dragLabelRef = useRef(null);
  const dragRef = useRef(null);
  const moveLabelXRef = useRef(null);
  const moveLabelYRef = useRef(null);
  const isDragLabelVisibleRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);

  const updateProgress = useCallback(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const maxScroll = carousel.scrollWidth - carousel.clientWidth;
    setProgress(maxScroll > 0 ? carousel.scrollLeft / maxScroll : 0);
  }, []);

  useLayoutEffect(() => {
    const carousel = carouselRef.current;
    const dragLabel = dragLabelRef.current;
    if (!carousel || !dragLabel) return;

    carousel.scrollLeft = 0;
    updateProgress();
    gsap.set(dragLabel, {
      x: 0,
      y: 0,
      xPercent: 0,
      yPercent: 0,
      autoAlpha: 0,
      scale: 0.8,
    });

    moveLabelXRef.current = gsap.quickTo(dragLabel, "x", {
      duration: 0.8,
      ease: "power3.out",
    });
    moveLabelYRef.current = gsap.quickTo(dragLabel, "y", {
      duration: 0.8,
      ease: "power3.out",
    });

    return () => {
      gsap.killTweensOf(carousel);
      gsap.killTweensOf(dragLabel);
      moveLabelXRef.current = null;
      moveLabelYRef.current = null;
    };
  }, [updateProgress]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (
      !section ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const heading = section.querySelector("#capabilities-title");
    const description = section.querySelector("p");
    const progressTrack = section.querySelector('[role="progressbar"]');
    const cards = section.querySelectorAll("article");
    gsap.registerPlugin(ScrollTrigger);
    const carousel = carouselRef.current;
    const context = gsap.context(() => {
      gsap.fromTo(
        [heading, description, progressTrack],
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1.2,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 78%",
            once: true,
          },
        },
      );

      gsap.fromTo(
        cards,
        { autoAlpha: 0, x: 48, scale: 0.98 },
        {
          autoAlpha: 1,
          x: 0,
          scale: 1,
          duration: 1.5,
          stagger: { each: 0.12, from: "end" },
          ease: "power3.out",
          scrollTrigger: {
            trigger: carousel,
            start: "top 82%",
            once: true,
          },
        },
      );
    }, section);

    return () => {
      context.revert();
    };
  }, []);

  function moveDragLabel(event) {
    if (event.pointerType && event.pointerType !== "mouse") return;
    if (dragRef.current) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const label = dragLabelRef.current;
    const labelWidth = label.offsetWidth;
    const labelHeight = label.offsetHeight;
    const pointerX = event.clientX - bounds.left;
    const pointerY = event.clientY - bounds.top;
    const offset = 16;
    const targetX =
      pointerX + labelWidth + offset <= bounds.width
        ? pointerX + offset
        : pointerX - labelWidth - offset;
    const targetY =
      pointerY + labelHeight + offset <= bounds.height
        ? pointerY + offset
        : pointerY - labelHeight - offset;

    moveLabelXRef.current?.(
      Math.max(0, Math.min(targetX, bounds.width - labelWidth)),
    );
    moveLabelYRef.current?.(
      Math.max(0, Math.min(targetY, bounds.height - labelHeight)),
    );

    if (!isDragLabelVisibleRef.current) {
      isDragLabelVisibleRef.current = true;
      gsap.to(dragLabelRef.current, {
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
    isDragLabelVisibleRef.current = false;
    gsap.to(dragLabelRef.current, {
      autoAlpha: 0,
      scale: 0.8,
      duration: 0.3,
      ease: "power2.inOut",
      overwrite: "auto",
    });
  }

  function handlePointerDown(event) {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    event.preventDefault();
    isDragLabelVisibleRef.current = false;
    gsap.killTweensOf(dragLabelRef.current, "autoAlpha,scale");
    gsap.set(dragLabelRef.current, { autoAlpha: 0, scale: 0.8 });
    gsap.killTweensOf(event.currentTarget);
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      scrollLeft: event.currentTarget.scrollLeft,
      lastX: event.clientX,
      lastTime: performance.now(),
      velocity: 0,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsDragging(true);
  }

  function handlePointerMove(event) {
    const drag = dragRef.current;
    if (!drag) {
      moveDragLabel(event);
      return;
    }
    if (drag.pointerId !== event.pointerId) return;
    const carousel = carouselRef.current;
    if (!carousel) return;

    const now = performance.now();
    const elapsed = now - drag.lastTime;
    if (elapsed > 0) {
      drag.velocity = (event.clientX - drag.lastX) / elapsed;
    }
    drag.lastX = event.clientX;
    drag.lastTime = now;

    const delta = event.clientX - drag.startX;
    const maxScroll = carousel.scrollWidth - carousel.clientWidth;
    carousel.scrollLeft = gsap.utils.clamp(
      0,
      maxScroll,
      drag.scrollLeft - delta,
    );
    updateProgress();
  }

  function stopDragging(event) {
    const drag = dragRef.current;
    if (!drag || (event?.pointerId && drag.pointerId !== event.pointerId)) {
      return;
    }
    dragRef.current = null;
    const carousel = carouselRef.current;
    if (!carousel) {
      setIsDragging(false);
      return;
    }

    if (event?.pointerId && carousel.hasPointerCapture(event.pointerId)) {
      carousel.releasePointerCapture(event.pointerId);
    }

    const maxScroll = carousel.scrollWidth - carousel.clientWidth;
    const target = gsap.utils.clamp(
      0,
      maxScroll,
      carousel.scrollLeft - drag.velocity * 180,
    );
    gsap.to(carousel, {
      scrollLeft: target,
      duration: 0.65,
      ease: "power3.out",
      overwrite: "auto",
      onUpdate: updateProgress,
      onComplete: () => setIsDragging(false),
    });
  }

  return (
    <section
      ref={sectionRef}
      aria-labelledby="capabilities-title"
      className="overflow-hidden bg-white py-16 text-[#191716] sm:py-20 lg:py-24"
    >
      <div className="flex flex-col gap-8 px-5 sm:flex-row sm:items-end sm:justify-between sm:px-8 lg:px-[2.5vw]">
        <div>
          <h2
            id="capabilities-title"
            className="text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.98] font-medium tracking-[-0.065em]"
          >
            Our{" "}
            <span className="font-(family-name:--font-playfair) font-normal italic">
              capabilities
            </span>
          </h2>
          <p className="mt-7 text-base leading-relaxed text-[#777] sm:text-lg">
            A full-service, hands-on approach
            <br />
            to New York real estate.
          </p>
        </div>
        <div
          className="h-0.75 w-40 bg-[#d4d4d4]"
          role="progressbar"
          aria-label="Carousel position"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress * 100)}
        >
          <div
            className="h-full w-[34%] bg-[#777]"
            style={{ transform: `translateX(${progress * 194}%)` }}
          />
        </div>
      </div>

      <div className="relative mt-12 sm:mt-16 lg:mt-20">
        <div
          ref={carouselRef}
          aria-label="Our capabilities"
          className={`flex select-none gap-4 overflow-x-auto px-5 pb-2 sm:gap-5 sm:px-8 lg:gap-4 lg:px-[2.5vw] scrollbar-none [&::-webkit-scrollbar]:hidden ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
          onScroll={updateProgress}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerEnter={moveDragLabel}
          onPointerLeave={handlePointerLeave}
          onPointerUp={stopDragging}
          onPointerCancel={stopDragging}
          onLostPointerCapture={stopDragging}
        >
          {capabilities.map((capability) => (
            <article
              key={capability.name}
              className="w-[72vw] shrink-0 sm:w-[48vw] lg:w-[23.5vw] lg:max-w-104"
            >
              <div
                aria-hidden="true"
                className="h-[clamp(20rem,31vw,27rem)] bg-cover bg-center"
                style={{ backgroundImage: `url("${capability.image}")` }}
              />
              <h3 className="mt-4 text-base font-medium tracking-[-0.03em] sm:text-lg">
                {capability.name}
              </h3>
            </article>
          ))}
        </div>
        <span
          ref={dragLabelRef}
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-0 rounded-tr-lg rounded-bl-lg bg-white/90 px-4 py-2 text-sm text-[#191716] shadow-sm"
        >
          Drag
        </span>
      </div>
    </section>
  );
}

