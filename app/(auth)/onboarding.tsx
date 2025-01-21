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

type Step = 'welcome' | 'email' | 'password' | 'birthdate' | 'gender' | 'interests';

export default function Onboarding() {
  const { signUp } = useAuth();
  const [currentStep, setCurrentStep] = useState<Step>('welcome');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [birthdate, setBirthdate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [gender, setGender] = useState<string>('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const handleEmailSignUp = async () => {
    try {
      const userCredential = await signUp(email, password);
      const user = userCredential.user;
      
      // Update user profile with additional information
      await user.updateProfile({
        displayName: email.split('@')[0], // Using email prefix as display name
      });

      // Store additional user data (birthdate, gender, interests) in your database
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
        setCurrentStep('birthdate');
        break;
      case 'birthdate':
        setCurrentStep('gender');
        break;
      case 'gender':
        setCurrentStep('interests');
        break;
      case 'interests':
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
      case 'birthdate':
        setCurrentStep('password');
        break;
      case 'gender':
        setCurrentStep('birthdate');
        break;
      case 'interests':
        setCurrentStep('gender');
        break;
    }
  };

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
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

  const renderInterestsScreen = () => {
    const podcastCategories = [
      { name: 'Comedy', icon: '🎭' },
      { name: 'True Crime', icon: '🔍' },
      { name: 'News', icon: '📰' },
      { name: 'Sports', icon: '⚽' },
      { name: 'Business', icon: '💼' },
      { name: 'Education', icon: '📚' },
    ];

    return (
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>Choose your interests</Text>
        <Text style={styles.subtitle}>Pick at least 3 topics you like.</Text>
        <View style={styles.interestsGrid}>
          {podcastCategories.map((category) => (
            <TouchableOpacity
              key={category.name}
              style={[
                styles.interestItem,
                selectedInterests.includes(category.name) && styles.interestItemSelected
              ]}
              onPress={() => toggleInterest(category.name)}
            >
              <Text style={styles.interestIcon}>{category.icon}</Text>
              <Text style={styles.interestText}>{category.name}</Text>
              {selectedInterests.includes(category.name) && (
                <View style={styles.checkmark}>
                  <Ionicons name="checkmark" size={16} color="#fff" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity 
          style={[styles.nextButton, selectedInterests.length < 3 && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={selectedInterests.length < 3}
        >
          <Text style={styles.nextButtonText}>Done</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'welcome':
        return renderWelcomeScreen();
      case 'email':
        return renderEmailScreen();
      case 'password':
        return renderPasswordScreen();
      case 'birthdate':
        return renderBirthdateScreen();
      case 'gender':
        return renderGenderScreen();
      case 'interests':
        return renderInterestsScreen();
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
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginVertical: 24,
  },
  interestItem: {
    width: '48%',
    backgroundColor: '#1E293B',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    position: 'relative',
  },
  interestItemSelected: {
    backgroundColor: '#3B82F6',
  },
  interestIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  interestText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#22C55E',
    borderRadius: 12,
    padding: 4,
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
}); 