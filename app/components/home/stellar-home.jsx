"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import StellarHero from "../hero/stellar-hero";
import StellarNavbar from "../navbar/stellar-navbar";
import WhatWeDoSection from "../what-we-do/what-we-do-section";
import ExploreBackyardSection from "../explore-backyard/explore-backyard-section";
import KeyFiguresSection from "../key-figures/key-figures-section";
import FeaturedPropertiesSection from "../featured-properties/featured-properties-section";
import AboutUsSection from "../about-us/about-us-section";
import StellarTeamSection from "../team/stellar-team-section";
import CapabilitiesSection from "../navbar/capabilities/capabilities-section";
import LatestNewsSection from "../latest-news/latest-news-section";
import ContactSection from "../contact/contact-section";
import StellarFooter from "../footer/stellar-footer";

export default function StellarHome() {
  const [menuOpen, setMenuOpen] = useState(false);
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
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!lenisRef.current) return;
    if (menuOpen) {
      lenisRef.current.stop();
    } else {
      lenisRef.current.start();
    }
  }, [menuOpen]);

  return (
    <main className="relative min-h-screen overflow-x-clip bg-[#101a2d] font-sans text-white">
      {/* ========================================================= */}
      {/* UNIFIED FULL NAVBAR COMPONENT                             */}
      {/* ========================================================= */}
      <StellarNavbar
        isHeroPage={true}
        onStateChange={({ menuOpen: menuState }) => {
          setMenuOpen(menuState);
        }}
      />

      <StellarHero />
      <WhatWeDoSection />
      <div id="backyard-transition-shell" className="bg-white">
        <ExploreBackyardSection />
        <KeyFiguresSection />
        <FeaturedPropertiesSection />
      </div>
      <AboutUsSection />
      <StellarTeamSection />
      <CapabilitiesSection />
      <LatestNewsSection />
      <ContactSection />
      <StellarFooter />
    </main>
  );
}
