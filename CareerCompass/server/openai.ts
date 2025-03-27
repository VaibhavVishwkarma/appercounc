import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

// Initialize OpenAI client
export const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1"
});

// Helper function to get career advice
export async function getCareerAdvice(userPrompt: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are a professional career counselor with expertise in various industries. Provide detailed, personalized career advice based on the user's query. Include information about industry trends, required skills, education, and practical next steps. Your advice should be specific, actionable, and supportive."
        },
        {
          role: "user",
          content: userPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    return response.choices[0].message.content || "I couldn't generate advice at the moment. Please try again later.";
  } catch (error) {
    console.error("Error getting career advice:", error);
    return "I'm having trouble connecting to my knowledge base right now. Please try again in a moment.";
  }
}

// Helper function to get resume feedback
export async function getResumeFeedback(resumeText: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are an expert resume reviewer with years of experience in HR and recruiting across multiple industries. Provide detailed, constructive feedback on the resume content. Focus on structure, content, impact statements, skills representation, and overall effectiveness. Suggest specific improvements."
        },
        {
          role: "user",
          content: `Please review my resume and provide detailed feedback:\n\n${resumeText}`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    return response.choices[0].message.content || "I couldn't analyze the resume at the moment. Please try again later.";
  } catch (error) {
    console.error("Error getting resume feedback:", error);
    return "I'm having trouble connecting to my knowledge base right now. Please try again in a moment.";
  }
}

// Helper function to analyze career quiz results
export async function analyzeCareerQuizResults(answers: any[], userSkills: string[]): Promise<string> {
  try {
    const userAnswersText = answers.map((answer, index) => 
      `Question ${index + 1}: ${answer.questionText} - Answer: ${answer.optionText}`
    ).join("\n");
    
    const skillsText = userSkills.length > 0 
      ? `User's self-reported skills: ${userSkills.join(", ")}`
      : "No specific skills provided by the user.";
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are a career counseling AI specializing in analyzing career assessment results. Based on the user's quiz answers and skills, provide a detailed analysis of suitable career paths. For each recommended career, include necessary skills, education requirements, growth prospects, and why it might be a good fit based on their answers. Provide at least 3 career recommendations in order of relevance."
        },
        {
          role: "user",
          content: `Here are my career assessment results:\n\n${userAnswersText}\n\n${skillsText}\n\nPlease analyze these results and recommend suitable career paths for me with detailed explanations.`
        }
      ],
      temperature: 0.7,
      max_tokens: 1500
    });

    return response.choices[0].message.content || "I couldn't analyze your quiz results at the moment. Please try again later.";
  } catch (error) {
    console.error("Error analyzing quiz results:", error);
    return "I'm having trouble connecting to my knowledge base right now. Please try again in a moment.";
  }
}

// Helper function for the AI chat conversation
export async function chatConversation(messages: any[]): Promise<string> {
  try {
    // Prepare the conversation with a system message
    const systemMessage = {
      role: "system",
      content: "You are an AI career counselor named CareerGuide, specialized in providing career advice, job search strategies, resume tips, interview preparation, and professional development guidance. Your responses should be informative, supportive, and actionable. You can explain career paths, suggest resources for skill development, and provide industry insights. If you don't know something specific, acknowledge it and provide general guidance instead of making up facts."
    };
    
    const conversationHistory = [systemMessage, ...messages];
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: conversationHistory,
      temperature: 0.7,
      max_tokens: 1000
    });

    return response.choices[0].message.content || "I couldn't generate a response at the moment. Please try again later.";
  } catch (error) {
    console.error("Error in chat conversation:", error);
    return "I'm having trouble connecting to my knowledge base right now. Please try again in a moment.";
  }
}