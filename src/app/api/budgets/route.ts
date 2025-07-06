import { NextRequest, NextResponse } from 'next/server';
import { getBudgets, createBudget } from '@/lib/localDb';

export async function GET() {
  try {
    const budgets = getBudgets().sort((a, b) => {
      // Sort by month descending, then by category ascending
      if (a.month !== b.month) {
        return b.month.localeCompare(a.month);
      }
      return a.category.localeCompare(b.category);
    });
    return NextResponse.json(budgets);
  } catch (error) {
    console.error('Error fetching budgets:', error);
    return NextResponse.json({ error: 'Failed to fetch budgets' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const budget = createBudget({
      category: body.category,
      amount: body.amount,
      month: body.month,
    });
    
    return NextResponse.json(budget, { status: 201 });
  } catch (error: any) {
    if (error.message === 'Budget for this category and month already exists') {
      return NextResponse.json({ error: 'Budget for this category and month already exists' }, { status: 400 });
    }
    console.error('Error creating budget:', error);
    return NextResponse.json({ error: 'Failed to create budget' }, { status: 500 });
  }
}
