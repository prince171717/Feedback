import UserModel from "../Models/User.js";
import bcrypt from "bcrypt";
import { generateToken } from "../Models/utils.js";
import jwt from "jsonwebtoken";
import feedbackModel from "../Models/feedback.js";

export const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (user) {
      return res.status(409).json({
        message: "User already exist.Please return to login page",
        success: false,
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({ name, email, password: hashPassword ,role: "user" });

    if (newUser) {
      await newUser.save();
      // generateToken(res, newUser);
      return res.status(201).json({
        message: "SignUp successful",
        success: true,
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      });
    } else {
      return res.status(400).json("Invalid user data");
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    const errormsg = "Authentication failed .Email or password is wrong";
    if (!user) {
      return res.status(403).json({ message: errormsg, success: false });
    }

    const isPasswordEqual = await bcrypt.compare(password, user.password);

    if (!isPasswordEqual) {
      return res.status(403).json({ message: errormsg, success: false });
    }
    generateToken(res, user);
    // const jwtToken = generateToken(res, user);

    return res.status(200).json({
      message: "Login successful",
      success: true,
      // jwtToken,
      email,
      name: user.name,
      role: user.role,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "none",
      expires: new Date(0),
    });

    return res.status(200).json({ success:true,message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const checkAuth = async (req, res) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ authenticated: false, token: null });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findById(decoded.userId).select("name email role");

    if (!user) {
      return res.status(401).json({ authenticated: false, user: null });
    }

    console.log("decoded checkauth", user);

    res.json({ authenticated: true, token, user: decoded }); // ✅ Return decoded user info
  } catch (error) {
    return res
      .status(401)
      .json({ authenticated: false, token: null, error: "Invalid token" });
  }
};

export const userFeedback = async (req, res) => {
  try {
    const { userFeedback } = req.body;
    const userId = req.user.id;
    console.log("Received feedback data:", req.body);

    if (!userFeedback) {
      return res.status(400).json({ message: "Feedback is required" });
    }

    const newFeedback = new feedbackModel({ userId, message: userFeedback });

    await newFeedback.save();
    return res
      .status(201)
      .json({ message: "Feedback submitted successfully", success: true });
  } catch (error) {
    console.log("Error in feedback controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const fetchUserFeedback = async (req, res) => {
  try {
    const userId = req.user._id;
    const feedbackData = await feedbackModel
      .find({ userId })
      .sort({ createdAt: -1 });

    console.log(feedbackData);

    if (feedbackData.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No feedbacks found" });
    }

    res.status(200).json({ success: true, feedbackData });
  } catch (error) {
    console.log("Error in fetchUserFeedback controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateFeedback = async (req, res) => {
  try {
    const { userFeedback } = req.body;
    const responseFeedback = await feedbackModel.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!responseFeedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }
    responseFeedback.message = userFeedback;
    await responseFeedback.save();
    res
      .status(200)
      .json({ message: "Feedback updated successfully", success: true });
  } catch (error) {
    console.log("Error in updating controller", error);
    res.status(500).json({ message: "Error updating feedback" });
  }
};

export const deleteFeedback = async (req, res) => {
  try {
    const deletefb = await feedbackModel.findById(req.params.id);
    if (!deletefb) {
      return res
        .status(404)
        .json({ message: "Feedback not found", success: false });
    }
    await feedbackModel.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ message: "Feedback deleted succesfully", success: true });
  } catch (error) {
    console.log("Error in deleting controller", error);
    res.status(500).json({ message: "Error updating feedback" });
  }
};
