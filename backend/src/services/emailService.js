const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

const sendEmail = async ({ to, subject, text, html }) => {
  if (!to) {
    throw new Error("Recipient email is required");
  }

  return transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject,
    text,
    html,
  });
};

const sendFollowEmail = async ({ recipientEmail, recipientName, senderName }) => {
  return sendEmail({
    to: recipientEmail,
    subject: "Someone started following you",
    text: `${senderName} started following you on DevSecOps Social App.`,
    html: `
      <h2>New Follower</h2>
      <p>Hello ${recipientName || "there"},</p>
      <p><strong>${senderName}</strong> started following you on DevSecOps Social App.</p>
    `,
  });
};

const sendLikeEmail = async ({ recipientEmail, recipientName, senderName }) => {
  return sendEmail({
    to: recipientEmail,
    subject: "Your post received a like",
    text: `${senderName} liked your post.`,
    html: `
      <h2>New Like</h2>
      <p>Hello ${recipientName || "there"},</p>
      <p><strong>${senderName}</strong> liked your post.</p>
    `,
  });
};

const sendCommentEmail = async ({
  recipientEmail,
  recipientName,
  senderName,
  comment,
}) => {
  return sendEmail({
    to: recipientEmail,
    subject: "New comment on your post",
    text: `${senderName} commented on your post: ${comment}`,
    html: `
      <h2>New Comment</h2>
      <p>Hello ${recipientName || "there"},</p>
      <p><strong>${senderName}</strong> commented on your post:</p>
      <blockquote>${comment}</blockquote>
    `,
  });
};

const sendPostEmail = async ({
  recipientEmail,
  recipientName,
  senderName,
}) => {
  return sendEmail({
    to: recipientEmail,
    subject: "New post from someone you follow",
    text: `${senderName} created a new post on DevSecOps Social App.`,
    html: `
      <h2>New Post</h2>
      <p>Hello ${recipientName || "there"},</p>
      <p><strong>${senderName}</strong> created a new post on DevSecOps Social App.</p>
    `,
  });
};

const sendPasswordResetEmail = async ({
  recipientEmail,
  recipientName,
  resetUrl,
}) => {
  return sendEmail({
    to: recipientEmail,
    subject: "Reset your password",
    text: `Hello ${recipientName || "there"},\n\nUse the following link to reset your password:\n${resetUrl}\n\nThis link expires in 15 minutes.`,
    html: `
      <h2>Password Reset</h2>
      <p>Hello ${recipientName || "there"},</p>
      <p>We received a request to reset your password.</p>
      <p>
        <a href="${resetUrl}">Reset your password</a>
      </p>
      <p>This link expires in <strong>15 minutes</strong>.</p>
      <p>If you did not request this, you can safely ignore this email.</p>
    `,
  });
};

const verifyEmailConnection = async () => {
  return transporter.verify();
};

module.exports = {
  sendEmail,
  sendFollowEmail,
  sendLikeEmail,
  sendCommentEmail,
  sendPostEmail,
  sendPasswordResetEmail,
  verifyEmailConnection,
};
