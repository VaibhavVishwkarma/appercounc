import { useState, useEffect } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { AdvancedCareerQuiz } from "@/components/dashboard/advanced-career-quiz";
import { ResumeTips } from "@/components/dashboard/resume-tips";
import { AIChatbot } from "@/components/dashboard/ai-chatbot";
import { Profile } from "@/components/dashboard/profile";
import { useParams, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { X, Menu, Bell } from "lucide-react";

export default function DashboardPage() {
  const { section } = useParams<{ section?: string }>();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  // Set active section based on URL param or default to "dashboard"
  const [activeSection, setActiveSection] = useState("dashboard");

  useEffect(() => {
    if (section) {
      setActiveSection(section);
    } else {
      setActiveSection("dashboard");
    }
  }, [section]);

  // Determine which component to render based on active section
  const renderContent = () => {
    switch (activeSection) {
      case "quiz":
        return <AdvancedCareerQuiz />;
      case "resume":
        return <ResumeTips />;
      case "chatbot":
        return <AIChatbot />;
      case "profile":
        return <Profile />;
      default:
        return (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Welcome back, {user?.name || user?.username}!
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Here's what's happening with your career journey.
            </p>
            
            {/* Dashboard Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {/* Stats Cards */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Completed Quizzes</h3>
                  <span className="inline-flex items-center justify-center p-2 bg-primary-100 dark:bg-primary/20 text-primary rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </span>
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">2</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Last completed: Career Interests Assessment</p>
                <Button 
                  variant="ghost" 
                  className="mt-4 w-full"
                  onClick={() => setLocation("/dashboard/quiz")}
                >
                  Take Another Quiz
                </Button>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">AI Chat Sessions</h3>
                  <span className="inline-flex items-center justify-center p-2 bg-secondary-100 dark:bg-secondary-900/30 text-secondary-500 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </span>
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">7</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Last session: 2 days ago</p>
                <Button 
                  variant="ghost" 
                  className="mt-4 w-full"
                  onClick={() => setLocation("/dashboard/chatbot")}
                >
                  Start New Chat
                </Button>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Resume Downloads</h3>
                  <span className="inline-flex items-center justify-center p-2 bg-green-100 dark:bg-green-900/30 text-green-500 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </span>
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">3</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Last download: Modern Template</p>
                <Button 
                  variant="ghost" 
                  className="mt-4 w-full"
                  onClick={() => setLocation("/dashboard/resume")}
                >
                  View Templates
                </Button>
              </div>
            </div>

            {/* Career Recommendations */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm mt-8">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Your Career Recommendations</h3>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700 flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">UX/UI Designer</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">95% match with your skills and interests</p>
                  </div>
                  <Button size="sm">Learn More</Button>
                </div>
                <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700 flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Product Manager</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">88% match with your skills and interests</p>
                  </div>
                  <Button size="sm">Learn More</Button>
                </div>
                <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700 flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Digital Marketing Specialist</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">82% match with your skills and interests</p>
                  </div>
                  <Button size="sm">Learn More</Button>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar
        activeSection={activeSection}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 md:ml-64 flex flex-col">
        {/* Top Navigation */}
        <header className="bg-white dark:bg-gray-800 shadow-sm z-10 flex items-center justify-between h-16 px-6">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden mr-2"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-medium text-gray-900 dark:text-white hidden md:block">
              {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <ModeToggle />
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
            </Button>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
