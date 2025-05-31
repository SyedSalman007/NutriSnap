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
    .string() /* .array(z.enum(['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'keto', 'paleo'])) */
    .describe('The dietary preferences of the user.'),
});

const LoggedMealSchema = z.object({
  foodItems: z.array(z.string()).describe('A list of food items consumed in the meal.'),
  quantity: z.array(z.string()).describe('A list of quantities of each food item consumed in the meal'),
});

const PersonalizedRecommendationsInputSchema = z.object({
  userProfile: UserProfileSchema.describe('The user profile.'),
  loggedMeals: z.array(LoggedMealSchema).describe('A list of logged meals.'),
});
export type PersonalizedRecommendationsInput = z.infer<
  typeof PersonalizedRecommendationsInputSchema
>;

const PersonalizedRecommendationsOutputSchema = z.object({
  recommendations: z
    .array(z.string())
    .describe('A list of personalized nutrition recommendations.'),
  feedback: z.string().describe('Personalized feedback on the user`s diet.'),
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

  Based on the user's profile and logged meals, provide personalized
  recommendations and feedback.

  User Profile:
  {{userProfile}}

  Logged Meals:
  {{#each loggedMeals}}
  Meal {{@index}}:
  Foods: {{this.foodItems}}
  Quantities: {{this.quantity}}
  {{/each}}

  Provide recommendations and feedback to help the user make informed decisions about their diet.
  Ensure that the recommendations align with the user's dietary preferences.
  DO NOT MAKE UP INFORMATION. If the user profile or logged meals are missing, respond accordingly.
  If the user profile is complete but no meals have been logged, make general recommendations based on the profile data.
  If the user profile is incomplete or contains nonsensical data, request for the user to provide more information or correct the data.
  Responses should contain the key recommendations and feedback.
  `,
});

const personalizedRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedRecommendationsFlow',
    inputSchema: PersonalizedRecommendationsInputSchema,
    outputSchema: PersonalizedRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
