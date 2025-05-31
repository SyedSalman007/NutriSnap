
"use client";

import { useState } from 'react';
import { useAppState } from '@/contexts/AppStateContext';
import { getPersonalizedRecommendations, PersonalizedRecommendationsInput } from '@/ai/flows/personalized-recommendations';
import type { PersonalizedRecommendation, RecommendedDish } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, AlertTriangle, Salad, Utensils } from 'lucide-react';
import Link from 'next/link';

export function RecommendationSection() {
  const { profile, meals } = useAppState();
  const [recommendationsOutput, setRecommendationsOutput] = useState<PersonalizedRecommendation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGetRecommendations = async () => {
    if (!profile || profile.age === null || profile.height === null || profile.weight === null) {
      toast({
        title: "Profile Incomplete",
        description: "Please complete your age, height, and weight in your profile to get personalized recommendations.",
        variant: "destructive",
      });
      setError("Profile incomplete. Please fill in your age, height, and weight.");
      return;
    }

    // Though the prompt is updated to handle no meals, we can still give a specific UI message.
    // The AI will also respond if meals are empty, this is for a quicker UI feedback.
    if (meals.length === 0) {
       toast({
        title: "No Meals Logged",
        description: "Log some meals (which act as ingredients) to get dish suggestions.",
        variant: "destructive",
      });
      // We can still attempt to get general feedback if the profile is complete.
      // setError("No meals logged. Please log some meals first for dish suggestions.");
      // return; // Allow to proceed for general feedback if profile is complete
    }

    setIsLoading(true);
    setError(null);
    setRecommendationsOutput(null);

    const input: PersonalizedRecommendationsInput = {
      userProfile: {
        age: profile.age,
        height: profile.height,
        weight: profile.weight,
        dietaryPreferences: profile.dietaryPreferences || 'Not specified',
      },
      loggedMeals: meals.map(meal => ({
        foodItems: meal.foodItems.map(fi => fi.name),
        quantity: meal.foodItems.map(fi => fi.quantity),
      })),
    };

    try {
      const result = await getPersonalizedRecommendations(input);
      setRecommendationsOutput(result);
      if (result.recommendations.length > 0 || result.feedback) {
        toast({
          title: "Insights Ready!",
          description: "We've generated personalized nutrition advice for you.",
        });
      } else {
         toast({
          title: "No Specific Insights Yet",
          description: "We couldn't generate specific recommendations with the current data. Check the feedback for more details.",
          variant: "default"
        });
      }
    } catch (err) {
      console.error("Error getting recommendations:", err);
      setError("Failed to fetch recommendations. Please try again.");
      toast({
        title: "Error",
        description: "Could not fetch recommendations. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="p-4 md:p-6">
        <CardTitle className="font-headline text-lg md:text-xl flex items-center">
          <Sparkles className="h-5 w-5 md:h-6 md:w-6 mr-2 text-primary" />
          Personalized Nutrition Insights
        </CardTitle>
        <CardDescription className="text-sm md:text-base">Get AI-powered feedback and dish suggestions based on your profile and logged meals (as ingredients).</CardDescription>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        {!profile || profile.age === null || profile.height === null || profile.weight === null ? (
          <div className="text-center p-4 border border-dashed rounded-md">
            <AlertTriangle className="mx-auto h-8 w-8 md:h-10 md:w-10 text-muted-foreground mb-2" />
            <p className="text-muted-foreground mb-3 text-sm md:text-base">Please complete your profile (name, age, height, weight) to unlock personalized recommendations.</p>
            <Button asChild variant="outline" size="lg" className="min-h-[48px] w-full sm:w-auto">
              <Link href="/profile">Complete Profile</Link>
            </Button>
          </div>
        ) : (
          <Button onClick={handleGetRecommendations} disabled={isLoading} className="w-full min-h-[48px] text-base md:text-sm" size="lg">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Insights...
              </>
            ) : (
              "Get My Nutrition Insights"
            )}
          </Button>
        )}

        {error && <p className="mt-4 text-sm text-destructive text-center">{error}</p>}

        {recommendationsOutput && (
          <div className="mt-6 space-y-6">
            {recommendationsOutput.feedback && (
              <div>
                <h3 className="font-semibold text-base md:text-lg text-foreground mb-2 flex items-center">
                  <Salad className="h-5 w-5 mr-2 text-primary/80" />
                  Feedback on Your Diet:
                </h3>
                <p className="text-sm md:text-base text-foreground/80 whitespace-pre-wrap bg-muted p-3 rounded-md shadow-sm">{recommendationsOutput.feedback}</p>
              </div>
            )}
            
            {recommendationsOutput.recommendations && recommendationsOutput.recommendations.length > 0 && (
              <div>
                <h3 className="font-semibold text-base md:text-lg text-foreground mb-3 flex items-center">
                  <Utensils className="h-5 w-5 mr-2 text-primary/80" />
                  Meal & Dish Suggestions:
                </h3>
                <ul className="space-y-4">
                  {recommendationsOutput.recommendations.map((rec, index) => (
                    <li key={index} className="p-3 md:p-4 border rounded-lg shadow-sm bg-card hover:shadow-md transition-shadow">
                      <h4 className="font-headline font-semibold text-md md:text-lg text-primary">{rec.dishName}</h4>
                      <p className="text-xs md:text-sm text-muted-foreground mt-0.5 mb-1.5">
                        Estimated Calories: <span className="font-medium text-foreground">{rec.calories} kcal</span>
                      </p>
                      <p className="text-sm md:text-base text-foreground/90">{rec.healthRecommendation}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {recommendationsOutput.recommendations && recommendationsOutput.recommendations.length === 0 && recommendationsOutput.feedback && meals.length > 0 && (
                 <p className="mt-4 text-sm text-center text-muted-foreground">
                    Based on your current ingredients and profile, no specific new dish suggestions could be generated at this time. Check the feedback above for general advice.
                 </p>
            )}
             {meals.length === 0 && profile && profile.age && profile.height && profile.weight && (
                 <p className="mt-4 text-sm text-center text-muted-foreground">
                    Log some meals (which provide ingredients) to get specific dish suggestions.
                 </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
