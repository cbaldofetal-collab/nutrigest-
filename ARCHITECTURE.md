# Arquitetura do NutriGest

## Visão Geral

O NutriGest é construído usando **React Native** com **TypeScript** e **Expo**, seguindo uma arquitetura modular e escalável.

## Estrutura de Pastas

```
src/
├── components/       # Componentes reutilizáveis (Button, Card, etc.)
├── screens/          # Telas principais do app
├── navigation/       # Configuração de navegação
├── services/         # Serviços (API, storage, etc.)
├── utils/            # Funções utilitárias
├── types/            # Definições TypeScript
├── constants/        # Constantes e configurações
└── theme/            # Tema e estilos globais
```

## Princípios de Design

### 1. Separação de Responsabilidades
- **Screens**: Apenas lógica de apresentação e navegação
- **Services**: Lógica de negócio e comunicação com APIs
- **Utils**: Funções puras e reutilizáveis
- **Components**: Componentes reutilizáveis e sem estado

### 2. TypeScript First
- Todos os arquivos devem ter tipagem completa
- Interfaces e tipos centralizados em `types/`
- Evitar uso de `any` sempre que possível

### 3. Tema Centralizado
- Cores, espaçamentos e tipografia definidos em `theme/`
- Uso consistente do tema em todos os componentes
- Suporte a modo claro/escuro (futuro)

### 4. Armazenamento Local
- AsyncStorage para dados simples
- Sincronização offline-first
- Cache inteligente de dados nutricionais

## Fluxo de Dados

```
User Action → Screen → Service → Storage/API → State Update → UI Update
```

## Padrões de Código

### Nomenclatura
- Componentes: PascalCase (`Button.tsx`)
- Funções: camelCase (`calculateBMI`)
- Constantes: UPPER_SNAKE_CASE (`NUTRITION_TARGETS`)
- Arquivos: PascalCase para componentes, camelCase para utils

### Imports
- Usar path aliases definidos no `tsconfig.json`
- Agrupar imports: externos, internos, relativos
- Ordem: React → React Native → Bibliotecas → Internos

### Componentes
- Componentes funcionais com hooks
- Props tipadas com interfaces
- Estilos usando StyleSheet
- Tema acessado via `theme` import

## Próximos Passos

1. Implementar gerenciamento de estado (Zustand/Redux)
2. Adicionar testes unitários
3. Configurar CI/CD
4. Implementar analytics
5. Adicionar internacionalização (i18n)

