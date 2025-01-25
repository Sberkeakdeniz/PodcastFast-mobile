import React, { createContext, useContext, useEffect, useState } from 'react';
import Purchases, { CustomerInfo, CustomerInfoUpdateListener } from 'react-native-purchases';
import firestore from '@react-native-firebase/firestore';
import { useAuth } from './auth';

interface SubscriptionState {
  status: 'free' | 'pro';
  plan: string | null;
  startDate: Date | null;
  endDate: Date | null;
  isLoading: boolean;
}

interface SubscriptionContextType {
  subscriptionState: SubscriptionState;
  refreshSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [subscriptionState, setSubscriptionState] = useState<SubscriptionState>({
    status: 'free',
    plan: null,
    startDate: null,
    endDate: null,
    isLoading: true,
  });

  const updateSubscriptionState = async (customerInfo: CustomerInfo) => {
    try {
      const hasActiveSubscription = customerInfo.activeSubscriptions.length > 0 || 
                                  Object.keys(customerInfo.entitlements.active).length > 0;

      // Get Firestore data
      if (user) {
        const userDoc = await firestore().collection('users').doc(user.uid).get();
        const firestoreData = userDoc.data()?.subscription;

        setSubscriptionState({
          status: firestoreData?.status || (hasActiveSubscription ? 'pro' : 'free'),
          plan: firestoreData?.plan || (hasActiveSubscription ? customerInfo.activeSubscriptions[0] : null),
          startDate: firestoreData?.startDate?.toDate() || (hasActiveSubscription ? new Date() : null),
          endDate: firestoreData?.endDate?.toDate() || null,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error('Error updating subscription state:', error);
      setSubscriptionState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const refreshSubscription = async () => {
    if (!user) return;
    
    try {
      setSubscriptionState(prev => ({ ...prev, isLoading: true }));
      const customerInfo = await Purchases.getCustomerInfo();
      await updateSubscriptionState(customerInfo);
    } catch (error) {
      console.error('Error refreshing subscription:', error);
      setSubscriptionState(prev => ({ ...prev, isLoading: false }));
    }
  };

  useEffect(() => {
    if (user) {
      // Set up RevenueCat listener
      const customerInfoListener: CustomerInfoUpdateListener = (customerInfo) => {
        updateSubscriptionState(customerInfo);
      };
      Purchases.addCustomerInfoUpdateListener(customerInfoListener);

      // Set up Firestore listener
      const unsubscribeFirestore = firestore()
        .collection('users')
        .doc(user.uid)
        .onSnapshot((doc) => {
          const firestoreData = doc.data()?.subscription;
          if (firestoreData) {
            setSubscriptionState({
              status: firestoreData.status,
              plan: firestoreData.plan,
              startDate: firestoreData.startDate?.toDate() || null,
              endDate: firestoreData.endDate?.toDate() || null,
              isLoading: false,
            });
          }
        });

      // Initial fetch
      refreshSubscription();

      return () => {
        Purchases.removeCustomerInfoUpdateListener(customerInfoListener);
        unsubscribeFirestore();
      };
    } else {
      // Reset state when user signs out
      setSubscriptionState({
        status: 'free',
        plan: null,
        startDate: null,
        endDate: null,
        isLoading: false,
      });
    }
  }, [user]);

  return (
    <SubscriptionContext.Provider value={{ subscriptionState, refreshSubscription }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
} 