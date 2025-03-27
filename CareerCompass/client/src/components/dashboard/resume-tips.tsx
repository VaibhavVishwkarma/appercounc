import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResumeTemplate } from "@shared/schema";
import { Loader2, Download, ExternalLink } from "lucide-react";

export function ResumeTips() {
  const [activeTab, setActiveTab] = useState("templates");

  // Fetch resume templates
  const { data: templates, isLoading } = useQuery<ResumeTemplate[]>({
    queryKey: ["/api/resume-templates"],
  });

  const resumeTips = [
    {
      title: "Keep it concise",
      description: "Limit your resume to one or two pages. Focus on the most relevant experiences and skills."
    },
    {
      title: "Tailor to the job",
      description: "Customize your resume for each job application by highlighting relevant skills and experiences."
    },
    {
      title: "Use action verbs",
      description: "Start bullet points with strong action verbs like 'achieved', 'managed', 'implemented', etc."
    },
    {
      title: "Quantify achievements",
      description: "Include specific numbers and percentages to demonstrate the impact of your work."
    },
    {
      title: "Proofread carefully",
      description: "Ensure there are no spelling or grammatical errors. Have someone else review it as well."
    },
    {
      title: "Use a clean design",
      description: "Choose a clean, professional layout with consistent formatting and easy-to-read fonts."
    }
  ];

  const sections = [
    {
      title: "Contact Information",
      content: "Include your name, phone number, email address, LinkedIn profile, and optionally your location.",
      example: `John Doe
(123) 456-7890
john.doe@example.com
linkedin.com/in/johndoe`
    },
    {
      title: "Professional Summary",
      content: "A brief 2-3 sentence overview of your professional background, key skills, and career goals.",
      example: "Results-driven UX Designer with 5+ years of experience creating user-centered digital products for diverse clients. Skilled in user research, wireframing, and prototyping with a focus on accessibility and usability."
    },
    {
      title: "Work Experience",
      content: "List your work history in reverse chronological order. Include company name, job title, dates, and bulleted accomplishments.",
      example: `UX Designer | ABC Company | Jan 2020 - Present
• Led redesign of core product, increasing user engagement by 35%
• Conducted user research with 50+ participants to inform design decisions
• Collaborated with developers to implement designs that reduced user errors by 25%`
    },
    {
      title: "Education",
      content: "Include degrees, schools, graduation dates, and relevant coursework or honors.",
      example: `Bachelor of Arts in Design | University Name | 2019
• Graduated with honors (GPA: 3.8/4.0)
• Relevant coursework: User Interface Design, Web Development, Human-Computer Interaction`
    },
    {
      title: "Skills",
      content: "List relevant technical and soft skills, organized by category if helpful.",
      example: `Technical: Figma, Adobe XD, Sketch, HTML/CSS, InVision
UX Methods: User Research, Wireframing, Prototyping, Usability Testing
Soft Skills: Team Collaboration, Project Management, Client Communication`
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Resume Building</h2>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          Get expert tips and templates to create a professional resume that stands out to employers.
        </p>
      </div>

      <Tabs defaultValue="templates" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="templates">Resume Templates</TabsTrigger>
          <TabsTrigger value="tips">Resume Tips</TabsTrigger>
          <TabsTrigger value="sections">Resume Sections</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {templates?.map((template) => (
              <Card key={template.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-40 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button size="sm">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tips" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resumeTips.map((tip, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{tip.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">{tip.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>General Resume Advice</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Your resume is often the first impression you make on potential employers. It should be clear, concise, and highlight your most relevant qualifications for the job.</p>
              
              <h3 className="font-medium text-lg mt-4">ATS Compatibility</h3>
              <p>Many companies use Applicant Tracking Systems (ATS) to screen resumes. To ensure your resume gets through:</p>
              <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-300">
                <li>Use standard section headings (Experience, Education, Skills)</li>
                <li>Include keywords from the job description</li>
                <li>Avoid using graphics, tables, or headers/footers</li>
                <li>Submit in PDF format to preserve formatting</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sections" className="space-y-6">
          <div className="space-y-6">
            {sections.map((section, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{section.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-300">{section.content}</p>
                  
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md border border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm font-medium mb-2">Example:</h4>
                    <pre className="text-sm whitespace-pre-wrap text-gray-800 dark:text-gray-200 font-mono">
                      {section.example}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
