@echo off
echo Setting up CareerCompass locally...

rem Check if .env file exists
if not exist .env (
  echo Creating .env file...
  echo DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/careercompass> .env
  echo SESSION_SECRET=career_compass_development_secret_key>> .env
  echo OPENAI_API_KEY=your_openai_key_here>> .env
  echo IMPORTANT: Edit .env file to update your PostgreSQL password.
)

rem Check if drizzle.config.ts exists
if not exist drizzle.config.ts (
  echo Creating drizzle.config.ts file...
  (
    echo import { defineConfig } from "drizzle-kit";
    echo.
    echo export default defineConfig({
    echo   out: "./migrations",
    echo   schema: "./shared/schema.ts",
    echo   dialect: "postgresql",
    echo   dbCredentials: {
    echo     url: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/careercompass",
    echo   },
    echo });
  ) > drizzle.config.ts
)

rem Install dependencies
echo Installing dependencies...
call npm install
call npm install -D typescript tsx dotenv-cli drizzle-kit @types/express-session @types/passport @types/passport-local

rem Display instructions
echo.
echo Setup completed!
echo.
echo IMPORTANT STEPS BEFORE RUNNING:
echo 1. Make sure PostgreSQL is running
echo 2. Create a database called 'careercompass':
echo    CREATE DATABASE careercompass;
echo 3. Edit the .env file to set your PostgreSQL password
echo 4. Run database migration:
echo    npx dotenv-cli -e .env -- npx drizzle-kit push --config=drizzle.config.ts
echo 5. Start the application:
echo    npx dotenv-cli -e .env -- npm run dev
echo.
echo Alternatively, you can run RUN_LOCALLY.bat after setting up your database

pause