# WanderWise Setup Instructions

## Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account (for cloud database) or MongoDB installed locally
- Google Cloud Console account (for Google OAuth)

## Environment Configuration

### 1. Server Configuration

Navigate to the server directory and create a `.env` file:

```bash
cd Server
touch .env
```

Add the following content to your `.env` file:

```env
# Database
# Replace with your actual MongoDB Atlas connection string
# Format: mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/<database-name>
MONGO_URL=your-mongodb-atlas-connection-string-here

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Server
PORT=5002
NODE_ENV=development

# Frontend URL (for CORS)
CLIENT_ORIGIN=http://localhost:5173
CLIENT_URL=http://localhost:5173
```

### 2. Client Configuration

Navigate to the client directory and create a `.env` file:

```bash
cd ../Client
touch .env
```

Add the following content to your `.env` file:

```env
# API Base URL
# For local development, use the backend server URL
VITE_API_BASE_URL=http://localhost:5002

# For production deployment, uncomment and use your deployed backend URL
# VITE_API_BASE_URL=https://your-deployed-backend-url.onrender.com

VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

## Setting up MongoDB Atlas (Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas) and create an account
2. Create a new cluster (free tier is sufficient for development)
3. Create a database user with a username and password
4. In the Database Access section, add a new user with read/write permissions
5. In the Network Access section, add your IP address or allow access from anywhere (0.0.0.0/0) for development
6. Click on "Connect" and choose "Connect your application"
7. Copy the connection string and replace `<username>`, `<password>`, and `<cluster-name>` with your actual values
8. Use this connection string as your `MONGO_URL` in the server `.env` file

## Setting up Google OAuth (Optional but Recommended)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to Credentials > Create Credentials > OAuth 2.0 Client IDs
5. Set the application type as "Web application"
6. Add `http://localhost:5173` to Authorized JavaScript origins
7. Add `http://localhost:5173` to Authorized redirect URIs
8. Copy the Client ID and use it for `VITE_GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_ID`

## Running the Application

### 1. Install Dependencies

```bash
# Install server dependencies
cd Server
npm install

# Install client dependencies
cd ../Client
npm install
```

### 2. Seed the Database (Optional)

If you want to add sample destinations to your database:

```bash
cd Server
node scripts/seedDestinations.js
```

### 3. Start the Applications

In separate terminals:

```bash
# Terminal 1: Start the backend server
cd Server
npm run dev

# Terminal 2: Start the frontend client
cd Client
npm run dev
```

The backend server will run on `http://localhost:5002` and the frontend will run on `http://localhost:5173`.

## Creating an Admin Account

To create an admin account manually, you can use the createAdmin script:

```bash
cd Server
node scripts/createAdmin.js
```

Or you can register a new user and then update their role in the database directly.

## Troubleshooting

1. **MongoDB Connection Issues**: Make sure your connection string is correct and that your IP address is whitelisted in MongoDB Atlas.

2. **Port Issues**: If ports 5002 or 5173 are already in use, change them in the respective configuration files.

3. **CORS Issues**: Make sure your CLIENT_ORIGIN and CLIENT_URL in the server .env file match your frontend URL.

4. **Authentication Issues**: Verify that your JWT_SECRET is set and that your Google OAuth credentials are correct if using Google login.