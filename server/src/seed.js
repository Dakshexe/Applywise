import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { User } from "./models/User.js";
import { Job } from "./models/Job.js";
import { Application } from "./models/Application.js";
import { Notification } from "./models/Notification.js";
import { SavedSearch } from "./models/SavedSearch.js";

dotenv.config();

const jobsSeed = [
  {
    title: "Senior React Engineer",
    company: "Northbeam Labs",
    location: "Bengaluru",
    type: "full-time",
    remote: true,
    salaryMin: 1800000,
    salaryMax: 2800000,
    skills: ["React", "TypeScript", "Node.js"],
    description:
      "Build product surfaces for a high-growth hiring platform. You will own dashboard features, search UX, and hiring pipelines used by recruiters every day. Experience with REST APIs and thoughtful UI states is essential.",
  },
  {
    title: "Backend Engineer (Node/Mongo)",
    company: "Northbeam Labs",
    location: "Hyderabad",
    type: "full-time",
    remote: false,
    salaryMin: 1600000,
    salaryMax: 2400000,
    skills: ["Node.js", "MongoDB", "Express"],
    description:
      "Design APIs for jobs, applications, and notifications. You will add indexes, aggregations for recruiter analytics, and keep file uploads safe. Comfort with JWT auth and role-based access is required.",
  },
  {
    title: "Product Design Intern",
    company: "Northbeam Labs",
    location: "Remote",
    type: "internship",
    remote: true,
    salaryMin: 25000,
    salaryMax: 40000,
    skills: ["Figma", "UX", "Prototyping"],
    description:
      "Support the design of candidate and recruiter flows. You will audit empty states, application pipelines, and help ship a cleaner job search experience over a 3-month internship.",
  },
];

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  await Promise.all([
    User.deleteMany({}),
    Job.deleteMany({}),
    Application.deleteMany({}),
    Notification.deleteMany({}),
    SavedSearch.deleteMany({}),
  ]);

  const password = await bcrypt.hash("password123", 10);
  const recruiter = await User.create({
    name: "Aisha Rahman",
    email: "recruiter@applywise.dev",
    password,
    role: "recruiter",
    company: "Northbeam Labs",
    location: "Bengaluru",
    headline: "Talent lead",
  });
  const candidate = await User.create({
    name: "Rohan Mehta",
    email: "candidate@applywise.dev",
    password,
    role: "candidate",
    location: "Pune",
    headline: "Full-stack developer",
    skills: ["React", "Express", "MongoDB"],
  });

  await Job.insertMany(jobsSeed.map((job) => ({ ...job, recruiter: recruiter._id, views: 12 })));
  await SavedSearch.create({
    user: candidate._id,
    name: "Remote React",
    filters: { q: "React", location: "", type: "", remote: "true" },
  });

  console.log("Seeded ApplyWise");
  console.log("Recruiter  recruiter@applywise.dev / password123");
  console.log("Candidate  candidate@applywise.dev / password123");
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
