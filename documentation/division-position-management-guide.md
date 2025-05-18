# Division & Position Management Service Guide

## Overview

The Division & Position Management Service is a core component of the Samudra Paket ERP system that manages the organizational structure of the company. It provides functionality for managing divisions, positions, reporting relationships, and tracking organizational changes.

This guide provides detailed information on how to use the Division & Position Management Service APIs, understand the data models, and implement common workflows.

## Table of Contents

1. [Data Models](#data-models)
2. [API Endpoints](#api-endpoints)
3. [Common Workflows](#common-workflows)
4. [Integration with Other Services](#integration-with-other-services)
5. [Best Practices](#best-practices)

## Data Models

### Division

Divisions represent organizational units within the company. They are organized in a hierarchical structure, with each division potentially having a parent division and multiple child divisions.

**Key Fields:**
- `_id`: Unique identifier
- `name`: Division name
- `code`: Unique division code (uppercase)
- `description`: Division description
- `parent`: Reference to parent division (optional)
- `level`: Hierarchy level (0 for top-level divisions)
- `path`: Dot-separated path of division codes (e.g., "EXO.OPS.PICKUP")
- `manager`: Reference to an Employee who manages the division
- `branch`: Reference to a Branch where the division is located
- `status`: Division status (ACTIVE, INACTIVE, PENDING, ARCHIVED)
- `budget`: Budget information (annual, spent, remaining, currency, fiscalYear)
- `metrics`: Map of performance metrics
- `metadata`: Additional custom data
- `createdAt`, `updatedAt`: Timestamps
- `createdBy`, `updatedBy`: User references

### Position

Positions represent roles within the organization. Each position belongs to a division and may report to another position, creating a reporting hierarchy.

**Key Fields:**
- `_id`: Unique identifier
- `name`: Position name
- `code`: Unique position code (uppercase)
- `division`: Reference to the division this position belongs to
- `description`: Position description
- `responsibilities`: Array of responsibility descriptions
- `reportTo`: Reference to another position this position reports to (optional)
- `level`: Hierarchy level (0 for top-level positions)
- `status`: Position status (ACTIVE, INACTIVE, PENDING, ARCHIVED)
- `requirements`: Education, experience, skills, certifications, and physical requirements
- `compensation`: Salary grade, salary range, benefits, allowances, and eligibility information
- `metadata`: Additional custom data
- `createdAt`, `updatedAt`: Timestamps
- `createdBy`, `updatedBy`: User references

### OrganizationalChange

This model tracks all changes to divisions and positions for audit and historical purposes.

**Key Fields:**
- `_id`: Unique identifier
- `entityType`: Type of entity changed (DIVISION or POSITION)
- `entityId`: Reference to the entity that was changed
- `changeType`: Type of change (CREATE, UPDATE, DELETE, ACTIVATE, DEACTIVATE, TRANSFER, RESTRUCTURE)
- `description`: Human-readable description of the change
- `previousState`: State before the change
- `newState`: State after the change
- `changedFields`: Array of field names that were changed
- `effectiveDate`: When the change took effect
- `createdAt`: When the change was recorded
- `createdBy`: User who made the change

## API Endpoints

### Division Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/divisions` | Create a new division |
| GET | `/api/divisions` | List divisions with pagination and filtering |
| GET | `/api/divisions/hierarchy` | Get division hierarchy |
| GET | `/api/divisions/branch/:branchId` | Get divisions by branch |
| GET | `/api/divisions/:id` | Get a division by ID |
| GET | `/api/divisions/code/:code` | Get a division by code |
| GET | `/api/divisions/:id/children` | Get child divisions |
| GET | `/api/divisions/:id/descendants` | Get all descendant divisions |
| PUT | `/api/divisions/:id` | Update a division |
| DELETE | `/api/divisions/:id` | Delete a division |
| PATCH | `/api/divisions/:id/status` | Change division status |
| PATCH | `/api/divisions/:id/budget` | Update division budget |
| PATCH | `/api/divisions/:id/metrics` | Update division metrics |
| PATCH | `/api/divisions/:id/transfer` | Transfer division to another branch |

### Position Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/positions` | Create a new position |
| GET | `/api/positions` | List positions with pagination and filtering |
| GET | `/api/positions/organization-chart` | Get organization chart |
| GET | `/api/positions/division/:divisionId` | Get positions by division |
| GET | `/api/positions/:id` | Get a position by ID |
| GET | `/api/positions/code/:code` | Get a position by code |
| GET | `/api/positions/:id/reporting` | Get positions reporting to a position |
| GET | `/api/positions/:id/reporting-chain` | Get reporting chain for a position |
| PUT | `/api/positions/:id` | Update a position |
| DELETE | `/api/positions/:id` | Delete a position |
| PATCH | `/api/positions/:id/status` | Change position status |
| PATCH | `/api/positions/:id/requirements` | Update position requirements |
| PATCH | `/api/positions/:id/compensation` | Update position compensation |
| PATCH | `/api/positions/:id/responsibilities` | Update position responsibilities |
| PATCH | `/api/positions/:id/transfer` | Transfer position to another division |

### Organizational Change Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/organizational-changes/entity/:entityType/:entityId` | Get changes for a specific entity |
| GET | `/api/organizational-changes/type/:changeType` | Get changes by type |
| GET | `/api/organizational-changes/date-range/:startDate/:endDate` | Get changes in a date range |
| GET | `/api/organizational-changes/recent` | Get recent changes |
| GET | `/api/organizational-changes/:id` | Get change by ID |
| GET | `/api/organizational-changes/search/:query` | Search changes |

## Common Workflows

### Creating a Division Hierarchy

1. Create a top-level division (parent = null, level = 0)
2. Create child divisions with the parent set to the top-level division's ID
3. Create additional levels as needed

Example:
```javascript
// Create top-level division
const exo = await api.post('/api/divisions', {
  name: 'Executive Office',
  code: 'EXO',
  description: 'Executive leadership and management',
  status: 'ACTIVE'
});

// Create child division
const ops = await api.post('/api/divisions', {
  name: 'Operations',
  code: 'OPS',
  description: 'Manages all operational activities',
  parent: exo.data.data._id,
  status: 'ACTIVE'
});
```

### Creating a Position Reporting Structure

1. Create top-level positions (reportTo = null, level = 0)
2. Create positions that report to the top-level positions
3. Create additional levels as needed

Example:
```javascript
// Create CEO position
const ceo = await api.post('/api/positions', {
  name: 'Chief Executive Officer',
  code: 'CEO',
  division: exoId,
  responsibilities: ['Lead the company', 'Report to the board'],
  status: 'ACTIVE'
});

// Create COO position reporting to CEO
const coo = await api.post('/api/positions', {
  name: 'Chief Operations Officer',
  code: 'COO',
  division: opsId,
  reportTo: ceo.data.data._id,
  responsibilities: ['Oversee operations', 'Implement strategy'],
  status: 'ACTIVE'
});
```

### Transferring a Position to Another Division

Use the transfer endpoint to move a position to a different division:

```javascript
await api.patch(`/api/positions/${positionId}/transfer`, {
  divisionId: newDivisionId
});
```

### Tracking Organizational Changes

To view the history of changes for a division:

```javascript
const changes = await api.get(`/api/organizational-changes/entity/DIVISION/${divisionId}`);
```

## Integration with Other Services

### Employee Management Service

The Division & Position Management Service integrates with the Employee Management Service:

- Employees are assigned to positions
- Division managers are employees
- Employee transfers involve changing their assigned position

### Branch Management Service

The Division & Position Management Service integrates with the Branch Management Service:

- Divisions can be associated with branches
- Positions are indirectly associated with branches through their divisions

### Authorization Service

The Division & Position Management Service integrates with the Authorization Service:

- Role-based access control for division and position management
- Position-based permissions for various system functions

## Best Practices

### Division Codes

- Use short, meaningful codes (2-10 characters)
- Use uppercase letters, numbers, hyphens, and underscores
- Ensure codes are unique across the system
- Choose codes that make sense in the path structure

### Position Hierarchy

- Avoid circular reporting relationships
- Keep the reporting structure relatively flat (no more than 5-6 levels)
- Ensure each position has clear responsibilities
- Document position requirements thoroughly

### Organizational Changes

- Document the reason for changes in the metadata
- Review organizational change history periodically
- Use the change history for audit and compliance purposes

### Performance Considerations

- Use pagination when listing divisions or positions
- Use the hierarchy endpoints for visualizing the organization structure
- Cache frequently accessed organizational data
- Use the path field for efficient hierarchy queries

## Conclusion

The Division & Position Management Service provides a robust foundation for managing your organizational structure. By following the guidelines in this document, you can effectively create and maintain your company's divisions and positions, track organizational changes, and integrate with other services in the Samudra Paket ERP system.
