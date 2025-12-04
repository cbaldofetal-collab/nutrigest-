# Guia de Testes - NutriGest

## Configuração

Os testes estão configurados usando Jest e React Native Testing Library.

### Instalação das Dependências

```bash
npm install
```

As seguintes dependências de teste já estão incluídas:
- `jest` - Framework de testes
- `jest-expo` - Preset do Jest para Expo
- `@testing-library/react-native` - Utilitários para testar componentes React Native
- `@testing-library/jest-native` - Matchers adicionais para Jest

## Executando os Testes

### Executar todos os testes
```bash
npm test
```

### Executar testes em modo watch
```bash
npm run test:watch
```

### Executar testes com cobertura
```bash
npm run test:coverage
```

## Estrutura de Testes

Os testes estão organizados em pastas `__tests__` próximas aos arquivos que testam:

```
src/
  utils/
    __tests__/
      nutrition.test.ts
      date.test.ts
  store/
    __tests__/
      useMealsStore.test.ts
```

## Testes Implementados

### Utilitários de Nutrição (`src/utils/__tests__/nutrition.test.ts`)
- ✅ `calculateNutritionFromMeals` - Cálculo de nutrição de refeições
- ✅ `calculateProgress` - Cálculo de progresso de nutrientes
- ✅ `isNutrientLow` - Verificação de nutrientes baixos
- ✅ `calculateBMI` - Cálculo de IMC
- ✅ `getBMICategory` - Categorização de IMC
- ✅ `formatNutrient` - Formatação de valores nutricionais
- ✅ `calculateAverageNutrition` - Cálculo de média nutricional

### Utilitários de Data (`src/utils/__tests__/date.test.ts`)
- ✅ `formatDate` - Formatação de datas
- ✅ `formatDateTime` - Formatação de data e hora
- ✅ `isSameDate` - Comparação de datas
- ✅ `getTrimester` - Cálculo de trimestre gestacional
- ✅ `getTrimesterLabel` - Label do trimestre

### Store de Refeições (`src/store/__tests__/useMealsStore.test.ts`)
- ✅ `addMeal` - Adicionar refeição
- ✅ `removeMeal` - Remover refeição
- ✅ `getMealsByDate` - Buscar refeições por data
- ✅ `loadMeals` - Carregar refeições do storage
- ✅ Validação de dados

## Próximos Testes a Implementar

- [ ] Testes para outros stores (useUserStore, useWeightStore, etc.)
- [ ] Testes para componentes React Native
- [ ] Testes de integração
- [ ] Testes E2E

## Notas

- Os testes usam mocks para o AsyncStorage
- Os stores do Zustand são testados diretamente usando `getState()`
- Os utilitários são testados de forma isolada sem dependências externas

