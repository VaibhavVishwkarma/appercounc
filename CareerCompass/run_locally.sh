#!/bin/bash

echo "Running CareerCompass locally..."

# Check if .env file exists, if not create it
if [ ! -f .env ]; then
  echo "Creating .env file..."
  echo "DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/careercompass" > .env
  echo "SESSION_SECRET=career_compass_development_secret_key" >> .env
  echo "OPENAI_API_KEY=your_openai_key_here" >> .env
  echo "IMPORTANT: Edit .env file to update your PostgreSQL password."
fi

# Start the application using dotenv
npx dotenv-cli -e .env -- npm run dev