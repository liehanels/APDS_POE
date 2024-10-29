import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  accountnum: { type: String, required: true },
  transactionAmount: { type: Number, required: true },
  transactionAddress: { type: String, required: true },
  transactionStatus: { type: String, enum: ['Pending', 'Approved', 'Denied'], default: 'Pending' }
});

const Transaction = mongoose.model('transactions', transactionSchema);

export default Transaction;
