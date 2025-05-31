export interface UserProfile {
  name: string;
  age: number | null;
  height: number | null; // cm
  weight: number | null; // kg
  dietaryPreferences: string;
}

export interface FoodItem {
  name: string;
  quantity: string;
}

export interface LoggedMeal {
  id: string;
  date: string; // ISO string
  foodItems: FoodItem[];
  source: 'image' | 'manual';
  imageUrl?: string; // if source is image
  imageHint?: string; // for placeholder images
}

export interface AppState {
  profile: UserProfile | null;
  meals: LoggedMeal[];
}

export interface PersonalizedRecommendation {
  recommendations: string[];
  feedback: string;
}
