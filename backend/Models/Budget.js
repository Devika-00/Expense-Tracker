import mongoose from "mongoose";

const BudgetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  amountUsed: {
    type: Number,
    default: 0, 
  },
  month: {
    type: String, 
    required: true,
  },
}, { timestamps: true });

export default mongoose.model('Budget', BudgetSchema);
