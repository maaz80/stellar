"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FiChevronDown } from "react-icons/fi";

const SERVICE_OPTIONS = [
  "Corporate Inquiries",
  "Careers/HR",
  "Resident Services",
  "Acquisitions",
  "Retail Leasing",
  "Press Inquiries",
  "Other",
];

export default function ContactPageContent() {
  const containerRef = useRef(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        service: "",
        message: "",
      });
    }, 4000);
  };

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    gsap.registerPlugin(ScrollTrigger);
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion) return;

    const headingLines = container.querySelectorAll("[data-contact-heading]");
    const thumb = container.querySelector("[data-contact-thumb]");
    const divider = container.querySelector("[data-contact-divider]");
    const formFields = container.querySelectorAll("[data-contact-field]");
    const contactInfos = container.querySelectorAll("[data-contact-info]");
    const submitBtn = container.querySelector("[data-contact-submit]");

    const context = gsap.context(() => {
      // 1. Heading lines animate up from below
      gsap.fromTo(
        headingLines,
        { autoAlpha: 0, yPercent: 110 },
        {
          autoAlpha: 1,
          yPercent: 0,
          duration: 1.15,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: container,
            start: "top 85%",
            once: true,
          },
        }
      );

      // 2. Inline thumbnail pops in with scale
      if (thumb) {
        gsap.fromTo(
          thumb,
          { autoAlpha: 0, scale: 0.72 },
          {
            autoAlpha: 1,
            scale: 1,
            duration: 1.05,
            delay: 0.22,
            ease: "back.out(1.4)",
            scrollTrigger: {
              trigger: container,
              start: "top 85%",
              once: true,
            },
          }
        );
      }

      // 3. Vertical divider line grows down
      if (divider) {
        gsap.fromTo(
          divider,
          { scaleY: 0, transformOrigin: "top center" },
          {
            scaleY: 1,
            duration: 1.2,
            delay: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: container,
              start: "top 85%",
              once: true,
            },
          }
        );
      }

      // 4. Form fields stagger in
      if (formFields.length) {
        gsap.fromTo(
          formFields,
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.95,
            stagger: 0.08,
            delay: 0.18,
            ease: "power3.out",
            scrollTrigger: {
              trigger: container,
              start: "top 85%",
              once: true,
            },
          }
        );
      }

      // 5. Submit button
      if (submitBtn) {
        gsap.fromTo(
          submitBtn,
          { autoAlpha: 0, y: 22 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1.0,
            delay: 0.45,
            ease: "power3.out",
            scrollTrigger: {
              trigger: container,
              start: "top 85%",
              once: true,
            },
          }
        );
      }

      // 6. Contact info reveals
      if (contactInfos.length) {
        gsap.fromTo(
          contactInfos,
          { autoAlpha: 0, y: 20 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1.0,
            delay: 0.35,
            ease: "power3.out",
            scrollTrigger: {
              trigger: container,
              start: "top 85%",
              once: true,
            },
          }
        );
      }
    }, container);

    return () => context.revert();
  }, []);

  const buttonText = isSubmitted ? "Message sent!" : "Send form";

  return (
    <section
      ref={containerRef}
      id="contact-form"
      className="relative w-full bg-white px-5 pt-28 pb-20 text-[#191716] sm:px-8 sm:pt-36 sm:pb-28 lg:px-14 lg:pt-40 lg:pb-32 xl:px-[2.5vw]"
    >
      <div className="mr-auto max-w-312.5">
        <div className="flex flex-col lg:flex-row lg:items-stretch lg:justify-between">
          {/* ========================================================= */}
          {/* LEFT COLUMN: Heading & Contact Info                       */}
          {/* ========================================================= */}
          <div className="flex flex-col justify-between lg:w-120 lg:shrink-0">
            <div>
              <h1 className="text-[clamp(2.75rem,5.2vw,4.75rem)] font-medium leading-[1.1] tracking-[-0.035em] text-[#191716]">
                <span className="block overflow-hidden pb-2 sm:pb-3.5 -mb-2 sm:-mb-3.5">
                  <span data-contact-heading className="block">
                    Let&rsquo;s get
                  </span>
                </span>
                <span className="mt-1 flex items-center gap-x-2.5 sm:gap-x-3 overflow-hidden pb-2 sm:pb-3 -mb-2 sm:-mb-3">
                  <span data-contact-heading className="inline-block">
                    in
                  </span>
                  <span
                    data-contact-thumb
                    className="relative inline-flex h-[0.92em] w-[1.48em] shrink-0 overflow-hidden rounded-md align-middle shadow-xs sm:rounded-lg"
                  >
                    <Image
                      src="/assets/contact-touch.png"
                      alt="Team member"
                      fill
                      sizes="120px"
                      className="object-cover"
                      priority
                    />
                  </span>
                  <span
                    data-contact-heading
                    className="font-(family-name:--font-playfair) font-medium italic inline-block"
                  >
                    touch
                  </span>
                </span>
              </h1>
            </div>

            {/* Contact Info (desktop bottom-left, hidden on mobile) */}
            <div data-contact-info className="hidden pt-16 lg:block">
              <h2 className="text-[13px] font-semibold tracking-[0.16em] text-[#616161] uppercase">
                Contact Info
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-[#616161]">
                44 W 28th St, 6th Floor NY, 10001
              </p>
              <div className="mt-1.5">
                <a
                  href="tel:+12124060030"
                  className="link-underline-sweep text-[15px] text-[#616161] transition-colors hover:text-[#191716]"
                >
                  +1 212-406-0030
                </a>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* VERTICAL DIVIDER (desktop only)                          */}
          {/* ========================================================= */}
          <div
            data-contact-divider
            aria-hidden="true"
            className="hidden w-px self-stretch bg-black/10 lg:block lg:mx-1 xl:mx-4"
          />

          {/* ========================================================= */}
          {/* RIGHT COLUMN: The Form (Width capped to ~574px)          */}
          {/* ========================================================= */}
          <div className="w-full lg:w-143.5 lg:shrink-0 mt-10 md:mt-0">
            <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
              {/* Row 1: Name & Email */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div data-contact-field className="flex flex-col">
                  <label
                    htmlFor="contact-name"
                    className="mb-2 text-[14px] font-medium text-[#191716]"
                  >
                    Name*
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter name"
                    className="h-12 w-full border border-black/15 bg-white px-4 text-[15px] text-[#191716] placeholder:text-[#8e8e8e] transition-all focus:border-[#081a4d] focus:outline-none focus:ring-1 focus:ring-[#081a4d]"
                  />
                </div>

                <div data-contact-field className="flex flex-col">
                  <label
                    htmlFor="contact-email"
                    className="mb-2 text-[14px] font-medium text-[#191716]"
                  >
                    Email*
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                    className="h-12 w-full border border-black/15 bg-white px-4 text-[15px] text-[#191716] placeholder:text-[#8e8e8e] transition-all focus:border-[#081a4d] focus:outline-none focus:ring-1 focus:ring-[#081a4d]"
                  />
                </div>
              </div>

              {/* Row 2: Phone number & Service */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div data-contact-field className="flex flex-col">
                  <label
                    htmlFor="contact-phone"
                    className="mb-2 text-[14px] font-medium text-[#191716]"
                  >
                    Phone number*
                  </label>
                  <input
                    id="contact-phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone"
                    className="h-12 w-full border border-black/15 bg-white px-4 text-[15px] text-[#191716] placeholder:text-[#8e8e8e] transition-all focus:border-[#081a4d] focus:outline-none focus:ring-1 focus:ring-[#081a4d]"
                  />
                </div>

                <div data-contact-field className="flex flex-col">
                  <label
                    htmlFor="contact-service"
                    className="mb-2 text-[14px] font-medium text-[#191716]"
                  >
                    Service*
                  </label>
                  <div className="relative">
                    <select
                      id="contact-service"
                      name="service"
                      required
                      value={formData.service}
                      onChange={handleChange}
                      className={`h-12 w-full cursor-pointer appearance-none border border-black/15 bg-white px-4 pr-10 text-[15px] transition-all focus:border-[#081a4d] focus:outline-none focus:ring-1 focus:ring-[#081a4d] ${
                        formData.service ? "text-[#191716]" : "text-[#8e8e8e]"
                      }`}
                    >
                      <option value="" disabled hidden>
                        Select service
                      </option>
                      {SERVICE_OPTIONS.map((opt) => (
                        <option
                          key={opt}
                          value={opt}
                          className="text-[#191716]"
                        >
                          {opt}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-black/50">
                      <FiChevronDown className="text-base" aria-hidden="true" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 3: Message */}
              <div data-contact-field className="flex flex-col">
                <label
                  htmlFor="contact-message"
                  className="mb-2 text-[14px] font-medium text-[#191716]"
                >
                  Message*
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Enter message"
                  className="w-full resize-none border border-black/15 bg-white p-4 text-[15px] text-[#191716] placeholder:text-[#8e8e8e] transition-all focus:border-[#081a4d] focus:outline-none focus:ring-1 focus:ring-[#081a4d]"
                />
              </div>

              {/* Submit Button */}
              <div data-contact-submit className="pt-2">
                <button
                  type="submit"
                  className="rolling-text-link group flex h-12 w-full cursor-pointer items-center justify-center rounded-bl-xl rounded-tr-xl bg-[#081a4d] px-6 text-[15px] font-medium text-white transition-[border-radius,background-color,box-shadow] duration-300 ease-out hover:rounded-bl-3xl hover:rounded-tr-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#081a4d] focus-visible:ring-offset-2"
                >
                  <span className="h-6 overflow-hidden">
                    <span aria-hidden="true" className="flex">
                      {Array.from(buttonText).map((letter, index) => (
                        <span className="rolling-text-letter" key={index}>
                          <span
                            className="rolling-text-letter-track"
                            style={{ "--letter-index": index }}
                          >
                            <span className="block h-6 leading-6">
                              {letter === " " ? "\u00a0" : letter}
                            </span>
                            <span className="block h-6 leading-6">
                              {letter === " " ? "\u00a0" : letter}
                            </span>
                          </span>
                        </span>
                      ))}
                    </span>
                  </span>
                </button>
              </div>
            </form>

            {/* Contact Info (Mobile view: placed below the form) */}
            <div
              data-contact-info
              className="mt-14 border-t border-black/10 pt-10 lg:hidden"
            >
              <h2 className="text-[13px] font-semibold tracking-[0.16em] text-[#616161] uppercase">
                Contact Info
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-[#616161]">
                44 W 28th St, 6th Floor NY, 10001
              </p>
              <div className="mt-1.5">
                <a
                  href="tel:+12124060030"
                  className="link-underline-sweep text-[15px] text-[#616161] transition-colors hover:text-[#191716]"
                >
                  +1 212-406-0030
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
