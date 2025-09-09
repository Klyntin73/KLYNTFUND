import userModel from '../models/userModel.js';
import projectModel from '../models/projectModel.js';
import activityLogModel from '../models/activityLogModel.js';
import { getLastNDays } from '../utils/dateGrouping.js';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { sendEmail } from '../utils/sendEmail.js';

// ** Admin login
export const adminLogin = async (req, res) => {
   try {
      const { email, password } = req.body;

      if (
         email !== process.env.ADMIN_EMAIL ||
         password !== process.env.ADMIN_PASSWORD
      ) {
         return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      const token = jwt.sign({ isAdmin: true }, process.env.JWT_SECRET, {
         expiresIn: '7d',
      });

      res.json({ success: true, message: 'Login successful', token });
   } catch (error) {
      console.error('Admin login error:', error.message);
      res.status(500).json({ success: false, message: 'Login failed', error: error.message });
   }
};
// ** Analytics Dashboard
export const getAdminDashboardAnalytics = async (req, res) => {
   try {
      // 1️⃣ QUICK STATS
      const totalUsers = await userModel.countDocuments();
      const usersByStatus = {
         active: await userModel.countDocuments({}),
         suspended: 0,
         pending: 0,
      };

      const totalProjects = await projectModel.countDocuments();
      const projectStatusBreakdown = {
         approved: await projectModel.countDocuments({ status: 'approved' }),
         pending: await projectModel.countDocuments({ status: 'pending' }),
         rejected: await projectModel.countDocuments({ status: 'rejected' }),
         completed: await projectModel.countDocuments({ status: 'completed' }),
      };

      const totalInvestments = await projectModel.aggregate([
         { $unwind: '$investors' },
         { $group: { _id: null, count: { $sum: 1 }, totalRaised: { $sum: '$investors.amount' } } }
      ]);

      const investments = totalInvestments[0] || { count: 0, totalRaised: 0 };

      // 2️⃣ PROJECTS OVER TIME (Line Chart: last 7 days)
      const days = getLastNDays(7);
      const projectsOverTime = await Promise.all(days.map(async (day) => {
         const count = await projectModel.countDocuments({
            createdAt: {
               $gte: new Date(`${day}T00:00:00.000Z`),
               $lte: new Date(`${day}T23:59:59.999Z`)
            }
         });
         return { day, count };
      }));

      // 3️⃣ TOP PROJECT CATEGORIES
      const topCategories = await projectModel.aggregate([
         { $group: { _id: '$category', count: { $sum: 1 } } },
         { $sort: { count: -1 } },
         { $limit: 5 }
      ]);

      // 4️⃣ FUNDS RAISED OVER TIME (Last 7 days)
      const fundsOverTime = await Promise.all(days.map(async (day) => {
         const projects = await projectModel.aggregate([
            { $unwind: '$investors' },
            {
               $match: {
                  'investors.investedAt': {
                     $gte: new Date(`${day}T00:00:00.000Z`),
                     $lte: new Date(`${day}T23:59:59.999Z`)
                  }
               }
            },
            {
               $group: {
                  _id: null,
                  total: { $sum: '$investors.amount' }
               }
            }
         ]);
         return { day, amount: projects[0]?.total || 0 };
      }));

      // 5️⃣ NEW USERS THIS MONTH
      const thisMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      const newUsersThisMonth = await userModel.countDocuments({
         createdAt: { $gte: thisMonthStart }
      });

      // 6️⃣ USER ACTIVITY LOG PREVIEW (latest 5)
      const recentActivity = await activityLogModel.find({})
         .sort({ createdAt: -1 })
         .limit(5)
         .populate('user', 'fullName');

      const activityLog = recentActivity.map(log => ({
         user: log.user?.fullName || 'Unknown',
         action: log.action,
         meta: log.meta,
         createdAt: log.createdAt
      }));

      return res.status(200).json({
         success: true,
         data: {
            quickStats: {
               totalUsers,
               usersByStatus,
               totalProjects,
               projectStatusBreakdown,
               totalInvestments: investments.count,
               totalFundsRaised: investments.totalRaised,
            },
            projectActivity: {
               projectsOverTime,
               topCategories,
            },
            investmentOverview: {
               fundsOverTime,
            },
            userEngagement: {
               newUsersThisMonth,
               activityLog,
            }
         }
      });
   } catch (error) {
      console.error('Error in Dashboard Analytics:', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch dashboard analytics' });
   }
};

// ** Project Management Controllers
const getProjectsByStatus = async (req, res, status) => {
   try {
      const projects = await projectModel.find({ status })
         .populate('creator', 'fullName email')
         .sort({ createdAt: -1 });

      res.status(200).json({
         success: true,
         count: projects.length,
         status,
         data: projects
      });
   } catch (error) {
      console.error(`Error fetching ${status} projects:`, error);
      res.status(500).json({
         success: false,
         message: `Failed to fetch ${status} projects`
      });
   }
};

// *Controllers for each status
export const getPendingProjects = (req, res) => getProjectsByStatus(req, res, 'pending');

export const getApprovedProjects = (req, res) => getProjectsByStatus(req, res, 'approved');

export const getRejectedProjects = (req, res) => getProjectsByStatus(req, res, 'rejected');

export const getCompletedProjects = async (req, res) => {
   try {
      const projects = await projectModel.find({
         $or: [
            { status: "completed" },
            { $expr: { $gte: ["$currentFunding", "$goal"] } }
         ]
      })
         .populate("creator", "fullName email")
         .sort({ createdAt: -1 });

      res.status(200).json({
         success: true,
         count: projects.length,
         status: "completed",
         data: projects
      });
   } catch (error) {
      console.error("Error fetching completed projects:", error);
      res.status(500).json({
         success: false,
         message: "Failed to fetch completed projects"
      });
   }
};

// ** View single project by ID
export const getProjectById = async (req, res) => {
   try {
      const { id } = req.params;

      const project = await projectModel.findById(id)
         .populate('creator', 'fullName email')
         .populate('investors.investor', 'fullName email');

      if (!project) {
         return res.status(404).json({ success: false, message: 'Project not found' });
      }

      res.status(200).json({ success: true, data: project });
   } catch (error) {
      console.error('Error fetching project by ID:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch project' });
   }
};

// ** Approve a project
export const approveProject = async (req, res) => {
  try {
    const { id } = req.params;

    // Update project status
    const project = await projectModel.findByIdAndUpdate(
      id,
      { status: "approved" },
      { new: true }
    );

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    // Fetch project creator
    const creator = await userModel.findById(project.creator);
    if (creator) {
      await sendEmail({
        to: creator.email,
        subject: "🎉 Your Project Has Been Approved!",
        text: `Hello ${creator.fullName || "User"},\n\nGreat news! Your project "${project.title}" has been reviewed and approved. You can now start receiving investments.\n\nThank you for building with KLYTNFUND.`,
        html: `
          <div style="font-family: Arial, sans-serif; background:#f9f9f9; padding:30px;">
            <div style="max-width:650px; margin:auto; background:#fff; border-radius:10px; box-shadow:0 4px 10px rgba(0,0,0,0.1); overflow:hidden;">
              <!-- Header -->
              <div style="background:#16A34A; color:white; padding:20px; text-align:center;">
                <h2 style="margin:0;">Project Approved 🎉</h2>
              </div>

              <!-- Body -->
              <div style="padding:25px; color:#333; line-height:1.6;">
                <p>Hello <strong>${creator.fullName || "User"}</strong>,</p>
                <p>Great news! Your project <strong>"${project.title}"</strong> has been reviewed and <strong style="color:#16A34A;">approved</strong>.</p>
                <p>You can now start receiving investments from potential backers.</p>

                <div style="text-align:center; margin:30px 0;">
                  <a href="${process.env.FRONTEND_URL}/projects/${project._id}" 
                     style="display:inline-block; background:#16A34A; color:white; padding:12px 24px; border-radius:6px; text-decoration:none; font-weight:bold;">
                     View Your Project
                  </a>
                </div>

                <p style="font-size:14px; color:#555;">
                  Thank you for building with <strong>KLYTNFUND</strong>.  
                  We’re excited to see your project make an impact!
                </p>
              </div>

              <!-- Footer -->
              <div style="background:#f9fafb; padding:15px; text-align:center; font-size:12px; color:#777;">
                © ${new Date().getFullYear()} KLYTNFUND. All rights reserved.
              </div>
            </div>
          </div>
        `,
      });
    }

    res.status(200).json({
      success: true,
      message: "Project approved successfully",
      data: project,
    });
  } catch (error) {
    console.error("Error approving project:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to approve project" });
  }
};


