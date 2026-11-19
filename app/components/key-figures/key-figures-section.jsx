const figures = [
  { value: "40+", label: "Years in business" },
  { value: "12,000+", label: "Apartments" },
  { value: "100+", label: "Properties" },
  { value: "3M+", label: "Sqft of Office & Retail" },
  { value: "$2B+", label: "In acquisitions since 2011" },
  { value: "500+", label: "Employees" },
];

export default function KeyFiguresSection() {
  return (
    <section
      id="next-section"
      aria-labelledby="key-figures-title"
      className="flex min-h-screen flex-col bg-transparent px-0 pt-61 pb-36 text-white lg:min-h-[200vh] lg:px-[2.5vw]"
    >
      <header className="text-center">
        <p className="text-xs font-medium sm:text-lg">KEY FIGURES</p>
        <h2
          id="key-figures-title"
          className="mx-auto mt-8 max-w-4xl text-[clamp(2rem,4vw,3.8rem)] leading-[1.08] font-medium tracking-[-0.01em]"
        >
          Where numbers reflect
          <br />
          people, places, and purpose
        </h2>
      </header>

      <div className="mt-10 grid flex-1 grid-cols-2 sm:mt-14 lg:mt-20 lg:grid-cols-3">
        {figures.map((figure, index) => {
          const mobileBorders = [
            index < 4 ? "border-b" : "",
            index % 2 === 0 ? "border-r" : "border-r-0",
          ].join(" ");
          const desktopBorders = [
            index < 3 ? "lg:border-b" : "lg:border-b-0",
            index % 3 === 2 ? "lg:border-r-0" : "lg:border-r",
          ].join(" ");

          return (
            <div
              key={figure.label}
              className={`flex min-h-45 flex-col items-center justify-center border-white/55 px-2 text-center sm:min-h-52 lg:min-h-0 lg:px-4 ${mobileBorders} ${desktopBorders}`}
            >
              <p className="text-[clamp(2.4rem,6.2vw,5.5rem)] leading-none font-normal tracking-[-0.015em]">
                {figure.value}
              </p>
              <p className="mt-2 text-xs font-medium sm:text-lg">
                {figure.label}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
