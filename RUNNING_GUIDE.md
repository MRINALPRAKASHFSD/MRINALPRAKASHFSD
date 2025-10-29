# Bihar Service Marketplace - Running Application

## 🚀 Quick Start Guide

This repository now includes a **working MVP implementation** of the Bihar Service Marketplace platform!

### Prerequisites

- Node.js (v16 or higher)
- npm (comes with Node.js)

### Installation & Running

#### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

#### 2. Start the Backend Server

```bash
npm start
```

The API server will start on `http://localhost:3000`

You should see:
```
╔══════════════════════════════════════════════════════════════════════╗
║       BIHAR SERVICE MARKETPLACE API - MVP PHASE                      ║
╚══════════════════════════════════════════════════════════════════════╝

🚀 Server running on http://localhost:3000
📚 API Documentation: http://localhost:3000/
💚 Health Check: http://localhost:3000/health
```

#### 3. Open the Frontend

In a new terminal or simply open the file in your browser:

```bash
# On Linux/Mac
open frontend/index.html

# On Windows
start frontend/index.html

# Or just navigate to the file in your browser
```

The frontend will open in your default browser.

## 📱 Using the Application

### For Service Providers:

1. **Register** as a Service Provider
   - User Type: Service Provider
   - Fill in name, phone (10 digits), password
   - System auto-verifies with mock OTP

2. **Create Provider Profile** (automatic after registration)

3. **Create Services**
   - Navigate to "Services" tab
   - Fill in service details (title, description, price)
   - Click "Create Service"

4. **View Bookings**
   - Navigate to "My Bookings" tab
   - Accept/reject customer bookings

### For Customers:

1. **Register** as a Customer
   - User Type: Customer
   - Fill in name, phone (10 digits), password
   - System auto-verifies with mock OTP

2. **Browse Services**
   - Navigate to "Services" tab
   - Search or browse available services
   - View provider details and pricing

3. **Book Services**
   - Click "Book Now" on any service
   - Provide booking details
   - Track booking status

## 🎯 Features Implemented

### Backend API (Node.js + Express)

✅ **Authentication**
- User registration (provider & customer)
- OTP verification (mock implementation)
- JWT-based login
- Token refresh

✅ **Provider Management**
- Create provider profile
- Update provider details
- List all providers
- Provider verification workflow

✅ **Service Management**
- Create service listings
- List all services
- Search services
- Filter by category, price, location

✅ **Booking System**
- Create bookings
- List user bookings
- Update booking status
- View booking details

✅ **Categories**
- MVP phase: Electrician services only
- 4 subcategories (Fan repair, Wiring, Troubleshooting, Light fixtures)

### Frontend (HTML + CSS + JavaScript)

✅ **User Interface**
- Modern, responsive design
- Mobile-friendly layout
- Gradient styling

✅ **Features**
- User registration form
- Login system
- Service browsing
- Service creation (for providers)
- Booking management
- Real-time statistics
- Search functionality

## 🔧 API Endpoints

The backend provides the following REST APIs:

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/verify-otp` - Verify phone OTP
- `POST /api/v1/auth/login` - User login

### Categories
- `GET /api/v1/categories` - List service categories

### Providers
- `POST /api/v1/providers` - Create provider profile
- `GET /api/v1/providers` - List all providers
- `GET /api/v1/providers/:id` - Get provider details

### Services
- `POST /api/v1/services` - Create service listing
- `GET /api/v1/services` - List all services
- `GET /api/v1/services/:id` - Get service details

### Bookings
- `POST /api/v1/bookings` - Create booking
- `GET /api/v1/bookings` - List user bookings
- `GET /api/v1/bookings/:id` - Get booking details
- `PUT /api/v1/bookings/:id/status` - Update booking status

### Search
- `GET /api/v1/search/services` - Search services

### Health
- `GET /health` - API health check with statistics

## 📊 Data Storage

The MVP uses **in-memory storage** (JavaScript objects) for simplicity. This means:

- Data is stored in RAM while the server is running
- Data is lost when the server restarts
- Perfect for demo and testing
- Replace with MongoDB for production (schemas provided in `DATABASE_SCHEMA.md`)

## 🎨 Screenshots

### Home Page
The home page displays platform statistics and quick start guide.

### Services Page
Browse all available electrician services with provider details and pricing.

### Registration
Simple registration form with user type selection (Provider/Customer).

### Bookings
Track all your service bookings with status updates.

## 🔄 Development Mode

For development with auto-reload:

```bash
cd backend
npm install -g nodemon  # if not already installed
npm run dev
```

This will automatically restart the server when you make changes.

## 🛠 Technology Stack

**Backend:**
- Node.js
- Express.js
- JWT for authentication
- bcryptjs for password hashing
- CORS enabled

**Frontend:**
- Pure HTML5
- CSS3 (with gradients and animations)
- Vanilla JavaScript (no frameworks)
- Fetch API for HTTP requests

## 📝 Notes

### Mock Features (Demo Only)

1. **OTP Verification**: Accepts any 6-digit OTP (no actual SMS)
2. **Phone Verification**: Automatically marks as verified
3. **In-Memory Database**: Data resets on server restart
4. **No MongoDB Required**: Perfect for quick testing

### Production Requirements

For production deployment:
1. Replace in-memory storage with MongoDB
2. Implement real SMS OTP service (Twilio, etc.)
3. Add Redis for caching and sessions
4. Set up proper authentication flow
5. Add rate limiting and security measures
6. Follow deployment guide in `DEPLOYMENT_GUIDE.md`

## 🐛 Troubleshooting

**Backend won't start?**
- Make sure Node.js is installed: `node --version`
- Check if port 3000 is available
- Run `npm install` in backend directory

**Frontend can't connect?**
- Ensure backend is running on port 3000
- Check browser console for errors
- Try opening in a different browser

**CORS errors?**
- CORS is enabled by default in the backend
- Make sure you're accessing frontend via file:// or http://

## 📚 Documentation

All detailed documentation is available in the markdown files:
- `PROJECT_OVERVIEW.md` - Business model and features
- `ARCHITECTURE.md` - System architecture
- `DATABASE_SCHEMA.md` - Database design
- `API_SPECIFICATION.md` - Complete API documentation
- `PHASED_ROLLOUT.md` - Implementation timeline
- `USER_FLOWS.md` - User journeys
- `MONETIZATION_STRATEGY.md` - Revenue model
- `DEPLOYMENT_GUIDE.md` - Production deployment

## 🎉 Success!

You now have a **working service marketplace application**! 

The platform includes:
- ✅ Working backend API
- ✅ Functional web interface  
- ✅ User authentication
- ✅ Service management
- ✅ Booking system
- ✅ Search functionality

## 🚀 Next Steps

1. **Test the Application**: Create providers, add services, make bookings
2. **Customize**: Modify the frontend styling or add features
3. **Scale Up**: Follow the documentation to add full-launch features
4. **Deploy**: Use `DEPLOYMENT_GUIDE.md` for production deployment

---

Built with ❤️ for Bihar's service economy

**Developer**: MRINAL PRAKASH
