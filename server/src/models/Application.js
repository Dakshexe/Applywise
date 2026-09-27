import mongoose from "mongoose";

export const APPLICATION_STATUSES = [
  "applied",
  "reviewing",
  "shortlisted",
  "rejected",
  "hired",
];

const applicationSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    candidate: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    recruiter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    resumePath: { type: String, required: true },
    resumeName: { type: String, required: true },
    coverLetter: { type: String, default: "" },
    status: {
      type: String,
      enum: APPLICATION_STATUSES,
      default: "applied",
    },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

applicationSchema.index({ job: 1, candidate: 1 }, { unique: true });
applicationSchema.index({ recruiter: 1, status: 1, createdAt: -1 });
applicationSchema.index({ candidate: 1, createdAt: -1 });

export const Application = mongoose.model("Application", applicationSchema);
