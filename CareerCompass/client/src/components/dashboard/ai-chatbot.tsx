import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Send, Bot, User, Trash2, PlusCircle } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { ChatSession, ChatMessage } from "@shared/schema";
import { nanoid } from "nanoid";
import ReactMarkdown from "react-markdown";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

export function AIChatbot() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [activeSession, setActiveSession] = useState<ChatSession | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch user's chat sessions
  const { data: sessions, isLoading: isLoadingSessions } = useQuery<ChatSession[]>({
    queryKey: ["/api/chat-sessions"],
  });

  // Create a new chat session
  const createSessionMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/chat-sessions", {
        messages: [
          {
            id: nanoid(),
            role: "assistant",
            content: "Hello! I'm your AI career assistant. How can I help you today?",
            timestamp: new Date().toISOString(),
          },
        ],
      });
      return await res.json();
    },
    onSuccess: (newSession) => {
      queryClient.invalidateQueries({ queryKey: ["/api/chat-sessions"] });
      setActiveSession(newSession);
    },
  });

  // Send a message to the active chat session
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!activeSession) return null;
      
      const res = await apiRequest(
        "POST",
        `/api/chat-sessions/${activeSession.id}/messages`,
        { content }
      );
      return await res.json();
    },
    onSuccess: (updatedSession) => {
      if (updatedSession) {
        queryClient.invalidateQueries({ queryKey: ["/api/chat-sessions"] });
        setActiveSession(updatedSession);
      }
    },
  });

  // Start a new chat session
  const startNewChat = () => {
    createSessionMutation.mutate();
  };

  // Load a specific chat session
  const loadSession = async (session: ChatSession) => {
    setActiveSession(session);
  };
  
  // Delete all chat messages and restart chat
  const clearChat = async () => {
    if (!activeSession) return;
    
    try {
      const res = await apiRequest(
        "POST",
        `/api/chat-sessions/${activeSession.id}/messages`,
        { 
          clear: true,
          content: "Hello! I'm your AI career assistant. How can I help you today?"
        }
      );
      
      const updatedSession = await res.json();
      queryClient.invalidateQueries({ queryKey: ["/api/chat-sessions"] });
      setActiveSession(updatedSession);
      setIsDialogOpen(false);
      
      toast({
        title: "Chat cleared",
        description: "All messages have been cleared from this chat.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error clearing chat",
        description: "There was an error clearing the chat messages.",
        variant: "destructive",
      });
    }
  };

  // Handle message submission
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !activeSession) return;
    
    sendMessageMutation.mutate(message);
    setMessage("");
  };

  // Scroll to bottom of messages when they change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeSession?.messages]);

  // Set first session as active if none selected
  useEffect(() => {
    if (sessions && sessions.length > 0 && !activeSession) {
      setActiveSession(sessions[0]);
    }
  }, [sessions, activeSession]);

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (isLoadingSessions) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">AI Career Assistant</h2>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          Get personalized career advice and guidance from our AI assistant.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chat Sessions Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <Button
            className="w-full"
            onClick={startNewChat}
            disabled={createSessionMutation.isPending}
          >
            {createSessionMutation.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            )}
            New Chat
          </Button>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Chat History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {sessions && sessions.length > 0 ? (
                  sessions.map((session) => (
                    <div
                      key={session.id}
                      className={`p-3 rounded-md cursor-pointer transition-colors ${
                        activeSession?.id === session.id
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                      onClick={() => loadSession(session)}
                    >
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        <div className="truncate flex-1">
                          {session.messages[0]?.content.substring(0, 25)}...
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {session.updatedAt ? new Date(session.updatedAt).toLocaleDateString() : 'New chat'}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 dark:text-gray-400 py-4">
                    No chat history
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-3">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="border-b">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base">
                  {activeSession ? "Career Assistant Chat" : "Start a New Chat"}
                </CardTitle>
                {activeSession && (
                  <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-500" />
                        <span className="sr-only">Clear chat</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Clear chat history?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will remove all messages in this conversation. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={clearChat} className="bg-red-500 hover:bg-red-600">
                          Clear
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex-grow overflow-y-auto p-4 space-y-4">
              {activeSession ? (
                activeSession.messages.map((msg: ChatMessage) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    } animate-fadeIn`}
                  >
                    <div className="flex items-start gap-2 max-w-[85%]">
                      {msg.role !== "user" && (
                        <div className="flex-shrink-0 mt-1">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <Bot size={18} className="text-primary" />
                          </div>
                        </div>
                      )}
                      <div
                        className={`rounded-lg p-4 ${
                          msg.role === "user"
                            ? "bg-primary text-white shadow-sm"
                            : "bg-gray-100 dark:bg-gray-800 prose prose-sm dark:prose-invert max-w-none"
                        }`}
                      >
                        {msg.role === "user" ? (
                          <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        ) : (
                          <div className="text-sm break-words">
                            <ReactMarkdown>
                              {msg.content}
                            </ReactMarkdown>
                          </div>
                        )}
                        <p className="text-xs opacity-70 mt-1 text-right">
                          {formatTimestamp(msg.timestamp)}
                        </p>
                      </div>
                      {msg.role === "user" && (
                        <div className="flex-shrink-0 mt-1">
                          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                            <User size={18} className="text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-4 inline-flex mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium mb-2">
                      Start a conversation
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      Ask for career advice, resume tips, or job interview preparation
                    </p>
                    <Button onClick={startNewChat}>
                      New Chat
                    </Button>
                  </div>
                </div>
              )}
              {/* Invisible element for scrolling to bottom */}
              <div ref={messagesEndRef} />
            </CardContent>
            
            {activeSession && (
              <div className="p-4 border-t">
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    disabled={sendMessageMutation.isPending}
                    className="flex-grow"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={sendMessageMutation.isPending || !message.trim()}
                  >
                    {sendMessageMutation.isPending ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </Button>
                </form>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
