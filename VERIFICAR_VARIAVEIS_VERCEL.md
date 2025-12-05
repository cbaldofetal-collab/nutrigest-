# ✅ Verificar Variáveis de Ambiente no Vercel

## 🔍 Como Verificar

1. No Vercel, clique no projeto **"nutrigest"**
2. Vá em **Settings** (no menu superior)
3. Clique em **Environment Variables** (no menu lateral)
4. Verifique se existem estas duas variáveis:

   ✅ `EXPO_PUBLIC_SUPABASE_URL`
   ✅ `EXPO_PUBLIC_SUPABASE_ANON_KEY`

## ⚠️ Se NÃO existirem, adicione:

### Variável 1:
- **Name**: `EXPO_PUBLIC_SUPABASE_URL`
- **Value**: `https://tttfsmhmtkiqzypgjrqu.supabase.co`
- **Environment**: Marque todas (Production, Preview, Development)

### Variável 2:
- **Name**: `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0dGZzbWhtdGtpcXp5cGdqcnF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5NDY2NDIsImV4cCI6MjA4MDUyMjY0Mn0.Nig1oYZfEuksrKrEouNCJtDVZwBkUiRf9mz6R80BLqo`
- **Environment**: Marque todas (Production, Preview, Development)

## 🔄 Depois de Adicionar/Atualizar:

1. Vá em **Deployments**
2. Clique nos três pontos (`...`) do último deploy
3. Clique em **Redeploy**
4. Aguarde o build completar

## ✅ Testar:

Acesse: **https://nutrigest.vercel.app**

Teste:
- Criar uma conta
- Fazer login
- Registrar refeições

Se funcionar, está tudo OK! 🎉

