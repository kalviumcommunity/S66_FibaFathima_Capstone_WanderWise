## WanderWise - Smart Travel Planner

### Frontend Deployed Link
   [WanderWise](https://wanderwiseca.netlify.app/)


#### Backend Deployed Link
   [backend](https://s66-fibafathima-capstone-wanderwise.onrender.com/)

### Idea Brief:
**Project Name**: WanderWise

**Description**:
WanderWise is an intelligent travel planning platform that helps users discover and plan their perfect trip based on destination-specific preferences. From smart itineraries to post-trip reflections, the app provides a clean, minimal, and engaging experience for travelers of all kinds.

**Key Features**:

 - User Authentication (Google & Email/Password)
 - Smart Destination Filtering based on short quiz (per destination)
 - AI-Generated Trip Plan Based on Answers
 - Digital Travel Journal (Pre, During, and Post-Trip)
 - Local Experiences Discovery Page
 - Photo Diary & Mood Timeline After the Trip


**Tech Stack:** 
 - React (Frontend), 
 - Node.js (Backend),
 - Express, 
 - MongoDB


**Project Pages & Their Functionality**
- The project will have 9 pages, optimized for usability and simplicity:






1. Home Page

    - Intro to WanderWise, explore destinations, and access top features.
2. Login/Signup
    - User authentication (Google & Email/Password).
3. Destination Explorer + Quiz
    - Explore cities → Click destination → Answer 5-question quiz → AI trip plan.
4. Smart Itinerary View
    - Minimal trip timeline with day-wise activities and maps.
5. Experience Discovery
    - AI-curated local experiences, food, and hidden spots..
6. Travel Journal
    - Write journal entries before, during, and after travel.
7. Reflection & Memory Page
    - Post-trip mood tracker, memory timeline, and photo upload.

---

## 🌟 Complete Feature Implementation

### ✅ Completed Features

- **User Authentication**: Email/password signup and Google OAuth login
- **Destination Management**: Browse and search travel destinations from MongoDB
- **Trip Planning**: Create personalized itineraries with 5-question quiz
- **Travel Journal**: Document experiences with mood tracking (1-5 scale)
- **Reflection Dashboard**: Analyze travel patterns and mood trends with charts
- **Admin Panel**: Manage destinations and users with full CRUD operations
- **Experience Discovery**: Find local activities and experiences
- **Protected Routes**: Secure user-specific content

### 🛠️ Updated Tech Stack

#### Frontend
- **React** with Vite
- **React Router** for navigation
- **TailwindCSS** for styling
- **Axios** for API calls
- **@react-oauth/google** for Google authentication
- **Recharts** for data visualization
- **React Hot Toast** for notifications

#### Backend
- **Node.js** (v20.x recommended) with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Google Auth Library** for OAuth verification
- **bcryptjs** for password hashing
- **CORS** for cross-origin requests

## ⚙️ Environment Setup

### Server Environment Variables (`Server/.env`)

```env
PORT=8080
NODE_ENV=production
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-super-secret-jwt-key-here
GOOGLE_CLIENT_ID=your-google-oauth-client-id
CLIENT_ORIGIN=https://wanderwiseca.netlify.app
```

### Client Environment Variables (`Client/.env`)

```env
VITE_API_BASE_URL=https://your-render-app.onrender.com/api
VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id
```

**Note:** 
- Use `VITE_API_BASE_URL` (preferred) or `VITE_API_BASE` (alternative)
- Include `/api` at the end of the URL (e.g., `https://your-app.onrender.com/api`)
- For local development, you can omit this variable (defaults to `http://localhost:5002/api`)

## 🔧 Installation & Setup

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd "Capstone Project"

# Install server dependencies
cd Server
npm install

# Install client dependencies
cd ../Client
npm install
```

### 2. Setup Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials
3. Add authorized origins:
   - `http://localhost:5173` (development)
   - `https://wanderwiseca.netlify.app` (production)

### 3. Run the Application

```bash
# Start server (from Server directory)
npm start

# Start client (from Client directory)
npm run dev
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/google` - Google OAuth login
- `GET /api/auth/me` - Get current user

### Destinations
- `GET /api/destinations` - Get all destinations (supports query params)
- `GET /api/destinations/:id` - Get single destination
- `POST /api/destinations` - Create destination (admin only)
- `PUT /api/destinations/:id` - Update destination (admin only)
- `DELETE /api/destinations/:id` - Delete destination (admin only)

### Trips
- `GET /api/trips` - Get user's trips (authenticated)
- `GET /api/trips/:id` - Get single trip (owner only)
- `POST /api/trips` - Create trip (authenticated)
- `PUT /api/trips/:id` - Update trip (owner only)
- `DELETE /api/trips/:id` - Delete trip (owner only)

### Journals
- `GET /api/journals/trip/:tripId` - Get journal for trip (owner only)
- `POST /api/journals` - Create journal (authenticated)
- `POST /api/journals/:id/entries` - Add journal entry (owner only)
- `PUT /api/journals/:id/entries/:entryId` - Update entry (owner only)
- `DELETE /api/journals/:id/entries/:entryId` - Delete entry (owner only)

### Admin
- `GET /api/admin/stats` - Platform statistics (admin only)
- `GET /api/admin/users` - User management (admin only)
- `GET /api/admin/destinations` - Destination management (admin only)

## 🔒 Security Features

- JWT token authentication with 7-day expiration
- Password hashing with bcrypt (12 rounds)
- Protected routes on both frontend and backend
- User ownership verification for trips and journals
- Google OAuth integration for secure login
- CORS configuration for production deployment
- Input validation and sanitization

## 📱 Complete User Flow

1. **Registration/Login**: Users sign up with email or Google OAuth
2. **Browse Destinations**: Explore destinations loaded from MongoDB
3. **Plan Trip**: Take 5-question quiz to create personalized itinerary
4. **Manage Itinerary**: Add/edit days and activities, save to database
5. **Journal Experience**: Document experiences with mood tracking (1-5 scale)
6. **Reflect**: View analytics and insights with interactive charts
7. **Discover**: Find local experiences and activities
8. **Admin**: Manage platform content (admin users only)

## 🎯 Key Implementation Details

- **No Hardcoded Data**: All content loaded from MongoDB Atlas
- **Working Forms**: All CRUD operations functional with proper validation
- **JWT + Google OAuth**: Dual authentication system implemented
- **Protected Routes**: Frontend and backend route protection
- **Mood Analytics**: Recharts integration for data visualization
- **Admin Panel**: Full content management system
- **Responsive Design**: Mobile-friendly interface

## 🚀 Deployment Status

- **Frontend**: Deployed on Netlify ✅
- **Backend**: Deployed on Render ✅
- **Database**: MongoDB Atlas ✅
- **Environment Variables**: Configured for production ✅

## 👥 Project Team

- **Developer**: Fiba Fathima
- **Project Type**: Capstone Project
- **Institution**: [Your Institution]
- **Completion Date**: 2024


