import { createContext, useContext } from 'react';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';

export interface AuthContextType {
  user: FirebaseAuthTypes.User | null;
  loading: boolean;
  isInitialized: boolean;
  signIn: (email: string, password: string) => Promise<FirebaseAuthTypes.UserCredential>;
  signUp: (email: string, password: string) => Promise<FirebaseAuthTypes.UserCredential>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<FirebaseAuthTypes.UserCredential>;
  signInWithApple: () => Promise<FirebaseAuthTypes.UserCredential>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 