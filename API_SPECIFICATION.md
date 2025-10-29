# API Specification - Bihar Service Marketplace

## Base URL

- **Development**: `http://localhost:3000/api/v1`
- **Staging**: `https://staging-api.biharservices.com/api/v1`
- **Production**: `https://api.biharservices.com/api/v1`

## Authentication

All authenticated endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

## Common Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message"
  }
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

## HTTP Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `422 Unprocessable Entity` - Validation errors
- `500 Internal Server Error` - Server error

---

## Authentication Endpoints

### Register User

**MVP Phase**

```
POST /auth/register
```

**Request Body**:
```json
{
  "phone": "9876543210",
  "name": "Ravi Kumar",
  "password": "SecurePass123",
  "userType": "provider",
  "language": "hindi"
}
```

**Response** (201):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "64a1b2c3d4e5f6789",
      "phone": "9876543210",
      "name": "Ravi Kumar",
      "userType": "provider",
      "phoneVerified": false
    },
    "message": "OTP sent to your phone number"
  }
}
```

---

### Verify Phone OTP

**MVP Phase**

```
POST /auth/verify-otp
```

**Request Body**:
```json
{
  "phone": "9876543210",
  "otp": "123456"
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "64a1b2c3d4e5f6789",
      "phone": "9876543210",
      "name": "Ravi Kumar",
      "userType": "provider",
      "phoneVerified": true
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
      "expiresIn": 900
    }
  }
}
```

---

### Login

**MVP Phase**

```
POST /auth/login
```

**Request Body**:
```json
{
  "phone": "9876543210",
  "password": "SecurePass123"
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "64a1b2c3d4e5f6789",
      "phone": "9876543210",
      "name": "Ravi Kumar",
      "userType": "provider"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
      "expiresIn": 900
    }
  }
}
```

---

### Refresh Token

**MVP Phase**

```
POST /auth/refresh-token
```

**Request Body**:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 900
  }
}
```

---

### Logout

**MVP Phase**

```
POST /auth/logout
```

**Headers**: `Authorization: Bearer <token>`

**Response** (200):
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Provider Endpoints

### Create Provider Profile

**MVP Phase**

