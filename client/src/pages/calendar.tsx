import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ArrowLeft, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import CalendarView from "@/components/calendar-view";

import MetricInput from "@/components/metric-input";
import ProgressCharts from "@/components/progress-charts";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";

export default function Calendar() {
  const [, navigate] = useLocation();
  const { user, isLoading } = useAuth();
  const isAuthenticated = !!user;
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingDate, setEditingDate] = useState('');
  
  const { data: recentEntries = [] } = useQuery({
    queryKey: ['/api/health-entries'],
    enabled: isAuthenticated,
  });

  const { data: editingEntry } = useQuery({
    queryKey: ['/api/health-entries', editingDate],
    enabled: !!editingDate,
  });

  const handleDateSelect = (date: string) => {
    // Only allow selection of today's date
    const today = format(new Date(), 'yyyy-MM-dd');
    if (date === today) {
      setSelectedDate(date);
      setEditingDate(date);
      setShowEditDialog(true);
    } else {
      // Just update visual selection for other dates
      setSelectedDate(date);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="mr-4 p-2 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">Health Calendar</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading your health data...</p>
          </div>
        ) : !isAuthenticated ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">Please sign in to view your health calendar</p>
            <Button onClick={() => navigate('/')}>Go to Home</Button>
          </div>
        ) : (
          <>
            {/* Calendar Section */}
            <div id="calendar-section" className="mb-12">
              <CalendarView 
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
                entries={recentEntries}
              />
            </div>

            {/* Health Trends Section */}
            <div id="trends-section">
              <div className="flex items-center mb-6">
                <TrendingUp className="w-6 h-6 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Health Trends</h2>
              </div>
              <ProgressCharts entries={recentEntries as any} />
            </div>
          </>
        )}
      </main>

      {/* Edit Health Entry Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle>
              Edit Health Entry - {editingDate && format(new Date(editingDate), 'MMM d, yyyy')}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <MetricInput 
              selectedDate={editingDate}
              initialEntry={editingEntry}
              onSave={() => setShowEditDialog(false)}
            />
          </div>
        </DialogContent>
      </Dialog>


    </div>
  );
}