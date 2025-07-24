export function getScoreColor(score: number): string {
  if (score >= 85) return 'text-green-600';
  if (score >= 61) return 'text-yellow-600';
  return 'text-red-600';
}

export function getScoreLabel(score: number): string {
  if (score === 100) return 'Perfect';
  if (score >= 85) return 'Good';
  if (score >= 61) return 'Fair';
  return 'Poor';
}

export function getMetricMeasurement(metricName: string, score: number): string {
  switch (metricName) {
    case 'sleepScore':
      if (score >= 100) return '9+ hours';
      if (score >= 90) return '8-9 hours';
      if (score >= 80) return '7-8 hours';
      if (score >= 70) return '6-7 hours';
      if (score >= 60) return '5-6 hours';
      if (score >= 50) return '4-5 hours';
      if (score >= 40) return '3-4 hours';
      if (score >= 30) return '2-3 hours';
      if (score >= 20) return '1-2 hours';
      if (score >= 10) return '< 1 hour';
      return 'No sleep';
    
    case 'nutritionScore':
      if (score >= 100) return '5+ servings veggies/good protein';
      if (score >= 90) return '4-5 servings veggies/good protein';
      if (score >= 80) return '3-4 servings veggies/good protein';
      if (score >= 70) return '2-3 servings veggies/good protein';
      if (score >= 60) return '1-2 servings veggies/good protein';
      if (score >= 50) return '1 serving veggies/good protein';
      if (score >= 40) return 'Some healthy choices';
      if (score >= 30) return 'Mostly processed foods';
      if (score >= 20) return 'Fast food mostly';
      if (score >= 10) return 'Fast food only';
      return 'No food';
    
    case 'exerciseScore':
      if (score >= 100) return '60+ minutes';
      if (score >= 90) return '45-60 minutes';
      if (score >= 80) return '30-45 minutes';
      if (score >= 70) return '20-30 minutes';
      if (score >= 60) return '15-20 minutes';
      if (score >= 50) return '10-15 minutes';
      if (score >= 40) return '5-10 minutes';
      if (score >= 30) return '2-5 minutes';
      if (score >= 20) return '1-2 minutes';
      if (score >= 10) return '< 1 minute';
      return 'No exercise';
    
    case 'hydrationScore':
      if (score >= 100) return '10+ glasses (80+ oz)';
      if (score >= 90) return '8-10 glasses (64-80 oz)';
      if (score >= 80) return '6-8 glasses (48-64 oz)';
      if (score >= 70) return '4-6 glasses (32-48 oz)';
      if (score >= 60) return '3-4 glasses (24-32 oz)';
      if (score >= 50) return '2-3 glasses (16-24 oz)';
      if (score >= 40) return '1-2 glasses (8-16 oz)';
      if (score >= 30) return '1 glass (8 oz)';
      if (score >= 20) return '< 1 glass (4 oz)';
      if (score >= 10) return 'Few sips';
      return 'No water';
    
    case 'moodScore':
      if (score >= 100) return 'Extremely grateful & happy';
      if (score >= 90) return 'Very grateful & positive';
      if (score >= 80) return 'Grateful & content';
      if (score >= 70) return 'Generally positive';
      if (score >= 60) return 'Neutral mood';
      if (score >= 50) return 'Slightly down';
      if (score >= 40) return 'Feeling low';
      if (score >= 30) return 'Quite stressed/sad';
      if (score >= 20) return 'Very stressed/sad';
      if (score >= 10) return 'Extremely low';
      return 'Worst mood';
    
    default:
      return getScoreLabel(score);
  }
}

export function calculateHealthScore(scores: {
  sleepScore: number;
  nutritionScore: number;
  exerciseScore: number;
  hydrationScore: number;
  moodScore: number;
}): number {
  const { sleepScore, nutritionScore, exerciseScore, hydrationScore, moodScore } = scores;
  return Math.round((sleepScore + nutritionScore + exerciseScore + hydrationScore + moodScore) / 5);
}

export function getScoreColorClass(score: number): string {
  if (score >= 85) return 'bg-green-100 text-green-800';
  if (score >= 61) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
}

export function getInsightForScore(metric: string, score: number, previousScore?: number): string {
  const improvement = previousScore ? score - previousScore : 0;
  
  if (improvement > 10) {
    return `Great improvement in ${metric}! Keep up the good work.`;
  } else if (improvement > 0) {
    return `Nice progress in ${metric}. Small improvements add up!`;
  } else if (score <= 60) {
    return `${metric} needs attention. Consider making some changes to improve.`;
  } else if (score >= 85) {
    return `Excellent ${metric}! You're doing great.`;
  } else {
    return `${metric} is fair. There's room for improvement.`;
  }
}
