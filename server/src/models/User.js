import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["candidate", "recruiter"], required: true },
    company: { type: String, trim: true, default: "" },
    headline: { type: String, trim: true, default: "" },
    location: { type: String, trim: true, default: "" },
    skills: [{ type: String, trim: true }],
    resumePath: { type: String, default: "", select: false },
    resumeName: { type: String, default: "" },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
