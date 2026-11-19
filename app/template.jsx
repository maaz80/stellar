"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";

// Track whether this is the initial site load/reload vs internal route change
let isInitialSiteLoad = true;
const pageTransitionCompleteEvent = "stellar:page-transition-complete";

// Enforce manual scroll restoration so browsers never restore scroll position on back/forward
if (typeof window !== "undefined") {
  if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
  }

  window.addEventListener("popstate", () => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  });
}

export default function Template({ children }) {
  const wrapperRef = useRef(null);
  const pageContainerRef = useRef(null);
  const pathname = usePathname();

  useLayoutEffect(() => {
    if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    // Scroll to top immediately on route change
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;

    // 1. On fresh page reload, StellarIntro handles the initial screen!
    if (isInitialSiteLoad) {
      isInitialSiteLoad = false;
      if (typeof window !== "undefined") {
        window.__isPageTransitionActive = false;
      }
      return;
    }

    const wrapper = wrapperRef.current;
    const pageContainer = pageContainerRef.current;
    if (!pageContainer) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (typeof window !== "undefined") {
        window.__isPageTransitionActive = false;
        window.dispatchEvent(new Event(pageTransitionCompleteEvent));
      }
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.clearScrollMemory?.();

    // Mark transition active so hero text waits for landing
    if (typeof window !== "undefined") {
      window.__isPageTransitionActive = true;
    }

    // Lock body scroll while the sheet is lifting and landing
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Set 3D perspective ONLY during transition so it NEVER traps fixed elements afterwards
    if (wrapper) {
      wrapper.style.perspective = "1400px";
    }
    pageContainer.style.willChange = "transform";

    // Double check scroll is pinned at top
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    });

    const ctx = gsap.context(() => {
      // ── Physical Sheet Lift-and-Place (Incoming Page with Hero Video + Navbar) ──
      // Starts angled below the screen in 3D perspective and lands flat
      gsap.fromTo(
        pageContainer,
        {
          y: "105vh",
          rotateX: 18,
          scale: 0.90,
          borderTopLeftRadius: "48px",
          borderTopRightRadius: "48px",
          boxShadow:
            "0 -40px 100px rgba(0, 0, 0, 0.7), 0 -12px 36px rgba(0, 0, 0, 0.45)",
          transformOrigin: "bottom center",
          overflow: "hidden",
        },
        {
          y: "0vh",
          rotateX: 0,
          scale: 1,
          borderTopLeftRadius: "0px",
          borderTopRightRadius: "0px",
          boxShadow: "0 0 0 rgba(0, 0, 0, 0)",
          duration: 1.25, // Slower, elegant luxury pace as requested
          ease: "power3.out",
          clearProps:
            "transform,rotateX,scale,borderTopLeftRadius,borderTopRightRadius,boxShadow,overflow,willChange",
          onComplete: () => {
            document.body.style.overflow = originalOverflow;
            // CRITICAL: Remove perspective and transform so position:fixed descendants (navbar, rent button) work normally
            if (wrapper) {
              wrapper.style.perspective = "";
            }
            if (pageContainer) {
              pageContainer.style.transform = "";
              pageContainer.style.willChange = "";
            }

            window.scrollTo({ top: 0, left: 0, behavior: "instant" });
            if (document.documentElement) document.documentElement.scrollTop = 0;
            if (document.body) document.body.scrollTop = 0;

            if (typeof window !== "undefined") {
              window.__isPageTransitionActive = false;
              // Dispatch event to trigger hero text animations after landing!
              window.dispatchEvent(new Event(pageTransitionCompleteEvent));
            }
            ScrollTrigger.refresh();
          },
        }
      );
    }, pageContainer);

    return () => {
      document.body.style.overflow = originalOverflow;
      if (wrapper) {
        wrapper.style.perspective = "";
      }
      if (pageContainer) {
        pageContainer.style.transform = "";
        pageContainer.style.willChange = "";
      }
      if (typeof window !== "undefined") {
        window.__isPageTransitionActive = false;
      }
      ctx.revert();
    };
  }, [pathname]);

  return (
    <div
      key={pathname}
      ref={wrapperRef}
      className="relative w-full min-h-screen overflow-x-clip"
    >
      <div
        ref={pageContainerRef}
        className="relative w-full min-h-screen"
      >
        {children}
      </div>
    </div>
  );
}
