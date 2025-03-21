import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateFitnessRecommendations, generateNutritionRecommendations } from "./lib/openai";
import { metricsUpdateSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get("/api/health", (_req: Request, res: Response) => {
    res.json({ status: "ok" });
  });

  // User profile endpoints
  app.get("/api/user/:id", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Don't return the password
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });

  // Update user metrics
  app.post("/api/user/:id/metrics", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    try {
      // Validate the request body
      const validatedData = metricsUpdateSchema.parse(req.body);
      
      // Update user data
      const updatedUser = await storage.updateUser(userId, {
        weight: validatedData.weight,
        targetWeight: validatedData.targetWeight || user.targetWeight,
        activityLevel: validatedData.activityLevel,
        fitnessGoal: validatedData.fitnessGoal,
      });

      if (!updatedUser) {
        return res.status(500).json({ error: "Failed to update user metrics" });
      }

      // Create a new health metric entry
      const bmi = validatedData.weight / Math.pow(user.height / 100, 2);
      
      // Calculate daily calories based on user data and goals
      let dailyCalories: number;
      
      // Basic BMR calculation using Mifflin-St Jeor Equation
      const isMale = true; // Assuming male for the default user, would need to add gender to user schema for proper calculation
      let bmr: number;

      if (isMale) {
        bmr = 10 * validatedData.weight + 6.25 * user.height - 5 * user.age + 5;
      } else {
        bmr = 10 * validatedData.weight + 6.25 * user.height - 5 * user.age - 161;
      }

      // Activity multiplier
      const activityMultipliers: { [key: string]: number } = {
        "Sedentary": 1.2,
        "Lightly Active": 1.375,
        "Moderately Active": 1.55,
        "Very Active": 1.725,
        "Extremely Active": 1.9
      };

      const tdee = bmr * (activityMultipliers[validatedData.activityLevel] || 1.55);

      // Adjust based on fitness goal
      switch (validatedData.fitnessGoal) {
        case "Lose Weight":
          dailyCalories = tdee - 500; // 500 calorie deficit for weight loss
          break;
        case "Gain Muscle":
          dailyCalories = tdee + 300; // 300 calorie surplus for muscle gain
          break;
        default:
          dailyCalories = tdee; // Maintain weight or improve endurance
      }

      // Ensure minimum safe calories
      dailyCalories = Math.max(1200, Math.round(dailyCalories));

      await storage.createHealthMetric({
        userId,
        weight: validatedData.weight,
        bmi,
        dailyCalories,
      });

      // Generate fresh recommendations based on updated metrics
      const fitnessRecommendations = await generateFitnessRecommendations(
        user.age,
        validatedData.weight,
        user.height,
        validatedData.targetWeight || user.targetWeight,
        validatedData.activityLevel,
        validatedData.fitnessGoal
      );

      await storage.createFitnessRecommendation({
        userId,
        content: fitnessRecommendations as any,
      });

      const nutritionRecommendations = await generateNutritionRecommendations(
        user.age,
        validatedData.weight,
        user.height,
        validatedData.targetWeight || user.targetWeight,
        validatedData.activityLevel,
        validatedData.fitnessGoal
      );

      await storage.createNutritionRecommendation({
        userId,
        content: nutritionRecommendations as any,
      });

      // Return success with the updated user data
      const { password, ...userWithoutPassword } = updatedUser;
      res.json({ 
        user: userWithoutPassword,
        message: "Metrics updated successfully" 
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ error: validationError.message });
      }
      
      console.error("Error updating metrics:", error);
      res.status(500).json({ error: "Failed to update metrics" });
    }
  });

  // Get health metrics
  app.get("/api/user/:id/health-metrics", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const lastMetric = await storage.getLastHealthMetric(userId);
    if (!lastMetric) {
      // If no metrics exist yet, calculate a default based on user data
      const bmi = user.weight / Math.pow(user.height / 100, 2);
      
      // Basic BMR using Mifflin-St Jeor
      const isMale = true; // Assuming male for now
      let bmr: number;

      if (isMale) {
        bmr = 10 * user.weight + 6.25 * user.height - 5 * user.age + 5;
      } else {
        bmr = 10 * user.weight + 6.25 * user.height - 5 * user.age - 161;
      }

      // Activity multiplier
      const activityMultipliers: { [key: string]: number } = {
        "Sedentary": 1.2,
        "Lightly Active": 1.375,
        "Moderately Active": 1.55,
        "Very Active": 1.725,
        "Extremely Active": 1.9
      };

      const multiplier = activityMultipliers[user.activityLevel] || 1.55;
      const tdee = bmr * multiplier;

      // Adjust based on fitness goal
      let dailyCalories: number;
      switch (user.fitnessGoal) {
        case "Lose Weight":
          dailyCalories = tdee - 500;
          break;
        case "Gain Muscle":
          dailyCalories = tdee + 300;
          break;
        default:
          dailyCalories = tdee;
      }

      // Create initial health metric
      const metric = await storage.createHealthMetric({
        userId,
        weight: user.weight,
        bmi,
        dailyCalories: Math.max(1200, Math.round(dailyCalories)),
      });

      return res.json(metric);
    }

    res.json(lastMetric);
  });

  // Get fitness recommendations
  app.get("/api/user/:id/fitness-recommendations", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let recommendations = await storage.getLatestFitnessRecommendation(userId);
    
    // If no recommendations exist, generate them
    if (!recommendations) {
      const fitnessRecommendations = await generateFitnessRecommendations(
        user.age,
        user.weight,
        user.height,
        user.targetWeight,
        user.activityLevel,
        user.fitnessGoal
      );

      recommendations = await storage.createFitnessRecommendation({
        userId,
        content: fitnessRecommendations as any,
      });
    }

    res.json(recommendations);
  });

  // Get nutrition recommendations
  app.get("/api/user/:id/nutrition-recommendations", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let recommendations = await storage.getLatestNutritionRecommendation(userId);
    
    // If no recommendations exist, generate them
    if (!recommendations) {
      const nutritionRecommendations = await generateNutritionRecommendations(
        user.age,
        user.weight,
        user.height,
        user.targetWeight,
        user.activityLevel,
        user.fitnessGoal
      );

      recommendations = await storage.createNutritionRecommendation({
        userId,
        content: nutritionRecommendations as any,
      });
    }

    res.json(recommendations);
  });

  // Get water intake
  app.get("/api/user/:id/water-intake", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const amount = await storage.getTodayWaterIntake(userId);
    
    // Calculate target water intake (default to 3.2L)
    const targetWaterIntake = 3.2;
    
    res.json({
      amount,
      target: targetWaterIntake,
      percentage: Math.min(100, Math.round((amount / targetWaterIntake) * 100))
    });
  });

  // Add water intake
  app.post("/api/user/:id/water-intake", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const amount = parseFloat(req.body.amount);
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: "Invalid water amount" });
    }

    await storage.addWaterIntake({
      userId,
      amount
    });

    const totalAmount = await storage.getTodayWaterIntake(userId);
    const targetWaterIntake = 3.2;
    
    res.json({
      amount: totalAmount,
      target: targetWaterIntake,
      percentage: Math.min(100, Math.round((totalAmount / targetWaterIntake) * 100))
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
