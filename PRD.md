# NutriGest - Product Requirements Document (PRD)

## 1. Resumo

O **NutriGest** é um aplicativo móvel de monitoramento nutricional inteligente, projetado especificamente para gestantes. Seu objetivo é empoderar a mulher durante a gestação através de um acompanhamento nutricional personalizado, preciso e baseado em dados, reduzindo riscos de complicações e promovendo uma gestação mais saudável. A solução integra um sistema avançado de registro alimentar, análise em tempo real, relatórios profissionais para médicos e ferramentas de apoio, tudo dentro de um ambiente seguro e conforme com as regulamentações de proteção de dados.

---

## 2. Visão

**Visão:** Ser a plataforma de referência em saúde digital para a gestação, reconhecida por reduzir complicações relacionadas à nutrição e por melhorar a comunicação entre a gestante e sua equipe médica.

**Missão:** Fornecer uma ferramenta tecnológica acessível e segura que transforme dados nutricionais em insights acionáveis, promovendo autonomia, tranquilidade e saúde para a gestante e seu bebê.

---

## 3. Mercado

**Problema:** A desnutrição e os desequilíbrios nutricionais durante a gestação são uma das principais causas de complicações como baixo peso ao nascer, parto prematuro e pré-eclâmpsia. As gestantes têm dificuldade em:

*   Traduzir recomendações médicas genéricas em um plano alimentar diário.
*   Manter um registro consistente e detalhado do que consomem.
*   Identificar deficiências específicas de micronutrientes críticos (ferro, ácido fólico, etc.).
*   Gerar relatórios objetivos para compartilhar com seus médicos.

**Oportunidade:** O mercado de saúde digital para gestantes está em crescimento, com um aumento na busca por apps de monitoramento. No entanto, faltam soluções que combinem uma base científica robusta, uma experiência de usuário otimizada para a rotina da gestante e funcionalidades voltadas para o profissional de saúde.

**Público-Alvo Primário:** Mulheres em período gestacional, com idades entre 25 e 40 anos, com acesso a smartphones e preocupadas com uma gestação saudável.

**Público-Alvo Secundário:** Profissionais de saúde (nutricionistas, obstetras, endocrinologistas) que buscam ferramentas para otimizar o acompanhamento de suas pacientes.

---

## 4. Personas

### Persona Primária: Marina

*   **Idade:** 32 anos
*   **Ocupação:** Gerente de Marketing
*   **Contexto:** Está na 14ª semana de sua primeira gestação. É digitalmente ativa, tem uma rotina corrida e se sente sobrecarregada com a quantidade de informações e recomendações médicas. Quer fazer o melhor para a saúde do bebê, mas tem dificuldade em manter uma dieta balanceada e registrar tudo manualmente.
*   **Objetivos:** Garantir que está ingerindo os nutrientes necessários, controlar o ganho de peso de forma saudável e ter informações claras para levar às consultas.
*   **Frustrações:** Esquece de tomar seus suplementos, não sabe se está consumindo ferro suficiente, acha trabalhoso anotar tudo o que come.

### Persona Secundária: Dr. Carlos

*   **Idade:** 48 anos
*   **Ocupação:** Obstetra
*   **Contexto:** Atende mais de 20 gestantes por semana. Precisa de informações objetivas e rápidas sobre a adesão das pacientes às recomendações nutricionais. O tempo de consulta é limitado.
*   **Objetivos:** Identificar rapidamente deficiências nutricionais, monitorar o ganho de peso e ter um histórico confiável para basear suas prescrições.
*   **Frustrações:** Depender da memória da paciente sobre sua alimentação, receber relatórios incompletos ou de difícil interpretação.

---

## 5. Histórias de Usuário (User Stories)

### Para a Marina (Gestante):

*   **Como** Marina, **eu quero** registrar minha refeição usando a câmera do celular para escanear a embalagem de um alimento, **para que** eu possa cadastrá-lo rapidamente sem ter que buscar manualmente.
*   **Como** Marina, **eu quero** receber um alerta quando meu consumo de ferro estiver abaixo da meta diária, **para que** eu possa ajustar minha próxima refeição.
*   **Como** Marina, **eu quero** visualizar um gráfico simples da minha evolução de peso em comparação com a curva ideal, **para que** eu me sinta tranquila e no controle.
*   **Como** Marina, **eu quero** gerar um relatório em PDF da minha última semana nutricional, **para que** eu possa mostrar ao meu médico na consulta.

### Para o Dr. Carlos (Médico):

*   **Como** Dr. Carlos, **eu quero** acessar um dashboard que destaque os principais nutrientes em déficit da minha paciente, **para que** eu possa focar minhas recomendações de forma eficiente.
*   **Como** Dr. Carlos, **eu quero** comparar o consumo nutricional da paciente entre o primeiro e o segundo trimestre, **para que** eu possa identificar padrões e tendências.
*   **Como** Dr. Carlos, **eu quero** exportar os dados da paciente para o prontuário eletrônico do meu consultório, **para que** eu possa manter o histórico no sistema principal.

---

## 6. Funcionalidades (Detalhamento)

### 6.1. Sistema de Registro Inteligente

*   Busca Preditiva: Campo de busca com autocompletar a partir de um banco de dados com >10.000 alimentos.
*   Reconhecimento de Voz: Permite ditar os alimentos consumidos.
*   Escaneamento por Câmera: Usa a câmera para ler códigos de barras de produtos embalados e preencher automaticamente os dados nutricionais.
*   Favoritos e Refeições Customizadas: Permite salvar combinações de alimentos frequentes (ex: "café da manhã padrão").

