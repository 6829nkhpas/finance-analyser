"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Transaction } from "@/lib/store";
import { categoryColors, formatCurrency } from "@/lib/utils";
import { PieChart as PieChartIcon } from "lucide-react";

interface CategoryPieChartProps {
  transactions: Transaction[];
}

export default function CategoryPieChart({
  transactions,
}: CategoryPieChartProps) {
  // Calculate category totals
  const categoryData = transactions.reduce((acc, transaction) => {
    const category = transaction.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += transaction.amount;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(categoryData)
    .map(([category, amount]) => ({
      name: category,
      value: amount,
      color: categoryColors[category as keyof typeof categoryColors],
    }))
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value);

  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: Array<{ name: string; value: number; color: string }>;
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = (
        (data.value / chartData.reduce((sum, item) => sum + item.value, 0)) *
        100
      ).toFixed(1);

      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium" style={{ color: data.color }}>
            {data.name}
          </p>
          <p className="text-primary">{formatCurrency(data.value)}</p>
          <p className="text-muted-foreground text-sm">
            {percentage}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({
    payload,
  }: {
    payload?: Array<{ value: string; color: string }>;
  }) => (
    <div className="flex flex-wrap gap-2 mt-4">
      {payload?.map((entry, index: number) => (
        <div key={index} className="flex items-center gap-2 text-sm">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span>{entry.value}</span>
        </div>
      ))}
    </div>
  );

  if (chartData.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <PieChartIcon className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No category data</h3>
          <p className="text-muted-foreground text-center">
            Add transactions with categories to see your spending breakdown.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChartIcon className="h-5 w-5" />
          Spending by Category
        </CardTitle>
        <CardDescription>
          Breakdown of your expenses by category
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
