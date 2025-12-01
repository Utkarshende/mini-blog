import { model, Schema } from "mongoose";

const userSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true } // hashed password
}, { timestamps: true });

export default model("User", userSchema);
