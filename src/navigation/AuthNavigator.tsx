// Navegador para telas de autenticação

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { LoginScreen } from '../screens/LoginScreen';
import { SignUpScreen } from '../screens/SignUpScreen';
import { ForgotPasswordScreen } from '../screens/ForgotPasswordScreen';

const Stack = createStackNavigator();

interface AuthNavigatorProps {
  onLoginSuccess: () => void;
  onSignUpSuccess: () => void;
}

export function AuthNavigator({ onLoginSuccess, onSignUpSuccess }: AuthNavigatorProps) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login">
        {(props) => <LoginScreen {...props} onLoginSuccess={onLoginSuccess} />}
      </Stack.Screen>
      <Stack.Screen name="SignUp">
        {(props) => <SignUpScreen {...props} onSignUpSuccess={onSignUpSuccess} />}
      </Stack.Screen>
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
}

