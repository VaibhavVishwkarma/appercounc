@echo off
echo Setting up CareerCompass locally...

echo Creating required files and folders...
if not exist .env (
  echo DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/careercompass> .env
  echo SESSION_SECRET=career_compass_development_secret_key>> .env
  echo OPENAI_API_KEY=your_openai_key_here>> .env
  echo .env file created successfully.
  echo IMPORTANT: Edit .env file to update your PostgreSQL password.
) else (
  echo .env file already exists.
)

echo Installing dependencies...
call npm install
call npm install -D typescript tsx dotenv-cli drizzle-kit @types/express-session @types/passport @types/passport-local

echo Setting up database tables...
call npx dotenv-cli -e .env -- npx drizzle-kit push --config=drizzle.config.ts

echo Starting the application...
call npx dotenv-cli -e .env -- npm run dev

pause