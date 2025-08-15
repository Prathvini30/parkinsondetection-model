
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
  const availableAssessments = [];
  
  if (assessments.spiral) availableAssessments.push(assessments.spiral);
  if (assessments.voice) availableAssessments.push(assessments.voice);
  if (assessments.posture) availableAssessments.push(assessments.posture);
  if (assessments.symptoms) availableAssessments.push(assessments.symptoms);
  
  // If no assessments were performed, return null
  if (availableAssessments.length === 0) {
    return null;
  }
  
  // Calculate simple average of available assessments
  const totalScore = availableAssessments.reduce((sum, assessment) => sum + assessment.score, 0);
  const totalConfidence = availableAssessments.reduce((sum, assessment) => sum + assessment.confidence, 0);
  
  const score = Math.round(totalScore / availableAssessments.length);
  const confidence = Math.round(totalConfidence / availableAssessments.length);
  
  // Determine status based on score using SAME logic as individual assessments
  let status: "healthy" | "mild" | "moderate" | "severe";
  if (score >= 80) status = "healthy";
  else if (score >= 65) status = "mild";      // Adjusted threshold
  else if (score >= 45) status = "moderate";   // Adjusted threshold  
  else status = "severe";
  
  // Check if any individual assessment shows concerning results
  // If any assessment is moderate/severe, overall should reflect that
  const worstStatus = availableAssessments.reduce((worst, assessment) => {
    const statusOrder = { healthy: 0, mild: 1, moderate: 2, severe: 3 };
    return statusOrder[assessment.status] > statusOrder[worst] ? assessment.status : worst;
  }, "healthy");
  
  // Use the worse of calculated status or individual worst status
  const statusOrder = { healthy: 0, mild: 1, moderate: 2, severe: 3 };
  if (statusOrder[worstStatus] > statusOrder[status]) {
    status = worstStatus;
  }
  
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
