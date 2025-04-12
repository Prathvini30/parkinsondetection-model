
// Analyze symptoms data for Parkinson's indicators
export async function analyzeSymptomsData(symptomsData: {
  age: string;
  familyHistory: boolean;
  tremor: number;
  stiffness: number;
  balance: number;
  hasFreeze: boolean;
  hasSleepIssues: boolean;
  additionalNotes: string;
}) {
  try {
    // Simulate ML processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real implementation, you would use a statistical or ML model
    // to evaluate the combined symptom data
    
    // Calculate risk factors:
    let riskScore = 0;
    
    // Age is a risk factor (higher age = higher risk)
    const age = parseInt(symptomsData.age) || 0;
    if (age > 60) riskScore += 15;
    else if (age > 50) riskScore += 10;
    else if (age > 40) riskScore += 5;
    
    // Family history is a significant risk factor
    if (symptomsData.familyHistory) riskScore += 20;
    
    // Symptom severity factors
    riskScore += symptomsData.tremor * 3;
    riskScore += symptomsData.stiffness * 4;
    riskScore += symptomsData.balance * 4;
    
    // Additional symptoms
    if (symptomsData.hasFreeze) riskScore += 15;
    if (symptomsData.hasSleepIssues) riskScore += 10;
    
    // Calculate final score (100 - risk, so higher is better)
    const rawScore = Math.max(0, 100 - riskScore);
    const score = Math.min(100, rawScore);
    
    // Determine status based on score
    let status: "healthy" | "mild" | "moderate" | "severe";
    if (score >= 80) status = "healthy";
    else if (score >= 60) status = "mild";
    else if (score >= 40) status = "moderate";
    else status = "severe";
    
    return {
      score: Math.round(score),
      confidence: Math.round(75 + Math.random() * 15), // 75-90% confidence
      status,
      details: `Based on symptom analysis, key risk factors include: ${symptomsData.tremor > 5 ? 'significant tremor, ' : ''}${symptomsData.stiffness > 5 ? 'muscle stiffness, ' : ''}${symptomsData.balance > 5 ? 'balance issues, ' : ''}${symptomsData.hasFreeze ? 'freezing episodes, ' : ''}${symptomsData.hasSleepIssues ? 'sleep disturbances, ' : ''}${symptomsData.familyHistory ? 'family history of Parkinson\'s' : ''}`
    };
  } catch (error) {
    console.error('Error analyzing symptoms:', error);
    throw new Error('Symptoms analysis failed');
  }
}

// Calculate overall assessment
export function calculateOverallAssessment(assessments: {
  spiral?: any;
  voice?: any;
  posture?: any;
  symptoms?: any;
}) {
  // Count how many assessments were performed
  let count = 0;
  let totalScore = 0;
  let totalConfidence = 0;
  
  // Calculate weighted average of scores and confidence
  if (assessments.spiral) {
    totalScore += assessments.spiral.score * 0.25;
    totalConfidence += assessments.spiral.confidence * 0.25;
    count++;
  }
  
  if (assessments.voice) {
    totalScore += assessments.voice.score * 0.25;
    totalConfidence += assessments.voice.confidence * 0.25;
    count++;
  }
  
  if (assessments.posture) {
    totalScore += assessments.posture.score * 0.2;
    totalConfidence += assessments.posture.confidence * 0.2;
    count++;
  }
  
  if (assessments.symptoms) {
    totalScore += assessments.symptoms.score * 0.3;
    totalConfidence += assessments.symptoms.confidence * 0.3;
    count++;
  }
  
  // If no assessments were performed, return null
  if (count === 0) {
    return null;
  }
  
  // Calculate final score and confidence
  const score = Math.round(totalScore);
  const confidence = Math.round(totalConfidence);
  
  // Determine status based on score
  let status: "healthy" | "mild" | "moderate" | "severe";
  if (score >= 80) status = "healthy";
  else if (score >= 60) status = "mild";
  else if (score >= 40) status = "moderate";
  else status = "severe";
  
  // Generate recommendation based on status
  let recommendation = "";
  switch (status) {
    case "healthy":
      recommendation = "Based on the assessment, no significant Parkinson's disease indicators were detected. Continue with regular exercise and health monitoring.";
      break;
    case "mild":
      recommendation = "Some mild indicators of Parkinson's disease were detected. Consider consulting a neurologist for a professional evaluation. Early intervention can help manage symptoms effectively.";
      break;
    case "moderate":
      recommendation = "Moderate indicators of Parkinson's disease were detected. We strongly recommend consulting with a neurologist soon for a thorough evaluation and proper diagnosis.";
      break;
    case "severe":
      recommendation = "Several strong indicators of Parkinson's disease were detected. Please consult with a neurologist as soon as possible for a professional evaluation and treatment options.";
      break;
  }
  
  return {
    score,
    confidence,
    status,
    recommendation
  };
}
