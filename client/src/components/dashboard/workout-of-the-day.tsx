import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

// Sample workout data - in a real application, this would come from an API
const exercises = [
  { id: 1, name: "Jumping Jacks", instruction: "30 seconds, maximum effort" },
  { id: 2, name: "Mountain Climbers", instruction: "30 seconds, maximum effort" },
  { id: 3, name: "Bodyweight Squats", instruction: "30 seconds, maximum effort" },
  { id: 4, name: "Push-ups", instruction: "30 seconds, maximum effort" },
];

export default function WorkoutOfTheDay() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold font-inter">Today's Workout</CardTitle>
          <Badge variant="outline" className="text-xs font-medium text-accent">
            25 min
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-0 overflow-hidden">
        <div className="rounded-standard overflow-hidden relative h-40 mb-4">
          <div 
            className="w-full h-full bg-cover bg-center"
            style={{ 
              backgroundImage: "url('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80')"
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-4">
            <h4 className="text-white font-semibold text-lg">HIIT Cardio</h4>
            <p className="text-white/80 text-sm">Optimized for your weight loss goal</p>
          </div>
        </div>
        
        <div className="space-y-3 px-6">
          {exercises.map((exercise, index) => (
            <div key={exercise.id} className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                {index + 1}
              </div>
              <div className="ml-3">
                <h5 className="text-sm font-medium">{exercise.name}</h5>
                <p className="text-xs text-muted-foreground">{exercise.instruction}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="mt-6">
        <Button className="w-full" variant="default">
          <Play className="h-4 w-4 mr-2" />
          Start Workout
        </Button>
      </CardFooter>
    </Card>
  );
}
