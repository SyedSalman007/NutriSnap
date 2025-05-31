"use client";

import type { UserProfile, LoggedMeal, AppState } from '@/lib/types';
import useLocalStorage from '@/hooks/useLocalStorage';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface AppContextType extends AppState {
  setProfile: (profile: UserProfile | null) => void;
  addMeal: (meal: Omit<LoggedMeal, 'id' | 'date'>) => void;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useLocalStorage<UserProfile | null>('nutrisnap-profile', null);
  const [meals, setMeals] = useLocalStorage<LoggedMeal[]>('nutrisnap-meals', []);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This effect helps ensure that local storage is loaded before rendering dependent components.
    // For useLocalStorage, the initial read is synchronous if window is available.
    // However, to be safe and to simulate potential async loading for future DB integration:
    setIsLoading(false); 
  }, []);

  const addMeal = (newMealData: Omit<LoggedMeal, 'id' | 'date'>) => {
    const mealWithIdAndDate: LoggedMeal = {
      ...newMealData,
      id: Date.now().toString(), // Simple ID generation
      date: new Date().toISOString(),
    };
    setMeals(prevMeals => [mealWithIdAndDate, ...prevMeals]);
  };
  
  const contextValue: AppContextType = {
    profile,
    setProfile,
    meals,
    addMeal,
    isLoading,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
}
