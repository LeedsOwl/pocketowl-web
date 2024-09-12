import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Chart from "@/components/bar-chart"

interface TimeframeTabsProps {
  weeklyData: Array<{ label: string; total: number }>;
  monthlyData: Array<{ label: string; total: number }>;
  yearlyData: Array<{ label: string; total: number }>;
  weeklyTotals: {
    totalCurrent: number;
    totalPrevious: number;
    isFirstPeriod: boolean;
    isSpendingUp: boolean;
  };
  monthlyTotals: {
    totalCurrent: number;
    totalPrevious: number;
    isFirstPeriod: boolean;
    isSpendingUp: boolean;
  };
  yearlyTotals: {
    totalCurrent: number;
    totalPrevious: number;
    isFirstPeriod: boolean;
    isSpendingUp: boolean;
  };
  onTimeframeChange: (value: string) => void;
}

export function TimeframeTabs({
  weeklyData,
  monthlyData,
  yearlyData,
  weeklyTotals,
  monthlyTotals,
  yearlyTotals,
  onTimeframeChange
}: TimeframeTabsProps) {
  return (
    <Tabs defaultValue="week" onValueChange={onTimeframeChange}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="week">Week</TabsTrigger>
        <TabsTrigger value="month">Month</TabsTrigger>
        <TabsTrigger value="year">Year</TabsTrigger>
      </TabsList>
      {/* <TabsContent value="week">
        <Chart
          weeklyData={weeklyData}
          totalCurrent={weeklyTotals.totalCurrent}
          totalPrevious={weeklyTotals.totalPrevious}
          isFirstPeriod={weeklyTotals.isFirstPeriod}
          isSpendingUp={weeklyTotals.isSpendingUp}

        //   <Chart
        //   weeklyData={weeklyData}
        //   totalCurrentWeek={totalCurrentWeek}
        //   totalPreviousWeek={totalPreviousWeek}
        //   isFirstWeek={isFirstWeek}
        //   isSpendingUp={isSpendingUp}
        // />
        />
      </TabsContent>
      <TabsContent value="month">
        <Chart
          data={monthlyData}
          totalCurrent={monthlyTotals.totalCurrent}
          totalPrevious={monthlyTotals.totalPrevious}
          isFirstPeriod={monthlyTotals.isFirstPeriod}
          isSpendingUp={monthlyTotals.isSpendingUp}
        />
      </TabsContent>
      <TabsContent value="year">
        <Chart
          data={yearlyData}
          totalCurrent={yearlyTotals.totalCurrent}
          totalPrevious={yearlyTotals.totalPrevious}
          isFirstPeriod={yearlyTotals.isFirstPeriod}
          isSpendingUp={yearlyTotals.isSpendingUp}
        />
      </TabsContent> */}
    </Tabs>
  )
}