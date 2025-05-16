/**
 * Operations Service
 * Handles operational tasks and workflows
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');

// Create Express app
const app = express();
const port = process.env.PORT || 3003;

// Apply middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

// Connect to MongoDB
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/operations-service';
mongoose.connect(mongoUri)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define shipment schema
const shipmentSchema = new mongoose.Schema({
  trackingNumber: { type: String, required: true, unique: true },
  sender: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      province: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true, default: 'Indonesia' },
    },
  },
  recipient: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      province: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true, default: 'Indonesia' },
    },
  },
  weight: { type: Number, required: true },
  dimensions: {
    length: { type: Number, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
  },
  service: { type: String, enum: ['regular', 'express', 'same_day'], required: true },
  status: { 
    type: String, 
    enum: ['pending', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'failed', 'returned'], 
    default: 'pending' 
  },
  statusHistory: [{
    status: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    notes: { type: String },
    location: { type: String },
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Generate tracking number
shipmentSchema.pre('save', async function(next) {
  if (this.isNew) {
    const date = new Date();
    const year = date.getFullYear().toString().substr(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    // Get the last shipment to generate a sequential number
    const lastShipment = await Shipment.findOne().sort({ createdAt: -1 });
    let sequence = '00001';
    
    if (lastShipment && lastShipment.trackingNumber) {
      const lastSequence = lastShipment.trackingNumber.substr(-5);
      sequence = (parseInt(lastSequence, 10) + 1).toString().padStart(5, '0');
    }
    
    this.trackingNumber = `SP${year}${month}${day}${sequence}`;
    
    // Add initial status to history
    this.statusHistory = [{
      status: this.status,
      timestamp: new Date(),
      notes: 'Shipment created',
      location: 'System',
    }];
  }
  next();
});

// Create shipment model
const Shipment = mongoose.model('Shipment', shipmentSchema);

// Define routes
app.post('/shipments', async (req, res) => {
  try {
    const shipment = new Shipment(req.body);
    await shipment.save();
    res.status(201).json(shipment);
  } catch (error) {
    console.error('Create shipment error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/shipments', async (req, res) => {
  try {
    const shipments = await Shipment.find();
    res.status(200).json(shipments);
  } catch (error) {
    console.error('Get shipments error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/shipments/:id', async (req, res) => {
  try {
    const shipment = await Shipment.findById(req.params.id);
    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found' });
    }
    res.status(200).json(shipment);
  } catch (error) {
    console.error('Get shipment error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/shipments/tracking/:trackingNumber', async (req, res) => {
  try {
    const shipment = await Shipment.findOne({ trackingNumber: req.params.trackingNumber });
    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found' });
    }
    res.status(200).json(shipment);
  } catch (error) {
    console.error('Track shipment error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.put('/shipments/:id/status', async (req, res) => {
  try {
    const { status, notes, location } = req.body;
    
    const shipment = await Shipment.findById(req.params.id);
    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found' });
    }
    
    shipment.status = status;
    shipment.statusHistory.push({
      status,
      timestamp: new Date(),
      notes,
      location,
    });
    shipment.updatedAt = new Date();
    
    await shipment.save();
    res.status(200).json(shipment);
  } catch (error) {
    console.error('Update shipment status error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Start server
app.listen(port, () => {
  console.log(`Operations Service listening at http://localhost:${port}`);
});

module.exports = app;
