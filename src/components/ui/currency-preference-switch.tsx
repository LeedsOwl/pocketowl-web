"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/icons"

export default function CurrencyPreferenceSwitch() {
  const [activeCurrency, setActiveCurrency] = useState("USD")

  const currencies = [
    { id: "USD", icon: Icons.dollarSign, label: "USD" },
    { id: "GBP", icon: Icons.poundSterling, label: "GBP" },
    { id: "EUR", icon: Icons.euro, label: "EUR" },
  ]

  const handleCurrencyChange = () => {
    const currentIndex = currencies.findIndex(c => c.id === activeCurrency)
    const nextIndex = (currentIndex + 1) % currencies.length
    setActiveCurrency(currencies[nextIndex].id)
  }

  const ActiveIcon = currencies.find(c => c.id === activeCurrency)?.icon || Icons.dollarSign

  return (
    <div className="flex items-center space-x-2">
      <div
        role="checkbox"
        aria-checked={activeCurrency === "USD"}
        tabIndex={0}
        onClick={handleCurrencyChange}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            handleCurrencyChange()
          }
        }}
        className="w-[76px] h-9 px-1 rounded-full bg-secondary flex items-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      >
        <div
          className={`w-7 h-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground transition-transform duration-200 ease-in-out ${
            activeCurrency === "USD" ? "transform translate-x-0" :
            activeCurrency === "GBP" ? "transform translate-x-[22px]" :
            "transform translate-x-[44px]"
          }`}
        >
          <ActiveIcon className="h-4 w-4" />
        </div>
      </div>
      <Label className="text-sm font-medium">Currency: {activeCurrency}</Label>
    </div>
  )
}