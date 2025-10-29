# Database Schema Design - Bihar Service Marketplace

## Overview

This document defines the complete database schema for the Bihar Service Marketplace platform using MongoDB as the primary database.

## Collections

### 1. users

**Purpose**: Core user accounts for both service providers and customers

```javascript
{
  _id: ObjectId,
  phone: String, // Required, unique, indexed
  phoneVerified: Boolean, // default: false
  email: String, // Optional, unique if provided
  emailVerified: Boolean, // default: false
  password: String, // Hashed with bcrypt
  userType: String, // Enum: ['customer', 'provider']
  name: String, // Required
  profileImage: String, // URL to profile photo
  language: String, // default: 'hindi', Enum: ['hindi', 'bhojpuri', 'maithili', 'english']
  isActive: Boolean, // default: true
  isBlocked: Boolean, // default: false, Admin can block users
  lastLogin: Date,
  deviceTokens: [String], // For push notifications
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
```javascript
db.users.createIndex({ phone: 1 }, { unique: true });
db.users.createIndex({ email: 1 }, { unique: true, sparse: true });
db.users.createIndex({ userType: 1 });
db.users.createIndex({ createdAt: -1 });
```

---

### 2. providers

**Purpose**: Extended profile information for service providers

```javascript
{
  _id: ObjectId,
  userId: ObjectId, // Reference to users collection
  bio: String, // Provider description
  experience: Number, // Years of experience
  serviceCategories: [ObjectId], // Reference to categories collection
  skills: [String], // Array of skill keywords
  
  // Service area
  serviceArea: {
    city: String, // Primary city
    districts: [String], // Districts where service is offered
    radius: Number, // Service radius in kilometers
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  
  // Availability schedule
  availability: {
    monday: { available: Boolean, from: String, to: String },
    tuesday: { available: Boolean, from: String, to: String },
    wednesday: { available: Boolean, from: String, to: String },
    thursday: { available: Boolean, from: String, to: String },
    friday: { available: Boolean, from: String, to: String },
    saturday: { available: Boolean, from: String, to: String },
    sunday: { available: Boolean, from: String, to: String }
  },
  
  // Verification documents
  documents: {
    idProof: {
      type: String, // Enum: ['aadhaar', 'pan', 'voter_id', 'driving_license']
      url: String,
      number: String,
      verified: Boolean
    },
    addressProof: {
      type: String,
      url: String,
      verified: Boolean
    },
    certificates: [{
      name: String,
      url: String,
      issuer: String,
      issueDate: Date,
      verified: Boolean
    }]
  },
  
  // Verification status
  verificationStatus: String, // Enum: ['pending', 'under_review', 'verified', 'rejected']
  verificationNotes: String, // Admin notes for verification
  verifiedAt: Date,
  
  // Ratings and reviews
  rating: Number, // Average rating (0-5)
  totalReviews: Number, // Total number of reviews
  
  // Subscription
  subscriptionTier: String, // Enum: ['free', 'premium']
  subscriptionExpiry: Date,
  
  // Stats
  totalBookings: Number, // default: 0
  completedBookings: Number, // default: 0
  totalEarnings: Number, // default: 0
  commissionPaid: Number, // default: 0
  
  // Account settings
  isActive: Boolean, // default: true
  acceptingBookings: Boolean, // default: true
  
  // Bank details for settlements
  bankDetails: {
    accountNumber: String,
    ifscCode: String,
    accountHolderName: String,
    bankName: String,
    branchName: String,
    verified: Boolean
  },
  
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
```javascript
db.providers.createIndex({ userId: 1 }, { unique: true });
db.providers.createIndex({ serviceCategories: 1 });
db.providers.createIndex({ 'serviceArea.city': 1 });
db.providers.createIndex({ 'serviceArea.districts': 1 });
db.providers.createIndex({ verificationStatus: 1 });
db.providers.createIndex({ subscriptionTier: 1 });
db.providers.createIndex({ rating: -1 });
db.providers.createIndex({ isActive: 1, acceptingBookings: 1 });
```

---

### 3. customers

**Purpose**: Extended profile information for customers

```javascript
{
  _id: ObjectId,
  userId: ObjectId, // Reference to users collection
  
  // Saved addresses
  addresses: [{
    label: String, // 'Home', 'Office', 'Other'
    address: String,
    city: String,
    district: String,
    state: String,
    pincode: String,
    coordinates: {
      lat: Number,
      lng: Number
    },
    isDefault: Boolean
  }],
  
  // Preferences
  preferredCategories: [ObjectId], // Reference to categories
  preferredLanguage: String,
  
  // Stats
  totalBookings: Number, // default: 0
  completedBookings: Number, // default: 0
  totalSpent: Number, // default: 0
  
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
```javascript
db.customers.createIndex({ userId: 1 }, { unique: true });
db.customers.createIndex({ 'addresses.city': 1 });
db.customers.createIndex({ preferredCategories: 1 });
```

---

### 4. categories

**Purpose**: Service category hierarchy (MVP: Electrician only, Full: All categories)

```javascript
{
  _id: ObjectId,
  name: String, // Category name
  nameHindi: String, // Hindi translation
  slug: String, // URL-friendly name, unique
  description: String,
  descriptionHindi: String,
  icon: String, // URL to icon image
  image: String, // URL to category image
  
  // Hierarchy
  parentCategory: ObjectId, // Reference to parent category, null for root
  level: Number, // 0 for root, 1 for subcategory, etc.
  
  // Phase management
  phase: String, // Enum: ['mvp', 'full_launch']
  launchDate: Date, // When category was/will be launched
  
  // Display
  order: Number, // Display order
  color: String, // Hex color for UI
  isActive: Boolean, // default: true
  isFeatured: Boolean, // default: false
  
  // Metadata
  keywords: [String], // Search keywords
  serviceCount: Number, // Number of services in this category, default: 0
  
  createdAt: Date,
  updatedAt: Date
}
```

**MVP Categories Structure**:
```javascript
// Root Category
{
  name: "Electrician Services",
  nameHindi: "बिजली मिस्त्री सेवाएं",
  slug: "electrician-services",
  parentCategory: null,
  level: 0,
  phase: "mvp"
}

// Subcategories
{
  name: "Fan Repair & Cleaning",
  nameHindi: "पंखा मरम्मत और सफाई",
  slug: "fan-repair-cleaning",
  parentCategory: ObjectId("electrician-services"),
  level: 1,
  phase: "mvp"
}
// ... other subcategories
```

**Indexes**:
```javascript
db.categories.createIndex({ slug: 1 }, { unique: true });
db.categories.createIndex({ parentCategory: 1 });
db.categories.createIndex({ phase: 1, isActive: 1 });
db.categories.createIndex({ order: 1 });
```

---

### 5. services

**Purpose**: Service listings created by providers

```javascript
{
  _id: ObjectId,
  providerId: ObjectId, // Reference to providers collection
  
  // Service details
  title: String, // Required
  titleHindi: String,
  description: String, // Required
  descriptionHindi: String,
  
  // Category
  categoryId: ObjectId, // Reference to categories collection, Required
  subcategory: String, // Additional subcategory detail
  
  // Pricing
  basePrice: Number, // Required, in INR
  priceUnit: String, // Enum: ['per_hour', 'per_service', 'per_item', 'negotiable']
  priceNegotiable: Boolean, // default: true
  estimatedDuration: Number, // in minutes
  
  // Media
  images: [{
    url: String,
    caption: String,
    order: Number
  }],
  
  // Service specifics
  materialsIncluded: Boolean, // default: false
  materialsDescription: String,
  serviceIncludes: [String], // What's included in the service
  serviceExcludes: [String], // What's not included
  
  // Visibility
  isActive: Boolean, // default: true
  isFeatured: Boolean, // default: false (premium feature)
  
  // Stats
  views: Number, // default: 0
  bookings: Number, // default: 0
  
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
```javascript
db.services.createIndex({ providerId: 1 });
db.services.createIndex({ categoryId: 1 });
db.services.createIndex({ isActive: 1, isFeatured: -1 });
db.services.createIndex({ basePrice: 1 });
db.services.createIndex({ createdAt: -1 });
// Text index for search
db.services.createIndex({ 
  title: "text", 
  description: "text", 
  titleHindi: "text", 
  descriptionHindi: "text" 
});
```

---

### 6. bookings

**Purpose**: Service booking records and transactions

```javascript
{
  _id: ObjectId,
  bookingNumber: String, // Unique booking identifier (e.g., "BH-2024-001234")
  
  // Parties
  customerId: ObjectId, // Reference to users collection
  providerId: ObjectId, // Reference to providers collection
  serviceId: ObjectId, // Reference to services collection
  
  // Schedule
  bookingDate: Date, // Date of service
  bookingTime: String, // Time of service (HH:MM format)
  estimatedDuration: Number, // in minutes
  
  // Location
  serviceLocation: {
    address: String,
    city: String,
    district: String,
    pincode: String,
    coordinates: {
      lat: Number,
      lng: Number
    },
    landmark: String,
    contactPhone: String
  },
  
  // Service details
  description: String, // Customer's description of work needed
  images: [String], // URLs to images provided by customer
  
  // Pricing (MVP: Manual negotiation via phone)
  quotedPrice: Number, // Initial price from service listing
  negotiatedPrice: Number, // Price after negotiation
  finalPrice: Number, // Final agreed price
  discount: Number, // Any discount applied, default: 0
  
  // Commission (Full Launch only)
  commissionRate: Number, // Percentage (e.g., 0.12 for 12%)
  commissionAmount: Number, // Calculated commission
  providerPayout: Number, // Amount to be paid to provider
  
  // Status workflow
  status: String, // Enum: ['pending', 'accepted', 'rejected', 'in_progress', 'completed', 'cancelled', 'disputed']
  statusHistory: [{
    status: String,
    timestamp: Date,
    updatedBy: ObjectId, // Reference to users
    notes: String
  }],
  
  // Payment (Full Launch)
  paymentMethod: String, // Enum: ['cash', 'upi', 'bank_transfer', 'wallet']
  paymentStatus: String, // Enum: ['pending', 'paid', 'failed', 'refunded']
  transactionId: String,
  paymentDate: Date,
  
  // UPI details (Full Launch)
  upiDetails: {
    transactionId: String,
    vpa: String, // Virtual Payment Address
    timestamp: Date
  },
  
  // Service completion
  completedAt: Date,
  completionNotes: String,
  completionImages: [String], // Before/after images
  
  // Cancellation
  cancelledAt: Date,
  cancelledBy: ObjectId, // Reference to users
  cancellationReason: String,
  
  // Dispute
  disputeRaised: Boolean, // default: false
  disputeDetails: {
    raisedBy: ObjectId,
    reason: String,
    description: String,
    raisedAt: Date,
    status: String, // Enum: ['open', 'under_review', 'resolved']
    resolution: String,
    resolvedAt: Date
  },
  
  // Communication
  lastMessageAt: Date,
  unreadMessagesCustomer: Number, // default: 0
  unreadMessagesProvider: Number, // default: 0
  
  // Notes
  customerNotes: String,
  providerNotes: String,
  adminNotes: String,
  
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
```javascript
db.bookings.createIndex({ bookingNumber: 1 }, { unique: true });
db.bookings.createIndex({ customerId: 1, createdAt: -1 });
db.bookings.createIndex({ providerId: 1, createdAt: -1 });
db.bookings.createIndex({ serviceId: 1 });
db.bookings.createIndex({ status: 1 });
db.bookings.createIndex({ bookingDate: 1 });
db.bookings.createIndex({ paymentStatus: 1 });
db.bookings.createIndex({ 'serviceLocation.city': 1 });
```

---

### 7. reviews

**Purpose**: Service ratings and reviews (Full Launch Phase)

```javascript
{
  _id: ObjectId,
  bookingId: ObjectId, // Reference to bookings collection, Required
  customerId: ObjectId, // Reference to users collection
  providerId: ObjectId, // Reference to providers collection
  serviceId: ObjectId, // Reference to services collection
  
  // Rating (1-5 stars)
  overallRating: Number, // Required, 1-5
  
  // Detailed ratings
  ratings: {
    quality: Number, // 1-5
    punctuality: Number, // 1-5
    professionalism: Number, // 1-5
    valueForMoney: Number // 1-5
  },
  
  // Review content
  title: String,
  comment: String,
  images: [String], // URLs to review images
  
  // Provider response
  response: {
    text: String,
    timestamp: Date
  },
  
  // Moderation
  isVerified: Boolean, // Verified booking, default: true
  isVisible: Boolean, // default: true
  isFeatured: Boolean, // default: false
  flagged: Boolean, // default: false
  flagReason: String,
  
  // Helpfulness
  helpfulCount: Number, // default: 0
  notHelpfulCount: Number, // default: 0
  
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
```javascript
db.reviews.createIndex({ bookingId: 1 }, { unique: true });
db.reviews.createIndex({ providerId: 1, createdAt: -1 });
db.reviews.createIndex({ serviceId: 1 });
db.reviews.createIndex({ customerId: 1 });
db.reviews.createIndex({ overallRating: -1 });
db.reviews.createIndex({ isVisible: 1, isFeatured: -1 });
```

---

### 8. messages

**Purpose**: Real-time chat messages between customers and providers (Full Launch Phase)

```javascript
{
  _id: ObjectId,
  conversationId: String, // Composite: "{customerId}_{providerId}"
  bookingId: ObjectId, // Reference to bookings collection, Optional
  
  // Participants
  senderId: ObjectId, // Reference to users collection
  receiverId: ObjectId, // Reference to users collection
  
  // Message content
  messageType: String, // Enum: ['text', 'image', 'file', 'location', 'system']
  content: String, // Text content
  mediaUrl: String, // URL for images/files
  mediaSize: Number, // File size in bytes
  mediaMimeType: String,
  
  // Location data (for location messages)
  location: {
    lat: Number,
    lng: Number,
    address: String
  },
  
  // Status
  isRead: Boolean, // default: false
  readAt: Date,
  isDelivered: Boolean, // default: false
  deliveredAt: Date,
  
  // Metadata
  isDeleted: Boolean, // default: false
  deletedAt: Date,
  
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
```javascript
db.messages.createIndex({ conversationId: 1, createdAt: -1 });
db.messages.createIndex({ senderId: 1, createdAt: -1 });
db.messages.createIndex({ receiverId: 1, isRead: 1 });
db.messages.createIndex({ bookingId: 1 });
```

---

### 9. conversations

**Purpose**: Conversation metadata between customers and providers (Full Launch Phase)

```javascript
{
  _id: ObjectId,
  conversationId: String, // Composite: "{customerId}_{providerId}"
  
  // Participants
  customerId: ObjectId, // Reference to users collection
  providerId: ObjectId, // Reference to providers collection
  bookingId: ObjectId, // Reference to bookings collection, Optional
  
  // Latest message
  lastMessage: {
    content: String,
    senderId: ObjectId,
    timestamp: Date
  },
  
  // Unread counts
  unreadCountCustomer: Number, // default: 0
  unreadCountProvider: Number, // default: 0
  
  // Typing status
  customerTyping: Boolean, // default: false
  providerTyping: Boolean, // default: false
  
  // Status
  isBlocked: Boolean, // default: false
  blockedBy: ObjectId,
  
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
```javascript
db.conversations.createIndex({ conversationId: 1 }, { unique: true });
db.conversations.createIndex({ customerId: 1, updatedAt: -1 });
db.conversations.createIndex({ providerId: 1, updatedAt: -1 });
```

---

### 10. subscriptions

**Purpose**: Provider subscription management

```javascript
{
  _id: ObjectId,
  providerId: ObjectId, // Reference to providers collection
  
  // Subscription details
  tier: String, // Enum: ['free', 'premium']
  planName: String, // e.g., "Premium Monthly", "Premium Yearly"
  
  // Duration
  startDate: Date,
  endDate: Date,
  duration: Number, // in days
  
  // Pricing
  amount: Number, // in INR
  discount: Number, // default: 0
  finalAmount: Number,
  
  // Payment
  paymentId: String,
  paymentMethod: String,
  paymentStatus: String, // Enum: ['pending', 'paid', 'failed', 'refunded']
  paymentDate: Date,
  
  // Status
  status: String, // Enum: ['active', 'expired', 'cancelled', 'suspended']
  autoRenew: Boolean, // default: false
  
  // Features
  features: {
    featuredListing: Boolean, // default: false
    prioritySupport: Boolean, // default: false
    advancedAnalytics: Boolean, // default: false
    adFree: Boolean, // default: false
    unlimitedServices: Boolean, // default: false
    verifiedBadge: Boolean // default: false
  },
  
  // Cancellation
  cancelledAt: Date,
  cancellationReason: String,
  
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
```javascript
db.subscriptions.createIndex({ providerId: 1, createdAt: -1 });
db.subscriptions.createIndex({ status: 1, endDate: 1 });
db.subscriptions.createIndex({ tier: 1 });
```

---

### 11. advertisements

**Purpose**: Local business advertising management (Full Launch Phase)

```javascript
{
  _id: ObjectId,
  
  // Advertiser details
  businessName: String,
  businessType: String,
  contactName: String,
  contactPhone: String,
  contactEmail: String,
  
  // Ad content
  adTitle: String,
  adDescription: String,
  adImage: String, // URL
  adVideo: String, // URL, Optional
  clickUrl: String, // Landing page URL
  callToAction: String, // "Call Now", "Visit Website", etc.
  
  // Targeting
  targetCategory: [ObjectId], // Reference to categories
  targetCity: [String],
  targetDistrict: [String],
  targetUserType: String, // Enum: ['all', 'customer', 'provider']
  
  // Schedule
  startDate: Date,
  endDate: Date,
  isActive: Boolean, // default: true
  
  // Placement
  placement: String, // Enum: ['banner', 'sidebar', 'feed', 'popup']
  priority: Number, // Higher number = higher priority
  
  // Budget and billing
  budget: Number, // Total budget in INR
  billingModel: String, // Enum: ['cpm', 'cpc', 'cpa', 'fixed']
  costPerClick: Number,
  costPerImpression: Number,
  spent: Number, // default: 0
  
  // Performance metrics
  impressions: Number, // default: 0
  clicks: Number, // default: 0
  conversions: Number, // default: 0
  ctr: Number, // Click-through rate, default: 0
  
  // Status
  status: String, // Enum: ['draft', 'pending_approval', 'active', 'paused', 'completed', 'rejected']
  approvedBy: ObjectId, // Admin who approved
  approvedAt: Date,
  rejectionReason: String,
  
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
```javascript
db.advertisements.createIndex({ status: 1, startDate: 1, endDate: 1 });
db.advertisements.createIndex({ targetCategory: 1 });
db.advertisements.createIndex({ targetCity: 1 });
db.advertisements.createIndex({ isActive: 1, priority: -1 });
```

---

### 12. transactions

**Purpose**: Financial transaction records (Full Launch Phase)

```javascript
{
  _id: ObjectId,
  transactionId: String, // Unique transaction ID
  
  // Related entities
  bookingId: ObjectId, // Reference to bookings
  customerId: ObjectId, // Reference to users
  providerId: ObjectId, // Reference to providers
  
  // Transaction type
  type: String, // Enum: ['booking_payment', 'subscription_payment', 'refund', 'commission', 'payout']
  
  // Amounts
  amount: Number, // Total amount
  commission: Number, // Platform commission
  providerAmount: Number, // Amount credited to provider
  tax: Number, // Tax amount
  
  // Payment details
  paymentMethod: String, // Enum: ['cash', 'upi', 'bank_transfer', 'wallet']
  paymentGateway: String, // e.g., 'razorpay', 'paytm'
  gatewayTransactionId: String,
  
  // UPI details
  upiId: String,
  upiTransactionId: String,
  
  // Bank details
  bankReferenceNumber: String,
  
  // Status
  status: String, // Enum: ['pending', 'processing', 'completed', 'failed', 'refunded']
  
  // Timestamps
  initiatedAt: Date,
  completedAt: Date,
  failedAt: Date,
  refundedAt: Date,
  
  // Failure details
  failureReason: String,
  failureCode: String,
  
  // Settlement (for providers)
  settlementStatus: String, // Enum: ['pending', 'processed', 'failed']
  settlementDate: Date,
  settlementReferenceId: String,
  
  // Metadata
  description: String,
  notes: String,
  
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
```javascript
db.transactions.createIndex({ transactionId: 1 }, { unique: true });
db.transactions.createIndex({ bookingId: 1 });
db.transactions.createIndex({ customerId: 1, createdAt: -1 });
db.transactions.createIndex({ providerId: 1, createdAt: -1 });
db.transactions.createIndex({ status: 1 });
db.transactions.createIndex({ settlementStatus: 1 });
db.transactions.createIndex({ type: 1, createdAt: -1 });
```

---

### 13. notifications

**Purpose**: User notifications and alerts

```javascript
{
  _id: ObjectId,
  userId: ObjectId, // Reference to users collection
  
  // Notification details
  type: String, // Enum: ['booking', 'message', 'payment', 'review', 'promotion', 'system']
  title: String,
  message: String,
  
  // Related entities
  relatedId: ObjectId, // ID of related entity (booking, message, etc.)
  relatedType: String, // Type of related entity
  
  // Action
  actionUrl: String, // Deep link or URL
  actionLabel: String, // "View Booking", "Reply", etc.
  
  // Delivery
  channels: [String], // Enum: ['push', 'sms', 'email', 'in_app']
  deliveryStatus: {
    push: String, // 'sent', 'delivered', 'failed'
    sms: String,
    email: String,
    in_app: String
  },
  
  // Status
  isRead: Boolean, // default: false
  readAt: Date,
  
  // Priority
  priority: String, // Enum: ['low', 'medium', 'high', 'urgent']
  
  // Expiry
  expiresAt: Date,
  
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
```javascript
db.notifications.createIndex({ userId: 1, createdAt: -1 });
db.notifications.createIndex({ userId: 1, isRead: 1 });
db.notifications.createIndex({ type: 1 });
db.notifications.createIndex({ expiresAt: 1 });
```

---

### 14. admin_logs

**Purpose**: Audit trail for admin actions

```javascript
{
  _id: ObjectId,
  adminId: ObjectId, // Reference to users collection (admin)
  
  // Action details
  action: String, // e.g., 'verify_provider', 'block_user', 'approve_ad'
  resource: String, // Resource type
  resourceId: ObjectId, // Resource ID
  
  // Changes
  changesBefore: Object, // State before action
  changesAfter: Object, // State after action
  
  // Context
  ipAddress: String,
  userAgent: String,
  notes: String,
  
  createdAt: Date
}
```

**Indexes**:
```javascript
db.admin_logs.createIndex({ adminId: 1, createdAt: -1 });
db.admin_logs.createIndex({ resource: 1, resourceId: 1 });
db.admin_logs.createIndex({ createdAt: -1 });
```

---

### 15. app_config

**Purpose**: Application configuration and settings

```javascript
{
  _id: ObjectId,
  key: String, // Unique configuration key
  value: Object, // Configuration value (flexible type)
  description: String,
  
  // Metadata
  category: String, // e.g., 'payment', 'commission', 'subscription'
  isActive: Boolean, // default: true
  
  // Version control
  version: Number,
  previousVersions: [Object],
  
  updatedBy: ObjectId, // Reference to users (admin)
  createdAt: Date,
  updatedAt: Date
}
```

**Example Configurations**:
```javascript
// Commission rates
{
  key: "commission_rate",
  value: {
    default: 0.12,
    electrician: 0.12,
    plumber: 0.15,
    carpenter: 0.13
  },
  category: "payment"
}

// Subscription plans
{
  key: "subscription_plans",
  value: {
    premium_monthly: {
      price: 299,
      duration: 30,
      features: ["featured", "analytics", "priority_support"]
    },
    premium_yearly: {
      price: 2999,
      duration: 365,
      features: ["featured", "analytics", "priority_support", "verified_badge"]
    }
  },
  category: "subscription"
}
```

**Indexes**:
```javascript
db.app_config.createIndex({ key: 1 }, { unique: true });
db.app_config.createIndex({ category: 1 });
```

---

## Relationships Diagram

```
users (1) ─── (1) providers
users (1) ─── (1) customers
providers (1) ─── (n) services
services (n) ─── (1) categories
bookings (n) ─── (1) customers
bookings (n) ─── (1) providers
bookings (n) ─── (1) services
bookings (1) ─── (1) reviews
bookings (1) ─── (n) messages
providers (1) ─── (n) subscriptions
providers (1) ─── (n) reviews
categories (n) ─── (1) categories (self-reference for hierarchy)
```

## Data Migration Strategy

### Phase 1: MVP (Month 0-3)
- Collections: users, providers, customers, categories (electrician only), services, bookings
- Features: Basic profiles, service listings, booking (cash only)

### Phase 2: Full Launch (Month 4-6)
- Add collections: reviews, messages, conversations, transactions
- Expand categories (all service types)
- Enable payment gateway integrations

### Phase 3: Monetization (Month 6+)
- Add collections: subscriptions, advertisements
- Enable commission tracking
- Implement subscription management

## Backup and Recovery

- **Daily Backups**: Automated daily backups at 2 AM IST
- **Retention**: 30 days of daily backups
- **Point-in-Time Recovery**: 5-minute granularity
- **Geo-Redundancy**: Cross-region replication

## Performance Optimization

- **Compound Indexes**: Create compound indexes for common query patterns
- **Index Usage**: Monitor and optimize index usage
- **Sharding**: Plan for horizontal sharding when data exceeds 100GB
- **Aggregation Pipelines**: Use for complex queries and analytics
- **Caching**: Cache frequently accessed data in Redis

## Security Measures

- **Field-Level Encryption**: Encrypt sensitive fields (passwords, bank details)
- **Access Control**: Role-based access control for collections
- **Audit Trail**: Log all data modifications
- **Data Masking**: Mask PII in logs and analytics
- **Regular Audits**: Quarterly security audits
