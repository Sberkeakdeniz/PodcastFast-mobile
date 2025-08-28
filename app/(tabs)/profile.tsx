import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert, Linking } from 'react-native';
import { useAuth } from '../../src/contexts/auth';
import { useSubscription } from '../../src/contexts/subscription';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default function Profile() {
  const { signOut, user } = useAuth();
  const { subscriptionState } = useSubscription();

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/(auth)/onboarding');
          },
        },
      ],
      { cancelable: true }
    );
  };

  const getSubscriptionText = () => {
    if (subscriptionState.isLoading) return 'Loading...';
    if (subscriptionState.status === 'pro') {
      return 'Pro Plan';
    }
    return 'Free Plan';
  };

  const handleChangePassword = async () => {
    Alert.prompt(
      'Change Password',
      'Enter your current password',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Next',
          onPress: async (currentPassword) => {
            if (!currentPassword) {
              Alert.alert('Error', 'Please enter your current password');
              return;
            }

            try {
              // Reauthenticate user
              const credential = auth.EmailAuthProvider.credential(
                auth().currentUser?.email || '',
                currentPassword
              );
              await auth().currentUser?.reauthenticateWithCredential(credential);

              // If reauthentication successful, prompt for new password
              Alert.prompt(
                'New Password',
                'Enter your new password (minimum 10 characters)',
                [
                  {
                    text: 'Cancel',
                    style: 'cancel'
                  },
                  {
                    text: 'Change Password',
                    onPress: async (newPassword) => {
                      if (!newPassword || newPassword.length < 10) {
                        Alert.alert('Error', 'Password must be at least 10 characters long');
                        return;
                      }

                      try {
                        await auth().currentUser?.updatePassword(newPassword);
                        Alert.alert('Success', 'Password updated successfully');
                      } catch (error: any) {
                        Alert.alert('Error', error.message);
                      }
                    }
                  }
                ],
                'secure-text'
              );
            } catch (error: any) {
              Alert.alert('Error', 'Current password is incorrect');
            }
          }
        }
      ],
      'secure-text'
    );
  };

  const handleSupportPress = async () => {
    const supportUrl = 'https://sberkeakdeniz.github.io/PodcastFast-mobile/support';
    try {
      const canOpen = await Linking.canOpenURL(supportUrl);
      if (canOpen) {
        await Linking.openURL(supportUrl);
      } else {
        Alert.alert('Error', 'Unable to open support page');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong while opening support page');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={40} color="#fff" />
          </View>
          <Text style={styles.name}>{user?.displayName || 'User'}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>

        <View style={styles.subscriptionCard}>
          <View style={styles.subscriptionHeader}>
            <Ionicons name="star" size={24} color="#7C3AED" />
            <Text style={styles.subscriptionTitle}>Subscription Status</Text>
          </View>
          <Text style={styles.subscriptionInfo}>{getSubscriptionText()}</Text>
        </View>

        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={handleSupportPress}
          >
            <Ionicons name="help-circle-outline" size={24} color="#fff" />
            <Text style={styles.menuItemText}>Help & Support</Text>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={handleChangePassword}
          >
            <Ionicons name="key-outline" size={24} color="#fff" />
            <Text style={styles.menuItemText}>Change Password</Text>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleSignOut}>
            <Ionicons name="log-out-outline" size={24} color="#EF4444" />
            <Text style={[styles.menuItemText, { color: '#EF4444' }]}>Sign Out</Text>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => {
              Alert.alert(
                'Delete Account',
                'Are you sure you want to delete your account? This action cannot be undone.',
                [
                  {
                    text: 'Cancel',
                    style: 'cancel',
                  },
                  {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                      // First, prompt for password to re-authenticate
                      Alert.prompt(
                        'Confirm Password',
                        'Please enter your password to confirm account deletion',
                        [
                          {
                            text: 'Cancel',
                            style: 'cancel'
                          },
                          {
                            text: 'Confirm',
                            style: 'destructive',
                            onPress: async (password) => {
                              if (!password) {
                                Alert.alert('Error', 'Password is required');
                                return;
                              }

                              try {
                                // Re-authenticate user
                                const credential = auth.EmailAuthProvider.credential(
                                  auth().currentUser?.email || '',
                                  password
                                );
                                await auth().currentUser?.reauthenticateWithCredential(credential);

                                // After re-authentication, proceed with deletion
                                await firestore().collection('users').doc(user?.uid).delete();
                                await auth().currentUser?.delete();
                                router.replace('/(auth)/onboarding');
                              } catch (error: any) {
                                if (error.code === 'auth/wrong-password') {
                                  Alert.alert('Error', 'Incorrect password');
                                } else {
                                  Alert.alert('Error', error.message);
                                }
                              }
                            }
                          }
                        ],
                        'secure-text'
                      );
                    },
                  },
                ],
                { cancelable: true }
              );
            }}
          >
            <Ionicons name="trash-outline" size={24} color="#EF4444" />
            <Text style={[styles.menuItemText, { color: '#EF4444' }]}>Delete Account</Text>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>
        </View>
      </View>
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
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#94A3B8',
    marginBottom: 8,
  },
  subscriptionCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#2D3748',
  },
  subscriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  subscriptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  subscriptionInfo: {
    fontSize: 14,
    color: '#94A3B8',
  },
  section: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2D3748',
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
    marginLeft: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2D3748',
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
    marginLeft: 12,
  },
});
