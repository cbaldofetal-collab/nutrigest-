import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { Card, Button, Loading, ErrorMessage } from '../components';
import { useUserStore, useMealsStore, useWeightStore } from '../store';
import { generateReportPDF, shareReportPDF, ReportType, ReportData } from '../services/reportGenerator';
import { formatDate, subtractDaysFromDate, calculateAverageNutrition } from '../utils';
import { handleError } from '../utils/errorHandler';

export function ReportsScreen() {
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<ReportType>('weekly');

  const user = useUserStore((state) => state.user);
  const loadUser = useUserStore((state) => state.loadUser);
  const getMealsByDate = useMealsStore((state) => state.getMealsByDate);
  const getDailyNutrition = useMealsStore((state) => state.getDailyNutrition);
  const getAllMeals = useMealsStore((state) => state.meals);
  const loadMeals = useMealsStore((state) => state.loadMeals);
  const weights = useWeightStore((state) => state.entries);
  const loadWeights = useWeightStore((state) => state.loadWeights);

  useEffect(() => {
    loadUser();
    loadMeals();
    loadWeights();
  }, []);

  const getDateRange = (type: ReportType): { startDate: Date; endDate: Date } => {
    const endDate = new Date();
    let startDate: Date;

    switch (type) {
      case 'weekly':
        startDate = subtractDaysFromDate(endDate, 6);
        break;
      case 'monthly':
        startDate = subtractDaysFromDate(endDate, 29);
        break;
      case 'trimester':
        if (!user) return { startDate: endDate, endDate };
        const trimester = user.gestationalWeek <= 13 ? 1 : user.gestationalWeek <= 27 ? 2 : 3;
        const weeksInTrimester = trimester === 1 ? 13 : trimester === 2 ? 14 : 13;
        startDate = subtractDaysFromDate(endDate, weeksInTrimester * 7 - 1);
        break;
      default:
        startDate = subtractDaysFromDate(endDate, 6);
    }

    return { startDate, endDate };
  };

  const prepareReportData = (type: ReportType): ReportData | null => {
    if (!user) return null;

    const { startDate, endDate } = getDateRange(type);

    // Normalizar datas para comparação (apenas data, sem hora)
    const normalizeDate = (date: Date): Date => {
      const normalized = new Date(date);
      normalized.setHours(0, 0, 0, 0);
      return normalized;
    };

    const normalizedStart = normalizeDate(startDate);
    const normalizedEnd = normalizeDate(endDate);

    // Coletar dados diários do período
    const dailyNutrition: any[] = [];
    const daysDiff = Math.floor((normalizedEnd.getTime() - normalizedStart.getTime()) / (1000 * 60 * 60 * 24));
    
    for (let i = 0; i <= daysDiff; i++) {
      const date = new Date(normalizedStart);
      date.setDate(date.getDate() + i);
      const nutrition = getDailyNutrition(date);
      dailyNutrition.push(nutrition);
    }

    // Filtrar refeições e pesos do período
    const periodMeals = getAllMeals.filter((meal) => {
      const mealDate = normalizeDate(new Date(meal.date));
      return mealDate >= normalizedStart && mealDate <= normalizedEnd;
    });

    const periodWeights = weights.filter((entry) => {
      const entryDate = normalizeDate(new Date(entry.date));
      return entryDate >= normalizedStart && entryDate <= normalizedEnd;
    });

    console.log('Preparando relatório:', {
      type,
      startDate: normalizedStart.toISOString(),
      endDate: normalizedEnd.toISOString(),
      totalMeals: getAllMeals.length,
      periodMeals: periodMeals.length,
      totalWeights: weights.length,
      periodWeights: periodWeights.length,
      dailyNutritionDays: dailyNutrition.length,
    });

    return {
      user,
      startDate: normalizedStart,
      endDate: normalizedEnd,
      dailyNutrition,
      weightEntries: periodWeights,
      meals: periodMeals,
      type,
    };
  };

  const handleGenerateReport = async (type: ReportType) => {
    if (!user) {
      Alert.alert('Erro', 'Usuário não encontrado');
      return;
    }

    setLoading(true);
    try {
      // Recarregar dados antes de gerar o relatório
      await Promise.all([loadMeals(), loadWeights()]);
      
      const reportData = prepareReportData(type);
      if (!reportData) {
        throw new Error('Não foi possível preparar os dados do relatório');
      }

      // Verificar se há dados suficientes
      const hasData = reportData.dailyNutrition.some(d => d.calories > 0);
      if (!hasData) {
        Alert.alert(
          'Atenção',
          'Não há dados suficientes para gerar o relatório. Registre algumas refeições primeiro.'
        );
        setLoading(false);
        return;
      }

      console.log('Dados do relatório:', {
        meals: reportData.meals.length,
        weights: reportData.weightEntries.length,
        dailyNutrition: reportData.dailyNutrition.length,
        hasData,
      });

      const pdfUri = await generateReportPDF(reportData);
      
      // No web, o PDF é gerado via window.print(), então não precisa compartilhar
      if (Platform.OS !== 'web') {
        await shareReportPDF(pdfUri);
        Alert.alert('Sucesso', 'Relatório gerado e pronto para compartilhar!');
      } else {
        Alert.alert(
          'Relatório Gerado! 📄', 
          'Uma nova janela foi aberta com o relatório.\n\n' +
          'Para baixar o PDF:\n' +
          '1. Clique no botão "📥 Baixar PDF" no canto superior direito\n' +
          '2. O PDF será baixado automaticamente\n' +
          '3. Encontre o arquivo na pasta de Downloads\n\n' +
          'Depois você pode enviar o PDF ao seu médico!',
          [{ text: 'Entendi', style: 'default' }]
        );
      }
    } catch (error: any) {
      const appError = handleError(error);
      Alert.alert('Erro', appError.userMessage);
      console.error('Erro ao gerar relatório:', error);
    } finally {
      setLoading(false);
    }
  };

  const reportTypes: Array<{ type: ReportType; label: string; icon: string; description: string }> = [
    {
      type: 'weekly',
      label: 'Semanal',
      icon: '📅',
      description: 'Últimos 7 dias',
    },
    {
      type: 'monthly',
      label: 'Mensal',
      icon: '📆',
      description: 'Últimos 30 dias',
    },
    {
      type: 'trimester',
      label: 'Trimestral',
      icon: '📊',
      description: 'Trimestre atual',
    },
  ];

  if (!user) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const { startDate, endDate } = getDateRange(selectedType);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Relatórios</Text>
          <Text style={styles.subtitle}>
            Gere relatórios profissionais para seu médico
          </Text>
        </View>

        <Card style={styles.infoCard}>
          <Text style={styles.infoTitle}>📄 Sobre os Relatórios</Text>
          <Text style={styles.infoText}>
            Os relatórios incluem análise nutricional completa, evolução de peso,
            padrões alimentares e recomendações personalizadas baseadas no seu
            trimestre gestacional.
          </Text>
        </Card>

        <Card style={styles.typesCard}>
          <Text style={styles.sectionTitle}>Tipo de Relatório</Text>
          {reportTypes.map((reportType) => (
            <TouchableOpacity
              key={reportType.type}
              style={[
                styles.typeButton,
                selectedType === reportType.type && styles.typeButtonSelected,
              ]}
              onPress={() => setSelectedType(reportType.type)}
            >
              <Text style={styles.typeIcon}>{reportType.icon}</Text>
              <View style={styles.typeInfo}>
                <Text
                  style={[
                    styles.typeLabel,
                    selectedType === reportType.type && styles.typeLabelSelected,
                  ]}
                >
                  {reportType.label}
                </Text>
                <Text style={styles.typeDescription}>{reportType.description}</Text>
              </View>
              {selectedType === reportType.type && (
                <Text style={styles.typeCheck}>✓</Text>
              )}
            </TouchableOpacity>
          ))}
        </Card>

        <Card style={styles.previewCard}>
          <Text style={styles.sectionTitle}>Período Selecionado</Text>
          <View style={styles.previewRow}>
            <Text style={styles.previewLabel}>De:</Text>
            <Text style={styles.previewValue}>{formatDate(startDate)}</Text>
          </View>
          <View style={styles.previewRow}>
            <Text style={styles.previewLabel}>Até:</Text>
            <Text style={styles.previewValue}>{formatDate(endDate)}</Text>
          </View>
        </Card>

        <Button
          title={loading ? 'Gerando Relatório...' : 'Gerar e Compartilhar PDF'}
          onPress={() => handleGenerateReport(selectedType)}
          disabled={loading}
          style={styles.generateButton}
        />

        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.loadingText}>Gerando relatório...</Text>
          </View>
        )}
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
    padding: theme.spacing.md,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
  },
  header: {
    marginBottom: theme.spacing.lg,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  infoCard: {
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.secondaryLight,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.secondary,
  },
  infoTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  infoText: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  typesCard: {
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  typeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.divider,
    marginBottom: theme.spacing.sm,
  },
  typeButtonSelected: {
    backgroundColor: theme.colors.primaryLight,
    borderColor: theme.colors.primary,
  },
  typeIcon: {
    fontSize: 32,
    marginRight: theme.spacing.md,
  },
  typeInfo: {
    flex: 1,
  },
  typeLabel: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: '500',
    marginBottom: theme.spacing.xs,
  },
  typeLabelSelected: {
    color: theme.colors.primaryDark,
    fontWeight: '600',
  },
  typeDescription: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  typeCheck: {
    ...theme.typography.h2,
    color: theme.colors.primary,
  },
  previewCard: {
    marginBottom: theme.spacing.md,
  },
  previewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  previewLabel: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  previewValue: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: '600',
  },
  generateButton: {
    marginBottom: theme.spacing.md,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

