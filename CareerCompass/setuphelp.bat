@echo off
echo =======================================================
echo CareerCompass Local Setup Assistance
echo =======================================================
echo This script will help you set up CareerCompass on your local machine.

rem Check for Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
  echo ERROR: Node.js is not installed or not in your PATH.
  echo Please install Node.js from https://nodejs.org/
  echo After installing Node.js, run this script again.
  pause
  exit /b
)

rem Check for PostgreSQL
where psql >nul 2>nul
if %errorlevel% neq 0 (
  echo WARNING: PostgreSQL command line tools not found in PATH.
  echo If PostgreSQL is not installed, please install it from https://www.postgresql.org/download/
  echo.
)

echo Creating required files...

rem Check and create .env
if not exist .env (
  echo Creating .env file...
  (
    echo DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/careercompass
    echo SESSION_SECRET=career_compass_development_secret_key
    echo OPENAI_API_KEY=your_openai_key_here
  ) > .env
  echo .env file created successfully.
  echo IMPORTANT: Edit .env file to update your PostgreSQL password.
) else (
  echo .env file already exists.
)

echo.
echo Files created successfully!
echo.
echo =======================================================
echo NEXT STEPS:
echo =======================================================
echo 1. Make sure PostgreSQL is running
echo 2. Create a database called 'careercompass'
echo    in PostgreSQL using this command:
echo    CREATE DATABASE careercompass;
echo 3. Edit the .env file to update your PostgreSQL password
echo 4. Run LOCAL_INSTALL.bat to install dependencies
echo    and set up the database
echo 5. Run RUN_LOCALLY.bat to start the application
echo.
echo =======================================================
echo For detailed instructions, please read the LOCAL_SETUP_GUIDE.md file
echo =======================================================

pause