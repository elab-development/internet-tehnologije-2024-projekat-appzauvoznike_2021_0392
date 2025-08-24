import React from "react";

export default function FormField({ label, children, error, help }) {
  return (
    <div className="field">
      {label && <label>{label}</label>}
      {children}
      {error && <small className="err">{error}</small>}
      {help && !error && <small className="muted">{help}</small>}
    </div>
  );
}
