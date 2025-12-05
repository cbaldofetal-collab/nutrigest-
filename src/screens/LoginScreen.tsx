// Tela de Login

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../theme';
import { Card, Button, Loading, ErrorMessage } from '../components';
import { login } from '../services/auth';
import { validatePassword, getPasswordErrorMessage } from '../utils/passwordValidation';
import { handleError } from '../utils/errorHandler';

export function LoginScreen({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    // Validações básicas
    if (!email.trim()) {
      Alert.alert('Atenção', 'Por favor, informe seu email');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      Alert.alert('Atenção', 'Por favor, informe um email válido');
      return;
    }

    if (!password) {
      Alert.alert('Atenção', 'Por favor, informe sua senha');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await login({
        email: email.trim(),
        password,
      });

      if (result.success) {
        onLoginSuccess();
      } else {
        setError(result.error || 'Erro ao fazer login');
        Alert.alert('Erro', result.error || 'Erro ao fazer login');
      }
    } catch (error) {
      const appError = handleError(error);
      setError(appError.userMessage);
      Alert.alert('Erro', appError.userMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <Text style={styles.headerEmoji}>🔐</Text>
            <Text style={styles.title}>Bem-vinda de volta!</Text>
            <Text style={styles.subtitle}>
              Faça login para continuar acompanhando sua gestação
            </Text>
          </View>

          <Card style={styles.loginCard}>
            {error && (
              <ErrorMessage
                message={error}
                onRetry={() => setError(null)}
                retryLabel="Tentar Novamente"
              />
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email *</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setError(null);
                }}
                placeholder="seu@email.com"
                placeholderTextColor={theme.colors.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Senha *</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    setError(null);
                  }}
                  placeholder="Digite sua senha"
                  placeholderTextColor={theme.colors.textSecondary}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                  accessibilityLabel={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.forgotPasswordButton}
              onPress={() => navigation.navigate('ForgotPassword' as never)}
              disabled={isLoading}
            >
              <Text style={styles.forgotPasswordText}>Esqueci minha senha</Text>
            </TouchableOpacity>

            <Button
              title="Entrar"
              onPress={handleLogin}
              disabled={isLoading}
              style={styles.loginButton}
            />

            {isLoading && <Loading message="Fazendo login..." />}
          </Card>

          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Não tem uma conta? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('SignUp' as never)}
              disabled={isLoading}
            >
              <Text style={styles.signUpLink}>Cadastre-se</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.lg,
    flexGrow: 1,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  headerEmoji: {
    fontSize: 64,
    marginBottom: theme.spacing.md,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  loginCard: {
    marginBottom: theme.spacing.lg,
  },
  inputGroup: {
    marginBottom: theme.spacing.md,
  },
  label: {
    ...theme.typography.body,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    fontWeight: '500',
  },
  input: {
    ...theme.typography.body,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.divider,
    color: theme.colors.text,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeButton: {
    position: 'absolute',
    right: theme.spacing.md,
    top: '50%',
    transform: [{ translateY: -12 }],
    padding: theme.spacing.xs,
  },
  eyeIcon: {
    fontSize: 20,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: theme.spacing.md,
  },
  forgotPasswordText: {
    ...theme.typography.bodySmall,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  loginButton: {
    marginTop: theme.spacing.sm,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  signUpLink: {
    ...theme.typography.body,
    color: theme.colors.primary,
    fontWeight: '600',
  },
});

