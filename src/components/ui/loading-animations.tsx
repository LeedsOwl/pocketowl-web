import * as React from "react"

export const LoadingSpinner = () => (
  <div className="relative w-12 h-12">
    <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin"></div>
    <div
      className="absolute inset-2 rounded-full border-4 border-transparent border-t-primary/50 animate-spin"
      style={{ animationDuration: "0.8s", animationDirection: "reverse" }}
    ></div>
  </div>
)

export const LoadingDots = () => (
  <div className="flex space-x-2">
    <div
      className="w-3 h-3 bg-primary rounded-full animate-bounce"
      style={{ animationDelay: "0ms" }}
    ></div>
    <div
      className="w-3 h-3 bg-primary rounded-full animate-bounce"
      style={{ animationDelay: "150ms" }}
    ></div>
    <div
      className="w-3 h-3 bg-primary rounded-full animate-bounce"
      style={{ animationDelay: "300ms" }}
    ></div>
  </div>
)

export const LoadingPulse = () => (
  <div className="w-12 h-12 rounded-full bg-primary animate-glow-pulse"></div>
)

export const LoadingRing = () => (
  <div className="relative w-12 h-12">
    <div className="absolute inset-0 rounded-full border-4 border-primary/30"></div>
    <div className="absolute inset-0 rounded-full border-4 border-transparent border-l-primary border-t-primary animate-spin"></div>
  </div>
)
