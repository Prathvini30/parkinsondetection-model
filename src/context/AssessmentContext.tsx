
import React, { createContext, useContext, useState, useEffect } from "react";
import { AssessmentData } from "@/types/assessment";
import { initializeModels, getAssessmentData, clearAssessmentData } from "@/services/ml";

interface AssessmentContextType {
  assessmentData: AssessmentData;
  loadingModels: boolean;
  modelsLoaded: boolean;
  resetAssessment: () => void;
}

const AssessmentContext = createContext<AssessmentContextType>({
  assessmentData: {},
  loadingModels: false,
  modelsLoaded: false,
  resetAssessment: () => {},
});

export const useAssessment = () => useContext(AssessmentContext);

export const AssessmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loadingModels, setLoadingModels] = useState(true);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [assessmentData, setAssessmentData] = useState<AssessmentData>({});

  // Initialize ML models on component mount
  useEffect(() => {
    const loadModels = async () => {
      try {
        setLoadingModels(true);
        const loaded = await initializeModels();
        setModelsLoaded(loaded);
      } catch (error) {
        console.error("Failed to load ML models:", error);
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

  // Reset assessment data
  const resetAssessment = () => {
    clearAssessmentData();
    setAssessmentData({});
  };

  return (
    <AssessmentContext.Provider
      value={{
        assessmentData,
        loadingModels,
        modelsLoaded,
        resetAssessment,
      }}
    >
      {children}
    </AssessmentContext.Provider>
  );
};
