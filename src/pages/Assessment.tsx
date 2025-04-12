
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PencilRuler, Upload, VoiceNetwork, ActivitySquare } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const Assessment = () => {
  const { toast } = useToast();
  const [spiralImage, setSpiralImage] = useState<string | null>(null);
  const [voiceRecording, setVoiceRecording] = useState<string | null>(null);
  const [postureImage, setPostureImage] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

  const handleSpiralUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setSpiralImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      toast({
        title: "Spiral image uploaded",
        description: "Your spiral drawing has been uploaded successfully.",
      });
    }
  };

  const handlePostureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPostureImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      toast({
        title: "Posture image uploaded",
        description: "Your posture image has been uploaded successfully.",
      });
    }
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
        toast({
          title: "Recording complete",
          description: "Your voice sample has been recorded successfully.",
        });
      };
      
      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);
      
      // Start timer
      const startTime = Date.now();
      const timerInterval = setInterval(() => {
        setRecordingTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      
      // Stop recording after 10 seconds
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

  const handleSubmit = (type: string) => {
    // In a real application, this would send the data to your backend for processing
    toast({
      title: `${type} assessment submitted`,
      description: "Your data has been submitted for analysis. Results will be available soon.",
    });
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
          </div>

          <Tabs defaultValue="spiral" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="spiral" className="flex items-center gap-2">
                <PencilRuler className="h-4 w-4" />
                <span className="hidden sm:inline">Spiral Drawing</span>
              </TabsTrigger>
              <TabsTrigger value="voice" className="flex items-center gap-2">
                <VoiceNetwork className="h-4 w-4" />
                <span className="hidden sm:inline">Voice Recording</span>
              </TabsTrigger>
              <TabsTrigger value="posture" className="flex items-center gap-2">
                <ActivitySquare className="h-4 w-4" />
                <span className="hidden sm:inline">Posture Analysis</span>
              </TabsTrigger>
            </TabsList>

            {/* Spiral Drawing Tab */}
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
                        <>
                          <Upload className="h-10 w-10 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500 mb-2">Upload a spiral drawing image</p>
                          <p className="text-xs text-gray-400 mb-4">PNG, JPG or GIF (max. 5MB)</p>
                          <label htmlFor="spiral-upload">
                            <Button variant="default" className="cursor-pointer">Browse Files</Button>
                            <input 
                              id="spiral-upload" 
                              type="file" 
                              accept="image/*"
                              className="hidden"
                              onChange={handleSpiralUpload}
                            />
                          </label>
                        </>
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
                              onClick={() => setSpiralImage(null)}
                            >
                              Remove
                            </Button>
                            <Button 
                              onClick={() => handleSubmit('Spiral')}
                            >
                              Analyze Drawing
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

            {/* Voice Recording Tab */}
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
                          <VoiceNetwork className="h-10 w-10 text-gray-400 mb-2" />
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
                              onClick={() => setVoiceRecording(null)}
                            >
                              Record Again
                            </Button>
                            <Button 
                              onClick={() => handleSubmit('Voice')}
                            >
                              Analyze Voice
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

            {/* Posture Analysis Tab */}
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
                        <>
                          <Upload className="h-10 w-10 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500 mb-2">Upload a full body standing image</p>
                          <p className="text-xs text-gray-400 mb-4">PNG, JPG or GIF (max. 5MB)</p>
                          <label htmlFor="posture-upload">
                            <Button variant="default" className="cursor-pointer">Browse Files</Button>
                            <input 
                              id="posture-upload" 
                              type="file" 
                              accept="image/*"
                              className="hidden"
                              onChange={handlePostureUpload}
                            />
                          </label>
                        </>
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
                              onClick={() => setPostureImage(null)}
                            >
                              Remove
                            </Button>
                            <Button 
                              onClick={() => handleSubmit('Posture')}
                            >
                              Analyze Posture
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
          </Tabs>

          <div className="mt-8 text-center">
            <Button 
              className="bg-parkinsons-600 hover:bg-parkinsons-700"
              size="lg" 
              asChild
            >
              <a href="/results">View Results Dashboard</a>
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Assessment;
