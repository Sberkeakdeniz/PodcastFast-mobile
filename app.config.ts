import 'dotenv/config';

export default {
  expo: {
    name: "podcastfast-mobile",
    slug: "podcastfast-mobile",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      googleServicesFile: "./GoogleService-Info.plist",
      bundleIdentifier: "com.seralpberke.podcastfast",
      config: {
        googleSignIn: {
          reservedClientId: "com.googleusercontent.apps.702703998338-nc8vdv8kk8b14hf1lsit846kg6lo2guh"
        }
      }
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          "image": "./assets/images/splash-icon.png",
          "imageWidth": 200,
          "resizeMode": "contain",
          "backgroundColor": "#ffffff"
        }
      ],
      "@react-native-firebase/app",
      ["@react-native-firebase/auth",
        {
          "skipClientIdValidation": true,
          "disableUrlSchemes": true
        }
      ],
      [
        "expo-build-properties",
        {
          "ios": {
            "useFrameworks": "static"
          }
        }
      ]
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      openaiApiKey: process.env.OPENAI_API_KEY
    }
  }
}; 