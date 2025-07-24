import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle, Save, LogIn } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertHealthEntrySchema, type HealthEntry } from "@shared/schema";
import { getScoreColor, getScoreLabel, getMetricMeasurement, calculateHealthScore } from "@/lib/health-utils";
import { Moon, Apple, Dumbbell, Droplets, Smile } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";
import CongratulationsAnimation from "./congratulations-animation";

interface MetricInputProps {
  selectedDate: string;
  initialEntry?: HealthEntry;
  onSave?: () => void;
}

export default function MetricInput({ selectedDate, initialEntry, onSave }: MetricInputProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user, isLoading } = useAuth();
  const isAuthenticated = !!user;

  const form = useForm({
    resolver: zodResolver(insertHealthEntrySchema.omit({ userId: true })), // Remove userId from validation since we add it later
    defaultValues: {
      date: selectedDate,
      sleepScore: initialEntry?.sleepScore || 60,
      nutritionScore: initialEntry?.nutritionScore || 60,
      exerciseScore: initialEntry?.exerciseScore || 60,
      hydrationScore: initialEntry?.hydrationScore || 60,
      moodScore: initialEntry?.moodScore || 60,
    },
  });

  useEffect(() => {
    form.reset({
      date: selectedDate,
      sleepScore: initialEntry?.sleepScore || 60,
      nutritionScore: initialEntry?.nutritionScore || 60,
      exerciseScore: initialEntry?.exerciseScore || 60,
      hydrationScore: initialEntry?.hydrationScore || 60,
      moodScore: initialEntry?.moodScore || 60,
    });
  }, [selectedDate, initialEntry, form]);

  const saveHealthData = useMutation({
    mutationFn: async (data: any) => {
      console.log("Making API request with data:", data);
      
      if (!isAuthenticated) {
        throw new Error("Authentication required");
      }
      
      // Ensure userId is included in the data
      const dataWithUserId = {
        ...data,
        userId: user.id
      };
      
      console.log("Sending data with userId:", dataWithUserId);
      const response = await apiRequest('POST', '/api/health-entries', dataWithUserId);
      console.log("API response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`${response.status}: ${errorText}`);
      }
      
      return response.json();
    },
    onSuccess: (savedEntry) => {
      console.log("Successfully saved entry:", savedEntry);
      
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: ['/api/health-entries'] });
      queryClient.invalidateQueries({ queryKey: ['/api/health-entries', selectedDate] });
      
      // Check if overall score is 100 and show congratulations
      if (savedEntry.overallScore === 100) {
        setShowCongratulations(true);
        toast({ title: "Perfect Score!", description: "Congratulations! You achieved a perfect health score!", variant: "default" });
      } else {
        toast({ title: "Success", description: "Health data saved successfully!" });
      }

      // Call onSave callback if provided (for dialog close)
      if (onSave) {
        onSave();
      }
    },
    onError: (error) => {
      console.error("Save health data error:", error);
      if (isUnauthorizedError(error as Error)) {
        toast({
          title: "Sign In Required",
          description: "Please sign in to save your health data.",
          variant: "destructive",
        });
        return;
      }
      toast({ 
        title: "Error", 
        description: `Failed to save health data: ${error.message}`, 
        variant: "destructive" 
      });
    },
  });

  const onSubmit = async (data: any) => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to save your health data.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSaving(true);
    try {
      await saveHealthData.mutateAsync(data);
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const metrics = [
    { name: 'sleepScore', label: 'Sleep Duration', icon: Moon, color: 'blue' },
    { name: 'nutritionScore', label: 'Veggies & Good Protein', icon: Apple, color: 'green' },
    { name: 'exerciseScore', label: 'Exercise', icon: Dumbbell, color: 'orange' },
    { name: 'hydrationScore', label: 'Hydration', icon: Droplets, color: 'blue' },
    { name: 'moodScore', label: 'Mood & Gratitude', icon: Smile, color: 'yellow' },
  ];

  return (
    <>
      <Card className="health-card">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <PlusCircle className="w-5 h-5 text-blue-600 mr-3" />
            Quick Log
          </h3>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {metrics.map((metric) => {
                const IconComponent = metric.icon;
                return (
                  <FormField
                    key={metric.name}
                    control={form.control}
                    name={metric.name as any}
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between mb-3">
                          <FormLabel className="flex items-center font-medium">
                            <IconComponent className={`w-4 h-4 mr-3 ${getScoreColor(field.value)}`} />
                            {metric.label}
                          </FormLabel>
                          <div className="text-right">
                            <span className="text-sm font-medium text-gray-900">{field.value}</span>
                            <div className="text-xs text-gray-500">
                              {getMetricMeasurement(metric.name, field.value)}
                            </div>
                          </div>
                        </div>
                        <FormControl>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            step="10"
                            value={field.value}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                            className="metric-slider w-full"
                            style={{ 
                              '--slider-value': `${field.value}%` 
                            } as React.CSSProperties}
                          />
                        </FormControl>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>{getMetricMeasurement(metric.name, 0)}</span>
                          <span>{getMetricMeasurement(metric.name, 100)}</span>
                        </div>
                      </FormItem>
                    )}
                  />
                );
              })}
              
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-2xl font-medium transition-colors flex items-center justify-center"
                disabled={isSaving || isLoading || !isAuthenticated}

              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? "Saving..." : "Get Today's Score"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <CongratulationsAnimation 
        show={showCongratulations} 
        onClose={() => setShowCongratulations(false)} 
      />
    </>
  );
}
