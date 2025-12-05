// Tela de Cadastro/Registro

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
import { signUp } from '../services/auth';
import { validatePassword, getPasswordErrorMessage, getPasswordStrength } from '../utils/passwordValidation';
import { handleError } from '../utils/errorHandler';

export function SignUpScreen({ onSignUpSuccess }: { onSignUpSuccess: () => void }) {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const passwordValidation = validatePassword(password);
  const passwordStrength = password ? getPasswordStrength(password) : null;

  const handleSignUp = async () => {
    // Validações básicas
    if (!name.trim()) {
      Alert.alert('Atenção', 'Por favor, informe seu nome');
      return;
    }

    if (!email.trim()) {
      Alert.alert('Atenção', 'Por favor, informe seu email');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      Alert.alert('Atenção', 'Por favor, informe um email válido');
      return;
    }

    if (!password) {
      Alert.alert('Atenção', 'Por favor, informe uma senha');
      return;
    }

    // Validação de senha alfanumérica
    if (!passwordValidation.isValid) {
      const errorMsg = getPasswordErrorMessage(passwordValidation.errors);
      Alert.alert('Senha Inválida', errorMsg);
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Atenção', 'As senhas não coincidem');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await signUp({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      if (result.success) {
        Alert.alert(
          'Conta Criada!',
          'Sua conta foi criada com sucesso. Verifique seu email para confirmar sua conta.',
          [
            {
              text: 'OK',
              onPress: onSignUpSuccess,
            },
          ]
        );
      } else {
        setError(result.error || 'Erro ao criar conta');
        Alert.alert('Erro', result.error || 'Erro ao criar conta');
      }
    } catch (error) {
      const appError = handleError(error);
      setError(appError.userMessage);
      Alert.alert('Erro', appError.userMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getStrengthColor = () => {
    if (!passwordStrength) return theme.colors.divider;
    if (passwordStrength === 'weak') return theme.colors.error;
    if (passwordStrength === 'medium') return '#FFA500';
    return theme.colors.primary;
  };

  const getStrengthLabel = () => {
    if (!passwordStrength) return '';
    if (passwordStrength === 'weak') return 'Fraca';
    if (passwordStrength === 'medium') return 'Média';
    return 'Forte';
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <Text style={styles.headerEmoji}>👋</Text>
            <Text style={styles.title}>Criar Conta</Text>
            <Text style={styles.subtitle}>
              Preencha os dados abaixo para começar
            </Text>
          </View>

          <Card style={styles.signUpCard}>
            {error && (
              <ErrorMessage
                message={error}
                onRetry={() => setError(null)}
                retryLabel="Tentar Novamente"
              />
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nome Completo *</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  setError(null);
                }}
                placeholder="Seu nome completo"
                placeholderTextColor={theme.colors.textSecondary}
                autoCapitalize="words"
                editable={!isLoading}
              />
            </View>

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
                  placeholder="Mínimo 8 caracteres, letras e números"
                  placeholderTextColor={theme.colors.textSecondary}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
                </TouchableOpacity>
              </View>
              
              {password && (
                <View style={styles.passwordInfo}>
                  <View style={styles.strengthContainer}>
                    <View style={[styles.strengthBar, { width: `${passwordStrength === 'weak' ? 33 : passwordStrength === 'medium' ? 66 : 100}%`, backgroundColor: getStrengthColor() }]} />
                  </View>
                  <Text style={[styles.strengthText, { color: getStrengthColor() }]}>
                    {getStrengthLabel()}
                  </Text>
                </View>
              )}

              {!passwordValidation.isValid && password && (
                <View style={styles.validationErrors}>
                  {passwordValidation.errors.map((err, index) => (
                    <Text key={index} style={styles.validationError}>
                      • {err}
                    </Text>
                  ))}
                </View>
              )}

              <Text style={styles.hint}>
                A senha deve conter: mínimo 8 caracteres, pelo menos 1 letra maiúscula, 1 minúscula e 1 número
              </Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirmar Senha *</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    setError(null);
                  }}
                  placeholder="Digite a senha novamente"
                  placeholderTextColor={theme.colors.textSecondary}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Text style={styles.eyeIcon}>{showConfirmPassword ? '👁️' : '👁️‍🗨️'}</Text>
                </TouchableOpacity>
              </View>
              {confirmPassword && password !== confirmPassword && (
                <Text style={styles.errorText}>As senhas não coincidem</Text>
              )}
            </View>

            <Button
              title="Criar Conta"
              onPress={handleSignUp}
              disabled={isLoading || !passwordValidation.isValid || password !== confirmPassword}
              style={styles.signUpButton}
            />

            {isLoading && <Loading message="Criando conta..." />}
          </Card>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Já tem uma conta? </Text>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              disabled={isLoading}
            >
              <Text style={styles.loginLink}>Fazer Login</Text>
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
  signUpCard: {
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
  passwordInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.xs,
    gap: theme.spacing.sm,
  },
  strengthContainer: {
    flex: 1,
    height: 4,
    backgroundColor: theme.colors.divider,
    borderRadius: 2,
    overflow: 'hidden',
  },
  strengthBar: {
    height: '100%',
    borderRadius: 2,
  },
  strengthText: {
    ...theme.typography.caption,
    fontWeight: '600',
  },
  validationErrors: {
    marginTop: theme.spacing.xs,
  },
  validationError: {
    ...theme.typography.caption,
    color: theme.colors.error,
    marginBottom: theme.spacing.xs / 2,
  },
  hint: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  errorText: {
    ...theme.typography.caption,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
  },
  signUpButton: {
    marginTop: theme.spacing.md,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  loginLink: {
    ...theme.typography.body,
    color: theme.colors.primary,
    fontWeight: '600',
  },
});

