import React from 'react'
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

type TimeframeTabsProps = {
  activeTimeframe: string;
  onTimeframeChange: (timeframe: string) => void;
}

export function TimeframeTabs({ activeTimeframe, onTimeframeChange }: TimeframeTabsProps) {
  return (
    <Tabs value={activeTimeframe} onValueChange={onTimeframeChange} className="home-tabs w-full px-0">
      <TabsList className="grid w-full grid-cols-3 border-0 bg-transparent p-0 shadow-none backdrop-blur-none">
        <TabsTrigger value="week" className="rounded-none border-0 bg-transparent px-0 py-2 text-sm data-[state=active]:bg-transparent data-[state=active]:shadow-none">Week</TabsTrigger>
        <TabsTrigger value="month" className="rounded-none border-0 bg-transparent px-0 py-2 text-sm data-[state=active]:bg-transparent data-[state=active]:shadow-none">Month</TabsTrigger>
        <TabsTrigger value="year" className="rounded-none border-0 bg-transparent px-0 py-2 text-sm data-[state=active]:bg-transparent data-[state=active]:shadow-none">Year</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
