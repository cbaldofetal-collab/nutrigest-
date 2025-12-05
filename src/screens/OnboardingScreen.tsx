// Tela de onboarding inicial

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { Button, Card } from '../components';
import { useUserStore } from '../store';
import { calculateBMI } from '../utils';
import { formatDate } from '../utils/date';

type Step = 1 | 2 | 3 | 4;

export function OnboardingScreen({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState<Step>(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [height, setHeight] = useState('');
  const [initialWeight, setInitialWeight] = useState('');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [gestationalWeek, setGestationalWeek] = useState('');

  const setUser = useUserStore((state) => state.setUser);

  const handleNext = () => {
    if (step === 1) {
      if (!name.trim()) {
        Alert.alert('Atenção', 'Por favor, informe seu nome');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      const heightTrimmed = height.trim();
      const weightTrimmed = initialWeight.trim();
      const heightNum = parseFloat(heightTrimmed);
      const weightNum = parseFloat(weightTrimmed);
      
      console.log('Validando passo 2:', { heightTrimmed, weightTrimmed, heightNum, weightNum });
      
      if (!heightTrimmed || isNaN(heightNum) || heightNum <= 0 || heightNum > 250) {
        Alert.alert('Atenção', 'Por favor, informe uma altura válida (em cm, entre 1 e 250)');
        return;
      }
      if (!weightTrimmed || isNaN(weightNum) || weightNum <= 0 || weightNum > 200) {
        Alert.alert('Atenção', 'Por favor, informe um peso válido (em kg, entre 1 e 200)');
        return;
      }
      console.log('Validação passou, avançando para passo 3');
      setStep(3);
    } else if (step === 3) {
      const weekNum = parseInt(gestationalWeek);
      if (!gestationalWeek || weekNum < 1 || weekNum > 40) {
        Alert.alert('Atenção', 'Por favor, informe a semana gestacional (1-40)');
        return;
      }
      setStep(4);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((step - 1) as Step);
    }
  };

  const handleComplete = async () => {
    if (!dueDate) {
      Alert.alert('Atenção', 'Por favor, selecione a data prevista do parto');
      return;
    }

    const heightNum = parseFloat(height);
    const weightNum = parseFloat(initialWeight);
    const weekNum = parseInt(gestationalWeek);
    const initialBMI = calculateBMI(weightNum, heightNum);

    try {
      await setUser({
        id: `user_${Date.now()}`,
        name: name.trim(),
        email: email.trim() || undefined, // undefined em vez de string vazia
        gestationalWeek: weekNum,
        initialWeight: weightNum,
        currentWeight: weightNum,
        height: heightNum,
        initialBMI,
        dueDate,
        createdAt: new Date(),
      });

      // Aguardar um pouco para garantir que o estado foi atualizado
      await new Promise(resolve => setTimeout(resolve, 100));
      
      onComplete();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Não foi possível salvar suas informações';
      Alert.alert('Erro', errorMessage);
      console.error('Erro ao completar onboarding:', error);
    }
  };

  const calculateDueDateFromWeek = (week: number) => {
    // Assumindo que a gestação começou há 'week' semanas
    // A data prevista é 40 semanas após o início da gestação
    const today = new Date();
    const weeksToAdd = 40 - week;
    const dueDate = new Date(today);
    dueDate.setDate(dueDate.getDate() + weeksToAdd * 7);
    return dueDate;
  };

  const handleWeekChange = (week: string) => {
    setGestationalWeek(week);
    if (week) {
      const weekNum = parseInt(week);
      if (weekNum >= 1 && weekNum <= 40) {
        setDueDate(calculateDueDateFromWeek(weekNum));
      }
    }
  };

  const progress = (step / 4) * 100;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <Text style={styles.headerEmoji}>
                {step === 1 ? '👋' : step === 2 ? '📏' : step === 3 ? '🤰' : '🎉'}
              </Text>
            </View>
            <Text style={styles.title}>
              {step === 1
                ? 'Vamos começar!'
                : step === 2
                ? 'Informações importantes'
                : step === 3
                ? 'Sua gestação'
                : 'Tudo pronto!'}
            </Text>
            <Text style={styles.subtitle}>
              {step === 1
                ? 'Precisamos de algumas informações para personalizar sua experiência'
                : step === 2
                ? 'Esses dados nos ajudam a calcular suas metas nutricionais'
                : step === 3
                ? 'Conte-nos sobre sua gestação'
                : 'Estamos prontos para te acompanhar nessa jornada!'}
            </Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.progressText}>
              Passo {step} de 4
            </Text>
          </View>

          {step === 1 && (
            <Card style={styles.stepCard}>
              <View style={styles.stepHeader}>
                <Text style={styles.stepEmoji}>👤</Text>
                <Text style={styles.stepTitle}>Informações Pessoais</Text>
              </View>
              <Text style={styles.stepDescription}>
                Queremos conhecer você melhor para oferecer uma experiência personalizada
              </Text>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nome Completo *</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Ex: Maria Silva"
                  placeholderTextColor={theme.colors.textSecondary}
                  autoCapitalize="words"
                  accessibilityLabel="Nome completo"
                  accessibilityHint="Digite seu nome completo"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>E-mail (opcional)</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Ex: maria@email.com"
                  placeholderTextColor={theme.colors.textSecondary}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  accessibilityLabel="E-mail, opcional"
                  accessibilityHint="Digite seu e-mail para receber atualizações, opcional"
                />
              </View>
            </Card>
          )}

          {step === 2 && (
            <Card style={styles.stepCard}>
              <View style={styles.stepHeader}>
                <Text style={styles.stepEmoji}>⚖️</Text>
                <Text style={styles.stepTitle}>Peso e Altura</Text>
              </View>
              <Text style={styles.stepDescription}>
                Com essas informações, calculamos seu IMC e definimos suas metas de ganho de peso ideal
              </Text>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Altura (cm) *</Text>
                <TextInput
                  style={styles.input}
                  value={height}
                  onChangeText={setHeight}
                  placeholder="Ex: 165"
                  placeholderTextColor={theme.colors.textSecondary}
                  keyboardType="decimal-pad"
                  accessibilityLabel="Altura em centímetros"
                  accessibilityHint="Digite sua altura em centímetros"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Peso Inicial (kg) *</Text>
                <TextInput
                  style={styles.input}
                  value={initialWeight}
                  onChangeText={setInitialWeight}
                  placeholder="Ex: 65.5"
                  placeholderTextColor={theme.colors.textSecondary}
                  keyboardType="decimal-pad"
                  accessibilityLabel="Peso inicial em quilogramas"
                  accessibilityHint="Digite seu peso inicial em quilogramas"
                />
              </View>

              {height && initialWeight && (
                <View style={styles.bmiPreview}>
                  <Text style={styles.bmiLabel}>IMC Inicial:</Text>
                  <Text style={styles.bmiValue}>
                    {calculateBMI(parseFloat(initialWeight), parseFloat(height)).toFixed(1)}
                  </Text>
                </View>
              )}
            </Card>
          )}

          {step === 3 && (
            <Card style={styles.stepCard}>
              <View style={styles.stepHeader}>
                <Text style={styles.stepEmoji}>📅</Text>
                <Text style={styles.stepTitle}>Informações da Gestação</Text>
              </View>
              <Text style={styles.stepDescription}>
                Saber em qual semana você está nos ajuda a ajustar as recomendações nutricionais para cada fase da gestação
              </Text>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Semana Gestacional *</Text>
                <TextInput
                  style={styles.input}
                  value={gestationalWeek}
                  onChangeText={handleWeekChange}
                  placeholder="Ex: 14"
                  placeholderTextColor={theme.colors.textSecondary}
                  keyboardType="number-pad"
                  accessibilityLabel="Semana gestacional"
                  accessibilityHint="Digite quantas semanas de gestação você está, de 1 a 40"
                />
                <Text style={styles.hint}>
                  Informe quantas semanas de gestação você está (1-40)
                </Text>
              </View>

              {dueDate && (
                <View style={styles.datePreview}>
                  <Text style={styles.dateLabel}>Data Prevista do Parto:</Text>
                  <Text style={styles.dateValue}>
                    {formatDate(dueDate)}
                  </Text>
                </View>
              )}
            </Card>
          )}

          {step === 4 && (
            <Card style={styles.stepCard}>
              <View style={styles.stepHeader}>
                <Text style={styles.stepEmoji}>✨</Text>
                <Text style={styles.stepTitle}>Tudo Pronto!</Text>
              </View>
              <Text style={styles.stepDescription}>
                Parabéns, {name}! Seu perfil está configurado. Estamos prontos para te acompanhar nessa jornada única! 💝
              </Text>

              <View style={styles.summary}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Nome:</Text>
                  <Text style={styles.summaryValue}>{name}</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Altura:</Text>
                  <Text style={styles.summaryValue}>{height} cm</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Peso Inicial:</Text>
                  <Text style={styles.summaryValue}>{initialWeight} kg</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Semana Gestacional:</Text>
                  <Text style={styles.summaryValue}>{gestationalWeek} semanas</Text>
                </View>
                {dueDate && (
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Data Prevista:</Text>
                    <Text style={styles.summaryValue}>{formatDate(dueDate)}</Text>
                  </View>
                )}
              </View>

              <View style={styles.tips}>
                <Text style={styles.tipsTitle}>💡 Dicas para começar:</Text>
                <View style={styles.tipItemContainer}>
                  <Text style={styles.tipBullet}>🍽️</Text>
                  <Text style={styles.tipItem}>Registre suas refeições diariamente</Text>
                </View>
                <View style={styles.tipItemContainer}>
                  <Text style={styles.tipBullet}>⚖️</Text>
                  <Text style={styles.tipItem}>Acompanhe seu peso regularmente</Text>
                </View>
                <View style={styles.tipItemContainer}>
                  <Text style={styles.tipBullet}>📊</Text>
                  <Text style={styles.tipItem}>Verifique o Dashboard para ver seu progresso</Text>
                </View>
                <View style={styles.tipItemContainer}>
                  <Text style={styles.tipBullet}>📄</Text>
                  <Text style={styles.tipItem}>Gere relatórios para compartilhar com seu médico</Text>
                </View>
              </View>
            </Card>
          )}

          <View style={styles.buttons}>
            {step > 1 && (
              <Button
                title="Voltar"
                onPress={handleBack}
                variant="outline"
                style={styles.backButton}
              />
            )}
            <Button
              title={step === 4 ? 'Começar' : 'Próximo'}
              onPress={step === 4 ? handleComplete : handleNext}
              style={styles.nextButton}
            />
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
    padding: theme.spacing.md,
  },
  header: {
    marginBottom: theme.spacing.lg,
    alignItems: 'center',
  },
  headerIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  headerEmoji: {
    fontSize: 40,
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
    marginBottom: theme.spacing.md,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: theme.colors.divider,
    borderRadius: theme.borderRadius.sm,
    overflow: 'hidden',
    marginBottom: theme.spacing.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.sm,
  },
  progressText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  stepCard: {
    marginBottom: theme.spacing.lg,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  stepEmoji: {
    fontSize: 32,
    marginRight: theme.spacing.sm,
  },
  stepTitle: {
    ...theme.typography.h2,
    color: theme.colors.text,
    flex: 1,
  },
  stepDescription: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
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
  hint: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  bmiPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.primaryLight,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.sm,
  },
  bmiLabel: {
    ...theme.typography.body,
    color: theme.colors.text,
    marginRight: theme.spacing.sm,
  },
  bmiValue: {
    ...theme.typography.h2,
    color: theme.colors.primaryDark,
  },
  datePreview: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.secondaryLight,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.sm,
  },
  dateLabel: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  dateValue: {
    ...theme.typography.h3,
    color: theme.colors.secondaryDark,
  },
  summary: {
    marginTop: theme.spacing.md,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  summaryLabel: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  summaryValue: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: '600',
  },
  tips: {
    marginTop: theme.spacing.lg,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
  },
  tipsTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  tipItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  tipBullet: {
    fontSize: 20,
    marginRight: theme.spacing.sm,
  },
  tipItem: {
    ...theme.typography.bodySmall,
    color: theme.colors.text,
    flex: 1,
  },
  buttons: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  backButton: {
    flex: 1,
  },
  nextButton: {
    flex: 2,
  },
});

