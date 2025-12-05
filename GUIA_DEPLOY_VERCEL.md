# 🚀 Guia de Deploy no Vercel - NutriGest

## ✅ Status do Supabase

**Sim, o Supabase já está integrado!** ✅

O código já está configurado para usar o Supabase. Você só precisa configurar as variáveis de ambiente no Vercel.

---

## 📋 Pré-requisitos

1. ✅ Conta no Vercel (https://vercel.com)
2. ✅ Projeto no Supabase configurado (já feito!)
3. ✅ Código no GitHub/GitLab/Bitbucket

---

## 🚀 Passo 1: Fazer Push do Código

Certifique-se de que todo o código está no repositório:

```bash
git add -A
git commit -m "Preparar para deploy no Vercel"
git push
```

---

## 🚀 Passo 2: Conectar Projeto no Vercel

1. Acesse: **https://vercel.com**
2. Faça login (pode usar GitHub)
3. Clique em **"Add New..."** → **"Project"**
4. Importe seu repositório do GitHub
5. O Vercel detectará automaticamente que é um projeto Expo

---

## 🚀 Passo 3: Configurar Build Settings

O Vercel deve detectar automaticamente, mas verifique:

- **Framework Preset**: Expo
- **Build Command**: `npm run web:build`
- **Output Directory**: `web-build`
- **Install Command**: `npm install`

Se não detectar automaticamente, configure manualmente.

---

## 🚀 Passo 4: Configurar Variáveis de Ambiente

⚠️ **MUITO IMPORTANTE**: Configure as variáveis de ambiente do Supabase!

1. No Vercel, vá em **Settings** → **Environment Variables**
2. Adicione estas duas variáveis:

   **Variável 1:**
   - **Name**: `EXPO_PUBLIC_SUPABASE_URL`
   - **Value**: `https://tttfsmhmtkiqzypgjrqu.supabase.co`
   - **Environment**: Production, Preview, Development (marque todas)

   **Variável 2:**
   - **Name**: `EXPO_PUBLIC_SUPABASE_ANON_KEY`
   - **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0dGZzbWhtdGtpcXp5cGdqcnF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5NDY2NDIsImV4cCI6MjA4MDUyMjY0Mn0.Nig1oYZfEuksrKrEouNCJtDVZwBkUiRf9mz6R80BLqo`
   - **Environment**: Production, Preview, Development (marque todas)

3. Clique em **Save** para cada variável

---

## 🚀 Passo 5: Fazer Deploy

1. Vá em **Deployments**
2. Clique em **"Redeploy"** (se já tiver feito um deploy antes)
3. Ou faça um novo commit para trigger automático:

```bash
git commit --allow-empty -m "Trigger deploy"
git push
```

4. Aguarde o build completar (pode levar 2-5 minutos)

---

## ✅ Verificar se Funcionou

Após o deploy:

1. Acesse a URL fornecida pelo Vercel (ex: `nutrigest.vercel.app`)
2. Teste:
   - ✅ Criar uma conta
   - ✅ Fazer login
   - ✅ Registrar refeições
   - ✅ Ver dashboard

---

## 🔧 Troubleshooting

### Erro: "Supabase não configurado"
- **Solução**: Verifique se as variáveis de ambiente estão configuradas no Vercel

### Erro: "Build failed"
- **Solução**: Verifique os logs do build no Vercel
- Pode ser problema com `minimatch` - já temos o fix no código

### Erro: "Module not found"
- **Solução**: Certifique-se de que todas as dependências estão no `package.json`

### App não carrega
- **Solução**: Verifique o console do navegador (F12)
- Verifique se as variáveis de ambiente estão corretas

---

## 📝 Notas Importantes

1. **Nunca commite o arquivo `.env`** - ele está no `.gitignore`
2. **As variáveis de ambiente devem ser configuradas no Vercel**
3. **O build pode demorar alguns minutos na primeira vez**
4. **Após cada push, o Vercel faz deploy automaticamente**

---

## 🎉 Pronto!

Se tudo der certo, seu app estará no ar! 🚀

**Precisa de ajuda?** Me avise se encontrar algum problema durante o deploy!

