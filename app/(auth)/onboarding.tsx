import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, Platform, KeyboardAvoidingView, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useAuth } from '../../src/contexts/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

// Initialize Google Sign-In
GoogleSignin.configure({
  webClientId: '', // Add your web client ID here
});

type Step = 'welcome' | 'email' | 'password' | 'experience' | 'podcastType' | 'birthdate' | 'gender';

export default function Onboarding() {
  const { signUp } = useAuth();
  const [currentStep, setCurrentStep] = useState<Step>('welcome');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [experience, setExperience] = useState<string>('');
  const [podcastType, setPodcastType] = useState<string>('');
  const [otherPodcastType, setOtherPodcastType] = useState<string>('');
  const [birthdate, setBirthdate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [gender, setGender] = useState<string>('');

  const handleEmailSignUp = async () => {
    try {
      const userCredential = await signUp(email, password);
      const user = userCredential.user;
      
      // Update user profile with additional information
      await user.updateProfile({
        displayName: email.split('@')[0], // Using email prefix as display name
      });

      // Store additional user data (birthdate, gender) in your database
      // You can implement this part based on your database structure

      router.push('/(tabs)');
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('Error', 'That email address is already in use!');
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert('Error', 'That email address is invalid!');
      } else {
        Alert.alert('Error', error.message);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    // Implement Google Sign-In
    Alert.alert('Coming Soon', 'Google sign in will be available soon.');
  };

  const handleFacebookSignIn = async () => {
    // Implement Facebook sign in
    Alert.alert('Coming Soon', 'Facebook sign in will be available soon.');
  };

  const handleAppleSignIn = async () => {
    // Implement Apple sign in
    Alert.alert('Coming Soon', 'Apple sign in will be available soon.');
  };

  const handleNext = () => {
    switch (currentStep) {
      case 'welcome':
        setCurrentStep('email');
        break;
      case 'email':
        setCurrentStep('password');
        break;
      case 'password':
        setCurrentStep('experience');
        break;
      case 'experience':
        setCurrentStep('podcastType');
        break;
      case 'podcastType':
        setCurrentStep('birthdate');
        break;
      case 'birthdate':
        setCurrentStep('gender');
        break;
      case 'gender':
        handleEmailSignUp();
        break;
    }
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'email':
        setCurrentStep('welcome');
        break;
      case 'password':
        setCurrentStep('email');
        break;
      case 'experience':
        setCurrentStep('password');
        break;
      case 'podcastType':
        setCurrentStep('experience');
        break;
      case 'birthdate':
        setCurrentStep('podcastType');
        break;
      case 'gender':
        setCurrentStep('birthdate');
        break;
    }
  };

  const renderWelcomeScreen = () => (
    <View style={styles.stepContainer}>
      <View style={styles.welcomeContent}>
        <Text style={styles.title}>Create your podcast</Text>
        <Text style={styles.subtitle}>Free on PodcastFast</Text>
        
        <TouchableOpacity style={styles.signupButton} onPress={handleNext}>
          <Text style={styles.signupButtonText}>Sign up free</Text>
        </TouchableOpacity>

        <View style={styles.socialButtons}>
          <TouchableOpacity 
            style={styles.socialButton}
            onPress={handleGoogleSignIn}
          >
            <Ionicons name="logo-google" size={20} color="#fff" />
            <Text style={styles.socialButtonText}>Continue with Google</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.socialButton}
            onPress={handleFacebookSignIn}
          >
            <Ionicons name="logo-facebook" size={20} color="#fff" />
            <Text style={styles.socialButtonText}>Continue with Facebook</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.socialButton}
            onPress={handleAppleSignIn}
          >
            <Ionicons name="logo-apple" size={20} color="#fff" />
            <Text style={styles.socialButtonText}>Continue with Apple</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/login')}>
            <Text style={styles.loginLink}>Log in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderEmailScreen = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>What's your email?</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        placeholderTextColor="#666"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Text style={styles.helperText}>You'll need to confirm this email later.</Text>
      <TouchableOpacity 
        style={[styles.nextButton, !email && styles.nextButtonDisabled]}
        onPress={handleNext}
        disabled={!email}
      >
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );

  const renderPasswordScreen = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Create a password</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Create a password"
          placeholderTextColor="#666"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity 
          onPress={() => setShowPassword(!showPassword)}
          style={styles.showPasswordButton}
        >
          <Ionicons 
            name={showPassword ? "eye-off-outline" : "eye-outline"} 
            size={24} 
            color="#666" 
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.helperText}>Use at least 10 characters.</Text>
      <TouchableOpacity 
        style={[styles.nextButton, password.length < 10 && styles.nextButtonDisabled]}
        onPress={handleNext}
        disabled={password.length < 10}
      >
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );

  const renderExperienceScreen = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>How long have you been creating podcasts?</Text>
      {[
        'Just starting out',
        '6 months to 1 year',
        '1-3 years',
        'More than 3 years'
      ].map((option) => (
        <TouchableOpacity 
          key={option}
          style={[styles.experienceOption, experience === option && styles.experienceOptionSelected]}
          onPress={() => setExperience(option)}
        >
          <Text style={[styles.experienceOptionText, experience === option && styles.experienceOptionTextSelected]}>
            {option}
          </Text>
          {experience === option && (
            <Ionicons name="checkmark-outline" size={24} color="#fff" />
          )}
        </TouchableOpacity>
      ))}
      <TouchableOpacity 
        style={[styles.nextButton, !experience && styles.nextButtonDisabled]}
        onPress={handleNext}
        disabled={!experience}
      >
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );

  const renderPodcastTypeScreen = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>What type of podcasts do you create?</Text>
      {[
        'Science',
        'News',
        'Sports',
        'Technology',
        'Games',
        'Other'
      ].map((option) => (
        <TouchableOpacity 
          key={option}
          style={[styles.podcastTypeOption, podcastType === option && styles.podcastTypeOptionSelected]}
          onPress={() => {
            setPodcastType(option);
            if (option !== 'Other') {
              setOtherPodcastType('');
            }
          }}
        >
          <Text style={[styles.podcastTypeOptionText, podcastType === option && styles.podcastTypeOptionTextSelected]}>
            {option}
          </Text>
          {podcastType === option && (
            <Ionicons name="checkmark-outline" size={24} color="#fff" />
          )}
        </TouchableOpacity>
      ))}
      
      {podcastType === 'Other' && (
        <TextInput
          style={[styles.input, { marginTop: 12 }]}
          placeholder="Please specify your podcast type"
          placeholderTextColor="#666"
          value={otherPodcastType}
          onChangeText={setOtherPodcastType}
        />
      )}

      <TouchableOpacity 
        style={[
          styles.nextButton, 
          (!podcastType || (podcastType === 'Other' && !otherPodcastType)) && styles.nextButtonDisabled
        ]}
        onPress={handleNext}
        disabled={!podcastType || (podcastType === 'Other' && !otherPodcastType)}
      >
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );

  const renderBirthdateScreen = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>What's your date of birth?</Text>
      <TouchableOpacity 
        style={styles.input}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.dateText}>
          {birthdate.toLocaleDateString('en-US', { 
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          })}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={birthdate}
          mode="date"
          display="spinner"
          onChange={(event: DateTimePickerEvent, date?: Date) => {
            setShowDatePicker(false);
            if (date) setBirthdate(date);
          }}
        />
      )}
      <TouchableOpacity 
        style={styles.nextButton}
        onPress={handleNext}
      >
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );

  const renderGenderScreen = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>What's your gender?</Text>
      {['Female', 'Male', 'Other', 'Prefer not to say'].map((option) => (
        <TouchableOpacity 
          key={option}
          style={[styles.genderOption, gender === option && styles.genderOptionSelected]}
          onPress={() => setGender(option)}
        >
          <Text style={[styles.genderOptionText, gender === option && styles.genderOptionTextSelected]}>
            {option}
          </Text>
          {gender === option && (
            <Ionicons name="checkmark-outline" size={24} color="#fff" />
          )}
        </TouchableOpacity>
      ))}
      <TouchableOpacity 
        style={[styles.nextButton, !gender && styles.nextButtonDisabled]}
        onPress={handleNext}
        disabled={!gender}
      >
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'welcome':
        return renderWelcomeScreen();
      case 'email':
        return renderEmailScreen();
      case 'password':
        return renderPasswordScreen();
      case 'experience':
        return renderExperienceScreen();
      case 'podcastType':
        return renderPodcastTypeScreen();
      case 'birthdate':
        return renderBirthdateScreen();
      case 'gender':
        return renderGenderScreen();
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        {currentStep !== 'welcome' && (
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        )}
        {renderCurrentStep()}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  content: {
    flex: 1,
  },
  backButton: {
    padding: 16,
  },
  stepContainer: {
    flex: 1,
    padding: 20,
  },
  welcomeContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 32,
  },
  signupButton: {
    backgroundColor: '#7C3AED',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 24,
    width: '100%',
    marginBottom: 24,
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  socialButtons: {
    width: '100%',
    gap: 12,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E293B',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    gap: 12,
  },
  socialButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  stepTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#1E293B',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
  },
  helperText: {
    color: '#94A3B8',
    fontSize: 14,
    marginBottom: 24,
  },
  nextButton: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 24,
    alignItems: 'center',
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },
  nextButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 8,
    marginBottom: 8,
  },
  passwordInput: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: '#fff',
  },
  showPasswordButton: {
    padding: 16,
  },
  dateText: {
    color: '#fff',
    fontSize: 16,
  },
  genderOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  genderOptionSelected: {
    backgroundColor: '#3B82F6',
  },
  genderOptionText: {
    color: '#fff',
    fontSize: 16,
  },
  genderOptionTextSelected: {
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
  },
  loginText: {
    color: '#94A3B8',
    fontSize: 14,
  },
  loginLink: {
    color: '#3B82F6',
    fontSize: 14,
    fontWeight: '500',
  },
  experienceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  experienceOptionSelected: {
    backgroundColor: '#3B82F6',
  },
  experienceOptionText: {
    color: '#fff',
    fontSize: 16,
  },
  experienceOptionTextSelected: {
    fontWeight: '600',
  },
  podcastTypeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  podcastTypeOptionSelected: {
    backgroundColor: '#3B82F6',
  },
  podcastTypeOptionText: {
    color: '#fff',
    fontSize: 16,
  },
  podcastTypeOptionTextSelected: {
    fontWeight: '600',
  },
}); 