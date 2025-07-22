#!/bin/bash

# ZiShop Application Startup Script

echo "🚀 Starting ZiShop Application..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating default one..."
    cp .env.example .env 2>/dev/null || echo "DATABASE_URL=postgresql://localhost:5432/zishop" > .env
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if PostgreSQL is running (for local development)
if command -v pg_isready &> /dev/null; then
    if ! pg_isready -q; then
        echo "⚠️  PostgreSQL is not running. Please start PostgreSQL first."
        echo "For Ubuntu/Debian: sudo service postgresql start"
        echo "For macOS with Homebrew: brew services start postgresql"
        exit 1
    fi
fi

# Run database migrations if needed
echo "🗄️  Setting up database..."
npm run db:push

# Start the application in development mode
echo "🎉 Starting ZiShop on http://localhost:3000"
echo "📡 API server will run on http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop the application"

npm run dev