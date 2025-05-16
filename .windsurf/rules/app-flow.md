---
trigger: always_on
---

# Application Flow Rules

## General Flow Rules

1. All user flows must follow the exact sequence defined in the Application Flow Document
2. State transitions must adhere to the defined state diagrams without skipping states
3. Error handling must be implemented for every critical step in each flow
4. All flows must include proper validation at each step
5. Mobile applications must support offline operation with data synchronization
6. Each module must only interact with other modules through defined interfaces
7. All flows must include proper logging for audit and debugging purposes

## Authentication Flow Rules

1. Implement JWT-based authentication with refresh token mechanism
2. Enforce strong password policies (minimum 8 characters, mixed case, numbers, special characters)
3. Implement rate limiting for login attempts (maximum 5 attempts before temporary lockout)
4. User sessions must timeout after 30 minutes of inactivity
5. Implement role-based access control for all features
6. Store authentication tokens securely (HTTP-only cookies for web, secure storage for mobile)
7. Implement proper logout mechanism that invalidates tokens

## Pickup Management Flow Rules

1. Pickup requests must be validated for required information before assignment
2. Courier assignment must consider proximity and current workload
3. Real-time tracking must be enabled during pickup process
4. Photo documentation must include at least 3 photos (package front, address label, overall condition)
5. Digital signatures must be captured with timestamp and geolocation
6. STT generation must follow the standardized format with unique identifiers
7. Offline operation must be supported for the entire pickup process

## Shipment Processing Flow Rules

1. Package measurements must be recorded with precision (weight to 0.1kg, dimensions to 1cm)
2. Price calculation must follow the current tariff rules with proper zone mapping
3. Service selection must be validated against package characteristics
4. Payment processing must include proper receipt generation
5. Sorting must be based on destination and service priority
6. Loading must include package scanning for tracking updates
7. All shipments must have proper documentation before dispatch

## Delivery Management Flow Rules

1. Route optimization must prioritize delivery time windows and package priority
2. Driver assignments must consider vehicle capacity and route efficiency
3. Real-time tracking must be enabled for all delivery tasks
4. Proof of delivery must include recipient signature and photo evidence
5. COD collection must be reconciled daily with proper documentation
6. Failed deliveries must include detailed reason documentation
7. Rescheduling must follow the defined attempt rules (maximum 3 attempts)

## Financial Management Flow Rules

1. All financial transactions must be recorded with proper categorization
2. GL posting must follow double-entry accounting principles
3. Receivables must be aged and monitored for collection actions
4. Payables must be processed according to payment terms
5. Financial reports must be generated with proper reconciliation
6. COD reconciliation must be performed daily with courier collections
7. Credit accounts must be monitored for credit limits and payment terms

## Return Management Flow Rules

1. All returns must have documented reasons with evidence
2. Return process must follow the defined state transitions
3. Sender notifications must be automated for return initiation
4. Return delivery must include proper documentation and signature
5. System updates must reflect final status with complete history
6. Return charges must be calculated according to policy
7. Inventory adjustments must be made for returned items

## Module Interaction Rules

1. Web application modules must communicate through defined service interfaces
2. Mobile application modules must operate independently with proper synchronization
3. Data sharing between modules must follow the principle of least privilege
4. Module dependencies must be explicitly defined and documented
5. Cross-module operations must maintain data consistency
6. Module updates must not break existing interfaces
7. Performance metrics must be collected for all module interactions

## Data Flow Rules

1. All user input must be validated at the frontend before submission
2. API Gateway must enforce authentication and rate limiting
3. Microservices must validate input data before processing
4. Database operations must use transactions for data consistency
5. Cache invalidation must be properly managed for data accuracy
6. File storage must include proper metadata and access controls
7. External service calls must include proper error handling and retries

## Integration Rules

1. Maps and routing services must be integrated with fallback mechanisms
2. Payment gateway integration must include proper reconciliation
3. Notification services must provide delivery confirmation
4. Banking system integration must include proper security measures
5. All integrations must be monitored for availability and performance
6. API versioning must be implemented for all integration points
7. Integration tests must be comprehensive and automated

## Error Handling Rules

1. Network connectivity issues must be handled with offline operation capability
2. Payment processing failures must implement retry mechanisms
3. Address validation failures must have clear resolution workflows
4. Device failures must include data recovery mechanisms
5. All errors must be logged with appropriate severity levels
6. Critical errors must trigger notifications to technical support
7. User-facing error messages must be clear and actionable