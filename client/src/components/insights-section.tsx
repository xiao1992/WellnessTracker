import { useMemo } from "react";
import { Lightbulb, TrendingUp, AlertTriangle, Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { HealthEntry } from "@shared/schema";

interface InsightsSectionProps {
  todaysEntry?: HealthEntry;
  recentEntries: HealthEntry[];
}

export default function InsightsSection({ todaysEntry, recentEntries }: InsightsSectionProps) {
  const insights = useMemo(() => {
    const insights = [];
    
    if (recentEntries.length > 0) {
      // Sleep improvement check
      const recentSleep = recentEntries.slice(0, 7).map(e => e.sleepScore);
      const avgRecentSleep = recentSleep.reduce((sum, score) => sum + score, 0) / recentSleep.length;
      const olderSleep = recentEntries.slice(7, 14).map(e => e.sleepScore);
      const avgOlderSleep = olderSleep.length > 0 ? olderSleep.reduce((sum, score) => sum + score, 0) / olderSleep.length : 0;
      
      if (avgRecentSleep > avgOlderSleep && avgOlderSleep > 0) {
        const improvement = Math.round(((avgRecentSleep - avgOlderSleep) / avgOlderSleep) * 100);
        insights.push({
          type: 'improvement',
          title: 'Sleep Improvement',
          description: `Your sleep score improved by ${improvement}% this week. Keep maintaining your bedtime routine!`,
          icon: TrendingUp,
          color: 'blue'
        });
      }
      
      // Hydration alert
      if (todaysEntry && todaysEntry.hydrationScore < 70) {
        insights.push({
          type: 'alert',
          title: 'Hydration Alert',
          description: 'Your hydration score is below optimal. Try setting hourly reminders to drink water.',
          icon: AlertTriangle,
          color: 'orange'
        });
      }
      
      // Exercise streak
      const exerciseStreak = recentEntries.slice(0, 7).every(e => e.exerciseScore >= 70);
      if (exerciseStreak) {
        insights.push({
          type: 'achievement',
          title: 'Exercise Streak',
          description: 'Amazing! You\'ve maintained your exercise routine for 7 days straight.',
          icon: Trophy,
          color: 'green'
        });
      }
    }
    
    // Add default insights if none generated
    if (insights.length === 0) {
      insights.push({
        type: 'info',
        title: 'Get Started',
        description: 'Start logging your daily health metrics to receive personalized insights and recommendations.',
        icon: Lightbulb,
        color: 'blue'
      });
    }
    
    return insights;
  }, [todaysEntry, recentEntries]);

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-50 text-blue-600';
      case 'orange':
        return 'bg-orange-50 text-orange-600';
      case 'green':
        return 'bg-green-50 text-green-600';
      case 'yellow':
        return 'bg-yellow-50 text-yellow-600';
      default:
        return 'bg-gray-50 text-gray-600';
    }
  };

  return (
    <Card className="health-card">
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <Lightbulb className="w-5 h-5 text-yellow-600 mr-3" />
          Insights & Recommendations
        </h3>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {insights.map((insight, index) => {
            const IconComponent = insight.icon;
            return (
              <div key={index} className={`rounded-2xl p-4 ${getColorClasses(insight.color)}`}>
                <div className="flex items-center mb-3">
                  <IconComponent className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">{insight.title}</span>
                </div>
                <p className="text-sm text-gray-700">{insight.description}</p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
