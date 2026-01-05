# Baileys Example

Este exemplo demonstra como usar a biblioteca Baileys para interagir com WhatsApp Web.

## Funcionalidades

### Extração de Hash de Figurinhas (Stickers)

O exemplo inclui uma funcionalidade que automaticamente extrai o hash SHA256 de figurinhas recebidas e envia de volta para o remetente.

**Como funciona:**

1. Quando uma figurinha é recebida de outro usuário
2. O sistema extrai o hash SHA256 da figurinha usando a função `mediaMessageSHA256B64`
3. Envia automaticamente uma mensagem de texto com o hash no formato: `Hash da figurinha: [hash]`

**Código relevante:**

```typescript
// Handle sticker messages - extract hash and send it back
if (msg.message?.stickerMessage) {
    console.log('Received a sticker message')
    const stickerHash = mediaMessageSHA256B64(msg.message)
    if (stickerHash && !msg.key.fromMe) {
        console.log('Sticker hash:', stickerHash)
        await sock!.readMessages([msg.key])
        await sendMessageWTyping(
            { text: `Hash da figurinha: ${stickerHash}` },
            msg.key.remoteJid!
        )
    }
}
```

**Importante:**
- A funcionalidade só responde a figurinhas enviadas por outros usuários (não responde às próprias mensagens)
- O hash é extraído do campo `fileSha256` da mensagem de figurinha
- O hash é retornado em formato base64

## Como executar

1. Instale as dependências:
```bash
npm install --legacy-peer-deps
```

2. Execute o exemplo:
```bash
npm run example
```

3. Use `--use-pairing-code` para autenticação via código de pareamento:
```bash
npm run example -- --use-pairing-code
```

4. Use `--do-reply` para habilitar respostas automáticas a todas as mensagens:
```bash
npm run example -- --do-reply
```

## Outras Funcionalidades

O exemplo também demonstra:
- Autenticação com QR Code ou código de pareamento
- Sincronização de histórico de mensagens
- Requisição de reenvio de mensagens placeholder
- Sincronização de mensagens sob demanda (on-demand)
- Tratamento de eventos de conexão, mensagens, reações e muito mais
