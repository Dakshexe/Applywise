import path from "path";
import { Application, APPLICATION_STATUSES } from "../models/Application.js";
import { Job } from "../models/Job.js";
import { notifyUser } from "../utils/notify.js";
import { uploadsDir } from "../middleware/upload.js";

export async function applyToJob(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Resume file is required" });
    }
    const job = await Job.findById(req.params.jobId).populate("recruiter");
    if (!job || job.status !== "open") {
      return res.status(404).json({ message: "This job is not open for applications" });
    }

    const application = await Application.create({
      job: job._id,
      candidate: req.user._id,
      recruiter: job.recruiter._id,
      resumePath: req.file.filename,
      resumeName: req.file.originalname,
      coverLetter: req.body.coverLetter || "",
    });

    await notifyUser({
      userId: job.recruiter._id,
      email: job.recruiter.email,
      title: `New application: ${job.title}`,
      body: `${req.user.name} applied to ${job.title}.`,
      link: `/recruiter/jobs/${job._id}`,
    });

    res.status(201).json({ application });
  } catch (err) {
    next(err);
  }
}

export async function myApplications(req, res, next) {
  try {
    const applications = await Application.find({ candidate: req.user._id })
      .populate("job", "title company location type status")
      .sort({ createdAt: -1 });
    res.json({ applications });
  } catch (err) {
    next(err);
  }
}

export async function jobApplications(req, res, next) {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (String(job.recruiter) !== String(req.user._id)) {
      return res.status(403).json({ message: "Not your job" });
    }
    const applications = await Application.find({ job: job._id })
      .populate("candidate", "name email headline location skills")
      .sort({ createdAt: -1 });
    res.json({ job, applications });
  } catch (err) {
    next(err);
  }
}

export async function updateApplicationStatus(req, res, next) {
  try {
    const { status, notes } = req.body;
    if (!APPLICATION_STATUSES.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    const application = await Application.findById(req.params.id)
      .populate("candidate")
      .populate("job");
    if (!application) return res.status(404).json({ message: "Application not found" });
    if (String(application.recruiter) !== String(req.user._id)) {
      return res.status(403).json({ message: "Not your application" });
    }
    application.status = status;
    if (notes !== undefined) application.notes = notes;
    await application.save();

    await notifyUser({
      userId: application.candidate._id,
      email: application.candidate.email,
      title: `Application update: ${application.job.title}`,
      body: `Your application is now "${status}".`,
      link: "/candidate/applications",
    });

    res.json({ application });
  } catch (err) {
    next(err);
  }
}

export function resumeFile(req, res, next) {
  Application.findById(req.params.id)
    .then((application) => {
      if (!application) return res.status(404).json({ message: "Application not found" });
      const isOwner =
        String(application.recruiter) === String(req.user._id) ||
        String(application.candidate) === String(req.user._id);
      if (!isOwner) return res.status(403).json({ message: "Not allowed" });
      const filePath = path.join(uploadsDir, application.resumePath);
      res.download(filePath, application.resumeName);
    })
    .catch(next);
}
