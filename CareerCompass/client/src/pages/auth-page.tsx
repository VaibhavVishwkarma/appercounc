import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { LoginForm } from "@/components/auth/login-form";
import { RegisterForm } from "@/components/auth/register-form";
import { useEffect, useState } from "react";
import { useLocation, useSearch } from "wouter";
import { useAuth } from "@/hooks/use-auth";

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [, setLocation] = useLocation();
  const search = useSearch();
  const { user } = useAuth();

  useEffect(() => {
    // Check if the URL has a signup parameter
    const params = new URLSearchParams(search);
    if (params.get("signup") === "true") {
      setIsSignUp(true);
    }
  }, [search]);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      setLocation("/dashboard");
    }
  }, [user, setLocation]);

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="pt-16 flex-grow flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Auth Form Section */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg animate-fade-in">
            <div className="mb-6 text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                {isSignUp ? "Create your account" : "Log in to your account"}
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {isSignUp ? "Already have an account? " : "Don't have an account? "}
                <button
                  onClick={toggleForm}
                  className="font-medium text-primary hover:text-primary-600"
                >
                  {isSignUp ? "Log in" : "Sign up"}
                </button>
              </p>
            </div>
            
            {isSignUp ? <RegisterForm /> : <LoginForm />}
          </div>
          
          {/* Hero Section */}
          <div className="hidden md:block p-6 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl text-white">
            <div className="max-w-md mx-auto">
              <h3 className="text-2xl font-bold mb-4">Find Your Perfect Career Path with CareerPath</h3>
              <p className="mb-6">
                Join thousands of professionals who've discovered their ideal career using our personalized tools and guidance.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg
                    className="h-6 w-6 text-secondary-300 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Personalized career recommendations based on your skills and interests</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-6 w-6 text-secondary-300 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>AI-powered career guidance available 24/7</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-6 w-6 text-secondary-300 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Professional resume templates and career resources</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-6 w-6 text-secondary-300 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Track your progress and career growth</span>
                </li>
              </ul>
              <div className="mt-8 text-center">
                <p className="text-white/80 italic">
                  "CareerPath helped me find my perfect career match and land my dream job!"
                </p>
                <p className="mt-2 font-medium">- Sarah J., Software Engineer</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
