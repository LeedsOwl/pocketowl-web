"use client"

import React, { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface CurrencyInputProps {
  label?: string
  initialValue?: number
  currency?: string
  placeholder?: string
  onChange?: (value: number) => void
}

export default function Component({
  label = "Amount",
  initialValue = 0,
  currency = "£",
  placeholder = "0.00",
  onChange
}: CurrencyInputProps) {
  const [value, setValue] = useState(initialValue)
  const [displayValue, setDisplayValue] = useState(initialValue.toFixed(2))

  useEffect(() => {
    if (onChange) {
      onChange(value)
    }
  }, [value, onChange])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/[^0-9.]/g, '')
    setDisplayValue(inputValue)
    
    const numericValue = parseFloat(inputValue)
    if (!isNaN(numericValue)) {
      setValue(numericValue)
    } else if (inputValue === '') {
      setValue(0)
    }
  }

  const handleBlur = () => {
    setDisplayValue(value.toFixed(2))
  }

  return (
    <div className="grid w-full items-center gap-1.5">
      <Label htmlFor="currency-input">{label}</Label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
          {currency}
        </span>
        <Input
          type="text"
          id="currency-input"
          placeholder={placeholder}
          value={displayValue}
          onChange={handleChange}
          onBlur={handleBlur}
          className="pl-7"
          aria-label={`${label} in ${currency}`}
        />
      </div>
    </div>
  )
}