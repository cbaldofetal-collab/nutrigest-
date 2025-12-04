# 🚀 Guia Rápido - Criar Assets em 10 Minutos

## Método Mais Rápido (Recomendado)

### Opção 1: Usar AppIcon.co (5 minutos)

1. **Criar design básico:**
   - Abra https://www.canva.com/ ou https://www.figma.com/
   - Crie um design 1024x1024px
   - Use fundo verde claro (#E8F5E9)
   - Adicione um emoji ou ícone central: 🤰 ou 🌿 ou ❤️
   - Exporte como PNG

2. **Gerar todos os tamanhos:**
   - Acesse https://www.appicon.co/
   - Faça upload do seu PNG 1024x1024px
   - Selecione iOS e Android
   - Baixe o pacote
   - Extraia na pasta `assets/`

3. **Criar splash screen:**
   - Use o mesmo design
   - Crie um frame 1242x2436px
   - Centralize o logo
   - Exporte como `splash.png`

✅ **Pronto!** Execute `npm run check-assets` para verificar.

---

## Opção 2: Usar Templates Prontos

### Canva Templates:
1. Acesse https://www.canva.com/
2. Busque "app icon template"
3. Escolha um template
4. Personalize com cores do NutriGest
5. Exporte em 1024x1024px
6. Use AppIcon.co para gerar tamanhos

### Figma Templates:
1. Acesse https://www.figma.com/community
2. Busque "app icon template"
3. Duplique um template
4. Personalize
5. Exporte

---

## Especificações Mínimas

### Cores do NutriGest (do tema do app):
- **Fundo:** #E8F5E9 (Verde muito claro - usado no splash)
- **Primária:** #81C784 (Verde - cor principal)
- **Primária Dark:** #66BB6A (Verde escuro)
- **Secundária:** #64B5F6 (Azul)
- **Acento:** #F48FB1 (Rosa)

### Elementos Sugeridos:
- 🤰 Gestante
- 🌿 Folha
- ❤️ Coração
- 🍎 Alimentos
- 💚 Símbolo de nutrição

### Estilo:
- Minimalista
- Cores suaves
- Moderno
- Acolhedor

---

## Checklist Final

Após criar os assets:

```bash
# Verificar se todos os arquivos estão presentes
npm run check-assets

# Os arquivos devem estar em:
assets/icon.png
assets/splash.png
assets/adaptive-icon.png
assets/favicon.png
```

---

## 💡 Dica Pro

Se você não tem experiência com design:
1. Use um gerador de ícones com texto: https://www.favicon-generator.org/
2. Ou contrate um designer no Fiverr/99designs
3. Ou use um template do Canva e personalize

O importante é ter os arquivos no formato e tamanho corretos!

