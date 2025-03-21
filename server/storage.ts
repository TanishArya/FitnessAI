import { 
  User, InsertUser, 
  HealthMetric, InsertHealthMetric,
  FitnessRecommendation, InsertFitnessRecommendation,
  NutritionRecommendation, InsertNutritionRecommendation,
  WaterIntake, InsertWaterIntake
} from "@shared/schema";

// Interface for the storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User | undefined>;

  // Health metrics operations
  getLastHealthMetric(userId: number): Promise<HealthMetric | undefined>;
  getHealthMetricsHistory(userId: number): Promise<HealthMetric[]>;
  createHealthMetric(metric: InsertHealthMetric): Promise<HealthMetric>;

  // Fitness recommendations operations
  getLatestFitnessRecommendation(userId: number): Promise<FitnessRecommendation | undefined>;
  createFitnessRecommendation(recommendation: InsertFitnessRecommendation): Promise<FitnessRecommendation>;

  // Nutrition recommendations operations
  getLatestNutritionRecommendation(userId: number): Promise<NutritionRecommendation | undefined>;
  createNutritionRecommendation(recommendation: InsertNutritionRecommendation): Promise<NutritionRecommendation>;

  // Water intake operations
  getTodayWaterIntake(userId: number): Promise<number>; // Returns total amount in liters
  addWaterIntake(intake: InsertWaterIntake): Promise<WaterIntake>;
}

// In-memory implementation of the storage
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private healthMetrics: Map<number, HealthMetric[]>;
  private fitnessRecommendations: Map<number, FitnessRecommendation[]>;
  private nutritionRecommendations: Map<number, NutritionRecommendation[]>;
  private waterIntakes: Map<number, WaterIntake[]>;
  private currentUserId: number;
  private currentMetricId: number;
  private currentFitnessRecId: number;
  private currentNutritionRecId: number;
  private currentWaterIntakeId: number;

  constructor() {
    this.users = new Map();
    this.healthMetrics = new Map();
    this.fitnessRecommendations = new Map();
    this.nutritionRecommendations = new Map();
    this.waterIntakes = new Map();
    this.currentUserId = 1;
    this.currentMetricId = 1;
    this.currentFitnessRecId = 1;
    this.currentNutritionRecId = 1;
    this.currentWaterIntakeId = 1;

    // Add a default user for testing
    this.createUser({
      username: "johndoe",
      password: "password123",
      email: "john.doe@example.com",
      name: "John Doe",
      age: 32,
      height: 178, // 5'10" in cm
      weight: 78, // ~172 lbs
      targetWeight: 72.5, // ~160 lbs
      activityLevel: "Moderately Active",
      fitnessGoal: "Lose Weight",
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const newUser: User = { ...user, id, createdAt: new Date().toISOString() };
    this.users.set(id, newUser);
    
    // Initialize empty arrays for the user's data
    this.healthMetrics.set(id, []);
    this.fitnessRecommendations.set(id, []);
    this.nutritionRecommendations.set(id, []);
    this.waterIntakes.set(id, []);
    
    return newUser;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Health metrics operations
  async getLastHealthMetric(userId: number): Promise<HealthMetric | undefined> {
    const metrics = this.healthMetrics.get(userId) || [];
    return metrics.length > 0 ? metrics[metrics.length - 1] : undefined;
  }

  async getHealthMetricsHistory(userId: number): Promise<HealthMetric[]> {
    return this.healthMetrics.get(userId) || [];
  }

  async createHealthMetric(metric: InsertHealthMetric): Promise<HealthMetric> {
    const id = this.currentMetricId++;
    const newMetric: HealthMetric = { 
      ...metric, 
      id, 
      recordedAt: new Date().toISOString() 
    };
    
    const userMetrics = this.healthMetrics.get(metric.userId) || [];
    userMetrics.push(newMetric);
    this.healthMetrics.set(metric.userId, userMetrics);
    
    return newMetric;
  }

  // Fitness recommendations operations
  async getLatestFitnessRecommendation(userId: number): Promise<FitnessRecommendation | undefined> {
    const recommendations = this.fitnessRecommendations.get(userId) || [];
    return recommendations.length > 0 ? recommendations[recommendations.length - 1] : undefined;
  }

  async createFitnessRecommendation(recommendation: InsertFitnessRecommendation): Promise<FitnessRecommendation> {
    const id = this.currentFitnessRecId++;
    const newRecommendation: FitnessRecommendation = { 
      ...recommendation, 
      id, 
      generatedAt: new Date().toISOString() 
    };
    
    const userRecommendations = this.fitnessRecommendations.get(recommendation.userId) || [];
    userRecommendations.push(newRecommendation);
    this.fitnessRecommendations.set(recommendation.userId, userRecommendations);
    
    return newRecommendation;
  }

  // Nutrition recommendations operations
  async getLatestNutritionRecommendation(userId: number): Promise<NutritionRecommendation | undefined> {
    const recommendations = this.nutritionRecommendations.get(userId) || [];
    return recommendations.length > 0 ? recommendations[recommendations.length - 1] : undefined;
  }

  async createNutritionRecommendation(recommendation: InsertNutritionRecommendation): Promise<NutritionRecommendation> {
    const id = this.currentNutritionRecId++;
    const newRecommendation: NutritionRecommendation = { 
      ...recommendation, 
      id, 
      generatedAt: new Date().toISOString() 
    };
    
    const userRecommendations = this.nutritionRecommendations.get(recommendation.userId) || [];
    userRecommendations.push(newRecommendation);
    this.nutritionRecommendations.set(recommendation.userId, userRecommendations);
    
    return newRecommendation;
  }

  // Water intake operations
  async getTodayWaterIntake(userId: number): Promise<number> {
    const today = new Date().toISOString().split('T')[0]; // Get just the date part
    const intakes = this.waterIntakes.get(userId) || [];
    
    return intakes
      .filter(intake => intake.recordedAt.startsWith(today))
      .reduce((total, intake) => total + intake.amount, 0);
  }

  async addWaterIntake(intake: InsertWaterIntake): Promise<WaterIntake> {
    const id = this.currentWaterIntakeId++;
    const newIntake: WaterIntake = { 
      ...intake, 
      id, 
      recordedAt: new Date().toISOString() 
    };
    
    const userIntakes = this.waterIntakes.get(intake.userId) || [];
    userIntakes.push(newIntake);
    this.waterIntakes.set(intake.userId, userIntakes);
    
    return newIntake;
  }
}

export const storage = new MemStorage();
