# 💻 Como Rodar o NutriGest no Computador (Web)

## 🚀 Método Rápido

### 1. Instalar Dependências (Primeira Vez)
```bash
npm install
```

### 2. Rodar no Navegador
```bash
npm run web
```

Isso vai:
- Abrir automaticamente no navegador (geralmente em `4http://localhost:19006`)
- Mostrar o app funcionando no computador
- Atualizar automaticamente quando você fizer mudanças no código

---

## 📋 Passos Detalhados

### Opção 1: Modo Desenvolvimento (Recomendado)

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar servidor web
npm run web
```

O app vai abrir automaticamente no seu navegador padrão!

### Opção 2: Build para Produção

```bash
# 1. Gerar build otimizado
npm run web:build

# 2. Servir o build (opcional)
npm run web:serve
```

O build será gerado na pasta `web-build/` e pode ser hospedado em qualquer servidor web.

---

## 🌐 Acessar o App

Depois de rodar `npm run web`, o app estará disponível em:

- **URL Local:** `http://localhost:19006`
- Abre automaticamente no navegador

---

## ✅ O Que Funciona na Web

- ✅ Todas as telas (Dashboard, Registro, Relatórios, etc.)
- ✅ Registro de refeições
- ✅ Análise nutricional
- ✅ Gráficos e estatísticas
- ✅ Geração de PDFs
- ✅ Histórico e favoritos
- ✅ Exames médicos
- ✅ Receitas e planejador

---

## ⚠️ Limitações na Web

Algumas funcionalidades não funcionam na web (são específicas de mobile):

- ❌ Câmera (escanear código de barras)
- ❌ Reconhecimento de voz
- ❌ Alguns gestos touch (mas mouse funciona)
- ❌ Notificações push nativas

**Mas a maioria das funcionalidades funciona perfeitamente!**

---

## 🎨 Layout Desktop

O app se adapta automaticamente para telas maiores:
- Layout responsivo
- Melhor uso do espaço horizontal
- Navegação otimizada para mouse

---

## 🔧 Troubleshooting

### "Porta já em uso"
```bash
# Use outra porta
expo start --web --port 3000
```

### "Module not found"
```bash
npm install
```

### "Erro ao compilar"
```bash
# Limpar cache e reinstalar
rm -rf node_modules
npm install
```

---

## 📦 Deploy Web

### Para Hospedar em Servidor:

1. **Gerar build:**
   ```bash
   npm run web:build
   ```

2. **Upload da pasta `web-build/`** para seu servidor web

3. **Pronto!** O app estará online

### Serviços Recomendados:
- **Vercel** (gratuito)
- **Netlify** (gratuito)
- **GitHub Pages** (gratuito)
- **Firebase Hosting** (gratuito)

---

## 💡 Dica

Para desenvolvimento, use sempre:
```bash
npm run web
```

Isso permite ver mudanças em tempo real enquanto você desenvolve!

---

## 🎯 Próximos Passos

Agora você pode:
1. Ver o design no navegador
2. Testar todas as funcionalidades
3. Fazer ajustes e ver em tempo real
4. Compartilhar o link com outras pessoas (se estiver na mesma rede)

**Pronto para usar no computador!** 🚀

