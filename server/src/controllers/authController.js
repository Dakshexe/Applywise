import bcrypt from "bcryptjs";
import { body } from "express-validator";
import { User } from "../models/User.js";
import { signToken } from "../middleware/auth.js";
import { publicUser, validate } from "../utils/helpers.js";

export const registerValidators = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  body("role").isIn(["candidate", "recruiter"]).withMessage("Choose candidate or recruiter"),
];

export const loginValidators = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

export async function register(req, res, next) {
  try {
    const { name, email, password, role, company, location, headline } = req.body;
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashed,
      role,
      company: role === "recruiter" ? company || "" : "",
      location: location || "",
      headline: headline || "",
    });
    const token = signToken(user);
    res.status(201).json({ token, user: publicUser(user) });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = signToken(user);
    res.json({ token, user: publicUser(user) });
  } catch (err) {
    next(err);
  }
}

export async function me(req, res) {
  res.json({ user: publicUser(req.user) });
}

export async function updateMe(req, res, next) {
  try {
    const { name, company, location, headline, skills } = req.body;
    req.user.name = name ?? req.user.name;
    req.user.company = company ?? req.user.company;
    req.user.location = location ?? req.user.location;
    req.user.headline = headline ?? req.user.headline;
    if (Array.isArray(skills)) req.user.skills = skills;
    await req.user.save();
    res.json({ user: publicUser(req.user) });
  } catch (err) {
    next(err);
  }
}

export { validate };
