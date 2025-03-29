#!/bin/bash

# World Ballets Server Installation Script
# This script helps set up the World Ballets server by installing Node.js and guiding through MongoDB Atlas setup

echo "=== World Ballets Server Installation ==="
echo ""

# Check if Node.js is installed
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo "✅ Node.js is already installed (version: $NODE_VERSION)"
else
    echo "❌ Node.js is not installed"
    echo ""
    echo "Please install Node.js from https://nodejs.org/"
    echo ""
    echo "For macOS, you can use Homebrew:"
    echo "  brew install node"
    echo ""
    echo "For Ubuntu/Debian:"
    echo "  sudo apt update"
    echo "  sudo apt install nodejs npm"
    echo ""
    echo "For Windows:"
    echo "  Download and run the installer from https://nodejs.org/"
    echo ""
    exit 1
fi

# Check if npm is installed
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo "✅ npm is already installed (version: $NPM_VERSION)"
else
    echo "❌ npm is not installed"
    echo "Please install npm (usually comes with Node.js)"
    exit 1
fi

echo ""
echo "=== MongoDB Atlas Setup ==="
echo ""
echo "You need a MongoDB database to store the scraped data."
echo "The recommended option is to use MongoDB Atlas (free tier):"
echo ""
echo "1. Go to https://www.mongodb.com/cloud/atlas"
echo "2. Sign up for a free account"
echo "3. Create a new cluster (the free tier is sufficient)"
echo "4. Create a database user with password"
echo "5. Get your connection string (it should look like this: mongodb+srv://username:password@cluster0.mongodb.net/world-ballets?retryWrites=true&w=majority)"
echo ""
echo "Once you have your MongoDB connection string, update the .env file with it."
echo ""

# Install dependencies
echo "=== Installing Dependencies ==="
echo ""
npm install

echo ""
echo "=== Installation Complete ==="
echo ""
echo "To start the server in development mode:"
echo "  npm run dev"
echo ""
echo "To run a manual scrape:"
echo "  npm run scrape"
echo ""
echo "Don't forget to update the .env file with your MongoDB connection string!"
echo ""
