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

export interface IEvolutionInstance {
    // Nome da instância que você está criando
    instanceName: string,

    // Token opcional para autenticar a instância
    token?: string,

    // Number ID da instância que será utilizado para receber e enviar mensagens
    number: "",

    // Defina como false pois a integração não requer QR Code
    qrcode: false,

    // Use "EVOLUTION" para especificar que esta integração é com o canal universal Evolution
    integration: 'EVOLUTION'    
}
