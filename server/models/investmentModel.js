import mongoose from 'mongoose';

export const investmentSchema = new mongoose.Schema({
   investor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true
   },
   amount: {
      type: Number,
      required: true
   },
   paymentRef: {
      type: String,
      required: true
   },
   investedAt: {
      type: Date,
      default: Date.now
   },
   expectedReturn: {
      type: Number
   },
   repaymentDueDate: {
      type: Date
   },
   isRepaid: {
      type: Boolean,
      default: false
   },
   fraudFlag: {
      type: Boolean,
      default: false
   },
   fraudReasons: {
      type: [String],
      default: []
   },
   dispute: {
      reason: { type: String, default: null },
      date: { type: Date, default: null },
      resolved: { type: Boolean, default: false }
   },
   repaidAt: {
      type: Date
   },
   status: {
      type: String,
      enum: ['pending', 'completed', 'refunded'],
      default: 'pending'
   },
   ipAddress: { type: String }
}, { _id: true });

const investmentModel = mongoose.models.investments || mongoose.model('investments', investmentSchema);

export default investmentModel;
