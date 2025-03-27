import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
const { Pool } = pkg;
import * as schema from '../shared/schema';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Default connection string for local development
const defaultConnectionString = 'postgresql://postgres:postgres@localhost:5432/careercompass';

// Create a PostgreSQL pool
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL || defaultConnectionString,
});

// Check database connection on startup
pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client', err);
  process.exit(-1);
});

// Create a Drizzle instance using the pool
export const db = drizzle(pool, { schema });