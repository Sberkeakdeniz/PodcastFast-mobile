import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import { router } from 'expo-router';

// Custom error class for auth errors
export class AuthError extends Error {
  code: string;
  
  constructor(message: string, code: string) {
    super(message);
    this.code = code;
    this.name = 'AuthError';
  }
}

// Error message mapping
const ERROR_MESSAGES: Record<string, string> = {
  'auth/account-exists-with-different-credential': 'An account already exists with the same email address but different sign-in credentials.',
  'auth/invalid-email': 'The email address is invalid.',
  'auth/user-disabled': 'This account has been disabled.',
  'auth/user-not-found': 'No account found with this email.',
  'auth/wrong-password': 'Incorrect password.',
  'auth/email-already-in-use': 'This email is already registered.',
  'auth/weak-password': 'The password is too weak.',
  'auth/invalid-credential': 'The provided credential is invalid.',
  'auth/operation-not-allowed': 'This operation is not allowed.',
  'auth/popup-closed-by-user': 'The sign-in popup was closed before completing the operation.',
};

// Helper function to handle auth errors
const handleAuthError = (error: any): never => {
  console.error('Auth Error:', error);
  
  const message = ERROR_MESSAGES[error.code] || error.message || 'An unknown error occurred';
  throw new AuthError(message, error.code || 'unknown');
};

export const signIn = async (email: string, password: string): Promise<FirebaseAuthTypes.UserCredential> => {
  try {
    return await auth().signInWithEmailAndPassword(email, password);
  } catch (error: any) {
    throw handleAuthError(error);
  }
};

export const signUp = async (email: string, password: string): Promise<FirebaseAuthTypes.UserCredential> => {
  try {
    return await auth().createUserWithEmailAndPassword(email, password);
  } catch (error: any) {
    throw handleAuthError(error);
  }
};

export const signInWithGoogle = async (): Promise<FirebaseAuthTypes.UserCredential> => {
  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const signInResult = await GoogleSignin.signIn();
    const { idToken } = await GoogleSignin.getTokens();
    
    if (!idToken) {
      throw new AuthError('No ID token found', 'auth/no-id-token');
    }

    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    return await auth().signInWithCredential(googleCredential);
  } catch (error: any) {
    throw handleAuthError(error);
  }
};

export const signInWithApple = async (): Promise<FirebaseAuthTypes.UserCredential> => {
  try {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    if (!appleAuthRequestResponse.identityToken) {
      throw new AuthError('No identity token', 'auth/no-identity-token');
    }

    const { identityToken, nonce } = appleAuthRequestResponse;
    const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce);
    return await auth().signInWithCredential(appleCredential);
  } catch (error: any) {
    throw handleAuthError(error);
  }
};

export const signOut = async (): Promise<void> => {
  try {
    // Sign out from Firebase
    await auth().signOut();
    
    // Sign out from Google if user was signed in with Google
    try {
      await GoogleSignin.signOut();
    } catch (error) {
      // Ignore error if user wasn't signed in with Google
      console.log('Google Sign Out Error (non-critical):', error);
    }
    
    router.replace('/(auth)/onboarding');
  } catch (error: any) {
    throw handleAuthError(error);
  }
};

export const subscribeToAuthChanges = (
  onAuthStateChanged: (user: FirebaseAuthTypes.User | null) => void
): (() => void) => {
  return auth().onAuthStateChanged(onAuthStateChanged);
}; 