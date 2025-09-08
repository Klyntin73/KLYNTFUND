import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
   message: { type: String, required: true },
   email: { type: String },
   fullName: { type: String },
   type: {
      type: String,
      enum: ["Notice", "Warning", "Suspension", "Complaint", "Other"],
      default: "Other"
   },
   createdAt: { type: Date, default: Date.now },
   user: { type: mongoose.Schema.Types.ObjectId, ref: "user" }
});

const feedbackModel = mongoose.models.feedback || mongoose.model("feedback", feedbackSchema);

export default feedbackModel;
