"use client";

import { useState } from 'react';
import { useAppState } from '@/contexts/AppStateContext';
import { getPersonalizedRecommendations, PersonalizedRecommendationsInput } from '@/ai/flows/personalized-recommendations';
import type { PersonalizedRecommendation } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export function RecommendationSection() {
  const { profile, meals } = useAppState();
  const [recommendations, setRecommendations] = useState<PersonalizedRecommendation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGetRecommendations = async () => {
    if (!profile || !profile.age || !profile.height || !profile.weight) {
      toast({
        title: "Profile Incomplete",
        description: "Please complete your age, height, and weight in your profile to get personalized recommendations.",
        variant: "destructive",
      });
      setError("Profile incomplete. Please fill in your age, height, and weight.");
      return;
    }

    if (meals.length === 0) {
       toast({
        title: "No Meals Logged",
        description: "Please log some meals first to get personalized recommendations.",
        variant: "destructive",
      });
      setError("No meals logged. Please log some meals first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setRecommendations(null);

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
      setRecommendations(result);
      toast({
        title: "Recommendations Ready!",
        description: "We've generated personalized nutrition advice for you.",
      });
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
      <CardHeader>
        <CardTitle className="font-headline text-xl flex items-center">
          <Sparkles className="h-6 w-6 mr-2 text-primary" />
          Personalized Nutrition Insights
        </CardTitle>
        <CardDescription>Get AI-powered recommendations based on your profile and logged meals.</CardDescription>
      </CardHeader>
      <CardContent>
        {!profile ? (
          <div className="text-center p-4 border border-dashed rounded-md">
            <AlertTriangle className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-muted-foreground mb-3">Please create your profile to unlock personalized recommendations.</p>
            <Button asChild variant="outline">
              <Link href="/profile">Create Profile</Link>
            </Button>
          </div>
        ) : (
          <Button onClick={handleGetRecommendations} disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Insights...
              </>
            ) : (
              "Get My Recommendations"
            )}
          </Button>
        )}

        {error && <p className="mt-4 text-sm text-destructive text-center">{error}</p>}

        {recommendations && (
          <div className="mt-6 space-y-4">
            <div>
              <h3 className="font-semibold text-lg text-foreground mb-2">Feedback on Your Diet:</h3>
              <p className="text-sm text-foreground/80 whitespace-pre-wrap bg-muted p-3 rounded-md">{recommendations.feedback}</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-foreground mb-2">Recommendations:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-foreground/80 bg-muted p-3 rounded-md">
                {recommendations.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
