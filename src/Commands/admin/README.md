# Comandos de Administrador / Administrator Commands

Esta pasta contém comandos que só podem ser executados por administradores do grupo.

This folder contains commands that can only be executed by group administrators.

## Como criar um comando / How to create a command

1. Copie o arquivo `command-template.js` da pasta Commands
2. Cole nesta pasta e renomeie para o nome do seu comando
3. Edite o arquivo e implemente a lógica do comando
4. O comando só será executado se o usuário for administrador do grupo

## Exemplo de comando / Command example

```javascript
import { PREFIX } from "../../../config.js";

export default {
  name: "ban",
  description: "Remove um membro do grupo",
  commands: ["ban", "kick"],
  usage: `${PREFIX}ban @membro`,
  handle: async ({ sock, remoteJid, message, isGroup, isAdmin, groupMetadata, reply }) => {
    if (!isGroup) {
      return reply("Este comando só funciona em grupos!");
    }
    
    if (!isAdmin) {
      return reply("Você precisa ser administrador para usar este comando!");
    }
    
    // Lógica do comando aqui
    await reply("Comando executado com sucesso!");
  },
};
```