// ** Reject a project
export const rejectProject = async (req, res) => {
  try {
    const { id } = req.params;

    // Update project status
    const project = await projectModel.findByIdAndUpdate(
      id,
      { status: "rejected" },
      { new: true }
    );

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    // Fetch project creator
    const creator = await userModel.findById(project.creator);
    if (creator) {
      await sendEmail({
        to: creator.email,
        subject: "⚠️ Project Submission Rejected",
        text: `Hello ${creator.fullName || "User"},\n\nUnfortunately, your project "${project.title}" has been reviewed and rejected. For more details or to resubmit, please contact our support team.`,
        html: `
          <div style="font-family: Arial, sans-serif; background:#f9f9f9; padding:30px;">
            <div style="max-width:650px; margin:auto; background:#fff; border-radius:10px; box-shadow:0 4px 10px rgba(0,0,0,0.1); overflow:hidden;">
              <!-- Header -->
              <div style="background:#DC2626; color:white; padding:20px; text-align:center;">
                <h2 style="margin:0;">Project Rejected ⚠️</h2>
              </div>

              <!-- Body -->
              <div style="padding:25px; color:#333; line-height:1.6;">
                <p>Hello <strong>${creator.fullName || "User"}</strong>,</p>
                <p>We’re sorry to inform you that your project <strong>"${project.title}"</strong> has been reviewed and <strong style="color:#DC2626;">rejected</strong>.</p>
                <p>If you’d like to understand why or resubmit with changes, please reach out to our support team.</p>

                <div style="text-align:center; margin:30px 0;">
                  <a href="${process.env.SUPPORT_URL || "mailto:lovelandclintonadm73@gmail.com"}" 
                     style="display:inline-block; background:#DC2626; color:white; padding:12px 24px; border-radius:6px; text-decoration:none; font-weight:bold;">
                     Contact Support
                  </a>
                </div>

                <p style="font-size:14px; color:#555;">
                  Thank you for your effort and interest in <strong>KLYTNFUND</strong>.  
                  We encourage you to refine your project and try again!
                </p>
              </div>

              <!-- Footer -->
              <div style="background:#f9fafb; padding:15px; text-align:center; font-size:12px; color:#777;">
                © ${new Date().getFullYear()} KLYTNFUND. All rights reserved.
              </div>
            </div>
          </div>
        `,
      });
    }

    res.status(200).json({
      success: true,
      message: "Project rejected successfully",
      data: project,
    });
  } catch (error) {
    console.error("Error rejecting project:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to reject project" });
  }
};


