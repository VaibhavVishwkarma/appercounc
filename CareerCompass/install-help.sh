#!/bin/bash

echo "======================================================="
echo "CareerCompass Local Setup Assistance"
echo "======================================================="
echo "This script will help you set up CareerCompass on your local machine."

# Check for Node.js
if ! command -v node &> /dev/null; then
  echo "ERROR: Node.js is not installed or not in your PATH."
  echo "Please install Node.js from https://nodejs.org/"
  echo "After installing Node.js, run this script again."
  exit 1
fi

# Check for PostgreSQL
if ! command -v psql &> /dev/null; then
  echo "WARNING: PostgreSQL command line tools not found in PATH."
  echo "If PostgreSQL is not installed, please install it from https://www.postgresql.org/download/"
  echo
fi

echo "Creating required files..."

# Check and create .env
if [ ! -f .env ]; then
  echo "Creating .env file..."
  cat > .env << EOL
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/careercompass
SESSION_SECRET=career_compass_development_secret_key
OPENAI_API_KEY=your_openai_key_here
EOL
  echo ".env file created successfully."
  echo "IMPORTANT: Edit .env file to update your PostgreSQL password."
else
  echo ".env file already exists."
fi

echo
echo "Files created successfully!"
echo
echo "======================================================="
echo "NEXT STEPS:"
echo "======================================================="
echo "1. Make sure PostgreSQL is running"
echo "2. Create a database called 'careercompass'"
echo "   in PostgreSQL using this command:"
echo "   CREATE DATABASE careercompass;"
echo "3. Edit the .env file to update your PostgreSQL password"
echo "4. Run the following to install dependencies and set up the database:"
echo "   chmod +x setup_local.sh"
echo "   ./setup_local.sh"
echo "5. Run the following to start the application:"
echo "   chmod +x run_locally.sh"
echo "   ./run_locally.sh"
echo
echo "======================================================="
echo "For detailed instructions, please read the LOCAL_SETUP_GUIDE.md file"
echo "======================================================="

# Make our scripts executable
chmod +x setup_local.sh run_locally.sh

echo "Press Enter to exit"
read