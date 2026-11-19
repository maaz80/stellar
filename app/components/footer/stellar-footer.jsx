"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  FiChevronDown,
  FiFacebook,
  FiInstagram,
  FiLinkedin,
} from "react-icons/fi";
import RollingTextLink from "../rolling-text-link/rolling-text-link";

const footerData = {
  company: {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Purpose", href: "#purpose" },
      { label: "Approach", href: "#approach" },
      { label: "Team", href: "#team" },
      { label: "Careers", href: "#careers" },
      { label: "News", href: "#news" },
    ],
  },
  rentals: {
    title: "Rentals",
    links: [
      { label: "Availabilities", href: "#availabilities" },
      { label: "Neighborhoods", href: "#neighborhoods" },
      { label: "Rental Guide", href: "#rental-guide" },
    ],
  },
  neighborhoods: {
    title: "Neighborhoods",
    links: [
      { label: "Manhattan", href: "#manhattan" },
      { label: "Brooklyn", href: "#brooklyn" },
      { label: "Queens", href: "#queens" },
      { label: "Bronx", href: "#bronx" },
      { label: "Westchester", href: "#westchester" },
    ],
  },
  capabilities: {
    title: "Capabilities",
    links: [
      { label: "Acquisitions & Investments", href: "#acquisitions-investments" },
      { label: "Leasing & Operations", href: "#leasing-operations" },
      { label: "Development & Construction", href: "#development-construction" },
      { label: "Asset Management", href: "#asset-management" },
      { label: "Affordable Housing", href: "#affordable-housing" },
    ],
  },
  legal: {
    title: "Legal",
    links: [
      { label: "Terms & Conditions", href: "#terms-conditions" },
      { label: "Privacy Policy", href: "#privacy-policy" },
      { label: "Credits", href: "#credits" },
    ],
  },
};

const accordionSections = [
  footerData.company,
  footerData.rentals,
  footerData.neighborhoods,
  footerData.capabilities,
  footerData.legal,
];

/**
 * Animated underline link:
 * - On hover: sweeps in from left to right
 * - On hover out: sweeps out to the right
 */
function FooterLink({ href, children, className = "" }) {
  const isInternal = Boolean(href && href.startsWith("/"));
  const linkContent = (
    <>
      <span>{children}</span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-px left-0 h-px w-full origin-right scale-x-0 bg-white transition-transform duration-300 ease-out group-hover:origin-left group-hover:scale-x-100"
      />
    </>
  );

  if (isInternal) {
    return (
      <Link
        href={href}
        className={`group relative inline-block w-fit text-white/90 transition-colors hover:text-white ${className}`}
      >
        {linkContent}
      </Link>
    );
  }

  return (
    <a
      href={href}
      className={`group relative inline-block w-fit text-white/90 transition-colors hover:text-white ${className}`}
    >
      {linkContent}
    </a>
  );
}