// ** Delete a project
export const deleteProject = async (req, res) => {
   try {
      const { id } = req.params;

      const project = await projectModel.findByIdAndDelete(id);

      if (!project) {
         return res.status(404).json({ success: false, message: 'Project not found' });
      }

      res.status(200).json({ success: true, message: 'Project deleted successfully' });
   } catch (error) {
      console.error('Error deleting project:', error);
      res.status(500).json({ success: false, message: 'Failed to delete project' });
   }
};


// **Controller for Investment
export const getAllInvestments = async (req, res) => {
   try {
      let { page = 1, limit = 10, search = "", status, flagged } = req.query;
      page = parseInt(page);
      limit = parseInt(limit);

      const matchStage = {};

      // Filter by status
      if (status) {
         matchStage["investors.status"] = status;
      }

      // Optional filter by flagged
      if (flagged) {
         matchStage["investors.fraudFlag"] = flagged === "true";
      }

      // Search across investor name, email, or project title
      const searchStage = search
         ? {
            $or: [
               { "investorData.fullName": { $regex: search, $options: "i" } },
               { "investorData.email": { $regex: search, $options: "i" } },
               { "projectData.title": { $regex: search, $options: "i" } },
            ],
         }
         : {};

      const pipeline = [
         { $unwind: "$investors" },
         { $match: Object.keys(matchStage).length ? matchStage : {} },

         // Lookup investor details
         {
            $lookup: {
               from: "users",
               localField: "investors.investor",
               foreignField: "_id",
               as: "investorData",
            },
         },
         { $unwind: "$investorData" },

         // Add project info
         {
            $addFields: {
               projectData: {
                  _id: "$_id",
                  title: "$title",
                  category: "$category",
               },
            },
         },

         // Apply search
         { $match: Object.keys(searchStage).length ? searchStage : {} },

         // Shape the response
         {
            $project: {
               _id: "$investors._id",
               amount: "$investors.amount",
               paymentRef: "$investors.paymentRef",
               investedAt: "$investors.investedAt",
               status: "$investors.status",
               expectedReturn: "$investors.expectedReturn",
               fraudFlag: "$investors.fraudFlag",
               fraudReasons: "$investors.fraudReasons",
               "investor.fullName": "$investorData.fullName",
               "investor.email": "$investorData.email",
               "project._id": "$projectData._id",
               "project.title": "$projectData.title",
               "project.category": "$projectData.category",
            },
         },

         { $sort: { investedAt: -1 } },

         // Pagination
         { $skip: (page - 1) * limit },
         { $limit: limit },
      ];

      const data = await projectModel.aggregate(pipeline);

      // Count total (without skip/limit)
      const countPipeline = pipeline.filter(
         stage => !("$skip" in stage || "$limit" in stage)
      );
      const total = (await projectModel.aggregate(countPipeline)).length;

      res.status(200).json({
         success: true,
         count: total,
         page,
         pages: Math.ceil(total / limit),
         data,
      });
   } catch (error) {
      console.error("Error fetching investments:", error);
      res.status(500).json({ success: false, message: "Server error" });
   }
};

