import React from "react";

export default function Button({
  children,
  variant = "primary", // "primary" | "ghost" | "link"
  className = "",
  as = "button",
  ...props
}) {
  const Tag = as;
  const base =
    variant === "link"
      ? "link"
      : `btn ${variant === "primary" ? "btn--primary" : "btn--ghost"}`;

  return (
    <Tag className={`${base} ${className}`.trim()} {...props}>
      {children}
    </Tag>
  );
}
