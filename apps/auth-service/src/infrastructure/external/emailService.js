/**
 * Email Service
 * Handles sending emails for verification and password reset
 */

const nodemailer = require('nodemailer');
const winston = require('winston');

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'auth-service-email' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    new winston.transports.File({ filename: 'logs/email-error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/email.log' })
  ]
});

// Initialize email transporter
let transporter;

/**
 * Initialize email transporter
 * @returns {nodemailer.Transporter} - Returns nodemailer transporter
 */
const initTransporter = () => {
  if (transporter) {
    return transporter;
  }

  // Create transporter based on environment
  if (process.env.NODE_ENV === 'production') {
    // Production SMTP configuration
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    });
  } else {
    // Development: Use ethereal.email for testing
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: process.env.ETHEREAL_USER || 'ethereal.user@ethereal.email',
        pass: process.env.ETHEREAL_PASSWORD || 'ethereal_password'
      }
    });
  }

  return transporter;
};

/**
 * Send email
 * @param {Object} mailOptions - Mail options
 * @returns {Promise<Object>} - Returns send mail info
 */
const sendEmail = async (mailOptions) => {
  try {
    const emailTransporter = initTransporter();
    
    // Set default from address if not provided
    if (!mailOptions.from) {
      mailOptions.from = process.env.EMAIL_FROM || 'noreply@samudrapaket.com';
    }
    
    const info = await emailTransporter.sendMail(mailOptions);
    
    logger.info('Email sent successfully', {
      messageId: info.messageId,
      to: mailOptions.to,
      subject: mailOptions.subject
    });
    
    return info;
  } catch (error) {
    logger.error('Error sending email:', error);
    throw error;
  }
};

/**
 * Send verification email
 * @param {Object} user - User object
 * @param {string} token - Verification token
 * @returns {Promise<Object>} - Returns send mail info
 */
const sendVerificationEmail = async (user, token) => {
  const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${token}`;
  
  const mailOptions = {
    to: user.email,
    subject: 'Verify Your Email - Samudra Paket ERP',
    html: `
      <h1>Email Verification</h1>
      <p>Hello ${user.firstName},</p>
      <p>Thank you for registering with Samudra Paket ERP. Please verify your email address by clicking the link below:</p>
      <p><a href="${verificationUrl}" style="padding: 10px 20px; background-color: #2563EB; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a></p>
      <p>Or copy and paste the following URL into your browser:</p>
      <p>${verificationUrl}</p>
      <p>This link will expire in 24 hours.</p>
      <p>If you did not create an account, please ignore this email.</p>
      <p>Best regards,<br>Samudra Paket ERP Team</p>
    `
  };
  
  return sendEmail(mailOptions);
};

/**
 * Send password reset email
 * @param {Object} user - User object
 * @param {string} token - Reset token
 * @returns {Promise<Object>} - Returns send mail info
 */
const sendPasswordResetEmail = async (user, token) => {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
  
  const mailOptions = {
    to: user.email,
    subject: 'Password Reset - Samudra Paket ERP',
    html: `
      <h1>Password Reset</h1>
      <p>Hello ${user.firstName},</p>
      <p>You are receiving this email because you (or someone else) have requested to reset your password.</p>
      <p>Please click the link below to reset your password:</p>
      <p><a href="${resetUrl}" style="padding: 10px 20px; background-color: #2563EB; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
      <p>Or copy and paste the following URL into your browser:</p>
      <p>${resetUrl}</p>
      <p>This link will expire in 1 hour.</p>
      <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
      <p>Best regards,<br>Samudra Paket ERP Team</p>
    `
  };
  
  return sendEmail(mailOptions);
};

/**
 * Send account locked email
 * @param {Object} user - User object
 * @returns {Promise<Object>} - Returns send mail info
 */
const sendAccountLockedEmail = async (user) => {
  const mailOptions = {
    to: user.email,
    subject: 'Account Locked - Samudra Paket ERP',
    html: `
      <h1>Account Locked</h1>
      <p>Hello ${user.firstName},</p>
      <p>Your account has been temporarily locked due to multiple failed login attempts.</p>
      <p>For security reasons, your account will remain locked for 30 minutes.</p>
      <p>If you need immediate access, please contact our support team or use the password reset function.</p>
      <p>Best regards,<br>Samudra Paket ERP Team</p>
    `
  };
  
  return sendEmail(mailOptions);
};

/**
 * Send password changed email
 * @param {Object} user - User object
 * @returns {Promise<Object>} - Returns send mail info
 */
const sendPasswordChangedEmail = async (user) => {
  const mailOptions = {
    to: user.email,
    subject: 'Password Changed - Samudra Paket ERP',
    html: `
      <h1>Password Changed</h1>
      <p>Hello ${user.firstName},</p>
      <p>Your password has been successfully changed.</p>
      <p>If you did not make this change, please contact our support team immediately.</p>
      <p>Best regards,<br>Samudra Paket ERP Team</p>
    `
  };
  
  return sendEmail(mailOptions);
};

module.exports = {
  sendEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendAccountLockedEmail,
  sendPasswordChangedEmail
};
