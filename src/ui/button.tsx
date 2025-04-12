import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost";
  size?: "default" | "icon";
}

export const Button: React.FC<ButtonProps> = ({
  className = "",
  children,
  variant = "default",
  size = "default",
  ...props
}) => {
  const baseStyle =
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants: Record<string, string> = {
    default: "bg-yellow-500 text-white hover:bg-yellow-600",
    ghost: "bg-transparent text-yellow-600 hover:bg-yellow-200",
  };

  const sizes: Record<string, string> = {
    default: "px-4 py-2",
    icon: "w-9 h-9 p-0",
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
