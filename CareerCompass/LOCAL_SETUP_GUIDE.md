# CareerCompass Local Setup Guide

This guide will help you set up and run the CareerCompass application on your local machine.

## Prerequisites

1. **Node.js**: Version 16 or higher
2. **PostgreSQL**: Running instance with a database named "careercompass"
3. **Git**: For cloning the repository (optional)

## Setup Steps

### Option 1: Automated Setup (Recommended)

1. **Download the Project**:
   - Download the ZIP file from GitHub or Replit
   - Extract it to a folder on your computer

2. **Run the Setup Script**:
   - For Windows: Double-click on `setup_local.bat`
   - For Mac/Linux:
     ```
     chmod +x setup_local.sh
     ./setup_local.sh
     ```

3. **Configure Database Connection**:
   - Open the `.env` file that was created
   - Update the PostgreSQL password in the DATABASE_URL

4. **Run Setup Script Again**:
   - This will now connect to your database correctly
   - Tables will be created and the application will start

### Option 2: Manual Setup

1. **Install Dependencies**:
   ```
   npm install
   npm install -D typescript tsx dotenv-cli drizzle-kit
   ```

2. **Create .env File**:
   Create a file named `.env` in the project root with the following content:
   ```
   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/careercompass
   SESSION_SECRET=career_compass_development_secret_key
   OPENAI_API_KEY=your_openai_key_here
   ```
   
3. **Create drizzle.config.ts**:
   Create a file named `drizzle.config.ts` in the project root with:
   ```typescript
   import { defineConfig } from "drizzle-kit";
   
   if (!process.env.DATABASE_URL) {
     throw new Error("DATABASE_URL environment variable is required");
   }
   
   export default defineConfig({
     out: "./migrations",
     schema: "./shared/schema.ts",
     dialect: "postgresql",
     dbCredentials: {
       url: process.env.DATABASE_URL,
     },
   });
   ```

4. **Create Database**:
   In PostgreSQL, create a database named "careercompass"

5. **Push Schema to Database**:
   ```
   npx dotenv-cli -e .env -- npx drizzle-kit push --config=drizzle.config.ts
   ```

6. **Start the Application**:
   ```
   npx dotenv-cli -e .env -- npm run dev
   ```

## Structure of The Project

- `/client`: Frontend React application
- `/server`: Backend Express server
- `/shared`: Shared types and schema
- `/migrations`: Database migrations

## Troubleshooting

### Common Issues

1. **Database Connection Error**:
   - Make sure PostgreSQL is running
   - Check if the database name is "careercompass"
   - Verify your username and password in the .env file

2. **Module Not Found Error**:
   - If you see an error about missing modules, run `npm install` again
   - Check if you're in the correct directory

3. **Port Already in Use**:
   - The default port is 5000. If it's in use, you can change it by adding `PORT=5001` to your .env file

## Additional Features

### OpenAI Integration

To use the AI-powered features:
1. Get an OpenAI API key from https://platform.openai.com
2. Add it to your .env file: `OPENAI_API_KEY=your_key_here`
3. Restart the application

## Support

If you encounter issues not covered in this guide, please:
1. Check if all files are present in the project
2. Ensure all import paths are correct (relative paths like "../shared/schema" instead of "@shared/schema")
3. Refer to the GitHub repository issues section for common problems and solutions