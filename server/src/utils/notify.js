import nodemailer from "nodemailer";
import { Notification } from "../models/Notification.js";

let transporter;

function getTransporter() {
  if (transporter !== undefined) return transporter;
  if (!process.env.SMTP_HOST) {
    transporter = null;
    return null;
  }
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
  });
  return transporter;
}

export async function notifyUser({ userId, email, title, body, link = "" }) {
  await Notification.create({ user: userId, title, body, link });

  const mailer = getTransporter();
  const payload = {
    from: process.env.SMTP_FROM,
    to: email,
    subject: title,
    text: `${body}${link ? `\n\n${process.env.CLIENT_URL}${link}` : ""}`,
  };

  if (!mailer) {
    console.log("[email skipped]", payload.subject, "→", payload.to);
    return;
  }

  try {
    await mailer.sendMail(payload);
  } catch (err) {
    console.error("Email send failed:", err.message);
  }
}
