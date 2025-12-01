import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
dotenv.config();

export const postSignup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: "Email already exists." });

    const user = new User({ name, email, password });
    await user.save();

    const token = jwt.sign({ id: user._id, name: user.name }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ success: true, data: { name: user.name, email: user.email, id: user._id, token } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: "Email and password required." });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ success: false, message: "Invalid credentials." });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ success: false, message: "Invalid credentials." });

    const token = jwt.sign({ id: user._id, name: user.name }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(200).json({ success: true, data: { name: user.name, email: user.email, id: user._id, token } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
