
import { loadSpiralModel, analyzeSpiralDrawing } from './spiralAnalysis';
import { loadVoiceModel, analyzeVoiceRecording } from './voiceAnalysis';
import { loadPostureModel, analyzePostureImage } from './postureAnalysis';
import { analyzeSymptomsData, calculateOverallAssessment } from './symptomsAnalysis';
import { AssessmentData, AssessmentResult } from '@/types/assessment';

// Initialize all ML models
export async function initializeModels() {
  try {
    console.log("Loading ML models...");
    await Promise.all([
      loadSpiralModel(),
      loadVoiceModel(),
      loadPostureModel()
    ]);
    console.log("All ML models loaded successfully");
    return true;
  } catch (error) {
    console.error("Error loading ML models:", error);
    return false;
  }
}

// Store assessment results
let assessmentData: AssessmentData = {};

// Process spiral drawing
export async function processSpiralDrawing(imageData: string): Promise<AssessmentResult> {
  try {
    const result = await analyzeSpiralDrawing(imageData);
    assessmentData.spiral = {
      imageData,
      result
    };
    return result;
  } catch (error) {
    console.error("Error processing spiral drawing:", error);
    throw error;
  }
}

// Process voice recording
export async function processVoiceRecording(audioBlob: Blob): Promise<AssessmentResult> {
  try {
    const result = await analyzeVoiceRecording(audioBlob);
    assessmentData.voice = {
      audioData: URL.createObjectURL(audioBlob),
      result
    };
    return result;
  } catch (error) {
    console.error("Error processing voice recording:", error);
    throw error;
  }
}

// Process posture image
export async function processPostureImage(imageData: string): Promise<AssessmentResult> {
  try {
    const result = await analyzePostureImage(imageData);
    assessmentData.posture = {
      imageData,
      result
    };
    return result;
  } catch (error) {
    console.error("Error processing posture image:", error);
    throw error;
  }
}

// Process symptoms data
export async function processSymptoms(symptomsData: any): Promise<AssessmentResult> {
  try {
    const result = await analyzeSymptomsData(symptomsData);
    assessmentData.symptoms = {
      data: symptomsData,
      result
    };
    return result;
  } catch (error) {
    console.error("Error processing symptoms data:", error);
    throw error;
  }
}

// Get all assessment data
export function getAssessmentData(): AssessmentData {
  // Calculate overall assessment if we have at least one result
  if (Object.keys(assessmentData).length > 0) {
    const overallAssessment = calculateOverallAssessment({
      spiral: assessmentData.spiral?.result,
      voice: assessmentData.voice?.result,
      posture: assessmentData.posture?.result,
      symptoms: assessmentData.symptoms?.result
    });
    
    if (overallAssessment) {
      assessmentData.overall = overallAssessment;
    }
  }
  
  return assessmentData;
}

// Clear all assessment data
export function clearAssessmentData() {
  assessmentData = {};
}
