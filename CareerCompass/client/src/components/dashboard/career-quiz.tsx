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
  AlertCircle
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

export function CareerQuiz() {
  const { user } = useAuth();
  const { toast } = useToast();

  // State variables
  const [activeQuiz, setActiveQuiz] = useState<QuizType | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [quizComplete, setQuizComplete] = useState(false);
  const [quizResults, setQuizResults] = useState<CareerMatch[]>([]);

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
      // For demo purposes, we'll calculate career matches on the client
      // In a production app, this would be done on the server
      const careerMatches = calculateCareerMatches(data.answers);
      
      const result = await apiRequest("POST", "/api/quiz-results", {
        quizId: data.quizId,
        answers: data.answers,
        careerMatches,
      });
      
      return { careerMatches };
    },
    onSuccess: (data) => {
      // Add console.log to debug career matches
      console.log("Career matches:", data.careerMatches);
      setQuizResults(data.careerMatches);
      setQuizComplete(true);
      queryClient.invalidateQueries({ queryKey: ["/api/user/quiz-results"] });
    },
  });

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
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
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
                  Start Assessment
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Quiz results screen
  if (quizComplete) {
    // Group results by category
    const resultsByCategory: { [key: string]: CareerMatch[] } = {};
    
    quizResults.forEach(result => {
      const category = result.category || 'Uncategorized';
      if (!resultsByCategory[category]) {
        resultsByCategory[category] = [];
      }
      resultsByCategory[category].push(result);
    });
    
    // Define colors for categories
    const categoryColors: { [key: string]: string } = {
      "Technology": "text-cyan-600 dark:text-cyan-400",
      "Business & Management": "text-blue-600 dark:text-blue-400",
      "Creative & Media": "text-pink-600 dark:text-pink-400",
      "Healthcare & Science": "text-green-600 dark:text-green-400",
      "Engineering & Architecture": "text-amber-600 dark:text-amber-400",
      "Others": "text-purple-600 dark:text-purple-400"
    };
    
    const categoryBgColors: { [key: string]: string } = {
      "Technology": "bg-cyan-50 dark:bg-cyan-900/20 border-cyan-200 dark:border-cyan-800",
      "Business & Management": "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
      "Creative & Media": "bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-800",
      "Healthcare & Science": "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
      "Engineering & Architecture": "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800",
      "Others": "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800"
    };
    
    // Career details for top matches
    const careerDetails: any = {
      "Software Developer": {
        salaryIndia: "₹3.5L - ₹20L",
        salaryGlobal: "$60K - $150K",
        skills: ["Programming", "Problem Solving", "Algorithms", "Git", "Database Design"],
        education: "Bachelor's/Master's in Computer Science or related field",
        outlook: "High demand across industries, excellent growth prospects",
        description: "Software developers design, build, and maintain computer programs and applications. They work across various industries creating everything from mobile apps to enterprise software. The role requires strong problem-solving abilities, analytical thinking, and continuous learning as technologies evolve.",
        dailyTasks: [
          "Writing and testing code",
          "Debugging and fixing issues",
          "Collaborating with team members",
          "Designing software architecture",
          "Learning new technologies"
        ],
        growthPath: "Junior Developer → Mid-level Developer → Senior Developer → Tech Lead → Software Architect",
        keyTechnologies: ["JavaScript/TypeScript", "Python", "Java", "Cloud Services (AWS/Azure/GCP)", "Git"]
      },
      "UX/UI Designer": {
        salaryIndia: "₹4L - ₹18L",
        salaryGlobal: "$55K - $130K",
        skills: ["Visual Design", "User Research", "Prototyping", "Wireframing", "Figma/Adobe XD"],
        education: "Degree in Design, HCI, or related field",
        outlook: "Growing demand as companies focus on user experience",
        description: "UX/UI designers create intuitive, engaging interfaces for digital products. They combine aesthetics with functionality, focusing on the entire user journey. This role merges creativity with analytical thinking, requiring a deep understanding of user psychology and behavior patterns.",
        dailyTasks: [
          "Creating wireframes and prototypes",
          "Conducting user research and testing",
          "Collaborating with developers and stakeholders",
          "Designing visual elements and interfaces",
          "Analyzing user behavior data"
        ],
        growthPath: "Junior Designer → Mid-level Designer → Senior Designer → UX Lead → Design Director",
        keyTechnologies: ["Figma", "Adobe XD", "Sketch", "InVision", "Usability Testing Tools"]
      },
      "Data Scientist": {
        salaryIndia: "₹6L - ₹25L",
        salaryGlobal: "$70K - $160K",
        skills: ["Statistics", "Machine Learning", "Python/R", "Data Visualization", "SQL"],
        education: "Master's or PhD in Statistics, Computer Science, or related field",
        outlook: "Very high demand, especially in tech, finance, and healthcare",
        description: "Data scientists extract meaningful insights from complex data to solve business problems. They combine statistics, programming, and domain knowledge to develop predictive models and data-driven strategies. This role requires strong analytical thinking, communication skills, and technical expertise.",
        dailyTasks: [
          "Collecting and cleaning data",
          "Building statistical models",
          "Creating data visualizations",
          "Presenting findings to stakeholders",
          "Implementing machine learning algorithms"
        ],
        growthPath: "Junior Data Scientist → Data Scientist → Senior Data Scientist → Lead Data Scientist → Chief Data Scientist",
        keyTechnologies: ["Python", "R", "SQL", "Hadoop/Spark", "TensorFlow/PyTorch"]
      },
      "Product Manager": {
        salaryIndia: "₹8L - ₹24L",
        salaryGlobal: "$70K - $170K",
        skills: ["Strategic Thinking", "Communication", "Market Analysis", "User Empathy", "Technical Understanding"],
        education: "Business or Technical degree with experience",
        outlook: "Strong demand as companies emphasize product-led growth",
        description: "Product managers lead the development and marketing of products throughout their lifecycle. They identify market opportunities, define product vision, and work cross-functionally to bring products to market. This role requires strategic thinking, strong communication, and a balance of business, technical, and user experience understanding.",
        dailyTasks: [
          "Conducting market research",
          "Creating product roadmaps",
          "Working with development teams",
          "Analyzing product metrics",
          "Gathering user feedback"
        ],
        growthPath: "Associate Product Manager → Product Manager → Senior Product Manager → Director of Product → Chief Product Officer",
        keyTools: ["Product Management Software", "Analytics Tools", "Prototyping Tools", "Market Research", "User Feedback Systems"]
      },
      "Marketing Specialist": {
        salaryIndia: "₹3.5L - ₹12L",
        salaryGlobal: "$45K - $90K",
        skills: ["Digital Marketing", "Analytics", "Content Creation", "Social Media", "SEO"],
        education: "Degree in Marketing, Business, or Communications",
        outlook: "Solid demand, especially for digital marketing specialists",
        description: "Marketing specialists develop and implement strategies to promote products or services. They conduct market research, create campaigns, and analyze performance metrics to reach target audiences effectively. This role requires creativity, analytical thinking, and strong communication skills.",
        dailyTasks: [
          "Creating marketing content",
          "Managing social media campaigns",
          "Analyzing marketing metrics",
          "Conducting market research",
          "Collaborating with design and sales teams"
        ],
        growthPath: "Marketing Assistant → Marketing Specialist → Marketing Manager → Marketing Director → Chief Marketing Officer",
        keySkills: ["SEO/SEM", "Content Marketing", "Social Media Management", "Analytics", "Campaign Management"]
      }
    };
    
    // Prepare data for the bar chart - top 9 overall matches
    const chartData = quizResults.slice(0, 9).map(result => ({
      name: result.career,
      value: result.matchPercentage,
      category: result.category || 'Uncategorized',
      fill: result.matchPercentage > 80 ? '#4ade80' : result.matchPercentage > 60 ? '#60a5fa' : '#f97316'
    }));
    
    return (
      <div className="space-y-6">
        <Card className="border-2 overflow-hidden shadow-lg">
          <CardHeader className="text-center bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
            <div className="mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-full p-3 w-16 h-16 flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
            <CardTitle className="text-2xl">Quiz Complete!</CardTitle>
            <CardDescription className="text-gray-700 dark:text-gray-300 text-base">
              Based on your answers, we've identified your top career matches
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {/* Chart visualization */}
            <div className="mb-10 mt-4">
              <h3 className="font-semibold mb-6 text-center text-xl dark:text-gray-100">Top Career Matches</h3>
              <div className="h-[400px] w-full bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700 shadow-inner">
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
                      stroke="currentColor" 
                      className="dark:text-gray-300" 
                      tickLine={{ stroke: 'currentColor' }}
                    />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      width={110}
                      stroke="currentColor"
                      className="dark:text-gray-300" 
                      tickLine={{ stroke: 'currentColor' }}
                    />
                    <Tooltip 
                      formatter={(value: number) => [`${value}% Match`, 'Match Percentage']}
                      cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                      contentStyle={{ 
                        backgroundColor: 'var(--background)', 
                        borderColor: 'var(--border)',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                      labelStyle={{ color: 'var(--foreground)', fontWeight: 'bold' }}
                      itemStyle={{ color: 'var(--foreground)' }}
                    />
                    <Bar dataKey="value" animationDuration={1500} radius={[0, 4, 4, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                      <LabelList 
                        dataKey="value" 
                        position="right" 
                        formatter={(value: number) => `${value}%`}
                        fill="currentColor"
                        className="dark:text-gray-300 font-medium"
                      />
                    </Bar>
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Top 3 Career Highlights */}
            <div className="mb-12">
              <h3 className="font-semibold mb-6 text-center text-2xl dark:text-gray-100">Your Top 3 Career Recommendations</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {quizResults.slice(0, 3).map((result, index) => {
                  const details = careerDetails[result.career as keyof typeof careerDetails];
                  if (!details) return null;
                  
                  const gradients = [
                    'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
                    'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20',
                    'bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20'
                  ];
                  
                  return (
                    <div key={index} className={`p-6 rounded-lg border-2 dark:border-gray-700 shadow-md ${gradients[index]}`}>
                      <div className="flex items-center mb-6">
                        <div className={`mr-5 p-4 rounded-full ${
                          index === 0 ? 'bg-green-100 dark:bg-green-800' : 
                          index === 1 ? 'bg-blue-100 dark:bg-blue-800' : 
                          'bg-purple-100 dark:bg-purple-800'
                        }`}>
                          {result.category === "Technology" && <Cpu className="h-7 w-7 text-cyan-500 dark:text-cyan-300" />}
                          {result.category === "Business & Management" && <Building className="h-7 w-7 text-blue-500 dark:text-blue-300" />}
                          {result.category === "Creative & Media" && <Palette className="h-7 w-7 text-pink-500 dark:text-pink-300" />}
                          {result.category === "Healthcare & Science" && <Stethoscope className="h-7 w-7 text-green-500 dark:text-green-300" />}
                          {result.category === "Engineering & Architecture" && <HardHat className="h-7 w-7 text-amber-500 dark:text-amber-300" />}
                          {result.category === "Others" && <Briefcase className="h-7 w-7 text-purple-500 dark:text-purple-300" />}
                          {!result.category && <Briefcase className="h-7 w-7 text-gray-500 dark:text-gray-300" />}
                        </div>
                        <div>
                          <h4 className="text-2xl font-bold dark:text-white">{result.career}</h4>
                          <div className="flex items-center mt-2">
                            <span className={`text-sm px-3 py-1 rounded-full font-medium ${
                              result.matchPercentage > 80 ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 
                              result.matchPercentage > 60 ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300' : 
                              'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300'
                            }`}>
                              {result.matchPercentage}% Match
                            </span>
                            <span className="text-gray-600 dark:text-gray-300 text-sm ml-3 font-medium">{result.category}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Career description */}
                      <div className="mb-6 p-4 bg-white/70 dark:bg-gray-800/50 rounded-lg">
                        <p className="text-gray-700 dark:text-gray-300">
                          {details.description}
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-5">
                          <div className="flex items-start space-x-3">
                            <DollarSign className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="font-medium dark:text-gray-100">Salary Range</p>
                              <p className="text-gray-600 dark:text-gray-300">India: {details.salaryIndia}</p>
                              <p className="text-gray-600 dark:text-gray-300">Global: {details.salaryGlobal}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-3">
                            <GraduationCap className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="font-medium dark:text-gray-100">Education</p>
                              <p className="text-gray-600 dark:text-gray-300">{details.education}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-3">
                            <Briefcase className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="font-medium dark:text-gray-100">Job Outlook</p>
                              <p className="text-gray-600 dark:text-gray-300">{details.outlook}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-5">
                          <div>
                            <p className="font-medium mb-2 dark:text-gray-100">Key Skills</p>
                            <div className="flex flex-wrap gap-2">
                              {details.skills.map((skill: string, i: number) => (
                                <span key={i} className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 px-2.5 py-1 rounded-full text-sm">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          {details.dailyTasks && (
                            <div>
                              <p className="font-medium mb-2 dark:text-gray-100">Daily Tasks</p>
                              <ul className="text-sm text-gray-600 dark:text-gray-300 list-disc pl-5 space-y-1">
                                {details.dailyTasks.slice(0, 3).map((task: string, i: number) => (
                                  <li key={i}>{task}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {details.growthPath && (
                            <div>
                              <p className="font-medium mb-2 dark:text-gray-100">Career Path</p>
                              <p className="text-sm text-gray-600 dark:text-gray-300">{details.growthPath}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Career matches by category */}
            <div className="mt-10">
              <h3 className="font-semibold mb-6 text-center text-xl dark:text-gray-100">Careers By Category</h3>
              <div className="space-y-8">
                {Object.entries(resultsByCategory).map(([category, careers]) => (
                  <div key={category} className={`rounded-lg p-5 border ${categoryBgColors[category as keyof typeof categoryBgColors] || 'bg-gray-50 dark:bg-gray-800/50'}`}>
                    <div className={`flex items-center gap-2 mb-4 font-medium text-lg ${categoryColors[category as keyof typeof categoryColors] || 'text-gray-800 dark:text-gray-200'}`}>
                      {category === "Technology" && <Cpu className="h-5 w-5" />}
                      {category === "Business & Management" && <Building className="h-5 w-5" />}
                      {category === "Creative & Media" && <Palette className="h-5 w-5" />}
                      {category === "Healthcare & Science" && <Stethoscope className="h-5 w-5" />}
                      {category === "Engineering & Architecture" && <HardHat className="h-5 w-5" />}
                      {category === "Others" && <Briefcase className="h-5 w-5" />}
                      {category}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {careers.map((career) => (
                        <div 
                          key={career.career} 
                          className="bg-white dark:bg-gray-800 p-3 rounded border dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between">
                            <div className="w-full">
                              <h4 className="font-medium dark:text-gray-100">{career.career}</h4>
                              <div className="mt-2 flex items-center">
                                <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full">
                                  <div 
                                    className={`h-2 rounded-full ${
                                      career.matchPercentage > 80 ? 'bg-green-500' : 
                                      career.matchPercentage > 60 ? 'bg-blue-500' : 
                                      'bg-orange-500'
                                    }`} 
                                    style={{ width: `${career.matchPercentage}%` }}
                                  ></div>
                                </div>
                                <span className="ml-2 text-xs font-medium dark:text-gray-300">
                                  {career.matchPercentage}%
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Detailed career information */}
            <div className="mt-12">
              <h3 className="font-semibold mb-6 text-center text-xl dark:text-gray-100">Top 3 Career Details</h3>
              <Accordion type="multiple" defaultValue={["item-0", "item-1", "item-2"]} className="w-full">
                {quizResults.slice(0, 3).map((result, index) => {
                  const details = careerDetails[result.career as keyof typeof careerDetails];
                  if (!details) return null;
                  
                  return (
                    <AccordionItem value={`item-${index}`} key={index} className="border dark:border-gray-700 rounded-lg mb-3 overflow-hidden">
                      <AccordionTrigger className="hover:no-underline px-4 py-3 dark:bg-gray-800/50">
                        <div className="flex items-center">
                          <div className="mr-3">
                            {result.category === "Technology" && <Cpu className="h-5 w-5 text-cyan-500 dark:text-cyan-400" />}
                            {result.category === "Business & Management" && <Building className="h-5 w-5 text-blue-500 dark:text-blue-400" />}
                            {result.category === "Creative & Media" && <Palette className="h-5 w-5 text-pink-500 dark:text-pink-400" />}
                            {result.category === "Healthcare & Science" && <Stethoscope className="h-5 w-5 text-green-500 dark:text-green-400" />}
                            {result.category === "Engineering & Architecture" && <HardHat className="h-5 w-5 text-amber-500 dark:text-amber-400" />}
                            {result.category === "Others" && <Briefcase className="h-5 w-5 text-purple-500 dark:text-purple-400" />}
                            {!result.category && <Briefcase className="h-5 w-5 text-gray-500 dark:text-gray-400" />}
                          </div>
                          <span className="font-medium dark:text-gray-100">{result.career}</span>
                          <span className={`ml-3 text-xs rounded-full px-2.5 py-1 ${
                            result.matchPercentage > 80 ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' : 
                            result.matchPercentage > 60 ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300' : 
                            'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300'
                          }`}>
                            {result.matchPercentage}% Match
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-sm px-4 pb-4 dark:bg-gray-800">
                        <div className="space-y-4 pt-2">
                          {details.description && (
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                              {details.description}
                            </p>
                          )}
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-start space-x-2">
                              <DollarSign className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="font-medium dark:text-gray-100">Salary Range</p>
                                <p className="text-gray-600 dark:text-gray-300">India: {details.salaryIndia}</p>
                                <p className="text-gray-600 dark:text-gray-300">Global: {details.salaryGlobal}</p>
                              </div>
                            </div>
                            <div className="flex items-start space-x-2">
                              <GraduationCap className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="font-medium dark:text-gray-100">Education</p>
                                <p className="text-gray-600 dark:text-gray-300">{details.education}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-2">
                            <Briefcase className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="font-medium dark:text-gray-100">Job Outlook</p>
                              <p className="text-gray-600 dark:text-gray-300">{details.outlook}</p>
                            </div>
                          </div>
                          
                          <div>
                            <p className="font-medium mb-1 dark:text-gray-100">Key Skills</p>
                            <div className="flex flex-wrap gap-2">
                              {details.skills.map((skill: string, i: number) => (
                                <span key={i} className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 px-2 py-1 rounded-full text-xs">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          {details.dailyTasks && (
                            <div>
                              <p className="font-medium mb-1 dark:text-gray-100">Daily Tasks</p>
                              <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-300">
                                {details.dailyTasks.map((task: string, i: number) => (
                                  <li key={i}>{task}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {details.growthPath && (
                            <div>
                              <p className="font-medium mb-1 dark:text-gray-100">Career Growth Path</p>
                              <p className="text-gray-600 dark:text-gray-300">{details.growthPath}</p>
                            </div>
                          )}
                          
                          {details.keyTechnologies && (
                            <div>
                              <p className="font-medium mb-1 dark:text-gray-100">Key Technologies</p>
                              <div className="flex flex-wrap gap-2">
                                {details.keyTechnologies.map((tech: string, i: number) => (
                                  <span key={i} className="bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-xs">
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {details.keyTools && (
                            <div>
                              <p className="font-medium mb-1 dark:text-gray-100">Key Tools</p>
                              <div className="flex flex-wrap gap-2">
                                {details.keyTools.map((tool: string, i: number) => (
                                  <span key={i} className="bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200 px-2 py-1 rounded-full text-xs">
                                    {tool}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </div>
            
            <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-start space-x-3">
                <Info className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium mb-2 dark:text-gray-100">What do these results mean?</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    These career matches are based on your responses to the quiz questions. They
                    represent potential career paths that align with your interests, skills, and
                    preferences. The higher the match percentage, the more likely you may enjoy and
                    excel in that career based on your quiz responses.
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                    Remember that this is just a starting point. Consider researching these careers further, 
                    talking to professionals in these fields, or discussing with our AI assistant for more insights.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between bg-gray-50 dark:bg-gray-800/50 p-6">
            <Button variant="outline" onClick={resetQuiz} className="gap-2">
              <ChevronRight className="h-4 w-4 rotate-180" />
              Take Another Quiz
            </Button>
            <Button 
              onClick={() => window.location.href = "/dashboard/chatbot"} 
              className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary gap-2"
            >
              Discuss With AI Assistant
              <Cpu className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Render active quiz
  const currentQuestion = activeQuiz.questions[currentQuestionIndex];
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {activeQuiz.title}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          Question {currentQuestionIndex + 1} of {activeQuiz.questions.length}
        </p>
      </div>
      
      <div className="mb-6">
        <Progress value={getProgress()} className="h-2" />
      </div>
      
      <Card className="border-2 shadow-md">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20">
          <CardTitle className="text-xl">
            {currentQuestion.text}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <RadioGroup
            value={getCurrentAnswer()?.optionId?.toString() || ""}
            onValueChange={(value: string) => handleAnswerSelect(parseInt(value))}
            className="space-y-4"
          >
            {currentQuestion.options.map((option: { id: number; text: string }) => (
              <div 
                key={option.id} 
                className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-all ${
                  getCurrentAnswer()?.optionId === option.id 
                    ? 'border-primary bg-primary/5' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <RadioGroupItem 
                  value={option.id.toString()} 
                  id={`option-${option.id}`} 
                  className="data-[state=checked]:border-primary data-[state=checked]:text-primary"
                />
                <Label 
                  htmlFor={`option-${option.id}`} 
                  className="cursor-pointer font-medium w-full"
                >
                  {option.text}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex justify-between bg-gray-50 dark:bg-gray-800/50 p-6">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="px-6"
          >
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={isNextDisabled() || submitQuizMutation.isPending}
            className={`px-6 ${
              !isNextDisabled() ? 'bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary' : ''
            }`}
          >
            {submitQuizMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : currentQuestionIndex === activeQuiz.questions.length - 1 ? (
              "Submit"
            ) : (
              "Next"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}