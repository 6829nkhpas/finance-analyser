import mongoose from 'mongoose';

const BudgetSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ['Food', 'Rent', 'Travel', 'Shopping', 'Bills', 'Other'],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  month: {
    type: String,
    required: true,
    // Format: '2025-01'
  },
}, {
  timestamps: true,
});

// Compound index to ensure unique budget per category per month
BudgetSchema.index({ category: 1, month: 1 }, { unique: true });

export default mongoose.models.Budget || mongoose.model('Budget', BudgetSchema); 