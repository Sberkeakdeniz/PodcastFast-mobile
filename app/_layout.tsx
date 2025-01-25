import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { AuthProvider } from '../src/contexts/auth';
import { Platform } from "react-native"
import Superwall from "@superwall/react-native-superwall"
import { RCPurchaseController } from "../src/config/RCPurchaseController"

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    const apiKey = Platform.OS === "ios" ? "pk_3f3afac07a7df7216e6a5aadfe56a087232befdf5bef681c" : "MY_SUPERWALL_ANDROID_API_KEY"
    const purchaseController = new RCPurchaseController()
    
    Superwall.configure(apiKey, undefined, purchaseController)
    purchaseController.configureAndSyncSubscriptionStatus()
  }, [])

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <ThemeProvider value={DefaultTheme}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}
