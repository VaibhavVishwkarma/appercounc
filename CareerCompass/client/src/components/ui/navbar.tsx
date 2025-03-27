import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MenuIcon, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  // Function to scroll to section
  const scrollToSection = (sectionId: string, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
    }
    
    const element = document.getElementById(sectionId);
    if (element) {
      // Offset for fixed navbar
      const navbarHeight = 64; // 4rem or 64px
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      
      // Set active section 
      setActiveSection(sectionId);
    }
  };

  // Function to determine if a section is active
  const isActive = (path: string) => {
    if (path === "/") {
      return activeSection === "home";
    }
    const sectionId = path.replace("/#", "");
    return activeSection === sectionId;
  };

  // Implement scrollspy
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      
      // Get all sections
      const sections = ["home", "features", "career-test", "resume-builder", "testimonials", "cta"];
      const sectionElements = sections.map(section => 
        section === "home" 
          ? document.querySelector("main > div:first-child") 
          : document.getElementById(section)
      );
      
      // Find the current active section based on scroll position
      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const element = sectionElements[i];
        if (element) {
          const top = element.getBoundingClientRect().top + window.pageYOffset;
          // Offset to trigger active state before reaching the section
          if (scrollPosition >= top - 200) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", path: "/", sectionId: "home" },
    { name: "Features", path: "/#features", sectionId: "features" },
    { name: "Career Test", path: "/#career-test", sectionId: "career-test" },
    { name: "Resume Builder", path: "/#resume-builder", sectionId: "resume-builder" },
  ];

  return (
    <nav className="bg-white shadow-md dark:bg-gray-800 fixed w-full z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <div className="font-bold text-2xl cursor-pointer logo-container" onClick={() => window.location.href = "/"}>
              <span className="text-primary dark:text-blue-400">Career</span><span className="text-blue-600 dark:text-blue-300">Path</span>
            </div>
          </div>
          
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navItems.map((item) => (
              <div 
                key={item.path} 
                onClick={(e) => {
                  if (item.path === "/") {
                    window.location.href = "/";
                  } else {
                    e.preventDefault();
                    scrollToSection(item.sectionId, e);
                  }
                }}
                className={`px-3 py-2 text-sm font-medium transition-colors duration-200 cursor-pointer ${
                  isActive(item.path)
                    ? "text-primary border-b-2 border-primary"
                    : "text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-400"
                }`}
              >
                {item.name}
              </div>
            ))}
            
            {user ? (
              <>
                <div className="flex items-center border-l pl-4 ml-2 border-gray-200 dark:border-gray-700">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-medium mr-2">
                    {user.username.substring(0, 1).toUpperCase()}
                  </div>
                  <div className="text-sm font-medium mr-4 text-gray-700 dark:text-gray-200">
                    {user.username}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        window.location.href = "/dashboard";
                      }}
                    >
                      Dashboard
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        logoutMutation.mutate();
                      }}
                    >
                      Log Out
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    window.location.href = "/auth";
                  }}
                >
                  Log In
                </Button>
                <Button
                  variant="default"
                  onClick={() => {
                    window.location.href = "/auth?signup=true";
                  }}
                >
                  Sign Up
                </Button>
              </>
            )}
            
            <ModeToggle />
          </div>
          
          <div className="flex md:hidden items-center space-x-2">
            <ModeToggle />
            
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MenuIcon className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[80%] sm:w-[350px]">
                <div className="flex flex-col space-y-4 mt-8">
                  {navItems.map((item) => (
                    <div
                      key={item.path}
                      className={`px-4 py-2 rounded-md text-sm font-medium cursor-pointer ${
                        isActive(item.path)
                          ? "bg-primary/10 text-primary"
                          : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                      onClick={(e) => {
                        if (item.path === "/") {
                          window.location.href = "/";
                        } else {
                          e.preventDefault();
                          scrollToSection(item.sectionId, e);
                        }
                        setMobileMenuOpen(false);
                      }}
                    >
                      {item.name}
                    </div>
                  ))}
                  
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-2">
                    {user ? (
                      <>
                        <div className="flex items-center mb-4 px-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-medium mr-2">
                            {user.username.substring(0, 1).toUpperCase()}
                          </div>
                          <div className="text-sm font-medium text-gray-700 dark:text-gray-200">
                            Welcome, {user.username}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          className="w-full justify-start mb-2"
                          onClick={() => {
                            window.location.href = "/dashboard";
                            setMobileMenuOpen(false);
                          }}
                        >
                          Dashboard
                        </Button>
                        <Button
                          variant="destructive"
                          className="w-full justify-start"
                          onClick={() => {
                            logoutMutation.mutate();
                            setMobileMenuOpen(false);
                          }}
                        >
                          Log Out
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          className="w-full justify-start mb-2"
                          onClick={() => {
                            window.location.href = "/auth";
                            setMobileMenuOpen(false);
                          }}
                        >
                          Log In
                        </Button>
                        <Button
                          variant="default"
                          className="w-full justify-start"
                          onClick={() => {
                            window.location.href = "/auth?signup=true";
                            setMobileMenuOpen(false);
                          }}
                        >
                          Sign Up
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
