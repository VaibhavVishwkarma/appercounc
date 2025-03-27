import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { FileText, Check, ThumbsUp, Award } from "lucide-react";

function ResumeFeature({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="flex items-center p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md mb-4 transition-all duration-300 hover:shadow-lg">
      <div className="mr-4 text-blue-600 dark:text-blue-400">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>
      </div>
    </div>
  );
}

export function ResumeBuilderSection() {
  const [, setLocation] = useLocation();

  return (
    <section id="resume-builder" className="py-16 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2 
            className="text-3xl font-bold text-gray-900 dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Build a Resume That Gets Results
          </motion.h2>
          <motion.p 
            className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Create a standout resume with expert guidance and professional templates that help you land more interviews.
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div 
            className="space-y-4 order-2 md:order-1"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <ResumeFeature 
              icon={<FileText size={24} />} 
              title="Professional Templates" 
              description="Choose from a variety of ATS-friendly templates designed by HR experts for different industries."
            />
            
            <ResumeFeature 
              icon={<Check size={24} />} 
              title="Content Suggestions" 
              description="Get personalized content recommendations for each section based on your experience and target position."
            />
            
            <ResumeFeature 
              icon={<ThumbsUp size={24} />} 
              title="AI-Powered Feedback" 
              description="Receive instant feedback on how to improve your resume's impact and readability."
            />
            
            <ResumeFeature 
              icon={<Award size={24} />} 
              title="Keyword Optimization" 
              description="Ensure your resume passes automated applicant tracking systems with industry-specific keywords."
            />
            
            <div className="pt-4">
              <Button
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-white"
                onClick={() => setLocation("/auth?signup=true")}
              >
                Create Your Resume
              </Button>
            </div>
          </motion.div>
          
          <motion.div
            className="relative order-1 md:order-2"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                  John Smith
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Software Engineer | React.js Specialist | UI/UX Enthusiast
                </p>
              </div>
              
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Summary</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Experienced software engineer with 5+ years of experience in building 
                  responsive web applications using modern frontend technologies. 
                  Passionate about creating intuitive user interfaces and optimizing 
                  performance for seamless user experiences.
                </p>
              </div>
              
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Work Experience</h4>
                <div className="mb-4">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-900 dark:text-white">Senior Frontend Developer</span>
                    <span className="text-gray-500 dark:text-gray-400 text-sm">2020 - Present</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">TechSolutions Inc.</p>
                  <ul className="list-disc pl-5 mt-2 text-sm text-gray-600 dark:text-gray-400">
                    <li>Led the development of a customer-facing portal with 50K+ daily users</li>
                    <li>Reduced load time by 40% through code optimization and lazy loading</li>
                  </ul>
                </div>
              </div>
              
              <div className="absolute top-2 right-2 text-blue-600 dark:text-blue-400 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-full">
                Preview
              </div>
            </div>
            
            <div className="absolute -bottom-4 -right-4 bg-blue-600 dark:bg-blue-700 text-white text-sm p-2 rounded-lg shadow-lg">
              <div className="flex items-center">
                <svg className="h-5 w-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>ATS-Friendly</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}