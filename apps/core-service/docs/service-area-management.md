# Service Area Management

## Overview

The Service Area Management module is responsible for defining and managing geographic service areas for the Samudra Paket ERP system. It enables the company to:

- Define service areas with precise geographic boundaries using GeoJSON
- Assign service areas to branches with priority levels
- Configure pricing rules based on service area, distance, weight, and service type
- Find service areas and branches by location
- Calculate shipping prices based on service area rules
- Track changes to service area boundaries and pricing rules

## Models

### ServiceArea

Represents a geographic service area with the following key attributes:

- `code`: Unique identifier for the service area
- `name`: Human-readable name
- `description`: Detailed description
- `adminCode`: Administrative code (e.g., postal code, city code)
- `adminLevel`: Level of administrative area (COUNTRY, PROVINCE, CITY, DISTRICT, SUBDISTRICT)
- `geometry`: GeoJSON polygon defining the boundaries
- `center`: GeoJSON point representing the center of the area
- `areaType`: Type of area (INNER_CITY, OUT_OF_CITY, REMOTE_AREA)
- `status`: Current status (ACTIVE, INACTIVE)

### BranchServiceArea

Maps branches to service areas with priority levels:

- `branch`: Reference to a branch
- `serviceArea`: Reference to a service area
- `priorityLevel`: Priority level for this assignment (lower number = higher priority)
- `status`: Current status (ACTIVE, INACTIVE)
- `notes`: Additional notes about this assignment

### ServiceAreaPricing

Defines pricing rules for a service area:

- `serviceArea`: Reference to a service area
- `serviceType`: Type of service (REGULAR, EXPRESS, SAME_DAY)
- `basePrice`: Base price for shipping in this area
- `pricePerKm`: Additional price per kilometer
- `pricePerKg`: Additional price per kilogram
- `minCharge`: Minimum charge regardless of calculation
- `maxCharge`: Maximum charge cap
- `insuranceFee`: Additional fee for insurance
- `packagingFee`: Additional fee for packaging
- `status`: Current status (ACTIVE, INACTIVE)

### ServiceAreaHistory

Tracks changes to service areas for auditing:

- `serviceArea`: Reference to a service area
- `changeType`: Type of change (CREATE, UPDATE, DELETE)
- `changedBy`: User who made the change
- `changeDetails`: Details of what was changed
- `previousState`: State before the change
- `newState`: State after the change

## API Endpoints

### Service Area Management

- `GET /api/service-areas` - List all service areas with pagination and filtering
- `GET /api/service-areas/:id` - Get a specific service area by ID
- `POST /api/service-areas` - Create a new service area
- `PUT /api/service-areas/:id` - Update an existing service area
- `DELETE /api/service-areas/:id` - Delete a service area
- `GET /api/service-areas/:id/history` - Get change history for a service area

### Branch Service Area Assignments

- `GET /api/service-area-assignments` - List all branch service area assignments
- `GET /api/service-area-assignments/:id` - Get a specific assignment by ID
- `POST /api/service-area-assignments` - Create a new assignment
- `PUT /api/service-area-assignments/:id` - Update an existing assignment
- `DELETE /api/service-area-assignments/:id` - Delete an assignment
- `GET /api/branches/:branchId/service-areas` - List service areas assigned to a branch
- `GET /api/service-areas/:serviceAreaId/branches` - List branches assigned to a service area

### Service Area Pricing

- `GET /api/service-area-pricing` - List all pricing configurations
- `GET /api/service-area-pricing/:id` - Get a specific pricing configuration by ID
- `POST /api/service-area-pricing` - Create a new pricing configuration
- `PUT /api/service-area-pricing/:id` - Update an existing pricing configuration
- `DELETE /api/service-area-pricing/:id` - Delete a pricing configuration
- `GET /api/service-areas/:serviceAreaId/pricing` - List pricing configurations for a service area

### Geospatial Operations

- `POST /api/geospatial/find-service-areas` - Find service areas containing a location
- `POST /api/geospatial/find-branches` - Find branches serving a location
- `POST /api/geospatial/calculate-price` - Calculate shipping price based on service area, distance, and weight

## Usage Examples

### Creating a Service Area

