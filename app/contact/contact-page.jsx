"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import StellarNavbar from "../components/navbar/stellar-navbar";
import ContactPageContent from "../components/contact-form/contact-page-content";
import StellarFooter from "../components/footer/stellar-footer";

export default function ContactPage() {
  const lenisRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.6,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.55,
      touchMultiplier: 1.2,
      infinite: false,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", () => {
      ScrollTrigger.update();
    });

    const updateTicker = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
    };
  }, []);

  return (
    <main className="relative min-h-screen overflow-x-clip bg-white font-sans text-[#191716]">
      <StellarNavbar isHeroPage={false} />
      <ContactPageContent />
      <StellarFooter />
    </main>
  );
}
