# WanderWise Configuration Guide

## 📋 Environment Setup

### Server Configuration (`Server/.env`)

Copy `.env.example` to `.env` and configure:

```bash
# MongoDB Connection
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/capstone

# JWT Secret (Generate a strong random string)
JWT_SECRET=your-super-secret-jwt-key-here

# Google OAuth (Get from Google Cloud Console)
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret

# Server Settings
PORT=5003
NODE_ENV=development

# CORS (Frontend URLs)
CLIENT_ORIGIN=http://localhost:5173
CLIENT_URL=http://localhost:5173
```

### Client Configuration (`Client/.env`)

Copy `.env.example` to `.env` and configure:

```bash
# Backend API URL
VITE_API_BASE_URL=http://localhost:5003

# Google OAuth Client ID
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

## 🔑 Getting Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized JavaScript origins:
   - `http://localhost:5173` (development)
   - `https://wanderwiseca.netlify.app` (production)
6. Copy Client ID to both server and client `.env` files

## 🚀 Quick Start

```bash
# Install dependencies
npm run install-all

# Start both server and client
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5003

## ⚠️ Important Notes

### Port Configuration
- Default server port: **5003** (changed from 5002 to avoid macOS conflicts)
- Default client port: **5173** (Vite default)

### Security Best Practices
- Never commit `.env` files to Git
- Use strong, random JWT secrets (minimum 32 characters)
- Keep MongoDB credentials secure
- Use environment-specific values for production

### Production Deployment

#### Backend (Render)
1. Set all environment variables in Render dashboard
2. Use production MongoDB connection string
3. Update `NODE_ENV=production`
4. Update CORS origins to production URLs

#### Frontend (Netlify)
1. Set environment variables in Netlify dashboard
2. Update `VITE_API_BASE_URL` to Render backend URL
3. Update `VITE_GOOGLE_CLIENT_ID` if needed

## 📊 Database Setup

1. Create MongoDB Atlas cluster (free tier available)
2. Get connection string
3. Replace `<password>` with your database password
4. Replace `<cluster-url>` with your cluster address
5. Update `MONGO_URL` in server `.env`

## 🔧 Troubleshooting

### Port Already in Use
If you get "EADDRINUSE" error:
```bash
# Find process using port 5003
lsof -i :5003

# Kill the process
kill -9 <PID>
```

### CORS Errors
- Ensure `CLIENT_ORIGIN` and `CLIENT_URL` match your frontend URL exactly
- Check that frontend is calling the correct backend URL
- Verify no trailing slashes in URLs

### Google OAuth Not Working
- Verify Client ID matches in both server and client
- Check authorized origins in Google Cloud Console
- Ensure redirect URIs are configured correctly

## 📝 Available Scripts

### Root Directory
```bash
npm run install-all      # Install all dependencies (root + server + client)
npm run dev             # Start both server and client
npm start               # Start production server + dev client
npm run client:build    # Build client for production
```

### Server Directory
```bash
npm start               # Start production server
npm run dev            # Start development server (auto-reload)
npm run admin-utils    # Admin management utilities
npm run create-admin   # Create admin user
npm run seed-destinations  # Seed destination data
```

### Client Directory
```bash
npm run dev            # Start development server
npm run build          # Build for production
npm run preview        # Preview production build
npm run lint           # Run ESLint
```

## 🎯 Feature Configuration

### Budget Tracking
The budget feature is fully implemented with:
- Expense categories: Transportation, Accommodation, Food, Activities, Miscellaneous
- Per-trip budget tracking
- Category-wise totals
- Currency support (default: INR)

### Admin Panel
Access admin features:
1. Create admin account: `npm run create-admin`
2. Login with: `admin@wanderwise.com` / `admin123`
3. Access: http://localhost:5173/admin

## 📖 Additional Resources

- [API Documentation](./README.md#api-endpoints)
- [Start Guide](./START_GUIDE.md)
- [Deployment Guide](./README.md#deployment-status)
