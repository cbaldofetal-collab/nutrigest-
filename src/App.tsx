import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { AppNavigator } from './navigation/AppNavigator';
import { AuthNavigator } from './navigation/AuthNavigator';
import { WelcomeScreen } from './screens/WelcomeScreen';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { ErrorBoundary } from './components/ErrorBoundary';
import { theme } from './theme';
import { isOnboardingCompleted, setOnboardingCompleted } from './services/onboarding';
import { useUserStore } from './store';
import { useAuthStore } from './store/useAuthStore';
import { onAuthStateChange } from './services/auth';

export default function App() {
  const [showWelcome, setShowWelcome] = useState<boolean | null>(null);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [showAuth, setShowAuth] = useState<boolean>(false);
  
  const user = useUserStore((state) => state.user);
  const loadUser = useUserStore((state) => state.loadUser);
  
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoadingAuth = useAuthStore((state) => state.isLoading);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);

  useEffect(() => {
    checkAuth();
    checkOnboardingStatus();
    
    // Observar mudanças no estado de autenticação
    const { data: { subscription } } = onAuthStateChange((event, session) => {
      setAuthenticated(!!session, session?.user || null);
    });

    return () => {
      subscription.unsubscribe();
    };
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

  const handleLoginSuccess = async () => {
    await checkAuth();
    setShowAuth(false);
  };

  const handleSignUpSuccess = async () => {
    await checkAuth();
    setShowAuth(false);
    // Após cadastro, pode ir direto para onboarding se necessário
    // ou pode ir direto para o app se já tiver dados
  };

  // Mostrar loading enquanto verifica autenticação
  if (showWelcome === null || isLoadingAuth) {
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

  // Se não estiver autenticado, mostrar tela de login
  if (!isAuthenticated) {
    return (
      <ErrorBoundary>
        <GestureHandlerRootView style={styles.container}>
          <SafeAreaProvider>
            <NavigationContainer>
              <AuthNavigator
                onLoginSuccess={handleLoginSuccess}
                onSignUpSuccess={handleSignUpSuccess}
              />
              <StatusBar style="auto" />
            </NavigationContainer>
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </ErrorBoundary>
    );
  }

  // Se estiver autenticado, seguir fluxo normal (welcome -> onboarding -> app)
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

