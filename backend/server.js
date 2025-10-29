const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory database (for MVP demo - replace with MongoDB in production)
const database = {
  users: [],
  providers: [],
  services: [],
  bookings: [],
  categories: [
    {
      id: 'cat-1',
      name: 'Electrician Services',
      nameHindi: 'बिजली मिस्त्री सेवाएं',
      slug: 'electrician-services',
      phase: 'mvp',
      subcategories: [
        { id: 'sub-1', name: 'Fan Repair & Cleaning', nameHindi: 'पंखा मरम्मत और सफाई' },
        { id: 'sub-2', name: 'Electrical Wiring & Installation', nameHindi: 'विद्युत वायरिंग और स्थापना' },
        { id: 'sub-3', name: 'Troubleshooting & Maintenance', nameHindi: 'समस्या निवारण और रखरखाव' },
        { id: 'sub-4', name: 'Light Fixture Installation', nameHindi: 'लाइट फिक्सचर स्थापना' }
      ]
    }
  ]
};

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, error: { code: 'AUTH_003', message: 'No token provided' } });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, error: { code: 'AUTH_002', message: 'Token expired or invalid' } });
    }
    req.user = user;
    next();
  });
};

// ============================================================================
// AUTHENTICATION ENDPOINTS
// ============================================================================

// Register user
app.post('/api/v1/auth/register', async (req, res) => {
  try {
    const { phone, name, password, userType, language = 'hindi' } = req.body;

    // Validate required fields
    if (!phone || !name || !password || !userType) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_001', message: 'Missing required fields' }
      });
    }

    // Check if user already exists
    const existingUser = database.users.find(u => u.phone === phone);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: { code: 'USER_002', message: 'Phone number already registered' }
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = {
      id: uuidv4(),
      phone,
      name,
      password: hashedPassword,
      userType,
      language,
      phoneVerified: false,
      isActive: true,
      createdAt: new Date().toISOString()
    };

    database.users.push(user);

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user.id,
          phone: user.phone,
          name: user.name,
          userType: user.userType,
          phoneVerified: user.phoneVerified
        },
        message: 'Registration successful. OTP sent to your phone (Demo: Use any 6 digits)'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_001', message: 'Internal server error' }
    });
  }
});

// Verify OTP (Mock implementation)
app.post('/api/v1/auth/verify-otp', (req, res) => {
  try {
    const { phone, otp } = req.body;

    const user = database.users.find(u => u.phone === phone);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'USER_001', message: 'User not found' }
      });
    }

    // Mock OTP verification (accept any 6-digit OTP in demo)
    if (!otp || otp.length !== 6) {
      return res.status(400).json({
        success: false,
        error: { code: 'USER_003', message: 'Invalid OTP' }
      });
    }

    user.phoneVerified = true;

    // Generate tokens
    const accessToken = jwt.sign(
      { id: user.id, phone: user.phone, userType: user.userType },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          phone: user.phone,
          name: user.name,
          userType: user.userType,
          phoneVerified: user.phoneVerified
        },
        tokens: {
          accessToken,
          refreshToken,
          expiresIn: 900
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_001', message: 'Internal server error' }
    });
  }
});

// Login
app.post('/api/v1/auth/login', async (req, res) => {
  try {
    const { phone, password } = req.body;

    const user = database.users.find(u => u.phone === phone);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: { code: 'AUTH_001', message: 'Invalid credentials' }
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: { code: 'AUTH_001', message: 'Invalid credentials' }
      });
    }

    // Generate tokens
    const accessToken = jwt.sign(
      { id: user.id, phone: user.phone, userType: user.userType },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          phone: user.phone,
          name: user.name,
          userType: user.userType
        },
        tokens: {
          accessToken,
          refreshToken,
          expiresIn: 900
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_001', message: 'Internal server error' }
    });
  }
});

// ============================================================================
// CATEGORY ENDPOINTS
// ============================================================================

// List categories
app.get('/api/v1/categories', (req, res) => {
  const { phase = 'mvp' } = req.query;
  
  const filteredCategories = database.categories.filter(cat => cat.phase === phase);
  
  res.json({
    success: true,
    data: filteredCategories
  });
});

// ============================================================================
// PROVIDER ENDPOINTS
// ============================================================================

