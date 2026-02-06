#!/bin/bash

# CAT Operating Portal - Quick Start Script

set -e

echo "🚀 CAT Operating Portal - Setup & Run"
echo "===================================="

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

cd "$(dirname "$0")"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

NODE_VERSION=$(node -v)
echo "✓ Node.js ${NODE_VERSION} found"

# Backend setup
echo -e "\n${BLUE}[1/3]${NC} Setting up Backend..."
cd backend
if [ ! -d "node_modules" ]; then
    npm install
fi
cd ..
echo "✓ Backend ready"

# Frontend setup
echo -e "\n${BLUE}[2/3]${NC} Setting up Frontend..."
cd frontend
if [ ! -d "node_modules" ]; then
    npm install
fi
cd ..
echo "✓ Frontend ready"

# Environment
echo -e "\n${BLUE}[3/3]${NC} Checking environment..."
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "✓ .env created from .env.example"
else
    echo "✓ .env already exists"
fi

echo -e "\n${GREEN}✨ Setup complete!${NC}"
echo ""
echo "Next steps:"
echo "==========="
echo ""
echo "Option A - Run with Docker (Recommended):"
echo "  docker-compose up"
echo ""
echo "Option B - Run locally (requires PostgreSQL on localhost:5432):"
echo "  # Terminal 1 - Backend"
echo "  cd backend && npm run start:dev"
echo ""
echo "  # Terminal 2 - Frontend"
echo "  cd frontend && npm run dev"
echo ""
echo "Option C - Debug in VS Code:"
echo "  Press Ctrl+Shift+D and select 'Full Stack (Backend + Frontend)'"
echo ""
echo "Access:"
echo "  Frontend:  http://localhost:3000"
echo "  Backend:   http://localhost:3001/api"
echo ""
