# Application Flow Document

## Overview

This document outlines the flow of the Samudra Paket ERP system, detailing the user journeys, business processes, and interactions between different modules. It serves as a guide for developers to understand how the application should function from a user perspective.

## Core User Flows

### 1. Authentication Flow

```mermaid
flowchart TD
    A[User Access] --> B{Has Account?}
    B -->|Yes| C[Login]
    B -->|No| D[Register]
    C --> E{Valid Credentials?}
    E -->|Yes| F[Dashboard]
    E -->|No| G[Error Message] --> C
    D --> H[Verification] --> F
    F --> I[Access Control Based on Role]
```

#### Process Description:
1. User accesses the system via web or mobile application
2. If the user has an account, they proceed to login; otherwise, they register
3. After successful authentication, users are directed to their role-specific dashboard
4. Access to features is controlled based on user role and permissions

### 2. Pickup Management Flow

```mermaid
flowchart TD
    A[Customer Request] --> B[Create Pickup Order]
    B --> C[Assign to Courier]
    C --> D[Courier Receives Task]
    D --> E[Navigate to Location]
    E --> F[Collect Package]
    F --> G[Document with Photos]
    G --> H[Customer Signature]
    H --> I[Generate STT]
    I --> J[Transport to Branch]
    J --> K[Warehouse Receipt]
```

#### Process Description:
1. Customer requests pickup via call center or app
2. Admin creates pickup order in the system
3. System assigns pickup to available courier
4. Courier receives notification and task details
5. Courier navigates to pickup location using app
6. Package is collected and documented with photos
7. Customer provides digital signature
8. System generates Surat Tanda Terima (STT)
9. Package is transported to branch
10. Warehouse staff receives and processes the package

### 3. Shipment Processing Flow

```mermaid
flowchart TD
    A[Package at Branch] --> B[Weighing & Measurement]
    B --> C[Service Selection]
    C --> D[Price Calculation]
    D --> E{Payment Method?}
    E -->|Cash| F[Cash Payment]
    E -->|Credit| G[Credit Account]
    E -->|COD| H[Cash on Delivery]
    F --> I[Generate Resi]
    G --> I
    H --> I
    I --> J[Sorting]
    J --> K[Loading to Vehicle]
    K --> L[Dispatch]
```

#### Process Description:
1. Package arrives at branch and is processed
2. Staff weighs and measures the package
3. Service type is selected based on customer needs
4. System calculates shipping cost
5. Payment is processed (cash, credit, or COD)
6. System generates shipping receipt (resi)
7. Package is sorted based on destination
8. Package is loaded to appropriate vehicle
9. Vehicle is dispatched for delivery

### 4. Delivery Management Flow

```mermaid
flowchart TD
    A[Packages Loaded] --> B[Route Optimization]
    B --> C[Driver Assignment]
    C --> D[Delivery Tasks]
    D --> E[Navigate to Address]
    E --> F{Recipient Available?}
    F -->|Yes| G[Deliver Package]
    F -->|No| H[Reschedule/Return]
    G --> I{Payment Type?}
    I -->|COD| J[Collect Payment]
    I -->|Prepaid| K[Confirm Delivery]
    J --> L[Receipt Generation]
    K --> L
    L --> M[Proof of Delivery]
    H --> N[Update Status]
```

#### Process Description:
1. Packages are loaded onto delivery vehicles
2. System optimizes delivery routes
3. Drivers are assigned delivery tasks
4. Driver navigates to delivery address
5. If recipient is available, package is delivered
6. For COD shipments, payment is collected
7. Delivery is confirmed with digital signature
8. System generates proof of delivery
9. If recipient is unavailable, delivery is rescheduled or package is returned

### 5. Financial Management Flow

```mermaid
flowchart TD
    A[Transaction Occurs] --> B[System Records]
    B --> C{Transaction Type?}
    C -->|Income| D[Revenue Entry]
    C -->|Expense| E[Expense Entry]
    D --> F[GL Posting]
    E --> F
    F --> G[Financial Reports]
    D --> H[Receivables Management]
    E --> I[Payables Management]
    H --> J[Collection Process]
    I --> K[Payment Process]
```

#### Process Description:
1. Financial transaction occurs (shipping payment, COD collection, expense)
2. System records transaction details
3. Transaction is categorized as income or expense
4. Entry is posted to general ledger
5. Financial reports are updated
6. Receivables and payables are managed
7. Collection and payment processes are initiated as needed

### 6. Return Management Flow

```mermaid
flowchart TD
    A[Failed Delivery] --> B[Return Reason Documentation]
    B --> C[Return to Branch]
    C --> D{Action?}
    D -->|Reattempt| E[Reschedule Delivery]
    D -->|Return to Sender| F[Process Return]
    E --> G[New Delivery Task]
    F --> H[Sender Notification]
    H --> I[Return Delivery]
    I --> J[Update System]
```

