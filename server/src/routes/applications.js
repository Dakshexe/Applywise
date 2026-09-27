import { Router } from "express";
import {
  applyToJob,
  jobApplications,
  myApplications,
  resumeFile,
  updateApplicationStatus,
} from "../controllers/applicationController.js";
import { protect, requireRole } from "../middleware/auth.js";
import { uploadResume } from "../middleware/upload.js";

const router = Router();

router.get("/me", protect, requireRole("candidate"), myApplications);
router.get("/job/:jobId", protect, requireRole("recruiter"), jobApplications);
router.post("/job/:jobId", protect, requireRole("candidate"), uploadResume.single("resume"), applyToJob);
router.patch("/:id/status", protect, requireRole("recruiter"), updateApplicationStatus);
router.get("/:id/resume", protect, resumeFile);

export default router;
