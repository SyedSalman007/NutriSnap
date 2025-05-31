"use client";

import { useAppState } from "@/contexts/AppStateContext";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export function Greeting() {
  const { profile, isLoading } = useAppState();

  if (isLoading) {
    return (
      <div className="h-24 animate-pulse bg-primary/5 rounded-lg flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Loading greeting...</p>
      </div>
    );
  }

  const greetingName = profile?.name || "Guest";

  return (
    <Card className="bg-primary/10 border-primary/30 shadow-md">
      <CardHeader className="py-4 md:py-6">
        <CardTitle className="font-headline text-xl md:text-2xl lg:text-3xl text-primary-foreground">
          Welcome to NutriSnap, {greetingName}!
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4 md:pb-6">
        <p className="text-sm md:text-base text-foreground/80">
          Ready to take control of your nutrition? Log your meals and get personalized insights.
        </p>
      </CardContent>
    </Card>
  );
}
