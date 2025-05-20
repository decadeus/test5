// Fichier: /components/ui/button.jsx
import React from "react";

export const Button = ({
  children,
  onClick,
  disabled = false,
  variant = "default",
  size = "md",
  className = "",
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    destructive: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  };

  const sizes = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-3 text-base",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseStyles}
        ${variants[variant] || variants.default}
        ${sizes[size] || sizes.md}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};