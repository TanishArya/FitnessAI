import { pgTable, text, serial, integer, boolean, doublePrecision, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User profile schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  name: text("name").notNull(),
  age: integer("age"),
  height: doublePrecision("height"), // Height in cm
  weight: doublePrecision("weight"), // Weight in kg
  targetWeight: doublePrecision("target_weight"), // Target weight in kg
  activityLevel: text("activity_level"), // Sedentary, Light, Moderate, Very, Extremely
  fitnessGoal: text("fitness_goal"), // Weight Loss, Maintain, Muscle Gain, Endurance
  createdAt: text("created_at").$defaultFn(() => new Date().toISOString()),
});

// Health metrics schema
export const healthMetrics = pgTable("health_metrics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  weight: doublePrecision("weight").notNull(), // Weight in kg
  bmi: doublePrecision("bmi"), // Body mass index
  dailyCalories: integer("daily_calories"), // Recommended calories
  recordedAt: text("recorded_at").$defaultFn(() => new Date().toISOString()),
});

// Fitness recommendations schema
export const fitnessRecommendations = pgTable("fitness_recommendations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  content: json("content").notNull(), // JSON with recommendations
  generatedAt: text("generated_at").$defaultFn(() => new Date().toISOString()),
});

// Nutrition recommendations schema
export const nutritionRecommendations = pgTable("nutrition_recommendations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  content: json("content").notNull(), // JSON with recommendations
  generatedAt: text("generated_at").$defaultFn(() => new Date().toISOString()),
});

// Water intake tracking
export const waterIntakes = pgTable("water_intakes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  amount: doublePrecision("amount").notNull(), // Amount in liters
  recordedAt: text("recorded_at").$defaultFn(() => new Date().toISOString()),
});

// Insert schemas using drizzle-zod
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertHealthMetricSchema = createInsertSchema(healthMetrics).omit({
  id: true,
  recordedAt: true,
});

export const insertFitnessRecommendationSchema = createInsertSchema(fitnessRecommendations).omit({
  id: true,
  generatedAt: true,
});

export const insertNutritionRecommendationSchema = createInsertSchema(nutritionRecommendations).omit({
  id: true,
  generatedAt: true,
});

export const insertWaterIntakeSchema = createInsertSchema(waterIntakes).omit({
  id: true,
  recordedAt: true,
});

// Extended schema with validation
export const userProfileSchema = insertUserSchema.extend({
  email: z.string().email(),
  age: z.number().min(16).max(100).optional(),
  height: z.number().min(50).max(250).optional(), // cm
  weight: z.number().min(30).max(250).optional(), // kg
  targetWeight: z.number().min(30).max(250).optional(), // kg
});

export const metricsUpdateSchema = z.object({
  weight: z.number().min(30).max(250), // kg
  targetWeight: z.number().min(30).max(250).optional(), // kg
  activityLevel: z.enum(['Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active', 'Extremely Active']),
  fitnessGoal: z.enum(['Maintain Weight', 'Lose Weight', 'Gain Muscle', 'Improve Endurance']),
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UserProfile = z.infer<typeof userProfileSchema>;

export type HealthMetric = typeof healthMetrics.$inferSelect;
export type InsertHealthMetric = z.infer<typeof insertHealthMetricSchema>;

export type FitnessRecommendation = typeof fitnessRecommendations.$inferSelect;
export type InsertFitnessRecommendation = z.infer<typeof insertFitnessRecommendationSchema>;

export type NutritionRecommendation = typeof nutritionRecommendations.$inferSelect;
export type InsertNutritionRecommendation = z.infer<typeof insertNutritionRecommendationSchema>;

export type WaterIntake = typeof waterIntakes.$inferSelect;
export type InsertWaterIntake = z.infer<typeof insertWaterIntakeSchema>;

export type MetricsUpdate = z.infer<typeof metricsUpdateSchema>;
