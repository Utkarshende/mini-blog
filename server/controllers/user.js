import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const postSignup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ success:false, message: 'All fields required' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success:false, message: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed });
    const saved = await user.save();

    const userObj = { id: saved._id.toString(), name: saved.name, email: saved.email };
    return res.status(201).json({ success:true, data: userObj });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ success:false, message: 'Server error' });
  }
};

export const postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success:false, message: 'Email and password required.' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ success:false, message: 'Invalid credentials.' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ success:false, message: 'Invalid credentials.' });

    const token = jwt.sign({ id: user._id.toString(), name: user.name }, process.env.JWT_SECRET, { expiresIn: '7d' });
    const userObj = { id: user._id.toString(), name: user.name, email: user.email, token };

    return res.status(200).json({ success:true, data: userObj });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success:false, message: 'Server error' });
  }
};
