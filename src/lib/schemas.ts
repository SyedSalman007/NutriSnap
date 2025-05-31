import { z } from 'zod';

export const ProfileFormSchema = z.object({
  name: z.string().min(1, "Name is required to personalize your experience."),
  age: z.coerce.number().min(1, "Age must be a positive number.").max(120, "Age seems a bit high!").nullable().optional(),
  height: z.coerce.number().min(50, "Height must be at least 50cm.").max(300, "Height seems a bit high!").nullable().optional(), // cm
  weight: z.coerce.number().min(1, "Weight must be a positive number.").max(500, "Weight seems a bit high!").nullable().optional(), // kg
  dietaryPreferences: z.string().optional(),
});

export type ProfileFormData = z.infer<typeof ProfileFormSchema>;


export const ManualMealItemSchema = z.object({
  name: z.string().min(1, "Food name is required."),
  quantity: z.string().min(1, "Quantity is required."),
});

export const ManualMealFormSchema = z.object({
  foodItems: z.array(ManualMealItemSchema).min(1, "Please add at least one food item."),
});

export type ManualMealFormData = z.infer<typeof ManualMealFormSchema>;
