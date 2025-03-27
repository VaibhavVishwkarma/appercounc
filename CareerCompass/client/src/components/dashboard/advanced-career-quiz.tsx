import React, { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { CareerQuiz as CareerQuizModel, QuizAnswer, CareerMatch } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  LabelList
} from "recharts";
import { 
  Loader2, 
  CheckCircle2, 
  DollarSign, 
  GraduationCap, 
  Briefcase,
  Cpu,
  Palette,
  Building,
  HardHat,
  Stethoscope,
  Info,
  ChevronRight,
  Clock,
  AlertCircle,
  LineChart,
  BookOpen,
  Brain,
  Users,
  Heart
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// Define quiz type
type QuizType = CareerQuizModel & {
  questions: {
    id: number;
    text: string;
    options: { id: number; text: string }[];
  }[];
};

// Define career details type
type CareerDetail = {
  salaryIndia: string;
  salaryGlobal: string;
  skills: string[];
  education: string;
  description: string;
  growthOutlook: string;
  workEnvironment: string;
  icon: React.ReactNode;
};

export function AdvancedCareerQuiz() {
  const { user } = useAuth();
  const { toast } = useToast();

  // State variables
  const [activeQuiz, setActiveQuiz] = useState<QuizType | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [quizComplete, setQuizComplete] = useState(false);
  const [quizResults, setQuizResults] = useState<CareerMatch[]>([]);
  const [displayCount, setDisplayCount] = useState(3); // Default to show top 3

  // Fetch available quizzes
  const { data: quizzes, isLoading: isLoadingQuizzes } = useQuery({
    queryKey: ["/api/quizzes"],
    queryFn: async () => {
      const res = await fetch("/api/quizzes");
      if (!res.ok) throw new Error("Failed to fetch quizzes");
      return res.json() as Promise<QuizType[]>;
    },
  });

  // Submit quiz mutation
  const submitQuizMutation = useMutation({
    mutationFn: async (data: { quizId: number; answers: QuizAnswer[] }) => {
      // Calculate career matches on the client
      const careerMatches = calculateCareerMatches(data.answers);
      
      // Log the career matches to debug
      console.log("Calculated career matches:", careerMatches);

      // Submit to API
      const result = await apiRequest("POST", "/api/quiz-results", {
        quizId: data.quizId,
        answers: data.answers,
        careerMatches,
      });
      
      return { careerMatches };
    },
    onSuccess: (data) => {
      console.log("Career matches from response:", data.careerMatches);
      setQuizResults(data.careerMatches);
      setQuizComplete(true);
      queryClient.invalidateQueries({ queryKey: ["/api/user/quiz-results"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "An error occurred while submitting your quiz results. Please try again.",
        variant: "destructive",
      });
      console.error("Error submitting quiz:", error);
    }
  });

  // Career details for all career paths
  const careerDetails: Record<string, CareerDetail> = {
    // Technology
    "Software Developer": {
      salaryIndia: "₹3.5L - ₹20L",
      salaryGlobal: "$60K - $150K",
      skills: ["Programming", "Problem Solving", "Algorithms", "Git", "Database Design"],
      education: "Bachelor's/Master's in Computer Science or related field",
      description: "Designs, builds, and maintains computer programs and applications. Works with various programming languages and frameworks to create software solutions for businesses and consumers.",
      growthOutlook: "Excellent - 22% growth expected over the next decade",
      workEnvironment: "Office setting, remote work options, collaborative teams",
      icon: <Cpu className="h-8 w-8 text-blue-500" />
    },
    "Frontend Developer": {
      salaryIndia: "₹3L - ₹18L",
      salaryGlobal: "$60K - $130K",
      skills: ["HTML/CSS", "JavaScript", "React/Vue/Angular", "Responsive Design", "UI Frameworks"],
      education: "Bachelor's in Computer Science or related field + portfolio",
      description: "Specializes in building the user-facing parts of websites and applications. Creates responsive, interactive interfaces that provide a seamless user experience across devices.",
      growthOutlook: "Very Good - 18% growth expected over the next decade",
      workEnvironment: "Tech companies, agencies, startups, remote work options",
      icon: <Cpu className="h-8 w-8 text-indigo-500" />
    },
    "Backend Developer": {
      salaryIndia: "₹4L - ₹22L",
      salaryGlobal: "$65K - $140K", 
      skills: ["Server-side Languages", "Database Management", "API Development", "Security", "Cloud Services"],
      education: "Bachelor's in Computer Science or related field",
      description: "Focuses on server-side architecture and logic. Builds and maintains the technology that powers the databases, APIs, and core application functionality behind the scenes.",
      growthOutlook: "Very Good - 20% growth expected over the next decade",
      workEnvironment: "Tech companies, enterprise IT departments, remote work options",
      icon: <Cpu className="h-8 w-8 text-green-500" />
    },
    "Data Scientist": {
      salaryIndia: "₹5L - ₹25L",
      salaryGlobal: "$70K - $160K",
      skills: ["Statistics", "Machine Learning", "Python/R", "Data Visualization", "SQL"],
      education: "Master's/PhD in Data Science, Statistics, Computer Science or related field",
      description: "Analyzes complex data to find patterns and insights that help businesses make better decisions. Combines expertise in statistics, programming, and domain knowledge.",
      growthOutlook: "Excellent - 35% growth expected over the next decade",
      workEnvironment: "Corporate office, research labs, remote work options",
      icon: <LineChart className="h-8 w-8 text-blue-500" />
    },
    "UX/UI Designer": {
      salaryIndia: "₹3L - ₹18L",
      salaryGlobal: "$55K - $120K",
      skills: ["User Research", "Wireframing", "Prototyping", "Figma/Sketch", "Visual Design"],
      education: "Bachelor's in Design, HCI, or related field + portfolio",
      description: "Creates intuitive and engaging digital interfaces that enhance user experience. Combines visual design with usability principles to make products user-friendly.",
      growthOutlook: "Very Good - 15% growth expected over the next decade",
      workEnvironment: "Design studios, tech companies, agencies, remote work options",
      icon: <Palette className="h-8 w-8 text-purple-500" />
    },
    "IT Project Manager": {
      salaryIndia: "₹8L - ₹30L",
      salaryGlobal: "$80K - $140K",
      skills: ["Project Planning", "Team Leadership", "Risk Management", "Stakeholder Communication", "Agile/Scrum"],
      education: "Bachelor's in CS/IT + PMP/Agile certification",
      description: "Oversees technical projects from initiation to completion, managing resources, schedules, and teams to ensure successful delivery of IT initiatives.",
      growthOutlook: "Good - 11% growth expected over the next decade",
      workEnvironment: "Corporate offices, hybrid work models",
      icon: <Briefcase className="h-8 w-8 text-blue-500" />
    },
    "Cybersecurity Analyst": {
      salaryIndia: "₹4L - ₹22L",
      salaryGlobal: "$65K - $150K",
      skills: ["Network Security", "Penetration Testing", "Security Protocols", "Risk Assessment", "Incident Response"],
      education: "Bachelor's in Cybersecurity, Computer Science + certifications",
      description: "Protects organizations' computer systems and networks from cyber threats, implementing security measures and monitoring for breaches.",
      growthOutlook: "Excellent - 33% growth expected over the next decade",
      workEnvironment: "Security operations centers, corporate IT departments",
      icon: <Briefcase className="h-8 w-8 text-red-500" />
    },
    "DevOps Engineer": {
      salaryIndia: "₹5L - ₹25L",
      salaryGlobal: "$70K - $150K",
      skills: ["CI/CD", "Cloud Services", "Automation", "Containerization", "Infrastructure as Code"],
      education: "Bachelor's in Computer Science or related field + certifications",
      description: "Bridges the gap between development and operations by automating and streamlining software delivery processes. Implements CI/CD pipelines and manages cloud infrastructure.",
      growthOutlook: "Excellent - 25% growth expected over the next decade",
      workEnvironment: "Tech companies, enterprise IT departments, remote work options",
      icon: <Cpu className="h-8 w-8 text-amber-500" />
    },
    "Technical Writer": {
      salaryIndia: "₹3L - ₹15L",
      salaryGlobal: "$50K - $110K",
      skills: ["Writing", "Technical Documentation", "Information Architecture", "API Documentation", "Research"],
      education: "Bachelor's in English, Technical Communication, or related field",
      description: "Creates clear documentation and guides for technical products, software, and systems that help users understand complex information. Works closely with developers to explain features and functionalities.",
      growthOutlook: "Good - 12% growth expected over the next decade",
      workEnvironment: "Tech companies, software firms, remote work options",
      icon: <BookOpen className="h-8 w-8 text-indigo-500" />
    },
    
    // Business & Management
    "Product Manager": {
      salaryIndia: "₹8L - ₹30L",
      salaryGlobal: "$80K - $150K",
      skills: ["Market Research", "Strategic Planning", "Stakeholder Management", "Data Analysis", "Leadership"],
      education: "Bachelor's in Business/Marketing/Technical field + MBA preferred",
      description: "Defines product vision and strategy, working with multiple teams to bring products from conception to market while meeting business goals and user needs.",
      growthOutlook: "Very Good - 10% growth expected over the next decade",
      workEnvironment: "Corporate offices, startups, hybrid work models",
      icon: <Building className="h-8 w-8 text-amber-500" />
    },
    "Marketing Specialist": {
      salaryIndia: "₹3L - ₹15L",
      salaryGlobal: "$45K - $95K",
      skills: ["Digital Marketing", "Social Media", "Content Creation", "Analytics", "Campaign Management"],
      education: "Bachelor's in Marketing, Communications or related field",
      description: "Develops and implements marketing strategies to promote products/services, manages campaigns across multiple platforms to reach target audiences.",
      growthOutlook: "Good - 10% growth expected over the next decade",
      workEnvironment: "Marketing agencies, in-house marketing departments",
      icon: <Building className="h-8 w-8 text-green-500" />
    },
    "Financial Analyst": {
      salaryIndia: "₹4L - ₹20L",
      salaryGlobal: "$60K - $120K",
      skills: ["Financial Modeling", "Data Analysis", "Forecasting", "Excel/Financial Software", "Risk Assessment"],
      education: "Bachelor's/Master's in Finance, Accounting, Economics",
      description: "Analyzes financial data to guide business decisions, evaluates investment opportunities, and creates financial models and forecasts.",
      growthOutlook: "Good - 9% growth expected over the next decade",
      workEnvironment: "Banks, investment firms, corporate finance departments",
      icon: <Building className="h-8 w-8 text-blue-500" />
    },
    "Management Consultant": {
      salaryIndia: "₹7L - ₹30L+",
      salaryGlobal: "$85K - $170K+",
      skills: ["Problem Solving", "Business Analysis", "Project Management", "Client Relations", "Strategic Thinking"],
      education: "Bachelor's/MBA or other advanced degree, often from top schools",
      description: "Helps organizations improve performance by analyzing problems and developing solutions. Works with management to implement changes that enhance efficiency and profitability.",
      growthOutlook: "Good - 14% growth expected over the next decade",
      workEnvironment: "Consulting firms, frequent travel to client sites",
      icon: <Building className="h-8 w-8 text-indigo-500" />
    },
    
    // Creative & Media
    "Graphic Designer": {
      salaryIndia: "₹2.5L - ₹12L",
      salaryGlobal: "$40K - $90K",
      skills: ["Visual Design", "Typography", "Adobe Creative Suite", "Branding", "Layout Design"],
      education: "Bachelor's in Graphic Design, Visual Arts + portfolio",
      description: "Creates visual concepts to communicate ideas that inspire, inform, or captivate consumers. Develops the overall layout and production design for advertisements, brochures, magazines, and corporate reports.",
      growthOutlook: "Moderate - 3% growth expected over the next decade",
      workEnvironment: "Design agencies, in-house creative departments, freelance",
      icon: <Palette className="h-8 w-8 text-pink-500" />
    },
    "Content Creator": {
      salaryIndia: "₹2L - ₹20L+ (varies widely)",
      salaryGlobal: "$35K - $100K+ (varies widely)",
      skills: ["Content Production", "Story Telling", "Video Editing", "Social Media Management", "Audience Engagement"],
      education: "Varies - Often bachelor's in Communications, Media, or related field",
      description: "Develops, produces, and manages content across various platforms including social media, blogs, videos, and podcasts to engage target audiences.",
      growthOutlook: "Good - 12% growth in digital content roles",
      workEnvironment: "Varied - studios, remote work, self-employed",
      icon: <Palette className="h-8 w-8 text-orange-500" />
    },
    
    // Healthcare & Science
    "Doctor": {
      salaryIndia: "₹5L - ₹50L+",
      salaryGlobal: "$150K - $400K+",
      skills: ["Clinical Knowledge", "Diagnosis", "Patient Care", "Medical Procedures", "Communication"],
      education: "MBBS/MD + Specialty training, license requirements",
      description: "Diagnoses and treats illnesses and injuries, prescribes medications, and provides preventive care and health advice to patients.",
      growthOutlook: "Very Good - 13% growth expected over the next decade",
      workEnvironment: "Hospitals, clinics, private practices",
      icon: <Stethoscope className="h-8 w-8 text-red-500" />
    },
    "Research Scientist": {
      salaryIndia: "₹4L - ₹20L",
      salaryGlobal: "$70K - $150K",
      skills: ["Research Methods", "Data Analysis", "Lab Techniques", "Technical Writing", "Critical Thinking"],
      education: "Master's/PhD in specific science field",
      description: "Conducts experiments and investigations to advance knowledge in a specific field of science, publishes findings, and develops new products or applications.",
      growthOutlook: "Good - 8% growth expected over the next decade",
      workEnvironment: "Laboratories, research institutions, universities",
      icon: <BookOpen className="h-8 w-8 text-emerald-500" />
    },
    "Psychologist": {
      salaryIndia: "₹3L - ₹15L",
      salaryGlobal: "$60K - $130K",
      skills: ["Psychological Assessment", "Therapy Techniques", "Active Listening", "Research Methods", "Emotional Intelligence"],
      education: "Master's/PhD in Psychology + license/certification",
      description: "Studies cognitive, emotional, and social processes and behavior. May provide therapy to help people with mental health issues or conduct research on psychological phenomena.",
      growthOutlook: "Excellent - 14% growth expected over the next decade",
      workEnvironment: "Private practices, hospitals, academic institutions",
      icon: <Brain className="h-8 w-8 text-purple-500" />
    },
    
    // Engineering & Architecture
    "Civil Engineer": {
      salaryIndia: "₹3L - ₹20L",
      salaryGlobal: "$60K - $120K",
      skills: ["Structural Analysis", "AutoCAD/Design Software", "Project Management", "Mathematics", "Problem Solving"],
      education: "Bachelor's/Master's in Civil Engineering",
      description: "Designs and oversees construction and maintenance of building structures and infrastructure, such as roads, railways, airports, bridges, harbors, dams, and systems for water supply and sewage treatment.",
      growthOutlook: "Good - 8% growth expected over the next decade",
      workEnvironment: "Offices, construction sites, government agencies",
      icon: <HardHat className="h-8 w-8 text-amber-500" />
    },
    "Architect": {
      salaryIndia: "₹3L - ₹20L",
      salaryGlobal: "$65K - $130K",
      skills: ["Design", "CAD/BIM Software", "Spatial Thinking", "Project Management", "Building Codes & Regulations"],
      education: "Bachelor's/Master's in Architecture + license",
      description: "Plans and designs buildings and other structures, considering both form and function, aesthetics and practical elements, including materials, cost, and building codes.",
      growthOutlook: "Good - 8% growth expected over the next decade",
      workEnvironment: "Architecture firms, some construction site visits",
      icon: <HardHat className="h-8 w-8 text-blue-500" />
    },
    
    // Others
    "Teacher": {
      salaryIndia: "₹2.5L - ₹10L",
      salaryGlobal: "$45K - $85K",
      skills: ["Communication", "Curriculum Design", "Classroom Management", "Assessment Methods", "Patience"],
      education: "Bachelor's in Education or subject area + teaching certification",
      description: "Educates students on specific subjects, creates lesson plans, assesses student progress, and adapts teaching methods to meet diverse student needs.",
      growthOutlook: "Average - 4% growth expected over the next decade",
      workEnvironment: "Schools, educational institutions",
      icon: <BookOpen className="h-8 w-8 text-blue-500" />
    },
    "Human Resources Manager": {
      salaryIndia: "₹4L - ₹25L",
      salaryGlobal: "$70K - $120K",
      skills: ["Recruitment", "Employee Relations", "Conflict Resolution", "HR Policies", "Leadership"],
      education: "Bachelor's in HR, Business, Psychology + HR certifications",
      description: "Oversees recruitment, employee relations, benefits administration, and ensures compliance with labor laws and regulations.",
      growthOutlook: "Good - 7% growth expected over the next decade",
      workEnvironment: "Corporate offices across various industries",
      icon: <Users className="h-8 w-8 text-pink-500" />
    },
    "Sales Representative": {
      salaryIndia: "₹2L - ₹15L + commission",
      salaryGlobal: "$40K - $100K + commission",
      skills: ["Negotiation", "Relationship Building", "Product Knowledge", "Communication", "Persuasion"],
      education: "Bachelor's in Business or related field often preferred",
      description: "Sells products or services to potential customers, builds client relationships, and meets sales goals. Acts as a key link between a company and its prospects or clients.",
      growthOutlook: "Average - 5% growth expected over the next decade",
      workEnvironment: "Office setting with significant field work/client visits",
      icon: <Briefcase className="h-8 w-8 text-green-500" />
    },
    
    // Additional careers to ensure all potential matches work
    "Nurse": {
      salaryIndia: "₹2.5L - ₹10L",
      salaryGlobal: "$50K - $110K",
      skills: ["Patient Care", "Medical Procedures", "Clinical Assessment", "Empathy", "Communication"],
      education: "Nursing degree/diploma + license/registration",
      description: "Provides and coordinates patient care, educates patients about health conditions, and provides advice and emotional support to patients and their families.",
      growthOutlook: "Excellent - 9% growth expected over the next decade",
      workEnvironment: "Hospitals, clinics, long-term care facilities",
      icon: <Heart className="h-8 w-8 text-red-500" />
    },
    "Mechanical Engineer": {
      salaryIndia: "₹3L - ₹20L",
      salaryGlobal: "$60K - $115K",
      skills: ["CAD/CAM Software", "Problem Solving", "Thermodynamics", "Mathematics", "Product Design"],
      education: "Bachelor's/Master's in Mechanical Engineering",
      description: "Designs, develops, builds, and tests mechanical and thermal devices, including tools, engines, and machines. Applies principles of mechanics, thermodynamics, and materials science.",
      growthOutlook: "Good - 7% growth expected over the next decade",
      workEnvironment: "Manufacturing facilities, research labs, offices",
      icon: <HardHat className="h-8 w-8 text-orange-500" />
    },
    "Electrical Engineer": {
      salaryIndia: "₹3L - ₹20L",
      salaryGlobal: "$70K - $130K",
      skills: ["Circuit Design", "Programming", "Microcontrollers", "Power Systems", "Testing"],
      education: "Bachelor's/Master's in Electrical Engineering",
      description: "Designs, develops, tests, and supervises the manufacturing of electrical equipment, including electric motors, radar systems, communications systems, or power generation equipment.",
      growthOutlook: "Good - 7% growth expected over the next decade",
      workEnvironment: "Power plants, manufacturing facilities, offices",
      icon: <HardHat className="h-8 w-8 text-yellow-500" />
    },
    "Lawyer": {
      salaryIndia: "₹3L - ₹30L+",
      salaryGlobal: "$70K - $170K+",
      skills: ["Legal Research", "Critical Thinking", "Negotiation", "Writing", "Public Speaking"],
      education: "Law degree + bar admission/license",
      description: "Provides legal advice and representation to individuals, businesses, or government agencies on various legal issues and disputes.",
      growthOutlook: "Average - 4% growth expected over the next decade",
      workEnvironment: "Law firms, corporate legal departments, government",
      icon: <Briefcase className="h-8 w-8 text-indigo-500" />
    },
    "Writer": {
      salaryIndia: "₹2L - ₹15L",
      salaryGlobal: "$35K - $90K",
      skills: ["Writing", "Editing", "Research", "Creativity", "Time Management"],
      education: "Bachelor's in English, Journalism, Communications or related field",
      description: "Creates written content for various media, including books, articles, websites, scripts, or advertising materials.",
      growthOutlook: "Average - 4% growth expected over the next decade",
      workEnvironment: "Remote work, publishing houses, media companies",
      icon: <BookOpen className="h-8 w-8 text-amber-500" />
    },
    "Journalist": {
      salaryIndia: "₹2L - ₹12L",
      salaryGlobal: "$40K - $90K",
      skills: ["Reporting", "Writing", "Research", "Interview Techniques", "Ethical Standards"],
      education: "Bachelor's in Journalism, Communications or related field",
      description: "Researches, writes, and reports news stories for newspapers, magazines, websites, television, or radio.",
      growthOutlook: "Declining in traditional media, growing in digital media",
      workEnvironment: "Newsrooms, field reporting, remote work",
      icon: <BookOpen className="h-8 w-8 text-blue-500" />
    }
  };

  // Career categories with their respective UI styling
  const categoryStyles: Record<string, string> = {
    "Technology": "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
    "Business & Management": "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
    "Creative & Media": "bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800",
    "Healthcare & Science": "bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800",
    "Engineering & Architecture": "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800",
    "Others": "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800"
  };

  // Calculate career matches based on quiz answers
  const calculateCareerMatches = (answers: QuizAnswer[]): CareerMatch[] => {
    let careerMatches: CareerMatch[] = [];
    
    if (activeQuiz?.id === 1) { // General Career Interest Profiler
      // Calculate category scores from answers
      const technicalScore = calculateCategoryScore(answers, [1, 6, 11, 16]);
      const analyticalScore = calculateCategoryScore(answers, [2, 7, 12, 17]);
      const creativeScore = calculateCategoryScore(answers, [3, 8, 13, 18]);
      const socialScore = calculateCategoryScore(answers, [4, 9, 14, 19]);
      const leadershipScore = calculateCategoryScore(answers, [5, 10, 15, 20]);
      
      // Log scores for debugging
      console.log("Scores:", {
        technical: technicalScore,
        analytical: analyticalScore,
        creative: creativeScore,
        social: socialScore,
        leadership: leadershipScore
      });
      
      // Define career matches for each category with weighted scores
      const techCareers: CareerMatch[] = [
        {
          career: "Software Developer",
          category: "Technology",
          matchPercentage: Math.min(100, Math.round((technicalScore * 0.7 + analyticalScore * 0.2 + creativeScore * 0.1) * 100)),
        },
        {
          career: "Data Scientist",
          category: "Technology",
          matchPercentage: Math.min(100, Math.round((analyticalScore * 0.6 + technicalScore * 0.3 + leadershipScore * 0.1) * 100)),
        },
        {
          career: "UX/UI Designer",
          category: "Technology",
          matchPercentage: Math.min(100, Math.round((creativeScore * 0.5 + technicalScore * 0.3 + socialScore * 0.2) * 100)),
        },
        {
          career: "IT Project Manager",
          category: "Technology",
          matchPercentage: Math.min(100, Math.round((leadershipScore * 0.4 + technicalScore * 0.3 + analyticalScore * 0.3) * 100)),
        },
        {
          career: "Cybersecurity Analyst",
          category: "Technology",
          matchPercentage: Math.min(100, Math.round((technicalScore * 0.5 + analyticalScore * 0.4 + leadershipScore * 0.1) * 100)),
        }
      ];
      
      // Business careers
      const businessCareers: CareerMatch[] = [
        {
          career: "Product Manager",
          category: "Business & Management",
          matchPercentage: Math.min(100, Math.round((leadershipScore * 0.4 + analyticalScore * 0.3 + socialScore * 0.3) * 100)),
        },
        {
          career: "Marketing Specialist",
          category: "Business & Management",
          matchPercentage: Math.min(100, Math.round((creativeScore * 0.4 + socialScore * 0.3 + analyticalScore * 0.3) * 100)),
        },
        {
          career: "Financial Analyst",
          category: "Business & Management",
          matchPercentage: Math.min(100, Math.round((analyticalScore * 0.7 + technicalScore * 0.2 + leadershipScore * 0.1) * 100)),
        },
        {
          career: "Management Consultant",
          category: "Business & Management",
          matchPercentage: Math.min(100, Math.round((analyticalScore * 0.4 + leadershipScore * 0.4 + socialScore * 0.2) * 100)),
        }
      ];
      
      // Creative careers
      const creativeCareers: CareerMatch[] = [
        {
          career: "Graphic Designer",
          category: "Creative & Media",
          matchPercentage: Math.min(100, Math.round((creativeScore * 0.7 + technicalScore * 0.2 + socialScore * 0.1) * 100)),
        },
        {
          career: "Content Creator",
          category: "Creative & Media",
          matchPercentage: Math.min(100, Math.round((creativeScore * 0.5 + socialScore * 0.3 + leadershipScore * 0.2) * 100)),
        },
        {
          career: "Digital Marketer",
          category: "Creative & Media",
          matchPercentage: Math.min(100, Math.round((creativeScore * 0.4 + analyticalScore * 0.3 + socialScore * 0.3) * 100)),
        },
        {
          career: "Film Producer",
          category: "Creative & Media",
          matchPercentage: Math.min(100, Math.round((creativeScore * 0.5 + leadershipScore * 0.3 + socialScore * 0.2) * 100)),
        }
      ];
      
      // Healthcare careers
      const healthScienceCareers: CareerMatch[] = [
        {
          career: "Doctor",
          category: "Healthcare & Science",
          matchPercentage: Math.min(100, Math.round((analyticalScore * 0.5 + socialScore * 0.3 + technicalScore * 0.2) * 100)),
        },
        {
          career: "Research Scientist",
          category: "Healthcare & Science",
          matchPercentage: Math.min(100, Math.round((analyticalScore * 0.6 + technicalScore * 0.3 + creativeScore * 0.1) * 100)),
        },
        {
          career: "Nurse",
          category: "Healthcare & Science",
          matchPercentage: Math.min(100, Math.round((socialScore * 0.6 + technicalScore * 0.2 + leadershipScore * 0.2) * 100)),
        },
        {
          career: "Psychologist",
          category: "Healthcare & Science",
          matchPercentage: Math.min(100, Math.round((socialScore * 0.5 + analyticalScore * 0.4 + leadershipScore * 0.1) * 100)),
        }
      ];
      
      // Engineering careers
      const engineeringCareers: CareerMatch[] = [
        {
          career: "Civil Engineer",
          category: "Engineering & Architecture",
          matchPercentage: Math.min(100, Math.round((technicalScore * 0.5 + analyticalScore * 0.4 + leadershipScore * 0.1) * 100)),
        },
        {
          career: "Mechanical Engineer",
          category: "Engineering & Architecture",
          matchPercentage: Math.min(100, Math.round((technicalScore * 0.6 + analyticalScore * 0.3 + creativeScore * 0.1) * 100)),
        },
        {
          career: "Architect",
          category: "Engineering & Architecture",
          matchPercentage: Math.min(100, Math.round((creativeScore * 0.5 + technicalScore * 0.3 + analyticalScore * 0.2) * 100)),
        },
        {
          career: "Electrical Engineer",
          category: "Engineering & Architecture",
          matchPercentage: Math.min(100, Math.round((technicalScore * 0.6 + analyticalScore * 0.3 + leadershipScore * 0.1) * 100)),
        }
      ];
      
      // Other careers
      const otherCareers: CareerMatch[] = [
        {
          career: "Teacher",
          category: "Others",
          matchPercentage: Math.min(100, Math.round((socialScore * 0.5 + creativeScore * 0.3 + leadershipScore * 0.2) * 100)),
        },
        {
          career: "Lawyer",
          category: "Others",
          matchPercentage: Math.min(100, Math.round((analyticalScore * 0.5 + socialScore * 0.3 + leadershipScore * 0.2) * 100)),
        },
        {
          career: "Human Resources Manager",
          category: "Others",
          matchPercentage: Math.min(100, Math.round((socialScore * 0.6 + leadershipScore * 0.3 + analyticalScore * 0.1) * 100)),
        },
        {
          career: "Writer",
          category: "Others",
          matchPercentage: Math.min(100, Math.round((creativeScore * 0.7 + analyticalScore * 0.2 + socialScore * 0.1) * 100)),
        },
        {
          career: "Journalist",
          category: "Others",
          matchPercentage: Math.min(100, Math.round((socialScore * 0.4 + creativeScore * 0.4 + analyticalScore * 0.2) * 100)),
        },
        {
          career: "Sales Representative",
          category: "Others",
          matchPercentage: Math.min(100, Math.round((socialScore * 0.5 + leadershipScore * 0.4 + analyticalScore * 0.1) * 100)),
        }
      ];

      // Combine all career categories
      careerMatches = [
        ...techCareers,
        ...businessCareers,
        ...creativeCareers,
        ...healthScienceCareers,
        ...engineeringCareers,
        ...otherCareers
      ];
    } else if (activeQuiz?.id === 2) { // Technology Career Path Assessment
      // Calculate specific skills scores
      const codingScore = calculateCategoryScore(answers, [1, 8, 15]);
      const analysisScore = calculateCategoryScore(answers, [2, 9, 16]);
      const designScore = calculateCategoryScore(answers, [3, 10, 17]);
      const communicationScore = calculateCategoryScore(answers, [4, 11, 18]);
      const leadershipScore = calculateCategoryScore(answers, [5, 12, 19]);
      const securityScore = calculateCategoryScore(answers, [6, 13, 20]);
      const creativityScore = calculateCategoryScore(answers, [7, 14]);

      // Log scores for debugging
      console.log("Tech Scores:", {
        coding: codingScore,
        analysis: analysisScore,
        design: designScore,
        communication: communicationScore,
        leadership: leadershipScore,
        security: securityScore,
        creativity: creativityScore
      });

      // Define specific tech career matches with weighted scores
      careerMatches = [
        {
          career: "Software Developer",
          category: "Technology",
          matchPercentage: Math.min(100, Math.round((codingScore * 0.6 + analysisScore * 0.2 + leadershipScore * 0.1 + creativityScore * 0.1) * 100)),
        },
        {
          career: "Data Scientist",
          category: "Technology",
          matchPercentage: Math.min(100, Math.round((analysisScore * 0.6 + codingScore * 0.3 + communicationScore * 0.1) * 100)),
        },
        {
          career: "UX/UI Designer",
          category: "Technology",
          matchPercentage: Math.min(100, Math.round((designScore * 0.6 + creativityScore * 0.2 + communicationScore * 0.2) * 100)),
        },
        {
          career: "IT Project Manager",
          category: "Technology",
          matchPercentage: Math.min(100, Math.round((leadershipScore * 0.5 + communicationScore * 0.3 + codingScore * 0.1 + analysisScore * 0.1) * 100)),
        },
        {
          career: "Cybersecurity Analyst",
          category: "Technology",
          matchPercentage: Math.min(100, Math.round((securityScore * 0.6 + analysisScore * 0.2 + codingScore * 0.2) * 100)),
        },
        {
          career: "Frontend Developer",
          category: "Technology", 
          matchPercentage: Math.min(100, Math.round((codingScore * 0.5 + designScore * 0.3 + creativityScore * 0.2) * 100)),
        },
        {
          career: "Backend Developer",
          category: "Technology",
          matchPercentage: Math.min(100, Math.round((codingScore * 0.6 + analysisScore * 0.3 + securityScore * 0.1) * 100)),
        },
        {
          career: "DevOps Engineer",
          category: "Technology",
          matchPercentage: Math.min(100, Math.round((codingScore * 0.4 + securityScore * 0.3 + leadershipScore * 0.3) * 100)),
        },
        {
          career: "Technical Writer",
          category: "Technology",
          matchPercentage: Math.min(100, Math.round((communicationScore * 0.5 + codingScore * 0.2 + designScore * 0.2 + analysisScore * 0.1) * 100)),
        },
        {
          career: "Product Manager",
          category: "Business & Management",
          matchPercentage: Math.min(100, Math.round((leadershipScore * 0.4 + communicationScore * 0.3 + analysisScore * 0.2 + designScore * 0.1) * 100)),
        }
      ];
    }
    
    // Sort by match percentage
    return careerMatches.sort((a, b) => b.matchPercentage - a.matchPercentage);
  };
  
  // Helper function to calculate category scores
  const calculateCategoryScore = (answers: QuizAnswer[], questionIds: number[]): number => {
    // Filter answers by the given category question IDs
    const categoryAnswers = answers.filter(answer => 
      questionIds.includes(answer.questionId)
    );
    
    if (categoryAnswers.length === 0) return 0;
    
    // Calculate the average score (1-5) and normalize to 0-1
    const sum = categoryAnswers.reduce((acc, answer) => acc + answer.optionId, 0);
    return (sum / categoryAnswers.length) / 5;
  };

  // Start a specific quiz
  const startQuiz = (quiz: QuizType) => {
    setActiveQuiz(quiz);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setQuizComplete(false);
    setQuizResults([]);
  };

  // Handle answer selection
  const handleAnswerSelect = (optionId: number) => {
    if (!activeQuiz) return;
    
    const answer: QuizAnswer = {
      questionId: activeQuiz.questions[currentQuestionIndex].id,
      optionId,
    };

    const newAnswers = [...answers];
    const existingAnswerIndex = newAnswers.findIndex(
      (a) => a.questionId === answer.questionId
    );

    if (existingAnswerIndex !== -1) {
      newAnswers[existingAnswerIndex] = answer;
    } else {
      newAnswers.push(answer);
    }

    setAnswers(newAnswers);
  };

  // Get currently selected answer for the current question
  const getCurrentAnswer = () => {
    if (!activeQuiz) return null;
    return answers.find(
      (a) => a.questionId === activeQuiz.questions[currentQuestionIndex].id
    );
  };

  // Check if next button should be disabled
  const isNextDisabled = () => {
    return !getCurrentAnswer();
  };

  // Calculate progress percentage
  const getProgress = () => {
    if (!activeQuiz) return 0;
    return ((currentQuestionIndex + 1) / activeQuiz.questions.length) * 100;
  };

  // Handle previous button click
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Handle next button click
  const handleNext = () => {
    if (!activeQuiz) return;

    if (currentQuestionIndex < activeQuiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      submitQuizMutation.mutate({
        quizId: activeQuiz.id,
        answers,
      });
    }
  };

  // Reset quiz to selection screen
  const resetQuiz = () => {
    setActiveQuiz(null);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setQuizComplete(false);
    setQuizResults([]);
  };

  // Loading state
  if (isLoadingQuizzes) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Quiz selection screen
  if (!activeQuiz) {
    return (
      <div className="space-y-10">
        <div>
          <h2 className="text-2xl font-bold tracking-tight dark:text-white">
            Career Interest Assessment
          </h2>
          <p className="text-muted-foreground mt-2">
            These assessments will help identify career paths that align with your interests and skills.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {quizzes?.map((quiz) => (
            <Card key={quiz.id} className="overflow-hidden border-2 hover:border-primary hover:shadow-lg transition-all">
              <CardHeader className={`${quiz.id === 1 ? "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30" : "bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30"}`}>
                <CardTitle>{quiz.title}</CardTitle>
                <CardDescription className="text-gray-700 dark:text-gray-300">{quiz.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                  {quiz.id === 1
                    ? "Discover broad career directions based on your general interests and preferences across multiple industries and domains."
                    : "Explore specific technology career paths aligned with your technical preferences, skills, and interests in the tech industry."}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1.5 text-primary" />
                      <span>{quiz.questions.length} questions</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1.5 text-primary" />
                      <span>~{quiz.questions.length * 0.5} min</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 dark:bg-gray-800/50 pt-4 pb-4">
                <Button 
                  onClick={() => startQuiz(quiz)} 
                  className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
                >
                  Start Quiz
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Quiz in progress
  if (!quizComplete) {
    const currentQuestion = activeQuiz.questions[currentQuestionIndex];
    
    return (
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-1 dark:text-white">{activeQuiz.title}</h2>
          <Progress value={getProgress()} className="h-2" />
          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
            <span>Question {currentQuestionIndex + 1} of {activeQuiz.questions.length}</span>
            <span>{Math.round(getProgress())}% Complete</span>
          </div>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">{currentQuestion.text}</CardTitle>
            <CardDescription>Select the option that best describes you</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={getCurrentAnswer()?.optionId.toString() || ""}
              onValueChange={(value) => handleAnswerSelect(parseInt(value))}
            >
              {currentQuestion.options.map((option) => (
                <div
                  key={option.id}
                  className="flex items-center space-x-2 p-3 rounded-md border border-gray-200 dark:border-gray-700 my-2 hover:bg-gray-50 dark:hover:bg-gray-800/80"
                >
                  <RadioGroupItem value={option.id.toString()} id={`option-${option.id}`} />
                  <Label htmlFor={`option-${option.id}`} className="flex-grow cursor-pointer">
                    {option.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={isNextDisabled()}
            >
              {currentQuestionIndex < activeQuiz.questions.length - 1 ? "Next" : "Submit"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Quiz results
  if (quizComplete) {
    // Group results by category for display in sections
    const resultsByCategory: { [key: string]: CareerMatch[] } = {};
    
    quizResults.forEach(result => {
      const category = result.category || 'Uncategorized';
      if (!resultsByCategory[category]) {
        resultsByCategory[category] = [];
      }
      resultsByCategory[category].push(result);
    });

    // Get career icon by career name
    const getCareerIcon = (careerName: string) => {
      const details = careerDetails[careerName as keyof typeof careerDetails];
      return details?.icon || <Briefcase className="h-8 w-8 text-gray-500" />;
    };

    // Chart data for visualization
    const chartData = quizResults.slice(0, 9).map(result => ({
      name: result.career,
      matchPercentage: result.matchPercentage,
      category: result.category
    }));

    // Custom colors for the bar chart based on category
    const categoryColors: Record<string, string> = {
      "Technology": "#3b82f6",
      "Business & Management": "#10b981",
      "Creative & Media": "#f43f5e",
      "Healthcare & Science": "#14b8a6",
      "Engineering & Architecture": "#f59e0b",
      "Others": "#8b5cf6"
    };

    // Helper function to get color by category
    const getColorByCategory = (category: string) => {
      return categoryColors[category] || "#6b7280";
    };

    // Show more/less results
    const handleShowMoreResults = () => {
      setDisplayCount(prev => prev === 3 ? 9 : 3);
    };

    return (
      <div className="max-w-5xl mx-auto px-4 pb-16">
        {/* Header with results summary */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center p-2 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
            <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2 dark:text-white">Your Career Assessment Results</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Based on your responses, we've analyzed your interests, skills, and preferences to identify career paths that might be a good fit for you.
          </p>
        </div>
        
        {/* Results visualization */}
        <div className="mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
            <h3 className="font-semibold mb-4 text-xl dark:text-gray-100">Career Match Scores</h3>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart
                  data={chartData}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 110, bottom: 5 }}
                  className="dark:text-gray-200"
                >
                  <XAxis 
                    type="number" 
                    domain={[0, 100]} 
                    tickFormatter={(value) => `${value}%`}
                  />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    width={100}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value}% Match`, "Match Score"]}
                    labelFormatter={(label) => `Career: ${label}`}
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      borderRadius: "0.5rem",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                      border: "none",
                    }}
                  />
                  <Bar dataKey="matchPercentage" fill="#3b82f6" radius={[0, 4, 4, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={getColorByCategory(entry.category || "")} 
                      />
                    ))}
                    <LabelList dataKey="matchPercentage" position="right" formatter={(value: number) => `${value}%`} />
                  </Bar>
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        {/* Top 3 Career Highlights */}
        <div className="mb-12">
          <h3 className="font-semibold mb-6 text-center text-2xl dark:text-gray-100">Your Top {displayCount} Career Recommendations</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {quizResults.slice(0, displayCount).map((result, index) => {
              const details = careerDetails[result.career as keyof typeof careerDetails];
              if (!details) return null;
              
              const gradients = [
                'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
                'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20',
                'bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20',
                'bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20',
                'bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20',
                'bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20',
                'bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20',
                'bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-900/20 dark:to-blue-900/20',
                'bg-gradient-to-br from-lime-50 to-green-50 dark:from-lime-900/20 dark:to-green-900/20'
              ];
              
              return (
                <div key={index} className={`p-6 rounded-lg border-2 dark:border-gray-700 shadow-md ${gradients[index % gradients.length]}`}>
                  <div className="flex items-center mb-4">
                    <div className="p-2 rounded-full bg-white dark:bg-gray-700 shadow-sm mr-4">
                      {details.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg dark:text-white">{result.career}</h4>
                      <p className="text-sm text-primary">{result.category}</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="mb-1 flex justify-between">
                      <span className="text-sm font-medium dark:text-gray-300">Match Score</span>
                      <span className="text-sm font-medium dark:text-gray-300">{result.matchPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div 
                        className="bg-primary h-2.5 rounded-full" 
                        style={{ width: `${result.matchPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                    {details.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 text-gray-500 mr-1.5" />
                      <span className="text-xs dark:text-gray-300">{details.salaryIndia}</span>
                    </div>
                    <div className="flex items-center">
                      <GraduationCap className="h-4 w-4 text-gray-500 mr-1.5" />
                      <span className="text-xs dark:text-gray-300">
                        {details.education.split(" ")[0]}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Show more/less button */}
          <div className="flex justify-center mt-6">
            <Button
              variant="outline"
              onClick={handleShowMoreResults}
              className="flex items-center gap-2"
            >
              {displayCount === 3 ? "Show More Careers" : "Show Less"}
              <ChevronRight className={`h-4 w-4 transition-transform ${displayCount === 3 ? "" : "rotate-90"}`} />
            </Button>
          </div>
        </div>
        
        {/* Detailed career information */}
        <div className="mt-12">
          <h3 className="font-semibold mb-6 text-center text-xl dark:text-gray-100">Top {displayCount} Career Details</h3>
          <Accordion type="multiple" defaultValue={["item-0", "item-1", "item-2"]} className="w-full">
            {quizResults.slice(0, displayCount).map((result, index) => {
              const details = careerDetails[result.career as keyof typeof careerDetails];
              if (!details) return null;
              
              return (
                <AccordionItem value={`item-${index}`} key={index} className="border dark:border-gray-700 rounded-lg mb-3 overflow-hidden">
                  <AccordionTrigger className="hover:no-underline px-4 py-3 dark:bg-gray-800/50">
                    <div className="flex items-center">
                      <div className="p-1.5 rounded-full bg-white dark:bg-gray-700 shadow-sm mr-3">
                        {details.icon}
                      </div>
                      <span className="font-medium dark:text-white">{result.career}</span>
                      <span className="ml-3 text-sm text-primary">{result.matchPercentage}% Match</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 py-3">
                    <div className="space-y-4">
                      <p className="text-gray-700 dark:text-gray-300">
                        {details.description}
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-sm font-semibold mb-2 flex items-center dark:text-gray-200">
                            <DollarSign className="h-4 w-4 mr-1.5 text-green-500" />
                            Salary Range
                          </h4>
                          <div className="space-y-1 text-sm">
                            <p className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">India:</span>
                              <span className="font-medium dark:text-gray-300">{details.salaryIndia}</span>
                            </p>
                            <p className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Global:</span>
                              <span className="font-medium dark:text-gray-300">{details.salaryGlobal}</span>
                            </p>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-semibold mb-2 flex items-center dark:text-gray-200">
                            <GraduationCap className="h-4 w-4 mr-1.5 text-blue-500" />
                            Education
                          </h4>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {details.education}
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-semibold mb-2 flex items-center dark:text-gray-200">
                          <CheckCircle2 className="h-4 w-4 mr-1.5 text-indigo-500" />
                          Key Skills
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {details.skills.map((skill, skillIndex) => (
                            <span 
                              key={skillIndex}
                              className="text-xs px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-sm font-semibold mb-2 flex items-center dark:text-gray-200">
                            <LineChart className="h-4 w-4 mr-1.5 text-rose-500" />
                            Growth Outlook
                          </h4>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {details.growthOutlook}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold mb-2 flex items-center dark:text-gray-200">
                            <Briefcase className="h-4 w-4 mr-1.5 text-amber-500" />
                            Work Environment
                          </h4>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {details.workEnvironment}
                          </p>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
        
        {/* Category legends for chart */}
        <div className="mt-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <h4 className="text-sm font-medium mb-3 dark:text-gray-200">Career Categories</h4>
            <div className="flex flex-wrap gap-3">
              {Object.entries(categoryColors).map(([category, color]) => (
                <div key={category} className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-1.5" style={{ backgroundColor: color }}></div>
                  <span className="text-xs text-gray-700 dark:text-gray-300">{category}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex justify-center space-x-4 mt-10">
          <Button variant="outline" onClick={resetQuiz}>
            Try Another Quiz
          </Button>
          {/* Add more buttons if needed, like "Save Results" or "Compare with Previous Results" */}
        </div>
      </div>
    );
  }
  
  // This should never happen but TypeScript requires a return
  return null;
}