import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import HealthMetricCard from "@/components/dashboard/health-metric-card";
import FitnessRecommendations from "@/components/dashboard/fitness-recommendations";
import WorkoutOfTheDay from "@/components/dashboard/workout-of-the-day";
import NutritionRecommendations from "@/components/dashboard/nutrition-recommendations";
import MealPlan from "@/components/dashboard/meal-plan";
import WaterIntake from "@/components/dashboard/water-intake";
import UserProfile from "@/components/profile/user-profile";
import MetricsForm from "@/components/profile/metrics-form";
import { useToast } from "@/hooks/use-toast";

// Default userId for demo purposes (this would typically come from auth)
const DEFAULT_USER_ID = 1;

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();

  // Fetch user data
  const { data: userData, isLoading: userLoading, error: userError } = useQuery({
    queryKey: ['/api/user/1'],
    staleTime: 5 * 60 * 1000, // 5 min stale time
  });

  // Fetch health metrics
  const { data: healthData, isLoading: healthLoading, error: healthError } = useQuery({
    queryKey: [`/api/user/${DEFAULT_USER_ID}/health-metrics`],
    staleTime: 5 * 60 * 1000,
  });

  // Handle errors
  useEffect(() => {
    if (userError) {
      toast({
        title: "Error loading user data",
        description: "Please try refreshing the page.",
        variant: "destructive",
      });
    }
    
    if (healthError) {
      toast({
        title: "Error loading health metrics",
        description: "Please try refreshing the page.",
        variant: "destructive",
      });
    }
  }, [userError, healthError, toast]);

  // Loading state
  if (userLoading || healthLoading) {
    return (
      <div className="py-10 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-3/4 bg-gray-200 rounded-md mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-standard"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-text mb-6 font-inter">Your Fitness Dashboard</h2>
        
        {/* Tab Navigation */}
        <div className="flex flex-wrap border-b border-gray-200 mb-6">
          <button 
            className={`px-4 py-2 font-medium ${activeTab === "overview" ? "text-text border-b-2 border-primary -mb-px" : "text-gray-500 hover:text-text transition-colors"}`}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button 
            className={`px-4 py-2 font-medium ${activeTab === "profile" ? "text-text border-b-2 border-primary -mb-px" : "text-gray-500 hover:text-text transition-colors"}`}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>
          <button 
            className={`px-4 py-2 font-medium ${activeTab === "history" ? "text-text border-b-2 border-primary -mb-px" : "text-gray-500 hover:text-text transition-colors"}`}
            onClick={() => setActiveTab("history")}
          >
            History
          </button>
          <button 
            className={`px-4 py-2 font-medium ${activeTab === "settings" ? "text-text border-b-2 border-primary -mb-px" : "text-gray-500 hover:text-text transition-colors"}`}
            onClick={() => setActiveTab("settings")}
          >
            Settings
          </button>
        </div>
        
        {/* Health Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <HealthMetricCard 
            title="Current Weight"
            value={userData?.weight ? (userData.weight * 2.20462).toFixed(1) : "--"}
            unit="lbs"
            icon="weight"
            change="-2.5"
            changeText="from last week"
            changeDirection="down"
            changeColor="secondary"
          />
          
          <HealthMetricCard 
            title="BMI"
            value={healthData?.bmi?.toFixed(1) || "--"}
            icon="bmi"
            subtext="Healthy range"
            subtextColor="primary"
          />
          
          <HealthMetricCard 
            title="Daily Calories"
            value={healthData?.dailyCalories?.toLocaleString() || "--"}
            unit="kcal"
            icon="calories"
            subtext="Based on your goals"
            subtextColor="accent"
          />
          
          <HealthMetricCard 
            title="Activity Level"
            value={userData?.activityLevel?.replace("Active", "") || "--"}
            icon="activity"
            subtext="3-5 workouts per week"
            subtextColor="secondary"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile and User Input */}
        <div className="lg:col-span-1 space-y-6">
          <UserProfile userData={userData} />
          <MetricsForm userData={userData} />
        </div>
        
        {/* Middle Column - Fitness Recommendations */}
        <div className="lg:col-span-1 space-y-6">
          <FitnessRecommendations userId={DEFAULT_USER_ID} />
          <WorkoutOfTheDay />
        </div>
        
        {/* Right Column - Nutrition Recommendations */}
        <div className="lg:col-span-1 space-y-6">
          <NutritionRecommendations userId={DEFAULT_USER_ID} />
          <MealPlan userId={DEFAULT_USER_ID} />
          <WaterIntake userId={DEFAULT_USER_ID} />
        </div>
      </div>
    </div>
  );
}
