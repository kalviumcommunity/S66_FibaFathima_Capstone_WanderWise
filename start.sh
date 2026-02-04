#!/bin/bash

# WanderWise Startup Script
# This script starts both the server and client automatically

echo "🚀 Starting WanderWise..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Create logs directory if it doesn't exist
mkdir -p logs

# Function to cleanup on exit
cleanup() {
    echo -e "\n${BLUE}🛑 Shutting down WanderWise...${NC}"
    kill $SERVER_PID $CLIENT_PID 2>/dev/null
    exit
}

# Trap Ctrl+C and call cleanup
trap cleanup INT TERM

# Start server
echo -e "${BLUE}📦 Starting server...${NC}"
cd Server
npm start > ../logs/server.log 2>&1 &
SERVER_PID=$!
cd ..

# Wait a bit for server to start
sleep 3

# Start client
echo -e "${BLUE}🎨 Starting client...${NC}"
cd Client
npm run dev > ../logs/client.log 2>&1 &
CLIENT_PID=$!
cd ..

echo -e "${GREEN}✅ WanderWise is running!${NC}"
echo -e "${GREEN}   Server: http://localhost:5002${NC}"
echo -e "${GREEN}   Client: http://localhost:5173${NC}"
echo -e "${BLUE}   Logs: ./logs/${NC}"
echo -e "\n${BLUE}Press Ctrl+C to stop${NC}"

# Wait for processes
wait

