import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    company: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["full-time", "part-time", "contract", "internship"],
      default: "full-time",
    },
    remote: { type: Boolean, default: false },
    salaryMin: { type: Number, default: 0 },
    salaryMax: { type: Number, default: 0 },
    skills: [{ type: String, trim: true }],
    recruiter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["open", "closed"], default: "open" },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

jobSchema.index({ title: "text", description: "text", company: "text", skills: "text" });
jobSchema.index({ status: 1, createdAt: -1 });
jobSchema.index({ recruiter: 1, status: 1 });
jobSchema.index({ location: 1, type: 1, remote: 1 });

export const Job = mongoose.model("Job", jobSchema);
