import OpenAI from "openai";

// Initialize OpenAI with API key from environment variables
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "your-api-key" });

// Type definitions for AI-generated fitness recommendations
export interface FitnessRecommendations {
  cardio: {
    title: string;
    description: string;
  };
  strength: {
    title: string;
    description: string;
  };
  flexibility: {
    title: string;
    description: string;
  };
  weeklySchedule: {
    [day: string]: {
      workoutType: string;
      color: string;
    };
  };
}

// Type definitions for AI-generated nutrition recommendations
export interface NutritionRecommendations {
  calorieTarget: {
    title: string;
    description: string;
    amount: number;
  };
  proteinIntake: {
    title: string;
    description: string;
    amount: number;
  };
  mealTiming: {
    title: string;
    description: string;
  };
  macroDistribution: {
    protein: number;
    carbs: number;
    fats: number;
  };
  mealPlan: {
    breakfast: {
      title: string;
      description: string;
      calories: number;
      protein: number;
      carbs: number;
      fats: number;
    };
    lunch: {
      title: string;
      description: string;
      calories: number;
      protein: number;
      carbs: number;
      fats: number;
    };
    dinner: {
      title: string;
      description: string;
      calories: number;
      protein: number;
      carbs: number;
      fats: number;
    };
  };
}

// Generate fitness recommendations based on user parameters
export async function generateFitnessRecommendations(
  age: number,
  weight: number, // weight in kg
  height: number, // height in cm
  targetWeight: number, // target weight in kg
  activityLevel: string,
  fitnessGoal: string
): Promise<FitnessRecommendations> {
  const prompt = `
    Generate personalized fitness recommendations for a user with the following characteristics:
    - Age: ${age} years
    - Current weight: ${weight} kg (${Math.round(weight * 2.20462)} lbs)
    - Height: ${height} cm (${Math.floor(height / 30.48)}'${Math.round((height % 30.48) / 2.54)}")
    - Target weight: ${targetWeight} kg (${Math.round(targetWeight * 2.20462)} lbs)
    - Activity level: ${activityLevel}
    - Fitness goal: ${fitnessGoal}

    Please provide detailed recommendations in JSON format with the following structure:
    {
      "cardio": {
        "title": "Cardio Recommendation",
        "description": "Detailed cardio workout recommendation"
      },
      "strength": {
        "title": "Strength Training",
        "description": "Detailed strength training recommendation"
      },
      "flexibility": {
        "title": "Flexibility & Recovery",
        "description": "Detailed flexibility and recovery recommendation"
      },
      "weeklySchedule": {
        "monday": {"workoutType": "Cardio", "color": "secondary"},
        "tuesday": {"workoutType": "Strength", "color": "primary"},
        "wednesday": {"workoutType": "Rest", "color": "gray"},
        "thursday": {"workoutType": "Cardio", "color": "secondary"},
        "friday": {"workoutType": "Strength", "color": "primary"},
        "saturday": {"workoutType": "Yoga", "color": "accent"},
        "sunday": {"workoutType": "Rest", "color": "gray"}
      }
    }

    The recommendations should be evidence-based, safe, and tailored to the user's specific parameters.
  `;

  try {
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a certified fitness coach specializing in personalized workout programming. Provide evidence-based, safe recommendations."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content);
    return result as FitnessRecommendations;
  } catch (error) {
    console.error("Error generating fitness recommendations:", error);
    // Fallback recommendations in case of API failure
    return {
      cardio: {
        title: "Cardio Recommendation",
        description: "Start with 30 minutes of moderate-intensity cardio 3 days per week. Focus on jogging, cycling, or swimming to improve heart health."
      },
      strength: {
        title: "Strength Training",
        description: "Incorporate 2-3 days of full-body strength training. Focus on compound movements with moderate weights and 10-12 repetitions."
      },
      flexibility: {
        title: "Flexibility & Recovery",
        description: "Add 10-15 minutes of stretching after workouts to improve flexibility and reduce injury risk. Consider adding one yoga session weekly."
      },
      weeklySchedule: {
        monday: { workoutType: "Cardio", color: "secondary" },
        tuesday: { workoutType: "Strength", color: "primary" },
        wednesday: { workoutType: "Rest", color: "gray" },
        thursday: { workoutType: "Cardio", color: "secondary" },
        friday: { workoutType: "Strength", color: "primary" },
        saturday: { workoutType: "Yoga", color: "accent" },
        sunday: { workoutType: "Rest", color: "gray" }
      }
    };
  }
}

