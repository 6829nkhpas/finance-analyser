import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Budget from '@/models/Budget';

export async function GET() {
  try {
    await dbConnect();
    const budgets = await Budget.find({}).sort({ month: -1, category: 1 });
    return NextResponse.json(budgets);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch budgets' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    
    const budget = await Budget.create({
      category: body.category,
      amount: body.amount,
      month: body.month,
    });
    
    return NextResponse.json(budget, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ error: 'Budget for this category and month already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create budget' }, { status: 500 });
  }
} 