export default function StellarFooter() {
  const footerRef = useRef(null);
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (title) => {
    setOpenSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  useLayoutEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    gsap.registerPlugin(ScrollTrigger);
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const letterElements = footer.querySelectorAll("[data-stellar-letter]");
    const mainContent = footer.querySelector("[data-footer-content]");

    const context = gsap.context(() => {
      // 1. Initial content entrance when footer comes into view
      if (!reducedMotion && mainContent) {
        gsap.fromTo(
          mainContent,
          { autoAlpha: 0, y: 30 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: footer,
              start: "top 80%",
              once: true,
            },
          }
        );
      }

      // 2. Big "Stellar" SVG letter-by-letter animation
      // Triggers when footer top touches the top of viewport ("top top")
      if (letterElements.length > 0) {
        if (reducedMotion) {
          gsap.set(letterElements, { autoAlpha: 1, y: 0 });
          return;
        }

        gsap.set(letterElements, { autoAlpha: 0, y: 350 });

        let animated = false;
        const runLetterAnimation = () => {
          if (animated) return;
          animated = true;
          gsap.fromTo(
            letterElements,
            { autoAlpha: 0, y: 350 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 1.2,
              stagger: 0.08,
              ease: "power3.out",
            }
          );
        };

        // Primary trigger: when footer top reaches top of viewport
        ScrollTrigger.create({
          trigger: footer,
          start: "top top",
          once: true,
          onEnter: runLetterAnimation,
        });

        // Backup trigger: if page hits absolute bottom
        ScrollTrigger.create({
          trigger: footer,
          start: "bottom bottom",
          once: true,
          onEnter: runLetterAnimation,
        });
      }
    }, footer);

    return () => context.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      id="footer"
      className="relative min-h-screen overflow-hidden bg-[#081a4d] px-5 pt-16 text-white sm:px-8 sm:pt-20 lg:px-[2.5vw] lg:pt-24"
    >
      <div data-footer-content className="mx-auto max-w-[100rem]">
        {/* ========================================================= */}
        {/* DESKTOP LAYOUT (>= md)                                   */}
        {/* ========================================================= */}
        <div className="hidden md:grid md:grid-cols-[1.6fr_1fr_1fr_1.05fr_1.25fr] md:gap-8 lg:grid-cols-[1.8fr_1fr_1fr_1.1fr_1.35fr] lg:gap-12 xl:gap-16">
          {/* Column 1: Stellar Management + Login + Legal */}
          <div className="flex flex-col pr-4 lg:pr-8">
            <h3 className="text-[17px] font-medium tracking-tight text-white">
              Stellar Management
            </h3>
            <p className="mt-3.5 text-[14.5px] leading-relaxed text-white/90">
              44 W 28th St, 6th Floor NY, 10001
            </p>
            <div className="mt-1">
              <FooterLink
                href="tel:+12124060030"
                className="text-[14.5px]"
              >
                +1 212-406-0030
              </FooterLink>
            </div>

            {/* Login Buttons (signature 2-side rounded shape: rounded-bl-xl rounded-tr-xl) */}
            <div className="mt-6 flex items-center gap-3">
              <RollingTextLink
                href="#broker-login"
                label="Broker Login"
                className="inline-flex h-11 items-center justify-center rounded-bl-xl rounded-tr-xl bg-white px-5 text-[14px] font-medium text-[#081a4d] transition-all hover:bg-white/90"
              />
              <RollingTextLink
                href="#resident-login"
                label="Resident Login"
                className="inline-flex h-11 items-center justify-center rounded-bl-xl rounded-tr-xl border border-white/40 bg-transparent px-5 text-[14px] font-medium text-white transition-all hover:border-white hover:bg-white/10"
              />
            </div>

            {/* Legal Links (below buttons on desktop) */}
            <div className="mt-10">
              <h4 className="text-[16px] font-medium text-white">
                {footerData.legal.title}
              </h4>
              <ul className="mt-3.5 space-y-2.5">
                {footerData.legal.links.map((link) => (
                  <li key={link.label}>
                    <FooterLink
                      href={link.href}
                      className="text-[15px]"
                    >
                      {link.label}
                    </FooterLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 2: Company */}
          <div>
            <h4 className="text-[16px] font-medium text-white">
              {footerData.company.title}
            </h4>
            <ul className="mt-4 space-y-2.5">
              {footerData.company.links.map((link) => (
                <li key={link.label}>
                  <FooterLink
                    href={link.href}
                    className="text-[15px]"
                  >
                    {link.label}
                  </FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Rentals */}
          <div>
            <h4 className="text-[16px] font-medium text-white">
              {footerData.rentals.title}
            </h4>
            <ul className="mt-4 space-y-2.5">
              {footerData.rentals.links.map((link) => (
                <li key={link.label}>
                  <FooterLink
                    href={link.href}
                    className="text-[15px]"
                  >
                    {link.label}
                  </FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Neighborhoods */}
          <div>
            <h4 className="text-[16px] font-medium text-white">
              {footerData.neighborhoods.title}
            </h4>
            <ul className="mt-4 space-y-2.5">
              {footerData.neighborhoods.links.map((link) => (
                <li key={link.label}>
                  <FooterLink
                    href={link.href}
                    className="text-[15px]"
                  >
                    {link.label}
                  </FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Capabilities */}
          <div>
            <h4 className="text-[16px] font-medium text-white">
              {footerData.capabilities.title}
            </h4>
            <ul className="mt-4 space-y-2.5">
              {footerData.capabilities.links.map((link) => (
                <li key={link.label}>
                  <FooterLink
                    href={link.href}
                    className="text-[15px]"
                  >
                    {link.label}
                  </FooterLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ========================================================= */}
        {/* MOBILE ACCORDION LAYOUT (< md)                           */}
        {/* ========================================================= */}
        <div className="md:hidden">
          {/* Header Info */}
          <div className="flex flex-col">
            <h3 className="text-[18px] font-medium tracking-tight text-white">
              Stellar Management
            </h3>
            <p className="mt-3 text-[14.5px] leading-relaxed text-white/90">
              44 W 28th St, 6th Floor NY, 10001
            </p>
            <div className="mt-1">
              <FooterLink
                href="tel:+12124060030"
                className="text-[14.5px]"
              >
                +1 212-406-0030
              </FooterLink>
            </div>

            {/* Login Buttons (signature 2-side rounded shape: rounded-bl-xl rounded-tr-xl) */}
            <div className="mt-5 grid grid-cols-2 gap-3">
              <RollingTextLink
                href="#broker-login"
                label="Broker Login"
                className="inline-flex h-11 w-full items-center justify-center rounded-bl-xl rounded-tr-xl bg-white px-3 text-[14px] font-medium text-[#081a4d] transition-all hover:bg-white/90"
              />
              <RollingTextLink
                href="#resident-login"
                label="Resident Login"
                className="inline-flex h-11 w-full items-center justify-center rounded-bl-xl rounded-tr-xl border border-white/40 bg-transparent px-3 text-[14px] font-medium text-white transition-all hover:border-white hover:bg-white/10"
              />
            </div>
          </div>

          {/* Accordion List */}
          <div className="mt-8 border-t border-white/15">
            {accordionSections.map((section) => {
              const isOpen = !!openSections[section.title];
              return (
                <div
                  key={section.title}
                  className="border-b border-white/15 transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => toggleSection(section.title)}
                    className="flex w-full items-center justify-between py-4 text-left text-[16.5px] font-medium text-white transition-opacity hover:opacity-85"
                    aria-expanded={isOpen}
                  >
                    <span>{section.title}</span>
                    <FiChevronDown
                      className={`text-lg text-white/80 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      aria-hidden="true"
                    />
                  </button>

                  <div
                    className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                      isOpen ? "grid-rows-[1fr] pb-4" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <ul className="space-y-2 pt-1 pl-1">
                        {section.links.map((link) => (
                          <li key={link.label}>
                            <FooterLink
                              href={link.href}
                              className="py-1 text-[14.5px]"
                            >
                              {link.label}
                            </FooterLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ========================================================= */}
        {/* SOCIAL & COPYRIGHT ROW                                    */}
        {/* ========================================================= */}
        <div className="mt-14 flex items-center justify-between sm:mt-16 lg:mt-20">
          <div className="flex items-center gap-4 sm:gap-5">
            <a
              href="#instagram"
              aria-label="Instagram"
              className="text-white/90 transition-opacity hover:opacity-100 hover:text-white"
            >
              <FiInstagram size={19} />
            </a>
            <a
              href="#linkedin"
              aria-label="LinkedIn"
              className="text-white/90 transition-opacity hover:opacity-100 hover:text-white"
            >
              <FiLinkedin size={19} />
            </a>
            <a
              href="#facebook"
              aria-label="Facebook"
              className="text-white/90 transition-opacity hover:opacity-100 hover:text-white"
            >
              <FiFacebook size={19} />
            </a>
            <a
              href="#x"
              aria-label="X"
              className="flex items-center text-[15px] font-semibold text-white/90 transition-opacity hover:opacity-100 hover:text-white"
            >
              𝕏
            </a>
          </div>

          <p className="text-[13.5px] text-white/80">
            &copy; 2026 Stellar Management
          </p>
        </div>

        {/* ========================================================= */}
        {/* NOTICES ROW                                               */}
        {/* ========================================================= */}
        <div className="mt-6 border-t border-white/15 pt-5 pb-6 sm:mt-7 sm:pt-6">
          <div className="flex flex-col gap-2.5 text-[13.5px] text-white/85 sm:flex-row sm:items-center sm:justify-between">
            <FooterLink href="#dhr" className="text-[13.5px]">
              DHR Reasonable Accommodation Notice
            </FooterLink>
            <FooterLink href="#equal-housing" className="text-[13.5px]">
              Equal Housing Opportunity
            </FooterLink>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* BIG HALF "STELLAR" SVG WORDMARK AT THE BOTTOM             */}
      {/* ========================================================= */}
      <div
        className="pointer-events-none relative mx-auto mt-6 w-full select-none overflow-hidden max-w-[105rem] aspect-1496/335 sm:mt-10"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 1496 445"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto text-white block will-change-transform"
        >
          {/* Letter S */}
          <path
            data-stellar-letter="0"
            d="M148.598 0C170.56 2.86717e-06 191.121 1.86936 210.747 5.37402C230.139 8.87867 250.7 14.7193 272.195 22.6631L275.233 133.411H269.859C258.411 106.542 244.626 84.3461 228.738 67.29C212.617 50.0003 195.326 37.3829 176.635 29.9062C157.943 21.9625 137.616 17.9903 115.888 17.9902C92.5232 17.9902 74.2985 22.8976 61.6816 32.9443C49.2987 42.5237 43.2237 55.8411 43.2236 73.3643C43.2236 89.2521 48.13 103.038 58.1768 114.486C68.457 125.935 81.3077 135.748 96.2607 143.691C111.448 151.635 131.775 160.981 157.009 171.729C188.784 184.813 214.252 196.729 233.411 207.477C252.57 218.224 268.925 232.477 282.242 250.233C296.261 267.99 303.037 290.187 303.037 316.355C303.037 343.925 296.261 368.692 282.943 390.654C269.392 412.15 257.476 428.271 231.542 437.617C219.159 442.056 204.205 444.159 196.495 444.159C196.55 444.151 204.951 442.964 218.457 435.047C226.868 430.374 238.083 419.86 244.158 410.28C250.467 400.701 253.737 389.252 253.737 375.701C253.737 355.841 248.364 339.253 237.616 325.701C226.869 311.916 213.784 300.467 198.13 291.822C182.943 282.71 162.149 272.663 135.514 261.448C105.607 248.831 82.0087 237.15 64.4854 226.869C47.4293 216.589 32.7093 202.804 20.3262 185.748C8.41029 168.692 2.33594 147.663 2.33594 122.663C2.33602 99.2988 8.17746 78.2706 19.626 59.5791C31.5418 40.8878 48.3638 26.4014 70.3262 16.1211C92.5224 5.37343 118.691 0 148.598 0ZM54.6729 329.905C84.5794 329.905 109.112 354.438 109.112 384.578C109.112 414.718 84.5794 439.251 54.4395 439.251C24.533 439.017 0.000227714 414.718 0 384.578C0 354.438 24.5327 329.905 54.6729 329.905Z"
            fill="currentColor"
          />

          {/* Letter t */}
          <path
            data-stellar-letter="1"
            d="M490.187 389.491C480.14 407.715 470.327 418.463 457.477 426.874C445.093 435.285 431.308 439.491 416.355 439.491C396.963 439.491 381.776 433.182 371.028 420.565C360.28 407.949 354.907 389.958 354.907 366.593C354.907 305.378 353.738 253.977 354.673 203.042L326.869 202.575V198.603L364.252 163.089L418.458 112.855C420.561 111.22 422.196 114.023 422.196 116.593V183.182L486.682 180.612C487.85 190.425 485.748 198.603 480.841 205.145L421.963 204.444V356.78C421.963 370.799 424.299 380.612 428.738 386.687C433.178 392.528 439.953 395.565 449.065 395.565C454.673 395.565 460.514 394.864 466.822 393.463C473.131 391.827 479.439 390.892 488.785 386.453L490.187 389.491Z"
            fill="currentColor"
          />

          {/* Letter e */}
          <path
            data-stellar-letter="2"
            d="M688.787 374.766C676.17 380.841 662.618 383.878 648.132 383.878C632.245 383.878 618.459 380.14 607.011 372.664C595.562 365.187 586.45 353.738 580.142 338.551C574.067 323.364 571.03 308.878 571.03 285.748C571.03 284.346 571.03 282.944 571.03 281.542H726.637C727.572 274.299 728.273 267.757 728.273 261.682C728.273 246.028 724.301 232.009 716.59 219.392C709.114 206.776 698.132 196.963 683.413 189.953C669.16 182.477 652.572 178.738 633.413 178.738C611.45 178.738 590.656 184.813 571.263 196.963C552.338 209.112 538.086 226.869 526.17 248.598C514.721 270.327 512.151 293.458 513.319 316.822C514.488 340.421 521.731 365.654 532.245 383.878C541.123 399.533 550.002 407.944 565.188 419.159C580.375 430.374 600.235 436.916 622.899 436.916C648.366 436.916 673.132 430.841 690.422 415.187C707.712 399.299 721.731 376.402 727.805 346.963L724.768 345.327C715.422 358.645 701.871 368.224 688.787 374.766ZM577.338 231.308C582.011 216.822 588.319 206.075 596.263 199.299C604.441 192.29 614.02 188.551 624.768 188.551C635.983 188.551 644.861 193.692 651.637 203.738C658.413 213.551 661.917 228.037 661.917 246.963C661.917 255.841 660.282 262.149 657.245 265.888C654.207 269.626 648.6 271.729 640.422 271.963L571.03 272.897C571.731 256.542 573.833 242.757 577.338 231.308Z"
            fill="currentColor"
          />

          {/* Letter l (first) */}
          <path
            data-stellar-letter="3"
            d="M755.845 424.303C755.845 424.303 772.2 416.592 775.705 410.518C779.209 404.443 779.209 400.237 779.209 391.592L779.677 127.574C779.677 119.162 780.144 115.424 776.172 110.284C772.2 105.144 758.415 101.172 758.415 101.172V97.1998L842.761 65.6577C844.864 65.6577 845.798 66.5923 845.798 68.6951L845.331 391.592C845.331 400.003 846.266 406.312 848.368 410.518C852.574 419.162 868.695 424.303 868.695 424.303V428.275H755.611V424.303H755.845Z"
            fill="currentColor"
          />

          {/* Letter l (second) */}
          <path
            data-stellar-letter="4"
            d="M902.568 424.303C902.568 424.303 918.923 416.592 922.427 410.518C925.932 404.443 925.932 400.237 925.932 391.592L926.399 127.574C926.399 119.162 926.867 115.424 922.895 110.284C918.923 105.144 905.138 101.172 905.138 101.172V97.1998L989.483 65.6577C991.586 65.6577 992.521 66.5923 992.521 68.6951L992.054 391.592C992.054 400.003 992.988 406.312 995.091 410.518C999.297 419.162 1015.42 424.303 1015.42 424.303V428.275H902.334V424.303H902.568Z"
            fill="currentColor"
          />

          {/* Letter a */}
          <path
            data-stellar-letter="5"
            d="M1157.71 170.323C1192.05 170.323 1216.58 177.333 1231.07 191.585C1246.02 205.837 1253.5 228.501 1253.5 259.342V362.847C1253.5 375.931 1254.9 385.043 1257.71 389.716C1260.28 394.388 1265.18 396.725 1272.42 396.726V396.959H1283.17V401.164C1276.16 411.912 1268.22 419.856 1259.81 424.996C1251.63 429.669 1242.28 432.006 1231.77 432.006C1217.52 432.006 1206.3 427.333 1198.59 418.221C1191.35 409.576 1187.61 397.192 1186.91 380.837C1178.73 392.286 1171.26 401.865 1164.48 409.108C1156.07 418.221 1147.19 424.996 1138.08 428.968C1129.43 432.94 1119.62 435.043 1108.64 435.043C1089.48 435.043 1073.59 429.202 1060.74 417.753C1047.89 405.837 1041.35 390.65 1041.35 371.959C1041.35 356.071 1046.02 342.52 1055.6 331.305C1065.18 320.09 1080.84 310.51 1103.03 302.8C1124.06 295.557 1152.1 289.015 1187.14 283.875V254.902C1187.14 226.631 1184.11 207.005 1177.56 196.258C1171.26 185.51 1155.6 171.024 1143.45 170.79C1148.13 170.556 1152.8 170.323 1157.71 170.323ZM1187.38 292.52C1160.74 296.725 1141.12 303.734 1128.73 313.313C1115.18 323.594 1108.41 337.613 1108.41 355.137C1108.41 366.118 1111.91 375.23 1118.69 382.006C1125.46 388.314 1134.34 391.585 1145.09 391.585C1153.5 391.585 1160.98 389.716 1167.52 385.978C1173.36 382.707 1180.13 377.332 1187.38 369.622V292.52ZM1097.43 192.292C1116.12 192.292 1131.3 207.479 1131.3 226.17C1131.3 244.861 1116.12 260.049 1097.43 260.049C1078.73 260.049 1063.55 244.862 1063.55 226.17C1063.55 207.478 1078.73 192.292 1097.43 192.292Z"
            fill="currentColor"
          />

          {/* Letter r */}
          <path
            data-stellar-letter="6"
            d="M1404.21 168.456C1406.32 167.755 1407.25 169.623 1407.25 171.96V391.352C1407.25 400.464 1408.89 406.773 1412.39 410.278C1415.9 413.783 1423.37 416.586 1435.29 418.923L1458.18 424.063V428.035H1310.99V424.063L1325.24 418.923C1331.31 416.82 1335.52 414.016 1337.39 410.278C1339.73 406.306 1340.89 399.997 1340.89 391.352V229.904C1340.89 221.727 1339.73 216.119 1337.39 213.082C1335.29 209.577 1331.32 207.241 1325.24 205.839L1317.53 203.268V199.297L1404.21 168.456ZM1461.69 173.6C1480.38 173.601 1495.57 188.787 1495.57 207.478C1495.57 226.17 1480.38 241.357 1461.69 241.357C1443 241.357 1427.81 226.17 1427.81 207.478C1427.81 188.787 1443 173.6 1461.69 173.6Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </footer>
  );
}
