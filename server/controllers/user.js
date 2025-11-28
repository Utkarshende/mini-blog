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
  const { name, email, password } = req.body;

  const { error } = signupSchema.validate({ name, email, password });
  if (error) return res.status(400).json({ success:false, message: error.message });

  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ success:false, message: "User already exists" });

  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashed });
  const saved = await user.save();

  const userObj = saved.toObject();
  delete userObj.password;

  return res.status(201).json({ success: true, message: "User registered", user: userObj });
};

export const postLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ success:false, message: "Email and password required" });

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ success:false, message: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ success:false, message: "Invalid credentials" });

  const token = jwt.sign({ id: user._id.toString(), email: user.email, name: user.name }, process.env.JWT_SECRET, { expiresIn: "1d" });
  const userObj = user.toObject();
  delete userObj.password;

  return res.json({ success: true, message: "Logged in", user: userObj, token });
};