```javascript
// Request
POST /api/service-areas
{
  "code": "JKT-C",
  "name": "Jakarta Pusat",
  "description": "Wilayah Jakarta Pusat",
  "adminCode": "3171",
  "adminLevel": "CITY",
  "geometry": {
    "type": "Polygon",
    "coordinates": [[
      [106.8090, -6.1754],
      [106.8370, -6.1754],
      [106.8370, -6.2054],
      [106.8090, -6.2054],
      [106.8090, -6.1754]
    ]]
  },
  "center": {
    "type": "Point",
    "coordinates": [106.8230, -6.1904]
  },
  "areaType": "INNER_CITY",
  "status": "ACTIVE"
}

// Response
{
  "success": true,
  "data": {
    "_id": "60d21b4667d0d8992e610c85",
    "code": "JKT-C",
    "name": "Jakarta Pusat",
    "description": "Wilayah Jakarta Pusat",
    "adminCode": "3171",
    "adminLevel": "CITY",
    "geometry": {
      "type": "Polygon",
      "coordinates": [[
        [106.8090, -6.1754],
        [106.8370, -6.1754],
        [106.8370, -6.2054],
        [106.8090, -6.2054],
        [106.8090, -6.1754]
      ]]
    },
    "center": {
      "type": "Point",
      "coordinates": [106.8230, -6.1904]
    },
    "areaType": "INNER_CITY",
    "status": "ACTIVE",
    "createdAt": "2023-06-19T08:30:45.123Z",
    "updatedAt": "2023-06-19T08:30:45.123Z"
  }
}
```

### Assigning a Service Area to a Branch

```javascript
// Request
POST /api/service-area-assignments
{
  "serviceAreaId": "60d21b4667d0d8992e610c85",
  "branchId": "60d21b4667d0d8992e610c01",
  "priorityLevel": 1,
  "status": "ACTIVE",
  "notes": "Primary service area for Jakarta branch"
}

// Response
{
  "success": true,
  "data": {
    "_id": "60d21b4667d0d8992e610c90",
    "serviceArea": "60d21b4667d0d8992e610c85",
    "branch": "60d21b4667d0d8992e610c01",
    "priorityLevel": 1,
    "status": "ACTIVE",
    "notes": "Primary service area for Jakarta branch",
    "createdAt": "2023-06-19T09:15:22.456Z",
    "updatedAt": "2023-06-19T09:15:22.456Z"
  }
}
```

### Creating a Pricing Configuration

```javascript
// Request
POST /api/service-area-pricing
{
  "serviceAreaId": "60d21b4667d0d8992e610c85",
  "serviceType": "REGULAR",
  "basePrice": 10000,
  "pricePerKm": 2000,
  "pricePerKg": 1500,
  "minCharge": 15000,
  "maxCharge": 100000,
  "insuranceFee": 0,
  "packagingFee": 0,
  "status": "ACTIVE"
}

// Response
{
  "success": true,
  "data": {
    "_id": "60d21b4667d0d8992e610c95",
    "serviceArea": "60d21b4667d0d8992e610c85",
    "serviceType": "REGULAR",
    "basePrice": 10000,
    "pricePerKm": 2000,
    "pricePerKg": 1500,
    "minCharge": 15000,
    "maxCharge": 100000,
    "insuranceFee": 0,
    "packagingFee": 0,
    "status": "ACTIVE",
    "createdAt": "2023-06-19T10:05:33.789Z",
    "updatedAt": "2023-06-19T10:05:33.789Z"
  }
}
```

### Finding Service Areas by Location

```javascript
// Request
POST /api/geospatial/find-service-areas
{
  "latitude": -6.1904,
  "longitude": 106.8230
}

// Response
{
  "success": true,
  "data": [
    {
      "_id": "60d21b4667d0d8992e610c85",
      "code": "JKT-C",
      "name": "Jakarta Pusat",
      "areaType": "INNER_CITY",
      "status": "ACTIVE"
    }
  ]
}
```

### Calculating Shipping Price

```javascript
// Request
POST /api/geospatial/calculate-price
{
  "serviceAreaId": "60d21b4667d0d8992e610c85",
  "serviceType": "REGULAR",
  "distance": 5,
  "weight": 2,
  "additionalServices": [
    {
      "type": "PACKAGING",
      "value": true
    }
  ]
}

// Response
{
  "success": true,
  "data": {
    "basePrice": 10000,
    "distanceCharge": 10000,
    "weightCharge": 3000,
    "additionalCharges": 0,
    "totalPrice": 23000,
    "breakdown": {
      "basePrice": 10000,
      "distance": {
        "km": 5,
        "ratePerKm": 2000,
        "charge": 10000
      },
      "weight": {
        "kg": 2,
        "ratePerKg": 1500,
        "charge": 3000
      },
      "additionalServices": []
    }
  }
}
```

## Integration with Other Modules

The Service Area Management module integrates with:

1. **Branch Management** - For assigning service areas to branches
2. **Shipment Processing** - For calculating shipping prices based on service area rules
3. **Pickup Management** - For determining which branches can serve a pickup location
4. **Delivery Management** - For optimizing delivery routes based on service areas
5. **Reporting** - For analyzing performance by service area

## Data Seeding

The module includes a seeder (`serviceAreaSeeder.js`) that populates the database with initial service area data, including:

- Sample service areas for major cities
- Pricing configurations for different service types
- Branch service area assignments

To run the seeder:

```bash
# Run all seeders including service area seeder
npm run seed

# Run only service area seeder
node src/config/seeders/serviceAreaSeeder.js
```
