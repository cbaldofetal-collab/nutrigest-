import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet, View, ActivityIndicator } from 'react-native';

import { AppNavigator } from './navigation/AppNavigator';
import { WelcomeScreen } from './screens/WelcomeScreen';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { ErrorBoundary } from './components/ErrorBoundary';
import { theme } from './theme';
import { isOnboardingCompleted, setOnboardingCompleted } from './services/onboarding';
import { useUserStore } from './store';

export default function App() {
  const [showWelcome, setShowWelcome] = useState<boolean | null>(null);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const user = useUserStore((state) => state.user);
  const loadUser = useUserStore((state) => state.loadUser);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const completed = await isOnboardingCompleted();
      await loadUser();
      
      // Se o onboarding foi completado mas não há usuário, mostrar welcome
      const currentUser = useUserStore.getState().user;
      if (completed && !currentUser) {
        setShowWelcome(true);
      } else {
        setShowWelcome(!completed);
      }
    } catch (error) {
      console.error('Erro ao verificar onboarding:', error);
      setShowWelcome(true);
    }
  };

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
    setShowOnboarding(true);
  };

  const handleOnboardingComplete = async () => {
    await setOnboardingCompleted();
    setShowOnboarding(false);
  };

  if (showWelcome === null) {
    return (
      <GestureHandlerRootView style={styles.container}>
        <SafeAreaProvider>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    );
  }

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={styles.container}>
        <SafeAreaProvider>
          {showWelcome ? (
            <WelcomeScreen onGetStarted={handleWelcomeComplete} />
          ) : showOnboarding ? (
            <OnboardingScreen onComplete={handleOnboardingComplete} />
          ) : (
            <NavigationContainer>
              <AppNavigator />
              <StatusBar style="auto" />
            </NavigationContainer>
          )}
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

