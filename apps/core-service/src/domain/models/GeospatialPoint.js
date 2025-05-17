/**
 * GeospatialPoint Model
 * Represents geospatial test points for service area testing
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const geospatialPointSchema = new Schema({
  serviceArea: {
    type: Schema.Types.ObjectId,
    ref: 'ServiceArea',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  type: {
    type: String,
    enum: ['TEST_POINT', 'CUSTOMER_LOCATION', 'PICKUP_POINT', 'DELIVERY_POINT', 'BRANCH_LOCATION'],
    default: 'TEST_POINT'
  },
  metadata: {
    type: Map,
    of: Schema.Types.Mixed,
    default: {}
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create a 2dsphere index on the location field for geospatial queries
geospatialPointSchema.index({ location: '2dsphere' });

// Create a compound index on type and serviceArea for efficient queries
geospatialPointSchema.index({ type: 1, serviceArea: 1 });

const GeospatialPoint = mongoose.model('GeospatialPoint', geospatialPointSchema);

module.exports = GeospatialPoint;
