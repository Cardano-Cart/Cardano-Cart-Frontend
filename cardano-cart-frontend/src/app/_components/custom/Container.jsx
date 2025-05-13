import React from "react";

export default function Container({ children, className }) {
  return <div className={`container h-full w-full ${className}`}>{children}</div>;
}

