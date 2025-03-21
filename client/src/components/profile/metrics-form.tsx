import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Form validation schema
const metricsFormSchema = z.object({
  weight: z.string().min(2, "Weight is required"),
  weightUnit: z.enum(["lbs", "kg"]),
  targetWeight: z.string().min(2, "Target weight is required"),
  targetWeightUnit: z.enum(["lbs", "kg"]),
  activityLevel: z.enum([
    "Sedentary", 
    "Lightly Active", 
    "Moderately Active", 
    "Very Active", 
    "Extremely Active"
  ]),
  fitnessGoal: z.enum([
    "Maintain Weight", 
    "Lose Weight", 
    "Gain Muscle", 
    "Improve Endurance"
  ]),
});

type MetricsFormValues = z.infer<typeof metricsFormSchema>;

interface MetricsFormProps {
  userData: any;
}

export default function MetricsForm({ userData }: MetricsFormProps) {
  const { toast } = useToast();
  const [weightUnit, setWeightUnit] = useState("lbs");
  const [targetWeightUnit, setTargetWeightUnit] = useState("lbs");
  
  // Setup form with default values
  const form = useForm<MetricsFormValues>({
    resolver: zodResolver(metricsFormSchema),
    defaultValues: {
      weight: userData?.weight ? Math.round(userData.weight * 2.20462).toString() : "",
      weightUnit: "lbs",
      targetWeight: userData?.targetWeight ? Math.round(userData.targetWeight * 2.20462).toString() : "",
      targetWeightUnit: "lbs",
      activityLevel: userData?.activityLevel || "Moderately Active",
      fitnessGoal: userData?.fitnessGoal || "Lose Weight",
    },
  });

  // Setup mutation
  const updateMetricsMutation = useMutation({
    mutationFn: async (values: MetricsFormValues) => {
      // Convert weight to kg if needed
      const weightInKg = values.weightUnit === "lbs" 
        ? parseFloat(values.weight) / 2.20462 
        : parseFloat(values.weight);
      
      // Convert target weight to kg if needed
      const targetWeightInKg = values.targetWeightUnit === "lbs" 
        ? parseFloat(values.targetWeight) / 2.20462 
        : parseFloat(values.targetWeight);
      
      // Send the updated metrics to the API
      const response = await apiRequest("POST", `/api/user/1/metrics`, {
        weight: weightInKg,
        targetWeight: targetWeightInKg,
        activityLevel: values.activityLevel,
        fitnessGoal: values.fitnessGoal
      });

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch queries to update the UI
      queryClient.invalidateQueries({ queryKey: ['/api/user/1'] });
      queryClient.invalidateQueries({ queryKey: ['/api/user/1/health-metrics'] });
      queryClient.invalidateQueries({ queryKey: ['/api/user/1/fitness-recommendations'] });
      queryClient.invalidateQueries({ queryKey: ['/api/user/1/nutrition-recommendations'] });
      
      toast({
        title: "Metrics updated successfully",
        description: "Your new recommendations have been generated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update metrics",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    }
  });

  // Form submission handler
  const onSubmit = (values: MetricsFormValues) => {
    updateMetricsMutation.mutate(values);
  };

  if (!userData) {
    return (
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-lg">Update Your Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-text font-inter">Update Your Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Weight</FormLabel>
                    <div className="flex">
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormField
                        control={form.control}
                        name="weightUnit"
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={(value) => {
                              field.onChange(value);
                              setWeightUnit(value);
                              
                              // Convert weight value when unit changes
                              const currentWeight = form.getValues("weight");
                              if (currentWeight && !isNaN(parseFloat(currentWeight))) {
                                const newWeight = value === "kg" 
                                  ? (parseFloat(currentWeight) / 2.20462).toFixed(1)
                                  : (parseFloat(currentWeight) * 2.20462).toFixed(0);
                                form.setValue("weight", newWeight);
                              }
                            }}
                          >
                            <SelectTrigger className="w-20 ml-2">
                              <SelectValue placeholder="Unit" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="lbs">lbs</SelectItem>
                              <SelectItem value="kg">kg</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div>
              <FormField
                control={form.control}
                name="activityLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Activity Level</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select activity level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Sedentary">Sedentary</SelectItem>
                        <SelectItem value="Lightly Active">Lightly Active</SelectItem>
                        <SelectItem value="Moderately Active">Moderately Active</SelectItem>
                        <SelectItem value="Very Active">Very Active</SelectItem>
                        <SelectItem value="Extremely Active">Extremely Active</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div>
              <FormField
                control={form.control}
                name="fitnessGoal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fitness Goal</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select fitness goal" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Maintain Weight">Maintain Weight</SelectItem>
                        <SelectItem value="Lose Weight">Lose Weight</SelectItem>
                        <SelectItem value="Gain Muscle">Gain Muscle</SelectItem>
                        <SelectItem value="Improve Endurance">Improve Endurance</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div>
              <FormField
                control={form.control}
                name="targetWeight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Weight</FormLabel>
                    <div className="flex">
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormField
                        control={form.control}
                        name="targetWeightUnit"
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={(value) => {
                              field.onChange(value);
                              setTargetWeightUnit(value);
                              
                              // Convert target weight value when unit changes
                              const currentTargetWeight = form.getValues("targetWeight");
                              if (currentTargetWeight && !isNaN(parseFloat(currentTargetWeight))) {
                                const newTargetWeight = value === "kg" 
                                  ? (parseFloat(currentTargetWeight) / 2.20462).toFixed(1)
                                  : (parseFloat(currentTargetWeight) * 2.20462).toFixed(0);
                                form.setValue("targetWeight", newTargetWeight);
                              }
                            }}
                          >
                            <SelectTrigger className="w-20 ml-2">
                              <SelectValue placeholder="Unit" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="lbs">lbs</SelectItem>
                              <SelectItem value="kg">kg</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="mt-6">
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 text-white"
                disabled={updateMetricsMutation.isPending}
              >
                {updateMetricsMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Get Updated Recommendations"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
