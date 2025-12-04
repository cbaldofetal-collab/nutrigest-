# 🎨 Como Ver o Design do NutriGest

## 📱 Opções para Ver o Design

### Opção 1: Executar no Emulador/Simulador (Recomendado)

#### No iOS (Mac):
```bash
# 1. Instalar dependências (se ainda não instalou)
npm install

# 2. Iniciar o app
npm start

# 3. Pressionar 'i' para abrir no iOS Simulator
# Ou executar diretamente:
npm run ios
```

#### No Android:
```bash
# 1. Instalar dependências
npm install

# 2. Iniciar o app
npm start

# 3. Pressionar 'a' para abrir no Android Emulator
# Ou executar diretamente:
npm run android
```

### Opção 2: Executar no Dispositivo Físico

#### Usando Expo Go (Mais Fácil):

1. **Instalar Expo Go no seu celular:**
   - iOS: App Store → "Expo Go"
   - Android: Play Store → "Expo Go"

2. **Iniciar o servidor:**
   ```bash
   npm start
   ```

3. **Escanear o QR Code:**
   - Abra o Expo Go no celular
   - Escaneie o QR code que aparece no terminal
   - O app vai carregar no seu celular!

### Opção 3: Ver no Navegador (Web)

```bash
# Iniciar no navegador
npm run web
```

**Nota:** Algumas funcionalidades podem não funcionar no web (câmera, etc.)

---

## 🚀 Passos Rápidos

### Primeira Vez:

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Iniciar o app:**
   ```bash
   npm start
   ```

3. **Escolher onde ver:**
   - Pressione `i` para iOS
   - Pressione `a` para Android
   - Pressione `w` para Web
   - Ou escaneie o QR code com Expo Go

---

## 📸 O Que Você Vai Ver

### 1. **Welcome Screen** (Primeira vez)
- Tela de boas-vindas
- Apresentação do app
- Botão "Começar Agora"

### 2. **Onboarding Screen** (4 passos)
- Passo 1: Nome e Email
- Passo 2: Altura e Peso
- Passo 3: Semana Gestacional
- Passo 4: Data Prevista do Parto

### 3. **Dashboard**
- Resumo do dia
- Barras de progresso nutricional
- Gráficos e estatísticas

### 4. **Outras Telas**
- Registrar Refeições
- Relatórios
- Perfil
- Exames Médicos
- Receitas
- E muito mais!

---

## ⚠️ Problemas Comuns

### "expo not found"
```bash
npm install -g expo-cli
# ou
npx expo start
```

### "Module not found"
```bash
npm install
```

### Emulador não abre
- iOS: Abra o Xcode e o Simulator primeiro
- Android: Abra o Android Studio e o AVD Manager

---

## 💡 Dica

A forma mais fácil é usar o **Expo Go** no seu celular:
1. Instale o app Expo Go
2. Execute `npm start`
3. Escaneie o QR code
4. Pronto! Você vê o design no seu celular em tempo real!

---

## 🎯 Próximos Passos

Depois de ver o design, você pode:
- Ajustar cores e estilos
- Modificar layouts
- Adicionar novas telas
- Melhorar a experiência

Me avise o que você quer mudar!

