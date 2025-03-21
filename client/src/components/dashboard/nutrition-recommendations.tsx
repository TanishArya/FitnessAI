import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface NutritionRecommendationsProps {
  userId: number;
}

export default function NutritionRecommendations({ userId }: NutritionRecommendationsProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: [`/api/user/${userId}/nutrition-recommendations`],
  });

  if (isLoading) {
    return (
      <Card className="bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Nutrition Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Nutrition Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-500">
            Failed to load nutrition recommendations. Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }

  const macros = data?.content?.macroDistribution || { protein: 40, carbs: 30, fats: 30 };

  return (
    <Card className="bg-white">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-text font-inter">Nutrition Recommendations</CardTitle>
          <Badge className="text-xs font-medium bg-primary bg-opacity-10 text-primary hover:bg-primary hover:bg-opacity-20">
            AI Generated
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {data?.content?.calorieTarget && (
          <div className="p-3 bg-gray-50 rounded-standard">
            <h4 className="font-medium text-text mb-2 font-nunito">{data.content.calorieTarget.title}</h4>
            <p className="text-sm text-gray-600">{data.content.calorieTarget.description}</p>
          </div>
        )}
        
        {data?.content?.proteinIntake && (
          <div className="p-3 bg-gray-50 rounded-standard">
            <h4 className="font-medium text-text mb-2 font-nunito">{data.content.proteinIntake.title}</h4>
            <p className="text-sm text-gray-600">{data.content.proteinIntake.description}</p>
          </div>
        )}
        
        {data?.content?.mealTiming && (
          <div className="p-3 bg-gray-50 rounded-standard">
            <h4 className="font-medium text-text mb-2 font-nunito">{data.content.mealTiming.title}</h4>
            <p className="text-sm text-gray-600">{data.content.mealTiming.description}</p>
          </div>
        )}
        
        <div className="mt-6">
          <h4 className="font-medium text-text mb-3 font-nunito">Daily Macro Distribution</h4>
          <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
            <div className="flex h-full">
              <div 
                className="bg-secondary h-full" 
                style={{ width: `${macros.protein}%` }}
              ></div>
              <div 
                className="bg-primary h-full" 
                style={{ width: `${macros.carbs}%` }}
              ></div>
              <div 
                className="bg-accent h-full" 
                style={{ width: `${macros.fats}%` }}
              ></div>
            </div>
          </div>
          <div className="flex justify-between mt-2 text-xs">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-secondary mr-1"></div>
              <span>Protein: {macros.protein}%</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-primary mr-1"></div>
              <span>Carbs: {macros.carbs}%</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-accent mr-1"></div>
              <span>Fats: {macros.fats}%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
