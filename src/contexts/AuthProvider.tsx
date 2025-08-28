import React, { useEffect, useState } from 'react';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { router } from 'expo-router';
import * as authService from '../services/auth';
import { AuthContext, AuthContextType } from './AuthContext';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize auth state
  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = authService.subscribeToAuthChanges((user) => {
      setUser(user);
      setIsInitialized(true);

      // If user is not authenticated and not on auth screens, redirect to onboarding
      if (!user && !router.canGoBack()) {
        router.replace('/(auth)/onboarding');
      }
    });

    return unsubscribe;
  }, []);

  const handleAuthOperation = async <T extends any>(
    operation: () => Promise<T>
  ): Promise<T> => {
    setLoading(true);
    try {
      const result = await operation();
      return result;
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    isInitialized,
    signIn: (email, password) => handleAuthOperation(() => authService.signIn(email, password)),
    signUp: (email, password) => handleAuthOperation(() => authService.signUp(email, password)),
    signOut: () => handleAuthOperation(authService.signOut),
    signInWithGoogle: () => handleAuthOperation(authService.signInWithGoogle),
    signInWithApple: () => handleAuthOperation(authService.signInWithApple),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
} 