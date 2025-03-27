import { 
  type User, 
  type InsertUser, 
  type CareerQuiz, 
  type QuizResult, 
  type ChatSession, 
  type ChatMessage, 
  type ResumeTemplate 
} from "@shared/schema";
import { DatabaseStorage } from "./database-storage";
import session from "express-session";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  deleteUser(id: number): Promise<boolean>;
  
  // Quiz methods
  getQuizzes(): Promise<CareerQuiz[]>;
  getQuiz(id: number): Promise<CareerQuiz | undefined>;
  saveQuizResult(result: Omit<QuizResult, 'id'>): Promise<QuizResult>;
  getUserQuizResults(userId: number): Promise<QuizResult[]>;
  
  // Chat methods
  getChatSessions(userId: number): Promise<ChatSession[]>;
  getChatSession(id: number): Promise<ChatSession | undefined>;
  saveChatSession(session: Partial<ChatSession>): Promise<ChatSession>;
  addMessageToChat(chatId: number, message: ChatMessage): Promise<ChatSession>;
  
  // Resume methods
  getResumeTemplates(): Promise<ResumeTemplate[]>;
  getResumeTemplate(id: number): Promise<ResumeTemplate | undefined>;
  
  // Session store
  sessionStore: session.Store;
}

// Export the database storage instance
export const storage = new DatabaseStorage();