/**
 * Comando para gerenciar o sistema Anti-Porn (IA) com Logs de Depuração
 * @author Dev Gui
 */
import { downloadMediaMessage } from "baileys";
import { GEMINI_API_KEYS, PREFIX } from "../../config.js";
import axios from "axios";
import path from "path";
import fs from "fs";

/**
 * Função de análise chamada automaticamente pelo messageHandler.js
 * Utiliza o endpoint v1beta para máxima compatibilidade com o modelo Flash
 */
export async function analisarAntiPorn(socket, webMessage, remoteJid) {
  try {
    const jidLimpo = remoteJid.split("@")[0].split(":")[0] + "@g.us";
    const dbPath = path.join(process.cwd(), "database", "antiporn_groups.json");

    // Verifica se o grupo tem o anti-porn ativado no banco de dados
    if (!fs.existsSync(dbPath)) return;
    const settings = JSON.parse(fs.readFileSync(dbPath, "utf-8"));
    if (!settings[jidLimpo]) return;

    // Filtra apenas mensagens de imagem (incluindo visualização única)
    const isImage =
      webMessage.message?.imageMessage ||
      webMessage.message?.viewOnceMessageV2?.message?.imageMessage;
    if (!isImage) return;

    console.log(`\n[ANTI-PORN] 🔍 Imagem detectada no grupo: ${jidLimpo}`);

    const buffer = await downloadMediaMessage(webMessage, "buffer", {}, {
      reuploadRequest: socket.updateMediaMessage,
    });
    if (!buffer) {
      console.log("[ANTI-PORN] ❌ Erro: Não foi possível baixar a imagem.");
      return;
    }

    // Rotação de chaves configuradas em src/config.js
    const apiKey =
      GEMINI_API_KEYS[Math.floor(Math.random() * GEMINI_API_KEYS.length)];
    console.log(`[ANTI-PORN] 🔑 Chave em uso: ...${apiKey.slice(-6)}`);

    // Endpoint v1beta com modelo gemini-2.0-flash
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const payload = {
      contents: [
        {
          parts: [
            {
              text: "Responda apenas 'NSFW' se houver nudez, genitais ou sexo explícito. Caso contrário, responda 'SAFE'.",
            },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: buffer.toString("base64"),
              },
            },
          ],
        },
      ],
      safetySettings: [
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_NONE",
        },
      ],
      generationConfig: {
        temperature: 0,
        maxOutputTokens: 10,
      },
    };

    console.log("[ANTI-PORN] 🧠 Consultando Inori AI (Gemini 2.0 Flash)...");
    const startTime = Date.now();

    const response = await axios.post(url, payload, { timeout: 15000 });

    const endTime = Date.now();
    const result =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text
        ?.trim()
        .toUpperCase();

    console.log(`[ANTI-PORN] ⏱️ Resposta em: ${endTime - startTime}ms`);
    console.log(`[ANTI-PORN] 🤖 Veredito: ${result || "INCONCLUSIVO"}`);

    // Deleta se a IA confirmar NSFW ou se os filtros nativos do Google bloquearem a análise
    if (
      result?.includes("NSFW") ||
      response.data?.promptFeedback?.blockReason
    ) {
      console.log("[ANTI-PORN] 🗑️ Conteúdo proibido! Removendo...");
      await socket.sendMessage(remoteJid, { delete: webMessage.key });
      await socket.sendMessage(remoteJid, {
        text: "🚫 *Conteúdo impróprio detectado e removido pela Inori AI.*",
      });
    } else {
      console.log("[ANTI-PORN] ✅ Imagem segura.");
    }
  } catch (error) {
    const errorData = error.response?.data?.error;
    const errorMsg = errorData?.message || error.message;
    console.log(`[ANTI-PORN] ⚠️ Erro na API: ${errorMsg}`);

    // Se a imagem for tão explícita que gera erro de segurança na requisição
    if (errorMsg.includes("SAFETY") || errorMsg.includes("blocked")) {
      console.log(
        "[ANTI-PORN] 🛡️ Bloqueio por política de segurança. Removendo..."
      );
      await socket.sendMessage(remoteJid, { delete: webMessage.key });
    }
  }
}

/**
 * PADRÃO DE COMANDO DO PROJETO (src/commands/admin/anti-porn.js)
 */
export default {
  name: "antiporn",
  description: "Gerencia o sistema de detecção de nudez por IA.",
  commands: ["antiporn", "anp"],
  usage: `${PREFIX}antiporn on/off`,
  /**
   * @param {CommandHandleProps} props
   */
  handle: async ({ socket, remoteJid, args, isGroup }) => {
    // O middleware da pasta /admin já valida o isGroupAdmin
    if (!isGroup) return;

    const dbDir = path.join(process.cwd(), "database");
    const dbPath = path.join(dbDir, "antiporn_groups.json");

    if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

    let settings = {};
    if (fs.existsSync(dbPath)) {
      settings = JSON.parse(fs.readFileSync(dbPath, "utf-8"));
    }

    const choice = args[0]?.toLowerCase();
    const jidLimpo = remoteJid.split("@")[0].split(":")[0] + "@g.us";

    if (choice === "on") {
      settings[jidLimpo] = true;
      fs.writeFileSync(dbPath, JSON.stringify(settings, null, 2));
      console.log(`[ANTI-PORN] 🟢 Ativado manualmente no grupo: ${jidLimpo}`);
      return socket.sendMessage(remoteJid, {
        text: "✅ *Inori AI: Sistema Anti-Porn ativado!*",
      });
    }

    if (choice === "off") {
      delete settings[jidLimpo];
      fs.writeFileSync(dbPath, JSON.stringify(settings, null, 2));
      console.log(`[ANTI-PORN] 🔴 Desativado manualmente no grupo: ${jidLimpo}`);
      return socket.sendMessage(remoteJid, {
        text: "❌ *Sistema Anti-Porn desativado.*",
      });
    }

    return socket.sendMessage(remoteJid, {
      text: `Como usar:\n\n*${PREFIX}antiporn on* - Ativa a proteção\n*${PREFIX}antiporn off* - Desativa a proteção`,
    });
  },
};
