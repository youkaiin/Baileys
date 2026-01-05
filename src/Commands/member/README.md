# Comandos de Membros / Member Commands

Esta pasta contém comandos que podem ser executados por qualquer membro do grupo.

This folder contains commands that can be executed by any group member.

## Como criar um comando / How to create a command

1. Copie o arquivo `command-template.js` da pasta Commands
2. Cole nesta pasta e renomeie para o nome do seu comando
3. Edite o arquivo e implemente a lógica do comando
4. O comando pode ser executado por qualquer membro

## Exemplo de comando / Command example

```javascript
import { PREFIX } from "../../../config.js";

export default {
  name: "info",
  description: "Mostra informações do grupo",
  commands: ["info", "groupinfo"],
  usage: `${PREFIX}info`,
  handle: async ({ remoteJid, isGroup, groupMetadata, reply }) => {
    if (!isGroup) {
      return reply("Este comando só funciona em grupos!");
    }
    
    const info = `Nome: ${groupMetadata.subject}\nMembros: ${groupMetadata.participants.length}`;
    await reply(info);
  },
};
```
