import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";

interface FitnessRecommendationsProps {
  userId: number;
}

export default function FitnessRecommendations({ userId }: FitnessRecommendationsProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: [`/api/user/${userId}/fitness-recommendations`],
  });

  const weekdays = [
    { short: "Mon", full: "monday" },
    { short: "Tue", full: "tuesday" },
    { short: "Wed", full: "wednesday" },
    { short: "Thu", full: "thursday" },
    { short: "Fri", full: "friday" },
    { short: "Sat", full: "saturday" },
    { short: "Sun", full: "sunday" },
  ];

  // Get schedule data from recommendation content
  const getScheduleData = (day: string) => {
    if (!data?.content?.weeklySchedule) return { workoutType: "Rest", color: "gray" };
    return data.content.weeklySchedule[day] || { workoutType: "Rest", color: "gray" };
  };

  // Get background color class based on workout type
  const getColorClass = (color: string) => {
    switch (color) {
      case "primary":
        return "bg-primary bg-opacity-10 text-primary";
      case "secondary":
        return "bg-secondary bg-opacity-10 text-secondary";
      case "accent":
        return "bg-accent bg-opacity-10 text-accent";
      default:
        return "bg-gray-200 text-gray-500";
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Fitness Recommendations</CardTitle>
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
          <CardTitle className="text-lg">Fitness Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-500">
            Failed to load fitness recommendations. Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-text font-inter">Fitness Recommendations</CardTitle>
          <Badge className="text-xs font-medium bg-primary bg-opacity-10 text-primary hover:bg-primary hover:bg-opacity-20">
            AI Generated
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {data?.content?.cardio && (
          <div className="p-3 bg-gray-50 rounded-standard">
            <h4 className="font-medium text-text mb-2 font-nunito">{data.content.cardio.title}</h4>
            <p className="text-sm text-gray-600">{data.content.cardio.description}</p>
          </div>
        )}
        
        {data?.content?.strength && (
          <div className="p-3 bg-gray-50 rounded-standard">
            <h4 className="font-medium text-text mb-2 font-nunito">{data.content.strength.title}</h4>
            <p className="text-sm text-gray-600">{data.content.strength.description}</p>
          </div>
        )}
        
        {data?.content?.flexibility && (
          <div className="p-3 bg-gray-50 rounded-standard">
            <h4 className="font-medium text-text mb-2 font-nunito">{data.content.flexibility.title}</h4>
            <p className="text-sm text-gray-600">{data.content.flexibility.description}</p>
          </div>
        )}
        
        <div className="mt-6">
          <h4 className="font-medium text-text mb-3 font-nunito">Weekly Workout Schedule</h4>
          <div className="bg-gray-50 rounded-standard p-3">
            <div className="grid grid-cols-7 gap-1">
              {weekdays.map((day) => {
                const schedule = getScheduleData(day.full);
                return (
                  <div key={day.short} className="text-center">
                    <div className="text-xs font-medium text-gray-500 mb-1">{day.short}</div>
                    <div className={`h-12 flex items-center justify-center ${getColorClass(schedule.color)} text-xs font-medium rounded-md`}>
                      {schedule.workoutType}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <a href="#" className="text-secondary font-medium text-sm flex items-center hover:underline">
          View detailed workout plans
          <ChevronRight className="h-4 w-4 ml-1" />
        </a>
      </CardFooter>
    </Card>
  );
}
