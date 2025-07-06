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
      <div className="flex items-center justify-center min-h-screen relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5" />
        <div className="flex flex-col items-center gap-6 relative">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary/20 rounded-full animate-spin">
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-primary rounded-full animate-spin" />
            </div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-primary/60 rounded-full animate-spin" style={{animationDirection: 'reverse', animationDuration: '1.5s'}} />
          </div>
          <div className="text-center space-y-2">
            <p className="text-lg font-medium gradient-text">
              Loading your financial data...
            </p>
            <p className="text-sm text-muted-foreground">
              Preparing your dashboard
            </p>
          </div>
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0ms'}} />
            <div className="w-2 h-2 bg-primary/70 rounded-full animate-bounce" style={{animationDelay: '150ms'}} />
            <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{animationDelay: '300ms'}} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 relative">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute top-40 right-0 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl -z-10" />
      
      {/* Header */}
      <div className="text-center space-y-4 relative">
        <div className="inline-block p-4 rounded-2xl bg-gradient-primary shadow-xl float mb-4">
          <span className="text-4xl">💰</span>
        </div>
        <h1 className="text-5xl font-bold gradient-text mb-4">
          Personal Finance Visualizer
        </h1>
        <p className="text-muted-foreground text-xl max-w-2xl mx-auto text-balance">
          Track your expenses, set budgets, and visualize your financial health with beautiful insights
        </p>
        <div className="flex justify-center gap-2 mt-6">
          <div className="w-16 h-1 bg-gradient-primary rounded-full" />
          <div className="w-8 h-1 bg-primary/40 rounded-full" />
          <div className="w-4 h-1 bg-primary/20 rounded-full" />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="relative">
        <SummaryCards transactions={transactions} />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
        {/* Left Column - Charts */}
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-6">
            <MonthlyExpensesChart transactions={transactions} />
            <CategoryPieChart transactions={transactions} />
          </div>
        </div>

        {/* Right Column - Forms and Lists */}
        <div className="space-y-8">
          <div className="sticky top-6">
            <TransactionForm />
          </div>
          <TransactionList transactions={transactions.slice(0, 5)} />
        </div>
      </div>
    </div>
  );
}
