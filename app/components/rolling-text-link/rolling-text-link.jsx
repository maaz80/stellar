import { useState } from "react";
import Link from "next/link";

export default function RollingTextLink({
  href,
  label,
  className = "",
  rollOnce = false,
  ...props
}) {
  const [hasRolled, setHasRolled] = useState(false);

  const isInternal = Boolean(href && href.startsWith("/"));

  const sharedProps = {
    ...props,
    href,
    "aria-label": label,
    onMouseEnter: (event) => {
      setHasRolled(true);
      props.onMouseEnter?.(event);
    },
    onFocus: (event) => {
      setHasRolled(true);
      props.onFocus?.(event);
    },
    className: `rolling-text-link group transition-[border-radius,background-color,border-color,color,box-shadow] duration-300 ease-out hover:rounded-bl-3xl hover:rounded-tr-3xl ${
      rollOnce ? "rolling-text-link--once" : ""
    } ${hasRolled && rollOnce ? "is-rolled" : ""} ${className}`,
  };

  const content = (
    <span className="h-6 overflow-hidden">
      <span aria-hidden="true" className="flex">
        {Array.from(label).map((letter, index) => (
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
  );

  if (isInternal) {
    return <Link {...sharedProps}>{content}</Link>;
  }

  return <a {...sharedProps}>{content}</a>;
}
