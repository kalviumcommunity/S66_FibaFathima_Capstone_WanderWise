# WanderWise Deployment Guide

This guide provides instructions for deploying the WanderWise application to Render (backend) and Netlify (frontend).

## Prerequisites

1. Render account: https://render.com/
2. Netlify account: https://netlify.com/
3. MongoDB Atlas account: https://cloud.mongodb.com/
4. Google OAuth credentials (for authentication)

## Backend Deployment (Render)

### 1. Environment Variables

Set the following environment variables in Render:

```
NODE_ENV=production
PORT=8080
MONGO_URL=your_mongodb_atlas_connection_string
JWT_SECRET=your_secure_jwt_secret
GOOGLE_CLIENT_ID=your_google_oauth_client_id
CLIENT_ORIGIN=https://your-netlify-app.netlify.app
```

### 2. Render Configuration

The `render.yaml` file in the root directory configures the deployment:

```yaml
services:
  - type: web
    name: wanderwise-backend
    env: node
    plan: free
    buildCommand: cd Server && npm install
    startCommand: cd Server && npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 8080
      - key: MONGO_URL
        fromDatabase:
          name: wanderwise-db
          property: connectionString
      - key: JWT_SECRET
        generateValue: true
      - key: CLIENT_ORIGIN
        value: https://wanderwiseca.netlify.app
    runtime:
      version: 20
```

### 3. Node.js Version Compatibility

The application is configured to use Node.js version 20.x, which resolves compatibility issues with the `buffer-equal-constant-time` package that occurs with Node.js v25+.

If you encounter issues with newer Node.js versions, ensure the following dependencies are used:
- `jsonwebtoken`: "^9.0.3" or higher
- `google-auth-library`: "^8.9.0" (more stable with various Node.js versions)

### 4. MongoDB Setup

1. Create a MongoDB Atlas cluster
2. Add your Render service IP to the IP whitelist in MongoDB Atlas
3. Get your connection string and add it as the MONGO_URL environment variable

## Frontend Deployment (Netlify)

### 1. Environment Variables

Set the following environment variables in Netlify:

```
VITE_API_BASE_URL=https://your-render-app.onrender.com/api
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

**Important Notes:**
- Use `VITE_API_BASE_URL` (not `VITE_API_BASE`)
- The URL should include `/api` at the end (e.g., `https://your-app.onrender.com/api`)
- If you only have the base URL without `/api`, the code will automatically append it
- You can also use `VITE_API_BASE` as an alternative (for backward compatibility)

### 2. Build Settings

The `netlify.toml` file configures the build:

```toml
[build]
  command = "cd Client && npm install && npm run build"
  publish = "Client/dist"

[build.environment]
  NODE_VERSION = "20"
  NPM_VERSION = "9"
```

## Troubleshooting

### Common Issues

1. **Buffer compatibility error with Node.js v25+**
   - Solution: Use Node.js 20.x as specified in the configuration
   - The error: `TypeError: Cannot read properties of undefined (reading 'prototype')` in `buffer-equal-constant-time` is resolved by using a compatible Node.js version

2. **CORS errors**
   - Ensure CLIENT_ORIGIN in backend matches your frontend URL
   - Check that CORS middleware is properly configured in server.js

3. **MongoDB connection issues**
   - Verify MONGO_URL is correct
   - Check IP whitelist in MongoDB Atlas
   - Ensure database user has proper permissions

4. **Authentication failures**
   - Verify GOOGLE_CLIENT_ID matches your Google OAuth credentials
   - Ensure the redirect URIs are configured in Google Cloud Console

### Dependency Issues

If you encounter dependency issues during deployment:

1. Delete `Server/package-lock.json`
2. Update `Server/package.json` with compatible versions:
   ```json
   {
     "dependencies": {
       "google-auth-library": "^8.9.0",
       "jsonwebtoken": "^9.0.3",
       "mongoose": "^7.6.9"
     }
   }
   ```
3. Redeploy to regenerate dependencies with compatible versions

## Version Compatibility

### Node.js Versions
- Recommended: 20.x
- Compatible: 18.x - 24.x
- Avoid: 25.x+ (due to buffer compatibility issues)

### Key Dependencies
- Express: "^4.18.2"
- Mongoose: "^7.6.9" (more stable than v8+ with various Node.js versions)
- jsonwebtoken: "^9.0.3"
- google-auth-library: "^8.9.0"

## Monitoring

1. Check Render logs for backend errors
2. Check Netlify logs for frontend build issues
3. Monitor MongoDB Atlas for connection issues
4. Verify all environment variables are correctly set

## Updates

When updating the application:

1. Push changes to your repository
2. Render will automatically deploy the backend
3. Netlify will automatically deploy the frontend
4. Monitor both services for successful deployment
5. Test all functionality after deployment