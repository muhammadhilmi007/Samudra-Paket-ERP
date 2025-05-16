/**
 * Reporting Service
 * Generates reports based on data from other services
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const axios = require('axios');

// Create Express app
const app = express();
const port = process.env.PORT || 3006;

// Apply middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

// Connect to MongoDB
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/reporting-service';
mongoose.connect(mongoUri)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define report schema
const reportSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['operational', 'financial', 'performance', 'custom'], required: true },
  parameters: { type: Object },
  data: { type: Object },
  format: { type: String, enum: ['json', 'csv', 'pdf'], default: 'json' },
  status: { type: String, enum: ['pending', 'processing', 'completed', 'failed'], default: 'pending' },
  createdBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Create report model
const Report = mongoose.model('Report', reportSchema);

// Define routes
app.post('/reports', async (req, res) => {
  try {
    const report = new Report(req.body);
    report.status = 'processing';
    await report.save();
    
    // Process report based on type
    try {
      switch (report.type) {
        case 'operational':
          // Generate operational report
          report.data = await generateOperationalReport(report.parameters);
          break;
          
        case 'financial':
          // Generate financial report
          report.data = await generateFinancialReport(report.parameters);
          break;
          
        case 'performance':
          // Generate performance report
          report.data = await generatePerformanceReport(report.parameters);
          break;
          
        case 'custom':
          // Generate custom report
          report.data = await generateCustomReport(report.parameters);
          break;
      }
      
      report.status = 'completed';
    } catch (error) {
      console.error(`Report generation error (${report.type}):`, error);
      report.status = 'failed';
    }
    
    report.updatedAt = new Date();
    await report.save();
    
    res.status(201).json(report);
  } catch (error) {
    console.error('Create report error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/reports', async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.status(200).json(reports);
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/reports/:id', async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.status(200).json(report);
  } catch (error) {
    console.error('Get report error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/reports/:id/download', async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    
    if (report.status !== 'completed') {
      return res.status(400).json({ message: 'Report is not ready for download' });
    }
    
    // Handle different formats
    switch (report.format) {
      case 'json':
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename=${report.name}.json`);
        return res.status(200).json(report.data);
        
      case 'csv':
        // Convert data to CSV
        const csv = convertToCSV(report.data);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=${report.name}.csv`);
        return res.status(200).send(csv);
        
      case 'pdf':
        // PDF generation would be implemented here
        return res.status(501).json({ message: 'PDF format not implemented yet' });
        
      default:
        return res.status(400).json({ message: 'Unsupported format' });
    }
  } catch (error) {
    console.error('Download report error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Report generation functions
async function generateOperationalReport(parameters) {
  // This would fetch data from operations service in a real implementation
  const startDate = parameters?.startDate ? new Date(parameters.startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const endDate = parameters?.endDate ? new Date(parameters.endDate) : new Date();
  
  // Simulate fetching data
  return {
    period: {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    },
    summary: {
      totalShipments: 1250,
      deliveredShipments: 1150,
      failedShipments: 50,
      pendingShipments: 50,
    },
    deliveryPerformance: {
      onTime: 1050,
      delayed: 100,
      onTimePercentage: 91.3,
    },
    serviceBreakdown: {
      regular: 850,
      express: 300,
      sameDay: 100,
    },
    dailyVolume: [
      { date: '2023-01-01', count: 42 },
      { date: '2023-01-02', count: 38 },
      // More data would be here
    ],
  };
}

async function generateFinancialReport(parameters) {
  // This would fetch data from finance service in a real implementation
  const startDate = parameters?.startDate ? new Date(parameters.startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const endDate = parameters?.endDate ? new Date(parameters.endDate) : new Date();
  
  // Simulate fetching data
  return {
    period: {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    },
    summary: {
      totalRevenue: 125000000,
      totalExpenses: 95000000,
      profit: 30000000,
      profitMargin: 24,
    },
    revenueByService: {
      regular: 75000000,
      express: 35000000,
      sameDay: 15000000,
    },
    expenseCategories: {
      salaries: 45000000,
      fuel: 25000000,
      maintenance: 15000000,
      rent: 8000000,
      other: 2000000,
    },
    dailyRevenue: [
      { date: '2023-01-01', amount: 4200000 },
      { date: '2023-01-02', amount: 3800000 },
      // More data would be here
    ],
  };
}

async function generatePerformanceReport(parameters) {
  // This would fetch data from multiple services in a real implementation
  const startDate = parameters?.startDate ? new Date(parameters.startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const endDate = parameters?.endDate ? new Date(parameters.endDate) : new Date();
  
  // Simulate fetching data
  return {
    period: {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    },
    courierPerformance: [
      { id: 'C001', name: 'John Doe', pickups: 120, onTime: 115, rating: 4.8 },
      { id: 'C002', name: 'Jane Smith', pickups: 110, onTime: 105, rating: 4.7 },
      // More data would be here
    ],
    driverPerformance: [
      { id: 'D001', name: 'Bob Johnson', deliveries: 180, onTime: 170, rating: 4.9 },
      { id: 'D002', name: 'Alice Brown', deliveries: 165, onTime: 160, rating: 4.8 },
      // More data would be here
    ],
    warehousePerformance: [
      { id: 'W001', name: 'Central Warehouse', processed: 850, accuracy: 99.5 },
      { id: 'W002', name: 'East Warehouse', processed: 650, accuracy: 99.2 },
      // More data would be here
    ],
  };
}

async function generateCustomReport(parameters) {
  // Custom report generation based on parameters
  // This would be implemented based on specific requirements
  return {
    message: 'Custom report generated',
    parameters,
    data: {
      // Custom data would be here
    },
  };
}

// Helper function to convert data to CSV
function convertToCSV(data) {
  if (!data || typeof data !== 'object') {
    return '';
  }
  
  // Simple implementation for flat objects
  if (Array.isArray(data)) {
    const headers = Object.keys(data[0] || {}).join(',');
    const rows = data.map(item => Object.values(item).join(',')).join('\n');
    return `${headers}\n${rows}`;
  }
  
  // For non-array objects, convert to key-value pairs
  const rows = Object.entries(data).map(([key, value]) => `${key},${value}`).join('\n');
  return `Key,Value\n${rows}`;
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Start server
app.listen(port, () => {
  console.log(`Reporting Service listening at http://localhost:${port}`);
});

module.exports = app;
