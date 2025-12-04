# 🍎 NutriGest - Acompanhamento Nutricional para Gestantes

Aplicativo completo para acompanhamento nutricional durante a gestação, desenvolvido com React Native e Expo.

## ✨ Funcionalidades

- 📊 **Dashboard Interativo** - Visualização completa do dia com gráficos
- 🍽️ **Registro de Refeições** - Registre alimentos e acompanhe nutrientes
- 📈 **Gráficos e Estatísticas** - Distribuição de calorias e nutrientes críticos
- 📄 **Relatórios em PDF** - Gere relatórios completos para compartilhar com médicos
- 🏥 **Exames Médicos** - Registre e acompanhe exames laboratoriais
- 📚 **Receitas** - Biblioteca de receitas saudáveis
- 📅 **Planejador de Refeições** - Sugestões de cardápio semanal
- ⭐ **Favoritos** - Salve alimentos mais consumidos
- 💧 **Hidratação** - Acompanhe consumo de água
- ⚖️ **Peso** - Registre e acompanhe evolução do peso
- 🤒 **Sintomas** - Registre sintomas como náuseas e azia

## 🚀 Deploy

### Status: ✅ Pronto para Deploy

O projeto está configurado e pronto para deploy na **Vercel**.

### Passos Rápidos:

1. **Criar repositório no GitHub:**
   - Acesse: https://github.com/new
   - Nome: `nutrigest`
   - Crie o repositório (público ou privado)

2. **Conectar ao GitHub:**
   ```bash
   git remote add origin https://github.com/SEU_USUARIO/nutrigest.git
   git branch -M main
   git push -u origin main
   ```

3. **Deploy na Vercel:**
   - Acesse: https://vercel.com
   - Conecte com GitHub
   - Selecione o repositório `nutrigest`
   - Configure:
     - Build Command: `npm run web:build`
     - Output Directory: `web-build`
   - Clique em "Deploy"

4. **Pronto!** Você terá uma URL pública como: `https://nutrigest.vercel.app`

📖 **Guia Completo:** Veja `DEPLOY_RAPIDO.md` para instruções detalhadas.

## 🛠️ Desenvolvimento Local

### Instalar Dependências
```bash
npm install
```

### Rodar no Navegador
```bash
npm run web
```

### Build para Produção
```bash
npm run web:build
npm run web:serve
```

## 📱 Tecnologias

- **React Native** + **Expo** - Framework mobile
- **TypeScript** - Type safety
- **Zustand** - State management
- **React Navigation** - Navegação
- **AsyncStorage** - Armazenamento local
- **Chart.js** - Gráficos
- **Expo Print** - Geração de PDFs

## 📋 Estrutura do Projeto

```
nutrigest/
├── src/
│   ├── components/     # Componentes reutilizáveis
│   ├── screens/        # Telas do app
│   ├── services/       # Serviços (storage, API, etc)
│   ├── store/          # Zustand stores
│   ├── navigation/     # Configuração de navegação
│   ├── theme/          # Tema e estilos
│   ├── types/          # TypeScript types
│   └── utils/          # Funções utilitárias
├── assets/             # Imagens e assets
├── app.json            # Configuração Expo
└── package.json        # Dependências
```

## 🎯 Características

- ✅ **Offline-First** - Funciona sem internet
- ✅ **Responsivo** - Adapta-se a diferentes tamanhos de tela
- ✅ **Acessível** - Suporte a leitores de tela
- ✅ **Type-Safe** - TypeScript em todo o código
- ✅ **Testado** - Testes unitários básicos

## 📄 Licença

Este projeto é privado.

## 👥 Contribuição

Este é um projeto MVP. Para contribuições futuras, entre em contato.

---

**Desenvolvido com ❤️ para gestantes**