```
POST /providers
```

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "bio": "Experienced electrician with 10 years experience",
  "experience": 10,
  "serviceCategories": ["64a1b2c3d4e5f6001"],
  "serviceArea": {
    "city": "Patna",
    "districts": ["Patna", "Nalanda"],
    "radius": 50,
    "coordinates": {
      "lat": 25.5941,
      "lng": 85.1376
    }
  },
  "availability": {
    "monday": { "available": true, "from": "09:00", "to": "18:00" },
    "tuesday": { "available": true, "from": "09:00", "to": "18:00" },
    "wednesday": { "available": true, "from": "09:00", "to": "18:00" },
    "thursday": { "available": true, "from": "09:00", "to": "18:00" },
    "friday": { "available": true, "from": "09:00", "to": "18:00" },
    "saturday": { "available": true, "from": "09:00", "to": "14:00" },
    "sunday": { "available": false, "from": null, "to": null }
  }
}
```

**Response** (201):
```json
{
  "success": true,
  "data": {
    "provider": {
      "id": "64a1b2c3d4e5f6789",
      "userId": "64a1b2c3d4e5f6788",
      "bio": "Experienced electrician with 10 years experience",
      "experience": 10,
      "verificationStatus": "pending",
      "rating": 0,
      "totalReviews": 0,
      "subscriptionTier": "free",
      "isActive": true
    }
  }
}
```

---

### Get Provider Profile

**MVP Phase**

```
GET /providers/:id
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "provider": {
      "id": "64a1b2c3d4e5f6789",
      "user": {
        "name": "Ravi Kumar",
        "phone": "9876543210",
        "profileImage": "https://..."
      },
      "bio": "Experienced electrician with 10 years experience",
      "experience": 10,
      "serviceCategories": [
        {
          "id": "64a1b2c3d4e5f6001",
          "name": "Electrician Services"
        }
      ],
      "serviceArea": {
        "city": "Patna",
        "districts": ["Patna", "Nalanda"],
        "radius": 50
      },
      "verificationStatus": "verified",
      "rating": 4.5,
      "totalReviews": 25,
      "totalBookings": 50,
      "completedBookings": 48,
      "subscriptionTier": "free"
    }
  }
}
```

---

### Update Provider Profile

**MVP Phase**

```
PUT /providers/:id
```

**Headers**: `Authorization: Bearer <token>`

**Request Body** (partial update):
```json
{
  "bio": "Updated bio text",
  "experience": 12,
  "serviceArea": {
    "radius": 60
  }
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "provider": { /* updated provider object */ }
  }
}
```

---

### Upload Provider Documents

**MVP Phase**

```
POST /providers/:id/documents
```

**Headers**: `Authorization: Bearer <token>`, `Content-Type: multipart/form-data`

**Request Body** (form-data):
```
idProofType: "aadhaar"
idProofNumber: "1234-5678-9012"
idProofFile: <file>
certificateFiles: <file[]>
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "documents": {
      "idProof": {
        "type": "aadhaar",
        "url": "https://...",
        "number": "1234-5678-9012",
        "verified": false
      },
      "certificates": [
        {
          "name": "ITI Certificate",
          "url": "https://...",
          "verified": false
        }
      ]
    }
  }
}
```

---

### List Providers

**MVP Phase**

```
GET /providers?page=1&limit=20&category=64a1b2c3d4e5f6001&city=Patna&verified=true&sortBy=rating
```

**Query Parameters**:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)
- `category` (optional): Filter by category ID
- `city` (optional): Filter by city
- `verified` (optional): Filter verified providers only
- `sortBy` (optional): Sort field (rating, experience, totalBookings)
- `order` (optional): Sort order (asc, desc)

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "64a1b2c3d4e5f6789",
      "user": {
        "name": "Ravi Kumar",
        "profileImage": "https://..."
      },
      "bio": "Experienced electrician...",
      "serviceArea": { "city": "Patna" },
      "rating": 4.5,
      "totalReviews": 25,
      "subscriptionTier": "premium",
      "verificationStatus": "verified"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

---

## Service Endpoints

### Create Service Listing

**MVP Phase**

```
POST /services
```

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "title": "Fan Repair and Maintenance",
  "titleHindi": "पंखा मरम्मत और रखरखाव",
  "description": "Complete fan repair including motor replacement, capacitor change, bearing lubrication",
  "categoryId": "64a1b2c3d4e5f6001",
  "basePrice": 200,
  "priceUnit": "per_service",
  "priceNegotiable": true,
  "estimatedDuration": 60,
  "materialsIncluded": false,
  "serviceIncludes": [
    "Motor inspection",
    "Capacitor replacement",
    "Bearing lubrication",
    "Performance testing"
  ]
}
```

**Response** (201):
```json
{
  "success": true,
  "data": {
    "service": {
      "id": "64a1b2c3d4e5f6790",
      "providerId": "64a1b2c3d4e5f6789",
      "title": "Fan Repair and Maintenance",
      "categoryId": "64a1b2c3d4e5f6001",
      "basePrice": 200,
      "priceUnit": "per_service",
      "isActive": true,
      "createdAt": "2024-10-29T07:59:12.000Z"
    }
  }
}
```

---

### Get Service Details

**MVP Phase**

```
GET /services/:id
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "service": {
      "id": "64a1b2c3d4e5f6790",
      "provider": {
        "id": "64a1b2c3d4e5f6789",
        "name": "Ravi Kumar",
        "rating": 4.5,
        "totalReviews": 25,
        "profileImage": "https://..."
      },
      "title": "Fan Repair and Maintenance",
      "description": "Complete fan repair...",
      "category": {
        "id": "64a1b2c3d4e5f6001",
        "name": "Electrician Services"
      },
      "basePrice": 200,
      "priceUnit": "per_service",
      "estimatedDuration": 60,
      "images": ["https://..."],
      "serviceIncludes": ["Motor inspection", "..."],
      "views": 125,
      "bookings": 15
    }
  }
}
```

