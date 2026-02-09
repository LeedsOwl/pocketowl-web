import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const skeletonVariants = cva(
  "animate-pulse bg-gradient-to-r from-muted/50 via-muted to-muted/50 bg-[length:200%_100%] animate-shimmer",
  {
    variants: {
      variant: {
        default: "rounded-md",
        circular: "rounded-full",
        text: "h-4 rounded",
        card: "h-32 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(skeletonVariants({ variant }), className)}
        {...props}
      />
    )
  }
)
Skeleton.displayName = "Skeleton"

export { Skeleton, skeletonVariants }