// Create provider profile
app.post('/api/v1/providers', authenticateToken, (req, res) => {
  try {
    if (req.user.userType !== 'provider') {
      return res.status(403).json({
        success: false,
        error: { code: 'AUTH_004', message: 'Unauthorized access' }
      });
    }

    const { bio, experience, serviceCategories, serviceArea, availability } = req.body;

    const provider = {
      id: uuidv4(),
      userId: req.user.id,
      bio,
      experience,
      serviceCategories,
      serviceArea,
      availability,
      verificationStatus: 'pending',
      rating: 0,
      totalReviews: 0,
      subscriptionTier: 'free',
      isActive: true,
      createdAt: new Date().toISOString()
    };

    database.providers.push(provider);

    res.status(201).json({
      success: true,
      data: { provider }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_001', message: 'Internal server error' }
    });
  }
});

// Get provider profile
app.get('/api/v1/providers/:id', (req, res) => {
  const provider = database.providers.find(p => p.id === req.params.id);
  
  if (!provider) {
    return res.status(404).json({
      success: false,
      error: { code: 'PROVIDER_001', message: 'Provider not found' }
    });
  }

  const user = database.users.find(u => u.id === provider.userId);

  res.json({
    success: true,
    data: {
      provider: {
        ...provider,
        user: {
          name: user.name,
          phone: user.phone
        }
      }
    }
  });
});

// List providers
app.get('/api/v1/providers', (req, res) => {
  const { city, verified } = req.query;
  
  let filteredProviders = [...database.providers];
  
  if (city) {
    filteredProviders = filteredProviders.filter(p => 
      p.serviceArea && p.serviceArea.city === city
    );
  }
  
  if (verified === 'true') {
    filteredProviders = filteredProviders.filter(p => p.verificationStatus === 'verified');
  }

  // Attach user info
  const providersWithUsers = filteredProviders.map(provider => {
    const user = database.users.find(u => u.id === provider.userId);
    return {
      id: provider.id,
      user: {
        name: user.name,
        phone: user.phone
      },
      bio: provider.bio,
      experience: provider.experience,
      serviceArea: provider.serviceArea,
      rating: provider.rating,
      totalReviews: provider.totalReviews,
      verificationStatus: provider.verificationStatus,
      subscriptionTier: provider.subscriptionTier
    };
  });

  res.json({
    success: true,
    data: providersWithUsers,
    pagination: {
      page: 1,
      limit: 20,
      total: providersWithUsers.length,
      pages: 1
    }
  });
});

// ============================================================================
// SERVICE ENDPOINTS
// ============================================================================

// Create service listing
app.post('/api/v1/services', authenticateToken, (req, res) => {
  try {
    if (req.user.userType !== 'provider') {
      return res.status(403).json({
        success: false,
        error: { code: 'AUTH_004', message: 'Unauthorized access' }
      });
    }

    const provider = database.providers.find(p => p.userId === req.user.id);
    if (!provider) {
      return res.status(404).json({
        success: false,
        error: { code: 'PROVIDER_001', message: 'Provider profile not found' }
      });
    }

    const {
      title,
      titleHindi,
      description,
      categoryId,
      basePrice,
      priceUnit,
      estimatedDuration
    } = req.body;

    const service = {
      id: uuidv4(),
      providerId: provider.id,
      title,
      titleHindi,
      description,
      categoryId,
      basePrice,
      priceUnit,
      priceNegotiable: true,
      estimatedDuration,
      images: [],
      isActive: true,
      views: 0,
      bookings: 0,
      createdAt: new Date().toISOString()
    };

    database.services.push(service);

    res.status(201).json({
      success: true,
      data: { service }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_001', message: 'Internal server error' }
    });
  }
});

// List services
app.get('/api/v1/services', (req, res) => {
  const { category, city, minPrice, maxPrice } = req.query;
  
  let filteredServices = [...database.services].filter(s => s.isActive);
  
  if (category) {
    filteredServices = filteredServices.filter(s => s.categoryId === category);
  }
  
  if (minPrice) {
    filteredServices = filteredServices.filter(s => s.basePrice >= parseInt(minPrice));
  }
  
  if (maxPrice) {
    filteredServices = filteredServices.filter(s => s.basePrice <= parseInt(maxPrice));
  }

  // Attach provider info
  const servicesWithProviders = filteredServices.map(service => {
    const provider = database.providers.find(p => p.id === service.providerId);
    const user = database.users.find(u => u.id === provider.userId);
    return {
      id: service.id,
      title: service.title,
      description: service.description,
      basePrice: service.basePrice,
      priceUnit: service.priceUnit,
      provider: {
        id: provider.id,
        name: user.name,
        rating: provider.rating,
        city: provider.serviceArea?.city
      }
    };
  });

  res.json({
    success: true,
    data: servicesWithProviders,
    pagination: {
      page: 1,
      limit: 20,
      total: servicesWithProviders.length,
      pages: 1
    }
  });
});

