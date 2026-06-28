import nodemailer from "nodemailer";
import { env } from "../config/env.js";

let transporter;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.smtpHost,
      port: env.smtpPort,
      secure: env.smtpPort === 465,
      auth: env.smtpUser && env.smtpPass ? { user: env.smtpUser, pass: env.smtpPass } : undefined
    });
  }
  return transporter;
}

export async function sendMail({ to, subject, html }) {
  if (!env.smtpHost) {
    // eslint-disable-next-line no-console
    console.warn("SMTP not configured. Skipping email delivery.");
    return;
  }
  await getTransporter().sendMail({
    from: env.emailFrom,
    to,
    subject,
    html
  });
}
