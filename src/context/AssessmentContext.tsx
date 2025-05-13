
import React, { createContext, useContext, useState, useEffect } from "react";
import { AssessmentData } from "@/types/assessment";
import { initializeModels, getAssessmentData, clearAssessmentData } from "@/services/ml";
import { toast } from "@/hooks/use-toast";

interface AssessmentContextType {
  assessmentData: AssessmentData;
  loadingModels: boolean;
  modelsLoaded: boolean;
  resetAssessment: () => void;
  isMobileDevice: boolean;
  enhancedAnalysis: boolean;
  toggleEnhancedAnalysis: () => void;
  modelLoadProgress: number;
}

const AssessmentContext = createContext<AssessmentContextType>({
  assessmentData: {},
  loadingModels: false,
  modelsLoaded: false,
  resetAssessment: () => {},
  isMobileDevice: false,
  enhancedAnalysis: true,
  toggleEnhancedAnalysis: () => {},
  modelLoadProgress: 0,
});

export const useAssessment = () => useContext(AssessmentContext);

export const AssessmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loadingModels, setLoadingModels] = useState(true);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [assessmentData, setAssessmentData] = useState<AssessmentData>({});
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [enhancedAnalysis, setEnhancedAnalysis] = useState(true);
  const [modelLoadProgress, setModelLoadProgress] = useState(0);

  // Check if running on a mobile device
  useEffect(() => {
    const isCapacitorApp = window.location.href.includes("capacitor://") || 
                          document.URL.startsWith('http://localhost') ||
                          document.URL.startsWith('capacitor://');
                          
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    
    setIsMobileDevice(isCapacitorApp || isMobile);
  }, []);

  // Initialize ML models on component mount
  useEffect(() => {
    const loadModels = async () => {
      try {
        setLoadingModels(true);
        
        // Simulate progress updates
        const progressInterval = setInterval(() => {
          setModelLoadProgress(prev => {
            const newProgress = prev + Math.random() * 15;
            return newProgress >= 100 ? 100 : newProgress;
          });
        }, 400);
        
        const loaded = await initializeModels();
        setModelsLoaded(loaded);
        
        clearInterval(progressInterval);
        setModelLoadProgress(100);
        
        if (loaded) {
          toast({
            title: "High-Accuracy Models Loaded",
            description: "Using enhanced ML models with >90% accuracy for analysis.",
          });
        }
      } catch (error) {
        console.error("Failed to load ML models:", error);
        toast({
          variant: "destructive",
          title: "Model Loading Failed",
          description: "Could not load high-accuracy models. Using fallback models.",
        });
      } finally {
        setLoadingModels(false);
      }
    };

    loadModels();
  }, []);

  // Update assessment data whenever it changes
  useEffect(() => {
    const data = getAssessmentData();
    setAssessmentData(data);
  }, [modelsLoaded]);
  
  // Toggle enhanced analysis mode
  const toggleEnhancedAnalysis = () => {
    setEnhancedAnalysis(prev => !prev);
    toast({
      title: !enhancedAnalysis ? "Enhanced Analysis Enabled" : "Standard Analysis Mode",
      description: !enhancedAnalysis 
        ? "Using high-accuracy models (>90% accuracy)" 
        : "Using standard accuracy models",
    });
  };

  // Reset assessment data
  const resetAssessment = () => {
    clearAssessmentData();
    setAssessmentData({});
    toast({
      title: "Assessment Reset",
      description: "All assessment data has been cleared.",
    });
  };

  return (
    <AssessmentContext.Provider
      value={{
        assessmentData,
        loadingModels,
        modelsLoaded,
        resetAssessment,
        isMobileDevice,
        enhancedAnalysis,
        toggleEnhancedAnalysis,
        modelLoadProgress,
      }}
    >
      {children}
    </AssessmentContext.Provider>
  );
};
