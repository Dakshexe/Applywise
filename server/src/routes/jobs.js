import { Router } from "express";
import {
  createJob,
  getJob,
  jobAnalytics,
  jobValidators,
  listJobs,
  myJobs,
  recruiterOverview,
  updateJob,
} from "../controllers/jobController.js";
import { validate } from "../utils/helpers.js";
import { protect, requireRole } from "../middleware/auth.js";

const router = Router();

router.get("/", listJobs);
router.get("/mine", protect, requireRole("recruiter"), myJobs);
router.get("/overview", protect, requireRole("recruiter"), recruiterOverview);
router.get("/:id/analytics", protect, requireRole("recruiter"), jobAnalytics);
router.get("/:id", getJob);
router.post("/", protect, requireRole("recruiter"), jobValidators, validate, createJob);
router.patch("/:id", protect, requireRole("recruiter"), updateJob);

export default router;