---

### Update Service Listing

**MVP Phase**

```
PUT /services/:id
```

**Headers**: `Authorization: Bearer <token>`

**Request Body** (partial update):
```json
{
  "basePrice": 250,
  "description": "Updated description"
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "service": { /* updated service object */ }
  }
}
```

---

### Delete Service Listing

**MVP Phase**

```
DELETE /services/:id
```

**Headers**: `Authorization: Bearer <token>`

**Response** (200):
```json
{
  "success": true,
  "message": "Service deleted successfully"
}
```

---

### List Services

**MVP Phase**

```
GET /services?page=1&limit=20&category=64a1b2c3d4e5f6001&city=Patna&minPrice=100&maxPrice=500
```

**Query Parameters**:
- `page` (optional): Page number
- `limit` (optional): Items per page
- `category` (optional): Filter by category
- `provider` (optional): Filter by provider ID
- `city` (optional): Filter by city
- `minPrice` (optional): Minimum price filter
- `maxPrice` (optional): Maximum price filter
- `sortBy` (optional): Sort field (price, rating, createdAt)

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "64a1b2c3d4e5f6790",
      "provider": {
        "name": "Ravi Kumar",
        "rating": 4.5
      },
      "title": "Fan Repair and Maintenance",
      "basePrice": 200,
      "priceUnit": "per_service",
      "category": { "name": "Electrician Services" },
      "images": ["https://..."]
    }
  ],
  "pagination": { /* ... */ }
}
```

---

### Upload Service Images

**MVP Phase**

```
POST /services/:id/images
```

**Headers**: `Authorization: Bearer <token>`, `Content-Type: multipart/form-data`

**Request Body** (form-data):
```
images: <file[]>
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "images": [
      {
        "url": "https://...",
        "order": 0
      }
    ]
  }
}
```

---

## Category Endpoints

### List Categories

**MVP Phase**

```
GET /categories?phase=mvp&level=0
```

**Query Parameters**:
- `phase` (optional): Filter by phase (mvp, full_launch)
- `level` (optional): Filter by hierarchy level
- `parent` (optional): Filter by parent category ID
- `active` (optional): Filter active categories only

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "64a1b2c3d4e5f6001",
      "name": "Electrician Services",
      "nameHindi": "बिजली मिस्त्री सेवाएं",
      "slug": "electrician-services",
      "icon": "https://...",
      "level": 0,
      "phase": "mvp",
      "serviceCount": 45,
      "subcategories": [
        {
          "id": "64a1b2c3d4e5f6002",
          "name": "Fan Repair & Cleaning",
          "nameHindi": "पंखा मरम्मत और सफाई",
          "serviceCount": 15
        }
      ]
    }
  ]
}
```

---

### Get Category Details

**MVP Phase**

```
GET /categories/:id
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "category": {
      "id": "64a1b2c3d4e5f6001",
      "name": "Electrician Services",
      "nameHindi": "बिजली मिस्त्री सेवाएं",
      "description": "All electrical services...",
      "icon": "https://...",
      "parentCategory": null,
      "level": 0,
      "phase": "mvp",
      "serviceCount": 45
    }
  }
}
```

---

## Booking Endpoints

### Create Booking

**MVP Phase**

