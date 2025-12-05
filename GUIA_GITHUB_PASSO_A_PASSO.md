# 📚 Guia Passo a Passo - Criar Repositório no GitHub

## 🎯 Objetivo
Criar um repositório no GitHub e enviar nosso código para lá.

---

## 📋 PASSO 1: Criar Conta no GitHub (se ainda não tiver)

### 1.1. Acesse o GitHub
- Abra seu navegador (Chrome, Safari, Firefox)
- Digite na barra de endereço: **https://github.com**
- Pressione Enter

### 1.2. Fazer Login ou Criar Conta

**Se você JÁ TEM conta:**
- Clique no botão **"Sign in"** (canto superior direito)
- Digite seu email e senha
- Clique em **"Sign in"**

**Se você NÃO TEM conta:**
- Clique no botão **"Sign up"** (canto superior direito)
- Preencha:
  - Email
  - Senha (mínimo 8 caracteres)
  - Nome de usuário (escolha um nome único)
- Clique em **"Create account"**
- Siga as instruções para verificar seu email

---

## 📋 PASSO 2: Criar Novo Repositório

### 2.1. Acessar a Página de Criação
Depois de fazer login, você verá a página inicial do GitHub.

**Opção A - Via Menu:**
1. No canto superior direito, clique no ícone **"+"** (ao lado da sua foto)
2. Clique em **"New repository"**

**Opção B - Via URL Direta:**
1. Digite na barra de endereço: **https://github.com/new**
2. Pressione Enter

### 2.2. Preencher Informações do Repositório

Você verá um formulário. Preencha assim:

#### **Repository name** (Nome do Repositório)
```
nutrigest
```
⚠️ **Importante:** Use exatamente este nome (minúsculas, sem espaços)

#### **Description** (Descrição - Opcional)
```
Aplicativo de acompanhamento nutricional para gestantes
```
Ou deixe em branco se preferir.

#### **Visibility** (Visibilidade)
Escolha uma opção:
- ✅ **Public** - Qualquer pessoa pode ver (recomendado para projetos)
- 🔒 **Private** - Apenas você pode ver (se quiser manter privado)

**Recomendação:** Escolha **Public** (é gratuito e permite deploy fácil na Vercel)

### 2.3. ⚠️ IMPORTANTE - NÃO Marcar Nada!

**NÃO marque nenhuma das opções abaixo:**
- ❌ **Add a README file** - Já temos um README
- ❌ **Add .gitignore** - Já temos um .gitignore
- ❌ **Choose a license** - Não precisa agora

**Deixe tudo desmarcado!**

### 2.4. Criar o Repositório
1. Clique no botão verde **"Create repository"** (no final da página)
2. Aguarde alguns segundos...

---

## 📋 PASSO 3: Conectar o Código Local ao GitHub

### 3.1. Copiar a URL do Repositório

Depois de criar o repositório, o GitHub vai mostrar uma página com instruções.

**Você verá algo assim:**

```
Quick setup — if you've done this kind of thing before
https://github.com/SEU_USUARIO/nutrigest.git
```

**O que fazer:**
1. **Copie a URL** que aparece (começa com `https://github.com/...`)
2. **Anote seu nome de usuário** do GitHub (aparece na URL)

**Exemplo:**
- Se a URL for: `https://github.com/joaosilva/nutrigest.git`
- Seu usuário é: `joaosilva`

### 3.2. Abrir o Terminal

Agora vamos executar comandos no terminal.

**No Mac:**
1. Pressione `Cmd + Espaço` (abre busca)
2. Digite: `Terminal`
3. Pressione Enter

### 3.3. Navegar até a Pasta do Projeto

No terminal, digite:

```bash
cd /Users/carlosalbertoraimundobaldo/Library/CloudStorage/Dropbox/cursor
```

Pressione Enter.

### 3.4. Conectar ao GitHub

Agora vamos conectar nosso código local ao repositório do GitHub.

**Substitua `SEU_USUARIO` pelo seu nome de usuário do GitHub!**

