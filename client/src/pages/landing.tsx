import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Moon, Apple, Dumbbell, Droplets, Smile, BarChart3, Calendar, TrendingUp } from "lucide-react";
import { useLocation } from "wouter";

export default function Landing() {
  const [, setLocation] = useLocation();
  
  const handleLogin = () => {
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Heart className="h-8 w-8 text-red-500 mr-2" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Healthly</h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Track your daily wellness journey with beautiful insights and personalized health scoring
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="text-center">
            <CardHeader>
              <BarChart3 className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <CardTitle>Smart Health Scoring</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                Get personalized scores for sleep, nutrition, exercise, hydration, and mood with real-world measurements
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Calendar className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <CardTitle>Calendar Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                Visualize your health journey with an intuitive calendar view showing daily progress
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <TrendingUp className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <CardTitle>Progress Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                Track trends and get meaningful insights about your wellness patterns over time
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Health Metrics Preview */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-center">Track What Matters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <Moon className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <p className="font-medium">Sleep Duration</p>
                <Badge variant="outline">Hours</Badge>
              </div>
              <div className="text-center">
                <Apple className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="font-medium">Veggies & Protein</p>
                <Badge variant="outline">Servings</Badge>
              </div>
              <div className="text-center">
                <Dumbbell className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                <p className="font-medium">Exercise</p>
                <Badge variant="outline">Minutes</Badge>
              </div>
              <div className="text-center">
                <Droplets className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                <p className="font-medium">Hydration</p>
                <Badge variant="outline">Glasses</Badge>
              </div>
              <div className="text-center">
                <Smile className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <p className="font-medium">Mood & Gratitude</p>
                <Badge variant="outline">Rating</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6">
              <h3 className="text-2xl font-bold mb-4">Ready to start your wellness journey?</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Sign in to start tracking your health metrics and unlock personalized insights
              </p>
              <Button onClick={handleLogin} size="lg" className="w-full">
                Sign In to Get Started
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}