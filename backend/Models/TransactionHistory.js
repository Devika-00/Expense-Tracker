import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User' 
  },
  category: {
    type: String,
    required: true,
   
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now, 
  },
  description:{
    type: String,
    required: true,
  }
});


export default mongoose.model('Transaction', transactionSchema);

