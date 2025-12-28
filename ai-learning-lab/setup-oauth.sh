#!/bin/bash

# OAuth Credentials Setup Helper
# This script helps you add OAuth credentials to .env file

echo "========================================="
echo "AI Learning Lab - OAuth Setup Helper"
echo "========================================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "Error: .env file not found!"
    echo "Please run this script from the project root directory."
    exit 1
fi

echo "This script will help you add OAuth credentials to your .env file."
echo "You should have already obtained credentials from:"
echo "  - Google Cloud Console"
echo "  - GitHub Developer Settings"
echo ""
read -p "Press Enter to continue..."
echo ""

# Google OAuth
echo "========================================="
echo "GOOGLE OAUTH CREDENTIALS"
echo "========================================="
read -p "Enter your Google Client ID: " GOOGLE_CLIENT_ID
read -p "Enter your Google Client Secret: " GOOGLE_CLIENT_SECRET
echo ""

# GitHub OAuth
echo "========================================="
echo "GITHUB OAUTH CREDENTIALS"
echo "========================================="
read -p "Enter your GitHub Client ID: " GITHUB_CLIENT_ID
read -p "Enter your GitHub Client Secret: " GITHUB_CLIENT_SECRET
echo ""

# Verify
echo "========================================="
echo "VERIFICATION"
echo "========================================="
echo "Please verify these credentials:"
echo ""
echo "Google Client ID: ${GOOGLE_CLIENT_ID:0:20}..."
echo "Google Client Secret: ${GOOGLE_CLIENT_SECRET:0:15}..."
echo "GitHub Client ID: ${GITHUB_CLIENT_ID:0:20}..."
echo "GitHub Client Secret: ${GITHUB_CLIENT_SECRET:0:15}..."
echo ""
read -p "Are these correct? (y/n): " CONFIRM

if [ "$CONFIRM" != "y" ]; then
    echo "Setup cancelled. Please run the script again."
    exit 0
fi

# Update .env file
echo ""
echo "Updating .env file..."

# Use sed to update the values (macOS and Linux compatible)
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s|^GOOGLE_CLIENT_ID=.*|GOOGLE_CLIENT_ID=\"$GOOGLE_CLIENT_ID\"|g" .env
    sed -i '' "s|^GOOGLE_CLIENT_SECRET=.*|GOOGLE_CLIENT_SECRET=\"$GOOGLE_CLIENT_SECRET\"|g" .env
    sed -i '' "s|^GITHUB_CLIENT_ID=.*|GITHUB_CLIENT_ID=\"$GITHUB_CLIENT_ID\"|g" .env
    sed -i '' "s|^GITHUB_CLIENT_SECRET=.*|GITHUB_CLIENT_SECRET=\"$GITHUB_CLIENT_SECRET\"|g" .env
else
    # Linux
    sed -i "s|^GOOGLE_CLIENT_ID=.*|GOOGLE_CLIENT_ID=\"$GOOGLE_CLIENT_ID\"|g" .env
    sed -i "s|^GOOGLE_CLIENT_SECRET=.*|GOOGLE_CLIENT_SECRET=\"$GOOGLE_CLIENT_SECRET\"|g" .env
    sed -i "s|^GITHUB_CLIENT_ID=.*|GITHUB_CLIENT_ID=\"$GITHUB_CLIENT_ID\"|g" .env
    sed -i "s|^GITHUB_CLIENT_SECRET=.*|GITHUB_CLIENT_SECRET=\"$GITHUB_CLIENT_SECRET\"|g" .env
fi

echo "✅ .env file updated successfully!"
echo ""
echo "========================================="
echo "NEXT STEPS"
echo "========================================="
echo "1. Restart your development server"
echo "2. Visit http://localhost:3000/login"
echo "3. Test OAuth login with Google and GitHub"
echo ""
echo "If you encounter any issues, check:"
echo "  - Redirect URIs match exactly in OAuth provider settings"
echo "  - All credentials are copied correctly (no extra spaces)"
echo "  - Development server is running on port 3000"
echo ""
