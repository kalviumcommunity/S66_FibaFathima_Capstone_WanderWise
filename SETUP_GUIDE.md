# 🚀 WanderWise - Complete Setup Guide

This guide will help you set up both the client and server sides of your WanderWise application with full API integration.

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB database
- npm or yarn

## 🗄️ Database Setup

1. **Create a MongoDB database** (MongoDB Atlas or local)
2. **Get your MongoDB connection string**

## ⚙️ Server Setup

### 1. Navigate to Server Directory
```bash
cd Server
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the `Server` directory:
```env
PORT=5000
MONGO_URL=your_mongodb_connection_string_here
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### 4. Create Admin User
```bash
npm run create-admin
```
This creates:
- **Email:** admin@wanderwise.com
- **Password:** admin123

### 5. Seed Sample Destinations
```bash
npm run seed-destinations
```
This adds 8 sample destinations to your database.

### 6. Start the Server
```bash
npm run dev
```
Server will run on `http://localhost:5000`

## 🎨 Client Setup

### 1. Navigate to Client Directory
```bash
cd Client
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the `Client` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Start the Client
```bash
npm run dev
```
Client will run on `http://localhost:5173`

## 🔐 Authentication Flow

### User Registration
- Users can register with email, username, and password
- Passwords are automatically hashed
- JWT token is returned upon successful registration

### User Login
- Users login with email and password
- JWT token is returned and stored in localStorage
- Token is automatically included in API requests

### Admin Access
- Admin users can access admin panel
- Admin users can approve/reject destinations
- Admin users can manage other users

## 🗺️ Destination Management

### Public Destinations
- All approved destinations are publicly visible
- Users can search and filter destinations
- Users can save destinations to their profile (if logged in)

### Destination Submission
- Authenticated users can submit new destinations
- Submissions require admin approval
- Admin users can auto-approve their own submissions

### Admin Features
- Approve/reject destination submissions
- Mark destinations as popular
- Bulk approve/reject operations
- View destination statistics

## 📊 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile

### Destinations
- `GET /api/destinations` - Get all approved destinations
- `GET /api/destinations/:id` - Get specific destination
- `POST /api/destinations` - Submit new destination
- `POST /api/destinations/:id/reviews` - Add review

### Admin Routes
- `GET /api/admin/dashboard` - Admin dashboard stats
- `GET /api/admin/users` - Manage users
- `GET /api/admin/destinations` - Manage destinations
- `PATCH /api/admin/destinations/:id/approve` - Approve destination

## 🎯 Key Features Implemented

### ✅ Server-Side
- JWT authentication with bcrypt password hashing
- Role-based access control (User/Admin)
- Destination approval system
- User management (CRUD operations)
- Review and rating system
- Admin dashboard with analytics
- Bulk operations for destinations
- Comprehensive error handling

### ✅ Client-Side
- Real-time API integration
- Authentication state management
- Destination saving/unsaving
- Search and filtering
- Loading states and error handling
- Toast notifications
- Responsive design

### ✅ Database Models
- **User Model:** username, email, password, role, savedDestinations, etc.
- **Destination Model:** name, description, country, images, reviews, approval status, etc.

## 🔧 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure `CLIENT_URL` is set correctly in server `.env`
   - Check that client is running on the correct port

2. **MongoDB Connection Issues**
   - Verify your MongoDB connection string
   - Ensure MongoDB is running and accessible

3. **JWT Token Issues**
   - Check that `JWT_SECRET` is set in server `.env`
   - Clear localStorage if tokens are corrupted

4. **API Connection Issues**
   - Verify `VITE_API_URL` is set correctly in client `.env`
   - Ensure server is running on port 5000

### Testing the Setup

1. **Test Server Connection**
   ```bash
   curl http://localhost:5000/health
   ```

2. **Test API Endpoints**
   ```bash
   curl http://localhost:5000/api/destinations
   ```

3. **Test Admin Login**
   - Go to `http://localhost:5173/login`
   - Login with admin@wanderwise.com / admin123

## 🚀 Next Steps

1. **Customize Destinations**
   - Add more destinations using the admin panel
   - Upload custom images
   - Add detailed descriptions

2. **Enhance Features**
   - Add trip planning functionality
   - Implement booking system
   - Add user reviews and ratings

3. **Deploy**
   - Deploy server to platforms like Heroku, Railway, or DigitalOcean
   - Deploy client to Netlify, Vercel, or similar
   - Update environment variables for production

## 📞 Support

If you encounter any issues:
1. Check the console for error messages
2. Verify all environment variables are set
3. Ensure all dependencies are installed
4. Check that both server and client are running

---

**🎉 Congratulations!** Your WanderWise application is now fully connected and ready to use! 