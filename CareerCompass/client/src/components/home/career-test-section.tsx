import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Lightbulb, Target, Award, Brain } from "lucide-react";

function FeaturePoint({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="flex items-start mb-6">
      <div className="bg-primary/10 p-2 rounded-lg mr-4 text-primary">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-1 text-gray-900 dark:text-white">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300">{description}</p>
      </div>
    </div>
  );
}

export function CareerTestSection() {
  const [, setLocation] = useLocation();

  return (
    <section id="career-test" className="py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Discover Your Perfect Career Match</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Our sophisticated career assessment tools analyze your personality traits, skills, interests, and values to 
              provide personalized career recommendations that truly fit your unique profile.
            </p>
            
            <div className="space-y-4">
              <FeaturePoint 
                icon={<Lightbulb size={24} />} 
                title="Personality Assessment" 
                description="Understand how your personality traits align with different career paths and work environments."
              />
              
              <FeaturePoint 
                icon={<Target size={24} />} 
                title="Skills Matching" 
                description="Identify careers that leverage your existing skills and pinpoint areas for development."
              />
              
              <FeaturePoint 
                icon={<Award size={24} />} 
                title="Interest Analysis" 
                description="Discover careers that align with your passions and will keep you engaged long-term."
              />
              
              <FeaturePoint 
                icon={<Brain size={24} />} 
                title="Values Alignment" 
                description="Find careers that resonate with your core values and life priorities."
              />
            </div>
            
            <div className="mt-8">
              <Button
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-white"
                onClick={() => setLocation("/auth?signup=true")}
              >
                Take the Career Test
              </Button>
            </div>
          </motion.div>
          
          <motion.div
            className="rounded-lg overflow-hidden shadow-xl"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <img 
              src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
              alt="Person taking a career test"
              className="w-full h-auto rounded-lg shadow-lg"
            />
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-b-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="text-xl font-bold text-gray-900 dark:text-white">Career Match Results</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Sample Preview</div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-gray-900 dark:text-white">Software Developer</span>
                    <span className="text-primary font-semibold">92%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>
                
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-gray-900 dark:text-white">UX/UI Designer</span>
                    <span className="text-primary font-semibold">85%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-gray-900 dark:text-white">Data Analyst</span>
                    <span className="text-primary font-semibold">78%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}