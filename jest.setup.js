// Configuração global do Jest para React Native
import '@testing-library/jest-native/extend-expect';

// Mock do AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock de módulos do Expo
jest.mock('expo-constants', () => ({
  default: {
    expoConfig: {},
  },
}));

