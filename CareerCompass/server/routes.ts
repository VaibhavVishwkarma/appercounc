import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { 
  insertQuizResultSchema, 
  insertChatSessionSchema, 
  type QuizAnswer, 
  type CareerMatch, 
  type ChatMessage 
} from "../shared/schema";
import { nanoid } from "nanoid";
import { getCareerAdvice, getResumeFeedback, analyzeCareerQuizResults, chatConversation } from "./openai";

// Helper to handle async controller functions with any return type
const asyncHandler = (fn: (req: Request, res: Response) => Promise<any>) => {
  return async (req: Request, res: Response) => {
    try {
      await fn(req, res);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ error: validationError.message });
      }
      console.error("Error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };
};

// Check authentication middleware
const isAuthenticated = (req: Request, res: Response, next: Function) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: "Unauthorized" });
};

// Check admin role middleware
const isAdmin = (req: Request, res: Response, next: Function) => {
  // req.user.isAdmin is defined in the schema but TypeScript doesn't recognize it
  // because of the Express.User interface extension
  const user = req.user as (Express.User & { isAdmin?: boolean });
  if (req.isAuthenticated() && user?.isAdmin) {
    return next();
  }
  return res.status(403).json({ error: "Forbidden" });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // Quiz routes
  app.get("/api/quizzes", asyncHandler(async (req, res) => {
    const quizzes = await storage.getQuizzes();
    res.json(quizzes);
  }));

  app.get("/api/quizzes/:id", asyncHandler(async (req, res) => {
    const quiz = await storage.getQuiz(parseInt(req.params.id));
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }
    res.json(quiz);
  }));

  app.post("/api/quiz-results", isAuthenticated, asyncHandler(async (req, res) => {
    // Use type assertion to access user ID
    const user = req.user as (Express.User & { id: number });
    
    // Convert answers and careerMatches to proper types with type assertion
    const answers = Array.isArray(req.body.answers) ? req.body.answers : [];
    const careerMatches = Array.isArray(req.body.careerMatches) ? req.body.careerMatches : [];
    
    // Parse quiz result, ensuring answers and careerMatches are the right type
    const result = insertQuizResultSchema.parse({
      ...req.body,
      userId: user.id,
      // Use explicit typing to avoid implicit any
      answers: answers.map((a: any) => ({ 
        questionId: parseInt(a.questionId), 
        optionId: parseInt(a.optionId) 
      })) as QuizAnswer[],
      careerMatches: careerMatches.map((c: any) => ({ 
        career: String(c.career), 
        matchPercentage: Number(c.matchPercentage),
        category: c.category ? String(c.category) : undefined
      })) as CareerMatch[],
      takenAt: new Date() // Add the current date as the taken date
    });
    
    const savedResult = await storage.saveQuizResult(result);
    res.status(201).json(savedResult);
  }));

  app.get("/api/user/quiz-results", isAuthenticated, asyncHandler(async (req, res) => {
    const user = req.user as (Express.User & { id: number });
    const results = await storage.getUserQuizResults(user.id);
    res.json(results);
  }));

  // Chat routes
  app.get("/api/chat-sessions", isAuthenticated, asyncHandler(async (req, res) => {
    const user = req.user as (Express.User & { id: number });
    const sessions = await storage.getChatSessions(user.id);
    res.json(sessions);
  }));

  app.post("/api/chat-sessions", isAuthenticated, asyncHandler(async (req, res) => {
    const user = req.user as (Express.User & { id: number });
    // Convert messages to proper type with type assertion
    const messages = Array.isArray(req.body.messages) ? req.body.messages : [];
    
    // Parse chat session, properly formatting messages
    const session = insertChatSessionSchema.parse({
      ...req.body,
      userId: user.id,
      messages: messages.map((m: any) => ({
        id: m.id || nanoid(),
        role: m.role as ('user' | 'assistant'),
        content: String(m.content),
        timestamp: m.timestamp || new Date().toISOString()
      })) as ChatMessage[],
      createdAt: new Date(),
      updatedAt: new Date()
    });
    const savedSession = await storage.saveChatSession(session);
    res.status(201).json(savedSession);
  }));

  app.get("/api/chat-sessions/:id", isAuthenticated, asyncHandler(async (req, res) => {
    const user = req.user as (Express.User & { id: number });
    const session = await storage.getChatSession(parseInt(req.params.id));
    if (!session || session.userId !== user.id) {
      return res.status(404).json({ error: "Chat session not found" });
    }
    res.json(session);
  }));

  app.post("/api/chat-sessions/:id/messages", isAuthenticated, asyncHandler(async (req, res) => {
    const user = req.user as (Express.User & { id: number });
    const chatId = parseInt(req.params.id);
    const session = await storage.getChatSession(chatId);
    
    if (!session || session.userId !== user.id) {
      return res.status(404).json({ error: "Chat session not found" });
    }
    
    // Handle clear chat request
    if (req.body.clear === true) {
      // Create a welcome message
      const welcomeMessage = {
        id: nanoid(),
        role: 'assistant' as const,
        content: req.body.content || "Hello! I'm your AI career assistant. How can I help you today?",
        timestamp: new Date().toISOString()
      };
      
      // Clear the chat by creating a new session with just the welcome message
      const clearedSession = {
        ...session,
        messages: [welcomeMessage],
        updatedAt: new Date()
      };
      
      const updatedSession = await storage.saveChatSession(clearedSession);
      return res.json(updatedSession);
    }
    
    // Handle regular message
    const userMessage = {
      id: nanoid(),
      role: 'user' as const,
      content: req.body.content,
      timestamp: new Date().toISOString()
    };
    
    // Save the user message
    await storage.addMessageToChat(chatId, userMessage);
    
    try {
      // Get previous messages to provide context
      const previousMessages = session.messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      // Add the current user message
      previousMessages.push({
        role: userMessage.role,
        content: userMessage.content
      });
      
      // Get AI response using OpenRouter
      const aiResponse = await chatConversation(previousMessages);
      
      // Create AI response message
      const aiMessage = {
        id: nanoid(),
        role: 'assistant' as const,
        content: aiResponse,
        timestamp: new Date().toISOString()
      };
      
      // Save the AI response
      const updatedSession = await storage.addMessageToChat(chatId, aiMessage);
      res.json(updatedSession);
    } catch (error) {
      console.error("Error getting AI response:", error);
      
      // Fallback response if AI service fails
      const fallbackMessage = {
        id: nanoid(),
        role: 'assistant' as const,
        content: "I'm having trouble connecting to my knowledge base right now. Please try again in a moment.",
        timestamp: new Date().toISOString()
      };
      
      const updatedSession = await storage.addMessageToChat(chatId, fallbackMessage);
      res.json(updatedSession);
    }
  }));

  // Resume routes
  app.get("/api/resume-templates", asyncHandler(async (req, res) => {
    const templates = await storage.getResumeTemplates();
    res.json(templates);
  }));

  app.get("/api/resume-templates/:id", asyncHandler(async (req, res) => {
    const template = await storage.getResumeTemplate(parseInt(req.params.id));
    if (!template) {
      return res.status(404).json({ error: "Template not found" });
    }
    res.json(template);
  }));

  // Admin routes
  app.get("/api/admin/users", isAdmin, asyncHandler(async (req, res) => {
    const users = await storage.getAllUsers();
    res.json(users);
  }));

  app.delete("/api/admin/users/:id", isAdmin, asyncHandler(async (req, res) => {
    const userId = parseInt(req.params.id);
    const success = await storage.deleteUser(userId);
    if (!success) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(204).send();
  }));

  const httpServer = createServer(app);
  return httpServer;
}