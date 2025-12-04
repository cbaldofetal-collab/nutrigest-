# 🚀 Guia de Deploy - NutriGest

## Opções de Deploy Recomendadas

### ✅ **Vercel (Recomendado para Web)**
- **Gratuito** e muito fácil de configurar
- Deploy automático a cada push no GitHub
- Suporte nativo para React/Expo Web
- HTTPS automático
- CDN global

### 📦 **GitHub (Obrigatório para versionamento)**
- Controle de versão
- Necessário para deploy na Vercel
- Gratuito

### 🔄 **Supabase (Opcional - Futuro)**
- Não é necessário agora (app é offline-first)
- Pode ser usado no futuro para:
  - Sincronização de dados entre dispositivos
  - Backup na nuvem
  - Compartilhamento com médicos

---

## 📋 Passo a Passo para Deploy

### **1. Preparar o Repositório GitHub**

```bash
# 1. Inicializar Git (se ainda não foi feito)
git init

# 2. Adicionar todos os arquivos
git add .

# 3. Fazer primeiro commit
git commit -m "Initial commit: NutriGest MVP"

# 4. Criar repositório no GitHub (via site github.com)
#    - Vá em: https://github.com/new
#    - Nome: nutrigest
#    - Público ou Privado (sua escolha)
#    - NÃO inicialize com README (já temos um)

# 5. Conectar ao repositório remoto
git remote add origin https://github.com/SEU_USUARIO/nutrigest.git

# 6. Enviar código
git branch -M main
git push -u origin main
```

### **2. Deploy na Vercel**

#### **Opção A: Via Interface Web (Mais Fácil)**

1. Acesse: https://vercel.com
2. Faça login com sua conta GitHub
3. Clique em **"Add New Project"**
4. Selecione o repositório `nutrigest`
5. Configure:
   - **Framework Preset**: Other
   - **Build Command**: `npm run web:build`
   - **Output Directory**: `web-build`
   - **Install Command**: `npm install`
6. Clique em **"Deploy"**
7. Aguarde o build (2-5 minutos)
8. ✅ Pronto! Você terá uma URL como: `https://nutrigest.vercel.app`

#### **Opção B: Via CLI (Mais Rápido)**

```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Fazer login
vercel login

# 3. Deploy
vercel

# 4. Seguir as instruções:
#    - Link to existing project? No
#    - Project name: nutrigest
#    - Directory: ./
#    - Override settings? No
```

### **3. Configurar Build para Produção**

O projeto já está configurado! Os scripts necessários estão no `package.json`:
- `npm run web:build` - Gera build de produção
- `npm run web:serve` - Testa build localmente

---

## 🔧 Configurações Adicionais

### **Variáveis de Ambiente (se necessário no futuro)**

Se precisar adicionar variáveis de ambiente:
1. Vá em: Vercel Dashboard → Seu Projeto → Settings → Environment Variables
2. Adicione variáveis como:
   - `EXPO_PUBLIC_API_URL` (se criar API no futuro)
   - `EXPO_PUBLIC_SUPABASE_URL` (se usar Supabase)

### **Domínio Personalizado (Opcional)**

1. Vá em: Vercel Dashboard → Seu Projeto → Settings → Domains
2. Adicione seu domínio (ex: `nutrigest.com.br`)
3. Configure DNS conforme instruções da Vercel

---

## ✅ Checklist de Deploy

- [ ] Código commitado no GitHub
- [ ] Repositório criado no GitHub
- [ ] Build local funcionando (`npm run web:build`)
- [ ] Conta Vercel criada
- [ ] Projeto conectado ao GitHub
- [ ] Deploy realizado com sucesso
- [ ] URL de produção funcionando
- [ ] Testar todas as funcionalidades na URL de produção

---

## 🐛 Troubleshooting

### **Erro: Build falha**
- Verifique se todas as dependências estão no `package.json`
- Execute `npm install` localmente primeiro
- Verifique os logs de build na Vercel

### **Erro: Página em branco**
- Verifique se o `outputDirectory` está correto (`web-build`)
- Verifique se o `buildCommand` está correto (`npm run web:build`)
- Limpe o cache na Vercel: Settings → Clear Build Cache

### **Erro: Assets não carregam**
- Verifique se os assets estão na pasta `assets/`
- Verifique se o `assetBundlePatterns` no `app.json` inclui `**/*`

---

## 📱 Próximos Passos (Opcional)

### **Deploy Mobile (iOS/Android)**

Para deploy em app stores, use **Expo Application Services (EAS)**:

```bash
# 1. Instalar EAS CLI
npm install -g eas-cli

# 2. Login
eas login

# 3. Configurar projeto
eas build:configure

# 4. Build para Android
npm run build:android

# 5. Build para iOS
npm run build:ios
```

---

## 🎉 Pronto!

Após o deploy, você terá:
- ✅ URL pública do app (ex: `https://nutrigest.vercel.app`)
- ✅ Deploy automático a cada push no GitHub
- ✅ HTTPS automático
- ✅ CDN global para performance

**Compartilhe a URL com seus usuários!** 🚀