```
POST /bookings
```

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "serviceId": "64a1b2c3d4e5f6790",
  "providerId": "64a1b2c3d4e5f6789",
  "bookingDate": "2024-11-05",
  "bookingTime": "10:00",
  "serviceLocation": {
    "address": "123 Main Street, Raja Bazar",
    "city": "Patna",
    "district": "Patna",
    "pincode": "800001",
    "coordinates": {
      "lat": 25.5941,
      "lng": 85.1376
    },
    "landmark": "Near SBI Bank",
    "contactPhone": "9876543210"
  },
  "description": "Ceiling fan making noise and running slow",
  "quotedPrice": 200
}
```

**Response** (201):
```json
{
  "success": true,
  "data": {
    "booking": {
      "id": "64a1b2c3d4e5f6791",
      "bookingNumber": "BH-2024-001234",
      "customerId": "64a1b2c3d4e5f6788",
      "providerId": "64a1b2c3d4e5f6789",
      "serviceId": "64a1b2c3d4e5f6790",
      "bookingDate": "2024-11-05",
      "bookingTime": "10:00",
      "status": "pending",
      "quotedPrice": 200,
      "paymentMethod": "cash",
      "paymentStatus": "pending",
      "createdAt": "2024-10-29T08:00:00.000Z"
    }
  }
}
```

---

### Get Booking Details

**MVP Phase**

```
GET /bookings/:id
```

**Headers**: `Authorization: Bearer <token>`

**Response** (200):
```json
{
  "success": true,
  "data": {
    "booking": {
      "id": "64a1b2c3d4e5f6791",
      "bookingNumber": "BH-2024-001234",
      "customer": {
        "id": "64a1b2c3d4e5f6788",
        "name": "Amit Singh",
        "phone": "9876543210"
      },
      "provider": {
        "id": "64a1b2c3d4e5f6789",
        "name": "Ravi Kumar",
        "phone": "9876543211",
        "rating": 4.5
      },
      "service": {
        "id": "64a1b2c3d4e5f6790",
        "title": "Fan Repair and Maintenance"
      },
      "bookingDate": "2024-11-05",
      "bookingTime": "10:00",
      "serviceLocation": {
        "address": "123 Main Street, Raja Bazar",
        "city": "Patna",
        "landmark": "Near SBI Bank"
      },
      "status": "pending",
      "quotedPrice": 200,
      "paymentMethod": "cash",
      "paymentStatus": "pending",
      "statusHistory": [
        {
          "status": "pending",
          "timestamp": "2024-10-29T08:00:00.000Z"
        }
      ]
    }
  }
}
```

---

### Update Booking Status

**MVP Phase**

```
PUT /bookings/:id/status
```

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "status": "accepted",
  "notes": "Will reach by 10:00 AM"
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "booking": {
      "id": "64a1b2c3d4e5f6791",
      "status": "accepted",
      "statusHistory": [
        {
          "status": "pending",
          "timestamp": "2024-10-29T08:00:00.000Z"
        },
        {
          "status": "accepted",
          "timestamp": "2024-10-29T08:15:00.000Z",
          "notes": "Will reach by 10:00 AM"
        }
      ]
    }
  }
}
```

---

### Update Negotiated Price

**MVP Phase**

```
PUT /bookings/:id/price
```

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "negotiatedPrice": 250,
  "notes": "Additional motor replacement needed"
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "booking": {
      "id": "64a1b2c3d4e5f6791",
      "quotedPrice": 200,
      "negotiatedPrice": 250,
      "finalPrice": 250
    }
  }
}
```

---

### List Bookings

**MVP Phase**

```
GET /bookings?page=1&limit=20&status=pending&role=provider
```

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:
- `page` (optional): Page number
- `limit` (optional): Items per page
- `status` (optional): Filter by status
- `role` (optional): View as provider or customer
- `fromDate` (optional): Filter from date
- `toDate` (optional): Filter to date

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "64a1b2c3d4e5f6791",
      "bookingNumber": "BH-2024-001234",
      "customer": { "name": "Amit Singh" },
      "provider": { "name": "Ravi Kumar" },
      "service": { "title": "Fan Repair" },
      "bookingDate": "2024-11-05",
      "status": "pending",
      "finalPrice": 200
    }
  ],
  "pagination": { /* ... */ }
}
```

---

### Complete Booking

**MVP Phase**

