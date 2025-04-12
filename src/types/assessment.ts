
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
  overall?: {
    score: number;
    confidence: number;
    status: "healthy" | "mild" | "moderate" | "severe";
    recommendation: string;
  };
}
