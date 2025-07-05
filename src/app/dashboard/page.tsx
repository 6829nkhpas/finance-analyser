"use client";

import { useEffect, useState } from "react";
import { useFinanceStore } from "@/lib/store";
import TransactionForm from "@/components/forms/TransactionForm";
import TransactionList from "@/components/TransactionList";
import SummaryCards from "@/components/SummaryCards";
import MonthlyExpensesChart from "@/components/charts/MonthlyExpensesChart";
import CategoryPieChart from "@/components/charts/CategoryPieChart";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-muted-foreground">
            Loading your financial data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          💰 Personal Finance Visualizer
        </h1>
        <p className="text-muted-foreground text-lg">
          Track your expenses, set budgets, and visualize your financial health
        </p>
      </div>

      {/* Summary Cards */}
      <SummaryCards transactions={transactions} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Charts */}
        <div className="lg:col-span-2 space-y-8">
          <MonthlyExpensesChart transactions={transactions} />
          <CategoryPieChart transactions={transactions} />
        </div>

        {/* Right Column - Forms and Lists */}
        <div className="space-y-8">
          <TransactionForm />
          <TransactionList transactions={transactions.slice(0, 5)} />
        </div>
      </div>
    </div>
  );
}
