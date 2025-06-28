# WanderWise Backend API

A comprehensive travel application backend built with Node.js, Express, and MongoDB.

## Features

- 🔐 **Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (User/Admin)
  - Password hashing with bcrypt
  - User profile management

- 🗺️ **Destination Management**
  - CRUD operations for destinations
  - Admin approval system for user submissions
  - Review and rating system
  - Search and filtering capabilities
  - Popular destinations marking

- 👥 **User Management**
  - User registration and login
  - Profile management
  - Saved destinations
  - Trip history tracking

- 🛡️ **Admin Panel**
  - User management (view, edit, delete, activate/deactivate)
  - Destination approval system
  - Analytics and statistics
  - Bulk operations

- 📊 **Analytics**
  - User registration trends
  - Destination submission analytics
  - Usage statistics

## Prerequisites

- Node.js (v18 or higher)
- MongoDB database
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   MONGO_URL=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173
   ```

4. **Create Admin User**
   ```bash
   npm run create-admin
   ```
   This creates the first admin user:
   - Email: admin@wanderwise.com
   - Password: admin123

5. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/signup` | Register new user | No |
| POST | `/login` | User login | No |
| GET | `/profile` | Get current user profile | Yes |
| PUT | `/profile` | Update user profile | Yes |
| PUT | `/change-password` | Change password | Yes |
| POST | `/save-destination/:id` | Save destination to user's list | Yes |
| DELETE | `/remove-destination/:id` | Remove destination from user's list | Yes |
| GET | `/saved-destinations` | Get user's saved destinations | Yes |

### Destinations (`/api/destinations`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all approved destinations | No |
| GET | `/:id` | Get destination by ID | No |
| POST | `/` | Submit new destination | Yes |
| PUT | `/:id` | Update destination | Yes (Admin/Creator) |
| DELETE | `/:id` | Delete destination | Yes (Admin/Creator) |
| POST | `/:id/reviews` | Add review to destination | Yes |

### Admin Routes (`/api/admin`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/dashboard` | Get admin dashboard stats | Yes (Admin) |
| GET | `/users` | Get all users with pagination | Yes (Admin) |
| GET | `/users/:id` | Get user details | Yes (Admin) |
| PATCH | `/users/:id` | Update user role/status | Yes (Admin) |
| DELETE | `/users/:id` | Delete user | Yes (Admin) |
| GET | `/destinations` | Get all destinations (admin view) | Yes (Admin) |
| PATCH | `/destinations/:id/approve` | Approve destination | Yes (Admin) |
| PATCH | `/destinations/:id/reject` | Reject destination | Yes (Admin) |
| POST | `/destinations/bulk-approve` | Bulk approve destinations | Yes (Admin) |
| POST | `/destinations/bulk-reject` | Bulk reject destinations | Yes (Admin) |
| GET | `/analytics/users` | Get user analytics | Yes (Admin) |
| GET | `/analytics/destinations` | Get destination analytics | Yes (Admin) |

## Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Data Models

### User Model
```javascript
{
  username: String (required, unique),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['user', 'admin'], default: 'user'),
  profilePicture: String,
  bio: String,
  savedDestinations: [ObjectId],
  tripHistory: [ObjectId],
  isActive: Boolean (default: true),
  createdAt: Date,
  lastLogin: Date
}
```

### Destination Model
```javascript
{
  name: String (required),
  description: String (required),
  country: String (required),
  location: String (required),
  images: [String],
  activities: [String],
  bestSeason: String,
  popularAttractions: [String],
  isPopular: Boolean (default: false),
  isApproved: Boolean (default: false),
  addedBy: ObjectId (required),
  approvedBy: ObjectId,
  approvalDate: Date,
  price: Number (default: 0),
  rating: Number (default: 0),
  reviews: [{
    user: ObjectId,
    rating: Number,
    comment: String,
    date: Date
  }]
}
```

## Error Handling

The API returns consistent error responses:

```javascript
{
  "message": "Error description",
  "errors": ["field1 error", "field2 error"], // for validation errors
  "field": "field_name" // for duplicate key errors
}
```

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- Input validation and sanitization
- CORS configuration
- Rate limiting (can be added)
- Request logging

## Development

### Project Structure
```
Server/
├── models/          # Database models
├── Routes/          # API routes
├── middleware/      # Custom middleware
├── db/             # Database connection
├── scripts/        # Utility scripts
├── server.js       # Main server file
└── package.json
```

### Adding New Features

1. Create/update models in `models/`
2. Add routes in `Routes/`
3. Update middleware if needed
4. Test endpoints
5. Update documentation

## Deployment

1. Set environment variables for production
2. Install dependencies: `npm install --production`
3. Start server: `npm start`
4. Use PM2 or similar for process management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License. 