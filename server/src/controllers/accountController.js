import { SavedSearch } from "../models/SavedSearch.js";
import { Notification } from "../models/Notification.js";
import fs from "fs/promises";
import path from "path";
import { uploadsDir } from "../middleware/upload.js";
import { publicUser } from "../utils/helpers.js";

export async function uploadProfileResume(req, res, next) {
  if (!req.file) return res.status(400).json({ message: "Resume file is required" });

  const previousPath = req.user.resumePath;
  try {
    req.user.resumePath = req.file.filename;
    req.user.resumeName = req.file.originalname;
    await req.user.save();

    if (previousPath && previousPath !== req.file.filename) {
      await fs.unlink(path.join(uploadsDir, path.basename(previousPath))).catch((err) => {
        if (err.code !== "ENOENT") console.error("Could not remove previous resume:", err.message);
      });
    }

    res.json({ user: publicUser(req.user) });
  } catch (err) {
    await fs.unlink(path.join(uploadsDir, req.file.filename)).catch(() => {});
    next(err);
  }
}

export async function downloadProfileResume(req, res, next) {
  try {
    if (!req.user.resumePath) return res.status(404).json({ message: "No resume uploaded yet" });
    const filePath = path.join(uploadsDir, path.basename(req.user.resumePath));
    res.download(filePath, req.user.resumeName || "resume", (err) => {
      if (err && !res.headersSent) next(err);
    });
  } catch (err) {
    next(err);
  }
}

export async function listSavedSearches(req, res, next) {
  try {
    const searches = await SavedSearch.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ searches });
  } catch (err) {
    next(err);
  }
}

export async function createSavedSearch(req, res, next) {
  try {
    const search = await SavedSearch.create({
      user: req.user._id,
      name: req.body.name,
      filters: req.body.filters || {},
    });
    res.status(201).json({ search });
  } catch (err) {
    next(err);
  }
}

export async function deleteSavedSearch(req, res, next) {
  try {
    const search = await SavedSearch.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!search) return res.status(404).json({ message: "Saved search not found" });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

export async function listNotifications(req, res, next) {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(40);
    const unread = await Notification.countDocuments({ user: req.user._id, read: false });
    res.json({ notifications, unread });
  } catch (err) {
    next(err);
  }
}

export async function markNotificationsRead(req, res, next) {
  try {
    await Notification.updateMany({ user: req.user._id, read: false }, { $set: { read: true } });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}
