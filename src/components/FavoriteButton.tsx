// Componente de botão de favorito

import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

interface FavoriteButtonProps {
  isFavorite: boolean;
  onPress: () => void;
  size?: 'small' | 'medium' | 'large';
}

export function FavoriteButton({ isFavorite, onPress, size = 'medium' }: FavoriteButtonProps) {
  const sizeStyles = {
    small: { fontSize: 20, padding: theme.spacing.xs },
    medium: { fontSize: 24, padding: theme.spacing.sm },
    large: { fontSize: 32, padding: theme.spacing.md },
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isFavorite && styles.buttonActive,
        sizeStyles[size],
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      accessibilityHint={isFavorite ? 'Toque duas vezes para remover este item dos favoritos' : 'Toque duas vezes para adicionar este item aos favoritos'}
      accessibilityState={{ selected: isFavorite }}
    >
      <Text style={styles.icon}>{isFavorite ? '⭐' : '☆'}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.divider,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonActive: {
    backgroundColor: theme.colors.warning + '20',
    borderColor: theme.colors.warning,
  },
  icon: {
    fontSize: 24,
  },
});

