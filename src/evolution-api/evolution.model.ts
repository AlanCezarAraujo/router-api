// "audioMessage"
// "viewOnceMessageV2"
// "stickerMessage"
// "ephemeralMessage"
// "liveLocationMessage"
// "interactiveMessage"
// "orderMessage"
// "pollCreationMessageV3"
// "encReactionMessage"
// "editedMessage"
// "viewOnceMessageV2Extension"
// "ptvMessage"
// "conversation"
// "extendedTextMessage"
// "documentMessage"
// "contactMessage"
// "groupInviteMessage"
// "videoMessage"
// "contactsArrayMessage"
// "buttonsMessage"
// "imageMessage"
// "protocolMessage"
// "documentWithCaptionMessage"
// "buttonsResponseMessage"
// "unknown"
// "reactionMessage"
// "listMessage"
// "locationMessage"
// "pinInChatMessage"
// "templateMessage"
// "productMessage"
export enum MessageTypeEnum {
    Conversation = 'conversation',
    ImageMessage = 'imageMessage',
    VideoMessage = 'videoMessage',
    AudioMessage = 'audioMessage',
    DocumentMessage = 'documentMessage',
}

export interface IEvolutionPayload {
    // ID do número cadastrado na criação da instância
    numberId: string,

    key: {
        // Número ou ID único do contato que enviou a mensagem.
        remoteJid: string,

        // Indica se a mensagem foi enviada pelo contato (false) ou pelo próprio sistema (true)
        fromMe: boolean,

        // ID único da mensagem
        id: string,
    },

    // Nome do contato que enviou a mensagem
    pushName: string,

    message: {
        // Conteúdo da mensagem recebida
        conversation: string,
    },

    // Tipo da mensagem
    messageType: MessageTypeEnum,
}

export interface IEvolutionMediaPayload {
    token: string,
    numberId: string,
    mediatype: 'image' | 'audio' | 'video',
    media: string,
    messageType: MessageTypeEnum,
}
