
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
    console.log("Processing spiral drawing with ML model...");
    const result = await analyzeSpiralDrawing(imageData);
    assessmentData.spiral = {
      imageData,
      result
    };
    console.log("Spiral analysis result:", result);
    return result;
  } catch (error) {
    console.error("Error processing spiral drawing:", error);
    throw error;
  }
}

// Process voice recording
export async function processVoiceRecording(audioBlob: Blob): Promise<AssessmentResult> {
  try {
    console.log("Processing voice recording with ML model...");
    const result = await analyzeVoiceRecording(audioBlob);
    assessmentData.voice = {
      audioData: URL.createObjectURL(audioBlob),
      result
    };
    console.log("Voice analysis result:", result);
    return result;
  } catch (error) {
    console.error("Error processing voice recording:", error);
    throw error;
  }
}

// Process posture image
export async function processPostureImage(imageData: string): Promise<AssessmentResult> {
  try {
    console.log("Processing posture image with ML model...");
    const result = await analyzePostureImage(imageData);
    assessmentData.posture = {
      imageData,
      result
    };
    console.log("Posture analysis result:", result);
    return result;
  } catch (error) {
    console.error("Error processing posture image:", error);
    throw error;
  }
}

// Process symptoms data
export async function processSymptoms(symptomsData: any): Promise<AssessmentResult> {
  try {
    console.log("Processing symptoms data with ML model...");
    const result = await analyzeSymptomsData(symptomsData);
    assessmentData.symptoms = {
      data: symptomsData,
      result
    };
    console.log("Symptoms analysis result:", result);
    return result;
  } catch (error) {
    console.error("Error processing symptoms data:", error);
    throw error;
  }
}

// Get all assessment data
export function getAssessmentData(): AssessmentData {
  // Calculate overall assessment if we have at least one result
  if (Object.keys(assessmentData).length > 0 && 
     (assessmentData.spiral?.result || 
      assessmentData.voice?.result || 
      assessmentData.posture?.result || 
      assessmentData.symptoms?.result)) {
      
    const overallAssessment = calculateOverallAssessment({
      spiral: assessmentData.spiral?.result,
      voice: assessmentData.voice?.result,
      posture: assessmentData.posture?.result,
      symptoms: assessmentData.symptoms?.result
    });
    
    if (overallAssessment) {
      assessmentData.overall = overallAssessment;
      
      // Add device info if available
      assessmentData.deviceInfo = {
        platform: detectPlatform(),
        osVersion: navigator.userAgent,
      };
      
      console.log("Overall assessment calculated:", assessmentData.overall);
    }
  }
  
  return assessmentData;
}

// Clear all assessment data
export function clearAssessmentData() {
  assessmentData = {};
}

// Detect platform
function detectPlatform(): "ios" | "android" | "web" {
  const userAgent = navigator.userAgent.toLowerCase();
  
  if (/iphone|ipad|ipod/.test(userAgent)) {
    return "ios";
  } else if (/android/.test(userAgent)) {
    return "android";
  } else {
    return "web";
  }
}
