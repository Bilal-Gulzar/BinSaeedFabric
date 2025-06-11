// lib/email/sendEmail.ts
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

type EmailOptions = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail({
  to,
  subject,
  html,
  bcc
}: EmailOptions & { bcc?: string[] }) {
  await transporter.sendMail({
    from: `"Bin Saaed Fabric" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
    bcc
  });
}
