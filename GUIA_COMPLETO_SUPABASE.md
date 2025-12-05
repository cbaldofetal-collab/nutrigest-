# 🎯 Guia Completo - Configurar Supabase (Para Iniciantes)

## 📍 O que vamos fazer?

Vamos configurar o Supabase para que o app tenha:
- ✅ Login seguro com email e senha
- ✅ Cadastro de novos usuários
- ✅ Recuperação de senha por email
- ✅ Sincronização de dados na nuvem (futuro)

**Tempo estimado:** 10-15 minutos

---

## 🚀 PASSO 1: Acessar o Supabase

1. Abra seu navegador (Chrome, Safari, Firefox, etc.)
2. Digite na barra de endereço: **https://supabase.com**
3. Pressione Enter
4. Você verá a página inicial do Supabase

**O que você verá:**
- Uma página com fundo escuro/roxo
- Botão verde "Start your project" no canto superior direito
- Ou botão "Sign in" se já tiver conta

---

## 🚀 PASSO 2: Criar Conta (Se não tiver)

### Opção A: Criar com GitHub (Mais Rápido - Recomendado)

1. Clique no botão **"Start your project"** ou **"Sign in"**
2. Você verá opções de login
3. Clique em **"Continue with GitHub"** (ou ícone do GitHub)
4. Se não estiver logado no GitHub:
   - Faça login no GitHub
   - Autorize o Supabase a acessar sua conta
5. Pronto! Você será redirecionado para o dashboard

### Opção B: Criar com Email

1. Clique em **"Sign in"** ou **"Start your project"**
2. Clique em **"Sign up"** ou **"Create account"**
3. Preencha:
   - **Email**: seu email
   - **Password**: crie uma senha
4. Clique em **"Create account"**
5. Verifique seu email e confirme a conta
6. Faça login

**✅ Ao final deste passo, você deve estar no dashboard do Supabase**

---

## 🚀 PASSO 3: Criar Novo Projeto

1. No dashboard do Supabase, você verá:
   - Lista de projetos (se tiver algum)
   - Botão verde **"New Project"** no canto superior direito

2. Clique no botão **"New Project"**

3. Você verá um formulário. Preencha:

   **a) Organization (Organização):**
   - Se for seu primeiro projeto, você precisará criar uma organização
   - Clique em **"New Organization"** ou **"Create Organization"**
   - **Name**: Digite `NutriGest` ou seu nome
   - Clique em **"Create Organization"**

   **b) Project Details (Detalhes do Projeto):**
   - **Name**: Digite `nutrigest` (tudo minúsculo, sem espaços)
   - **Database Password**: 
     - ⚠️ **MUITO IMPORTANTE**: Crie uma senha forte
     - Mínimo 12 caracteres
     - Use letras, números e símbolos
     - Exemplo: `NutriGest2024!Secure`
     - ⚠️ **ANOTE ESTA SENHA** em um lugar seguro!
     - Você precisará dela para acessar o banco de dados depois

   **c) Region (Região):**
   - Clique no dropdown
   - Escolha: **South America (São Paulo)**
   - Isso garante melhor velocidade no Brasil

   **d) Pricing Plan (Plano):**
   - Escolha: **Free** (plano gratuito)
   - É suficiente para começar e testar

4. Após preencher tudo, clique no botão **"Create new project"** (verde, no final do formulário)

5. ⏳ **AGUARDE 2-3 MINUTOS**
   - Você verá uma tela de "Setting up your project"
   - Não feche a página!
   - Quando terminar, você será redirecionado automaticamente

**✅ Ao final deste passo, você deve estar no dashboard do seu projeto**

---

## 🚀 PASSO 4: Encontrar as Credenciais da API

Agora vamos pegar as informações que o app precisa para se conectar ao Supabase.

1. **No menu lateral esquerdo**, procure por:
   - Ícone de **engrenagem** ⚙️
   - Ou texto **"Settings"**
   - Clique nele

2. **No submenu que aparece**, clique em **"API"**

