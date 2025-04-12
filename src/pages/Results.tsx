
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { PencilRuler, ActivitySquare, Brain, VoiceNetwork, FileBarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Results = () => {
  // Mock data for demonstration - in a real app, this would come from a backend
  const mockResults = {
    spiral: {
      score: 75, // out of 100, higher is better
      confidence: 85, // confidence in results as a percentage
      status: "mild" as const,
      details: "Slight tremor patterns detected in spiral drawing. Mild inconsistency in line thickness and spacing."
    },
    voice: {
      score: 82,
      confidence: 78,
      status: "healthy" as const,
      details: "Voice patterns within normal range. No significant irregularities detected in vocal frequency or amplitude."
    },
    posture: {
      score: 68,
      confidence: 82,
      status: "mild" as const,
      details: "Slight postural asymmetry detected. Minor forward lean present which may indicate early postural instability."
    },
    overall: {
      score: 75,
      confidence: 81,
      status: "mild" as const,
      recommendation: "Consider consulting a neurologist for a professional evaluation. Early intervention can help manage symptoms effectively."
    }
  };

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

          {/* Overall Results Summary */}
          <Card className="mb-8 border-parkinsons-600/20">
            <CardHeader className="bg-parkinsons-50">
              <CardTitle className="flex items-center">
                <FileBarChart className="mr-2 h-5 w-5 text-parkinsons-600" />
                Overall Assessment Summary
              </CardTitle>
              <CardDescription>
                Comprehensive analysis based on all assessment data
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-sm text-gray-500">Overall Score</p>
                  <p className="text-3xl font-bold text-parkinsons-600">{mockResults.overall.score}/100</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-sm text-gray-500">Confidence</p>
                  <p className="text-3xl font-bold text-parkinsons-600">{mockResults.overall.confidence}%</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-sm text-gray-500">Status</p>
                  <p className={`text-lg font-semibold rounded-full px-3 py-1 inline-block ${getStatusColor(mockResults.overall.status)}`}>
                    {mockResults.overall.status.charAt(0).toUpperCase() + mockResults.overall.status.slice(1)} Risk
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="font-medium mb-2 flex items-center">
                  <Brain className="mr-2 h-4 w-4 text-parkinsons-600" />
                  Recommendation:
                </h3>
                <p className="text-gray-600">
                  {mockResults.overall.recommendation}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <Button variant="outline" asChild>
                  <Link to="/resources">View Resources</Link>
                </Button>
                <Button className="bg-parkinsons-600 hover:bg-parkinsons-700" asChild>
                  <Link to="/assessment">Take Another Assessment</Link>
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
                <VoiceNetwork className="h-4 w-4" />
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
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium mb-2">Score: {mockResults.spiral.score}/100</p>
                        <Progress value={mockResults.spiral.score} className="h-2" />
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-2">Confidence: {mockResults.spiral.confidence}%</p>
                        <Progress value={mockResults.spiral.confidence} className="h-2" />
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2">Status:</p>
                      <div className={`rounded-md p-3 ${getStatusColor(mockResults.spiral.status)}`}>
                        <p className="font-medium">{mockResults.spiral.status.charAt(0).toUpperCase() + mockResults.spiral.status.slice(1)} Indicators</p>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium mb-2">Analysis Details:</h3>
                      <p className="text-gray-600">
                        {mockResults.spiral.details}
                      </p>
                    </div>

                    <div className="p-4 border rounded-md">
                      <h3 className="font-medium mb-2">What This Means:</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        Spiral drawing tests assess the fine motor control and coordination of your hand movements.
                      </p>
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        <li>Consistent line thickness and spacing indicates good motor control</li>
                        <li>Tremors may appear as waviness or shakiness in the lines</li>
                        <li>Micrographia (small handwriting) can be an early sign of Parkinson's</li>
                      </ul>
                    </div>
                  </div>
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
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium mb-2">Score: {mockResults.voice.score}/100</p>
                        <Progress value={mockResults.voice.score} className="h-2" />
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-2">Confidence: {mockResults.voice.confidence}%</p>
                        <Progress value={mockResults.voice.confidence} className="h-2" />
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2">Status:</p>
                      <div className={`rounded-md p-3 ${getStatusColor(mockResults.voice.status)}`}>
                        <p className="font-medium">{mockResults.voice.status.charAt(0).toUpperCase() + mockResults.voice.status.slice(1)} Indicators</p>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium mb-2">Analysis Details:</h3>
                      <p className="text-gray-600">
                        {mockResults.voice.details}
                      </p>
                    </div>

                    <div className="p-4 border rounded-md">
                      <h3 className="font-medium mb-2">What This Means:</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        Voice analysis examines several characteristics of speech that may be affected by Parkinson's disease.
                      </p>
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        <li>Reduced variation in pitch and loudness may indicate dysarthria</li>
                        <li>Changes in voice quality, such as breathiness or hoarseness</li>
                        <li>Rhythm and rate of speech can reveal neurological changes</li>
                      </ul>
                    </div>
                  </div>
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
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium mb-2">Score: {mockResults.posture.score}/100</p>
                        <Progress value={mockResults.posture.score} className="h-2" />
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-2">Confidence: {mockResults.posture.confidence}%</p>
                        <Progress value={mockResults.posture.confidence} className="h-2" />
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2">Status:</p>
                      <div className={`rounded-md p-3 ${getStatusColor(mockResults.posture.status)}`}>
                        <p className="font-medium">{mockResults.posture.status.charAt(0).toUpperCase() + mockResults.posture.status.slice(1)} Indicators</p>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium mb-2">Analysis Details:</h3>
                      <p className="text-gray-600">
                        {mockResults.posture.details}
                      </p>
                    </div>

                    <div className="p-4 border rounded-md">
                      <h3 className="font-medium mb-2">What This Means:</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        Posture analysis examines body positioning and balance that may be affected by Parkinson's disease.
                      </p>
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        <li>Forward leaning posture is common in Parkinson's patients</li>
                        <li>Asymmetry in stance can indicate neurological imbalance</li>
                        <li>Reduced arm swing and stooped posture are early indicators</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

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

export default Results;
