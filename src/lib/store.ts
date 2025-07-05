import { create } from 'zustand';

export interface Transaction {
  _id: string;
  amount: number;
  date: string;
  description: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface Budget {
  _id: string;
  category: string;
  amount: number;
  month: string;
  createdAt: string;
  updatedAt: string;
}

interface FinanceStore {
  transactions: Transaction[];
  budgets: Budget[];
  setTransactions: (transactions: Transaction[]) => void;
  setBudgets: (budgets: Budget[]) => void;
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  addBudget: (budget: Budget) => void;
  updateBudget: (id: string, budget: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;
}

export const useFinanceStore = create<FinanceStore>((set) => ({
  transactions: [],
  budgets: [],
  setTransactions: (transactions) => set({ transactions }),
  setBudgets: (budgets) => set({ budgets }),
  addTransaction: (transaction) => set((state) => ({ 
    transactions: [transaction, ...state.transactions] 
  })),
  updateTransaction: (id, updatedTransaction) => set((state) => ({
    transactions: state.transactions.map(t => 
      t._id === id ? { ...t, ...updatedTransaction } : t
    )
  })),
  deleteTransaction: (id) => set((state) => ({
    transactions: state.transactions.filter(t => t._id !== id)
  })),
  addBudget: (budget) => set((state) => ({ 
    budgets: [budget, ...state.budgets] 
  })),
  updateBudget: (id, updatedBudget) => set((state) => ({
    budgets: state.budgets.map(b => 
      b._id === id ? { ...b, ...updatedBudget } : b
    )
  })),
  deleteBudget: (id) => set((state) => ({
    budgets: state.budgets.filter(b => b._id !== id)
  })),
})); 