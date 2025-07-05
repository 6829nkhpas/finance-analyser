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
  Legend,
} from "recharts";
import { Transaction, Budget } from "@/lib/store";
import {
  formatCurrency,
  getCurrentMonth,
  getTransactionsByMonth,
} from "@/lib/utils";
import { BarChart3 } from "lucide-react";

interface BudgetComparisonChartProps {
  transactions: Transaction[];
  budgets: Budget[];
}

export default function BudgetComparisonChart({
  transactions,
  budgets,
}: BudgetComparisonChartProps) {
  const currentMonth = getCurrentMonth();
  const currentMonthTransactions = getTransactionsByMonth(
    transactions,
    currentMonth
  );

  // Get current month budgets
  const currentMonthBudgets = budgets.filter(
    (budget) => budget.month === currentMonth
  );

  // Calculate actual spending by category
  const actualSpending = currentMonthTransactions.reduce((acc, transaction) => {
    acc[transaction.category] =
      (acc[transaction.category] || 0) + transaction.amount;
    return acc;
  }, {} as Record<string, number>);

  // Create comparison data
  const comparisonData = currentMonthBudgets.map((budget) => ({
    category: budget.category,
    budget: budget.amount,
    actual: actualSpending[budget.category] || 0,
    difference: (actualSpending[budget.category] || 0) - budget.amount,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const budget = payload.find((p: any) => p.dataKey === "budget");
      const actual = payload.find((p: any) => p.dataKey === "actual");

      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          {budget && (
            <p className="text-blue-600">
              Budget: {formatCurrency(budget.value)}
            </p>
          )}
          {actual && (
            <p className="text-orange-600">
              Actual: {formatCurrency(actual.value)}
            </p>
          )}
          {budget && actual && (
            <p
              className={`text-sm ${
                actual.value > budget.value ? "text-red-600" : "text-green-600"
              }`}
            >
              {actual.value > budget.value ? "Over" : "Under"} by{" "}
              {formatCurrency(Math.abs(actual.value - budget.value))}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  if (comparisonData.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No budget data</h3>
          <p className="text-muted-foreground text-center">
            Set budgets for this month to see budget vs actual comparison.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Budget vs Actual
        </CardTitle>
        <CardDescription>
          Compare your spending against monthly budgets
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="category"
                className="text-sm"
                tick={{ fontSize: 12 }}
              />
              <YAxis
                className="text-sm"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                dataKey="budget"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
                name="Budget"
              />
              <Bar
                dataKey="actual"
                fill="hsl(var(--secondary))"
                radius={[4, 4, 0, 0]}
                name="Actual"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
