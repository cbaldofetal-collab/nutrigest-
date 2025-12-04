# Changelog - NutriGest

## [0.5.0] - 2024-01-XX

### Adicionado
- ✅ Sistema completo de registro de sintomas
- ✅ Store de gerenciamento de sintomas (useSymptomsStore)
- ✅ Tela de sintomas (SymptomsScreen) com histórico completo
- ✅ Componente SymptomSelector para seleção de sintoma e intensidade
- ✅ Registro de sintomas com intensidade (1-5) e observações
- ✅ Histórico de sintomas agrupado por data
- ✅ Integração de sintomas no Dashboard
- ✅ Integração de sintomas no Perfil
- ✅ Visualização de sintomas do dia no Dashboard
- ✅ Tipos de sintomas: náusea, azia, desejos, aversões, cansaço, outros
- ✅ Níveis de intensidade com cores visuais

### Funcionalidades Implementadas

#### Registro de Sintomas
- Seleção de tipo de sintoma (6 tipos disponíveis)
- Seleção de intensidade (5 níveis: Muito Leve a Muito Forte)
- Campo de observações opcional
- Registro rápido e intuitivo
- Histórico completo agrupado por data
- Remoção de sintomas registrados

#### Visualização
- Card de sintomas no Dashboard mostrando sintomas do dia
- Card de sintomas no Perfil com link para histórico completo
- Histórico completo com agrupamento por data
- Badges coloridos por intensidade
- Estatísticas de sintomas no perfil

### Melhorado
- ✅ Dashboard agora mostra resumo de sintomas do dia
- ✅ Perfil inclui estatísticas de sintomas
- ✅ Navegação integrada para tela de sintomas

## [0.4.0] - 2024-01-XX

### Adicionado
- ✅ Sistema completo de geração de relatórios PDF
- ✅ Serviço de geração de relatórios (reportGenerator.ts)
- ✅ Templates HTML profissionais para relatórios
- ✅ Tela de relatórios completa com seleção de período
- ✅ Análise de padrões alimentares nos relatórios
- ✅ Recomendações personalizadas baseadas nos dados
- ✅ Compartilhamento de PDFs (WhatsApp, Email, etc.)
- ✅ Três tipos de relatórios: Semanal, Mensal e Trimestral
- ✅ Visualização de período selecionado antes de gerar
- ✅ Dependências: expo-print, expo-sharing, expo-file-system

### Funcionalidades Implementadas

#### Geração de Relatórios PDF
- **Relatório Semanal**: Últimos 7 dias de dados
- **Relatório Mensal**: Últimos 30 dias de dados
- **Relatório Trimestral**: Dados do trimestre atual
- **Conteúdo dos Relatórios**:
  - Informações da gestação (semana, data prevista, peso)
  - Médias nutricionais do período
  - Análise de nutrientes críticos com barras de progresso
  - Evolução de peso (últimos 10 registros)
  - Análise de padrões alimentares
  - Recomendações personalizadas
- **Análise de Padrões**:
  - Distribuição calórica entre refeições
  - Consistência no consumo diário
  - Análise de hidratação
- **Design Profissional**:
  - Layout limpo e organizado
  - Cores e estilos consistentes
  - Tabelas e gráficos visuais
  - Indicadores de status (sucesso/atenção)

#### Compartilhamento
- Compartilhamento nativo do dispositivo
- Suporte para WhatsApp, Email, Drive, etc.
- Validação de disponibilidade de compartilhamento

## [0.3.0] - 2024-01-XX

### Adicionado
- ✅ Sistema completo de favoritos para refeições
- ✅ Store de gerenciamento de favoritos (useFavoritesStore)
- ✅ Tela de favoritos (FavoritesScreen) com lista de refeições salvas
- ✅ Componente FavoriteButton para indicar favoritos
- ✅ Funcionalidade de salvar refeições do dia como favorito
- ✅ Modal de criação de favorito na tela de histórico
- ✅ Botão de acesso rápido aos favoritos na tela de registro
- ✅ Funcionalidade de usar favorito para registro rápido
- ✅ Navegação stack para tela de registro (permite navegar para favoritos)
- ✅ Remoção de favoritos com confirmação

### Funcionalidades Implementadas

#### Sistema de Favoritos
- Salvar refeições do dia como favorito
- Nomear favoritos personalizados
- Lista de todos os favoritos salvos
- Usar favorito para registro rápido (registra todos os alimentos de uma vez)
- Remover favoritos
- Visualização de informações do favorito (tipo de refeição, quantidade de alimentos)
- Acesso rápido aos favoritos a partir da tela de registro

#### Melhorias na Navegação
- Stack Navigator para tela de registro
- Navegação integrada entre registro e favoritos
- Botão "⭐ Favoritos" na tela de registro

### Melhorado
- ✅ Experiência de registro mais rápida com favoritos
- ✅ Reutilização de refeições frequentes
- ✅ Organização melhor das funcionalidades

