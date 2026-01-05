# Sistema de Comandos / Command System

Esta pasta contém a estrutura para criação de comandos para bots WhatsApp usando Baileys.

This folder contains the structure for creating WhatsApp bot commands using Baileys.

## Estrutura / Structure

```
Commands/
├── command-template.js  # Modelo de comando / Command template
├── admin/              # Comandos de administrador / Admin commands
├── member/             # Comandos de membros / Member commands
└── owner/              # Comandos de dono / Owner commands
```

## Como usar / How to use

### 1. Configure o bot / Configure the bot

Edite o arquivo `config.js` na raiz do projeto para definir:
- `PREFIX`: Prefixo dos comandos (ex: "!", "/", ".")
- `BOT_NAME`: Nome do seu bot
- `OWNER_NUMBER`: Número do dono do bot

Edit the `config.js` file in the project root to set:
- `PREFIX`: Command prefix (e.g., "!", "/", ".")
- `BOT_NAME`: Your bot's name
- `OWNER_NUMBER`: Bot owner's number

### 2. Crie um comando / Create a command

1. Copie `command-template.js` / Copy `command-template.js`
2. Cole na pasta apropriada (admin/member/owner) / Paste in the appropriate folder
3. Renomeie o arquivo / Rename the file
4. Implemente a lógica / Implement the logic

### 3. Propriedades disponíveis / Available properties

As propriedades que você pode extrair no `handle` estão definidas em `src/@types/index.d.ts`:

The properties you can extract in `handle` are defined in `src/@types/index.d.ts`:

```javascript
handle: async ({
  sock,           // Socket do Baileys / Baileys socket
  message,        // Mensagem recebida / Received message
  remoteJid,      // JID do chat / Chat JID
  messageText,    // Texto da mensagem / Message text
  args,           // Argumentos do comando / Command arguments
  sender,         // JID do remetente / Sender's JID
  isGroup,        // É um grupo? / Is it a group?
  groupMetadata,  // Metadados do grupo / Group metadata
  isAdmin,        // Remetente é admin? / Is sender admin?
  isBotAdmin,     // Bot é admin? / Is bot admin?
  proto,          // Proto do WhatsApp / WhatsApp proto
  reply,          // Função para responder / Reply function
  sendMessage     // Função para enviar mensagem / Send message function
}) => {
  // Seu código aqui / Your code here
}
```

## Exemplo completo / Complete example

```javascript
import { PREFIX } from "../../config.js";

export default {
  name: "ping",
  description: "Verifica se o bot está online",
  commands: ["ping", "p"],
  usage: `${PREFIX}ping`,
  handle: async ({ reply }) => {
    await reply("🏓 Pong! Bot está online!");
  },
};
```

## Tipos de comandos / Command types

### Owner (Dono)
- Apenas o dono do bot pode executar
- Usado para comandos administrativos do bot
- Only the bot owner can execute
- Used for bot administrative commands

### Admin (Administrador)
- Apenas administradores do grupo podem executar
- Usado para moderação de grupos
- Only group administrators can execute
- Used for group moderation

### Member (Membro)
- Qualquer membro pode executar
- Comandos gerais e utilitários
- Any member can execute
- General and utility commands

## Integração com o bot / Bot integration

Para integrar estes comandos ao seu bot, você precisará criar um sistema de carregamento de comandos que:

To integrate these commands with your bot, you'll need to create a command loading system that:

1. Carrega todos os arquivos de comando das pastas / Loads all command files from folders
2. Registra os comandos / Registers the commands
3. Verifica permissões antes de executar / Checks permissions before executing
4. Chama o `handle` com as propriedades corretas / Calls `handle` with the correct properties

Exemplo básico / Basic example:

```javascript
// No seu arquivo principal do bot / In your main bot file
import { readdirSync } from 'fs';
import { PREFIX } from './config.js';

// Carregar comandos / Load commands
const commands = new Map();
const folders = ['owner', 'admin', 'member'];

for (const folder of folders) {
  const files = readdirSync(`./src/Commands/${folder}`).filter(f => f.endsWith('.js'));
  for (const file of files) {
    const command = await import(`./src/Commands/${folder}/${file}`);
    commands.set(command.default.name, { ...command.default, folder });
  }
}

// No handler de mensagens / In message handler
sock.ev.on('messages.upsert', async ({ messages }) => {
  const msg = messages[0];
  const messageText = msg.message?.conversation || msg.message?.extendedTextMessage?.text;
  
  if (!messageText?.startsWith(PREFIX)) return;
  
  const [commandName, ...args] = messageText.slice(PREFIX.length).trim().split(' ');
  const command = commands.get(commandName);
  
  if (command) {
    // Verificar permissões e executar / Check permissions and execute
    await command.handle({
      sock,
      message: msg,
      remoteJid: msg.key.remoteJid,
      messageText,
      args,
      sender: msg.key.participant || msg.key.remoteJid,
      // ... outras propriedades / other properties
      reply: (text) => sock.sendMessage(msg.key.remoteJid, { text })
    });
  }
});
```
