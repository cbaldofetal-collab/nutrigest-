# 🚀 Guia Passo a Passo - Configurar Supabase

## 📋 Passo 1: Criar Conta no Supabase

1. Acesse: **https://supabase.com**
2. Clique em **"Start your project"** (canto superior direito)
3. Escolha uma das opções:
   - **Sign in with GitHub** (recomendado - mais rápido)
   - **Sign in with Email** (criar conta com email)

## 📋 Passo 2: Criar Novo Projeto

1. Após fazer login, clique no botão **"New Project"** (verde, canto superior direito)
2. Preencha o formulário:

   **Organization:**
   - Se for seu primeiro projeto, crie uma organização
   - Nome: `NutriGest` ou seu nome
   
   **Project Details:**
   - **Name**: `nutrigest` (ou outro nome de sua escolha)
   - **Database Password**: 
     - Crie uma senha forte (mínimo 12 caracteres)
     - ⚠️ **ANOTE ESTA SENHA!** Você precisará dela depois
     - Exemplo: `NutriGest2024!Secure`
   
   **Region:**
   - Escolha: **South America (São Paulo)** 
   - Isso garante melhor performance no Brasil
   
   **Pricing Plan:**
   - Escolha: **Free** (plano gratuito é suficiente para começar)

3. Clique em **"Create new project"**
4. ⏳ Aguarde 2-3 minutos enquanto o projeto é criado

## 📋 Passo 3: Obter Credenciais da API

1. Após o projeto ser criado, você será redirecionado para o dashboard
2. No menu lateral esquerdo, clique em **Settings** (ícone de engrenagem ⚙️)
3. Clique em **API** (no submenu de Settings)
4. Você verá uma seção chamada **"Project API keys"**

   **Copie estas duas informações:**
   
   a) **Project URL**
   - Está na seção "Project URL"
   - Formato: `https://xxxxxxxxxxxxx.supabase.co`
   - Exemplo: `https://abcdefghijklmnop.supabase.co`
   
   b) **anon public key**
   - Está na seção "API keys"
   - Procure por "anon" "public"
   - É uma string longa começando com `eyJ...`
   - Clique no ícone de "copiar" ao lado

## 📋 Passo 4: Criar Arquivo .env no Projeto

1. Volte para o projeto no seu computador
2. Na raiz do projeto (mesma pasta do `package.json`), crie um arquivo chamado `.env`
3. Cole o seguinte conteúdo:

```bash
EXPO_PUBLIC_SUPABASE_URL=https://SEU_PROJECT_URL_AQUI.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=SUA_CHAVE_ANON_AQUI
```

4. **Substitua** os valores:
   - `SEU_PROJECT_URL_AQUI` → Cole a Project URL que você copiou
   - `SUA_CHAVE_ANON_AQUI` → Cole a chave anon public que você copiou

**Exemplo real:**
```bash
EXPO_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## 📋 Passo 5: Configurar Email (Para Recuperação de Senha)

1. No Supabase, vá em **Authentication** (menu lateral) → **Settings**
2. Role até a seção **"SMTP Settings"**
3. Para **testes**, você pode usar o email padrão do Supabase (já configurado)
4. Para **produção**, configure um serviço de email:
   - SendGrid
   - Mailgun
   - AWS SES
   - Ou outro serviço SMTP

**Por enquanto, para testes, pode deixar o padrão!**

## 📋 Passo 6: Configurar Redirect URLs

1. No Supabase, ainda em **Authentication** → **Settings**
2. Role até **"URL Configuration"**
3. Em **"Redirect URLs"**, adicione:
   - `nutrigest://reset-password`
   - `exp://localhost:8081`
4. Clique em **"Save"**

## 📋 Passo 7: Reiniciar o Servidor Expo

1. Pare o servidor Expo (Ctrl+C no terminal)
2. Inicie novamente:
```bash
npm start
```

3. Limpe o cache se necessário:
```bash
npm start -- --clear
```

## ✅ Testar

Agora você pode testar:

1. **Criar uma conta:**
   - Abra o app
   - Clique em "Cadastre-se"
   - Preencha nome, email e senha
   - A senha deve ter: mínimo 8 caracteres, 1 maiúscula, 1 minúscula, 1 número

2. **Fazer login:**
   - Use o email e senha que você criou

3. **Testar recuperação de senha:**
   - Na tela de login, clique em "Esqueci minha senha"
   - Digite seu email
   - Verifique sua caixa de entrada (pode ir para spam)

## 🔍 Verificar se Está Funcionando

Se tudo estiver configurado corretamente:
- ✅ O app não mostrará erro ao tentar fazer login
- ✅ Você conseguirá criar uma conta
- ✅ Receberá email de confirmação (se configurado)
- ✅ Conseguirá fazer login após criar a conta

## ⚠️ Problemas Comuns

**Erro: "Invalid API key"**
- Verifique se copiou a chave completa
- Verifique se não há espaços extras no `.env`

**Erro: "Invalid URL"**
- Verifique se a URL começa com `https://`
- Verifique se não há espaços ou caracteres extras

**Email de recuperação não chega:**
- Verifique a pasta de spam
- Configure SMTP personalizado para produção

## 📝 Próximos Passos (Opcional)

Depois que estiver funcionando, você pode:
- Configurar tabelas no banco de dados para sincronizar dados
- Configurar Row Level Security (RLS) para proteger dados
- Adicionar mais funcionalidades de autenticação

---

**Precisa de ajuda?** Me avise se encontrar algum problema durante a configuração!

