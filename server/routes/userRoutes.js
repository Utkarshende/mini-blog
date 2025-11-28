import express from "express";
import { postSignup, postLogin } from "../controllers/user.js";
const router = express.Router();

router.post("/signup", postSignup);
router.post("/login", postLogin);



export default router;
