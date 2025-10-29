# System Architecture - Bihar Service Marketplace

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                             │
├──────────────────────┬──────────────────────┬──────────────────┤
│   Mobile App         │   Web Application    │   Admin Panel    │
│   (React Native)     │   (React.js)         │   (React.js)     │
└──────────┬───────────┴──────────┬───────────┴──────────┬───────┘
           │                      │                      │
           └──────────────────────┼──────────────────────┘
                                  │
                         ┌────────▼─────────┐
                         │   API Gateway    │
                         │   (NGINX)        │
                         └────────┬─────────┘
                                  │
        ┌─────────────────────────┼─────────────────────────┐
        │                         │                         │
┌───────▼──────┐         ┌────────▼────────┐      ┌────────▼────────┐
│ Auth Service │         │  Main API       │      │ Payment Service │
│  (JWT Auth)  │         │  (Express.js)   │      │  (Razorpay)     │
└───────┬──────┘         └────────┬────────┘      └────────┬────────┘
        │                         │                         │
        │          ┌──────────────┼──────────────┐          │
        │          │              │              │          │
┌───────▼──────────▼──┐  ┌────────▼────────┐  ┌──▼────────▼─────┐
│   Database Layer    │  │  Cache Layer    │  │  Message Queue  │
│   (MongoDB)         │  │  (Redis)        │  │  (RabbitMQ)     │
└─────────────────────┘  └─────────────────┘  └─────────────────┘
        │                                              │
        │                  ┌───────────────────────────┘
        │                  │
┌───────▼──────────────────▼────────┐
│      Storage Layer                │
│   (AWS S3 / Cloudinary)           │
└───────────────────────────────────┘
```

## Detailed Architecture Components

### 1. Client Layer

#### Mobile Application (React Native)
**Purpose**: Primary user interface for service providers and customers

**Features**:
- Cross-platform (iOS and Android)
- Offline-first architecture for poor connectivity
- Push notifications for bookings and messages
- Camera integration for service photos
- Location services for area-based search
- Local caching for better performance

**Key Screens**:
- **Provider Flow**: Profile, Service Management, Bookings, Earnings, Messages
- **Customer Flow**: Home, Search, Provider Details, Booking, Chat, History

#### Web Application (React.js)
**Purpose**: Desktop interface for detailed browsing and management

**Features**:
- Responsive design for all screen sizes
- Advanced search and filtering
- Bulk service management for providers
- Detailed analytics dashboard
- Report generation

#### Admin Panel (React.js)
**Purpose**: Platform management and monitoring

**Features**:
- User management (providers, customers)
- Service category management
- Verification and approval workflows
- Dispute resolution interface
- Analytics and reporting
- Payment reconciliation
- Advertisement management

### 2. API Gateway (NGINX)

**Purpose**: Single entry point for all client requests

**Responsibilities**:
- Request routing
- Load balancing
- SSL/TLS termination
- Rate limiting
- CORS handling
- Request/response logging
- API versioning

**Configuration**:
```nginx
upstream api_backend {
    least_conn;
    server api1.example.com:3000;
    server api2.example.com:3000;
    server api3.example.com:3000;
}