3. Você verá uma página com várias seções. Procure por:

   **a) Project URL:**
   - Está na seção **"Project URL"** ou **"Configuration"**
   - Você verá algo como:
     ```
     https://abcdefghijklmnop.supabase.co
     ```
   - ⚠️ **COPIE ESTA URL COMPLETA**
   - Clique no ícone de "copiar" ao lado (ícone de dois quadrados sobrepostos)

   **b) API Keys:**
   - Role a página um pouco para baixo
   - Procure por **"Project API keys"** ou **"API keys"**
   - Você verá várias chaves. Procure por:
     - **"anon"** ou **"public"**
     - É uma string muito longa começando com `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - ⚠️ **COPIE ESTA CHAVE COMPLETA**
   - Clique no ícone de "copiar" ao lado

**✅ Você agora deve ter:**
- ✅ Project URL copiada
- ✅ anon public key copiada

---

## 🚀 PASSO 5: Criar Arquivo .env no Projeto

Agora vamos configurar o projeto local para usar essas credenciais.

1. **Abra o terminal** (ou continue usando o terminal do Cursor)

2. **Navegue até a pasta do projeto** (se ainda não estiver):
   ```bash
   cd /Users/carlosalbertoraimundobaldo/Library/CloudStorage/Dropbox/cursor
   ```

3. **Crie o arquivo .env**:
   ```bash
   touch .env
   ```

4. **Abra o arquivo .env** no editor:
   - Você pode usar: `code .env` (se tiver VS Code)
   - Ou `nano .env` (editor no terminal)
   - Ou abrir manualmente no Cursor

5. **Cole o seguinte conteúdo** no arquivo:
   ```bash
   EXPO_PUBLIC_SUPABASE_URL=
   EXPO_PUBLIC_SUPABASE_ANON_KEY=
   ```

6. **Agora preencha com os valores que você copiou**:
   ```bash
   EXPO_PUBLIC_SUPABASE_URL=https://SEU_PROJECT_URL_AQUI.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=SUA_CHAVE_ANON_AQUI
   ```

   **Exemplo real** (substitua pelos seus valores):
   ```bash
   EXPO_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

7. **Salve o arquivo** (Ctrl+S ou Cmd+S)

**⚠️ IMPORTANTE:**
- Não deixe espaços antes ou depois do `=`
- Não use aspas nos valores
- A URL deve começar com `https://`
- A chave deve começar com `eyJ`

**✅ Ao final deste passo, você deve ter um arquivo .env configurado**

---

## 🚀 PASSO 6: Verificar se Está Configurado Corretamente

Vamos verificar se tudo está certo:

1. **No terminal**, execute:
   ```bash
   npm run check-supabase
   ```

2. **Você deve ver:**
   ```
   ✅ EXPO_PUBLIC_SUPABASE_URL: Configurado
   ✅ EXPO_PUBLIC_SUPABASE_ANON_KEY: Configurado
   ✅ Configuração parece estar correta!
   ```

3. **Se aparecer erro:**
   - Verifique se o arquivo `.env` está na raiz do projeto
   - Verifique se não há espaços extras
   - Verifique se copiou os valores completos

**✅ Se tudo estiver OK, continue para o próximo passo**

---

## 🚀 PASSO 7: Configurar Email (Para Recuperação de Senha)

1. **No Supabase**, no menu lateral, clique em **"Authentication"**

2. **Clique em "Settings"** (no submenu de Authentication)

3. **Role a página até encontrar "SMTP Settings"**

4. **Para TESTES (agora):**
   - O Supabase já vem com email configurado por padrão
   - Você pode usar assim mesmo para testar
   - Os emails podem ir para spam, mas funcionam

5. **Para PRODUÇÃO (depois):**
   - Você precisará configurar um serviço de email real
   - Opções: SendGrid, Mailgun, AWS SES
   - Mas isso pode ser feito depois

**✅ Por enquanto, pode deixar o padrão!**

---

## 🚀 PASSO 8: Configurar Redirect URLs (Para Recuperação de Senha)

1. **Ainda em Authentication → Settings**

2. **Role até "URL Configuration"**

3. **Em "Redirect URLs"**, você verá um campo de texto

