import { useMemo } from "react";
import { format, subDays, isWithinInterval } from "date-fns";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { TrendingUp, BarChart3, Moon, Apple, Dumbbell, Droplets, Smile } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { HealthEntry } from "@shared/schema";

interface ProgressChartsProps {
  entries: HealthEntry[];
}

export default function ProgressCharts({ entries }: ProgressChartsProps) {
  const weeklyData = useMemo(() => {
    const today = new Date();
    const weekAgo = subDays(today, 6);
    
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(today, 6 - i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const entry = entries.find(e => e.date === dateStr);
      
      return {
        date: format(date, 'EEE'),
        score: entry?.overallScore || 0,
        fullDate: dateStr,
      };
    });
    
    return last7Days;
  }, [entries]);

  const currentMetrics = useMemo(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const todayEntry = entries.find(e => e.date === today);
    
    return [
      { name: 'Sleep', value: todayEntry?.sleepScore || 0, icon: Moon, color: '#3B82F6' },
      { name: 'Nutrition', value: todayEntry?.nutritionScore || 0, icon: Apple, color: '#10B981' },
      { name: 'Exercise', value: todayEntry?.exerciseScore || 0, icon: Dumbbell, color: '#F59E0B' },
      { name: 'Hydration', value: todayEntry?.hydrationScore || 0, icon: Droplets, color: '#3B82F6' },
      { name: 'Mood', value: todayEntry?.moodScore || 0, icon: Smile, color: '#EAB308' },
    ];
  }, [entries]);

  const monthlyAverage = useMemo(() => {
    if (entries.length === 0) return 0;
    const total = entries.reduce((sum, entry) => sum + entry.overallScore, 0);
    return Math.round(total / entries.length * 10) / 10;
  }, [entries]);

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Weekly Trends */}
      <Card className="health-card">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <TrendingUp className="w-5 h-5 text-orange-600 mr-3" />
            Weekly Trends
          </h3>
          
          <div className="h-64 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="date" 
                  stroke="#6B7280"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#6B7280"
                  fontSize={12}
                  domain={[0, 100]}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#1D4ED8' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {weeklyData.map((day, index) => (
              <div key={index} className="text-center">
                <div className="text-xs font-medium text-gray-500">{day.date}</div>
                <div className="text-sm font-semibold text-gray-900 mt-1">{day.score}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Individual Metrics */}
      <Card className="health-card">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <BarChart3 className="w-5 h-5 text-green-600 mr-3" />
            Individual Metrics
          </h3>
          
          <div className="space-y-4">
            {currentMetrics.map((metric) => {
              const IconComponent = metric.icon;
              return (
                <div key={metric.name} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <IconComponent className="w-4 h-4 mr-3" style={{ color: metric.color }} />
                    <span className="text-sm font-medium">{metric.name}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${metric.value}%`,
                          backgroundColor: metric.color
                        }}
                      />
                    </div>
                    <span className="text-sm font-semibold w-8 text-right">{metric.value}</span>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-100">
            <h4 className="text-sm font-medium text-gray-700 mb-3">30-Day Average</h4>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Overall Health Score</span>
              <span className="text-lg font-semibold text-blue-600">{monthlyAverage}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
