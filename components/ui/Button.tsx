"use client"

import { cn } from "@/lib/utils"
import { forwardRef } from "react"
import { Loader2 } from "lucide-react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost"
  size?: "sm" | "default" | "lg"
  loading?: boolean
  icon?: React.ReactNode
}

const variantStyles = {
  primary:
    "bg-primary-500 text-white shadow-md hover:bg-primary-600 hover:shadow-lg active:scale-[0.98]",
  secondary:
    "bg-secondary-800 text-white hover:bg-secondary-700 dark:bg-secondary-700 dark:hover:bg-secondary-600",
  outline:
    "border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white",
  ghost:
    "text-secondary-600 hover:bg-secondary-100 dark:text-secondary-400 dark:hover:bg-secondary-800",
}

const sizeStyles = {
  sm: "h-9 px-4 text-sm",
  default: "h-12 px-6 text-base",
  lg: "h-14 px-8 text-lg",
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", size = "default", loading = false, icon, children, disabled, ...props },
    ref
  ) => {
    return (
      <button
        suppressHydrationWarning
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : icon}
        {children}
      </button>
    )
  }
)

Button.displayName = "Button"

export { Button }
