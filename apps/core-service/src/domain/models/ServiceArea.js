/**
 * Service Area Model
 * Defines the schema for service area entities with geospatial support
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Service Area Schema
 */
const serviceAreaSchema = new Schema({
  // Basic Information
  code: {
    type: String,
    required: [true, 'Service area code is required'],
    unique: true,
    trim: true,
    uppercase: true,
    maxlength: [10, 'Service area code cannot exceed 10 characters']
  },
  name: {
    type: String,
    required: [true, 'Service area name is required'],
    trim: true,
    maxlength: [100, 'Service area name cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  
  // Administrative Information
  adminCode: {
    type: String,
    trim: true,
    comment: 'BPS administrative code (e.g., kode_kecamatan)'
  },
  adminLevel: {
    type: String,
    enum: {
      values: ['PROVINCE', 'CITY', 'DISTRICT', 'SUBDISTRICT'],
      message: 'Admin level must be PROVINCE, CITY, DISTRICT, or SUBDISTRICT'
    },
    default: 'DISTRICT'
  },
  
  // Geographic Information
  geometry: {
    type: {
      type: String,
      enum: ['Polygon', 'MultiPolygon'],
      required: [true, 'Geometry type is required']
    },
    coordinates: {
      type: Array,
      required: [true, 'Coordinates are required']
    }
  },
  center: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  },
  
  // Area Type and Classification
  areaType: {
    type: String,
    enum: {
      values: ['INNER_CITY', 'OUT_OF_CITY', 'REMOTE_AREA'],
      message: 'Area type must be INNER_CITY, OUT_OF_CITY, or REMOTE_AREA'
    },
    default: 'INNER_CITY'
  },
  
  // Status Information
  status: {
    type: String,
    enum: {
      values: ['ACTIVE', 'INACTIVE'],
      message: 'Status must be ACTIVE or INACTIVE'
    },
    default: 'ACTIVE'
  },
  
  // Metadata
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Create geospatial indexes
serviceAreaSchema.index({ geometry: '2dsphere' });
serviceAreaSchema.index({ center: '2dsphere' });

// Create text index for search
serviceAreaSchema.index({ 
  name: 'text', 
  description: 'text', 
  code: 'text',
  adminCode: 'text'
});

/**
 * Check if a point is within this service area
 * @param {Array} coordinates - [longitude, latitude]
 * @returns {boolean} - Whether the point is within the service area
 */
serviceAreaSchema.methods.containsPoint = async function(coordinates) {
  const point = {
    type: 'Point',
    coordinates: coordinates
  };
  
  const result = await mongoose.model('ServiceArea').findOne({
    _id: this._id,
    geometry: {
      $geoIntersects: {
        $geometry: point
      }
    }
  });
  
  return !!result;
};

/**
 * Find service areas that contain a point
 * @param {Array} coordinates - [longitude, latitude]
 * @returns {Array} - Service areas containing the point
 */
serviceAreaSchema.statics.findByPoint = function(coordinates) {
  const point = {
    type: 'Point',
    coordinates: coordinates
  };
  
  return this.find({
    geometry: {
      $geoIntersects: {
        $geometry: point
      }
    }
  });
};

/**
 * Find service areas that intersect with a polygon
 * @param {Object} polygon - GeoJSON polygon
 * @returns {Array} - Service areas intersecting with the polygon
 */
serviceAreaSchema.statics.findByPolygon = function(polygon) {
  return this.find({
    geometry: {
      $geoIntersects: {
        $geometry: polygon
      }
    }
  });
};

/**
 * Find service areas within a certain distance of a point
 * @param {Array} coordinates - [longitude, latitude]
 * @param {Number} maxDistance - Maximum distance in meters
 * @returns {Array} - Service areas within the specified distance
 */
serviceAreaSchema.statics.findNearPoint = function(coordinates, maxDistance) {
  return this.find({
    center: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: coordinates
        },
        $maxDistance: maxDistance
      }
    }
  });
};

/**
 * Create ServiceArea model
 */
const ServiceArea = mongoose.model('ServiceArea', serviceAreaSchema);

module.exports = ServiceArea;