```
POST /bookings/:id/complete
```

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "completionNotes": "Service completed successfully. Fan is working properly now.",
  "finalPrice": 250
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "booking": {
      "id": "64a1b2c3d4e5f6791",
      "status": "completed",
      "completedAt": "2024-11-05T11:30:00.000Z",
      "finalPrice": 250,
      "paymentStatus": "paid"
    }
  }
}
```

---

### Cancel Booking

**MVP Phase**

```
POST /bookings/:id/cancel
```

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "cancellationReason": "Customer not available"
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "booking": {
      "id": "64a1b2c3d4e5f6791",
      "status": "cancelled",
      "cancelledAt": "2024-10-29T09:00:00.000Z",
      "cancellationReason": "Customer not available"
    }
  }
}
```

---

## Search Endpoints

### Search Services

**MVP Phase**

```
GET /search/services?q=fan+repair&category=electrician&city=Patna&minPrice=100&maxPrice=500
```

**Query Parameters**:
- `q` (required): Search query
- `category` (optional): Category filter (slug or ID)
- `city` (optional): City filter
- `minPrice` (optional): Minimum price
- `maxPrice` (optional): Maximum price
- `page` (optional): Page number
- `limit` (optional): Items per page

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "64a1b2c3d4e5f6790",
      "title": "Fan Repair and Maintenance",
      "provider": {
        "name": "Ravi Kumar",
        "rating": 4.5,
        "city": "Patna"
      },
      "basePrice": 200,
      "category": { "name": "Electrician Services" },
      "images": ["https://..."]
    }
  ],
  "pagination": { /* ... */ }
}
```

---

### Search Providers

**MVP Phase**

```
GET /search/providers?q=electrician&city=Patna&verified=true
```

**Query Parameters**:
- `q` (optional): Search query
- `category` (optional): Category filter
- `city` (optional): City filter
- `verified` (optional): Filter verified providers
- `page` (optional): Page number
- `limit` (optional): Items per page

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "64a1b2c3d4e5f6789",
      "user": {
        "name": "Ravi Kumar",
        "profileImage": "https://..."
      },
      "bio": "Experienced electrician...",
      "rating": 4.5,
      "totalReviews": 25,
      "serviceArea": { "city": "Patna" },
      "verificationStatus": "verified"
    }
  ],
  "pagination": { /* ... */ }
}
```

---

## Review Endpoints (Full Launch Phase)

### Create Review

**Full Launch Phase**

```
POST /reviews
```

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "bookingId": "64a1b2c3d4e5f6791",
  "overallRating": 5,
  "ratings": {
    "quality": 5,
    "punctuality": 5,
    "professionalism": 5,
    "valueForMoney": 4
  },
  "title": "Excellent service!",
  "comment": "Very professional and completed the work on time. Highly recommended!"
}
```

**Response** (201):
```json
{
  "success": true,
  "data": {
    "review": {
      "id": "64a1b2c3d4e5f6792",
      "bookingId": "64a1b2c3d4e5f6791",
      "overallRating": 5,
      "comment": "Very professional...",
      "createdAt": "2024-11-06T10:00:00.000Z"
    }
  }
}
```

---

### Get Provider Reviews

**Full Launch Phase**

```
GET /reviews/provider/:providerId?page=1&limit=10
```

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "64a1b2c3d4e5f6792",
      "customer": {
        "name": "Amit Singh",
        "profileImage": "https://..."
      },
      "service": {
        "title": "Fan Repair and Maintenance"
      },
      "overallRating": 5,
      "comment": "Very professional...",
      "createdAt": "2024-11-06T10:00:00.000Z"
    }
  ],
  "pagination": { /* ... */ },
  "summary": {
    "averageRating": 4.5,
    "totalReviews": 25,
    "ratingDistribution": {
      "5": 15,
      "4": 8,
      "3": 2,
      "2": 0,
      "1": 0
    }
  }
}
```

---

## Payment Endpoints (Full Launch Phase)

### Initiate Payment

**Full Launch Phase**

