// Componente para input de quantidade de alimento

import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Food } from '../types';
import { theme } from '../theme';

interface FoodQuantityInputProps {
  food: Food;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
}

export function FoodQuantityInput({ food, quantity, onQuantityChange }: FoodQuantityInputProps) {
  const [inputValue, setInputValue] = useState(quantity.toString());

  const handleChange = (value: string) => {
    setInputValue(value);
    const numValue = parseFloat(value) || 0;
    onQuantityChange(numValue);
  };

  const adjustQuantity = (delta: number) => {
    const newQuantity = Math.max(0, quantity + delta);
    setInputValue(newQuantity.toString());
    onQuantityChange(newQuantity);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Quantidade</Text>
      <View style={styles.inputContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => adjustQuantity(-0.5)}
          disabled={quantity <= 0}
          accessibilityRole="button"
          accessibilityLabel="Diminuir quantidade"
          accessibilityHint="Diminui a quantidade em 0.5 porções"
          accessibilityState={{ disabled: quantity <= 0 }}
        >
          <Text style={styles.buttonText}>−</Text>
        </TouchableOpacity>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            value={inputValue}
            onChangeText={handleChange}
            keyboardType="decimal-pad"
            selectTextOnFocus
            accessibilityLabel={`Quantidade de ${food.name}`}
            accessibilityHint={`Digite a quantidade em ${food.servingUnit}`}
            accessibilityRole="text"
          />
          <Text style={styles.unit}>{food.servingUnit}</Text>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => adjustQuantity(0.5)}
          accessibilityRole="button"
          accessibilityLabel="Aumentar quantidade"
          accessibilityHint="Aumenta a quantidade em 0.5 porções"
        >
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.info}>
        {food.servingSize} {food.servingUnit} = {food.calories} kcal
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.md,
  },
  label: {
    ...theme.typography.body,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  button: {
    width: 44,
    height: 44,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    ...theme.typography.h3,
    color: theme.colors.surface,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.divider,
  },
  input: {
    ...theme.typography.h3,
    flex: 1,
    color: theme.colors.text,
    textAlign: 'center',
  },
  unit: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.xs,
  },
  info: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },
});

