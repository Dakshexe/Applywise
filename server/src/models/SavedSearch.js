import mongoose from "mongoose";

const savedSearchSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, trim: true },
    filters: {
      q: { type: String, default: "" },
      location: { type: String, default: "" },
      type: { type: String, default: "" },
      remote: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

savedSearchSchema.index({ user: 1, createdAt: -1 });

export const SavedSearch = mongoose.model("SavedSearch", savedSearchSchema);
