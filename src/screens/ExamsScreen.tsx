// Tela de registro e histórico de exames médicos

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
import { Card, Button } from '../components';
import { useExamsStore, useUserStore } from '../store';
import { ExamType } from '../types';
import { formatDate, formatDateTime } from '../utils';
import * as Sharing from 'expo-sharing';
import { generateExamPDF, generateMultipleExamsPDF, shareExamPDF } from '../services/examGenerator';

const EXAM_TYPES: Record<ExamType, { label: string; icon: string }> = {
  blood: { label: 'Exame de Sangue', icon: '🩸' },
  urine: { label: 'Exame de Urina', icon: '💧' },
  ultrasound: { label: 'Ultrassom', icon: '👶' },
  other: { label: 'Outro', icon: '📋' },
};

export function ExamsScreen() {
  const navigation = useNavigation();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedType, setSelectedType] = useState<ExamType | null>(null);
  const [examName, setExamName] = useState('');
  const [doctor, setDoctor] = useState('');
  const [clinic, setClinic] = useState('');
  const [notes, setNotes] = useState('');
  const [results, setResults] = useState('');
  const [examDate, setExamDate] = useState(new Date());
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const user = useUserStore((state) => state.user);
  const entries = useExamsStore((state) => state.entries);
  const loadExams = useExamsStore((state) => state.loadExams);
  const addExam = useExamsStore((state) => state.addExam);
  const removeExam = useExamsStore((state) => state.removeExam);
  const getExamsByDate = useExamsStore((state) => state.getExamsByDate);

  const today = new Date();
  const todayExams = getExamsByDate(today);

  useEffect(() => {
    loadExams();
  }, []);

  const error = useExamsStore((state) => state.error);
  const clearError = useExamsStore((state) => state.clearError);

  const handleSave = async () => {
    if (!examName.trim()) {
      Alert.alert('Atenção', 'Digite o nome do exame');
      return;
    }

    if (!selectedType) {
      Alert.alert('Atenção', 'Selecione o tipo de exame');
      return;
    }

    if (!user) {
      Alert.alert('Erro', 'Usuário não encontrado');
      return;
    }

    clearError();
    setIsSaving(true);

    try {
      await addExam({
        userId: user.id,
        name: examName.trim(),
        type: selectedType,
        date: examDate,
        doctor: doctor.trim() || undefined,
        clinic: clinic.trim() || undefined,
        notes: notes.trim() || undefined,
        results: results.trim() || undefined,
      });

      Alert.alert('Sucesso', 'Exame registrado com sucesso!');
      setShowAddModal(false);
      resetForm();
      clearError();
    } catch (error) {
      const errorMessage = 
        error instanceof Error ? error.message : 'Não foi possível registrar o exame';
      Alert.alert('Erro', errorMessage);
      console.error('Erro ao registrar exame:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    setExamName('');
    setSelectedType(null);
    setDoctor('');
    setClinic('');
    setNotes('');
    setResults('');
    setExamDate(new Date());
  };

  const handleRemove = (entryId: string, examName: string) => {
    Alert.alert(
      'Remover Exame',
      `Deseja remover o exame "${examName}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeExam(entryId);
              Alert.alert('Sucesso', 'Exame removido');
            } catch (error) {
              const errorMessage = 
                error instanceof Error ? error.message : 'Não foi possível remover o exame';
              Alert.alert('Erro', errorMessage);
            }
          },
        },
      ]
    );
  };

  const handleShare = async (exam: any) => {
    try {
      // Se tiver arquivo, compartilha o arquivo
      if (exam.fileUri) {
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          await Sharing.shareAsync(exam.fileUri);
        } else {
          Alert.alert('Atenção', 'Compartilhamento não disponível neste dispositivo');
        }
      } else {
        // Compartilha informações do exame como texto
        const shareText = `📋 Exame: ${exam.name}\n` +
          `📅 Data: ${formatDate(exam.date)}\n` +
          `${exam.type ? `Tipo: ${EXAM_TYPES[exam.type].label}\n` : ''}` +
          `${exam.doctor ? `Médico: ${exam.doctor}\n` : ''}` +
          `${exam.clinic ? `Clínica: ${exam.clinic}\n` : ''}` +
          `${exam.results ? `Resultados: ${exam.results}\n` : ''}` +
          `${exam.notes ? `Observações: ${exam.notes}` : ''}`;

        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          await Sharing.shareAsync({ message: shareText });
        } else {
          Alert.alert('Atenção', 'Compartilhamento não disponível neste dispositivo');
        }
      }
    } catch (error) {
      console.error('Erro ao compartilhar exame:', error);
      Alert.alert('Erro', 'Não foi possível compartilhar o exame');
    }
  };

  const handleGeneratePDF = async (exam: any) => {
    setIsGeneratingPDF(true);
    try {
      const pdfUri = await generateExamPDF(exam, user || undefined);
      await shareExamPDF(pdfUri);
      Alert.alert('Sucesso', 'PDF gerado e pronto para compartilhar!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Não foi possível gerar o PDF';
      Alert.alert('Erro', errorMessage);
      console.error('Erro ao gerar PDF do exame:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleGenerateAllPDFs = async () => {
    if (entries.length === 0) {
      Alert.alert('Atenção', 'Nenhum exame registrado para gerar PDF');
      return;
    }

    setIsGeneratingPDF(true);
    try {
      const pdfUri = await generateMultipleExamsPDF(entries, user || undefined);
      await shareExamPDF(pdfUri);
      Alert.alert('Sucesso', 'PDF com todos os exames gerado e pronto para compartilhar!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Não foi possível gerar o PDF';
      Alert.alert('Erro', errorMessage);
      console.error('Erro ao gerar PDF dos exames:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Agrupar exames por data
  const groupedExams = entries.reduce((acc, exam) => {
    const dateKey = formatDate(new Date(exam.date));
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(exam);
    return acc;
  }, {} as Record<string, typeof entries>);

  const sortedDates = Object.keys(groupedExams).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Exames Médicos</Text>
          <Text style={styles.subtitle}>
            Registre e acompanhe seus exames durante a gestação
          </Text>
        </View>

        {todayExams.length > 0 && (
          <Card style={styles.todayCard}>
            <Text style={styles.todayTitle}>📅 Exames de Hoje</Text>
            {todayExams.map((exam) => (
              <View key={exam.id} style={styles.todayItem}>
                <Text style={styles.todayItemName}>{exam.name}</Text>
                <Text style={styles.todayItemType}>
                  {EXAM_TYPES[exam.type].icon} {EXAM_TYPES[exam.type].label}
                </Text>
              </View>
            ))}
          </Card>
        )}

        <View style={styles.actionsRow}>
          <Button
            title="➕ Adicionar Exame"
            onPress={() => setShowAddModal(true)}
            style={[styles.addButton, { flex: 1, marginRight: theme.spacing.xs }]}
          />
          {entries.length > 0 && (
            <Button
              title={isGeneratingPDF ? 'Gerando...' : '📄 PDF Todos'}
              onPress={handleGenerateAllPDFs}
              disabled={isGeneratingPDF}
              style={[styles.pdfButton, { flex: 1, marginLeft: theme.spacing.xs }]}
            />
          )}
        </View>

        {sortedDates.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText}>Nenhum exame registrado ainda</Text>
            <Text style={styles.emptySubtext}>
              Toque no botão acima para registrar seu primeiro exame
            </Text>
          </Card>
        ) : (
          <View style={styles.historySection}>
            <Text style={styles.sectionTitle}>Histórico de Exames</Text>
            {sortedDates.map((dateKey) => (
              <Card key={dateKey} style={styles.dateCard}>
                <Text style={styles.dateLabel}>{dateKey}</Text>
                {groupedExams[dateKey].map((exam) => (
                  <View key={exam.id} style={styles.examItem}>
                    <View style={styles.examHeader}>
                      <View style={styles.examInfo}>
                        <Text style={styles.examName}>{exam.name}</Text>
                        <Text style={styles.examType}>
                          {EXAM_TYPES[exam.type].icon} {EXAM_TYPES[exam.type].label}
                        </Text>
                        {exam.doctor && (
                          <Text style={styles.examDetail}>👨‍⚕️ {exam.doctor}</Text>
                        )}
                        {exam.clinic && (
                          <Text style={styles.examDetail}>🏥 {exam.clinic}</Text>
                        )}
                        {exam.results && (
                          <Text style={styles.examResults} numberOfLines={2}>
                            📊 {exam.results}
                          </Text>
                        )}
                        {exam.notes && (
                          <Text style={styles.examNotes} numberOfLines={2}>
                            📝 {exam.notes}
                          </Text>
                        )}
                      </View>
                    </View>
                    <View style={styles.examActions}>
                      <TouchableOpacity
                        style={styles.pdfButton}
                        onPress={() => handleGeneratePDF(exam)}
                        disabled={isGeneratingPDF}
                      >
                        <Text style={styles.pdfButtonText}>
                          {isGeneratingPDF ? '⏳' : '📄'} PDF
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.shareButton}
                        onPress={() => handleShare(exam)}
                      >
                        <Text style={styles.shareButtonText}>📤 Compartilhar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => handleRemove(exam.id, exam.name)}
                      >
                        <Text style={styles.removeButtonText}>🗑️ Remover</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </Card>
            ))}
          </View>
        )}

        {/* Modal de Adicionar Exame */}
        <Modal
          visible={showAddModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowAddModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <ScrollView>
                <Text style={styles.modalTitle}>Adicionar Exame</Text>

                <Text style={styles.inputLabel}>Nome do Exame *</Text>
                <TextInput
                  style={styles.input}
                  value={examName}
                  onChangeText={setExamName}
                  placeholder="Ex: Hemograma completo"
                  placeholderTextColor={theme.colors.textSecondary}
                />

                <Text style={styles.inputLabel}>Tipo de Exame *</Text>
                <View style={styles.typeSelector}>
                  {Object.entries(EXAM_TYPES).map(([type, info]) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.typeOption,
                        selectedType === type && styles.typeOptionSelected,
                      ]}
                      onPress={() => setSelectedType(type as ExamType)}
                    >
                      <Text style={styles.typeOptionIcon}>{info.icon}</Text>
                      <Text
                        style={[
                          styles.typeOptionText,
                          selectedType === type && styles.typeOptionTextSelected,
                        ]}
                      >
                        {info.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.inputLabel}>Médico</Text>
                <TextInput
                  style={styles.input}
                  value={doctor}
                  onChangeText={setDoctor}
                  placeholder="Nome do médico"
                  placeholderTextColor={theme.colors.textSecondary}
                />

                <Text style={styles.inputLabel}>Clínica</Text>
                <TextInput
                  style={styles.input}
                  value={clinic}
                  onChangeText={setClinic}
                  placeholder="Nome da clínica"
                  placeholderTextColor={theme.colors.textSecondary}
                />

                <Text style={styles.inputLabel}>Resultados</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={results}
                  onChangeText={setResults}
                  placeholder="Digite os resultados do exame"
                  placeholderTextColor={theme.colors.textSecondary}
                  multiline
                  numberOfLines={4}
                />

                <Text style={styles.inputLabel}>Observações</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="Observações adicionais"
                  placeholderTextColor={theme.colors.textSecondary}
                  multiline
                  numberOfLines={3}
                />

                <View style={styles.modalActions}>
                  <Button
                    title="Cancelar"
                    onPress={() => {
                      setShowAddModal(false);
                      resetForm();
                    }}
                    style={[styles.modalButton, styles.cancelButton]}
                  />
                  <Button
                    title={isSaving ? 'Salvando...' : 'Salvar'}
                    onPress={handleSave}
                    disabled={isSaving}
                    style={styles.modalButton}
                  />
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
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
  todayCard: {
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.primaryLight,
  },
  todayTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  todayItem: {
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.xs,
  },
  todayItemName: {
    ...theme.typography.body,
    fontWeight: '600',
    color: theme.colors.text,
  },
  todayItemType: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  actionsRow: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
  },
  addButton: {
    marginBottom: 0,
  },
  pdfButton: {
    backgroundColor: theme.colors.secondary,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
  },
  pdfButtonText: {
    ...theme.typography.bodySmall,
    color: theme.colors.surface,
    fontWeight: '600',
  },
  emptyCard: {
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyText: {
    ...theme.typography.h3,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  emptySubtext: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  historySection: {
    marginTop: theme.spacing.md,
  },
  sectionTitle: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  dateCard: {
    marginBottom: theme.spacing.md,
  },
  dateLabel: {
    ...theme.typography.h3,
    color: theme.colors.primary,
    marginBottom: theme.spacing.md,
  },
  examItem: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.divider,
  },
  examHeader: {
    marginBottom: theme.spacing.sm,
  },
  examInfo: {
    marginBottom: theme.spacing.sm,
  },
  examName: {
    ...theme.typography.body,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  examType: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  examDetail: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  examResults: {
    ...theme.typography.bodySmall,
    color: theme.colors.text,
    marginTop: theme.spacing.xs,
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.primaryLight,
    borderRadius: theme.borderRadius.sm,
  },
  examNotes: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    fontStyle: 'italic',
  },
  examActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: theme.spacing.sm,
  },
  shareButton: {
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.borderRadius.sm,
  },
  shareButtonText: {
    ...theme.typography.bodySmall,
    color: theme.colors.surface,
    fontWeight: '600',
  },
  removeButton: {
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.error,
    borderRadius: theme.borderRadius.sm,
  },
  removeButtonText: {
    ...theme.typography.bodySmall,
    color: theme.colors.surface,
    fontWeight: '600',
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
  },
  inputLabel: {
    ...theme.typography.body,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    marginTop: theme.spacing.md,
  },
  input: {
    ...theme.typography.body,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.divider,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    color: theme.colors.text,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  typeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  typeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.divider,
    minWidth: '45%',
  },
  typeOptionSelected: {
    backgroundColor: theme.colors.primaryLight,
    borderColor: theme.colors.primary,
  },
  typeOptionIcon: {
    fontSize: 24,
    marginRight: theme.spacing.xs,
  },
  typeOptionText: {
    ...theme.typography.bodySmall,
    color: theme.colors.text,
  },
  typeOptionTextSelected: {
    color: theme.colors.primaryDark,
    fontWeight: '600',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  modalButton: {
    flex: 1,
  },
  cancelButton: {
    backgroundColor: theme.colors.textSecondary,
  },
});

