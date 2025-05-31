
'use server';

/**
 * @fileOverview AI-powered personalized nutrition recommendations flow.
 *
 * - getPersonalizedRecommendations - A function that generates personalized nutrition recommendations.
 * - PersonalizedRecommendationsInput - The input type for the getPersonalizedRecommendations function.
 * - PersonalizedRecommendationsOutput - The return type for the getPersonalizedRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const UserProfileSchema = z.object({
  age: z.number().describe('The age of the user.'),
  height: z.number().describe('The height of the user in centimeters.'),
  weight: z.number().describe('The weight of the user in kilograms.'),
  dietaryPreferences: z
    .string()
    .describe('The dietary preferences of the user.'),
});

const LoggedMealSchema = z.object({
  foodItems: z.array(z.string()).describe('A list of food items consumed in the meal, to be considered as available ingredients.'),
  quantity: z.array(z.string()).describe('A list of quantities of each food item consumed in the meal. Focus on items as ingredients for new dish suggestions.'),
});

const PersonalizedRecommendationsInputSchema = z.object({
  userProfile: UserProfileSchema.describe('The user profile.'),
  loggedMeals: z.array(LoggedMealSchema).describe('A list of logged meals, which indicate available ingredients for dish suggestions.'),
});
export type PersonalizedRecommendationsInput = z.infer<
  typeof PersonalizedRecommendationsInputSchema
>;

const RecommendedDishSchema = z.object({
  dishName: z.string().describe('The name of the recommended food dish that can be prepared from available ingredients.'),
  calories: z.number().describe('Estimated calorie count for one serving of the dish, as a numerical value.'),
  healthRecommendation: z.string().describe('Personalized advice on whether this dish is healthy for the user and why, considering their profile.'),
});

const PersonalizedRecommendationsOutputSchema = z.object({
  recommendations: z
    .array(RecommendedDishSchema)
    .describe('A list of personalized dish recommendations, including dish name, calorie information, and health advice. These dishes should be preparable from the logged food items.'),
  feedback: z.string().describe('Personalized general feedback on the user`s diet based on their profile and logged meals.'),
});
export type PersonalizedRecommendationsOutput = z.infer<
  typeof PersonalizedRecommendationsOutputSchema
>;

export async function getPersonalizedRecommendations(
  input: PersonalizedRecommendationsInput
): Promise<PersonalizedRecommendationsOutput> {
  return personalizedRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedRecommendationsPrompt',
  input: {schema: PersonalizedRecommendationsInputSchema},
  output: {schema: PersonalizedRecommendationsOutputSchema},
  prompt: `You are a nutritionist providing personalized nutrition recommendations.

  Based on the user's profile and logged meals (which list available ingredients), provide personalized recommendations and feedback.

  User Profile:
  - Age: {{userProfile.age}}
  - Height: {{userProfile.height}} cm
  - Weight: {{userProfile.weight}} kg
  - Dietary Preferences: {{{userProfile.dietaryPreferences}}}

  Logged Meals (treat these as a list of available ingredients for new dish suggestions):
  {{#each loggedMeals}}
  Meal {{@index}} (Ingredients available from this log):
  Foods: {{this.foodItems}}
  Quantities: {{this.quantity}} (Note: focus on the food items as ingredients, the logged quantities are less important for suggesting new dishes)
  {{/each}}

  Provide recommendations and feedback to help the user make informed decisions about their diet.
  Ensure that the recommendations align with the user's dietary preferences.

  Your output must include:
  1.  'feedback': General dietary feedback based on the user's profile and overall eating patterns from logged meals.
  2.  'recommendations': A list of 2-3 specific food dishes. For each dish suggestion:
      *   The dish should be primarily preparable using the ingredients available from the 'Logged Meals' section. You can assume common pantry staples like spices, oil, etc., are available.
      *   'dishName': The name of the suggested dish.
      *   'calories': The estimated calorie count for one serving of the dish (provide as a number, e.g., 350).
      *   'healthRecommendation': Personalized advice on whether this dish is healthy for the user to eat, considering their profile (age, height, weight, dietary preferences), and explain why.

  DO NOT MAKE UP INFORMATION.
  If the user profile is incomplete (missing age, height, or weight) or contains nonsensical data, provide feedback requesting the user to provide more information or correct the data, and make the recommendations list empty.
  If the user profile is complete but no meals/ingredients have been logged (loggedMeals is empty), make general recommendations based on the profile data in the 'feedback' field, and state in the 'feedback' that no specific dish suggestions can be made without knowing available ingredients. Keep the 'recommendations' list empty.
  If logged meals are provided but are insufficient to create 2-3 distinct dish suggestions, suggest as many as possible and note this limitation in the feedback.
  `,
});

const personalizedRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedRecommendationsFlow',
    inputSchema: PersonalizedRecommendationsInputSchema,
    outputSchema: PersonalizedRecommendationsOutputSchema,
  },
  async (input: PersonalizedRecommendationsInput) => {
    const {output} = await prompt(input);
    return output!;
  }
);
