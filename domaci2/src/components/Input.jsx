import React, { forwardRef } from "react";

const Input = forwardRef(function Input(
  { type = "text", className = "", ...props },
  ref
) {
  return <input ref={ref} type={type} className={`input ${className}`} {...props} />;
});

export default Input;