#### Process Description:
1. Delivery attempt fails
2. Driver documents reason for failed delivery
3. Package is returned to branch
4. Decision is made to reattempt delivery or return to sender
5. For reattempt, new delivery task is created
6. For return to sender, return process is initiated
7. Sender is notified of the return
8. Package is delivered back to sender
9. System is updated with final status

## Module Interactions

### Web Application Modules

```mermaid
flowchart TD
    A[Authentication Module] --> B[Dashboard Module]
    B --> C[Admin Module]
    B --> D[Operations Module]
    B --> E[Finance Module]
    B --> F[Reporting Module]
    C --> G[User Management]
    C --> H[Branch Management]
    C --> I[Vehicle Management]
    D --> J[Pickup Management]
    D --> K[Shipment Management]
    D --> L[Delivery Management]
    D --> M[Return Management]
    E --> N[Billing]
    E --> O[Accounting]
    E --> P[Payroll]
    F --> Q[Operational Reports]
    F --> R[Financial Reports]
    F --> S[Performance Metrics]
```

### Mobile Application Modules

```mermaid
flowchart TD
    A[Authentication Module] --> B{User Role?}
    B -->|Courier| C[Pickup Module]
    B -->|Driver| D[Delivery Module]
    B -->|Collector| E[Collection Module]
    B -->|Warehouse| F[Warehouse Module]
    B -->|Manager| G[Monitoring Module]
    C --> H[Task Management]
    C --> I[Navigation]
    C --> J[Documentation]
    D --> K[Delivery Tasks]
    D --> L[Route Optimization]
    D --> M[Proof of Delivery]
    E --> N[Collection Tasks]
    E --> O[Payment Processing]
    E --> P[Receipt Generation]
    F --> Q[Receiving]
    F --> R[Sorting]
    F --> S[Loading]
    G --> T[Performance Tracking]
    G --> U[Task Assignment]
    G --> V[Issue Resolution]
```

## Data Flow

### High-Level Data Flow

```mermaid
flowchart TD
    A[User Input] --> B[Frontend Application]
    B --> C[API Gateway]
    C --> D[Microservices]
    D --> E[Database]
    D --> F[Cache]
    D --> G[File Storage]
    D --> H[External Services]
    H --> I[Maps API]
    H --> J[Payment Gateway]
    H --> K[Notification Service]
    D --> L[Event Bus]
    L --> M[Async Processing]
    M --> E
    D --> C
    C --> B
    B --> N[User Interface]
```

## State Transitions

### Shipment Status Transitions

```mermaid
stateDiagram-v2
    [*] --> Registered
    Registered --> PickupAssigned
    PickupAssigned --> PickedUp
    PickedUp --> AtBranch
    AtBranch --> Sorted
    Sorted --> InTransit
    InTransit --> AtDestinationBranch
    AtDestinationBranch --> OutForDelivery
    OutForDelivery --> Delivered
    OutForDelivery --> FailedDelivery
    FailedDelivery --> Rescheduled
    Rescheduled --> OutForDelivery
    FailedDelivery --> ReturnInitiated
    ReturnInitiated --> ReturnInTransit
    ReturnInTransit --> ReturnedToSender
    Delivered --> [*]
    ReturnedToSender --> [*]
```

### Payment Status Transitions

```mermaid
stateDiagram-v2
    [*] --> Unpaid
    Unpaid --> PartiallyPaid
    Unpaid --> Paid
    PartiallyPaid --> Paid
    Unpaid --> Overdue
    PartiallyPaid --> Overdue
    Overdue --> PartiallyPaid
    Overdue --> Paid
    Paid --> [*]
```

## Integration Points

### External System Integrations

1. **Maps and Routing Services**
   - Route optimization for pickups and deliveries
   - Geocoding for address validation
   - Real-time tracking of vehicles

2. **Payment Gateway**
   - Processing electronic payments
   - Handling refunds
   - Transaction verification

3. **Notification Services**
   - SMS notifications to customers
   - Email notifications for status updates
   - WhatsApp integration for customer communication

4. **Banking Systems**
   - Reconciliation of payments
   - Automated bank transfers
   - Financial reporting

## Error Handling and Recovery

### Common Error Scenarios

1. **Network Connectivity Issues**
   - Mobile app operates in offline mode
   - Data is queued for synchronization
   - Critical operations are prioritized when connectivity returns

2. **Payment Processing Failures**
   - Retry mechanism with exponential backoff
   - Alternative payment method suggestions
   - Manual intervention process

3. **Address Validation Failures**
   - Fallback to manual verification
   - Customer contact process
   - Address correction workflow

4. **Device Failures**
   - Session recovery mechanisms
   - Data backup and restoration
   - Alternative device procedures

## Conclusion

This application flow document provides a comprehensive overview of the Samudra Paket ERP system's operational flows. It serves as a guide for development teams to understand the expected behavior and interactions within the system. As the project evolves, this document should be updated to reflect any changes in business processes or technical implementations.