```
POST /payments/initiate
```

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "bookingId": "64a1b2c3d4e5f6791",
  "paymentMethod": "upi",
  "amount": 250
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "transaction": {
      "id": "64a1b2c3d4e5f6793",
      "transactionId": "TXN123456789",
      "amount": 250,
      "commission": 30,
      "providerAmount": 220,
      "status": "pending",
      "paymentGateway": "razorpay",
      "gatewayOrderId": "order_123456"
    }
  }
}
```

---

### Verify Payment

**Full Launch Phase**

```
POST /payments/verify
```

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "transactionId": "TXN123456789",
  "gatewayPaymentId": "pay_123456",
  "gatewaySignature": "abc123..."
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "transaction": {
      "id": "64a1b2c3d4e5f6793",
      "status": "completed",
      "completedAt": "2024-11-05T12:00:00.000Z"
    },
    "booking": {
      "id": "64a1b2c3d4e5f6791",
      "paymentStatus": "paid"
    }
  }
}
```

---

## Messaging Endpoints (Full Launch Phase)

### Send Message

**Full Launch Phase**

```
POST /messages
```

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "receiverId": "64a1b2c3d4e5f6789",
  "bookingId": "64a1b2c3d4e5f6791",
  "messageType": "text",
  "content": "What time will you arrive?"
}
```

**Response** (201):
```json
{
  "success": true,
  "data": {
    "message": {
      "id": "64a1b2c3d4e5f6794",
      "conversationId": "64a1b2c3d4e5f6788_64a1b2c3d4e5f6789",
      "senderId": "64a1b2c3d4e5f6788",
      "receiverId": "64a1b2c3d4e5f6789",
      "content": "What time will you arrive?",
      "createdAt": "2024-11-05T09:00:00.000Z"
    }
  }
}
```

---

### Get Conversation Messages

**Full Launch Phase**

```
GET /messages/conversation/:conversationId?page=1&limit=50
```

**Headers**: `Authorization: Bearer <token>`

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "64a1b2c3d4e5f6794",
      "senderId": "64a1b2c3d4e5f6788",
      "receiverId": "64a1b2c3d4e5f6789",
      "content": "What time will you arrive?",
      "isRead": true,
      "createdAt": "2024-11-05T09:00:00.000Z"
    }
  ],
  "pagination": { /* ... */ }
}
```

---

## Subscription Endpoints (Full Launch Phase)

### Get Subscription Plans

**Full Launch Phase**

```
GET /subscriptions/plans
```

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "premium_monthly",
      "name": "Premium Monthly",
      "price": 299,
      "duration": 30,
      "features": [
        "Featured listings",
        "Advanced analytics",
        "Priority support",
        "Ad-free experience"
      ]
    },
    {
      "id": "premium_yearly",
      "name": "Premium Yearly",
      "price": 2999,
      "duration": 365,
      "discount": 17,
      "features": [
        "Featured listings",
        "Advanced analytics",
        "Priority support",
        "Ad-free experience",
        "Verified badge"
      ]
    }
  ]
}
```

---

### Subscribe to Plan

**Full Launch Phase**

```
POST /subscriptions
```

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "planId": "premium_monthly",
  "paymentMethod": "upi",
  "autoRenew": true
}
```

**Response** (201):
```json
{
  "success": true,
  "data": {
    "subscription": {
      "id": "64a1b2c3d4e5f6795",
      "tier": "premium",
      "planName": "Premium Monthly",
      "startDate": "2024-10-29",
      "endDate": "2024-11-28",
      "amount": 299,
      "status": "active",
      "paymentGatewayOrderId": "order_123456"
    }
  }
}
```

---

## Admin Endpoints

### Verify Provider (Admin)

**MVP Phase**

```
PUT /admin/providers/:id/verify
```

**Headers**: `Authorization: Bearer <admin_token>`

**Request Body**:
```json
{
  "verificationStatus": "verified",
  "notes": "All documents verified successfully"
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "provider": {
      "id": "64a1b2c3d4e5f6789",
      "verificationStatus": "verified",
      "verifiedAt": "2024-10-29T10:00:00.000Z"
    }
  }
}
```

---

### Platform Statistics (Admin)

**MVP Phase**

```
GET /admin/stats
```

**Headers**: `Authorization: Bearer <admin_token>`

