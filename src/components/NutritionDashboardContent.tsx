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
      <div className="flex justify-center items-center h-64">
        <Leaf className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-xl text-muted-foreground">Loading your NutriSnap dashboard...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <Greeting />

      {!profile && (
        <Card className="shadow-md border-primary/30">
          <CardHeader>
            <CardTitle className="font-headline">Get Started with NutriSnap</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-foreground/80">
              Welcome to NutriSnap! To get personalized nutrition advice and track your meals effectively, please start by creating your profile.
            </p>
            <Button asChild>
              <Link href="/profile">Create Your Profile</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <RecommendationSection />

      <div>
        <h2 className="text-2xl font-headline font-semibold mb-4 text-foreground">Your Recent Meals</h2>
        {meals.length === 0 ? (
          <Card className="text-center p-8 border-dashed shadow-sm">
            <CardContent>
              <Leaf className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">You haven't logged any meals yet.</p>
              <Button asChild variant="outline">
                <Link href="/log-meal">Log Your First Meal</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <ScrollArea className="h-[500px] pr-4"> {/* Adjust height as needed */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
