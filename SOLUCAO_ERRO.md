# 🔧 Solução: ERR_CONNECTION_REFUSED

## ❌ Erro: "A conexão com localhost foi recusada"

Isso significa que o servidor não está rodando ainda.

## ✅ Solução Passo a Passo

### 1. Abra um Terminal NOVO

Abra um terminal **separado** (Terminal do Mac, não o do Cursor) e execute:

```bash
cd /Users/carlosalbertoraimundobaldo/Library/CloudStorage/Dropbox/cursor
```

### 2. Execute o Comando

```bash
npx expo start --web
```

### 3. Aguarde a Mensagem

Você deve ver algo como:

```
Starting Metro Bundler
Web is waiting on http://localhost:19006
```

**IMPORTANTE:** Só acesse o navegador DEPOIS de ver essa mensagem!

### 4. Acesse no Navegador

Quando aparecer "Web is waiting on...", aí sim:

1. Abra o navegador (Chrome, Firefox, Safari)
2. Digite: `http://localhost:19006`
3. Pressione Enter

---

## ⏳ Tempo de Espera

- **Primeira vez:** 30-60 segundos
- **Próximas vezes:** 10-20 segundos

**É normal demorar!** Aguarde até ver a mensagem no terminal.

---

## 🔍 Verificar se Está Rodando

No terminal, você deve ver:
- ✅ "Metro bundler running"
- ✅ "Web is waiting on http://localhost:..."
- ✅ Sem erros vermelhos

Se ver erros, copie e me envie!

---

## 💡 Dica

**NÃO feche o terminal** enquanto estiver usando o app!
O servidor precisa ficar rodando.

---

**Tente executar no terminal e me diga o que aparece!**

