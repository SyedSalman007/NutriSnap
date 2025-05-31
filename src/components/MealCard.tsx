
import type { LoggedMeal } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Utensils, Camera } from "lucide-react";
import Image from "next/image";
import { format } from 'date-fns';
import { cn } from "@/lib/utils";

interface MealCardProps {
  meal: LoggedMeal;
  isSelected: boolean;
  onMealSelect: (mealId: string, selected: boolean) => void;
  showCheckbox: boolean;
}

export function MealCard({ meal, isSelected, onMealSelect, showCheckbox }: MealCardProps) {
  const formattedDate = format(new Date(meal.date), "MMMM d, yyyy 'at' h:mm a");

  const handleCardClick = () => {
    if (showCheckbox) {
      onMealSelect(meal.id, !isSelected);
    }
  };

  return (
    <Card 
      className={cn(
        "shadow-lg overflow-hidden flex flex-col h-full transition-all",
        showCheckbox && "cursor-pointer hover:shadow-primary/20",
        isSelected && "ring-2 ring-primary border-primary"
      )}
      onClick={handleCardClick}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex-grow">
            <CardTitle className="font-headline text-lg md:text-xl">Meal Logged</CardTitle>
            <CardDescription className="text-xs md:text-sm">{formattedDate}</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            {meal.source === 'image' ? (
              <Camera className="h-5 w-5 text-primary" />
            ) : (
              <Utensils className="h-5 w-5 text-primary" />
            )}
            {showCheckbox && (
              <Checkbox
                id={`select-meal-${meal.id}`}
                checked={isSelected}
                onCheckedChange={(checked) => {
                  // Prevent click propagation if clicking directly on checkbox
                  // The card click already handles the logic
                }}
                aria-label={`Select meal logged on ${formattedDate}`}
                className="h-5 w-5 md:h-6 md:w-6"
              />
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        {(meal.imageUrl || meal.source === 'manual' || meal.source === 'image') && (
          <div className="mb-4 rounded-md overflow-hidden aspect-video relative bg-muted flex items-center justify-center">
            <Image 
              src={meal.imageUrl || `https://placehold.co/300x200.png`}
              alt={meal.imageUrl ? "Logged meal" : "Meal placeholder"}
              layout="fill" 
              objectFit="cover"
              className={!meal.imageUrl ? "opacity-50" : ""}
              data-ai-hint={meal.imageHint || (meal.source === 'manual' ? "food items" : "food meal")}
              loading="lazy"
            />
          </div>
        )}
        <ul className="space-y-1 text-sm list-disc list-inside text-foreground/90">
          {meal.foodItems.map((item, index) => (
            <li key={index}>
              <strong className="font-medium">{item.name}:</strong> {item.quantity}
            </li>
          ))}
        </ul>
      </CardContent>
      { meal.foodItems.length === 0 && (
        <CardFooter>
            <p className="text-sm text-muted-foreground">No food items logged for this meal.</p>
        </CardFooter>
      )}
    </Card>
  );
}
