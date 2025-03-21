import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Plus, Check } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";

interface WaterIntakeProps {
  userId: number;
}

export default function WaterIntake({ userId }: WaterIntakeProps) {
  // Track locally which glasses have been tracked
  const [trackedGlasses, setTrackedGlasses] = useState<number[]>([]);
  
  // Fetch current water intake
  const { data, isLoading, error } = useQuery({
    queryKey: [`/api/user/${userId}/water-intake`],
  });
  
  // Mutation to add water intake
  const addWaterMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/user/${userId}/water-intake`, {
        amount: 0.2 // 200ml per glass
      });
      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch the water intake data
      queryClient.invalidateQueries({ queryKey: [`/api/user/${userId}/water-intake`] });
    },
  });

  // Handle adding water intake
  const handleAddWater = (glassIndex: number) => {
    if (trackedGlasses.includes(glassIndex)) return;
    
    setTrackedGlasses((prev) => [...prev, glassIndex]);
    addWaterMutation.mutate();
  };

  // Create glasses array (8 glasses = target of ~1.6L)
  const waterGlasses = Array.from({ length: 8 }, (_, i) => i);

  if (isLoading) {
    return (
      <Card className="bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Water Intake</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-full mb-4" />
          <Skeleton className="h-8 w-full mb-4" />
          <div className="grid grid-cols-8 gap-2">
            {waterGlasses.map((_, i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Water Intake</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-500">
            Failed to load water intake data. Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Calculate how many glasses have been filled based on the amount
  const glassesFilled = Math.floor((data?.amount || 0) / 0.2);
  
  return (
    <Card className="bg-white">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-text font-inter">Water Intake</CardTitle>
          <Badge variant="outline" className="text-xs font-medium bg-secondary bg-opacity-10 text-secondary">
            {data?.target}L Target
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="mb-2 flex justify-between items-center">
          <span className="text-sm text-gray-500">Today's progress</span>
          <span className="text-sm font-medium text-text">
            {data?.amount.toFixed(1)}L / {data?.target}L
          </span>
        </div>
        
        <Progress className="h-4 mb-4" value={data?.percentage} />
        
        <div className="grid grid-cols-8 gap-2">
          {waterGlasses.map((glassIndex) => {
            const isFilled = glassIndex < glassesFilled || trackedGlasses.includes(glassIndex);
            
            return (
              <Button
                key={glassIndex}
                size="sm"
                variant="outline"
                className={`h-8 rounded-full ${
                  isFilled 
                    ? "bg-secondary bg-opacity-20 text-secondary" 
                    : "bg-secondary bg-opacity-10 hover:bg-secondary hover:bg-opacity-20 text-secondary"
                }`}
                onClick={() => handleAddWater(glassIndex)}
                disabled={isFilled || addWaterMutation.isPending}
              >
                {isFilled ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <Plus className="h-5 w-5" />
                )}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
