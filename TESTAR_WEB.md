# 🔧 Teste Manual - Rodar na Web

## ⚠️ Se o comando automático não funcionou, tente manualmente:

### 1. Abra um Terminal Novo

Abra um terminal separado (não o do Cursor) e execute:

```bash
cd /Users/carlosalbertoraimundobaldo/Library/CloudStorage/Dropbox/cursor
npm run web
```

### 2. Aguarde a Mensagem

Você deve ver algo como:
```
Metro waiting on exp://...
Web is waiting on http://localhost:19006
```

### 3. Acesse no Navegador

Abra seu navegador (Chrome, Firefox, Safari) e acesse:

**http://localhost:19006**

### 4. Se Der Erro

Tente estas URLs alternativas:
- http://localhost:3000
- http://localhost:8081
- http://127.0.0.1:19006

---

## 🐛 Problemas Comuns

### "Port already in use"
```bash
# Mate processos na porta
lsof -ti:19006 | xargs kill -9
# Tente novamente
npm run web
```

### "Module not found"
```bash
# Reinstale dependências
rm -rf node_modules
npm install --legacy-peer-deps
npm run web
```

### "Cannot find module 'expo'"
```bash
# Instale Expo CLI
npm install -g expo-cli
# Ou use npx
npx expo start --web
```

---

## 💡 Dica

Se nada funcionar, você pode:
1. Ver os logs completos no terminal
2. Copiar os erros e me mostrar
3. Tentar rodar em modo desenvolvimento normal primeiro

---

**Tente executar manualmente no terminal e me diga o que aparece!**

