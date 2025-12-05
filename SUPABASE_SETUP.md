# Configuração do Supabase para Autenticação

## Passo 1: Criar Projeto no Supabase

1. Acesse https://supabase.com
2. Crie uma conta (se não tiver)
3. Clique em "New Project"
4. Preencha:
   - **Name**: nutrigest (ou outro nome)
   - **Database Password**: Crie uma senha forte
   - **Region**: Escolha a região mais próxima (ex: South America - São Paulo)
5. Aguarde o projeto ser criado (pode levar alguns minutos)

## Passo 2: Obter Credenciais

1. No dashboard do Supabase, vá em **Settings** → **API**
2. Copie as seguintes informações:
   - **Project URL** (ex: `https://xxxxx.supabase.co`)
   - **anon public** key (chave pública anônima)

## Passo 3: Configurar no App

1. Crie um arquivo `.env` na raiz do projeto:
```bash
EXPO_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_aqui
```

2. Reinicie o servidor Expo:
```bash
npm start
```

## Passo 4: Configurar Email no Supabase

1. No Supabase, vá em **Authentication** → **Settings**
2. Configure o **SMTP Settings** (opcional, mas recomendado para produção):
   - Use um serviço como SendGrid, Mailgun, ou AWS SES
   - Ou use o email padrão do Supabase (limitado)

## Passo 5: Configurar Redirect URLs

1. No Supabase, vá em **Authentication** → **URL Configuration**
2. Adicione as URLs de redirect:
   - Para desenvolvimento: `exp://localhost:8081`
   - Para produção: `nutrigest://reset-password`

## Testando

Após configurar, você pode testar:
- Login com email e senha
- Cadastro de novo usuário
- Recuperação de senha

## Nota

O arquivo `.env` está no `.gitignore` e não será commitado. Certifique-se de configurar as variáveis de ambiente no Vercel também para o deploy web.

