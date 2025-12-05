import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Modal,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../theme';
import { Card, Button, WeightInput, WaterIntakeButton } from '../components';
import { useUserStore, useWeightStore, useHydrationStore, useSymptomsStore, useExamsStore, useAuthStore } from '../store';
import { formatDate, getTrimesterLabel, calculateBMI } from '../utils';
import { WEIGHT_GAIN_RECOMMENDATIONS, SYMPTOM_TYPES } from '../constants';
import { logout } from '../services/auth';

export function ProfileScreen() {
  const navigation = useNavigation();
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [showWaterModal, setShowWaterModal] = useState(false);
  const [isSavingWeight, setIsSavingWeight] = useState(false);
  const [isAddingWater, setIsAddingWater] = useState(false);

  const user = useUserStore((state) => state.user);
  const loadUser = useUserStore((state) => state.loadUser);
  const updateUser = useUserStore((state) => state.updateUser);

  const weights = useWeightStore((state) => state.entries);
  const latestWeight = useWeightStore((state) => state.getLatestWeight());
  const addWeight = useWeightStore((state) => state.addWeight);
  const loadWeights = useWeightStore((state) => state.loadWeights);

  const todayWater = useHydrationStore((state) => state.getTodayWater());
  const addWater = useHydrationStore((state) => state.addWater);
  const loadHydration = useHydrationStore((state) => state.loadHydration);

  const symptoms = useSymptomsStore((state) => state.entries);
  const getSymptomsByDate = useSymptomsStore((state) => state.getSymptomsByDate);
  const loadSymptoms = useSymptomsStore((state) => state.loadSymptoms);

  const exams = useExamsStore((state) => state.entries);
  const getExamsByDate = useExamsStore((state) => state.getExamsByDate);
  const loadExams = useExamsStore((state) => state.loadExams);

  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);

  const today = new Date();
  const todaySymptoms = getSymptomsByDate(today);
  const todayExams = getExamsByDate(today);

  useEffect(() => {
    loadUser();
    loadWeights();
    loadHydration();
    loadSymptoms();
    loadExams();
  }, []);

  const weightError = useWeightStore((state) => state.error);
  const weightClearError = useWeightStore((state) => state.clearError);
  const hydrationError = useHydrationStore((state) => state.error);
  const hydrationClearError = useHydrationStore((state) => state.clearError);
  const userError = useUserStore((state) => state.error);
  const userClearError = useUserStore((state) => state.clearError);

  const handleSaveWeight = async (weight: number, notes?: string) => {
    if (!user) {
      Alert.alert('Erro', 'Usuário não encontrado');
      return;
    }

    weightClearError();
    userClearError();
    setIsSavingWeight(true);

    try {
      await addWeight({
        userId: user.id,
        weight,
        date: new Date(),
        notes,
      });

      // Atualizar peso atual do usuário
      await updateUser({ currentWeight: weight });

      setShowWeightModal(false);
      Alert.alert('Sucesso', 'Peso registrado com sucesso!');
    } catch (error) {
      const errorMessage = 
        weightError || 
        userError || 
        (error instanceof Error ? error.message : 'Não foi possível registrar o peso');
      Alert.alert('Erro', errorMessage);
      console.error('Erro ao registrar peso:', error);
    } finally {
      setIsSavingWeight(false);
    }
  };

  const handleAddWater = async (amount: number) => {
    hydrationClearError();
    setIsAddingWater(true);
    
    try {
      await addWater(amount);
      setShowWaterModal(false);
    } catch (error) {
      const errorMessage = 
        hydrationError || 
        (error instanceof Error ? error.message : 'Não foi possível registrar a água');
      Alert.alert('Erro', errorMessage);
      console.error('Erro ao registrar água:', error);
    } finally {
      setIsAddingWater(false);
    }
  };

  const getIdealWeightGain = () => {
    if (!user) return null;
    const category = user.initialBMI < 18.5
      ? 'underweight'
      : user.initialBMI < 25
      ? 'normal'
      : user.initialBMI < 30
      ? 'overweight'
      : 'obese';
    return WEIGHT_GAIN_RECOMMENDATIONS[category];
  };

  const getWeightGain = () => {
    if (!user || !latestWeight) return null;
    return latestWeight.weight - user.initialWeight;
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const idealGain = getIdealWeightGain();
  const currentGain = getWeightGain();
  const currentBMI = user.height > 0 ? calculateBMI(latestWeight?.weight || user.currentWeight, user.height) : 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Perfil</Text>
          <Text style={styles.subtitle}>
            {user.name} • {getTrimesterLabel(user.gestationalWeek)}
          </Text>
        </View>

        <Card style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Informações da Gestação</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Semana Gestacional:</Text>
            <Text style={styles.infoValue}>{user.gestationalWeek} semanas</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Data Prevista:</Text>
            <Text style={styles.infoValue}>{formatDate(user.dueDate)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Altura:</Text>
            <Text style={styles.infoValue}>{user.height} cm</Text>
          </View>
        </Card>

        <Card style={styles.weightCard}>
          <View style={styles.weightHeader}>
            <View>
              <Text style={styles.sectionTitle}>Peso</Text>
              <Text style={styles.currentWeight}>
                {latestWeight?.weight.toFixed(1) || user.currentWeight.toFixed(1)} kg
              </Text>
            </View>
            <Button
              title="Registrar"
              onPress={() => setShowWeightModal(true)}
              size="small"
            />
          </View>

          {idealGain && (
            <View style={styles.weightInfo}>
              <View style={styles.weightInfoRow}>
                <Text style={styles.weightLabel}>Peso Inicial:</Text>
                <Text style={styles.weightValue}>{user.initialWeight.toFixed(1)} kg</Text>
              </View>
              {currentGain !== null && (
                <View style={styles.weightInfoRow}>
                  <Text style={styles.weightLabel}>Ganho Atual:</Text>
                  <Text
                    style={[
                      styles.weightValue,
                      currentGain >= idealGain.min && currentGain <= idealGain.max
                        ? styles.weightValueGood
                        : styles.weightValueWarning,
                    ]}
                  >
                    {currentGain > 0 ? '+' : ''}
                    {currentGain.toFixed(1)} kg
                  </Text>
                </View>
              )}
              <View style={styles.weightInfoRow}>
                <Text style={styles.weightLabel}>Ganho Ideal:</Text>
                <Text style={styles.weightValue}>
                  {idealGain.min} - {idealGain.max} kg
                </Text>
              </View>
              {currentBMI > 0 && (
                <View style={styles.weightInfoRow}>
                  <Text style={styles.weightLabel}>IMC Atual:</Text>
                  <Text style={styles.weightValue}>{currentBMI.toFixed(1)}</Text>
                </View>
              )}
            </View>
          )}

          {weights.length > 0 && (
            <View style={styles.recentWeights}>
              <Text style={styles.recentTitle}>Registros Recentes</Text>
              {weights.slice(0, 5).map((entry) => (
                <View key={entry.id} style={styles.weightEntry}>
                  <Text style={styles.weightDate}>{formatDate(entry.date)}</Text>
                  <Text style={styles.weightAmount}>{entry.weight.toFixed(1)} kg</Text>
                </View>
              ))}
            </View>
          )}
        </Card>

        <Card style={styles.hydrationCard}>
          <View style={styles.hydrationHeader}>
            <View>
              <Text style={styles.sectionTitle}>💧 Hidratação Hoje</Text>
              <Text style={styles.waterAmount}>{todayWater.toFixed(0)} ml</Text>
            </View>
            <Button
              title="Adicionar"
              onPress={() => setShowWaterModal(true)}
              size="small"
            />
          </View>
        </Card>

        <Card style={styles.symptomsCard}>
          <View style={styles.symptomsHeader}>
            <View>
              <Text style={styles.sectionTitle}>🤒 Sintomas</Text>
              <Text style={styles.symptomsSubtitle}>
                {todaySymptoms.length > 0
                  ? `${todaySymptoms.length} registrado(s) hoje`
                  : 'Nenhum sintoma registrado hoje'}
              </Text>
            </View>
            <Button
              title={todaySymptoms.length > 0 ? 'Ver Todos' : 'Registrar'}
              onPress={() => navigation.navigate('SymptomsFromProfile' as never)}
              size="small"
            />
          </View>
          {todaySymptoms.length > 0 && (
            <View style={styles.symptomsPreview}>
              {todaySymptoms.slice(0, 3).map((symptom) => {
                const symptomInfo = SYMPTOM_TYPES[symptom.type];
                return (
                  <View key={symptom.id} style={styles.symptomPreviewItem}>
                    <Text style={styles.symptomPreviewEmoji}>{symptomInfo.icon}</Text>
                    <Text style={styles.symptomPreviewText}>{symptomInfo.label}</Text>
                  </View>
                );
              })}
            </View>
          )}
        </Card>

        <Card style={styles.symptomsCard}>
          <View style={styles.symptomsHeader}>
            <View>
              <Text style={styles.sectionTitle}>📋 Exames Médicos</Text>
              <Text style={styles.symptomsSubtitle}>
                {todayExams.length > 0
                  ? `${todayExams.length} exame(s) registrado(s) hoje`
                  : 'Nenhum exame registrado hoje'}
              </Text>
            </View>
            <Button
              title={todayExams.length > 0 ? 'Ver Todos' : 'Registrar'}
              onPress={() => navigation.navigate('ExamsFromProfile' as never)}
              size="small"
            />
          </View>
          {todayExams.length > 0 && (
            <View style={styles.symptomsPreview}>
              {todayExams.slice(0, 3).map((exam) => (
                <View key={exam.id} style={styles.symptomPreviewItem}>
                  <Text style={styles.symptomPreviewEmoji}>📋</Text>
                  <Text style={styles.symptomPreviewText} numberOfLines={1}>
                    {exam.name}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </Card>

        <Card style={styles.statsCard}>
          <Text style={styles.sectionTitle}>Estatísticas</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{weights.length}</Text>
              <Text style={styles.statLabel}>Registros de Peso</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{symptoms.length}</Text>
              <Text style={styles.statLabel}>Registros de Sintomas</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{exams.length}</Text>
              <Text style={styles.statLabel}>Exames Registrados</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {user.gestationalWeek > 0 ? Math.floor((user.gestationalWeek / 40) * 100) : 0}%
              </Text>
              <Text style={styles.statLabel}>Progresso</Text>
            </View>
          </View>
        </Card>

        <Card style={styles.logoutCard}>
          <Button
            title="Sair da Conta"
            onPress={handleLogout}
            variant="outline"
            style={styles.logoutButton}
          />
        </Card>
      </ScrollView>

      {/* Modal de Registro de Peso */}
      <Modal
        visible={showWeightModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowWeightModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Registrar Peso</Text>
            <WeightInput
              initialWeight={latestWeight?.weight}
              onSave={handleSaveWeight}
              onCancel={() => setShowWeightModal(false)}
              isLoading={isSavingWeight}
            />
          </View>
        </View>
      </Modal>

      {/* Modal de Adicionar Água */}
      <Modal
        visible={showWaterModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowWaterModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Adicionar Água</Text>
            <View style={styles.waterButtonsContainer}>
              <WaterIntakeButton amount={200} onPress={handleAddWater} disabled={isAddingWater} />
              <WaterIntakeButton amount={250} onPress={handleAddWater} disabled={isAddingWater} />
              <WaterIntakeButton amount={300} onPress={handleAddWater} disabled={isAddingWater} />
              <WaterIntakeButton amount={500} onPress={handleAddWater} disabled={isAddingWater} />
            </View>
            <Button
              title="Fechar"
              onPress={() => setShowWaterModal(false)}
              variant="outline"
              style={styles.closeButton}
            />
          </View>
        </View>
      </Modal>
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
  },
  header: {
    marginBottom: theme.spacing.lg,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  infoCard: {
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  infoLabel: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  infoValue: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: '600',
  },
  weightCard: {
    marginBottom: theme.spacing.md,
  },
  weightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  currentWeight: {
    ...theme.typography.h1,
    color: theme.colors.primary,
    marginTop: theme.spacing.xs,
  },
  weightInfo: {
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.divider,
  },
  weightInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  weightLabel: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  weightValue: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: '600',
  },
  weightValueGood: {
    color: theme.colors.success,
  },
  weightValueWarning: {
    color: theme.colors.warning,
  },
  recentWeights: {
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.divider,
  },
  recentTitle: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
  },
  weightEntry: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.xs,
  },
  weightDate: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  weightAmount: {
    ...theme.typography.bodySmall,
    color: theme.colors.text,
    fontWeight: '600',
  },
  hydrationCard: {
    marginBottom: theme.spacing.md,
  },
  hydrationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  waterAmount: {
    ...theme.typography.h2,
    color: theme.colors.secondary,
    marginTop: theme.spacing.xs,
  },
  statsCard: {
    marginBottom: theme.spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    ...theme.typography.h2,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  logoutCard: {
    marginBottom: theme.spacing.xl,
    marginTop: theme.spacing.md,
  },
  logoutButton: {
    borderColor: theme.colors.error,
  },
  symptomsCard: {
    marginBottom: theme.spacing.md,
  },
  symptomsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  symptomsSubtitle: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  symptomsPreview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  symptomPreviewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
    gap: theme.spacing.xs,
  },
  symptomPreviewEmoji: {
    fontSize: 16,
  },
  symptomPreviewText: {
    ...theme.typography.bodySmall,
    color: theme.colors.text,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    maxHeight: '80%',
  },
  modalTitle: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  waterButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  closeButton: {
    marginTop: theme.spacing.md,
  },
});

