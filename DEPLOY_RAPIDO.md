# 🚀 Deploy Rápido - NutriGest

## ⚡ Passo a Passo Simplificado

### **1. Preparar GitHub (5 minutos)**

```bash
# No terminal, dentro da pasta do projeto:
cd /Users/carlosalbertoraimundobaldo/Library/CloudStorage/Dropbox/cursor

# Inicializar Git
git init
git add .
git commit -m "NutriGest MVP - Pronto para deploy"

# Criar repositório no GitHub:
# 1. Acesse: https://github.com/new
# 2. Nome: nutrigest
# 3. Público ou Privado
# 4. NÃO marque "Initialize with README"
# 5. Clique em "Create repository"

# Conectar e enviar código
git remote add origin https://github.com/SEU_USUARIO/nutrigest.git
git branch -M main
git push -u origin main
```

**Substitua `SEU_USUARIO` pelo seu nome de usuário do GitHub!**

---

### **2. Deploy na Vercel (3 minutos)**

#### **Opção A: Via Site (Mais Fácil)**

1. Acesse: **https://vercel.com**
2. Clique em **"Sign Up"** ou **"Login"**
3. Escolha **"Continue with GitHub"**
4. Clique em **"Add New Project"**
5. Selecione o repositório **`nutrigest`**
6. Configure:
   - **Framework Preset**: `Other`
   - **Root Directory**: `./` (deixe padrão)
   - **Build Command**: `npm run web:build`
   - **Output Directory**: `web-build`
   - **Install Command**: `npm install`
7. Clique em **"Deploy"**
8. Aguarde 2-5 minutos
9. ✅ **Pronto!** Você terá uma URL como: `https://nutrigest.vercel.app`

#### **Opção B: Via Terminal (Mais Rápido)**

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Responda as perguntas:
# - Set up and deploy? Yes
# - Which scope? (escolha sua conta)
# - Link to existing project? No
# - Project name: nutrigest
# - Directory: ./
# - Override settings? No
```

---

### **3. Testar Build Localmente (Opcional)**

Antes de fazer deploy, teste se o build funciona:

```bash
# Gerar build
npm run web:build

# Testar build localmente
npm run web:serve

# Acesse: http://localhost:3000
```

Se funcionar localmente, funcionará na Vercel! ✅

---

## ✅ Checklist Final

- [ ] Código no GitHub
- [ ] Build local funcionando (`npm run web:build`)
- [ ] Projeto criado na Vercel
- [ ] Deploy realizado
- [ ] URL de produção funcionando
- [ ] Testar todas as funcionalidades na URL de produção

---

## 🎉 Pronto!

Após o deploy, você terá:
- ✅ **URL pública**: `https://nutrigest.vercel.app` (ou similar)
- ✅ **Deploy automático**: A cada push no GitHub, a Vercel atualiza automaticamente
- ✅ **HTTPS gratuito**: Seguro e confiável
- ✅ **CDN global**: Rápido em qualquer lugar do mundo

**Compartilhe a URL com seus usuários!** 🚀

---

## 🔄 Atualizações Futuras

Para atualizar o app depois do deploy:

```bash
# Fazer mudanças no código
# ...

# Commit e push
git add .
git commit -m "Descrição das mudanças"
git push

# A Vercel atualiza automaticamente! ✨
```

---

## 🐛 Problemas?

### Build falha na Vercel
- Verifique os logs na Vercel Dashboard
- Teste localmente primeiro: `npm run web:build`
- Verifique se todas as dependências estão no `package.json`

### Página em branco
- Verifique se `outputDirectory` está correto: `web-build`
- Limpe o cache: Vercel Dashboard → Settings → Clear Build Cache

### Assets não carregam
- Verifique se os assets estão na pasta `assets/`
- Verifique se o `assetBundlePatterns` no `app.json` inclui `**/*`

---

## 📞 Precisa de Ajuda?

Se algo não funcionar, me mostre:
1. Mensagem de erro completa
2. Logs do build (na Vercel Dashboard)
3. O que você tentou fazer

**Vamos fazer o deploy juntos!** 🚀

