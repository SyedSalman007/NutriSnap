"use client";

import { useState, ChangeEvent } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ManualMealFormData, ManualMealFormSchema } from '@/lib/schemas'; 
import { useAppState } from '@/contexts/AppStateContext';
import { identifyFoodItems, IdentifyFoodItemsInput } from '@/ai/flows/identify-food-items';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { FoodItemInput } from './FoodItemInput';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { UploadCloud, PlusCircle, Loader2 } from 'lucide-react';

export function ImageMealLog() {
  const { addMeal } = useAppState();
  const { toast } = useToast();
  const [photoDataUri, setPhotoDataUri] = useState<string | null>(null);
  const [isIdentifying, setIsIdentifying] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const form = useForm<ManualMealFormData>({ 
    resolver: zodResolver(ManualMealFormSchema),
    defaultValues: {
      foodItems: [],
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "foodItems",
  });

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoDataUri(e.target?.result as string);
        replace([]); 
      };
      reader.readAsDataURL(file);
    } else {
      setPhotoDataUri(null);
      setFileName(null);
      replace([]);
    }
  };

  const handleIdentifyFood = async () => {
    if (!photoDataUri) {
      toast({ title: "No Image", description: "Please select an image first.", variant: "destructive" });
      return;
    }
    setIsIdentifying(true);
    form.reset({ foodItems: [] }); 

    try {
      const input: IdentifyFoodItemsInput = { photoDataUri };
      const result = await identifyFoodItems(input);
      
      if (result.foodItems && result.foodItems.length > 0) {
        const newFoodItems = result.foodItems.map(item => ({ name: item, quantity: '' }));
        replace(newFoodItems); 
        toast({ title: "Food Identified!", description: "Please review and add quantities." });
      } else {
        toast({ title: "No Food Identified", description: "Could not identify food items. Please try manual entry or a different image." });
        append({ name: '', quantity: '' }); 
      }
    } catch (error) {
      console.error("Error identifying food:", error);
      toast({ title: "Identification Error", description: "An error occurred during food identification.", variant: "destructive" });
      append({ name: '', quantity: '' });
    } finally {
      setIsIdentifying(false);
    }
  };

  function onSubmit(data: ManualMealFormData) {
    if (!photoDataUri) {
        toast({ title: "Error", description: "Missing image data.", variant: "destructive" });
        return;
    }
    addMeal({ 
      foodItems: data.foodItems, 
      source: 'image', 
      imageUrl: photoDataUri,
      imageHint: data.foodItems.map(fi => fi.name).slice(0,2).join(' ') || 'food meal'
    });
    toast({
      title: "Meal Logged",
      description: "Your meal from the image has been successfully logged.",
    });
    form.reset({ foodItems: [] });
    setPhotoDataUri(null);
    setFileName(null);
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-xl md:text-2xl">Log Meal with Image</CardTitle>
        <CardDescription>Upload an image of your meal to identify food items automatically.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4 md:space-y-6">
            <div>
              <label htmlFor="meal-image-upload" className="block text-sm font-medium text-foreground mb-1">
                Upload Meal Photo
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md border-border hover:border-primary transition-colors min-h-[150px] md:min-h-[200px]">
                <div className="space-y-1 text-center flex flex-col items-center justify-center">
                  {photoDataUri ? (
                    <Image src={photoDataUri} alt="Meal preview" width={160} height={160} className="mx-auto h-24 w-24 md:h-32 md:w-32 object-cover rounded-md" loading="lazy"/>
                  ) : (
                    <UploadCloud className="mx-auto h-10 w-10 md:h-12 md:w-12 text-muted-foreground" />
                  )}
                  <div className="flex text-sm text-muted-foreground">
                    <label
                      htmlFor="meal-image-upload-input"
                      className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-ring p-2" // Added padding for touch target
                    >
                      <span>Upload a file</span>
                      <Input id="meal-image-upload-input" name="meal-image-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                    </label>
                    <p className="pl-1 self-center">or drag and drop</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{fileName || "PNG, JPG, GIF up to 10MB"}</p>
                </div>
              </div>
            </div>

            {photoDataUri && (
              <Button type="button" onClick={handleIdentifyFood} disabled={isIdentifying || !photoDataUri} className="w-full min-h-[48px] text-base md:text-sm">
                {isIdentifying ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isIdentifying ? "Identifying..." : "Identify Food Items"}
              </Button>
            )}

            {fields.length > 0 && <p className="text-sm font-medium text-foreground">Identified Items (edit as needed):</p>}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
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
            </div>
             {form.formState.errors.foodItems && typeof form.formState.errors.foodItems.message === 'string' && (
                <p className="text-sm font-medium text-destructive">{form.formState.errors.foodItems.message}</p>
            )}

            {fields.length > 0 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ name: '', quantity: '' })}
                className="mt-2 min-h-[44px] px-4"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Another Item
              </Button>
            )}
          </CardContent>
          {fields.length > 0 && (
            <CardFooter>
              <Button type="submit" className="w-full min-h-[48px] text-base md:text-sm" disabled={form.formState.isSubmitting || fields.length === 0}>
                {form.formState.isSubmitting ? "Logging Meal..." : "Log Identified Meal"}
              </Button>
            </CardFooter>
          )}
        </form>
      </Form>
    </Card>
  );
}
