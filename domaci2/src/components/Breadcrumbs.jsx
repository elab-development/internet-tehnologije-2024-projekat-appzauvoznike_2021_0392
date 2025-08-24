
import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";

const LABELS = {
  supplier: "Supplier",
  products: "Proizvodi",
  offers: "Ponude",
  images: "Slike",
  new: "Novi",
  edit: "Izmena",
};

function humanize(segment) {
  const s = decodeURIComponent(segment);
  if (LABELS[s]) return LABELS[s];
  if (/^\d+$/.test(s)) return `#${s}`;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function Breadcrumbs() {
  const { pathname } = useLocation();

  const parts = useMemo(
    () => pathname.split("/").filter(Boolean),
    [pathname]
  );

  const hidden = pathname === "/" || pathname.startsWith("/auth");
  if (hidden) return null;

  const crumbs = parts.map((seg, i) => ({
    url: "/" + parts.slice(0, i + 1).join("/"),
    label: humanize(seg),
    isLast: i === parts.length - 1,
  }));

  return (
    <nav aria-label="breadcrumb" className="breadcrumbs">
      <ol>
        <li>
          <Link to="/" className="bc-link">Početna</Link>
        </li>
        {crumbs.map(c => (
          <li
            key={c.url}
            className={c.isLast ? "active" : undefined}
            aria-current={c.isLast ? "page" : undefined}
          >
            {c.isLast ? (
              <span className="bc-current">{c.label}</span>
            ) : (
              <Link to={c.url} className="bc-link">{c.label}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
