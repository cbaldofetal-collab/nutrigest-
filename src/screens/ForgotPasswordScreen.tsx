// Tela de Recuperação de Senha

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../theme';
import { Card, Button, Loading } from '../components';
import { resetPassword } from '../services/auth';
import { handleError } from '../utils/errorHandler';

export function ForgotPasswordScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleResetPassword = async () => {
    // Validação
    if (!email.trim()) {
      Alert.alert('Atenção', 'Por favor, informe seu email');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      Alert.alert('Atenção', 'Por favor, informe um email válido');
      return;
    }

    setIsLoading(true);

    try {
      const result = await resetPassword(email.trim());

      if (result.success) {
        setEmailSent(true);
        Alert.alert(
          'Email Enviado',
          'Enviamos um link de recuperação para seu email. Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      } else {
        Alert.alert('Erro', result.error || 'Não foi possível enviar o email de recuperação');
      }
    } catch (error) {
      const appError = handleError(error);
      Alert.alert('Erro', appError.userMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.successContainer}>
          <Text style={styles.successEmoji}>✉️</Text>
          <Text style={styles.successTitle}>Email Enviado!</Text>
          <Text style={styles.successMessage}>
            Enviamos um link de recuperação para {email}
          </Text>
          <Text style={styles.successInstructions}>
            Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
          </Text>
          <Button
            title="Voltar para Login"
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <Text style={styles.headerEmoji}>🔑</Text>
            <Text style={styles.title}>Recuperar Senha</Text>
            <Text style={styles.subtitle}>
              Digite seu email e enviaremos um link para redefinir sua senha
            </Text>
          </View>

          <Card style={styles.card}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email *</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="seu@email.com"
                placeholderTextColor={theme.colors.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
            </View>

            <Button
              title="Enviar Link de Recuperação"
              onPress={handleResetPassword}
              disabled={isLoading}
              style={styles.submitButton}
            />

            {isLoading && <Loading message="Enviando email..." />}
          </Card>

          <TouchableOpacity
            style={styles.backToLogin}
            onPress={() => navigation.goBack()}
            disabled={isLoading}
          >
            <Text style={styles.backToLoginText}>← Voltar para Login</Text>
          </TouchableOpacity>
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
  card: {
    marginBottom: theme.spacing.lg,
  },
  inputGroup: {
    marginBottom: theme.spacing.lg,
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
  submitButton: {
    marginTop: theme.spacing.sm,
  },
  backToLogin: {
    alignSelf: 'center',
    padding: theme.spacing.md,
  },
  backToLoginText: {
    ...theme.typography.body,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  successEmoji: {
    fontSize: 80,
    marginBottom: theme.spacing.lg,
  },
  successTitle: {
    ...theme.typography.h1,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  successMessage: {
    ...theme.typography.body,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  successInstructions: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
  },
  backButton: {
    marginTop: theme.spacing.md,
  },
});

