/**
 * Finance Service
 * Handles financial transactions and reporting
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');

// Create Express app
const app = express();
const port = process.env.PORT || 3004;

// Apply middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

// Connect to MongoDB
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/finance-service';
mongoose.connect(mongoUri)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define invoice schema
const invoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true, unique: true },
  customerId: { type: String, required: true },
  customerName: { type: String, required: true },
  items: [{
    description: { type: String, required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    amount: { type: Number, required: true },
  }],
  subtotal: { type: Number, required: true },
  tax: { type: Number, required: true },
  total: { type: Number, required: true },
  status: { type: String, enum: ['draft', 'sent', 'paid', 'overdue', 'cancelled'], default: 'draft' },
  dueDate: { type: Date, required: true },
  paymentDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Generate invoice number
invoiceSchema.pre('save', async function(next) {
  if (this.isNew) {
    const date = new Date();
    const year = date.getFullYear().toString().substr(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    
    // Get the last invoice to generate a sequential number
    const lastInvoice = await Invoice.findOne().sort({ createdAt: -1 });
    let sequence = '00001';
    
    if (lastInvoice && lastInvoice.invoiceNumber) {
      const lastSequence = lastInvoice.invoiceNumber.substr(-5);
      sequence = (parseInt(lastSequence, 10) + 1).toString().padStart(5, '0');
    }
    
    this.invoiceNumber = `INV${year}${month}${sequence}`;
  }
  next();
});

// Create invoice model
const Invoice = mongoose.model('Invoice', invoiceSchema);

// Define payment schema
const paymentSchema = new mongoose.Schema({
  paymentNumber: { type: String, required: true, unique: true },
  invoiceNumber: { type: String, required: true },
  customerId: { type: String, required: true },
  customerName: { type: String, required: true },
  amount: { type: Number, required: true },
  method: { type: String, enum: ['cash', 'bank_transfer', 'credit_card', 'debit_card', 'e_wallet'], required: true },
  reference: { type: String },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Generate payment number
paymentSchema.pre('save', async function(next) {
  if (this.isNew) {
    const date = new Date();
    const year = date.getFullYear().toString().substr(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    // Get the last payment to generate a sequential number
    const lastPayment = await Payment.findOne().sort({ createdAt: -1 });
    let sequence = '00001';
    
    if (lastPayment && lastPayment.paymentNumber) {
      const lastSequence = lastPayment.paymentNumber.substr(-5);
      sequence = (parseInt(lastSequence, 10) + 1).toString().padStart(5, '0');
    }
    
    this.paymentNumber = `PAY${year}${month}${day}${sequence}`;
  }
  next();
});

// Create payment model
const Payment = mongoose.model('Payment', paymentSchema);

// Define routes for invoices
app.post('/invoices', async (req, res) => {
  try {
    const invoice = new Invoice(req.body);
    await invoice.save();
    res.status(201).json(invoice);
  } catch (error) {
    console.error('Create invoice error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/invoices', async (req, res) => {
  try {
    const invoices = await Invoice.find();
    res.status(200).json(invoices);
  } catch (error) {
    console.error('Get invoices error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/invoices/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    res.status(200).json(invoice);
  } catch (error) {
    console.error('Get invoice error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.put('/invoices/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    
    invoice.status = status;
    if (status === 'paid') {
      invoice.paymentDate = new Date();
    }
    invoice.updatedAt = new Date();
    
    await invoice.save();
    res.status(200).json(invoice);
  } catch (error) {
    console.error('Update invoice status error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Define routes for payments
app.post('/payments', async (req, res) => {
  try {
    const payment = new Payment(req.body);
    await payment.save();
    
    // Update invoice status if payment is for an invoice
    if (payment.invoiceNumber) {
      const invoice = await Invoice.findOne({ invoiceNumber: payment.invoiceNumber });
      if (invoice) {
        invoice.status = 'paid';
        invoice.paymentDate = new Date();
        invoice.updatedAt = new Date();
        await invoice.save();
      }
    }
    
    res.status(201).json(payment);
  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/payments', async (req, res) => {
  try {
    const payments = await Payment.find();
    res.status(200).json(payments);
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/payments/:id', async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.status(200).json(payment);
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Start server
app.listen(port, () => {
  console.log(`Finance Service listening at http://localhost:${port}`);
});

module.exports = app;
