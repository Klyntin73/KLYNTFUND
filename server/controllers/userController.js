import validator from 'validator';
import bcrypt from 'bcrypt';
import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../utils/sendEmail.js';

// **Register User**
const registerUser = async (req, res) => {
   try {
      const { fullName, email, password, role } = req.body;

      // Validate input Fields
      if (!fullName || !email || !password || !role) {
         return res.status(400).json({ success: false, message: "Missing Details" });
      }
      if (!validator.isEmail(email)) {
         return res.status(400).json({ success: false, message: "Enter a valid email" });
      }
      if (password.length < 8) {
         return res.status(400).json({ success: false, message: "Enter a strong password (8+ characters)" });
      }

      // Validate Role
      if (!['creator', 'investor'].includes(role)) {
         return res.status(400).json({ success: false, message: "Invalid role" });
      }

      // Check if user exists
      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
         return res.status(400).json({ success: false, message: "User with this email already exists" });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const userData = {
         fullName,
         email,
         role,
         password: hashedPassword
      };

      const newUser = new userModel(userData);
      const user = await newUser.save();

      // Generate token
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

      res.status(201).json({
         success: true,
         token,
         userData: {
            id: user._id,
            name: user.fullName,
            email: user.email,
            role: user.role
         }
      });

   } catch (error) {
      console.error("Error in Register: ", error);
      res.status(500).json({ success: false, message: "Something went wrong. Please try again later." });
   }
};

// **Login User**
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Missing Details" });
    }

    // Find user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please register to login.",
      });
    }

    // Check if suspended
    if (user.suspended) {
      // Send email notification
      await sendEmail({
        to: user.email,
        subject: "Account Suspended - Login Attempt Blocked",
        text: `Hello ${user.fullName || "User"},\n\nYou recently attempted to log in, but your account is currently suspended. Please contact our support team for assistance.`,
        headerColor: "#DC2626",
      });

      return res.status(403).json({
        success: false,
        message:
          "Your account is suspended. Please check your email or contact support.",
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentials" });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Return user data with token
    res.status(200).json({
      success: true,
      token,
      userData: {
        id: user._id,
        name: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error in LoginUser: ", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

// **Get User Profile**
const getUserProfile = async (req, res) => {
   try {
      const userId = req.user._id;

      // Fetch the user profile by ID 
      const userData = await userModel.findById(userId).select('-password');

      if (!userData) {
         return res.status(404).json({ success: false, message: 'User not found' });
      }

      // Return the user profile data
      return res.status(200).json({ success: true, userData });
   } catch (error) {
      console.error("Error in Getting User Profile: ", error);
      return res.status(500).json({ success: false, message: 'Something went wrong' });
   }
};

// **Update user profile controller**
const updateProfile = async (req, res) => {
   try {
      // Check for validation errors using validator package 
      const errors = [];

      if (!req.body.fullName || req.body.fullName.trim().length === 0) {
         errors.push('fullName is required');
      }
      if (!req.body.email || !/\S+@\S+\.\S+/.test(req.body.email)) {
         errors.push('A valid email is required');
      }
      if (errors.length) {
         return res.status(400).json({ errors });
      }

      // Destructure the request body
      const { fullName, email, location, bio, twitter, linkedin } = req.body;
      const userId = req.user._id;
      // Find the user based on the user ID
      const user = await userModel.findById(userId);

      if (!user) {
         return res.status(404).json({ message: 'User not found' });
      }

      // Update the user's profile details
      if (fullName) user.fullName = fullName;
      if (email) user.email = email;
      if (location) user.location = location;
      if (bio) user.bio = bio;
      if (twitter) user.twitter = twitter;
      if (linkedin) user.linkedin = linkedin;

      // If a new profile image is uploaded (handled by multer middleware)
      if (req.file) {
         user.imageUrl = req.file.path;
      }

      // Save the updated user data
      await user.save();

      return res.status(200).json({
         success: true,
         message: 'Profile updated successfully',
         user: {
            ...user.toObject(),
            imageUrl: user.imageUrl
         },
      });
   } catch (error) {
      console.error("Error in UpdateProfile: ", error);
      return res.status(500).json({ success: false, message: 'Something went wrong' });
   }
};

// ** Export all controllers **
export {
   registerUser,
   loginUser,
   getUserProfile,
   updateProfile
};