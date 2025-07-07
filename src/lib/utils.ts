import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const categories = ['Food', 'Rent', 'Travel', 'Shopping', 'Bills', 'Other'] as const;

export const categoryColors = {
  Food: '#FF6B6B',
  Rent: '#4ECDC4',
  Travel: '#45B7D1',
  Shopping: '#96CEB4',
  Bills: '#FFEAA7',
  Other: '#DDA0DD',
};

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export function getMonthName(monthString: string): string {
  const [year, month] = monthString.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
}

export function getTransactionsByMonth(transactions: Array<{ date: string }>, month: string) {
  return transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    const transactionMonth = `${transactionDate.getFullYear()}-${String(transactionDate.getMonth() + 1).padStart(2, '0')}`;
    return transactionMonth === month;
  });
}

export function getCategoryTotals(transactions: Array<{ category: string; amount: number }>) {
  const totals: Record<string, number> = {};
  categories.forEach(category => {
    totals[category] = 0;
  });
  
  transactions.forEach(transaction => {
    totals[transaction.category] += transaction.amount;
  });
  
  return totals;
} 