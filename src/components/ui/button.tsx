import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "animated-outline-btn shadow-[0_10px_30px_rgba(125,173,226,0.14),0_5px_20px_rgba(140,185,220,0.10)] hover:-translate-y-0.5 hover:shadow-[0_14px_40px_rgba(125,173,226,0.22),0_7px_25px_rgba(140,185,220,0.16)]",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "animated-outline-btn border border-transparent",
        secondary:
          "bg-secondary/80 text-secondary-foreground hover:bg-secondary",
        ghost: "hover:bg-accent/70 hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        gradient:
          "bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300",
        glass:
          "bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10 hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-300",
        glow:
          "bg-primary text-primary-foreground shadow-lg hover:shadow-[0_0_35px_rgba(125,173,226,0.35),0_0_60px_rgba(140,185,220,0.25)] dark:hover:shadow-[0_0_35px_rgba(125,173,226,0.40),0_0_60px_rgba(140,185,220,0.30)] transition-shadow duration-300",
        shimmer:
          "relative overflow-hidden bg-gradient-to-r from-primary via-primary/80 to-primary bg-[length:200%_100%] animate-shimmer text-white",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
