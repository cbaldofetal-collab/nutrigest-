# Guia de Instalação - NutriGest

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 18 ou superior)
- **npm** ou **yarn**
- **Expo CLI** (`npm install -g expo-cli`)
- **Git**

### Para desenvolvimento iOS (apenas macOS):
- **Xcode** (versão mais recente)
- **CocoaPods** (`sudo gem install cocoapods`)

### Para desenvolvimento Android:
- **Android Studio**
- **Android SDK** (configurado via Android Studio)
- Variáveis de ambiente `ANDROID_HOME` configuradas

## Instalação

1. **Clone o repositório** (ou navegue até a pasta do projeto):
```bash
cd /Users/carlosalbertoraimundobaldo/Library/CloudStorage/Dropbox/cursor
```

2. **Instale as dependências**:
```bash
npm install
```

ou com yarn:
```bash
yarn install
```

3. **Instale as dependências nativas** (se necessário):
```bash
npx expo install --fix
```

## Executando o Projeto

### Desenvolvimento

Inicie o servidor de desenvolvimento:
```bash
npm start
```

Isso abrirá o Expo DevTools no navegador. Você pode:

- Pressionar `i` para abrir no simulador iOS
- Pressionar `a` para abrir no emulador Android
- Escanear o QR code com o app Expo Go no seu dispositivo físico

### Executar diretamente

**iOS:**
```bash
npm run ios
```

**Android:**
```bash
npm run android
```

**Web:**
```bash
npm run web
```

## Estrutura do Projeto

```
nutrigest/
├── src/
│   ├── components/      # Componentes reutilizáveis
│   ├── screens/         # Telas do aplicativo
│   ├── navigation/      # Configuração de navegação
│   ├── services/        # Serviços (API, storage)
│   ├── utils/           # Funções utilitárias
│   ├── types/           # Definições TypeScript
│   ├── constants/       # Constantes
│   └── theme/           # Tema e estilos
├── assets/              # Imagens, ícones, fontes
├── App.tsx              # Componente raiz
├── app.json             # Configuração do Expo
├── package.json         # Dependências
└── tsconfig.json        # Configuração TypeScript
```

## Scripts Disponíveis

- `npm start` - Inicia o servidor de desenvolvimento
- `npm run ios` - Executa no iOS
- `npm run android` - Executa no Android
- `npm run web` - Executa na web
- `npm run lint` - Executa o linter
- `npm run type-check` - Verifica tipos TypeScript

## Troubleshooting

### Erro: "Module not found"
```bash
rm -rf node_modules
npm install
```

### Erro no iOS: "Pod install"
```bash
cd ios
pod install
cd ..
```

### Erro: "Metro bundler cache"
```bash
npm start -- --reset-cache
```

### Problemas com TypeScript
```bash
npm run type-check
```

## Próximos Passos

1. Configure as variáveis de ambiente (se necessário)
2. Adicione os assets (ícones, splash screen) na pasta `assets/`
3. Configure as permissões no `app.json`
4. Comece a desenvolver! 🚀

## Recursos Úteis

- [Documentação do Expo](https://docs.expo.dev/)
- [Documentação do React Native](https://reactnative.dev/)
- [Documentação do TypeScript](https://www.typescriptlang.org/)

