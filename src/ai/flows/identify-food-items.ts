'use server';

/**
 * @fileOverview This file defines a Genkit flow for identifying food items in an image.
 *
 * It takes an image as input and returns a list of identified food items.
 *
 * @fileOverview A food identification AI agent.
 * - identifyFoodItems - A function that handles the food identification process.
 * - IdentifyFoodItemsInput - The input type for the identifyFoodItems function.
 * - IdentifyFoodItemsOutput - The return type for the identifyFoodItems function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IdentifyFoodItemsInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      'A photo of a meal, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'
    ),
});
export type IdentifyFoodItemsInput = z.infer<typeof IdentifyFoodItemsInputSchema>;

const IdentifyFoodItemsOutputSchema = z.object({
  foodItems: z
    .array(z.string())
    .describe('A list of identified food items in the image.'),
});
export type IdentifyFoodItemsOutput = z.infer<typeof IdentifyFoodItemsOutputSchema>;

export async function identifyFoodItems(input: IdentifyFoodItemsInput): Promise<IdentifyFoodItemsOutput> {
  return identifyFoodItemsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'identifyFoodItemsPrompt',
  input: {schema: IdentifyFoodItemsInputSchema},
  output: {schema: IdentifyFoodItemsOutputSchema},
  prompt: `You are a food recognition expert.  Given the image of the meal, identify the food items that are present in the meal.

  Return a simple list of the food items, comma separated. Do not include any extra words or explanation.

  Image: {{media url=photoDataUri}}`,
});

const identifyFoodItemsFlow = ai.defineFlow(
  {
    name: 'identifyFoodItemsFlow',
    inputSchema: IdentifyFoodItemsInputSchema,
    outputSchema: IdentifyFoodItemsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
