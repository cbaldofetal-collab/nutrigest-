// Componente para registro de peso

import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { theme } from '../theme';
import { Button } from './Button';

interface WeightInputProps {
  initialWeight?: number;
  onSave: (weight: number, notes?: string) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function WeightInput({ initialWeight, onSave, onCancel, isLoading = false }: WeightInputProps) {
  const [weight, setWeight] = useState(initialWeight?.toString() || '');
  const [notes, setNotes] = useState('');

  const handleSave = () => {
    const weightValue = parseFloat(weight);
    if (isNaN(weightValue) || weightValue <= 0) {
      Alert.alert('Atenção', 'Por favor, insira um peso válido');
      return;
    }

    if (weightValue > 200) {
      Alert.alert('Atenção', 'Por favor, verifique o peso inserido');
      return;
    }

    onSave(weightValue, notes.trim() || undefined);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Peso (kg)</Text>
      <TextInput
        style={styles.input}
        value={weight}
        onChangeText={setWeight}
        keyboardType="decimal-pad"
        placeholder="Ex: 65.5"
        placeholderTextColor={theme.colors.textSecondary}
        autoFocus
        accessibilityLabel="Peso em quilogramas"
        accessibilityHint="Digite seu peso atual em quilogramas"
        accessibilityRole="text"
      />

      <Text style={styles.label}>Observações (opcional)</Text>
      <TextInput
        style={[styles.input, styles.notesInput]}
        value={notes}
        onChangeText={setNotes}
        placeholder="Ex: Após o café da manhã"
        placeholderTextColor={theme.colors.textSecondary}
        multiline
        numberOfLines={3}
        accessibilityLabel="Observações sobre o peso"
        accessibilityHint="Adicione observações opcionais sobre o registro de peso"
        accessibilityRole="text"
      />

      <View style={styles.buttons}>
        <Button
          title="Cancelar"
          onPress={onCancel}
          variant="outline"
          style={styles.cancelButton}
        />
        <Button
          title="Salvar"
          onPress={handleSave}
          style={styles.saveButton}
          loading={isLoading}
          disabled={isLoading}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.md,
  },
  label: {
    ...theme.typography.body,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    fontWeight: '500',
  },
  input: {
    ...theme.typography.h2,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.divider,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  notesInput: {
    ...theme.typography.body,
    height: 80,
    textAlignVertical: 'top',
  },
  buttons: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  cancelButton: {
    flex: 1,
  },
  saveButton: {
    flex: 1,
  },
});

