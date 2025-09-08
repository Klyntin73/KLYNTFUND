import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema({
   user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
   },
   action: {
      type: String,
      required: true,
      enum: [
         'signup',
         'project_created',
         'project_approved',
         'project_rejected',
         'investment_made',
         'account_suspended',
         'account_approved'
      ],
   },
   meta: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
   },
   createdAt: {
      type: Date,
      default: Date.now,
   },
});

const activityLogModel = mongoose.models.activitylogs || mongoose.model('activitylogs', activityLogSchema);

export default activityLogModel;
