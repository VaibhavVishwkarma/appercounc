import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { HeroSection } from "@/components/home/hero-section";
import { FeaturesSection } from "@/components/home/features-section";
import { CareerTestSection } from "@/components/home/career-test-section";
import { ResumeBuilderSection } from "@/components/home/resume-builder-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { CtaSection } from "@/components/home/cta-section";
import { useEffect } from "react";

export default function HomePage() {
  useEffect(() => {
    // Animation on scroll functionality
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    const checkScroll = () => {
      animatedElements.forEach(el => {
        const elementTop = el.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
          el.classList.add('visible');
        }
      });
    };
    
    window.addEventListener('scroll', checkScroll);
    // Initial check on page load
    checkScroll();
    
    return () => {
      window.removeEventListener('scroll', checkScroll);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <FeaturesSection />
        <CareerTestSection />
        <ResumeBuilderSection />
        <TestimonialsSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
