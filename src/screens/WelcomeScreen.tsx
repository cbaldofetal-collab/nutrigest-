// Tela de boas-vindas inicial - primeira impressão do app

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { Button } from '../components';

const { width } = Dimensions.get('window');

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  const features = [
    {
      icon: '📊',
      title: 'Acompanhamento Completo',
      description: 'Monitore sua nutrição e ganho de peso durante toda a gestação',
    },
    {
      icon: '🍎',
      title: 'Registro Fácil',
      description: 'Registre suas refeições de forma rápida e intuitiva',
    },
    {
      icon: '📈',
      title: 'Análise Inteligente',
      description: 'Receba alertas sobre nutrientes importantes para você e seu bebê',
    },
    {
      icon: '📄',
      title: 'Relatórios Profissionais',
      description: 'Gere relatórios detalhados para compartilhar com seu médico',
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header com logo/ícone */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Text style={styles.mainIcon}>🤰</Text>
          </View>
          <Text style={styles.title}>Bem-vinda ao NutriGest</Text>
          <Text style={styles.subtitle}>
            Seu companheiro nutricional durante a gestação
          </Text>
        </View>

        {/* Features */}
        <View style={styles.featuresContainer}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <Text style={styles.featureIcon}>{feature.icon}</Text>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>{feature.description}</Text>
            </View>
          ))}
        </View>

        {/* Mensagem motivacional */}
        <View style={styles.messageCard}>
          <Text style={styles.messageText}>
            💝 Cada refeição é um passo importante para uma gestação saudável.
            Estamos aqui para te apoiar nessa jornada única!
          </Text>
        </View>

        {/* Botão de ação */}
        <View style={styles.buttonContainer}>
          <Button
            title="Começar Agora"
            onPress={onGetStarted}
            size="large"
            style={styles.button}
            accessibilityLabel="Começar configuração do perfil"
            accessibilityHint="Inicia o processo de configuração inicial do aplicativo"
          />
          <Text style={styles.disclaimer}>
            Seus dados são privados e seguros
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    marginTop: theme.spacing.lg,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
    ...theme.shadows.md,
  },
  mainIcon: {
    fontSize: 64,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  featuresContainer: {
    marginBottom: theme.spacing.xl,
  },
  featureCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  featureIcon: {
    fontSize: 48,
    marginBottom: theme.spacing.sm,
  },
  featureTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  featureDescription: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  messageCard: {
    backgroundColor: theme.colors.secondaryLight,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.secondary,
  },
  messageText: {
    ...theme.typography.body,
    color: theme.colors.text,
    lineHeight: 24,
    textAlign: 'center',
  },
  buttonContainer: {
    alignItems: 'center',
  },
  button: {
    width: '100%',
    marginBottom: theme.spacing.md,
  },
  disclaimer: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});

