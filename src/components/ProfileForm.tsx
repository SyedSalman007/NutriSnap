"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProfileFormData, ProfileFormSchema } from '@/lib/schemas';
import type { UserProfile } from '@/lib/types';
import { useAppState } from '@/contexts/AppStateContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export function ProfileForm() {
  const { profile, setProfile } = useAppState();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(ProfileFormSchema),
    defaultValues: {
      name: profile?.name || '',
      age: profile?.age || null,
      height: profile?.height || null,
      weight: profile?.weight || null,
      dietaryPreferences: profile?.dietaryPreferences || '',
    },
  });

  function onSubmit(data: ProfileFormData) {
    const newProfile: UserProfile = {
      name: data.name,
      age: data.age ?? null,
      height: data.height ?? null,
      weight: data.weight ?? null,
      dietaryPreferences: data.dietaryPreferences || '',
    };
    setProfile(newProfile);
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved.",
    });
    router.push('/'); 
  }

  return (
    <Card className="w-full max-w-lg mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-xl md:text-2xl">Your Profile</CardTitle>
        <CardDescription>Help us personalize your nutrition advice.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 md:space-y-8">
          <CardContent className="space-y-4 md:space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your name" {...field} className="h-12 md:h-10" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Years" {...field} value={field.value ?? ''} className="h-12 md:h-10" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Height (cm)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="cm" {...field} value={field.value ?? ''} className="h-12 md:h-10" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight (kg)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="kg" {...field} value={field.value ?? ''} className="h-12 md:h-10" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="dietaryPreferences"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dietary Preferences</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Vegetarian, Low-carb, Allergic to peanuts"
                      {...field}
                      className="resize-none min-h-[100px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full md:w-auto min-h-[48px] px-8 py-3 text-base md:text-sm" 
              disabled={form.formState.isSubmitting}
              size="lg"
            >
              {form.formState.isSubmitting ? "Saving..." : "Save Profile"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