// Get Flagged Investment
export const getFlaggedInvestments = async (req, res) => {
   try {
      const pipeline = [
         { $unwind: "$investors" },
         { $match: { "investors.fraudFlag": true } },

         // Lookup investor details
         {
            $lookup: {
               from: "users",
               localField: "investors.investor",
               foreignField: "_id",
               as: "investorData",
            },
         },
         { $unwind: "$investorData" },

         {
            $project: {
               _id: "$investors._id",
               amount: "$investors.amount",
               paymentRef: "$investors.paymentRef",
               investedAt: "$investors.investedAt",
               status: "$investors.status",
               fraudFlag: "$investors.fraudFlag",
               fraudReasons: "$investors.fraudReasons",
               "investor.fullName": "$investorData.fullName",
               "investor.email": "$investorData.email",
               "project.title": "$title",
               "project.category": "$category",
            },
         },
         { $sort: { investedAt: -1 } },
      ];

      const data = await projectModel.aggregate(pipeline);

      res.status(200).json({
         success: true,
         count: data.length,
         data,
      });
   } catch (error) {
      console.error("Error fetching flagged investments:", error);
      res.status(500).json({ success: false, message: "Server error" });
   }
};

// Refund Investment
export const refundInvestment = async (req, res) => {
   try {
      const { investmentId } = req.params;

      const result = await projectModel.updateOne(
         { "investors._id": investmentId },
         {
            $set: {
               "investors.$.status": "refunded",
               "investors.$.isRepaid": true,
               "investors.$.repaidAt": new Date(),
            },
         }
      );

      if (result.modifiedCount === 0) {
         return res.status(404).json({ success: false, message: "Investment not found" });
      }

      res.status(200).json({ success: true, message: "Investment refunded successfully" });
   } catch (error) {
      console.error("Error refunding investment:", error);
      res.status(500).json({ success: false, message: "Server error" });
   }
};

