import { db } from './db';
import { 
  users, 
  careerQuizzes, 
  quizResults, 
  chatSessions, 
  resumeTemplates,
  type User,
  type InsertUser,
  type CareerQuiz,
  type QuizResult,
  type ChatSession,
  type ChatMessage,
  type ResumeTemplate
} from '../shared/schema';
import { eq } from 'drizzle-orm';
import session from 'express-session';
import createMemoryStore from 'memorystore';
import { pool } from './db';

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;
  
  constructor() {
    // Use memory store for session management to avoid database conflicts
    const MemoryStore = createMemoryStore(session);
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
    console.log('Using in-memory session store');
  }
  
  async getUser(id: number): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      return user;
    } catch (error) {
      console.error('Error getting user:', error);
      return undefined;
    }
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.username, username));
      return user;
    } catch (error) {
      console.error('Error getting user by username:', error);
      return undefined;
    }
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      const [user] = await db.insert(users).values(insertUser).returning();
      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }
  
  async getAllUsers(): Promise<User[]> {
    try {
      return await db.select().from(users);
    } catch (error) {
      console.error('Error getting all users:', error);
      return [];
    }
  }
  
  async deleteUser(id: number): Promise<boolean> {
    try {
      const result = await db.delete(users).where(eq(users.id, id)).returning({ id: users.id });
      return result.length > 0;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  }
  
  async getQuizzes(): Promise<CareerQuiz[]> {
    try {
      return await db.select().from(careerQuizzes);
    } catch (error) {
      console.error('Error getting quizzes:', error);
      return [];
    }
  }
  
  async getQuiz(id: number): Promise<CareerQuiz | undefined> {
    try {
      const [quiz] = await db.select().from(careerQuizzes).where(eq(careerQuizzes.id, id));
      return quiz;
    } catch (error) {
      console.error('Error getting quiz:', error);
      return undefined;
    }
  }
  
  async saveQuizResult(result: Omit<QuizResult, 'id'>): Promise<QuizResult> {
    try {
      // Ensure takenAt is properly set to a Date
      const resultWithDate = {
        ...result,
        takenAt: result.takenAt || new Date()
      };
      
      const [savedResult] = await db.insert(quizResults).values(resultWithDate).returning();
      return savedResult;
    } catch (error) {
      console.error('Error saving quiz result:', error);
      throw error;
    }
  }
  
  async getUserQuizResults(userId: number): Promise<QuizResult[]> {
    try {
      return await db.select().from(quizResults).where(eq(quizResults.userId, userId));
    } catch (error) {
      console.error('Error getting user quiz results:', error);
      return [];
    }
  }
  
  async getChatSessions(userId: number): Promise<ChatSession[]> {
    try {
      return await db.select().from(chatSessions).where(eq(chatSessions.userId, userId));
    } catch (error) {
      console.error('Error getting chat sessions:', error);
      return [];
    }
  }
  
  async getChatSession(id: number): Promise<ChatSession | undefined> {
    try {
      const [session] = await db.select().from(chatSessions).where(eq(chatSessions.id, id));
      return session;
    } catch (error) {
      console.error('Error getting chat session:', error);
      return undefined;
    }
  }
  
  async saveChatSession(sessionData: Partial<ChatSession>): Promise<ChatSession> {
    try {
      if (sessionData.id) {
        // Update existing session
        const [updatedSession] = await db.update(chatSessions)
          .set({
            ...sessionData,
            updatedAt: new Date()
          })
          .where(eq(chatSessions.id, sessionData.id))
          .returning();
        return updatedSession;
      } else {
        // Create new session
        const [newSession] = await db.insert(chatSessions)
          .values({
            ...sessionData as any,
            createdAt: new Date(),
            updatedAt: new Date()
          })
          .returning();
        return newSession;
      }
    } catch (error) {
      console.error('Error saving chat session:', error);
      throw error;
    }
  }
  
  async addMessageToChat(chatId: number, message: ChatMessage): Promise<ChatSession> {
    try {
      // First get the current session
      const [session] = await db.select().from(chatSessions).where(eq(chatSessions.id, chatId));
      
      if (!session) {
        throw new Error('Chat session not found');
      }
      
      // Add message to the messages array
      const updatedMessages = [...session.messages, message];
      
      // Update the session with the new message
      const [updatedSession] = await db.update(chatSessions)
        .set({
          messages: updatedMessages,
          updatedAt: new Date()
        })
        .where(eq(chatSessions.id, chatId))
        .returning();
      
      return updatedSession;
    } catch (error) {
      console.error('Error adding message to chat:', error);
      throw error;
    }
  }
  
  async getResumeTemplates(): Promise<ResumeTemplate[]> {
    try {
      return await db.select().from(resumeTemplates);
    } catch (error) {
      console.error('Error getting resume templates:', error);
      return [];
    }
  }
  
  async getResumeTemplate(id: number): Promise<ResumeTemplate | undefined> {
    try {
      const [template] = await db.select().from(resumeTemplates).where(eq(resumeTemplates.id, id));
      return template;
    } catch (error) {
      console.error('Error getting resume template:', error);
      return undefined;
    }
  }
}

// Interface for storage used in other files
import { IStorage } from './storage';