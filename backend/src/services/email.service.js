import nodemailer from "nodemailer";

export async function sendAdminAccessRequestEmail({ name, email, reason }) {
  const ownerEmail = process.env.PLATFORM_OWNER_EMAIL;

  if (!ownerEmail || !process.env.SMTP_HOST) {
    console.log("Admin access request notification", { name, email, reason });
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: process.env.SMTP_USER && process.env.SMTP_PASS ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM || ownerEmail,
    to: ownerEmail,
    subject: "Vriksham admin access request",
    text: `Admin access request\n\nName: ${name}\nEmail: ${email}\nReason: ${reason}`
  });
}
