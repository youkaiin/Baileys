# Comandos de Dono / Owner Commands

Esta pasta contém comandos que só podem ser executados pelo dono do bot.

This folder contains commands that can only be executed by the bot owner.

## Como criar um comando / How to create a command

1. Copie o arquivo `command-template.js` da pasta Commands
2. Cole nesta pasta e renomeie para o nome do seu comando
3. Edite o arquivo e implemente a lógica do comando
4. O comando só será executado se o usuário for o dono do bot (definido em config.js)

## Exemplo de comando / Command example

```javascript
import { PREFIX, OWNER_NUMBER } from "../../../config.js";

export default {
  name: "broadcast",
  description: "Envia uma mensagem para todos os grupos",
  commands: ["broadcast", "bc"],
  usage: `${PREFIX}broadcast <mensagem>`,
  handle: async ({ sock, sender, args, reply }) => {
    if (sender !== OWNER_NUMBER) {
      return reply("Este comando só pode ser usado pelo dono do bot!");
    }
    
    const message = args.join(" ");
    if (!message) {
      return reply("Por favor, forneça uma mensagem para transmitir!");
    }
    
    // Lógica do comando aqui
    await reply("Mensagem transmitida com sucesso!");
  },
};
```
