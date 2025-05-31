"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { UseFieldArrayRemove, UseFormRegister } from "react-hook-form";

interface FoodItemInputProps {
  index: number;
  register: UseFormRegister<any>; 
  remove: UseFieldArrayRemove;
  fieldNamePrefix: string; 
}

export function FoodItemInput({ index, register, remove, fieldNamePrefix }: FoodItemInputProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-2 p-3 border rounded-md shadow-sm bg-card">
      <Input
        {...register(`${fieldNamePrefix}.${index}.name`)}
        placeholder={`Food Item ${index + 1}`}
        className="flex-grow w-full sm:w-auto h-12 md:h-10"
      />
      <Input
        {...register(`${fieldNamePrefix}.${index}.quantity`)}
        placeholder="Quantity (e.g., 1 cup)"
        className="w-full sm:w-1/3 h-12 md:h-10"
      />
      <Button 
        type="button" 
        variant="ghost" 
        size="icon" 
        onClick={() => remove(index)} 
        aria-label="Remove food item"
        className="h-10 w-10 md:h-9 md:w-9 flex-shrink-0"
      >
        <X className="h-5 w-5 md:h-4 md:w-4 text-destructive" />
      </Button>
    </div>
  );
}
