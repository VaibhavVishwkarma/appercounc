#!/bin/bash

echo "Setting up CareerCompass locally..."

# Check if .env file exists
if [ ! -f .env ]; then
  echo "Creating .env file..."
  echo "DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/careercompass" > .env
  echo "SESSION_SECRET=career_compass_development_secret_key" >> .env
  echo "OPENAI_API_KEY=your_openai_key_here" >> .env
  echo "IMPORTANT: Edit .env file to update your PostgreSQL password."
fi

# Check if drizzle.config.ts exists
if [ ! -f drizzle.config.ts ]; then
  echo "Creating drizzle.config.ts file..."
  cat > drizzle.config.ts << EOL
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/careercompass",
  },
});
EOL
fi

# Install dependencies
echo "Installing dependencies..."
npm install
npm install -D typescript tsx dotenv-cli drizzle-kit @types/express-session @types/passport @types/passport-local

# Display instructions
echo
echo "Setup completed!"
echo
echo "IMPORTANT STEPS BEFORE RUNNING:"
echo "1. Make sure PostgreSQL is running"
echo "2. Create a database called 'careercompass':"
echo "   CREATE DATABASE careercompass;"
echo "3. Edit the .env file to set your PostgreSQL password"
echo "4. Run database migration:"
echo "   npx dotenv-cli -e .env -- npx drizzle-kit push --config=drizzle.config.ts"
echo "5. Start the application:"
echo "   npx dotenv-cli -e .env -- npm run dev"
echo
echo "Alternatively, you can run ./run_locally.sh after setting up your database"

# Make run_locally.sh executable
chmod +x run_locally.sh