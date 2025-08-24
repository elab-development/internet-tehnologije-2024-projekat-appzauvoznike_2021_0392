import React from "react";

export default function Select({ className = "", children, ...props }) {
  return (
    <select className={`select ${className}`} {...props}>
      {children}
    </select>
  );
}
