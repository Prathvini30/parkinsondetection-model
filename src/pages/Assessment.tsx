
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PencilRuler, Upload, Mic, ActivitySquare, ClipboardList, Thermometer, AlertTriangle, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import { CustomButton } from "@/components/ui/custom-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { CustomTextarea } from "@/components/ui/custom-textarea";
import { useNavigate } from "react-router-dom";
import { 
  processSpiralDrawing, 
  processVoiceRecording, 
  processPostureImage, 
  processSymptoms 
} from "@/services/ml";
import { useAssessment } from "@/context/AssessmentContext";
import { Progress } from "@/components/ui/progress";
import { UploadHandler } from "@/components/assessment/UploadHandler";

const Assessment = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { modelsLoaded, loadingModels } = useAssessment();
  
  const [spiralImage, setSpiralImage] = useState<string | null>(null);
  const [voiceRecording, setVoiceRecording] = useState<string | null>(null);
  const [postureImage, setPostureImage] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  
  const [tremor, setTremor] = useState<number[]>([0]);
  const [stiffness, setStiffness] = useState<number[]>([0]);
  const [balance, setBalance] = useState<number[]>([0]);
  const [hasFreeze, setHasFreeze] = useState(false);
  const [hasSleepIssues, setHasSleepIssues] = useState(false);
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [age, setAge] = useState("");
  const [familyHistory, setFamilyHistory] = useState(false);
  
  const [analyzingSpiral, setAnalyzingSpiral] = useState(false);
  const [analyzingVoice, setAnalyzingVoice] = useState(false);
  const [analyzingPosture, setAnalyzingPosture] = useState(false);
  const [analyzingSymptoms, setAnalyzingSymptoms] = useState(false);
  const [spiralAnalyzed, setSpiralAnalyzed] = useState(false);
  const [voiceAnalyzed, setVoiceAnalyzed] = useState(false);
  const [postureAnalyzed, setPostureAnalyzed] = useState(false);
  const [symptomsAnalyzed, setSymptomsAnalyzed] = useState(false);
  
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleSpiralUpload = (file: File) => {
    const reader = new FileReader();
    
    // Simulate upload progress
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) clearInterval(progressInterval);
    }, 100);
    
    reader.onloadend = () => {
      setSpiralImage(reader.result as string);
      setSpiralAnalyzed(false);
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      toast({
        title: "Spiral image uploaded",
        description: "Your spiral drawing has been uploaded successfully.",
      });
      
      setTimeout(() => setUploadProgress(0), 500);
    };
    
    reader.readAsDataURL(file);
  };

  const handlePostureUpload = (file: File) => {
    const reader = new FileReader();
    
    // Simulate upload progress
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) clearInterval(progressInterval);
    }, 100);
    
    reader.onloadend = () => {
      setPostureImage(reader.result as string);
      setPostureAnalyzed(false);
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      toast({
        title: "Posture image uploaded",
        description: "Your posture image has been uploaded successfully.",
      });
      
      setTimeout(() => setUploadProgress(0), 500);
    };
    
    reader.readAsDataURL(file);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      
      recorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };
      
      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setVoiceRecording(audioUrl);
        setAudioChunks(chunks);
        setRecordingTime(0);
        setVoiceAnalyzed(false);
        toast({
          title: "Recording complete",
          description: "Your voice sample has been recorded successfully.",
        });
      };
      
      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);
      
      const startTime = Date.now();
      const timerInterval = setInterval(() => {
        setRecordingTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      
      setTimeout(() => {
        clearInterval(timerInterval);
        recorder.stop();
        stream.getTracks().forEach(track => track.stop());
        setIsRecording(false);
      }, 10000);
      
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not access microphone. Please check permissions.",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const analyzeSpiralDrawing = async () => {
    if (!spiralImage || !modelsLoaded) return;
    
    try {
      setAnalyzingSpiral(true);
      const result = await processSpiralDrawing(spiralImage);
      setSpiralAnalyzed(true);
      
      toast({
        title: "Spiral Analysis Complete",
        description: `Analysis indicates ${result.status} indicators with ${result.confidence}% confidence.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "There was an error analyzing your spiral drawing.",
      });
    } finally {
      setAnalyzingSpiral(false);
    }
  };

  const analyzeVoiceRecording = async () => {
    if (!voiceRecording || audioChunks.length === 0 || !modelsLoaded) return;
    
    try {
      setAnalyzingVoice(true);
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      const result = await processVoiceRecording(audioBlob);
      setVoiceAnalyzed(true);
      
      toast({
        title: "Voice Analysis Complete",
        description: `Analysis indicates ${result.status} indicators with ${result.confidence}% confidence.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "There was an error analyzing your voice recording.",
      });
    } finally {
      setAnalyzingVoice(false);
    }
  };

  const analyzePostureImage = async () => {
    if (!postureImage || !modelsLoaded) return;
    
    try {
      setAnalyzingPosture(true);
      const result = await processPostureImage(postureImage);
      setPostureAnalyzed(true);
      
      toast({
        title: "Posture Analysis Complete",
        description: `Analysis indicates ${result.status} indicators with ${result.confidence}% confidence.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "There was an error analyzing your posture image.",
      });
    } finally {
      setAnalyzingPosture(false);
    }
  };

  const analyzeSymptomsData = async () => {
    if (!age || !modelsLoaded) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please enter your age before submitting.",
      });
      return;
    }
    
    try {
      setAnalyzingSymptoms(true);
      const symptomsData = {
        age,
        familyHistory,
        tremor: tremor[0],
        stiffness: stiffness[0],
        balance: balance[0],
        hasFreeze,
        hasSleepIssues,
        additionalNotes
      };
      
      const result = await processSymptoms(symptomsData);
      setSymptomsAnalyzed(true);
      
      toast({
        title: "Symptoms Analysis Complete",
        description: `Analysis indicates ${result.status} indicators with ${result.confidence}% confidence.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "There was an error analyzing your symptoms data.",
      });
    } finally {
      setAnalyzingSymptoms(false);
    }
  };

  const navigateToResults = () => {
    navigate('/results');
  };

  return (
    <MainLayout>
      <div className="container py-10">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4 text-center mb-8">
            <h1 className="text-3xl font-bold">Parkinson's Disease Assessment</h1>
            <p className="text-gray-500">
              Complete the assessments below to receive a comprehensive analysis of potential Parkinson's disease indicators.
            </p>
            
            {loadingModels && (
              <div className="flex items-center justify-center gap-2 text-parkinsons-600">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Loading machine learning models...</span>
              </div>
            )}
          </div>

          <Tabs defaultValue="spiral" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="spiral" className="flex items-center gap-2">
                <PencilRuler className="h-4 w-4" />
                <span className="hidden sm:inline">Spiral</span>
              </TabsTrigger>
              <TabsTrigger value="voice" className="flex items-center gap-2">
                <Mic className="h-4 w-4" />
                <span className="hidden sm:inline">Voice</span>
              </TabsTrigger>
              <TabsTrigger value="posture" className="flex items-center gap-2">
                <ActivitySquare className="h-4 w-4" />
                <span className="hidden sm:inline">Posture</span>
              </TabsTrigger>
              <TabsTrigger value="symptoms" className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4" />
                <span className="hidden sm:inline">Symptoms</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="spiral">
              <Card>
                <CardHeader>
                  <CardTitle>Spiral Drawing Test</CardTitle>
                  <CardDescription>
                    Upload an image of a spiral that you've drawn on paper. This test helps assess fine motor control.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 border-gray-300 bg-gray-50">
                      {!spiralImage ? (
                        <UploadHandler 
                          iconType="spiral" 
                          title="Upload a spiral drawing image" 
                          description="PNG, JPG or GIF (max. 5MB)"
                          acceptTypes="image/*"
                          onFileSelected={handleSpiralUpload}
                          uploadProgress={uploadProgress}
                        />
                      ) : (
                        <div className="w-full">
                          <img 
                            src={spiralImage} 
                            alt="Spiral drawing" 
                            className="max-h-64 mx-auto mb-4" 
                          />
                          <div className="flex justify-center gap-2">
                            <Button 
                              variant="outline" 
                              onClick={() => {
                                setSpiralImage(null);
                                setSpiralAnalyzed(false);
                              }}
                            >
                              Remove
                            </Button>
                            <Button 
                              onClick={analyzeSpiralDrawing}
                              disabled={analyzingSpiral || spiralAnalyzed || !modelsLoaded}
                            >
                              {analyzingSpiral ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Analyzing...
                                </>
                              ) : spiralAnalyzed ? (
                                "Analysis Complete"
                              ) : (
                                "Analyze Drawing"
                              )}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-medium mb-2">Instructions:</h3>
                      <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
                        <li>Draw a spiral pattern on a white piece of paper</li>
                        <li>Make sure the drawing is clear and visible</li>
                        <li>Take a photo of your drawing in good lighting</li>
                        <li>Upload the image using the browse button above</li>
                      </ol>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="voice">
              <Card>
                <CardHeader>
                  <CardTitle>Voice Analysis Test</CardTitle>
                  <CardDescription>
                    Record your voice saying "aaah" for 10 seconds. This helps detect subtle changes in vocal patterns.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 border-gray-300 bg-gray-50">
                      {!voiceRecording ? (
                        <>
                          <Mic className="h-10 w-10 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500 mb-4">Record your voice for analysis</p>
                          
                          {!isRecording ? (
                            <Button 
                              variant="default" 
                              onClick={startRecording} 
                              className="cursor-pointer"
                            >
                              Start Recording
                            </Button>
                          ) : (
                            <div className="space-y-4 w-full">
                              <div className="flex items-center justify-center">
                                <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center border-4 border-red-500">
                                  <div className="h-6 w-6 rounded-full bg-red-500 animate-pulse"></div>
                                </div>
                              </div>
                              <p className="text-center">Recording... {recordingTime}s</p>
                              <Button 
                                variant="outline" 
                                onClick={stopRecording} 
                                className="w-full"
                              >
                                Stop Recording
                              </Button>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="w-full">
                          <div className="bg-gray-100 rounded-lg p-4 mb-4">
                            <div className="flex items-center justify-center">
                              <audio controls src={voiceRecording} className="w-full" />
                            </div>
                          </div>
                          <div className="flex justify-center gap-2">
                            <Button 
                              variant="outline" 
                              onClick={() => {
                                setVoiceRecording(null);
                                setVoiceAnalyzed(false);
                              }}
                            >
                              Record Again
                            </Button>
                            <Button 
                              onClick={analyzeVoiceRecording}
                              disabled={analyzingVoice || voiceAnalyzed || !modelsLoaded}
                            >
                              {analyzingVoice ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Analyzing...
                                </>
                              ) : voiceAnalyzed ? (
                                "Analysis Complete"
                              ) : (
                                "Analyze Voice"
                              )}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-medium mb-2">Instructions:</h3>
                      <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
                        <li>Find a quiet environment with minimal background noise</li>
                        <li>Click "Start Recording" and say "aaah" in a natural tone</li>
                        <li>Continue for the full 10 seconds or until recording stops</li>
                        <li>Review your recording and submit for analysis</li>
                      </ol>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="posture">
              <Card>
                <CardHeader>
                  <CardTitle>Posture Analysis</CardTitle>
                  <CardDescription>
                    Upload an image showing your standing posture. This helps analyze balance and postural changes.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 border-gray-300 bg-gray-50">
                      {!postureImage ? (
                        <UploadHandler 
                          iconType="posture" 
                          title="Upload a full body standing image" 
                          description="PNG, JPG or GIF (max. 5MB)"
                          acceptTypes="image/*"
                          onFileSelected={handlePostureUpload}
                          uploadProgress={uploadProgress}
                        />
                      ) : (
                        <div className="w-full">
                          <img 
                            src={postureImage} 
                            alt="Posture image" 
                            className="max-h-64 mx-auto mb-4" 
                          />
                          <div className="flex justify-center gap-2">
                            <Button 
                              variant="outline" 
                              onClick={() => {
                                setPostureImage(null);
                                setPostureAnalyzed(false);
                              }}
                            >
                              Remove
                            </Button>
                            <Button 
                              onClick={analyzePostureImage}
                              disabled={analyzingPosture || postureAnalyzed || !modelsLoaded}
                            >
                              {analyzingPosture ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Analyzing...
                                </>
                              ) : postureAnalyzed ? (
                                "Analysis Complete"
                              ) : (
                                "Analyze Posture"
                              )}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-medium mb-2">Instructions:</h3>
                      <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
                        <li>Stand naturally against a plain background</li>
                        <li>Have someone take a full body photo from the front</li>
                        <li>Ensure good lighting and that your whole body is visible</li>
                        <li>Upload the image using the browse button above</li>
                      </ol>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="symptoms">
              <Card>
                <CardHeader>
                  <CardTitle>Additional Symptoms Assessment</CardTitle>
                  <CardDescription>
                    Provide information about other symptoms you may be experiencing to improve detection accuracy.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Basic Information</h3>
                      
                      <div className="space-y-2">
                        <Label htmlFor="age">Age</Label>
                        <Input 
                          id="age" 
                          type="number" 
                          placeholder="Enter your age" 
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                        />
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="family-history" 
                          checked={familyHistory}
                          onCheckedChange={setFamilyHistory}
                        />
                        <Label htmlFor="family-history">Family history of Parkinson's disease</Label>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Rate your symptoms (0-10)</h3>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label htmlFor="tremor">Tremor Severity</Label>
                          <span className="text-sm font-medium">{tremor[0]}</span>
                        </div>
                        <Slider 
                          id="tremor"
                          min={0} 
                          max={10} 
                          step={1} 
                          value={tremor}
                          onValueChange={setTremor}
                          className="py-4"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>None</span>
                          <span>Severe</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label htmlFor="stiffness">Muscle Stiffness</Label>
                          <span className="text-sm font-medium">{stiffness[0]}</span>
                        </div>
                        <Slider 
                          id="stiffness"
                          min={0} 
                          max={10} 
                          step={1} 
                          value={stiffness}
                          onValueChange={setStiffness}
                          className="py-4"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>None</span>
                          <span>Severe</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label htmlFor="balance">Balance Problems</Label>
                          <span className="text-sm font-medium">{balance[0]}</span>
                        </div>
                        <Slider 
                          id="balance"
                          min={0} 
                          max={10} 
                          step={1} 
                          value={balance}
                          onValueChange={setBalance}
                          className="py-4"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>None</span>
                          <span>Severe</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Additional Symptoms</h3>
                      
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="freezing" 
                          checked={hasFreeze}
                          onCheckedChange={setHasFreeze}
                        />
                        <Label htmlFor="freezing">Freezing of movement (sudden inability to move)</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="sleep-issues" 
                          checked={hasSleepIssues}
                          onCheckedChange={setHasSleepIssues}
                        />
                        <Label htmlFor="sleep-issues">Sleep disturbances or REM sleep behavior disorder</Label>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="notes">Additional Notes or Symptoms</Label>
                        <CustomTextarea 
                          id="notes" 
                          variant="parkinsons"
                          placeholder="Describe any other symptoms or concerns you have..."
                          value={additionalNotes}
                          onChange={(e) => setAdditionalNotes(e.target.value)}
                          rows={4}
                        />
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-gray-600">
                          This assessment tool is intended for informational purposes only and should not replace professional medical advice. 
                          Please consult with a healthcare provider for proper diagnosis and treatment.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex justify-center">
                      <Button 
                        onClick={analyzeSymptomsData}
                        className="bg-parkinsons-600 hover:bg-parkinsons-700"
                        disabled={analyzingSymptoms || symptomsAnalyzed || !modelsLoaded}
                      >
                        {analyzingSymptoms ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Analyzing...
                          </>
                        ) : symptomsAnalyzed ? (
                          "Analysis Complete"
                        ) : (
                          "Submit Symptoms Assessment"
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-8 text-center">
            <CustomButton 
              variant="parkinsons"
              size="lg" 
              onClick={navigateToResults}
            >
              View Results Dashboard
            </CustomButton>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Assessment;
