import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

interface MealPlanProps {
  userId: number;
}

export default function MealPlan({ userId }: MealPlanProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: [`/api/user/${userId}/nutrition-recommendations`],
  });

  // Get meal plan data from the API response
  const mealPlan = data?.content?.mealPlan;
  const totalCalories = mealPlan ? 
    (mealPlan.breakfast?.calories || 0) + 
    (mealPlan.lunch?.calories || 0) + 
    (mealPlan.dinner?.calories || 0) : 0;

  // Create an array of meals for mapping
  const meals = mealPlan ? [
    { 
      title: "Breakfast", 
      description: mealPlan.breakfast?.description || "", 
      calories: mealPlan.breakfast?.calories || 0,
      protein: mealPlan.breakfast?.protein || 0,
      carbs: mealPlan.breakfast?.carbs || 0,
      fats: mealPlan.breakfast?.fats || 0,
      image: "https://images.unsplash.com/photo-1494390248081-4e521a5940db?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&h=120&q=80"
    },
    {
      title: "Lunch",
      description: mealPlan.lunch?.description || "",
      calories: mealPlan.lunch?.calories || 0,
      protein: mealPlan.lunch?.protein || 0,
      carbs: mealPlan.lunch?.carbs || 0,
      fats: mealPlan.lunch?.fats || 0,
      image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&h=120&q=80"
    },
    {
      title: "Dinner",
      description: mealPlan.dinner?.description || "",
      calories: mealPlan.dinner?.calories || 0,
      protein: mealPlan.dinner?.protein || 0,
      carbs: mealPlan.dinner?.carbs || 0,
      fats: mealPlan.dinner?.fats || 0,
      image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&h=120&q=80"
    }
  ] : [];

  if (isLoading) {
    return (
      <Card className="bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Today's Meal Plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Today's Meal Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-500">
            Failed to load meal plan. Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-text font-inter">Today's Meal Plan</CardTitle>
          <Badge variant="outline" className="text-xs font-medium bg-secondary bg-opacity-10 text-secondary">
            {totalCalories.toLocaleString()} kcal
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {meals.map((meal, index) => (
          <div key={meal.title} className="flex">
            <div className="w-20 h-20 bg-gray-100 rounded-standard overflow-hidden">
              <img 
                src={meal.image} 
                alt={meal.title} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="ml-3 flex-1">
              <div className="flex justify-between">
                <h4 className="font-medium text-text font-nunito">{meal.title}</h4>
                <span className="text-xs text-gray-500">{meal.calories} kcal</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{meal.description}</p>
              <div className="flex items-center mt-2 flex-wrap gap-1">
                <Badge variant="outline" className="text-xs bg-secondary bg-opacity-10 text-secondary mr-1">
                  {meal.protein}g Protein
                </Badge>
                <Badge variant="outline" className="text-xs bg-primary bg-opacity-10 text-primary mr-1">
                  {meal.carbs}g Carbs
                </Badge>
                <Badge variant="outline" className="text-xs bg-accent bg-opacity-10 text-accent">
                  {meal.fats}g Fats
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
      
      <CardFooter>
        <Button variant="secondary" className="w-full">
          <Calendar className="h-4 w-4 mr-2" />
          View Full Week Plan
        </Button>
      </CardFooter>
    </Card>
  );
}
