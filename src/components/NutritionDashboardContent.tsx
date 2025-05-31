"use client";

import { useAppState } from '@/contexts/AppStateContext';
import { Greeting } from './Greeting';
import { MealCard } from './MealCard';
import { RecommendationSection } from './RecommendationSection';
import { Button } from './ui/button';
import Link from 'next/link';
import { ScrollArea } from './ui/scroll-area';
import { Leaf } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


export function NutritionDashboardContent() {
  const { meals, isLoading, profile } = useAppState();

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4 text-center px-4">
        <Leaf className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-0 md:ml-4 text-lg md:text-xl text-muted-foreground">Loading your NutriSnap dashboard...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 md:space-y-8">
      <Greeting />

      {!profile && (
        <Card className="shadow-md border-primary/30">
          <CardHeader>
            <CardTitle className="font-headline text-lg md:text-xl lg:text-2xl">Get Started with NutriSnap</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm md:text-base text-foreground/80">
              Welcome to NutriSnap! To get personalized nutrition advice and track your meals effectively, please start by creating your profile.
            </p>
            <Button asChild size="lg" className="min-h-[48px] w-full sm:w-auto">
              <Link href="/profile">Create Your Profile</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <RecommendationSection />

      <div>
        <h2 className="text-xl md:text-2xl font-headline font-semibold mb-4 text-foreground">Your Recent Meals</h2>
        {meals.length === 0 ? (
          <Card className="text-center p-6 md:p-8 border-dashed shadow-sm">
            <CardContent className="flex flex-col items-center">
              <Leaf className="mx-auto h-10 w-10 md:h-12 md:w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4 text-sm md:text-base">You haven't logged any meals yet.</p>
              <Button asChild variant="outline" size="lg" className="min-h-[48px] w-full sm:w-auto">
                <Link href="/log-meal">Log Your First Meal</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <ScrollArea className="h-[500px] md:h-[600px] pr-3 md:pr-4 -mr-3 md:-mr-4"> 
            <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {meals.map(meal => (
                <MealCard key={meal.id} meal={meal} />
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
}
