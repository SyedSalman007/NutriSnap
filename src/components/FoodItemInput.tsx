"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { UseFieldArrayRemove, UseFormRegister } from "react-hook-form";

interface FoodItemInputProps {
  index: number;
  register: UseFormRegister<any>; // Adjust type as per your form values
  remove: UseFieldArrayRemove;
  fieldNamePrefix: string; // e.g., "foodItems"
}

export function FoodItemInput({ index, register, remove, fieldNamePrefix }: FoodItemInputProps) {
  return (
    <div className="flex items-center gap-2 p-3 border rounded-md shadow-sm bg-card">
      <Input
        {...register(`${fieldNamePrefix}.${index}.name`)}
        placeholder={`Food Item ${index + 1}`}
        className="flex-grow"
      />
      <Input
        {...register(`${fieldNamePrefix}.${index}.quantity`)}
        placeholder="Quantity (e.g., 1 cup)"
        className="w-1/3"
      />
      <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} aria-label="Remove food item">
        <X className="h-4 w-4 text-destructive" />
      </Button>
    </div>
  );
}