server {
    listen 443 ssl http2;
    server_name api.biharservices.com;
    
    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    
    location /api/ {
        proxy_pass http://api_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 3. Backend Services

#### Authentication Service
**Technology**: Node.js + Express.js + JWT

**Responsibilities**:
- User registration and login
- JWT token generation and validation
- OTP verification (phone numbers)
- Password reset workflows
- Session management
- Role-based access control (RBAC)

**API Endpoints**:
```
POST /auth/register
POST /auth/login
POST /auth/verify-otp
POST /auth/refresh-token
POST /auth/logout
POST /auth/forgot-password
POST /auth/reset-password
```

#### Main API Service
**Technology**: Node.js + Express.js

**Responsibilities**:
- Service provider management
- Customer management
- Service listing CRUD operations
- Booking management
- Category management
- Search and filtering
- Review and rating system
- Real-time messaging coordination

**API Endpoints**:
```
# Provider APIs
GET    /api/providers
GET    /api/providers/:id
POST   /api/providers
PUT    /api/providers/:id
DELETE /api/providers/:id
PUT    /api/providers/:id/verify

# Service APIs
GET    /api/services
GET    /api/services/:id
POST   /api/services
PUT    /api/services/:id
DELETE /api/services/:id
GET    /api/services/category/:categoryId

# Booking APIs
GET    /api/bookings
GET    /api/bookings/:id
POST   /api/bookings
PUT    /api/bookings/:id
PUT    /api/bookings/:id/accept
PUT    /api/bookings/:id/reject
PUT    /api/bookings/:id/complete
PUT    /api/bookings/:id/cancel

# Category APIs
GET    /api/categories
GET    /api/categories/:id
POST   /api/categories (Admin only)
PUT    /api/categories/:id (Admin only)

# Review APIs
GET    /api/reviews
POST   /api/reviews
GET    /api/reviews/service/:serviceId
GET    /api/reviews/provider/:providerId

# Search APIs
GET    /api/search/services?q=:query&category=:cat&location=:loc
GET    /api/search/providers?q=:query&category=:cat
```

#### Payment Service
**Technology**: Node.js + Express.js + Razorpay/Paytm SDK

**Responsibilities**:
- Payment gateway integration
- Transaction processing
- Commission calculation and deduction
- Refund processing
- Payment history
- Invoice generation
- Settlement to providers

**API Endpoints**:
```
POST /api/payments/initiate
POST /api/payments/verify
POST /api/payments/refund
GET  /api/payments/history
GET  /api/payments/invoice/:id
GET  /api/payments/earnings (Provider)
```

**Commission Logic**:
```javascript
// Commission calculation
const calculateCommission = (amount, commissionRate = 0.12) => {
  const commission = amount * commissionRate;
  const providerAmount = amount - commission;
  return {
    totalAmount: amount,
    commission: commission,
    providerAmount: providerAmount
  };
};
```

#### Notification Service
**Technology**: Node.js + Firebase Cloud Messaging

**Responsibilities**:
- Push notifications
- SMS notifications (OTP, booking updates)
- Email notifications
- In-app notifications

**Notification Types**:
- New booking request
- Booking accepted/rejected
- Service completion reminder
- Payment confirmation
- Review received
- New message
- Promotional offers

#### Real-Time Messaging Service (Full Launch)
**Technology**: Socket.io + Redis (for pub/sub)

**Responsibilities**:
- Real-time chat between customers and providers
- Message persistence
- Online/offline status
- Typing indicators
- Read receipts
- File/image sharing

**Socket Events**:
```javascript
// Client-side events
socket.on('message:new', (data) => {});
socket.on('message:read', (data) => {});
socket.on('user:online', (data) => {});
socket.on('user:typing', (data) => {});

// Server-side events
socket.emit('message:send', data);
socket.emit('message:delivered', data);
```

### 4. Data Layer

#### MongoDB Database
**Purpose**: Primary data storage

**Collections**:

1. **users**
```json
{
  "_id": "ObjectId",
  "phone": "string",
  "email": "string",
  "password": "hashed_string",
  "userType": "provider | customer",
  "name": "string",
  "profileImage": "url",
  "isVerified": "boolean",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

2. **providers**
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: users)",
  "bio": "string",
  "experience": "number",
  "serviceCategories": ["ObjectId (ref: categories)"],
  "serviceArea": {
    "city": "string",
    "districts": ["string"],
    "radius": "number"
  },
  "availability": {
    "monday": {"from": "time", "to": "time"},
    "tuesday": {"from": "time", "to": "time"},
    // ... other days
  },
  "documents": {
    "idProof": "url",
    "addressProof": "url",
    "certificates": ["url"]
  },
  "verificationStatus": "pending | verified | rejected",
  "rating": "number",
  "totalReviews": "number",
  "subscriptionTier": "free | premium",
  "subscriptionExpiry": "datetime",
  "isActive": "boolean",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

3. **services**
```json
{
  "_id": "ObjectId",
  "providerId": "ObjectId (ref: providers)",
  "title": "string",
  "description": "string",
  "categoryId": "ObjectId (ref: categories)",
  "subcategory": "string",
  "basePrice": "number",
  "priceUnit": "per_hour | per_service | per_item",
  "estimatedDuration": "number (minutes)",
  "images": ["url"],
  "isActive": "boolean",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

4. **categories**
```json
{
  "_id": "ObjectId",
  "name": "string",
  "slug": "string",
  "description": "string",
  "icon": "url",
  "parentCategory": "ObjectId (ref: categories) | null",
  "phase": "mvp | full_launch",
  "order": "number",
  "isActive": "boolean",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

5. **bookings**
```json
{
  "_id": "ObjectId",
  "customerId": "ObjectId (ref: users)",
  "providerId": "ObjectId (ref: providers)",
  "serviceId": "ObjectId (ref: services)",
  "bookingDate": "datetime",
  "bookingTime": "time",
  "status": "pending | accepted | rejected | completed | cancelled",
  "customerLocation": {
    "address": "string",
    "city": "string",
    "pincode": "string",
    "coordinates": {"lat": "number", "lng": "number"}
  },
  "description": "string",
  "negotiatedPrice": "number",
  "finalPrice": "number",
  "paymentMethod": "cash | upi | bank_transfer",
  "paymentStatus": "pending | paid | refunded",
  "transactionId": "string",
  "commission": "number",
  "notes": "string",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

6. **reviews**
```json
{
  "_id": "ObjectId",
  "bookingId": "ObjectId (ref: bookings)",
  "customerId": "ObjectId (ref: users)",
  "providerId": "ObjectId (ref: providers)",
  "serviceId": "ObjectId (ref: services)",
  "rating": "number (1-5)",
  "comment": "string",
  "images": ["url"],
  "response": {
    "text": "string",
    "timestamp": "datetime"
  },
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

7. **messages** (Full Launch)
```json
{
  "_id": "ObjectId",
  "conversationId": "string",
  "senderId": "ObjectId (ref: users)",
  "receiverId": "ObjectId (ref: users)",
  "messageType": "text | image | file",
  "content": "string",
  "mediaUrl": "url",
  "isRead": "boolean",
  "readAt": "datetime",
  "createdAt": "datetime"
}
```

8. **subscriptions**
```json
{
  "_id": "ObjectId",
  "providerId": "ObjectId (ref: providers)",
  "tier": "free | premium",
  "startDate": "datetime",
  "endDate": "datetime",
  "amount": "number",
  "paymentId": "string",
  "status": "active | expired | cancelled",
  "autoRenew": "boolean",
  "features": {
    "featuredListing": "boolean",
    "prioritySupport": "boolean",
    "advancedAnalytics": "boolean",
    "adFree": "boolean"
  },
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

9. **advertisements**
```json
{
  "_id": "ObjectId",
  "businessName": "string",
  "businessType": "string",
  "adTitle": "string",
  "adDescription": "string",
  "adImage": "url",
  "targetCategory": "ObjectId (ref: categories)",
  "targetLocation": ["string"],
  "clickUrl": "url",
  "startDate": "datetime",
  "endDate": "datetime",
  "budget": "number",
  "spent": "number",
  "impressions": "number",
  "clicks": "number",
  "status": "active | paused | completed",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

#### Redis Cache
**Purpose**: Performance optimization and session management

**Use Cases**:
- Session storage
- API response caching
- Frequently accessed data (categories, featured providers)
- Real-time data (online users, active bookings)
- Rate limiting counters

**Key Patterns**:
```
session:{userId}            -> User session data
provider:{providerId}       -> Provider profile cache
categories:all              -> All categories cache
featured:providers          -> Featured providers list
search:{query}:{filters}    -> Search results cache
```

#### AWS S3 / Cloudinary
**Purpose**: File and image storage

**Storage Structure**:
```
/profiles/
  /{userId}/avatar.jpg
/services/
  /{serviceId}/image1.jpg
  /{serviceId}/image2.jpg
/documents/
  /{providerId}/id_proof.pdf
  /{providerId}/certificate1.pdf
/reviews/
  /{reviewId}/photo1.jpg
```

### 5. Security Architecture

#### Authentication Flow
```
1. User Login Request → API Gateway
2. Validate Credentials → Auth Service
3. Generate JWT Token (15 min access, 7 day refresh)
4. Return Tokens → Client
5. Client stores tokens securely
6. Subsequent requests include JWT in header
7. Gateway validates token
8. Route to appropriate service
```

#### Data Encryption
- **In Transit**: TLS 1.3 for all communications
- **At Rest**: AES-256 encryption for sensitive data
- **Passwords**: Bcrypt with salt rounds = 12
- **PII**: Field-level encryption in database

#### API Security
- Rate limiting: 100 requests/minute per user
- Input validation and sanitization
- SQL injection prevention (using ODM)
- XSS protection
- CSRF tokens for state-changing operations
- API key authentication for third-party integrations

### 6. Monitoring & Logging

#### Application Monitoring
- **Tool**: New Relic / DataDog
- **Metrics**: Response times, error rates, throughput
- **Alerts**: Performance degradation, high error rates

#### Log Management
- **Tool**: ELK Stack (Elasticsearch, Logstash, Kibana)
- **Log Types**: Application logs, access logs, error logs
- **Retention**: 90 days for analysis

#### Analytics
- **Tool**: Google Analytics + Mixpanel
- **Tracking**: User behavior, conversion funnels, retention
- **Custom Events**: Booking completion, payment success, review submission

### 7. Deployment Architecture

#### Environment Structure
```
Development → Staging → Production

Each environment has:
- Separate database instances
- Isolated API servers
- Independent storage buckets
- Environment-specific configurations
```

#### CI/CD Pipeline
```
Code Commit → GitHub
  ↓
Automated Tests → GitHub Actions
  ↓
Build & Package → Docker
  ↓
Deploy to Staging → AWS ECS
  ↓
Integration Tests → Automated
  ↓
Manual Approval → Product Team
  ↓
Deploy to Production → AWS ECS
  ↓
Health Checks → Monitoring
```

#### Scaling Strategy
- **Horizontal Scaling**: Auto-scaling groups for API servers
- **Database Scaling**: MongoDB replica sets with sharding
- **Cache Scaling**: Redis cluster for distributed caching
- **CDN**: CloudFront for static assets

### 8. Disaster Recovery

#### Backup Strategy
- **Database**: Daily automated backups, retained for 30 days
- **Point-in-time Recovery**: 5-minute granularity
- **Storage**: Cross-region replication for S3

#### High Availability
- **Multi-AZ Deployment**: Services across multiple availability zones
- **Database Replication**: Primary-secondary setup
- **Failover**: Automated failover for critical services
- **RTO**: 15 minutes (Recovery Time Objective)
- **RPO**: 5 minutes (Recovery Point Objective)

## Technology Stack Summary

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Mobile App | React Native | iOS/Android applications |
| Web App | React.js | Desktop interface |
| Backend API | Node.js + Express | RESTful API services |
| Database | MongoDB | Primary data storage |
| Cache | Redis | Performance optimization |
| Storage | AWS S3 / Cloudinary | File storage |
| Real-time | Socket.io | Chat and notifications |
| API Gateway | NGINX | Request routing |
| Auth | JWT | Authentication |
| Payment | Razorpay/Paytm | Payment processing |
| Notifications | Firebase Cloud Messaging | Push notifications |
| Hosting | AWS / GCP | Infrastructure |
| Monitoring | New Relic | Performance monitoring |
| Analytics | Google Analytics | User behavior tracking |

## Performance Targets

- **API Response Time**: < 200ms (p95)
- **Page Load Time**: < 2 seconds
- **Search Response**: < 500ms
- **Image Load Time**: < 1 second
- **Uptime**: 99.9% availability
- **Concurrent Users**: Support 10,000+ simultaneous users
