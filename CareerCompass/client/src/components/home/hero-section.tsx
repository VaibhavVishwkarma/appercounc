import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function HeroSection() {
  const [, setLocation] = useLocation();

  return (
    <section id="home" className="relative bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-900 dark:to-indigo-900 overflow-hidden">
      <div className="absolute inset-0 bg-opacity-70 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-blue-800/90 dark:from-blue-900/90 dark:to-indigo-900/90"></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 lg:py-32 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="hero-text"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Ready to Find Your{" "}
              <span className="text-blue-300 dark:text-blue-200">Perfect Career?</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-white">
              Join thousands of professionals who've discovered their ideal career path with our personalized guidance tools.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-gray-100 transition-all duration-300"
                onClick={() => setLocation("/auth?signup=true")}
              >
                Start Your Journey
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent text-white border-2 border-white hover:bg-white/10 transition-all duration-300"
                onClick={() => {
                  const featuresSection = document.getElementById("features");
                  if (featuresSection) {
                    featuresSection.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                Learn More
              </Button>
            </div>
          </motion.div>
          <motion.div
            className="hidden md:block relative"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
              alt="People discussing career opportunities"
              className="rounded-lg shadow-2xl"
              style={{ width: "100%", maxHeight: "400px", objectFit: "cover" }}
            />
          </motion.div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white dark:from-gray-900 to-transparent"></div>
    </section>
  );
}
