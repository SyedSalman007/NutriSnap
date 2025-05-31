"use client";

import { useAppState } from "@/contexts/AppStateContext";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export function Greeting() {
  const { profile, isLoading } = useAppState();

  if (isLoading) {
    return <p className="text-lg text-muted-foreground">Loading greeting...</p>;
  }

  const greetingName = profile?.name || "Guest";

  return (
    <Card className="bg-primary/10 border-primary/30 shadow-md">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-primary-foreground">
          Welcome to NutriSnap, {greetingName}!
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-foreground/80">
          Ready to take control of your nutrition? Log your meals and get personalized insights.
        </p>
      </CardContent>
    </Card>
  );
}
