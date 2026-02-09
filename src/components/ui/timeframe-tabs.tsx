import React from 'react'
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

type TimeframeTabsProps = {
  activeTimeframe: string;
  onTimeframeChange: (timeframe: string) => void;
}

export function TimeframeTabs({ activeTimeframe, onTimeframeChange }: TimeframeTabsProps) {
  return (
    <Tabs value={activeTimeframe} onValueChange={onTimeframeChange} className="mb-4 w-full px-0">
      <TabsList className="grid w-full grid-cols-3 rounded-xl surface-card border-white/25 bg-transparent p-1">
        <TabsTrigger value="week" className="rounded-lg text-xs tracking-[0.15em] uppercase text-slate-700 dark:text-slate-200 data-[state=active]:text-slate-900 dark:data-[state=active]:text-slate-50">Week</TabsTrigger>
        <TabsTrigger value="month" className="rounded-lg text-xs tracking-[0.15em] uppercase text-slate-700 dark:text-slate-200 data-[state=active]:text-slate-900 dark:data-[state=active]:text-slate-50">Month</TabsTrigger>
        <TabsTrigger value="year" className="rounded-lg text-xs tracking-[0.15em] uppercase text-slate-700 dark:text-slate-200 data-[state=active]:text-slate-900 dark:data-[state=active]:text-slate-50">Year</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
