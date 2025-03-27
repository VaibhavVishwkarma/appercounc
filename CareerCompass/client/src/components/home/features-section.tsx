import { useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "framer-motion";

// Feature card component
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  backgroundColor: string;
  iconColor: string;
}

function FeatureCard({
  icon,
  title,
  description,
  ctaText,
  ctaLink,
  backgroundColor,
  iconColor,
}: FeatureCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" });
  
  return (
    <motion.div
      ref={ref}
      className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 shadow-md card-hover-effect"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5 }}
    >
      <div className={`h-14 w-14 rounded-lg flex items-center justify-center mb-6 ring-2 ${iconColor.replace('text-', 'ring-')} dark:ring-white ${backgroundColor}`}>
        <div className={`${iconColor} dark:text-white text-2xl`}>{icon}</div>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 mb-6">{description}</p>
      <a href={ctaLink} className={`inline-flex items-center ${iconColor} dark:text-white hover:${iconColor.replace('text-', 'text-')} dark:hover:text-gray-200 font-medium`}>
        {ctaText}
        <svg className="ml-2 w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </a>
    </motion.div>
  );
}

export function FeaturesSection() {
  return (
    <section id="features" className="py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl font-bold text-gray-900 dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Our Features
          </motion.h2>
          <motion.p 
            className="mt-4 text-xl text-gray-600 dark:text-gray-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Tools designed to help you succeed in your career journey
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                <path fillRule="evenodd" d="M2.25 2.25a.75.75 0 000 1.5H3v10.5a3 3 0 003 3h1.21l-1.172 3.513a.75.75 0 001.424.474l.329-.987h8.418l.33.987a.75.75 0 001.422-.474l-1.17-3.513H18a3 3 0 003-3V3.75h.75a.75.75 0 000-1.5H2.25zm6.54 15h6.42l.5 1.5H8.29l.5-1.5zm8.085-8.995a.75.75 0 10-.75-1.299 12.81 12.81 0 00-3.558 3.05L11.03 8.47a.75.75 0 00-1.06 0l-3 3a.75.75 0 101.06 1.06l2.47-2.47 1.617 1.618a.75.75 0 001.146-.102 11.312 11.312 0 013.612-3.321z" clipRule="evenodd" />
              </svg>
            }
            title="Career Quiz"
            description="Discover suitable career paths that match your personality, skills, and interests through our personalized assessment."
            ctaText="Take the Quiz"
            ctaLink="/auth"
            backgroundColor="bg-primary-100/70 dark:bg-primary-900/30"
            iconColor="text-primary"
          />
          
          <FeatureCard
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 00-1.032-.211 50.89 50.89 0 00-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 002.433 3.984L7.28 21.53A.75.75 0 016 21v-4.03a48.527 48.527 0 01-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979z" />
                <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 001.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0015.75 7.5z" />
              </svg>
            }
            title="AI Chatbot"
            description="Get instant answers to your career questions with our AI-powered assistant that provides personalized guidance."
            ctaText="Chat Now"
            ctaLink="/auth"
            backgroundColor="bg-blue-100/70 dark:bg-blue-900/30"
            iconColor="text-blue-500"
          />
          
          <FeatureCard
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                <path fillRule="evenodd" d="M5.625 1.5H9a3.75 3.75 0 013.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 013.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 01-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875zM9.75 14.25a.75.75 0 000 1.5H15a.75.75 0 000-1.5H9.75zm-.75-6.75a.75.75 0 01.75-.75h5.25a.75.75 0 010 1.5H9.75a.75.75 0 01-.75-.75z" clipRule="evenodd" />
                <path d="M14.25 5.25a5.23 5.23 0 00-1.279-3.434 9.768 9.768 0 016.963 6.963A5.23 5.23 0 0016.5 7.5h-1.875a.375.375 0 01-.375-.375V5.25z" />
              </svg>
            }
            title="Resume Tips"
            description="Learn how to craft a compelling resume that stands out to employers with our expert advice and templates."
            ctaText="View Resources"
            ctaLink="/auth"
            backgroundColor="bg-green-100/70 dark:bg-green-900/30"
            iconColor="text-green-500"
          />
        </div>
      </div>
    </section>
  );
}
