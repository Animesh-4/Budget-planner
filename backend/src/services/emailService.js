// backend/src/services/emailService.js
const nodemailer = require('nodemailer');
require('dotenv').config();

const emailService = {
  createTransporter() {
    console.log('[Email Service] Checking for email credentials...');
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('[Email Service] WARN: Email credentials (EMAIL_USER, EMAIL_PASS) are not set in .env. Email sending is disabled.');
      return null;
    }
    console.log(`[Email Service] Credentials found for user: ${process.env.EMAIL_USER}`);
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  },

  async sendEmail({ to, subject, text, html }) {
    const transporter = this.createTransporter();
    if (!transporter) {
      throw new Error('Email service is not configured. Cannot send email.');
    }
    try {
      console.log(`[Email Service] Attempting to send email to: ${to} with subject: "${subject}"`);
      const info = await transporter.sendMail({
        from: `"Budget Planner" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text,
        html,
      });
      console.log('[Email Service] SUCCESS: Email sent successfully! Message ID:', info.messageId);
    } catch (error) {
      console.error('[Email Service] ERROR: Failed to send email.');
      console.error('Reason:', error);
      throw new Error('Failed to send email due to a server error.');
    }
  },

  async sendPasswordResetEmail(userEmail, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const subject = 'Your Password Reset Request';
    const text = `You requested a password reset. Please use the following link: ${resetUrl}`;
    const html = `<p>You requested a password reset. Please click the link below:</p><a href="${resetUrl}">Reset Your Password</a>`;
    await this.sendEmail({ to: userEmail, subject, text, html });
  },

  async sendBudgetInvitationEmail(inviteeEmail, inviterName, budgetName, invitationToken) {
    const acceptUrl = `${process.env.FRONTEND_URL}/accept-invitation?token=${invitationToken}`;
    const subject = `You've been invited to collaborate on a budget!`;
    const text = `${inviterName} has invited you to collaborate on the budget "${budgetName}". Click the following link to accept: ${acceptUrl}`;
    const html = `
      <p>Hi there,</p>
      <p><strong>${inviterName}</strong> has invited you to collaborate on the budget: <strong>"${budgetName}"</strong>.</p>
      <p>Click the button below to accept the invitation and join the budget.</p>
      <a href="${acceptUrl}" style="background-color: #10B981; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">Accept Invitation</a>
      <p>If you were not expecting this invitation, you can safely ignore this email.</p>
    `;
    await this.sendEmail({ to: inviteeEmail, subject, text, html });
  },
};

module.exports = emailService;
