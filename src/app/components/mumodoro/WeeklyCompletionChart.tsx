import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

type WeeklyCompletionChartProps = {
  data: Array<{
    date: string;
    count: number;
  }>;
};

const chartConfig = {
  count: {
    label: "완료",
    color: "#f97316",
  },
};

export const WeeklyCompletionChart = ({ data }: WeeklyCompletionChartProps) => {
  return (
    <Card className="bg-white/10 border-white/10 text-white shadow-xl">
      <CardHeader>
        <CardTitle className="text-white">최근 7일 완료 추이</CardTitle>
      </CardHeader>
      <CardContent className="h-[260px]">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <BarChart data={data} margin={{ top: 8, left: 0, right: 12 }}>
            <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "rgba(255,255,255,0.6)" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
              tick={{ fill: "rgba(255,255,255,0.6)" }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" fill="var(--color-count)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
