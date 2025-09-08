import feedbackModel from "../models/feedbackModel.js";

// @desc    Create new feedback
export const createFeedback = async (req, res) => {
   try {
      const { message, email, fullName, type } = req.body;
      const userId = req.user ? req.user._id : null;

      if (!message) {
         return res.status(400).json({ success: false, message: "Message is required" });
      }

      const feedback = await feedbackModel.create({
         message,
         email,
         fullName,
         type,
         user: userId,
      });

      res.status(201).json({
         success: true,
         message: "Feedback submitted successfully",
         data: feedback,
      });
   } catch (error) {
      console.error("Error creating feedback:", error);
      res.status(500).json({ success: false, message: "Server error" });
   }
};

// @desc    Get all feedback (Admin only)
export const getAllFeedbacks = async (req, res) => {
   try {
      const feedbacks = await feedbackModel
         .find()
         .populate("user", "fullName email role")
         .sort({ createdAt: -1 });

      res.status(200).json({
         success: true,
         feedbacks,
      });
   } catch (error) {
      console.error("Error fetching feedbacks:", error);
      res.status(500).json({ success: false, message: "Server error" });
   }
};

// @desc    Get single feedback by ID
export const getFeedbackById = async (req, res) => {
   try {
      const feedback = await feedbackModel
         .findById(req.params.id)
         .populate("user", "fullName email role");

      if (!feedback) {
         return res.status(404).json({ success: false, message: "Feedback not found" });
      }

      res.status(200).json({
         success: true,
         data: feedback,
      });
   } catch (error) {
      console.error("Error fetching feedback:", error);
      res.status(500).json({ success: false, message: "Server error" });
   }
};

// @desc    Delete feedback
export const deleteFeedback = async (req, res) => {
   try {
      const feedback = await feedbackModel.findById(req.params.id);

      if (!feedback) {
         return res.status(404).json({ success: false, message: "Feedback not found" });
      }

      await feedback.deleteOne();

      res.status(200).json({
         success: true,
         message: "Feedback deleted successfully",
      });
   } catch (error) {
      console.error("Error deleting feedback:", error);
      res.status(500).json({ success: false, message: "Server error" });
   }
};
