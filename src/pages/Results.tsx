import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { PencilRuler, ActivitySquare, Brain, Mic, FileBarChart, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, Navigate } from "react-router-dom";
import { CustomButton } from "@/components/ui/custom-button";
import { useAssessment } from "@/context/AssessmentContext";
import { useEffect, useState } from "react";
import { AssessmentResult } from "@/types/assessment";

const Results = () => {
  const { assessmentData, loadingModels, resetAssessment, refreshResults } = useAssessment();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Refresh results when the component mounts
    refreshResults();
    
    // Simulate loading time to fetch results
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [refreshResults]);

  // Function to get status color
  const getStatusColor = (status: "healthy" | "mild" | "moderate" | "severe") => {
    switch (status) {
      case "healthy": return "text-green-600 bg-green-50";
      case "mild": return "text-yellow-600 bg-yellow-50";
      case "moderate": return "text-orange-600 bg-orange-50";
      case "severe": return "text-red-600 bg-red-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };
  
  // Check if we have any assessment data
  const hasAnyData = Object.keys(assessmentData).length > 0;
  
  // If there's no assessment data and we're not loading, redirect to assessment page
  if (!hasAnyData && !loading && !loadingModels) {
    return <Navigate to="/assessment" />;
  }

  return (
    <MainLayout>
      <div className="container py-10">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4 text-center mb-8">
            <h1 className="text-3xl font-bold">Assessment Results</h1>
            <p className="text-gray-500">
              Review your Parkinson's disease assessment results across multiple data points
            </p>
          </div>

          {loading || loadingModels ? (
            <div className="flex flex-col items-center justify-center h-64">
              <Loader2 className="h-12 w-12 animate-spin text-parkinsons-600 mb-4" />
              <p className="text-lg text-gray-600">Loading your assessment results...</p>
            </div>
          ) : !hasAnyData ? (
            <div className="text-center p-8 border rounded-lg">
              <p className="text-lg mb-4">No assessment data available.</p>
              <Button asChild>
                <Link to="/assessment">Go to Assessment</Link>
              </Button>
            </div>
          ) : (
            <>
              {/* Overall Results Summary */}
              <Card className="mb-8 border-parkinsons-600/20">
                <CardHeader className="bg-parkinsons-50">
                  <CardTitle className="flex items-center">
                    <FileBarChart className="mr-2 h-5 w-5 text-parkinsons-600" />
                    Parkinson's Disease Analysis
                  </CardTitle>
                  <CardDescription>
                    Machine learning analysis based on your uploaded data
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  {assessmentData.overall ? (
                    <>
                      <div className="mb-6 text-center">
                        <div className={`inline-block text-lg font-semibold rounded-full px-4 py-2 ${getStatusColor(assessmentData.overall.status)}`}>
                          {assessmentData.overall.status === "healthy" ? (
                            "No significant Parkinson's indicators detected"
                          ) : (
                            `${assessmentData.overall.status.charAt(0).toUpperCase() + assessmentData.overall.status.slice(1)} Parkinson's Disease indicators detected`
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="text-center p-4 border rounded-lg">
                          <p className="text-sm text-gray-500">Severity Score</p>
                          <p className="text-3xl font-bold text-parkinsons-600">{assessmentData.overall.score}/100</p>
                        </div>
                        <div className="text-center p-4 border rounded-lg">
                          <p className="text-sm text-gray-500">Confidence</p>
                          <p className="text-3xl font-bold text-parkinsons-600">{assessmentData.overall.confidence}%</p>
                        </div>
                        <div className="text-center p-4 border rounded-lg">
                          <p className="text-sm text-gray-500">Status</p>
                          <p className={`text-lg font-semibold rounded-full px-3 py-1 inline-block ${getStatusColor(assessmentData.overall.status)}`}>
                            {assessmentData.overall.status.charAt(0).toUpperCase() + assessmentData.overall.status.slice(1)}
                          </p>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg mb-6">
                        <h3 className="font-medium mb-2 flex items-center">
                          <Brain className="mr-2 h-4 w-4 text-parkinsons-600" />
                          Medical Recommendation:
                        </h3>
                        <p className="text-gray-600">
                          {assessmentData.overall.recommendation}
                        </p>
                      </div>
                      
                      <div className="bg-amber-50 p-4 rounded-lg mb-6">
                        <div className="flex items-start">
                          <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5 mr-2" />
                          <p className="text-sm text-amber-800">
                            This assessment is based on machine learning analysis and should not be considered a medical diagnosis.
                            Please consult with a healthcare professional for proper evaluation and diagnosis.
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className="text-center py-4">Complete at least one assessment to see overall results.</p>
                  )}

                  <div className="flex flex-col sm:flex-row justify-center gap-3">
                    <Button variant="outline" asChild>
                      <Link to="/resources">View Resources</Link>
                    </Button>
                    <Button className="bg-parkinsons-600 hover:bg-parkinsons-700" asChild>
                      <Link to="/assessment">Take Another Assessment</Link>
                    </Button>
                    <Button variant="destructive" onClick={resetAssessment}>
                      Reset Assessment
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Results */}
              <h2 className="text-xl font-semibold mb-4">Detailed Assessment Results</h2>
              <Tabs defaultValue="spiral" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="spiral" className="flex items-center gap-2">
                    <PencilRuler className="h-4 w-4" />
                    <span className="hidden sm:inline">Spiral Drawing</span>
                  </TabsTrigger>
                  <TabsTrigger value="voice" className="flex items-center gap-2">
                    <Mic className="h-4 w-4" />
                    <span className="hidden sm:inline">Voice Analysis</span>
                  </TabsTrigger>
                  <TabsTrigger value="posture" className="flex items-center gap-2">
                    <ActivitySquare className="h-4 w-4" />
                    <span className="hidden sm:inline">Posture Analysis</span>
                  </TabsTrigger>
                </TabsList>

                {/* Spiral Results Tab */}
                <TabsContent value="spiral">
                  <Card>
                    <CardHeader>
                      <CardTitle>Spiral Drawing Analysis</CardTitle>
                      <CardDescription>
                        Assessment of fine motor control through spiral drawing pattern
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {assessmentData.spiral?.result ? (
                        <ResultContent result={assessmentData.spiral.result} type="spiral" imageData={assessmentData.spiral.imageData} />
                      ) : (
                        <p className="text-center py-4">No spiral analysis data available.</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Voice Results Tab */}
                <TabsContent value="voice">
                  <Card>
                    <CardHeader>
                      <CardTitle>Voice Analysis</CardTitle>
                      <CardDescription>
                        Assessment of speech patterns and vocal characteristics
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {assessmentData.voice?.result ? (
                        <ResultContent result={assessmentData.voice.result} type="voice" audioData={assessmentData.voice.audioData} />
                      ) : (
                        <p className="text-center py-4">No voice analysis data available.</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Posture Results Tab */}
                <TabsContent value="posture">
                  <Card>
                    <CardHeader>
                      <CardTitle>Posture Analysis</CardTitle>
                      <CardDescription>
                        Assessment of body posture and balance characteristics
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {assessmentData.posture?.result ? (
                        <ResultContent result={assessmentData.posture.result} type="posture" imageData={assessmentData.posture.imageData} />
                      ) : (
                        <p className="text-center py-4">No posture analysis data available.</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 mb-4">
              These results are for informational purposes only and should not replace professional medical advice.
            </p>
            <Button asChild variant="outline">
              <Link to="/" className="text-parkinsons-600">
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

// Component to display result content
const ResultContent = ({ 
  result, 
  type, 
  imageData, 
  audioData 
}: { 
  result: AssessmentResult, 
  type: string,
  imageData?: string,
  audioData?: string 
}) => {
  // Function to get status color
  const getStatusColor = (status: "healthy" | "mild" | "moderate" | "severe") => {
    switch (status) {
      case "healthy": return "text-green-600 bg-green-50";
      case "mild": return "text-yellow-600 bg-yellow-50";
      case "moderate": return "text-orange-600 bg-orange-50";
      case "severe": return "text-red-600 bg-red-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };
  
  // Content descriptions for each type
  const typeContent = {
    spiral: {
      title: "What This Means:",
      description: "Spiral drawing tests assess the fine motor control and coordination of your hand movements.",
      bullets: [
        "Consistent line thickness and spacing indicates good motor control",
        "Tremors may appear as waviness or shakiness in the lines",
        "Micrographia (small handwriting) can be an early sign of Parkinson's"
      ]
    },
    voice: {
      title: "What This Means:",
      description: "Voice analysis examines several characteristics of speech that may be affected by Parkinson's disease.",
      bullets: [
        "Reduced variation in pitch and loudness may indicate dysarthria",
        "Changes in voice quality, such as breathiness or hoarseness",
        "Rhythm and rate of speech can reveal neurological changes"
      ]
    },
    posture: {
      title: "What This Means:",
      description: "Posture analysis examines body positioning and balance that may be affected by Parkinson's disease.",
      bullets: [
        "Forward leaning posture is common in Parkinson's patients",
        "Asymmetry in stance can indicate neurological imbalance",
        "Reduced arm swing and stooped posture are early indicators"
      ]
    }
  };

  const content = typeContent[type as keyof typeof typeContent] || typeContent.spiral;
  
  return (
    <div className="space-y-6">
      {imageData && (
        <div className="border rounded-md overflow-hidden">
          <img 
            src={imageData} 
            alt={`${type} analysis image`} 
            className="max-h-64 mx-auto my-4"
          />
        </div>
      )}
      
      {audioData && (
        <div className="border rounded-md p-4">
          <audio controls src={audioData} className="w-full" />
        </div>
      )}
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Machine Learning Analysis</h3>
        <div className={`rounded-md p-3 mb-4 ${getStatusColor(result.status)}`}>
          <p className="font-medium">
            {result.status === "healthy" ? (
              "No significant Parkinson's indicators detected"
            ) : (
              `${result.status.charAt(0).toUpperCase() + result.status.slice(1)} Parkinson's Disease indicators detected`
            )}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium mb-2">Score: {result.score}/100</p>
          <Progress value={result.score} className="h-2" />
        </div>
        <div>
          <p className="text-sm font-medium mb-2">Confidence: {result.confidence}%</p>
          <Progress value={result.confidence} className="h-2" />
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Analysis Details:</h3>
        <p className="text-gray-600">
          {result.details || "No detailed analysis available."}
        </p>
      </div>

      <div className="p-4 border rounded-md">
        <h3 className="font-medium mb-2">{content.title}</h3>
        <p className="text-sm text-gray-600 mb-2">
          {content.description}
        </p>
        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
          {content.bullets.map((bullet, index) => (
            <li key={index}>{bullet}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Results;
