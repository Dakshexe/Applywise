import { Router } from "express";
import {
  createSavedSearch,
  deleteSavedSearch,
  listNotifications,
  listSavedSearches,
  markNotificationsRead,
  uploadProfileResume,
  downloadProfileResume,
} from "../controllers/accountController.js";
import { protect, requireRole } from "../middleware/auth.js";
import { uploadResume } from "../middleware/upload.js";

const router = Router();

router.get("/saved-searches", protect, listSavedSearches);
router.post("/saved-searches", protect, createSavedSearch);
router.delete("/saved-searches/:id", protect, deleteSavedSearch);
router.get("/notifications", protect, listNotifications);
router.patch("/notifications/read", protect, markNotificationsRead);
router.post("/profile/resume", protect, requireRole("candidate"), uploadResume.single("resume"), uploadProfileResume);
router.get("/profile/resume", protect, requireRole("candidate"), downloadProfileResume);

export default router;
