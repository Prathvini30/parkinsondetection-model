
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
  };
  voice?: {
    audioData?: string;
    result?: AssessmentResult;
  };
  posture?: {
    imageData?: string;
    result?: AssessmentResult;
  };
  symptoms?: {
    data?: any;
    result?: AssessmentResult;
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
}

// Mobile device related types
export interface MobileDeviceInfo {
  platform: "ios" | "android" | "web";
  model?: string;
  osVersion?: string;
  isNative: boolean;
}
