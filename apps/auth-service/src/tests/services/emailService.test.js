/**
 * Email Service Tests
 * Tests the Email service functionality
 */

const { emailService } = require('../../application/services');
const config = require('../../config');

// Mock nodemailer
jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockResolvedValue({
      messageId: 'test-message-id',
      response: 'test-response'
    }),
    verify: jest.fn().mockResolvedValue(true)
  })
}));

describe('Email Service', () => {
  it('should initialize email transporter', async () => {
    const transporter = emailService.initTransporter();
    
    expect(transporter).toBeDefined();
    expect(transporter.sendMail).toBeDefined();
    expect(transporter.verify).toBeDefined();
  });
  
  it('should send email', async () => {
    const mailOptions = {
      to: 'recipient@example.com',
      subject: 'Test Email',
      text: 'This is a test email',
      html: '<p>This is a test email</p>'
    };
    
    const result = await emailService.sendEmail(mailOptions);
    
    expect(result).toBeDefined();
    expect(result.messageId).toBe('test-message-id');
    expect(result.response).toBe('test-response');
    
    // Verify that createTransport was called with correct options
    const nodemailer = require('nodemailer');
    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      host: config.email.host,
      port: config.email.port,
      secure: config.email.secure,
      auth: config.email.auth
    });
  });
  
  it('should send verification email', async () => {
    const user = {
      email: 'user@example.com',
      firstName: 'Test',
      lastName: 'User'
    };
    
    const token = 'verification-token';
    const result = await emailService.sendVerificationEmail(user, token);
    
    expect(result).toBeDefined();
    expect(result.messageId).toBe('test-message-id');
    
    // Verify that sendEmail was called with correct options
    const transporter = emailService.initTransporter();
    expect(transporter.sendMail).toHaveBeenCalledWith(expect.objectContaining({
      from: config.email.from,
      to: user.email,
      subject: expect.stringContaining('Verify Your Email'),
      text: expect.stringContaining(token),
      html: expect.stringContaining(token)
    }));
  });
  
  it('should send password reset email', async () => {
    const user = {
      email: 'user@example.com',
      firstName: 'Test',
      lastName: 'User'
    };
    
    const token = 'reset-token';
    const result = await emailService.sendPasswordResetEmail(user, token);
    
    expect(result).toBeDefined();
    expect(result.messageId).toBe('test-message-id');
    
    // Verify that sendEmail was called with correct options
    const transporter = emailService.initTransporter();
    expect(transporter.sendMail).toHaveBeenCalledWith(expect.objectContaining({
      from: config.email.from,
      to: user.email,
      subject: expect.stringContaining('Password Reset'),
      text: expect.stringContaining(token),
      html: expect.stringContaining(token)
    }));
  });
  
  it('should send account locked email', async () => {
    const user = {
      email: 'user@example.com',
      firstName: 'Test',
      lastName: 'User'
    };
    
    const result = await emailService.sendAccountLockedEmail(user);
    
    expect(result).toBeDefined();
    expect(result.messageId).toBe('test-message-id');
    
    // Verify that sendEmail was called with correct options
    const transporter = emailService.initTransporter();
    expect(transporter.sendMail).toHaveBeenCalledWith(expect.objectContaining({
      from: config.email.from,
      to: user.email,
      subject: expect.stringContaining('Account Locked'),
      text: expect.stringContaining('locked'),
      html: expect.stringContaining('locked')
    }));
  });
  
  it('should send password changed email', async () => {
    const user = {
      email: 'user@example.com',
      firstName: 'Test',
      lastName: 'User'
    };
    
    const result = await emailService.sendPasswordChangedEmail(user);
    
    expect(result).toBeDefined();
    expect(result.messageId).toBe('test-message-id');
    
    // Verify that sendEmail was called with correct options
    const transporter = emailService.initTransporter();
    expect(transporter.sendMail).toHaveBeenCalledWith(expect.objectContaining({
      from: config.email.from,
      to: user.email,
      subject: expect.stringContaining('Password Changed'),
      text: expect.stringContaining('changed'),
      html: expect.stringContaining('changed')
    }));
  });
});