// Get service details
app.get('/api/v1/services/:id', (req, res) => {
  const service = database.services.find(s => s.id === req.params.id);
  
  if (!service) {
    return res.status(404).json({
      success: false,
      error: { code: 'SERVICE_001', message: 'Service not found' }
    });
  }

  const provider = database.providers.find(p => p.id === service.providerId);
  const user = database.users.find(u => u.id === provider.userId);

  res.json({
    success: true,
    data: {
      service: {
        ...service,
        provider: {
          id: provider.id,
          name: user.name,
          phone: user.phone,
          rating: provider.rating,
          totalReviews: provider.totalReviews,
          experience: provider.experience
        }
      }
    }
  });
});

// ============================================================================
// BOOKING ENDPOINTS
// ============================================================================

// Create booking
app.post('/api/v1/bookings', authenticateToken, (req, res) => {
  try {
    if (req.user.userType !== 'customer') {
      return res.status(403).json({
        success: false,
        error: { code: 'AUTH_004', message: 'Unauthorized access' }
      });
    }

    const {
      serviceId,
      providerId,
      bookingDate,
      bookingTime,
      serviceLocation,
      description,
      quotedPrice
    } = req.body;

    const booking = {
      id: uuidv4(),
      bookingNumber: `BH-2024-${String(database.bookings.length + 1).padStart(6, '0')}`,
      customerId: req.user.id,
      providerId,
      serviceId,
      bookingDate,
      bookingTime,
      serviceLocation,
      description,
      quotedPrice,
      finalPrice: quotedPrice,
      status: 'pending',
      paymentMethod: 'cash',
      paymentStatus: 'pending',
      statusHistory: [
        {
          status: 'pending',
          timestamp: new Date().toISOString()
        }
      ],
      createdAt: new Date().toISOString()
    };

    database.bookings.push(booking);

    res.status(201).json({
      success: true,
      data: { booking }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_001', message: 'Internal server error' }
    });
  }
});

// List bookings
app.get('/api/v1/bookings', authenticateToken, (req, res) => {
  const { status, role } = req.query;
  
  let filteredBookings = [...database.bookings];
  
  if (req.user.userType === 'provider') {
    const provider = database.providers.find(p => p.userId === req.user.id);
    filteredBookings = filteredBookings.filter(b => b.providerId === provider.id);
  } else {
    filteredBookings = filteredBookings.filter(b => b.customerId === req.user.id);
  }
  
  if (status) {
    filteredBookings = filteredBookings.filter(b => b.status === status);
  }

  // Attach related info
  const bookingsWithDetails = filteredBookings.map(booking => {
    const service = database.services.find(s => s.id === booking.serviceId);
    const provider = database.providers.find(p => p.id === booking.providerId);
    const providerUser = database.users.find(u => u.id === provider.userId);
    const customerUser = database.users.find(u => u.id === booking.customerId);

    return {
      id: booking.id,
      bookingNumber: booking.bookingNumber,
      customer: { name: customerUser.name },
      provider: { name: providerUser.name },
      service: { title: service.title },
      bookingDate: booking.bookingDate,
      status: booking.status,
      finalPrice: booking.finalPrice
    };
  });

  res.json({
    success: true,
    data: bookingsWithDetails,
    pagination: {
      page: 1,
      limit: 20,
      total: bookingsWithDetails.length,
      pages: 1
    }
  });
});

