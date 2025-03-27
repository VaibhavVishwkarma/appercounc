// This is a helper script to manually seed quizzes into the database
// Run it with: node server/seed-quizzes.js

const { Pool } = require('pg');
require('dotenv').config();

async function seedQuizzes() {
  try {
    console.log('Connecting to PostgreSQL...');
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL
    });

    // Check if career_quizzes table exists
    const tablesCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'career_quizzes'
      );
    `);

    const tableExists = tablesCheck.rows[0].exists;
    if (!tableExists) {
      console.error('Table career_quizzes does not exist. Run migrations first.');
      await pool.end();
      return;
    }

    // Check existing quizzes
    const existingQuizzes = await pool.query('SELECT COUNT(*) FROM career_quizzes');
    console.log('Existing quizzes count:', existingQuizzes.rows[0].count);

    if (parseInt(existingQuizzes.rows[0].count) >= 2) {
      console.log('At least 2 quizzes already exist. Skipping seed.');
      await pool.end();
      return;
    }
    
    // Delete existing quizzes to start fresh
    if (parseInt(existingQuizzes.rows[0].count) > 0) {
      await pool.query('DELETE FROM career_quizzes');
      console.log('Cleared existing quizzes');
    }

    // General Career Interest Profiler
    const defaultQuiz = {
      title: "General Career Interest Profiler",
      description: "Focus on soft skills, leadership, creativity, and business-related roles",
      questions: [
        {
          id: 1,
          text: "I enjoy solving complex problems and analyzing data.",
          options: [
            { id: 1, text: "Strongly Disagree" },
            { id: 2, text: "Disagree" },
            { id: 3, text: "Neutral" },
            { id: 4, text: "Agree" },
            { id: 5, text: "Strongly Agree" }
          ]
        },
        {
          id: 2,
          text: "I prefer working with people rather than with things.",
          options: [
            { id: 1, text: "Strongly Disagree" },
            { id: 2, text: "Disagree" },
            { id: 3, text: "Neutral" },
            { id: 4, text: "Agree" },
            { id: 5, text: "Strongly Agree" }
          ]
        },
        {
          id: 3,
          text: "I enjoy creative activities like writing, design, or art.",
          options: [
            { id: 1, text: "Strongly Disagree" },
            { id: 2, text: "Disagree" },
            { id: 3, text: "Neutral" },
            { id: 4, text: "Agree" },
            { id: 5, text: "Strongly Agree" }
          ]
        },
        {
          id: 4,
          text: "I am comfortable taking leadership roles.",
          options: [
            { id: 1, text: "Strongly Disagree" },
            { id: 2, text: "Disagree" },
            { id: 3, text: "Neutral" },
            { id: 4, text: "Agree" },
            { id: 5, text: "Strongly Agree" }
          ]
        },
        {
          id: 5,
          text: "I enjoy learning about how technology works.",
          options: [
            { id: 1, text: "Strongly Disagree" },
            { id: 2, text: "Disagree" },
            { id: 3, text: "Neutral" },
            { id: 4, text: "Agree" },
            { id: 5, text: "Strongly Agree" }
          ]
        },
        {
          id: 6,
          text: "I am detail-oriented and enjoy organizing things methodically.",
          options: [
            { id: 1, text: "Strongly Disagree" },
            { id: 2, text: "Disagree" },
            { id: 3, text: "Neutral" },
            { id: 4, text: "Agree" },
            { id: 5, text: "Strongly Agree" }
          ]
        },
        {
          id: 7,
          text: "I'm comfortable with public speaking and presenting to groups.",
          options: [
            { id: 1, text: "Strongly Disagree" },
            { id: 2, text: "Disagree" },
            { id: 3, text: "Neutral" },
            { id: 4, text: "Agree" },
            { id: 5, text: "Strongly Agree" }
          ]
        },
        {
          id: 8,
          text: "I enjoy helping others learn new things or develop skills.",
          options: [
            { id: 1, text: "Strongly Disagree" },
            { id: 2, text: "Disagree" },
            { id: 3, text: "Neutral" },
            { id: 4, text: "Agree" },
            { id: 5, text: "Strongly Agree" }
          ]
        },
        {
          id: 9,
          text: "I like to work with numbers and analyze financial information.",
          options: [
            { id: 1, text: "Strongly Disagree" },
            { id: 2, text: "Disagree" },
            { id: 3, text: "Neutral" },
            { id: 4, text: "Agree" },
            { id: 5, text: "Strongly Agree" }
          ]
        },
        {
          id: 10,
          text: "I enjoy watching market trends and analyzing consumer behavior.",
          options: [
            { id: 1, text: "Strongly Disagree" },
            { id: 2, text: "Disagree" },
            { id: 3, text: "Neutral" },
            { id: 4, text: "Agree" },
            { id: 5, text: "Strongly Agree" }
          ]
        },
        {
          id: 11,
          text: "I'm good at persuading others and negotiating.",
          options: [
            { id: 1, text: "Strongly Disagree" },
            { id: 2, text: "Disagree" },
            { id: 3, text: "Neutral" },
            { id: 4, text: "Agree" },
            { id: 5, text: "Strongly Agree" }
          ]
        },
        {
          id: 12,
          text: "I enjoy writing code or creating digital solutions to problems.",
          options: [
            { id: 1, text: "Strongly Disagree" },
            { id: 2, text: "Disagree" },
            { id: 3, text: "Neutral" },
            { id: 4, text: "Agree" },
            { id: 5, text: "Strongly Agree" }
          ]
        },
        {
          id: 13,
          text: "I'm interested in human psychology and understanding behavior.",
          options: [
            { id: 1, text: "Strongly Disagree" },
            { id: 2, text: "Disagree" },
            { id: 3, text: "Neutral" },
            { id: 4, text: "Agree" },
            { id: 5, text: "Strongly Agree" }
          ]
        },
        {
          id: 14,
          text: "I enjoy managing projects and coordinating different teams.",
          options: [
            { id: 1, text: "Strongly Disagree" },
            { id: 2, text: "Disagree" },
            { id: 3, text: "Neutral" },
            { id: 4, text: "Agree" },
            { id: 5, text: "Strongly Agree" }
          ]
        },
        {
          id: 15,
          text: "I like to work with visual design and user experiences.",
          options: [
            { id: 1, text: "Strongly Disagree" },
            { id: 2, text: "Disagree" },
            { id: 3, text: "Neutral" },
            { id: 4, text: "Agree" },
            { id: 5, text: "Strongly Agree" }
          ]
        }
      ]
    };

    // Technology Career Path Assessment
    const techQuiz = {
      title: "Technology Career Path Assessment",
      description: "Focus on programming, AI, cybersecurity, web development, and emerging tech fields",
      questions: [
        {
          id: 1,
          text: "I enjoy solving logic puzzles and complex problems.",
          options: [
            { id: 1, text: "Strongly Disagree" },
            { id: 2, text: "Disagree" },
            { id: 3, text: "Neutral" },
            { id: 4, text: "Agree" },
            { id: 5, text: "Strongly Agree" }
          ]
        },
        {
          id: 2,
          text: "I am interested in how software applications are built.",
          options: [
            { id: 1, text: "Strongly Disagree" },
            { id: 2, text: "Disagree" },
            { id: 3, text: "Neutral" },
            { id: 4, text: "Agree" },
            { id: 5, text: "Strongly Agree" }
          ]
        },
        {
          id: 3,
          text: "I enjoy working with visual design and user interfaces.",
          options: [
            { id: 1, text: "Strongly Disagree" },
            { id: 2, text: "Disagree" },
            { id: 3, text: "Neutral" },
            { id: 4, text: "Agree" },
            { id: 5, text: "Strongly Agree" }
          ]
        },
        {
          id: 4,
          text: "I like analyzing data and finding patterns or insights.",
          options: [
            { id: 1, text: "Strongly Disagree" },
            { id: 2, text: "Disagree" },
            { id: 3, text: "Neutral" },
            { id: 4, text: "Agree" },
            { id: 5, text: "Strongly Agree" }
          ]
        },
        {
          id: 5,
          text: "I'm interested in cybersecurity and protecting digital assets.",
          options: [
            { id: 1, text: "Strongly Disagree" },
            { id: 2, text: "Disagree" },
            { id: 3, text: "Neutral" },
            { id: 4, text: "Agree" },
            { id: 5, text: "Strongly Agree" }
          ]
        },
        {
          id: 6,
          text: "I enjoy learning new programming languages or technical skills.",
          options: [
            { id: 1, text: "Strongly Disagree" },
            { id: 2, text: "Disagree" },
            { id: 3, text: "Neutral" },
            { id: 4, text: "Agree" },
            { id: 5, text: "Strongly Agree" }
          ]
        },
        {
          id: 7,
          text: "I like bridging the gap between technical and non-technical people.",
          options: [
            { id: 1, text: "Strongly Disagree" },
            { id: 2, text: "Disagree" },
            { id: 3, text: "Neutral" },
            { id: 4, text: "Agree" },
            { id: 5, text: "Strongly Agree" }
          ]
        },
        {
          id: 8,
          text: "I enjoy optimizing systems for better performance.",
          options: [
            { id: 1, text: "Strongly Disagree" },
            { id: 2, text: "Disagree" },
            { id: 3, text: "Neutral" },
            { id: 4, text: "Agree" },
            { id: 5, text: "Strongly Agree" }
          ]
        },
        {
          id: 9,
          text: "I'm comfortable with mathematics and statistical concepts.",
          options: [
            { id: 1, text: "Strongly Disagree" },
            { id: 2, text: "Disagree" },
            { id: 3, text: "Neutral" },
            { id: 4, text: "Agree" },
            { id: 5, text: "Strongly Agree" }
          ]
        },
        {
          id: 10,
          text: "I enjoy managing technology projects and team coordination.",
          options: [
            { id: 1, text: "Strongly Disagree" },
            { id: 2, text: "Disagree" },
            { id: 3, text: "Neutral" },
            { id: 4, text: "Agree" },
            { id: 5, text: "Strongly Agree" }
          ]
        }
      ]
    };

    // Insert the quizzes
    await pool.query('INSERT INTO career_quizzes (title, description, questions) VALUES ($1, $2, $3), ($4, $5, $6)',
      [
        defaultQuiz.title,
        defaultQuiz.description,
        JSON.stringify(defaultQuiz.questions),
        techQuiz.title,
        techQuiz.description,
        JSON.stringify(techQuiz.questions)
      ]
    );

    console.log('Successfully seeded quizzes');
    await pool.end();
  } catch (error) {
    console.error('Error seeding quizzes:', error);
    process.exit(1);
  }
}

seedQuizzes();