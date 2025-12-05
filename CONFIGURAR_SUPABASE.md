# 🔐 Como Configurar o Supabase para Autenticação

## Passo 1: Criar Conta e Projeto no Supabase

1. Acesse https://supabase.com
2. Clique em "Start your project" ou faça login
3. Clique em "New Project"
4. Preencha:
   - **Name**: `nutrigest` (ou outro nome)
   - **Database Password**: Crie uma senha forte (anote ela!)
   - **Region**: Escolha `South America (São Paulo)` para melhor performance no Brasil
5. Clique em "Create new project"
6. Aguarde 2-3 minutos para o projeto ser criado

## Passo 2: Obter Credenciais da API

1. No dashboard do Supabase, vá em **Settings** (ícone de engrenagem) → **API**
2. Você verá duas informações importantes:
   - **Project URL**: Algo como `https://xxxxx.supabase.co`
   - **anon public** key: Uma chave longa começando com `eyJ...`

## Passo 3: Configurar Variáveis de Ambiente

1. Na raiz do projeto, crie um arquivo `.env`:
```bash
EXPO_PUBLIC_SUPABASE_URL=https://seu-projeto-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_aqui
```

2. **IMPORTANTE**: Substitua pelos valores reais do seu projeto!

## Passo 4: Configurar Email (Opcional mas Recomendado)

Para recuperação de senha funcionar:

1. No Supabase, vá em **Authentication** → **Settings**
2. Role até **SMTP Settings**
3. Você pode:
   - **Opção 1**: Usar o email padrão do Supabase (limitado, mas funciona para testes)
   - **Opção 2**: Configurar um serviço de email (SendGrid, Mailgun, AWS SES) para produção

## Passo 5: Configurar Redirect URLs

1. No Supabase, vá em **Authentication** → **URL Configuration**
2. Em **Redirect URLs**, adicione:
   - `nutrigest://reset-password` (para deep linking no app)
   - `exp://localhost:8081` (para desenvolvimento)

## Passo 6: Testar

1. Reinicie o servidor Expo:
```bash
npm start
```

2. Teste no app:
   - Criar uma conta nova
   - Fazer login
   - Testar "Esqueci minha senha"

## ⚠️ Importante

- O arquivo `.env` está no `.gitignore` e **NÃO será commitado**
- Para deploy no Vercel, você precisa adicionar as variáveis de ambiente nas configurações do projeto
- Nunca compartilhe suas chaves do Supabase publicamente

## 🔒 Segurança

- A chave `anon` é pública e pode ser usada no frontend
- O Supabase tem Row Level Security (RLS) para proteger os dados
- Configure RLS nas tabelas do banco de dados quando necessário

## 📚 Próximos Passos

Após configurar, você pode:
- Sincronizar dados entre dispositivos
- Fazer backup na nuvem
- Compartilhar dados com profissionais de saúde

