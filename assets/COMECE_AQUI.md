# 🚀 COMECE AQUI: Criar Assets em 5 Passos

## ⚡ Método Mais Rápido (15 minutos)

### 📝 Passo 1: Criar Ícone Base (5 min)

**Opção A: Canva (Mais Fácil)**
1. Acesse: **https://www.canva.com/** (crie conta grátis)
2. Clique em **"Criar design"** → **"Tamanho personalizado"**
3. Digite: **1024** x **1024** pixels
4. Clique em **"Criar novo design"**

**Agora crie o design:**
1. Clique em **"Elementos"** → **"Formas"** → Escolha um **quadrado**
2. Arraste para preencher toda a tela
3. Clique no quadrado → **"Preencher"** → Digite: **#E8F5E9** (verde claro)
4. Clique em **"Texto"** → Digite: **🤰** (ou 🌿 ou ❤️)
5. Aumente o tamanho do emoji (fonte ~400-500px)
6. Centralize o emoji (use as linhas de guia)
7. Clique em **"Download"** (canto superior direito)
8. Escolha: **PNG** → **Download**

✅ **Você agora tem um arquivo PNG 1024x1024px!**

---

### 📦 Passo 2: Gerar Todos os Tamanhos (2 min)

1. Acesse: **https://www.appicon.co/**
2. Clique em **"Upload Image"**
3. Faça upload do PNG que você acabou de criar
4. Marque:
   - ✅ **iOS**
   - ✅ **Android**
5. Clique em **"Generate"**
6. Aguarde alguns segundos
7. Clique em **"Download"** (baixa um ZIP)

✅ **Você baixou um pacote com todos os tamanhos!**

---

### 📂 Passo 3: Extrair Arquivos (1 min)

1. Abra o arquivo ZIP que você baixou
2. Procure pela pasta **"iOS"** ou **"AppIcon.appiconset"**
3. Procure por um arquivo chamado:
   - `AppIcon-1024.png` ou
   - `icon-1024.png` ou
   - `1024.png`
4. **Renomeie este arquivo para:** `icon.png`
5. Copie para a pasta: `assets/icon.png`

✅ **Ícone principal criado!**

---

### 🖼️ Passo 4: Criar Splash Screen (5 min)

**No Canva:**
1. Crie um novo design: **1242** x **2436** pixels
2. Adicione um retângulo preenchendo tudo
3. Cor: **#E8F5E9** (verde claro)
4. Adicione o mesmo emoji/texto do ícone
5. Centralize (vertical e horizontal)
6. Tamanho do emoji: ~30-40% da altura
7. **Download** → **PNG** → Salve como `splash.png`
8. Copie para: `assets/splash.png`

✅ **Splash screen criado!**

---

### ✅ Passo 5: Criar Arquivos Restantes (2 min)

**adaptive-icon.png:**
- Pode ser o mesmo arquivo do `icon.png`
- Copie `icon.png` e renomeie para `adaptive-icon.png`

**favicon.png:**
- No Canva, crie um design **48 x 48** pixels
- Mesmo design do ícone (menor)
- Ou use o mesmo `icon.png` (será redimensionado automaticamente)
- Salve como `favicon.png`

**Organize na pasta assets/:**
```
assets/
  ├── icon.png          ✅
  ├── splash.png        ✅
  ├── adaptive-icon.png ✅
  └── favicon.png       ✅
```

---

### 🔍 Passo 6: Verificar (1 min)

Abra o terminal e execute:

```bash
npm run check-assets
```

**Se tudo estiver OK, você verá:**
```
✅ Checklist:
   ✅ icon.png
   ✅ splash.png
   ✅ adaptive-icon.png
   ✅ favicon.png
```

---

## 🎨 Dicas Rápidas

### Cores para Usar:
- **Fundo:** `#E8F5E9` (verde claro)
- **Elemento:** `#81C784` (verde) ou `#F48FB1` (rosa)

### Elementos que Funcionam:
- 🤰 Gestante (mais representativo)
- 🌿 Folha (natureza, saúde)
- ❤️ Coração (cuidado)
- 🍎 Alimentos (nutrição)

### Se Preferir Texto:
- "NG" (NutriGest)
- "N" estilizado
- Fonte: Sans-serif, bold, grande

---

## 🆘 Problemas Comuns

### "Não encontro o arquivo no ZIP"
- Procure em todas as pastas (iOS, Android, etc.)
- O arquivo pode ter outro nome, mas será 1024x1024px

### "O design não ficou bom"
- Use um emoji grande e simples
- Mantenha o fundo sólido
- Centralize tudo

### "Não consigo baixar do Canva"
- Verifique se está logado
- Tente outro navegador
- Use a opção "Compartilhar" → "Download"

---

## ✅ Checklist Final

Antes de continuar, verifique:

- [ ] `icon.png` existe em `assets/` (1024x1024px)
- [ ] `splash.png` existe em `assets/` (1242x2436px)
- [ ] `adaptive-icon.png` existe em `assets/` (1024x1024px)
- [ ] `favicon.png` existe em `assets/` (48x48px)
- [ ] `npm run check-assets` mostra todos ✅

---

## 🚀 Próximo Passo

Depois que todos os assets estiverem criados:
1. ✅ Assets criados
2. ⏭️ Configurar EAS (item 2)
3. ⏭️ Testes em dispositivos (item 3)

---

## 💡 Dica Extra

Se você quiser algo mais profissional depois, pode:
- Contratar um designer no Fiverr (~$20-50)
- Usar templates do Figma
- Melhorar o design gradualmente

**Para agora, o importante é ter os arquivos funcionais!**

