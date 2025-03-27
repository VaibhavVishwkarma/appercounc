# Career Compass - Career Counseling Website

A comprehensive AI-powered career guidance platform that transforms professional development through interactive, personalized technologies.

## Project Setup Guide

Follow these steps to set up and run the project locally:

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL

### Installation Steps

1. **Clone or extract the project** to your local machine

2. **Create database**
   - Create a PostgreSQL database for the project
   - Example command: `createdb career_compass`

3. **Environment setup**
   - Copy `.env.example` to a new file named `.env`
   - Update the database connection string and session secret in the `.env` file:
     ```
     DATABASE_URL=postgresql://username:password@localhost:5432/career_compass
     SESSION_SECRET=your_session_secret_here
     ```
   - Replace username, password, and database name with your PostgreSQL credentials

4. **Install dependencies**
   ```
   npm install
   ```

5. **Run database migrations**
   ```
   npx drizzle-kit generate
   npm run db:push
   ```

6. **Start the application**
   ```
   npm run dev
   ```

7. **Access the website**
   - Open your browser and go to: `http://localhost:5000`

## Key Features
- Interactive career assessment quizzes
- AI-powered career recommendations 
- Resume building and optimization tools
- Career chatbot assistant
- User profiles and result tracking
- Admin dashboard for management

## Technology Stack
- Frontend: React.js with TypeScript
- Backend: Node.js with Express
- Database: PostgreSQL
- ORM: Drizzle
- Authentication: Passport.js
- UI Components: Shadcn UI / Tailwind CSS

## Troubleshooting

If you encounter any issues with the setup:

1. **Database Connection Issues**
   - Check if PostgreSQL is running
   - Verify your connection string
   - Ensure your user has proper database permissions

2. **Missing node_modules**
   - Run `npm install` again
   - Check for any errors in the npm logs

3. **Port Conflicts**
   - If port 5000 is already in use, you can modify the port in `server/index.ts`