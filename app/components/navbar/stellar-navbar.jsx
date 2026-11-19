"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  FiArrowDown,
  FiArrowUpRight,
  FiFacebook,
  FiInstagram,
  FiLinkedin,
} from "react-icons/fi";
import CapabilitiesMenu from "./capabilities/capabilities-menu";
import RollingTextLink from "../rolling-text-link/rolling-text-link";

const NAVIGATION = [
  {
    name: "Company",
    links: ["About", "Purpose", "Approach", "Team", "Careers", "News"],
  },
  {
    name: "Capabilities",
    links: ["Development", "Investment", "Property management", "Our portfolio"],
  },
  {
    name: "Rentals",
    links: ["Find a home", "Available apartments", "Resident services"],
  },
  {
    name: "Portal",
    links: ["Resident portal", "Owner portal"],
  },
];

export default function StellarNavbar({
  isHeroPage = false,
  onStateChange,
}) {
  const pathname = usePathname();
  const menuRef = useRef(null);
  const menuListRef = useRef(null);
  const menuFooterRef = useRef(null);
  const mobileMenuListRef = useRef(null);
  const mobileMenuFooterRef = useRef(null);
  const menuTimelineRef = useRef(null);
  const linkTimelineRef = useRef(null);
  const footerTimelineRef = useRef(null);
  const closeTimelineRef = useRef(null);
  const closeTimerRef = useRef(null);
  const backdropTimerRef = useRef(null);
  const drawerClosingTimerRef = useRef(null);

  const [activeSection, setActiveSection] = useState("Company");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDrawerClosing, setIsDrawerClosing] = useState(false);
  const [menuBackdropVisible, setMenuBackdropVisible] = useState(false);
  const [mobileExpandedSection, setMobileExpandedSection] = useState(null);
  const [navbarVisible, setNavbarVisible] = useState(true);
  const [isHeroSection, setIsHeroSection] = useState(isHeroPage);
  const [isKeyFiguresDark, setIsKeyFiguresDark] = useState(false);

  const menuOpenRef = useRef(false);
  const previousSectionRef = useRef(activeSection);
  const previousScrollYRef = useRef(0);

  const activeNavigation = NAVIGATION.find(
    (section) => section.name === activeSection
  );

  // Notify parent of state changes if callback is provided
  useEffect(() => {
    onStateChange?.({
      isHeroSection,
      navbarVisible,
      menuOpen,
    });
  }, [isHeroSection, navbarVisible, menuOpen, onStateChange]);

  // Always ensure navbar is visible and properly colored on route mount
  useLayoutEffect(() => {
    previousScrollYRef.current = 0;
    setNavbarVisible(true);
    setIsHeroSection(isHeroPage);
    setIsKeyFiguresDark(false);
    setMenuOpen(false);
    setIsDrawerClosing(false);
    menuOpenRef.current = false;
  }, [isHeroPage, pathname]);

  // Scroll detection for navbar visibility, hero section check, and key figures dark background
  useEffect(() => {
    previousScrollYRef.current = Math.max(0, window.scrollY);

    function checkKeyFiguresDark() {
      if (isHeroPage && pathname === "/") {
        const nextSec = document.querySelector("#next-section");
        const aboutSec = document.querySelector("#about-us");
        if (nextSec) {
          const nextRect = nextSec.getBoundingClientRect();
          const aboutRect = aboutSec?.getBoundingClientRect();
          const isOverDark =
            nextRect.top <= window.innerHeight &&
            (!aboutRect || aboutRect.top > window.innerHeight - 60);
          setIsKeyFiguresDark(isOverDark);
        } else {
          setIsKeyFiguresDark(false);
        }
      } else {
        setIsKeyFiguresDark(false);
      }
    }

    function handleScroll() {
      const currentY = Math.max(0, window.scrollY);
      const delta = currentY - previousScrollYRef.current;

      if (isHeroPage) {
        if (currentY < 120) {
          setIsHeroSection(true);
        } else {
          const hero =
            document.querySelector("#home")?.closest("section") ||
            document.querySelector("#about-hero")?.closest("section");
          setIsHeroSection(
            hero
              ? hero.getBoundingClientRect().bottom > 80
              : currentY < window.innerHeight
          );
        }
      } else {
        setIsHeroSection(false);
      }

      checkKeyFiguresDark();

      if (menuOpenRef.current) {
        setNavbarVisible(true);
        previousScrollYRef.current = currentY;
        return;
      }

      if (currentY < 120) {
        setNavbarVisible(true);
        previousScrollYRef.current = currentY;
      } else if (delta > 6) {
        setNavbarVisible(false);
        previousScrollYRef.current = currentY;
      } else if (delta < -4) {
        setNavbarVisible(true);
        previousScrollYRef.current = currentY;
      }
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    gsap.registerPlugin(ScrollTrigger);
    let st;
    if (isHeroPage && pathname === "/") {
      const nextSec = document.querySelector("#next-section");
      const aboutSec = document.querySelector("#about-us");
      if (nextSec) {
        st = ScrollTrigger.create({
          trigger: nextSec,
          endTrigger: aboutSec || nextSec,
          start: "top bottom",
          end: aboutSec ? "top bottom" : "bottom top",
          onEnter: () => setIsKeyFiguresDark(true),
          onLeave: () => setIsKeyFiguresDark(false),
          onEnterBack: () => setIsKeyFiguresDark(true),
          onLeaveBack: () => setIsKeyFiguresDark(false),
        });
      }
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      st?.kill();
    };
  }, [isHeroPage, pathname]);

  function getMenuHeight() {
    if (typeof window === "undefined") return 384;
    if (window.matchMedia("(max-width: 767px)").matches) {
      const mobileList = mobileMenuListRef.current;
      const mobileFooter = mobileMenuFooterRef.current;
      const mobileNav = mobileList?.parentElement;

      if (!mobileList || !mobileFooter || !mobileNav) return 384;

      const contentHeight = Math.ceil(
        mobileNav.offsetTop +
          mobileList.offsetHeight +
          mobileFooter.offsetHeight +
          24
      );
      return Math.min(contentHeight, Math.floor(window.innerHeight * 0.6));
    }

    if (activeSection === "Capabilities")
      return Math.max(240, window.innerHeight - 40);

    const list = menuListRef.current;
    const footer = menuFooterRef.current;
    const listContainer = list?.offsetParent;

    if (!list || !footer || !listContainer) return 384;

    return Math.ceil(
      listContainer.offsetTop + list.offsetHeight + footer.offsetHeight + 24
    );
  }

  function animateMenuLinks(direction) {
    const list = window.matchMedia("(max-width: 767px)").matches
      ? mobileMenuListRef.current
      : menuListRef.current;
    const links = list?.children;
    if (!links?.length) return;

    linkTimelineRef.current?.kill();
    gsap.killTweensOf(links);
    linkTimelineRef.current = gsap
      .timeline()
      .fromTo(
        links,
        {
          autoAlpha: 0,
          y: direction === "top" ? -28 : 32,
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: "power3.out",
          clearProps: "transform,opacity,visibility",
        }
      );
  }

  function getMenuFooterItems() {
    const footer = window.matchMedia("(max-width: 767px)").matches
      ? mobileMenuFooterRef.current
      : menuFooterRef.current;
    return footer?.querySelectorAll("[data-menu-footer-item]");
  }

  const animateMenuFooter = useCallback(() => {
    const footer = window.matchMedia("(max-width: 767px)").matches
      ? mobileMenuFooterRef.current
      : menuFooterRef.current;
    const items = footer?.querySelectorAll("[data-menu-footer-item]");
    if (!items?.length) return;

    gsap.killTweensOf(items);
    gsap.set(items, { autoAlpha: 0, x: 24 });
    footerTimelineRef.current?.kill();
    footerTimelineRef.current = gsap
      .timeline()
      .to(items, {
        autoAlpha: 1,
        x: 0,
        duration: 0.45,
        stagger: { each: 0.1, from: "end" },
        ease: "power3.out",
        clearProps: "transform,opacity,visibility",
      });
  }, []);

  function cancelMenuClose() {
    clearTimeout(drawerClosingTimerRef.current);
    setIsDrawerClosing(false);
    const wasClosing = closeTimelineRef.current?.isActive();
    closeTimelineRef.current?.kill();
    closeTimelineRef.current = null;

    if (wasClosing) {
      animateMenuFooter();
      if (!window.matchMedia("(max-width: 767px)").matches)
        animateMenuLinks("top");
    }
  }

  function reverseMenuTimeline() {
    const timeline = menuTimelineRef.current;
    if (!timeline) {
      setMenuBackdropVisible(false);
      setIsDrawerClosing(false);
      return;
    }

    clearTimeout(backdropTimerRef.current);
    clearTimeout(drawerClosingTimerRef.current);

    if (timeline.progress() === 0) {
      setMenuBackdropVisible(false);
      setIsDrawerClosing(false);
      return;
    }

    timeline.timeScale(1.8);
    timeline.reverse();

    const remainingDuration =
      (timeline.totalDuration() * timeline.progress() * 1000) /
      Math.abs(timeline.timeScale());

    backdropTimerRef.current = setTimeout(
      () => setMenuBackdropVisible(false),
      Math.max(0, remainingDuration - 200)
    );

    drawerClosingTimerRef.current = setTimeout(() => {
      setIsDrawerClosing(false);
    }, Math.max(0, remainingDuration + 40));
  }

  function hideMenu() {
    if (!menuOpenRef.current) return;
    menuOpenRef.current = false;
    setMenuOpen(false);
    setIsDrawerClosing(true);
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const links = mobile
      ? mobileMenuListRef.current?.children
      : menuListRef.current?.children;
    const footerItems = getMenuFooterItems();

    if (!links?.length || (menuTimelineRef.current?.progress() ?? 0) < 1) {
      reverseMenuTimeline();
      return;
    }

    linkTimelineRef.current?.kill();
    linkTimelineRef.current = null;
    footerTimelineRef.current?.kill();
    footerTimelineRef.current = null;
    gsap.killTweensOf(links);
    if (footerItems?.length) gsap.killTweensOf(footerItems);
    closeTimelineRef.current?.kill();
    closeTimelineRef.current = gsap
      .timeline({
        onComplete: () => {
          closeTimelineRef.current = null;
          if (!menuOpenRef.current) reverseMenuTimeline();
        },
      })
      .to(links, {
        autoAlpha: 0,
        y: 28,
        duration: 0.5,
        stagger: { each: 0.08, from: "end" },
        ease: "power2.in",
      })
      .to(
        footerItems ?? [],
        {
          autoAlpha: 0,
          x: 24,
          duration: 0.35,
          stagger: { each: 0.06, from: "start" },
          ease: "power2.in",
        },
        0
      )
      .call(
        () => {
          if (!menuOpenRef.current) reverseMenuTimeline();
        },
        [],
        0.55
      );
    closeTimelineRef.current.timeScale(1.8);
  }

  useLayoutEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;

    const context = gsap.context(() => {
      gsap.set(menu, { height: getMenuHeight() });
      gsap.set(menuListRef.current?.children ?? [], { autoAlpha: 0 });
      gsap.set(menu.querySelectorAll("[data-menu-footer-item]"), {
        autoAlpha: 0,
        x: 24,
      });
      menuTimelineRef.current = gsap
        .timeline({
          paused: true,
          onReverseComplete: () => {
            clearTimeout(drawerClosingTimerRef.current);
            setIsDrawerClosing(false);
            setMenuBackdropVisible(false);
          },
        })
        .fromTo(
          menu,
          { yPercent: -101, autoAlpha: 0 },
          {
            yPercent: 0,
            autoAlpha: 1,
            duration: 0.85,
            ease: "power3.out",
          }
        )
        .call(
          () => {
            if (!menuOpenRef.current) return;
            if (window.matchMedia("(max-width: 767px)").matches) {
              animateMenuFooter();
            } else {
              animateMenuLinks("top");
              animateMenuFooter();
            }
          },
          [],
          0.35
        );
    });

    return () => {
      clearTimeout(closeTimerRef.current);
      clearTimeout(backdropTimerRef.current);
      clearTimeout(drawerClosingTimerRef.current);
      linkTimelineRef.current?.kill();
      footerTimelineRef.current?.kill();
      closeTimelineRef.current?.kill();
      context.revert();
      menuTimelineRef.current = null;
      linkTimelineRef.current = null;
      footerTimelineRef.current = null;
      closeTimelineRef.current = null;
    };
  }, [animateMenuFooter]);

  useLayoutEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;

    gsap.to(menu, {
      height: getMenuHeight(),
      duration: 0.6,
      ease: "power2.inOut",
      overwrite: "auto",
    });
  }, [activeSection, mobileExpandedSection]);

  useLayoutEffect(() => {
    if (!mobileExpandedSection) return;

    const links = mobileMenuListRef.current?.querySelectorAll(
      "[data-mobile-sub-link]"
    );
    if (!links?.length) return;

    gsap.fromTo(
      links,
      { autoAlpha: 0, y: -12 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: "power3.out",
        clearProps: "transform,opacity,visibility",
      }
    );
  }, [mobileExpandedSection]);

  useLayoutEffect(() => {
    const sectionChanged = previousSectionRef.current !== activeSection;
    previousSectionRef.current = activeSection;

    if (!menuOpenRef.current) return;

    if (sectionChanged && (menuTimelineRef.current?.progress() ?? 0) >= 1) {
      animateMenuLinks("bottom");
    }
  }, [activeSection, menuOpen]);

  function showMenu(section) {
    clearTimeout(closeTimerRef.current);
    clearTimeout(backdropTimerRef.current);
    clearTimeout(drawerClosingTimerRef.current);
    cancelMenuClose();
    setActiveSection(section);
    menuOpenRef.current = true;
    setMenuBackdropVisible(true);
    setIsDrawerClosing(false);
    setMenuOpen(true);
    menuTimelineRef.current?.timeScale(1).play();
  }

  function scheduleMenuClose() {
    clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      hideMenu();
    }, 140);
  }

  function closeMenu() {
    clearTimeout(closeTimerRef.current);
    hideMenu();
  }

  function handleMenuPointerEnter() {
    if (window.matchMedia("(max-width: 767px)").matches) return;

    clearTimeout(closeTimerRef.current);
    clearTimeout(backdropTimerRef.current);
    clearTimeout(drawerClosingTimerRef.current);
    cancelMenuClose();
    menuOpenRef.current = true;
    setMenuBackdropVisible(true);
    setIsDrawerClosing(false);
    setMenuOpen(true);
    menuTimelineRef.current?.timeScale(1).play();
  }

  function handleMenuPointerLeave() {
    if (window.matchMedia("(max-width: 767px)").matches) return;
    scheduleMenuClose();
  }

  function toggleMobileMenu() {
    if (menuOpenRef.current) {
      closeMenu();
      return;
    }

    clearTimeout(closeTimerRef.current);
    clearTimeout(backdropTimerRef.current);
    clearTimeout(drawerClosingTimerRef.current);
    menuOpenRef.current = true;
    setMenuBackdropVisible(true);
    setIsDrawerClosing(false);
    setMenuOpen(true);
    menuTimelineRef.current?.timeScale(1).play();
  }

  const showWhiteNavBg = !isHeroSection && !menuOpen && !isDrawerClosing;
  const navTextColorClass = showWhiteNavBg ? "text-[#081a4d]" : "text-white";
  const isFloatingButtonVisible =
    !isHeroSection && navbarVisible && !menuOpen && pathname !== "/contact";

  return (
    <>
      {/* ========================================================= */}
      {/* 1. TOP HEADER BAR                                         */}
      {/* ========================================================= */}
      {/*
        Notice: The header background itself is ALWAYS transparent.
        The blue color ONLY comes from the sliding menu drawer (menuRef)
        coming down from above! This guarantees the blue sheet enters first
        and smoothly sweeps over the header, rather than the header
        prematurely turning blue on hover.
      */}
      <header
        className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between px-3.5 py-6 pointer-events-auto will-change-transform [transition:translate_850ms_cubic-bezier(0.16,1,0.3,1),transform_850ms_cubic-bezier(0.16,1,0.3,1),color_250ms_ease] sm:px-10 lg:px-14 xl:px-[2.5vw] ${navTextColorClass} ${
          navbarVisible || menuOpen
            ? "translate-y-0"
            : "pointer-events-none -translate-y-full"
        }`}
        onPointerLeave={handleMenuPointerLeave}
      >
        {/*
          White background layer for non-hero pages (e.g. /contact or scrolled past hero).
          This sits at -z-10, so when the blue sheet (at z-40) slides down,
          it slides right over this background layer seamlessly!
        */}
        <div
          className={`absolute inset-0 -z-10 transition-opacity duration-300 ease-out ${
            showWhiteNavBg
              ? "bg-white opacity-100 shadow-xs"
              : "opacity-0 pointer-events-none"
          }`}
          aria-hidden="true"
        />

        {/* Brand Logo */}
        <Link
          href="/"
          className={`relative z-10 inline-flex items-center transition-colors duration-250 ${navTextColorClass}`}
          aria-label="Stellar home"
        >
          <svg
            preserveAspectRatio="none"
            viewBox="0 0 95 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-[5.2rem]"
            aria-hidden="true"
          >
            <path
              d="M9.1748 1.69189C10.5085 1.6919 11.7574 1.80525 12.9492 2.01807C14.1268 2.23089 15.3755 2.58552 16.6807 3.06787L16.8652 9.79346H16.5391C15.8438 8.16182 15.0068 6.81358 14.042 5.77783C13.0631 4.72805 12.0128 3.96235 10.8779 3.5083C9.74289 3.02591 8.50795 2.78469 7.18848 2.78467C5.76975 2.78469 4.66264 3.08284 3.89648 3.69287C3.14481 4.27455 2.7764 5.0831 2.77637 6.14697C2.77637 7.11163 3.0737 7.94887 3.68359 8.64404C4.30788 9.33925 5.08904 9.93509 5.99707 10.4175C6.91927 10.8999 8.15338 11.468 9.68555 12.1206C11.6151 12.9151 13.1618 13.6389 14.3252 14.2915C15.4886 14.9442 16.4823 15.8099 17.291 16.8882C18.1421 17.9664 18.5536 19.3141 18.5537 20.9028C18.5537 22.577 18.1417 24.0818 17.333 25.4155C16.5102 26.7206 15.7866 27.6996 14.2119 28.2671C13.4602 28.5366 12.5523 28.6645 12.084 28.6646C12.1013 28.662 12.6084 28.5848 13.417 28.1108C13.9278 27.827 14.6096 27.1886 14.9785 26.6069C15.3614 26.0253 15.5595 25.33 15.5596 24.5073C15.5596 23.3015 15.2335 22.294 14.5811 21.4712C13.9284 20.6341 13.1332 19.9385 12.1826 19.4136C11.2605 18.8603 9.99801 18.2498 8.38086 17.5688C6.56497 16.8028 5.13148 16.0935 4.06738 15.4692C3.03177 14.845 2.13767 14.0077 1.38574 12.9722C0.662162 11.9365 0.293006 10.6592 0.292969 9.14111C0.29297 7.72231 0.647586 6.44511 1.34277 5.31006C2.06636 4.17506 3.08826 3.29566 4.42188 2.67139C5.76971 2.01878 7.35882 1.69192 9.1748 1.69189ZM25.5605 8.54541C25.6881 8.44618 25.7879 8.61602 25.7881 8.77197V12.8159L29.7041 12.6597C29.775 13.2555 29.6475 13.7526 29.3496 14.1499L25.7734 14.1069V23.3579C25.7734 24.2092 25.916 24.8054 26.1855 25.1743C26.4551 25.529 26.8666 25.7134 27.4199 25.7134C27.7604 25.7134 28.1151 25.6706 28.498 25.5854C28.8811 25.4862 29.2646 25.4302 29.832 25.1606L29.917 25.3442C29.3069 26.4509 28.7109 27.104 27.9307 27.6147C27.1788 28.1255 26.3415 28.3813 25.4336 28.3813C24.256 28.3813 23.3333 27.998 22.6807 27.2319C22.0281 26.4658 21.7012 25.3732 21.7012 23.9546C21.7012 20.2372 21.6307 17.1151 21.6875 14.022L19.999 13.9937V13.7524L22.2695 11.5962L25.5605 8.54541ZM3.4707 21.7261C5.2866 21.7264 6.77636 23.2162 6.77637 25.0464C6.77628 26.8766 5.28625 28.3666 3.45605 28.3667C1.64001 28.3525 0.150475 26.8766 0.150391 25.0464C0.150394 23.2161 1.64038 21.7261 3.4707 21.7261ZM38.6133 12.5464C39.7766 12.5464 40.784 12.7731 41.6494 13.2271C42.5433 13.6527 43.21 14.249 43.6641 15.0151C44.1323 15.7813 44.374 16.6329 44.374 17.5835C44.374 17.9523 44.3312 18.3498 44.2744 18.7896H34.8252V19.0444C34.8252 20.4491 35.009 21.3292 35.3779 22.2515C35.761 23.1736 36.3146 23.8687 37.0098 24.3228C37.7049 24.7767 38.5421 25.0034 39.5068 25.0034C40.3864 25.0034 41.2095 24.8195 41.9756 24.4507C42.7701 24.0534 43.5936 23.4713 44.1611 22.6626L44.3457 22.7622C43.9768 24.5498 43.1251 25.94 42.0752 26.9048C41.0252 27.8554 39.5212 28.2241 37.9746 28.2241C36.5984 28.2241 35.392 27.827 34.4697 27.146C33.5477 26.4651 33.0088 25.9539 32.4697 25.0034C31.8313 23.8967 31.3913 22.3641 31.3203 20.9312C31.2494 19.5125 31.4054 18.108 32.1006 16.7886C32.8242 15.4691 33.6896 14.3906 34.8389 13.6528C36.0165 12.915 37.2796 12.5464 38.6133 12.5464ZM70.4502 12.0356C72.5357 12.0356 74.0255 12.4613 74.9053 13.3267C75.8132 14.1922 76.2676 15.5691 76.2676 17.4419V23.7271C76.2676 24.5213 76.3532 25.0752 76.5234 25.3589C76.6796 25.6422 76.9775 25.7846 77.417 25.7847V25.7983H78.0693V26.0542C77.6438 26.7064 77.1619 27.1894 76.6514 27.5015C76.1548 27.7852 75.5867 27.9272 74.9482 27.9272C74.0829 27.9272 73.4018 27.6425 72.9336 27.0894C72.4939 26.5645 72.2663 25.8126 72.2236 24.8198C71.7272 25.5147 71.2736 26.0969 70.8623 26.5366C70.3516 27.0899 69.8121 27.5015 69.2588 27.7427C68.7339 27.9838 68.1375 28.1108 67.4707 28.1108C66.3074 28.1108 65.3428 27.7561 64.5625 27.061C63.7823 26.3376 63.385 25.4155 63.3848 24.2808C63.3848 23.316 63.6684 22.492 64.25 21.811C64.8317 21.1301 65.7831 20.5487 67.1309 20.0806C68.4078 19.6408 70.1102 19.2433 72.2383 18.9312V17.1714C72.2382 15.4552 72.0533 14.2635 71.6562 13.6108C71.2732 12.9582 70.3228 12.0782 69.585 12.064C69.8686 12.0498 70.1524 12.0357 70.4502 12.0356ZM51.3262 5.6792C51.4539 5.6792 51.5107 5.73607 51.5107 5.86377L51.4824 25.4722C51.4824 25.983 51.5393 26.3662 51.667 26.6216C51.9209 27.1434 52.8898 27.4548 52.9014 27.4585V27.6997H46.0342V27.4585H46.0488C46.0721 27.4475 47.0446 26.9861 47.2549 26.6216C47.4676 26.2528 47.4668 25.9971 47.4668 25.4722L47.4951 9.43896C47.4951 8.92841 47.5242 8.70118 47.2832 8.38916C47.042 8.07701 46.2041 7.83545 46.2041 7.83545V7.59424L51.3262 5.6792ZM60.2383 5.6792C60.366 5.6792 60.4229 5.73607 60.4229 5.86377L60.3945 25.4722C60.3945 25.983 60.4514 26.3662 60.5791 26.6216C60.8346 27.1465 61.8135 27.4585 61.8135 27.4585V27.6997H54.9463V27.4585H54.96C54.96 27.4585 55.953 26.9905 56.166 26.6216C56.3788 26.2527 56.3789 25.9971 56.3789 25.4722L56.4072 9.43896C56.4072 8.92832 56.4355 8.70127 56.1943 8.38916C55.9529 8.07711 55.1162 7.83545 55.1162 7.83545V7.59424L60.2383 5.6792ZM85.4189 11.9214C85.5464 11.879 85.6034 11.9927 85.6035 12.1343V25.4575C85.6035 26.0108 85.7032 26.3941 85.916 26.6069C86.1289 26.8197 86.5824 26.9905 87.3057 27.1323L88.6963 27.4438V27.6851H79.7578V27.4438L80.623 27.1323C80.9919 27.0046 81.2478 26.8339 81.3613 26.6069C81.5031 26.3657 81.5742 25.9823 81.5742 25.4575V15.6538C81.5742 15.1576 81.503 14.8168 81.3613 14.6323C81.2336 14.4196 80.9919 14.277 80.623 14.1919L80.1553 14.0356V13.7944L85.4189 11.9214ZM72.2529 19.4565C70.6355 19.7119 69.4434 20.1375 68.6914 20.7192C67.8687 21.3434 67.4571 22.1944 67.457 23.2583C67.4571 23.9249 67.6698 24.4788 68.0811 24.8901C68.4925 25.2731 69.032 25.4722 69.6846 25.4722C70.1952 25.4721 70.6497 25.3583 71.0469 25.1313C71.4014 24.9327 71.8133 24.6061 72.2529 24.1382V19.4565ZM38.0879 13.1421C37.4355 13.1422 36.8539 13.369 36.3574 13.7944C35.875 14.2059 35.4918 14.8591 35.208 15.7388C34.9952 16.434 34.8678 17.271 34.8252 18.2642L39.0391 18.2075C39.5356 18.1933 39.8761 18.0654 40.0605 17.8384C40.2449 17.6113 40.3438 17.228 40.3438 16.689C40.3437 15.5398 40.1312 14.6598 39.7197 14.064C39.3083 13.4541 38.7688 13.1421 38.0879 13.1421ZM66.7891 13.3696C67.9237 13.3698 68.8455 14.2916 68.8457 15.4263C68.8455 16.5609 67.9237 17.4837 66.7891 17.4839C65.6543 17.4839 64.7317 16.561 64.7314 15.4263C64.7316 14.2915 65.6543 13.3696 66.7891 13.3696ZM88.9082 12.2339C90.0431 12.2339 90.9657 13.1567 90.9658 14.2915C90.9657 15.4263 90.043 16.3481 88.9082 16.3481C87.7735 16.3479 86.8517 15.4262 86.8516 14.2915C86.8517 13.1568 87.7735 12.2341 88.9082 12.2339Z"
              fill="currentColor"
            />
          </svg>
        </Link>

        {/* Desktop Navigation Category Buttons */}
        <nav
          aria-label="Main navigation"
          className="relative z-10 ml-auto hidden w-[56%] grid-cols-[22.5%_33.5%_37%_7%] items-center md:grid"
        >
          {NAVIGATION.map((section) => {
            const isActive = menuOpen && activeSection === section.name;

            return (
              <button
                key={section.name}
                type="button"
                onPointerEnter={() => showMenu(section.name)}
                onFocus={() => showMenu(section.name)}
                className={`group relative flex cursor-pointer items-center gap-1.5 text-left text-sm md:text-base font-medium transition-opacity ${
                  menuOpen && !isActive
                    ? "opacity-70 hover:opacity-100"
                    : "opacity-100"
                }`}
              >
                <span className="relative inline-block">
                  <span>{section.name}</span>
                  {/* Animated underline sweep matching FooterLink */}
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none absolute -bottom-1 left-0 h-px w-full bg-current transition-transform duration-300 ease-out ${
                      isActive
                        ? "scale-x-100 origin-left"
                        : "scale-x-0 origin-right group-hover:origin-left group-hover:scale-x-100"
                    }`}
                  />
                </span>
                <FiArrowDown
                  aria-hidden="true"
                  className={`transition-transform duration-300 ${
                    isActive
                      ? "translate-y-0.5"
                      : "group-hover:translate-y-0.5"
                  }`}
                />
              </button>
            );
          })}
        </nav>

        {/* Mobile Menu Toggle Button */}
        <button
          type="button"
          onClick={toggleMobileMenu}
          className="group relative z-10 text-base font-medium md:hidden cursor-pointer"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
        >
          <span className="relative inline-block">
            <span>{menuOpen ? "Close" : "Menu"}</span>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:origin-left group-hover:scale-x-100"
            />
          </span>
        </button>
      </header>

      {/* ========================================================= */}
      {/* 2. MENU OVERLAY BACKDROP                                  */}
      {/* ========================================================= */}
      <div
        className={`pointer-events-none fixed inset-0 z-30 bg-black/20 transition-opacity duration-500 ease-out ${
          menuBackdropVisible ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden="true"
      />

      {/* ========================================================= */}
      {/* 3. SLIDING MENU DRAWER                                    */}
      {/* ========================================================= */}
      {/*
        Notice: menuRef is z-40 and starts from top-0. When user hovers,
        this blue sheet slides down from -101% to 0%, physically entering
        from above top-0, passing right over the header area, and sliding
        down to its full height. The blue sheet comes down first!
      */}
      <div
        ref={menuRef}
        className="invisible fixed inset-x-0 top-0 z-40 flex min-h-60 flex-col bg-[#081a4d] px-6 pt-6 pb-7 text-white sm:px-10 sm:pt-7 sm:pb-9 lg:px-14 xl:px-[2.5vw]"
        onPointerEnter={handleMenuPointerEnter}
        onPointerLeave={handleMenuPointerLeave}
        aria-label={`${activeSection} navigation`}
      >
        {/* Mobile Navigation List (Accordion) */}
        <nav
          aria-label="Mobile navigation"
          className="mobile-menu-scroll absolute inset-x-0 top-18 bottom-18 overflow-y-auto px-3.5 md:hidden"
        >
          <ul ref={mobileMenuListRef} className="space-y-0">
            {NAVIGATION.map((section) => {
              const expanded = mobileExpandedSection === section.name;

              return (
                <li key={section.name}>
                  <button
                    type="button"
                    onClick={() =>
                      setMobileExpandedSection(expanded ? null : section.name)
                    }
                    aria-expanded={expanded}
                    className="flex min-h-11.5 w-full items-center gap-1 text-left text-lg font-medium"
                  >
                    {section.name}
                    <FiArrowDown
                      aria-hidden="true"
                      className={`transition-transform duration-300 ${
                        expanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {expanded && (
                    <ul className="pb-2 pl-3">
                      {section.links.map((link) => (
                        <li key={link}>
                          <Link
                            data-mobile-sub-link
                            href={
                              link === "About"
                                ? "/about"
                                : `/#${link.toLowerCase().replaceAll(" ", "-")}`
                            }
                            onClick={scheduleMenuClose}
                            className="flex min-h-9 items-center text-base font-medium text-white/80 transition-colors hover:text-white"
                          >
                            {link}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Desktop Navigation Links / Capabilities Menu */}
        <div className="mobile-menu-scroll absolute inset-x-0 top-[5.7rem] bottom-18 hidden overflow-y-auto px-6 sm:px-10 lg:px-14 xl:px-[2.5vw] md:block">
          {activeSection === "Capabilities" ? (
            <CapabilitiesMenu
              menuOpen={menuOpen}
              onLinkClick={scheduleMenuClose}
            />
          ) : (
            <ul
              ref={menuListRef}
              key={activeSection}
              className="space-y-5 sm:ml-[44%]"
            >
              {activeNavigation?.links.map((link) => (
                <li key={link} className="will-change-transform">
                  <Link
                    href={
                      link === "About"
                        ? "/about"
                        : `/#${link.toLowerCase().replaceAll(" ", "-")}`
                    }
                    onClick={scheduleMenuClose}
                    className="inline-flex items-center gap-2 text-2xl leading-tight font-medium tracking-tight transition-opacity hover:opacity-65 sm:text-[1.5rem]"
                  >
                    {link}
                    <FiArrowUpRight
                      aria-hidden="true"
                      className="text-sm opacity-0 transition-opacity"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Mobile Menu Footer */}
        <div
          ref={mobileMenuFooterRef}
          className="absolute inset-x-0 bottom-0 flex items-end justify-between px-3.5 pt-5 pb-7 md:hidden"
        >
          <Link
            href="/contact"
            onClick={scheduleMenuClose}
            data-menu-footer-item
            className="text-base font-semibold transition-opacity hover:opacity-60"
          >
            Contact Us
          </Link>
          <div className="flex items-center gap-4">
            <a
              href="#instagram"
              aria-label="Instagram"
              data-menu-footer-item
              className="transition-opacity hover:opacity-60"
            >
              <FiInstagram size={18} />
            </a>
            <a
              href="#linkedin"
              aria-label="LinkedIn"
              data-menu-footer-item
              className="transition-opacity hover:opacity-60"
            >
              <FiLinkedin size={18} />
            </a>
            <a
              href="#facebook"
              aria-label="Facebook"
              data-menu-footer-item
              className="transition-opacity hover:opacity-60"
            >
              <FiFacebook size={18} />
            </a>
            <a
              href="#x"
              aria-label="X"
              data-menu-footer-item
              className="text-sm transition-opacity hover:opacity-60"
            >
              𝕏
            </a>
          </div>
        </div>

        {/* Desktop Menu Footer */}
        <div
          ref={menuFooterRef}
          className="absolute inset-x-0 bottom-0 hidden items-end justify-between px-6 pt-5 pb-7 sm:px-10 sm:pb-9 lg:px-14 xl:px-[2.5vw] md:flex"
        >
          <div className="flex items-center gap-5">
            <a
              href="#instagram"
              aria-label="Instagram"
              data-menu-footer-item
              className="transition-opacity hover:opacity-60"
            >
              <FiInstagram size={19} />
            </a>
            <a
              href="#linkedin"
              aria-label="LinkedIn"
              data-menu-footer-item
              className="transition-opacity hover:opacity-60"
            >
              <FiLinkedin size={19} />
            </a>
            <a
              href="#facebook"
              aria-label="Facebook"
              data-menu-footer-item
              className="transition-opacity hover:opacity-60"
            >
              <FiFacebook size={19} />
            </a>
          </div>
          <Link
            href="/contact"
            onClick={scheduleMenuClose}
            data-menu-footer-item
            className="text-sm font-semibold transition-opacity hover:opacity-60"
          >
            Contact Us{" "}
            <FiArrowUpRight aria-hidden="true" className="ml-1 inline" />
          </Link>
        </div>
      </div>

      {/* Floating "Rent with us" CTA button - slides in from bottom outside screen together with navbar */}
      <div
        className={`fixed right-1 bottom-2 z-40 will-change-transform [transition:translate_850ms_cubic-bezier(0.16,1,0.3,1),transform_850ms_cubic-bezier(0.16,1,0.3,1)] sm:right-10 sm:bottom-3 lg:right-[1.5vw] ${
          isFloatingButtonVisible
            ? "translate-y-0 pointer-events-auto"
            : "pointer-events-none translate-y-36"
        }`}
      >
        <RollingTextLink
          href="/#rentals"
          label="Rent with us"
          className={`inline-flex h-11.5 items-center justify-center rounded-bl-xl rounded-tr-xl px-6 text-base font-medium shadow-lg sm:h-12.5 sm:px-7 ${
            isKeyFiguresDark
              ? "bg-white text-[#081a4d]"
              : "bg-[#081a4d] text-white"
          }`}
        />
      </div>
    </>
  );
}
