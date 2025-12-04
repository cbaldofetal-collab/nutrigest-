// Tela de registro e histórico de sintomas

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../theme';
import { Card, Button, SymptomSelector } from '../components';
import { useSymptomsStore } from '../store';
import { SymptomType } from '../types';
import { SYMPTOM_TYPES, INTENSITY_LEVELS } from '../constants';
import { formatDate, formatDateTime } from '../utils';

export function SymptomsScreen() {
  const navigation = useNavigation();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSymptom, setSelectedSymptom] = useState<SymptomType | null>(null);
  const [selectedIntensity, setSelectedIntensity] = useState<1 | 2 | 3 | 4 | 5 | null>(null);
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const entries = useSymptomsStore((state) => state.entries);
  const loadSymptoms = useSymptomsStore((state) => state.loadSymptoms);
  const addSymptom = useSymptomsStore((state) => state.addSymptom);
  const removeSymptom = useSymptomsStore((state) => state.removeSymptom);
  const getSymptomsByDate = useSymptomsStore((state) => state.getSymptomsByDate);

  const today = new Date();
  const todaySymptoms = getSymptomsByDate(today);

  useEffect(() => {
    loadSymptoms();
  }, []);

  const error = useSymptomsStore((state) => state.error);
  const clearError = useSymptomsStore((state) => state.clearError);

  const handleSave = async () => {
    if (!selectedSymptom) {
      Alert.alert('Atenção', 'Selecione um tipo de sintoma');
      return;
    }

    if (!selectedIntensity) {
      Alert.alert('Atenção', 'Selecione a intensidade do sintoma');
      return;
    }

    clearError();
    setIsSaving(true);

    try {
      await addSymptom({
        userId: 'current_user',
        type: selectedSymptom,
        intensity: selectedIntensity,
        date: new Date(),
        notes: notes.trim() || undefined,
      });

      Alert.alert('Sucesso', 'Sintoma registrado com sucesso!');
      setShowAddModal(false);
      setSelectedSymptom(null);
      setSelectedIntensity(null);
      setNotes('');
      clearError();
    } catch (error) {
      const errorMessage = 
        error instanceof Error ? error.message : 'Não foi possível registrar o sintoma';
      Alert.alert('Erro', errorMessage);
      console.error('Erro ao registrar sintoma:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemove = (entryId: string, symptomType: string) => {
    Alert.alert(
      'Remover Sintoma',
      `Deseja remover este registro de ${symptomType}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            await removeSymptom(entryId);
            Alert.alert('Sucesso', 'Sintoma removido');
          },
        },
      ]
    );
  };

  // Agrupar sintomas por data
  const groupedByDate = entries.reduce((acc, entry) => {
    const dateKey = formatDate(entry.date);
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(entry);
    return acc;
  }, {} as Record<string, typeof entries>);

  const sortedDates = Object.keys(groupedByDate).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Sintomas</Text>
          <Text style={styles.subtitle}>
            Registre sintomas e acompanhe padrões
          </Text>
        </View>

        <Card style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View>
              <Text style={styles.summaryLabel}>Hoje</Text>
              <Text style={styles.summaryValue}>{todaySymptoms.length}</Text>
            </View>
            <View>
              <Text style={styles.summaryLabel}>Total</Text>
              <Text style={styles.summaryValue}>{entries.length}</Text>
            </View>
          </View>
        </Card>

        <Button
          title="+ Registrar Sintoma"
          onPress={() => setShowAddModal(true)}
          style={styles.addButton}
        />

        {sortedDates.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText}>Nenhum sintoma registrado ainda</Text>
            <Text style={styles.emptySubtext}>
              Registre sintomas para acompanhar padrões e correlacionar com sua alimentação
            </Text>
          </Card>
        ) : (
          sortedDates.map((dateKey) => {
            const dateSymptoms = groupedByDate[dateKey];
            const isToday = dateKey === formatDate(today);

            return (
              <Card key={dateKey} style={styles.dateCard}>
                <Text style={styles.dateTitle}>
                  {isToday ? 'Hoje' : dateKey}
                </Text>
                {dateSymptoms.map((entry) => {
                  const symptomInfo = SYMPTOM_TYPES[entry.type];
                  const intensityInfo = INTENSITY_LEVELS[entry.intensity];

                  return (
                    <View key={entry.id} style={styles.symptomEntry}>
                      <View style={styles.symptomInfo}>
                        <Text style={styles.symptomEmoji}>{symptomInfo.icon}</Text>
                        <View style={styles.symptomDetails}>
                          <Text style={styles.symptomName}>{symptomInfo.label}</Text>
                          <View style={styles.symptomMeta}>
                            <View
                              style={[
                                styles.intensityBadge,
                                { backgroundColor: intensityInfo.color + '20' },
                              ]}
                            >
                              <Text
                                style={[
                                  styles.intensityText,
                                  { color: intensityInfo.color },
                                ]}
                              >
                                {intensityInfo.label}
                              </Text>
                            </View>
                            <Text style={styles.symptomTime}>
                              {formatDateTime(entry.date)}
                            </Text>
                          </View>
                          {entry.notes && (
                            <Text style={styles.symptomNotes}>{entry.notes}</Text>
                          )}
                        </View>
                      </View>
                      <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => handleRemove(entry.id, symptomInfo.label)}
                      >
                        <Text style={styles.removeButtonText}>×</Text>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </Card>
            );
          })
        )}
      </ScrollView>

      {/* Modal de Adicionar Sintoma */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Registrar Sintoma</Text>

            <SymptomSelector
              selectedSymptom={selectedSymptom}
              selectedIntensity={selectedIntensity}
              onSymptomSelect={setSelectedSymptom}
              onIntensitySelect={setSelectedIntensity}
            />

            <View style={styles.notesContainer}>
              <Text style={styles.label}>Observações (opcional)</Text>
              <TextInput
                style={styles.notesInput}
                value={notes}
                onChangeText={setNotes}
                placeholder="Ex: Após o almoço, antes de dormir..."
                placeholderTextColor={theme.colors.textSecondary}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.modalButtons}>
              <Button
                title="Cancelar"
                onPress={() => {
                  setShowAddModal(false);
                  setSelectedSymptom(null);
                  setSelectedIntensity(null);
                  setNotes('');
                }}
                variant="outline"
                style={styles.modalCancelButton}
              />
              <Button
                title="Salvar"
                onPress={handleSave}
                style={styles.modalSaveButton}
                loading={isSaving}
                disabled={isSaving}
              />
            </View>
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
  header: {
    marginBottom: theme.spacing.lg,
  },
  backButton: {
    ...theme.typography.body,
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
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
  summaryCard: {
    marginBottom: theme.spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  summaryValue: {
    ...theme.typography.h2,
    color: theme.colors.primary,
  },
  addButton: {
    marginBottom: theme.spacing.md,
  },
  emptyCard: {
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyText: {
    ...theme.typography.body,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  emptySubtext: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  dateCard: {
    marginBottom: theme.spacing.md,
  },
  dateTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  symptomEntry: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  symptomInfo: {
    flex: 1,
    flexDirection: 'row',
  },
  symptomEmoji: {
    fontSize: 32,
    marginRight: theme.spacing.sm,
  },
  symptomDetails: {
    flex: 1,
  },
  symptomName: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  symptomMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  intensityBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  intensityText: {
    ...theme.typography.caption,
    fontWeight: '600',
  },
  symptomTime: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  symptomNotes: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
    marginTop: theme.spacing.xs,
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.error + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    ...theme.typography.h2,
    color: theme.colors.error,
    lineHeight: 32,
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
    maxHeight: '90%',
  },
  modalTitle: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  notesContainer: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  label: {
    ...theme.typography.body,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    fontWeight: '500',
  },
  notesInput: {
    ...theme.typography.body,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.divider,
    color: theme.colors.text,
    height: 80,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  modalCancelButton: {
    flex: 1,
  },
  modalSaveButton: {
    flex: 1,
  },
});

