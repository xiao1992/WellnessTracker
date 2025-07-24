import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from "date-fns";
import { Calendar, ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getScoreColor } from "@/lib/health-utils";
import type { HealthEntry } from "@shared/schema";

interface CalendarViewProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
  entries: HealthEntry[];
}

export default function CalendarView({ selectedDate, onDateSelect, entries }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate));
  
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  
  const getEntryForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return entries.find(entry => entry.date === dateStr);
  };

  const getScoreColorClass = (score: number) => {
    if (score >= 85) return 'bg-green-100 text-green-800';
    if (score >= 61) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(currentMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(currentMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  return (
    <Card className="health-card">
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <Calendar className="w-5 h-5 text-green-600 mr-3" />
          Monthly Overview
        </h3>
        
        <div className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium">
              {format(currentMonth, 'MMMM yyyy')}
            </h4>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateMonth('prev')}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateMonth('next')}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekdays.map((day, index) => (
              <div key={`weekday-${index}`} className="text-center text-xs font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {days.map(day => {
              const entry = getEntryForDate(day);
              const dateStr = format(day, 'yyyy-MM-dd');
              const isSelected = isSameDay(new Date(selectedDate), day);
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isTodayDate = isToday(day);
              
              return (
                <button
                  key={dateStr}
                  onClick={() => !isTodayDate && onDateSelect(dateStr)}
                  disabled={isTodayDate}
                  className={cn(
                    "calendar-day aspect-square rounded-lg p-1 text-center text-xs flex flex-col items-center justify-center transition-all relative",
                    !isCurrentMonth && "text-gray-400 bg-gray-50",
                    isCurrentMonth && !entry && "bg-gray-100 text-gray-600",
                    entry && getScoreColorClass(entry.overallScore),
                    isSelected && "ring-2 ring-blue-600",
                    isTodayDate && "font-semibold opacity-70 cursor-not-allowed",
                    !isTodayDate && "cursor-pointer hover:bg-gray-200"
                  )}
                >
                  <span>{format(day, 'd')}</span>
                  {entry && entry.overallScore === 100 && (
                    <Heart className="w-4 h-4 text-red-500 fill-current absolute bottom-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
        
        <div className="mt-6">
          <h5 className="text-sm font-medium text-gray-700 mb-3">Score Legend</h5>
          <div className="flex flex-wrap gap-3 text-xs">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded bg-red-100 mr-2"></div>
              <span>Poor (0-60)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded bg-yellow-100 mr-2"></div>
              <span>Fair (61-84)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded bg-green-100 mr-2"></div>
              <span>Good (85-99)</span>
            </div>
            <div className="flex items-center">
              <Heart className="w-3 h-3 text-red-500 fill-current mr-2" />
              <span>Perfect (100)</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
