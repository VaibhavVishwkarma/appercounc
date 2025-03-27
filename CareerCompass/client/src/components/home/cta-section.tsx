import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function CtaSection() {
  const [, setLocation] = useLocation();

  return (
    <section id="cta" className="py-16 dark:bg-gray-800 bg-slate-50 border-t border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h2 
          className="text-3xl font-bold text-gray-900 dark:text-white mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Ready to Find Your Perfect Career?
        </motion.h2>
        
        <motion.p 
          className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Join thousands of professionals who've discovered their ideal career path with our personalized guidance tools.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Button 
            size="lg"
            variant="default"
            className="bg-primary hover:bg-primary/90 text-white dark:text-white shadow-lg transition-all duration-300 text-lg font-semibold px-10 py-6 rounded-lg"
            onClick={() => setLocation("/auth?signup=true")}
          >
            Get Started for Free
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