## [0.2.0] - 2024-01-XX

### Adicionado
- ✅ Sistema completo de registro de peso
- ✅ Store de gerenciamento de peso (useWeightStore)
- ✅ Componente WeightInput para registro de peso
- ✅ Visualização de ganho de peso atual vs. ideal
- ✅ Histórico de registros de peso (últimos 5)
- ✅ Cálculo automático de IMC atual
- ✅ Sistema de registro de hidratação
- ✅ Store de gerenciamento de hidratação (useHydrationStore)
- ✅ Componente WaterIntakeButton para registro rápido de água
- ✅ Modal de adição de água com botões pré-definidos (200ml, 250ml, 300ml, 500ml)
- ✅ Tela de perfil completa com informações da gestação
- ✅ Visualização de estatísticas (registros de peso, progresso da gestação)
- ✅ Tela de histórico de refeições do dia
- ✅ Agrupamento de refeições por tipo (café da manhã, almoço, jantar, lanche)
- ✅ Funcionalidade de remover refeições do histórico
- ✅ Navegação stack para Dashboard (permite navegar para histórico)
- ✅ Integração de água registrada no Dashboard
- ✅ Link no Dashboard para ver todas as refeições do dia

### Melhorado
- ✅ Dashboard agora mostra água total (alimentos + água registrada separadamente)
- ✅ Tela de perfil com informações completas da gestação
- ✅ Visualização de ganho de peso com indicadores visuais (dentro/fora da meta)
- ✅ Navegação mais intuitiva com stack navigator

### Funcionalidades Implementadas

#### Registro de Peso
- Modal de registro com input numérico
- Campo opcional de observações
- Validação de peso (0-200kg)
- Atualização automática do peso atual do usuário
- Histórico dos últimos 5 registros
- Comparação com ganho de peso ideal baseado no IMC inicial

#### Hidratação
- Botões rápidos para adicionar água (200ml, 250ml, 300ml, 500ml)
- Registro separado de água (não apenas de alimentos)
- Integração com Dashboard mostrando água total do dia
- Visualização na tela de perfil

#### Histórico de Refeições
- Visualização de todas as refeições do dia
- Agrupamento por tipo de refeição
- Informações detalhadas de cada refeição (calorias, proteína, ferro)
- Funcionalidade de remover refeições
- Contador total de refeições e calorias

## [0.1.0] - 2024-01-XX

### Adicionado
- ✅ Estrutura inicial do projeto React Native com TypeScript
- ✅ Sistema de navegação com bottom tabs (Registrar, Dashboard, Relatórios, Perfil)
- ✅ Gerenciamento de estado com Zustand (stores para usuário e refeições)
- ✅ Sistema de armazenamento local com AsyncStorage
- ✅ Tela de registro de alimentos com busca funcional
- ✅ Componente de busca de alimentos com autocompletar
- ✅ Componente de input de quantidade de alimentos
- ✅ Dashboard com análise nutricional em tempo real
- ✅ Barras de progresso para nutrientes críticos e macronutrientes
- ✅ Sistema de alertas para nutrientes abaixo da meta
- ✅ Banco de dados mock de alimentos (8 alimentos básicos)
- ✅ Cálculos nutricionais automáticos
- ✅ Utilitários para datas e cálculos nutricionais
- ✅ Tema centralizado com cores suaves e tipografia consistente
- ✅ Componentes reutilizáveis (Button, Card, NutritionProgressBar)

### Funcionalidades Implementadas

#### Registro de Alimentos
- Busca de alimentos por nome
- Seleção de tipo de refeição (café da manhã, almoço, jantar, lanche)
- Ajuste de quantidade com botões +/- e input numérico
- Visualização de informações nutricionais antes de registrar
- Persistência local dos dados

#### Dashboard
- Resumo do dia (calorias, proteína, água)
- Barras de progresso para nutrientes críticos:
  - Ferro
  - Ácido Fólico
  - Cálcio
  - Ômega-3
  - Vitamina D
- Barras de progresso para macronutrientes:
  - Calorias
  - Proteína
  - Carboidratos
  - Gorduras
- Monitor de hidratação
- Alertas visuais quando nutrientes estão abaixo da meta
- Pull-to-refresh para atualizar dados

### Próximas Funcionalidades (MVP)
- [ ] Reconhecimento de voz para registro
- [ ] Escaneamento por câmera (código de barras)
- [ ] Sistema de favoritos
- [ ] Registro de peso
- [ ] Registro de sintomas
- [ ] Gráficos de evolução (semanal/mensal)
- [ ] Geração de relatórios PDF
- [ ] Onboarding inicial
- [ ] Tela de perfil com configurações

### Melhorias Técnicas Necessárias
- [ ] Integração com API real de alimentos
- [ ] Sincronização com backend
- [ ] Testes unitários
- [ ] Testes de integração
- [ ] Otimização de performance
- [ ] Tratamento de erros mais robusto
- [ ] Loading states em todas as operações assíncronas

