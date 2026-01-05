import type { WASocket } from '../Types/Socket'
import type { WAMessage } from '../Types/Message'
import type { GroupMetadata } from '../Types/GroupMetadata'
import { proto } from '../../WAProto'

/**
 * Propriedades disponíveis no handle de um comando
 * Properties available in a command's handle
 */
export interface CommandHandleProps {
    /** A instância do socket do Baileys / The Baileys socket instance */
    sock: WASocket
    
    /** A mensagem recebida / The received message */
    message: WAMessage
    
    /** O JID (identificador) do remetente / The sender's JID (identifier) */
    remoteJid: string
    
    /** O texto da mensagem / The message text */
    messageText: string
    
    /** Os argumentos do comando (divididos por espaço) / Command arguments (split by space) */
    args: string[]
    
    /** O JID do remetente da mensagem / The message sender's JID */
    sender: string
    
    /** Se a mensagem foi enviada em um grupo / Whether the message was sent in a group */
    isGroup: boolean
    
    /** Metadados do grupo (se aplicável) / Group metadata (if applicable) */
    groupMetadata?: GroupMetadata
    
    /** Se o remetente é administrador do grupo / Whether the sender is a group admin */
    isAdmin?: boolean
    
    /** Se o bot é administrador do grupo / Whether the bot is a group admin */
    isBotAdmin?: boolean
    
    /** O objeto proto do WhatsApp / The WhatsApp proto object */
    proto: typeof proto
    
    /** Função para responder à mensagem / Function to reply to the message */
    reply: (text: string) => Promise<any>
    
    /** Função para enviar mensagem / Function to send a message */
    sendMessage: (jid: string, content: any) => Promise<any>
}
