"use client";

import { useEffect, useState } from "react";
import { useFinanceStore } from "@/lib/store";
import BudgetForm from "@/components/forms/BudgetForm";
import BudgetComparisonChart from "@/components/charts/BudgetComparisonChart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, getCurrentMonth, getMonthName } from "@/lib/utils";
import { Target, Loader2, AlertCircle } from "lucide-react";

export default function BudgetsPage() {
  const { transactions, budgets, setTransactions, setBudgets } =
    useFinanceStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [transactionsRes, budgetsRes] = await Promise.all([
          fetch("/api/transactions"),
          fetch("/api/budgets"),
        ]);

        if (transactionsRes.ok) {
          const transactionsData = await transactionsRes.json();
          setTransactions(transactionsData);
        }

        if (budgetsRes.ok) {
          const budgetsData = await budgetsRes.json();
          setBudgets(budgetsData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [setTransactions, setBudgets]);

  const currentMonth = getCurrentMonth();
  const currentMonthBudgets = budgets.filter(
    (budget) => budget.month === currentMonth
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-muted-foreground">Loading budget data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          🎯 Budget Management
        </h1>
        <p className="text-muted-foreground text-lg">
          Set and track your monthly spending limits
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Budget Form */}
        <div>
          <BudgetForm />
        </div>

        {/* Right Column - Current Month Budgets */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Current Month Budgets
              </CardTitle>
              <CardDescription>
                {getMonthName(currentMonth)} budget overview
              </CardDescription>
            </CardHeader>
            <CardContent>
              {currentMonthBudgets.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No budgets set</h3>
                  <p className="text-muted-foreground text-center">
                    Set your first budget for {getMonthName(currentMonth)} to
                    get started.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {currentMonthBudgets.map((budget) => (
                    <div
                      key={budget._id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary">{budget.category}</Badge>
                        <span className="font-medium">
                          {formatCurrency(budget.amount)}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        Monthly limit
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Budget Comparison Chart */}
      <BudgetComparisonChart transactions={transactions} budgets={budgets} />
    </div>
  );
}
