# 🎨 Especificações de Design - NutriGest

## Conceito Visual

### Identidade do App
- **Nome:** NutriGest
- **Tema:** Saúde, gestação, nutrição, cuidado
- **Tom:** Acolhedor, confiável, moderno, suave

### Paleta de Cores Principal (Alinhada com o App)
```
Primária:     #81C784 (Verde - COLORS.primary)
Primária Dark: #66BB6A (Verde escuro)
Primária Light: #A5D6A7 (Verde claro)
Secundária:   #64B5F6 (Azul - COLORS.secondary)
Acento:       #F48FB1 (Rosa - COLORS.accent)
Background:   #E8F5E9 (Verde muito claro - usado no splash)
Surface:      #FFFFFF (Branco)
Texto:        #212121 (Cinza escuro - COLORS.text)
Texto Sec:    #757575 (Cinza médio - COLORS.textSecondary)
```

## Especificações Técnicas

### 1. icon.png (1024x1024px)
**Requisitos:**
- Formato: PNG (sem transparência)
- Tamanho: Exatamente 1024x1024 pixels
- Espaço de cor: RGB
- Fundo: Sólido (não transparente)
- Área segura: 768x768px centralizado (75% do tamanho)

**Design Sugerido:**
- Fundo: Verde claro (#E8F5E9) ou gradiente suave
- Elemento central: 
  - Opção 1: Silhueta de gestante estilizada
  - Opção 2: Folha verde com símbolo de nutrição
  - Opção 3: Coração com símbolos de nutrientes
- Cores: Harmoniosas, suaves, acolhedoras
- Estilo: Minimalista, moderno, limpo

### 2. splash.png (1242x2436px)
**Requisitos:**
- Formato: PNG
- Tamanho: 1242x2436px (iPhone) ou 1920x1080px (Android)
- Fundo: Sólido ou gradiente suave
- Elementos: Centralizados verticalmente

**Design Sugerido:**
- Fundo: Verde claro (#E8F5E9) ou gradiente
- Logo/Ícone: Centralizado, tamanho médio
- Texto opcional: "NutriGest" abaixo do logo
- Cores: Mesmas do ícone principal

### 3. adaptive-icon.png (1024x1024px)
**Requisitos:**
- Formato: PNG
- Tamanho: 1024x1024px
- Área segura: 66% central (conteúdo importante dentro)
- Fundo: Sólido (será cortado em formas diferentes no Android)

**Design Sugerido:**
- Mesmo design do icon.png
- Garantir que elementos importantes estejam na área central
- Evitar elementos muito próximos das bordas

### 4. favicon.png (48x48px)
**Requisitos:**
- Formato: PNG ou ICO
- Tamanho: 48x48px (ou múltiplos: 16x16, 32x32, 48x48)
- Simplificado: Deve ser legível em tamanho pequeno

**Design Sugerido:**
- Versão simplificada do ícone principal
- Apenas o elemento mais importante
- Cores contrastantes

## Elementos Visuais Sugeridos

### Ícones/Elementos:
1. **Gestante + Folha** 🌿
   - Silhueta de gestante com folha verde
   - Simboliza saúde e natureza

2. **Coração + Nutrientes** ❤️
   - Coração com símbolos de nutrientes ao redor
   - Simboliza cuidado e nutrição

3. **Bebê + Alimentos** 👶
   - Silhueta de bebê com alimentos saudáveis
   - Simboliza gestação e alimentação

4. **Folha Estilizada** 🍃
   - Folha verde moderna e estilizada
   - Simboliza saúde e natureza

### Estilo Visual:
- **Minimalista:** Design limpo, sem elementos desnecessários
- **Moderno:** Formas geométricas suaves, linhas curvas
- **Acolhedor:** Cores suaves, tons pastel
- **Profissional:** Mas não muito sério, amigável

## Ferramentas Recomendadas

### Para Criar:
1. **Figma** (Gratuito) - https://www.figma.com/
   - Templates de app icons disponíveis
   - Exporta em múltiplos formatos
   - Colaborativo

2. **Canva** (Gratuito) - https://www.canva.com/
   - Templates prontos
   - Fácil de usar
   - Exporta PNG

3. **Adobe Illustrator** (Pago)
   - Profissional
   - Controle total

### Para Gerar Tamanhos:
1. **AppIcon.co** - https://www.appicon.co/
   - Upload um design e gera todos os tamanhos
   - Gratuito
   - Muito rápido

2. **IconKitchen** - https://icon.kitchen/
   - Especializado em adaptive icons
   - Gratuito

## Processo Recomendado

### Passo 1: Criar o Design Base
1. Abra Figma ou Canva
2. Crie um frame 1024x1024px
3. Adicione grid de 8px para alinhamento
4. Desenhe o ícone dentro da área segura (768x768px central)
5. Use a paleta de cores sugerida
6. Exporte como PNG

### Passo 2: Gerar Todos os Tamanhos
1. Acesse https://www.appicon.co/
2. Faça upload do seu design 1024x1024px
3. Selecione "iOS" e "Android"
4. Baixe o pacote completo
5. Extraia na pasta `assets/`

### Passo 3: Criar Splash Screen
1. Use o mesmo design do ícone
2. Crie um frame 1242x2436px
3. Centralize o logo/ícone
4. Adicione texto "NutriGest" se desejar
5. Exporte como `splash.png`

### Passo 4: Verificar
1. Execute: `npm run check-assets`
2. Verifique se todos os arquivos estão presentes
3. Teste visualmente se estão corretos

## Exemplo de Brief para Designer

Se você for contratar um designer, use este brief:

**Projeto:** Ícone e Assets para App NutriGest

**Descrição:**
App de monitoramento nutricional para gestantes. Precisa transmitir confiança, cuidado e saúde.

**Requisitos:**
- Ícone principal: 1024x1024px
- Splash screen: 1242x2436px
- Adaptive icon: 1024x1024px
- Favicon: 48x48px

**Estilo:**
- Minimalista e moderno
- Cores suaves (verde, azul, rosa pastel)
- Acolhedor e profissional
- Elementos: gestante, folha, nutrição, cuidado

**Cores:**
- Primária: #4CAF50 (Verde)
- Background: #E8F5E9 (Verde claro)
- Acentos: Rosa pastel, amarelo suave

**Prazo:** [Definir]

## Recursos Úteis

- **Ícones Gratuitos:** https://www.flaticon.com/
- **Inspiração:** https://dribbble.com/search/app-icon
- **Paleta de Cores:** https://coolors.co/
- **Fontes:** Google Fonts (se incluir texto)

---

## ✅ Após Criar os Assets

1. Coloque todos os arquivos na pasta `assets/`
2. Execute: `npm run check-assets` para verificar
3. Teste visualmente se estão corretos
4. Pronto para deploy!

