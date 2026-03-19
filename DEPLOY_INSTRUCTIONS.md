# Manual Redeployment Instructions for Render

## Issue
Backend is returning 500 error: "JWT_SECRET is missing"
Even though JWT_SECRET is set in render.yaml, Render hasn't picked it up yet.

## Solution: Force Redeploy on Render

### Option 1: Via Render Dashboard (Recommended)

1. Go to: https://dashboard.render.com/
2. Click on your service: `wanderwise-backend`
3. Click **"Manual Deploy"** button
4. Select **"Deploy latest commit"**
5. Wait 2-3 minutes for deployment to complete

### Option 2: Via Git Push Trigger

Make a small change and push to trigger auto-deploy:

```bash
# Add a comment or whitespace change to force redeploy
echo "# Trigger redeploy - $(date)" >> DEPLOY_TRIGGER.md
git add .
git commit -m "chore: Trigger redeployment to apply environment variables"
git push origin main
```

### Option 3: Update Environment Variable via Dashboard

1. Go to Render Dashboard
2. Click on `wanderwise-backend`
3. Go to **"Environment"** tab
4. Find `JWT_SECRET`
5. Click edit and re-save the value (even if it's correct)
6. This triggers automatic redeploy

## Verify Fix

After redeployment, test login:

```bash
# Test health endpoint
curl https://s66-fibafathima-capstone-wanderwise.onrender.com/health

# Test login
curl -X POST https://s66-fibafathima-capstone-wanderwise.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@wanderwise.com","password":"admin123"}'
```

Expected response:
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

## Current Environment Variables (Verify These Are Set)

```
NODE_ENV=production
PORT=5003
MONGO_URL=mongodb+srv://fibaaah:Jaseenamujeeb8830@fibaaah.dnfd5.mongodb.net/Capstone
JWT_SECRET=fiba8830-wanderwise-secure-jwt-key
GOOGLE_CLIENT_ID=854277378956-k3q4qobu9k8f25kks9rdbv50cvbuhdeh.apps.googleusercontent.com
CLIENT_ORIGIN=https://wanderwiseca.netlify.app
CLIENT_URL=https://wanderwiseca.netlify.app
```

## Timeline

- T+0min: Trigger redeploy
- T+1min: Build starts
- T+2-3min: Deployment completes
- T+4min: Backend live with JWT_SECRET configured
- T+5min: Login should work ✅
