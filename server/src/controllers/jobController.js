import { body } from "express-validator";
import { Job } from "../models/Job.js";
import { Application } from "../models/Application.js";

export const jobValidators = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("description").trim().isLength({ min: 40 }).withMessage("Write a fuller job description"),
  body("company").trim().notEmpty().withMessage("Company is required"),
  body("location").trim().notEmpty().withMessage("Location is required"),
  body("type").isIn(["full-time", "part-time", "contract", "internship"]),
];

export async function listJobs(req, res, next) {
  try {
    const { q, location, type, remote } = req.query;
    const page = Math.max(1, Math.floor(Number(req.query.page) || 1));
    const limit = Math.min(50, Math.max(1, Math.floor(Number(req.query.limit) || 10)));
    const filter = { status: "open" };

    if (location) {
      const safeLocation = String(location).slice(0, 100).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.location = new RegExp(safeLocation, "i");
    }
    if (type) filter.type = type;
    if (remote === "true") filter.remote = true;
    if (remote === "false") filter.remote = false;
    if (q) filter.$text = { $search: String(q).slice(0, 200) };

    const skip = (page - 1) * limit;
    const query = Job.find(filter).populate("recruiter", "name company").sort({ createdAt: -1 });
    if (q) query.select({ score: { $meta: "textScore" } }).sort({ score: { $meta: "textScore" } });

    const [jobs, total] = await Promise.all([
      query.skip(skip).limit(limit),
      Job.countDocuments(filter),
    ]);

    res.json({ jobs, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
}

export async function getJob(req, res, next) {
  try {
    const job = await Job.findById(req.params.id).populate("recruiter", "name company");
    if (!job) return res.status(404).json({ message: "Job not found" });
    job.views += 1;
    await job.save();
    res.json({ job });
  } catch (err) {
    next(err);
  }
}

export async function createJob(req, res, next) {
  try {
    const job = await Job.create({
      ...req.body,
      recruiter: req.user._id,
      company: req.body.company || req.user.company,
      skills: Array.isArray(req.body.skills)
        ? req.body.skills
        : String(req.body.skills || "")
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
    });
    res.status(201).json({ job });
  } catch (err) {
    next(err);
  }
}

export async function updateJob(req, res, next) {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (String(job.recruiter) !== String(req.user._id)) {
      return res.status(403).json({ message: "You can only edit your own jobs" });
    }
    const fields = ["title", "description", "company", "location", "type", "remote", "salaryMin", "salaryMax", "status"];
    for (const field of fields) {
      if (req.body[field] !== undefined) job[field] = req.body[field];
    }
    if (req.body.skills !== undefined) {
      job.skills = Array.isArray(req.body.skills)
        ? req.body.skills
        : String(req.body.skills)
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
    }
    await job.save();
    res.json({ job });
  } catch (err) {
    next(err);
  }
}

export async function myJobs(req, res, next) {
  try {
    const jobs = await Job.find({ recruiter: req.user._id }).sort({ createdAt: -1 });
    const counts = await Application.aggregate([
      { $match: { recruiter: req.user._id } },
      { $group: { _id: "$job", total: { $sum: 1 } } },
    ]);
    const countMap = Object.fromEntries(counts.map((c) => [String(c._id), c.total]));
    res.json({
      jobs: jobs.map((job) => ({
        ...job.toObject(),
        applicationCount: countMap[String(job._id)] || 0,
      })),
    });
  } catch (err) {
    next(err);
  }
}

export async function jobAnalytics(req, res, next) {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (String(job.recruiter) !== String(req.user._id)) {
      return res.status(403).json({ message: "Not your job" });
    }

    const pipeline = await Application.aggregate([
      { $match: { job: job._id } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const byStatus = Object.fromEntries(pipeline.map((p) => [p._id, p.count]));
    const applies = pipeline.reduce((sum, p) => sum + p.count, 0);
    const conversion = job.views ? Number(((applies / job.views) * 100).toFixed(1)) : 0;

    res.json({
      jobId: job._id,
      title: job.title,
      views: job.views,
      applies,
      conversion,
      byStatus: {
        applied: byStatus.applied || 0,
        reviewing: byStatus.reviewing || 0,
        shortlisted: byStatus.shortlisted || 0,
        rejected: byStatus.rejected || 0,
        hired: byStatus.hired || 0,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function recruiterOverview(req, res, next) {
  try {
    const jobs = await Job.find({ recruiter: req.user._id });
    const jobIds = jobs.map((j) => j._id);
    const views = jobs.reduce((sum, j) => sum + j.views, 0);
    const applies = await Application.countDocuments({ recruiter: req.user._id });
    const shortlisted = await Application.countDocuments({
      recruiter: req.user._id,
      status: "shortlisted",
    });
    const openJobs = jobs.filter((j) => j.status === "open").length;
    res.json({ openJobs, views, applies, shortlisted, jobCount: jobs.length, jobIds });
  } catch (err) {
    next(err);
  }
}