// Get booking details
app.get('/api/v1/bookings/:id', authenticateToken, (req, res) => {
  const booking = database.bookings.find(b => b.id === req.params.id);
  
  if (!booking) {
    return res.status(404).json({
      success: false,
      error: { code: 'BOOKING_001', message: 'Booking not found' }
    });
  }

  const service = database.services.find(s => s.id === booking.serviceId);
  const provider = database.providers.find(p => p.id === booking.providerId);
  const providerUser = database.users.find(u => u.id === provider.userId);
  const customerUser = database.users.find(u => u.id === booking.customerId);

  res.json({
    success: true,
    data: {
      booking: {
        ...booking,
        customer: {
          id: customerUser.id,
          name: customerUser.name,
          phone: customerUser.phone
        },
        provider: {
          id: provider.id,
          name: providerUser.name,
          phone: providerUser.phone,
          rating: provider.rating
        },
        service: {
          id: service.id,
          title: service.title
        }
      }
    }
  });
});

// Update booking status
app.put('/api/v1/bookings/:id/status', authenticateToken, (req, res) => {
  try {
    const booking = database.bookings.find(b => b.id === req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: { code: 'BOOKING_001', message: 'Booking not found' }
      });
    }

    const { status, notes } = req.body;

    booking.status = status;
    booking.statusHistory.push({
      status,
      timestamp: new Date().toISOString(),
      notes
    });

    res.json({
      success: true,
      data: {
        booking: {
          id: booking.id,
          status: booking.status,
          statusHistory: booking.statusHistory
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_001', message: 'Internal server error' }
    });
  }
});

// ============================================================================
// SEARCH ENDPOINTS
// ============================================================================

// Search services
app.get('/api/v1/search/services', (req, res) => {
  const { q, category, city } = req.query;
  
  let results = [...database.services].filter(s => s.isActive);
  
  if (q) {
    const query = q.toLowerCase();
    results = results.filter(s => 
      s.title.toLowerCase().includes(query) ||
      s.description.toLowerCase().includes(query)
    );
  }
  
  if (category) {
    results = results.filter(s => s.categoryId === category);
  }

  // Attach provider info
  const servicesWithProviders = results.map(service => {
    const provider = database.providers.find(p => p.id === service.providerId);
    const user = database.users.find(u => u.id === provider.userId);
    return {
      id: service.id,
      title: service.title,
      basePrice: service.basePrice,
      provider: {
        name: user.name,
        rating: provider.rating,
        city: provider.serviceArea?.city
      }
    };
  });

  res.json({
    success: true,
    data: servicesWithProviders,
    pagination: {
      page: 1,
      limit: 20,
      total: servicesWithProviders.length,
      pages: 1
    }
  });
});

// ============================================================================
// HEALTH CHECK
// ============================================================================

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      database: 'connected',
      redis: 'not configured (in-memory)',
      storage: 'available'
    },
    version: '1.0.0-mvp',
    stats: {
      users: database.users.length,
      providers: database.providers.length,
      services: database.services.length,
      bookings: database.bookings.length
    }
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Bihar Service Marketplace API - MVP',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/v1/auth/*',
      categories: '/api/v1/categories',
      providers: '/api/v1/providers',
      services: '/api/v1/services',
      bookings: '/api/v1/bookings',
      search: '/api/v1/search/*'
    },
    documentation: 'See API_SPECIFICATION.md for detailed API documentation'
  });
});

// Start server
app.listen(PORT, () => {
  console.log('╔══════════════════════════════════════════════════════════════════════╗');
  console.log('║       BIHAR SERVICE MARKETPLACE API - MVP PHASE                      ║');
  console.log('╚══════════════════════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/`);
  console.log(`💚 Health Check: http://localhost:${PORT}/health`);
  console.log('');
  console.log('Available Endpoints:');
  console.log('  POST   /api/v1/auth/register       - Register new user');
  console.log('  POST   /api/v1/auth/verify-otp     - Verify OTP');
  console.log('  POST   /api/v1/auth/login          - Login');
  console.log('  GET    /api/v1/categories          - List categories');
  console.log('  GET    /api/v1/providers           - List providers');
  console.log('  POST   /api/v1/providers           - Create provider profile');
  console.log('  GET    /api/v1/services            - List services');
  console.log('  POST   /api/v1/services            - Create service');
  console.log('  GET    /api/v1/bookings            - List bookings');
  console.log('  POST   /api/v1/bookings            - Create booking');
  console.log('  GET    /api/v1/search/services     - Search services');
  console.log('');
  console.log('════════════════════════════════════════════════════════════════════════');
});

module.exports = app;
