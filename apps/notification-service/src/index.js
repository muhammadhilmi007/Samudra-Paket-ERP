/**
 * Notification Service
 * Handles notifications and alerts for users
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

// Create Express app
const app = express();
const port = process.env.PORT || 3005;

// Apply middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

// Connect to MongoDB
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/notification-service';
mongoose.connect(mongoUri)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Configure email transporter
const emailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.example.com',
  port: process.env.SMTP_PORT || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || 'user@example.com',
    pass: process.env.SMTP_PASSWORD || 'password',
  },
});

// Define notification schema
const notificationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  type: { type: String, enum: ['email', 'sms', 'push', 'in_app'], required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  data: { type: Object },
  status: { type: String, enum: ['pending', 'sent', 'failed'], default: 'pending' },
  sentAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Create notification model
const Notification = mongoose.model('Notification', notificationSchema);

// Define template schema
const templateSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  type: { type: String, enum: ['email', 'sms', 'push', 'in_app'], required: true },
  subject: { type: String },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Create template model
const Template = mongoose.model('Template', templateSchema);

// Define routes for notifications
app.post('/notifications', async (req, res) => {
  try {
    const notification = new Notification(req.body);
    await notification.save();
    
    // Process notification based on type
    switch (notification.type) {
      case 'email':
        // Send email
        try {
          await emailTransporter.sendMail({
            from: process.env.EMAIL_FROM || 'noreply@samudrapaket.com',
            to: req.body.recipient,
            subject: notification.title,
            text: notification.message,
            html: notification.data?.html,
          });
          
          notification.status = 'sent';
          notification.sentAt = new Date();
        } catch (error) {
          console.error('Email sending error:', error);
          notification.status = 'failed';
        }
        break;
        
      case 'sms':
        // SMS implementation would go here
        notification.status = 'sent';
        notification.sentAt = new Date();
        break;
        
      case 'push':
        // Push notification implementation would go here
        notification.status = 'sent';
        notification.sentAt = new Date();
        break;
        
      case 'in_app':
        // In-app notification is stored and will be fetched by client
        notification.status = 'sent';
        notification.sentAt = new Date();
        break;
    }
    
    await notification.save();
    res.status(201).json(notification);
  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/notifications/user/:userId', async (req, res) => {
  try {
    const notifications = await Notification.find({ 
      userId: req.params.userId,
      type: 'in_app',
    }).sort({ createdAt: -1 });
    
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Define routes for templates
app.post('/templates', async (req, res) => {
  try {
    const template = new Template(req.body);
    await template.save();
    res.status(201).json(template);
  } catch (error) {
    console.error('Create template error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/templates', async (req, res) => {
  try {
    const templates = await Template.find();
    res.status(200).json(templates);
  } catch (error) {
    console.error('Get templates error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/templates/:id', async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }
    res.status(200).json(template);
  } catch (error) {
    console.error('Get template error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.put('/templates/:id', async (req, res) => {
  try {
    const template = await Template.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }
    res.status(200).json(template);
  } catch (error) {
    console.error('Update template error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Start server
app.listen(port, () => {
  console.log(`Notification Service listening at http://localhost:${port}`);
});

module.exports = app;
