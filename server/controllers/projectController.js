import projectModel from "../models/projectModel.js";
import { sendEmail } from "../utils/sendEmail.js";
import dotenv from "dotenv";
dotenv.config();

// ** Add New Project
const addProject = async (req, res) => {
  try {
    // Validate required fields
    const requiredFields = [
      "title", "category", "pitch", "location",
      "overview", "problemSolution", "goal",
      "duration", "minInvestment", "impact",
      "returnRate", "repaymentPeriod"
    ];

    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({
          success: false,
          message: `Missing required field: ${field}`,
        });
      }
    }

    // Check if thumbnail is uploaded
    if (!req.file || !req.file.path) {
      return res.status(400).json({
        success: false,
        message: "Project thumbnail is required.",
      });
    }

    // Extract fields safely
    const {
      title, category, pitch,
      location, overview, problemSolution,
      goal, duration, minInvestment, impact,
      returnRate, repaymentPeriod
    } = req.body;

    const thumbnail = req.file.path;

    // Create new Project instance
    const newProject = new projectModel({
      title: title.trim(),
      category: category.trim(),
      thumbnail,
      pitch: pitch.trim(),
      location: location.trim(),
      overview: overview.trim(),
      problemSolution: problemSolution.trim(),
      goal: Number(goal),
      duration: Number(duration),
      minInvestment: Number(minInvestment),
      impact: impact.trim(),
      creator: req.user._id,
      returnRate: Number(returnRate),
      repaymentPeriod: Number(repaymentPeriod),
    });

    // Save to DB
    await newProject.save();

    // Notify admin via email with table UI
    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: "🚀 New Project Uploaded - Approval Required",
      text: `A new project titled "${title}" has been uploaded and is awaiting review.`,
      html: `
        <div style="font-family: Arial, sans-serif; background:#f9f9f9; padding:30px;">
          <div style="max-width:700px; margin:auto; background:#fff; border-radius:10px; box-shadow:0 4px 10px rgba(0,0,0,0.1); overflow:hidden;">
            <!-- Header -->
            <div style="background:#4F46E5; color:white; padding:20px; text-align:center;">
              <h2 style="margin:0;">New Project Uploaded</h2>
              <p style="margin:5px 0 0;">A new project requires your review & approval</p>
            </div>

            <!-- Thumbnail -->
            <div style="padding:20px; text-align:center;">
              <img src="${thumbnail}" alt="Project Thumbnail" style="max-width:100%; border-radius:8px;"/>
            </div>

            <!-- Project Details Table -->
            <div style="padding:0 20px 20px;">
              <table style="width:100%; border-collapse:collapse; font-size:14px; color:#333;">
                <thead>
                  <tr>
                    <th colspan="2" style="background:#f3f4f6; padding:10px; text-align:left; font-size:16px; border-bottom:2px solid #ddd;">
                      Project Details
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style="padding:10px; font-weight:bold; width:30%; border-bottom:1px solid #eee;">Title</td>
                    <td style="padding:10px; border-bottom:1px solid #eee;">${title}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px; font-weight:bold; border-bottom:1px solid #eee;">Category</td>
                    <td style="padding:10px; border-bottom:1px solid #eee;">${category}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px; font-weight:bold; border-bottom:1px solid #eee;">Location</td>
                    <td style="padding:10px; border-bottom:1px solid #eee;">${location}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px; font-weight:bold; border-bottom:1px solid #eee;">Goal</td>
                    <td style="padding:10px; border-bottom:1px solid #eee;">${goal}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px; font-weight:bold; border-bottom:1px solid #eee;">Duration</td>
                    <td style="padding:10px; border-bottom:1px solid #eee;">${duration} months</td>
                  </tr>
                  <tr>
                    <td style="padding:10px; font-weight:bold; border-bottom:1px solid #eee;">Min. Investment</td>
                    <td style="padding:10px; border-bottom:1px solid #eee;">${minInvestment}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px; font-weight:bold; border-bottom:1px solid #eee;">Return Rate</td>
                    <td style="padding:10px; border-bottom:1px solid #eee;">${returnRate}%</td>
                  </tr>
                  <tr>
                    <td style="padding:10px; font-weight:bold;">Repayment Period</td>
                    <td style="padding:10px;">${repaymentPeriod} months</td>
                  </tr>
                </tbody>
              </table>

              <!-- CTA Button -->
              <div style="text-align:center; margin-top:25px;">
                <a href="/admin/${process.env.ADMIN_URL}/projects/pending" 
                   style="display:inline-block; background:#4F46E5; color:white; padding:12px 24px; border-radius:6px; text-decoration:none; font-weight:bold;">
                   Review & Approve Project
                </a>
              </div>
            </div>

            <!-- Footer -->
            <div style="background:#f9fafb; padding:15px; text-align:center; font-size:12px; color:#777;">
              © ${new Date().getFullYear()} KLYTNFUND. All rights reserved.
            </div>
          </div>
        </div>
      `,
    });

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      project: newProject,
    });
  } catch (error) {
    console.error("Create Project Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

// ** Get My Projects For Dashboard**
const myProject = async (req, res) => {
   try {
      // Get user ID from request
      const userId = req.user._id;

      // Fetch projects created by the user in sorted order
      const projects = await projectModel
         .find({ creator: userId })
         .sort({ createdAt: -1 })
         .populate("creator", "fullName");

      // Enhance each project with computed values
      const enhancedProjects = projects.map(project => {
         const createdAt = new Date(project.createdAt);
         const duration = project.duration;
         const endDate = new Date(createdAt);
         endDate.setDate(createdAt.getDate() + duration);

         const now = new Date();
         const daysLeft = Math.max(0, Math.ceil((endDate - now) / (1000 * 60 * 60 * 24)));

         const amountRaised = project.currentFunding || 0;
         const percentageFunded = project.goal
            ? Math.min((amountRaised / project.goal) * 100, 100).toFixed(0)
            : "0";

         return {
            ...project.toObject(),
            daysLeft,
            amountRaised,
            percentageFunded
         };
      });

      return res.status(200).json({
         success: true,
         message: "Projects fetched successfully",
         projects: enhancedProjects
      });
   } catch (error) {
      console.error("Get My Projects Error:", error);
      return res.status(500).json({ success: false, message: "Internal server error." });
   }
};

// Creator Dashboard
const creatorDashboard = async (req, res) => {
   try {
      const userId = req.user._id;

      const projects = await projectModel.find({ creator: userId });

      const now = new Date();
      let totalRaised = 0;
      let totalInvestorsSet = new Set();
      let completedCampaigns = 0;
      let activeCampaigns = 0;

      for (const project of projects) {
         totalRaised += project.currentFunding || 0;

         project.investors.forEach(inv => {
            totalInvestorsSet.add(inv.investor.toString());
         });

         const createdAt = new Date(project.createdAt);
         const daysPassed = Math.floor((now - createdAt) / (1000 * 60 * 60 * 24));
         const isFullyFunded = project.currentFunding >= project.goal;
         const isTimeOver = daysPassed >= project.duration;

         if (isFullyFunded || isTimeOver) {
            completedCampaigns++;
         } else {
            activeCampaigns++;
         }
      }

      const totalProjects = projects.length;
      const totalInvestors = totalInvestorsSet.size;
      const averageFunding = totalProjects > 0 ? totalRaised / totalProjects : 0;

      const dashStats = {
         totalProjects,
         totalRaised,
         activeCampaigns,
         completedCampaigns,
         totalInvestors,
         averageFunding,
      };

      return res.status(200).json({ success: true, dashStats });
   } catch (error) {
      console.error("Creator Dashboard Error:", error);
      return res.status(500).json({ success: false, message: "Internal server error." });
   }
};

// **Get All Project for Frontend**
const getAllProjects = async (req, res) => {
   try {
      // Fetch only approved/active projects
      let projects = await projectModel
         .find({ status: { $in: ["approved", "active"] } })
         .populate("creator", "fullName")
         .sort({ createdAt: -1 });

      if (!projects || projects.length === 0) {
         return res.status(404).json({ success: false, message: "No projects found." });
      }

      // Enhance and auto-update status if funded
      const enhancedProjects = await Promise.all(
         projects.map(async (project) => {
            const createdAt = new Date(project.createdAt);
            const duration = project.duration;
            const endDate = new Date(createdAt);
            endDate.setDate(createdAt.getDate() + duration);

            const now = new Date();
            const daysLeft = Math.max(0, Math.ceil((endDate - now) / (1000 * 60 * 60 * 24)));

            const amountRaised = project.currentFunding || 0;
            const percentageFunded = project.goal
               ? Math.min((amountRaised / project.goal) * 100, 100).toFixed(0)
               : "0";

            // ✅ Auto-mark project as completed when fully funded
            if (amountRaised >= project.goal && project.status !== "completed") {
               project.status = "completed";
               await project.save(); // persist update
            }

            return {
               ...project.toObject(),
               daysLeft,
               amountRaised,
               percentageFunded,
               investorCount: project.investors?.length || 0,
            };
         })
      );

      // Exclude completed projects from final response
      const activeProjects = enhancedProjects.filter(p => p.status !== "completed");

      return res.status(200).json({
         success: true,
         message: "Projects fetched successfully",
         projects: activeProjects,
      });

   } catch (error) {
      console.error("Get All Projects Error:", error);
      return res.status(500).json({ success: false, message: "Internal server error." });
   }
};

const viewProject = async (req, res) => {
   try {
      const projectId = req.params.id;

      // Validate MongoDB ObjectId format
      if (!projectId.match(/^[0-9a-fA-F]{24}$/)) {
         return res.status(400).json({ success: false, message: 'Invalid project ID' });
      }

      // Find project and populate creator's name and bio
      const project = await projectModel.findById(projectId).populate('creator', 'fullName bio imageUrl twitter linkedin');

      if (!project) {
         return res.status(404).json({ success: false, message: 'Project not found' });
      }

      // Compute enhancements
      const createdAt = new Date(project.createdAt);
      const endDate = new Date(createdAt);
      endDate.setDate(createdAt.getDate() + project.duration);

      const now = new Date();
      const daysLeft = Math.max(0, Math.ceil((endDate - now) / (1000 * 60 * 60 * 24)));

      const amountRaised = project.currentFunding || 0;
      const percentageFunded = project.goal
         ? Math.min((amountRaised / project.goal) * 100, 100).toFixed(0)
         : "0";

      const enhancedProject = {
         ...project.toObject(),
         daysLeft,
         amountRaised,
         percentageFunded,
         investorCount: project.investors?.length || 0
      };

      return res.status(200).json({
         success: true,
         message: "Project fetched successfully",
         project: enhancedProject
      });

   } catch (error) {
      console.error('Error fetching project:', error);
      res.status(500).json({ success: false, message: 'Server error while fetching project' });
   }
};

// ** Get Project By Id
const getProjectById = async (req, res) => {
   try {
      const project = await projectModel.findById(req.params.id);
      if (!project) {
         return res.status(404).json({ success: false, message: "Project not found" });
      }
      res.json({ success: true, project });
   } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Server error" });
   }
};

// **Update Project
const editProject = async (req, res) => {
   try {
      const projectId = req.params.id;
      const userId = req.user._id;

      let project = await projectModel.findOne({ _id: projectId, creator: userId });
      if (!project) {
         return res.status(404).json({ success: false, message: 'Project not found or unauthorized' });
      }

      const {
         title, category, pitch, location,
         overview, problemSolution, goal,
         duration, minInvestment, impact,
         returnRate, repaymentPeriod
      } = req.body;

      // Update fields if provided
      if (title) project.title = title;
      if (category) project.category = category;
      if (pitch) project.pitch = pitch;
      if (location) project.location = location;
      if (overview) project.overview = overview;
      if (problemSolution) project.problemSolution = problemSolution;
      if (goal) project.goal = goal;
      if (duration) project.duration = duration;
      if (minInvestment) project.minInvestment = minInvestment;
      if (impact) project.impact = impact;
      if (returnRate) project.returnRate = returnRate;
      if (repaymentPeriod) project.repaymentPeriod = repaymentPeriod;

      // Thumbnail update
      if (req.file) {
         project.thumbnail = req.file.path;
      }

      await project.save();

      return res.status(200).json({ success: true, message: 'Project updated successfully', project });

   } catch (error) {
      console.error("Edit Project Error:", error);
      return res.status(500).json({ success: false, message: 'Server error while updating project' });
   }
};


// ** Search Projects
const searchProjects = async (req, res) => {
   try {
      const { query = '', page = 1, limit = 10 } = req.query;

      const regex = new RegExp(query, 'i');
      const filter = {
         $or: [
            { title: regex },
            { category: regex },
            { location: regex }
         ]
      };

      const projects = await projectModel.find(filter)
         .skip((page - 1) * limit)
         .limit(parseInt(limit))
         .select('title category location thumbnail goal currentFunding minInvestment')
         .populate("creator", "fullName");

      const total = await projectModel.countDocuments(filter);

      res.status(200).json({
         success: true,
         data: projects,
         pagination: {
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
         }
      });
   } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({ success: false, message: 'Server error during search' });
   }
};

// ** Get Suggestion of Projects
const getSuggestions = async (req, res) => {
   try {
      const { query } = req.query;
      if (!query) return res.json({ success: false, suggestions: [] });

      const regex = new RegExp(query, 'i');

      const suggestions = await projectModel.find({
         $or: [
            { title: regex },
            { category: regex },
            { location: regex }
         ]
      })
         .limit(5)
         .select('title')
         .lean();

      res.status(200).json({
         success: true,
         suggestions: suggestions.map(item => item.title) || []
      });

   } catch (error) {
      console.error('Suggestion error:', error);
      res.status(500).json({ success: false, suggestions: [] });
   }
};

// ** Export all controllers **
export {
   addProject, myProject, getAllProjects,
   creatorDashboard, viewProject, editProject,
   getProjectById, searchProjects, getSuggestions
};