4. **Adicione estas URLs** (uma por linha):
   ```
   nutrigest://reset-password
   exp://localhost:8081
   ```

5. **Clique em "Save"** ou "Add"

**✅ Isso permite que o app receba o link de recuperação de senha**

---

## 🚀 PASSO 9: Reiniciar o Servidor Expo

Agora vamos aplicar as configurações:

1. **Pare o servidor Expo** (se estiver rodando):
   - No terminal, pressione `Ctrl+C`

2. **Limpe o cache e reinicie**:
   ```bash
   npm start -- --clear
   ```

3. **Aguarde o servidor iniciar**

**✅ O app agora está conectado ao Supabase!**

---

## 🚀 PASSO 10: Testar!

Agora vamos testar se tudo está funcionando:

### Teste 1: Criar uma Conta

1. Abra o app (no celular ou emulador)
2. Você deve ver a tela de **Login**
3. Clique em **"Cadastre-se"** (ou link similar)
4. Preencha:
   - **Nome**: Seu nome
   - **Email**: Um email válido (pode ser seu email real)
   - **Senha**: 
     - Mínimo 8 caracteres
     - Pelo menos 1 letra MAIÚSCULA
     - Pelo menos 1 letra minúscula
     - Pelo menos 1 número
     - Exemplo: `MinhaSenha123`
5. Clique em **"Criar Conta"**

**✅ Se funcionar, você verá uma mensagem de sucesso!**

### Teste 2: Fazer Login

1. Na tela de login, digite:
   - **Email**: O email que você usou para cadastrar
   - **Senha**: A senha que você criou
2. Clique em **"Entrar"**

**✅ Se funcionar, você entrará no app!**

### Teste 3: Recuperar Senha

1. Na tela de login, clique em **"Esqueci minha senha"**
2. Digite seu email
3. Clique em **"Enviar Link de Recuperação"**
4. Verifique seu email (pode estar na pasta de spam)

**✅ Se funcionar, você receberá um email!**

---

## ❌ Problemas Comuns e Soluções

### Erro: "Invalid API key"
**Solução:**
- Verifique se copiou a chave completa
- Verifique se não há espaços no `.env`
- Verifique se a chave começa com `eyJ`

### Erro: "Invalid URL"
**Solução:**
- Verifique se a URL começa com `https://`
- Verifique se não há espaços
- Verifique se copiou a URL completa

### Erro: "Email already registered"
**Solução:**
- Isso é normal! Significa que o email já está cadastrado
- Use outro email ou faça login

### Email de recuperação não chega
**Solução:**
- Verifique a pasta de spam
- Aguarde alguns minutos
- Para produção, configure SMTP personalizado

### App não conecta ao Supabase
**Solução:**
1. Verifique se o `.env` está na raiz do projeto
2. Execute `npm run check-supabase`
3. Reinicie o servidor com `npm start -- --clear`

---

## ✅ Checklist Final

Antes de considerar que está tudo pronto, verifique:

- [ ] Projeto criado no Supabase
- [ ] Arquivo `.env` criado na raiz do projeto
- [ ] `EXPO_PUBLIC_SUPABASE_URL` configurado no `.env`
- [ ] `EXPO_PUBLIC_SUPABASE_ANON_KEY` configurado no `.env`
- [ ] `npm run check-supabase` mostra tudo OK
- [ ] Servidor Expo reiniciado
- [ ] Conseguiu criar uma conta no app
- [ ] Conseguiu fazer login no app

---

## 🎉 Pronto!

Se você completou todos os passos e os testes funcionaram, **parabéns!** 🎊

O sistema de autenticação está configurado e funcionando. Agora você tem:
- ✅ Login seguro
- ✅ Cadastro de usuários
- ✅ Recuperação de senha
- ✅ Dados protegidos na nuvem

**Próximos passos (opcional):**
- Configurar tabelas no banco para sincronizar dados
- Configurar backup automático
- Adicionar mais funcionalidades

---

**Precisa de ajuda em algum passo específico?** Me avise qual passo você está e o que está vendo na tela!

