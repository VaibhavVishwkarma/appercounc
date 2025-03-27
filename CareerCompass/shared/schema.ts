import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name"),
  email: text("email"),
  isAdmin: boolean("is_admin").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const careerQuizzes = pgTable("career_quizzes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  questions: json("questions").$type<QuizQuestion[]>().notNull(),
});

export const quizResults = pgTable("quiz_results", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  quizId: integer("quiz_id").notNull().references(() => careerQuizzes.id),
  answers: json("answers").$type<QuizAnswer[]>().notNull(),
  careerMatches: json("career_matches").$type<CareerMatch[]>().notNull(),
  takenAt: timestamp("taken_at").defaultNow(),
});

export const chatSessions = pgTable("chat_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  messages: json("messages").$type<ChatMessage[]>().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const resumeTemplates = pgTable("resume_templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  template: text("template").notNull(),
});

// Types
export type QuizQuestion = {
  id: number;
  text: string;
  options: { id: number; text: string }[];
};

export type QuizAnswer = {
  questionId: number;
  optionId: number;
};

export type CareerMatch = {
  career: string;
  matchPercentage: number;
  category?: string;
};

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
};

// Schema validation
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  email: true,
});

export const insertQuizResultSchema = createInsertSchema(quizResults).pick({
  userId: true,
  quizId: true,
  answers: true,
  careerMatches: true,
  takenAt: true,
});

export const insertChatSessionSchema = createInsertSchema(chatSessions).pick({
  userId: true,
  messages: true,
  createdAt: true,
  updatedAt: true,
});

// Types for insert and select operations
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type QuizResult = typeof quizResults.$inferSelect;
export type ChatSession = typeof chatSessions.$inferSelect;
export type ResumeTemplate = typeof resumeTemplates.$inferSelect;
export type CareerQuiz = typeof careerQuizzes.$inferSelect;
