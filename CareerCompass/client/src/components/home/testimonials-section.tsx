import { useRef } from "react";
import { useInView } from "framer-motion";
import { motion } from "framer-motion";

// Testimonial component
interface TestimonialProps {
  imageSrc: string;
  name: string;
  title: string;
  quote: string;
  rating: number;
  delay: number;
}

function Testimonial({ imageSrc, name, title, quote, rating, delay }: TestimonialProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" });
  
  return (
    <motion.div
      ref={ref}
      className="bg-white dark:bg-gray-700 rounded-xl p-8 shadow-md"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="flex items-center mb-6">
        <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-600 overflow-hidden">
          <img src={imageSrc} alt={`${name} avatar`} className="h-full w-full object-cover" />
        </div>
        <div className="ml-4">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{name}</h4>
          <p className="text-sm text-gray-500 dark:text-gray-300">{title}</p>
        </div>
      </div>
      <p className="text-gray-600 dark:text-gray-300">{quote}</p>
      <div className="mt-4 flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg 
            key={i}
            className={`w-5 h-5 ${i < rating ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    </motion.div>
  );
}

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-16 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl font-bold text-gray-900 dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            What Our Users Say
          </motion.h2>
          <motion.p 
            className="mt-4 text-xl text-gray-600 dark:text-gray-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Success stories from those who've found their perfect career path
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Testimonial
            imageSrc="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
            name="Sarah Johnson"
            title="Software Engineer"
            quote="The career quiz accurately suggested software engineering as my ideal path. Two years later, I'm thriving in my dream job at a tech company!"
            rating={5}
            delay={0}
          />
          
          <Testimonial
            imageSrc="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
            name="Michael Chen"
            title="Marketing Director"
            quote="The resume tips transformed my application materials. I received multiple interview offers and landed a job with a 30% salary increase!"
            rating={4.5}
            delay={0.1}
          />
          
          <Testimonial
            imageSrc="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
            name="Priya Sharma"
            title="Healthcare Administrator"
            quote="The AI chatbot helped me navigate a career change to healthcare. The personalized guidance made the transition so much easier!"
            rating={5}
            delay={0.2}
          />
        </div>
      </div>
    </section>
  );
}
