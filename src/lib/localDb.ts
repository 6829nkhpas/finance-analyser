import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const TRANSACTIONS_FILE = path.join(DATA_DIR, 'transactions.json');
const BUDGETS_FILE = path.join(DATA_DIR, 'budgets.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize files if they don't exist
if (!fs.existsSync(TRANSACTIONS_FILE)) {
  fs.writeFileSync(TRANSACTIONS_FILE, JSON.stringify([]));
}

if (!fs.existsSync(BUDGETS_FILE)) {
  fs.writeFileSync(BUDGETS_FILE, JSON.stringify([]));
}

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

function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

// Transaction operations
export function getTransactions(): Transaction[] {
  try {
    const data = fs.readFileSync(TRANSACTIONS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

export function createTransaction(transaction: Omit<Transaction, '_id' | 'createdAt' | 'updatedAt'>): Transaction {
  const transactions = getTransactions();
  const newTransaction: Transaction = {
    ...transaction,
    _id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  transactions.unshift(newTransaction);
  fs.writeFileSync(TRANSACTIONS_FILE, JSON.stringify(transactions, null, 2));
  return newTransaction;
}

export function updateTransaction(id: string, updates: Partial<Transaction>): Transaction | null {
  const transactions = getTransactions();
  const index = transactions.findIndex(t => t._id === id);
  
  if (index === -1) return null;
  
  transactions[index] = {
    ...transactions[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  fs.writeFileSync(TRANSACTIONS_FILE, JSON.stringify(transactions, null, 2));
  return transactions[index];
}

export function deleteTransaction(id: string): boolean {
  const transactions = getTransactions();
  const filteredTransactions = transactions.filter(t => t._id !== id);
  
  if (filteredTransactions.length === transactions.length) return false;
  
  fs.writeFileSync(TRANSACTIONS_FILE, JSON.stringify(filteredTransactions, null, 2));
  return true;
}

// Budget operations
export function getBudgets(): Budget[] {
  try {
    const data = fs.readFileSync(BUDGETS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

export function createBudget(budget: Omit<Budget, '_id' | 'createdAt' | 'updatedAt'>): Budget {
  const budgets = getBudgets();
  
  // Check for existing budget with same category and month
  const existingBudget = budgets.find(b => b.category === budget.category && b.month === budget.month);
  if (existingBudget) {
    throw new Error('Budget for this category and month already exists');
  }
  
  const newBudget: Budget = {
    ...budget,
    _id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  budgets.unshift(newBudget);
  fs.writeFileSync(BUDGETS_FILE, JSON.stringify(budgets, null, 2));
  return newBudget;
}

export function updateBudget(id: string, updates: Partial<Budget>): Budget | null {
  const budgets = getBudgets();
  const index = budgets.findIndex(b => b._id === id);
  
  if (index === -1) return null;
  
  budgets[index] = {
    ...budgets[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  fs.writeFileSync(BUDGETS_FILE, JSON.stringify(budgets, null, 2));
  return budgets[index];
}

export function deleteBudget(id: string): boolean {
  const budgets = getBudgets();
  const filteredBudgets = budgets.filter(b => b._id !== id);
  
  if (filteredBudgets.length === budgets.length) return false;
  
  fs.writeFileSync(BUDGETS_FILE, JSON.stringify(filteredBudgets, null, 2));
  return true;
}