// Get Refunded Investment
export const getRefundedInvestments = async (req, res) => {
  try {
    const pipeline = [
      { $unwind: "$investors" },
      { $match: { "investors.status": "refunded" } },

      // Lookup investor
      {
        $lookup: {
          from: "users",
          localField: "investors.investor",
          foreignField: "_id",
          as: "investorData",
        },
      },
      { $unwind: "$investorData" },

      // Shape response
      {
        $project: {
          _id: "$investors._id",
          amount: "$investors.amount",
          paymentRef: "$investors.paymentRef",
          investedAt: "$investors.investedAt",
          repaidAt: "$investors.repaidAt",
          status: "$investors.status",

          "investor.fullName": "$investorData.fullName",
          "investor.email": "$investorData.email",
          "project.title": "$title",
          "project.category": "$category",
        },
      },
      { $sort: { repaidAt: -1 } },
    ];

    const data = await projectModel.aggregate(pipeline);

    res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    console.error("Error fetching refunded investments:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get Disputed Investment
export const getDisputedInvestments = async (req, res) => {
  try {
    const { resolved } = req.query;

    // Base match: has dispute OR fraud flag
    const match = {
      $or: [
        { "investors.dispute.reason": { $ne: null } },
        { "investors.fraudFlag": true },
      ],
    };

    // Optional filter by resolution status (only applies to dispute)
    if (resolved === "true") match["investors.dispute.resolved"] = true;
    if (resolved === "false") match["investors.dispute.resolved"] = false;

    const pipeline = [
      { $unwind: "$investors" },
      { $match: match },

      // Lookup investor details
      {
        $lookup: {
          from: "users",
          localField: "investors.investor",
          foreignField: "_id",
          as: "investorData",
        },
      },
      { $unwind: "$investorData" },

      // Final shape
      {
        $project: {
          _id: "$investors._id",
          amount: "$investors.amount",
          paymentRef: "$investors.paymentRef",
          investedAt: "$investors.investedAt",
          status: "$investors.status",
          fraudFlag: "$investors.fraudFlag",
          fraudReasons: "$investors.fraudReasons",

          // Dispute details
          "dispute.reason": "$investors.dispute.reason",
          "dispute.date": "$investors.dispute.date",
          "dispute.resolved": "$investors.dispute.resolved",

          // Joined user + project
          "investor.fullName": "$investorData.fullName",
          "investor.email": "$investorData.email",
          "project.title": "$title",
          "project.category": "$category",
        },
      },

      // Sort by dispute date (fallback to investedAt)
      { $sort: { "dispute.date": -1, investedAt: -1 } },
    ];

    const data = await projectModel.aggregate(pipeline);

    res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    console.error("Error fetching disputed investments:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// Update Dispute Status (resolve/reopen)
export const updateDisputeStatus = async (req, res) => {
  try {
    const { id } = req.params; // investment _id (from investors array)
    const { resolved } = req.body;

    if (typeof resolved !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "Resolved field must be a boolean",
      });
    }

    // Find project containing this investment
    const project = await projectModel.findOne(
      { "investors._id": id },
      { "investors.$": 1, title: 1 } // return only the matching investor
    );

    if (!project || project.investors.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Investment not found",
      });
    }

    // Update the specific investor dispute status
    const updated = await projectModel.updateOne(
      { "investors._id": id },
      {
        $set: {
          "investors.$.dispute.resolved": resolved,
        },
      }
    );

    if (updated.modifiedCount === 0) {
      return res.status(400).json({
        success: false,
        message: "Failed to update dispute status",
      });
    }

    return res.status(200).json({
      success: true,
      message: resolved
        ? `Dispute marked as resolved for project "${project.title}"`
        : `Dispute reopened for project "${project.title}"`,
    });
  } catch (err) {
    console.error("Error updating dispute status:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// Get Single Investment
export const getSingleInvestment = async (req, res) => {
   try {
      const { projectId, paymentRef } = req.params;

      // Validate projectId only
      if (!mongoose.Types.ObjectId.isValid(projectId)) {
         return res.status(400).json({ message: "Invalid project ID" });
      }

      // Find project and match investor by paymentRef
      const project = await projectModel
         .findOne(
            { _id: projectId, "investors.paymentRef": paymentRef },
            {
               title: 1,
               category: 1,
               goal: 1,
               currentFunding: 1,
               returnRate: 1,
               repaymentPeriod: 1,
               investors: { $elemMatch: { paymentRef } }
            }
         )
         .populate("investors.investor", "fullName email")
         .lean();

      if (!project) {
         return res.status(404).json({ message: "Investment not found" });
      }

      const investment = project.investors?.[0];
      if (!investment) {
         return res.status(404).json({ message: "Investment not found in project" });
      }

      // Calculate interest
      let interest = null;
      if (project.returnRate && investment.amount) {
         interest = (investment.amount * project.returnRate) / 100;
      }

      res.status(200).json({
         projectTitle: project.title,
         category: project.category,
         goal: project.goal,
         currentFunding: project.currentFunding,
         returnRate: project.returnRate,
         repaymentPeriod: project.repaymentPeriod,
         investment,
         calculatedInterest: interest
      });

   } catch (error) {
      console.error("Error fetching investment:", error);
      res.status(500).json({ message: "Server error" });
   }
};

// ** Delete a project
export const deleteInvestment = async (req, res) => {
   try {
      const { paymentRef } = req.params;

      const project = await projectModel.findOne({ "investors.paymentRef": paymentRef });

      if (!project) {
         return res.status(404).json({ success: false, message: "Investment not found" });
      }

      // Locate the investment inside the project
      const investmentIndex = project.investors.findIndex(inv => inv.paymentRef === paymentRef);

      const deletedInvestment = project.investors[investmentIndex];

      // Deduct the investment amount from currentFunding
      project.currentFunding -= deletedInvestment.amount;

      // Remove the investment from the investors array
      project.investors.splice(investmentIndex, 1);

      // Save updated project
      await project.save();

      res.status(200).json({
         success: true,
         message: "Investment deleted successfully",
         updatedFunding: project.currentFunding,
      });

   } catch (error) {
      console.error("Error deleting investment:", error);
      res.status(500).json({ success: false, message: "Failed to delete investment" });
   }
};

/** User Controller */
// ** Get All Users
export const getUsers = async (req, res) => {
   try {
      const { page = 1, limit = 10, search = "", role } = req.query;

      // Filters
      let filter = {};
      if (search) {
         filter.$or = [
            { fullName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
         ];
      }
      if (role) {
         filter.role = role; // creator or investor
      }

      const skip = (page - 1) * limit;

      // Fetch users
      const users = await userModel
         .find(filter)
         .sort({ createdAt: -1 })
         .skip(skip)
         .limit(parseInt(limit));

      const total = await userModel.countDocuments(filter);

      res.status(200).json({
         success: true,
         count: users.length,
         total,
         page: parseInt(page),
         totalPages: Math.ceil(total / limit),
         data: users,
      });
   } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({
         success: false,
         message: "Server error while fetching users",
      });
   }
};

// Get user By Id
export const getUserById = async (req, res) => {
   try {
      const user = await userModel.findById(req.params.id);

      if (!user) {
         return res.status(404).json({ success: false, message: "User not found" });
      }

      res.status(200).json({
         success: true,
         data: user,
      });
   } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ success: false, message: "Server error" });
   }
};

// Delete a user
export const deleteUser = async (req, res) => {
   try {
      const user = await userModel.findById(req.params.id);

      if (!user) {
         return res.status(404).json({ success: false, message: "User not found" });
      }

      await userModel.findByIdAndDelete(req.params.id);

      res.status(200).json({
         success: true,
         message: "User deleted successfully",
      });
   } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ success: false, message: "Server error" });
   }
};

