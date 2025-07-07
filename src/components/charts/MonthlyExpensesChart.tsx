"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Transaction } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp } from "lucide-react";

interface MonthlyExpensesChartProps {
  transactions: Transaction[];
}

export default function MonthlyExpensesChart({
  transactions,
}: MonthlyExpensesChartProps) {
  // Group transactions by month
  const monthlyData = transactions.reduce((acc, transaction) => {
    const date = new Date(transaction.date);
    const monthKey = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;
    const monthName = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });

    if (!acc[monthKey]) {
      acc[monthKey] = {
        month: monthName,
        total: 0,
        count: 0,
      };
    }

    acc[monthKey].total += transaction.amount;
    acc[monthKey].count += 1;

    return acc;
  }, {} as Record<string, { month: string; total: number; count: number }>);

  const chartData = Object.values(monthlyData)
    .sort((a, b) => {
      const [aYear, aMonth] = a.month.split(" ");
      const [bYear, bMonth] = b.month.split(" ");
      return (
        new Date(`${aMonth} 1, ${aYear}`).getTime() -
        new Date(`${bMonth} 1, ${bYear}`).getTime()
      );
    })
    .slice(-6); // Show last 6 months

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: Array<{ value: number; payload: { count: number } }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-primary">
            Total: {formatCurrency(payload[0].value)}
          </p>
          <p className="text-muted-foreground text-sm">
            {payload[0].payload.count} transactions
          </p>
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <TrendingUp className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No data to display</h3>
          <p className="text-muted-foreground text-center">
            Add some transactions to see your monthly spending trends.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Monthly Expenses
        </CardTitle>
        <CardDescription>
          Your spending trends over the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="month"
                className="text-sm"
                tick={{ fontSize: 12 }}
              />
              <YAxis
                className="text-sm"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="total"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
                className="opacity-80 hover:opacity-100 transition-opacity"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
