"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Transaction } from "@/lib/store";
import { formatCurrency, formatDate } from "@/lib/utils";
import { DollarSign, TrendingUp, Calendar, Target } from "lucide-react";

interface SummaryCardsProps {
  transactions: Transaction[];
}

export default function SummaryCards({ transactions }: SummaryCardsProps) {
  // Calculate total expenses
  const totalExpenses = transactions.reduce(
    (sum, transaction) => sum + transaction.amount,
    0
  );

  // Find most recent transaction
  const mostRecent =
    transactions.length > 0
      ? transactions.reduce((latest, current) =>
          new Date(current.date) > new Date(latest.date) ? current : latest
        )
      : null;

  // Find top spending category
  const categoryTotals = transactions.reduce((acc, transaction) => {
    acc[transaction.category] =
      (acc[transaction.category] || 0) + transaction.amount;
    return acc;
  }, {} as Record<string, number>);

  const topCategory = Object.entries(categoryTotals).sort(
    ([, a], [, b]) => b - a
  )[0];

  // Calculate average daily spending (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentTransactions = transactions.filter(
    (t) => new Date(t.date) >= thirtyDaysAgo
  );

  const recentTotal = recentTransactions.reduce((sum, t) => sum + t.amount, 0);
  const averageDaily = recentTotal / 30;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Expenses */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(totalExpenses)}
          </div>
          <p className="text-xs text-muted-foreground">
            {transactions.length} transactions
          </p>
        </CardContent>
      </Card>

      {/* Average Daily Spending */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Daily Average</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(averageDaily)}
          </div>
          <p className="text-xs text-muted-foreground">Last 30 days</p>
        </CardContent>
      </Card>

      {/* Top Category */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top Category</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {topCategory ? topCategory[0] : "N/A"}
          </div>
          <p className="text-xs text-muted-foreground">
            {topCategory ? formatCurrency(topCategory[1]) : "No data"}
          </p>
        </CardContent>
      </Card>

      {/* Most Recent */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Latest Transaction
          </CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {mostRecent ? formatCurrency(mostRecent.amount) : "N/A"}
          </div>
          <p className="text-xs text-muted-foreground">
            {mostRecent ? formatDate(mostRecent.date) : "No transactions"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
