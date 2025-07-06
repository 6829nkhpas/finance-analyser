import { NextRequest, NextResponse } from 'next/server';
import { getTransactions, createTransaction } from '@/lib/localDb';

export async function GET() {
  try {
    const transactions = getTransactions().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const transaction = createTransaction({
      amount: body.amount,
      date: body.date,
      description: body.description,
      category: body.category || 'Other',
    });
    
    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
  }
}
