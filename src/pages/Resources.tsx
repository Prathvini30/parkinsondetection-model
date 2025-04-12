
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, BookOpen, FileText, Video, Link2, ExternalLink } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

const Resources = () => {
  const educationalResources = [
    {
      title: "Understanding Parkinson's Disease",
      description: "An introduction to Parkinson's disease, its causes, symptoms, and progression.",
      link: "https://www.mayoclinic.org/diseases-conditions/parkinsons-disease/symptoms-causes/syc-20376055",
      source: "Mayo Clinic",
      type: "article"
    },
    {
      title: "Early Signs of Parkinson's",
      description: "Learn about the early warning signs that might indicate Parkinson's disease.",
      link: "https://www.parkinson.org/understanding-parkinsons/10-early-warning-signs",
      source: "Parkinson's Foundation",
      type: "article"
    },
    {
      title: "Living with Parkinson's Disease",
      description: "Tips and strategies for managing daily life with Parkinson's disease.",
      link: "https://www.michaeljfox.org/living-with-parkinsons",
      source: "Michael J. Fox Foundation",
      type: "guide"
    }
  ];

  const researchArticles = [
    {
      title: "AI-Based Detection of Parkinson's Disease Using Spiral Drawings",
      description: "Research on using machine learning to detect Parkinson's disease from spiral drawings.",
      link: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7278587/",
      source: "Journal of Medical Systems",
      year: 2020
    },
    {
      title: "Voice Analysis for Parkinson's Disease Detection",
      description: "Study on the effectiveness of voice recordings for early detection of Parkinson's.",
      link: "https://www.sciencedirect.com/science/article/abs/pii/S1568494618305829",
      source: "Applied Soft Computing",
      year: 2019
    },
    {
      title: "Computer Vision Analysis of Posture in Parkinson's Patients",
      description: "Research on using computer vision to analyze posture changes in Parkinson's patients.",
      link: "https://ieeexplore.ieee.org/document/8869607",
      source: "IEEE Journal of Biomedical and Health Informatics",
      year: 2021
    }
  ];

  const supportResources = [
    {
      title: "Parkinson's Foundation",
      description: "Leading organization working to improve care for people with Parkinson's disease.",
      link: "https://www.parkinson.org/",
      type: "organization"
    },
    {
      title: "Michael J. Fox Foundation",
      description: "Dedicated to finding a cure for Parkinson's disease through funded research.",
      link: "https://www.michaeljfox.org/",
      type: "organization"
    },
    {
      title: "American Parkinson Disease Association",
      description: "Provides support, education, and research for those impacted by Parkinson's.",
      link: "https://www.apdaparkinson.org/",
      type: "organization"
    },
    {
      title: "Parkinson's Support Groups",
      description: "Find local and online support groups for patients and caregivers.",
      link: "https://www.parkinson.org/Living-with-Parkinsons/Resources-and-Support/PD-Support-Groups",
      type: "support"
    }
  ];

  return (
    <MainLayout>
      <div className="container py-10">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4 text-center mb-8">
            <h1 className="text-3xl font-bold">Educational Resources</h1>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Learn more about Parkinson's disease, its symptoms, treatment options, and resources for patients and caregivers.
            </p>
          </div>

          <Tabs defaultValue="learn" className="w-full mb-10">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="learn" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span className="hidden sm:inline">Educational</span>
              </TabsTrigger>
              <TabsTrigger value="research" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Research</span>
              </TabsTrigger>
              <TabsTrigger value="support" className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                <span className="hidden sm:inline">Support</span>
              </TabsTrigger>
            </TabsList>

            {/* Educational Resources Tab */}
            <TabsContent value="learn">
              <Card>
                <CardHeader>
                  <CardTitle>Educational Resources</CardTitle>
                  <CardDescription>
                    Learning materials to help understand Parkinson's disease
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {educationalResources.map((resource, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{resource.title}</h3>
                            <p className="text-sm text-gray-500 mt-1">{resource.description}</p>
                            <div className="flex items-center mt-2">
                              <span className="text-xs bg-blue-100 text-blue-700 rounded-full px-2 py-0.5">
                                {resource.type}
                              </span>
                              <span className="text-xs text-gray-500 ml-2">Source: {resource.source}</span>
                            </div>
                          </div>
                          <a 
                            href={resource.link} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex items-center text-parkinsons-600 hover:text-parkinsons-800 transition-colors"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </div>
                      </div>
                    ))}
                    
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h3 className="font-medium mb-2">Recommended Videos</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <a 
                          href="https://www.youtube.com/watch?v=example1" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center p-3 bg-white rounded-md border hover:bg-gray-50 transition-colors"
                        >
                          <Video className="h-5 w-5 text-parkinsons-600 mr-2" />
                          <span className="text-sm">What is Parkinson's Disease?</span>
                        </a>
                        <a 
                          href="https://www.youtube.com/watch?v=example2" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center p-3 bg-white rounded-md border hover:bg-gray-50 transition-colors"
                        >
                          <Video className="h-5 w-5 text-parkinsons-600 mr-2" />
                          <span className="text-sm">Early Signs of Parkinson's</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Research Tab */}
            <TabsContent value="research">
              <Card>
                <CardHeader>
                  <CardTitle>Research Articles</CardTitle>
                  <CardDescription>
                    Scientific publications on Parkinson's disease detection and management
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {researchArticles.map((article, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{article.title}</h3>
                            <p className="text-sm text-gray-500 mt-1">{article.description}</p>
                            <div className="flex items-center mt-2">
                              <span className="text-xs bg-parkinsons-100 text-parkinsons-700 rounded-full px-2 py-0.5">
                                {article.year}
                              </span>
                              <span className="text-xs text-gray-500 ml-2">Source: {article.source}</span>
                            </div>
                          </div>
                          <a 
                            href={article.link} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex items-center text-parkinsons-600 hover:text-parkinsons-800 transition-colors"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Support Resources Tab */}
            <TabsContent value="support">
              <Card>
                <CardHeader>
                  <CardTitle>Support Resources</CardTitle>
                  <CardDescription>
                    Organizations and communities supporting Parkinson's patients and research
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {supportResources.map((resource, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{resource.title}</h3>
                            <p className="text-sm text-gray-500 mt-1">{resource.description}</p>
                            <div className="flex items-center mt-2">
                              <span className="text-xs bg-green-100 text-green-700 rounded-full px-2 py-0.5">
                                {resource.type}
                              </span>
                            </div>
                          </div>
                          <a 
                            href={resource.link} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex items-center text-parkinsons-600 hover:text-parkinsons-800 transition-colors"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </div>
                      </div>
                    ))}

                    <div className="p-4 bg-green-50 rounded-lg">
                      <h3 className="font-medium mb-2">Finding Help</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        If you or someone you know has been diagnosed with Parkinson's disease, 
                        remember that help is available. Contact these organizations for support or 
                        to find local resources in your area.
                      </p>
                      <Button className="bg-parkinsons-600 hover:bg-parkinsons-700" asChild>
                        <a 
                          href="https://www.parkinson.org/resources-support/helpline" 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          Contact Helpline
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="bg-gray-50 p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Disclaimer</h2>
            <p className="text-gray-600 text-sm">
              The information provided on this website is for general informational and educational 
              purposes only. It is not intended to be a substitute for professional medical advice, 
              diagnosis, or treatment. Always seek the advice of your physician or other qualified 
              health provider with any questions you may have regarding a medical condition.
            </p>
            <Separator className="my-4" />
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <p className="text-sm text-gray-500 mb-4 sm:mb-0">
                Need help understanding your assessment results?
              </p>
              <Button variant="outline" asChild>
                <a href="/results">View Your Results</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Resources;
