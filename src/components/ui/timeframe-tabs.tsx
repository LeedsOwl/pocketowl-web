import React from 'react'
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

type TimeframeTabsProps = {
  activeTimeframe: string;
  onTimeframeChange: (timeframe: string) => void;
}

export function TimeframeTabs({ activeTimeframe, onTimeframeChange }: TimeframeTabsProps) {
  return (
    <Tabs value={activeTimeframe} onValueChange={onTimeframeChange} className="w-full mb-4 p-2">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="week">Week</TabsTrigger>
        <TabsTrigger value="month">Month</TabsTrigger>
        <TabsTrigger value="year">Year</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}