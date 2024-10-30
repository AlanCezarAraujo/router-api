import { IEvolutionPayload, MessageTypeEnum } from "../evolution-api/evolution.model";
import evolutionService from "../evolution-api/evolution.service";
import { log, warn } from "../services/logger.service";
import { FastifyReply, FastifyRequest } from "fastify";

// TODO: implementar
export function createWebhookRoute(request: FastifyRequest, response: FastifyReply) {
    const webhook = request.body;

    log('Webhook received:', JSON.stringify(webhook, null, 2));

    response.status(200).send({ message: 'Webhook received' });
}

// TODO: implementar
export function updateWebhookRoute(request: FastifyRequest, response: FastifyReply) {
    const webhook = request.body;

    log('Webhook received:', JSON.stringify(webhook, null, 2));

    response.status(200).send({ message: 'Webhook updated' });
}

export async function handleMessageRoute(request: FastifyRequest, reply: FastifyReply) {
    if ((request.body as any).event === 'webhook-test-event') {
      reply.status(200).send({ message: 'Webhook test event received' })
  
      return
    }
  
    const entryPayload: any = (request.body as any).entry;
  
    if (!entryPayload[0].changes[0].value.contacts) {
      warn('No contacts found', entryPayload[0].changes[0].value.contacts)
  
      reply.status(404).send({ message: 'No contacts found' })
  
      return
    }
  
    log('Request received:', JSON.stringify(entryPayload, null, 2))
  
    const evolutionPayload = {
      numberId: entryPayload[0].changes[0].value.metadata.display_phone_number,
      key: {
        remoteJid: entryPayload[0].changes[0].value.contacts[0].wa_id,
        fromMe: false,
        id: entryPayload.id,
      },
      pushName: entryPayload[0].changes[0].value.contacts[0].profile.name,
      message: {
          conversation: entryPayload[0].changes[0].value.messages[0].text.body,
      },
      messageType: MessageTypeEnum.Conversation,
    } as IEvolutionPayload
  
    await evolutionService.sendToEvolutionApi(evolutionPayload)
  
    reply.status(200).send({ message: 'Message received' })
  
    return
  }