### 6.2. Módulo de Análise Avançada

*   Calculadora Automática de Macros/Micronutrientes: Agrega automaticamente os nutrientes de todos os alimentos registrados no dia.
*   Sistema de Alertas Proativos: Notifica a usuária sobre níveis baixos de nutrientes críticos (ferro, ácido fólico, cálcio, ômega-3).
*   Comparativo em Tempo Real: Barra de progresso ou indicador visual mostrando o consumo do dia vs. a meta personalizada.
*   Monitor de Hidratação: Registro de ingestão de água com lembretes personalizados baseados no peso e na atividade.

### 6.3. Painel de Visualização Interativa

*   Gráficos de Evolução: Linhas e barras mostrando a evolução semanal/mensal de calorias, nutrientes e peso.
*   Heatmap de Distribuição Calórica: Mapa de calor visual mostrando como as calorias foram distribuídas entre café da manhã, almoço, jantar e lanches.
*   Comparativo entre Trimestres: Aba específica para comparar médias nutricionais entre os diferentes trimestres.

### 6.4. Sistema de Relatórios Profissionais

*   Modelos de Relatório: Diferentes layouts pré-definidos para obstetras, nutricionistas, etc.
*   Análise de Padrões: Seção no relatório que destaca padrões como "alto consumo de açúcar à tarde" ou "baixa ingestão de proteína no jantar".
*   Exportação Multi-formato: Geração de relatórios em PDF, Excel e integração via API com sistemas de prontuário eletrônico.

### 6.5. Funcionalidades Exclusivas

*   Acompanhamento de Sintomas: Registro de náuseas, azia, desejos e aversões alimentares, com possibilidade de correlacionar com a dieta.
*   Planejador de Refeições: Sugere cardápios semanais baseados nas preferências, aversões e metas nutricionais.
*   Biblioteca de Receitas: Coleção de receitas saudáveis e adaptadas para sintomas comuns da gestação (ex: receitas leves para náuseas).
*   Calculadora de IMC Gestacional: Calcula o IMC inicial e traça a curva de ganho de peso ideal personalizada.

---

## 7. Requisitos Técnicos

*   **Plataformas:** iOS (v14+) e Android (v10+). Desenvolvimento nativo/cross-platform (React Native/Flutter).
*   **Arquitetura:** Microssserviços para escalabilidade. Atualizações OTA (Over-The-Air) para correções rápidas.
*   **Integrações:**
    *   Sincronização bidirecional com Apple Health Kit e Google Fit.
    *   API RESTful para integração com wearables (Apple Watch, Fitbit) e smart scales.
    *   API para sistemas de saúde e prontuários eletrônicos (padrão HL7/FHIR).
*   **Inteligência Artificial:** Modelos de Machine Learning para personalizar recomendações e alertas com base no histórico do usuário.
*   **Modo Offline:** Todas as funcionalidades de registro funcionam offline. Sincronização automática quando a conexão for restabelecida.

---

## 8. UI/UX (Interface do Usuário e Experiência)

*   **Design:** Interface "clean", minimalista e com alta legibilidade. Uso de cores suaves (tons pastel de verde, azul, rosa) que transmitam calma e confiança.
*   **Acessibilidade:** Suporte a leitores de tela (VoiceOver/TalkBack), contraste adequado, fontes redimensionáveis e ícones intuitivos.
*   **Onboarding:** Tutorial interativo e rápido, explicando as funcionalidades principais.
*   **Navegação:** Bottom Navigation Bar com os 4 pilares: "Registrar", "Dashboard", "Relatórios", "Perfil".
*   **Microinterações:** Feedback visual e sonoro positivo ao completar um registro ou bater uma meta, reforçando o engajamento.

---

## 9. Métricas de Sucesso

### Métricas de Engajamento:

*   DAU/MAU (Usuários Diários Ativos / Mensais Ativos): Meta > 30%.
*   Sessões por semana por usuário: Meta > 10.
*   Taxa de retenção no 30º dia: Meta > 50%.

### Métricas de Saúde:

*   % de usuárias que relatam melhor compreensão de sua nutrição (via pesquisa NPS).
*   % de usuárias que mantêm o ganho de peso dentro da curva recomendada.

### Métricas de Negócio:

*   Número de relatórios gerados por mês.
*   Taxa de conversão para versão premium (se aplicável).
*   Satisfação do usuário (App Store/Play Store rating): Meta > 4.5 estrelas.

---

## 10. Cronograma (Roadmap de Lançamento - High-Level)

### Fase 1: MVP (Lançamento Inicial - 6 meses)

*   Funcionalidades core: Registro (busca, voz, favoritos), análise básica (macros, alertas), painel de visualização simples, relatório PDF básico, controle de peso e hidratação.
*   Público: Beta fechado com 500 gestantes.

### Fase 2: Consolidação (6 meses pós-MVP)

*   Lançamento público nas app stores.
*   Implementação do escaneamento por câmera, biblioteca de receitas e planejador de refeições.
*   Integração com Apple Health/Google Fit.

### Fase 3: Expansão (Ano 2)

*   Desenvolvimento do portal web para profissionais de saúde (dashboard do Dr. Carlos).
*   Integrações avançadas com wearables e APIs de prontuários eletrônicos.
*   Implementação de algoritmos de Machine Learning para personalização.

### Fase 4: Futuro

*   Expansão para outros mercados (América Latina, Europa).
*   Funcionalidades para o pós-parto e amamentação.
*   Parcerias com planos de saúde e clínicas.

