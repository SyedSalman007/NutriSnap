"use client";

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ManualMealFormData, ManualMealFormSchema } from '@/lib/schemas';
import { useAppState } from '@/contexts/AppStateContext';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { FoodItemInput } from './FoodItemInput';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle } from 'lucide-react';

export function ManualMealLog() {
  const { addMeal } = useAppState();
  const { toast } = useToast();

  const form = useForm<ManualMealFormData>({
    resolver: zodResolver(ManualMealFormSchema),
    defaultValues: {
      foodItems: [{ name: '', quantity: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "foodItems",
  });

  function onSubmit(data: ManualMealFormData) {
    addMeal({ 
      foodItems: data.foodItems, 
      source: 'manual',
      imageHint: 'various food items' 
    });
    toast({
      title: "Meal Logged",
      description: "Your meal has been successfully logged manually.",
    });
    form.reset({ foodItems: [{ name: '', quantity: '' }] });
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-xl md:text-2xl">Log Meal Manually</CardTitle>
        <CardDescription>Enter the food items and their quantities for your meal.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4 md:space-y-6">
            {fields.map((field, index) => (
              <FormField
                key={field.id}
                control={form.control}
                name={`foodItems.${index}`}
                render={() => (
                  <FormItem>
                     <FoodItemInput
                        index={index}
                        register={form.register}
                        remove={remove}
                        fieldNamePrefix="foodItems"
                      />
                    <FormMessage>{form.formState.errors.foodItems?.[index]?.name?.message || form.formState.errors.foodItems?.[index]?.quantity?.message}</FormMessage>
                  </FormItem>
                )}
              />
            ))}
             {form.formState.errors.foodItems && typeof form.formState.errors.foodItems.message === 'string' && (
                <p className="text-sm font-medium text-destructive">{form.formState.errors.foodItems.message}</p>
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ name: '', quantity: '' })}
              className="mt-2 min-h-[44px] px-4"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Food Item
            </Button>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full min-h-[48px] text-base md:text-sm" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Logging Meal..." : "Log Meal"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