// Message the User
export const messageUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { subject, message } = req.body;

    const user = await userModel.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Send styled email (util handles HTML + fallback automatically)
    const result = await sendEmail({
      to: user.email,
      subject,
      text: message,
    });

    if (!result.success) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to send email" });
    }

    res.status(200).json({
      success: true,
      message: "Message sent successfully",
      messageId: result.messageId,
    });
  } catch (error) {
    console.error("Error messaging user:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ** Suspend or unsuspend user
export const toggleSuspendUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.findById(id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Toggle suspension
    user.suspended = !user.suspended;
    await user.save();

    // Email details
    const status = user.suspended ? "Suspended" : "Re-activated";
    const subject = `Account ${status}`;
    const plainMessage = user.suspended
      ? `Hello ${user.fullName || "User"},\n\nYour account has been suspended. If you believe this is a mistake, please contact support.`
      : `Hello ${user.fullName || "User"},\n\nYour account has been re-activated. You can now log in and continue using our services.`;

    // Send with dynamic header color
    const result = await sendEmail({
      to: user.email,
      subject,
      text: plainMessage,
      headerColor: user.suspended ? "#DC2626" : "#16A34A",
    });

    if (!result.success) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to send notification email" });
    }

    res.status(200).json({
      success: true,
      message: `User ${status.toLowerCase()} successfully`,
      data: user,
    });
  } catch (error) {
    console.error("Error suspending user:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