// Generate nutrition recommendations based on user parameters
export async function generateNutritionRecommendations(
  age: number,
  weight: number, // weight in kg
  height: number, // height in cm
  targetWeight: number, // target weight in kg
  activityLevel: string,
  fitnessGoal: string
): Promise<NutritionRecommendations> {
  const prompt = `
    Generate personalized nutrition recommendations for a user with the following characteristics:
    - Age: ${age} years
    - Current weight: ${weight} kg (${Math.round(weight * 2.20462)} lbs)
    - Height: ${height} cm (${Math.floor(height / 30.48)}'${Math.round((height % 30.48) / 2.54)}")
    - Target weight: ${targetWeight} kg (${Math.round(targetWeight * 2.20462)} lbs)
    - Activity level: ${activityLevel}
    - Fitness goal: ${fitnessGoal}

    Please provide detailed nutrition recommendations in JSON format with the following structure:
    {
      "calorieTarget": {
        "title": "Calorie Target",
        "description": "Detailed calorie recommendation",
        "amount": 0000
      },
      "proteinIntake": {
        "title": "Protein Intake",
        "description": "Detailed protein intake recommendation",
        "amount": 000
      },
      "mealTiming": {
        "title": "Meal Timing",
        "description": "Detailed meal timing recommendation"
      },
      "macroDistribution": {
        "protein": 40,
        "carbs": 30,
        "fats": 30
      },
      "mealPlan": {
        "breakfast": {
          "title": "Breakfast",
          "description": "Detailed breakfast recommendation",
          "calories": 420,
          "protein": 26,
          "carbs": 38,
          "fats": 14
        },
        "lunch": {
          "title": "Lunch",
          "description": "Detailed lunch recommendation",
          "calories": 560,
          "protein": 42,
          "carbs": 40,
          "fats": 20
        },
        "dinner": {
          "title": "Dinner",
          "description": "Detailed dinner recommendation",
          "calories": 520,
          "protein": 36,
          "carbs": 45,
          "fats": 18
        }
      }
    }

    The recommendations should be evidence-based, safe, and tailored to the user's specific parameters.
  `;

  try {
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a certified nutritionist specializing in personalized meal planning. Provide evidence-based, safe dietary recommendations."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content);
    return result as NutritionRecommendations;
  } catch (error) {
    console.error("Error generating nutrition recommendations:", error);
    // Fallback recommendations in case of API failure
    return {
      calorieTarget: {
        title: "Calorie Target",
        description: "Based on your parameters and weight loss goal, aim for 1,860 calories per day with a macro ratio of 40% protein, 30% carbs, and 30% healthy fats.",
        amount: 1860
      },
      proteinIntake: {
        title: "Protein Intake",
        description: "Consume 0.8g of protein per pound of body weight (approximately 138g daily). Focus on lean sources like chicken, fish, tofu, legumes, and low-fat dairy.",
        amount: 138
      },
      mealTiming: {
        title: "Meal Timing",
        description: "Distribute your calories across 4-5 smaller meals throughout the day. Consider eating your largest meal within 2 hours of your workout for optimal recovery."
      },
      macroDistribution: {
        protein: 40,
        carbs: 30,
        fats: 30
      },
      mealPlan: {
        breakfast: {
          title: "Breakfast",
          description: "Greek yogurt with berries and honey, 2 boiled eggs",
          calories: 420,
          protein: 26,
          carbs: 38,
          fats: 14
        },
        lunch: {
          title: "Lunch",
          description: "Grilled chicken salad with olive oil dressing, quinoa",
          calories: 560,
          protein: 42,
          carbs: 40,
          fats: 20
        },
        dinner: {
          title: "Dinner",
          description: "Baked salmon with roasted vegetables and brown rice",
          calories: 520,
          protein: 36,
          carbs: 45,
          fats: 18
        }
      }
    };
  }
}
