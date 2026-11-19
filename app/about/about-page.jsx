"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import StellarNavbar from "../components/navbar/stellar-navbar";
import AboutHero from "../components/about/about-hero";
import AboutStorySection from "../components/about/about-story-section";
import AboutVisionSection from "../components/about/about-vision-section";
import AboutApproachImageSection from "../components/about/about-approach-image-section";
import AboutFounderTributeSection from "../components/about/about-founder-tribute-section";
import AboutPurposeSection from "../components/about/about-purpose-section";
import CapabilitiesSection from "../components/navbar/capabilities/capabilities-section";
import LatestNewsSection from "../components/latest-news/latest-news-section";
import ContactSection from "../components/contact/contact-section";
import StellarFooter from "../components/footer/stellar-footer";

export default function AboutPage() {
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
    <main className="relative min-h-screen overflow-x-clip bg-[#101a2d] font-sans text-white">
      {/* Self-contained Full Navbar */}
      <StellarNavbar isHeroPage={true} />

      {/* About Hero Section */}
      <AboutHero />

      {/* About Story / Properties Grid Section */}
      <AboutStorySection />

      {/* About Vision & Approach Section */}
      <AboutVisionSection />

      {/* About Approach Full Image Parallax Section */}
      <AboutApproachImageSection />

      {/* Tribute to Our Founder Section */}
      <AboutFounderTributeSection />

      {/* Committed to Transforming New York (Our Purpose + Carousel) */}
      <AboutPurposeSection />

      {/* Our Capabilities Section */}
      <CapabilitiesSection />

      {/* Latest News Section */}
      <LatestNewsSection />

      {/* Contact Us Section */}
      <ContactSection />

      {/* Stellar Footer */}
      <StellarFooter />
    </main>
  );
}
