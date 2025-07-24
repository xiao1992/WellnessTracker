import { format } from "date-fns";
import { Moon, Apple, Dumbbell, Droplets, Smile } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { HealthEntry } from "@shared/schema";

interface HealthScoreOverviewProps {
  entry?: HealthEntry;
  isLoading: boolean;
  selectedDate: string;
}

export default function HealthScoreOverview({ entry, isLoading, selectedDate }: HealthScoreOverviewProps) {
  if (isLoading) {
    return (
      <Card className="health-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex items-center justify-center mb-6">
            <Skeleton className="w-40 h-40 rounded-full" />
          </div>
          <div className="grid grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="text-center">
                <Skeleton className="w-12 h-12 rounded-full mx-auto mb-2" />
                <Skeleton className="h-4 w-8 mx-auto mb-1" />
                <Skeleton className="h-3 w-12 mx-auto" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const overallScore = entry?.overallScore || 0;
  const circumference = 439.8;
  const strokeDashoffset = circumference - (overallScore / 100) * circumference;

  return (
    <Card className="health-card">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            {selectedDate === format(new Date(), 'yyyy-MM-dd') ? "Today's Health Score" : "Health Score"}
          </h2>
          <span className="text-sm text-gray-500">
            {format(new Date(selectedDate), 'MMM dd, yyyy')}
          </span>
        </div>
        
        <div className="flex items-center justify-center mb-6">
          <div className="relative w-40 h-40">
            <svg className="w-full h-full progress-ring" viewBox="0 0 160 160">
              <circle
                cx="80"
                cy="80"
                r="70"
                className="progress-circle"
                stroke="#E5E5EA"
                strokeDasharray={circumference}
                strokeDashoffset="0"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                className="progress-circle"
                stroke="url(#healthGradient)"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
              />
              <defs>
                <linearGradient id="healthGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: 'hsl(207, 100%, 50%)', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: 'hsl(145, 63%, 49%)', stopOpacity: 1 }} />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900">{overallScore}</div>
                <div className="text-sm text-gray-500">Health Score</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
              <Moon className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-sm font-medium text-gray-900">{entry?.sleepScore || 0}</div>
            <div className="text-xs text-gray-500">Sleep</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
              <Apple className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-sm font-medium text-gray-900">{entry?.nutritionScore || 0}</div>
            <div className="text-xs text-gray-500">Nutrition</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-2">
              <Dumbbell className="w-5 h-5 text-orange-600" />
            </div>
            <div className="text-sm font-medium text-gray-900">{entry?.exerciseScore || 0}</div>
            <div className="text-xs text-gray-500">Exercise</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
              <Droplets className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-sm font-medium text-gray-900">{entry?.hydrationScore || 0}</div>
            <div className="text-xs text-gray-500">Hydration</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-2">
              <Smile className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="text-sm font-medium text-gray-900">{entry?.moodScore || 0}</div>
            <div className="text-xs text-gray-500">Mood</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
