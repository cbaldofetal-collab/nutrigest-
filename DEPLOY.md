# Guia de Deploy - NutriGest

## ✅ Checklist Pré-Deploy

### 1. Configurações do App ✅
- [x] `app.json` configurado
- [x] Bundle identifier/package name definido
- [x] Versão e build number configurados
- [x] Permissões configuradas (câmera, microfone)
- [x] Splash screen configurado

### 2. Assets Necessários ⚠️
- [ ] **Ícone do app** (`assets/icon.png`) - 1024x1024px
- [ ] **Splash screen** (`assets/splash.png`) - 1242x2436px (ou similar)
- [ ] **Adaptive icon Android** (`assets/adaptive-icon.png`) - 1024x1024px
- [ ] **Favicon web** (`assets/favicon.png`) - 48x48px

### 3. Configurações de Produção
- [x] TypeScript configurado
- [x] Linter configurado
- [x] Testes básicos implementados
- [x] Tratamento de erros robusto
- [x] Loading states implementados
- [x] Validações de dados

### 4. Build e Deploy

#### Para iOS (App Store):
```bash
# 1. Instalar EAS CLI
npm install -g eas-cli

# 2. Login no Expo
eas login

# 3. Configurar projeto
eas build:configure

# 4. Criar build de produção
eas build --platform ios --profile production

# 5. Submeter para App Store
eas submit --platform ios
```

#### Para Android (Google Play):
```bash
# 1. Criar build de produção
eas build --platform android --profile production

# 2. Submeter para Google Play
eas submit --platform android
```

### 5. Configurações Adicionais Recomendadas

#### Adicionar ao `app.json`:
```json
{
  "expo": {
    "extra": {
      "eas": {
        "projectId": "seu-project-id"
      }
    },
    "updates": {
      "enabled": true,
      "fallbackToCacheTimeout": 0
    }
  }
}
```

## 📝 Notas Importantes

### Antes do Deploy:
1. **Testar em dispositivos reais** (iOS e Android)
2. **Verificar todas as funcionalidades** principais
3. **Testar offline** (app funciona sem internet)
4. **Verificar performance** em dispositivos mais antigos
5. **Revisar permissões** solicitadas

### Assets Faltantes:
Os assets (ícones e splash screens) precisam ser criados/fornecidos. O app.json já está configurado para usá-los, mas os arquivos físicos precisam existir na pasta `assets/`.

### Banco de Dados:
- Atualmente usando dados mock (8 alimentos)
- Para produção, considerar integração com API real (USDA, TACO, etc.)

### Segurança:
- Dados armazenados localmente (AsyncStorage)
- Sem autenticação de usuários (MVP)
- Sem backend/sincronização (MVP)

## 🚀 Próximos Passos para Deploy

1. **Criar/obter assets** (ícones, splash screens)
2. **Configurar EAS** (Expo Application Services)
3. **Criar builds de teste** primeiro
4. **Testar builds** em dispositivos reais
5. **Submeter para stores**

## 📱 Status Atual

✅ **Pronto para deploy técnico** - O código está completo e funcional
⚠️ **Assets necessários** - Ícones e splash screens precisam ser criados
✅ **Funcionalidades completas** - Todas as features do MVP implementadas
✅ **Qualidade de código** - Testes, validações e tratamento de erros implementados

