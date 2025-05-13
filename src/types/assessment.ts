
export interface AssessmentResult {
  score: number;
  confidence: number;
  status: "healthy" | "mild" | "moderate" | "severe";
  details?: string;
}

export interface AssessmentData {
  spiral?: {
    imageData: string;
    result?: AssessmentResult;
    modelAccuracy?: number;
  };
  voice?: {
    audioData?: string;
    result?: AssessmentResult;
    modelAccuracy?: number;
  };
  posture?: {
    imageData?: string;
    result?: AssessmentResult;
    modelAccuracy?: number;
  };
  symptoms?: {
    data?: any;
    result?: AssessmentResult;
    modelAccuracy?: number;
  };
  overall?: {
    score: number;
    confidence: number;
    status: "healthy" | "mild" | "moderate" | "severe";
    recommendation: string;
  };
  deviceInfo?: {
    platform: "ios" | "android" | "web";
    model?: string;
    osVersion?: string;
  };
  modelInfo?: {
    enhancedModelsLoaded: boolean;
    averageAccuracy: number;
    modelVersion: string;
  };
}

// Mobile device related types
export interface MobileDeviceInfo {
  platform: "ios" | "android" | "web";
  model?: string;
  osVersion?: string;
  isNative: boolean;
}
