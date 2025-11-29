import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Joi from "joi"; // optional

const signupSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).pattern(/^(?=.*[A-Za-z])(?=.*\d).+$/).required()
});

export const postSignup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    const { error } = signupSchema.validate({ name, email, password });
    if (error)
      return res.status(400).json({ success: false, message: error.message });

    // Check if user exists
    const existing = await User.findOne({ email });
    if (existing)
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Save user
    const user = new User({ name, email, password: hashed });
    const savedUser = await user.save();

    const userObj = savedUser.toObject();
    delete userObj.password; // Remove password from response

    return res
      .status(201)
      .json({ success: true, message: "User registered", user: userObj });
  } catch (error) {
    console.error("Signup error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error during signup" });
  }
};

// --------------------- LOGIN ---------------------
export const postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ success: false, message: "Email and password required" });

    // Find user
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });

    // Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });

    // Generate JWT
    const token = jwt.sign(
      { _id: user._id.toString(), email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const userObj = user.toObject();
    delete userObj.password;

    return res.json({
      success: true,
      message: "Logged in successfully",
      token, // frontend will store this
      user: userObj, // sanitized user
    });
  } catch (error) {
    console.error("Login error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error during login" });
  }
};