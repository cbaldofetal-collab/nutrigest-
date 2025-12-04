// Componente para seleção de sintoma e intensidade

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../theme';
import { SymptomType } from '../types';
import { SYMPTOM_TYPES, INTENSITY_LEVELS } from '../constants';

interface SymptomSelectorProps {
  selectedSymptom: SymptomType | null;
  selectedIntensity: 1 | 2 | 3 | 4 | 5 | null;
  onSymptomSelect: (symptom: SymptomType) => void;
  onIntensitySelect: (intensity: 1 | 2 | 3 | 4 | 5) => void;
}

export function SymptomSelector({
  selectedSymptom,
  selectedIntensity,
  onSymptomSelect,
  onIntensitySelect,
}: SymptomSelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Tipo de Sintoma *</Text>
      <View style={styles.symptomsGrid}>
        {(Object.keys(SYMPTOM_TYPES) as SymptomType[]).map((type) => {
          const symptomInfo = SYMPTOM_TYPES[type];
          const isSelected = selectedSymptom === type;

          return (
            <TouchableOpacity
              key={type}
              style={[styles.symptomButton, isSelected && styles.symptomButtonSelected]}
              onPress={() => onSymptomSelect(type)}
              accessibilityRole="button"
              accessibilityLabel={symptomInfo.label}
              accessibilityHint={`Seleciona ${symptomInfo.label} como tipo de sintoma`}
              accessibilityState={{ selected: isSelected }}
            >
              <Text style={styles.symptomEmoji}>{symptomInfo.icon}</Text>
              <Text
                style={[
                  styles.symptomLabel,
                  isSelected && styles.symptomLabelSelected,
                ]}
              >
                {symptomInfo.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {selectedSymptom && (
        <View style={styles.intensityContainer}>
          <Text style={styles.label}>Intensidade *</Text>
          <View style={styles.intensityButtons}>
            {(Object.keys(INTENSITY_LEVELS) as Array<keyof typeof INTENSITY_LEVELS>).map(
              (level) => {
                const intensityInfo = INTENSITY_LEVELS[level];
                const isSelected = selectedIntensity === level;

                return (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.intensityButton,
                      isSelected && {
                        backgroundColor: intensityInfo.color,
                        borderColor: intensityInfo.color,
                      },
                    ]}
                    onPress={() => onIntensitySelect(level)}
                    accessibilityRole="button"
                    accessibilityLabel={`Intensidade ${intensityInfo.label}`}
                    accessibilityHint={`Seleciona intensidade ${intensityInfo.label} para o sintoma`}
                    accessibilityState={{ selected: isSelected }}
                  >
                    <Text
                      style={[
                        styles.intensityLabel,
                        isSelected && styles.intensityLabelSelected,
                      ]}
                    >
                      {intensityInfo.label}
                    </Text>
                  </TouchableOpacity>
                );
              }
            )}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  label: {
    ...theme.typography.body,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    fontWeight: '500',
  },
  symptomsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  symptomButton: {
    flex: 1,
    minWidth: '30%',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.divider,
    alignItems: 'center',
    justifyContent: 'center',
  },
  symptomButtonSelected: {
    backgroundColor: theme.colors.primaryLight,
    borderColor: theme.colors.primary,
  },
  symptomEmoji: {
    fontSize: 32,
    marginBottom: theme.spacing.xs,
  },
  symptomLabel: {
    ...theme.typography.bodySmall,
    color: theme.colors.text,
    textAlign: 'center',
  },
  symptomLabelSelected: {
    color: theme.colors.primaryDark,
    fontWeight: '600',
  },
  intensityContainer: {
    marginTop: theme.spacing.md,
  },
  intensityButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  intensityButton: {
    flex: 1,
    minWidth: '18%',
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.divider,
    alignItems: 'center',
  },
  intensityLabel: {
    ...theme.typography.caption,
    color: theme.colors.text,
    textAlign: 'center',
  },
  intensityLabelSelected: {
    color: theme.colors.surface,
    fontWeight: '600',
  },
});

