# Configurar o Assistente IA em produção

## 1. Obter chave Groq

Acesse: https://console.groq.com/keys

- Faça login (gratuito, sem cartão)
- Clique em **"Create API Key"**
- Copie a chave gerada (começa com `gsk_...`)
- **NÃO cole essa chave em lugar nenhum público**

## 2. Configurar na Vercel

1. Acesse: https://vercel.com/dashboard
2. Abra o projeto **registrar-certo**
3. Vá em **Settings → Environment Variables**
4. Adicione a variável:
   - **Name:** `GROQ_API_KEY`
   - **Value:** cole a chave que você copiou
   - **Environments:** marque Production, Preview e Development
5. Clique em **Save**
6. Vá em **Deployments** e clique em **Redeploy** no último deploy

## 3. Testar local (opcional)

```bash
# Crie arquivo .env.local na raiz do projeto com:
GROQ_API_KEY="gsk_sua_chave_aqui"

# Rode:
npm run dev

# Abra http://localhost:3000/assistente
```

## 4. Limites do plano gratuito do Groq

- ~30 requisições por minuto
- ~14.400 requisições por dia
- Modelo usado: `llama-3.3-70b-versatile` (rápido e de qualidade)

Se precisar de mais, o plano pago começa em $0/mês com cobrança por uso.

## 5. Como desligar o assistente

Se quiser desativar temporariamente, remova a variável `GROQ_API_KEY` da Vercel.
O site continua funcionando normal, apenas o chat mostra mensagem de "não configurado".
