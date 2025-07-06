const fs = require('fs');
const path = require('path');

// Create data directory
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Sample transactions
const sampleTransactions = [
  {
    _id: '1701234567890abc123',
    amount: 45.50,
    date: '2024-12-15',
    description: 'Grocery shopping at Whole Foods',
    category: 'Food',
    createdAt: '2024-12-15T10:30:00Z',
    updatedAt: '2024-12-15T10:30:00Z'
  },
  {
    _id: '1701234567891def456',
    amount: 1200.00,
    date: '2024-12-01',
    description: 'Monthly rent payment',
    category: 'Rent',
    createdAt: '2024-12-01T09:00:00Z',
    updatedAt: '2024-12-01T09:00:00Z'
  },
  {
    _id: '1701234567892ghi789',
    amount: 25.75,
    date: '2024-12-14',
    description: 'Coffee and breakfast',
    category: 'Food',
    createdAt: '2024-12-14T08:15:00Z',
    updatedAt: '2024-12-14T08:15:00Z'
  },
  {
    _id: '1701234567893jkl012',
    amount: 89.99,
    date: '2024-12-13',
    description: 'New wireless headphones',
    category: 'Shopping',
    createdAt: '2024-12-13T14:20:00Z',
    updatedAt: '2024-12-13T14:20:00Z'
  },
  {
    _id: '1701234567894mno345',
    amount: 150.00,
    date: '2024-12-10',
    description: 'Electric bill',
    category: 'Bills',
    createdAt: '2024-12-10T16:45:00Z',
    updatedAt: '2024-12-10T16:45:00Z'
  },
  {
    _id: '1701234567895pqr678',
    amount: 32.50,
    date: '2024-12-12',
    description: 'Lunch with colleagues',
    category: 'Food',
    createdAt: '2024-12-12T12:30:00Z',
    updatedAt: '2024-12-12T12:30:00Z'
  },
  {
    _id: '1701234567896stu901',
    amount: 45.00,
    date: '2024-12-11',
    description: 'Gas for car',
    category: 'Travel',
    createdAt: '2024-12-11T18:00:00Z',
    updatedAt: '2024-12-11T18:00:00Z'
  },
  {
    _id: '1701234567897vwx234',
    amount: 75.25,
    date: '2024-12-09',
    description: 'Groceries and household items',
    category: 'Food',
    createdAt: '2024-12-09T15:30:00Z',
    updatedAt: '2024-12-09T15:30:00Z'
  },
  {
    _id: '1701234567898yza567',
    amount: 120.00,
    date: '2024-12-08',
    description: 'Internet bill',
    category: 'Bills',
    createdAt: '2024-12-08T10:00:00Z',
    updatedAt: '2024-12-08T10:00:00Z'
  },
  {
    _id: '1701234567899bcd890',
    amount: 65.99,
    date: '2024-12-07',
    description: 'Clothing store purchase',
    category: 'Shopping',
    createdAt: '2024-12-07T13:45:00Z',
    updatedAt: '2024-12-07T13:45:00Z'
  }
];

// Sample budgets
const sampleBudgets = [
  {
    _id: '1701234567890budget1',
    category: 'Food',
    amount: 400.00,
    month: '2024-12',
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z'
  },
  {
    _id: '1701234567891budget2',
    category: 'Rent',
    amount: 1200.00,
    month: '2024-12',
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z'
  },
  {
    _id: '1701234567892budget3',
    category: 'Bills',
    amount: 300.00,
    month: '2024-12',
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z'
  },
  {
    _id: '1701234567893budget4',
    category: 'Shopping',
    amount: 200.00,
    month: '2024-12',
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z'
  },
  {
    _id: '1701234567894budget5',
    category: 'Travel',
    amount: 150.00,
    month: '2024-12',
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z'
  }
];

// Write sample data to files
fs.writeFileSync(
  path.join(dataDir, 'transactions.json'),
  JSON.stringify(sampleTransactions, null, 2)
);

fs.writeFileSync(
  path.join(dataDir, 'budgets.json'),
  JSON.stringify(sampleBudgets, null, 2)
);

console.log('✅ Sample data created successfully!');
console.log(`📁 Data directory: ${dataDir}`);
console.log(`📊 Created ${sampleTransactions.length} sample transactions`);
console.log(`💰 Created ${sampleBudgets.length} sample budgets`);