**Exemplo:** Se seu usuário for `joaosilva`, o comando seria:
```bash
git remote add origin https://github.com/joaosilva/nutrigest.git
```

**Execute este comando (substituindo SEU_USUARIO):**
```bash
git remote add origin https://github.com/SEU_USUARIO/nutrigest.git
```

Pressione Enter.

**Se aparecer algum erro**, pode ser que já esteja conectado. Tente:
```bash
git remote set-url origin https://github.com/SEU_USUARIO/nutrigest.git
```

### 3.5. Renomear Branch para "main"

```bash
git branch -M main
```

Pressione Enter.

### 3.6. Enviar Código para o GitHub

```bash
git push -u origin main
```

Pressione Enter.

**O que vai acontecer:**
- O GitHub pode pedir seu **nome de usuário** e **senha**
- Digite seu nome de usuário do GitHub
- Para a senha, você precisará usar um **Personal Access Token** (veja abaixo)

---

## 📋 PASSO 4: Criar Personal Access Token (se pedir senha)

Se o GitHub pedir senha, você precisa criar um **Personal Access Token**.

### 4.1. Criar o Token

1. No GitHub, clique na sua **foto de perfil** (canto superior direito)
2. Clique em **"Settings"**
3. No menu lateral esquerdo, clique em **"Developer settings"** (no final)
4. Clique em **"Personal access tokens"**
5. Clique em **"Tokens (classic)"**
6. Clique no botão **"Generate new token"**
7. Clique em **"Generate new token (classic)"**

### 4.2. Configurar o Token

1. **Note** (Nome): Digite `nutrigest-deploy` (ou qualquer nome)
2. **Expiration** (Expiração): Escolha `90 days` ou `No expiration`
3. **Scopes** (Permissões): Marque:
   - ✅ **repo** (todas as opções dentro de repo)
4. Clique em **"Generate token"** (no final da página)

### 4.3. Copiar o Token

⚠️ **IMPORTANTE:** O token aparece apenas UMA VEZ!

1. **Copie o token** imediatamente (é uma sequência longa de letras e números)
2. **Cole em um lugar seguro** (bloco de notas, por exemplo)

### 4.4. Usar o Token

Quando o terminal pedir senha:
1. **Nome de usuário:** Digite seu nome de usuário do GitHub
2. **Senha:** Cole o **Personal Access Token** (não use sua senha normal!)

---

## ✅ Verificar se Funcionou

### 5.1. Verificar no GitHub

1. Acesse: **https://github.com/SEU_USUARIO/nutrigest**
2. Você deve ver todos os arquivos do projeto!
3. ✅ **Sucesso!** O código está no GitHub!

### 5.2. Verificar no Terminal

Se tudo deu certo, você verá algo como:
```
Enumerating objects: 106, done.
Counting objects: 100% (106/106), done.
Writing objects: 100% (106/106), done.
To https://github.com/SEU_USUARIO/nutrigest.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

---

## 🎉 Próximo Passo: Deploy na Vercel

Agora que o código está no GitHub, podemos fazer o deploy na Vercel!

**Veja o arquivo:** `PROXIMOS_PASSOS.md` para continuar.

---

## 🐛 Problemas Comuns

### "remote origin already exists"
**Solução:**
```bash
git remote remove origin
git remote add origin https://github.com/SEU_USUARIO/nutrigest.git
```

### "Authentication failed"
**Solução:** Use o Personal Access Token em vez da senha (veja Passo 4)

### "Repository not found"
**Solução:** Verifique se:
- O nome do repositório está correto
- Você está logado no GitHub
- O repositório existe no GitHub

### "Permission denied"
**Solução:** Verifique se o token tem permissão **repo**

---

## 📞 Precisa de Ajuda?

Se algo não funcionar:
1. Copie a mensagem de erro completa
2. Me mostre o que apareceu
3. Vamos resolver juntos!

**Vamos fazer isso passo a passo!** 🚀