**Response** (200):
```json
{
  "success": true,
  "data": {
    "users": {
      "total": 1500,
      "providers": 500,
      "customers": 1000,
      "newThisMonth": 150
    },
    "bookings": {
      "total": 3000,
      "completed": 2700,
      "pending": 150,
      "thisMonth": 300
    },
    "revenue": {
      "totalCommission": 180000,
      "subscriptionRevenue": 45000,
      "advertisingRevenue": 25000,
      "thisMonth": 35000
    },
    "services": {
      "total": 2000,
      "active": 1800,
      "byCategory": {
        "electrician": 800,
        "plumber": 600,
        "carpenter": 400,
        "other": 200
      }
    }
  }
}
```

---

## WebSocket Events (Full Launch Phase)

### Socket.IO Connection

```javascript
const socket = io('wss://api.biharservices.com', {
  auth: {
    token: 'Bearer <jwt_token>'
  }
});
```

### Events

#### Client → Server

```javascript
// Join conversation
socket.emit('conversation:join', {
  conversationId: '64a1b2c3d4e5f6788_64a1b2c3d4e5f6789'
});

// Send message
socket.emit('message:send', {
  receiverId: '64a1b2c3d4e5f6789',
  content: 'Hello',
  messageType: 'text'
});

// Typing indicator
socket.emit('typing:start', {
  conversationId: '64a1b2c3d4e5f6788_64a1b2c3d4e5f6789'
});

socket.emit('typing:stop', {
  conversationId: '64a1b2c3d4e5f6788_64a1b2c3d4e5f6789'
});

// Mark as read
socket.emit('message:read', {
  messageId: '64a1b2c3d4e5f6794'
});
```

#### Server → Client

```javascript
// New message received
socket.on('message:new', (data) => {
  // data: { message, sender }
});

// Message delivered
socket.on('message:delivered', (data) => {
  // data: { messageId, deliveredAt }
});

// Message read
socket.on('message:read', (data) => {
  // data: { messageId, readAt }
});

// User online/offline
socket.on('user:status', (data) => {
  // data: { userId, status: 'online' | 'offline' }
});

// Typing indicator
socket.on('user:typing', (data) => {
  // data: { userId, conversationId }
});

// Booking update
socket.on('booking:update', (data) => {
  // data: { bookingId, status, updatedBy }
});
```

---

## Error Codes

| Code | Description |
|------|-------------|
| AUTH_001 | Invalid credentials |
| AUTH_002 | Token expired |
| AUTH_003 | Invalid token |
| AUTH_004 | Unauthorized access |
| USER_001 | User not found |
| USER_002 | Phone number already registered |
| USER_003 | Invalid OTP |
| PROVIDER_001 | Provider not found |
| PROVIDER_002 | Provider not verified |
| SERVICE_001 | Service not found |
| SERVICE_002 | Service not available |
| BOOKING_001 | Booking not found |
| BOOKING_002 | Booking already accepted |
| BOOKING_003 | Booking cannot be cancelled |
| PAYMENT_001 | Payment failed |
| PAYMENT_002 | Invalid payment details |
| VALIDATION_001 | Invalid input data |
| SERVER_001 | Internal server error |

---

## Rate Limiting

- **Anonymous requests**: 20 requests/minute
- **Authenticated requests**: 100 requests/minute
- **Search endpoints**: 30 requests/minute
- **Upload endpoints**: 10 requests/minute

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1698574800
```

---

## API Versioning

The API uses URL-based versioning:
- Current version: `v1`
- All endpoints are prefixed with `/api/v1`
- Breaking changes will result in new version (v2, v3, etc.)
- Old versions supported for minimum 6 months after deprecation

---

## Data Formats

### Date/Time
- Format: ISO 8601
- Example: `2024-10-29T07:59:12.000Z`

### Currency
- All amounts in INR (Indian Rupees)
- Represented as integers (paise)
- Example: ₹250 = 25000 paise

### Phone Numbers
- Format: 10-digit without country code
- Example: `9876543210`

### Coordinates
- Latitude: -90 to 90
- Longitude: -180 to 180
- Format: Decimal degrees
