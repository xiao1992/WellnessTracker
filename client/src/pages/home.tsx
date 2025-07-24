import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import HealthScoreOverview from "@/components/health-score-overview";
import MetricInput from "@/components/metric-input";
import DailyQuotePopup from "@/components/daily-quote-popup";

import { Heart, Bell, User, Moon, Apple, Dumbbell, Droplets, Smile, BarChart3, Calendar, TrendingUp } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [showDailyQuote, setShowDailyQuote] = useState(false);
  const isMobile = useIsMobile();
  const { user, isLoading } = useAuth();
  const isAuthenticated = !!user;

  // Removed automatic daily quote popup - users can trigger it manually if needed

  const { data: todaysEntry, isLoading: entryLoading } = useQuery({
    queryKey: ['/api/health-entries', selectedDate],
    enabled: !!selectedDate && isAuthenticated,
  });

  const { data: recentEntries } = useQuery({
    queryKey: ['/api/health-entries'],
    enabled: isAuthenticated,
  });

  const [showAuthForm, setShowAuthForm] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  
  const { loginMutation, registerMutation } = useAuth();

  const handleShowAuth = () => {
    console.log("handleShowAuth called");
    console.log("showAuthForm before:", showAuthForm);
    setShowAuthForm(true);
    console.log("showAuthForm after setState:", true);
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (authMode === 'login') {
      await loginMutation.mutateAsync({ email, password });
    } else {
      await registerMutation.mutateAsync({ 
        email, 
        password, 
        firstName: firstName || null, 
        lastName: lastName || null 
      });
    }
    
    setShowAuthForm(false);
    setEmail('');
    setPassword('');
    setFirstName('');
    setLastName('');
  };

  // Show landing page content when not authenticated

  if (!isLoading && !isAuthenticated) {
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
                <Button onClick={handleShowAuth} size="lg" className="w-full">
                  Sign In to Get Started
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Authentication Dialog */}
        <Dialog open={showAuthForm} onOpenChange={setShowAuthForm}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Welcome to Healthly</DialogTitle>
            </DialogHeader>
            <Tabs value={authMode} onValueChange={(value) => setAuthMode(value as 'login' | 'register')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="register">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleAuthSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? 'Signing In...' : 'Sign In'}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="register">
                <form onSubmit={handleAuthSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="First name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Last name"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a password"
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Show regular home content when authenticated
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 health-gradient rounded-full flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Healthly</h1>
            </div>
            <div className="flex items-center space-x-4">
              {/* Navigation icons removed as requested */}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
        {/* Health Score Overview */}
        <div className="mb-8">
          <HealthScoreOverview 
            entry={todaysEntry as any} 
            isLoading={entryLoading}
            selectedDate={selectedDate}
          />
        </div>

        {/* Quick Log */}
        <div className="mb-8">
          <MetricInput 
            selectedDate={selectedDate}
            initialEntry={todaysEntry as any}
          />
        </div>

      </main>


      
      {/* Daily Quote Popup */}
      <DailyQuotePopup 
        show={showDailyQuote}
        onClose={() => setShowDailyQuote(false)}
      />

      {/* Authentication Dialog */}
      <Dialog open={showAuthForm} onOpenChange={setShowAuthForm}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Welcome to Healthly</DialogTitle>
          </DialogHeader>
          <Tabs value={authMode} onValueChange={(value) => setAuthMode(value as 'login' | 'register')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="register">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleAuthSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleAuthSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="First name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Last name"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password (min 6 characters)"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
